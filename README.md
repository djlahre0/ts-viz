# 📈 Time Series ML Models — Interactive Visual Simulator

An interactive web app that visually simulates **43 time series forecasting models** — from 1920s classical statistics to 2025 foundation models. Built for beginners who want to understand how each model works through hands-on visualization.

> No ML background needed. Start from **"Learn the Basics"** to understand what ML and time series even are.

## ✨ Highlights

- **43 models** across 4 eras (Classical → Early ML → Deep Learning → Modern)
- **Interactive simulations** — adjust parameters and see results in real-time
- **"Learn the Basics" page** — explains ML, time series, and key concepts from scratch
- **Guided learning path** — step-by-step progression from simple to complex
- **Difficulty badges** — 🟢 Beginner / 🟡 Intermediate / 🔴 Advanced on every model
- **Real-world usage** — see where each model is actually used
- **Original paper links** — direct access to the research behind each model
- **Zero backend** — everything runs in your browser

## 🚀 Quick Start

```bash
git clone <your-repo-url>
cd ts-viz
npm install
npm run dev
```

Open **http://localhost:5173** and start exploring.

## 🔧 Developer Tools

To maintain the system with 40+ models, we use utility scripts for bulk data processing:

### Metadata Updater
If you need to bulk-update `difficulty` or `realWorld` usage across all models in `src/data/models.js`:
```bash
./scripts/add_fields.sh
```
*This script uses pattern matching on the `keyIdea` field to ensure data integrity across the 1,000+ line registry.*

## 🚢 Deployment (GitHub Pages)

This project is configured to deploy automatically via GitHub Actions.

1.  **Repo Name**: Ensure your repository is named `ts-viz`. If using a different name, update the `base` path in `vite.config.js`.
2.  **Settings**: Go to **Settings > Pages** in your GitHub repo.
3.  **Source**: Select **GitHub Actions** under Build and deployment.
4.  **Push**: Push these changes to the `main` branch, and the site will be live!

## 🛠️ Tech Stack

React 19 · Vite · Recharts · Framer Motion · Lucide Icons · Vanilla CSS

## 📄 License

MIT
