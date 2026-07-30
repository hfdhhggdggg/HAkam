import React from 'react';

function DashboardCard07() {
  const testTypes = [
    { name: 'RSA (Interval)', total: 45, pass: 38, rate: 84.4, color: 'bg-violet-500' },
    { name: 'تحمل', total: 30, pass: 22, rate: 73.3, color: 'bg-sky-500' },
  ];

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">نسب النجاح في كل نوع اختبار</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-right">نوع الاختبار</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">إجمالي</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">ناجح</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">راسب</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">نسبة النجاح</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {testTypes.map((t, i) => (
                <tr key={i}>
                  <td className="p-2">
                    <div className="flex items-center">
                      <div className={`w-9 h-9 rounded-full shrink-0 ${t.color} my-2 mr-3 flex items-center justify-center`}>
                        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                        </svg>
                      </div>
                      <div className="text-gray-800 dark:text-gray-100">{t.name}</div>
                    </div>
                  </td>
                  <td className="p-2"><div className="text-center">{t.total}</div></td>
                  <td className="p-2"><div className="text-center text-green-500">{t.pass}</div></td>
                  <td className="p-2"><div className="text-center text-red-500">{t.total - t.pass}</div></td>
                  <td className="p-2">
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ml-2">
                        <div className={`h-full ${t.color}`} style={{ width: `${t.rate}%` }}></div>
                      </div>
                      <span className="text-sky-500 text-xs">{t.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
