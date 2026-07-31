import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { supabase } from '../lib/supabaseClient';

const TEAL = '#147B60';
const NAVY = '#0F2D4A';

const RANK_LABELS = {
  international: 'حكم دولي',
  international_ast: 'مساعد حكم دولي',
  first: 'حكم درجة أولى',
  first_ast: 'مساعد حكم درجة أولى',
  second: 'حكم درجة ثانية',
  second_ast: 'مساعد حكم درجة ثانية',
};

const RANK_DISPLAY = {
  international: 'حكم دولي',
  first: 'حكم درجة أولى',
  second: 'حكم درجة ثانية',
};

function Badge({ children, variant = 'gray' }) {
  const cls = {
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    teal: 'bg-[#E6F2EF] text-[#147B60]',
  }[variant];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

export default function RSASetup() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cfg, setCfg] = useState({
    distanceBefore: 1.5,
    sprintDistance: 40,
    attemptsCount: 6,
    restSeconds: 60,
  });

  const [limits, setLimits] = useState({
    international: '',
    international_ast: '',
    first: '',
    first_ast: '',
    second: '',
    second_ast: '',
  });

  const [configId, setConfigId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [limitErrors, setLimitErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [referees, setReferees] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [showGroupInput, setShowGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [configRes, refRes] = await Promise.all([
          supabase.from('rsa_test_configs').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('referees').select('*').order('name'),
        ]);
        if (configRes.data) {
          const d = configRes.data;
          setConfigId(d.id);
          setCfg({
            distanceBefore: d.distance_before_m ?? 1.5,
            sprintDistance: d.sprint_distance_m ?? 40,
            attemptsCount: d.attempts_count ?? 6,
            restSeconds: d.rest_seconds ?? 60,
          });
          setLimits({
            international: d.limit_ref_international ?? '',
            international_ast: d.limit_ast_international ?? '',
            first: d.limit_ref_first ?? '',
            first_ast: d.limit_ast_first ?? '',
            second: d.limit_ref_second ?? '',
            second_ast: d.limit_ast_second ?? '',
          });
        }
        if (refRes.data) setReferees(refRes.data);
      } catch (err) {
        console.warn('RSA config load error:', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const limitsComplete = Object.values(limits).every(v => v !== '');

  async function handleSave() {
    const errors = {};
    Object.keys(limits).forEach(k => { if (!limits[k]) errors[k] = true; });
    if (Object.keys(errors).length) { setLimitErrors(errors); return; }
    setLimitErrors({});

    const payload = {
      distance_before_m: Number(cfg.distanceBefore),
      sprint_distance_m: Number(cfg.sprintDistance),
      attempts_count: Number(cfg.attemptsCount),
      rest_seconds: Number(cfg.restSeconds),
      limit_ref_international: Number(limits.international),
      limit_ast_international: Number(limits.international_ast),
      limit_ref_first: Number(limits.first),
      limit_ast_first: Number(limits.first_ast),
      limit_ref_second: Number(limits.second),
      limit_ast_second: Number(limits.second_ast),
      updated_at: new Date().toISOString(),
    };

    try {
      if (configId) {
        const { error } = await supabase.from('rsa_test_configs').update(payload).eq('id', configId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('rsa_test_configs').insert(payload).select().single();
        if (error) throw error;
        setConfigId(data.id);
      }
      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); setEditOpen(false); }, 1200);
    } catch (err) {
      console.error('Failed to save RSA config:', err.message);
      alert('تعذر حفظ الإعدادات. تأكد من تشغيل RSA_MIGRATION.sql أولاً.');
    }
  }

  function handleLimitChange(key, val) {
    if (val !== '' && (isNaN(val) || Number(val) < 0)) return;
    setLimits(prev => ({ ...prev, [key]: val }));
    if (limitErrors[key]) setLimitErrors(prev => ({ ...prev, [key]: false }));
  }

  function toggleReferee(id) {
    setSelectedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  const displayedReferees = (() => {
    let list = referees;
    if (activeGroupId) {
      const grp = groups.find(g => g.id === activeGroupId);
      if (grp) list = list.filter(r => grp.refereeIds.includes(r.id));
    }
    return list;
  })();

  const filteredReferees = displayedReferees.filter(r => {
    const matchSearch = r.name.includes(search) || (RANK_DISPLAY[r.rank] || '').includes(search);
    return matchSearch;
  });

  const allVisibleSelected = filteredReferees.length > 0 && filteredReferees.every(r => selectedIds.has(r.id));

  function selectAll() {
    const visible = filteredReferees.map(r => r.id);
    setSelectedIds(prev => {
      const s = new Set(prev);
      const allSel = visible.every(id => s.has(id));
      if (allSel) visible.forEach(id => s.delete(id));
      else visible.forEach(id => s.add(id));
      return s;
    });
  }

  function createGroup() {
    if (!newGroupName.trim()) return;
    const gid = `g-${Date.now()}`;
    setGroups(prev => [...prev, { id: gid, name: newGroupName.trim(), refereeIds: [...selectedIds] }]);
    setNewGroupName('');
    setShowGroupInput(false);
    setActiveGroupId(gid);
  }

  const canStart = limitsComplete && selectedIds.size > 0;

  async function handleStart() {
    if (!canStart) return;
    const selected = referees.filter(r => selectedIds.has(r.id));
    const configData = {
      distanceBefore: Number(cfg.distanceBefore),
      sprintDistance: Number(cfg.sprintDistance),
      attemptsCount: Number(cfg.attemptsCount),
      restSeconds: Number(cfg.restSeconds),
      limits: {
        international: Number(limits.international),
        international_ast: Number(limits.international_ast),
        first: Number(limits.first),
        first_ast: Number(limits.first_ast),
        second: Number(limits.second),
        second_ast: Number(limits.second_ast),
      },
    };

    try {
      let sessionId = null;
      if (configId) {
        const { data, error } = await supabase.from('rsa_test_sessions').insert({
          config_id: configId,
          test_date: new Date().toISOString().split('T')[0],
          referee_ids: selected.map(r => r.id),
          groups_json: groups.filter(g => g.refereeIds.some(id => selectedIds.has(id))),
        }).select().single();
        if (!error) sessionId = data.id;
      }
      navigate('/fitness/rsa/results', {
        state: {
          config: configData,
          selectedReferees: selected,
          groups: groups.filter(g => g.refereeIds.some(id => selectedIds.has(id))),
          testDate: new Date().toLocaleDateString('ar-EG'),
          sessionId,
          configId,
        },
      });
    } catch (err) {
      console.error('Failed to create RSA session:', err.message);
      navigate('/fitness/rsa/results', {
        state: {
          config: configData,
          selectedReferees: selected,
          groups: groups.filter(g => g.refereeIds.some(id => selectedIds.has(id))),
          testDate: new Date().toLocaleDateString('ar-EG'),
        },
      });
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow pb-28">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto space-y-6">

            {/* Page header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">اختبار RSA</h1>
                  <Badge variant="gray">كل الحكام</Badge>
                  <Badge variant="teal">اختبار FIFA رسمي</Badge>
                </div>
                <p className="text-sm text-[#64748B] dark:text-gray-400">
                  Repeated Sprint Ability — قياس السرعة المتكررة
                </p>
              </div>
              <button
                onClick={() => setEditOpen(v => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#147B60] text-[#147B60] text-sm font-medium hover:bg-[#E6F2EF] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                تعديل تفاصيل الاختبار
              </button>
            </div>

            {/* Diagram card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
              <div className="flex justify-center">
                <img
                  src="/src/images/image.png"
                  alt="مخطط اختبار RSA"
                  className="w-full max-w-2xl rounded-lg"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: NAVY }}>
                  المسافة قبل البوابة: {cfg.distanceBefore}م
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>
                  مسافة السبرنت: {cfg.sprintDistance}م
                </span>
              </div>
            </div>

            {/* Execution method card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-5">طريقة التنفيذ — خطوات الأداء</h2>
              <ol className="relative space-y-0">
                {[
                  { text: `الحكم يقف خلف خط البداية بمسافة ${cfg.distanceBefore}م من بوابة التوقيت`, loop: false },
                  { text: `عند الإشارة: سبرنت كامل حتى بوابة النهاية (${cfg.sprintDistance}م)`, loop: false },
                  { text: 'الحكم يمشي راجع لنقطة البداية للاستعداد للمحاولة التالية', loop: false },
                  { text: `راحة أقصاها ${cfg.restSeconds} ثانية بين كل محاولة والتانية`, loop: false },
                  { text: `يكرر السبرنت ${cfg.attemptsCount} مرات متتالية`, loop: true },
                  { text: 'لو فشل في محاولة واحدة → محاولة سابعة إضافية فورًا', loop: false },
                ].map((step, i, arr) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 z-10"
                        style={{ backgroundColor: TEAL }}
                      >
                        {i + 1}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-0.5 flex-1 mt-1 mb-1" style={{ backgroundColor: '#D1FAE5' }} />
                      )}
                    </div>
                    <p className={`text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5 ${i < arr.length - 1 ? 'pb-5' : ''}`}>
                      {step.text}
                      {step.loop && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E6F2EF] text-[#147B60] text-xs" title="تتكرر">
                          ↻
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-5 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400">
                  <span className="font-semibold">إجمالي المحاولات: {cfg.attemptsCount} (+ محاولة إضافية عند الحاجة)</span>
                  {' — '}
                  قاعدة الرسوب: فشل محاولتين من أصل 7 = رسوب كامل
                </p>
              </div>
            </div>

            {/* Edit card (collapsible) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs overflow-hidden">
              <button
                onClick={() => setEditOpen(v => !v)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
              >
                <span className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#147B60]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  تعديل مقاسات الاختبار
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${editOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 12 12">
                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                </svg>
              </button>

              {editOpen && (
                <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
                  {/* Section A: Measurements */}
                  <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mt-5 mb-3">أ) القياسات</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { key: 'distanceBefore', label: 'مسافة قبل البوابة', unit: 'م' },
                      { key: 'sprintDistance', label: 'مسافة السبرنت', unit: 'م' },
                      { key: 'attemptsCount', label: 'عدد المحاولات', unit: '' },
                      { key: 'restSeconds', label: 'أقصى راحة', unit: 'ث' },
                    ].map(({ key, label, unit }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={cfg[key]}
                            onChange={e => setCfg(prev => ({ ...prev, [key]: e.target.value }))}
                            className="form-input w-full pe-8 text-sm"
                          />
                          {unit && <span className="absolute inset-y-0 end-3 flex items-center text-xs text-gray-400">{unit}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section B: Time limits */}
                  <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-3">
                    ب) الحدود الزمنية حسب الرتبة
                  </p>
                  {!limitsComplete && (
                    <div className="mb-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      يجب إدخال الحدود الزمنية لجميع الرتب قبل بدء الاختبار
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                    {[
                      { key: 'international', label: RANK_LABELS.international },
                      { key: 'international_ast', label: RANK_LABELS.international_ast },
                      { key: 'first', label: RANK_LABELS.first },
                      { key: 'first_ast', label: RANK_LABELS.first_ast },
                      { key: 'second', label: RANK_LABELS.second },
                      { key: 'second_ast', label: RANK_LABELS.second_ast },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300 w-44 shrink-0">{label}</span>
                        <div className="flex-1 relative max-w-[180px]">
                          <input
                            type="number"
                            min="1"
                            step="0.01"
                            value={limits[key]}
                            onChange={e => handleLimitChange(key, e.target.value)}
                            placeholder="—"
                            className={`form-input w-full pe-8 text-sm ${limitErrors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-300' : ''}`}
                          />
                          <span className="absolute inset-y-0 end-3 flex items-center text-xs text-gray-400">ث</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={!limitsComplete}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${
                      limitsComplete ? 'bg-[#147B60] hover:bg-[#0D6E63]' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {saveSuccess ? '✓ تم الحفظ' : 'حفظ التعديلات'}
                  </button>
                </div>
              )}
            </div>

            {/* Referee selection card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">اختيار الحكام والمجموعات</h2>
                <div className="flex gap-1.5">
                  {['all', 'referees', 'assistants'].map((f) => {
                    const labels = { all: 'الكل', referees: 'حكام', assistants: 'مساعدين' };
                    return (
                      <button
                        key={f}
                        onClick={() => setRoleFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          roleFilter === f
                            ? 'bg-[#147B60] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {labels[f]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group tabs */}
              {groups.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setActiveGroupId(null)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeGroupId === null ? 'bg-[#147B60] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    الكل
                  </button>
                  {groups.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setActiveGroupId(g.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeGroupId === g.id ? 'bg-[#147B60] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Search + actions */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-1">
                  <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="بحث بالاسم أو الرتبة..."
                    className="form-input w-full ps-9 text-sm"
                  />
                </div>
                <button onClick={selectAll} className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors whitespace-nowrap">
                  {allVisibleSelected ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                </button>
                <button
                  onClick={() => setShowGroupInput(v => !v)}
                  className="px-4 py-2 text-sm font-medium border border-[#147B60] text-[#147B60] rounded-lg hover:bg-[#E6F2EF] transition-colors whitespace-nowrap"
                >
                  + إنشاء مجموعة
                </button>
              </div>

              {showGroupInput && (
                <div className="flex gap-2 mb-4 p-3 bg-[#E6F2EF] rounded-lg">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createGroup()}
                    placeholder="اسم المجموعة..."
                    className="form-input flex-1 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={createGroup}
                    disabled={!newGroupName.trim() || selectedIds.size === 0}
                    className="px-4 py-2 bg-[#147B60] text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-[#0D6E63] transition-colors"
                  >
                    إنشاء ({selectedIds.size} حكم)
                  </button>
                  <button onClick={() => setShowGroupInput(false)} className="px-3 py-2 text-gray-500 hover:text-gray-700">✕</button>
                </div>
              )}

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {loading && <p className="text-center text-sm text-gray-400 py-8">جاري التحميل...</p>}
                {!loading && filteredReferees.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-8">لا توجد نتائج</p>
                )}
                {filteredReferees.map(ref => {
                  const checked = selectedIds.has(ref.id);
                  return (
                    <label
                      key={ref.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                        checked
                          ? 'bg-[#E6F2EF] border-[#147B60]/40'
                          : 'bg-gray-50 dark:bg-gray-700/40 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                      }`}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggleReferee(ref.id)} className="form-checkbox text-[#147B60] rounded" />
                      {ref.avatar ? (
                        <img src={ref.avatar} alt={ref.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#E6F2EF] flex items-center justify-center text-[#147B60] text-xs font-bold">
                          {ref.name?.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{ref.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{RANK_DISPLAY[ref.rank] || ref.rank}</p>
                      </div>
                      {checked && (
                        <svg className="w-4 h-4 text-[#147B60] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  );
                })}
              </div>

              {selectedIds.size > 0 && (
                <p className="mt-3 text-xs text-[#147B60] font-medium">تم تحديد {selectedIds.size} حكم</p>
              )}
            </div>

          </div>
        </main>

        {/* Sticky footer */}
        <div className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 z-20">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {!limitsComplete && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">⚠ يجب إدخال الحدود الزمنية لكل الرتب أولاً</span>
              )}
              {limitsComplete && selectedIds.size === 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">⚠ اختر حكمًا واحدًا على الأقل</span>
              )}
              {canStart && (
                <span className="text-[#147B60] font-medium">جاهز — {selectedIds.size} حكم محدد</span>
              )}
            </div>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className={`px-8 py-3 rounded-xl text-sm font-bold text-white transition-all ${
                canStart ? 'bg-[#147B60] hover:bg-[#0D6E63] shadow-md hover:shadow-lg' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              }`}
            >
              بدء تسجيل النتائج →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
