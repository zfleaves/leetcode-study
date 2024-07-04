function getLastIndex(arr, n) {  
    // 初始化一个数组来记录已占用的座位索引  
    const occupied = [];  
  
    // 遍历所有座位状态  
    for (let i = 0; i < arr.length; i++) {  
        // 如果座位状态小于0，表示该座位已离开，从occupied数组中移除  
        if (arr[i] < 0) {  
            const index = -arr[i] - 1; // 假设座位索引从1开始，需要转换为从0开始  
            occupied.splice(occupied.indexOf(index), 1);  
            continue;  
        }  
  
        // 如果没有已占用的座位，则第一个员工坐在0号位置  
        if (occupied.length === 0) {  
            occupied.push(0);  
        } else if (occupied.length === 1) {  
            // 第二个员工坐在n-1号位置  
            occupied.push(n - 1);  
        } else if (occupied.length > 1 && occupied.length < n) {  
            // 找到最大间隔的座位  
            let maxDis = 0;  
            let left = 0;  
            for (let j = 1; j < occupied.length; j++) {  
                const dis = occupied[j] - occupied[j - 1] - 1; // 间隔计算要减去一个位置  
                if (dis > maxDis) {  
                    maxDis = dis;  
                    left = occupied[j - 1] + 1; // 左侧已占用座位的下一个位置  
                }  
            }  
            // 如果找到最大间隔的座位在末尾，需要判断是否是最后一个员工  
            const seatIndex = left + Math.floor(maxDis / 2); // 可能坐在间隔中间或者靠近左边的位置  
            occupied.push(seatIndex);  
              
            // 如果是最后一个员工，返回其占用的位置  
            if (i === arr.length - 1) {  
                return seatIndex;  
            }  
        } else if (occupied.length === n) {  
            // 所有座位都已占用，返回-1  
            return -1;  
        }  
    }  
  
    // 如果函数没有提前返回，则默认返回-1（理论上这种情况不会发生，除非输入有误）  
    return -1;  
}  
  
// 示例用法  
const arr = [1,1,1,-4,1];  
const n = 10; // 假设座位数量与数组长度相同  
const lastIndex = getLastIndex(arr, n);  
console.log(`最后一个员工坐在位置: ${lastIndex}`);