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

export const setCookies = (cookies: Record<string, Nullable<string>>) => {
  const preparedCookies = Object.entries(cookies).map(([cookieName, cookieValue]) => {
    if (isEmpty(cookieValue)) {
      return null;
    }

    return `${cookieName}=${cookieValue}`;
  }).filter(isNotNil).join('; ');

  document.cookie = preparedCookies;
}

export const getCookie = (cookieName: string): Nullable<string> => getCookies()[cookieName];

export const removeCookie = (cookieName: string): void => {
  document.cookie = `${cookieName}=; expires=${new Date(0).toUTCString()};`;
}
