f
// 2. 二叉树层序遍历 / 锯齿遍历
function levelOrder(root) {
    if (!root) return [];
    let quene = [root];
    let res = [];
    while (quene.length) {
        const len = quene.length;
        const level = [];
        
        for (let i = 0; i < len; i++) {
            const node = quene.shift();
            level.push(node.val);
            node.left && quene.push(node.left);
            node.right && quene.push(node.right);
        }
        res.push(level);
    }
    return res;
}