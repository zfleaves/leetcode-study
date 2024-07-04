class EventCenter {
    constructor() {
        this.subscribes = {}
    }

    addSubscribe(eventType, callBack) {
        if (!this.subscribes[eventType]) {
            this.subscribes[eventType] = []
        }
        this.subscribes[eventType].push(callBack)
    }

    removeSubscribe(eventType, callBack) {
        if (this.subscribes[eventType]) {
            this.subscribes[eventType] = this.subscribes[eventType].filter( cb => cb !== callBack)
        }
    }

    publish(eventType, ...args) {
        if (this.subscribes[eventType]) {
            this.subscribes[eventType].forEach(cb => {
                cb(...args)
            });
        }
    }
}

let user1 = {
    receviews: function(news) {
        console.log('用户1收到了：' + news)
    }
}

let user2 = {
    receviews: function(news) {
        console.log('用户2收到了：' + news)
    }
}

const eventCenter = new EventCenter()
// 添加订阅
eventCenter.addSubscribe('teach', user1.receviews)
eventCenter.addSubscribe('teach', user2.receviews)

eventCenter.publish('teach', '科技频道11点开始直播')

eventCenter.removeSubscribe('teach', user2.receviews)

eventCenter.publish('teach', '儿童频道10点开始直播')