/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * Define which properties of the asset to query and the operations to apply.
 *
 * The following properties can be queried:
 * - `type`: query for assets with this specific media type
 * - `proj:epsg`: query for assets with this specific epsg
 * - `gsd`: query for assets with this specific gsd
 * - `geoadmin:variant`: query for assets with this specific variant
 * @example {"type":{"eq":"image/tiff"}}
 */
export type AssetQuery = Record<string, AssetQueryProp>;

/** Allows users to query asset properties for specific values */
export interface AssetQueryFilter {
  /**
   * Define which properties of the asset to query and the operations to apply.
   *
   * The following properties can be queried:
   * - `type`: query for assets with this specific media type
   * - `proj:epsg`: query for assets with this specific epsg
   * - `gsd`: query for assets with this specific gsd
   * - `geoadmin:variant`: query for assets with this specific variant
   */
  assetQuery?: AssetQuery;
}

/** Apply query operations to a specific property */
export type AssetQueryProp = {
  /** Find items with a property that contains the specified literal string, e.g., matches ".*<STRING>.*". A case-insensitive comparison must be performed. */
  contains?: string;
  /** Find items with a property that ends with the specified string. A case-insensitive comparison must be performed. */
  endsWith?: string;
  /** Find items with a property that is equal to the specified value. For strings, a case-insensitive comparison must be performed. */
  eq?: string | number | boolean | null;
  /** Find items with a property that equals at least one entry in the specified array. A case-insensitive comparison must be performed. */
  in?: (string | number)[];
  /** Find items with a property that begins with the specified string. A case-insensitive comparison must be performed. */
  startsWith?: string;
};

/**
 * Asset
 * The `property name` defines the ID of the Asset.
 */
export interface AssetBase {
  /** Displayed title */
  title?: Title;
  /**
   * Detailed multi-line description to fully explain the catalog or collection.
   *
   * [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation.
   */
  description?: Description;
  /**
   * Link to the asset object.
   *
   * Details about asset object calls, specifically information about caching behavior
   * can be found [here](#tag/Data/operation/getAssetObject)
   */
  href?: Href;
  /** `sha2-256` checksum of the asset in [multihash](https://multiformats.io/multihash/) format. */
  'file:checksum'?: ChecksumMultihashReadOnly;
  /** Purposes of the asset */
  roles?: Roles;
  'geoadmin:variant'?: GeoadminVariant;
  'geoadmin:lang'?: GeoadminLang;
  /** A Coordinate Reference System (CRS) is the data reference system (sometimes called a 'projection') used by the asset data, and can usually be referenced using an EPSG code. If the asset data does not have a CRS, such as in the case of non-rectified imagery with Ground Control Points, proj:epsg should be set to null. It should also be set to null if a CRS exists, but for which there is no valid EPSG code. */
  'proj:epsg'?: ProjEpsg;
  /**
   * GSD is the nominal Ground Sample Distance for the data, as measured in meters on the ground.
   *
   * There are many definitions of GSD. The value of this attribute should be related to the spatial resolution at the sensor, rather than the pixel size of images after ortho-rectification, pansharpening, or scaling. The GSD of a sensor can vary depending on off-nadir and wavelength, so it is at the discretion of the implementer to decide which value most accurately represents the GSD. For example, Landsat8 optical and short-wave IR bands are all 30 meters, but the panchromatic band is 15 meters. The gsd should be 30 meters in this case because that is nominal spatial resolution at the sensor. The Planet PlanetScope Ortho Tile Product has an gsd of 3.7 (or 4 if rounding), even though the pixel size of the images is 3.125. For example, one might choose for WorldView-2 the Multispectral 20° off-nadir value of 2.07 and for WorldView-3 the Multispectral 20° off-nadir value of 1.38.
   */
  gsd?: EoGsd;
  /** RFC 3339 compliant datetime string, time when the object was created */
  created: Created;
  /** RFC 3339 compliant datetime string, time when the object was updated */
  updated: Updated;
}

/**
 * The bounding box is provided as four numbers:
 *
 * * Lower left corner, coordinate axis 1
 * * Lower left corner, coordinate axis 2
 * * Upper right corner, coordinate axis 1
 * * Upper right corner, coordinate axis 2
 *
 * The coordinate reference system of the values is WGS84
 * longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
 *
 * For WGS84 longitude/latitude the values are in most cases the sequence
 * of minimum longitude, minimum latitude, maximum longitude and maximum
 * latitude. However, in cases where the box spans the antimeridian the
 * first value (west-most box edge) is larger than the third value
 * (east-most box edge).
 *
 * Example: The bounding box of Switzerland in
 * WGS 84 (from 5.96°E to 10.49°E and from 45.82°N to 47.81°N) would be
 * represented in JSON as `[5.96, 45.82, 10.49, 47.81]` and in a query as
 * `bbox=5.96,45.82,10.49,47.81`."
 * @maxItems 4
 * @minItems 4
 * @example [7.0906249,45.9160584,7.1035698,45.925093]
 */
export type Bbox = number[];

/**
 * Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four numbers:
 *
 * * Lower left corner, coordinate axis 1
 * * Lower left corner, coordinate axis 2
 * * Upper right corner, coordinate axis 1
 * * Upper right corner, coordinate axis 2
 *
 * The coordinate reference system of the values is WGS84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
 *
 * For WGS84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge).
 *
 * Example: The bounding box of Switzerland in WGS 84 (from 5.96°E to 10.49°E and from 45.82°N to 47.81°N) would be represented in JSON as `[5.96, 45.82, 10.49, 47.81]` and in a query as `bbox=5.96,45.82,10.49,47.81`."
 * @maxItems 4
 * @minItems 4
 * @example [7.0906249,45.9160584,7.1035698,45.925093]
 */
export type Bboxfilter = number[];

export interface BboxFilter {
  /**
   * Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four numbers:
   *
   * * Lower left corner, coordinate axis 1
   * * Lower left corner, coordinate axis 2
   * * Upper right corner, coordinate axis 1
   * * Upper right corner, coordinate axis 2
   *
   * The coordinate reference system of the values is WGS84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
   *
   * For WGS84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge).
   *
   * Example: The bounding box of Switzerland in WGS 84 (from 5.96°E to 10.49°E and from 45.82°N to 47.81°N) would be represented in JSON as `[5.96, 45.82, 10.49, 47.81]` and in a query as `bbox=5.96,45.82,10.49,47.81`."
   */
  bbox?: Bboxfilter;
}

/**
 * sha256
 * `sha2-256` checksum
 * @format binary
 * @minLength 64
 * @maxLength 64
 * @pattern ^[a-f0-9]+$
 * @example "3dd6e1ead0760d278344394b0e7f017b5b6049e4fed3d2083b564fc268f07334"
 */
export type Sha256 = File;

/**
 * Multihash
 * `sha2-256` checksum of the asset in [multihash](https://multiformats.io/multihash/) format.
 * @pattern ^[a-f0-9]+$
 * @example "12200ADEC47F803A8CF1055ED36750B3BA573C79A3AF7DA6D6F5A2AED03EA16AF3BC"
 */
export type ChecksumMultihash = string;

/**
 * Multihash
 * `sha2-256` checksum of the asset in [multihash](https://multiformats.io/multihash/) format.
 * @pattern ^[a-f0-9]+$
 * @example "90e402107a7f2588a85362b9beea2a12d4514d45"
 */
export type ChecksumMultihashReadOnly = string;

/**
 * RFC 3339 compliant datetime string, time when the object was created
 * @format date-time
 * @example "2018-02-12T23:20:50.000Z"
 */
export type Created = string;

export interface CollectionBase {
  /**
   * The list of coordinate reference systems supported by the service
   * @default ["http://www.opengis.net/def/crs/OGC/1.3/CRS84"]
   * @example ["http://www.opengis.net/def/crs/OGC/1.3/CRS84"]
   */
  crs?: string[];
  /**
   * A description of the features in the collection
   * @example "Swiss Map Raster are a conversion of the map image into a digital form with no direct bearing on the individual map elements.
   *
   * The information is structured only in colour layers. Swiss Map Raster pixel maps are ideal for finding background information for a broad variety of screen applications, web and mobile applications and services, as well as for geographic information systems. They can also be used as basic maps for a variety of purposes (digital printing, plots, offset printing, etc.)."
   */
  description: string;
  /** The extent of the features in the collection. In the Core only spatial and temporal extents are specified. Extensions may add additional members to represent other extents, for example, thermal or pressure ranges. */
  extent: Extent;
  /**
   * Identifier of the collection used, for example, in URIs
   * @example "ch.swisstopo.pixelkarte-farbe-pk200.noscale"
   */
  id: string;
  /**
   * Indicator about the type of the items in the collection (the default value is 'Feature').
   * @default "Feature"
   */
  itemType?: string;
  /** @example "Collection" */
  type: string;
  /**
   * License(s) of the data as a SPDX [License identifier](https://spdx.org/licenses/). Alternatively, use `proprietary` if the license is not on the SPDX license list or `various` if multiple licenses apply. In these two cases links to the license texts SHOULD be added, see the `license` link relation type.
   *
   * Non-SPDX licenses SHOULD add a link to the license text with the `license` relation in the links section. The license text MUST NOT be provided as a value of this field. If there is no public license URL available, it is RECOMMENDED to host the license text and link to it.
   */
  license: License;
  /** A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list. */
  providers?: Providers;
  stac_version: StacVersion;
  /**
   * Summaries are either a unique set of all available values *or* statistics. Statistics by default only specify the range (minimum and maximum values), but can optionally be accompanied by additional statistical values. The range can specify the potential range of values, but it is recommended to be as precise as possible. The set of values must contain at least one element and it is strongly recommended to list all values. It is recommended to list as many properties as reasonable so that consumers get a full overview of the Collection. Properties that are covered by the Collection specification (e.g. `providers` and `license`) may not be repeated in the summaries.
   * @example {"gsd":[10,20],"geoadmin:variant":["kgrel","komb","krel"],"geoadmin:lang":["de","fr"],"proj:epsg":[2056]}
   */
  summaries?: Record<
    string,
    | any[]
    | {
        max: string | number;
        min: string | number;
      }
  >;
  /**
   * Human readable title of the collection
   * @example "National Map 1:200'000"
   */
  title?: string;
  /** RFC 3339 compliant datetime string, time when the object was created */
  created: Created;
  /** RFC 3339 compliant datetime string, time when the object was updated */
  updated: Updated;
  /** List of Assets attached to this feature. */
  assets?: ItemAssets;
}

export type Collection = CollectionBase & {
  /** @example [{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.pixelkarte-farbe-pk50.noscale","rel":"self"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/","rel":"root"},{"href":"https://data.geo.admin.ch/api/stac/v0.9","rel":"parent"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.pixelkarte-farbe-pk50.noscale/items","rel":"items"},{"href":"https://www.swisstopo.admin.ch/en/home/meta/conditions/geodata/free-geodata.html","rel":"license","title":"Licence for the free geodata of the Federal Office of Topography swisstopo"},{"href":"https://www.geocat.ch/geonetwork/srv/eng/catalog.search#/metadata/4c8c7c58-61c7-4a61-8e7a-6ffb95d183df","rel":"describedby"}] */
  links: Link[];
};

export interface Collections {
  collections: Collection[];
  /** @example [{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections","rel":"self"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/","rel":"root"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections?cursor=10ab","rel":"next"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections?cursor=10cd","rel":"previous"}] */
  links: Link[];
}

/** Array of Collection IDs to include in the search for items. Only Items in one of the provided Collections will be searched. */
export type CollectionsArray = string[];

/**
 * Only returns the collections specified
 * @example {"collections":["ch.swisstopo.swisstlmregio","ch.bfe.energieschweiz"]}
 */
export interface CollectionsFilter {
  /** Array of Collection IDs to include in the search for items. Only Items in one of the provided Collections will be searched. */
  collections?: CollectionsArray;
}

export interface ConfClasses {
  conformsTo: string[];
}

/**
 * RFC 3339 compliant datetime string
 * @format date-time
 * @example "2018-02-12T23:20:50.000Z"
 */
export type Datetime = string;

/**
 * ISO 8601 compliant duration
 * @example "P3DT6H"
 */
export type Duration = string;

/**
 * Either a date-time or an interval, open or closed. Date and time expressions adhere to RFC 3339. Open intervals are expressed using double-dots.
 * Examples:
 *
 * * A date-time: "2018-02-12T23:20:50Z"
 * * A closed interval: "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
 * * Open intervals: "2018-02-12T00:00:00Z/.." or "../2018-03-18T12:31:12Z"
 *
 * Only features that have a temporal property that intersects the value of `datetime` are selected.
 *
 * When used as URL query argument, the value must be correctly url-encoded.
 * @example "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
 */
export type DatetimeQuery = string;

export interface DatetimeFilter {
  /**
   * Either a date-time or an interval, open or closed. Date and time expressions adhere to RFC 3339. Open intervals are expressed using double-dots.
   * Examples:
   *
   * * A date-time: "2018-02-12T23:20:50Z"
   * * A closed interval: "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
   * * Open intervals: "2018-02-12T00:00:00Z/.." or "../2018-03-18T12:31:12Z"
   *
   * Only features that have a temporal property that intersects the value of `datetime` are selected.
   *
   * When used as URL query argument, the value must be correctly url-encoded.
   */
  datetime?: DatetimeQuery;
}

/**
 * Detailed multi-line description to fully explain the catalog or collection.
 *
 * [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation.
 */
export type Description = string;

/**
 * Ground Sample Distance
 * GSD is the nominal Ground Sample Distance for the data, as measured in meters on the ground.
 *
 * There are many definitions of GSD. The value of this attribute should be related to the spatial resolution at the sensor, rather than the pixel size of images after ortho-rectification, pansharpening, or scaling. The GSD of a sensor can vary depending on off-nadir and wavelength, so it is at the discretion of the implementer to decide which value most accurately represents the GSD. For example, Landsat8 optical and short-wave IR bands are all 30 meters, but the panchromatic band is 15 meters. The gsd should be 30 meters in this case because that is nominal spatial resolution at the sensor. The Planet PlanetScope Ortho Tile Product has an gsd of 3.7 (or 4 if rounding), even though the pixel size of the images is 3.125. For example, one might choose for WorldView-2 the Multispectral 20° off-nadir value of 2.07 and for WorldView-3 the Multispectral 20° off-nadir value of 1.38.
 * @example 2.5
 */
export type EoGsd = number;

/** Information about the exception: an error code plus an optional description. */
export interface Exception {
  /** @example 500 */
  code: number;
  description?: string | (string | object)[] | object;
}

/** Information about the exception */
export interface ExceptionS3 {
  /** @example "AccessDenied" */
  Code: string;
  /** @example "Access Denied" */
  Message: string;
  /** @example "BJE6DBWM0M1D9BDC" */
  RequestId: string;
  /** @example "N9hTgbJmEuiMnvb+W9Y1Y+fhFoZh92NYG13Z3K19PBZOZ4hbn7F7i3yYpjJgM7bIFmDH2BnE81U=" */
  HostId: string;
}

/** The extent of the features in the collection. In the Core only spatial and temporal extents are specified. Extensions may add additional members to represent other extents, for example, thermal or pressure ranges. */
export interface Extent {
  /** The spatial extent of the features in the collection. */
  spatial: {
    /**
     * One or more bounding boxes that describe the spatial extent of the dataset. In the Core only a single bounding box is supported. Extensions may support additional areas. If multiple areas are provided, the union of the bounding boxes describes the spatial extent.
     * @minItems 1
     */
    bbox: number[][];
  };
  /** The temporal extent of the features in the collection. */
  temporal: {
    /**
     * One time interval that describe the temporal extent of the dataset.
     * @maxItems 1
     * @minItems 1
     */
    interval: string[][];
  };
}

/** Product language */
export enum GeoadminLang {
  De = 'de',
  It = 'it',
  Fr = 'fr',
  Rm = 'rm',
  En = 'en',
}

/**
 * Product variants
 * @example "komb"
 */
export type GeoadminVariant = string;

/**
 * Link to the asset object.
 *
 * Details about asset object calls, specifically information about caching behavior
 * can be found [here](#tag/Data/operation/getAssetObject)
 * @format url
 * @example "http://data.geo.admin.ch/ch.swisstopo.swissimage/collections/cs/items/CS3-20160503_132130_04/thumb.png
 * "
 */
export type Href = string;

/** Array of Item ids to return. All other filter parameters that further restrict the number of search results are ignored */
export type Ids = string[];

/**
 * Only returns items that match the array of given ids
 * @example {"ids":["swisstlmregio-2019","swisstlmregio-2020"]}
 */
export interface IdsFilter {
  /** Array of Item ids to return. All other filter parameters that further restrict the number of search results are ignored */
  ids?: Ids;
}

/**
 * Only returns items that intersect with the provided polygon.
 * @example {"intersects":{"type":"Point","coordinates":[7,46]}}
 */
export interface IntersectsFilter {
  intersects?: GeoJsonPoint | GeoJsonLineString | GeoJsonPolygon | GeoJsonMultiPoint | GeoJsonMultiLineString | GeoJsonMultiPolygon;
}

/** A GeoJSON Feature augmented with foreign members that contain values relevant to a STAC entity */
export interface ItemBase {
  /** List of Assets attached to this feature. */
  assets: ItemAssets;
  /**
   * The bounding box is provided as four numbers:
   *
   * * Lower left corner, coordinate axis 1
   * * Lower left corner, coordinate axis 2
   * * Upper right corner, coordinate axis 1
   * * Upper right corner, coordinate axis 2
   *
   * The coordinate reference system of the values is WGS84
   * longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
   *
   * For WGS84 longitude/latitude the values are in most cases the sequence
   * of minimum longitude, minimum latitude, maximum longitude and maximum
   * latitude. However, in cases where the box spans the antimeridian the
   * first value (west-most box edge) is larger than the third value
   * (east-most box edge).
   *
   * Example: The bounding box of Switzerland in
   * WGS 84 (from 5.96°E to 10.49°E and from 45.82°N to 47.81°N) would be
   * represented in JSON as `[5.96, 45.82, 10.49, 47.81]` and in a query as
   * `bbox=5.96,45.82,10.49,47.81`."
   */
  bbox: Bbox;
  geometry: ItemGeometry;
  /**
   * Provides the core metadata fields plus extensions
   *
   * The item's data timing information can be specified either with
   * * One datetime value in the field `datetime`
   * * A datetime range with a `start_datetime` and an `end_datetime`
   *
   * One of the two is required
   */
  properties: ItemProperties;
  stac_version: StacVersion;
  /** List of relevant extensions for an object */
  stac_extensions?: StacExtensions;
  /** The GeoJSON type */
  type: ItemType;
}

export type Item = {
  /** Feature identifier (unique per collection) */
  id: ItemId;
  /** @example [{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.pixelkarte-farbe-pk50.noscale/items/smr50-263-2016","rel":"self"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/","rel":"root"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.pixelkarte-farbe-pk50.noscale","rel":"parent"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.pixelkarte-farbe-pk50.noscale","rel":"collection"}] */
  links: Link[];
} & ItemBase;

/** A FeatureCollection augmented with foreign members that contain values relevant to a STAC entity */
export interface Items {
  features: Item[];
  /** @example [{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.pixelkarte-farbe-pk50.noscale/items","rel":"self"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/","rel":"root"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.pixelkarte-farbe-pk50.noscale","rel":"parent"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.pixelkarte-farbe-pk50.noscale/items?cursor=10ab","rel":"next"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.pixelkarte-farbe-pk50.noscale/items?cursor=10acd","rel":"previous"}] */
  links?: Link[];
  type: 'FeatureCollection';
}

/**
 * Assets
 * List of Assets attached to this feature.
 * @example {"smr50-263-2016-2056-kgrs-2.5.tiff":{"file:checksum":"12200ADEC47F803A8CF1055ED36750B3BA573C79A3AF7DA6D6F5A2AED03EA16AF3BC","created":"2020-07-14T12:30:00Z","gsd":2.5,"geoadmin:variant":"kgrs","href":"https://data.geo.admin.ch/ch.swisstopo.pixelkarte-farbe-pk50.noscale/smr50-263-2016-2056-kgrs-2.5.tiff","proj:epsg":2056,"type":"image/tiff; application=geotiff","updated":"2020-07-14T12:30:00Z"},"smr50-263-2016-2056-komb-2.5.tiff":{"file:checksum":"12200ADEC47F803A8CF1055ED36750B3BA573C79A3AF7DA6D6F5A2AED03EA16AF3BC","created":"2020-07-14T12:30:00Z","gsd":2.5,"geoadmin:variant":"komb","href":"https://data.geo.admin.ch/ch.swisstopo.pixelkarte-farbe-pk50.noscale/smr50-263-2016-2056-komb-2.5.tiff","proj:epsg":"2056","type":"image/tiff; application=geotiff","updated":"2020-07-14T12:30:00Z"},"smr50-263-2016-2056-krel-2.5.tiff":{"file:checksum":"12200ADEC47F803A8CF1055ED36750B3BA573C79A3AF7DA6D6F5A2AED03EA16AF3BC","created":"2020-07-14T12:30:00Z","gsd":2.5,"geoadmin:variant":"krel","href":"https://data.geo.admin.ch/ch.swisstopo.pixelkarte-farbe-pk50.noscale/smr50-263-2016-2056-krel-2.5.tiff","proj:epsg":"2056","type":"image/tiff; application=geotiff","updated":"2020-07-14T12:30:00Z"}}
 */
export type ItemAssets = Record<
  string,
  {
    /** Media type of the asset */
    type: AssetType;
  } & AssetBase
>;

/** A GeoJSON FeatureCollection augmented with foreign members that contain values relevant to a STAC entity */
export interface ItemsSearch {
  features: Item[];
  type: 'FeatureCollection';
}

export type ItemsSearchGet = ItemsSearch & {
  /** An array of links. Can be used for pagination, e.g. by providing a link with the `next` relation type. */
  links?: ItemsSearchLinks;
};

export type ItemsSearchPost = ItemsSearch & {
  /** An array of links. Can be used for pagination, e.g. by providing a link with the `next` relation type. */
  links?: ItemsSearchPostLinks;
};

/**
 * An array of links. Can be used for pagination, e.g. by providing a link with the `next` relation type.
 * @example [{"href":"https://data.geo.admin.ch/api/stac/v0.9/search","rel":"self"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/search?cursor=10ab","rel":"next"}]
 */
export type ItemsSearchLinks = Link[];

/**
 * An array of links. Can be used for pagination, e.g. by providing a link with the `next` relation type.
 * @example [{"href":"https://data.geo.admin.ch/api/stac/v0.9/search","rel":"self"},{"href":"https://data.geo.admin.ch/api/stac/v0.9/search?cursor=10ab","rel":"next","method":"POST","body":{},"merge":true}]
 */
export type ItemsSearchPostLinks = LinkPostSearch[];

/**
 * ID
 * Feature identifier (unique per collection)
 * @example "smr200-200-4-2019"
 */
export type ItemId = string;

export type ItemGeometry =
  | GeoJsonPoint
  | GeoJsonLineString
  | GeoJsonPolygon
  | GeoJsonMultiPoint
  | GeoJsonMultiLineString
  | GeoJsonMultiPolygon;

/** GeoJSON Point */
export interface GeoJsonPoint {
  type: 'Point';
  /**
   * For type "Point", the "coordinates" member is a single position. The coordinate reference system of the values is WGS84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
   * @minItems 2
   * @example [7.0906823,45.9160584]
   */
  coordinates: number[];
}

/** GeoJSON LineString */
export interface GeoJsonLineString {
  type: 'LineString';
  /**
   * For type "LineString", the "coordinates" member is an array of two or more positions. The coordinate reference system of the values is WGS84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
   * @minItems 2
   * @example [[[7.0906823,45.9160584],[7.1035698,45.9160977]]]
   */
  coordinates: number[][];
}

/** GeoJSON Polygon */
export interface GeoJsonPolygon {
  type: 'Polygon';
  /**
   * For type "Polygon", the "coordinates" member MUST be an array of linear ring coordinate arrays. The coordinate reference system of the values is WGS84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
   * @example [[[7.0906823,45.9160584],[7.1035698,45.9160977],[7.1035146,45.925093],[7.0906249,45.9250537],[7.0906823,45.9160584]]]
   */
  coordinates: number[][][];
}

/** GeoJSON MultiPoint */
export interface GeoJsonMultiPoint {
  type: 'MultiPoint';
  /**
   * For type "MultiPoint", the "coordinates" member is an array of positions. The coordinate reference system of the values is WGS84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
   * @example [[7.0906823,45.9160584],[7.1035698,45.9160977],[7.1035146,45.925093]]
   */
  coordinates: number[][];
}

/** GeoJSON MultiLineString */
export interface GeoJsonMultiLineString {
  type: 'MultiLineString';
  /**
   * For type "MultiLineString", the "coordinates" member is an array of LineString coordinate arrays. The coordinate reference system of the values is WGS84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
   * @example [[[7.0906823,45.9160584],[7.1035698,45.9160977]],[[7.1035146,45.925093],[7.0906249,45.9250537]]]
   */
  coordinates: number[][][];
}

/** GeoJSON MultiPolygon */
export interface GeoJsonMultiPolygon {
  type: 'MultiPolygon';
  /**
   * For type "MultiPolygon", the "coordinates" member is an array of Polygon coordinate arrays. The coordinate reference system of the values is WGS84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
   * @example [[[[7.0906823,45.9160584],[7.1035698,45.9160977],[7.1035146,45.925093],[7.0906249,45.9250537],[7.0906823,45.9160584]]],[[[8.5816399,45.7218735],[8.5944806,45.7217417],[8.5946699,45.7307358],[8.581827,45.7308676],[8.5816399,45.7218735]]]]
   */
  coordinates: number[][][][];
}

/**
 * Properties
 * Provides the core metadata fields plus extensions
 *
 * The item's data timing information can be specified either with
 * * One datetime value in the field `datetime`
 * * A datetime range with a `start_datetime` and an `end_datetime`
 *
 * One of the two is required
 */
export interface ItemProperties {
  /** RFC 3339 compliant datetime string, time when the object was created */
  created: Created;
  /** RFC 3339 compliant datetime string */
  datetime?: Datetime;
  /** RFC 3339 compliant datetime string */
  start_datetime?: Datetime;
  /** RFC 3339 compliant datetime string */
  end_datetime?: Datetime;
  /** RFC 3339 compliant datetime string */
  expires?: Datetime;
  /** RFC 3339 compliant datetime string, time when the object was updated */
  updated: Updated;
  /**
   * Human readable title of the Feature
   * @minLength 1
   * @maxLength 255
   * @example "Feature title"
   */
  title?: string | null;
  /** RFC 3339 compliant datetime string */
  'forecast:reference_datetime'?: Datetime;
  /** ISO 8601 compliant duration */
  'forecast:horizon'?: Duration;
  /** ISO 8601 compliant duration */
  'forecast:duration'?: Duration;
  /** Name of the model variable that corresponds to the data. The variables should correspond to the [CF Standard Names](https://cfconventions.org/Data/cf-standard-names/current/build/cf-standard-name-table.html), e.g. `air_temperature` for the air temperature. */
  'forecast:variable'?: ForecastVariable;
  /** Denotes whether the data corresponds to the control run (`false`) or perturbed runs (`true`). The property needs to be specified in both cases as no default value is specified and as such the meaning is "unknown" in case it's missing. */
  'forecast:perturbed'?: ForecastPerturbed;
}

/**
 * type
 * The GeoJSON type
 */
export enum ItemType {
  Feature = 'Feature',
}

export interface LandingPage {
  /** @example "Access to data about buildings in the city of Bonn via a Web API that conforms to the OGC API Features specification." */
  description: string;
  id: string;
  links: Link[];
  stac_version: StacVersion;
  /** @example "Buildings in Bonn" */
  title?: string;
  /** @example "Catalog" */
  type: string;
  conformsTo: string[];
}

/**
 * License(s) of the data as a SPDX [License identifier](https://spdx.org/licenses/). Alternatively, use `proprietary` if the license is not on the SPDX license list or `various` if multiple licenses apply. In these two cases links to the license texts SHOULD be added, see the `license` link relation type.
 *
 * Non-SPDX licenses SHOULD add a link to the license text with the `license` relation in the links section. The license text MUST NOT be provided as a value of this field. If there is no public license URL available, it is RECOMMENDED to host the license text and link to it.
 * @example "proprietary"
 */
export type License = string;

/**
 * The `limit` parameter limits the number of results that are included in the response.
 *
 * To retrieve the next bunch of result, use the `next` link in the `links` section of the response.
 *
 * Minimum = 1. Maximum = 100. Default = 100.
 * @min 1
 * @max 100
 * @default 100
 * @example 20
 */
export type Limit = number;

/** Only returns maximum number of results (page size) */
export interface LimitFilter {
  /**
   * The `limit` parameter limits the number of results that are included in the response.
   *
   * To retrieve the next bunch of result, use the `next` link in the `links` section of the response.
   *
   * Minimum = 1. Maximum = 100. Default = 100.
   */
  limit?: Limit;
}

export interface LinestringGeoJSON {
  /** @minItems 2 */
  coordinates: number[][];
  type: 'LineString';
}

/** Link */
export interface Link {
  /**
   * @format url
   * @example "http://data.example.com/buildings/123"
   */
  href: string;
  /**
   * Relationship between the current document and the linked document.
   *
   * NOTE: the following relations are reserved and automatically generated: `self`, `root`, `parent`, `items`, `collection`, `next`, `previous`
   * @example "describedby"
   */
  rel: string;
  /** @example "Trierer Strasse 70, 53115 Bonn" */
  title?: string;
  /**
   * The media type of the link target
   * @example "application/geo+json"
   */
  type?: string;
  /**
   * Specifies the HTTP method that the link expects
   * @default "GET"
   */
  method?: 'GET' | 'POST';
  /**
   * The language of the link target
   * @example "de-CH"
   */
  hreflang?: string;
}

export type LinkPostSearch = Link & {
  /**
   * For `POST /search` requests, the link can specify the HTTP body as a JSON object.
   * @default {}
   */
  body?: object;
  /**
   * This is only valid when the server is responding to `POST /search `request.
   *
   * If merge is true, the client is expected to merge the body value into the current request body before following the link. This avoids passing large post bodies back and forth when following links, particularly for navigating pages through the `POST /search` endpoint.
   * @default false
   */
  merge?: boolean;
};

export interface MultilinestringGeoJSON {
  coordinates: number[][][];
  type: 'MultiLineString';
}

export interface MultipointGeoJSON {
  coordinates: number[][];
  type: 'MultiPoint';
}

export interface MultipolygonGeoJSON {
  coordinates: number[][][][];
  type: 'MultiPolygon';
}

/**
 * The number of features of the feature type that match the selection parameters like `bbox`.
 * @min 0
 * @example 127
 */
export type NumberMatched = number;

/**
 * The number of features in the feature collection.
 *
 * A server may omit this information in a response, if the information about the number of features is not known or difficult to compute.
 *
 * If the value is provided, the value shall be identical to the number of items in the "features" array.
 * @min 0
 * @example 10
 */
export type NumberReturned = number;

export interface PointGeoJSON {
  /** @minItems 2 */
  coordinates: number[];
  type: 'Point';
}

/** @example {"coordinates":[[[7.242974548172171,46.57310580640624],[7.243756483316452,46.35721185723752],[7.698490766144817,46.357085154660915],[7.699524647567326,46.57297861624267],[7.242974548172171,46.57310580640624]]],"type":"Polygon"} */
export interface PolygonGeoJSON {
  coordinates: number[][][];
  type: 'Polygon';
}

/**
 * EPSG code.
 * A Coordinate Reference System (CRS) is the data reference system (sometimes called a 'projection') used by the asset data, and can usually be referenced using an EPSG code. If the asset data does not have a CRS, such as in the case of non-rectified imagery with Ground Control Points, proj:epsg should be set to null. It should also be set to null if a CRS exists, but for which there is no valid EPSG code.
 * @example 2056
 */
export type ProjEpsg = number;

/**
 * A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list.
 * @example [{"name":"Federal Office of Topography - swisstopo","roles":["producer","licensor"],"url":"https://www.swisstopo.admin.ch"}]
 */
export type Providers = {
  /**
   * Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information.
   *
   * CommonMark 0.29 syntax MAY be used for rich text representation.
   */
  description?: string;
  /** The name of the organization or the individual. */
  name: string;
  /**
   * Roles of the provider.
   *
   * The provider's role(s) can be one or more of the following elements:
   *
   * * licensor: The organization that is licensing the dataset under
   *
   *   the license specified in the collection's license field.
   *
   * * producer: The producer of the data is the provider that
   *
   *   initially captured and processed the source data, e.g. ESA for
   *   Sentinel-2 data.
   *
   * * processor: A processor is any provider who processed data to a
   *
   *   derived product.
   *
   * * host: The host is the actual provider offering the data on their
   *
   *   storage. There should be no more than one host, specified as last
   *   element of the list.
   */
  roles?: ('producer' | 'licensor' | 'processor' | 'host')[];
  /**
   * Homepage on which the provider describes the dataset and publishes contact information.
   * @format url
   */
  url?: string;
}[];

/**
 * Define which properties to query and the operations to apply
 * @example {"title":{"contains":"Swiss"},"created":{"lte":"2021-01-01T00:00:00.000Z"},"updated":{"gte":"2020-01-01T00:00:00.000Z"}}
 */
export type Query = Record<string, QueryProp>;

/** Allows users to query properties for specific values */
export interface QueryFilter {
  /** Define which properties to query and the operations to apply */
  query?: Query;
}

export interface ForecastReferenceDatetimeFilter {
  /**
   * Either a date-time or an interval, open or closed. Date and time expressions adhere to RFC 3339. Open intervals are expressed using double-dots.
   * Examples:
   *
   * * A date-time: "2018-02-12T23:20:50Z"
   * * A closed interval: "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
   * * Open intervals: "2018-02-12T00:00:00Z/.." or "../2018-03-18T12:31:12Z"
   *
   * Only features that have a temporal property that intersects the value of `datetime` are selected.
   *
   * When used as URL query argument, the value must be correctly url-encoded.
   */
  'forecast:reference_datetime'?: DatetimeQuery;
}

export interface ForecastHorizonFilter {
  /** ISO 8601 compliant duration */
  'forecast:horizon'?: Duration;
}

export interface ForecastDurationFilter {
  /** ISO 8601 compliant duration */
  'forecast:duration'?: Duration;
}

export interface ForecastVariableFilter {
  /** Name of the model variable that corresponds to the data. The variables should correspond to the [CF Standard Names](https://cfconventions.org/Data/cf-standard-names/current/build/cf-standard-name-table.html), e.g. `air_temperature` for the air temperature. */
  'forecast:variable'?: ForecastVariable;
}

/**
 * Name of the model variable that corresponds to the data. The variables should correspond to the [CF Standard Names](https://cfconventions.org/Data/cf-standard-names/current/build/cf-standard-name-table.html), e.g. `air_temperature` for the air temperature.
 * @example "air_temperature"
 */
export type ForecastVariable = string | null;

export interface ForecastPerturbedFilter {
  /** Denotes whether the data corresponds to the control run (`false`) or perturbed runs (`true`). The property needs to be specified in both cases as no default value is specified and as such the meaning is "unknown" in case it's missing. */
  'forecast:perturbed'?: ForecastPerturbed;
}

/** Denotes whether the data corresponds to the control run (`false`) or perturbed runs (`true`). The property needs to be specified in both cases as no default value is specified and as such the meaning is "unknown" in case it's missing. */
export type ForecastPerturbed = boolean | null;

/** Apply query operations to a specific property. The following properties are currently supported: `created`, `updated`, `title`. */
export type QueryProp = {
  /** Find items with a property that contains the specified literal string, e.g., matches ".*<STRING>.*". A case-insensitive comparison must be performed. */
  contains?: string;
  /** Find items with a property that ends with the specified string. A case-insensitive comparison must be performed. */
  endsWith?: string;
  /** Find items with a property that is equal to the specified value. For strings, a case-insensitive comparison must be performed. */
  eq?: string | number | boolean | null;
  /** Find items with a property value greater than the specified value. */
  gt?: string | number;
  /** Find items with a property value greater than or equal the specified value. */
  gte?: string | number;
  /** Find items with a property that equals at least one entry in the specified array. A case-insensitive comparison must be performed. */
  in?: (string | number)[];
  /** Find items with a property value less than the specified value. */
  lt?: string | number;
  /** Find items with a property value less than or equal the specified value. */
  lte?: string | number;
  /** Find items that *don't* contain the specified value. For strings, a case-insensitive comparison must be performed. */
  neq?: string | number | boolean | null;
  /** Find items with a property that begins with the specified string. A case-insensitive comparison must be performed. */
  startsWith?: string;
};

/**
 * Purposes of the asset
 * @example ["thumbnail"]
 */
export type Roles = string[];

/** The search criteria */
export type SearchBody = QueryFilter &
  BboxFilter &
  DatetimeFilter &
  IntersectsFilter &
  CollectionsFilter &
  IdsFilter &
  LimitFilter &
  ForecastReferenceDatetimeFilter &
  ForecastHorizonFilter &
  ForecastDurationFilter &
  ForecastVariableFilter &
  ForecastPerturbedFilter;

/**
 * STAC version
 * @example "0.9.0"
 */
export type StacVersion = string;

/**
 * List of relevant extensions for an object
 * @example ["https://stac-extensions.github.io/forecast/v0.2.0/schema.json"]
 */
export type StacExtensions = string[];

/**
 * This property indicates the time and date when the response was generated.
 * @format date-time
 * @example "2017-08-17T08:05:32Z"
 */
export type TimeStamp = string;

/**
 * Displayed title
 * @minLength 1
 * @maxLength 255
 * @example "Thumbnail"
 */
export type Title = string | null;

/**
 * Media Type
 * Media type of the asset
 * @example "image/tiff; application=geotiff"
 */
export type AssetType = string;

/**
 * RFC 3339 compliant datetime string, time when the object was updated
 * @format date-time
 * @example "2018-02-12T23:20:50.000Z"
 */
export type Updated = string;

export type GetAssetObjectData = any;

export type GetSearchStacData = ItemsSearchGet;

export type PostSearchStacData = ItemsSearchPost;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = 'http://data.geo.admin.ch/api/stac/v1';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys.map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key))).join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? {'Content-Type': type} : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title The SpatioTemporal Asset Catalog API for data.geo.admin.ch
 * @version 1.0.0
 * @baseUrl http://data.geo.admin.ch/api/stac/v1
 * @contact API Specification (based on STAC) (http://data.geo.admin.ch/api/stac/v1/)
 *
 * This is an OpenAPI definition of the API to query and access federal geodata on data.geo.admin.ch. The API is based on the core SpatioTemporal Asset Catalog API specification [STAC](http://stacspec.org) and adds two extensions for extended searching possibilities.
 */
export class StacApiClient<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description The landing page provides links to the API definition, the conformance statements and to the feature collections in this dataset.
   *
   * @tags Capabilities
   * @name GetLandingPage
   * @summary Landing page
   * @request GET:/
   */
  getLandingPage = (params: RequestParams = {}) =>
    this.request<LandingPage, Exception>({
      path: `/`,
      method: 'GET',
      ...params,
    });

  collections = {
    /**
     * @description The feature collections in the dataset
     *
     * @tags Data
     * @name GetCollections
     * @summary Fetch collections
     * @request GET:/collections
     */
    getCollections: (
      query?: {
        /**
         * The `limit` parameter limits the number of results that are included in the response.
         *
         * To retrieve the next bunch of result, use the `next` link in the `links` section of the response.
         *
         * Minimum = 1. Maximum = 100. Default = 100.
         */
        limit?: Limit;
        /** Filter collections by the name of the provider. Supports partial and case-insensitive matching. */
        provider?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Collections, Exception>({
        path: `/collections`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * @description Describe the feature collection with id `collectionId`
     *
     * @tags Data
     * @name DescribeCollection
     * @summary Fetch a single collection
     * @request GET:/collections/{collectionId}
     */
    describeCollection: (collectionId: string, params: RequestParams = {}) =>
      this.request<Collection, Exception>({
        path: `/collections/${collectionId}`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description Fetch features of the feature collection with id `collectionId`. Every feature in a dataset belongs to a collection. A dataset may consist of multiple feature collections. A feature collection is often a collection of features of a similar type, based on a common schema. Use content negotiation to request HTML or GeoJSON.
     *
     * @tags Data
     * @name GetFeatures
     * @summary Fetch features
     * @request GET:/collections/{collectionId}/items
     */
    getFeatures: (
      collectionId: string,
      query?: {
        /**
         * The `limit` parameter limits the number of results that are included in the response.
         *
         * To retrieve the next bunch of result, use the `next` link in the `links` section of the response.
         *
         * Minimum = 1. Maximum = 100. Default = 100.
         */
        limit?: Limit;
        /**
         * The bounding box is provided as four numbers:
         *
         * * Lower left corner, coordinate axis 1
         * * Lower left corner, coordinate axis 2
         * * Upper right corner, coordinate axis 1
         * * Upper right corner, coordinate axis 2
         *
         * The coordinate reference system of the values is WGS84
         * longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
         *
         * For WGS84 longitude/latitude the values are in most cases the sequence
         * of minimum longitude, minimum latitude, maximum longitude and maximum
         * latitude. However, in cases where the box spans the antimeridian the
         * first value (west-most box edge) is larger than the third value
         * (east-most box edge).
         *
         * Example: The bounding box of Switzerland in
         * WGS 84 (from 5.96°E to 10.49°E and from 45.82°N to 47.81°N) would be
         * represented in JSON as `[5.96, 45.82, 10.49, 47.81]` and in a query as
         * `bbox=5.96,45.82,10.49,47.81`."
         */
        bbox?: Bbox;
        /**
         * Either a date-time or an interval, open or closed. Date and time expressions adhere to RFC 3339. Open intervals are expressed using double-dots.
         * Examples:
         *
         * * A date-time: "2018-02-12T23:20:50Z"
         * * A closed interval: "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
         * * Open intervals: "2018-02-12T00:00:00Z/.." or "../2018-03-18T12:31:12Z"
         *
         * Only features that have a temporal property that intersects the value of `datetime` are selected.
         *
         * When used as URL query argument, the value must be correctly url-encoded.
         * @example "2018-02-12T00%3A00%3A00Z%2F2018-03-18T12%3A31%3A12Z"
         */
        datetime?: DatetimeQuery;
      },
      params: RequestParams = {},
    ) =>
      this.request<Items, Exception>({
        path: `/collections/${collectionId}/items`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * @description Fetch the feature with id `featureId` in the feature collection with id `collectionId`. Use content negotiation to request HTML or GeoJSON.
     *
     * @tags Data
     * @name GetFeature
     * @summary Fetch a single feature
     * @request GET:/collections/{collectionId}/items/{featureId}
     */
    getFeature: (collectionId: string, featureId: string, params: RequestParams = {}) =>
      this.request<Item, Exception>({
        path: `/collections/${collectionId}/items/${featureId}`,
        method: 'GET',
        ...params,
      }),
  };
  assetObjectHref = {
    /**
     * No description
     *
     * @name ServersAssetObjectHref
     * @request SERVERS:/{assetObjectHref}
     */
    serversAssetObjectHref: (assetObjectHref: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/${assetObjectHref}`,
        method: 'SERVERS',
        ...params,
      }),

    /**
     * @description Return an asset object ### Notes on Caching Asset objects are cached by default for 2 hours (7200 seconds). Depending on the update interval of an asset object (e.g. for frequently updated data) the `Cache-Control` header can be different, in special cases it can even be set to `no-cache` (e.g. for realtime data). All endpoints support the precondition headers `If-Match` and `If-None-Match`. To reduce unnecessary traffic it's highly recommended to use these headers (mostly `If-None-Match`) when making calls. In case your application is using frequently updated data and you want to be sure not to miss an update of the data, the recommended procedure is as follows: ```python import requests import time refresh_interval = 60 item_etag = "*" item_url = "https://data.geo.admin.ch/collections/{collectionID}/items/{itemId}" asset_id = 'data.json' asset_etag = "*" poll_for_new_data = True while(poll_for_new_data): item_response = requests.get(item_url, headers={'If-None-Match': f'"{item_etag}"'}) if item_response.status_code == 304: # item metadata and hence any associated asset object didn't # change since last call time.sleep(refresh_interval) elif item_response.status_code == 200: # item metadata has changed since last visit item_etag = item_response.headers.get("ETag") # save the new etag asset_href = item_response.json['assets'][asset_id]['href'] # save the asset href obj_response = requests.get(asset_href, headers={'If-None-Match': f'"{asset_etag}"'}) if obj_response.status_code == 304: # "our" asset object didn't change since last call, # we can ignore that the item metadata changed, # it was a different asset that has changed time.sleep(refresh_interval) elif obj_response.status_code == 200: # "our" asset object has changed, we load the new data asset_etag = obj_response.headers.get("ETag")  # save the new asset etag asset_checksum = obj_response.headers.get("X-Amz-Meta-Sha256") object = obj_response.data # calculate the sha256 checksum of the data in a proper way checksum = calc_checksum(object) if checksum != asset_checksum: # Error: corrupted data from download # do proper error handling # do sth with the data else: # do proper error handling else: # do proper error handling ```
     *
     * @tags Data
     * @name GetAssetObject
     * @summary Fetch an asset object
     * @request GET:/{assetObjectHref}
     */
    getAssetObject: (assetObjectHref: string, params: RequestParams = {}) =>
      this.request<GetAssetObjectData, ExceptionS3>({
        path: `/${assetObjectHref}`,
        method: 'GET',
        ...params,
      }),
  };
  conformance = {
    /**
     * @description A list of all conformance classes specified in a standard that the server conforms to.
     *
     * @tags Capabilities
     * @name GetConformanceDeclaration
     * @summary Information about specifications that this API conforms to
     * @request GET:/conformance
     */
    getConformanceDeclaration: (params: RequestParams = {}) =>
      this.request<ConfClasses, Exception>({
        path: `/conformance`,
        method: 'GET',
        ...params,
      }),
  };
  search = {
    /**
     * @description Retrieve Items matching filters. Intended as a shorthand API for simple queries. To filter by forecast properties please use the [POST /search](#tag/STAC/operation/postSearchSTAC) request.
     *
     * @tags STAC
     * @name GetSearchStac
     * @summary Search STAC items with simple filtering.
     * @request GET:/search
     */
    getSearchStac: (
      query?: {
        /**
         * The bounding box is provided as four numbers:
         *
         * * Lower left corner, coordinate axis 1
         * * Lower left corner, coordinate axis 2
         * * Upper right corner, coordinate axis 1
         * * Upper right corner, coordinate axis 2
         *
         * The coordinate reference system of the values is WGS84
         * longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
         *
         * For WGS84 longitude/latitude the values are in most cases the sequence
         * of minimum longitude, minimum latitude, maximum longitude and maximum
         * latitude. However, in cases where the box spans the antimeridian the
         * first value (west-most box edge) is larger than the third value
         * (east-most box edge).
         *
         * Example: The bounding box of Switzerland in
         * WGS 84 (from 5.96°E to 10.49°E and from 45.82°N to 47.81°N) would be
         * represented in JSON as `[5.96, 45.82, 10.49, 47.81]` and in a query as
         * `bbox=5.96,45.82,10.49,47.81`."
         */
        bbox?: Bbox;
        /**
         * Either a date-time or an interval, open or closed. Date and time expressions adhere to RFC 3339. Open intervals are expressed using double-dots.
         * Examples:
         *
         * * A date-time: "2018-02-12T23:20:50Z"
         * * A closed interval: "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
         * * Open intervals: "2018-02-12T00:00:00Z/.." or "../2018-03-18T12:31:12Z"
         *
         * Only features that have a temporal property that intersects the value of `datetime` are selected.
         *
         * When used as URL query argument, the value must be correctly url-encoded.
         * @example "2018-02-12T00%3A00%3A00Z%2F2018-03-18T12%3A31%3A12Z"
         */
        datetime?: DatetimeQuery;
        /**
         * The `limit` parameter limits the number of results that are included in the response.
         *
         * To retrieve the next bunch of result, use the `next` link in the `links` section of the response.
         *
         * Minimum = 1. Maximum = 100. Default = 100.
         */
        limit?: Limit;
        /** Array of Item ids to return. All other filter parameters that further restrict the number of search results are ignored */
        ids?: Ids;
        /** Array of Collection IDs to include in the search for items. Only Items in one of the provided Collections will be searched. */
        collections?: CollectionsArray;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetSearchStacData, Exception>({
        path: `/search`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieve items matching filters. Intended as the standard, full-featured query API.
     *
     * @tags STAC
     * @name PostSearchStac
     * @summary Search STAC items with full-featured filtering.
     * @request POST:/search
     */
    postSearchStac: (data: SearchBody, params: RequestParams = {}) =>
      this.request<PostSearchStacData, Exception>({
        path: `/search`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
}
