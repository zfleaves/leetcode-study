/*
 * @Date: 2024-06-25 12:11:41
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-07-01 09:58:46
 * @FilePath: \leetcode-study\华为write\other\throttled.js
 */
function throttled(Fn, delay) {
    let timer = null
    let start = Date.now()
    return function() {
        if (timer) clearTimeout(timer)
        let cur = Date.now()
        let remain = delay - (cur - start)
        let context = this
        let args = arguments
        if (remain >=0) {
            timer = setTimeout(function(){
                Fn.apply(context, args)
            }, remain)
        } else {
            Fn.apply(context, args)
            start = Date.now()
        }
    }
}