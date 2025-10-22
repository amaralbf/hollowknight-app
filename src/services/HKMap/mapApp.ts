import * as PIXI from 'pixi.js';
import type { MapElement } from '../Elements/element';
import _ from 'lodash';

let highlightCircle: PIXI.Graphics | null = null;

class MapApp {
  app: PIXI.Application<PIXI.Renderer>;
  rootContainer: PIXI.Container;
  mapContainer: PIXI.Container;

  minZoomLevel: number;

  emitHoverElement: CallableFunction;

  constructor(
    app: PIXI.Application,
    rootContainer: PIXI.Container,
    mapContainer: PIXI.Container,
    emitHoverElement: CallableFunction,
  ) {
    this.app = app;
    this.rootContainer = rootContainer;
    this.mapContainer = mapContainer;

    this.app.stage.addChild(this.rootContainer);
    this.rootContainer.addChild(this.mapContainer);

    this.minZoomLevel = this.calculateMinZoomLevel();
    this.zoom(this.minZoomLevel);

    this.emitHoverElement = emitHoverElement;
  }

  static async build(emitHoverElement: CallableFunction, width: number | undefined) {
    const app = new PIXI.Application();

    // set width to 1416 if width is undefined
    if (!width) {
      width = 0;
    }

    console.log(`Building pixijs app with width ${width}px`);
    await app.init({
      width: width,
      height: 800,
      background: '#222',
    });

    const rootContainer = createRootContainer(app.renderer.width, app.renderer.height);
    const mapContainer = await createMapContainer();

    return new MapApp(app, rootContainer, mapContainer, emitHoverElement);
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
    const behindElementLayer = new PIXI.RenderLayer();

    const elementLayer = new PIXI.RenderLayer();

    this.mapContainer.addChild(behindElementLayer);
    this.mapContainer.addChild(elementLayer);

    for (const mapElement of elements) {
      console.log(mapElement.id);
      const texture = await PIXI.Assets.load(mapElement.iconUrl);
      const elementSprite = new PIXI.Sprite(texture);

      elementSprite.anchor.set(0.5);
      [elementSprite.x, elementSprite.y] = mapElement.pos;
      elementSprite.scale.set(mapElement.iconScale);

      elementSprite.eventMode = 'static';
      elementSprite.cursor = 'pointer';

      elementSprite.on('pointerover', () => {
        const [x, y] = mapElement.pos;
        const { width, height } = elementSprite.getSize();

        if (highlightCircle === null) {
          const radialGradient = new PIXI.FillGradient({
            type: 'radial',
            center: { x: 0.5, y: 0.5 },
            innerRadius: 0,
            outerCenter: { x: 0.5, y: 0.5 },
            outerRadius: 0.5,
            colorStops: [
              { offset: 0.5, color: '#ffff' },
              { offset: 1, color: '#0000' },
            ],
            textureSpace: 'local',
          });

          // It seems we need to pass (0, 0) as the starting point so that the ellipse’s origin aligns with the parent’s origin.
          console.log(width, height);
          highlightCircle = new PIXI.Graphics()
            .ellipse(0, 0, width * 0.7, height * 0.7)
            .fill(radialGradient);

          // And then subsequent (x, y) updates are relative to (0, 0)
          highlightCircle.x = x;
          highlightCircle.y = y;
          console.log(highlightCircle.getSize());

          highlightCircle.eventMode = 'none';
          behindElementLayer.attach(highlightCircle);
          this.mapContainer.addChild(highlightCircle);
        } else {
          highlightCircle.x = x;
          highlightCircle.y = y;
          highlightCircle.setSize(width * 1.4, height * 1.4);
          console.log(highlightCircle.getSize());
        }

        this.emitHoverElement(mapElement);
      });

      elementLayer.attach(elementSprite);
      this.mapContainer.addChild(elementSprite);
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
