import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { useThemeProvider } from '../utils/ThemeContext';
import { chartColors } from '../charts/ChartjsConfig';
import {
  Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler,
  DoughnutController, ArcElement,
} from 'chart.js';
import {
  seasons,
  passRateByRankOverSeasons,
  passRateIntervalVsRsa,
  failureReasonsDetailed,
  refereeCountByGovernorateFull,
  referees,
  registrationRequests,
} from '../lib/mockData';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler, DoughnutController, ArcElement);

function StatsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(seasons[seasons.length - 1]);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor, gridColor, textColor } = chartColors;

  const lineCanvas = useRef(null);
  const compareCanvas = useRef(null);
  const doughnutCanvas = useRef(null);
  const [lineChart, setLineChart] = useState(null);
  const [compareChart, setCompareChart] = useState(null);
  const [doughnutChart, setDoughnutChart] = useState(null);

  const totalReferees = referees.length;
  const newRegistrations = registrationRequests.filter((r) => r.status === 'pending').length;
  const seasonTests = 42;
  const overallPassRate = 84;

  // Line chart: pass rate by rank over seasons
  useEffect(() => {
    if (!lineCanvas.current) return;
    const ctx = lineCanvas.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: passRateByRankOverSeasons.map((d) => d.season),
        datasets: [
          {
            label: 'دولي',
            data: passRateByRankOverSeasons.map((d) => d.international),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: 'درجة أولى',
            data: passRateByRankOverSeasons.map((d) => d.first),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: 'درجة ثانية',
            data: passRateByRankOverSeasons.map((d) => d.second),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 50,
            max: 100,
            ticks: { callback: (v) => `${v}%`, color: darkMode ? textColor.dark : textColor.light },
            grid: { color: darkMode ? gridColor.dark : gridColor.light },
          },
          x: {
            ticks: { color: darkMode ? textColor.dark : textColor.light },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: true, labels: { color: darkMode ? textColor.dark : textColor.light } },
          tooltip: {
            callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y}%` },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
      },
    });
    setLineChart(chart);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Comparison chart: Interval vs RSA
  useEffect(() => {
    if (!compareCanvas.current) return;
    const ctx = compareCanvas.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: passRateIntervalVsRsa.map((d) => d.season),
        datasets: [
          {
            label: 'نسبة نجاح Interval',
            data: passRateIntervalVsRsa.map((d) => d.interval),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: 'نسبة نجاح RSA',
            data: passRateIntervalVsRsa.map((d) => d.rsa),
            borderColor: '#ec4899',
            backgroundColor: 'rgba(236,72,153,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 70,
            max: 100,
            ticks: { callback: (v) => `${v}%`, color: darkMode ? textColor.dark : textColor.light },
            grid: { color: darkMode ? gridColor.dark : gridColor.light },
          },
          x: {
            ticks: { color: darkMode ? textColor.dark : textColor.light },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: true, labels: { color: darkMode ? textColor.dark : textColor.light } },
          tooltip: {
            callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y}%` },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
      },
    });
    setCompareChart(chart);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Doughnut chart: all governorates
  useEffect(() => {
    if (!doughnutCanvas.current) return;
    const ctx = doughnutCanvas.current.getContext('2d');
    const palette = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#06b6d4'];
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: refereeCountByGovernorateFull.map((d) => d.governorate),
        datasets: [{
          data: refereeCountByGovernorateFull.map((d) => d.count),
          backgroundColor: palette,
          borderWidth: 2,
          borderColor: darkMode ? '#1f2937' : '#ffffff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
          legend: {
            position: 'right',
            labels: { color: darkMode ? textColor.dark : textColor.light, boxWidth: 12, padding: 8, font: { size: 11 } },
          },
          tooltip: {
            callbacks: { label: (c) => `${c.label}: ${c.parsed} حكم` },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
      },
    });
    setDoughnutChart(chart);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update charts on theme change
  useEffect(() => {
    [lineChart, compareChart, doughnutChart].forEach((c) => {
      if (!c) return;
      c.options.scales.y.ticks.color = darkMode ? textColor.dark : textColor.light;
      c.options.scales.x.ticks.color = darkMode ? textColor.dark : textColor.light;
      if (c.options.scales.y.grid) c.options.scales.y.grid.color = darkMode ? gridColor.dark : gridColor.light;
      if (c.options.plugins.legend.labels) c.options.plugins.legend.labels.color = darkMode ? textColor.dark : textColor.light;
      c.update('none');
    });
  }, [currentTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Header + season filter */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">الإحصائيات</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تحليل أداء الحكام عبر المواسم</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">الموسم:</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="form-select w-44"
                >
                  {seasons.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">إجمالي الحكام</span>
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m6-2a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" /></svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalReferees}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">نسبة النجاح العامة</span>
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{overallPassRate}%</div>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">اختبارات هذا الموسم</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{seasonTests}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">طلبات تسجيل جديدة</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.66V5a2 2 0 1 0-4 0v.34A6 6 0 0 0 6 11v3.2c0 .53-.21 1.04-.59 1.41L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" /></svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{newRegistrations}</div>
              </div>
            </div>

            {/* Line chart: pass rate by rank */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5 mb-6">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">نسبة النجاح حسب الرتبة عبر المواسم</h2>
              <div style={{ height: '300px' }}>
                <canvas ref={lineCanvas}></canvas>
              </div>
            </div>

            {/* Comparison chart: Interval vs RSA */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5 mb-6">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">مقارنة نسبة نجاح Interval مقابل RSA</h2>
              <div style={{ height: '300px' }}>
                <canvas ref={compareCanvas}></canvas>
              </div>
            </div>

            {/* Failure reasons table + Doughnut */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">أسباب الرسوب بالتفصيل</h2>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="text-xs uppercase text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700/60">
                        <th className="text-right font-semibold py-2">السبب</th>
                        <th className="text-center font-semibold py-2">العدد</th>
                        <th className="text-center font-semibold py-2">النسبة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failureReasonsDetailed.map((r, i) => (
                        <tr key={i} className="border-b last:border-0 border-gray-100 dark:border-gray-700/60">
                          <td className="text-sm text-gray-800 dark:text-gray-200 py-3">{r.reason}</td>
                          <td className="text-sm text-center text-gray-600 dark:text-gray-300 py-3">{r.count}</td>
                          <td className="text-sm text-center py-3">
                            <span className="inline-flex items-center gap-2">
                              <span className="text-gray-600 dark:text-gray-300">{r.percentage}%</span>
                              <span className="w-16 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                <span className="block h-full bg-violet-500 rounded-full" style={{ width: `${r.percentage}%` }}></span>
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">توزيع الحكام على المحافظات</h2>
                <div style={{ height: '300px' }}>
                  <canvas ref={doughnutCanvas}></canvas>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StatsPage;
