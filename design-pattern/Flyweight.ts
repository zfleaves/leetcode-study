// 享元类，包含共享状态
class Flyweight {
    private sharedState: string[]; // 共享状态，存储不变的数据

    constructor(sharedState: string[]) {
        this.sharedState = sharedState;
    }

    // 操作方法，结合共享状态和唯一状态
    public operation(uniqueState: string[]): { shared: string[]; unique: string[] } {
        const s = this.sharedState;
        const u = uniqueState;
        return { shared: s, unique: u };
    }
}

// 享元工厂类，负责创建和管理享元对象
class FlyweightFactory {
    private flyweights: { [key: string]: Flyweight } = <any>{}; // 存储享元对象的字典

    // 初始化时创建初始的享元对象
    constructor(initialFlyweights: string[][]) {
        for (const state of initialFlyweights) {
            this.flyweights[this.getKey(state)] = new Flyweight(state);
        }
    }

    // 生成享元对象的唯一键
    private getKey(state: string[]): string {
        return state.join('_');
    }

    // 获取享元对象，如果不存在则创建新的
    public getFlyweight(sharedState: string[]): Flyweight {
        const key = this.getKey(sharedState);

        if (!(key in this.flyweights)) {
            console.log("FlyweightFactory: Can't find a flyweight, creating new one.");
            this.flyweights[key] = new Flyweight(sharedState);
        } else {
            console.log('FlyweightFactory: Reusing existing flyweight.');
        }

        return this.flyweights[key];
    }

    // 列出所有享元对象
    public listFlyweights(): void {
        const count = Object.keys(this.flyweights).length;
        console.log(`\nFlyweightFactory: I have ${count} flyweights:`);
        for (const key in this.flyweights) {
            console.log(key);
        }
    }
}

// 创建享元工厂实例并初始化一些享元对象
const factory = new FlyweightFactory([
    ['chenghuai', 'Camaro2018', 'pink'],
    ['huaicheng', 'C300', 'black'],
    ['xianzao', 'C500', 'red'],
    ['BMW', 'M5', 'red'],
    ['BMW', 'X6', 'white'],
]);

// 列出所有享元对象
factory.listFlyweights();

// 导出类和方法
export { Flyweight, FlyweightFactory, factory };

// 添加使用示例
function addCarToDatabase(
    factory: FlyweightFactory, // 享元工厂实例
    plates: string,           // 车牌号，唯一状态
    owner: string,            // 车主，唯一状态
    brand: string,            // 品牌，共享状态
    model: string,            // 型号，共享状态
    color: string,            // 颜色，共享状态
) {
    console.log('\nClient: Adding a car to database.');
    const flyweight = factory.getFlyweight([brand, model, color]);

    // 使用享元对象的操作方法
    flyweight.operation([plates, owner]);
}

// 添加车辆到数据库的示例
addCarToDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'M5', 'red');
addCarToDatabase(factory, 'CL678IR', 'James Doe', 'BMW', 'X1', 'red');

// 再次列出所有享元对象
factory.listFlyweights();
