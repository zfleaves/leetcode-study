/*
 * @Date: 2024-06-02 18:39:25
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:39:33
 * @FilePath: \leetcode-study\华为OD\字符串变换最小字符串.js
 */
function swapOnceToMinimize(str) {  
    let minString = str; // 初始化为原始字符串  
  
    // 将字符串转换为字符数组  
    let charArray = str.split('');  
  
    // 遍历所有可能的相邻字符对  
    for (let i = 0; i < charArray.length - 1; i++) {  
        // 如果当前字符比下一个字符大，则尝试交换它们  
        if (charArray[i] > charArray[i + 1]) {  
            // 交换字符  
            [charArray[i], charArray[i + 1]] = [charArray[i + 1], charArray[i]];  
  
            // 将字符数组转换回字符串  
            let swappedString = charArray.join('');  
  
            // 如果交换后的字符串更小，则更新最小字符串  
            if (swappedString < minString) {  
                minString = swappedString;  
            }  
  
            // 恢复原始顺序以继续搜索  
            [charArray[i], charArray[i + 1]] = [charArray[i + 1], charArray[i]];  
  
            // 因为我们只需要一次交换，所以找到后就退出循环  
            break;  
        }  
    }  
  
    // 返回最小字符串  
    return minString;  
}  
  
// 示例用法  
let inputString = "dcba";  
let outputString = swapOnceToMinimize(inputString);  
console.log(outputString); // 输出 "cbda" 或其他可能的最小化结果，但只通过一次交换