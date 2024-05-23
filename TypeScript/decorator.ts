function methodDecorator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  // 修改方法的行为
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Method ${propertyName} is called with arguments:`, args);
    return originalMethod.apply(this, args);
  };
}

class MyClass {
  @methodDecorator
  greet(name: string) {
    return `Hello, ${name}!`;
  }
}

const obj = new MyClass();
console.log(obj.greet("World")); // 输出: Method greet is called with arguments: [ 'World' ]，然后输出: Hello, World!
