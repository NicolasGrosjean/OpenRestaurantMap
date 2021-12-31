/* eslint-disable new-cap */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useQuery } from 'react-query';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { OverpassResults } from '../utils/types';
import {
  addFakeLatLonToWaysAndRelations,
  buildOverpassApiUrl,
} from '../utils/overpass';
import Markers from '../Markers';
import {
  COORDINATES_PRECISION_FOR_BOUNDS,
  MIN_ZOOM_OVERPASS,
  MS_BEFORE_CALLING_OVERPASS,
} from '../utils/constants';
import styles from './index.module.css';

type UpdateBoundsProps = {
  map: L.Map | null;
  bounds: number[];
  // eslint-disable-next-line no-unused-vars
  setBounds: (a: number[]) => void;
  // eslint-disable-next-line no-unused-vars
  setToastZoomOpen: (a: boolean) => void;
};

const UpdateBounds = function ({
  map,
  bounds,
  setBounds,
  setToastZoomOpen,
}: UpdateBoundsProps) {
  /**
   * Return true if we should update the map :
   * If the map is zoomed enough (zoom > MIN_ZOOM_OVERPASS) and if its bounds is not included in the previous ones
   * @param newMap The new map object after moving/zooming
   * @returns
   */
  function shouldUpdateMapData(newMap: L.Map) {
    if (newMap.getZoom() <= MIN_ZOOM_OVERPASS) {
      setToastZoomOpen(true);
      return false;
    }
    if (newMap.getBounds().getSouth() < bounds[0]) return true;
    if (newMap.getBounds().getWest() < bounds[1]) return true;
    if (newMap.getBounds().getNorth() > bounds[2]) return true;
    if (newMap.getBounds().getEast() > bounds[3]) return true;
    return false;
  }

  if (!map) return null;
  // We use a ref because of useCallback
  const newBoundsRef = useRef([48.29, 4.03, 48.307, 4.11]);
  const mapMovingDateRef = useRef(Date.now());

  const onMove = useCallback(() => {
    mapMovingDateRef.current = Date.now();
    if (shouldUpdateMapData(map)) {
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
  const [toastZoomOpen, setToastZoomOpen] = useState(false);

  useEffect(() => {
    setOverpassData(null);
  }, [bounds]);

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastZoomOpen(false);
  };

  const { isLoading, error, data } = useQuery<OverpassResults, any>(
    `overpassData${bounds[0].toFixed(
      COORDINATES_PRECISION_FOR_BOUNDS
    )}_${bounds[1].toFixed(
      COORDINATES_PRECISION_FOR_BOUNDS
    )}_${bounds[2].toFixed(
      COORDINATES_PRECISION_FOR_BOUNDS
    )}_${bounds[3].toFixed(COORDINATES_PRECISION_FOR_BOUNDS)}`,
    () =>
      fetch(
        buildOverpassApiUrl(
          bounds[0],
          bounds[1],
          bounds[2],
          bounds[3],
          'amenity=restaurant',
          'amenity=fast_food'
        )
      ).then((res) => res.json())
  );

  if (error) return <div>An error has occurred: {error.message}</div>;

  if (data && !overpassData) {
    setOverpassData(addFakeLatLonToWaysAndRelations(data));
  }

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
        <UpdateBounds
          map={map}
          bounds={bounds}
          setBounds={setBounds}
          setToastZoomOpen={setToastZoomOpen}
        />
      </MapContainer>
      {isLoading ? (
        <CircularProgress className={styles.progress} size="8em" />
      ) : null}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={toastZoomOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
      >
        <Alert
          onClose={handleCloseToast}
          severity="info"
          sx={{ width: '100%' }}
        >
          Zoom-in to display data on the map
        </Alert>
      </Snackbar>
    </>
  );
};

export default Map;
