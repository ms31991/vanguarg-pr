export const properties = [
  {
    id: '1',
    title: 'The One',
    location: 'Beverly Hills, CA',
    price: 890000,
    statusKey: 'investment',
    beds: 5,
    baths: 4,
    sqft: 2500,
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    description:
      'Stunning modern architecture with floor-to-ceiling glass, smart home automation, and panoramic views of the hills.',
  },
  {
    id: '2',
    title: 'Billionaire Mansion',
    location: 'Malibu, CA',
    price: 500000,
    statusKey: 'rent',
    beds: 6,
    baths: 5,
    sqft: 4200,
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    description:
      'Oceanfront estate with private beach access, infinity pool, and a guest house designed for entertaining.',
  },
  {
    id: '3',
    title: 'The Beverly House',
    location: 'Beverly Hills, CA',
    price: 1200000,
    statusKey: 'investment',
    beds: 4,
    baths: 3,
    sqft: 3100,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    description:
      'Timeless Mediterranean design with mature gardens, wine cellar, and a chef’s kitchen.',
  },
  {
    id: '4',
    title: 'Skyline Penthouse',
    location: 'Los Angeles, CA',
    price: 2100000,
    statusKey: 'rent',
    beds: 3,
    baths: 3,
    sqft: 2800,
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    description:
      'Corner penthouse with wraparound terraces, private elevator, and 360° city views.',
  },
  {
    id: '5',
    title: 'Coastal Retreat',
    location: 'Santa Monica, CA',
    price: 1750000,
    statusKey: 'investment',
    beds: 4,
    baths: 4,
    sqft: 2900,
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    description:
      'Steps from the beach with open-plan living, solar panels, and a rooftop deck.',
  },
  {
    id: '6',
    title: 'Hillside Villa',
    location: 'Calabasas, CA',
    price: 980000,
    statusKey: 'rent',
    beds: 5,
    baths: 4,
    sqft: 3600,
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    description:
      'Gated compound with guest casita, home theater, and resort-style landscaping.',
  },
]

export function getPropertyById(id) {
  return properties.find((p) => p.id === id)
}
