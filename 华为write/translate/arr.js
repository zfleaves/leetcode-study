/*
 * @Date: 2024-06-25 14:36:28
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-25 14:39:46
 * @FilePath: \leetcode-study\write\translate\arr.js
 */
function listToTree(items) {
    const nodeMap = new Map(items.map(item => [item.id, {...item, children}]))

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