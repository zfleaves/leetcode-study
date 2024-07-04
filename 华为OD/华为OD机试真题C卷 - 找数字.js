/*
 * @Date: 2024-06-02 18:49:06
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:49:12
 * @FilePath: \leetcode-study\华为OD\华为OD机试真题C卷 - 找数字.js
 */
function findNextNumberWithSameOnes(n) {  
    let countOnes = (num) => {  
        let count = 0;  
        while (num > 0) {  
            count += num & 1;  
            num >>= 1;  
        }  
        return count;  
    };  
  
    let onesInN = countOnes(n);  
    let m = n + 1;  
    while (true) {  
        if (countOnes(m) === onesInN) {  
            return m;  
        }  
        m++;  
    }  
}  
  
// 示例用法  
let n = 2;  
let result = findNextNumberWithSameOnes(n);  
console.log(result); // 输出应为 4