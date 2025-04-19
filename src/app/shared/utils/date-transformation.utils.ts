/**
 * Transforms a date object into a string in the format 'YYYYMMDD'.
 */
export function transformDateToString(date: Date): string {
  const year = date.getFullYear();
  return `${year}`;
}

/**
 * Transforms a string in the format 'YYYYMMDD' into a date object; returns undefined if the input is either undefined or incorrectly formatted.
 */
export function transformStringToDate(date: string | undefined): Date | undefined {
  if (!date || date.length < 4) {
    return undefined;
  }
  const year = Number(date.substring(0, 4));

  if (Number.isNaN(year)) {
    return undefined;
  }

  return new Date(date);
}
