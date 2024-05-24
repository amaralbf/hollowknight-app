import * as PIXI from "pixi.js";
import "@pixi/math-extras";

const app = new PIXI.Application();
let dragging = false;
let pointerStartPos: PIXI.Point | null = null;
let mapStartPos: PIXI.Point | null = null;

export const initCanvas = async () => {
  await app.init({ width: 1800, height: 880, background: "#222" });
  document.getElementById("pixijs-canvas")?.appendChild(app.canvas);

  const rootContainer = createRootContainer(app);
  app.stage.addChild(rootContainer);

  const mapContainer = await createMapContainer();
  rootContainer.addChild(mapContainer);

  rootContainer.on("pointerdown", (event: PIXI.FederatedPointerEvent) => {
    dragging = true;
    pointerStartPos = event.global.clone();
    mapStartPos = mapContainer.position.clone();
    console.log("pointedown");
  });

  rootContainer.on("pointerup", (event: PIXI.FederatedPointerEvent) => {
    stopDragging(mapContainer);
  });

  rootContainer.on("pointerout", (event: PIXI.FederatedPointerEvent) => {
    if (dragging) {
      stopDragging(mapContainer);
    }
  });

  rootContainer.on("pointermove", (event: PIXI.FederatedPointerEvent) => {
    if (dragging) {
      const minX = rootContainer.width - mapContainer.width;
      const minY = rootContainer.height - mapContainer.height;

      // @ts-ignore
      const newX = mapStartPos.x + event.globalX - pointerStartPos.x;
      // @ts-ignore
      const newY = mapStartPos.y + event.globalY - pointerStartPos.y;

      if (newX > 0) {
        mapContainer.x = 0;
      } else if (newX < minX) {
        mapContainer.x = minX;
      } else {
        mapContainer.x = newX;
      }

      if (newY > 0) {
        mapContainer.y = 0;
      } else if (newY < minY) {
        mapContainer.y = minY;
      } else {
        mapContainer.y = newY;
      }
    }
  });

  // @ts-expect-error
  printContainer("app.screen", app.screen);
  printContainer("app.stage", app.stage);
  printContainer("rootContainer", rootContainer);
  printContainer("mapContainer", mapContainer);
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
  container.scale.set(0.5);

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

const stopDragging = (mapContainer) => {
  dragging = false;
  pointerStartPos = null;
  console.log("dragging stopped");
  console.log(`mapContainer: (${mapContainer.x}, ${mapContainer.y})`);
};

const addClickListener = (name: string, container: PIXI.Container) => {
  container.on("pointerdown", (event: PIXI.FederatedPointerEvent) => {
    console.log(name);
    console.log(" - event.client", { x: event.clientX, y: event.clientY });
    console.log(" - event.global", { x: event.globalX, y: event.globalY });
    console.log(" - event.getLocalPosition", event.getLocalPosition(container));
    console.log(
      ` - ${name}.toGlobal(0, 0)`,
      container.toGlobal({ x: 0, y: 0 }),
    );
    console.log(
      ` - ${name}.toGlobal(event.getLocalPosition(container))`,
      container.toGlobal(event.getLocalPosition(container)),
    );

    console.log(` - ${name}.toLocal(0,0)`, container.toLocal({ x: 0, y: 0 }));
    console.log(
      ` - ${name}.toLocal(event.client)`,
      container.toLocal(event.client),
    );
  });
};
