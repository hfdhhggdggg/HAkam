import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { referees, rankLabels } from '../lib/mockData';

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
  <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" />
  </svg>
);

function RefereesTiles() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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

            {/* Tabs + Search */}
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

            {/* Grid */}
            {filteredReferees.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">لا توجد نتائج مطابقة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredReferees.map((ref) => (
                  <div key={ref.id} className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden mb-3">
                      {defaultAvatar}
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{ref.fullName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{rankLabels[ref.rank]}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-4 ${statusPills[ref.status]?.className || statusPills.inactive.className}`}>
                      {statusPills[ref.status]?.label || ref.status}
                    </span>
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20 text-sm font-medium transition-colors"
                    >
                      عرض الملف
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default RefereesTiles;
