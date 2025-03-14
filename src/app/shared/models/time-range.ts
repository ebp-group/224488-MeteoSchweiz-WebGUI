export const timeRanges = ['now', 'recent', 'historical'] as const;
export type TimeRange = (typeof timeRanges)[number];
