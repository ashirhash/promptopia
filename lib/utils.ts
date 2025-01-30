import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidString = (
  stringToCheck: string | null | undefined
): boolean => {
  return !!(
    stringToCheck &&
    stringToCheck.trim() !== "" &&
    stringToCheck !== "null" &&
    stringToCheck !== "undefined"
  );
};