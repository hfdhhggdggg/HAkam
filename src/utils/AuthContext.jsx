import { createContext, useContext, useState, useEffect } from 'react';
import { referees } from '../lib/mockData';

const AuthContext = createContext({
  user: null,
  role: null,
  signIn: () => {},
  signOut: () => {},
  loading: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('auth_user');
    const storedRole = sessionStorage.getItem('auth_role');
    if (stored) {
      setUser(JSON.parse(stored));
      setRole(storedRole);
    }
  }, []);

  const signIn = (nationalId, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        if (nationalId === 'admin' && password === 'admin123') {
          const adminUser = { name: 'إدارة الاتحاد', role: 'admin' };
          setUser(adminUser);
          setRole('admin');
          sessionStorage.setItem('auth_user', JSON.stringify(adminUser));
          sessionStorage.setItem('auth_role', 'admin');
          resolve(adminUser);
          return;
        }
        const referee = referees.find((r) => r.nationalId === nationalId);
        if (referee && password === 'referee123') {
          const refUser = { name: referee.name, role: 'referee', refereeId: referee.id, status: referee.status };
          setUser(refUser);
          setRole('referee');
          sessionStorage.setItem('auth_user', JSON.stringify(refUser));
          sessionStorage.setItem('auth_role', 'referee');
          resolve(refUser);
          return;
        }
        reject(new Error('الرقم القومي أو كلمة المرور غير صحيحة'));
      }, 1200);
    });
  };

  const signOut = () => {
    setUser(null);
    setRole(null);
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
