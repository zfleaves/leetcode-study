function mergeSort(arr) {
    const len = arr.length
    if (len < 2) return arr
    const mid = Math.floor(len / 2)
    let left = arr.slice(0, mid)
    let right = arr.slice(mid)
    return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
    console.log('%c 🌰 right: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', right);
    const result = []
    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift())
        } else {
            result.push(right.shift())
        }
    }

    while (left.length) {
        result.push(left.shift())
    }
    while (right.length) {
        result.push(right.shift())
    }
    return result
}

const arr = [56, 12, 80, 91, 29]
const result = mergeSort(arr)
console.log('result', result);