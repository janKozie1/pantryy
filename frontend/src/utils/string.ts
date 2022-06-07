export const capitalize = (str: string): string => {
  if (str.length < 1) {
    return str;
  }

  const [firstLetter, ...others] = str.split('');

  return `${firstLetter.toLocaleUpperCase()}${others.join('')}`
}
