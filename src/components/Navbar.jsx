import React from "react";
import { Link } from "react-router-dom";
import '../assets/css/App.css';
import { useTranslation } from 'react-i18next';
import LanguageSelector from "./LanguageSelector";

function Navbar() {

  const { t } = useTranslation();

  return (
    <nav >
      <div className="max-w-7xl mx-auto px-4 py-3 flex space-x-8">
        <Link to="/" className="text-[color:var(--primary)] font-bold hover:text-[color:var(--primary-hover)] hover:underline">{t('navbar.login')}</Link>
        <a href="#" className="text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline">{t('navbar.project')}</a>
        <Link to="/dashboard" className="text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline">{t('navbar.dashboard')}</Link>
        <Link to="/Register" className="text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline">{t('navbar.register')}</Link>
        <LanguageSelector/>
      </div>
    </nav>
  );
}

export default Navbar;