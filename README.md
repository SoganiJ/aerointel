# ✈️ AeroIntel — AI-Powered Airline Operations Intelligence Platform

A comprehensive, Power BI–style interactive dashboard for **airline operations intelligence and flight delay prediction**, built with pure HTML, CSS, and JavaScript.

> **Live Demo**: [Deployed on Vercel](https://aerointel.vercel.app)

## 🎯 Project Scope

This platform covers **two interconnected subjects**:

| # | Subject | Focus |
|---|---------|-------|
| 1 | **AI-Powered Airline Operations Intelligence and Flight Delay Prediction** | EDA, ML classification, regression, delay prediction, performance metrics |
| 2 | **AI-Powered Airline Operations Intelligence and Predictive Optimization Platform** | Route optimization, anomaly detection, seasonal analysis, AI recommendations |

## 📊 Features

### Landing Page
- Animated hero with gradient orbs
- Animated stat counters (7.2M+ flights, 87.4% accuracy)
- Feature highlights and project scope cards

### Analytics Dashboard
- **10+ interactive Chart.js visualizations** in a Power BI–style tiled grid
- Monthly delay trends (dual-axis line chart)
- Airline performance ranking (horizontal bar)
- Delay cause breakdown (doughnut chart)
- Day of week pattern (radar chart)
- Delay distribution histogram
- Hourly departure delay heatmap
- Airport performance (bubble chart)
- Cancellation analysis (stacked bar)
- Top 10 delayed routes table
- Interactive filters (Airline, Month, Airport)

### AI Delay Prediction
- Flight delay prediction engine (simulated ML)
- Risk assessment (Low / Medium / High / Critical)
- Gauge chart for delay probability
- Contributing factors analysis
- Similar historical flights comparison
- **What-If Scenario Analysis** with interactive sliders

### Deep Insights & Optimization
- Feature correlation heatmap (10×10 matrix)
- Feature importance ranking from ML model
- Seasonal decomposition (trend + seasonal components)
- Optimal departure window recommendations
- Route schedule optimization table
- Anomaly detection with timeline visualization
- 8 AI-generated optimization recommendations

## 🎨 Design

- **Colors**: Light beige background, deep navy, coral, teal, gold, lavender accents
- **Typography**: Outfit + Inter (Google Fonts)
- **Shape**: Curved elements throughout (border-radius: 16–32px)
- **Animations**: Scroll-triggered fade-ins, hover micro-interactions, counter animations
- **Responsive**: Mobile (480px) → Tablet (768px) → Laptop (1024px) → Desktop (1400px+)

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **JavaScript** — Vanilla ES6+
- **Chart.js 4** — Interactive charts
- **Google Fonts** — Outfit, Inter

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/SoganiJ/aerointel.git

# Open directly in browser
open index.html

# Or serve locally
npx serve .
```

No build step, no dependencies, no backend required.

## 📁 Project Structure

```
├── index.html          # Landing page
├── dashboard.html      # Analytics dashboard
├── predict.html        # AI prediction tool
├── insights.html       # Deep insights & optimization
├── css/
│   └── styles.css      # Design system (40KB)
├── js/
│   ├── app.js          # Shared logic
│   ├── dashboard.js    # Dashboard charts
│   ├── predict.js      # Prediction engine
│   └── insights.js     # Analytics logic
└── data/
    └── flights.js      # Sample dataset
```

## 📊 Dataset

Based on the [Kaggle Flight Delay Dataset 2024](https://www.kaggle.com/datasets) with 7M+ rows and 35 features including:
- Flight scheduling (departure/arrival times)
- Delay metrics (departure/arrival delays, delay causes)
- Operational data (carrier, route, distance, cancellations)

## 📝 License

Final Year Project © 2024-25
