import React from "react";
import { Platform, ScrollViewProps, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../hooks/useTheme";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing } from "../constants/theme";
import { ScreenScrollView } from "./ScreenScrollView";

export function ScreenKeyboardAwareScrollView(props: ScrollViewProps) {
  const { children, contentContainerStyle, style, keyboardShouldPersistTaps = "handled", ...rest } = props;

  const { colors } = useTheme();
  const { paddingTop, paddingBottom, scrollInsetBottom } = useScreenInsets();

  if (Platform.OS === "web") {
    return (
      <ScreenScrollView
        style={style}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...rest}
      >
        {children}
      </ScreenScrollView>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={[styles.container, { backgroundColor: colors.background }, style]}
      contentContainerStyle={[{ paddingTop, paddingBottom }, styles.contentContainer, contentContainerStyle]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      scrollIndicatorInsets={{ bottom: scrollInsetBottom }}
      {...rest}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: Spacing.xl },
});
