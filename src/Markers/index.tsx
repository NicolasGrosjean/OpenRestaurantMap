/* eslint-disable new-cap */
import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// eslint-disable-next-line camelcase
import opening_hours from 'opening_hours';
import { OverpassResults } from '../utils/types';
import { getIcon } from '../utils/leafletIcons';

type MarkersProps = {
  data: OverpassResults | null;
};

const Markers = function ({ data }: MarkersProps) {
  const markers: JSX.Element[] = [];
  let id = 0;
  data?.elements.forEach((e) => {
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
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{markers}</>;
};

export default Markers;
