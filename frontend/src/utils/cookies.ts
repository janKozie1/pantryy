import { isEmpty, isNotNil } from "./guards";
import type { Nullable } from "./types";

const getUnparsedCookies = (): string[] => document.cookie.split(';');

const getCookieName = (cookie: string): Nullable<string> => (cookie.split("=")[0])?.trim();
const getCookieValue = (cookie: string): Nullable<string> => (cookie.split("=")[1])?.trim();

export const getCookies = (): Record<string, string> => getUnparsedCookies().map((cookie) => {
  const cookieName = getCookieName(cookie);
  const cookieValue = getCookieValue(cookie);

  return isEmpty(cookieName) ? null : [cookieName, isEmpty(cookieValue) ? null : cookieValue] as const;
}).filter(isNotNil).reduce((acc, [name, value]) => ({
  ...acc,
  [name]: value
}), {})


export const getCookie = (cookieName: string): Nullable<string> => getCookies()[cookieName]
