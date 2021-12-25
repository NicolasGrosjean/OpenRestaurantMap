import L from 'leaflet';

// eslint-disable-next-line import/prefer-default-export
export function getIcon(
  color:
    | 'blue'
    | 'gold'
    | 'red'
    | 'green'
    | 'orange'
    | 'yellow'
    | 'violet'
    | 'grey'
    | 'black'
) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}
