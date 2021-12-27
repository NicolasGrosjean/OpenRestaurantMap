interface Tag {
  [key: string]: unknown;
}

interface OSMObject {
  type: 'node' | 'way' | 'relation';
  id: number;
  tags: Tag;
  lat?: number;
  lon?: number;
  bounds?: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  };
}

export interface OverpassResults {
  type: string;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OSMObject[];
}
