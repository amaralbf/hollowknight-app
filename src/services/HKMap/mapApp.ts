import * as PIXI from 'pixi.js';
import cytoscape from 'cytoscape';
import type { MapElement } from '../Elements/element';

const iconScale = 0.5;

class MapApp {
  app: PIXI.Application<PIXI.Renderer>;
  rootContainer: PIXI.Container;
  mapContainer: PIXI.Container;

  minZoomLevel: number;

  constructor(app: PIXI.Application, rootContainer: PIXI.Container, mapContainer: PIXI.Container) {
    this.app = app;
    this.rootContainer = rootContainer;
    this.mapContainer = mapContainer;

    this.app.stage.addChild(this.rootContainer);
    this.rootContainer.addChild(this.mapContainer);

    this.minZoomLevel = this.calculateMinZoomLevel();
    this.zoom(this.minZoomLevel);
  }

  static async build() {
    const app = new PIXI.Application();
    await app.init({
      width: 1480,
      height: 800,
      background: '#222',
    });

    const rootContainer = createRootContainer(app.renderer.width, app.renderer.height);
    const mapContainer = await createMapContainer();

    return new MapApp(app, rootContainer, mapContainer);
  }

  get canvas() {
    return this.app.canvas;
  }

  get renderer() {
    return this.app.renderer;
  }

  calculateMinZoomLevel() {
    const minXZoomLevel = this.renderer.width / this.mapContainer.width;
    const minYZoomLevel = this.renderer.height / this.mapContainer.height;

    const minZoomLevel = Math.ceil(Math.max(minXZoomLevel, minYZoomLevel) * 10) / 10;

    return minZoomLevel;
  }

  zoom(level: number) {
    this.mapContainer.scale.set(level);
  }

  add(element: PIXI.Sprite) {
    this.mapContainer.addChild(element);
  }

  async draw(elements: MapElement[]) {
    for (const elem of elements) {
      // console.log('Element data.imgUrl:', data.imgUrl);
      // console.log(elem.icon);
      const texture = await PIXI.Assets.load(elem.iconUrl);
      const sprite = new PIXI.Sprite(texture);

      sprite.anchor.set(0.5);
      [sprite.x, sprite.y] = elem.pos;
      sprite.scale.set(elem.iconScale);

      this.mapContainer.addChild(sprite);
    }
  }
}

const createRootContainer = (width: number, height: number) => {
  const container = new PIXI.Container();

  const mask = new PIXI.Graphics();
  mask.fill();
  mask.rect(0, 0, width, height);
  mask.fill();
  container.addChild(mask);
  container.mask = mask;

  const background = new PIXI.Graphics();
  background.fill();
  background.rect(0, 0, width, height);
  background.fill();
  container.addChild(background);

  container.eventMode = 'static';

  return container;
};

const createMapContainer = async (): Promise<PIXI.Container> => {
  const container = new PIXI.Container();

  const map = await createMap();
  map.x = 0;
  map.y = 0;

  const background = new PIXI.Graphics();
  background.fill('#000');
  background.rect(0, 0, map.width, map.height);
  background.fill();

  container.addChild(background);
  container.addChild(map);

  container.eventMode = 'static';

  // printContainer('map', map);

  return container;
};

const createMap = async () => {
  const map_url = new URL('@assets/hk_full_map.png', import.meta.url).href;
  const texture = await PIXI.Assets.load(map_url);
  const map = PIXI.Sprite.from(texture);
  map.alpha = 0.3;

  return map;
};

const printContainer = (name: string, container: PIXI.Container) => {
  console.log(name, {
    x: container.x,
    y: container.y,
    width: container.width,
    height: container.height,
  });
};

export default MapApp;
