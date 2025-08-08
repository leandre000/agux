import Images from '@/constants/images';

export type EventCategory = 'Sports' | 'Art' | 'Music' | 'Tech' | 'Culture' | 'Film';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  category: EventCategory;
  price: string;
  description: string;
    isFeatured: boolean;
    booked: boolean;
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Summer Event',
    date: '10-May-2025',
    location: 'Serena Hotel Kigali',
    image: Images.concertImage1,
    category: 'Music',
    price: 'Standard',
    description: 'Join us for an unforgettable summer music festival featuring top artists from around the world.',
        isFeatured: true,
    booked:true,
  },
  {
    id: '2',
    title: 'Baba Xpreince',
    date: '10-May-2025',
    location: 'Serena Hotel Kigali',
    image: Images.concertImage2,
    category: 'Music',
    price: 'Premium',
    description: 'Experience the legendary Baba Xpreince live in concert with special guest performances.',
      isFeatured: false,
      booked:true,
  },
  {
    id: '3',
    title: 'Tech Conference 2025',
    date: '15-June-2025',
    location: 'Convention Center',
    image: Images.concertImage3,
    category: 'Tech',
    price: 'VIP',
    description: 'The biggest tech conference of the year with keynotes from industry leaders and hands-on workshops.',
      isFeatured: true,
      booked:true,
  },
  {
    id: '4',
    title: 'Art Exhibition',
    date: '22-July-2025',
    location: 'National Gallery',
    image: Images.concertImage4,
    category: 'Art',
    price: 'Standard',
    description: 'A showcase of contemporary art from emerging and established artists across the continent.',
      isFeatured: false,
      booked:true,
  },
  {
    id: '5',
    title: 'Film Festival',
    date: '5-August-2025',
    location: 'Cinema Plaza',
    image: Images.concertImage5,
    category: 'Film',
    price: 'Premium',
    description: 'An international film festival featuring award-winning films and exclusive director Q&As.',
      isFeatured: true,
      booked:true,
  },
];

export const userEvents = [
  events[1],

];
