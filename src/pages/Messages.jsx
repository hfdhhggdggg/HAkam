import React, { useState, useMemo } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { conversations as initialConversations } from '../lib/mockData';

const defaultAvatar = (
  <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" />
  </svg>
);

function Messages() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0]?.id || null);
  const [draft, setDraft] = useState('');

  const unreadCount = useMemo(() => conversations.filter((c) => c.unread).length, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  const openConversation = (id) => {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unread: false } : c));
  };

  const sendMessage = () => {
    if (!draft.trim() || !activeConversation) return;
    const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: `m${Date.now()}`, sender: 'me', text: draft.trim(), time: now };
    setConversations((prev) => prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c));
    setDraft('');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">الرسائل</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{unreadCount} محادثة غير مقروءة</p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden flex" style={{ height: '600px' }}>
              {/* Conversations list (right in RTL) */}
              <div className="w-full sm:w-80 border-l border-gray-100 dark:border-gray-700/60 flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">المحادثات</h2>
                </div>
                <div className="overflow-y-auto grow">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => openConversation(conv.id)}
                      className={`w-full flex items-center gap-3 p-4 text-right border-b border-gray-100 dark:border-gray-700/60 transition-colors ${
                        activeId === conv.id ? 'bg-violet-50 dark:bg-violet-500/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden">
                        {defaultAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">{conv.name}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ms-2">{conv.messages[conv.messages.length - 1]?.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{conv.messages[conv.messages.length - 1]?.text}</p>
                      </div>
                      {conv.unread && <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0"></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat area (hidden on mobile unless a conversation is selected) */}
              <div className="hidden sm:flex flex-1 flex-col">
                {activeConversation ? (
                  <>
                    {/* Chat header */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700/60">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden">
                        {defaultAvatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{activeConversation.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activeConversation.messages.length} رسالة</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/30">
                      {activeConversation.messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            msg.sender === 'me'
                              ? 'bg-violet-600 text-white rounded-bl-sm'
                              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700/60 rounded-br-sm'
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-violet-200' : 'text-gray-400 dark:text-gray-500'}`}>{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700/60">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="اكتب رسالة…"
                          className="form-input flex-1"
                        />
                        <button
                          onClick={sendMessage}
                          className="p-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors shrink-0"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <p>اختر محادثة لعرضها</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Messages;
