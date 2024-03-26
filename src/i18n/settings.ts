export type Language = "en" | "es";
export type Namespace =
  | "common"
  | "sidebar"
  | "tags-page"
  | "dashboard-page"
  | "categories-page"
  | "transactions-page";

export const cookieName = "i18next";
export const fallbackLng: Language = "es";
export const defaultNS: Namespace = "dashboard-page";
export const languages: Language[] = [fallbackLng, "en"];

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
