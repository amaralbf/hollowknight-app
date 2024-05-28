import cytoscape, { Collection, NodeSingular } from "cytoscape";

export const searchPaths = (cy: cytoscape.Core, targetNode: NodeSingular) => {
  let visitedEdges: Array<NodeSingular> = [];
  let orNodes: Set<NodeSingular> = new Set();
  let level = 1;
  let paths: Array<Array<Collection>> = [
    [targetNode.union(visit(cy, targetNode, orNodes, visitedEdges, level))],
  ];

  let orNodeOrder = ["target"];

  while (orNodes.size > 0) {
    console.log("Starting search for new paths from orNodes:");
    let orNodesStr = "{";
    for (let orNode of orNodes) {
      let orTarget = orNode.outgoers("node")[0].id();
      orNodesStr += `or_node->${orTarget},`;
    }
    orNodesStr += "}";
    console.log(orNodesStr);
    let newOrNodes: Set<NodeSingular> = new Set();

    for (const node of orNodes) {
      console.log(
        `Visiting orNode: ${node.id()} (${node.outgoers("edge")[0].id()})`,
      );
      orNodeOrder.push(node.outgoers("edge")[0].id());
      let orPaths = visitOrNode(cy, node, newOrNodes, visitedEdges, level + 1);
      paths.push(orPaths);
    }
    orNodes = newOrNodes;
  }

  console.log("orNodeOrder", orNodeOrder);
  return paths;
};

const visit = (
  cy: cytoscape.Core,
  node: NodeSingular,
  orNodes: Set<NodeSingular>,
  visitedEdges: Array<NodeSingular>,
  level: number,
): Collection => {
  let orNodesStr = "{";
  for (let orNode of orNodes) {
    orNodesStr += `${orNode.id()},`;
  }
  orNodesStr += "}";
  console.log("    ".repeat(level) + `visit(cy, ${node.id()}, ${orNodesStr})`);

  let path = cy.collection();
  let edges = node.incomers("edge");

  edges.forEach((edge) => {
    let incomingNode = edge.source();

    if (visitedEdges.indexOf(edge) == -1) {
      visitedEdges.push(edge);
      if (isOrNode(incomingNode)) {
        orNodes.add(incomingNode);
      } else {
        path = path.union(edge).union(incomingNode);
        path = path.union(
          visit(cy, incomingNode, orNodes, visitedEdges, level + 1),
        );
      }
    }
  });

  return path;
};

const visitOrNode = (
  cy: cytoscape.Core,
  node: NodeSingular,
  orNodes: Set<NodeSingular>,
  visitedEdges: Array<NodeSingular>,
  level: number,
) => {
  let paths: Array<Collection> = [];
  let edges = node.incomers("edge");

  edges.forEach((edge) => {
    let incomingNode = edge.source();

    if (visitedEdges.indexOf(edge) == -1) {
      visitedEdges.push(edge);
      let orOutgoingEdge = node.outgoers("edge")[0];
      let path = node
        .union(edge)
        .union(incomingNode)
        .union(orOutgoingEdge)
        .union(visit(cy, incomingNode, orNodes, visitedEdges, level + 1));
      paths.push(path);
    }
  });

  return paths;
};

const isOrNode = (node: NodeSingular): boolean => {
  return node.id().startsWith("or_node_");
};
