/*
 * @Date: 2026-01-28 20:16:06
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-28 20:33:18
 * @FilePath: \leetcode-study\write\flatten.js
 */
/**
 * 拍平嵌套对象/数组，生成指定格式的单层对象
 * @param {Object|Array} data - 待拍平的数据源
 * @param {string} [prefix=''] - 递归路径前缀（内部使用）
 * @returns {Object} 拍平后的单层对象
 */

function flattenObject(data, prefix = '') {
    const result = {};

    // 数组处理
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const key = prefix ? `${prefix}[${i}]` : `[${index}]`;
            Object.assign(result, flattenObject(data[i], key))
        }
    } else if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
            const newKey = prefix ? `${prefix}.${key}` : key;
            Object.assign(result, flattenObject(value, newKey));
        });
    } else if (prefix) { // 处理基础类型（数字、字符串等）：直接赋值
        result[prefix] = data;
    }

    return result;
}

const originalData = {
    a: 1,
    b: [1, 2, {
        c: 3
    }],
    d: {
        e: 6
    }
};

const flattenedResult = flattenObject(originalData);
console.log(flattenedResult);
// {
//   a: 1,
//   'b[0]': 1,
//   'b[1]': 2,
//   'b[2].c': 3,
//   'd.e': 6
// }

const flattenedArr = (arr) => {
    let res = [];
    arr.forEach((item) => {
        if (Array.isArray(item)) {
            res = res.concat(flattenedArr(item))
        } else {
            res.push(item);
        }
    })

    return res;
}

const flattenedReduceArr = (arr, depth = 1) => {
    return arr.reduce((pre, cur) => {
        if (depth > 0 && Array.isArray(cur)) {
            pre.push(...flattenedReduceArr(cur, depth - 1))
        } else {
            pre.push(cur);
        }
        return pre;
    }, [])
}

const nestedArray = [1, [2, [3, 4], 5], { c: 6 }, [7, [8]]];
const flatArray = flattenedArr(nestedArray);
const flatReduceArray = flattenedReduceArr(nestedArray, 2);
console.log('nested 拍平结果：', flatArray); 
console.log('reduce 拍平结果：', flatReduceArray); 