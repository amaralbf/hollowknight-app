import type { DependencyManagerData } from './data';

class Element {
  id: string;
  name: string;
  requires: DependencyManagerData;
  type: string;

  constructor(id: string, name: string, requires: DependencyManagerData, type: string) {
    this.id = id;
    this.name = name;
    this.requires = requires;
    this.type = type;
  }
}

export class MapElement extends Element {
  location: string;
  pos: number[];
  iconUrl: string;

  constructor(
    id: string,
    name: string,
    requires: DependencyManagerData,
    type: string,
    location: string,
    pos: number[],
    iconUrl: string,
  ) {
    super(id, name, requires, type);
    this.location = location;
    this.pos = pos;
    this.iconUrl = iconUrl;
  }

  get iconScale(): number {
    throw new Error("Getter 'iconScale' must be implemented by subclass");
  }
}

export class Charm extends MapElement {
  constructor(
    id: string,
    name: string,
    requires: DependencyManagerData,
    type: string,
    location: string,
    pos: number[],
    iconUrl: string,
  ) {
    super(id, name, requires, type, location, pos, iconUrl);
    this.location = location;
    this.pos = pos;
  }

  get iconScale() {
    return 0.25;
  }
}

// export class MapElement extends Element {
//   location: string;
//   pos: number[] | null;

//   constructor(mapElementData MapElementData) {
//     const elementData = {}
//   }
// }

// this.location = elementData.location;
// this.pos = elementData.pos ?? null;
