// 发布-订阅模式（Publish-Subscribe Pattern）是一种消息传递模式，
// 它允许发送者（发布者）发送消息而不关心有多少接收者（订阅者）关心这个消息，同样地，
// 接收者（订阅者）可以监听他们关心的消息，而不需要知道这些消息是何时发送的。这种解耦使得发送者和接收者之间可以灵活地交互，不需要直接相互通信。

// 使用例子
// 假设我们有一个新闻网站，网站上的用户可以订阅不同类型的新闻（如科技、政治、娱乐等）。
// 当新闻网站发布新文章时，所有订阅了相应类型的用户都应该收到通知。

// 创建一个用于存储订阅者的对象
const eventCenter = {
  subscribers: {},

  // 订阅方法
  subscribe(eventType, callback) {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }
    this.subscribers[eventType].push(callback);
  },

  // 发布方法
  publish(eventType, ...args) {
    if (this.subscribers[eventType]) {
      this.subscribers[eventType].forEach((callback) => {
        callback(...args);
      });
    }
  },

  // 退订方法
  unsubscribe(eventType, callback) {
    if (this.subscribers[eventType]) {
      this.subscribers[eventType] = this.subscribers[eventType].filter(
        (cb) => cb !== callback
      );
    }
  },
};

// 订阅者（用户）
const user1 = {
  receiveNews: function (news) {
    console.log("用户1收到新闻:", news);
  },
};

const user2 = {
  receiveNews: function (news) {
    console.log("用户2收到新闻:", news);
  },
};

// 订阅科技新闻
eventCenter.subscribe("tech", user1.receiveNews);
eventCenter.subscribe("tech", user2.receiveNews);

// 订阅娱乐新闻
eventCenter.subscribe("entertainment", user1.receiveNews);

// 发布科技新闻
eventCenter.publish("tech", "最新的科技进展");
// 输出:
// 用户1收到新闻: 最新的科技进展
// 用户2收到新闻: 最新的科技进展

// 发布娱乐新闻
eventCenter.publish("entertainment", "最新的娱乐八卦");
// 输出:
// 用户1收到新闻: 最新的娱乐八卦

// 用户2退订科技新闻
eventCenter.unsubscribe("tech", user2.receiveNews);

// 再次发布科技新闻
eventCenter.publish("tech", "另一项科技进展");
// 输出:
// 用户1收到新闻: 另一项科技进展
// 注意: 用户2没有收到通知，因为他们已经退订了

// 在这个例子中，eventCenter是一个中央事件中心，它负责存储和管理订阅者。subscribe方法用于添加订阅者，
// publish方法用于发布事件并通知所有订阅了该事件的订阅者，unsubscribe方法用于删除订阅者。
// 用户（在这个例子中是user1和user2）可以通过调用subscribe方法来订阅他们感兴趣的新闻类型，并通过receiveNews方法来接收通知。

// 消息中心（事件总线）
class MessageCenter {
  constructor() {
    this.subscribers = {};
  }

  // 订阅消息
  subscribe(roomId, callback) {
    if (!this.subscribers[roomId]) {
      this.subscribers[roomId] = [];
    }
    this.subscribers[roomId].push(callback);
  }

  // 发布消息
  publish(roomId, message) {
    if (this.subscribers[roomId]) {
      this.subscribers[roomId].forEach((callback) => {
        callback(message);
      });
    }
  }

  // 退订消息
  unsubscribe(roomId, callback) {
    if (this.subscribers[roomId]) {
      this.subscribers[roomId] = this.subscribers[roomId].filter(
        (cb) => cb !== callback
      );
    }
  }
}

// 创建一个消息中心实例
const messageCenter = new MessageCenter();

// 模拟聊天室客户端
class ChatClient {
  constructor(name, roomId) {
    this.name = name;
    this.roomId = roomId;

    // 订阅消息
    this.subscribeToChat();
  }

  // 订阅聊天室消息
  subscribeToChat() {
    messageCenter.subscribe(this.roomId, (message) => {
      console.log(`${this.name} 收到消息: ${message}`);
    });
  }

  // 发送消息
  sendMessage(message) {
    console.log(`${this.name} 发送消息: ${message}`);
    // 发布消息到聊天室
    messageCenter.publish(this.roomId, `${this.name}: ${message}`);
  }
}

// 创建两个聊天室客户端，并让它们加入同一个聊天室
const client1 = new ChatClient("Alice", "room1");
const client2 = new ChatClient("Bob", "room1");

// Alice 发送一条消息
client1.sendMessage("Hello, Bob!");

// Bob 也会收到这条消息，因为他订阅了同一个聊天室
// 当Bob也发送消息时，Alice也会收到
