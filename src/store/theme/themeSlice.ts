import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeState } from "./types";

// Lấy từ localStorage nếu có, nếu không dùng env, fallback hardcode
const savedTheme =
  typeof window !== "undefined"
    ? localStorage.getItem("theme")
    : (process.env.NEXT_PUBLIC_THEME_MODE as "light" | "dark") || "light";

const savedPrimaryColor =
  typeof window !== "undefined"
    ? localStorage.getItem("primaryColor")
    : process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#1890ff";

const initialState: ThemeState = {
  name: (savedTheme as "light" | "dark") || "light",
  primaryColor: savedPrimaryColor || "#1890ff",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.name = state.name === "light" ? "dark" : "light";
      if (typeof window !== "undefined") localStorage.setItem("theme", state.name);
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
      if (typeof window !== "undefined")
        localStorage.setItem("primaryColor", state.primaryColor);
    },
  },
});

export const { toggleTheme, setPrimaryColor } = themeSlice.actions;
export default themeSlice.reducer;
