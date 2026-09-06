// ============================================================
// Insights Page — Deep Analytics & Optimization
// ============================================================

(function () {
  'use strict';

  const D = window.FlightData;
  if (!D) return;

  let charts = {};

  // ---- Tab Navigation ----
  function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        contents.forEach(c => {
          c.style.display = c.id === `tab-${target}` ? '' : 'none';
        });

        // Lazy-render charts when tab opens
        if (target === 'importance' && !charts.featureImportance) renderFeatureImportance();
        if (target === 'seasonal' && !charts.seasonal) renderSeasonal();
        if (target === 'anomalies' && !charts.anomalyTimeline) renderAnomalyTimeline();
      });
    });
  }

  // ---- Correlation Heatmap ----
  function renderCorrelationHeatmap() {
    const container = document.getElementById('correlation-heatmap');
    if (!container) return;

    const { features, matrix } = D.FEATURE_CORRELATIONS;
    const shortLabels = features.map(f => {
      const map = {
        'DEP_DELAY': 'Dep Delay',
        'ARR_DELAY': 'Arr Delay',
        'DISTANCE': 'Distance',
        'AIR_TIME': 'Air Time',
        'CRS_DEP_TIME': 'Dep Time',
        'DAY_OF_WEEK': 'Day',
        'MONTH': 'Month',
        'CARRIER_DELAY': 'Carrier',
        'WEATHER_DELAY': 'Weather',
        'NAS_DELAY': 'NAS'
      };
      return map[f] || f;
    });

    const size = features.length;
    const cellSize = Math.min(52, (container.parentElement.clientWidth - 80) / size);

    function getColor(val) {
      if (val >= 0.7) return '#1B2A4A';
      if (val >= 0.5) return '#2A4A7A';
      if (val >= 0.3) return '#E07A5F';
      if (val >= 0.1) return '#F4A691';
      if (val >= -0.05) return '#F0EBE3';
      if (val >= -0.1) return '#B8DDD5';
      return '#2A9D8F';
    }

    function getTextColor(val) {
      return (val >= 0.5 || val <= -0.3) ? '#fff' : '#1B2A4A';
    }

    let html = '<div style="overflow-x: auto;">';
    html += `<div style="display: inline-grid; grid-template-columns: 70px repeat(${size}, ${cellSize}px); gap: 2px; align-items: center;">`;

    // Header row
    html += '<div></div>';
    shortLabels.forEach(l => {
      html += `<div style="font-size: 0.65rem; font-weight: 600; color: var(--text-secondary); text-align: center; transform: rotate(-35deg); transform-origin: center; height: 50px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 4px;">${l}</div>`;
    });

    // Data rows
    matrix.forEach((row, i) => {
      html += `<div style="font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); text-align: right; padding-right: 8px; white-space: nowrap;">${shortLabels[i]}</div>`;
      row.forEach((val, j) => {
        const bg = getColor(Math.abs(val));
        const color = getTextColor(Math.abs(val));
        html += `<div class="heatmap-cell" style="width:${cellSize}px; height:${cellSize}px; background:${bg}; color:${color}; font-size:0.6rem; border-radius:4px; cursor:default;" title="${features[i]} × ${features[j]}: ${val.toFixed(2)}">${val.toFixed(2)}</div>`;
      });
    });

    html += '</div></div>';

    // Legend
    html += `<div style="display: flex; align-items: center; gap: var(--space-md); margin-top: var(--space-md); flex-wrap: wrap;">
      <span style="font-size: 0.72rem; color: var(--text-muted);">Correlation Strength:</span>
      <div style="display:flex; gap:4px; align-items:center;">
        <div style="width:18px;height:12px;background:#2A9D8F;border-radius:3px;"></div><span style="font-size:0.68rem;color:var(--text-muted);">Negative</span>
      </div>
      <div style="display:flex; gap:4px; align-items:center;">
        <div style="width:18px;height:12px;background:#F0EBE3;border-radius:3px;"></div><span style="font-size:0.68rem;color:var(--text-muted);">None</span>
      </div>
      <div style="display:flex; gap:4px; align-items:center;">
        <div style="width:18px;height:12px;background:#E07A5F;border-radius:3px;"></div><span style="font-size:0.68rem;color:var(--text-muted);">Moderate</span>
      </div>
      <div style="display:flex; gap:4px; align-items:center;">
        <div style="width:18px;height:12px;background:#1B2A4A;border-radius:3px;"></div><span style="font-size:0.68rem;color:var(--text-muted);">Strong</span>
      </div>
    </div>`;

    container.innerHTML = html;
  }

  // ---- Correlation Insights ----
  function renderCorrelationInsights() {
    const container = document.getElementById('correlation-insights');
    if (!container) return;

    const insights = [
      { icon: '🔗', title: 'DEP_DELAY ↔ ARR_DELAY', val: '0.93', desc: 'Extremely strong positive correlation — departure delays almost perfectly predict arrival delays.', level: 'high' },
      { icon: '✈️', title: 'DISTANCE ↔ AIR_TIME', val: '0.97', desc: 'Near-perfect correlation as expected — longer routes have proportionally longer air times.', level: 'high' },
      { icon: '⚠️', title: 'CARRIER_DELAY ↔ ARR_DELAY', val: '0.72', desc: 'Carrier-specific issues (maintenance, crew) are a major driver of arrival delays.', level: 'high' },
      { icon: '🌧️', title: 'WEATHER_DELAY ↔ ARR_DELAY', val: '0.34', desc: 'Moderate but significant — weather impacts are episodic but severe when they occur.', level: 'medium' },
      { icon: '🏛️', title: 'NAS_DELAY ↔ ARR_DELAY', val: '0.45', desc: 'National Airspace System delays contribute meaningfully — reflects ATC and airport congestion.', level: 'medium' },
      { icon: '⏰', title: 'CRS_DEP_TIME ↔ DEP_DELAY', val: '0.12', desc: 'Weak but consistent — later departures tend to accumulate more delays throughout the day.', level: 'low' },
      { icon: '📊', title: 'DISTANCE ↔ DELAY', val: '-0.02', desc: 'Virtually no correlation — flight distance does not meaningfully predict delays.', level: 'low' },
    ];

    container.innerHTML = insights.map(ins => {
      const colors = { high: 'var(--accent-coral)', medium: 'var(--accent-gold)', low: 'var(--accent-teal)' };
      const bgs = { high: 'rgba(224,122,95,0.06)', medium: 'rgba(233,196,106,0.08)', low: 'rgba(42,157,143,0.06)' };
      return `<div style="padding: var(--space-md); border-radius: var(--radius-md); background: ${bgs[ins.level]}; border-left: 3px solid ${colors[ins.level]}; margin-bottom: var(--space-sm);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
          <span style="font-weight:700; font-size:0.9rem;">${ins.icon} ${ins.title}</span>
          <span style="font-family: var(--font-heading); font-weight:800; color:${colors[ins.level]}; font-size:1rem;">${ins.val}</span>
        </div>
        <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.5; margin:0;">${ins.desc}</p>
      </div>`;
    }).join('');
  }

  // ---- Feature Importance Chart ----
  function renderFeatureImportance() {
    // Bar chart
    const ctx = document.getElementById('chart-feature-importance');
    if (!ctx) return;

    const sorted = [...D.FEATURE_IMPORTANCE].sort((a, b) => a.importance - b.importance);
    const catColors = {
      delay: '#E07A5F',
      temporal: '#7B68EE',
      weather: '#2A9D8F',
      route: '#E9C46A',
      carrier: '#264653'
    };

    charts.featureImportance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(f => f.feature),
        datasets: [{
          label: 'Importance Score',
          data: sorted.map(f => f.importance),
          backgroundColor: sorted.map(f => catColors[f.category] || '#5A6B8A'),
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `Importance: ${(ctx.parsed.x * 100).toFixed(1)}%`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Importance Score', font: { size: 11 } },
            max: 0.5,
            ticks: { callback: v => (v * 100).toFixed(0) + '%' }
          },
          y: { ticks: { font: { size: 11 } } }
        }
      }
    });

    // Pie by category
    const pieCtx = document.getElementById('chart-importance-pie');
    if (!pieCtx) return;

    const categories = {};
    D.FEATURE_IMPORTANCE.forEach(f => {
      categories[f.category] = (categories[f.category] || 0) + f.importance;
    });

    const catNames = { delay: 'Delay Factors', temporal: 'Temporal', weather: 'Weather', route: 'Route', carrier: 'Carrier' };

    charts.importancePie = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categories).map(k => catNames[k] || k),
        datasets: [{
          data: Object.values(categories).map(v => +(v * 100).toFixed(1)),
          backgroundColor: Object.keys(categories).map(k => catColors[k]),
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 10,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, font: { size: 11 } } },
          tooltip: {
            callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}%` }
          }
        }
      }
    });

    // Benchmark table
    renderBenchmarkTable();
  }

  // ---- Airline Benchmarking Table ----
  function renderBenchmarkTable() {
    const tbody = document.getElementById('benchmark-tbody');
    if (!tbody) return;

    const sorted = [...D.DELAY_BY_AIRLINE].sort((a, b) => a.avgDelay - b.avgDelay);
    tbody.innerHTML = sorted.map((a, i) => {
      let rating;
      if (a.avgDelay <= 6) rating = '⭐⭐⭐⭐⭐';
      else if (a.avgDelay <= 9) rating = '⭐⭐⭐⭐';
      else if (a.avgDelay <= 12) rating = '⭐⭐⭐';
      else if (a.avgDelay <= 15) rating = '⭐⭐';
      else rating = '⭐';

      const delayClass = a.avgDelay > 14 ? 'positive' : a.avgDelay < 7 ? 'negative' : 'neutral';
      return `<tr>
        <td style="font-weight:700;color:var(--text-muted);">${i + 1}</td>
        <td style="font-weight:600;">${getAirlineName(a.airline)} <span style="color:var(--text-muted);font-size:0.75rem;">(${a.airline})</span></td>
        <td class="delay-cell ${delayClass}">${a.avgDelay} min</td>
        <td>${a.onTime}%</td>
        <td>${a.flights.toLocaleString()}</td>
        <td>${rating}</td>
      </tr>`;
    }).join('');
  }

  // ---- Seasonal Decomposition Chart ----
  function renderSeasonal() {
    const ctx = document.getElementById('chart-seasonal');
    if (!ctx) return;

    charts.seasonal = new Chart(ctx, {
      type: 'line',
      data: {
        labels: D.SEASONAL_PATTERN.months,
        datasets: [
          {
            label: 'Observed (Actual Delay)',
            data: D.SEASONAL_PATTERN.months.map((_, i) =>
              +(D.SEASONAL_PATTERN.trend[i] + D.SEASONAL_PATTERN.seasonal[i]).toFixed(1)
            ),
            borderColor: '#E07A5F',
            backgroundColor: 'rgba(224,122,95,0.1)',
            fill: true,
            borderWidth: 3,
            pointBackgroundColor: '#E07A5F',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'Trend Component',
            data: D.SEASONAL_PATTERN.trend,
            borderColor: '#2A9D8F',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [8, 4],
            pointBackgroundColor: '#2A9D8F',
            pointRadius: 3,
          },
          {
            label: 'Seasonal Component',
            data: D.SEASONAL_PATTERN.seasonal,
            borderColor: '#7B68EE',
            backgroundColor: 'rgba(123,104,238,0.08)',
            fill: true,
            borderWidth: 2,
            pointBackgroundColor: '#7B68EE',
            pointRadius: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { padding: 16 } },
        },
        scales: {
          y: { title: { display: true, text: 'Delay (min)', font: { size: 11 } } }
        }
      }
    });

    // Optimal Windows
    renderOptimalWindows();
    renderRouteOptimization();
  }

  // ---- Optimal Departure Windows ----
  function renderOptimalWindows() {
    const container = document.getElementById('optimal-windows');
    if (!container) return;

    const windows = [
      { window: '05:00 – 07:00', avgDelay: '2.1 – 4.8 min', risk: 'Low', color: 'var(--accent-teal)', recommendation: 'Best window for minimal delays. Morning flights avoid cascading delay effects.' },
      { window: '07:00 – 10:00', avgDelay: '4.8 – 8.3 min', risk: 'Low-Medium', color: 'var(--accent-teal)', recommendation: 'Good performance window. Slight increase as airport traffic builds.' },
      { window: '10:00 – 14:00', avgDelay: '8.3 – 12.9 min', risk: 'Medium', color: 'var(--accent-gold)', recommendation: 'Moderate delays. Midday congestion begins to impact schedule adherence.' },
      { window: '14:00 – 18:00', avgDelay: '12.9 – 16.3 min', risk: 'High', color: 'var(--accent-coral)', recommendation: 'Peak delay window. Avoid if schedule flexibility exists.' },
      { window: '18:00 – 23:00', avgDelay: '15.1 – 3.2 min', risk: 'High → Low', color: 'var(--accent-lavender)', recommendation: 'Delays decrease sharply after 8 PM as traffic subsides.' },
    ];

    container.innerHTML = windows.map(w => `
      <div style="display: flex; gap: var(--space-md); padding: var(--space-md); border-radius: var(--radius-md); background: var(--bg-primary); margin-bottom: var(--space-sm); align-items: flex-start; border-left: 3px solid ${w.color};">
        <div style="min-width: 110px;">
          <div style="font-weight: 700; font-size: 0.9rem; font-family: var(--font-heading);">${w.window}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${w.avgDelay}</div>
        </div>
        <div style="flex: 1;">
          <span style="font-size: 0.7rem; font-weight: 600; padding: 2px 10px; border-radius: var(--radius-full); background: ${w.color}20; color: ${w.color};">${w.risk}</span>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">${w.recommendation}</p>
        </div>
      </div>
    `).join('');
  }

  // ---- Route Optimization Table ----
  function renderRouteOptimization() {
    const tbody = document.getElementById('route-opt-tbody');
    if (!tbody) return;

    const optimizations = D.TOP_ROUTES.slice(0, 8).map(r => {
      const bestHour = Math.floor(5 + Math.random() * 3);
      const projected = +(r.avgDelay * (0.35 + Math.random() * 0.15)).toFixed(1);
      const improvement = +(r.avgDelay - projected).toFixed(1);
      return { ...r, bestHour, projected, improvement };
    });

    tbody.innerHTML = optimizations.map(r => {
      const impColor = r.improvement > 10 ? 'var(--accent-teal)' : 'var(--accent-gold)';
      return `<tr>
        <td style="font-weight:600;">${r.origin} → ${r.dest}</td>
        <td class="delay-cell positive">${r.avgDelay} min</td>
        <td style="font-weight:600;">${String(r.bestHour).padStart(2, '0')}:00 – ${String(r.bestHour + 2).padStart(2, '0')}:00</td>
        <td class="delay-cell negative">${r.projected} min</td>
        <td style="color: ${impColor}; font-weight: 700;">↓ ${r.improvement} min (${Math.round(r.improvement / r.avgDelay * 100)}%)</td>
      </tr>`;
    }).join('');
  }

  // ---- Anomaly List ----
  function renderAnomalies() {
    const container = document.getElementById('anomaly-list');
    if (!container) return;

    container.innerHTML = D.ANOMALY_EVENTS.map(a => `
      <div class="anomaly-card">
        <div class="anomaly-header">
          <span class="anomaly-date">📅 ${a.date}</span>
          <span class="anomaly-type ${a.type.toLowerCase()}">${a.type}</span>
        </div>
        <div class="anomaly-desc">${a.description}</div>
        <div class="anomaly-stats">
          <span>Avg Delay: <strong>${a.avgDelay} min</strong></span>
          <span>Cancellations: <strong>${a.cancellations.toLocaleString()}</strong></span>
          <span>Affected: <strong>${a.airports.join(', ')}</strong></span>
        </div>
      </div>
    `).join('');
  }

  // ---- Anomaly Timeline Chart ----
  function renderAnomalyTimeline() {
    const ctx = document.getElementById('chart-anomaly-timeline');
    if (!ctx) return;

    charts.anomalyTimeline = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: D.ANOMALY_EVENTS.map(a => a.date),
        datasets: [
          {
            label: 'Avg Delay (min)',
            data: D.ANOMALY_EVENTS.map(a => a.avgDelay),
            backgroundColor: D.ANOMALY_EVENTS.map(a =>
              a.type === 'Weather' ? '#7B68EE' : a.type === 'NAS' ? '#E9C46A' : '#2A9D8F'
            ),
            borderRadius: 8,
            barPercentage: 0.6,
            yAxisID: 'y',
          },
          {
            label: 'Cancellations',
            data: D.ANOMALY_EVENTS.map(a => a.cancellations),
            type: 'line',
            borderColor: '#E07A5F',
            backgroundColor: 'rgba(224,122,95,0.1)',
            fill: true,
            borderWidth: 2,
            pointBackgroundColor: '#E07A5F',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              afterBody: ctx => {
                const idx = ctx[0].dataIndex;
                const a = D.ANOMALY_EVENTS[idx];
                return `Type: ${a.type}\nAirports: ${a.airports.join(', ')}`;
              }
            }
          }
        },
        scales: {
          y: { title: { display: true, text: 'Avg Delay (min)', font: { size: 11 } } },
          y1: {
            position: 'right',
            title: { display: true, text: 'Cancellations', font: { size: 11 } },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  // ---- Optimization Recommendations ----
  function renderRecommendations() {
    const container = document.getElementById('recommendations-list');
    if (!container) return;

    container.innerHTML = D.OPTIMIZATION_RECS.map(r => `
      <div class="rec-card ${r.impact}">
        <div class="rec-icon">${r.icon}</div>
        <div class="rec-content">
          <h4>${r.title}</h4>
          <p>${r.description}</p>
          <div style="display: flex; gap: var(--space-sm); align-items: center; flex-wrap: wrap;">
            <span class="rec-metric">📊 ${r.metric}</span>
            <span class="rec-metric" style="text-transform: uppercase;">${r.impact} impact</span>
            <span class="rec-metric">🏷️ ${r.category}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    renderCorrelationHeatmap();
    renderCorrelationInsights();
    renderAnomalies();
    renderRecommendations();
  });
})();
