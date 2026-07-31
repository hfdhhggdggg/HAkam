import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

const RANK_FULL = {
  international: 'مساعد حكم دولي',
  first: 'مساعد حكم درجة أولى',
  second: 'مساعد حكم درجة ثانية',
};

const TEAL = '#147B60';

function getLimitForRank(rank, config) {
  if (rank === 'international') return Number(config.limitInternational);
  if (rank === 'first') return Number(config.limitFirst);
  if (rank === 'second') return Number(config.limitSecond);
  return null;
}

function computeStatus(time1, time2, limit) {
  if (!time1 && time1 !== 0) return 'pending';
  const t1 = Number(time1);
  if (t1 <= limit) return 'pass';
  if (time2 === '' || time2 === null || time2 === undefined) return 'retry';
  const t2 = Number(time2);
  if (t2 <= limit) return 'pass';
  return 'fail';
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'لسه معملش', cls: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' },
    pass: { label: '✓ ناجح', cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
    retry: { label: '⚠ محاولة إضافية مطلوبة', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
    fail: { label: '✗ راسب', cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function CodaResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { config, selectedReferees, groups, testDate } = location.state || {};

  // Redirect back if no data
  useEffect(() => {
    if (!config || !selectedReferees) navigate('/fitness/coda', { replace: true });
  }, [config, selectedReferees]);

  const [results, setResults] = useState(() => {
    if (!selectedReferees) return {};
    const init = {};
    selectedReferees.forEach(r => {
      init[r.id] = { time1: '', time2: '', result: 'pending' };
    });
    return init;
  });

  function handleTimeChange(refId, field, val) {
    if (val !== '' && (isNaN(val) || Number(val) < 0)) return;
    setResults(prev => {
      const cur = prev[refId] || { time1: '', time2: '' };
      const updated = { ...cur, [field]: val };
      const limit = getLimitForRank(
        selectedReferees.find(r => r.id === refId)?.rank,
        config
      );
      updated.result = computeStatus(updated.time1, updated.time2, limit);
      return { ...prev, [refId]: updated };
    });
  }

  // Group referees
  const groupedReferees = useMemo(() => {
    if (!groups || groups.length === 0) {
      return [{ name: 'كل المشاركين', referees: selectedReferees || [] }];
    }
    return groups.map(g => ({
      name: g.name,
      referees: (selectedReferees || []).filter(r => g.refereeIds.includes(r.id)),
    }));
  }, [groups, selectedReferees]);

  const enteredCount = Object.values(results).filter(r => r.time1 !== '').length;
  const totalCount = selectedReferees?.length || 0;
  const allEntered = enteredCount === totalCount;

  function handleSaveAll() {
    // In a real app this would persist to Supabase; here we just navigate back
    navigate('/fitness/coda');
  }

  if (!config || !selectedReferees) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow pb-28">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                  تسجيل النتائج — اختبار CODA
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {testDate} — عدد المشاركين: {totalCount} حكم
                </p>
              </div>
              <button
                onClick={() => navigate('/fitness/coda')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                رجوع لصفحة الإعداد
              </button>
            </div>

            {/* Referee cards by group */}
            {groupedReferees.map((grp, gi) => (
              <div key={gi}>
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  {grp.name} ({grp.referees.length} حكم)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {grp.referees.map(ref => {
                    const r = results[ref.id] || { time1: '', time2: '', result: 'pending' };
                    const limit = getLimitForRank(ref.rank, config);
                    const showRetry = r.result === 'retry' || (r.time1 !== '' && r.time2 !== '');
                    return (
                      <div
                        key={ref.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-4 flex flex-wrap items-center gap-4"
                      >
                        {/* Right: avatar + name */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img src={ref.avatar} alt={ref.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{ref.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{RANK_FULL[ref.rank]}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">الحد: {limit}ث</p>
                          </div>
                        </div>

                        {/* Center: time input(s) + status */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <input
                                type="number"
                                step="0.01"
                                value={r.time1}
                                onChange={e => handleTimeChange(ref.id, 'time1', e.target.value)}
                                placeholder="الزمن"
                                className="form-input w-24 pe-8 text-center text-lg font-bold"
                              />
                              <span className="absolute inset-y-0 end-2 flex items-center text-xs text-gray-400">ث</span>
                            </div>
                            {showRetry && (
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={r.time2}
                                  onChange={e => handleTimeChange(ref.id, 'time2', e.target.value)}
                                  placeholder="إعادة"
                                  className="form-input w-20 pe-7 text-center text-sm font-bold border-amber-400"
                                />
                                <span className="absolute inset-y-0 end-1.5 flex items-center text-xs text-gray-400">ث</span>
                              </div>
                            )}
                          </div>
                          <StatusBadge status={r.result} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>
        </main>

        {/* Sticky footer */}
        <div className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 z-20">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              تم إدخال <span className="font-bold text-[#147B60]">{enteredCount}</span> من {totalCount}
            </div>
            <button
              onClick={handleSaveAll}
              disabled={!allEntered}
              className={`px-8 py-3 rounded-xl text-sm font-bold text-white transition-all ${
                allEntered
                  ? 'bg-[#147B60] hover:bg-[#0D6E63] shadow-md hover:shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              }`}
            >
              حفظ كل النتائج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
