import cytoscape from 'cytoscape';
import type { GraphJsonElement } from '../data';
import { GraphElement } from './element';

export class Graph {
  cy: cytoscape.Core;
  elements: GraphJsonElement[];
  cyElements: cytoscape.ElementDefinition[];

  constructor(elements: Array<GraphJsonElement>) {
    this.elements = elements;
    this.cyElements = this.makeCyElements(elements);
    this.cy = cytoscape({
      headless: true,
      elements: this.cyElements,
    });
  }

  makeCyElements(elements: Array<GraphJsonElement>) {
    const graphElements = elements.map((elem) => new GraphElement(elem));
    return graphElements
      .map((elem) => [elem.getCyNode(), ...elem.getCyEdges()])
      .reduce((elem1, elem2) => [...elem1, ...elem2]);
  }

  getAvailableElements() {
    return this.cy.nodes().filter((node) => node.indegree(false) === 0);
  }
}
