import React from "react";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";

function LegalTerms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="justify-items-start w-auto">
        <Navbar />
      </div>

      <div className="p-8 max-w-4xl mx-auto text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">{t("legal.title")}</h1>

        <h2 className="text-2xl font-semibold mb-4">
          {t("legal.subtitle")}
        </h2>

        <p className="mb-2 font-semibold">{t("legal.updated")}</p>
        <p><strong>{t("legal.controller")}</strong> Frédéric Jaquet</p>
        <p><strong>{t("legal.email")}</strong> frederic.jaquet@gmail.com</p>
        <p><strong>{t("legal.hosting")}</strong> Hetzner Online GmbH (Alemania)</p>

        <hr className="my-6 border-gray-300" />

        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <section key={n} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t(`legal.section${n}.title`)}</h3>
            {t(`legal.section${n}.text`, { returnObjects: true }) instanceof Array ? (
              <ul className="list-disc list-inside">
                {t(`legal.section${n}.text`, { returnObjects: true }).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{t(`legal.section${n}.text`)}</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default LegalTerms;
