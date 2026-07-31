import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { supabase } from '../lib/supabaseClient';

const RANK_DISPLAY = {
  international: 'حكم دولي',
  first: 'حكم درجة أولى',
  second: 'حكم درجة ثانية',
};

const TEAL = '#147B60';

function getLimitForRank(rank, config) {
  const limits = config?.limits || {};
  return limits[rank] ?? null;
}

function computeAttemptStatus(time, limit) {
  if (time === '' || time === null || time === undefined) return 'pending';
  const t = Number(time);
  if (t <= limit) return 'pass';
  return 'fail';
}

function computeOverallStatus(times, limit, attemptsCount) {
  const entered = times.filter(t => t !== '' && t !== null && t !== undefined);
  if (entered.length === 0) return 'pending';

  const fails = entered.filter(t => Number(t) > limit).length;
  const passes = entered.length - fails;

  // Rule: 2 failures out of 7 = fail
  if (fails >= 2) return 'fail';

  // If all required attempts entered and less than 2 fails = pass
  if (entered.length >= attemptsCount && fails < 2) return 'pass';

  return 'in_progress';
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'جاري', cls: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' },
    in_progress: { label: 'جاري', cls: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' },
    pass: { label: '✓ ناجح', cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
    fail: { label: '✗ راسب', cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${s.cls}`}>
      {s.label}
    </span>
  );
}

function ProgressCircle({ filled, total }) {
  const pct = total > 0 ? (filled / total) * 100 : 0;
  const r = 14;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-9 h-9 shrink-0">
      <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#E5E7EB" strokeWidth="3" className="dark:stroke-gray-600" />
        <circle
          cx="18" cy="18" r={r} fill="none" stroke={TEAL} strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={circ - (pct / 100) * circ}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700 dark:text-gray-200">
        {filled}/{total}
      </span>
    </div>
  );
}

export default function RSAResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { config, selectedReferees, groups, testDate, sessionId } = location.state || {};

  useEffect(() => {
    if (!config || !selectedReferees) navigate('/fitness/rsa', { replace: true });
  }, [config, selectedReferees]);

  const attemptsCount = config?.attemptsCount || 6;

  const [results, setResults] = useState(() => {
    if (!selectedReferees) return {};
    const init = {};
    selectedReferees.forEach(r => {
      init[r.id] = {
        times: Array(attemptsCount).fill(''),
        extraTime: '',
        result: 'pending',
      };
    });
    return init;
  });

  const [expanded, setExpanded] = useState(() => {
    if (!selectedReferees) return {};
    const init = {};
    selectedReferees.forEach(r => { init[r.id] = false; });
    return init;
  });

  function handleTimeChange(refId, idx, val, isExtra = false) {
    if (val !== '' && (isNaN(val) || Number(val) < 0)) return;
    setResults(prev => {
      const cur = prev[refId] || { times: Array(attemptsCount).fill(''), extraTime: '', result: 'pending' };
      let times = [...cur.times];
      let extraTime = cur.extraTime;
      if (isExtra) {
        extraTime = val;
      } else {
        times[idx] = val;
      }
      const allTimes = [...times];
      if (extraTime !== '') allTimes.push(extraTime);
      const limit = getLimitForRank(
        selectedReferees.find(r => r.id === refId)?.rank,
        config
      );
      const result = computeOverallStatus(allTimes, limit, attemptsCount);
      return { ...prev, [refId]: { times, extraTime, result } };
    });
  }

  const groupedReferees = useMemo(() => {
    if (!groups || groups.length === 0) {
      return [{ name: 'كل المشاركين', referees: selectedReferees || [] }];
    }
    return groups.map(g => ({
      name: g.name,
      referees: (selectedReferees || []).filter(r => g.refereeIds.includes(r.id)),
    }));
  }, [groups, selectedReferees]);

  const completedCount = Object.values(results).filter(r => r.result === 'pass' || r.result === 'fail').length;
  const totalCount = selectedReferees?.length || 0;
  const allCompleted = completedCount === totalCount;

  async function handleSaveAll() {
    if (!sessionId) {
      navigate('/fitness/rsa');
      return;
    }
    try {
      const rows = selectedReferees.map(ref => {
        const r = results[ref.id] || { times: [], extraTime: '', result: 'pending' };
        return {
          session_id: sessionId,
          referee_id: ref.id,
          referee_name: ref.name,
          referee_rank: ref.rank,
          times_json: r.times.map(t => t !== '' ? Number(t) : null),
          extra_time: r.extraTime !== '' ? Number(r.extraTime) : null,
          result: r.result,
        };
      });
      const { error } = await supabase.from('rsa_test_results').insert(rows);
      if (error) throw error;
      navigate('/fitness/rsa');
    } catch (err) {
      console.error('Failed to save RSA results:', err.message);
      alert('تعذر حفظ النتائج في قاعدة البيانات.');
    }
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
                  تسجيل النتائج — اختبار RSA
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {testDate} — عدد المشاركين: {totalCount} حكم
                </p>
              </div>
              <button
                onClick={() => navigate('/fitness/rsa')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                رجوع لصفحة الإعداد
              </button>
            </div>

            {/* Referee accordion cards by group */}
            {groupedReferees.map((grp, gi) => (
              <div key={gi}>
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  {grp.name} ({grp.referees.length} حكم)
                </h2>
                <div className="space-y-3">
                  {grp.referees.map(ref => {
                    const r = results[ref.id] || { times: Array(attemptsCount).fill(''), extraTime: '', result: 'pending' };
                    const limit = getLimitForRank(ref.rank, config);
                    const isOpen = expanded[ref.id];
                    const enteredCount = r.times.filter(t => t !== '').length + (r.extraTime !== '' ? 1 : 0);
                    const showExtra = r.times.some(t => t !== '' && Number(t) > limit);

                    return (
                      <div key={ref.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-xs overflow-hidden">
                        {/* Card header (always visible) */}
                        <button
                          onClick={() => setExpanded(prev => ({ ...prev, [ref.id]: !prev[ref.id] }))}
                          className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                        >
                          {ref.avatar ? (
                            <img src={ref.avatar} alt={ref.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#E6F2EF] flex items-center justify-center text-[#147B60] text-sm font-bold shrink-0">
                              {ref.name?.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0 text-start">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{ref.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {RANK_DISPLAY[ref.rank] || ref.rank} — الحد: {limit}ث
                            </p>
                          </div>
                          <ProgressCircle filled={enteredCount} total={attemptsCount} />
                          <StatusBadge status={r.result} />
                          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 12 12">
                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                          </svg>
                        </button>

                        {/* Card body (expandable) */}
                        {isOpen && (
                          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex flex-wrap gap-2 mt-4">
                              {r.times.map((time, idx) => {
                                const status = computeAttemptStatus(time, limit);
                                const borderCls = {
                                  pending: 'border-gray-300 dark:border-gray-600',
                                  pass: 'border-green-400 bg-green-50 dark:bg-green-900/20',
                                  fail: 'border-red-400 bg-red-50 dark:bg-red-900/20',
                                }[status];
                                return (
                                  <div key={idx} className={`relative rounded-lg border-2 ${borderCls} p-2 transition-colors`}>
                                    <span className="block text-[10px] text-gray-400 text-center mb-1">محاولة {idx + 1}</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={time}
                                      onChange={e => handleTimeChange(ref.id, idx, e.target.value)}
                                      placeholder="—"
                                      className="w-16 text-center text-sm font-bold bg-transparent border-0 focus:ring-0 p-0 text-gray-800 dark:text-gray-100"
                                    />
                                  </div>
                                );
                              })}
                              {showExtra && (
                                <div className="relative rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 transition-colors">
                                  <span className="block text-[10px] text-amber-500 text-center mb-1">إضافية</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={r.extraTime}
                                    onChange={e => handleTimeChange(ref.id, -1, e.target.value, true)}
                                    placeholder="—"
                                    className="w-16 text-center text-sm font-bold bg-transparent border-0 focus:ring-0 p-0 text-gray-800 dark:text-gray-100"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Summary line */}
                            {enteredCount > 0 && (
                              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                {(() => {
                                  const allTimes = [...r.times, r.extraTime].filter(t => t !== '');
                                  const best = Math.min(...allTimes.map(Number));
                                  const passCount = allTimes.filter(t => Number(t) <= limit).length;
                                  return `أفضل زمن: ${best} ث | عدد المحاولات الناجحة: ${passCount} من ${attemptsCount}`;
                                })()}
                              </p>
                            )}
                          </div>
                        )}
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
              تم إكمال <span className="font-bold text-[#147B60]">{completedCount}</span> من {totalCount} حكم
            </div>
            <button
              onClick={handleSaveAll}
              disabled={!allCompleted}
              className={`px-8 py-3 rounded-xl text-sm font-bold text-white transition-all ${
                allCompleted ? 'bg-[#147B60] hover:bg-[#0D6E63] shadow-md hover:shadow-lg' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
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
