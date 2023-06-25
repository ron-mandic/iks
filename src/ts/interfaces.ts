interface IGeoJSON {
  features: IGeoJSONFeature[];
}

interface IGeoJSONFeature {
  geometry: {
    coordinates: number[][][];
    type: string;
  };
  properties: {
    abbrev: string;
    admin: string;
    adm0_a3: string;
    continent: string;
    economy: string;
    gdp_md: number;
    gdp_year: number;
    income_grp: string;
    iso_a2: string;
    iso_a3: string;
    name: string;
    name_alt: string | null;
    name_de: string;
    name_en: string;
    pop_est: number;
    pop_rank: number;
    pop_year: number;
    region_un: string;
    region_wb: string;
    subregion: string;
    subunit: string;
    type: string;
    wikidataid: string;
    [key: string]: string | number | null | undefined | string[];
  };
  type: string;
}

interface IArc {
  wikidataid: string;
  name: string;
  asylumSeekers: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

interface IGeoCoords2 {
  lat: number;
  lng: number;
}

interface IGeoCoords3 {
  lat: number;
  lng: number;
  altitude: number;
}

export type { IGeoJSON, IGeoJSONFeature, IArc, IGeoCoords2, IGeoCoords3 };
