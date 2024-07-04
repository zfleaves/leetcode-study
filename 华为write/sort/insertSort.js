/*
 * @Date: 2024-06-25 11:19:18
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-25 11:29:18
 * @FilePath: \leetcode-study\write\sort\insertSort.js
 */
/*
 * @Date: 2024-06-25 11:19:18
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-25 11:23:05
 * @FilePath: \leetcode-study\write\sort\insertSort.js
 */
function insertSort(arr) {
    let preIndex, cur
    for (let i = 1; i < arr.length - 1; i++) {
        preIndex = i - 1
        cur = arr[i]
        while(preIndex >= 0 && arr[preIndex] > cur) {
            arr[preIndex + 1] = arr[preIndex]
            preIndex--
        }
        arr[preIndex + 1] = cur
    }
    return arr
}

const arr = [12, 35, 99, 18, 76]
const result = insertSort(arr)
console.log('result', result);