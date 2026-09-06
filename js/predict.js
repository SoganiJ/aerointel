// ============================================================
// Predict Page — AI Delay Prediction Logic
// ============================================================

(function () {
  'use strict';

  const D = window.FlightData;
  if (!D) return;

  let gaugeChart = null;

  // ---- Populate Form Dropdowns ----
  function initForm() {
    const airlineSel = document.getElementById('pred-airline');
    const originSel = document.getElementById('pred-origin');
    const destSel = document.getElementById('pred-dest');
    const hourSel = document.getElementById('pred-hour');

    D.AIRLINES.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.code;
      opt.textContent = `${a.code} — ${a.name}`;
      airlineSel.appendChild(opt);
    });

    D.AIRPORTS.forEach(a => {
      const o1 = document.createElement('option');
      o1.value = a.code;
      o1.textContent = `${a.code} — ${a.city} (${a.name})`;
      originSel.appendChild(o1);

      const o2 = document.createElement('option');
      o2.value = a.code;
      o2.textContent = `${a.code} — ${a.city} (${a.name})`;
      destSel.appendChild(o2);
    });

    for (let h = 5; h <= 23; h++) {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = `${String(h).padStart(2, '0')}:00`;
      hourSel.appendChild(opt);
    }
  }

  // ---- Model Metrics Display ----
  function renderModelMetrics() {
    const container = document.getElementById('model-metrics');
    if (!container) return;
    const M = D.MODEL_METRICS;
    const metrics = [
      { label: 'Accuracy', value: (M.accuracy * 100).toFixed(1) + '%', color: '#98947C' },
      { label: 'Precision', value: (M.precision * 100).toFixed(1) + '%', color: '#B5A492' },
      { label: 'Recall', value: (M.recall * 100).toFixed(1) + '%', color: '#8B7A6A' },
      { label: 'F1 Score', value: (M.f1Score * 100).toFixed(1) + '%', color: '#C49A6C' },
      { label: 'AUC-ROC', value: M.auc.toFixed(3), color: '#98947C' },
      { label: 'RMSE', value: M.rmse.toFixed(2) + ' min', color: '#B5A492' },
      { label: 'R² Score', value: M.r2.toFixed(3), color: '#8B7A6A' },
      { label: 'MSE', value: M.mse.toFixed(1), color: '#C49A6C' },
    ];
    container.innerHTML = metrics.map(m => `
      <div class="model-metric">
        <div class="mm-value" style="color: ${m.color};">${m.value}</div>
        <div class="mm-label">${m.label}</div>
      </div>
    `).join('');
  }

  // ---- Prediction Engine (Simulated ML) ----
  function predictDelay(airline, month, origin, dest, dow, hour) {
    // Base delay from airline history
    const airlineData = D.DELAY_BY_AIRLINE.find(a => a.airline === airline);
    let baseDelay = airlineData ? airlineData.avgDelay : 8.7;

    // Monthly factor
    const monthData = D.MONTHLY_TRENDS[month - 1];
    const monthFactor = monthData ? monthData.avgDelay / 8.7 : 1;

    // Hourly factor
    const hourData = D.HOURLY_DELAYS.find(h => h.hour === hour);
    const hourFactor = hourData ? hourData.avgDelay / 8.7 : 1;

    // Day of week factor
    const dowData = D.DAY_OF_WEEK[dow - 1];
    const dowFactor = dowData ? dowData.avgDelay / 8.7 : 1;

    // Origin airport factor
    const originData = D.AIRPORT_PERFORMANCE.find(a => a.code === origin);
    const originFactor = originData ? originData.avgDelay / 8.7 : 1;

    // Destination airport factor
    const destData = D.AIRPORT_PERFORMANCE.find(a => a.code === dest);
    const destFactor = destData ? destData.avgDelay / 8.7 : 1;

    // Route factor
    const routeData = D.TOP_ROUTES.find(r => r.origin === origin && r.dest === dest);
    const routeFactor = routeData ? routeData.avgDelay / 8.7 : 1;

    // Combined prediction with weighted factors
    const predictedDelay = baseDelay * 0.30
      + baseDelay * monthFactor * 0.18
      + baseDelay * hourFactor * 0.22
      + baseDelay * dowFactor * 0.08
      + baseDelay * originFactor * 0.10
      + baseDelay * destFactor * 0.06
      + baseDelay * routeFactor * 0.06;

    // Add controlled randomness for realism
    const noise = (Math.random() - 0.5) * 3;
    const finalDelay = Math.max(0, predictedDelay + noise);

    // Probability of delay > 15 min
    let delayProb;
    if (finalDelay <= 3) delayProb = 12 + Math.random() * 8;
    else if (finalDelay <= 8) delayProb = 25 + Math.random() * 15;
    else if (finalDelay <= 14) delayProb = 42 + Math.random() * 15;
    else if (finalDelay <= 20) delayProb = 58 + Math.random() * 12;
    else delayProb = 72 + Math.random() * 15;
    delayProb = Math.min(delayProb, 96);

    // Risk level
    let risk;
    if (delayProb <= 25) risk = 'low';
    else if (delayProb <= 50) risk = 'medium';
    else if (delayProb <= 75) risk = 'high';
    else risk = 'critical';

    // Confidence based on data availability
    let confidence = 82 + Math.random() * 10;
    if (routeData) confidence += 4;
    if (originData) confidence += 2;
    confidence = Math.min(confidence, 97);

    // Contributing factors
    const factors = [];
    if (hourFactor > 1.3) factors.push({ name: 'Late Departure Time', impact: 'high', detail: `${String(hour).padStart(2, '0')}:00 is peak congestion` });
    else if (hourFactor < 0.8) factors.push({ name: 'Early Departure Time', impact: 'low', detail: `${String(hour).padStart(2, '0')}:00 has lower delays` });

    if (monthFactor > 1.3) factors.push({ name: 'High-Delay Season', impact: 'high', detail: `${monthData.month} averages ${monthData.avgDelay} min delay` });
    else if (monthFactor < 0.9) factors.push({ name: 'Low-Delay Season', impact: 'low', detail: `${monthData.month} averages ${monthData.avgDelay} min delay` });

    if (airlineData && airlineData.avgDelay > 12) factors.push({ name: 'Carrier History', impact: 'high', detail: `${getAirlineName(airline)} avg: ${airlineData.avgDelay} min` });
    else if (airlineData && airlineData.avgDelay < 7) factors.push({ name: 'Carrier Performance', impact: 'low', detail: `${getAirlineName(airline)} avg: ${airlineData.avgDelay} min` });

    if (originData && originData.avgDelay > 12) factors.push({ name: 'Origin Congestion', impact: 'high', detail: `${origin} avg delay: ${originData.avgDelay} min` });
    if (destData && destData.avgDelay > 12) factors.push({ name: 'Destination Congestion', impact: 'high', detail: `${dest} avg delay: ${destData.avgDelay} min` });

    if (dowFactor > 1.1) factors.push({ name: 'High-Traffic Day', impact: 'medium', detail: `${dowData.day} sees more delays` });
    else if (dowFactor < 0.85) factors.push({ name: 'Low-Traffic Day', impact: 'low', detail: `${dowData.day} is quieter` });

    if (routeData) factors.push({ name: 'Known Delay Route', impact: 'high', detail: `${origin}→${dest} avg: ${routeData.avgDelay} min` });

    // Ensure at least 3 factors
    if (factors.length < 3) {
      factors.push({ name: 'Historical Average', impact: 'medium', detail: `Overall avg: ${D.KPI.avgArrDelay} min` });
    }
    if (factors.length < 3) {
      factors.push({ name: 'NAS Conditions', impact: 'medium', detail: 'Standard airspace flow' });
    }

    return {
      delay: Math.round(finalDelay * 10) / 10,
      probability: Math.round(delayProb * 10) / 10,
      risk,
      confidence: Math.round(confidence * 10) / 10,
      factors,
    };
  }

  // ---- Render Prediction Result ----
  function showResult(prediction, airline, origin, dest) {
    const resultEl = document.getElementById('prediction-result');
    resultEl.classList.remove('hidden');
    resultEl.classList.add('visible');

    // Route header
    document.getElementById('result-route').textContent =
      `${getAirlineName(airline)} • ${origin} → ${dest}`;

    // Risk badge
    const riskLabels = { low: '<i class="ph-fill ph-check-circle"></i> Low Risk', medium: '<i class="ph-fill ph-warning"></i> Medium Risk', high: '<i class="ph-fill ph-warning-circle"></i> High Risk', critical: '<i class="ph-fill ph-warning-octagon"></i> Critical Risk' };
    document.getElementById('result-risk-badge').innerHTML =
      `<span class="risk-badge ${prediction.risk}">${riskLabels[prediction.risk]}</span>`;

    // Metrics
    document.getElementById('result-prob').textContent = prediction.probability + '%';
    document.getElementById('result-duration').textContent = prediction.delay + ' min';
    document.getElementById('result-confidence').textContent = prediction.confidence + '%';

    // Factors
    const factorsEl = document.getElementById('factors-list');
    factorsEl.innerHTML = prediction.factors.map(f => {
      const impactColors = { high: 'var(--accent-coral)', medium: 'var(--accent-gold)', low: 'var(--accent-teal)' };
      const impactBg = { high: 'rgba(224,122,95,0.08)', medium: 'rgba(233,196,106,0.1)', low: 'rgba(42,157,143,0.08)' };
      return `<div style="padding: var(--space-md); border-radius: var(--radius-md); background: ${impactBg[f.impact]}; border-left: 3px solid ${impactColors[f.impact]};">
        <div style="font-weight:600; font-size:0.88rem; margin-bottom:4px;">${f.name}</div>
        <div style="font-size:0.78rem; color:var(--text-secondary);">${f.detail}</div>
        <div style="font-size:0.7rem; font-weight:600; color:${impactColors[f.impact]}; margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;">${f.impact} impact</div>
      </div>`;
    }).join('');

    // Similar flights
    renderSimilarFlights(airline, origin, dest);

    // Gauge chart
    renderGauge(prediction.probability);

    // Scroll to result
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---- Gauge Chart ----
  function renderGauge(probability) {
    const canvas = document.getElementById('gauge-chart');
    if (!canvas) return;

    if (gaugeChart) {
      gaugeChart.destroy();
    }

    const color = probability <= 25 ? '#98947C' :
                  probability <= 50 ? '#B5A492' :
                  probability <= 75 ? '#C49A6C' : '#874635';

    gaugeChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [probability, 100 - probability],
          backgroundColor: [color, 'rgba(27,42,74,0.06)'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '78%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
      plugins: [{
        id: 'gaugeText',
        afterDraw(chart) {
          const { ctx, chartArea } = chart;
          const cx = (chartArea.left + chartArea.right) / 2;
          const cy = chartArea.bottom - 20;
          ctx.save();
          ctx.font = "800 28px 'Outfit', sans-serif";
          ctx.fillStyle = color;
          ctx.textAlign = 'center';
          ctx.fillText(probability + '%', cx, cy - 8);
          ctx.font = "500 12px 'Inter', sans-serif";
          ctx.fillStyle = '#5A6B8A';
          ctx.fillText('Delay Probability', cx, cy + 14);
          ctx.restore();
        }
      }]
    });
  }

  // ---- Similar Flights Table ----
  function renderSimilarFlights(airline, origin, dest) {
    const tbody = document.getElementById('similar-flights-tbody');
    if (!tbody) return;
    const similar = D.SAMPLE_FLIGHTS
      .filter(f => f.airline === airline || f.origin === origin || f.dest === dest)
      .filter(f => !f.cancelled)
      .slice(0, 8);

    tbody.innerHTML = similar.map(f => {
      const depClass = f.depDelay > 15 ? 'positive' : f.depDelay < 0 ? 'negative' : 'neutral';
      const arrClass = f.arrDelay > 15 ? 'positive' : f.arrDelay < 0 ? 'negative' : 'neutral';
      const status = f.arrDelay <= 0 ? '<span style="color:var(--status-success);font-weight:600;">On Time</span>' :
                     f.arrDelay <= 15 ? '<span style="color:var(--accent-gold);font-weight:600;">Minor</span>' :
                     '<span style="color:var(--status-danger);font-weight:600;">Delayed</span>';
      return `<tr>
        <td style="font-weight:600;">${f.airline}${f.flightNum}</td>
        <td>${f.origin} → ${f.dest}</td>
        <td>${f.month}/${f.dayOfMonth}/2024</td>
        <td class="delay-cell ${depClass}">${f.depDelay > 0 ? '+' : ''}${f.depDelay} min</td>
        <td class="delay-cell ${arrClass}">${f.arrDelay > 0 ? '+' : ''}${f.arrDelay} min</td>
        <td>${status}</td>
      </tr>`;
    }).join('');
  }

  // ---- What-If Sliders ----
  function initWhatIf() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const hourSlider = document.getElementById('wi-hour');
    const monthSlider = document.getElementById('wi-month');
    const dowSlider = document.getElementById('wi-dow');

    function updateWhatIf() {
      const h = parseInt(hourSlider.value);
      const m = parseInt(monthSlider.value);
      const d = parseInt(dowSlider.value);

      document.getElementById('wi-hour-val').textContent = `${String(h).padStart(2, '0')}:00`;
      document.getElementById('wi-month-val').textContent = monthNames[m - 1];
      document.getElementById('wi-dow-val').textContent = dayNames[d - 1];

      // Quick prediction with defaults
      const result = predictDelay('AA', m, 'ATL', 'LAX', d, h);
      document.getElementById('wi-result-delay').textContent = result.delay + ' min';
      document.getElementById('wi-result-prob').textContent = result.probability + '%';

      const riskLabels = { low: '<i class="ph-fill ph-check-circle"></i> Low', medium: '<i class="ph-fill ph-warning"></i> Medium', high: '<i class="ph-fill ph-warning-circle"></i> High', critical: '<i class="ph-fill ph-warning-octagon"></i> Critical' };
      document.getElementById('wi-result-risk').textContent = riskLabels[result.risk];
    }

    hourSlider.addEventListener('input', updateWhatIf);
    monthSlider.addEventListener('input', updateWhatIf);
    dowSlider.addEventListener('input', updateWhatIf);

    // Initial render
    updateWhatIf();
  }

  // ---- Form Submit Handler ----
  function initFormSubmit() {
    const form = document.getElementById('flight-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const airline = document.getElementById('pred-airline').value;
      const month = parseInt(document.getElementById('pred-month').value);
      const origin = document.getElementById('pred-origin').value;
      const dest = document.getElementById('pred-dest').value;
      const dow = parseInt(document.getElementById('pred-dow').value);
      const hour = parseInt(document.getElementById('pred-hour').value);

      if (!airline || !month || !origin || !dest || !dow || isNaN(hour)) {
        alert('Please fill in all fields.');
        return;
      }

      if (origin === dest) {
        alert('Origin and destination must be different.');
        return;
      }

      const prediction = predictDelay(airline, month, origin, dest, dow, hour);
      showResult(prediction, airline, origin, dest);
    });

    form.addEventListener('reset', function () {
      const resultEl = document.getElementById('prediction-result');
      resultEl.classList.remove('visible');
      resultEl.classList.add('hidden');
    });
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', function () {
    initForm();
    renderModelMetrics();
    initFormSubmit();
    initWhatIf();
  });
})();
