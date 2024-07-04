/*
 * @Date: 2024-07-02 16:42:24
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-07-02 16:42:59
 * @FilePath: \leetcode-study\华为write\other\test.js
 */
for (var i = 0; i <= 5; i++) {
    console.log('a', i)
}

for (var i = 0; i <= 5; i++) {
    setTimeout(() => {
        console.log('b', i)
    })
}

for (let i = 0; i <= 5; i++) {
    console.log('c', i)
}

for (let i = 0; i <= 5; i++) {
    setTimeout(() => {
        console.log('d', i)
    })
}