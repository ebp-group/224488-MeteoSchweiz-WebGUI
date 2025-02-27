export const measurementDataTypes = ['normal', 'homogenous'] as const;
export type MeasurementDataType = (typeof measurementDataTypes)[number];
