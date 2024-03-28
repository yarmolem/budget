import { useLanguageCtx } from "@/components/providers";
import { useClientTranslation } from "@/i18n/client";
import { type Namespace } from "@/i18n/settings";

export const useTranslation = (ns?: Namespace | Namespace[]) => {
  const { lng } = useLanguageCtx();

  if (!lng) {
    throw new Error("Missing language context");
  }

  const translation = useClientTranslation(lng, ns);

  return {
    ...translation,
    lng,
  };
};
