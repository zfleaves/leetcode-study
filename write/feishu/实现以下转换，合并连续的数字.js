// 将 [1,2,3,4,6,7,9,13,15] 转换为 ['1->4','6->7','9','13','15']

function mergeContinuousNumbers(nums) {
    if (nums.length === 0) {
        return [];
    }
    let result = [];
    let start = nums[0];
    let end = nums[0];

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === end + 1) { // 连续
            end = nums[i]
        } else {
            if (start === end) {
                result.push(`${end}`);
            } else {
                result.push(`${start}->${end}`);
            }
            start = nums[i];
            end = nums[i];
        }
    }

    if (start === end) {
        result.push(`${end}`);
    } else {
        result.push(`${start}->${end}`);
    }

    return result;
}

// 测试
console.log(mergeContinuousNumbers([1, 2, 3, 4, 6, 7, 9, 13, 15]));
console.log(mergeContinuousNumbers([1, 2, 3]));