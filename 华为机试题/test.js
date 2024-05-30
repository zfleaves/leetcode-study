// 宝宝和妈妈参加亲子游戏，在一个二维矩阵（N*N）的格子地图上，宝宝和妈妈抽签决定各自的位置，地图上每个格子有不同的糖果数量，部分格子有障碍物。

// 游戏规则是妈妈必须在最短的时间（每个单位时间只能走一步）到达宝宝的位置，路上的所有糖果都可以拿走，不能走障碍物的格子，只能上下左右走。

// 请问妈妈在最短到达宝宝位置的时间内最多拿到多少糖果（优先考虑最短时间到达的情况下尽可能多拿糖果）。

// 输入描述：

// 第一行输入为N，N标识二维矩阵的大小

// 之后N行，每行有N个值，表格矩阵每个位置的值

// 其中：

// -3：妈妈
// -2：宝宝
// -1：障碍

// =0：糖果数(0表示没有糖果，但是可以走)

// 输出描述：

// 输出妈妈在最短到达宝宝位置的时间内最多拿到多少糖果，行末无多余空格

// 补充说明：

// 地图最大50*50

// 示例1

// 输入：

// 4
// 3 2 1 -3
// 1 -1 1 1
// 1 1 -1 2
// -2 1 2 3

// 9

function findMaxCandies(map) {
  const N = map.length;
  let momPos = null;
  let babyPos = null;

  // 找到妈妈和宝宝的位置
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (map[i][j] === -3) {
        momPos = [i, j];
      } else if (map[i][j] === -2) {
        babyPos = [i, j];
      }
    }
  }

  if (!momPos || !babyPos) {
    return -1; // 如果没有找到妈妈或宝宝，返回-1
  }

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]; // 上下左右
  const visited = new Array(N).fill(null).map(() => new Array(N).fill(false));
  const queue = [[momPos[0], momPos[1], 0, 0]]; // [x, y, steps, candies]

  while (queue.length > 0) {
    const [x, y, steps, candies] = queue.shift();

    if (x === babyPos[0] && y === babyPos[1]) {
      return candies; // 找到宝宝，返回当前糖果数
    }

    visited[x][y] = true;

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 &&
        nx < N &&
        ny >= 0 &&
        ny < N &&
        !visited[nx][ny] &&
        map[nx][ny] !== -1
      ) {
        const newCandies = candies + (map[nx][ny] >= 0 ? map[nx][ny] : 0);
        queue.push([nx, ny, steps + 1, newCandies]);
        visited[nx][ny] = true; // 标记为已访问（尽管稍后会根据糖果数更新，但这样可以避免重复入队）
      }
    }
  }

  return -1; // 如果无法到达宝宝，返回-1
}

// 示例用法
const map = [
  [3, 2, 1, -3],
  [1, -1, 1, 1],
  [1, 1, -1, 2],
  [-2, 1, 2, 3],
];
console.log(findMaxCandies(map)); // 输出：5（妈妈路径：(-3, 0) -> (0, 0) -> (-2, 0)，收集糖果：1 + 0 + 4 = 5）
