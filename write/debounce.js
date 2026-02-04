/*
 * @Date: 2026-01-15 16:39:33
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-02-03 14:22:17
 * @FilePath: \leetcode-study\write\debounce.js
 */
// 支持立即执行的防抖

function debounce(fn, delay, immediate = false) {
  // 参数类型检查
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    throw new TypeError('Expected delay to be a non-negative number');
  }
  
  let timer = null;
  
  return function(...args) {
    const context = this;
    
    // 如果是立即执行模式且当前没有计时器，立即执行函数
    const shouldCallNow = immediate && !timer;
    
    // 清除之前的计时器并重新设置
    clearTimeout(timer);
    
    // 设置新的计时器
    timer = setTimeout(() => {
      timer = null;
      // 如果不是立即执行模式，在延迟后执行函数
      if (!immediate) {
        fn.apply(context, args);
      }
    }, delay);
    
    // 如果需要立即执行
    if (shouldCallNow) {
      fn.apply(context, args);
    }
  };
}

// 使用示例
// 立即执行版本
const debouncedSubmit = debounce(function(data) {
  console.log('提交:', data);
}, 1000, true);