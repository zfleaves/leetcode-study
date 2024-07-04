/*
 * @Date: 2024-06-25 12:15:37
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-25 12:18:41
 * @FilePath: \leetcode-study\write\other\debounce.js
 */
function debounce(Fn, await, immediate) {
    let timer = null
    return function () {
        let context = this
        if (timer) clearTimeout(timer)
        let args = arguments
        if (immediate) {
            let callNow = !timer
            timer = setTimeout(function() {
                timer = null
            }, await)
            if (callNow) {
                Fn.apply(context, args)
            }
        } else {
            timer = setTimeout(function () {
                Fn.apply(context, args)
            }, await)
        }
    }
}