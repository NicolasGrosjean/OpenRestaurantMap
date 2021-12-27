/* eslint-disable new-cap */
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// eslint-disable-next-line camelcase
import opening_hours from 'opening_hours';
import { OverpassResults } from '../utils/types';
import { getIcon } from '../utils/leafletIcons';
import {
  addFakeLatLonToWaysAndRelations,
  buildOverpassApiUrl,
} from '../utils/overpass';

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

  const markers: JSX.Element[] = [];
  const lat: number[] = [];
  const lon: number[] = [];
  let id = 0;
  if (data && !overpassData) {
    setOverpassData(addFakeLatLonToWaysAndRelations(data));
  }
  overpassData?.elements.forEach((e) => {
    lat.push(e.lat!);
    lon.push(e.lon!);
    let markerIcon: L.Icon;
    let popUpSufix: JSX.Element;
    if (e.tags.opening_hours) {
      const oh = new opening_hours(e.tags.opening_hours as string);
      const isOpen = oh.getState();
      markerIcon = isOpen ? getIcon('green') : getIcon('red');
      const nextState = isOpen ? 'Closed' : 'Opened';
      const nextChangeDate = oh.getNextChange();
      const nextChangeHourDiffTime = nextChangeDate
        ? (nextChangeDate.getTime() - Date.now()) / 1000 / 3600
        : 1e6;
      if (isOpen && nextChangeHourDiffTime < 1) {
        markerIcon = getIcon('orange');
      }
      popUpSufix = (
        <>
          <p>{e.tags.opening_hours as string}</p>
          <p>
            {`${nextState} on ${nextChangeDate?.toDateString()} - ${nextChangeDate?.toLocaleTimeString()} (in ${nextChangeHourDiffTime.toFixed(
              0
            )} hours)`}
          </p>
        </>
      );
    } else {
      markerIcon = getIcon('grey');
      popUpSufix = <p>MISSING opening hours</p>;
    }
    markers.push(
      <Marker
        position={[e.lat!, e.lon!]}
        key={`marker-${id}`}
        icon={markerIcon}
      >
        <Popup>
          <p>{(e.tags.name as string) || 'UNKNOWN NAME'}</p>
          {popUpSufix}
        </Popup>
      </Marker>
    );
    id += 1;
  });
  let latCenter = 51.505;
  if (lat.length > 1)
    latCenter = lat.reduce((a, v, i) => (a * i + v) / (i + 1));
  let lonCenter = -0.09;
  if (lon.length > 1)
    lonCenter = lon.reduce((a, v, i) => (a * i + v) / (i + 1));
  return (
    <MapContainer
      center={[latCenter, lonCenter]}
      zoom={15}
      style={{ height: '100vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
    </MapContainer>
  );
};

export default Map;
