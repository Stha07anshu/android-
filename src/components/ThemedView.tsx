import { View, type ViewProps } from "react-native";
import { useTheme } from "../hooks/useTheme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { colors, colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const backgroundColor =
    isDark && darkColor
      ? darkColor
      : !isDark && lightColor
        ? lightColor
        : colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
