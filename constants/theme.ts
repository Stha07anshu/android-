import { Platform } from "react-native";

const primaryLight = "#4A90E2";
const primaryDark = "#5AA3F0";

export const Colors = {
  light: {
    primary: "#4A90E2",
    secondary: "#5FC9E8",
    background: "#F5F9FC",
    surface: "#FFFFFF",
    text: "#1A2B3C",
    textSecondary: "#6B7C8C",
    success: "#4CAF50",
    border: "#E0E8F0",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B7C8C",
    tabIconSelected: primaryLight,
    link: "#4A90E2",
    backgroundRoot: "#F5F9FC",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F9FC",
    backgroundTertiary: "#E0E8F0",
  },
  dark: {
    primary: "#5AA3F0",
    secondary: "#6ED4EC",
    background: "#0F1419",
    surface: "#1A2530",
    text: "#E8F1F8",
    textSecondary: "#9BADB8",
    success: "#66BB6A",
    border: "#2A3945",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BADB8",
    tabIconSelected: primaryDark,
    link: "#5AA3F0",
    backgroundRoot: "#0F1419",
    backgroundDefault: "#1A2530",
    backgroundSecondary: "#1F2A35",
    backgroundTertiary: "#2A3945",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
