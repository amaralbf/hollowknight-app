import {
  Application,
  Sprite,
  Assets,
  Container,
  FederatedWheelEvent,
} from "pixi.js";

const app = new Application();
let zoomLevel: number;
let minZoomLevel: number;

export const initCanvas = async () => {
  await app.init({ width: 1800, height: 880, background: "#222" });

  document.getElementById("pixijs-canvas")?.appendChild(app.canvas);

  const rootContainer = new Container();
  rootContainer.eventMode = "static";
  // rootContainer.hitArea = app.screen;

  app.stage.addChild(rootContainer);

  const map = await createMap();
  const zote = await createZote();

  rootContainer.addChild(map);
  rootContainer.addChild(zote);

  console.log("map.width", map.width);
  console.log("app.renderer.width", app.renderer.width);
  console.log(app.renderer.width / map.width);
  console.log((app.renderer.width / map.width).toFixed(1));

  const minXZoomLevel = app.renderer.width / map.width;
  const minYZoomLevel = app.renderer.height / map.height;
  console.log("minXZoomLevel", minXZoomLevel);
  console.log("minYZoomLevel", minYZoomLevel);

  minZoomLevel = Number(Math.min(minXZoomLevel, minYZoomLevel).toFixed(1));
  console.log("minZoomLevel", minZoomLevel);

  zoomLevel = minZoomLevel;
  rootContainer.scale.set(zoomLevel);

  rootContainer.x = (app.renderer.width - rootContainer.width) / 2;

  createZoomListener(rootContainer);
};

const createMap = async () => {
  const texture = await Assets.load("hk_full_map.png");
  const map = Sprite.from(texture);
  map.x = 0;
  map.y = 0;

  return map;
};

const createZote = async () => {
  const texture = await Assets.load("zote.png");
  const zote = new Sprite(texture);

  zote.x = app.renderer.width / 2;
  zote.y = app.renderer.height / 2;

  // Rotate around the center
  zote.anchor.x = 0.5;
  zote.anchor.y = 0.5;

  // Listen for frame updates
  app.ticker.add(() => {
    zote.rotation += 0.03;
  });

  return zote;
};

const createZoomListener = (container: Container) => {
  container.on("wheel", (event: FederatedWheelEvent) => {
    const delta = Math.sign(event.deltaY);
    console.log("mouse wheel delta", delta);
    if (delta > 0) {
      zoomOut(container);
    } else {
      zoomIn(container);
    }
  });
};

function zoomIn(container: Container) {
  if (zoomLevel.toPrecision(1) === "1") return;
  zoomLevel += 0.1;
  container.scale.set(zoomLevel);
  console.log("zoomLevel", zoomLevel.toPrecision(1));
}

function zoomOut(container: Container) {
  if (zoomLevel.toPrecision(1) === minZoomLevel.toPrecision(1)) return;
  zoomLevel -= 0.1;
  container.scale.set(zoomLevel);

  console.log("zoomLevel", zoomLevel.toPrecision(1));
}

// function zoomToPoint(app: Application, container: Container, point) {
//   const localPoint =
//     app.renderer.plugins.interaction.mouse.getLocalPosition(container);

//   const newScale = container.scale.x * 1.1;
//   container.scale.set(newScale);

//   const newPosition = {
//     x: container.position.x - localPoint.x * (newScale - container.scale.x),
//     y: container.position.y - localPoint.y * (newScale - container.scale.y),
//   };

//   container.position.set(newPosition.x, newPosition.y);
// }

// Function to zoom out
