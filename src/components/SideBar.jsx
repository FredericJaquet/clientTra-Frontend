import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import logoBlue from "../assets/img/logo_blue_transparent500x150.png";
import logoRed from "../assets/img/logo_red_transparent500x150.png";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Sidebar() {

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const { t } = useTranslation();
    
    const [theme, setTheme] = useState("red");

    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        if (currentTheme) {
            setTheme(currentTheme);
        }
    }, []);

    const logo = theme === "red" ? logoRed : logoBlue;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.documentElement.setAttribute("data-theme", "blue");
        document.documentElement.classList.remove("dark");
    };

    return (
        <div
            id="sidebar"
            className="w-56 h-screen bg-[color:var(--primary)] p-3 rounded-r-3xl shadow-[8px_0_25px_rgba(0,0,0,0.35)] overflow-y-auto "
        >
            <img
                className="flex-none mb-4 rounded-md w-auto"
                width={220}
                height={150}
                src={logo}
                alt="Logo"
            />

            {/* Menú */}
            <div className="sticky top-0 flex flex-col gap-2">
                <h6 className="text-lg font-semibold text-[color:var(--text-light)] mt-3">{t('dashboard.menu')}</h6>
                <ul className="flex flex-col gap-1">
                    <li><Link to="/" onClick={handleLogout} className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block">{t('dashboard.logout')}</Link></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">{t('dashboard.dashboard')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">{t('dashboard.my_account')}</a></li>
                </ul>

                <h6 className="text-lg font-semibold text-[color:var(--text-light)] mt-4">{t('dashboard.companies')}</h6>
                <ul className="flex flex-col gap-1">
                    {role === "ROLE_ADMIN" && (<li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">{t('dashboard.users')}</a></li>)}
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">{t('dashboard.my_company')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">{t('dashboard.customers')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">{t('dashboard.providers')}</a></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">{t('dashboard.create')}</h6>
                <ul className="flex flex-col gap-1">
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.orders')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.customer_invoices')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.provider_invoices')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.quotes')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.pos')}</a></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">{t('dashboard.documents')}</h6>
                <ul className="flex flex-col gap-1">
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.orders')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.customer_invoices')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.provider_invoices')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.quotes')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.pos')}</a></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">{t('dashboard.reports')}</h6>
                <ul className="flex flex-col gap-1">
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.incomes')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.outcomes')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.cashing')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.payment')}</a></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">{t('dashboard.graphics')}</h6>
                <ul className="flex flex-col gap-1">
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.incomes')}</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">{t('dashboard.outcomes')}</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
