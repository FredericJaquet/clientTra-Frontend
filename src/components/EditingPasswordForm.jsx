import api from "../api/axios";
import { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../contexts/ThemeContext";
function EditingPasswordForm({ onClose }) {

    const { t } = useTranslation();
    const { darkMode, setTheme, toggleDarkMode } = useContext(ThemeContext);

    const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    const [error, setError] = useState("");
     const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.newPassword !== formData.confirmNewPassword){
            setError(t('error.incorrect_repeated_password'));
            return;
        }
        try {
            await api.patch("/users/me/change-password", {currentPassword: formData.currentPassword, newPassword: formData.newPassword});

            handleLogout();
            
            onClose();

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTheme("blue");
        if (darkMode) toggleDarkMode();
        window.location.href = "/";

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-xl shadow-lg w-1/4 p-4 bg-[color:var(--secondary)]">
                <h4 className="text-lg font-semibold mb-2 w-1/2">{t('users.change_password')}</h4>
                <hr className="border-[color:var(--primary)] mb-2" />
                <div className="flex flex-col gap-2">
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)] w-full"
                            placeholder={t('users.current_password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)] w-full"
                            placeholder={t('users.new_password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)] w-full"
                            placeholder={t('users.repeat_new_password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                {error && (
                <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                    {error}
                </div>
                )}
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                        >
                        {t('button.cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                        >
                        {t('button.save')}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default EditingPasswordForm;