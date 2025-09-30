import { useTranslation } from 'react-i18next';
import alert_blue from "../assets/img/alert_blue.png";
import alert_red from "../assets/img/alert_red.png";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

function DemoBanner({ onCreateRealAccount }){

    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";
    const { theme } = useContext(ThemeContext);

    const alertImg = theme === "red" ? alert_red : alert_blue;

    return (
        <div className="bg-white/70 backdrop-blur-lg border-b border-gray-200 dark:bg-neutral-900/60 dark:border-neutral-800">
            <div className="max-w-[85rem] px-4 py-3 sm:px-6 lg:px-8 mx-auto">
                <div className="grid sm:grid-cols-2 sm:items-center gap-4">
            
                    {/* Texto */}
                    <div className="flex items-center gap-x-3 md:gap-x-5">
                        <img    id="glass_icon"
                                            className="me-2 h-10 hover:cursor-pointer hover:drop-shadow-xl"
                                            src={alertImg}
                                            alt="Alert"/>
                        <div>
                        <p className="md:text-lg font-semibold text-[color:#1f2937] dark:text-neutral-200">
                            {t("dashboard.demo_banner1")}
                        </p>
                        <p className="text-sm text-[color:#1f2937] dark:text-neutral-400">
                            {t("dashboard.demo_banner2")}
                        </p>
                        </div>
                    </div>

                    {/* Botón */}
                    {role === "ROLE_ADMIN" &&
                    <div className="flex sm:justify-end sm:items-center">
                        <button
                        onClick={onCreateRealAccount}
                        className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full bg-[color:var(--secondary)] text-[color:var(--text)] hover:bg-[color:var(--secondary-light-hover)] focus:outline-none"
                        >
                        {t("dashboard.demo_banner_link")}
                        </button>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default DemoBanner;
