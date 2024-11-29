import * as PIXI from 'pixi.js';
import type MapApp from '@map/mapApp';

export class ClickHandler {
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

  emitElementClick: CallableFunction;

  constructor(app: MapApp, emitElementClick: CallableFunction) {
    this.rootContainer = app.rootContainer;
    this.mapContainer = app.mapContainer;
    this.minX = this.rootContainer.width - this.mapContainer.width;
    this.minY = this.rootContainer.height - this.mapContainer.height;

    this.minZoomLevel = app.minZoomLevel;
    this.zoomLevel = this.minZoomLevel;

    this.emitElementClick = emitElementClick;
  }

  addListeners() {
    this.rootContainer.on('pointerdown', this.rootContainerClick.bind(this));
    this.rootContainer.on('pointerup', this.stopDragging.bind(this));
    this.rootContainer.on('pointerout', this.stopDragging.bind(this));
    this.rootContainer.on('pointermove', this.draggingMove.bind(this));

    this.rootContainer.on('wheel', this.handleWheel.bind(this));
  }

  rootContainerClick(event: PIXI.FederatedPointerEvent) {
    this.emitElementClick({ x: event.globalX, y: event.globalY });
    console.log(
      `Clicked on map (${event.getLocalPosition(this.mapContainer).x}, ${event.getLocalPosition(this.mapContainer).y})`,
    );
    this.startDragging(event);
  }

  startDragging(event: PIXI.FederatedPointerEvent) {
    this.dragging = true;
    this.pointerStartPos = event.global.clone();
    this.mapStartPos = this.mapContainer.position.clone();
  }

  stopDragging() {
    if (this.dragging) {
      this.dragging = false;
      this.pointerStartPos = null;
    }
  }

  draggingMove(event: PIXI.FederatedPointerEvent) {
    if (this.dragging) {
      // @ts-ignore
      const newX = this.mapStartPos.x + event.globalX - this.pointerStartPos.x;
      // @ts-ignore
      const newY = this.mapStartPos.y + event.globalY - this.pointerStartPos.y;

      this.moveMap.bind(this)(newX, newY);
    }
  }

  moveMap(x: number, y: number) {
    if (x > 0) {
      this.mapContainer.x = 0;
    } else if (x < this.minX) {
      this.mapContainer.x = this.minX;
    } else {
      this.mapContainer.x = x;
    }

    if (y > 0) {
      this.mapContainer.y = 0;
    } else if (y < this.minY) {
      this.mapContainer.y = this.minY;
    } else {
      this.mapContainer.y = y;
    }
  }

  handleWheel(event: PIXI.FederatedWheelEvent) {
    console.log('handleWheel');
    const delta = Math.sign(event.deltaY);
    const localPoint = event.global;

    console.log('rootContainer', this.rootContainer.width);
    console.log('rootContainer pos', this.rootContainer.x, this.rootContainer.y);

    if (delta > 0) {
      this.zoom(localPoint, -this.zoomStep);
    } else {
      this.zoom(localPoint, this.zoomStep);
    }
  }

  zoom(point: PIXI.Point, zoomStep: number) {
    if (zoomStep > 0) {
      if (this.zoomLevel.toPrecision(2) === '2.5') return;
    } else {
      if (this.zoomLevel.toPrecision(1) === this.minZoomLevel.toPrecision(1)) return;
    }

    const prevZoomLevel = this.zoomLevel;

    this.zoomLevel += zoomStep;

    console.log('New zoom level:', this.zoomLevel);

    const factor = this.zoomLevel / prevZoomLevel;

    const offsetX = (1 - factor) * (point.x - this.mapContainer.x);
    const offsetY = (1 - factor) * (point.y - this.mapContainer.y);

    this.mapContainer.scale.set(this.zoomLevel);
    this.minX = this.rootContainer.width - this.mapContainer.width;
    this.minY = this.rootContainer.height - this.mapContainer.height;

    // console.log('minX', this.minX);
    // console.log('rootContainer', this.rootContainer.width);
    // console.log('rootContainer pos', this.rootContainer.x, this.rootContainer.y);
    // console.log('mapContainer', this.mapContainer.width);

    this.moveMap.bind(this)(this.mapContainer.x + offsetX, this.mapContainer.y + offsetY);
  }
}
