import { useColorScheme as useColorSchemeRN } from "react-native";
import { useState, useEffect } from "react";
import { StorageService } from "../utils/storage";

export function useColorScheme() {
  const systemColorScheme = useColorSchemeRN();
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(systemColorScheme === "dark" ? "dark" : "light");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await StorageService.getTheme();
    if (savedTheme) {
      setColorScheme(savedTheme);
    }
  };

  const toggleColorScheme = async () => {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
    await StorageService.saveTheme(newScheme);
  };

  return { colorScheme, toggleColorScheme };
}
