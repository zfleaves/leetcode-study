/*
 * @Date: 2026-01-28 19:41:50
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-28 19:53:59
 * @FilePath: \leetcode-study\write\sort\mapSort.js
 */
/*
 * @Date: 2026-01-28 19:41:50
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-28 19:49:15
 * @FilePath: \leetcode-study\write\sort\mapSort.js
 */
function mapSort(arr) {
    let i = arr.length - 1; //初始时,最后位置保持不变  
    while (i > 0) {
        let pos = 0; //每趟开始时,无记录交换
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                let tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                pos = j; //记录最后交换的位置  
            }
        }
        i = pos; //为下一趟排序作准备
    }
    return arr;
}

const arr = [12, 35, 99, 18, 76]
const result = mapSort(arr)
console.log('result', result);