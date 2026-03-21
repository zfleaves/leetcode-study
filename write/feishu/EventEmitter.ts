// 事件监听器函数类型
type EventListener = (...args: any[]) => void;

// 事件映射类型
type EventMap = Record<string, EventListener[]>;

class EventEmitter {
    private events: EventMap = {};

    on(eventName: string, callback: EventListener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
        return this;
    }

    off(eventName: string, callback?: EventListener) {
        if (!this.events[eventName]) return this;
        if (!callback) {
            delete this.events[eventName];
        } else {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
        return this;
    }

    emit(eventName: string, ...args: any[]) {
        if (!this.events[eventName]) return this;
        this.events[eventName].forEach(cb => {
            cb.apply(this, args);
        })
        return this;
    }

    once(eventName: string, callback: EventListener) {
        const onceCallback = (...args: any[]) => {
            callback.apply(this, args);
            this.off(eventName, onceCallback);
        }
        this.on(eventName, onceCallback);
        return this;
    }
}

// 使用示例
const emitter = new EventEmitter();

export default EventEmitter;