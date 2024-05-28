import cytoscape, { NodeSingular } from "cytoscape";

class Progression {
  cy: cytoscape.Core;
  status: boolean = false;
  markedNodes: Array<string>;
  COOKIE_KEY = "markedNodes";

  constructor(cy: cytoscape.Core) {
    this.cy = cy;
    this.markedNodes = [];
  }

  setMarkedNodes(nodes: Array<string>) {
    this.markedNodes = nodes;
  }

  toggleNode(nodeId: string) {
    if (!this.status) return;

    if (nodeId.startsWith("or_node_")) return;

    let nodeIndex = this.markedNodes.indexOf(nodeId);

    if (nodeIndex === -1) {
      // if node was not available for mark, return
      if (!this.cy.$(nodeId).hasClass("available-to-mark")) return;

      this.markedNodes.push(nodeId);
      this.markNode(nodeId);
    } else {
      let node = this.cy.$(nodeId);

      // if node has marked successors that are not OR nodes, return
      for (let outgoer of node.outgoers("node.marked")) {
        if (!outgoer.id().startsWith("or_node_")) {
          return;
        }
      }

      this.markedNodes.splice(nodeIndex, 1);
      this.unmarkNode(nodeId);
    }
  }

  markNode(nodeId: string) {
    let node = this.cy.$(nodeId);

    // mark node
    node.removeClass("available-to-mark unmarked").addClass("marked");

    // for each incoming edge, unmark it
    node.incomers("edge").forEach((edge) => {
      edge.addClass("unmarked");
    });

    // for each outgoing node
    node.outgoers("node").forEach((outgoer) => {
      // mark edge
      node.edgesTo(outgoer).removeClass("unmarked");

      // if is OR node
      if (outgoer.id().startsWith("or_node_")) {
        // mark OR node
        outgoer.removeClass("unmarked").addClass("marked");

        // for each OR successor
        outgoer.outgoers("edge").forEach((edge) => {
          let successor = edge.target();

          if (!successor.hasClass("marked")) {
            // mark edge
            edge.removeClass("unmarked");

            // if all incoming nodes of successor are marked
            if (
              successor.incomers("node").same(successor.incomers("node.marked"))
            ) {
              // make node available to mark
              successor.removeClass("unmarked").addClass("available-to-mark");
            }
          }
        });
      }
      // if node was unmarked, but now has all edges marked
      else if (
        outgoer.hasClass("unmarked") &&
        outgoer.incomers("node").same(outgoer.incomers("node.marked"))
      ) {
        // make node available to mark
        outgoer.removeClass("unmarked").addClass("available-to-mark");
      }
    });
  }

  unmarkNode(nodeId: string) {
    let node = this.cy.$(nodeId);

    // unmark node
    node.removeClass("marked");

    // if node has incoming edge from marked node or node is root
    if (
      node.incomers("node.marked").length > 0 ||
      this.cy.nodes().roots().contains(node)
    ) {
      // make node available to mark
      node.addClass("available-to-mark");
    } else {
      // unmark node
      node.addClass("unmarked");
    }

    // mark edges from marked nodes to this node
    node.incomers("node.marked").edgesTo(node).removeClass("unmarked");

    // for each outgoing node
    node.outgoers("node").forEach((outgoer) => {
      // unmark edge
      node.edgesTo(outgoer).addClass("unmarked");

      // case is OR node
      if (outgoer.id().startsWith("or_node_")) {
        // case OR node has no more marked incoming nodes
        if (outgoer.incomers("edge.unmarked").same(outgoer.incomers("edge"))) {
          // unmark OR node
          outgoer.removeClass("marked").addClass("unmarked");

          // unmark edge between OR node and its successor
          outgoer.outgoers("edge").addClass("unmarked");

          // if successor was available, unmark it
          outgoer
            .outgoers("node")
            .removeClass("available-to-mark")
            .addClass("unmarked");
        }
      }
      // case outgoer is not OR node and was available
      else if (outgoer.hasClass("available-to-mark")) {
        // unmark node
        outgoer.removeClass("available-to-mark").addClass("unmarked");
      }
    });
  }

  setStatus(status: boolean) {
    this.status = status;
  }

  enable() {
    this.renderProgression();
  }

  disable() {
    this.cy.elements().removeClass("unmarked marked available-to-mark");
  }

  renderProgression() {
    console.log(`Rendering progression (${this.markedNodes.length} elements)`);
    this.cy
      .elements()
      .removeClass("marked available-to-mark")
      .addClass("unmarked");

    this.markedNodes.forEach((nodeId: string) => {
      this.markNode(nodeId);
    });

    let marked = this.cy.collection();
    if (this.markedNodes.length > 0) {
      marked = this.cy.$(this.markedNodes.join(","));
    }

    let unmarkedRootNodes = this.cy.elements().roots().difference(marked);
    unmarkedRootNodes.removeClass("unmarked").addClass("available-to-mark");

    let availableToMark = this.cy.$("node.available-to-mark");

    if (availableToMark.length > 0) {
      this.cy.animate({
        fit: {
          eles: availableToMark,
          padding: 30,
        },
        duration: 500,
        easing: "ease-out",
      });
    }
  }
}

var progression: Progression;

export const initProgression = (cy: cytoscape.Core) => {
  progression = new Progression(cy);
};

export const downloadProgression = () => {
  // progression.deleteMarkedNodes();
  const jsonStr = JSON.stringify(progression.markedNodes);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create an anchor element
  const a = document.createElement("a");
  a.href = url;
  a.download = "hollow_knight_progression.json"; // Name of the file to be downloaded

  // Programmatically trigger a click on the anchor element
  a.click();

  // Clean up: remove the anchor element and revoke the object URL
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const loadProgression = (content: string | undefined) => {
  if (content !== undefined) {
    let newMarkedNodes = JSON.parse(content);
    progression.setMarkedNodes(newMarkedNodes);
  }
};

export const setProgressionStatus = (status: boolean) => {
  progression.setStatus(status);
  if (status) {
    progression.enable();
  } else {
    progression.disable();
  }
};

export const clickOnNode = (nodeId: string) => {
  progression.toggleNode(`#${nodeId}`);
};

export const toggleNextOnly = (cy: cytoscape.Core, nextOnly: boolean) => {
  if (nextOnly) {
    cy.elements().addClass("hidden");
    let available = cy.$("node.available-to-mark");

    available.union(available.incomers()).removeClass("hidden");

    available.incomers("node").forEach((node: NodeSingular) => {
      if (node.id().startsWith("or_node_")) {
        let markedIncomers = node.incomers("node.marked");
        markedIncomers.removeClass("hidden");
        markedIncomers.edgesTo(node).removeClass("hidden");
      }
    });
  } else {
    cy.elements().removeClass("hidden");
  }

  return;
};
