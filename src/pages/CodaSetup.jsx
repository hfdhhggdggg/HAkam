import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { referees, rankLabels } from '../lib/mockData';

const STORAGE_KEY = 'coda_config_v1';

const RANK_FULL = {
  international: 'مساعد حكم دولي',
  first: 'مساعد حكم درجة أولى',
  second: 'مساعد حكم درجة ثانية',
};

const NAVY = '#0F2D4A';
const TEAL = '#147B60';

function CodaDiagram({ cfg }) {
  const h = 38;
  const aX = 175, bX = 380, cX = 820;
  const slX = 50;
  const rows = [80, 140, 200, 260];

  function Arrow({ x1, x2, y, color, label }) {
    const right = x2 > x1;
    const lo = Math.min(x1, x2), hi = Math.max(x1, x2);
    return (
      <g>
        <rect x={lo} y={y - h / 2} width={hi - lo} height={h} rx={h / 2} fill={color} />
        {right
          ? <polygon points={`${hi - 14},${y - h / 2 - 6} ${hi + 10},${y} ${hi - 14},${y + h / 2 + 6}`} fill={color} />
          : <polygon points={`${lo + 14},${y - h / 2 - 6} ${lo - 10},${y} ${lo + 14},${y + h / 2 + 6}`} fill={color} />
        }
        <text x={(lo + hi) / 2} y={y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={13} fontWeight="600">
          {label}
        </text>
      </g>
    );
  }

  return (
    <svg viewBox="0 0 920 340" className="w-full max-w-3xl mx-auto select-none" style={{ direction: 'ltr' }}>
      {/* vertical lines */}
      <line x1={slX} y1={30} x2={slX} y2={295} stroke={NAVY} strokeWidth={2} />
      <line x1={aX} y1={30} x2={aX} y2={295} stroke={NAVY} strokeWidth={2} />
      <line x1={bX} y1={30} x2={bX} y2={295} stroke={TEAL} strokeWidth={2} />
      <line x1={cX} y1={30} x2={cX} y2={295} stroke={NAVY} strokeWidth={2} />

      {/* corner dots */}
      {[slX, aX, cX].map(x => [30, 295].map(y => (
        <circle key={x + '-' + y} cx={x} cy={y} r={7} fill={NAVY} />
      )))}
      {[30, 295].map(y => <circle key={'b' + y} cx={bX} cy={y} r={7} fill={TEAL} />)}

      {/* point labels top */}
      <text x={aX} y={16} textAnchor="middle" fill={NAVY} fontSize={20} fontWeight="700">A</text>
      <text x={bX} y={16} textAnchor="middle" fill={TEAL} fontSize={20} fontWeight="700">B</text>
      <text x={cX} y={16} textAnchor="middle" fill={NAVY} fontSize={20} fontWeight="700">C</text>

      {/* 0.5m indicator */}
      <line x1={slX + 6} y1={315} x2={aX - 6} y2={315} stroke={TEAL} strokeWidth={1.5} markerEnd="url(#ta)" />
      <text x={(slX + aX) / 2} y={311} textAnchor="middle" fill={TEAL} fontSize={11} fontWeight="600">0.5m</text>

      {/* bottom labels */}
      <text x={slX} y={330} textAnchor="middle" fill="#64748B" fontSize={11}>start line</text>
      <text x={aX} y={330} textAnchor="middle" fill="#64748B" fontSize={11}>start gate</text>

      {/* arrows */}
      <Arrow x1={cX} x2={aX} y={rows[0]} color={NAVY} label={`${cfg.sprint1}m sprint`} />
      <Arrow x1={bX} x2={cX} y={rows[1]} color={TEAL} label={`${cfg.lateralRight}m sideways right`} />
      <Arrow x1={cX} x2={bX} y={rows[2]} color={TEAL} label={`${cfg.lateralLeft}m sideways left`} />
      <Arrow x1={aX} x2={cX} y={rows[3]} color={NAVY} label={`${cfg.sprint2}m sprint`} />
    </svg>
  );
}

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

const assistantReferees = referees.filter(r => r.rank === 'first' || r.rank === 'second');

export default function CodaSetup() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cfg, setCfg] = useState({ sprint1: 10, lateralRight: 8, lateralLeft: 8, sprint2: 10 });
  const [limits, setLimits] = useState({ international: '', first: '', second: '' });
  const [savedLimits, setSavedLimits] = useState({ international: '', first: '', second: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [limitErrors, setLimitErrors] = useState({});

  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [showGroupInput, setShowGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) {
        setCfg({
          sprint1: saved.sprint1 ?? 10,
          lateralRight: saved.lateralRight ?? 8,
          lateralLeft: saved.lateralLeft ?? 8,
          sprint2: saved.sprint2 ?? 10,
        });
        const lim = {
          international: saved.limitInternational ?? '',
          first: saved.limitFirst ?? '',
          second: saved.limitSecond ?? '',
        };
        setLimits(lim);
        setSavedLimits(lim);
      }
    } catch (_) {}
  }, []);

  const limitsComplete = limits.international !== '' && limits.first !== '' && limits.second !== '';
  const canStart = limitsComplete && selectedIds.size > 0;

  function handleSave() {
    const errors = {};
    if (!limits.international) errors.international = true;
    if (!limits.first) errors.first = true;
    if (!limits.second) errors.second = true;
    if (Object.keys(errors).length) { setLimitErrors(errors); return; }
    setLimitErrors({});
    const data = {
      sprint1: Number(cfg.sprint1),
      lateralRight: Number(cfg.lateralRight),
      lateralLeft: Number(cfg.lateralLeft),
      sprint2: Number(cfg.sprint2),
      limitInternational: limits.international,
      limitFirst: limits.first,
      limitSecond: limits.second,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSavedLimits({ international: limits.international, first: limits.first, second: limits.second });
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); setEditOpen(false); }, 1200);
  }

  function handleLimitChange(rank, val) {
    if (val !== '' && (isNaN(val) || Number(val) < 0)) return;
    setLimits(prev => ({ ...prev, [rank]: val }));
    if (limitErrors[rank]) setLimitErrors(prev => ({ ...prev, [rank]: false }));
  }

  function toggleReferee(id) {
    setSelectedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function selectAll() {
    const visible = filteredReferees.map(r => r.id);
    setSelectedIds(prev => {
      const s = new Set(prev);
      const allSelected = visible.every(id => s.has(id));
      if (allSelected) visible.forEach(id => s.delete(id));
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

  const displayedReferees = activeGroupId
    ? assistantReferees.filter(r => {
        const grp = groups.find(g => g.id === activeGroupId);
        return grp ? grp.refereeIds.includes(r.id) : true;
      })
    : assistantReferees;

  const filteredReferees = displayedReferees.filter(r =>
    r.name.includes(search) || rankLabels[r.rank]?.includes(search)
  );

  const allVisibleSelected = filteredReferees.length > 0 && filteredReferees.every(r => selectedIds.has(r.id));

  function handleStart() {
    if (!canStart) return;
    const selected = assistantReferees.filter(r => selectedIds.has(r.id));
    navigate('/fitness/coda/results', {
      state: {
        config: {
          sprint1: Number(cfg.sprint1),
          lateralRight: Number(cfg.lateralRight),
          lateralLeft: Number(cfg.lateralLeft),
          sprint2: Number(cfg.sprint2),
          limitInternational: limits.international,
          limitFirst: limits.first,
          limitSecond: limits.second,
        },
        selectedReferees: selected,
        groups: groups.filter(g => g.refereeIds.some(id => selectedIds.has(id))),
        testDate: new Date().toLocaleDateString('ar-EG'),
      },
    });
  }

  const totalDistance = Number(cfg.sprint1) + Number(cfg.lateralRight) + Number(cfg.lateralLeft) + Number(cfg.sprint2);

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
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">اختبار CODA</h1>
                  <Badge variant="gray">مساعدين فقط</Badge>
                  <Badge variant="teal">اختبار FIFA رسمي</Badge>
                </div>
                <p className="text-sm text-[#64748B] dark:text-gray-400">
                  Change of Direction Ability — قياس الرشاقة وتغيير الاتجاه
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
              <CodaDiagram cfg={cfg} />

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {[
                  { label: `سبرنت ${cfg.sprint1}م`, color: NAVY },
                  { label: `جانبي ${cfg.lateralRight}م يمين`, color: TEAL },
                  { label: `جانبي ${cfg.lateralLeft}م يسار`, color: '#0D6E63' },
                  { label: `سبرنت ${cfg.sprint2}م عودة`, color: NAVY },
                ].map((chip, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: chip.color }}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Execution method card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-5">طريقة التنفيذ — خطوات الأداء</h2>
              <ol className="relative space-y-0">
                {[
                  'الحكم يقف خلف بوابة البداية بمسافة 0.5م',
                  'عند الإشارة: سبرنت حتى نقطة C',
                  'حركة جانبية (Side Shuffle) تجاه B — بدون تقاطع القدمين',
                  'حركة جانبية عودة تجاه C',
                  'سبرنت أخير عائدًا لبوابة البداية A',
                  'يتوقف الزمن عند عبور البوابة A',
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
                    <p className={`text-sm text-gray-700 dark:text-gray-300 ${i < arr.length - 1 ? 'pb-5' : ''}`}>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-5 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">إجمالي المسافة: {totalDistance} متر</span>
                  {' — '}
                  قاعدة الرسوب: فشل محاولتين من أصل 2 = رسوب كامل
                </p>
              </div>
            </div>

            {/* Edit dimensions card (collapsible) */}
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
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${editOpen ? 'rotate-180' : ''}`}
                  fill="currentColor" viewBox="0 0 12 12"
                >
                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                </svg>
              </button>

              {editOpen && (
                <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
                  {/* Section A: Distances */}
                  <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mt-5 mb-3">
                    أ) المسافات
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { key: 'sprint1', label: 'سبرنت 1' },
                      { key: 'lateralRight', label: 'جانبي يمين' },
                      { key: 'lateralLeft', label: 'جانبي يسار' },
                      { key: 'sprint2', label: 'سبرنت 2' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={cfg[key]}
                            onChange={e => setCfg(prev => ({ ...prev, [key]: e.target.value }))}
                            className="form-input w-full pe-10 text-sm"
                          />
                          <span className="absolute inset-y-0 end-3 flex items-center text-xs text-gray-400">م</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section B: Time limits */}
                  <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-3">
                    ب) الحدود الزمنية حسب الرتبة
                  </p>
                  <div className="space-y-3 mb-6">
                    {[
                      { key: 'international', label: RANK_FULL.international },
                      { key: 'first', label: RANK_FULL.first },
                      { key: 'second', label: RANK_FULL.second },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300 w-52 shrink-0">{label}</span>
                        <div className="flex-1 relative max-w-xs">
                          <input
                            type="number"
                            min="1"
                            step="0.1"
                            value={limits[key]}
                            onChange={e => handleLimitChange(key, e.target.value)}
                            placeholder="أدخل الحد بالثانية"
                            className={`form-input w-full pe-8 text-sm ${limitErrors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-300' : ''}`}
                          />
                          <span className="absolute inset-y-0 end-3 flex items-center text-xs text-gray-400">ث</span>
                        </div>
                        {limitErrors[key] && (
                          <p className="text-xs text-red-500">الحد الزمني مطلوب</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={!limitsComplete}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${
                      limitsComplete
                        ? 'bg-[#147B60] hover:bg-[#0D6E63]'
                        : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
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
                <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                  اختيار الحكام والمجموعات
                </h2>
                <Badge variant="gray">مساعدين فقط</Badge>
              </div>

              {/* Group tabs */}
              {groups.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setActiveGroupId(null)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeGroupId === null
                        ? 'bg-[#147B60] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    الكل
                  </button>
                  {groups.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setActiveGroupId(g.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeGroupId === g.id
                          ? 'bg-[#147B60] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
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

              {/* Group name input */}
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
                  <button onClick={() => setShowGroupInput(false)} className="px-3 py-2 text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>
              )}

              {/* Referee list */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredReferees.length === 0 && (
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
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleReferee(ref.id)}
                        className="form-checkbox text-[#147B60] rounded"
                      />
                      <img src={ref.avatar} alt={ref.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{ref.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{RANK_FULL[ref.rank]}</p>
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
                <p className="mt-3 text-xs text-[#147B60] font-medium">
                  تم تحديد {selectedIds.size} حكم
                </p>
              )}
            </div>

          </div>
        </main>

        {/* Sticky footer */}
        <div className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 z-20">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {!limitsComplete && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  ⚠ يجب إدخال الحدود الزمنية لكل الرتب أولاً
                </span>
              )}
              {limitsComplete && selectedIds.size === 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  ⚠ اختر حكمًا واحدًا على الأقل
                </span>
              )}
              {canStart && (
                <span className="text-[#147B60] font-medium">
                  جاهز — {selectedIds.size} حكم محدد
                </span>
              )}
            </div>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className={`px-8 py-3 rounded-xl text-sm font-bold text-white transition-all ${
                canStart
                  ? 'bg-[#147B60] hover:bg-[#0D6E63] shadow-md hover:shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
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
