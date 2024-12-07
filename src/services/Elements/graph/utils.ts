import cytoscape from 'cytoscape';

export const print = (
  elements: cytoscape.Collection | cytoscape.NodeCollection,
  property: string,
) => {
  elements.forEach((e) => {
    console.log(e.data()[property]);
  });
};
