// boolean（布尔类型）
// number（数字类型）
// string（字符串类型）
// array（数组类型）
// tuple（元组类型）
// enum（枚举类型）
// any（任意类型）
// null 和 undefined 类型
// void 类型
// never 类型
// object 对象类型


// array（数组类型）
// 方式一：元素类型后面接上 []
const list:[string, number] = ['1', 2]

// 方式二：使用数组泛型，Array<元素类型>： 其元素可以是多种类型（即联合类型）
const nums: Array<string | number> = ['1', 2]

// tuple
// 元祖类型，允许表示一个已知元素数量和类型的数组，各元素的类型不必相同
// 定义一个元祖类型，包含一个字符串、一个数字和一个布尔值  
type MyTuple = [string, number, boolean];  
// 创建一个符合 MyTuple 类型的变量  
let myVariable: MyTuple = ['Hello', 42, true];  
// 尝试给元祖中的元素赋一个错误类型的值将会导致编译错误  
// myVariable[0] = 42; // 错误，因为第一个元素必须是字符串

// 如果你想要定义一个变量，其值可以是多种不同的元祖类型之一（即元祖的联合类型），你可以这样做
// 定义两个元祖类型  
type Tuple1 = [string, number];  
type Tuple2 = [boolean, string[]];  
  
// 定义一个变量，其类型是两个元祖类型的联合  
let myUnionTuple: Tuple1 | Tuple2;  
  
// 你可以给 myUnionTuple 赋值为任何一个元祖类型  
myUnionTuple = ['Hello', 42];      // 赋值为 Tuple1 类型的元祖  
myUnionTuple = [true, ['world']];  // 赋值为 Tuple2 类型的元祖  
  
// 但是你不能同时给 myUnionTuple 赋值为两个元祖类型的混合  
// myUnionTuple = ['Hello', true, 42]; // 错误，因为这不是 Tuple1 或 Tuple2  
  
// 当你访问 myUnionTuple 的元素时，你需要进行类型断言或使用类型守卫来确保你正在访问正确的类型  
if (typeof myUnionTuple[0] === 'string') {  
    // 在这里，你可以安全地假设 myUnionTuple 是 Tuple1 类型的  
    // console.log(myUnionTuple[1].toFixed()); // 如果 myUnionTuple 是 Tuple2，这里会报错  
}

// enum
// enum类型是对JavaScript标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字
// 定义一个枚举类型  
enum Color {  
    Red,  
    Green,  
    Blue  
}  
  
// 默认情况下，Red = 0, Green = 1, Blue = 2  
  
// 也可以手动为枚举成员赋值  
enum ColorWithValues {  
    Red = 1,  
    Green = 2,  
    Blue = 4  
    // 注意：如果没有显式地为枚举成员赋值，则它的值会是前一个枚举成员的值加1。  
    // 如果在这个例子中为 Blue 不赋值，那么 Blue 的值会是 3（因为 Green 的值是 2）。  
}
// 使用枚举  
let c: Color = Color.Green;  
console.log(c); // 输出：1（注意这里输出的是数值，
// 如果你想获取枚举成员的名字，可以使用 TypeScript 的反向映射  
console.log(Color[1]); // 输出："Green"  
// 枚举类型也可以作为其他类型的一部分，例如数组  
let colors: Color[] = [Color.Red, Color.Blue];  
  
// 枚举类型也可以作为函数参数或返回值的类型  
function printColor(color: Color) {  
    console.log(Color[color]);  
}  
    
// void
// 用于标识方法返回值的类型，表示该方法没有返回值。
function hello(): void {
    alert("Hello Runoob");
}