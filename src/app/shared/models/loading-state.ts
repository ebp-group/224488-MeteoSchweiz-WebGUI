export const loadingStates = [undefined, 'loading', 'loaded', 'error'] as const;
export type LoadingState = (typeof loadingStates)[number];
