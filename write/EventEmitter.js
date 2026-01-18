/*
 * @Date: 2026-01-13 21:31:11
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-15 11:30:17
 * @FilePath: \leetcode-study\write\EventEmitter.js
 */
// 实现一个 EventEmitter
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback);
    return this;
  }

  off(eventName, callback) {
    if (!this.events[eventName]) {
      return this;
    }

    if (!callback) {
      delete this.events[eventName]
    } else {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }
    return this;
  }

  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return this;
    }
    this.events[eventName].forEach(cb => {
      cb.apply(this, args)
    });
    return this;
  }

  once(eventName, callback) {
    const onceCallback = (...args) => {
      callback.apply(this, args);
      this.off(eventName, callback)
    }
    this.on(eventName, onceCallback);
    return this;
  }

}

// 使用
const emitter = new EventEmitter();

emitter.on('data', (data) => {
  console.log('Received:', data);
});

emitter.emit('data', 'Hello'); // "Received: Hello"
emitter.off('data');
emitter.emit('data', 'World'); // 不会输出