class RequestPool {
    constructor(concurrencyLimit = 5) {
        this.concurrencyLimit = concurrencyLimit;
        this.queue = [];
        this.activeCount = 0;
        this.results = [];  // 存储所有请求结果
        this.errors = [];   // 存储所有错误
    }

    // 添加单个请求到队列
    add(requestFn) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                requestFn,
                resolve,
                reject
            });
            this._executeNext();
        });
    }

    // 批量添加请求
    addAll(requestFns) {
        return Promise.all(requestFns.map(fn => this.add(fn)));
    }

    // 执行下一个请求
    async _executeNext() {
        // 检查是否达到并发限制或队列为空
        if (this.activeCount >= this.concurrencyLimit || this.queue.length === 0) {
            return;
        }

        const task = this.queue.shift();
        this.activeCount++;

        try {
            const result = await task.requestFn();
            task.resolve(result);
        } catch (error) {
            task.reject(error);
        } finally {
            this.activeCount--;
            this._executeNext();  // 尝试执行下一个请求
        }
    }

    // 等待所有请求完成（类似Promise.all但可控制并发）
    async all(requestFns) {
        const promises = requestFns.map(fn => this.add(fn));

        try {
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            // 可以在这里添加错误处理逻辑
            throw error;
        }
    }

    // 获取当前状态
    getStatus() {
        return {
            active: this.activeCount,
            queued: this.queue.length,
            concurrencyLimit: this.concurrencyLimit
        };
    }

    // 清空队列
    clearQueue() {
        this.queue.length = 0;
    }

    // 等待所有活跃请求完成
    async drain() {
        return new Promise((resolve) => {
            const check = () => {
                if (this.activeCount === 0 && this.queue.length === 0) {
                    resolve();
                } else {
                    setTimeout(check, 10);
                }
            };
            check();
        });
    }
}

// 使用示例
async function example() {
    const pool = new RequestPool(3); // 最大并发3个请求

    // 创建一些模拟的异步请求
    const createRequest = (id, delay, shouldFail = false) => async () => {
        console.log(`Request ${id} started`);
        await new Promise(resolve => setTimeout(resolve, delay));

        if (shouldFail) {
            throw new Error(`Request ${id} failed`);
        }
        console.log(`Request ${id} completed`);
        return `Result ${id}`;
    };

    const requests = [
        createRequest(1, 1000),
        createRequest(2, 500),
        createRequest(3, 800),
        createRequest(4, 300),
        createRequest(5, 700, true), // 这个会失败
        createRequest(6, 400)
    ];

    try {
        console.log('开始批量处理请求...');
        console.log('当前状态:', pool.getStatus());

        const results = await pool.all(requests);
        console.log('所有请求完成:', results);

    } catch (error) {
        console.error('请求过程中出错:', error.message);
    } finally {
        console.log('最终状态:', pool.getStatus());
    }
}

// 运行示例
example();