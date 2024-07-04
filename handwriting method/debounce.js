/*
 * @Date: 2024-05-05 12:51:24
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-04 17:01:18
 * @FilePath: \leetcode-study\handwriting method\debounce.js
 */
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



function newDebounce(fn, wait, immediate) {
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
                fn.apply(context, args)
            }, wait)
        }
    }
}