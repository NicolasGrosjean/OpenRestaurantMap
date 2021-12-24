import React from 'react';
import { useQuery } from 'react-query';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { OsmPointsType } from '../types';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
    markers.push(
      <Marker
        position={[
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ]}
        key={`marker-${id}`}
      >
        <Popup>{feature.properties.name || 'UNKNOWN'}</Popup>
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
