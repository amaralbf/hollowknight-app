import { MapElement, Charm } from './element';

const mapElementsData: MapElementData[] = [
  {
    id: 'fury_of_the_fallen',
    name: 'Fury of the Fallen',
    requires: [],
    type: 'Charm',
    location: "King's Pass",
    icon: new URL('@images/fury_of_the_fallen.png', import.meta.url).href,
    pos: [1731, 656],
  },
];

export type MapElementData = {
  id: string;
  name: string;
  requires: DependencyManagerData;
  type: string;
  icon: string;
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

interface ElementClassMapping {
  [key: string]: { new (...args: any[]): Charm };
}

const classMapping: ElementClassMapping = {
  Charm: Charm,
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
    data.icon,
  );
};

export const mapElements = mapElementsData.map(buildMapElement);
