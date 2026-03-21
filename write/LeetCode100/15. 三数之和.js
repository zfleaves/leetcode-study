// 给你一个整数数组 nums ，判断是否存在三元组[nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。
// 注意：答案中不可以包含重复的三元组。
// 输入：nums = [-1, 0, 1, 2, -1, -4]
// 输出：[[-1, -1, 2], [-1, 0, 1]]
// 解释：
// nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
// nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
// nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
// 不同的三元组是[-1, 0, 1] 和[-1, -1, 2] 。

var threeSum = function (nums) {
    nums = nums.sort((a, b) => a - b);
    const n = nums.length;
    let res = [];
    for (let i = 0; i < n; i++) {
        if (nums[i] > 0) break;
        if (i > 0 && nums[i] === nums[i - 1]) {
            continue;
        }
        let left = i + 1, right = n - 1;
        while (left < right) {
            const total = nums[i] + nums[left] + nums[right];
            if (total === 0) {
                res.push([nums[i], nums[left], nums[right]]);
                while(left < right && nums[left] === nums[left + 1]) left++;
                while(left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (total > 0) {
                right--;
            } else {
                left++;
            }
        }
    }
    return res;
}
const nums = [-1, 0, 1, 2, -1, -4];
console.log('threeSum: ', threeSum(nums));