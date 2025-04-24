/**
 * Identifies the steps of the main form stepper.
 */
export const formStepConstants = {
  STATION_SELECTION: 0,
  INTERVAL_SELECTION: 1,
  TIME_RANGE_SELECTION: 2,
  SELECTION_REVIEW: 3,
  DOWNLOAD_ASSET: 4,
} as const;
export type FormStep = (typeof formStepConstants)[keyof typeof formStepConstants];
