import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { registrationRequests, rankLabels } from '../lib/mockData';
import Transition from '../utils/Transition';

const defaultAvatar = (
  <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" />
  </svg>
);

function RegistrationRequests() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState(registrationRequests);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const openModal = (action, request) => {
    setModalAction(action);
    setSelectedRequest(request);
    setRejectReason('');
    setModalOpen(true);
  };

  const confirmAction = () => {
    if (modalAction === 'accept') {
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
    }
    setModalOpen(false);
    setSelectedRequest(null);
    setRejectReason('');
  };

  const pendingCount = requests.length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">طلبات التسجيل</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {pendingCount > 0 ? `${pendingCount} طلب بانتظار المراجعة` : 'لا توجد طلبات جديدة'}
              </p>
            </div>

            {pendingCount === 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">لا توجد طلبات تسجيل جديدة حاليًا</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {requests.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5 flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden">
                        {defaultAvatar}
                      </div>
                      <div className="ms-3 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{req.fullName}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">طلب رقم {req.id.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm flex-grow">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">الرقم القومي</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100 font-mono text-xs">{req.nationalId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">الرتبة المطلوبة</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{rankLabels[req.rank]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">المحافظة</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{req.governorate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">الهاتف</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100 font-mono text-xs" dir="ltr">{req.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">تاريخ الطلب</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{req.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => openModal('accept', req)}
                        className="flex-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => openModal('reject', req)}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <Transition
        show={modalOpen}
        appear
        enter="transition ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center px-4">
          <Transition
            show={modalOpen}
            appear
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
              <div className="flex justify-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${modalAction === 'accept' ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                  {modalAction === 'accept' ? (
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
                {modalAction === 'accept' ? 'تأكيد قبول الطلب' : 'تأكيد رفض الطلب'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                {modalAction === 'accept'
                  ? `هل أنت متأكد من قبول هذا الطلب؟ سيتم تفعيل حساب ${selectedRequest?.fullName}.`
                  : `هل أنت متأكد من رفض طلب ${selectedRequest?.fullName}؟`}
              </p>

              {modalAction === 'reject' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    سبب الرفض (اختياري)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="form-input w-full resize-none"
                    rows={3}
                    placeholder="اكتب سبب الرفض هنا…"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmAction}
                  className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${modalAction === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {modalAction === 'accept' ? 'تأكيد القبول' : 'تأكيد الرفض'}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  );
}

export default RegistrationRequests;
