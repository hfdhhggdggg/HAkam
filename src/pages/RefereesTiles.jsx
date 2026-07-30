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

function RefereesTiles() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [govFilter, setGovFilter] = useState('all');

  const filtered = referees.filter((r) => {
    if (govFilter !== 'all' && r.governorate !== govFilter) return false;
    if (search && !r.name.includes(search) && !r.nationalId.includes(search)) return false;
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
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">قائمة الحكام</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض الحكام كبطاقات</p>
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

            {/* Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((referee, i) => (
                <div key={referee.id} className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 shrink-0 me-3">
                      <img className="rounded-full" src={avatarMap[i % avatarMap.length]} width="48" height="48" alt={referee.name} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{referee.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono" dir="ltr">{referee.nationalId}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">الرتبة</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{rankLabels[referee.rank]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">المحافظة</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{referee.governorate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">آخر اختبار</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{referee.lastTest}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(referee.status)}`}>
                      {statusLabels[referee.status]}
                    </span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl p-12 text-center text-gray-400 dark:text-gray-500">
                  لا يوجد حكام مطابقون
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RefereesTiles;
