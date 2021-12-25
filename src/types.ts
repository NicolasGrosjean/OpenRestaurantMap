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
        '@id': 'node/725153865',
        'addr:city': 'Troyes',
        'addr:housenumber': '35',
        'addr:postcode': '10000',
        'addr:street': 'Rue Champeaux',
        amenity: 'restaurant',
        cuisine: 'burger',
        email: 'hello@rosaparks.fr',
        name: 'Rosaparks',
        opening_hours:
          'Tu-Th 11:30-14:30,18:30-22:00; Fr 18:30-23:00; Sa 11:30-23:00; Su 11:30-22:00',
        'opening_hours:covid19': 'Mo-Su 11:30-14:30,18:00-22:00',
        phone: '+33325703225',
        'ref:vatin': 'FR 70 791260318',
        source:
          'cadastre-dgi-fr source : Direction Générale des Impôts - Cadastre. Mise à jour : 2010',
        website: 'https://www.rosaparks.fr/',
      },
      geometry: {
        type: 'Point',
        coordinates: [4.0723117, 48.2961407],
      },
      id: 'node/725153865',
    },
  ],
};

export type OsmPointsType = typeof osmPointsExample;
