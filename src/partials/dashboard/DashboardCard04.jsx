import React from 'react';
import BarChart from '../../charts/BarChart01';
import { getCssVariable } from '../../utils/Utils';

function DashboardCard04() {

  const chartData = {
    labels: ['موسم 22-23', 'موسم 23-24', 'موسم 24-25'],
    datasets: [
      {
        label: 'ناجح',
        data: [42, 48, 38],
        backgroundColor: getCssVariable('--color-green-500'),
        hoverBackgroundColor: getCssVariable('--color-green-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      {
        label: 'راسب',
        data: [8, 6, 12],
        backgroundColor: getCssVariable('--color-red-500'),
        hoverBackgroundColor: getCssVariable('--color-red-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">ناجح VS راسب في اختبار اللياقة</h2>
      </header>
      <BarChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard04;
