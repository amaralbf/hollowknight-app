import cytoscape, { type ElementDefinition, type EventObject, type Stylesheet } from 'cytoscape';

import {
  type GraphJsonElement,
  type JsonDependencies,
  type JsonDependency,
  type JsonMultiplePathsDependencies,
  type JsonObjectDependency,
} from '../data';

const uniqueOrNodesIds = new Map();

export class GraphElement {
  id: string;
  name: string;
  dependencies: Array<ElementDefinition>;
  type: string;
  location: string;
  imgUrl: string;
  classes: string;
  pos: number[];

  constructor(elem: GraphJsonElement) {
    this.id = elem.id;
    this.name = elem.name;
    this.dependencies = calculateDependencies(elem.depends_on, elem.id);
    this.type = elem.type;
    this.location = elem.location;
    this.imgUrl = elem.img;
    this.classes = elem?.classes ?? '';
    this.pos = elem?.pos ?? [];
  }

  getCyNode(): ElementDefinition {
    return {
      data: {
        id: this.id,
        name: this.name,
        imgUrl: this.imgUrl,
        pos: this.pos,
      },
      classes: this.classes,
    };
  }

  getCyNodeStyle(): Stylesheet {
    return {
      selector: `#${this.id}`,
      style: {
        'background-image': `url('${this.imgUrl}')`,
      },
    };
  }

  getCyEdges(): Array<ElementDefinition> {
    return this.dependencies;
  }
}

function calculateDependencies(
  dependencies: JsonDependencies,
  target_id: string,
): Array<ElementDefinition> {
  // single path dependencies
  if (Array.isArray(dependencies)) {
    if (dependencies.length === 0) {
      return [];
    }

    const deps = dependencies.map((dep) => {
      if (typeof dep === 'string') {
        // console.log("string dep: ", dep);
        return [stringDependency(dep, target_id)];
      } else {
        // console.log("object dep: ", dep);
        return [objectDependency(dep, target_id)];
      }
    });
    return deps.reduce((a, b) => [...a, ...b]);
  } else {
    // multiple path dependencies
    return calculateMultiplePaths(dependencies, target_id);
  }
}

function stringDependency(source: string, target: string): ElementDefinition {
  return {
    data: {
      id: `${source}->${target}`,
      source: source,
      target: target,
    },
  };
}

function objectDependency(source: JsonObjectDependency, target: string): ElementDefinition {
  return {
    data: {
      id: `${source.id}->${target}`,
      source: source.id,
      target: target,
      label: source.label ?? '',
    },
    classes: source.classes ?? '',
  };
}

function addOrClassesToEdges(
  path: Array<JsonDependency>,
  pathIndex: number,
): Array<JsonDependency> {
  return path.map((edge) => {
    if (typeof edge === 'string') {
      return {
        id: edge,
        classes: `or_${pathIndex}`,
      };
    }
    const newEdge = structuredClone(edge);
    if ('classes' in edge) {
      newEdge.classes = `${edge.classes} or_${pathIndex}`;
    } else {
      newEdge.classes = `or_${pathIndex}`;
    }
    return newEdge;
  });
}

function getOrNodeId(pathDependencies: Array<Array<JsonDependency>>) {
  const key = JSON.stringify(pathDependencies);
  let orNodeId = uniqueOrNodesIds.get(key);

  if (orNodeId) {
    return { orNodeId: orNodeId, createEdges: false };
  }
  orNodeId = `or_node_${uniqueOrNodesIds.size}`;
  uniqueOrNodesIds.set(key, orNodeId);
  return { orNodeId: orNodeId, createEdges: true };
}

function calculateMultiplePaths(
  dependencies: JsonMultiplePathsDependencies,
  target: string,
): Array<ElementDefinition> {
  const { orNodeId, createEdges } = getOrNodeId(dependencies.paths);

  const orNode = {
    data: {
      id: orNodeId,
      name: '',
    },
    classes: 'or',
  };

  const orNodeToTarget = {
    data: {
      id: `${orNodeId}->${target}`,
      source: orNodeId,
      target: target,
    },
  };

  let pathEdgesToOrNodeSpread: Array<ElementDefinition> = [];
  if (createEdges) {
    const pathEdgesToOrNode = dependencies.paths.map((path, i) => {
      const pathWithOrClasses = addOrClassesToEdges(path, i);
      return calculateDependencies(pathWithOrClasses, orNodeId);
    });
    pathEdgesToOrNodeSpread = pathEdgesToOrNode.reduce((a, b) => [...a, ...b]);
  }

  const commonEdgesToTarget = calculateDependencies(dependencies.common, target);

  return [orNode, orNodeToTarget, ...pathEdgesToOrNodeSpread, ...commonEdgesToTarget];
}
