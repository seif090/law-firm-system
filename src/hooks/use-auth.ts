import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: 'admin' | 'lawyer' | 'staff' | null;
  userName: string | null;
  userEmail: string | null;
  setUser: (token: string, role: 'admin' | 'lawyer' | 'staff', userName: string, userEmail: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      role: null,
      userName: null,
      userEmail: null,
      setUser: (token, role, userName, userEmail) => set({ token, isAuthenticated: true, role, userName, userEmail }),
      clearUser: () => set({ token: null, isAuthenticated: false, role: null, userName: null, userEmail: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useAuth = () => {
  const { token, isAuthenticated, role, userName, userEmail, setUser, clearUser } = useAuthStore();
  
  return {
    token,
    isAuthenticated,
    role,
    userName,
    userEmail,
    setUser,
    clearUser,
  };
};