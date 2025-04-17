import { User } from "@/graphql/hooks";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token = null) =>
        set({ user, token, isAuthenticated: !!user }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "user-storage",
    }
  )
);
