import { MapElement, Charm, Character, Boss, Grub } from './element';

const mapElementsData: MapElementData[] = [
  {
    id: 'fury_of_the_fallen',
    name: 'Fury of the Fallen',
    requires: [],
    type: 'Charm',
    location: "King's Pass",
    iconUrl: new URL('@charms/fury_of_the_fallen.png', import.meta.url).href,
    pos: [1731, 656],
  },
  {
    id: 'cornifer_forgotten_crossroads',
    name: 'Cornifer\n(Forgotten Crossroads)',
    requires: [],
    type: 'Character',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/cornifer.png', import.meta.url).href,
    pos: [1995, 865],
  },
  {
    id: 'bretta',
    name: 'Bretta',
    requires: [],
    type: 'Character',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/bretta.png', import.meta.url).href,
    pos: [2010, 865],
  },
  {
    id: 'grubfather',
    name: 'Grubfather',
    requires: [],
    type: 'Character',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/grubfather.png', import.meta.url).href,
    pos: [1894, 712],
  },
  {
    id: 'brooding_mawlek',
    name: 'Brooding Mawlek',
    requires: [],
    type: 'Boss',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/brooding_mawlek.png', import.meta.url).href,
    pos: [1927, 872],
  },
  {
    id: 'grub_1',
    name: 'Grub #1',
    requires: [],
    type: 'Grub',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/grub.png', import.meta.url).href,
    pos: [2565, 701],
  },
  {
    id: 'grub_2',
    name: 'Grub #2',
    requires: [],
    type: 'Grub',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/grub.png', import.meta.url).href,
    pos: [1733, 926],
  },
  {
    id: 'grub_3',
    name: 'Grub #3',
    requires: [],
    type: 'Grub',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/grub.png', import.meta.url).href,
    pos: [2395, 850],
  },
  {
    id: 'grub_4',
    name: 'Grub #4',
    requires: [],
    type: 'Grub',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/grub.png', import.meta.url).href,
    pos: [2453, 902],
  },
  {
    id: 'grub_5',
    name: 'Grub #5',
    requires: [],
    type: 'Grub',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/grub.png', import.meta.url).href,
    pos: [2115, 756],
  },
];

// Type definitions for the map elements

export type MapElementData = {
  id: string;
  name: string;
  requires: DependencyManagerData;
  type: string;
  iconUrl: string;
  classes?: string;
  location: string;
  pos: number[];
};

export type DependencyManagerData = DependencyData[]; // | MultiplePathsDependency;

export type DependencyData = string; // | DependencyWithAttributes;

// export type MultiplePathsDependency = {
//   paths: DependencyData[][];
//   common?: DependencyData[];
// };

// export type DependencyWithAttributes = {
//   id: string;
//   classes?: string;
//   label?: string;
// };

// building objects of the correct class based on the type of each element

interface ElementClassMapping {
  [key: string]: { new (...args: any[]): Charm };
}

const classMapping: ElementClassMapping = {
  Boss: Boss,
  Character: Character,
  Charm: Charm,
  Grub: Grub,
};

const buildMapElement = (data: MapElementData): MapElement => {
  const classType = classMapping[data.type];
  return new classType(
    data.id,
    data.name,
    data.requires,
    data.type,
    data.location,
    data.pos,
    data.iconUrl,
  );
};

export const mapElements = mapElementsData.map(buildMapElement);
