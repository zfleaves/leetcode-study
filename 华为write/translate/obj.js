function flatterObj(obj) {
    let result = {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // result[key] = flatterObj(obj[key])
            const value = obj[key]
            if (typeof value === 'object') {
                result[key] = flatterObj(obj[key])
            } else {
                result[key] = value
            }
        }
    }
    return result
}


function flattenObject(obj) {
    let result = {}
    const stack = [obj]

    while (stack.length > 0) {
        const currentObj = stack.pop();  
        for (let key in currentObj) {
            if (obj.hasOwnProperty(key)) {
                // result[key] = flatterObj(obj[key])
                const value = currentObj[key]
                if (typeof value === 'object') {
                    stack.push(value); 
                } else {
                    result[key] = value
                }
            }
        }
    }
    return result
}

// 示例用法  
const nestedObj = {
    a: 1,
    b: {
        c: 2,
        d: {
            e: 3
        }
    }
};

// const res1 = flatterObj(nestedObj)
// console.log(res1)
const res2 = flattenObject(nestedObj)
console.log(res2)