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
  imgUrl: string;
  pinUrl: string;
  customPinScale?: number;
  defaultIconScale?: number;
  inGamePin: boolean;

  constructor(
    id: string,
    name: string,
    requires: DependencyManagerData,
    type: string,
    location: string,
    pos: number[],
    imgUrl: string,
    pinUrl: string,
    pinScale?: number,
  ) {
    super(id, name, requires, type);
    this.location = location;
    this.pos = pos;
    this.imgUrl = imgUrl;
    this.pinUrl = pinUrl;
    this.customPinScale = pinScale;
    this.inGamePin = false;
  }

  get pinScale(): number {
    if (this.customPinScale !== undefined) {
      return this.customPinScale;
    }
    if (this.defaultIconScale === undefined) {
      throw new Error('Icon scale not implemented for this element');
    }
    return this.defaultIconScale;
  }
}

export class Charm extends MapElement {
  defaultIconScale = 0.22;
}

export class Character extends MapElement {
  defaultIconScale = 0.25;
}

export class Boss extends MapElement {
  defaultIconScale = 0.25;
}

export class Grub extends MapElement {
  defaultIconScale = 0.5;
  inGamePin = true;
}

export class Spell extends MapElement {
  defaultIconScale = 0.25;
}
