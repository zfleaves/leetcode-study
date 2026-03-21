/*
 * @Date: 2026-02-26 21:58:15
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-01 18:40:25
 * @FilePath: \leetcode-study\write\feishu\quickSort.js
 */
// 手写实现快速排序算法。
function quickSort(arr) {
    if (arr.length < 2) return arr;

    let poiot = arr[Math.floor(arr.length / 2)];
    let left = [], right = [], equal = [];
    for (const num of arr) {
        if (num < poiot) {
            left.push(num);
        } else if (num > poiot) {
            right.push(num)
        } else {
            equal.push(num)
        }
    }
    return [...quickSort(left), ...equal, ...quickSort(right)];
}

const arr1 = [3, 6, 8, 10, 1, 2, 1];
console.log('Original:', arr1);
console.log('QuickSort:', quickSort([...arr1])); // [1, 1, 2, 3, 6, 8, 10]


function mapSort(arr) {
    let i = arr.length - 1;
    while (i > 0) {
        let pos = 0;
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                pos = j;
            }
        }
        i = pos;
    }
    return arr;
}
const arr = [12, 35, 99, 18, 76]
const result = mapSort(arr)
console.log('result', result);