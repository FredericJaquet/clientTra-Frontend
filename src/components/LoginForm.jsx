import React from "react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../contexts/ThemeContext"; 

function LoginForm() {

    const { t, i18n } = useTranslation();
    const { setTheme, setDarkMode } = useContext(ThemeContext);

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
      setTheme(user.preferredTheme);
      console.log(user.preferredMode);
      setDarkMode(user.preferredMode);
      i18n.changeLanguage(user.preferredLanguage).then(() => {
        setError("");
        navigate("/dashboard");
      });

    } catch (err) {
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
            className="border border-[color:var(--border)] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder={t('login.password')}
            className="border border-[color:var(--border)] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
          />
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
