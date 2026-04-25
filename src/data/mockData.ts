import type { Container, Plant, WaterPot, WeatherDay } from '../types'

const IMG = {
  rosmarin:  'https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600&q=70&auto=format&fit=crop',
  erdbeere:  'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=70&auto=format&fit=crop',
  tomate:    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=70&auto=format&fit=crop',
  basilikum: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&q=70&auto=format&fit=crop',
  mangold:   'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=70&auto=format&fit=crop',
  chili:     'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&q=70&auto=format&fit=crop',
}

export const WEATHER: WeatherDay[] = [
  { day: 'Mo', date: '20.4', temp: '14°', tempC: 14, sun: '11h', precip: 0,   isPast: true },
  { day: 'Di', date: '21.4', temp: '16°', tempC: 16, sun: '12h', precip: 1.2, isPast: true },
  { day: 'Mi', date: '22.4', temp: '15°', tempC: 15, sun: '10h', precip: 0,   isPast: true },
  { day: 'Do', date: '23.4', temp: '18°', tempC: 18, sun: '13h', precip: 0,   isPast: true },
  { day: 'Fr', date: '24.4', temp: '20°', tempC: 20, sun: '13h', precip: 0,   isPast: true },
  { day: 'Sa', date: '25.4', temp: '22°', tempC: 22, sun: '13h', precip: 0,   isToday: true },
  { day: 'So', date: '26.4', temp: '21°', tempC: 21, sun: '12h', precip: 0 },
  { day: 'Mo', date: '27.4', temp: '19°', tempC: 19, sun: '11h', precip: 0 },
]

export const CONTAINERS: Container[] = [
  {
    id: 'rosmarin',
    name: 'Rosmarin-Topf',
    plantNames: 'Rosmarin',
    plantCount: 1,
    imgUrl: IMG.rosmarin,
    water: { status: 'ok', label: 'Gegossen vor 2 Std.' },
  },
  {
    id: 'beeren',
    name: 'Beeren-Kiste',
    plantNames: 'Erdbeere, Mangold',
    plantCount: 2,
    imgUrl: IMG.erdbeere,
    water: { status: 'warn', label: 'Heute giessen' },
  },
  {
    id: 'kraeuter',
    name: 'Kräuter-Box',
    plantNames: 'Basilikum, Salbei, Thymian',
    plantCount: 3,
    imgUrl: IMG.basilikum,
    water: { status: 'ok', label: 'Gegossen gestern' },
  },
  {
    id: 'tomaten',
    name: 'Tomaten-Kübel',
    plantNames: 'Cherry-Tomate',
    plantCount: 1,
    imgUrl: IMG.tomate,
    water: { status: 'due', label: 'Seit 2 Tagen trocken' },
  },
  {
    id: 'chili',
    name: 'Chili-Topf',
    plantNames: 'Chili Piccante',
    plantCount: 1,
    imgUrl: IMG.chili,
    water: { status: 'ok', label: 'In 2 Tagen' },
  },
]

// Plants inside the "Beeren-Kiste" container — used in Screen 2 & 3
export const BEEREN_PLANTS: Plant[] = [
  {
    id: 'rosmarin',
    name: 'Rosmarin',
    sub: 'Rosmarinus officinalis',
    stage: 'Blüte',
    imgUrl: IMG.rosmarin,
    water: { label: 'In 2 Tagen', status: 'ok' },
    days: 24,
  },
  {
    id: 'erdbeere',
    name: 'Erdbeere',
    sub: 'Fragaria × ananassa',
    stage: 'Fruchtbildung',
    imgUrl: IMG.erdbeere,
    water: { label: 'Heute giessen', status: 'warn' },
    days: 41,
  },
  {
    id: 'mangold',
    name: 'Mangold',
    sub: 'Beta vulgaris',
    stage: 'Wachstum',
    imgUrl: IMG.mangold,
    water: { label: 'Morgen', status: 'ok' },
    days: 18,
  },
]

// Pots for the watering screen (Screen 4)
export const WATER_POTS: WaterPot[] = [
  { id: 'tomaten', name: 'Tomaten-Kübel',  plantNames: 'Cherry-Tomate',     imgUrl: IMG.tomate,    due: 'due',  label: 'Seit 2 Tagen trocken', ml: 400, lastDays: 2 },
  { id: 'beeren',  name: 'Beeren-Kiste',   plantNames: 'Erdbeere, Mangold',  imgUrl: IMG.erdbeere,  due: 'warn', label: 'Heute giessen',        ml: 300, lastDays: 1 },
  { id: 'krauter', name: 'Kräuter-Box',    plantNames: 'Basilikum, Salbei',  imgUrl: IMG.basilikum, due: 'ok',   label: 'Morgen',               ml: 150, lastDays: 0 },
  { id: 'rosm',    name: 'Rosmarin-Topf',  plantNames: 'Rosmarin',           imgUrl: IMG.rosmarin,  due: 'ok',   label: 'In 2 Tagen',           ml: 200, lastDays: 0 },
]

export const WEEK_BARS = [
  { day: 'Do', date: '24.', ml: 700, today: true },
  { day: 'Fr', date: '25.', ml: 250 },
  { day: 'Sa', date: '26.', ml: 450 },
  { day: 'So', date: '27.', ml: 0, rain: true },
  { day: 'Mo', date: '28.', ml: 300 },
  { day: 'Di', date: '29.', ml: 500 },
  { day: 'Mi', date: '30.', ml: 400 },
]
