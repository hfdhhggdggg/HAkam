import React, { useState, useMemo } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { trainingSessions, trainingGroups, trainingTypeLabels, trainingTypeColors, referees, rpeRecords } from '../lib/mockData';

const WEEKDAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

function pad(n) { return String(n).padStart(2, '0'); }
function fmtDate(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

const rpeLabel = (v) => {
  if (v <= 1) return 'راحة تامة';
  if (v <= 3) return 'سهل جدًا';
  if (v <= 5) return 'سهل';
  if (v === 6) return 'متوسط';
  if (v === 7) return 'مجهود';
  if (v <= 9) return 'شاق';
  return 'شاق جدًا';
};

function SessionModal({ session, onClose, onSave }) {
  const group = trainingGroups.find((g) => g.id === session.groupId);
  const members = referees.filter((r) => group.refereeIds.includes(r.id));
  const [attendance, setAttendance] = useState(() => {
    const map = {};
    session.attendance.forEach((a) => { map[a.refereeId] = a.status; });
    members.forEach((m) => { if (!map[m.id]) map[m.id] = 'present'; });
    return map;
  });
  const [rpe, setRpe] = useState(() => {
    const map = {};
    rpeRecords.filter((r) => r.sessionId === session.id).forEach((r) => { map[r.refereeId] = r.rpeScore; });
    return map;
  });
  const [notes, setNotes] = useState(() => {
    const map = {};
    session.attendance.forEach((a) => { if (a.notes) map[a.refereeId] = a.notes; });
    return map;
  });

  const setStatus = (rid, status) => setAttendance((p) => ({ ...p, [rid]: status }));

  const statusBtn = (rid, val, label, color) => (
    <button
      onClick={() => setStatus(rid, val)}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${attendance[rid] === val ? color : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
    >
      {label}
    </button>
  );

  const handleSave = () => {
    onSave({
      sessionId: session.id,
      attendance,
      rpe,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">تفاصيل جلسة التدريب</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16"><path d="M7.4 8L3.7 4.3 5.1 2.9 8.8 6.6 12.5 2.9 13.9 4.3 10.2 8l3.7 3.7-1.4 1.4L8.8 9.4 5.1 13.1 3.7 11.7z"/></svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-xs text-gray-400 mb-1">التاريخ</div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{session.date}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">الوقت</div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{session.time}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">المكان</div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{session.location}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">النوع</div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{trainingTypeLabels[session.type]}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">المجموعة</div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{group.name}</div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">جدول الحضور والتقييم</h3>
          <div className="space-y-4">
            {members.map((m) => (
              <div key={m.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{m.name}</span>
                  </div>
                  <div className="flex gap-2">
                    {statusBtn(m.id, 'present', 'حضر ✓', 'bg-green-500 text-white')}
                    {statusBtn(m.id, 'absent', 'غاب ✗', 'bg-red-500 text-white')}
                    {statusBtn(m.id, 'excused', 'اعتذر —', 'bg-amber-500 text-white')}
                  </div>
                </div>
                {attendance[m.id] === 'present' && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-2">تقييم RPE (مستوى الجهد)</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={rpe[m.id] || 5}
                      onChange={(e) => setRpe((p) => ({ ...p, [m.id]: Number(e.target.value) }))}
                      className="w-full accent-violet-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>سهل جدًا</span>
                      <span className="font-semibold text-violet-600 dark:text-violet-400">{rpe[m.id] || 5} — {rpeLabel(rpe[m.id] || 5)}</span>
                      <span>شاق جدًا</span>
                    </div>
                  </div>
                )}
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="ملاحظات (اختياري)"
                    value={notes[m.id] || ''}
                    onChange={(e) => setNotes((p) => ({ ...p, [m.id]: e.target.value }))}
                    className="w-full text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md">حفظ الجلسة</button>
        </div>
      </div>
    </div>
  );
}

function NewSessionModal({ onClose, onSave }) {
  const [groupId, setGroupId] = useState(trainingGroups[0]?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('general');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!groupId || !date || !location) return;
    const group = trainingGroups.find((g) => g.id === groupId);
    onSave({
      groupId, date, time, location, type, notes,
      attendance: group.refereeIds.map((rid) => ({ refereeId: rid, status: 'present' })),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">جلسة تدريب جديدة</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16"><path d="M7.4 8L3.7 4.3 5.1 2.9 8.8 6.6 12.5 2.9 13.9 4.3 10.2 8l3.7 3.7-1.4 1.4L8.8 9.4 5.1 13.1 3.7 11.7z"/></svg>
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">المجموعة</label>
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="w-full text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              {trainingGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">التاريخ</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">الوقت</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">المكان</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="مثال: ملعب القاهرة الدولي" className="w-full text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">نوع التدريب</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              <option value="general">لياقة عامة</option>
              <option value="interval">تحضير Interval</option>
              <option value="recovery">تعافي</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">ملاحظات</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md">إنشاء الجلسة</button>
        </div>
      </div>
    </div>
  );
}

function Calendar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [current, setCurrent] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [selectedSession, setSelectedSession] = useState(null);
  const [showNewSession, setShowNewSession] = useState(false);
  const [sessions, setSessions] = useState(trainingSessions);

  const sessionsByDate = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [sessions]);

  const firstDay = new Date(current.y, current.m, 1).getDay();
  const daysInMonth = new Date(current.y, current.m + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => setCurrent((c) => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 });
  const nextMonth = () => setCurrent((c) => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 });

  const handleSaveSession = (data) => {
    setSessions((prev) => prev.map((s) => {
      if (s.id !== data.sessionId) return s;
      const attendance = Object.entries(data.attendance).map(([refereeId, status]) => ({
        refereeId,
        status,
        notes: data.notes[refereeId] || '',
      }));
      return { ...s, attendance };
    }));
  };

  const handleNewSession = (data) => {
    const id = `s${Date.now()}`;
    setSessions((prev) => [...prev, { id, ...data }]);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">التقويم</h1>
              <button
                onClick={() => setShowNewSession(true)}
                className="btn bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
              >
                <svg className="fill-current shrink-0" width="16" height="16" viewBox="0 0 16 16"><path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" /></svg>
                <span className="max-xs:sr-only">جلسة تدريب جديدة</span>
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4">
              {Object.entries(trainingTypeLabels).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${trainingTypeColors[key].dot}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <button onClick={prevMonth} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16"><path d="M8 12L3 7l1.4-1.4L8 9.2l3.6-3.6L13 7z" /></svg>
                </button>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{MONTHS[current.m]} {current.y}</h2>
                <button onClick={nextMonth} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16"><path d="M8 4l5 5-1.4 1.4L8 6.8 4.4 10.4 3 9z" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="px-2 py-3 text-xs font-semibold text-gray-400 text-center">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                  if (day === null) return <div key={i} className="min-h-[88px] bg-gray-50 dark:bg-gray-700/30 border-s border-gray-100 dark:border-gray-700/60" />;
                  const dateStr = fmtDate(current.y, current.m, day);
                  const daySessions = sessionsByDate[dateStr] || [];
                  const today = new Date();
                  const isToday = today.getFullYear() === current.y && today.getMonth() === current.m && today.getDate() === day;
                  return (
                    <div
                      key={i}
                      className={`min-h-[88px] p-1.5 border-s border-b border-gray-100 dark:border-gray-700/60 ${isToday ? 'bg-violet-50 dark:bg-violet-500/10' : 'bg-white dark:bg-gray-800'}`}
                    >
                      <div className={`text-xs mb-1 ${isToday ? 'font-bold text-violet-600' : 'text-gray-400'}`}>{day}</div>
                      <div className="space-y-1">
                        {daySessions.map((s) => {
                          const c = trainingTypeColors[s.type];
                          return (
                            <button
                              key={s.id}
                              onClick={() => setSelectedSession(s)}
                              className={`w-full text-start px-2 py-1 rounded-md text-xs text-white ${c.bg} hover:opacity-90 transition truncate`}
                            >
                              {trainingTypeLabels[s.type]} — {s.time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onSave={handleSaveSession}
        />
      )}
      {showNewSession && (
        <NewSessionModal
          onClose={() => setShowNewSession(false)}
          onSave={handleNewSession}
        />
      )}
    </div>
  );
}

export default Calendar;
