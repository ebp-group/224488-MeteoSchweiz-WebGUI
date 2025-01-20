import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StacService {
  // Need to augment collection type with `assets: ItemAssets` to return the links
  // - functions to return link to metadata.
  //   metadata will be used to find all the stations and parameters available
  // - get item
  //    need to be able to search based on date, interval etc
  // I guess we only need the ch.meteoschweiz.ogd-smn collection
}
/*
Data flow
- get metadata for stations, and parameters
  - need to parse csv for this
- show stations on the map
- show available parameters
- 
*/
