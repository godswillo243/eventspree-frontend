import { TUser } from "../types";
import { create } from "zustand";

interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  setUser: (user: TUser | null) => void;
  clearUser: () => void;
  loaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loaded: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  setLoaded: (loaded) => set({ loaded }),
}));
