import api from "../api/axios";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useTranslation } from 'react-i18next';
import { emailValidator } from "../utils/validator";
import EditingPasswordForm from "./EditingPasswordForm";

function MyAccount() {

  const { t, i18n } = useTranslation();
  const { theme, setTheme, darkMode, setDarkMode } = useContext(ThemeContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [formData, setFormData] = useState({ username:"", email: "" });
  const [user, setUser]=useState({});
  const [error, setError]=useState("");

  useEffect(() => {
    api.get("/users/me")
      .then((response) => {
        setUser(response.data);
        setFormData({
          username: response.data.userName,
          email: response.data.email,
          preferredLanguage: response.data.preferredLanguage,
          preferredTheme: response.data.preferredTheme,
          darkMode: response.data.darkMode
        });
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleSaveEmail = async () => {
    if(!emailValidator(formData.email)){
      setError(t('error.email_invalid'));
      return;
    }
    try {
      const response = await api.patch("/users/me", formData);
      setUser(response.data);
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error(err);
    }
  }

  const handleThemeChange = async (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    setFormData(prev => ({...prev, preferredTheme: newTheme}));
    try {
      const response = await api.patch("/users/me", { ...formData, preferredTheme: newTheme });
      const updatedUser = { ...JSON.parse(localStorage.getItem("user")), preferredTheme: newTheme };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  const handleLanChange = async (e) => {
    const newLang=e.target.value;
    i18n.changeLanguage(newLang);
    setFormData(prev => ({...prev, preferredLanguage: newLang}));
    
    try {
      const response = await api.patch("/users/me", {...formData,preferredLanguage: newLang});
      const updatedUser = { ...JSON.parse(localStorage.getItem("user")), preferredLanguage: newLang };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  const toggleDarkMode = async () => {
    const newMode = darkMode === "dark" ? "light" : "dark";
    setDarkMode(newMode);

    try {
      const response = await api.patch("/users/me", { ...formData, darkMode: newMode === "dark" });
      const updatedUser = { ...JSON.parse(localStorage.getItem("user")), preferredMode: newMode };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("Updated in backend and localStorage:", response.data);
      console.log(localStorage);
    } catch (err) {
      console.error(err);
    }
  };

  //Edit
  const handleEdit = () => {
    if (user) {
      setIsEditing(!isEditing);
    }
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
  }

  const handleClosePasswordForm = () => {
    setIsEditingPassword(false);
  }

  return (
    <div className="flex w-full flex-col items-center gap-5 py-10">
      <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
        <h4 className="text-lg font-semibold mb-2 w-1/2">{t('dashboard.my_account')}</h4>
        <hr className="border-[color:var(--primary)] mb-2" />
        <div className="grid grid-cols-[1fr_2fr_1fr_2fr] sd:grid-cols-2 gap-4">
            <label className="mr-2">{t('users.name')}:</label>
            <label className="mr-2">{user.userName}</label>
            <label className="mr-2">{t('users.theme')}:</label>
            <select className="h-8 w-1/2 ml-4 bg-[color:var(--background)] border rounded-full px-2 justify-start" value={theme} onChange={handleThemeChange}>
              <option value="blue">{t('button.blue')}</option>
              <option value="red">{t('button.red')}</option>
            </select>
            <label className="mr-2">{t('users.email')}:</label>
            {!isEditing ? 
            <label className="mr-2">{user.email}</label>
            :
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
            />
            }
            <label className="mr-2">{t('users.darkmode')}:</label>
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
            <label className="mr-2">{t('users.role')}:</label>
            <label className="mr-2">{user.roleName === "ROLE_ADMIN"
                            ? t('users.admin')
                            : user.roleName === "ROLE_ACCOUNTING"
                            ? t('users.accounting')
                            : user.roleName === "ROLE_USER"
                            ? t('users.user')
                            : user.roleName}</label>
            <label className="mr-2">{t('users.language')}:</label>
            <select className=" h-8 w-1/2 ml-4 bg-[color:var(--background)] border rounded-full px-2"
                    value={i18n.language}
                    onChange={handleLanChange}>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
            <label className="mr-2">{t('users.plan')}:</label>
            <label className="mr-2">{user.planName}</label>
          </div>
          <div className="flex justify-end">
           {error && (
              <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                {error}
              </div>
            )}
            {!isEditing ?(
              <div className="flex gap-2">
                <button
                  onClick={handleEditPassword}
                  className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                >
                  {t('button.edit_password')}
                </button>
                <button
                  onClick={handleEdit}
                  className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                >
                  {t('button.edit')}
                </button>
              </div> ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                  >
                    {t('button.cancel')}
                </button>
                <button
                  onClick={handleSaveEmail}
                  className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                >
                  {t('button.save')}
                </button>
              </div>
            )}
          </div>
      </div>
      {isEditingPassword && (
        <EditingPasswordForm onClose={handleClosePasswordForm} />
      )}
    </div>
  );
}

export default MyAccount;
