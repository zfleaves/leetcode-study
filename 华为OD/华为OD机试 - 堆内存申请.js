/*
 * @Date: 2024-06-02 18:53:13
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:55:48
 * @FilePath: \leetcode-study\华为OD\华为OD机试 - 堆内存申请.js
 */
class HeapMemoryManager {  
    constructor(maxSize) {  
        this.maxSize = maxSize; // 堆内存的最大大小  
        this.heap = new Array(maxSize).fill(0); // 堆内存，初始化为全0表示空闲  
        this.allocated = []; // 已分配内存的列表，格式为 [{start: number, end: number}]  
    }  
  
    // 申请内存  
    allocate(size) {  
        if (size > this.maxSize) {  
            return -1; // 申请大小超过堆内存大小，返回失败  
        }  
  
        let start = -1; // 分配的起始位置  
        let end = -1; // 分配的结束位置  
  
        // 查找第一个足够大的空闲空间  
        for (let i = 0; i < this.maxSize; i++) {  
            if (this.heap[i] === 0) { // 当前位置空闲  
                if (start === -1) { // 记录起始位置  
                    start = i;  
                }  
                end = i; // 更新结束位置  
  
                // 如果当前空闲空间足够大，则分配并返回  
                if (end - start + 1 >= size) {  
                    break;  
                }  
            } else {  
                // 遇到已分配的内存，重置起始位置搜索  
                if (start !== -1) {  
                    start = -1;  
                    end = -1;  
                }  
            }  
        }  
  
        // 没有找到足够的空闲空间  
        if (start === -1 || end - start + 1 < size) {  
            return -1; // 返回失败  
        }  
  
        // 分配内存并更新堆状态  
        for (let i = start; i <= end; i++) {  
            this.heap[i] = 1; // 标记为已分配  
        }  
  
        // 记录已分配的内存块  
        this.allocated.push({ start, end: end + 1 }); // 结束位置是独占的，所以加1  
  
        // 返回分配的内存块的起始偏移  
        return start;  
    }  
  
    // 示例用法  
    static demo() {  
        const heapManager = new HeapMemoryManager(100); // 创建一个100字节的堆内存管理器  
        console.log(heapManager.allocate(1)); // 申请1字节，期望输出类似0的起始位置  
        console.log(heapManager.allocate(2)); // 申请2字节，期望输出紧接着的空闲位置的起始位置  
        // ... 可以继续添加其他申请和验证逻辑  
    }  
}  
  
// 调用示例用法  
HeapMemoryManager.demo();