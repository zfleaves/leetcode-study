/*
 * @Date: 2026-01-15 16:31:31
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-15 16:36:41
 * @FilePath: \leetcode-study\write\LRUCache.js
 */
// 3. 实现一个 LRU 缓存

class LRUCache {
    constructor(capacity, tti) {
        this.cache = new Map();
        this.capacity = capacity;
        this.tti = tti;
    }

    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        const item = this.cache.get(key);
        // 检查是否过期
        if (Date.now() - item.timestamp  > this.tti) {
            this.cache.delete(key);
            return -1;
        }
        this.cache.delete(key);
        // 重新插入, 更新时间
        this.cache.set(key, {...item, timestamp: Date.now()});
        return item.value;
        
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size === this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
        this.cache.set(key, {value, timestamp: Date.now()});
    }

    // 清理过期项
    cleanExpired() {
        const now = Date.now();
        for (const [key, item] of this.cache) {
            if (now - item.timestamp > this.tti) {
                this.cache.delete(key);
            }
        }
    }
}