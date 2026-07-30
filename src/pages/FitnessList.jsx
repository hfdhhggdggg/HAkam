import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { fitnessTests, referees, testTypeLabels } from '../lib/mockData';

function FitnessList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resultFilter, setResultFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const refName = (id) => referees.find((r) => r.id === id)?.name || '-';

  const filtered = fitnessTests.filter((t) => {
    if (resultFilter !== 'all' && t.result !== resultFilter) return false;
    if (typeFilter !== 'all' && t.testType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">اختبارات اللياقة</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض قائمة بكل الاختبارات</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="form-select sm:w-48"
              >
                <option value="all">كل النتائج</option>
                <option value="pass">ناجح</option>
                <option value="fail">راسب</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="form-select sm:w-48"
              >
                <option value="all">كل الأنواع</option>
                <option value="interval">RSA (Interval)</option>
                <option value="endurance">تحمل</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="p-2 text-start">الحكم</th>
                        <th className="p-2 text-center">نوع الاختبار</th>
                        <th className="p-2 text-center">الموسم</th>
                        <th className="p-2 text-center">زمن الجري</th>
                        <th className="p-2 text-center">زمن المشي</th>
                        <th className="p-2 text-center">النتيجة</th>
                        <th className="p-2 text-center">سبب الرسوب</th>
                        <th className="p-2 text-center">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                      {filtered.map((t) => (
                        <tr key={t.id}>
                          <td className="p-2 text-start text-gray-800 dark:text-gray-100">{refName(t.refereeId)}</td>
                          <td className="p-2 text-center text-gray-600 dark:text-gray-400">{testTypeLabels[t.testType]}</td>
                          <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.season}</td>
                          <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.runTime || '-'}</td>
                          <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.walkTime || '-'}</td>
                          <td className="p-2 text-center">
                            <span className={`font-medium ${t.result === 'pass' ? 'text-green-500' : 'text-red-500'}`}>
                              {t.result === 'pass' ? 'ناجح' : 'راسب'}
                            </span>
                          </td>
                          <td className="p-2 text-center text-red-500">{t.failureReason || '-'}</td>
                          <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.testDate}</td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-gray-400 dark:text-gray-500">لا توجد اختبارات مطابقة</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FitnessList;
