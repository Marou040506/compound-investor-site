
window.projectionChart = null;

const allocation = { BTC: 0.40, ETH: 0.30, SPY: 0.30 };
const backtestROI = 0.228;
const backtestStartDate = "2025‑05‑05";
const backtestEndDate   = "2025‑07‑03";

function compoundProjection(capital, weeklyRate, weeks=12){
  const points = [];
  for(let i=0;i<=weeks;i++){
    let value = capital * Math.pow(1+weeklyRate, i);
    points.push({week:i, value});
  }
  return points;
}

function formatUSD(x){ return "$" + x.toLocaleString(undefined,{maximumFractionDigits:0}); }

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('border-b-2', 'border-orange-500'));
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('border-b-2', 'border-orange-500');
  document.getElementById("tab-" + tabId).classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      showTab(btn.dataset.tab);
    });
  });

  document.getElementById("generateBtn").addEventListener("click", () => {
    const cap = parseFloat(document.getElementById("capital").value);
    const roiPct = parseFloat(document.getElementById("weeklyRoi").value);
    if(isNaN(cap) || isNaN(roiPct)) return;

    const weeklyRate = roiPct/100;
    const proj = compoundProjection(cap, weeklyRate);

    const planDiv = document.getElementById("planSummary");
    planDiv.innerHTML = `
      <p><strong>Capital:</strong> ${formatUSD(cap)}</p>
      <p><strong>Target Weekly ROI:</strong> ${roiPct}%</p>
      <p><strong>Suggested Allocation:</strong> BTC ${allocation.BTC*100}%, ETH ${allocation.ETH*100}%, SPY ${allocation.SPY*100}%</p>
    `;

    const table = document.getElementById("projectionTable");
    table.innerHTML = "<thead><tr><th class='border px-2 py-1'>Week</th><th class='border px-2 py-1'>Value</th></tr></thead><tbody>";
    proj.forEach(pt => {
      table.innerHTML += `<tr><td class='border px-2 py-1'>${pt.week}</td><td class='border px-2 py-1'>${formatUSD(pt.value)}</td></tr>`;
    });
    table.innerHTML += "</tbody>";

    const ctx = document.getElementById("projectionChart").getContext("2d");
    if (window.projectionChart instanceof Chart) {
      window.projectionChart.destroy();
    }
    window.projectionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: proj.map(p => p.week),
        datasets: [{
          label: 'Projected Equity',
          data: proj.map(p => p.value),
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

    const backDiv = document.getElementById("backtestSummary");
    const btGain = cap * backtestROI;
    const btValue = cap + btGain;
    backDiv.innerHTML = `
      <p><strong>Period:</strong> ${backtestStartDate} → ${backtestEndDate}</p>
      <p><strong>Strategy Return:</strong> ${(backtestROI*100).toFixed(1)}%</p>
      <p><strong>Your capital would be:</strong> ${formatUSD(btValue)}</p>
    `;

    document.getElementById("tabs").classList.remove("hidden");
    showTab("summary");
  });
});
