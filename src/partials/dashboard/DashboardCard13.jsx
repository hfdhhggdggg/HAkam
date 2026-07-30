import React, { useState } from 'react';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import LineChart from '../../charts/LineChart02';
import DateSelect from '../../components/DateSelect';
import { getCssVariable, adjustColorOpacity } from '../../utils/Utils';

function DashboardCard13() {

  const [activeTab, setActiveTab] = useState('fitness');

  const chartData = {
    labels: ['موسم 20-21', 'موسم 21-22', 'موسم 22-23', 'موسم 23-24', 'موسم 24-25'],
    datasets: [
      {
        label: 'عدد الاختبارات',
        data: [60, 65, 50, 54, 50],
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
    ],
  };

  return (
    <div className="flex flex-col col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">تطور عدد الاختبارات عبر المواسم</h2>
        <DateSelect />
      </header>
      <div className="px-5 pt-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">50</div>
          <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">-7.4%</div>
        </div>
      </div>
      <div className="grow">
        <LineChart data={chartData} width={595} height={248} />
      </div>
    </div>
  );
}

export default DashboardCard13;
