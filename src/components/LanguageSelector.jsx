import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="ml-4 border rounded-full px-2"
    >
      <option value="es">ES</option>
      <option value="fr">FR</option>
      <option value="en">EN</option>
    </select>
  );
}

export default LanguageSelector;