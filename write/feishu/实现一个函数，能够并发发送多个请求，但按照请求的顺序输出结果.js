/*
 * @Date: 2026-02-26 21:46:02
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-26 21:46:08
 * @FilePath: \leetcode-study\write\feishu\实现一个函数，能够并发发送多个请求，但按照请求的顺序输出结果.js
 */
class OrderedRequest {
    constructor() {
        this.queue = [];
        this.currentIndex = 0;
    }

    async add(requestFn) {
        const index = this.queue.length;
        this.queue.push(null); // 占位

        try {
            const result = await requestFn();
            this.queue[index] = { status: 'fulfilled', value: result };
        } catch (error) {
            this.queue[index] = { status: 'rejected', reason: error };
        }

        // 检查是否可以输出
        this.tryOutput();
    }

    tryOutput() {
        while (this.currentIndex < this.queue.length && this.queue[this.currentIndex] !== null) {
            const item = this.queue[this.currentIndex];

            if (item.status === 'fulfilled') {
                console.log(`Request ${this.currentIndex}:`, item.value);
            } else {
                console.error(`Request ${this.currentIndex}:`, item.reason);
            }

            this.currentIndex++;
        }
    }
}

// 使用示例
const orderedRequest = new OrderedRequest();

// 模拟请求函数
function mockRequest(id, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`Result ${id}`);
        }, delay);
    });
}

// 添加多个请求（按顺序输出，但并发执行）
orderedRequest.add(() => mockRequest(1, 1000));
orderedRequest.add(() => mockRequest(2, 500));
orderedRequest.add(() => mockRequest(3, 800));
orderedRequest.add(() => mockRequest(4, 300));
orderedRequest.add(() => mockRequest(5, 600));

// 输出顺序始终是：Result 1, Result 2, Result 3, Result 4, Result 5
// 即使请求完成的时间不同
