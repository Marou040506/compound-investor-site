
window.projectionChart = null;

const allocation = { BTC: 0.40, ETH: 0.30, SPY: 0.30 };
const historicalReturns = [0.018, 0.035, -0.012, 0.027, 0.044, -0.009, 0.038, 0.006, 0.03, -0.005, 0.019, 0.021];

function getRandomROI(mean = 0.03, stdDev = 0.025) {
  const u1 = Math.random();
  const u2 = Math.random();
  const randStdNormal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return parseFloat((mean + stdDev * randStdNormal).toFixed(4));
}

function simulateWeeklyValues(capital, baseROI, useRandom, useDrawdowns, useHistorical) {
  const weeks = 12;
  const values = [];
  let currentValue = capital;

  for (let i = 0; i <= weeks; i++) {
    let roi;

    if (useHistorical) {
      roi = historicalReturns[i] ?? baseROI;
    } else if (useRandom) {
      roi = getRandomROI();
    } else {
      roi = baseROI;
    }

    if (useDrawdowns && (i === 3 || i === 7)) {
      roi = -0.05;
    }

    values.push({ week: i, roi, value: currentValue });
    currentValue = currentValue * (1 + roi);
  }

  return values;
}

function formatUSD(x) {
  return "$" + x.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", () => {
    const cap = parseFloat(document.getElementById("capital").value);
    const roiPct = parseFloat(document.getElementById("weeklyRoi").value);
    if (isNaN(cap) || isNaN(roiPct)) return;

    const baseROI = roiPct / 100;
    const useRandom = document.getElementById("useRandomROI").checked;
    const useDrawdowns = document.getElementById("useDrawdowns").checked;
    const useHistorical = document.getElementById("useHistorical").checked;

    const results = simulateWeeklyValues(cap, baseROI, useRandom, useDrawdowns, useHistorical);

    const planDiv = document.getElementById("planSummary");
    planDiv.innerHTML = `
      <p><strong>Starting Capital:</strong> ${formatUSD(cap)}</p>
      <p><strong>Simulation Mode:</strong> ${useHistorical ? 'Real Historical Returns' : useRandom ? 'Random ROI' : 'Fixed ROI'}</p>
      <p><strong>Drawdowns:</strong> ${useDrawdowns ? 'Enabled' : 'None'}</p>
    `;

    const tableBody = document.querySelector("#projectionTable tbody");
    tableBody.innerHTML = "";
    results.forEach(pt => {
      tableBody.innerHTML += `<tr><td class='border px-2 py-1'>${pt.week}</td><td class='border px-2 py-1'>${formatUSD(pt.value)}</td><td class='border px-2 py-1'>${(pt.roi * 100).toFixed(2)}%</td></tr>`;
    });

    const ctx = document.getElementById("projectionChart").getContext("2d");
    if (window.projectionChart instanceof Chart) {
      window.projectionChart.destroy();
    }

    window.projectionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: results.map(p => p.week),
        datasets: [{
          label: 'Projected Value',
          data: results.map(p => p.value),
          borderColor: '#f97316',
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: v => '$' + v.toLocaleString()
            }
          }
        }
      }
    });

    document.getElementById("output-panel").classList.remove("hidden");
  });
});
