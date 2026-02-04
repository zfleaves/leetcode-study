/*
 * @Date: 2024-06-25 14:36:28
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-29 14:51:17
 * @FilePath: \leetcode-study\华为write\translate\arr.js
 */
function listToTree(items) {
    const nodeMap = new Map(items.map(item => [item.id, {
        ...item,
        children: []
    }]))

    const list = []
    items.forEach(item => {
        const currentNode = nodeMap.get(item.id)
        if (item.parentId === null) {
            list.push(currentNode)
        } else {
            const parentNode = nodeMap.get(item.parentId)
            parentNode && parentNode.children.push(currentNode)
        }
    });

    return list
}

const items = [{
        id: 1,
        parentId: null,
        name: '根节点'
    },
    {
        id: 2,
        parentId: 1,
        name: '子节点1'
    },
    {
        id: 3,
        parentId: 1,
        name: '子节点2'
    },
    {
        id: 4,
        parentId: 2,
        name: '孙节点'
    }
]

const tree = listToTree(items)