import React, { useState, useMemo } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { referees, rankLabels } from '../lib/mockData';
import DropdownEditMenu from '../components/DropdownEditMenu';

const tabs = [
  { id: 'all', label: 'الكل' },
  { id: 'international', label: 'دولي' },
  { id: 'first', label: 'درجة أولى' },
  { id: 'second', label: 'درجة ثانية' },
];

const statusPills = {
  active: { label: 'نشط', className: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  inactive: { label: 'غير نشط', className: 'bg-gray-500/10 text-gray-500 dark:text-gray-400' },
  pending: { label: 'معلّق', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
};

const defaultAvatar = (
  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" />
  </svg>
);

function RefereesTabs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filteredReferees = useMemo(() => {
    return referees.filter((r) => {
      const matchesTab = activeTab === 'all' || r.rank === activeTab;
      const matchesSearch = !search ||
        r.fullName.includes(search) ||
        r.nationalId.includes(search);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">قائمة الحكام</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filteredReferees.length} حكم</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث بالاسم أو الرقم القومي…"
                  className="form-input w-full sm:w-72 pr-10"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="text-xs uppercase text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700/60">
                      <th className="text-right font-semibold px-5 py-3">الحكم</th>
                      <th className="text-right font-semibold px-5 py-3">الرتبة</th>
                      <th className="text-right font-semibold px-5 py-3">المحافظة</th>
                      <th className="text-right font-semibold px-5 py-3">آخر اختبار</th>
                      <th className="text-right font-semibold px-5 py-3">الحالة</th>
                      <th className="text-center font-semibold px-5 py-3">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReferees.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-gray-500 dark:text-gray-400 py-12">لا توجد نتائج مطابقة</td>
                      </tr>
                    ) : (
                      filteredReferees.map((ref) => (
                        <tr key={ref.id} className="border-b last:border-0 border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden">
                                {defaultAvatar}
                              </div>
                              <span className="font-medium text-gray-800 dark:text-gray-100 ms-3">{ref.fullName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{rankLabels[ref.rank]}</td>
                          <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{ref.governorate}</td>
                          <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{ref.lastTestDate || '—'}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusPills[ref.status]?.className || statusPills.inactive.className}`}>
                              {statusPills[ref.status]?.label || ref.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <DropdownEditMenu
                              align="left"
                              className="relative inline-flex"
                            >
                              <li><a className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 flex items-center gap-2 py-1 px-3" href="#0">عرض الملف</a></li>
                              <li><a className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 flex items-center gap-2 py-1 px-3" href="#0">تعديل</a></li>
                            </DropdownEditMenu>
                          </td>
                        </tr>
                      ))
                    )}
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

export default RefereesTabs;
