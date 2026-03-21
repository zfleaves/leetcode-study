/*
 * @Date: 2026-01-13 21:31:11
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-02-27 00:00:00
 * @FilePath: \leetcode-study\write\EventEmitter.ts
 */

// 事件监听器函数类型
type EventListener = (...args: any[]) => void;

// 事件映射类型
type EventMap = Record<string, EventListener[]>;

// 实现一个泛型 EventEmitter
class EventEmitter {
  private events: EventMap = {};

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param callback 回调函数
   * @returns 返回 this 以支持链式调用
   */
  on(eventName: string, callback: EventListener): this {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return this;
  }

  /**
   * 取消订阅事件
   * @param eventName 事件名称
   * @param callback 回调函数（可选，如果不传则删除该事件的所有监听器）
   * @returns 返回 this 以支持链式调用
   */
  off(eventName: string, callback?: EventListener): this {
    if (!this.events[eventName]) {
      return this;
    }

    if (!callback) {
      delete this.events[eventName];
    } else {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }
    return this;
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 传递给回调函数的参数
   * @returns 返回 this 以支持链式调用
   */
  emit(eventName: string, ...args: any[]): this {
    if (!this.events[eventName]) {
      return this;
    }
    this.events[eventName].forEach(cb => {
      cb.apply(this, args);
    });
    return this;
  }

  /**
   * 订阅一次性事件（触发一次后自动取消订阅）
   * @param eventName 事件名称
   * @param callback 回调函数
   * @returns 返回 this 以支持链式调用
   */
  once(eventName: string, callback: EventListener): this {
    const onceCallback: EventListener = (...args) => {
      callback.apply(this, args);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
    return this;
  }
}

// 使用示例
const emitter = new EventEmitter();

// 监听 data 事件
emitter.on('data', (data: string) => {
  console.log('Received:', data);
});

// 触发 data 事件
emitter.emit('data', 'Hello'); // "Received: Hello"

// 取消订阅
emitter.off('data');

// 再次触发，不会输出
emitter.emit('data', 'World');

// 使用 once 监听一次性事件
emitter.once('once-event', (msg: string) => {
  console.log('Once event:', msg);
});

emitter.emit('once-event', 'First time'); // "Once event: First time"
emitter.emit('once-event', 'Second time'); // 不会输出

export default EventEmitter;