import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function SelectLanguage(){
    const {i18n} = useTranslation();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if (storedUser?.preferredLanguage) {
            const lang=storedUser.preferredLanguage;
            i18n.changeLanguage(lang);
        }else{
            const lang = window.navigator.language || navigator.browserLanguage;
            i18n.changeLanguage(lang);
        }
    }, [i18n]);
}

export default SelectLanguage;
