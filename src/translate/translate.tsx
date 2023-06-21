import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Language } from "./Language";
import translationEN from "./en.json";
import translationFR from "./fr.json";

let defaultLanguage = Language.EN;

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: defaultLanguage,

    keySeparator: ".", // to support nested translations

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

i18n.init({
  fallbackLng: "en",
});

export default i18n;
