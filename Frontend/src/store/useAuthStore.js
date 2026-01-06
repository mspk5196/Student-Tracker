// store/useAuthStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token });
    console.log("jwt token stored in localStorage:", token);
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null });
  },

  restore: () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (token && user) set({ token, user });
    } catch {
      localStorage.clear();
    }
  },
}));

export default useAuthStore;
