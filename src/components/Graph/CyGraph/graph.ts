import cytoscape, {
  ElementDefinition,
  EventObject,
  Stylesheet,
} from "cytoscape";
import klay from "cytoscape-klay";
import {
  graph_content,
  GraphJsonElement,
  JsonDependency,
  JsonMultiplePathsDependencies,
  JsonObjectDependency,
  JsonDependencies,
} from "./data/graph_data";
import { searchPaths } from "./pathSearch";
import { clickOnNode } from "./progression";

cytoscape.use(klay);

const IMAGE_DIR = "images";

let uniqueOrNodesIds = new Map();

var graph: Graph;

class GraphElement {
  id: string;
  name: string;
  dependencies: Array<ElementDefinition>;
  type: string;
  location: string;
  imgUrl: string;
  classes: string;

  constructor(elem: GraphJsonElement) {
    this.id = elem.id;
    this.name = elem.name;
    this.dependencies = calculateDependencies(elem.depends_on, elem.id);
    this.type = elem.type;
    this.location = elem.location;
    this.imgUrl = `${IMAGE_DIR}/${elem.img}`;
    this.classes = elem?.classes ?? "";
  }

  getCyNode(): ElementDefinition {
    return {
      data: {
        id: this.id,
        name: this.name,
      },
      classes: this.classes,
    };
  }

  getCyNodeStyle(): Stylesheet {
    return {
      selector: `#${this.id}`,
      style: {
        "background-image": `url('${this.imgUrl}')`,
      },
    };
  }

  getCyEdges(): Array<ElementDefinition> {
    return this.dependencies;
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

function objectDependency(
  source: JsonObjectDependency,
  target: string,
): ElementDefinition {
  return {
    data: {
      id: `${source.id}->${target}`,
      source: source.id,
      target: target,
      label: source.label ?? "",
    },
    classes: source.classes ?? "",
  };
}

function addOrClassesToEdges(
  path: Array<JsonDependency>,
  pathIndex: number,
): Array<JsonDependency> {
  return path.map((edge) => {
    if (typeof edge === "string") {
      return {
        id: edge,
        classes: `or_${pathIndex}`,
      };
    }
    let newEdge = structuredClone(edge);
    if ("classes" in edge) {
      newEdge.classes = `${edge.classes} or_${pathIndex}`;
    } else {
      newEdge.classes = `or_${pathIndex}`;
    }
    return newEdge;
  });
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

    let deps = dependencies.map((dep) => {
      if (typeof dep === "string") {
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

function getOrNodeId(pathDependencies: Array<Array<JsonDependency>>) {
  let key = JSON.stringify(pathDependencies);
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

  let orNode = {
    data: {
      id: orNodeId,
      name: "",
    },
    classes: "or",
  };

  let orNodeToTarget = {
    data: {
      id: `${orNodeId}->${target}`,
      source: orNodeId,
      target: target,
    },
  };

  var pathEdgesToOrNodeSpread: Array<ElementDefinition> = [];
  if (createEdges) {
    let pathEdgesToOrNode = dependencies.paths.map((path, i) => {
      let pathWithOrClasses = addOrClassesToEdges(path, i);
      return calculateDependencies(pathWithOrClasses, orNodeId);
    });
    pathEdgesToOrNodeSpread = pathEdgesToOrNode.reduce((a, b) => [...a, ...b]);
  }

  let commonEdgesToTarget = calculateDependencies(dependencies.common, target);

  return [
    orNode,
    orNodeToTarget,
    ...pathEdgesToOrNodeSpread,
    ...commonEdgesToTarget,
  ];
}

class Graph {
  nodes: Array<GraphElement>;
  elements: Array<cytoscape.ElementDefinition>;

  constructor(content: Array<GraphJsonElement>) {
    this.nodes = this.buildInternalNodes(content);
    this.elements = this.calculateElements();
  }

  buildInternalNodes(content: Array<GraphJsonElement>) {
    return content.map((elem) => new GraphElement(elem));
  }

  calculateElements(): Array<cytoscape.ElementDefinition> {
    let elements = this.nodes.map((node) => {
      return [node.getCyNode(), ...node.getCyEdges(), ...node.dependencies];
    });
    return elements.reduce((node1, node2) => [...node1, ...node2]);
  }

  calculateNodeStyles(): Array<cytoscape.Stylesheet> {
    let nodeSelector: Stylesheet = {
      selector: "node",
      style: {
        "background-opacity": 0,
        "background-fit": "contain",
        label: "data(name)",
        "text-wrap": "wrap",
        "font-size": "0.5em",
        shape: "rectangle",
      },
    };

    let nodeIds: Array<Stylesheet> = this.nodes.map((node) =>
      node.getCyNodeStyle(),
    );
    return [nodeSelector, ...nodeIds];
  }

  calculateEdgeStyles(): Array<cytoscape.Stylesheet> {
    let edgeSelector = {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#222",
        "target-arrow-color": "#222",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        "text-rotation": "autorotate",
        "text-background-color": "#e9e9e9",
        "text-background-opacity": 1,
        "text-background-padding": "2px",
        "font-size": "0.5em",
        label: function (ele: cytoscape.EdgeDataDefinition) {
          if (ele.data("label")) {
            return ele.data("label");
          }
          return "";
        },
      },
    };

    let roundImg = {
      selector: "node.round-img",
      style: {
        shape: "ellipse",
        "background-fit": "cover",
      },
    };

    let wideImg = {
      selector: "node.wide-img",
      style: {
        shape: "rectangle",
        width: "60px",
      },
    };

    let extra_info = {
      selector: "edge.extra-info",
      style: {
        "line-style": "dashed",
      },
    };

    let or_classes = [
      {
        selector: "edge.or_0",
        style: {
          "line-style": "dashed",
          "line-color": "#f90",
          "target-arrow-color": "#f90",
        },
      },
      {
        selector: "edge.or_1",
        style: {
          "line-style": "dashed",
          "line-color": "#2a2",
          "target-arrow-color": "#2a2",
        },
      },
      {
        selector: "edge.or_2",
        style: {
          "line-style": "dashed",
          "line-color": "#22d",
          "target-arrow-color": "#22d",
        },
      },
      {
        selector: "edge.or_3",
        style: {
          "line-style": "dashed",
          "line-color": "#d0f",
          "target-arrow-color": "#d0f",
        },
      },
      {
        selector: "edge.or_4",
        style: {
          "line-style": "dashed",
          "line-color": "#bdbf17",
          "target-arrow-color": "#bdbf17",
        },
      },
    ];

    let or_node = {
      selector: "node.or",
      style: {
        "background-image": `${IMAGE_DIR}/or.svg`,
      },
    };

    let marked_node = {
      selector: "node.marked",
      style: {
        "border-width": "2.5px",
        "border-style": "solid",
        "border-color": "#050",
        "background-image-opacity": 0.2,
        color: "#050",
      },
    };

    let unmarked_node = {
      selector: ".unmarked",
      style: {
        opacity: 0.5,
      },
    };

    let available_to_mark = {
      selector: "node.available-to-mark",
      style: {
        "font-weight": "bold",
        // "border-width": "2.5px",
        // "border-style": "solid",
        // "border-color": "#050",
        // "background-image-opacity": 0.3,
      },
    };

    let not_edge = {
      selector: "edge.not",
      style: {
        "line-style": "dotted",
        "line-color": "#f00",
        "target-arrow-color": "#f00",
        color: "#f00",
        label: "PRECLUDES",
      },
    };

    let low_opacity = {
      selector: ".low-opacity",
      style: {
        opacity: 0.3,
      },
    };

    let hidden = {
      selector: ".hidden",
      style: {
        display: "none",
      },
    };

    let auto_rotate = {
      selector: ".autorotate", // Class to apply automatic rotation
      style: {
        "text-rotation": "data(angle)", // Rotates the label based on the 'angle' data property
      },
    };

    return [
      edgeSelector,
      roundImg,
      wideImg,
      extra_info,
      low_opacity,
      hidden,
      auto_rotate,
      or_node,
      marked_node,
      unmarked_node,
      available_to_mark,
      ...or_classes,
      not_edge,
    ];
  }

  calculateStyle(): Array<cytoscape.Stylesheet> {
    let nodeStyles = this.calculateNodeStyles();
    let edgeStyles = this.calculateEdgeStyles();

    return [...nodeStyles, ...edgeStyles];
  }
}

export function buildGraph(): cytoscape.Core {
  graph = new Graph(graph_content);

  let cy = cytoscape({
    container: document.getElementById("cy"),
    elements: graph.calculateElements(),
    style: graph.calculateStyle(),
    layout: {
      name: "klay",
      // @ts-ignore
      nodeDimensionsIncludeLabels: true,
    },
  });

  cy.nodes().on("click", (e: EventObject) => clickOnNode(e.target.id()));

  return cy;
}

function fitScreenToAllElements(cy: cytoscape.Core) {
  // @ts-ignore
  cy.animate({ fit: { eles: cy.$(""), padding: 20, animate: true } });
}

function resetAnimation(cy: cytoscape.Core, isPreviousPathChecked: boolean) {
  if (isPreviousPathChecked) {
    cy.remove(cy.elements());
    cy.add(graph.elements);
    cy.layout({
      name: "klay",
      // @ts-ignore
      nodeDimensionsIncludeLabels: true,
      fit: true,
    }).run();
  } else {
    cy.$(".low-opacity").removeClass("low-opacity");
  }
  fitScreenToAllElements(cy);
}

function caseInsensitiveNodeFilter(queryText: string) {
  return function (ele: any) {
    return ele
      .data("name")
      .toLowerCase()
      .replace("\n", " ")
      .includes(queryText);
  };
}

export function zoomInOnNode(
  cy: cytoscape.Core,
  queryText: string,
  isPreviousPathChecked: boolean,
  progressionChecked: boolean,
) {
  if (queryText.length < 3) {
    resetAnimation(cy, isPreviousPathChecked);
    console.log("Query text smaller than 3 chars");
    return;
  }

  if (queryText[0] === '"' && queryText[queryText.length - 1] === '"') {
    var eles = cy.$(`#${queryText.substring(1, queryText.length - 1)}`);
  } else {
    if (isPreviousPathChecked) {
      console.log("Is this run?");
      cy.remove(cy.elements());
      cy.add(graph.elements);
    }
    eles = cy
      .nodes()
      .filter(caseInsensitiveNodeFilter(queryText.toLowerCase()));
  }

  if (eles.length == 0) {
    resetAnimation(cy, isPreviousPathChecked);
    console.log("No node found");
    return;
  }

  let padding = eles.length > 1 ? 0 : 300;

  if (isPreviousPathChecked) {
    if (eles.length > 0) {
      let pathEles = eles.predecessors().union(eles);
      cy.remove(cy.elements());
      cy.add(pathEles);
    } else {
      let pathEles = eles.predecessors().union(eles);
      cy.remove(cy.elements());
      cy.add(pathEles);
      let paths = searchPaths(cy, eles[0]);
      let final_path = cy.collection();
      paths.forEach((path) => {
        final_path = final_path.union(path[0]);
      });

      cy.remove(cy.elements());
      cy.add(final_path);
    }

    var layout = cy.layout({
      name: "klay",
      // @ts-ignore
      nodeDimensionsIncludeLabels: true,
      fit: true,
    });

    layout.run();
    fitScreenToAllElements(cy);
  } else {
    cy.animate({
      fit: {
        eles: eles,
        padding: padding,
      },
      duration: 500,
      easing: "ease-out",
    });

    if (!progressionChecked) {
      cy.elements().addClass("low-opacity");

      // searched nodes
      let selected = eles;

      // edges connected to which of the selected nodes
      eles.forEach((ele) => {
        selected = selected.union(`edge[source="${ele.id()}"]`);
        selected = selected.union(`edge[target="${ele.id()}"]`);
      });

      selected.removeClass("low-opacity");
    }
  }
}

// function printjson(eles: any) {
//   //@ts-ignore
//   eles.forEach((arg) => {
//     console.log(` - ${arg.id()}`);
//   });
// }

// const findAllPaths = (
//   cy: cytoscape.Core,
//   startingNode: NodeSingular,
//   orNodes: NodeCollection,
// ): Array<Collection> => {
//   const f = (
//     node: NodeSingular,
//     orNodes: NodeCollection,
//     level: number,
//   ): Array<Collection> => {
//     console.log(`f(${node.id()})`);
//     // console.log("OR NODES");
//     // printjson(orNodes);

//     let incomerEdges = node.incomers("edge");

//     let extraPaths: Array<Collection> = [];
//     let path = cy.collection();

//     for (let i = 0; i < incomerEdges.length; i++) {
//       let edge = incomerEdges[i];
//       // console.log("- Edge", edge.id());

//       let incomerNode = edge.source();
//       // console.log("- Node", incomerNode.id());

//       // console.log("PATH before loop");
//       // printjson(path);
//       if (orNodes.contains(incomerNode)) {
//         // console.log("OR NODE!");
//         extraPaths = [...extraPaths, ...f2(incomerNode, orNodes, level + 1)];
//       } else {
//         // console.log("INCOMER NODE: ", incomerNode.id());
//         // printjson(path);
//         if (!path.contains(incomerNode)) {
//           path = path.union(f(incomerNode, orNodes, level + 1));
//         }
//         path = path.union(incomerNode).union(edge);
//         // .union(f(incomerNode, orNodes));
//       }
//       // console.log("PATH after loop");
//       // printjson(path);
//     }

//     if (extraPaths.length === 0) {
//       return [path];
//     }

//     let returnPaths = Array(extraPaths.length);

//     extraPaths.forEach((extra_path, i) => {
//       returnPaths[i] = path.union(extra_path);
//     });

//     return returnPaths;
//   };

//   const f2 = (currentOrNode, orNodes, level): Array<Collection> => {
//     return [cy.collection()];
//   };

//   return f(startingNode, orNodes, 0);
//   // let paths: Array<Array<NodeSingular>> = [];
//   // // Recursive depth-first search
//   // function dfs(currentNode: NodeSingular, path: Array<NodeSingular>) {
//   //   else if (orNodes.contains(currentNode)) {
//   //     paths.push(path.slice()); // Found a path, add it to the list of paths
//   //     return;
//   //   }
//   //   else {
//   //   }
//   //   currentNode.incomers("node").forEach((neighbor: NodeSingular) => {
//   //     if (!path.includes(neighbor)) {
//   //       // Check if the neighbor node is not already in the current path
//   //       path.push(neighbor);
//   //       return dfs(neighbor, path);
//   //       path.pop(); // Backtrack
//   //     }
//   //   });
//   // }
//   // // Start the DFS from the source node
//   // dfs(target, [target]);
//   // return paths;
// };
