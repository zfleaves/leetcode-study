function calculateMarsExpression(expression) {
    // 定义火星人运算符的优先级  
    const precedence = {
        '#': 2,
        '$': 1
    };

    // 定义火星人运算符的运算函数  
    const operations = {
        '#': (x, y) => 4 * x + 3 * y + 2,
        '$': (x, y) => 2 * x + y + 3
    };

    // 辅助函数：将字符串数字转换为整数  
    function parseNumber(str, index) {
        let num = 0;
        while (index < str.length && str[index] >= '0' && str[index] <= '9') {
            num = num * 10 + (str[index] - '0');
            index++;
        }
        return {
            num,
            index
        };
    }

    // 辅助函数：执行栈顶的两个操作数和运算符对应的运算  
    function applyOp(opStack, numStack) {
        const y = numStack.pop();
        const x = numStack.pop();
        const op = opStack.pop();
        numStack.push(operations[op](x, y));
    }

    // 辅助函数：判断是否需要执行运算符  
    function shouldApplyOp(op1, op2) {
        return !opStack.length || precedence[op1] <= precedence[opStack[opStack.length - 1]];
    }

    // 初始化栈  
    const opStack = [];
    const numStack = [];

    let index = 0;
    while (index < expression.length) {
        // 如果是数字，则解析并压入数字栈  
        if (expression[index] >= '0' && expression[index] <= '9') {
            const {
                num,
                index: newIndex
            } = parseNumber(expression, index);
            numStack.push(num);
            index = newIndex;
        }
        // 如果是运算符，则处理运算符栈和数字栈  
        else if (expression[index] === '#' || expression[index] === '$') {
            // 如果需要执行栈顶的运算符，则执行  
            while (opStack.length && shouldApplyOp(expression[index], opStack[opStack.length - 1])) {
                applyOp(opStack, numStack);
            }
            // 将当前运算符压入运算符栈  
            opStack.push(expression[index]);
            index++;
        }
    }

    // 处理运算符栈中剩余的运算符  
    while (opStack.length) {
        applyOp(opStack, numStack);
    }

    // 表达式计算结果在数字栈的栈顶  
    return numStack[0];
}

// 示例  
const expression = "123#4$5#67$78";
const result = calculateMarsExpression(expression);
console.log(result); // 输出计算结果