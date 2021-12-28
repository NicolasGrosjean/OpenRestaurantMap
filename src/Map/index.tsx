/* eslint-disable new-cap */
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import {
  MIN_ZOOM_OVERPASS,
  MS_BEFORE_CALLING_OVERPASS,
} from '../utils/constants';
import styles from './index.module.css';

type UpdateBoundsProps = {
  map: L.Map | null;
  // eslint-disable-next-line no-unused-vars
  setBounds: (a: number[]) => void;
};

const UpdateBounds = function ({ map, setBounds }: UpdateBoundsProps) {
  if (!map) return null;
  // We use a ref because of useCallback
  const newBoundsRef = useRef([48.29, 4.03, 48.307, 4.11]);
  const mapMovingDateRef = useRef(Date.now());

  const onMove = useCallback(() => {
    mapMovingDateRef.current = Date.now();
    if (map.getZoom() > MIN_ZOOM_OVERPASS) {
      newBoundsRef.current = [
        map.getBounds().getSouth(),
        map.getBounds().getWest(),
        map.getBounds().getNorth(),
        map.getBounds().getEast(),
      ];
      setTimeout(() => {
        if (
          Date.now() - mapMovingDateRef.current >
          MS_BEFORE_CALLING_OVERPASS
        ) {
          setBounds(newBoundsRef.current);
        }
      }, MS_BEFORE_CALLING_OVERPASS + 1);
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
  const [overpassData, setOverpassData] = useState<OverpassResults | null>(
    null
  );
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    setOverpassData(null);
  }, [bounds]);

  const { isLoading, error, data } = useQuery<OverpassResults, any>(
    `overpassData${bounds[0].toFixed(2)}_${bounds[1].toFixed(
      2
    )}_${bounds[2].toFixed(2)}_${bounds[3].toFixed(2)}`,
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

  if (error) return <div>An error has occurred: {error.message}</div>;

  if (data && !overpassData) {
    setOverpassData(addFakeLatLonToWaysAndRelations(data));
  }
  // TODO add a message if zoom <= MIN_ZOOM_OVERPASS
  // TODO do not load data when we are inside the bound
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
