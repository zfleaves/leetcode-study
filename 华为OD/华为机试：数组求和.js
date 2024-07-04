/*
 * @Date: 2024-06-02 18:20:34
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:20:45
 * @FilePath: \leetcode-study\华为OD\华为机试：数组求和.js
 */
function uniqueArray(arr) {
    return [...new Set(arr)]; // 使用Set去重，然后转回数组  
}

function sumOfTopAndBottomN(arr, n) {
    // 去重  
    const uniqueArr = uniqueArray(arr);

    // 如果去重后的数组长度小于2N，则无法获取N个最大和N个最小数  
    if (uniqueArr.length < 2 * n) {
        throw new Error('数组长度小于2N，无法获取N个最大和N个最小数');
    }

    // 排序  
    uniqueArr.sort((a, b) => a - b);

    // 计算最大N个数的和  
    let sumTopN = 0;
    for (let i = uniqueArr.length - n; i < uniqueArr.length; i++) {
        sumTopN += uniqueArr[i];
    }

    // 计算最小N个数的和（也就是排序后的前N个数）  
    let sumBottomN = 0;
    for (let i = 0; i < n; i++) {
        sumBottomN += uniqueArr[i];
    }

    // 返回最大N个数和最小N个数的和  
    return sumTopN + sumBottomN;
}

// 示例  
const arr = [1, 2, 3, 4, 5, 5, 6, 7, 8, 1, 2, 3];
const n = 3;
try {
    const result = sumOfTopAndBottomN(arr, n);
    console.log(result); // 输出：33 (即 (6 + 7 + 8) + (1 + 2 + 3) )  
} catch (error) {
    console.error(error.message);
}