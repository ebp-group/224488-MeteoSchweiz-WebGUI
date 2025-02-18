export interface CsvParameter {
  parameterShortname: string;
  parameterDescriptionDe: string;
  parameterDescriptionFr: string;
  parameterDescriptionIt: string;
  parameterDescriptionEn: string;
  parameterGroupDe: string;
  parameterGroupFr: string;
  parameterGroupIt: string;
  parameterGroupEn: string;
  parameterGranularity: 'T' | 'H' | 'D' | 'M' | 'Y';
  parameterDecimals: `${number}`;
  parameterDatatype: 'Integer' | 'Float';
  parameterUnit: string;
}
