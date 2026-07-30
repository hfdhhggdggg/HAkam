import React from 'react';
import BarChart from '../../charts/BarChart03';
import { getCssVariable } from '../../utils/Utils';

function DashboardCard11() {

  const chartData = {
    labels: ['الأسباب'],
    datasets: [
      {
        label: 'تأخر جري',
        data: [7],
        backgroundColor: getCssVariable('--color-red-500'),
        hoverBackgroundColor: getCssVariable('--color-red-600'),
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'تأخر مشي',
        data: [4],
        backgroundColor: getCssVariable('--color-amber-500'),
        hoverBackgroundColor: getCssVariable('--color-amber-600'),
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'عدم استكمال الاختبار',
        data: [3],
        backgroundColor: getCssVariable('--color-violet-500'),
        hoverBackgroundColor: getCssVariable('--color-violet-600'),
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'إصابة أثناء الاختبار',
        data: [2],
        backgroundColor: getCssVariable('--color-sky-500'),
        hoverBackgroundColor: getCssVariable('--color-sky-600'),
        barPercentage: 1,
        categoryPercentage: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">أسباب الرسوب</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">16</div>
          <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">+42%</div>
        </div>
      </div>
      <div className="grow">
        <BarChart data={chartData} width={595} height={48} />
      </div>
    </div>
  );
}

export default DashboardCard11;
