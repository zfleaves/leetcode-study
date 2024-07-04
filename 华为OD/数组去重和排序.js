/*
 * @Date: 2024-06-02 19:03:27
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 19:04:55
 * @FilePath: \leetcode-study\华为OD\数组去重和排序.js
 */
function removeDuplicatesAndSort(arr) {
    // Step 1: Count occurrences using an object  
    const countMap = {};
    let firstIndexMap = {}; // To store first index of each element  
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (!countMap[element]) {
            countMap[element] = 1;
            firstIndexMap[element] = i;
        } else {
            countMap[element]++;
        }
    }

    // Step 2: Create an array of objects with count and first index  
    const elementsWithCounts = Object.keys(countMap).map(key => ({
        element: key,
        count: countMap[key],
        firstIndex: firstIndexMap[key]
    }));

    // Step 3: Sort based on count (desc) and firstIndex (asc)  
    elementsWithCounts.sort((a, b) => {
        if (a.count === b.count) {
            return a.firstIndex - b.firstIndex;
        }
        return b.count - a.count; // Descending order for count  
    });

    // Step 4: Create a new array with unique elements in sorted order  
    const result = [];
    for (const {
            element
        } of elementsWithCounts) {
        if (!result.includes(element)) {
            result.push(element);
        }
    }

    return result;
}

// Example usage  
const array = [1, 2, 3, 1, 2, 4, 5, 1, 6, 2, 7];
const sortedUniqueArray = removeDuplicatesAndSort(array);
console.log(sortedUniqueArray); // Output should be sorted by count and first index