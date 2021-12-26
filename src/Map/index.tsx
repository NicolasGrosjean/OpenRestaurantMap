/* eslint-disable new-cap */
import React from 'react';
import { useQuery } from 'react-query';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// eslint-disable-next-line camelcase
import opening_hours from 'opening_hours';
import { OsmPointsType } from '../types';
import { getIcon } from '../utils/leafletIcons';

const Map = function () {
  const { isLoading, error, data } = useQuery<OsmPointsType, any>(
    'repoData',
    () => fetch('restaurant_examples.geojson').then((res) => res.json())
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error has occurred: {error.message}</div>;

  const markers: JSX.Element[] = [];
  const lat: number[] = [];
  const lon: number[] = [];
  let id = 0;
  data?.features.forEach((feature) => {
    lat.push(feature.geometry.coordinates[1]);
    lon.push(feature.geometry.coordinates[0]);
    let markerIcon: L.Icon;
    let popUpSufix: JSX.Element;
    if (feature.properties.opening_hours) {
      const oh = new opening_hours(feature.properties.opening_hours);
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
          <p>{feature.properties.opening_hours}</p>
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
        position={[
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ]}
        key={`marker-${id}`}
        icon={markerIcon}
      >
        <Popup>
          <p>{feature.properties.name || 'UNKNOWN'}</p>
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
      zoom={13}
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
