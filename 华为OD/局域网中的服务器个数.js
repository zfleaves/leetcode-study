/*
 * @Date: 2024-06-02 19:01:21
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 19:01:27
 * @FilePath: \leetcode-study\华为OD\局域网中的服务器个数.js
 */
function largestSubnetwork(grid) {
    if (!grid || !grid.length || !grid[0].length) return 0;

    const n = grid.length;
    const m = grid[0].length;
    let maxServers = 0;
    const visited = new Array(n).fill(null).map(() => new Array(m).fill(false));

    // 深度优先搜索  
    function dfs(row, col) {
        if (
            row < 0 ||
            row >= n ||
            col < 0 ||
            col >= m ||
            grid[row][col] === 0 ||
            visited[row][col]
        ) {
            return 0;
        }

        visited[row][col] = true;
        let servers = 1;

        // 检查上、下、左、右的服务器  
        servers += dfs(row - 1, col); // 上  
        servers += dfs(row + 1, col); // 下  
        servers += dfs(row, col - 1); // 左  
        servers += dfs(row, col + 1); // 右  

        return servers;
    }

    // 遍历整个网格  
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (grid[i][j] === 1 && !visited[i][j]) {
                maxServers = Math.max(maxServers, dfs(i, j));
            }
        }
    }

    return maxServers;
}

// 示例用法  
const grid = [
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1],
];

console.log(largestSubnetwork(grid)); // 输出应为 4，因为最大的局域网包含 4 台服务器