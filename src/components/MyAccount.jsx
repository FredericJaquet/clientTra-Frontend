import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

function MyAccount() {
  const { theme, setTheme, darkMode, setDarkMode } = useContext(ThemeContext);

  const handleThemeChange = (e) => setTheme(e.target.value);

  const toggleDarkMode = () => setDarkMode(prev => (prev === "dark" ? "light" : "dark"));

  return (
    <div className="p-5">
      <h2>Mi Cuenta</h2>

      <div className="mb-4">
        <label className="mr-2">Theme:</label>
        <select className="text-black" value={theme} onChange={handleThemeChange}>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span>Modo oscuro</span>
        <button
          onClick={toggleDarkMode}
          className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
            darkMode === "dark" ? "bg-gray-800" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              darkMode === "dark" ? "translate-x-6" : "translate-x-0"
            }`}
          ></span>
        </button>
      </div>
    </div>
  );
}

export default MyAccount;
