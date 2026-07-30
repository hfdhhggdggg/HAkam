import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

const mockThreads = [
  { id: 'm1', name: 'أحمد محمد علي', role: 'حكم', preview: 'متى موعد اختبار اللياقة القادم؟', time: '10:24 ص', unread: true },
  { id: 'm2', name: 'محمود سعيد إبراهيم', role: 'حكم', preview: 'شكراً على المتابعة، تم إرسال التقرير.', time: '9:15 ص', unread: true },
  { id: 'm3', name: 'د. خالد فؤاد', role: 'معد بدني', preview: 'الحكم رقم 3 محتاج برنامج تأهيل.', time: 'أمس', unread: true },
  { id: 'm4', name: 'كريم حسن عبد الله', role: 'حكم', preview: 'أرجو إعادة تفعيل الحساب.', time: 'أمس', unread: true },
  { id: 'm5', name: 'ياسر إبراهيم منصور', role: 'حكم', preview: 'تم اجتياز الاختبار بنجاح.', time: '2 أيام', unread: false },
];

const mockConversation = [
  { from: 'them', text: 'متى موعد اختبار اللياقة القادم؟', time: '10:20 ص' },
  { from: 'me', text: 'الموعد القادم يوم 15 أكتوبر في الصالة الرئيسية.', time: '10:24 ص' },
];

function Messages() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeThread, setActiveThread] = useState('m1');
  const [draft, setDraft] = useState('');

  const active = mockThreads.find((t) => t.id === activeThread);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">الرسائل</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
              {/* Thread list */}
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-y-auto">
                {mockThreads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveThread(t.id)}
                    className={`w-full text-start p-4 border-b border-gray-100 dark:border-gray-700/60 transition-colors ${
                      activeThread === t.id ? 'bg-violet-50 dark:bg-violet-500/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 dark:text-gray-100 truncate">{t.name}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{t.role}</span>
                          {t.unread && <span className="w-2 h-2 rounded-full bg-violet-500"></span>}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{t.preview}</p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ms-2">{t.time}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Conversation */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-xs rounded-xl flex flex-col">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">{active?.name}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{active?.role}</p>
                </header>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {mockConversation.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'me' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        msg.from === 'me'
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-violet-200' : 'text-gray-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-gray-700/60 flex gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="اكتب رسالة…"
                    className="form-input flex-1"
                    onKeyDown={(e) => { if (e.key === 'Enter') setDraft(''); }}
                  />
                  <button
                    onClick={() => setDraft('')}
                    className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                  >
                    إرسال
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Messages;
