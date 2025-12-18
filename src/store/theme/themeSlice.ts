import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  name: "light" | "dark";
  primaryColor: string;
}

const initialState: ThemeState = {
  name: "light",
  primaryColor: "#1890ff",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    initTheme: (state) => {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        const savedColor = localStorage.getItem("primaryColor");
        if (savedTheme) state.name = savedTheme;
        if (savedColor) state.primaryColor = savedColor;
      }
    },
    toggleTheme: (state) => {
      state.name = state.name === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.name);
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.name = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("primaryColor", action.payload);
      }
    },
  },
});

export const { toggleTheme, setTheme, setPrimaryColor, initTheme } = themeSlice.actions;
export default themeSlice.reducer;