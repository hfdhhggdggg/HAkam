import React from 'react';
import Tooltip from '../../components/Tooltip';
import BarChart from '../../charts/BarChart02';
import { getCssVariable } from '../../utils/Utils';

function DashboardCard09() {

  const chartData = {
    labels: ['موسم 22-23', 'موسم 23-24', 'موسم 24-25'],
    datasets: [
      {
        label: 'تأخر جري',
        data: [3, 2, 7],
        backgroundColor: getCssVariable('--color-red-500'),
        hoverBackgroundColor: getCssVariable('--color-red-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      {
        label: 'تأخر مشي',
        data: [2, 1, 4],
        backgroundColor: getCssVariable('--color-amber-500'),
        hoverBackgroundColor: getCssVariable('--color-amber-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">الشوطين الفاشلة حسب السبب</h2>
        <Tooltip className="ml-2" size="lg">
          <div className="text-sm">يعرض عدد الاختبارات الفاشلة مصنّفة حسب سبب الفشل لكل موسم.</div>
        </Tooltip>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">17</div>
          <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">+42%</div>
        </div>
      </div>
      <div className="grow">
        <BarChart data={chartData} width={595} height={248} />
      </div>
    </div>
  );
}

export default DashboardCard09;
