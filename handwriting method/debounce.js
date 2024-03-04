// 防抖如果需要立即执行，可加入第三个参数用于判断，实现如下
function debounce(fn, wait, immediate) {
    let timeout
    return function() {
        let context = this
        let args = arguments
        if (timeout) clearTimeout(timeout)
        if (immediate) {
            let callNow = !timeout
            timeout = setTimeout(function() {
                timeout = null
            }, wait)
            if (callNow) {
                fn.apply(context, args)
            }
        } else {
            timeout = setTimeout(function() {
                func.apply(context, args)
            }, wait)
        }
    }
}