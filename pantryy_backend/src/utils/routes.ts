export const withPrefix = (prefix: string, path: string): string => `${prefix}${path}`.replace(/\/+/g, '/');
