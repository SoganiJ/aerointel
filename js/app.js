// ============================================================
// AI-Powered Airline Operations Intelligence Platform
// Shared Application Logic
// ============================================================

(function () {
  'use strict';

  // ---- Sidebar Toggle (Mobile) ----
  function initSidebar() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!menuBtn || !sidebar) return;

    function toggleSidebar() {
      sidebar.classList.toggle('open');
      if (overlay) {
        overlay.classList.toggle('active');
        overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
      }
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // Close sidebar on nav item click (mobile)
    sidebar.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggleSidebar();
        }
      });
    });
  }

  // ---- Scroll Animations (Intersection Observer) ----
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in, .slide-in-left, .scale-in').forEach((el) => {
      observer.observe(el);
    });
  }

  // ---- Counter Animation ----
  function animateCounter(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const startTime = performance.now();
    const isDecimal = String(target).includes('.');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      if (isDecimal) {
        element.textContent = current.toFixed(1) + suffix;
      } else {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.counter);
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, 2000, suffix);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  // ---- Landing Nav Mobile Toggle ----
  function initLandingNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
    });
  }

  // ---- Utility: Format Number ----
  window.formatNum = function (num, decimals = 0) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(decimals);
  };

  // ---- Utility: Get Airline Name ----
  window.getAirlineName = function (code) {
    const data = window.FlightData;
    if (!data) return code;
    const airline = data.AIRLINES.find((a) => a.code === code);
    return airline ? airline.name : code;
  };

  // ---- Utility: Get Airport Info ----
  window.getAirportInfo = function (code) {
    const data = window.FlightData;
    if (!data) return { name: code, city: code };
    const airport = data.AIRPORTS.find((a) => a.code === code);
    return airport || { name: code, city: code, code };
  };

  // ---- Chart.js Global Config ----
  function initChartDefaults() {
    if (typeof Chart === 'undefined') return;

    // Chart.defaults.font.family = "'Inter', sans-serif";
    // Chart.defaults.font.size = 12;
    // Chart.defaults.color = '#5A6B8A';
    // Chart.defaults.plugins.legend.labels.usePointStyle = true;
    // Chart.defaults.plugins.legend.labels.padding = 16;
    // Chart.defaults.plugins.legend.labels.boxWidth = 8;
    // Chart.defaults.plugins.tooltip.backgroundColor = '#1B2A4A';
    // Chart.defaults.plugins.tooltip.titleFont = { family: "'Outfit', sans-serif", weight: '600', size: 13 };
    // Chart.defaults.plugins.tooltip.bodyFont = { family: "'Inter', sans-serif", size: 12 };
    // Chart.defaults.plugins.tooltip.cornerRadius = 12;
    // Chart.defaults.plugins.tooltip.padding = 12;
    // Chart.defaults.plugins.tooltip.displayColors = true;
    // Chart.defaults.plugins.tooltip.boxPadding = 4;
    // Chart.defaults.elements.bar.borderRadius = 8;
    // Chart.defaults.elements.point.radius = 4;
    // Chart.defaults.elements.point.hoverRadius = 6;
    // Chart.defaults.elements.line.tension = 0.4;
    // Chart.defaults.scale.grid = { color: 'rgba(27, 42, 74, 0.06)', drawBorder: false };
    // Chart.defaults.scale.ticks = { padding: 8 };
  }

  // ---- Init on DOM Ready ----
  document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    initScrollAnimations();
    initCounters();
    initLandingNav();
    initChartDefaults();
  });
})();
