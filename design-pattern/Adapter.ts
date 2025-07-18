// 目标接口，客户端期望的接口
interface Target {
    request(): string;
}

// 被适配的类，具有不兼容的接口
class Adaptee {
    public specificRequest(): string {
        return '被适配者的特定请求';
    }
}

// 适配器类，将Adaptee的接口转换为Target接口
class Adapter implements Target {
    private adaptee: Adaptee;

    constructor(adaptee: Adaptee) {
        this.adaptee = adaptee;
    }

    public request(): string {
        const result = this.adaptee.specificRequest();
        return `适配器转换后的结果：${result}`;
    }
}

export { Target, Adaptee, Adapter };


// 客户端代码，期望使用Target接口
function clientCode(target: Target) {
    console.log(target.request());
}

// 使用示例
console.log('客户端：可以直接使用目标接口的对象');
const target = new Adapter(new Adaptee());
clientCode(target);