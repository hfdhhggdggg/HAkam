import React from 'react';
import DoughnutChart from '../../charts/DoughnutChart';
import { getCssVariable } from '../../utils/Utils';

function DashboardCard06() {

  const chartData = {
    labels: ['القاهرة', 'الإسكندرية', 'الجيزة', 'المنوفية', 'الغربية', 'أسيوط', 'الشرقية'],
    datasets: [
      {
        label: 'توزيع الحكام',
        data: [2, 1, 1, 1, 1, 1, 1],
        backgroundColor: [
          getCssVariable('--color-violet-500'),
          getCssVariable('--color-sky-500'),
          getCssVariable('--color-violet-800'),
          getCssVariable('--color-green-500'),
          getCssVariable('--color-amber-500'),
          getCssVariable('--color-red-500'),
          getCssVariable('--color-gray-500'),
        ],
        hoverBackgroundColor: [
          getCssVariable('--color-violet-600'),
          getCssVariable('--color-sky-600'),
          getCssVariable('--color-violet-900'),
          getCssVariable('--color-green-600'),
          getCssVariable('--color-amber-600'),
          getCssVariable('--color-red-600'),
          getCssVariable('--color-gray-600'),
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">توزيع الحكام حسب المحافظة</h2>
      </header>
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default DashboardCard06;
