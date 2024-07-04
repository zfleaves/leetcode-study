function selectSort(arr) {
    let n = arr.length
    let minIndex = 0
    for (let i = 0; i < n; i++) {
        minIndex = i
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        let temp = arr[minIndex]
        arr[minIndex] = arr[i]
        arr[i] = temp
    }
    return arr
}

const arr = [12, 35, 99, 18, 76]
const result = selectSort(arr)
console.log('result', result);