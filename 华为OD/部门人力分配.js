/*
 * @Date: 2024-06-02 19:12:11
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 19:13:47
 * @FilePath: \leetcode-study\华为OD\部门人力分配.js
 */
function minMonthlyManpower(requirements, M) {
    const maxManpower = 100; // 假设最大人力为100人月  
    // 首先对需求按工作量从大到小排序  
    requirements.sort((a, b) => b - a);

    // 初始化每个月的需求和人力  
    let months = Array.from({
        length: M
    }, () => ({
        demands: [], // 存储当前月份的需求  
        manpower: 0 // 当前月份的人力  
    }));

    // 尝试将需求分配到月份中  
    for (let i = 0; i < requirements.length; i++) {
        let currentDemand = requirements[i];
        let hasSpace = false; // 标记是否找到有空位的月份  

        // 遍历月份，尝试找到有空位或者人力足够的月份  
        for (let j = 0; j < M; j++) {
            if (months[j].demands.length < 2) {
                // 如果当前月份有空位且人力足够，则分配需求  
                months[j].demands.push(currentDemand);
                months[j].manpower += currentDemand;
                hasSpace = true;
                break;
            }
        }

        // 如果没有找到有空位的月份，则意味着我们需要增加最大人力（但题目没有说明如何增加，这里仅作理论探讨）  
        // 在实际情况中，你可能需要调整策略或返回错误  
        if (!hasSpace) {
            // 这里只是模拟了一个最大人力限制，实际中需要具体逻辑  
            throw new Error('No space in any month for the current demand within the maximum manpower limit.');
        }
    }

    // 找出每个月的最大人力需求  
    let maxMonthlyManpower = 0;
    for (let month of months) {
        maxMonthlyManpower = Math.max(maxMonthlyManpower, month.manpower);
    }

    return maxMonthlyManpower;
}

// 示例使用  
const requirements = [3,5,3,4]; // 需求的工作量  
const M = 3; // 需要的月份数  
const result = minMonthlyManpower(requirements, M);
console.log(result); // 输出每个月所需的最小人力