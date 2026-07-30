import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { referees, physicalTrainers } from '../lib/mockData';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

const AuthContext = createContext({
  user: null,
  role: null,
  signIn: () => {},
  signOut: () => {},
  loading: false,
  lockoutRemaining: 0,
  resetPassword: () => {},
});

function getStoredUser() {
  const remember = localStorage.getItem('auth_remember') === 'true';
  const storage = remember ? localStorage : sessionStorage;
  const stored = storage.getItem('auth_user');
  const storedRole = storage.getItem('auth_role');
  if (stored) {
    return { user: JSON.parse(stored), role: storedRole };
  }
  return { user: null, role: null };
}

function persistUser(user, role, remember) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('auth_user', JSON.stringify(user));
  storage.setItem('auth_role', role);
  if (remember) localStorage.setItem('auth_remember', 'true');
}

function clearStoredUser() {
  sessionStorage.removeItem('auth_user');
  sessionStorage.removeItem('auth_role');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_role');
  localStorage.removeItem('auth_remember');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const lastActivityRef = useRef(Date.now());
  const lockoutTimerRef = useRef(null);

  // Restore session on mount
  useEffect(() => {
    const { user: storedUser, role: storedRole } = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setRole(storedRole);
      lastActivityRef.current = Date.now();
    }
  }, []);

  // Session timeout — sign out after 30 min inactivity
  const signOut = useCallback(() => {
    setUser(null);
    setRole(null);
    clearStoredUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const resetActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'keydown', 'mousemove', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetActivity));

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > SESSION_TIMEOUT_MS) {
        signOut();
      }
    }, 60 * 1000); // check every minute

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetActivity));
      clearInterval(interval);
    };
  }, [user, signOut]);

  // Lockout countdown
  useEffect(() => {
    if (lockoutRemaining <= 0) {
      if (lockoutTimerRef.current) {
        clearInterval(lockoutTimerRef.current);
        lockoutTimerRef.current = null;
      }
      return;
    }
    if (!lockoutTimerRef.current) {
      lockoutTimerRef.current = setInterval(() => {
        setLockoutRemaining((prev) => {
          if (prev <= 1) {
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (lockoutTimerRef.current && lockoutRemaining <= 0) {
        clearInterval(lockoutTimerRef.current);
        lockoutTimerRef.current = null;
      }
    };
  }, [lockoutRemaining]);

  const signIn = (nationalId, password, remember = false) => {
    if (lockoutRemaining > 0) {
      return Promise.reject(new Error(`تم قفل الحساب مؤقتاً. حاول مرة أخرى بعد ${Math.ceil(lockoutRemaining / 60)} دقيقة`));
    }

    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);

        // Admin (إدارة الاتحاد)
        if (nationalId === 'admin' && password === 'admin123') {
          const adminUser = { name: 'إدارة الاتحاد', role: 'admin' };
          setUser(adminUser);
          setRole('admin');
          persistUser(adminUser, 'admin', remember);
          setFailedAttempts(0);
          resolve(adminUser);
          return;
        }

        // Physical trainer (معد بدني)
        const trainer = physicalTrainers.find((t) => t.nationalId === nationalId);
        if (trainer && password === 'trainer123') {
          const trainerUser = {
            name: trainer.name,
            role: 'trainer',
            trainerId: trainer.id,
            assignedRefereeIds: trainer.assignedRefereeIds,
          };
          setUser(trainerUser);
          setRole('trainer');
          persistUser(trainerUser, 'trainer', remember);
          setFailedAttempts(0);
          resolve(trainerUser);
          return;
        }

        // Referee (حكم)
        const referee = referees.find((r) => r.nationalId === nationalId);
        if (referee && password === 'referee123') {
          const refUser = {
            name: referee.name,
            role: 'referee',
            refereeId: referee.id,
            status: referee.status,
          };
          setUser(refUser);
          setRole('referee');
          persistUser(refUser, 'referee', remember);
          setFailedAttempts(0);
          resolve(refUser);
          return;
        }

        // Failed attempt
        const newFailedCount = failedAttempts + 1;
        setFailedAttempts(newFailedCount);

        if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
          setLockoutRemaining(Math.floor(LOCKOUT_DURATION_MS / 1000));
          reject(new Error('تم قفل الحساب مؤقتاً لمدة 15 دقيقة بسبب 5 محاولات فاشلة'));
          return;
        }

        const remaining = MAX_FAILED_ATTEMPTS - newFailedCount;
        reject(new Error(`الرقم القومي أو كلمة المرور غير صحيحة. محاولات متبقية: ${remaining}`));
      }, 1200);
    });
  };

  const resetPassword = (nationalId, otp, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const referee = referees.find((r) => r.nationalId === nationalId);
        const trainer = physicalTrainers.find((t) => t.nationalId === nationalId);
        if (!referee && !trainer && nationalId !== 'admin') {
          reject(new Error('الرقم القومي غير مسجل'));
          return;
        }
        if (otp !== '123456') {
          reject(new Error('رمز التحقق غير صحيح'));
          return;
        }
        if (newPassword.length < 6) {
          reject(new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل'));
          return;
        }
        resolve({ success: true });
      }, 1200);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        signIn,
        signOut,
        loading,
        lockoutRemaining,
        failedAttempts,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
