import * as PIXI from 'pixi.js';

const initCanvas = async (emitElementClick: CallableFunction) => {
  const app = new PIXI.Application();
  await app.init({
    width: 1480,
    height: 800,
    background: '#222',
  });
  document.getElementById('canvas-div')?.appendChild(app.canvas);
  console.log(emitElementClick);
};

export default initCanvas;
