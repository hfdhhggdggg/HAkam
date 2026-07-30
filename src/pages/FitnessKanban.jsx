import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { fitnessTests, referees, testTypeLabels } from '../lib/mockData';

const columns = [
  { key: 'pass', label: 'ناجح', color: 'border-green-500' },
  { key: 'fail', label: 'راسب', color: 'border-red-500' },
];

function FitnessKanban() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refName = (id) => referees.find((r) => r.id === id)?.name || '-';

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">اختبارات اللياقة</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض Kanban لنتائج الاختبارات</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {columns.map((col) => {
                const items = fitnessTests.filter((t) => t.result === col.key);
                return (
                  <div key={col.key} className={`bg-white dark:bg-gray-800 shadow-xs rounded-xl border-t-4 ${col.color}`}>
                    <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                      <h2 className="font-semibold text-gray-800 dark:text-gray-100">{col.label}</h2>
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-semibold text-white bg-gray-400 dark:bg-gray-600 rounded-full">
                        {items.length}
                      </span>
                    </header>
                    <div className="p-4 space-y-3">
                      {items.map((t) => (
                        <div key={t.id} className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">{refName(t.refereeId)}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{t.testDate}</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            <div>النوع: {testTypeLabels[t.testType]}</div>
                            <div>الموسم: {t.season}</div>
                            {t.runTime && <div>زمن الجري: {t.runTime}</div>}
                            {t.walkTime && <div>زمن المشي: {t.walkTime}</div>}
                            {t.failureReason && <div className="text-red-500">السبب: {t.failureReason}</div>}
                          </div>
                        </div>
                      ))}
                      {items.length === 0 && (
                        <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-6">لا توجد اختبارات</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FitnessKanban;
