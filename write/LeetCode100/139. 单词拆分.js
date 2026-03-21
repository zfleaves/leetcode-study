/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
// 给你一个字符串 s 和一个字符串列表 wordDict 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 s 则返回 true。

// 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。
// 输入: s = "applepenapple", wordDict = ["apple", "pen"]
// 输出: true
// 解释: 返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。
// 注意，你可以重复使用字典中的单词。
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict) {
    const maxCount = Math.max(...wordDict.map(v => v.length));
    const map = new Set(wordDict);
    const memo = Array(s.length + 1);

    const dfs = (i) => {
        if (i === 0) return true; // 成功拆分

        if (memo[i] !== undefined) {
            return memo[i];
        }
        for (let j = i; j >= Math.max(i - maxCount, 0); j--) {
            if (map.has(s.slice(j, i)) && dfs(j)) {
                return memo[j] = true;
            }
        }
        return memo[i] = false;
    }
    return dfs(s.length);
}
const s = "applepenapple", wordDict = ["apple", "pen"]
console.log(wordBreak(s, wordDict));