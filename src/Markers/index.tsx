/* eslint-disable new-cap */
import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// eslint-disable-next-line camelcase
import opening_hours from 'opening_hours';
import { OSMObject, OverpassResults } from '../utils/types';
import { getIcon } from '../utils/leafletIcons';

type MarkersProps = {
  data: OverpassResults | null;
  date: Date | null;
};

const Markers = function ({ data, date }: MarkersProps) {
  function getMarkerIconAndPopUpOpeningHours(
    o: OSMObject
  ): [L.Icon, JSX.Element] {
    let markerIcon: L.Icon;
    let popUpOpeningHours: JSX.Element;
    if (o.tags.opening_hours) {
      try {
        const oh = new opening_hours(o.tags.opening_hours as string);
        const isOpen = oh.getState(date || undefined);
        markerIcon = isOpen ? getIcon('green') : getIcon('red');
        const nextState = isOpen ? 'Closed' : 'Opened';
        const nextChangeDate = oh.getNextChange(date || undefined);
        const nextChangeHourDiffTime = nextChangeDate
          ? (nextChangeDate.getTime() - Date.now()) / 1000 / 3600
          : 1e6;
        if (isOpen && nextChangeHourDiffTime < 1) {
          markerIcon = getIcon('orange');
        }
        popUpOpeningHours = (
          <>
            <p>{o.tags.opening_hours as string}</p>
            <p>
              {`${nextState} on ${nextChangeDate?.toDateString()} - ${nextChangeDate?.toLocaleTimeString()} (in ${nextChangeHourDiffTime.toFixed(
                0
              )} hours)`}
            </p>
          </>
        );
      } catch {
        console.error(`Invalid opening hours for ${o.type} of id ${o.id}`);
        markerIcon = getIcon('grey');
        popUpOpeningHours = <p>INVALID opening hours</p>;
      }
    } else {
      markerIcon = getIcon('grey');
      popUpOpeningHours = <p>MISSING opening hours</p>;
    }
    return [markerIcon, popUpOpeningHours];
  }

  function getOSMLink(o: OSMObject): string {
    return `https://www.openstreetmap.org/${o.type}/${o.id}`;
  }

  const markers: JSX.Element[] = [];
  let id = 0;
  data?.elements.forEach((e) => {
    const [markerIcon, popUpOpeningHours]: [L.Icon, JSX.Element] =
      getMarkerIconAndPopUpOpeningHours(e);
    markers.push(
      <Marker
        position={[e.lat!, e.lon!]}
        key={`marker-${id}`}
        icon={markerIcon}
      >
        <Popup>
          <p>{(e.tags.name as string) || 'UNKNOWN NAME'}</p>
          {popUpOpeningHours}
          <p>
            <a href={getOSMLink(e)}>See on OpenStreetMap</a> (to edit it for
            example)
          </p>
        </Popup>
      </Marker>
    );
    id += 1;
  });
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{markers}</>;
};

export default Markers;
