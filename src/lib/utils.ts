import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import currency from "currency.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyUtils = {
  format: (value: currency.Any) => {
    return currency(value, {
      separator: ".",
      decimal: ",",
      symbol: "S/ ",
      pattern: `! #`,
    }).format();
  },
};
