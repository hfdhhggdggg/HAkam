import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../utils/AuthContext';

function SignIn() {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { signIn, loading, lockoutRemaining } = useAuth();
  const navigate = useNavigate();

  const validateNationalId = (value) => {
    if (!value) return 'الرقم القومي مطلوب';
    if (!/^\d+$/.test(value)) return 'الرقم القومي يجب أن يكون أرقام فقط';
    if (value.length !== 14 && value !== 'admin') return 'الرقم القومي يجب أن يكون 14 رقم';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const idError = validateNationalId(nationalId);
    const passError = password.length < 4 ? 'كلمة المرور قصيرة جداً' : '';
    if (idError || passError) {
      setFieldErrors({ nationalId: idError, password: passError });
      return;
    }
    setFieldErrors({});

    try {
      const user = await signIn(nationalId, password, remember);
      if (user.role === 'referee' && user.status === 'pending') {
        navigate('/pending');
      } else if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'trainer') {
        navigate('/trainer');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const formatLockdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl px-6 py-8">
          <div className="flex justify-center mb-6">
            <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={40} height={40}>
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">تسجيل الدخول</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">اتحاد الحكام الرياضيين</p>

          {lockoutRemaining > 0 && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg px-3 py-2 text-center">
              تم قفل الحساب مؤقتاً. الوقت المتبقي: {formatLockdown(lockoutRemaining)}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5" htmlFor="national-id">
                  الرقم القومي
                </label>
                <input
                  id="national-id"
                  type="text"
                  value={nationalId}
                  onChange={(e) => {
                    setNationalId(e.target.value);
                    if (fieldErrors.nationalId) setFieldErrors({ ...fieldErrors, nationalId: '' });
                  }}
                  className={`form-input w-full ${fieldErrors.nationalId ? 'border-red-500' : ''}`}
                  placeholder="أدخل الرقم القومي (14 رقم)"
                  disabled={loading || lockoutRemaining > 0}
                  required
                />
                {fieldErrors.nationalId && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.nationalId}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5" htmlFor="password">
                  كلمة المرور
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                  }}
                  className={`form-input w-full ${fieldErrors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  disabled={loading || lockoutRemaining > 0}
                  required
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="form-checkbox"
                  disabled={loading}
                />
                <span className="me-2 text-sm text-gray-600 dark:text-gray-300">تذكرني</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || lockoutRemaining > 0}
              className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white mt-6 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin me-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
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

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-5">
            للتجربة: admin / admin123 — معد بدني: 28001015566778 / trainer123 — حكم: رقم قومي من القائمة / referee123
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
