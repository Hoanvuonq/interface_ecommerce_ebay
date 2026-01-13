export const COLOR_NAME_MAP: Record<string, string> = {
  đỏ: "#f44336",
  "màu đỏ": "#f44336",
  red: "#f44336",
  xanh: "#2196f3",
  "xanh dương": "#2196f3",
  blue: "#2196f3",
  "xanh lá": "#4caf50",
  green: "#4caf50",
  "xanh lá cây": "#4caf50",
  đen: "#212121",
  black: "#212121",
  trắng: "#fafafa",
  white: "#fafafa",
  vàng: "#ffeb3b",
  yellow: "#ffeb3b",
  tím: "#9c27b0",
  purple: "#9c27b0",
  hồng: "#ec407a",
  pink: "#ec407a",
  cam: "#ff9800",
  orange: "#ff9800",
  nâu: "#795548",
  brown: "#795548",
  xám: "#9e9e9e",
  grey: "#9e9e9e",
  gray: "#9e9e9e",
};

export const COLOR_OPTION_REGEX = /(màu|mau|color)/i;

export const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const sanitizeColorValue = (value?: string): string | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (HEX_COLOR_REGEX.test(normalized)) {
    return normalized;
  }
  if (COLOR_NAME_MAP[normalized]) {
    return COLOR_NAME_MAP[normalized];
  }
  return null;
};