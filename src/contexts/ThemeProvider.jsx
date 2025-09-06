import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("blue");
  const [darkMode, setDarkMode] = useState("light");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setTheme(storedUser.preferredTheme || "blue");
      setDarkMode(storedUser.darkMode === "dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, darkMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
