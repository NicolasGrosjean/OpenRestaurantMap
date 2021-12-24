const osmPointsExample = {
  type: 'FeatureCollection',
  generator: 'overpass-ide',
  copyright:
    'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.',
  timestamp: '2021-12-24T08:04:05Z',
  features: [
    {
      type: 'Feature',
      properties: {
        '@id': 'node/611756372',
        'addr:city': 'Troyes',
        'addr:housenumber': '9',
        'addr:postcode': '10000',
        'addr:street': 'Rue Champeaux',
        amenity: 'restaurant',
        cuisine: 'french;crepe',
        name: 'Crêperie La Tourelle',
      },
      geometry: {
        type: 'Point',
        coordinates: [4.0734795, 48.2966851],
      },
      id: 'node/611756372',
    },
  ],
};

export type OsmPointsType = typeof osmPointsExample;
