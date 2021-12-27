import { OverpassResults } from './types';

// eslint-disable-next-line import/prefer-default-export
export function buildOverpassApiUrl(
  south: number,
  west: number,
  north: number,
  east: number,
  overpassQuery: string
) {
  const bounds = `${south},${west},${north},${east}`;
  const query = `?data=[out:json][timeout:15];(nwr[${overpassQuery}](${bounds}););out body geom;`;
  const baseUrl = 'http://overpass-api.de/api/interpreter';
  return baseUrl + query;
}

// eslint-disable-next-line import/prefer-default-export
export function addFakeLatLonToWaysAndRelations(r: OverpassResults) {
  r.elements.forEach((e) => {
    if (e.type !== 'node') {
      if (e.bounds) {
        e.lat = (e.bounds.minlat + e.bounds.maxlat) / 2;
        e.lon = (e.bounds.minlon + e.bounds.maxlon) / 2;
      }
    }
  });
  return r;
}
