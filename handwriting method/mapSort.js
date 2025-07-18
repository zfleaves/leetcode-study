/*
 * @Date: 2024-06-04 12:45:46
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-21 14:18:45
 * @FilePath: \leetcode-study\handwriting method\mapSort.js
 */
function mapSort(arr) {
    const len = arr.length
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j + 1] // 元素交换
                arr[j + 1] = arr[j]
                arr[j] = temp
            }
        }
    }
    return arr
}

// 排序优化
function newMapSort(arr) {
    const i = arr.length - 1
    while(i >0) {
        let pos = 0
        for (let j = 0; j < i; j++) {
            if (arr[j + 1] > arr[j]) {
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

function selectionSort(arr) {
    const n = arr.length
    let temp
    for (let i = 0; i < n; i++) {
        let minIndex = i
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        temp = arr[i]
        arr[i] = arr[minIndex]
        arr[minIndex] = temp
    }
    return arr
}

// 3、1、7、5、2、4、9、6
function insertSort(arr) {
    const n = arr.length
    let preIndex, current
    for (let i = 1; i < n; i++) {
        pre = i - 1
        current = arr[i]
        while (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex]
            preIndex--
        }
        arr[preIndex + 1] = current
    }
    return arr
}