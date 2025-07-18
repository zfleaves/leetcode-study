var val = "test";
console.log("output is " + (val === "Test") ? "123" : "456");
// 本质是运算符优先级问题。
// 优先级是：() > + > ?:
// 所以，表达式运算过程：
// "output is " + false ? "123" : "456" ==>
// "output is false" ? "123" : "456" ==>
// "123"

function bigNumberSum(a, b) {
    // 123456789
    // 000009876

    // padding
    let cur = 0;
    while (cur < a.length || cur < b.length) {
        if (!a[cur]) {
            a = "0" + a;
        } else if (!b[cur]) {
            b = "0" + b;
        }
        cur++;
    }

    let carried = 0;
    const res = [];

    for (let i = a.length - 1; i > -1; i--) {
        const sum = carried + +a[i] + +b[i];
        if (sum > 9) {
            carried = 1;
        } else {
            carried = 0;
        }
        res[i] = sum % 10;
    }
    if (carried === 1) {
        res.unshift(1);
    }

    return res.join("");
}


const res = bigNumberSum(123456789, 9876)
console.log('res: ', res);


// 获取当前日期
const now = new Date();

// 获取当前年份
const currentYear = now.getFullYear();

// 设置目标日期为当前年份的10月22日
const targetDate = new Date(currentYear, 9, 22); // 注意：月份在Date对象中是从0开始的，所以9代表10月

// 计算两个日期之间的时间差（毫秒）
const timeDifference = now - targetDate;

// 将时间差转换为天数
const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

// 输出结果
console.log(`从今年10月22日到现在已经过去了 ${daysDifference} 天。`);