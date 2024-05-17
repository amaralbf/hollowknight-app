import {
  Application,
  Sprite,
  Assets,
  Container,
  FederatedWheelEvent,
  Graphics,
  FederatedPointerEvent,
  Point,
} from "pixi.js";

const app = new Application();
let zoomLevel: number;
let minZoomLevel: number;

const zoomStep = 0.1;

// let mapMousePoint: Point;

export const initCanvas = async () => {
  await app.init({ width: 1800, height: 880, background: "#222" });

  document.getElementById("pixijs-canvas")?.appendChild(app.canvas);

  const rootContainer = new Container();
  app.stage.addChild(rootContainer);

  rootContainer.eventMode = "static";

  const map = await createMap();

  const background = new Graphics();
  background.fill("#000");
  background.rect(0, 0, map.width, map.height); // Draw the rectangle
  background.fill();
  rootContainer.addChild(background);

  const mapContainer = new Container();
  rootContainer.addChild(mapContainer);

  mapContainer.addChild(map);

  console.log("map.width", map.width);
  console.log("map.height", map.height);
  console.log("app.renderer.width", app.renderer.width);
  // console.log(app.renderer.width / map.width);
  // console.log((app.renderer.width / map.width).toFixed(1));

  const minXZoomLevel = app.renderer.width / map.width;
  const minYZoomLevel = app.renderer.height / map.height;
  // console.log("minXZoomLevel", minXZoomLevel);
  // console.log("minYZoomLevel", minYZoomLevel);

  minZoomLevel = Number(Math.min(minXZoomLevel, minYZoomLevel).toFixed(1));
  console.log("minZoomLevel", minZoomLevel);

  const maskGraphics = new Graphics();
  maskGraphics.fill();
  maskGraphics.rect(0, 0, rootContainer.width, rootContainer.height);
  maskGraphics.fill();
  rootContainer.addChild(maskGraphics);
  rootContainer.mask = maskGraphics;

  zoomLevel = minZoomLevel;
  rootContainer.scale.set(zoomLevel);
  rootContainer.x = (app.renderer.width - rootContainer.width) / 2;
  rootContainer.y = (app.renderer.height - rootContainer.height) / 2;

  addMouseClickListener(rootContainer);
  addZoomListener(rootContainer, mapContainer);

  // rootContainer.on("pointerdown", (event: FederatedPointerEvent) => {
  //   console.log("x:", event.x, ", y:", event.y);
  //   // mouseposition = mouseposition || { x: 0, y: 0 };
  //   // mouseposition.x = event.global.x;
  //   // mouseposition.y = event.global.y;
  // });

  const charm = await drawCharm("fury_of_the_fallen");
  mapContainer.addChild(charm);

  // map.x = -300;
};

const createMap = async () => {
  const texture = await Assets.load("hk_full_map.png");
  const map = Sprite.from(texture);
  map.x = 0;
  map.y = 0;

  return map;
};

const drawCharm = async (id: string) => {
  const texture = await Assets.load(`src/assets/images/${id}.png`);
  const element = Sprite.from(texture);
  element.x = 100;
  element.y = 100;

  return element;
};

// const createZote = async () => {
//   const texture = await Assets.load("zote.png");
//   const zote = new Sprite(texture);

//   zote.x = app.renderer.width / 2;
//   zote.y = app.renderer.height / 2;

//   // Rotate around the center
//   zote.anchor.x = 0.5;
//   zote.anchor.y = 0.5;

//   // Listen for frame updates
//   app.ticker.add(() => {
//     // zote.x = 4000;
//     zote.rotation += 0.03;
//   });

//   return zote;
// };

const addMouseClickListener = (container: Container) => {
  // container.on("pointermove", (event: FederatedPointerEvent) => {
  //   // mapMousePoint = event.getLocalPosition(container);
  //   // console.log(mapMousePoint);
  // });

  container.on("pointerdown", (event: FederatedPointerEvent) => {
    console.log("global click:", { x: event.x, y: event.y });
    console.log("local click:", event.getLocalPosition(container));
  });
};

const addZoomListener = (container: Container, mapContainer: Container) => {
  container.on("wheel", (event: FederatedWheelEvent) => {
    const delta = Math.sign(event.deltaY);
    // console.log("mouse wheel delta", delta);
    const localPoint = event.getLocalPosition(container);
    // console.log(
    //   `zooming centered on local point (${localPoint.x}, ${localPoint.y})`,
    // );

    const globalX = event.x - container.x;
    const globalY = event.y - container.y;
    // console.log(`zooming centered on global point (${globalX}, ${globalY})`);
    if (delta > 0) {
      zoom(container, mapContainer, localPoint, -zoomStep);
    } else {
      // zoomIn(container, map, { x: globalX, y: globalY });
      zoom(container, mapContainer, localPoint, zoomStep);
    }
  });
};

function zoom(
  container: Container,
  mapContainer: Container,
  point: Point,
  zoomStep: number,
) {
  if (zoomStep > 0) {
    if (zoomLevel.toPrecision(1) === "1") return;
  } else {
    if (zoomLevel.toPrecision(1) === minZoomLevel.toPrecision(1)) return;
  }

  const prevZoomLevel = zoomLevel;
  zoomLevel += zoomStep;
  const factor = (zoomLevel - prevZoomLevel) / zoomLevel;
  const offsetX = factor * point.x;
  const offsetY = factor * point.y;
  mapContainer.x -= offsetX;
  mapContainer.y -= offsetY;
  container.scale.set(zoomLevel);

  console.log("zoom", {
    level: zoomLevel.toPrecision(1),
    x: point.x,
    y: point.y,
  });
  console.log("container", {
    x: container.x,
    y: container.y,
    width: container.width,
    height: container.height,
  });
}
