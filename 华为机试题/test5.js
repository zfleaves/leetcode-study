function searchTreeWithParents(tree, searchMethod, path = []) {
  let result = [];

  // 递归搜索函数
  function traverse(node, currentPath) {
    // 将当前节点添加到路径中
    currentPath.push(node);

    // 如果当前节点匹配搜索条件
    if (searchMethod(node)) {
      // 复制当前路径并添加到结果中
      result.push(currentPath.slice());
    }

    // 遍历子节点
    if (node.children && node.children.length > 0) {
      node.children.forEach((childNode) => {
        traverse(childNode, currentPath);
      });
    }

    // 回溯时移除当前节点
    console.log("currentPath: ", JSON.parse(JSON.stringify(currentPath)));
    currentPath.pop();
  }

  // 对树的每个根节点调用遍历函数
  tree.forEach((rootNode) => {
    traverse(rootNode, path);
  });

  return result;
}

// 示例树形结构
const tree = [
  {
    id: 1,
    name: "节点1",
    children: [
      { id: 2, name: "节点2", children: [] },
      {
        id: 3,
        name: "节点3",
        children: [
          { id: 4, name: "节点4", children: [
            {
                id: 6, name: "节点6", children: []
            }
          ] },
          { id: 5, name: "节点5", children: [
            // {
            //     id: 7, name: "节点7", children: []
            // }
          ] },
        ],
      },
    ],
  },
  // ... 可能还有其他根节点
];

// 示例搜索方法：查找id为4的节点
const searchById = (node) => node.id >= 6;

// 调用搜索函数
const searchResults = searchTreeWithParents(tree, searchById);
console.log('searchResults: ', searchResults);

// 打印结果，每个数组都包含一个匹配的节点及其所有父级节点
searchResults.forEach((path) => {
  console.log(path.map((node) => node.name).join(" -> "));
});
