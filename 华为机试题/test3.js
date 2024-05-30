const list = [  
    { id: 1, name: '节点1', parentId: null },  
    { id: 2, name: '节点2', parentId: 1 },  
    { id: 3, name: '节点3', parentId: 1 },  
    { id: 4, name: '节点4', parentId: 2 },  
    { id: 5, name: '节点5', parentId: 4 },  
];

function listToTreeWithMap(items) {
  const nodeMap = new Map(
    items.map((item) => [item.id, { ...item, children: [] }])
  );
  const rootNodes = [];

  items.forEach((item) => {
    const currentNode = nodeMap.get(item.id);
    if (item.parentId === null) {
      rootNodes.push(currentNode);
    } else {
      const parentNode = nodeMap.get(item.parentId);
      if (parentNode) {
        parentNode.children.push(currentNode);
      }
    }
  });

  return rootNodes;
}

// 调用函数
const tree = listToTreeWithMap(list);
console.log(tree);

