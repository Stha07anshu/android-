import { Text, type TextProps } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Typography } from "../constants/theme";
import { useMemo } from "react";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "h1" | "h2" | "h3" | "h4" | "body" | "small" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "body",
  ...rest
}: ThemedTextProps) {
  const { colors, colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const textColor = useMemo(() => {
    if (isDark && darkColor) return darkColor;
    if (!isDark && lightColor) return lightColor;
    if (type === "link") return colors.primary;
    return colors.text;
  }, [isDark, lightColor, darkColor, type, colors]);

  const typeStyle = useMemo(() => {
    switch (type) {
      case "h1": return Typography.h1;
      case "h2": return Typography.h2;
      case "h3": return Typography.h3;
      case "h4": return Typography.h4;
      case "body": return Typography.body;
      case "small": return Typography.small;
      case "link": return Typography.link;
      default: return Typography.body;
    }
  }, [type]);

  return <Text style={[{ color: textColor }, typeStyle, style]} {...rest} />;
}
