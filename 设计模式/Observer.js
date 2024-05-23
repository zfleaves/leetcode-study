// 观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新

// 抽象观察者（Observer）
class Observer {
  constructor(name) {
    this.name = name;
  }

  // 更新方法，由具体观察者实现
  update(price) {
    throw new Error("This method must be implemented by subclasses.");
  }
}

// 具体观察者（Concrete Observer）
// 具体观察者（Concrete Observer）
class Bidder extends Observer {
  constructor(name, maxBid) {
    super(name);
    this.maxBid = maxBid; // 每个竞价者的最大出价限额不同
    this.lastBid = 0; // 记录自己上次的出价，避免重复出价
  }

  // 当价格更新时，竞价者会检查是否要出价
  update(price) {
    if (price < this.maxBid && price > this.lastBid) {
      // 只有当价格低于最大出价限额且高于自己上次出价时，才出价
      const newBid = this.calculateBid(price); // 假设有一个计算新出价的方法
      console.log(`${this.name} 出价：${newBid}`);
      this.lastBid = newBid; // 更新自己的上次出价
      // 在这里，可以触发主题的通知来模拟其他人也看到新出价（但在这个简单例子中不需要）
    }
  }

  // 模拟出价计算逻辑，这里只是简单地返回比当前价格高一点的数
  calculateBid(currentPrice) {
    // 你可以根据具体的业务逻辑来实现更复杂的出价策略
    return currentPrice + Math.floor(Math.random() * 10) + 1; // 随机加价1到10个单位
  }
}

// 抽象主题（Subject）
class Subject {
  constructor() {
    this.observers = [];
    this.currentPrice = 0;
  }

  // 注册观察者
  registerObserver(observer) {
    this.observers.push(observer);
  }

  // 移除观察者
  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // 通知所有观察者
  notifyObservers() {
    this.observers.forEach((observer) => {
      observer.update(this.currentPrice);
    });
  }

  // 设定价格并通知所有观察者
  setPrice(price) {
    this.currentPrice = price;
    this.notifyObservers();
  }
}

// 使用示例
const auctioneer = new Subject(); // 拍卖师（主题）

const bidder1 = new Bidder("竞价者A", 100);
const bidder2 = new Bidder("竞价者B", 150);

// 注册观察者
auctioneer.registerObserver(bidder1);
auctioneer.registerObserver(bidder2);

// 开始拍卖，设置初始价格
auctioneer.setPrice(10); // 触发通知，但价格太低，无人出价

// 有人出价
auctioneer.setPrice(50); // 触发通知，竞价者A和B可能会出价

// 拍卖结束，可以设置一个很高的价格来结束拍卖
auctioneer.setPrice(200); // 触发通知，但价格太高，无人再出价
