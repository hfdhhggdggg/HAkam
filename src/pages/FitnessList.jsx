import React, { useState, useMemo } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import Transition from '../utils/Transition';
import DropdownEditMenu from '../components/DropdownEditMenu';
import {
  referees,
  rankLabels,
  testResults as initialResults,
  kanbanTests,
  seasons,
  intervalTestThresholds,
  rsaTestThreshold,
  testTypeShort,
} from '../lib/mockData';

const statusPills = {
  pass: { label: 'ناجح', className: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  fail: { label: 'راسب', className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
};

// ---- Interval test sub-component ----
function IntervalTestForm({ referee, thresholds, computed, setComputed }) {
  const [shuttles, setShuttles] = useState([
    { runTime: '', walkTime: '', walkDelay: false, failed: false },
    { runTime: '', walkTime: '', walkDelay: false, failed: false },
    { runTime: '', walkTime: '', walkDelay: false, failed: false },
    { runTime: '', walkTime: '', walkDelay: false, failed: false },
    { runTime: '', walkTime: '', walkDelay: false, failed: false },
    { runTime: '', walkTime: '', walkDelay: false, failed: false },
  ]);
  const [extraShuttle, setExtraShuttle] = useState(null);
  const [walkDelayCount, setWalkDelayCount] = useState(0);
  const [autoFailReason, setAutoFailReason] = useState(null);

  const rankKey = ['international', 'first', 'second'].includes(referee.rank) ? referee.rank : 'lower';
  const limits = thresholds[rankKey];

  const evaluateShuttle = (idx, field, value) => {
    const updated = [...shuttles];
    updated[idx] = { ...updated[idx], [field]: value };
    setShuttles(updated);
    recompute(updated, extraShuttle, walkDelayCount);
  };

  const toggleWalkDelay = (idx) => {
    const updated = [...shuttles];
    const current = updated[idx].walkDelay;
    updated[idx] = { ...updated[idx], walkDelay: !current };
    setShuttles(updated);
    const newCount = !current ? walkDelayCount + 1 : walkDelayCount - 1;
    setWalkDelayCount(newCount);
    if (newCount >= 2) {
      setAutoFailReason('تأخر دخول منطقة المشي (مرتين)');
      recompute(updated, extraShuttle, newCount, true);
    } else {
      recompute(updated, extraShuttle, newCount);
    }
  };

  const evaluateExtra = (field, value) => {
    const updated = { ...extraShuttle, [field]: value };
    setExtraShuttle(updated);
    recompute(shuttles, updated, walkDelayCount);
  };

  const toggleExtraWalkDelay = () => {
    const current = extraShuttle.walkDelay;
    const updated = { ...extraShuttle, walkDelay: !current };
    setExtraShuttle(updated);
    const newCount = !current ? walkDelayCount + 1 : walkDelayCount - 1;
    setWalkDelayCount(newCount);
    if (newCount >= 2) {
      setAutoFailReason('تأخر دخول منطقة المشي (مرتين)');
      recompute(shuttles, updated, newCount, true);
    } else {
      recompute(shuttles, updated, newCount);
    }
  };

  const recompute = (shuts, extra, delayCount, forceFail = false) => {
    let failCount = 0;
    let reasons = [];
    shuts.forEach((s, i) => {
      if (s.runTime && parseFloat(s.runTime) > limits.runLimit) {
        failCount++;
        if (!reasons.includes('تأخر جري')) reasons.push('تأخر جري');
      }
      if (s.walkTime && parseFloat(s.walkTime) > limits.walkLimit) {
        failCount++;
        if (!reasons.includes('تأخر مشي')) reasons.push('تأخر مشي');
      }
    });
    if (extra && extra.runTime && parseFloat(extra.runTime) > limits.runLimit) {
      failCount++;
      if (!reasons.includes('تأخر جري')) reasons.push('تأخر جري');
    }
    if (extra && extra.walkTime && parseFloat(extra.walkTime) > limits.walkLimit) {
      failCount++;
      if (!reasons.includes('تأخر مشي')) reasons.push('تأخر مشي');
    }

    // Auto-add extra shuttle on first failure
    if (failCount >= 1 && failCount < 2 && !extra) {
      setExtraShuttle({ runTime: '', walkTime: '', walkDelay: false, failed: false });
    }

    let finalResult = 'pass';
    let finalReason = null;
    if (forceFail || delayCount >= 2) {
      finalResult = 'fail';
      finalReason = 'تأخر دخول منطقة المشي (مرتين)';
    } else if (failCount >= 2) {
      finalResult = 'fail';
      finalReason = reasons.join(' / ') || 'فشل شوطين';
    } else if (failCount === 1) {
      finalResult = 'pass';
      finalReason = null;
    } else {
      finalResult = 'pass';
      finalReason = null;
    }
    setComputed({ result: finalResult, failureReason: finalReason, failCount, totalShuttles: shuts.length + (extra ? 1 : 0) });
  };

  return (
    <div className="space-y-3">
      <div className="bg-violet-50 dark:bg-violet-500/10 rounded-lg p-3 text-sm text-violet-700 dark:text-violet-300">
        <p className="font-medium mb-1">بروتوكول اختبار الفواصل الزمنية (Interval)</p>
        <p>6 أشواط × (75م جري + 25م مشي) — حد الجري: {limits.runLimit}ث، حد المشي: {limits.walkLimit}ث</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700/60">
              <th className="text-right py-2 px-2">الشوط</th>
              <th className="text-center py-2 px-2">زمن الجري (ث)</th>
              <th className="text-center py-2 px-2">حد الجري</th>
              <th className="text-center py-2 px-2">زمن المشي (ث)</th>
              <th className="text-center py-2 px-2">حد المشي</th>
              <th className="text-center py-2 px-2">تأخر دخول المشي</th>
            </tr>
          </thead>
          <tbody>
            {shuttles.map((s, i) => {
              const runFailed = s.runTime && parseFloat(s.runTime) > limits.runLimit;
              const walkFailed = s.walkTime && parseFloat(s.walkTime) > limits.walkLimit;
              return (
                <tr key={i} className="border-b last:border-0 border-gray-100 dark:border-gray-700/60">
                  <td className="py-2 px-2 font-medium text-gray-700 dark:text-gray-200">شوط {i + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      step="0.1"
                      value={s.runTime}
                      onChange={(e) => evaluateShuttle(i, 'runTime', e.target.value)}
                      className={`form-input w-20 text-center ${runFailed ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}`}
                      placeholder="0.0"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-500 dark:text-gray-400">{limits.runLimit}</td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      step="0.1"
                      value={s.walkTime}
                      onChange={(e) => evaluateShuttle(i, 'walkTime', e.target.value)}
                      className={`form-input w-20 text-center ${walkFailed ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}`}
                      placeholder="0.0"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-500 dark:text-gray-400">{limits.walkLimit}</td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={s.walkDelay}
                      onChange={() => toggleWalkDelay(i)}
                      className="rounded"
                    />
                  </td>
                </tr>
              );
            })}
            {extraShuttle && (
              <tr className="border-b last:border-0 border-gray-100 dark:border-gray-700/60 bg-amber-50 dark:bg-amber-500/10">
                <td className="py-2 px-2 font-medium text-amber-700 dark:text-amber-300">شوط 7 (تعويضي)</td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.1"
                    value={extraShuttle.runTime}
                    onChange={(e) => evaluateExtra('runTime', e.target.value)}
                    className="form-input w-20 text-center"
                    placeholder="0.0"
                  />
                </td>
                <td className="py-2 px-2 text-center text-gray-500 dark:text-gray-400">{limits.runLimit}</td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.1"
                    value={extraShuttle.walkTime}
                    onChange={(e) => evaluateExtra('walkTime', e.target.value)}
                    className="form-input w-20 text-center"
                    placeholder="0.0"
                  />
                </td>
                <td className="py-2 px-2 text-center text-gray-500 dark:text-gray-400">{limits.walkLimit}</td>
                <td className="py-2 px-2 text-center">
                  <input
                    type="checkbox"
                    checked={extraShuttle.walkDelay}
                    onChange={toggleExtraWalkDelay}
                    className="rounded"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {walkDelayCount === 1 && (
        <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-300">
          تحذير: تأخر دخول منطقة المشي لأول مرة — تحذير فقط، يكمل الاختبار عاديًا.
        </div>
      )}
      {walkDelayCount >= 2 && (
        <div className="bg-red-50 dark:bg-red-500/10 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">
          إيقاف الاختبار: تأخر دخول منطقة المشي لمرتين — النتيجة النهائية: راسب تلقائيًا.
        </div>
      )}
    </div>
  );
}

// ---- RSA test sub-component ----
function RsaTestForm({ referee, computed, setComputed }) {
  const [sprints, setSprints] = useState(['', '', '', '', '', '']);

  const evaluate = (idx, value) => {
    const updated = [...sprints];
    updated[idx] = value;
    setSprints(updated);
    const failedSprints = updated.filter((t) => t && parseFloat(t) > rsaTestThreshold).length;
    const result = failedSprints >= 2 ? 'fail' : 'pass';
    const reason = failedSprints >= 2 ? `تجاوز الحد الزمني في ${failedSprints} سبرنت` : null;
    setComputed({ result, failureReason: reason, failCount: failedSprints, totalShuttles: 6 });
  };

  return (
    <div className="space-y-3">
      <div className="bg-pink-50 dark:bg-pink-500/10 rounded-lg p-3 text-sm text-pink-700 dark:text-pink-300">
        <p className="font-medium mb-1">بروتوكول اختبار السرعة المتكررة (RSA)</p>
        <p>6 × 40م سبرنت — الحد الزمني المسموح لكل سبرنت: {rsaTestThreshold}ث (قابل للتعديل)</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sprints.map((time, i) => {
          const failed = time && parseFloat(time) > rsaTestThreshold;
          return (
            <div key={i}>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">سبرنت {i + 1}</label>
              <input
                type="number"
                step="0.01"
                value={time}
                onChange={(e) => evaluate(i, e.target.value)}
                className={`form-input w-full text-center ${failed ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}`}
                placeholder="0.00"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Main page ----
function FitnessList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [results, setResults] = useState(initialResults);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterSeason, setFilterSeason] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterResult, setFilterResult] = useState('all');

  // Modal form state
  const [selectedReferee, setSelectedReferee] = useState('');
  const [testType, setTestType] = useState('interval');
  const [computed, setComputed] = useState({ result: null, failureReason: null });
  const [failureReason, setFailureReason] = useState('');

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      if (filterSeason !== 'all' && r.season !== filterSeason) return false;
      if (filterType !== 'all' && r.testType !== filterType) return false;
      if (filterResult !== 'all' && r.result !== filterResult) return false;
      return true;
    });
  }, [results, filterSeason, filterType, filterResult]);

  const openModal = () => {
    setSelectedReferee('');
    setTestType('interval');
    setComputed({ result: null, failureReason: null });
    setFailureReason('');
    setModalOpen(true);
  };

  const saveResult = () => {
    if (!selectedReferee) return;
    const ref = referees.find((r) => r.id === selectedReferee);
    if (!ref) return;
    const finalReason = computed.result === 'fail'
      ? (failureReason || computed.failureReason || 'غير محدد')
      : null;
    const newResult = {
      id: `tr${Date.now()}`,
      refereeId: ref.id,
      refereeName: ref.fullName,
      testType,
      season: seasons[seasons.length - 1],
      result: computed.result || 'pass',
      failureReason: finalReason,
      testDate: new Date().toISOString().split('T')[0],
    };
    setResults((prev) => [newResult, ...prev]);
    setModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">اختبارات اللياقة</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filteredResults.length} نتيجة مسجّلة</p>
              </div>
              <button
                onClick={openModal}
                className="btn bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
              >
                <svg className="fill-current shrink-0" width="16" height="16" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span>تسجيل نتيجة اختبار جديد</span>
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select value={filterSeason} onChange={(e) => setFilterSeason(e.target.value)} className="form-select w-40">
                <option value="all">كل المواسم</option>
                {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="form-select w-40">
                <option value="all">كل الأنواع</option>
                <option value="interval">Interval</option>
                <option value="rsa">RSA</option>
              </select>
              <select value={filterResult} onChange={(e) => setFilterResult(e.target.value)} className="form-select w-40">
                <option value="all">كل النتائج</option>
                <option value="pass">ناجح</option>
                <option value="fail">راسب</option>
              </select>
            </div>

            {/* Results table */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="text-xs uppercase text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700/60">
                      <th className="text-right font-semibold px-5 py-3">الحكم</th>
                      <th className="text-right font-semibold px-5 py-3">نوع الاختبار</th>
                      <th className="text-right font-semibold px-5 py-3">الموسم</th>
                      <th className="text-right font-semibold px-5 py-3">النتيجة</th>
                      <th className="text-right font-semibold px-5 py-3">سبب الفشل</th>
                      <th className="text-right font-semibold px-5 py-3">التاريخ</th>
                      <th className="text-center font-semibold px-5 py-3">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.length === 0 ? (
                      <tr><td colSpan={7} className="text-center text-gray-500 dark:text-gray-400 py-12">لا توجد نتائج</td></tr>
                    ) : (
                      filteredResults.map((r) => (
                        <tr key={r.id} className="border-b last:border-0 border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">{r.refereeName}</td>
                          <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{testTypeShort[r.testType]}</td>
                          <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{r.season}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusPills[r.result].className}`}>
                              {statusPills[r.result].label}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{r.failureReason || '—'}</td>
                          <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{r.testDate}</td>
                          <td className="px-5 py-3 text-center">
                            <DropdownEditMenu align="left" className="relative inline-flex">
                              <li><a className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 flex items-center gap-2 py-1 px-3" href="#0">عرض</a></li>
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

      {/* Result entry modal */}
      <Transition show={modalOpen} appear enter="transition ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
          <Transition show={modalOpen} appear enter="transition ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">تسجيل نتيجة اختبار جديد</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Common fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">الحكم</label>
                  <select value={selectedReferee} onChange={(e) => setSelectedReferee(e.target.value)} className="form-select w-full">
                    <option value="">اختر الحكم…</option>
                    {referees.map((r) => <option key={r.id} value={r.id}>{r.fullName} — {rankLabels[r.rank]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">نوع الاختبار</label>
                  <select value={testType} onChange={(e) => { setTestType(e.target.value); setComputed({ result: null, failureReason: null }); }} className="form-select w-full">
                    <option value="interval">الفواصل الزمنية (Interval)</option>
                    <option value="rsa">السرعة المتكررة (RSA)</option>
                  </select>
                </div>
              </div>

              {/* Test-specific form */}
              {selectedReferee && testType === 'interval' && (
                <IntervalTestForm referee={referees.find((r) => r.id === selectedReferee)} thresholds={intervalTestThresholds} computed={computed} setComputed={setComputed} />
              )}
              {selectedReferee && testType === 'rsa' && (
                <RsaTestForm referee={referees.find((r) => r.id === selectedReferee)} computed={computed} setComputed={setComputed} />
              )}

              {/* Computed result preview */}
              {computed.result && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">النتيجة المحسوبة تلقائيًا:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusPills[computed.result].className}`}>
                      {statusPills[computed.result].label}
                    </span>
                  </div>
                  {computed.result === 'fail' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">سبب الفشل</label>
                      <input
                        type="text"
                        value={failureReason || computed.failureReason || ''}
                        onChange={(e) => setFailureReason(e.target.value)}
                        className="form-input w-full"
                        placeholder={computed.failureReason || 'أدخل سبب الفشل…'}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors">
                  إلغاء
                </button>
                <button
                  onClick={saveResult}
                  disabled={!selectedReferee || !computed.result}
                  className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  حفظ النتيجة
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  );
}

export default FitnessList;
