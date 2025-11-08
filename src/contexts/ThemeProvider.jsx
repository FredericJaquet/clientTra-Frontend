import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("blue");
  const [darkMode, setDarkMode] = useState("light");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setTheme(storedUser.preferredTheme || "blue");
      setDarkMode(storedUser.preferredMode || "light");
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

  const toggleDarkMode = () => {
    setDarkMode(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, darkMode, setDarkMode,  toggleDarkMode}}>
      {children}
    </ThemeContext.Provider>
  );
}
