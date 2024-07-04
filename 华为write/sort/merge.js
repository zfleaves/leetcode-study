function mergeSort(arr) {
    const n = arr.length
    if (n < 2) return arr
    const mid = Math.floor(n / 2)
    const left = arr.slice(0, mid)
    const right = arr.slice(mid)
    return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
    const res = []
    while(left.length && right.length) {
        if (left[0] <= right[0]) {
            res.push(left.shift())
        } else {
            res.push(right.shift())
        }
    }
    while (left.length) {
        res.push(left.shift())
    }
    while (right.length) {
        res.push(right.shift())
    }
    return res
}

const arr = [12, 35, 99, 18, 76, 6]
const result = mergeSort(arr)
console.log('result', result);