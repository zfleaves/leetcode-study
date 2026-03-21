import { useState, useCallback, useRef, useEffect } from 'react';

function useRequest(api, options = {}) {
    const { onSuccess, onError, timeout = 5000, retry = 0 } = options;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null); // 取消请求
    const retryCountRef = useRef(0); // 重试次数

    // 核心请求逻辑（缓存函数，避免依赖变化）
    const fetchData = useCallback(async (params) => {
        setLoading(true);
        setError[null];
        abortControllerRef.current = new AbortController();

        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('请求超时')), timeout);
            })
            const response = Promise.race([
                api(params, { singal: abortControllerRef.current.singal}),
                timeoutPromise
            ])
            setData(response);
            onSuccess?.(response);
            retryCountRef.current = 0;
        } catch (error) {
            if (err.name === 'AbortError') return; // 主动取消不处理
            setError(error);
            if (retryCountRef.current < retry) {
                retryCountRef.current++;
                setTimeout(() => {
                    fetchData(params);
                }, 1000);
            }
        } finally {
            setLoading(false);
        }
    }, [api, onSuccess, onError, timeout, retry])

    // 取消请求
    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    // 卸载时取消请求
    useEffect(() => {
        return () => cancel();
    }, [cancel]);

    return { loading, data, error, fetchData, cancel };
}