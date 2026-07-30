import React from 'react';
import { Link } from 'react-router-dom';

function DashboardCard12() {
  const todayActivities = [
    { id: 'a1', type: 'test_result', text: 'تم تسجيل نتيجة اختبار لياقة للحكم أحمد محمد علي', color: 'bg-green-500' },
    { id: 'a2', type: 'registration', text: 'طلب تسجيل جديد من سامح فتحي علي', color: 'bg-violet-500' },
    { id: 'a3', type: 'activation', text: 'تم تفعيل حساب الحكم ياسر إبراهيم منصور', color: 'bg-sky-500' },
  ];
  const yesterdayActivities = [
    { id: 'a4', type: 'test_result', text: 'تم تسجيل نتيجة اختبار لياقة للحكم عمرو شريف فؤاد', color: 'bg-green-500' },
    { id: 'a5', type: 'suspension', text: 'تم تعطيل حساب الحكم كريم حسن عبد الله', color: 'bg-red-500' },
  ];

  const renderActivity = (act) => (
    <li key={act.id} className="flex px-2">
      <div className={`w-9 h-9 rounded-full shrink-0 ${act.color} my-2 mr-3`}>
        <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
          <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
        </svg>
      </div>
      <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
        <div className="grow flex justify-between">
          <div className="self-center text-gray-800 dark:text-gray-100">{act.text}</div>
          <div className="shrink-0 self-end ml-2">
            <Link className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" to="#0">
              عرض<span className="hidden sm:inline"> ←</span>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">آخر النشاطات</h2>
      </header>
      <div className="p-3">
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">اليوم</header>
          <ul className="my-1">
            {todayActivities.map(renderActivity)}
          </ul>
        </div>
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">أمس</header>
          <ul className="my-1">
            {yesterdayActivities.map(renderActivity)}
          </ul>
        </div>
        <div className="mt-4 text-center">
          <Link className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" to="#0">
            عرض الكل ←
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard12;
