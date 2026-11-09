import i18next from "i18next";
import locI18next from "loc-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

export const i18nReady = i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ru"],
    load: "languageOnly",
    backend: {
      loadPath: `${import.meta.env.BASE_URL}assets/json/locales/{{lng}}/{{ns}}.json`,
    },
  });

const localize = locI18next.init(i18next);

export function translateContent(root?: HTMLElement) {
  if (root) localize("[data-i18n]", { document: root });
  else localize("body");
}

export function checkLanguage() {
  return (
    i18next.resolvedLanguage ||
    i18next.language?.split("-")[0] ||
    window.localStorage.getItem("i18nextLng")?.split("-")[0] ||
    "en"
  );
}

i18next.on("languageChanged", () => {
  document.documentElement.lang = checkLanguage();
  translateContent();
});
