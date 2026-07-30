import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { useAuth } from '../utils/AuthContext';
import { referees, fitnessTests, rankLabels, statusLabels, testTypeLabels } from '../lib/mockData';

import Image01 from '../images/user-36-05.jpg';
import Image02 from '../images/user-36-06.jpg';
import Image03 from '../images/user-36-07.jpg';
import Image04 from '../images/user-36-08.jpg';
import Image05 from '../images/user-36-09.jpg';

const avatarMap = [Image01, Image02, Image03, Image04, Image05];

function TrainerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const assignedRefereeIds = user?.assignedRefereeIds || [];
  const myReferees = referees.filter((r) => assignedRefereeIds.includes(r.id));
  const myTests = fitnessTests.filter((t) => assignedRefereeIds.includes(t.refereeId));

  const passCount = myTests.filter((t) => t.result === 'pass').length;
  const failCount = myTests.filter((t) => t.result === 'fail').length;
  const activeCount = myReferees.filter((r) => r.status === 'active').length;
  const suspendedCount = myReferees.filter((r) => r.status === 'suspended').length;

  const statusColor = (status) => {
    if (status === 'active') return 'text-green-500';
    if (status === 'suspended') return 'text-red-500';
    return 'text-amber-500';
  };

  const stats = [
    { label: 'الحكام تحت إشرافي', value: myReferees.length, color: 'text-violet-500' },
    { label: 'نشط', value: activeCount, color: 'text-green-500' },
    { label: 'معطّل', value: suspendedCount, color: 'text-red-500' },
    { label: 'اختبارات ناجحة', value: passCount, color: 'text-green-500' },
    { label: 'اختبارات راسبة', value: failCount, color: 'text-red-500' },
    { label: 'إجمالي الاختبارات', value: myTests.length, color: 'text-sky-500' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">لوحة المعد البدني</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">مرحباً، {user?.name} — الحكام تحت إشرافك فقط</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-4">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Referees table */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl mb-6">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">الحكام تحت إشرافي</h2>
              </header>
              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="p-2 text-start">الاسم</th>
                        <th className="p-2 text-center">الرتبة</th>
                        <th className="p-2 text-center">المحافظة</th>
                        <th className="p-2 text-center">الحالة</th>
                        <th className="p-2 text-center">آخر اختبار</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                      {myReferees.map((referee, i) => (
                        <tr key={referee.id}>
                          <td className="p-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 shrink-0 me-3">
                                <img className="rounded-full" src={avatarMap[i % avatarMap.length]} width="40" height="40" alt={referee.name} />
                              </div>
                              <div className="font-medium text-gray-800 dark:text-gray-100">{referee.name}</div>
                            </div>
                          </td>
                          <td className="p-2 text-center">{rankLabels[referee.rank]}</td>
                          <td className="p-2 text-center text-gray-600 dark:text-gray-400">{referee.governorate}</td>
                          <td className="p-2 text-center">
                            <span className={`font-medium ${statusColor(referee.status)}`}>{statusLabels[referee.status]}</span>
                          </td>
                          <td className="p-2 text-center text-gray-600 dark:text-gray-400">{referee.lastTest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent tests */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">آخر اختبارات اللياقة</h2>
              </header>
              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="p-2 text-start">الحكم</th>
                        <th className="p-2 text-center">نوع الاختبار</th>
                        <th className="p-2 text-center">الموسم</th>
                        <th className="p-2 text-center">النتيجة</th>
                        <th className="p-2 text-center">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                      {myTests.map((t) => {
                        const ref = referees.find((r) => r.id === t.refereeId);
                        return (
                          <tr key={t.id}>
                            <td className="p-2 text-start text-gray-800 dark:text-gray-100">{ref?.name || '-'}</td>
                            <td className="p-2 text-center text-gray-600 dark:text-gray-400">{testTypeLabels[t.testType]}</td>
                            <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.season}</td>
                            <td className="p-2 text-center">
                              <span className={`font-medium ${t.result === 'pass' ? 'text-green-500' : 'text-red-500'}`}>
                                {t.result === 'pass' ? 'ناجح' : 'راسب'}
                              </span>
                            </td>
                            <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.testDate}</td>
                          </tr>
                        );
                      })}
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

export default TrainerDashboard;
