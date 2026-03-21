const thunkMiddleware = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState); // 传递给下一个中间件
    }
    // 否则，继续传递 action 给下一个中间件或 reducer
    return next(action);
}

// ========================================
// Redux-Saga 中间件实现
// ========================================

/**
 * createSagaMiddleware - 创建 Redux-Saga 中间件
 * 
 * Redux-Saga 是一个用于管理应用副作用的库，使用 Generator 函数
 * 与 Redux-Thunk 相比，Saga 提供了更强大的功能：
 * - 更容易测试（可以 mock 所有副作用）
 * - 更好的异步流程控制
 * - 支持并发、取消、竞态条件等复杂场景
 * - 声明式的副作用管理
 * 
 * @returns {Function} Redux 中间件
 */
function createSagaMiddleware() {
    // 存储所有的 saga 任务
    let sagaTasks = [];
    
    // 返回标准的 Redux 中间件
    return function sagaMiddleware({ dispatch, getState }) {
        // 返回 next => action 的函数
        return next => action => {
            // 正常的 action 处理流程
            const result = next(action);
            
            // 检查是否有以 SAGA_ACTION_PREFIX 开头的 action
            // 这些 action 用于启动 sagas
            if (action.type && action.type.startsWith('@@saga/')) {
                handleSagaAction(action);
            }
            
            return result;
        };
    };
    
    /**
     * 处理 saga 相关的 action
     * @param {Object} action - saga action
     */
    function handleSagaAction(action) {
        switch (action.type) {
            case '@@saga/RUN':
                // 运行一个新的 saga
                runSaga(action.saga);
                break;
            case '@@saga/CANCEL':
                // 取消指定的 saga
                cancelSaga(action.taskId);
                break;
        }
    }
    
    /**
     * 运行一个 saga
     * @param {GeneratorFunction} saga - saga generator 函数
     * @returns {Object} saga 任务对象
     */
    function runSaga(saga) {
        const gen = saga();
        const task = {
            id: Date.now(),
            generator: gen,
            isRunning: true
        };
        
        sagaTasks.push(task);
        
        // 启动 generator
        resumeGenerator(gen, task);
        
        return task;
    }
    
    /**
     * 恢复 generator 的执行
     * @param {Generator} gen - generator 对象
     * @param {Object} task - 任务对象
     * @param {*} value - 传递给 generator 的值
     */
    function resumeGenerator(gen, task, value) {
        try {
            const result = gen.next(value);
            
            if (result.done) {
                // saga 执行完成
                task.isRunning = false;
                return;
            }
            
            // 处理 yield 的值
            handleEffect(result.value, gen, task);
            
        } catch (error) {
            // 处理错误
            gen.throw(error);
            task.isRunning = false;
        }
    }
    
    /**
     * 处理 saga 的 effect
     * @param {*} effect - yield 的值
     * @param {Generator} gen - generator 对象
     * @param {Object} task - 任务对象
     */
    function handleEffect(effect, gen, task) {
        // 检查 effect 的类型并执行相应的操作
        if (effect && effect.type) {
            switch (effect.type) {
                case 'CALL':
                    // 调用函数
                    handleCall(effect, gen, task);
                    break;
                case 'PUT':
                    // dispatch action
                    handlePut(effect, gen, task);
                    break;
                case 'TAKE':
                    // 等待特定的 action
                    handleTake(effect, gen, task);
                    break;
                case 'FORK':
                    // fork 新的 saga
                    handleFork(effect, gen, task);
                    break;
                case 'CANCEL':
                    // 取消 task
                    handleCancel(effect, gen, task);
                    break;
                case 'ALL':
                    // 并行执行多个 effects
                    handleAll(effect, gen, task);
                    break;
                case 'RACE':
                    // 竞速执行多个 effects
                    handleRace(effect, gen, task);
                    break;
                default:
                    // 未知的 effect
                    resumeGenerator(gen, task, effect);
            }
        } else {
            // 不是 effect，直接返回值
            resumeGenerator(gen, task, effect);
        }
    }
    
    /**
     * 处理 CALL effect
     * 调用函数并将结果返回给 saga
     * 
     * @param {Object} effect - CALL effect
     * @param {Generator} gen - generator 对象
     * @param {Object} task - 任务对象
     */
    function handleCall(effect, gen, task) {
        const { fn, args } = effect;
        
        // 执行函数
        Promise.resolve()
            .then(() => fn.apply(null, args))
            .then(result => {
                resumeGenerator(gen, task, result);
            })
            .catch(error => {
                gen.throw(error);
            });
    }
    
    /**
     * 处理 PUT effect
     * dispatch action 到 store
     * 
     * @param {Object} effect - PUT effect
     * @param {Generator} gen - generator 对象
     * @param {Object} task - 任务对象
     */
    function handlePut(effect, gen, task) {
        const { action } = effect;
        dispatch(action);
        resumeGenerator(gen, task);
    }
    
    /**
     * 处理 TAKE effect
     * 等待特定的 action 发生
     * 
     * @param {Object} effect - TAKE effect
     * @param {Generator} gen - generator 对象
     * @param {Object} task - 任务对象
     */
    function handleTake(effect, gen, task) {
        const { pattern } = effect;
        
        // 创建一个临时的监听器
        const unsubscribe = subscribe(action => {
            if (matchPattern(pattern, action)) {
                unsubscribe();
                resumeGenerator(gen, task, action);
            }
        });
    }
    
    /**
     * 处理 FORK effect
     * fork 一个新的 saga，不阻塞当前 saga
     * 
     * @param {Object} effect - FORK effect
     * @param {Generator} gen - generator 对象
     * @param {Object} task - 任务对象
     */
    function handleFork(effect, gen, task) {
        const { saga, args } = effect;
        const newTask = runSaga(() => saga(...args));
        resumeGenerator(gen, task, newTask);
    }
    
    /**
     * 处理 CANCEL effect
     * 取消指定的任务
     * 
     * @param {Object} effect - CANCEL effect
     * @param {Generator} gen - generator 对象
     * @param {Object} task - 任务对象
     */
    function handleCancel(effect, gen, task) {
        const { taskToCancel } = effect;
        cancelSaga(taskToCancel);
        resumeGenerator(gen, task);
    }
    
    /**
     * 处理 ALL effect
     * 并行执行多个 effects，等待全部完成
     * 
     * @param {Object} effect - ALL effect
     * @param {Generator} gen - generator 对象
     * @param {Object} task - 任务对象
     */
    function handleAll(effect, gen, task) {
        const { effects } = effect;
        let completed = 0;
        const results = [];
        
        effects.forEach((eff, index) => {
            handleEffect(eff, {
                next: (value) => {
                    results[index] = value;
                    completed++;
                    if (completed === effects.length) {
                        resumeGenerator(gen, task, results);
                    }
                },
                throw: (error) => {
                    gen.throw(error);
                }
            }, task);
        });
    }
    
    /**
     * 处理 RACE effect
     * 并行执行多个 effects，返回第一个完成的结果
     * 
     * @param {Object} effect - RACE effect
     * @param {Generator} gen - generator 对象
     * @param {Object} task - 任务对象
     */
    function handleRace(effect, gen, task) {
        const { effects } = effect;
        let completed = false;
        
        Object.keys(effects).forEach(key => {
            const eff = effects[key];
            handleEffect(eff, {
                next: (value) => {
                    if (!completed) {
                        completed = true;
                        resumeGenerator(gen, task, { [key]: value });
                    }
                },
                throw: (error) => {
                    if (!completed) {
                        completed = true;
                        gen.throw(error);
                    }
                }
            }, task);
        });
    }
    
    /**
     * 取消 saga 任务
     * @param {Object} task - 要取消的任务
     */
    function cancelSaga(task) {
        if (task && task.isRunning) {
            task.isRunning = false;
            // 这里可以添加更多的清理逻辑
            sagaTasks = sagaTasks.filter(t => t.id !== task.id);
        }
    }
    
    /**
     * 匹配 action 模式
     * @param {string|Function|Array} pattern - 模式
     * @param {Object} action - action 对象
     * @returns {boolean} 是否匹配
     */
    function matchPattern(pattern, action) {
        if (typeof pattern === 'string') {
            return action.type === pattern;
        } else if (typeof pattern === 'function') {
            return pattern(action);
        } else if (Array.isArray(pattern)) {
            return pattern.some(p => matchPattern(p, action));
        }
        return false;
    }
}

// ========================================
// Redux-Saga Effects 辅助函数
// ========================================

/**
 * call - 调用函数
 * 
 * 用于调用同步或异步函数，返回 Promise
 * 
 * 使用场景：
 * - API 调用
 * - 计算任务
 * - 任何需要返回值的函数调用
 * 
 * @param {Function} fn - 要调用的函数
 * @param {...*} args - 函数参数
 * @returns {Object} CALL effect
 * 
 * @example
 * yield call(fetch, '/api/users');
 * yield call(api.login, username, password);
 */
function call(fn, ...args) {
    return {
        type: 'CALL',
        fn,
        args
    };
}

/**
 * put - dispatch action
 * 
 * 用于向 store dispatch action，相当于 Redux 中的 dispatch
 * 
 * 使用场景：
 * - 更新状态
 * - 触发其他 action
 * - 通知其他 sagas
 * 
 * @param {Object} action - 要 dispatch 的 action
 * @returns {Object} PUT effect
 * 
 * @example
 * yield put({ type: 'USER_LOGIN_SUCCESS', user });
 * yield put(actions.fetchData());
 */
function put(action) {
    return {
        type: 'PUT',
        action
    };
}

/**
 * take - 等待特定的 action
 * 
 * 暂停 saga，直到匹配的 action 被 dispatch
 * 
 * 使用场景：
 * - 等待用户操作
 * - 协调多个 sagas
 * - 实现事件驱动逻辑
 * 
 * @param {string|Function|Array} pattern - action 模式
 * @returns {Object} TAKE effect
 * 
 * @example
 * yield take('USER_LOGIN');
 * yield take(action => action.type === 'FETCH_SUCCESS');
 */
function take(pattern) {
    return {
        type: 'TAKE',
        pattern
    };
}

/**
 * fork - fork 新的 saga
 * 
 * 非阻塞地启动一个新的 saga，不影响当前 saga 的执行
 * 
 * 使用场景：
 * - 并发执行多个任务
 * - 启动后台任务
 * - 不阻塞主流程
 * 
 * @param {Function} saga - 要 fork 的 saga 函数
 * @param {...*} args - saga 参数
 * @returns {Object} FORK effect
 * 
 * @example
 * yield fork(watchUserActions);
 * yield fork(handleWebSocket, socket);
 */
function fork(saga, ...args) {
    return {
        type: 'FORK',
        saga,
        args
    };
}

/**
 * cancel - 取消 task
 * 
 * 取消一个正在运行的 saga 任务
 * 
 * 使用场景：
 * - 清理资源
 * - 取消过时的请求
 * - 处理用户取消操作
 * 
 * @param {Object} task - 要取消的任务
 * @returns {Object} CANCEL effect
 * 
 * @example
 * const task = yield fork(longRunningTask);
 * yield cancel(task);
 */
function cancel(task) {
    return {
        type: 'CANCEL',
        taskToCancel: task
    };
}

/**
 * all - 并行执行多个 effects
 * 
 * 并行执行多个 effects，等待全部完成后才继续
 * 
 * 使用场景：
 * - 并发请求多个 API
 * - 等待多个任务完成
 * - 聚合多个结果
 * 
 * @param {Array} effects - effect 数组
 * @returns {Object} ALL effect
 * 
 * @example
 * const [users, posts] = yield all([
 *   call(fetchUsers),
 *   call(fetchPosts)
 * ]);
 */
function all(effects) {
    return {
        type: 'ALL',
        effects
    };
}

/**
 * race - 竞速执行多个 effects
 * 
 * 并行执行多个 effects，返回第一个完成的结果
 * 
 * 使用场景：
 * - 实现超时机制
 * - 处理竞态条件
 * - 取消机制
 * 
 * @param {Object} effects - effect 对象
 * @returns {Object} RACE effect
 * 
 * @example
 * const { response, timeout } = yield race({
 *   response: call(fetch, '/api/data'),
 *   timeout: delay(5000)
 * });
 */
function race(effects) {
    return {
        type: 'RACE',
        effects
    };
}

/**
 * delay - 延迟执行
 * 
 * 创建一个延迟 Promise，用于实现超时、重试等逻辑
 * 
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise} Promise
 * 
 * @example
 * yield delay(1000); // 延迟 1 秒
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// Redux-Saga 使用示例
// ========================================

/**
 * 示例 Saga: 处理用户登录
 * 
 * 这个 saga 展示了如何：
 * 1. 监听登录请求
 * 2. 调用 API
 * 3. 处理成功/失败
 * 4. 更新状态
 */
function* handleLogin(action) {
    const { username, password } = action.payload;
    
    try {
        // 调用登录 API
        const response = yield call(loginApi, username, password);
        
        // 成功：更新状态
        yield put({
            type: 'LOGIN_SUCCESS',
            user: response.user
        });
        
        // 保存 token
        yield call(saveToken, response.token);
        
    } catch (error) {
        // 失败：更新错误状态
        yield put({
            type: 'LOGIN_FAILURE',
            error: error.message
        });
    }
}

/**
 * 示例 Saga: 监听登录 action
 * 
 * 使用 takeEvery 监听每次 LOGIN_REQUEST action
 */
function* watchLogin() {
    while (true) {
        const action = yield take('LOGIN_REQUEST');
        yield handleLogin(action);
    }
}

/**
 * 示例 Saga: 并发获取数据
 * 
 * 使用 all 并发获取多个数据源
 */
function* fetchDashboardData() {
    try {
        // 并发请求多个 API
        const [users, posts, comments] = yield all([
            call(fetch, '/api/users'),
            call(fetch, '/api/posts'),
            call(fetch, '/api/comments')
        ]);
        
        // 更新状态
        yield put({
            type: 'DASHBOARD_DATA_LOADED',
            payload: { users, posts, comments }
        });
        
    } catch (error) {
        yield put({
            type: 'DASHBOARD_DATA_ERROR',
            error: error.message
        });
    }
}

/**
 * 示例 Saga: 实现超时机制
 * 
 * 使用 race 实现请求超时
 */
function* fetchWithTimeout(url, timeoutMs) {
    const { response, timeout } = yield race({
        response: call(fetch, url),
        timeout: delay(timeoutMs)
    });
    
    if (timeout) {
        throw new Error('Request timeout');
    }
    
    return response;
}

/**
 * 示例 Saga: 实现自动重试
 * 
 * 使用循环实现失败重试逻辑
 */
function* fetchWithRetry(url, maxRetries = 3) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            const response = yield call(fetch, url);
            return response;
        } catch (error) {
            retries++;
            
            if (retries >= maxRetries) {
                throw error;
            }
            
            // 等待一段时间后重试
            yield delay(1000 * retries);
        }
    }
}

/**
 * 示例 Saga: 监听多个 actions
 * 
 * 使用 take 监听多个不同的 actions
 */
function* watchMultipleActions() {
    while (true) {
        const action = yield take([
            'FETCH_USERS',
            'FETCH_POSTS',
            'FETCH_COMMENTS'
        ]);
        
        switch (action.type) {
            case 'FETCH_USERS':
                yield fork(fetchUsers);
                break;
            case 'FETCH_POSTS':
                yield fork(fetchPosts);
                break;
            case 'FETCH_COMMENTS':
                yield fork(fetchComments);
                break;
        }
    }
}

// ========================================
// Redux-Saga 与 Redux-Thunk 对比
// ========================================

/**
 * Redux-Thunk 特点：
 * 1. 简单易用，学习成本低
 * 2. 适合简单的异步逻辑
 * 3. 每个 action creator 独立，难以复用
 * 4. 测试相对困难（需要 mock dispatch）
 * 5. 难以处理复杂的异步流程
 * 
 * Redux-Saga 特点：
 * 1. 功能强大，适合复杂的异步场景
 * 2. 声明式副作用管理，代码清晰
 * 3. sagas 可以复用和组合
 * 4. 易于测试（所有副作用都是可 mock 的）
 * 5. 支持并发、取消、竞态条件等高级特性
 * 6. 学习曲线较陡峭
 * 
 * 选择建议：
 * - 简单项目：使用 Redux-Thunk
 * - 复杂异步逻辑：使用 Redux-Saga
 * - 需要测试覆盖：使用 Redux-Saga
 * - 团队熟悉度：考虑团队的学习成本
 */
