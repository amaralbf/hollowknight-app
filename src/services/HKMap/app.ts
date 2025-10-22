import * as PIXI from 'pixi.js';
import MapApp from '@map/mapApp';
import { ClickHandler } from '@map/events';
import { mapElements } from '@elements/data';

const initCanvas = async (
  emitElementClick: CallableFunction,
  emitHoverElement: CallableFunction,
  width: number | undefined,
) => {
  const app = await MapApp.build(emitHoverElement, width);
  document.getElementById('canvas-div')?.appendChild(app.canvas);

  const clickHandler = new ClickHandler(app, emitElementClick);
  clickHandler.addListeners();

  // const graph = new Graph(elements);
  // console.log('Created Graph');
  // const startingElements = graph.getAvailableElements();

  // console.log('All elements');
  // console.log(graph.cy.nodes().length);
  // print(graph.cy.nodes(), 'id');

  // console.log('startingElements');
  // console.log(startingElements.length);
  // print(startingElements, 'id');

  await app.draw(mapElements);

  // const charm = await createCharm('fury_of_the_fallen', 1721, 654);
  // app.add(charm);
};

// const createCharm = async (id: string, x: number, y: number) => {
//   const texture = await PIXI.Assets.load(`images/${id}.png`);
//   const charm = new PIXI.Sprite(texture);

//   charm.anchor.set(0.5);
//   charm.x = x;
//   charm.y = y;
//   charm.scale.set(0.25 * iconScale);

//   return charm;
// };

export default initCanvas;
