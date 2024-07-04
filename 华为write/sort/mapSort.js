/*
 * @Date: 2024-06-25 10:56:27
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-25 11:17:45
 * @FilePath: \leetcode-study\write\sort\mapSort.js
 */
function mapSort(arr) {
    let i = arr.length - 1
    while (i > 0) {
        let pos = 0
        for (j = 0; j < i; j++) {
            if (arr[j + 1] < arr[j]) {
                let temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                pos = j
            }
        }
        i = pos
    }
    return arr
}

const arr = [12, 35, 99, 18, 76]
const result = mapSort(arr)
console.log('result', result);