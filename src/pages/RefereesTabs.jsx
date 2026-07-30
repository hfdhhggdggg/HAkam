import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { referees, rankLabels, statusLabels, governorates } from '../lib/mockData';

import Image01 from '../images/user-36-05.jpg';
import Image02 from '../images/user-36-06.jpg';
import Image03 from '../images/user-36-07.jpg';
import Image04 from '../images/user-36-08.jpg';
import Image05 from '../images/user-36-09.jpg';

const avatarMap = [Image01, Image02, Image03, Image04, Image05];

const statusColor = (status) => {
  if (status === 'active') return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
  if (status === 'suspended') return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
  return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400';
};

function RefereesTabs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [govFilter, setGovFilter] = useState('all');

  const filtered = referees.filter((r) => {
    if (activeTab !== 'all' && r.rank !== activeTab) return false;
    if (govFilter !== 'all' && r.governorate !== govFilter) return false;
    if (search && !r.name.includes(search) && !r.nationalId.includes(search)) return false;
    return true;
  });

  const tabs = [
    { key: 'all', label: 'الكل' },
    { key: 'international', label: 'دولي' },
    { key: 'first', label: 'أولى' },
    { key: 'second', label: 'تانية' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">قائمة الحكام</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض الحكام بتبويب الرتبة</p>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-violet-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث بالاسم أو الرقم القومي…"
                className="form-input flex-1"
              />
              <select
                value={govFilter}
                onChange={(e) => setGovFilter(e.target.value)}
                className="form-select sm:w-48"
              >
                <option value="all">كل المحافظات</option>
                {governorates.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
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
                      {filtered.map((referee, i) => (
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
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(referee.status)}`}>
                              {statusLabels[referee.status]}
                            </span>
                          </td>
                          <td className="p-2 text-center text-gray-600 dark:text-gray-400">{referee.lastTest}</td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400 dark:text-gray-500">لا يوجد حكام مطابقون</td>
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

export default RefereesTabs;
