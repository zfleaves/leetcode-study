/*
 * @Date: 2026-02-26 20:49:44
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-26 20:54:10
 * @FilePath: \leetcode-study\write\feishu\防抖和节流.js
 */
function debounce(fn, delay, immediate = false) {
    // 参数类型检查
    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }

    if (typeof delay !== 'number' || delay < 0) {
        throw new TypeError('Expected delay to be a non-negative number');
    }

    let timer = null;

    return function (...args) {
        let context = this;

        const shouldCallNow = immediate && !timer;

        clearTimeout(timer);

        timer = setTimeout(() => {
            if (!immediate) {
                fn.apply(context, args);
            }
        }, delay)

        if (shouldCallNow) {
            fn.apply(context, args);
        }
    }
}

function throttled(fn, delay) {
    let start = Date.now();
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        let context = this;
        let cur = Date.now();
        let remain = delay - (cur - start);
        if (remain > 0) {
            timer = setTimeout(() => {
                fn.apply(context, args);
            }, remain)
        } else {
            fn.apply(context, args);
            start = Date.now();
        }
    }
}