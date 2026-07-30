import React from 'react';
import { Link } from 'react-router-dom';
import EditMenu from '../../components/DropdownEditMenu';
import { referees, rankLabels, statusLabels } from '../../lib/mockData';

import Image01 from '../../images/user-36-05.jpg';
import Image02 from '../../images/user-36-06.jpg';
import Image03 from '../../images/user-36-07.jpg';
import Image04 from '../../images/user-36-08.jpg';
import Image05 from '../../images/user-36-09.jpg';

const avatarMap = [Image01, Image02, Image03, Image04, Image05];

function DashboardCard10() {
  const rows = referees.slice(0, 5).map((r, i) => ({
    ...r,
    avatar: avatarMap[i % avatarMap.length],
  }));

  const statusColor = (status) => {
    if (status === 'active') return 'text-green-500';
    if (status === 'suspended') return 'text-red-500';
    return 'text-amber-500';
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">الحكام</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-right">الاسم</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">الرتبة</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">آخر اختبار</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">الحالة</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center sr-only">تحرير</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {rows.map((referee) => (
                <tr key={referee.id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 shrink-0 ml-2 sm:ml-3">
                        <img className="rounded-full" src={referee.avatar} width="40" height="40" alt={referee.name} />
                      </div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">{referee.name}</div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">{rankLabels[referee.rank]}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center text-gray-600 dark:text-gray-400">{referee.lastTest}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className={`text-center font-medium ${statusColor(referee.status)}`}>{statusLabels[referee.status]}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex justify-center">
                      <EditMenu align="right" className="relative inline-flex">
                        <li>
                          <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                            عرض
                          </Link>
                        </li>
                        <li>
                          <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                            تعديل
                          </Link>
                        </li>
                      </EditMenu>
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

export default DashboardCard10;
