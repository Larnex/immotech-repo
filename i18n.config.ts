import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { de, en } from "./translations/index";

//empty for now
const resources = {
  de: {
    translation: de,
  },
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v3',
  //language to use if translations in user language are not available
  fallbackLng: "de",
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
