/*
 * @Date: 2026-01-15 17:19:01
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-15 17:23:11
 * @FilePath: \leetcode-study\write\Promise.all.js
 */
Promise.myAll = function (promises) {
    if (Array.isArray(promises)) {
        throw new TypeError('promises must be an array')
    }
    return new Promise((resolve, reject) => {
        let result = []
        let count = 0;
        
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then((res) => {
                result[i] = res
                count++
                if (count === promises.length) {
                    resolve(result)
                }
            }).catch((err) => {
                reject(err)
            })
        }
    })
}