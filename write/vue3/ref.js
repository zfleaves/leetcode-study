/*
 * @Date: 2026-01-18 13:28:03
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-18 14:12:13
 * @FilePath: \leetcode-study\write\vue3\ref.js
 */

import {
    isRef,
    hasChanged,
    toReactive,
    toRaw,
} from './tool.js';
// 1. ref - 基本类型响应式

let shouldTrack = true;
let activeEffect;

function ref(value) {
    return createRef(value, false);
}

function createRef(value, shallow) {
    // 如果已经是 ref，直接返回
    if (isRef(value)) {
        return value;
    }
    return new RefImpl(value, shallow);
}

class RefImpl {
    constructor(value, shallow) {
        this.__v_isShallow = __v_isShallow;
        this.deep = undefined;
        this.__v_isRef = true;
        this._rawValue = __v_isShallow ? value : toRaw(value); // 原始值
        this._value = __v_isShallow ? value : toReactive(value); // 响应式值
    }

    get value() {
        // 依赖收集
        trackRefValue(this);
        return this._value;
    }

    set value(newVal) {
        // 浅比较
        newVal = this.__v_isShallow ? newVal : toRaw(newVal);
        // 值未变化，直接返回
        if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal;
            // 响应式值更新
            this._value = this.__v_isShallow ? newVal : toReactive(newVal);
            // 触发更新
            triggerRefValue(this);
        }
    }
}

// 依赖收集
function trackRefValue(ref) {
    if (shouldTrack && activeEffect) {
        ref = toRaw(ref);

        // 如果没有 dep，创建 dep
        if (!ref.dep) {
            ref.dep = createDep();
        }

        // 收集依赖
        trackEffects(ref.dep);
    }
}

// 触发更新
function triggerRefValue(ref) {
  ref = toRaw(ref);
  
  if (ref.dep) {
    triggerEffects(ref.dep);
  }
}

export {
    ref
};