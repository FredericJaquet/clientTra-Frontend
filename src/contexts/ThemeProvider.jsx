import { useState, useEffect } from "react"; // <-- añadir useContext
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("blue");
  const [darkMode, setDarkMode] = useState("light");
  const [isPublicOverride, setIsPublicOverride] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && !isPublicOverride) {
      setTheme(storedUser.preferredTheme || "blue");
      setDarkMode(storedUser.preferredMode || "light");
    }
  }, [isPublicOverride]);

  useEffect(() => {
    if (isPublicOverride) {
      document.documentElement.setAttribute("data-theme", "blue");
      document.documentElement.classList.remove("dark");
      return;
    }

    document.documentElement.setAttribute("data-theme", theme);
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, darkMode, isPublicOverride]);

  const forcePublicTheme = () => setIsPublicOverride(true);
  const clearPublicThemeOverride = () => setIsPublicOverride(false);
  const toggleDarkMode = () => setDarkMode(prev => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      darkMode,
      setDarkMode,
      toggleDarkMode,
      forcePublicTheme,
      clearPublicThemeOverride
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

