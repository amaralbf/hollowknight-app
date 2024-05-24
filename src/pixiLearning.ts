import * as PIXI from "pixi.js";
import "@pixi/math-extras";

const app = new PIXI.Application();

class ClickHandler {
  rootContainer: PIXI.Container;
  mapContainer: PIXI.Container;

  dragging = false;
  pointerStartPos: PIXI.Point | null = null;
  mapStartPos: PIXI.Point | null = null;
  minX: number;
  minY: number;

  zoomLevel: number;
  minZoomLevel: number;
  zoomStep = 0.1;

  constructor(
    rootContainer: PIXI.Container,
    mapContainer: PIXI.Container,
    zoomLevel: number,
    minZoomLevel: number,
  ) {
    this.rootContainer = rootContainer;
    this.mapContainer = mapContainer;
    this.minX = rootContainer.width - mapContainer.width;
    this.minY = rootContainer.height - mapContainer.height;

    this.minZoomLevel = minZoomLevel;
    this.zoomLevel = zoomLevel;
  }

  addListeners() {
    this.rootContainer.on("pointerdown", this.rootContainerClick.bind(this));
    this.rootContainer.on("pointerup", this.stopDragging.bind(this));
    this.rootContainer.on("pointerout", this.stopDragging.bind(this));
    this.rootContainer.on("pointermove", this.draggingMove.bind(this));

    this.rootContainer.on("wheel", this.handleWheel.bind(this));
  }

  rootContainerClick(event: PIXI.FederatedPointerEvent) {
    console.log("rootContainerClick");
    console.log(`global click at (${event.globalX}, ${event.globalY})`);
    console.log(
      `local click at (${event.getLocalPosition(this.mapContainer).x}, ${event.getLocalPosition(this.mapContainer).y})`,
    );
    this.startDragging(event);
  }

  startDragging(event: PIXI.FederatedPointerEvent) {
    console.log("startDragging");
    this.dragging = true;
    this.pointerStartPos = event.global.clone();
    this.mapStartPos = this.mapContainer.position.clone();
  }

  stopDragging() {
    if (this.dragging) {
      console.log("stopDragging");
      this.dragging = false;
      this.pointerStartPos = null;
    }
  }

  draggingMove(event: PIXI.FederatedPointerEvent) {
    if (this.dragging) {
      console.log("draggingMove");
      // @ts-ignore
      const newX = this.mapStartPos.x + event.globalX - this.pointerStartPos.x;
      // @ts-ignore
      const newY = this.mapStartPos.y + event.globalY - this.pointerStartPos.y;

      if (newX > 0) {
        this.mapContainer.x = 0;
      } else if (newX < this.minX) {
        this.mapContainer.x = this.minX;
      } else {
        this.mapContainer.x = newX;
      }

      if (newY > 0) {
        this.mapContainer.y = 0;
      } else if (newY < this.minY) {
        this.mapContainer.y = this.minY;
      } else {
        this.mapContainer.y = newY;
      }
    }
  }

  handleWheel(event: PIXI.FederatedWheelEvent) {
    console.log("handleWheel");
    const delta = Math.sign(event.deltaY);
    const localPoint = event.global;
    // const localPoint = event.getLocalPosition(this.mapContainer);

    if (delta > 0) {
      this.zoom(localPoint, -this.zoomStep);
    } else {
      this.zoom(localPoint, this.zoomStep);
    }
  }

  zoom(point: PIXI.Point, zoomStep: number) {
    if (zoomStep > 0) {
      if (this.zoomLevel.toPrecision(1) === "1") return;
    } else {
      if (this.zoomLevel.toPrecision(1) === this.minZoomLevel.toPrecision(1))
        return;
    }

    const prevZoomLevel = this.zoomLevel;

    this.zoomLevel += zoomStep;

    const factor = this.zoomLevel / prevZoomLevel;

    const offsetX = (1 - factor) * (point.x - this.mapContainer.x);
    const offsetY = (1 - factor) * (point.y - this.mapContainer.y);

    this.mapContainer.scale.set(this.zoomLevel);
    this.mapContainer.x += offsetX;
    this.mapContainer.y += offsetY;
  }
}

export const initCanvas = async () => {
  await app.init({ width: 1800, height: 880, background: "#222" });
  document.getElementById("pixijs-canvas")?.appendChild(app.canvas);

  const rootContainer = createRootContainer(app);
  app.stage.addChild(rootContainer);

  const mapContainer = await createMapContainer();
  rootContainer.addChild(mapContainer);

  const minZoomLevel = calculateMinZoomLevel(app, mapContainer);
  console.log("minZoomLevel", minZoomLevel);

  mapContainer.scale.set(minZoomLevel);

  const clickHandler = new ClickHandler(
    rootContainer,
    mapContainer,
    minZoomLevel,
    minZoomLevel,
  );
  clickHandler.addListeners();

  // @ts-expect-error
  printContainer("app.screen", app.screen);
  printContainer("app.stage", app.stage);
  printContainer("rootContainer", rootContainer);
  printContainer("mapContainer", mapContainer);
};

const calculateMinZoomLevel = (
  app: PIXI.Application,
  mapContainer: PIXI.Container,
) => {
  const minXZoomLevel = app.renderer.width / mapContainer.width;
  const minYZoomLevel = app.renderer.height / mapContainer.height;

  // console.log("app.renderer.width", app.renderer.width);
  // console.log("app.renderer.height", app.renderer.height);

  // console.log("mapContainer.width", mapContainer.width);
  // console.log("mapContainer.height", mapContainer.height);

  // console.log("minXZoomLevel", minXZoomLevel);
  // console.log("minYZoomLevel", minYZoomLevel);

  const minZoomLevel =
    Math.ceil(Math.max(minXZoomLevel, minYZoomLevel) * 10) / 10;

  return minZoomLevel;
};
const createRootContainer = (app: PIXI.Application) => {
  const container = new PIXI.Container();

  const mask = new PIXI.Graphics();
  mask.fill();
  mask.rect(0, 0, app.renderer.width, app.renderer.height);
  mask.fill();
  container.addChild(mask);
  container.mask = mask;

  container.eventMode = "static";

  return container;
};

const createMapContainer = async (): Promise<PIXI.Container> => {
  const container = new PIXI.Container();

  const map = await createMap();
  map.x = 0;
  map.y = 0;

  const background = new PIXI.Graphics();
  background.fill("#000");
  background.rect(0, 0, map.width, map.height);
  background.fill();

  container.addChild(background);
  container.addChild(map);

  container.eventMode = "static";

  printContainer("map", map);

  return container;
};

const createMap = async () => {
  const texture = await PIXI.Assets.load("hk_full_map.png");
  const map = PIXI.Sprite.from(texture);

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
