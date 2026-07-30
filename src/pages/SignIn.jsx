import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../utils/AuthContext';

function SignIn() {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await signIn(nationalId, password);
      if (user.role === 'referee' && user.status === 'pending') {
        navigate('/pending');
      } else if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      {/* Theme toggle in corner */}
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl px-6 py-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={40} height={40}>
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">تسجيل الدخول</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">اتحاد الحكام الرياضيين</p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* National ID */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5" htmlFor="national-id">
                  الرقم القومي
                </label>
                <input
                  id="national-id"
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="form-input w-full"
                  placeholder="أدخل الرقم القومي"
                  disabled={loading}
                  required
                />
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5" htmlFor="password">
                  كلمة المرور
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white mt-6 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle className="opacity-25" cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                    <path className="opacity-75" fill="currentColor" d="M8 1a7 7 0 0 1 7 7H13a5 5 0 0 0-5-5V1z" />
                  </svg>
                  <span>جارٍ التحقق…</span>
                </>
              ) : (
                <span>تسجيل الدخول</span>
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-5">
            للتجربة: admin / admin123 — حكم: رقم قومي من القائمة + referee123
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
