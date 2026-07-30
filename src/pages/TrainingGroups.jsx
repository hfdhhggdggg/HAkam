import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { trainingGroups, referees } from '../lib/mockData';

function CreateGroupModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  const filtered = referees.filter((r) => r.name.includes(search));

  const toggle = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleSave = () => {
    if (!name) return;
    onSave({ name, description, refereeIds: selected });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">إنشاء مجموعة جديدة</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16"><path d="M7.4 8L3.7 4.3 5.1 2.9 8.8 6.6 12.5 2.9 13.9 4.3 10.2 8l3.7 3.7-1.4 1.4L8.8 9.4 5.1 13.1 3.7 11.7z"/></svg>
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">اسم المجموعة</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: المجموعة الأولى" className="w-full text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">الوصف</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">اختيار الحكام</label>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم..." className="w-full text-sm px-3 py-2 mb-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200" />
            <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-100 dark:border-gray-700 rounded-md p-2">
              {filtered.map((r) => (
                <label key={r.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                  <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} className="accent-violet-500" />
                  <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-full" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{r.name}</span>
                </label>
              ))}
            </div>
            {selected.length > 0 && <div className="text-xs text-gray-400 mt-1">{selected.length} حكم محدد</div>}
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md">إنشاء</button>
        </div>
      </div>
    </div>
  );
}

function EditMembersModal({ group, onClose, onSave }) {
  const [selected, setSelected] = useState([...group.refereeIds]);
  const [search, setSearch] = useState('');
  const filtered = referees.filter((r) => r.name.includes(search));

  const toggle = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">تعديل أعضاء — {group.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16"><path d="M7.4 8L3.7 4.3 5.1 2.9 8.8 6.6 12.5 2.9 13.9 4.3 10.2 8l3.7 3.7-1.4 1.4L8.8 9.4 5.1 13.1 3.7 11.7z"/></svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم..." className="w-full text-sm px-3 py-2 mb-3 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200" />
          <div className="max-h-64 overflow-y-auto space-y-1 border border-gray-100 dark:border-gray-700 rounded-md p-2">
            {filtered.map((r) => (
              <label key={r.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} className="accent-violet-500" />
                <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-full" />
                <span className="text-sm text-gray-700 dark:text-gray-200">{r.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
          <button onClick={() => { onSave(group.id, selected); onClose(); }} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md">حفظ</button>
        </div>
      </div>
    </div>
  );
}

function TrainingGroups() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groups, setGroups] = useState(trainingGroups);
  const [showCreate, setShowCreate] = useState(false);
  const [editGroup, setEditGroup] = useState(null);

  const handleCreate = (data) => {
    const id = `g${Date.now()}`;
    setGroups((p) => [...p, { id, ...data }]);
  };

  const handleEditMembers = (gid, refereeIds) => {
    setGroups((p) => p.map((g) => g.id === gid ? { ...g, refereeIds } : g));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">المجموعات التدريبية</h1>
              <button
                onClick={() => setShowCreate(true)}
                className="btn bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
              >
                <svg className="fill-current shrink-0" width="16" height="16" viewBox="0 0 16 16"><path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" /></svg>
                <span className="max-xs:sr-only">إنشاء مجموعة جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((g) => {
                const members = referees.filter((r) => g.refereeIds.includes(r.id));
                return (
                  <div key={g.id} className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{g.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">{g.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex -space-x-2 rtl:space-x-reverse">
                        {members.slice(0, 4).map((m) => (
                          <img key={m.id} src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800" title={m.name} />
                        ))}
                        {members.length > 4 && (
                          <div className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500">
                            +{members.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{members.length} أعضاء</span>
                    </div>

                    <button
                      onClick={() => setEditGroup(g)}
                      className="w-full px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 rounded-md hover:bg-violet-50 dark:hover:bg-violet-500/10 transition"
                    >
                      تعديل الأعضاء
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {showCreate && (
        <CreateGroupModal onClose={() => setShowCreate(false)} onSave={handleCreate} />
      )}
      {editGroup && (
        <EditMembersModal group={editGroup} onClose={() => setEditGroup(null)} onSave={handleEditMembers} />
      )}
    </div>
  );
}

export default TrainingGroups;
