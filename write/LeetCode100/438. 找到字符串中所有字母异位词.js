// 输入: s = "cbaebabacd", p = "abc"
// 输出: [0, 6]
// 解释:
// 起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
// 起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。

/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
    const sLen = s.length, pLen = p.length;
    let res = [];
    const aCode = 'a'.charCodeAt();
    const sCount = new Array(26).fill(0);
    const pCount = new Array(26).fill(0);

    // 统计p得字母数量
    for (const v of p) {
        pCount[v.charCodeAt() -  aCode]++;
    }
    let slow = 0;
    for (let i = 0; i < sLen; i++) {
        const c = s[i];
        sCount[c.charCodeAt() - aCode]++;
        if (i - slow + 1 === pLen) {
            if (isArrarEqual(sCount, pCount)) {
                res.push(slow);
            }
            sCount[s[slow].charCodeAt() - aCode]--;
            slow++;
        }
    }
    return res;
}

function isArrarEqual(arr1, arr2) {
    for (let i = 0; i < 26; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

const s = "cbaebabacd", p = "abc";
console.log(findAnagrams(s, p));