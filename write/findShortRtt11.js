/*
 * 有很多ip地址, 如何最快的找出RTT最短的ip 地址
 * 假设最大并发送为10
 *  {param} ipList - ip地址列表
 *  {param} parallel - 最大并发数
 *  {return} string - rtt最短的ip地址
 */
// const controller = new AbortController();
// const signal = controller.signal;
// 切片分租
function chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) => {
        return arr.slice(index * size, (index + 1) * size);
    })
}

async function race(ips, result) {
    const controller = new AbortController();
    const signal = controller.signal;

    const timePromise = new Promise((resolve) => {
        const time = setTimeout(() => {
            controller.abort();
            resolve(null);
        }, result.rtt);
    })

    // 为每个IP创建测量rtt的promise
    const rttPromises = ips.map(ip => {
        const start = Date.now();
        return new Promise(resolve => {
            fetch(`http:${ip}ping`, { signal, method: 'GET'}).then(() => {
                const rtt = Date.now() - start;
                resolve({ rtt, ip });
            }).catch(() => {
                resolve(null);
            })
        })
    })

    await timePromise;

    const completedResults = await Promise.all(rttPromises);
    const validResults = completedResults.filter(v => v !== null);

    if (validResults.length === 0) return null;

    // 返回rtt最小的
    return validResults.reduce((a, b) => a.rtt < b.rtt ? a : b);
}

async function findShortRttOptimizedV2(ipList, parallel = 10) {
    // 第一步 分片
    const chunks = chunk(ipList, parallel);
    // 定义返回值
    const result = { ip: '', rtt: Number.MAX_SAFE_INTEGER };
    for (const chunk of chunks) {
        const temp = await race(chunk, result);
    }
    // 返回最短ip
    return result.ip;
}

/**
 * 控制最大并发数为10，单个IP完成即更新RTT，最快找到最短RTT的IP
 * @param {string[]} ipList - 待检测IP列表
 * @param {number} [parallel=10] - 最大并发数
 * @param {number} [timeout=5000] - 单个IP超时时间（毫秒）
 * @returns {Promise<string | null>} RTT最短的IP，无有效IP返回null
 */
async function findShortRtt(ipList, parallel = 10, timeout = 5000) {
    // 边界处理
    if (!ipList || ipList.length === 0) return null;
    if (parallel < 1) parallel = 1;

    // 全局状态：最优结果 + 请求终止控制器
    let bestResult = { rtt: Infinity, ip: null };
    const controller = new AbortController();
    const signal = controller.signal;

    // 1. 测量单个IP的RTT（核心函数）
    const measureIp = async (ip) => {
        if (signal.aborted) return; // 已终止则直接退出

        const start = Date.now();
        try {
            // 轻量HEAD请求，禁用缓存，保证RTT真实
            const response = await Promise.race([
                fetch(`http://${ip}/ping`, {
                    signal,
                    method: 'HEAD',
                    cache: 'no-cache'
                }),
                // 单个IP超时控制
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('TIMEOUT')), timeout)
                )
            ]);

            // 仅当请求成功且未被终止时，计算并更新RTT
            if (response.ok && !signal.aborted) {
                const rtt = Date.now() - start;
                // 🔥 关键：单个IP完成就立即更新最优结果
                if (rtt < bestResult.rtt) {
                    bestResult = { rtt, ip };
                    console.log(`实时更新最优IP：${ip}，RTT：${rtt}ms`);
                }
            }
        } catch (err) {
            // 超时/请求失败/被终止，不处理（忽略该IP）
            return;
        }
    };

    // 2. 并发池控制：最多同时运行parallel个请求，单个完成即补位
    const ipQueue = [...ipList]; // 待检测IP队列
    let activeCount = 0; // 当前活跃请求数

    // 递归执行：不断从队列取IP，直到队列为空且无活跃请求
    const run = async () => {
        // 终止条件：队列空 + 无活跃请求
        if (ipQueue.length === 0 && activeCount === 0) return;
        // 并发数满了，等待10ms再重试
        if (activeCount >= parallel) {
            await new Promise(resolve => setTimeout(resolve, 10));
            return run();
        }

        // 从队列取一个IP执行
        const ip = ipQueue.shift();
        if (!ip) return run(); // 队列空了，递归检查剩余活跃请求

        activeCount++;
        // 执行单个IP检测，完成后活跃数-1，再递归补位
        await measureIp(ip).finally(() => {
            activeCount--;
            run(); // 补位：完成一个就再取一个执行
        });
    };

    // 3. 启动并发池，同时设置整体超时（可选）
    await Promise.race([
        run(), // 核心并发逻辑
        // 整体超时：避免无限等待（比如所有IP都超时）
        new Promise(resolve =>
            setTimeout(() => {
                controller.abort(); // 终止所有未完成请求
                resolve();
            }, timeout * 2)
        )
    ]);

    // 4. 返回结果：如果有有效IP则返回，否则返回null
    return bestResult.ip !== null ? bestResult.ip : null;
}

// 测试示例
(async () => {
    const testIps = [
        '192.168.1.1', '192.168.1.2', '8.8.8.8', '1.1.1.1',
        '10.0.0.1', '10.0.0.2', '223.5.5.5', '223.6.6.6',
        '180.76.76.76', '9.9.9.9', '208.67.222.222'
    ];
    const fastestIp = await findShortRtt(testIps, 10);
    console.log('最终RTT最短的IP：', fastestIp);
})();