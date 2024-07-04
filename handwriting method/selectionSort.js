// 首先在未排序的数列中找到最小(or最大)元素，然后将其存放到数列的起始位置

// 然后再从剩余未排序的元素中继续寻找最小(or最大)元素，然后放到已排序序列的末尾

function selectionSort (arr) {
    let len = arr.length
    let minIndex = 0
    for (var i = 0; i < len - 1; i++) {
        minIndex = i
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr
}

const arr = [56,12,80,91,29]
const result = selectionSort(arr)
console.log('result', result);