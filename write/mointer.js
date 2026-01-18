/*
 * @Date: 2026-01-15 16:02:16
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-15 16:24:29
 * @FilePath: \leetcode-study\write\mointer.js
 */
// 1. 错误监控

class ErrorMonitor {
    constructor(config) {
        this.config = config;
        this.init();
    }

    init() {
        // 捕获 JavaScript 错误
        window.addEventListener('error', this.handleError.bind(this));

        // 捕获 Promise 错误
        window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));

        // 捕获资源加载错误
        window.addEventListener('error', this.handleResourceError.bind(this), true);

        // 捕获 Vue 错误
        if (window.Vue) {
            window.Vue.config.errorHandler = this.handleVueError.bind(this);
        }
        // 捕获 React 错误（需要 Error Boundary）
    }

    handleError(event) {
        console.log(event);
        // 发送错误日志
        this.reportError({
            type: 'js-error',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
        });
    }

    handlePromiseError(event) {
        console.log(event);
        // 发送错误日志
        this.reportError({
            type: 'promise-error',
            message: event.reason.message,
            stack: event.reason?.stack,
            timestamp: Date.now(),
            url: window.location.href,
        });
    }

    // 资源加载错误
    handleResourceError(event) {
        if (event.target !== window) {
            this.report({
                type: 'resource_error',
                message: `资源加载失败: ${event.target.src || event.target.href}`,
                tagName: event.target.tagName,
                timestamp: Date.now(),
            });
        }
    }

    handleVueError(err, vm, info) {
        // 发送错误日志
        this.reportError({
            type: 'vue-error',
            message: err.message,
            stack: err.stack,
            component: vm?.$options?.name,
            timestamp: Date.now(),
            info
        });
    }

    reportError(data) {
        // 发送错误日志
        fetch(this.config.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(err => console.error('上报失败:', err));
    }
}

const mointer = new ErrorMonitor({
    url: 'https://example.com/error', // 上报错误日志的 URL
});

// 2 性能监控

class PerformanceMonitor {
    constructor(config) {
        this.config = {
            slowThreshold: 1000,
            ...config
        };
        this.init();
    }

    init() {
        // 页面加载性能
        window.addEventListener('load', () => {
           setTimeout(() => this.measurePageLoad(), 0);
        })

        // 资源加载性能
        this.measureResources();

        // 用户行为性能
        this.trackUserBehavior();
    }

    async measurePageLoad() {
        const perfData = performance.getEntriesByType('navigation')[0];

        const metrics  = {
            // DNS 查询时间
            dns: perfData.domainLookupEnd - perfData.domainLookupStart,
            // TCP 连接时间
            tcp: perfData.connectEnd - perfData.connectStart,
            // 请求响应时间
            ttfb: perfData.responseStart - perfData.requestStart,
            // DOM 解析时间
            domParse: perfData.domComplete - perfData.domInteractive,
            // 资源加载时间
            resourceLoad: perfData.loadEventStart - perfData.domContentLoadedEventEnd,
            // 首屏时间
            firstPaint: this.getFirstPaint(),
            // 可交互时间
            tti: await this.getTimeToInteractive(),
        };

        this.reportData({
            type: 'page_performance',
            metrics,
            timestamp: Date.now(),
            url: window.location.href,
        });
    }

    getFirstPaint() {
        const entries = performance.getEntriesByType('paint');
        const firstPaint = entries.find(entry => entry.name === 'first-paint');
        return firstPaint?.startTime || 0;
    }

    getTimeToInteractive() {
        // 使用 PerformanceObserver 监听 TTI
        return new Promise(resolve => {
            if (window.PerformanceObserver) {
                const observer = new PerformanceObserver(list => {
                    const tti = list.getEntries().find(entry => entry.name === 'first-contentful-paint');
                    observer.disconnect();
                    resolve(tti?.startTime || 0);
                });
                observer.observe({ type: 'paint', buffered: true });
            } else {
                resolve(0);
            }
        })
    }

    measureResources() {
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration >= this.config.slowThreshold); // 超过 1 秒的慢资源
        if (slowResources.length > 0) {
            this.reportData({
                type: 'slow_resources',
                resources: slowResources.map(resource => ({
                    name: resource.name,
                    duration: resource.duration,
                    size: r.transferSize,
                })),
                timestamp: Date.now(),
                url: window.location.href,
            });
        }
    }

    trackUserBehavior() {
        // 点击事件
        document.addEventListener('click', (e) => {
            this.report({
                type: 'click',
                target: e.target.tagName,
                className: e.target.className,
                id: e.target.id,
                timestamp: Date.now(),
            });
        });

        // 页面停留时间
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
        const duration = Date.now() - startTime;
        this.report({
            type: 'page_view_duration',
            duration,
            url: window.location.href,
        });
        });
    }

    report(data) {
        // 使用 sendBeacon 确保页面关闭时也能上报
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            navigator.sendBeacon(this.config.reportUrl, blob);
        } else {
            fetch(this.config.reportUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        }
    }
}

const performanceMonitor = new PerformanceMonitor({
    reportUrl: 'https://example.com/performance', // 上报性能数据的 URL
});