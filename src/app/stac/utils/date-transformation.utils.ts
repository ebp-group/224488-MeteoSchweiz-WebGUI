/**
 * Transforms a date object into a string in the format 'YYYYMMDD'.
 */
export function transformDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Transforms a string in the format 'YYYYMMDD' into a date object; returns undefined if the input is either undefined or incorrectly formatted.
 */
export function transformStringToDate(date: string | undefined): Date | undefined {
  if (!date || date.length < 8) {
    return undefined;
  }
  const year = Number(date.substring(0, 4));
  const month = Number(date.substring(4, 6));
  const day = Number(date.substring(6, 8));

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return undefined;
  }

  // Note: months are 0-indexed in JavaScript Date objects
  return new Date(year, month - 1, day);
}
