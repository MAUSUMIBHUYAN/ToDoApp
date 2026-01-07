import { Platform } from "react-native";

/**
 * Centralized theme for the app
 * Includes colors, fonts, and welcome screen constants
 */

export const Colors = {
  light: {
    background: "#f3e8ff",      // light purple background
    text: "#4b0082",            // dark purple text
    progressBar: "#9b59b6",     // bright purple
    progressTrack: "#d8b4fe",   // light purple track
    tick: "#f8c8dc",            // pink tick
    icon: "#6b46c1",
    tabIconDefault: "#6b46c1",
    tabIconSelected: "#9b59b6",
    selectedText: "#f3e8ff",
    selectedTextOnDark: "#1e0f3c",
  },
  dark: {
    background: "#1e0f3c",      // dark purple background
    text: "#e0c3fc",            // light purple text
    progressBar: "#9b59b6",     // bright purple
    progressTrack: "#3b0d5c",   // darker purple track
    tick: "#f8c8dc",            // pink tick
    icon: "#d3b4f1",
    tabIconDefault: "#9b59b6",
    tabIconSelected: "#f8c8dc",
    selectedText: "#1e0f3c",
    selectedTextOnDark: "#1e0f3c",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
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
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/**
 * Welcome screen constants
 */
export const Welcome = {
  logoText: "Smart Todo",
  subtitle: "Getting things ready…",
  progressBarHeight: 8,
  tickSize: 28,
  progressDuration: 3000, // progress bar animation duration in ms
};
