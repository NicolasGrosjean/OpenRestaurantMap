/* eslint-disable new-cap */
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { OverpassResults } from '../utils/types';
import {
  addFakeLatLonToWaysAndRelations,
  buildOverpassApiUrl,
} from '../utils/overpass';
import Markers from '../Markers';

const Map = function () {
  // const [south, setSouth] = useState(48.29);
  // const [west, setWest] = useState(4.03);
  // const [north, setNorth] = useState(48.307);
  // const [east, setEast] = useState(4.11);
  const south = 48.29;
  const west = 4.03;
  const north = 48.307;
  const east = 4.11;
  const [overpassData, setOverpassData] = useState<OverpassResults | null>(
    null
  );

  const { isLoading, error, data } = useQuery<OverpassResults, any>(
    'repoData',
    () =>
      fetch(
        buildOverpassApiUrl(south, west, north, east, 'amenity=restaurant')
      ).then((res) => res.json())
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error has occurred: {error.message}</div>;

  if (data && !overpassData) {
    setOverpassData(addFakeLatLonToWaysAndRelations(data));
  }
  return (
    <MapContainer
      center={[(north + south) / 2, (west + east) / 2]}
      zoom={15}
      style={{ height: '100vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Markers data={overpassData} />
    </MapContainer>
  );
};

export default Map;
