import React from 'react';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import LineChart from '../../charts/LineChart02';
import DateSelect from '../../components/DateSelect';
import { getCssVariable, adjustColorOpacity } from '../../utils/Utils';

function DashboardCard08() {

  const chartData = {
    labels: ['موسم 20-21', 'موسم 21-22', 'موسم 22-23', 'موسم 23-24', 'موسم 24-25'],
    datasets: [
      {
        label: 'النتائج الحالية',
        data: [35, 40, 42, 48, 38],
        borderColor: getCssVariable('--color-violet-500'),
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return 'transparent';
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.24) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.05) }
          ]);
        },
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-violet-500'),
        pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      {
        label: 'الموسم السابق',
        data: [30, 35, 38, 42, 48],
        borderColor: getCssVariable('--color-sky-500'),
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return 'transparent';
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-sky-500'), 0.24) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-sky-500'), 0.05) }
          ]);
        },
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-sky-500'),
        pointHoverBackgroundColor: getCssVariable('--color-sky-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">تطور نتائج اللياقة عبر المواسم</h2>
        <DateSelect />
      </header>
      <LineChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard08;
