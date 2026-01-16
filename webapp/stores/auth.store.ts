import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services';
import type { User, LoginCredentials, RegisterData, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          set({
            user: {
              id: response.user.id,
              email: response.user.email,
              firstName: response.user.firstName,
              lastName: response.user.lastName,
              role: response.user.role,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error('Invalid credentials');
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);
          set({
            user: {
              id: response.user.id,
              email: response.user.email,
              firstName: response.user.firstName,
              lastName: response.user.lastName,
              role: response.user.role,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error('Registration failed');
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      setHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export const useIsAdmin = (): boolean => {
  const { user } = useAuthStore();
  return user?.role === ('admin' as UserRole);
};
