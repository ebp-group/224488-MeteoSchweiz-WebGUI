export const dataIntervals = ['ten-minutes', 'hourly', 'daily', 'monthly', 'yearly'] as const;
export type DataInterval = (typeof dataIntervals)[number];
