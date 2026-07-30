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

function RefereeProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tests');
  const { user } = useAuth();

  const referee = referees.find((r) => r.id === user?.refereeId) || referees[0];
  const refereeIndex = referees.indexOf(referee);
  const tests = fitnessTests.filter((t) => t.refereeId === referee.id);

  const statusColor = (status) => {
    if (status === 'active') return 'text-green-500';
    if (status === 'suspended') return 'text-red-500';
    return 'text-amber-500';
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">بروفايل الحكم</h1>
            </div>

            {/* Profile card */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden mb-6">
              <div className="h-24 bg-gradient-to-r from-violet-500 to-sky-500"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end -mt-12">
                  <div className="mb-4 sm:mb-0 sm:ms-6">
                    <div className="relative inline-block">
                      <img className="rounded-full ring-4 ring-white dark:ring-gray-800" src={avatarMap[refereeIndex % avatarMap.length]} width="96" height="96" alt={referee.name} />
                    </div>
                  </div>
                  <div className="grow mb-2">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{referee.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">الرتبة: {rankLabels[referee.rank]}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">المحافظة: {referee.governorate}</span>
                      <span className={`text-sm font-medium ${statusColor(referee.status)}`}>{statusLabels[referee.status]}</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                      تعديل البيانات
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">الرقم القومي</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100 tracking-wider">{referee.nationalId}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">الهاتف</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{referee.phone || 'غير متوفر'}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">تاريخ التسجيل</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{referee.created_at ? referee.created_at.slice(0,10) : '2024-01-01'}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
              <div className="border-b border-gray-100 dark:border-gray-700/60">
                <ul className="flex">
                  <li className="me-1">
                    <button
                      onClick={() => setActiveTab('tests')}
                      className={`inline-flex items-center px-5 py-3 text-sm font-medium rounded-t-sm transition ${
                        activeTab === 'tests'
                          ? 'text-violet-500 border-b-2 border-violet-500'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      اختبارات اللياقة
                    </button>
                  </li>
                  <li className="me-1">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`inline-flex items-center px-5 py-3 text-sm font-medium rounded-t-sm transition ${
                        activeTab === 'info'
                          ? 'text-violet-500 border-b-2 border-violet-500'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      البيانات الشخصية
                    </button>
                  </li>
                </ul>
              </div>

              {/* Tab content */}
              <div className="p-5">
                {activeTab === 'tests' && (
                  <div>
                    {tests.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">لا توجد اختبارات مسجلة</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table-auto w-full">
                          <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                              <th className="p-2 text-start">نوع الاختبار</th>
                              <th className="p-2 text-center">الموسم</th>
                              <th className="p-2 text-center">زمن الجري</th>
                              <th className="p-2 text-center">زمن المشي</th>
                              <th className="p-2 text-center">النتيجة</th>
                              <th className="p-2 text-center">سبب الفشل</th>
                              <th className="p-2 text-center">التاريخ</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                            {tests.map((t) => (
                              <tr key={t.id}>
                                <td className="p-2 text-start text-gray-800 dark:text-gray-100">{testTypeLabels[t.testType]}</td>
                                <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.season}</td>
                                <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.runTime ?? '-'}</td>
                                <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.walkTime ?? '-'}</td>
                                <td className="p-2 text-center">
                                  <span className={`font-medium ${t.result === 'pass' ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.result === 'pass' ? 'ناجح' : 'راسب'}
                                  </span>
                                </td>
                                <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.failureReason ?? '-'}</td>
                                <td className="p-2 text-center text-gray-600 dark:text-gray-400">{t.testDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">الاسم الكامل</label>
                      <div className="text-sm text-gray-800 dark:text-gray-100">{referee.name}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">الرقم القومي</label>
                      <div className="text-sm text-gray-800 dark:text-gray-100 tracking-wider">{referee.nationalId}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">الرتبة</label>
                      <div className="text-sm text-gray-800 dark:text-gray-100">{rankLabels[referee.rank]}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">المحافظة</label>
                      <div className="text-sm text-gray-800 dark:text-gray-100">{referee.governorate}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">الحالة</label>
                      <div className={`text-sm font-medium ${statusColor(referee.status)}`}>{statusLabels[referee.status]}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">الهاتف</label>
                      <div className="text-sm text-gray-800 dark:text-gray-100">{referee.phone || 'غير متوفر'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RefereeProfile;
