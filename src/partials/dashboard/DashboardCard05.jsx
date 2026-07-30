import React, { useState, useEffect } from 'react';

function DashboardCard05() {
  const [activeTests, setActiveTests] = useState(3);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTests((prev) => {
        const next = Math.max(0, Math.min(20, prev + (Math.random() > 0.5 ? 1 : -1)));
        return next;
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">الاختبارات الجارية الآن</h2>
        <div className="ms-2 flex items-center">
          <span className={`w-2 h-2 rounded-full bg-green-500 ${pulse ? 'animate-ping' : ''}`}></span>
        </div>
      </header>
      <div className="px-5 py-8 flex flex-col items-center justify-center grow">
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2">{activeTests}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">اختبار لياقة قيد التنفيذ</div>
        <div className="mt-4 flex items-center text-xs text-green-600 dark:text-green-400">
          <svg className="w-3 h-3 fill-current me-1" viewBox="0 0 12 12">
            <path d="M10.5 6a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
          </svg>
          تحديث مباشر
        </div>
      </div>
    </div>
  );
}

export default DashboardCard05;
