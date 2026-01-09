// store/useAuthStore.js
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  login: async (token) => {
    try {
      set({ loading: true });
      localStorage.setItem("token", token);
      set({ token });

      // Fetch user data using the token
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      // Store user in memory only, not localStorage
      set({ user: data.user, loading: false });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  restore: async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        set({ token });
        
        // Fetch fresh user data from server
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          set({ user: data.user });
        } else {
          // Token invalid, clear it
          localStorage.removeItem("token");
          set({ token: null, user: null });
        }
      }
    } catch {
      localStorage.removeItem("token");
      set({ user: null, token: null });
    }
  },

  // Method to get fresh user data when needed
  refreshUser: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ user: data.user });
      }
    } catch (err) {
      console.warn('Could not refresh user data:', err);
    }
  },
}));

export default useAuthStore;
