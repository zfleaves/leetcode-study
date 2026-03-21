// 假设数据格式：{ id, parentId, name }
const data = [
    { id: 1, parentId: null, name: 'Root' },
    { id: 2, parentId: 1, name: 'Child 1' },
    { id: 3, parentId: 1, name: 'Child 2' },
    { id: 4, parentId: 2, name: 'Grandchild 1' },
    { id: 5, parentId: 2, name: 'Grandchild 2' },
    { id: 6, parentId: 3, name: 'Grandchild 3' },
];


function arrayToTree(arr) {
    const result = [];
    const itemMap = {};

    for (const item of arr) {
        itemMap[item.id] = { ...item, children: [] }
    }

    for (const item of arr) {
        const { id, parentId } = item;
        const treeItem = itemMap[id];
        if (parentId === null || parentId === 0) {
            result.push(treeItem);
        } else {
            // 子节点
            if (itemMap[parentId]) {
                itemMap[parentId].children.push(treeItem);
            }
        }
    }

    return result;
}

// 测试
const tree = arrayToTree(data);
console.log(JSON.stringify(tree, null, 2));