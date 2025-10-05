import logoBlue from "../assets/img/logo_blue_transparent500x150.png";
import logoRed from "../assets/img/logo_red_transparent500x150.png";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import SelectLanguage from "../contexts/LanguageContext";

function Sidebar() {

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const { t } = useTranslation();
    
    const { theme, darkMode, setTheme, toggleDarkMode } = useContext(ThemeContext);

    const logo = theme === "red" ? logoRed : logoBlue;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTheme("blue");
        if (darkMode) toggleDarkMode();
        SelectLanguage();
    };

    return (
        <div
            id="sidebar"
            className="w-56 h-screen bg-[color:var(--primary)] p-3 rounded-ee-3xl shadow-[8px_0_25px_rgba(0,0,0,0.35)] overflow-y-auto "
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
                    <li><Link to="/dashboard" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block">{t('dashboard.dashboard')}</Link></li>
                    <li><Link to="/dashboard/my-account" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block">{t('dashboard.my_account')}</Link></li>
                </ul>

                <h6 className="text-lg font-semibold text-[color:var(--text-light)] mt-4">{t('dashboard.companies')}</h6>
                <ul className="flex flex-col gap-1">
                    {role === "ROLE_ADMIN" && (
                        <li><Link to="/dashboard/users" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block">{t('dashboard.users')}</Link></li>
                    )}
                        <li><Link to="/dashboard/my-company" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block">{t('dashboard.my_company')}</Link></li>
                        <li><Link to="/dashboard/customers" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block">{t('dashboard.customers')}</Link></li>
                        <li><Link to="/dashboard/providers" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block">{t('dashboard.providers')}</Link></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">{t('dashboard.documents')}</h6>
                <ul className="flex flex-col gap-1">
                    <li><Link to="/dashboard/orders/customers/list" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.orders_customers')}</Link></li>
                    <li><Link to="/dashboard/orders/providers/list" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.orders_providers')}</Link></li>
                    <li><Link to="/dashboard/customer-invoice/list" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.customer_invoices')}</Link></li>
                    <li><Link to="/dashboard/provider-invoice/list" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.provider_invoices')}</Link></li>
                    <li><Link to="/dashboard/quote/list" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.quotes')}</Link></li>
                    <li><Link to="/dashboard/po/list" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.pos')}</Link></li>
                </ul>
            {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                <>
                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">{t('dashboard.reports')}</h6>
                <ul className="flex flex-col gap-1">
                    <li><Link to="/dashboard/report/incomes" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.incomes')}</Link></li>
                    <li><Link to="/dashboard/report/outcomes" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.outcomes')}</Link></li>
                    <li><Link to="/dashboard/report/cashing" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.cashing')}</Link></li>
                    <li><Link to="/dashboard/report/payment" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.payment')}</Link></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">{t('dashboard.graphics')}</h6>
                <ul className="flex flex-col gap-1">
                    <li><Link to="/dashboard/graph/incomes" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.incomes')}</Link></li>
                    <li><Link to="/dashboard/graph/outcomes" className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block ">{t('dashboard.outcomes')}</Link></li>
                </ul>
                </>
            )}
            </div>
        </div>
    );
}

export default Sidebar;
