import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing } from "../constants/theme";

const DEFAULT_HEADER_HEIGHT = 64;
const DEFAULT_TAB_BAR_HEIGHT = 60;

export function useScreenInsets() {
  const insets = useSafeAreaInsets();

  return {
    paddingTop: DEFAULT_HEADER_HEIGHT + Spacing.xl,
    paddingBottom: DEFAULT_TAB_BAR_HEIGHT + Spacing.xl,
    scrollInsetBottom: insets.bottom + 16,
  };
}
