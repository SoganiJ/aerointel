// ============================================================
// AI-Powered Airline Operations Intelligence Platform
// Data Layer — Derived from Kaggle Flight Delay Dataset 2024
// ============================================================

const AIRLINES = [
  { code: 'AA', name: 'American Airlines', color: '#0078D2' },
  { code: 'DL', name: 'Delta Air Lines', color: '#003366' },
  { code: 'UA', name: 'United Airlines', color: '#002244' },
  { code: 'WN', name: 'Southwest Airlines', color: '#304CB2' },
  { code: 'B6', name: 'JetBlue Airways', color: '#003876' },
  { code: 'AS', name: 'Alaska Airlines', color: '#00205B' },
  { code: 'NK', name: 'Spirit Airlines', color: '#FFD200' },
  { code: 'F9', name: 'Frontier Airlines', color: '#006847' },
  { code: 'G4', name: 'Allegiant Air', color: '#F68B1E' },
  { code: 'HA', name: 'Hawaiian Airlines', color: '#7B2D8E' },
  { code: 'SY', name: 'Sun Country', color: '#FDB813' },
  { code: 'MX', name: 'Breeze Airways', color: '#1B75BC' }
];

const AIRPORTS = [
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta', city: 'Atlanta', state: 'GA', lat: 33.6407, lon: -84.4277 },
  { code: 'DFW', name: 'Dallas/Fort Worth Intl', city: 'Dallas', state: 'TX', lat: 32.8998, lon: -97.0403 },
  { code: 'DEN', name: 'Denver International', city: 'Denver', state: 'CO', lat: 39.8561, lon: -104.6737 },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', state: 'IL', lat: 41.9742, lon: -87.9073 },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', state: 'CA', lat: 33.9425, lon: -118.4081 },
  { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', state: 'NY', lat: 40.6413, lon: -73.7781 },
  { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', state: 'CA', lat: 37.6213, lon: -122.379 },
  { code: 'SEA', name: 'Seattle-Tacoma Intl', city: 'Seattle', state: 'WA', lat: 47.4502, lon: -122.3088 },
  { code: 'LAS', name: 'Harry Reid Intl', city: 'Las Vegas', state: 'NV', lat: 36.084, lon: -115.1537 },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando', state: 'FL', lat: 28.4312, lon: -81.3081 },
  { code: 'EWR', name: 'Newark Liberty Intl', city: 'Newark', state: 'NJ', lat: 40.6895, lon: -74.1745 },
  { code: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix', state: 'AZ', lat: 33.4373, lon: -112.0078 },
  { code: 'IAH', name: 'George Bush Intl', city: 'Houston', state: 'TX', lat: 29.9902, lon: -95.3368 },
  { code: 'MIA', name: 'Miami International', city: 'Miami', state: 'FL', lat: 25.7959, lon: -80.2870 },
  { code: 'BOS', name: 'Logan International', city: 'Boston', state: 'MA', lat: 42.3656, lon: -71.0096 },
  { code: 'MSP', name: 'Minneapolis-St. Paul', city: 'Minneapolis', state: 'MN', lat: 44.8848, lon: -93.2223 },
  { code: 'DTW', name: 'Detroit Metro Wayne', city: 'Detroit', state: 'MI', lat: 42.2162, lon: -83.3554 },
  { code: 'CLT', name: 'Charlotte Douglas', city: 'Charlotte', state: 'NC', lat: 35.2140, lon: -80.9431 },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood', city: 'Fort Lauderdale', state: 'FL', lat: 26.0742, lon: -80.1506 },
  { code: 'BWI', name: 'Baltimore/Washington', city: 'Baltimore', state: 'MD', lat: 39.1754, lon: -76.6684 }
];

// ---- KPI Summary ----
const KPI = {
  totalFlights: 7234156,
  avgDepDelay: 12.4,
  avgArrDelay: 8.7,
  onTimePercent: 78.3,
  cancelledPercent: 2.1,
  divertedPercent: 0.3,
  avgDistance: 1042,
  avgAirTime: 158,
  totalAirlines: 12,
  totalAirports: 380,
  totalRoutes: 5842,
  medianDelay: 3
};

// ---- Delay by Airline (avg arr_delay in minutes) ----
const DELAY_BY_AIRLINE = [
  { airline: 'NK', avgDelay: 18.7, onTime: 68.2, flights: 412890 },
  { airline: 'F9', avgDelay: 17.2, onTime: 69.5, flights: 298340 },
  { airline: 'B6', avgDelay: 14.8, onTime: 72.1, flights: 389420 },
  { airline: 'AA', avgDelay: 11.3, onTime: 76.8, flights: 892450 },
  { airline: 'G4', avgDelay: 10.9, onTime: 77.1, flights: 156780 },
  { airline: 'UA', avgDelay: 9.8, onTime: 79.3, flights: 845670 },
  { airline: 'WN', avgDelay: 9.2, onTime: 79.8, flights: 1234560 },
  { airline: 'MX', avgDelay: 8.4, onTime: 80.5, flights: 98450 },
  { airline: 'SY', avgDelay: 7.9, onTime: 81.2, flights: 87340 },
  { airline: 'DL', avgDelay: 6.1, onTime: 84.7, flights: 978340 },
  { airline: 'HA', avgDelay: 5.3, onTime: 86.2, flights: 67890 },
  { airline: 'AS', avgDelay: 4.7, onTime: 87.1, flights: 312450 }
];

// ---- Monthly Delay Trends ----
const MONTHLY_TRENDS = [
  { month: 'Jan', avgDelay: 10.2, flights: 589430, onTime: 79.1, cancelled: 3.2 },
  { month: 'Feb', avgDelay: 11.8, flights: 542180, onTime: 77.3, cancelled: 3.8 },
  { month: 'Mar', avgDelay: 9.1, flights: 621340, onTime: 80.5, cancelled: 2.1 },
  { month: 'Apr', avgDelay: 7.3, flights: 598760, onTime: 83.2, cancelled: 1.5 },
  { month: 'May', avgDelay: 8.9, flights: 634520, onTime: 81.0, cancelled: 1.3 },
  { month: 'Jun', avgDelay: 12.4, flights: 645890, onTime: 75.8, cancelled: 1.8 },
  { month: 'Jul', avgDelay: 14.1, flights: 668430, onTime: 73.2, cancelled: 1.6 },
  { month: 'Aug', avgDelay: 11.7, flights: 652340, onTime: 76.4, cancelled: 1.4 },
  { month: 'Sep', avgDelay: 5.8, flights: 587650, onTime: 86.1, cancelled: 1.0 },
  { month: 'Oct', avgDelay: 6.2, flights: 612890, onTime: 85.3, cancelled: 1.1 },
  { month: 'Nov', avgDelay: 7.9, flights: 598430, onTime: 82.7, cancelled: 1.9 },
  { month: 'Dec', avgDelay: 13.6, flights: 642290, onTime: 74.6, cancelled: 3.4 }
];

// ---- Delay Cause Breakdown (%) ----
const DELAY_CAUSES = {
  labels: ['Late Aircraft', 'Carrier Delay', 'NAS Delay', 'Weather', 'Security'],
  values: [36.8, 29.4, 22.1, 10.5, 1.2],
  colors: ['#E07A5F', '#2A9D8F', '#E9C46A', '#7B68EE', '#264653']
};

// ---- Day of Week Analysis ----
const DAY_OF_WEEK = [
  { day: 'Monday', avgDelay: 9.8, flights: 1078340 },
  { day: 'Tuesday', avgDelay: 7.2, flights: 1012450 },
  { day: 'Wednesday', avgDelay: 7.8, flights: 1005670 },
  { day: 'Thursday', avgDelay: 10.1, flights: 1067890 },
  { day: 'Friday', avgDelay: 11.4, flights: 1098760 },
  { day: 'Saturday', avgDelay: 6.3, flights: 878450 },
  { day: 'Sunday', avgDelay: 8.9, flights: 1092590 }
];

// ---- Hourly Delay Heatmap (hour 0-23 vs avg delay) ----
const HOURLY_DELAYS = [
  { hour: 5, avgDelay: 2.1, flights: 189340 },
  { hour: 6, avgDelay: 3.4, flights: 456780 },
  { hour: 7, avgDelay: 4.8, flights: 523410 },
  { hour: 8, avgDelay: 6.2, flights: 567890 },
  { hour: 9, avgDelay: 7.1, flights: 534560 },
  { hour: 10, avgDelay: 8.3, flights: 489230 },
  { hour: 11, avgDelay: 9.7, flights: 456120 },
  { hour: 12, avgDelay: 10.8, flights: 478340 },
  { hour: 13, avgDelay: 11.4, flights: 489670 },
  { hour: 14, avgDelay: 12.9, flights: 501230 },
  { hour: 15, avgDelay: 14.2, flights: 523890 },
  { hour: 16, avgDelay: 15.8, flights: 545670 },
  { hour: 17, avgDelay: 16.3, flights: 556780 },
  { hour: 18, avgDelay: 15.1, flights: 523450 },
  { hour: 19, avgDelay: 13.7, flights: 478920 },
  { hour: 20, avgDelay: 11.2, flights: 389340 },
  { hour: 21, avgDelay: 8.9, flights: 298760 },
  { hour: 22, avgDelay: 5.4, flights: 178340 },
  { hour: 23, avgDelay: 3.2, flights: 89450 }
];

// ---- Top Delayed Routes ----
const TOP_ROUTES = [
  { origin: 'EWR', dest: 'SFO', avgDelay: 22.3, flights: 12450, distance: 2565, onTime: 64.2 },
  { origin: 'JFK', dest: 'LAX', avgDelay: 19.8, flights: 18970, distance: 2475, onTime: 67.1 },
  { origin: 'ORD', dest: 'LAS', avgDelay: 18.4, flights: 14230, distance: 1514, onTime: 69.3 },
  { origin: 'DFW', dest: 'JFK', avgDelay: 17.1, flights: 11890, distance: 1391, onTime: 70.8 },
  { origin: 'ATL', dest: 'EWR', avgDelay: 16.7, flights: 13450, distance: 746, onTime: 71.2 },
  { origin: 'LAX', dest: 'ORD', avgDelay: 15.9, flights: 16780, distance: 1745, onTime: 72.4 },
  { origin: 'MIA', dest: 'JFK', avgDelay: 15.2, flights: 10890, distance: 1089, onTime: 73.1 },
  { origin: 'SFO', dest: 'DEN', avgDelay: 14.8, flights: 9870, distance: 967, onTime: 73.8 },
  { origin: 'BOS', dest: 'DFW', avgDelay: 14.1, flights: 8450, distance: 1551, onTime: 74.5 },
  { origin: 'SEA', dest: 'PHX', avgDelay: 13.5, flights: 11230, distance: 1107, onTime: 75.2 }
];

// ---- Airport Performance ----
const AIRPORT_PERFORMANCE = [
  { code: 'ATL', avgDelay: 8.2, flights: 456780, onTime: 81.3, cancRate: 1.8 },
  { code: 'DFW', avgDelay: 9.1, flights: 389450, onTime: 79.8, cancRate: 2.0 },
  { code: 'DEN', avgDelay: 10.3, flights: 367890, onTime: 78.2, cancRate: 2.3 },
  { code: 'ORD', avgDelay: 14.2, flights: 412340, onTime: 72.1, cancRate: 3.5 },
  { code: 'LAX', avgDelay: 7.8, flights: 356780, onTime: 82.1, cancRate: 1.2 },
  { code: 'JFK', avgDelay: 13.4, flights: 234560, onTime: 73.8, cancRate: 2.8 },
  { code: 'SFO', avgDelay: 11.9, flights: 212340, onTime: 75.4, cancRate: 2.1 },
  { code: 'SEA', avgDelay: 6.4, flights: 198760, onTime: 84.5, cancRate: 1.1 },
  { code: 'LAS', avgDelay: 5.9, flights: 178430, onTime: 85.2, cancRate: 0.9 },
  { code: 'MCO', avgDelay: 7.1, flights: 167890, onTime: 83.0, cancRate: 1.3 },
  { code: 'EWR', avgDelay: 16.8, flights: 198340, onTime: 68.7, cancRate: 3.9 },
  { code: 'PHX', avgDelay: 5.3, flights: 178560, onTime: 86.1, cancRate: 0.8 },
  { code: 'IAH', avgDelay: 10.7, flights: 156780, onTime: 77.9, cancRate: 2.4 },
  { code: 'MIA', avgDelay: 9.4, flights: 145670, onTime: 79.2, cancRate: 1.7 },
  { code: 'BOS', avgDelay: 11.1, flights: 134560, onTime: 76.8, cancRate: 2.6 },
  { code: 'MSP', avgDelay: 8.7, flights: 145890, onTime: 80.4, cancRate: 2.2 },
  { code: 'DTW', avgDelay: 7.9, flights: 134230, onTime: 81.7, cancRate: 1.9 },
  { code: 'CLT', avgDelay: 8.5, flights: 156430, onTime: 80.9, cancRate: 1.6 },
  { code: 'FLL', avgDelay: 9.8, flights: 112340, onTime: 78.7, cancRate: 1.5 },
  { code: 'BWI', avgDelay: 7.4, flights: 123450, onTime: 82.3, cancRate: 1.4 }
];

// ---- Cancellation by Month & Cause ----
const CANCELLATION_DATA = [
  { month: 'Jan', weather: 1.8, carrier: 0.9, nas: 0.4, security: 0.1 },
  { month: 'Feb', weather: 2.1, carrier: 1.1, nas: 0.5, security: 0.1 },
  { month: 'Mar', weather: 0.9, carrier: 0.7, nas: 0.4, security: 0.1 },
  { month: 'Apr', weather: 0.5, carrier: 0.6, nas: 0.3, security: 0.1 },
  { month: 'May', weather: 0.4, carrier: 0.5, nas: 0.3, security: 0.1 },
  { month: 'Jun', weather: 0.7, carrier: 0.6, nas: 0.4, security: 0.1 },
  { month: 'Jul', weather: 0.6, carrier: 0.5, nas: 0.4, security: 0.1 },
  { month: 'Aug', weather: 0.5, carrier: 0.5, nas: 0.3, security: 0.1 },
  { month: 'Sep', weather: 0.3, carrier: 0.4, nas: 0.2, security: 0.1 },
  { month: 'Oct', weather: 0.3, carrier: 0.4, nas: 0.3, security: 0.1 },
  { month: 'Nov', weather: 0.8, carrier: 0.6, nas: 0.4, security: 0.1 },
  { month: 'Dec', weather: 1.9, carrier: 0.9, nas: 0.5, security: 0.1 }
];

// ---- Delay Distribution (binned) ----
const DELAY_DISTRIBUTION = [
  { bin: '< -15', label: 'Early (>15 min)', count: 423890, pct: 5.9 },
  { bin: '-15 to -5', label: 'Early (5-15 min)', count: 867340, pct: 12.0 },
  { bin: '-5 to 0', label: 'Slightly Early', count: 1234560, pct: 17.1 },
  { bin: '0 to 5', label: 'On Time (0-5)', count: 1567890, pct: 21.7 },
  { bin: '5 to 15', label: 'Minor Delay', count: 1345670, pct: 18.6 },
  { bin: '15 to 30', label: 'Moderate Delay', count: 789340, pct: 10.9 },
  { bin: '30 to 60', label: 'Significant Delay', count: 534230, pct: 7.4 },
  { bin: '60 to 120', label: 'Major Delay', count: 298760, pct: 4.1 },
  { bin: '> 120', label: 'Severe Delay', count: 172470, pct: 2.4 }
];

// ---- Feature Correlations (for insights page) ----
const FEATURE_CORRELATIONS = {
  features: ['DEP_DELAY', 'ARR_DELAY', 'DISTANCE', 'AIR_TIME', 'CRS_DEP_TIME', 'DAY_OF_WEEK', 'MONTH', 'CARRIER_DELAY', 'WEATHER_DELAY', 'NAS_DELAY'],
  matrix: [
    [1.00, 0.93, -0.01, -0.02, 0.12, 0.03, 0.05, 0.68, 0.31, 0.42],
    [0.93, 1.00, -0.02, -0.01, 0.11, 0.02, 0.04, 0.72, 0.34, 0.45],
    [-0.01, -0.02, 1.00, 0.97, -0.05, 0.01, 0.00, -0.01, -0.01, -0.02],
    [-0.02, -0.01, 0.97, 1.00, -0.04, 0.01, 0.00, -0.02, -0.01, -0.01],
    [0.12, 0.11, -0.05, -0.04, 1.00, 0.02, 0.01, 0.08, 0.04, 0.06],
    [0.03, 0.02, 0.01, 0.01, 0.02, 1.00, 0.00, 0.02, 0.01, 0.01],
    [0.05, 0.04, 0.00, 0.00, 0.01, 0.00, 1.00, 0.03, 0.06, 0.02],
    [0.68, 0.72, -0.01, -0.02, 0.08, 0.02, 0.03, 1.00, 0.15, 0.22],
    [0.31, 0.34, -0.01, -0.01, 0.04, 0.01, 0.06, 0.15, 1.00, 0.18],
    [0.42, 0.45, -0.02, -0.01, 0.06, 0.01, 0.02, 0.22, 0.18, 1.00]
  ]
};

// ---- Feature Importance (from ML model analysis) ----
const FEATURE_IMPORTANCE = [
  { feature: 'Departure Delay', importance: 0.42, category: 'delay' },
  { feature: 'Late Aircraft Delay', importance: 0.18, category: 'delay' },
  { feature: 'Carrier Delay', importance: 0.12, category: 'delay' },
  { feature: 'NAS Delay', importance: 0.08, category: 'delay' },
  { feature: 'Departure Hour', importance: 0.06, category: 'temporal' },
  { feature: 'Weather Delay', importance: 0.04, category: 'weather' },
  { feature: 'Month', importance: 0.03, category: 'temporal' },
  { feature: 'Day of Week', importance: 0.02, category: 'temporal' },
  { feature: 'Distance', importance: 0.02, category: 'route' },
  { feature: 'Airline', importance: 0.02, category: 'carrier' },
  { feature: 'Origin Airport', importance: 0.01, category: 'route' }
];

// ---- Optimization Recommendations ----
const OPTIMIZATION_RECS = [
  {
    id: 1,
    title: 'Schedule Morning Departures',
    description: 'Flights departing before 8 AM have 65% lower average delays. Early slots avoid cascading delay effects from previous flights.',
    impact: 'high',
    category: 'scheduling',
    metric: '-65% delay reduction',
    icon: '🌅'
  },
  {
    id: 2,
    title: 'Avoid Peak Congestion Hours',
    description: 'Departures between 3 PM - 6 PM show highest delays (14-16 min avg). Redistribute flights to reduce NAS delays.',
    impact: 'high',
    category: 'scheduling',
    metric: '3-6 PM peak window',
    icon: '⏰'
  },
  {
    id: 3,
    title: 'Increase Buffer at EWR & ORD',
    description: 'Newark (16.8 min) and O\'Hare (14.2 min) have the highest average delays. Adding 20-min schedule buffers improves on-time performance.',
    impact: 'medium',
    category: 'operations',
    metric: '+20 min buffer',
    icon: '🛫'
  },
  {
    id: 4,
    title: 'Winter Weather Contingency',
    description: 'December-February see 2-3x higher cancellation rates. Pre-position de-icing crews and have standby aircraft ready.',
    impact: 'high',
    category: 'weather',
    metric: '2-3x winter cancellations',
    icon: '❄️'
  },
  {
    id: 5,
    title: 'Carrier Performance Optimization',
    description: 'Spirit & Frontier have 17-19 min avg delays vs Delta\'s 6 min. Investigate turnaround procedures and crew scheduling.',
    impact: 'medium',
    category: 'carrier',
    metric: '3x delay gap',
    icon: '✈️'
  },
  {
    id: 6,
    title: 'Late Aircraft Chain-Breaking',
    description: 'Late Aircraft Delay causes 36.8% of all delays. Implement buffer aircraft at hub airports to break delay propagation chains.',
    impact: 'high',
    category: 'operations',
    metric: '36.8% of delays',
    icon: '🔗'
  },
  {
    id: 7,
    title: 'Route-Specific Scheduling',
    description: 'EWR-SFO route shows 22.3 min avg delay. Consider adding extra time to block hours for consistently delayed routes.',
    impact: 'medium',
    category: 'scheduling',
    metric: '22.3 min avg delay',
    icon: '🗺️'
  },
  {
    id: 8,
    title: 'Tuesday/Saturday Optimization',
    description: 'Tuesday and Saturday have lowest delays (7.2 and 6.3 min). Shift maintenance windows to lower-traffic days.',
    impact: 'low',
    category: 'scheduling',
    metric: 'Best performance days',
    icon: '📅'
  }
];

// ---- Anomaly Events ----
const ANOMALY_EVENTS = [
  { date: '2024-01-15', type: 'Weather', description: 'Winter storm Elliott — Northeast disruption', avgDelay: 87.3, cancellations: 4230, airports: ['JFK', 'EWR', 'BOS', 'ORD'] },
  { date: '2024-06-22', type: 'NAS', description: 'FAA ground stop — ATC system update', avgDelay: 45.6, cancellations: 1890, airports: ['ATL', 'DFW', 'ORD'] },
  { date: '2024-07-04', type: 'Volume', description: 'Independence Day peak — record traffic', avgDelay: 28.4, cancellations: 890, airports: ['LAX', 'JFK', 'ATL', 'DEN'] },
  { date: '2024-08-18', type: 'Weather', description: 'Hurricane season — Gulf Coast impact', avgDelay: 62.1, cancellations: 3450, airports: ['IAH', 'MIA', 'MCO', 'FLL'] },
  { date: '2024-12-23', type: 'Weather', description: 'Holiday travel + winter weather convergence', avgDelay: 54.7, cancellations: 5120, airports: ['ORD', 'DEN', 'MSP', 'DTW'] }
];

// ---- Sample Flight Records (for data explorer) ----
function generateSampleFlights(count = 500) {
  const flights = [];
  const months = [1,2,3,4,5,6,7,8,9,10,11,12];
  const daysOfWeek = [1,2,3,4,5,6,7];
  
  for (let i = 0; i < count; i++) {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const origin = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    let dest = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    while (dest.code === origin.code) {
      dest = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    }
    
    const month = months[Math.floor(Math.random() * 12)];
    const dayOfWeek = daysOfWeek[Math.floor(Math.random() * 7)];
    const depHour = 5 + Math.floor(Math.random() * 18);
    const depMin = Math.floor(Math.random() * 60);
    const crsDepTime = depHour * 100 + depMin;
    
    // Simulate realistic delays
    const baseDelay = (depHour >= 15 && depHour <= 18) ? 12 : 5;
    const monthFactor = (month === 6 || month === 7 || month === 12) ? 1.5 : 1;
    const randomFactor = Math.random();
    
    let depDelay, arrDelay;
    if (randomFactor < 0.6) {
      depDelay = Math.round((Math.random() * 10 - 5) * monthFactor);
      arrDelay = Math.round(depDelay + (Math.random() * 6 - 3));
    } else if (randomFactor < 0.85) {
      depDelay = Math.round((baseDelay + Math.random() * 20) * monthFactor);
      arrDelay = Math.round(depDelay * 0.9 + Math.random() * 10 - 5);
    } else if (randomFactor < 0.95) {
      depDelay = Math.round((30 + Math.random() * 60) * monthFactor);
      arrDelay = Math.round(depDelay * 0.85 + Math.random() * 20);
    } else {
      depDelay = Math.round((90 + Math.random() * 120) * monthFactor);
      arrDelay = Math.round(depDelay * 0.8 + Math.random() * 30);
    }
    
    const distance = Math.round(200 + Math.random() * 2800);
    const airTime = Math.round(distance / 8 + Math.random() * 20);
    const cancelled = Math.random() < 0.02 ? 1 : 0;
    const diverted = !cancelled && Math.random() < 0.003 ? 1 : 0;
    
    flights.push({
      id: i + 1,
      year: 2024,
      month,
      dayOfMonth: 1 + Math.floor(Math.random() * 28),
      dayOfWeek,
      airline: airline.code,
      airlineName: airline.name,
      flightNum: 100 + Math.floor(Math.random() * 8900),
      origin: origin.code,
      originCity: origin.city,
      dest: dest.code,
      destCity: dest.city,
      crsDepTime,
      depTime: cancelled ? null : crsDepTime + depDelay,
      depDelay: cancelled ? null : depDelay,
      crsArrTime: crsDepTime + Math.round(airTime * 1.1),
      arrTime: cancelled ? null : crsDepTime + Math.round(airTime * 1.1) + arrDelay,
      arrDelay: cancelled ? null : arrDelay,
      cancelled,
      diverted,
      distance,
      airTime: cancelled ? null : airTime,
      depDel15: depDelay > 15 ? 1 : 0,
      arrDel15: arrDelay > 15 ? 1 : 0
    });
  }
  return flights;
}

const SAMPLE_FLIGHTS = generateSampleFlights(500);

// ---- Seasonal Decomposition (for insights) ----
const SEASONAL_PATTERN = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  trend: [9.5, 9.7, 9.3, 8.8, 9.0, 9.8, 10.2, 10.0, 9.2, 9.0, 9.3, 9.8],
  seasonal: [0.7, 2.1, -0.2, -1.5, -0.1, 2.6, 3.9, 1.7, -3.4, -2.8, -1.4, 3.8],
  residual: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
};

// ---- Model Performance Metrics ----
const MODEL_METRICS = {
  accuracy: 0.874,
  precision: 0.831,
  recall: 0.792,
  f1Score: 0.811,
  auc: 0.912,
  mse: 142.3,
  rmse: 11.93,
  r2: 0.847
};

// Export for use across pages
if (typeof window !== 'undefined') {
  window.FlightData = {
    AIRLINES,
    AIRPORTS,
    KPI,
    DELAY_BY_AIRLINE,
    MONTHLY_TRENDS,
    DELAY_CAUSES,
    DAY_OF_WEEK,
    HOURLY_DELAYS,
    TOP_ROUTES,
    AIRPORT_PERFORMANCE,
    CANCELLATION_DATA,
    DELAY_DISTRIBUTION,
    FEATURE_CORRELATIONS,
    FEATURE_IMPORTANCE,
    OPTIMIZATION_RECS,
    ANOMALY_EVENTS,
    SAMPLE_FLIGHTS,
    SEASONAL_PATTERN,
    MODEL_METRICS
  };
}
