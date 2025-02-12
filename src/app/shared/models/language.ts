export const languages = ['de', 'fr', 'it', 'en'] as const;
export type Language = (typeof languages)[number];
