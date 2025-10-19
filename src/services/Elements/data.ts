import { MapElement, Charm, Character, Boss, Grub, Spell } from './element';

const kings_pass: MapElementData[] = [
  {
    id: 'fury_of_the_fallen',
    name: 'Fury of the Fallen',
    requires: [],
    type: 'Charm',
    location: "King's Pass",
    iconUrl: new URL('@charms/fury_of_the_fallen.png', import.meta.url).href,
    pos: [1731, 656],
  },
];

const forgottenCrossroads: MapElementData[] = [
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
    requires: {
      paths: [['mantis_claw'], [{ id: 'pogo', type: 'skip', description: 'Pogo vengefly' }]],
    },
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
    requires: {
      paths: [['mothwing_cloak'], [{ id: 'pogo', type: 'skip', description: 'Pogo vengefly' }]],
      common: [],
    },
    type: 'Grub',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/grub.png', import.meta.url).href,
    pos: [2115, 756],
  },
  {
    id: 'false_knight',
    name: 'False Knight',
    requires: [],
    type: 'Boss',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/false_knight.png', import.meta.url).href,
    pos: [2141, 850],
  },
  {
    id: 'gruz_mother',
    name: 'Gruz Mother',
    requires: [],
    type: 'Boss',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/gruz_mother.png', import.meta.url).href,
    pos: [2603, 987],
  },
  {
    id: 'soul_catcher',
    name: 'Soul Catcher',
    requires: [],
    type: 'Charm',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@charms/soul_catcher.png', import.meta.url).href,
    pos: [2038, 822],
  },
  {
    id: 'vengeful_spirit',
    name: 'Vengeful Spirit',
    requires: [],
    type: 'Spell',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@images/vengeful_spirit.png', import.meta.url).href,
    iconScale: 0.35,
    pos: [2070, 822],
  },
  // {
  //   id: 'salubra',
  //   name: 'Salubra',
  //   requires: [],
  //   type: 'Character',
  //   location: 'Forgotten Crossroads',
  //   iconUrl: new URL('@pins/salubra.png', import.meta.url).href,
  //   pos: [2674, 1011],
  // },
  {
    id: 'rescue_sly',
    name: 'Sly (Infected)',
    requires: {
      paths: [['gruz_mother'], ['resting_grounds_lower'], ['dream_nail', 'desolate_dive']],
      common: [],
    },
    type: 'Character',
    location: 'Forgotten Crossroads',
    iconUrl: new URL('@pins/sly_infected.png', import.meta.url).href,
    pos: [2607, 1028],
  },
];

// Type definitions for the map elements

export type MapElementData = {
  id: string;
  name: string;
  requires: DependencySet;
  type: string;
  iconUrl: string;
  iconScale?: number;
  location: string;
  pos: number[];
};

export type SimpleDependency = string;
export type QuantityDependency = { id: string; type: string; quantity: number };
export type SkipDependency = { id: string; type: string; description: string };
export type NegativeDependency = { id: string; type: string };

export type SingularDependency =
  | SimpleDependency
  | QuantityDependency
  | SkipDependency
  | NegativeDependency;

export type MultipleDependencySet = SingularDependency[];

export type MultiplePathsDependencySet = {
  paths: MultipleDependencySet[];
  common?: MultipleDependencySet;
};

export type DependencySet = SingularDependency | MultipleDependencySet | MultiplePathsDependencySet;

// building objects of the correct class based on the type of each element
interface ElementClassMapping {
  [key: string]: { new (...args: any[]): Charm };
}

const classMapping: ElementClassMapping = {
  Boss: Boss,
  Character: Character,
  Charm: Charm,
  Grub: Grub,
  Spell: Spell,
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
    data.iconScale,
  );
};

const mapElementsData = [...kings_pass, ...forgottenCrossroads];

export const mapElements = mapElementsData.map(buildMapElement);
