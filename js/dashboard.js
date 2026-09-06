// ============================================================
// Dashboard — Chart Rendering & Interactivity
// ============================================================

(function () {
  'use strict';

  const D = window.FlightData;
  if (!D) return;

  let charts = {};

  // ---- Populate Filters ----
  function initFilters() {
    const airlineSel = document.getElementById('filter-airline');
    const airportSel = document.getElementById('filter-airport');

    D.AIRLINES.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.code;
      opt.textContent = `${a.code} — ${a.name}`;
      airlineSel.appendChild(opt);
    });

    D.AIRPORTS.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.code;
      opt.textContent = `${a.code} — ${a.city}`;
      airportSel.appendChild(opt);
    });

    document.getElementById('reset-filters').addEventListener('click', () => {
      airlineSel.value = 'all';
      document.getElementById('filter-month').value = 'all';
      airportSel.value = 'all';
    });
  }

  // ---- KPI Cards ----
  function renderKPIs() {
    document.getElementById('kpi-flights').textContent = formatNum(D.KPI.totalFlights);
    document.getElementById('kpi-delay').textContent = D.KPI.avgArrDelay + ' min';
    document.getElementById('kpi-ontime').textContent = D.KPI.onTimePercent + '%';
    document.getElementById('kpi-cancel').textContent = D.KPI.cancelledPercent + '%';
  }

  // ---- Chart Colors ----
  const C = {
    coral: '#C49A6C',
    coralLight: 'rgba(196,154,108,0.25)',
    teal: '#98947C',
    tealLight: 'rgba(152,148,124,0.25)',
    gold: '#B5A492',
    goldLight: 'rgba(181,164,146,0.25)',
    lavender: '#8B7A6A',
    lavenderLight: 'rgba(139,122,106,0.25)',
    navy: '#3E362E',
    dark: '#2B251F',
  };

  // ---- Monthly Trend Chart ----
  function renderMonthlyTrend() {
    const ctx = document.getElementById('chart-monthly-trend');
    if (!ctx) return;
    charts.monthlyTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: D.MONTHLY_TRENDS.map(m => m.month),
        datasets: [
          {
            label: 'Avg. Delay (min)',
            data: D.MONTHLY_TRENDS.map(m => m.avgDelay),
            borderColor: C.coral,
            backgroundColor: C.coralLight,
            fill: true,
            pointBackgroundColor: C.coral,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderWidth: 3,
          },
          {
            label: 'On-Time %',
            data: D.MONTHLY_TRENDS.map(m => m.onTime),
            borderColor: C.teal,
            backgroundColor: 'transparent',
            pointBackgroundColor: C.teal,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderWidth: 2,
            borderDash: [6, 4],
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              afterBody: function (context) {
                const idx = context[0].dataIndex;
                return `Flights: ${D.MONTHLY_TRENDS[idx].flights.toLocaleString()}\nCancelled: ${D.MONTHLY_TRENDS[idx].cancelled}%`;
              },
            },
          },
        },
        scales: {
          y: {
            position: 'left',
            title: { display: true, text: 'Avg Delay (min)', font: { size: 11 } },
            min: 0,
          },
          y1: {
            position: 'right',
            title: { display: true, text: 'On-Time %', font: { size: 11 } },
            min: 65,
            max: 95,
            grid: { drawOnChartArea: false },
          },
        },
      },
    });
  }

  // ---- Delay Causes Doughnut ----
  function renderDelayCauses() {
    const ctx = document.getElementById('chart-delay-causes');
    if (!ctx) return;
    charts.delayCauses = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: D.DELAY_CAUSES.labels,
        datasets: [
          {
            data: D.DELAY_CAUSES.values,
            backgroundColor: D.DELAY_CAUSES.colors,
            borderWidth: 3,
            borderColor: '#FFFFFF',
            hoverOffset: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
      },
    });
  }

  // ---- Airline Delay Bar Chart ----
  function renderAirlineDelay() {
    const ctx = document.getElementById('chart-airline-delay');
    if (!ctx) return;
    const sorted = [...D.DELAY_BY_AIRLINE].sort((a, b) => b.avgDelay - a.avgDelay);
    const colors = sorted.map(d => d.avgDelay > 12 ? C.coral : d.avgDelay > 8 ? C.gold : C.teal);
    charts.airlineDelay = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(d => getAirlineName(d.airline)),
        datasets: [
          {
            label: 'Avg. Arrival Delay (min)',
            data: sorted.map(d => d.avgDelay),
            backgroundColor: colors,
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: ctx => {
                const d = sorted[ctx.dataIndex];
                return `On-Time: ${d.onTime}%\nFlights: ${d.flights.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Avg Delay (min)', font: { size: 11 } } },
          y: { ticks: { font: { size: 11 } } },
        },
      },
    });
  }

  // ---- Day of Week Radar ----
  function renderDOWRadar() {
    const ctx = document.getElementById('chart-dow-radar');
    if (!ctx) return;
    charts.dowRadar = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: D.DAY_OF_WEEK.map(d => d.day),
        datasets: [
          {
            label: 'Avg Delay (min)',
            data: D.DAY_OF_WEEK.map(d => d.avgDelay),
            backgroundColor: C.coralLight,
            borderColor: C.coral,
            borderWidth: 2,
            pointBackgroundColor: C.coral,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'Flights (×100K)',
            data: D.DAY_OF_WEEK.map(d => +(d.flights / 100000).toFixed(1)),
            backgroundColor: C.tealLight,
            borderColor: C.teal,
            borderWidth: 2,
            pointBackgroundColor: C.teal,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            ticks: { font: { size: 10 }, backdropColor: 'transparent' },
            grid: { color: 'rgba(27,42,74,0.06)' },
            pointLabels: { font: { size: 11, family: "'Inter', sans-serif" } },
          },
        },
        plugins: { legend: { position: 'bottom' } },
      },
    });
  }

  // ---- Delay Distribution ----
  function renderDelayDist() {
    const ctx = document.getElementById('chart-delay-dist');
    if (!ctx) return;
    const colors = D.DELAY_DISTRIBUTION.map(d => {
      if (d.bin.includes('<') || d.bin.includes('-15') || d.bin.includes('-5')) return C.teal;
      if (d.bin === '0 to 5') return C.teal;
      if (d.bin === '5 to 15') return C.gold;
      if (d.bin === '15 to 30') return C.gold;
      return C.coral;
    });
    charts.delayDist = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: D.DELAY_DISTRIBUTION.map(d => d.label),
        datasets: [
          {
            label: 'Flights',
            data: D.DELAY_DISTRIBUTION.map(d => d.count),
            backgroundColor: colors,
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.85,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: ctx => {
                const d = D.DELAY_DISTRIBUTION[ctx.dataIndex];
                return `${d.pct}% of all flights`;
              },
            },
          },
        },
        scales: {
          x: { ticks: { font: { size: 9 }, maxRotation: 45 } },
          y: {
            title: { display: true, text: 'Flight Count', font: { size: 11 } },
            ticks: {
              callback: v => formatNum(v),
            },
          },
        },
      },
    });
  }

  // ---- Hourly Delay Chart ----
  function renderHourly() {
    const ctx = document.getElementById('chart-hourly');
    if (!ctx) return;
    const colors = D.HOURLY_DELAYS.map(h => {
      if (h.avgDelay <= 5) return C.teal;
      if (h.avgDelay <= 10) return C.tealLight.replace('0.15', '0.6');
      if (h.avgDelay <= 14) return C.gold;
      return C.coral;
    });
    charts.hourly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: D.HOURLY_DELAYS.map(h => `${String(h.hour).padStart(2, '0')}:00`),
        datasets: [
          {
            label: 'Avg Delay (min)',
            data: D.HOURLY_DELAYS.map(h => h.avgDelay),
            backgroundColor: colors,
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: ctx => {
                const h = D.HOURLY_DELAYS[ctx.dataIndex];
                return `Flights: ${h.flights.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: { ticks: { font: { size: 10 } } },
          y: { title: { display: true, text: 'Avg Delay (min)', font: { size: 11 } }, min: 0 },
        },
      },
    });
  }

  // ---- Airport Bubble Chart ----
  function renderAirportBubble() {
    const ctx = document.getElementById('chart-airport-bubble');
    if (!ctx) return;
    charts.airportBubble = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [
          {
            label: 'Airports',
            data: D.AIRPORT_PERFORMANCE.map(a => ({
              x: a.flights / 1000,
              y: a.avgDelay,
              r: Math.max(a.cancRate * 5, 4),
              label: a.code,
            })),
            backgroundColor: D.AIRPORT_PERFORMANCE.map(a =>
              a.avgDelay > 12 ? 'rgba(224,122,95,0.5)' :
                a.avgDelay > 8 ? 'rgba(233,196,106,0.5)' :
                  'rgba(42,157,143,0.5)'
            ),
            borderColor: D.AIRPORT_PERFORMANCE.map(a =>
              a.avgDelay > 12 ? C.coral : a.avgDelay > 8 ? C.gold : C.teal
            ),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: ctx => {
                const d = D.AIRPORT_PERFORMANCE[ctx[0].dataIndex];
                return `${d.code} — ${getAirportInfo(d.code).city}`;
              },
              label: ctx => {
                const d = D.AIRPORT_PERFORMANCE[ctx.dataIndex];
                return [
                  `Avg Delay: ${d.avgDelay} min`,
                  `On-Time: ${d.onTime}%`,
                  `Flights: ${d.flights.toLocaleString()}`,
                  `Cancellation: ${d.cancRate}%`,
                ];
              },
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Flights (thousands)', font: { size: 11 } } },
          y: { title: { display: true, text: 'Avg Delay (min)', font: { size: 11 } }, min: 0 },
        },
      },
    });
  }

  // ---- Cancellation Stacked Bar ----
  function renderCancellation() {
    const ctx = document.getElementById('chart-cancellation');
    if (!ctx) return;
    charts.cancellation = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: D.CANCELLATION_DATA.map(c => c.month),
        datasets: [
          {
            label: 'Weather',
            data: D.CANCELLATION_DATA.map(c => c.weather),
            backgroundColor: C.lavender,
            borderRadius: { topLeft: 0, topRight: 0 },
          },
          {
            label: 'Carrier',
            data: D.CANCELLATION_DATA.map(c => c.carrier),
            backgroundColor: C.coral,
          },
          {
            label: 'NAS',
            data: D.CANCELLATION_DATA.map(c => c.nas),
            backgroundColor: C.gold,
          },
          {
            label: 'Security',
            data: D.CANCELLATION_DATA.map(c => c.security),
            backgroundColor: C.dark,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 } } },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            title: { display: true, text: 'Cancellation Rate %', font: { size: 11 } },
          },
        },
      },
    });
  }

  // ---- Routes Table ----
  function renderRoutesTable() {
    const tbody = document.getElementById('routes-tbody');
    if (!tbody) return;
    tbody.innerHTML = D.TOP_ROUTES.map((r, i) => {
      const delayClass = r.avgDelay > 16 ? 'positive' : r.avgDelay > 12 ? 'positive' : 'neutral';
      return `<tr>
        <td style="font-weight:700;color:var(--text-muted);">${i + 1}</td>
        <td style="font-weight:700;">${r.origin} → ${r.dest}</td>
        <td>${getAirportInfo(r.origin).city}</td>
        <td>${getAirportInfo(r.dest).city}</td>
        <td class="delay-cell ${delayClass}">${r.avgDelay} min</td>
        <td>${r.onTime}%</td>
        <td>${r.flights.toLocaleString()}</td>
        <td>${r.distance.toLocaleString()} mi</td>
      </tr>`;
    }).join('');
  }

  // ---- Init ----
  function tryRender(fn, name) {
    try {
      fn();
    } catch (e) {
      console.error(`Error rendering chart [${name}]:`, e);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFilters();
    renderKPIs();
    tryRender(renderMonthlyTrend, 'MonthlyTrend');
    tryRender(renderDelayCauses, 'DelayCauses');
    tryRender(renderAirlineDelay, 'AirlineDelay');
    tryRender(renderDOWRadar, 'DOWRadar');
    tryRender(renderDelayDist, 'DelayDist');
    tryRender(renderHourly, 'Hourly');
    tryRender(renderAirportBubble, 'AirportBubble');
    tryRender(renderCancellation, 'Cancellation');
    renderRoutesTable();
  });
})();
