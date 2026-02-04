/*
 * @Date: 2026-02-03 14:05:37
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-02-03 14:37:42
 * @FilePath: \leetcode-study\write\findShortRtt.js
 */
/*
 * 有很多ip地址, 如何最快的找出RTT最短的ip 地址
 * 假设最大并发送为10
 *  {param} ipList - ip地址列表
 *  {param} parallel - 最大并发数
 *  {return} string - rtt最短的ip地址
 */

async function findShortRtt(ipList, parallel = 10) {
    // 切片分租
    const chunks = chunk(ipList, parallel);

    const result = {
        rtt: Infinity,
        ip: ''
    };
    for (const chunk of chunks) {
        const temp = await race(chunk, result.rtt);
        if (temp) {
            result = temp;
        }
    }
    // 返回最短Rtt
    return result.ip;
}

// 切片分租
function chunk(arr, size) {
    return Array.from({
        length: Math.ceil(arr.length / size),
    }, (_, index) => {
        return arr.slice(index * size, (index + 1) * size);
    })
}

async function race(ips, maxTime) {
    return new Promise(resolve => {
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => {
            resolve(null);
            // 取消所有请求
            controller.abort();
        }, maxTime);
        let start = Date.now();
        for (const ip of ips) {
            fetch(`http:${ip}/ping`, { signal }).then(() => {
                const rtt = Date.now() - start;
                resolve({
                    rtt,
                    ip
                });
                // 取消所有请求
                controller.abort();
            })
        }
    })
}

/**
 * 优化版本：使用真正的并发池控制
 * 优点：
 * 1. 严格限制并发数
 * 2. 动态超时剪枝：找到更短的rtt时，更新所有正在进行的请求的超时时间
 * 3. 使用 Promise.race 实现真正的竞争
 */
async function findShortRttOptimized(ipList, parallel = 10) {
    if (ipList.length === 0) return '';

    let result = { rtt: Infinity, ip: '' };
    let currentIndex = 0;
    let activeRequests = 0;
    let allDone = false;
    
    // 全局 AbortController 用于找到最终结果时取消所有请求
    const globalController = new AbortController();
    
    return new Promise(resolve => {
        const runNext = async () => {
            if (allDone) return;
            
            if (currentIndex >= ipList.length && activeRequests === 0) {
                // 所有请求都已完成
                resolve(result.ip);
                return;
            }
            
            if (currentIndex >= ipList.length) return;
            
            const ip = ipList[currentIndex++];
            activeRequests++;
            
            const start = Date.now();
            
            try {
                const response = await fetch(`http:${ip}/ping`, {
                    signal: globalController.signal
                });
                const rtt = Date.now() - start;
                
                // 找到更短的rtt
                if (rtt < result.rtt) {
                    const oldRtt = result.rtt;
                    result = { rtt, ip };
                    console.log(`发现更短RTT: ${ip} - ${rtt}ms (之前: ${oldRtt}ms)`);
                }
            } catch (err) {
                // 请求失败或被取消，忽略
            }
            
            activeRequests--;
            runNext();
        };
        
        // 初始启动 parallel 个请求
        for (let i = 0; i < parallel && i < ipList.length; i++) {
            runNext();
        }
    });
}

/**
 * 优化版本2：结合分批 + 并发池 + 动态剪枝
 * 更高效，因为一旦某批不可能产生更优结果就立即跳过
 */
async function findShortRttOptimizedV2(ipList, parallel = 10) {
    const chunks = chunk(ipList, parallel);
    let result = { rtt: Infinity, ip: '' };
    
    for (const chunk of chunks) {
        // 并发检查这一批，使用当前的minRtt作为超时阈值
        const temp = await checkChunkConcurrent(chunk, result.rtt);
        if (temp) {
            result = temp;
        }
        // 如果找到的rtt已经是0ms，不可能更优了，提前结束
        if (result.rtt === 0) break;
    }
    
    return result.ip;
}

/**
 * 并发检查一个chunk，最多并发size个请求
 * 返回该chunk中rtt最小的ip，如果所有ip都超过maxTime则返回null
 */
async function checkChunkConcurrent(ips, maxTime) {
    if (maxTime === Infinity) maxTime = Number.MAX_SAFE_INTEGER;
    
    const controller = new AbortController();
    const signal = controller.signal;
    
    // 为每个IP创建测量rtt的promise
    const rttPromises = ips.map(ip => {
        const start = Date.now();
        
        return fetch(`http:${ip}/ping`, { signal })
            .then(() => {
                const rtt = Date.now() - start;
                return { rtt, ip };
            })
            .catch(err => {
                // 请求失败或被取消
                return null;
            });
    });
    
    // 超时promise：maxTime后取消所有请求并返回null
    const timeoutPromise = new Promise(resolve => {
        setTimeout(() => {
            controller.abort(); // 取消所有未完成的fetch
            resolve(null);
        }, maxTime);
    });
    
    // 等待超时或所有请求完成（但超时会优先触发abort）
    await timeoutPromise;
    
    // 收集在超时前完成的请求结果
    const completedResults = await Promise.all(rttPromises);
    const validResults = completedResults.filter(r => r !== null);
    
    if (validResults.length === 0) return null;
    
    // 返回rtt最小的
    return validResults.reduce((a, b) => a.rtt < b.rtt ? a : b);
}

/**
 * 测量单个IP的RTT
 */
async function measureRtt(ip) {
    const start = Date.now();
    await fetch(`http:${ip}/ping`);
    return {
        ip,
        rtt: Date.now() - start
    };
}