import cytoscape from 'cytoscape';
import type { GraphJsonElement } from '../data';
import { GraphElement } from './element';

export class Graph {
  cy: cytoscape.Core;
  elements: Array<GraphJsonElement>;

  constructor(elements: Array<GraphJsonElement>) {
    this.cy = cytoscape({
      headless: true,
      elements: this.makeCyElements(elements),
    });
    this.elements = elements;
  }

  makeCyElements(elements: Array<GraphJsonElement>) {
    const graphElements = elements.map((elem) => new GraphElement(elem));
    return graphElements
      .map((elem) => [elem.getCyNode(), ...elem.getCyEdges()])
      .reduce((elem1, elem2) => [...elem1, ...elem2]);
  }

  getAvailableElements() {
    this.cy
      .nodes()
      .filter((node) => node.indegree(false) === 0)
      .forEach((node) => {
        console.log('node', node.data().id);
      });
  }
}
