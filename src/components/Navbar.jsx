import { Link, useNavigate } from "react-router-dom";
import '../assets/css/App.css';
import { useTranslation } from 'react-i18next';
import LanguageSelector from "./LanguageSelector";
import axios from "../api/axios";
import { useState } from "react";

function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [checkingDashboard, setCheckingDashboard] = useState(false);

  const handleDashboardClick = async () => {
    console.log("Navegando a Dashboard");
    if (checkingDashboard) return; // Avoid repeted clicks
    setCheckingDashboard(true);

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No hay token, redirigiendo a login");
      navigate("/");
      setCheckingDashboard(false);
      return;
    }

    try {
      await axios.get("/auth/validate-token"); // Validate token from backend
      navigate("/dashboard"); // token valid → entrer
    } catch (err) {
      console.error("Error validando token:", err);
      // Token no valid → clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } finally {
      setCheckingDashboard(false);
    }
  };

  return (
    <nav className="w-full">
      <div className="w-full mx-auto px-4 py-3 flex space-x-8">
        <Link to="/" className="text-[color:var(--text)] font-bold hover:text-[color:var(--primary-hover)] hover:underline">{t('navbar.login')}</Link>
        <Link to="/project" className="text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline">{t('navbar.project')}</Link>

        {/* Dashboard: validation of the token before navigation */}
        <span
          onClick={handleDashboardClick}
          className={`cursor-pointer text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline ${checkingDashboard ? "opacity-50 pointer-events-none" : ""}`}
        >
          {checkingDashboard ? t('navbar.loading') : t('navbar.dashboard')}
        </span>

        <Link to="/register" className="text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline">{t('navbar.register')}</Link>
        <Link to="/legal" className="text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline">{t('navbar.legal')}</Link>
        <LanguageSelector/>
      </div>
    </nav>
  );
}

export default Navbar;
