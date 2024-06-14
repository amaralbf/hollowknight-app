import cytoscape, { type Collection, type NodeSingular } from 'cytoscape';

export const searchPaths = (cy: cytoscape.Core, targetNode: NodeSingular) => {
  const visitedEdges: Array<NodeSingular> = [];
  let orNodes: Set<NodeSingular> = new Set();
  const level = 1;
  const paths: Array<Array<Collection>> = [
    [targetNode.union(visit(cy, targetNode, orNodes, visitedEdges, level))],
  ];

  const orNodeOrder = ['target'];

  while (orNodes.size > 0) {
    console.log('Starting search for new paths from orNodes:');
    let orNodesStr = '{';
    for (const orNode of orNodes) {
      const orTarget = orNode.outgoers('node')[0].id();
      orNodesStr += `or_node->${orTarget},`;
    }
    orNodesStr += '}';
    console.log(orNodesStr);
    const newOrNodes: Set<NodeSingular> = new Set();

    for (const node of orNodes) {
      console.log(`Visiting orNode: ${node.id()} (${node.outgoers('edge')[0].id()})`);
      orNodeOrder.push(node.outgoers('edge')[0].id());
      const orPaths = visitOrNode(cy, node, newOrNodes, visitedEdges, level + 1);
      paths.push(orPaths);
    }
    orNodes = newOrNodes;
  }

  console.log('orNodeOrder', orNodeOrder);
  return paths;
};

const visit = (
  cy: cytoscape.Core,
  node: NodeSingular,
  orNodes: Set<NodeSingular>,
  visitedEdges: Array<NodeSingular>,
  level: number,
): Collection => {
  let orNodesStr = '{';
  for (const orNode of orNodes) {
    orNodesStr += `${orNode.id()},`;
  }
  orNodesStr += '}';
  console.log('    '.repeat(level) + `visit(cy, ${node.id()}, ${orNodesStr})`);

  let path = cy.collection();
  const edges = node.incomers('edge');

  edges.forEach((edge) => {
    const incomingNode = edge.source();

    if (visitedEdges.indexOf(edge) == -1) {
      visitedEdges.push(edge);
      if (isOrNode(incomingNode)) {
        orNodes.add(incomingNode);
      } else {
        path = path.union(edge).union(incomingNode);
        path = path.union(visit(cy, incomingNode, orNodes, visitedEdges, level + 1));
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
  const paths: Array<Collection> = [];
  const edges = node.incomers('edge');

  edges.forEach((edge) => {
    const incomingNode = edge.source();

    if (visitedEdges.indexOf(edge) == -1) {
      visitedEdges.push(edge);
      const orOutgoingEdge = node.outgoers('edge')[0];
      const path = node
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
  return node.id().startsWith('or_node_');
};
