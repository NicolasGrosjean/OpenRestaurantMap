/* eslint-disable new-cap */
import React, { useCallback, useEffect, useState } from 'react';
import L from 'leaflet';
import { useQuery } from 'react-query';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CircularProgress from '@mui/material/CircularProgress';
import { OverpassResults } from '../utils/types';
import {
  addFakeLatLonToWaysAndRelations,
  buildOverpassApiUrl,
} from '../utils/overpass';
import Markers from '../Markers';
import { MIN_ZOOM_OVERPASS } from '../utils/constants';
import styles from './index.module.css';

type UpdateBoundsProps = {
  map: L.Map | null;
  // eslint-disable-next-line no-unused-vars
  setBounds: (a: number[]) => void;
};

const UpdateBounds = function ({ map, setBounds }: UpdateBoundsProps) {
  if (!map) return null;

  const onMove = useCallback(() => {
    if (map.getZoom() > MIN_ZOOM_OVERPASS) {
      setBounds([
        map.getBounds().getSouth(),
        map.getBounds().getWest(),
        map.getBounds().getNorth(),
        map.getBounds().getEast(),
      ]);
    }
  }, [map]);

  useEffect(() => {
    map.on('move', onMove);
    return () => {
      map.off('move', onMove);
    };
  }, [map, onMove]);

  return null;
};

const Map = function () {
  const [bounds, setBounds] = useState([48.29, 4.03, 48.307, 4.11]);
  const [overpassQueryId, setOverpassQueryId] = useState(0);
  const [overpassData, setOverpassData] = useState<OverpassResults | null>(
    null
  );
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    setOverpassData(null);
    setOverpassQueryId(overpassQueryId + 1);
  }, [bounds]);

  const { isLoading, error, data } = useQuery<OverpassResults, any>(
    `overpassData${overpassQueryId}`,
    () =>
      fetch(
        buildOverpassApiUrl(
          bounds[0],
          bounds[1],
          bounds[2],
          bounds[3],
          'amenity=restaurant'
        )
      ).then((res) => res.json())
  );
  if (isLoading && overpassQueryId === 0) return <div>Loading...</div>;

  if (error) return <div>An error has occurred: {error.message}</div>;

  if (data && !overpassData) {
    setOverpassData(addFakeLatLonToWaysAndRelations(data));
  }
  // TODO add a message if zoom <= MIN_ZOOM_OVERPASS
  return (
    <>
      <MapContainer
        className={styles.main}
        center={[(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2]}
        zoom={15}
        style={{ height: '100vh' }}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Markers data={overpassData} />
        <UpdateBounds map={map} setBounds={setBounds} />
      </MapContainer>
      {isLoading ? (
        <CircularProgress className={styles.progress} size="8em" />
      ) : null}
    </>
  );
};

export default Map;
