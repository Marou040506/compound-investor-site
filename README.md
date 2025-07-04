
# Smart Compound Investing Tracker

This is a simple web-based ROI simulator that lets users enter their capital and target weekly ROI, then view:
- A 12-week compounding projection
- A backtest result over the last 3 months (22.8% simulated gain)
- Suggested asset allocation: BTC 40%, ETH 30%, SPY 30%

## 🔧 How It Works

1. Enter your capital and weekly ROI target.
2. Click "Generate Plan".
3. The site shows:
   - A weekly growth projection
   - A historical 3-month simulation
   - A chart of projected capital over time

## 🚀 How to Use (for GitHub Pages)

1. Upload the following files to your GitHub repository **root**:
   - `index.html`
   - `style.css`
   - `script.js`
2. Go to your repository Settings → Pages
3. Set the source to **main branch / root folder**
4. GitHub will deploy your site to:
   ```
   https://yourusername.github.io/your-repo-name/
   ```

## 📁 File Structure

```
📦 root/
├── index.html       # Main app interface
├── style.css        # Styling and layout
└── script.js        # Calculator logic and chart
```

## 📈 Demo Use Case

If you enter $100,000 and 5% weekly ROI:
- The system will project ~12x growth over 52 weeks
- It will show that in the last 3 months, the same portfolio grew ~22.8%

## 🧠 Tech Stack

- HTML/CSS/JS
- Chart.js for visualizations
- No backend needed (runs entirely in-browser)

## 💬 Future Ideas

- Add user login + save feature
- Dynamic portfolio rebalancing
- Premium (Pro) version with advanced projections

---

© 2025 Smart Compound
