import { Blog, Location } from '@/types'

export const Locations: Location[] = [
  {
    tid: 1,
    name: 'Eiffel Tower',
    latitude: 48.8584,
    longitude: 2.2945,
    country: 'France',
    city: 'Paris'
  },
  {
    tid: 2,
    name: 'Mount Fuji',
    latitude: 35.3606,
    longitude: 138.7274,
    country: 'Japan',
    city: 'Fujinomiya'
  },
  {
    tid: 3,
    name: 'Grand Canyon',
    latitude: 36.1069,
    longitude: -112.1129,
    country: 'USA',
    city: 'Arizona'
  },
  {
    tid: 4,
    name: 'Sydney Opera House',
    latitude: -33.8568,
    longitude: 151.2153,
    country: 'Australia',
    city: 'Sydney'
  }
]

export const Blogs: Blog[] = [
  {
    nid: 1,
    title: 'A Sunset to Remember at the Eiffel Tower',
    description:
      'Paris is magical at any time, but watching the Eiffel Tower light up as the sun sets is an unforgettable experience. Grab a picnic by the Seine and soak in the romance of the city.',
    imagePath:
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: Locations[0],
    publishDate: '2025-09-20'
  },
  {
    nid: 2,
    title: 'Climbing Adventures at Mount Fuji',
    description:
      'Mount Fuji is not just Japan’s tallest peak, it’s also a spiritual journey. Whether you hike during sunrise or enjoy the surrounding lakes, Fuji’s beauty is breathtaking year-round.',
    imagePath:
      'https://plus.unsplash.com/premium_photo-1661878091370-4ccb8763756a?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: Locations[1],
    publishDate: '2025-09-20'
  },
  {
    nid: 3,
    title: 'Exploring the Depths of the Grand Canyon',
    description:
      'Standing on the rim of the Grand Canyon makes you feel small in the grand timeline of nature. For the adventurous, hiking down to the Colorado River is a must-do.',
    imagePath:
      'https://plus.unsplash.com/premium_photo-1669050701110-a5eb879f1b6a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: Locations[2],
    publishDate: '2025-09-20'
  }
]
