import {DateRange} from '../../shared/models/date-range';

const DATE_RANGE_SEPARATOR = '-';

export function transformHistoricalDateRangeStringToDate(dateRangeString: string | undefined): DateRange | undefined {
  if (!dateRangeString) {
    return undefined;
  }
  const dates = dateRangeString.split(DATE_RANGE_SEPARATOR);
  if (dates.length !== 2) {
    return undefined;
  }
  return transformHistoricalDateStringsToDate(dates[0], dates[1]);
}

export function transformHistoricalDateStringsToDate(
  fromDateString: string | undefined,
  toDateString: string | undefined,
): DateRange | undefined {
  if (!fromDateString || !toDateString) {
    return undefined;
  }
  const fromDate = transformDateStringToDate(fromDateString);
  const toDate = transformDateStringToDate(toDateString);
  return fromDate != null && toDate != null ? {start: fromDate, end: toDate} : undefined;
}

export function transformHistoricalDateRangeToString(dateRange: DateRange | undefined): string | undefined {
  if (!dateRange) {
    return undefined;
  }
  return `${transformDateToDateString(dateRange.start)}${DATE_RANGE_SEPARATOR}${transformDateToDateString(dateRange.end)}`;
}

function transformDateStringToDate(date: string | undefined): Date | undefined {
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

function transformDateToDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
