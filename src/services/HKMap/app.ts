import * as PIXI from 'pixi.js';
import MapApp from '@map/mapApp';
import { ClickHandler } from '@map/events';
import { elements } from '@elements/data';
import { Graph } from '@elements/graph/graph';

const iconScale = 0.7;

const initCanvas = async (emitElementClick: CallableFunction) => {
  const app = await MapApp.build();
  document.getElementById('canvas-div')?.appendChild(app.canvas);

  const clickHandler = new ClickHandler(app, emitElementClick);
  clickHandler.addListeners();

  const graph = new Graph(elements);
  console.log('Created Graph');
  const startingElements = graph.getAvailableElements();

  // app.draw(startingElements)

  // const charm = await createCharm('fury_of_the_fallen', 1721, 654);
  // app.add(charm);
};

const createCharm = async (id: string, x: number, y: number) => {
  const texture = await PIXI.Assets.load(`images/${id}.png`);
  const charm = new PIXI.Sprite(texture);

  charm.anchor.set(0.5);
  charm.x = x;
  charm.y = y;
  charm.scale.set(0.25 * iconScale);

  return charm;
};

export default initCanvas;
