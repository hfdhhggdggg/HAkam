import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { referees, fitnessTests, refereeCountByRank, refereeCountByGovernorate, passFailBySeason, passRateByTestType, failureReasons, rankLabels, testTypeLabels } from '../lib/mockData';

function Stats() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalReferees = referees.length;
  const totalTests = fitnessTests.length;
  const passCount = fitnessTests.filter((t) => t.result === 'pass').length;
  const failCount = fitnessTests.filter((t) => t.result === 'fail').length;
  const passRate = totalTests > 0 ? Math.round((passCount / totalTests) * 100) : 0;

  const stats = [
    { label: 'إجمالي الحكام', value: totalReferees, color: 'text-violet-500' },
    { label: 'إجمالي الاختبارات', value: totalTests, color: 'text-sky-500' },
    { label: 'اختبارات ناجحة', value: passCount, color: 'text-green-500' },
    { label: 'اختبارات راسبة', value: failCount, color: 'text-red-500' },
    { label: 'نسبة النجاح', value: `${passRate}%`, color: 'text-amber-500' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">الإحصائيات</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">نظرة تفصيلية على أداء الحكام والاختبارات</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-4">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Referees by rank */}
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">توزيع الحكام حسب الرتبة</h2>
                </header>
                <div className="p-5 space-y-3">
                  {Object.entries(refereeCountByRank).map(([rank, count]) => {
                    const pct = totalReferees > 0 ? Math.round((count / totalReferees) * 100) : 0;
                    return (
                      <div key={rank}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-300">{rankLabels[rank]}</span>
                          <span className="font-medium text-gray-800 dark:text-gray-100">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-2">
                          <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Referees by governorate */}
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">توزيع الحكام حسب المحافظة</h2>
                </header>
                <div className="p-5">
                  <table className="table-auto w-full">
                    <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="p-2 text-start">المحافظة</th>
                        <th className="p-2 text-center">العدد</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                      {refereeCountByGovernorate.map((g) => (
                        <tr key={g.governorate}>
                          <td className="p-2 text-gray-700 dark:text-gray-300">{g.governorate}</td>
                          <td className="p-2 text-center font-medium text-gray-800 dark:text-gray-100">{g.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Pass/Fail by season */}
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">النجاح والرسوب حسب الموسم</h2>
                </header>
                <div className="p-5 space-y-3">
                  {passFailBySeason.map((s) => {
                    const total = s.pass + s.fail;
                    const passPct = total > 0 ? Math.round((s.pass / total) * 100) : 0;
                    return (
                      <div key={s.season}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-300">{s.season}</span>
                          <span className="font-medium text-gray-800 dark:text-gray-100">{s.pass} ناجح / {s.fail} راسب</span>
                        </div>
                        <div className="flex w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                          <div className="bg-green-500 h-2" style={{ width: `${passPct}%` }}></div>
                          <div className="bg-red-500 h-2" style={{ width: `${100 - passPct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pass rate by test type */}
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">نسبة النجاح حسب نوع الاختبار</h2>
                </header>
                <div className="p-5 space-y-3">
                  {passRateByTestType.map((t) => (
                    <div key={t.testType}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">{t.testType}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{t.pass}/{t.total} ({t.rate}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-2">
                        <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${t.rate}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Failure reasons */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">أسباب الرسوب</h2>
              </header>
              <div className="p-5">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="p-2 text-start">السبب</th>
                      <th className="p-2 text-center">عدد المرات</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                    {failureReasons.map((f) => (
                      <tr key={f.reason}>
                        <td className="p-2 text-gray-700 dark:text-gray-300">{f.reason}</td>
                        <td className="p-2 text-center font-medium text-gray-800 dark:text-gray-100">{f.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Stats;
