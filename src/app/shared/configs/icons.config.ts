import type {IconConfig} from '../models/configs/icons-config';

export const emptyIcon = {id: 'empty', path: 'icons/empty.svg'} as const satisfies IconConfig;

const parameterGroupIcons = [
  {id: 'pressure', path: 'icons/druck.svg'},
  {id: 'humidity', path: 'icons/feuchte.svg'},
  {id: 'foehn index', path: 'icons/foehnindex.svg'},
  {id: 'radiation', path: 'icons/globalstrahlung.svg'},
  {id: 'pollen data', path: 'icons/pollen.svg'},
  {id: 'precipitation', path: 'icons/regen.svg'},
  {id: 'snow', path: 'icons/schnee.svg'},
  {id: 'sunshine', path: 'icons/sonne.svg'},
  {id: 'evaporation', path: 'icons/taupunkt.svg'},
  {id: 'temperature', path: 'icons/temperatur.svg'},
  {id: 'visual observation', path: 'icons/wetterkamera.svg'},
  {id: 'wind', path: 'icons/wind.svg'},
] as const satisfies IconConfig[];

export const iconsConfig = [...parameterGroupIcons, emptyIcon] as const satisfies IconConfig[];
