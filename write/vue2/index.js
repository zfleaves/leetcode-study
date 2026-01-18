import { callHook } from './mountComponent';
import {
    isPlainObject,
    isReserved,
    hasOwn,
    def,
    noop,
    isObject,
    shouldObserve,
    isServerRendering,
    isArray,
    toggleObserving,
    VNode
} from './tool';
import { observe } from './Observer';

/**
 * Vue 构造函数
 * Vue 2.x 的核心构造函数，用于创建 Vue 实例
 *
 * @param {Object} options - Vue 实例的配置选项
 */
function Vue(options) {
  // 安全检查：不能直接调用 Vue，必须通过 new
  if (!(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }

  // 初始化实例
  this._init(options);
}

// 在原型上挂载 _init 方法
initMixin(Vue);

/**
 * initMixin - 初始化混入
 * 在 Vue 原型上添加 _init 方法
 *
 * @param {Function} Vue - Vue 构造函数
 */
function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;

    // 保存 options
    // 合并构造函数的选项和实例的选项
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    );

    // 初始化生命周期
    initLifecycle(vm);

    // 初始化事件
    initEvents(vm);

    // 初始化渲染
    initRender(vm);

    // 调用 beforeCreate 钩子
    // 此时：data、methods、computed、watch 等都还未初始化
    callHook(vm, 'beforeCreate');

    // 初始化注入（provide/inject）
    initInjections(vm);

    // 初始化状态
    // 🔴 关键步骤：将 data 转换为响应式对象
    initState(vm);

    // 初始化提供（provide/inject）
    initProvide(vm);

    // 调用 created 钩子
    // 此时：data、methods、computed、watch 等都已初始化完成，但 DOM 还未创建
    callHook(vm, 'created');

    // 如果有 el 选项，自动挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

/**
 * initLifecycle - 初始化生命周期
 *
 * @param {Vue} vm - Vue 实例
 */
function initLifecycle(vm) {
  const options = vm.$options;

  // 定位第一个非抽象父组件
  // 抽象组件不会渲染到 DOM 中（如 keep-alive、transition）
  let parent = options.parent;

  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  // 设置父组件引用
  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  // 设置子组件引用
  vm.$children = [];

  // 设置其他属性
  vm.$refs = {}; // ref 引用
  vm._watcher = null; // 渲染 Watcher
  vm._inactive = null; // 是否非激活状态
  vm._directInactive = false; // 是否直接非激活
  vm._isMounted = false; // 是否已挂载
  vm._isDestroyed = false; // 是否已销毁
  vm._isBeingDestroyed = false; // 是否正在销毁
}

/**
 * initEvents - 初始化事件
 * @param {Vue} vm - Vue 实例
 */
function initEvents(vm) {
  // 处理父组件传递的事件监听器
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

/**
 * initRender - 初始化渲染
 * @param {Vue} vm - Vue 实例
 */
function initRender(vm) {
  // 定义 $options._parentVnode
  vm._vnode = null;

  // 定义 $slots、$scopedSlots
  const options = vm.$options;
  const parentVnode = options._parentVnode;
  vm.$slots = resolveSlots(options._renderChildren, parentVnode);
  vm.$scopedSlots = Object.create(null);

  // 定义 _c（createElement 的别名）
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);

  // 定义 $createElement（用户使用的 createElement）
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
}

/**
 * initInjections - 初始化注入
 * @param {Vue} vm - Vue 实例
 */
function initInjections(vm) {
  const result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(key => {
      defineReactive(vm, key, result[key]);
    });
    toggleObserving(true);
  }
}

/**
 * initState - 初始化状态
 * 🔴 关键函数：初始化 data、props、methods、computed、watch
 *
 * @param {Vue} vm - Vue 实例
 */
function initState(vm) {
  vm._watchers = []; // 存储所有 Watcher
  const opts = vm.$options;

  // 初始化 props
  if (opts.props) initProps(vm, opts.props);

  // 初始化 methods
  if (opts.methods) initMethods(vm, opts.methods);

  // 初始化 data
  if (opts.data) {
    initData(vm);
  } else {
    // 如果没有 data，创建空对象并观察
    observe(vm._data = {}, true /* asRootData */);
  }

  // 初始化 computed
  if (opts.computed) initComputed(vm, opts.computed);

  // 初始化 watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

/**
 * initData - 初始化 data
 * 🔴 关键函数：将 data 转换为响应式对象
 *
 * @param {Vue} vm - Vue 实例
 */
function initData(vm) {
  let data = vm.$options.data;

  // 如果 data 是函数，执行它获取数据对象
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};

  // 验证 data 是否是纯对象
  if (!isPlainObject(data)) {
    data = {};
    warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }

  // 代理 data 到实例上
  // 这样可以通过 vm.message 访问 vm._data.message
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;

  while (i--) {
    const key = keys[i];

    // 检查是否与 props 或 methods 冲突
    if (props && hasOwn(props, key)) {
      warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      );
    } else if (methods && hasOwn(methods, key)) {
      warn(
        `Method "${key}" has already been defined as a data property.`,
        vm
      );
    } else if (!isReserved(key)) {
      // 代理到实例（非保留字）
      proxy(vm, '_data', key);
    }
  }

  // 🔴 观察数据，创建响应式
  // 这是响应式系统的入口
  observe(data, true /* asRootData */);
}

/**
 * proxy - 代理数据到实例
 * 通过 Object.defineProperty 将 vm._data[key] 代理到 vm[key]
 *
 * @param {Object} target - 目标对象（Vue 实例）
 * @param {String} sourceKey - 源对象键名（'_data'）
 * @param {String} key - 属性键名
 */
function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };

  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

// 共享属性定义（用于 proxy）
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

/**
 * initProps - 初始化 props
 * @param {Vue} vm - Vue 实例
 * @param {Object} propsOptions - props 配置
 */
function initProps(vm, propsOptions) {
  const propsData = vm.$options.propsData || {};
  const props = vm._props = {};

  // 代理 props 到实例
  const keys = vm.$options.propKeys = [];
  const isRoot = !vm.$parent;

  // 非根组件的 props 不需要响应式
  if (!isRoot) {
    toggleObserving(false);
  }

  for (const key in propsOptions) {
    keys.push(key);
    const value = validateProp(key, propsOptions, propsData, vm);
    defineReactive(props, key, value);
    if (!(key in vm)) {
      proxy(vm, '_props', key);
    }
  }

  toggleObserving(true);
}

/**
 * initMethods - 初始化 methods
 * @param {Vue} vm - Vue 实例
 * @param {Object} methods - methods 配置
 */
function initMethods(vm, methods) {
  const props = vm.$options.props;
  for (const key in methods) {
    if (methods[key] == null) {
      warn(
        `Method "${key}" has an undefined value in the component definition. ` +
        `Did you reference the function correctly?`,
        vm
      );
    }
    if (props && hasOwn(props, key)) {
      warn(
        `Method "${key}" has already been defined as a prop.`,
        vm
      );
    }
    if ((key in vm) && isReserved(key)) {
      warn(
        `Method "${key}" conflicts with an existing Vue instance method. ` +
        `Avoid defining component methods that start with _ or $.`
      );
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

/**
 * initComputed - 初始化 computed
 * @param {Vue} vm - Vue 实例
 * @param {Object} computed - computed 配置
 */
function initComputed(vm, computed) {
  const watchers = vm._computedWatchers = Object.create(null);
  const isSSR = isServerRendering();

  for (const key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === 'function' ? userDef : userDef.get;

    if (getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      );
    }

    if (!isSSR) {
      // 创建计算属性的 Watcher（lazy: true）
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        { lazy: true }
      );
    }

    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      warn(
        `Computed property "${key}" is already defined in data.`,
        vm
      );
    }
  }
}

/**
 * initWatch - 初始化 watch
 * @param {Vue} vm - Vue 实例
 * @param {Object} watch - watch 配置
 */
function initWatch(vm, watch) {
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

/**
 * createWatcher - 创建侦听器
 * @param {Vue} vm - Vue 实例
 * @param {String|Function} expOrFn - 表达式或函数
 * @param {Object|Function|String} handler - 处理函数
 * @param {Object} options - 选项
 */
function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}

/**
 * initProvide - 初始化 provide
 * @param {Vue} vm - Vue 实例
 */
function initProvide(vm) {
  const provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

/**
 * getData - 获取 data 数据
 * @param {Function} dataFn - data 函数
 * @param {Vue} vm - Vue 实例
 * @returns {Object} - 数据对象
 */
function getData(dataFn, vm) {
  pushTarget();
  try {
    return dataFn.call(vm, vm);
  } catch (e) {
    handleError(e, vm, "data()");
    return {};
  } finally {
    popTarget();
  }
}

/**
 * defineComputed - 定义计算属性
 * @param {Vue} vm - Vue 实例
 * @param {String} key - 属性名
 * @param {Object|Function} userDef - 用户定义
 */
function defineComputed(vm, key, userDef) {
  const shouldCache = !isServerRendering();

  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }

  Object.defineProperty(vm, key, sharedPropertyDefinition);
}

/**
 * createComputedGetter - 创建计算属性的 getter
 * @param {String} key - 属性名
 * @returns {Function} - getter 函数
 */
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}

/**
 * createGetterInvoker - 创建 getter 调用器
 * @param {Function} fn - 函数
 * @returns {Function} - getter 函数
 */
function createGetterInvoker(fn) {
  return function getterInvoker() {
    return fn.call(this, this);
  };
}

/**
 * createElement - 创建虚拟节点
 * @param {Vue} vm - Vue 实例
 * @param {String|Object|Function} tag - 标签
 * @param {Object} data - 数据
 * @param {Array|String|Number} children - 子节点
 * @param {String|Number} normalizationType - 规范化类型
 * @param {Boolean} alwaysNormalize - 是否总是规范化
 * @returns {VNode} - 虚拟节点
 */
function createElement(vm, tag, data, children, normalizationType, alwaysNormalize) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(vm, tag, data, children, normalizationType);
}

/**
 * _createElement - 内部创建虚拟节点
 * @param {Vue} vm - Vue 实例
 * @param {String|Object|Function} tag - 标签
 * @param {Object} data - 数据
 * @param {Array|String|Number} children - 子节点
 * @param {String|Number} normalizationType - 规范化类型
 * @returns {VNode} - 虚拟节点
 */
function _createElement(vm, tag, data, children, normalizationType) {
  if (isDef(data) && isDef(data.__ob__)) {
    warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      vm
    );
    return createEmptyVNode();
  }

  // 处理组件
  if (isDef(tag) && isDef(tag.componentOptions)) {
    return createComponent(tag, data, children, vm);
  }

  // 规范化子节点
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }

  let vnode, ns;
  if (typeof tag === 'string') {
    // 处理普通标签
    let Ctor;
    ns = (config.getTagNamespace(tag) || getTagNamespace(tag));
    if (config.isReservedTag(tag)) {
      // 平台保留标签
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, vm
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(vm.$options, 'components', tag))) {
      // 组件
      vnode = createComponent(Ctor, data, children, vm);
    } else {
      // 未知标签
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, vm
      );
    }
  } else {
    // 组件构造函数
    vnode = createComponent(tag, data, children, vm);
  }

  if (Array.isArray(vnode)) {
    return vnode;
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns);
    if (isDef(data)) registerDeepBindings(data);
    return vnode;
  } else {
    return createEmptyVNode();
  }
}

/**
 * Vue.prototype.$mount - 挂载方法
 * @param {String|HTMLElement} el - 挂载元素
 * @param {Boolean} hydrating - 是否是服务端渲染的激活
 * @returns {Vue} - Vue 实例
 */
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};

/**
 * Vue.prototype.$watch - 侦听数据变化
 * @param {String|Function} expOrFn - 表达式或函数
 * @param {Function} cb - 回调函数
 * @param {Object} options - 选项
 * @returns {Function} - 取消侦听的函数
 */
Vue.prototype.$watch = function (expOrFn, cb, options) {
  const vm = this;
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options);
  }
  options = options || {};
  options.user = true;
  const watcher = new Watcher(vm, expOrFn, cb, options);
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value);
    } catch (error) {
      handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`);
    }
  }
  return function unwatchFn() {
    watcher.teardown();
  };
};

/**
 * Vue.prototype._update - 更新 DOM
 * @param {VNode} vnode - 虚拟节点
 * @param {Boolean} hydrating - 是否是服务端渲染的激活
 */
Vue.prototype._update = function (vnode, hydrating) {
  const vm = this;
  const prevVnode = vm._vnode;
  vm._vnode = vnode;

  if (!prevVnode) {
    // 初次渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
  } else {
    // 更新渲染
    vm.$el = vm.__patch__(prevVnode, vnode);
  }

  // 更新 __vue__ 引用
  if (vm.$el) {
    vm.$el.__vue__ = vm;
  }
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el;
  }
};

/**
 * Vue.prototype._render - 执行渲染函数
 * @returns {VNode} - 虚拟节点
 */
Vue.prototype._render = function () {
  const vm = this;
  const { render, _parentVnode } = vm.$options;

  if (_parentVnode) {
    vm.$scopedSlots = normalizeScopedSlots(
      _parentVnode.data.scopedSlots,
      vm.$slots,
      vm.$scopedSlots
    );
  }

  vm.$vnode = _parentVnode;

  let vnode;
  try {
    // 执行渲染函数
    currentRenderingInstance = vm;
    vnode = render.call(vm._renderProxy, vm.$createElement);
  } catch (e) {
    handleError(e, vm, `render`);
    vnode = createEmptyVNode();
  } finally {
    currentRenderingInstance = null;
  }

  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0];
  }

  return vnode;
};

// 辅助函数
function isTrue(v) {
  return v === true;
}

function isDef(v) {
  return v !== undefined && v !== null;
}

function isPrimitive(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  );
}

function warn(msg, vm) {
  console.warn(`[Vue warn]: ${msg}`, vm);
}

function handleError(err, vm, info) {
  console.error(`[Vue error]: ${info}`, err, vm);
}

function mergeOptions(parent, child, vm) {
  const options = {};
  // 简化的选项合并逻辑
  Object.keys(parent).forEach(key => {
    mergeField(key);
  });
  Object.keys(child).forEach(key => {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  });

  function mergeField(key) {
    const strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}

function resolveConstructorOptions(Ctor) {
  let options = Ctor.options;
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super);
    if (superOptions !== Ctor.superOptions) {
      Ctor.superOptions = superOptions;
      const modifiedOptions = resolveModifiedOptions(Ctor);
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
    }
  }
  return options;
}

function resolveModifiedOptions(Ctor) {
  let modified;
  const latest = Ctor.options;
  const extended = Ctor.extendOptions;
  const sealed = Ctor.sealedOptions;
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {};
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified;
}

function dedupe(latest, extended, sealed) {
  if (Array.isArray(latest)) {
    const res = [];
    sealed = Array.isArray(sealed) ? sealed : [];
    extended = Array.isArray(extended) ? extended : [];
    for (let i = 0; i < latest.length; i++) {
      if (extended.indexOf(latest[i]) >= 0) {
        if (sealed.indexOf(latest[i]) < 0) {
          res.push(latest[i]);
        }
      } else if (sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res;
  } else {
    return latest;
  }
}

function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}

const strats = {};

function defaultStrat(parent, child) {
  return child === undefined ? parent : child;
}

function query(el) {
  if (typeof el === 'string') {
    const selected = document.querySelector(el);
    if (!selected) {
      return document.createElement('div');
    }
    return selected;
  } else {
    return el;
  }
}

function updateComponentListeners(vm, listeners) {
  // 简化的事件更新逻辑
}

function resolveSlots(children, context) {
  // 简化的插槽解析逻辑
  return {};
}

function normalizeScopedSlots(slots, normalSlots, instances) {
  // 简化的作用域插槽解析逻辑
  return {};
}

function resolveAsset(options, type, id) {
  // 简化的资源解析逻辑
  return undefined;
}

function createComponent(Ctor, data, children, vm) {
  // 简化的组件创建逻辑
  return undefined;
}

function createEmptyVNode() {
  const node = new VNode();
  node.isComment = true;
  node.text = ' ';
  return node;
}

function normalizeChildren(children) {
  // 简化的子节点规范化逻辑
  return [];
}

function simpleNormalizeChildren(children) {
  // 简化的子节点规范化逻辑
  return [];
}

function applyNS(vnode, ns) {
  // 简化的命名空间应用逻辑
}

function registerDeepBindings(data) {
  // 简化的深度绑定注册逻辑
}

function validateProp(key, propsOptions, propsData, vm) {
  // 简化的 prop 验证逻辑
  return undefined;
}

function bind(fn, ctx) {
  return function boundFn(a) {
    const l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx);
  };
}

function resolveInject(inject, vm) {
  // 简化的注入解析逻辑
  return {};
}

function getTagNamespace(tag) {
  // 简化的标签命名空间获取逻辑
  return undefined;
}

function defineReactive(obj, key, val, customSetter, shallow) {
  // 在 Observer.js 中定义
}

const nativeWatch = ({}).watch;
let currentRenderingInstance = null;

// 1. 创建 Vue 实例
const vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue'
  },
  template: '<div>{{ message }}</div>'
});

export default Vue;