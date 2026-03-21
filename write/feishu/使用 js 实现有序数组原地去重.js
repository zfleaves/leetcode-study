// 对有序数组进行原地去重。

function removeDuplicates(nums) {
    const n = nums.length;
    if (n <= 1) return nums;

    let slow = 0;

    for (let fast = 1; fast < n; fast++) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }

    return slow + 1;
}

// 测试
const arr1 = [1, 1, 2, 2, 3, 4, 4, 5];
const length1 = removeDuplicates(arr1);
console.log('去重后数组:', arr1.slice(0, length1)); // [1, 2, 3, 4, 5]
console.log('新长度:', length1); // 5