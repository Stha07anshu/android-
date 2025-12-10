import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export type ScreenOptionsParams = {
  colors: {
    primary: string;
    background: string;
    text: string;
    surface: string;
    // add other colors if needed
  };
};

export const getCommonScreenOptions = ({ colors }: ScreenOptionsParams): NativeStackNavigationOptions => ({
  headerStyle: {
    backgroundColor: colors.background,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold",
  },
});
