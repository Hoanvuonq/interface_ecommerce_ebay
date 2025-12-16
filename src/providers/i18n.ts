import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en/auth.json";
import vi from "@/locales/vi/auth.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: "vi", // nếu không tìm thấy thì mặc định tiếng Việt
    interpolation: {
      escapeValue: false, // react đã tự chống XSS
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"], // thứ tự ưu tiên
      caches: ["localStorage", "cookie"], // nơi lưu lại
    },
  });

export default i18n;
