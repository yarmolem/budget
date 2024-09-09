import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { type Language, type Namespace, getOptions } from "./settings";

const initI18next = async (lng: Language, ns: Namespace) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string, namespace: string) => {
        return import(`public/locales/${language}/${namespace}.json`);
      }),
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function useServerTranslation(
  lng: Language,
  ns: Namespace,
  options?: { keyPrefix: string },
) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, ns, options?.keyPrefix),
    i18n: i18nextInstance,
  };
}
