export const capitalize = (str: string): string => {
  const [firstLetter, ...others] = str.split('');

  return `${firstLetter.toLocaleUpperCase()}${others.join('')}`
}
