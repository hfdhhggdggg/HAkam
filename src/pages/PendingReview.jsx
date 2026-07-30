import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../utils/AuthContext';

function PendingReview() {
  const { user } = useAuth();
  const referenceNumber = user?.refereeId ? `REF-${user.refereeId.padStart(6, '0')}` : 'REF-000000';

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      {/* Theme toggle */}
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl px-6 py-10 text-center">
          {/* Status icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center">
              <svg className="w-8 h-8 fill-current text-amber-500" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-13a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1zm0 8.5a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 12 15.5z" />
              </svg>
            </div>
          </div>

          {/* Status text */}
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">في انتظار المراجعة</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            مرحباً{user?.name ? `، ${user.name}` : ''}! تم استلام طلبك وسيتم مراجعته من قبل الإدارة.
          </p>

          {/* Reference number */}
          <div className="mt-4 mb-6 inline-block bg-gray-100 dark:bg-gray-700/50 rounded-lg px-4 py-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">رقم مرجعي: </span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-wider">{referenceNumber}</span>
          </div>

          {/* Contact link */}
          <div>
            <Link
              to="/signin"
              className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
            >
              تواصل مع الإدارة
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingReview;
