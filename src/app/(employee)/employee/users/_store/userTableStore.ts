import { create } from 'zustand';
import { User, UserStatus } from "@/types/user/user.type";
import _ from 'lodash';

interface UserTableState {
  users: User[];
  statistics: any;
  roles: any[];
  activeTab: string;
  searchKeyword: string; // Gộp chung username và email
  selectedRoles: string[];
  pagination: { current: number; pageSize: number; total: number };
  lockModal: { open: boolean; userId: string | null; reason: string };
  detailModal: { open: boolean; userId: string | null };
  updateModal: { open: boolean; user: User | null };

  updateState: (newState: Partial<UserTableState> | ((state: UserTableState) => Partial<UserTableState>)) => void;
  resetFilters: () => void;
}

export const useUserTableStore = create<UserTableState>((set) => ({
  users: [],
  statistics: null,
  roles: [],
  activeTab: "ALL",
  searchKeyword: "",
  selectedRoles: [],
  pagination: { current: 1, pageSize: 10, total: 0 },
  lockModal: { open: false, userId: null, reason: "" },
  detailModal: { open: false, userId: null },
  updateModal: { open: false, user: null },

  updateState: (newState) => set((state) => ({
    ...(typeof newState === 'function' ? newState(state) : newState)
  })),

  resetFilters: () => set({
    searchKeyword: "",
    selectedRoles: [],
    activeTab: "ALL",
    pagination: { current: 1, pageSize: 10, total: 0 }
  }),
}));