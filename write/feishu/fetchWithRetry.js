/*
 * @Date: 2026-02-26 21:48:14
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-26 21:54:55
 * @FilePath: \leetcode-study\write\feishu\fetchWithRetry.js
 */
// 实现一个请求函数：fetchWithRetry，要求会最多自动重试 3 次，任意一次成功就直接返回
// 更完善的版本，支持自定义重试条件
/**
 * 带高级重试机制的 fetch 封装
 * @param {string} url - 请求地址
 * @param {RequestInit} options - fetch 原生配置（支持 AbortSignal）
 * @param {Object} retryConfig - 重试配置
 * @param {number} [retryConfig.maxRetries=3] - 最大重试次数
 * @param {number} [retryConfig.retryDelay=1000] - 基础重试延迟（ms），开启指数退避后会按倍数递增
 * @returns {Promise<Response>} - fetch 响应对象
 */
async function fetchWithRetryAdvanced(
    url,
    options = {},
    { maxRetries = 3, retryDelay = 1000 } = {}
) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;

        } catch (error) {
            lastError = error;
            console.log(`Attempt ${i + 1} failed:`, error.message, new Date().getTime());

            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }

    throw lastError;
}

// 使用示例
async function testAdvanced() {
    try {
        const response = await fetchWithRetryAdvanced(
            'https://api.example.com/data',
            {},
            {
                maxRetries: 5,
                retryDelay: 2000
            }
        );
        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('All retries failed:', error.message);
    }
}

testAdvanced();