import React from "react";
import axios from "../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../contexts/ThemeContext"; 

function LoginForm() {

    const { t, i18n } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const errors = {
      "Invalid username or password": t('error.incorrect_credentials'),
      "User disabled": t('error.user_disabled'),
      "Authentication failed": t('error.auth_failed')
    }

  const [error, setError] = useState('');

  const [formData, setFormData]= useState({ username: '', password: '' })
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login ejecuntando");

    if (!formData.username || !formData.password) {
      setError(t('error.all_fields_required'));
      return;
    }

    try {
      const response = await axios.post("/auth/login", formData);

      const token = response.data.token;
      const { token: _, ...user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      i18n.changeLanguage(user.preferredLanguage).then(() => {
        setError("");
        navigate("/dashboard");
      });

    } catch (err) {
      console.log("Error de login capturado:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const backendError = err?.response?.data?.error;
      setError(errors[backendError] ?? t('error.auth_failed'));
    }
  };
  
  return (
    <div className="min-h-screen w-1/2 bg-[color:var(--primary)] rounded-full flex items-center justify-center">
      <div className="bg-[color:var(--secondary)] backdrop-blur-md rounded-2xl border border-[color:var(--border)] drop-shadow-xl hover:drop-shadow-2xl p-8 w-4/5 max-w-md overflow-hidden">
        <h2 className="text-2xl font-bold text-[color:var(--text)] text-center mb-2">{t('login.title')}</h2>
        <p className="text-[color:var(--text)] text-center mb-6">
          {t('login.intro')}
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            placeholder={t('login.username')}
            className="p-2 rounded-lg border bg-[color:var(--background)] w-full"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              className="p-2 rounded-lg border bg-[color:var(--background)] w-full"
              placeholder={t('login.password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
          <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
            {error}
          </div>
        )}
          <button
            type="submit"
            className="bg-[color:var(--primary)] text-white rounded-lg py-2 hover:bg-[color:var(--primary-hover)] transition"
          >
            {t('login.submit')}
          </button>
          <Link to="/Register" className=" text-center text-[color:var(--text)]">{t('login.no_account')}</Link>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
