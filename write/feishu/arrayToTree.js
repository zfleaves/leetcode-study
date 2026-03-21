/*
 * @Date: 2026-02-26 21:43:20
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-26 21:43:25
 * @FilePath: \leetcode-study\write\feishu\arrayToTree.js
 */
// 假设数据格式：{ id, parentId, name }
const data = [
    { id: 1, parentId: 0, name: 'Root' },
    { id: 2, parentId: 1, name: 'Child 1' },
    { id: 3, parentId: 1, name: 'Child 2' },
    { id: 4, parentId: 2, name: 'Grandchild 1' },
    { id: 5, parentId: 2, name: 'Grandchild 2' },
    { id: 6, parentId: 3, name: 'Grandchild 3' },
];

function arrayToTree(items, parentId = 0) {
    return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
            ...item,
            children: arrayToTree(items, item.id)
        }));
}

// 测试
const tree = arrayToTree(data);
console.log(JSON.stringify(tree, null, 2));

// 输出：
// [
//   {
//     "id": 1,
//     "parentId": 0,
//     "name": "Root",
//     "children": [
//       {
//         "id": 2,
//         "parentId": 1,
//         "name": "Child 1",
//         "children": [
//           { "id": 4, "parentId": 2, "name": "Grandchild 1", "children": [] },
//           { "id": 5, "parentId": 2, "name": "Grandchild 2", "children": [] }
//         ]
//       },
//       {
//         "id": 3,
//         "parentId": 1,
//         "name": "Child 2",
//         "children": [
//           { "id": 6, "parentId": 3, "name": "Grandchild 3", "children": [] }
//         ]
//       }
//     ]
//   }
// ]
