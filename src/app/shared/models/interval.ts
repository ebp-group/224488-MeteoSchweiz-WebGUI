export const dataInterval = ['ten-minutes', 'hourly', 'daily', 'monthly', 'yearly'] as const;
export type DataInterval = (typeof dataInterval)[number];
