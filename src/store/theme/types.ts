export type ThemeName = "light" | "dark";

export interface ThemeState {
  name: ThemeName;
  primaryColor?: string;
}
