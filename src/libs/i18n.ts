import { createInstance, i18n, ResourceLanguage } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import i18nConfig from "@/i18nConfig";

// Import JSON files directly
import enTranslation from "@/locales/en.json";
import viTranslation from "@/locales/vi.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  vi: {
    translation: viTranslation,
  },
};

export default async function initTranslations(
  locale: string,
  i18nInstance?: i18n,
  customResources?: { [key: string]: ResourceLanguage }
) {
  i18nInstance = i18nInstance || createInstance();

  console.log("resources", customResources || resources);

  i18nInstance.use(initReactI18next);

  if (!customResources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string) => import(`@/locales/${language}.json`)
      )
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources: customResources || resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    preload: customResources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: { [locale]: i18nInstance.services.resourceStore.data[locale] },
    t: i18nInstance.t,
  };
}
