import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../utils/AuthContext';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: nationalId, 2: otp, 3: newPassword, 4: success
  const [nationalId, setNationalId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const validateNationalId = (value) => {
    if (!value) return 'الرقم القومي مطلوب';
    if (!/^\d+$/.test(value)) return 'الرقم القومي يجب أن يكون أرقام فقط';
    if (value.length !== 14) return 'الرقم القومي يجب أن يكون 14 رقم';
    return '';
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    const idError = validateNationalId(nationalId);
    if (idError) {
      setError(idError);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('رمز التحقق يجب أن يكون 6 أرقام');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(nationalId, otp, newPassword);
      setLoading(false);
      setStep(4);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <form onSubmit={handleSendOtp}>
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
              placeholder="أدخل الرقم القومي (14 رقم)"
              disabled={loading}
              required
            />
          </div>
          {error && <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white mt-6 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin me-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle className="opacity-25" cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                  <path className="opacity-75" fill="currentColor" d="M8 1a7 7 0 0 1 7 7H13a5 5 0 0 0-5-5V1z" />
                </svg>
                <span>جارٍ الإرسال…</span>
              </>
            ) : (
              <span>إرسال رمز التحقق</span>
            )}
          </button>
        </form>
      );
    }

    if (step === 2) {
      return (
        <form onSubmit={handleVerifyOtp}>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5" htmlFor="otp">
              رمز التحقق (OTP)
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-input w-full text-center tracking-widest"
              placeholder="------"
              maxLength={6}
              disabled={loading}
              required
            />
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 text-center">تم إرسال رمز التحقق إلى رقمك المسجل. (للتجربة: 123456)</p>
          </div>
          {error && <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</div>}
          <button
            type="submit"
            disabled={loading}
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
              <span>تأكيد الرمز</span>
            )}
          </button>
        </form>
      );
    }

    if (step === 3) {
      return (
        <form onSubmit={handleResetPassword}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5" htmlFor="new-password">
                كلمة المرور الجديدة
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input w-full"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5" htmlFor="confirm-password">
                تأكيد كلمة المرور
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input w-full"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
          </div>
          {error && <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white mt-6 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin me-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle className="opacity-25" cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                  <path className="opacity-75" fill="currentColor" d="M8 1a7 7 0 0 1 7 7H13a5 5 0 0 0-5-5V1z" />
                </svg>
                <span>جارٍ الحفظ…</span>
              </>
            ) : (
              <span>إعادة تعيين كلمة المرور</span>
            )}
          </button>
        </form>
      );
    }

    // Step 4: success
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
            <svg className="w-8 h-8 fill-current text-green-500" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.29 14.71l-4-4a1 1 0 0 1 1.41-1.41L11 14.59l5.29-5.3a1 1 0 0 1 1.41 1.41l-6 6a1 1 0 0 1-1.41 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">تم تغيير كلمة المرور</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>
        <button
          onClick={() => navigate('/signin')}
          className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  };

  const stepTitle = step === 1 ? 'نسيت كلمة المرور' : step === 2 ? 'رمز التحقق' : step === 3 ? 'كلمة المرور الجديدة' : 'تم بنجاح';
  const stepSubtitle = step === 1 ? 'أدخل الرقم القومي لإرسال رمز التحقق' : step === 2 ? 'أدخل الرمز المرسل إلى هاتفك' : step === 3 ? 'اختر كلمة مرور جديدة' : '';

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

          {step < 4 && (
            <>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">{stepTitle}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">{stepSubtitle}</p>
            </>
          )}

          {renderStep()}

          {step < 4 && (
            <div className="mt-5 text-center">
              <Link to="/signin" className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                العودة لتسجيل الدخول
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
