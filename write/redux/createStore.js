/**
 * createStore - 创建 Redux store
 * 
 * Redux 的核心方法，用于创建一个状态管理容器。
 * Store 是整个应用的状态管理中心，它包含：
 * - 应用状态（state）
 * - 状态更新逻辑（reducer）
 * - 状态订阅机制（listeners）
 * 
 * @param {Function} reducer - 纯函数，接收当前状态和 action，返回新状态
 * @param {*} [preloadedState] - 可选，初始状态
 * @param {Function} [enhancer] - 可选，store 增强器（如 applyMiddleware）
 * @returns {Object} store 对象，包含 dispatch、subscribe、getState、replaceReducer 等方法
 */
function createStore(reducer, preloadedState, enhancer) {
    // ========================================
    // 1. 参数处理和增强器支持
    // ========================================
    
    // 如果第二个参数是函数且第三个参数未定义，说明用户使用了简写形式
    // 即 createStore(reducer, enhancer)，需要调整参数位置
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
    }

    // 如果有 enhancer，使用 enhancer 创建增强版的 store
    // enhancer 是一个高阶函数，接收 createStore 并返回增强后的 createStore
    // 典型用法：applyMiddleware(middleware1, middleware2)(createStore)(reducer)
    if (typeof enhancer === 'function') {
        return enhancer(createStore)(reducer, preloadedState);
    }

    // ========================================
    // 2. 内部状态变量
    // ========================================
    
    /**
     * 当前使用的 reducer
     * 可以通过 replaceReducer 方法动态替换
     */
    let currentReducer = reducer;
    
    /**
     * 当前的应用状态
     * 只能通过 dispatch action 来修改，不允许直接赋值
     */
    let currentState = preloadedState;
    
    /**
     * 当前正在使用的监听器数组
     * 这个数组在 dispatch 过程中会被遍历执行
     */
    let currentListeners = [];
    
    /**
     * 下一次 dispatch 时要使用的监听器数组
     * 使用两个数组是为了在 dispatch 过程中安全地添加/删除监听器
     * 
     * 工作原理：
     * - 当需要添加/删除监听器时，操作 nextListeners
     * - dispatch 时，将 nextListeners 赋值给 currentListeners
     * - 这样可以避免在遍历监听器时修改数组导致的并发问题
     */
    let nextListeners = currentListeners;
    
    /**
     * 是否正在执行 dispatch
     * 用于防止以下情况：
     * 1. 在 reducer 中调用 dispatch（防止无限递归）
     * 2. 在 getState/subscribe/unsubscribe 时执行（确保数据一致性）
     */
    let isDispatching = false;

    // ========================================
    // 3. 辅助函数
    // ========================================
    
    /**
     * 确保 nextListeners 与 currentListeners 是不同的引用
     * 
     * 当需要修改监听器数组时，首先检查是否需要创建副本
     * 这样可以确保：
     * - 正在执行的 dispatch 不会受到影响
     * - 多个订阅/取消订阅操作不会互相干扰
     */
    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            // 创建数组副本，避免修改原数组
            nextListeners = currentListeners.slice();
        }
    }

    // ========================================
    // 4. Store 核心方法
    // ========================================
    
    /**
     * getState - 获取当前状态
     * 
     * 返回 store 中保存的当前状态树
     * 
     * 注意事项：
     * - 不能在 reducer 中调用（会抛出异常）
     * - 返回的状态引用应该被视为只读的
     * - 不要修改返回的状态对象，这会导致不可预测的行为
     * 
     * @returns {*} 当前状态
     */
    function getState() {
        // 防止在 reducer 执行期间获取状态
        // 这是为了避免状态不一致的问题
        if (isDispatching) {
            throw new Error('Cannot get state while dispatching');
        }
        return currentState;
    }

    /**
     * subscribe - 订阅状态变化
     * 
     * 注册一个监听器，当状态发生变化时会被调用
     * 
     * 工作流程：
     * 1. 验证 listener 是否为函数
     * 2. 将 listener 添加到监听器列表
     * 3. 返回取消订阅函数
     * 
     * 注意事项：
     * - 不能在 reducer 中调用（会抛出异常）
     * - 监听器在每次 dispatch 后都会被调用，即使状态没有改变
     * - 返回的取消订阅函数应该被保存，以便在不需要时取消订阅
     * 
     * @param {Function} listener - 状态变化时的回调函数
     * @returns {Function} 取消订阅函数
     */
    function subscribe(listener) {
        // 验证 listener 必须是函数
        if (typeof listener !== 'function') {
            throw new Error('Expected the listener to be a function');
        }

        // 防止在 reducer 执行期间订阅
        if (isDispatching) {
            throw new Error('Cannot subscribe while dispatching');
        }

        // 标记是否已订阅，用于防止重复取消订阅
        let isSubscribed = true;

        // 确保可以安全地修改监听器数组
        ensureCanMutateNextListeners();
        nextListeners.push(listener);

        // 返回取消订阅函数
        return function unsubscribe() {
            // 如果已经取消订阅，直接返回
            if (!isSubscribed) {
                return;
            }

            // 防止在 reducer 执行期间取消订阅
            if (isDispatching) {
                throw new Error('Cannot unsubscribe while dispatching');
            }

            // 标记为已取消订阅
            isSubscribed = false;

            // 从监听器数组中移除
            ensureCanMutateNextListeners();
            const index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
            // 清空 currentListeners 引用，下次 dispatch 时会使用新的 nextListeners
            currentListeners = null;
        };
    }

    /**
     * dispatch - 分发 action
     * 
     * Redux 中唯一修改状态的方法
     * 
     * 工作流程：
     * 1. 验证 action 是否为纯对象
     * 2. 验证 action 是否有 type 属性
     * 3. 检查是否在 reducer 中调用（防止无限递归）
     * 4. 调用 reducer 更新状态
     * 5. 通知所有监听器
     * 6. 返回 action
     * 
     * 注意事项：
     * - action 必须是纯对象（不能是 Promise、函数等）
     * - action 必须有 type 属性
     * - 在 reducer 中不能调用 dispatch
     * - 所有监听器都会被调用，即使状态没有改变
     * 
     * @param {Object} action - 描述状态变更的对象，必须有 type 属性
     * @returns {Object} 传入的 action 对象
     */
    function dispatch(action) {
        // 验证 action 必须是纯对象
        // 不能是数组、null、undefined、Promise 等
        if (!isPlainObject(action)) {
            throw new Error('Actions must be plain objects');
        }

        // 验证 action 必须有 type 属性
        if (typeof action.type === 'undefined') {
            throw new Error('Actions may not have an undefined "type" property');
        }

        // 防止在 reducer 中调用 dispatch
        // 这会导致无限递归：dispatch -> reducer -> dispatch -> reducer -> ...
        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions');
        }

        try {
            // 标记正在执行 dispatch
            isDispatching = true;
            // 调用 reducer 更新状态
            // reducer 是一个纯函数，根据当前 state 和 action 返回新的 state
            currentState = currentReducer(currentState, action);
        } finally {
            // 无论成功或失败，都要重置标记
            isDispatching = false;
        }

        // 更新监听器数组引用
        // 这样可以确保所有监听器使用的是最新的监听器列表
        const listeners = (currentListeners = nextListeners);
        
        // 遍历并调用所有监听器
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }

        // 返回 action，方便链式调用和调试
        return action;
    }

    /**
     * replaceReducer - 替换 reducer
     * 
     * 动态替换 store 的 reducer
     * 
     * 使用场景：
     * - 代码分割（code splitting）：按需加载 reducer
     * - 热更新（hot reloading）：开发环境中替换 reducer
     * - 动态模块：运行时添加新的状态模块
     * 
     * 工作原理：
     * 1. 替换当前 reducer
     * 2. 使用初始化 action 重新计算状态
     * 3. 返回 store 对象（方法链式调用）
     * 
     * @param {Function} nextReducer - 新的 reducer 函数
     * @returns {Object} store 对象
     */
    function replaceReducer(nextReducer) {
        // 替换当前 reducer
        currentReducer = nextReducer;
        
        // 使用初始化 action 重新计算状态
        // 这确保了新 reducer 能够正确处理现有状态
        dispatch({ type: '@@redux/INIT' });
        
        // 返回 store，支持链式调用
        return store;
    }

    // ========================================
    // 5. 初始化
    // ========================================
    
    // 使用初始化 action 初始化状态
    // 这个 action 会被所有 reducer 接收，用于设置初始状态
    // reducer 可以通过识别这个 action 来返回初始状态
    dispatch({ type: '@@redux/INIT' });

    // ========================================
    // 6. 创建并返回 store 对象
    // ========================================
    
    const store = {
        // 分发 action，更新状态
        dispatch: dispatch,
        
        // 订阅状态变化
        subscribe,
        
        // 获取当前状态
        getState,
        
        // 替换 reducer
        replaceReducer,
        
        // 支持 RxJS/Observable（如果实现了 observable 协议）
        [$$observable]: observable,
    };

    return store;
}
