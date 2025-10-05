import { useState } from "react";
import { useNavigate  } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from 'react-i18next';
import { emailValidator } from "../utils/validator";
import { Eye, EyeOff } from "lucide-react";

function RegisterStep1({ formData, setFormData, nextStep }) {

  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  let userLang = navigator.language || navigator.userLanguage;

  userLang = userLang.slice(0, 2).toLowerCase();
  if (!["es", "fr", "en"].includes(userLang)) {
      userLang = "en";
  }

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleActualRegister = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.emailAdmin || !formData.password || !formData.repeatedPassword) {
      setError(t('error.all_fields_required'));
      return;
    }
    if (formData.password !== formData.repeatedPassword) {
      setError(t('error.incorrect_repeated_password'));
      return;
    }
    if(!emailValidator(formData.emailAdmin)){
      setError(t('error.email_invalid'));
      return;
    }
    setError('');
    nextStep();
  };

  const handleDemoRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.emailAdmin || !formData.password || !formData.repeatedPassword) {
      setError(t('error.all_fields_required'));
      return;
    }
    if (formData.password !== formData.repeatedPassword) {
      setError(t('error.incorrect_repeated_password'));
      return;
    }

    try {
      await api.post("/registration/demo-data", {
        username: formData.username,
        password: formData.password,
        email: formData.emailAdmin,
        preferredLanguage: userLang,
        idRole: 1,
        idPlan: 1
      });
            
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="relative w-2/3 aspect-square bg-[color:var(--primary)] rounded-full flex items-center justify-center">
        <div className="bg-[color:var(--secondary)] rounded-2xl border text-[color:var(--text)] border-[color:var(--border)] drop-shadow-xl hover:drop-shadow-2xl p-8 w-2/3">
          <h3 className="fw-bold text-center mb-4">{t('register.title')}</h3>
          <p className="text-center mb-6 text-[color:var(--info)]"style={{ whiteSpace: 'pre-line' }}>{t('register.intro')}<br/><br/>
          </p>
          <form className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={t('register.username')}
                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                required
              />
              <input
                type="text"
                name="emailAdmin"
                value={formData.emailAdmin}
                onChange={handleChange}
                placeholder={t('register.email')}
                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                required
              />
            </div>
            <div className="flex gap-2">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="p-2 rounded-lg border bg-[color:var(--background)] w-full"
                  placeholder={t('register.password')}
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
                  name="repeatedPassword"
                  value={formData.repeatedPassword}
                  onChange={handleChange}
                  className="p-2 rounded-lg border bg-[color:var(--background)] w-full"
                  placeholder={t('register.repeated_password')}
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

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleDemoRegister}
                className="bg-[color:var(--primary)] text-white drop-shadow-2xl rounded-lg px-6 py-2 hover:bg-[color:var(--primary-hover)] transition"
              >
                {t('register.submit_demo')}
              </button>
              <button
                onClick={handleActualRegister}
                className="bg-[color:var(--primary)] text-white drop-shadow-2xl rounded-lg px-6 py-2 hover:bg-[color:var(--primary-hover)] transition"
              >
                {t('register.submit_actual')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterStep1;
