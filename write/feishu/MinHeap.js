/**
 * 小顶堆类（核心工具）
 */
class MinHeap {
    constructor(size) {
        this.heap = []; // 存储堆元素
        this.maxSize = size; // 堆的最大容量（1000）
    }

    // 获取父节点索引
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    // 获取左子节点索引
    getLeftChildIndex(i) {
        return 2 * i + 1;
    }

    // 获取右子节点索引
    getRightChildIndex(i) {
        return 2 * i + 2;
    }

    // 交换两个节点
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // 向上调整堆（插入元素时）
    shiftUp(index) {
        if (index === 0) return; // 根节点无需调整
        const parentIndex = this.getParentIndex(index);
        // 若当前节点小于父节点（小顶堆特性），则交换
        if (this.heap[parentIndex] > this.heap[index]) {
            this.swap(parentIndex, index);
            this.shiftUp(parentIndex); // 递归调整父节点
        }
    }

    // 向下调整堆（替换堆顶时）
    shiftDown(index) {
        const leftIndex = this.getLeftChildIndex(index);
        const rightIndex = this.getRightChildIndex(index);
        let smallest = index;

        // 找到当前节点、左子、右子中最小的那个
        if (leftIndex < this.heap.length && this.heap[leftIndex] < this.heap[smallest]) {
            smallest = leftIndex;
        }
        if (rightIndex < this.heap.length && this.heap[rightIndex] < this.heap[smallest]) {
            smallest = rightIndex;
        }

        // 若最小节点不是当前节点，交换并递归调整
        if (smallest !== index) {
            this.swap(index, smallest);
            this.shiftDown(smallest);
        }
    }

    // 插入元素
    insert(value) {
        // 堆未满时，直接插入并调整
        if (this.heap.length < this.maxSize) {
            this.heap.push(value);
            this.shiftUp(this.heap.length - 1);
        } else {
            // 堆已满，若当前值大于堆顶，则替换堆顶并调整
            if (value > this.heap[0]) {
                this.heap[0] = value;
                this.shiftDown(0);
            }
        }
    }

    // 获取堆内所有元素
    getHeap() {
        return this.heap;
    }
}

/**
 * 核心函数：从海量数据中找出最大的k个元素
 * @param {number[]} arr - 原始数组（100万个数字）
 * @param {number} k - 要找的最大元素个数（1000）
 * @returns {number[]} 最大的k个元素
 */
function findTopK(arr, k) {
    if (arr.length <= k) return arr.sort((a, b) => b - a); // 边界：数组长度≤k时直接排序

    const minHeap = new MinHeap(k);

    // 遍历所有数字，插入堆中
    for (const num of arr) {
        minHeap.insert(num);
    }

    // 获取堆内元素并按从大到小排序（可选，堆内默认是小顶堆顺序）
    return minHeap.getHeap().sort((a, b) => b - a);
}

// ---------------- 测试用例 ----------------
// 生成100万个随机数（模拟原始数据）
function generateRandomArray(length, min = 0, max = 1000000) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
}

// 执行测试
const bigArray = generateRandomArray(1000000); // 100万个随机数
const top1000 = findTopK(bigArray, 1000); // 找最大的1000个

console.log("最大的1000个数字（前10个示例）：", top1000.slice(0, 10));
// console.log("验证：最大的数字是", Math.max(...bigArray), "，结果中是否包含：", top1000.includes(Math.max(...bigArray)));