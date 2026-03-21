/**
 * 请求拦截器基类
 * 提供了类似 axios 的请求/响应拦截器功能，支持请求取消、错误处理等特性
 * 
 * 核心设计思想：
 * 1. 使用 Promise 链式调用机制实现拦截器
 * 2. 请求拦截器按添加顺序的逆序执行（后添加的先执行）
 * 3. 响应拦截器按添加顺序执行
 * 4. 支持通过 AbortController 取消请求
 */

/**
 * 检查请求是否已被取消，如果已取消则抛出错误
 * @param {Object} config - 请求配置对象
 * @param {AbortSignal} config.signal - AbortController 的信号对象
 * @throws {Error} 如果请求已被取消，抛出包含 __CANCEL__ 标记的错误
 */
function throwIfCancellationRequested(config) {
    if (config.signal && config.signal.aborted) {
        const error = new Error('请求已取消！');
        // 标记这是一个取消错误，方便后续判断
        error.__CANCEL__ = true;
        throw error;
    }
}

/**
 * 判断错误是否为取消错误
 * @param {Error} error - 错误对象
 * @returns {boolean} 是否为取消错误
 */
function isCancel(error) {
    return error?.__CANCEL__ === true;
}

class BaseRequest {
    /**
     * 构造函数
     * @param {Object} initConfig - 初始化配置
     * @param {Object} initConfig.errorConfig - 错误配置对象
     * @param {Function} initConfig.errorConfig.errorThrower - 业务层面的错误抛出函数
     * @param {Function} initConfig.errorConfig.errorHandler - 错误处理函数
     */
    constructor(initConfig) {
        // 存储请求拦截器数组，每个拦截器包含 resolve 和 reject 函数
        this.requestInterceptors = [];
        // 存储响应拦截器数组，每个拦截器包含 resolve 和 reject 函数
        this.responseInterceptors = [];
        // 保存初始化配置，后续会与每次请求的配置合并
        this.initConfig = initConfig ?? {};
        
        // 绑定 this，确保方法在回调中的 this 指向正确
        this.request = this.request.bind(this);
        this.addResponseInterceptor = this.addResponseInterceptor.bind(this);
        this.addRequestInterceptor = this.addRequestInterceptor.bind(this);
        this.removeRequestInterceptor = this.removeRequestInterceptor.bind(this);
        this.removeResponseInterceptor = this.removeResponseInterceptor.bind(this);
    }

    /**
     * 添加请求拦截器
     * 请求拦截器会在请求发送前执行，可以用于修改请求配置、添加 token 等
     * 
     * 执行顺序：后添加的拦截器先执行（类似栈结构）
     * 
     * @param {Function} resolveFn - 成功回调函数，接收 config 参数，必须返回修改后的 config
     * @param {Function} rejectFn - 失败回调函数，接收 error 参数
     * @returns {number} 拦截器 ID，可用于移除该拦截器
     * 
     * @example
     * const id = instance.addRequestInterceptor(
     *   (config) => {
     *     config.headers.Authorization = 'Bearer token';
     *     return config;
     *   },
     *   (error) => Promise.reject(error)
     * );
     */
    addRequestInterceptor(resolveFn, rejectFn) {
        this.requestInterceptors.push({
            resolve: resolveFn,
            reject: rejectFn  // 原代码这里写的是 rejectFn，应该是笔误
        })
        // 返回拦截器的索引作为 ID
        return this.requestInterceptors.length - 1;
    }

    /**
     * 移除请求拦截器
     * @param {number} id - 拦截器 ID（添加拦截器时返回的索引）
     */
    removeRequestInterceptor(id) {
        // 将拦截器设置为 null 而不是删除，避免影响其他拦截器的索引
        this.requestInterceptors[id] = null;
    }

    /**
     * 添加响应拦截器
     * 响应拦截器会在收到响应后执行，可以用于统一处理响应数据、错误等
     * 
     * 执行顺序：按添加顺序执行（类似队列）
     * 
     * @param {Function} resolveFn - 成功回调函数，接收 response 参数
     * @param {Function} rejectFn - 失败回调函数，接收 error 参数
     * @returns {number} 拦截器 ID，可用于移除该拦截器
     * 
     * @example
     * const id = instance.addResponseInterceptor(
     *   (response) => response.data,
     *   (error) => Promise.reject(error)
     * );
     */
    addResponseInterceptor(resolveFn, rejectFn) {
        this.responseInterceptors.push({
            resolve: resolveFn,
            reject: rejectFn
        });
        // 返回拦截器的索引作为 ID
        return this.responseInterceptors.length - 1;
    }

    /**
     * 移除响应拦截器
     * @param {number} id - 拦截器 ID（添加拦截器时返回的索引）
     */
    removeResponseInterceptor(id) {
        // 将拦截器设置为 null 而不是删除，避免影响其他拦截器的索引
        this.responseInterceptors[id] = null;
    }

    /**
     * 发起请求的公共方法
     * 这是拦截器链式调用的核心方法
     * 
     * 执行流程：
     * 1. 将请求拦截器逆序添加到 chain 数组开头
     * 2. 将实际请求函数添加到 chain 中间
     * 3. 将响应拦截器顺序添加到 chain 末尾
     * 4. 通过 Promise 链式调用依次执行
     * 
     * @param {Object} option - 请求配置选项（会与 initConfig 合并）
     * @returns {Promise} 返回一个 Promise，解析为请求的响应数据
     */
    request(option) {
        // chain 数组结构：[req1.resolve, req1.reject, req2.resolve, req2.reject, ..., doRequest, undefined, res1.resolve, res1.reject, res2.resolve, res2.reject, ...]
        // 使用 undefined 作为 doRequest 的 reject 函数，因为它有自己的错误处理逻辑
        const chain = [];
        
        // 将请求拦截器添加到 chain 数组开头（unshift 使其逆序）
        // 这样后添加的拦截器会先执行
        this.requestInterceptors.forEach(item => {
            chain.unshift(item?.resolve, item?.reject);
        })
        
        /**
         * 执行实际请求的异步函数
         * 这是 Promise 链的中心，负责发起真正的 HTTP 请求
         * 
         * @param {Object} config - 请求配置（经过所有请求拦截器处理后的配置）
         * @returns {Promise} 返回一个 Promise，解析为请求的响应数据
         */
        const doRequest = async (config) => {
            // 在发送请求前检查是否已取消
            throwIfCancellationRequested(config);

            // 调用底层的请求方法（如 Taro.request、fetch 等）
            return this.baseRequest(config)
                .then((res) => {
                    // 请求成功后再次检查是否已取消（可能在请求过程中被取消）
                    throwIfCancellationRequested(config);
                    
                    // 解构响应数据
                    let { statusCode, data } = res;

                    // 将请求配置附加到响应对象中，方便拦截器使用
                    res.config = config;
                    
                    // 检查 HTTP 状态码是否在成功范围内（200-299）
                    if (statusCode && statusCode >= 200 && statusCode < 300) {
                        // 业务层面的错误检查
                        // 有些接口虽然 HTTP 状态码是 200，但业务返回的 success 字段为 false
                        if (data?.success === false && this.initConfig?.errorConfig?.errorThrower) {
                            // 调用业务错误抛出函数，处理业务层面的错误
                            this.initConfig.errorConfig.errorThrower(data);
                        }
                        // 请求成功，返回响应数据
                        return res;
                    }
                    // HTTP 状态码不在成功范围，将响应作为错误拒绝
                    return Promise.reject(res);
                })
                .catch((err) => {
                    // 如果不是取消错误，再次检查是否在 catch 过程中被取消
                    if (!isCancel(err)) {
                        try {
                            throwIfCancellationRequested(config);
                        } catch (error) {
                            // 请求被取消，用取消错误替换原始错误
                            return Promise.reject(error);
                        }
                    }
                    
                    try {
                        // 获取全局错误处理函数
                        const handler = this.initConfig?.errorConfig?.errorHandler;
                        // 如果配置了错误处理函数，调用它进行统一错误处理
                        if (handler) handler(err, config);
                    } catch (e) {
                        // 如果错误处理函数本身抛出错误，用新错误替换原始错误
                        return Promise.reject(e);
                    }
                    // 继续抛出原始错误
                    return Promise.reject(err);
                });
        };

        // 将实际请求函数和 undefined 添加到 chain 中间
        // undefined 作为 reject 函数，因为 doRequest 内部已有完整的错误处理
        const realRequest = [doRequest, undefined];
        chain.push(...realRequest); 
        
        // 将响应拦截器添加到 chain 末尾（按添加顺序执行）
        this.responseInterceptors.forEach(item => {
            chain.push(item?.resolve, item?.reject);
        });

        // 创建初始 Promise，携带合并后的配置
        // 先合并 initConfig（全局配置），再合并 option（本次请求配置）
        let promise = Promise.resolve({ ...this.initConfig, ...option });
        
        // 通过 Promise 链式调用依次执行 chain 中的函数
        // 每次取出两个元素：resolve 函数和 reject 函数
        while(chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }
        
        return promise;
    }

    /**
     * 底层请求方法，由子类实现或直接调用具体框架的请求方法
     * 这里默认使用 Taro.request（适用于 Taro 框架）
     * 
     * @param {Object} config - 请求配置
     * @param {AbortSignal} config.signal - 可选的取消信号
     * @returns {Promise} 返回请求任务
     */
    baseRequest(config) {
        // 调用 Taro 框架的请求方法
        // @ts-ignore 忽略 TypeScript 类型检查
        const requestTask = Taro.request(config);
        
        // 如果配置了取消信号，监听 abort 事件
        if (config.signal) {
            config.signal.addEventListener('abort', () => {
                // 当信号触发 abort 时，取消请求
                requestTask.abort();
            });
        }
        
        return requestTask;
    }
}