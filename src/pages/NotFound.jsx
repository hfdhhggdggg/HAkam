import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 text-center">
      <div className="text-7xl font-bold text-violet-500 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">الصفحة غير موجودة</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">عذراً، الصفحة التي تبحث عنها غير متوفرة.</p>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
      >
        العودة للوحة التحكم
      </Link>
    </div>
  );
}

export default NotFound;
