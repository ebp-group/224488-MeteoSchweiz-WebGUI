export interface CsvDataInventory {
  measCatNr: `${number}`;
  owner: string;
  parameterShortname: string;
  dataSince: string;
  stationAbbr: string;
  dataTill: string;
}

export interface OldCsvDataInventory {
  measCatNr: `${number}`;
  ownerOrgNameTx: string;
  paramShortNameTx: string;
  sinceDt: string;
  stationNatAbbrTx: string;
  tillDt: string;
}
