/*
 * @Date: 2024-06-25 12:41:01
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-25 12:53:02
 * @FilePath: \leetcode-study\write\desgin\Observe.js
 */
class Observe {
    constructor(name) {
        this.name = name
    }
    updatePrice(price) {

    }
}

class Bidder extends Observe {
    constructor(name, mastBid) {
        super(name)
        this.lastBid = 0
        this.mastBid = mastBid
    }
    updatePrice(price) {
        if (price >=0 && price < this.mastBid) {
            this.lastBid = price + Math.floor(Math.random() * 10 + 1)
            console.log(`${this.name}出价了${this.lastBid}元`)
        }
    }
}


class Subject {
    constructor() {
        this.observes = []
    }

    registerObserve(observe) {
        // console.log('%c 🍒 this.observes: ', 'font-size:20px;bac/kground-color: #7F2B82;color:#fff;', this.observes);
        if (this.observes.includes(observe) > 0) {
            throw new Error('该观察者已注册')
        }
        this.observes.push(observe)
    }
    unObserve(observe) {
        this.observes = this.observes.filter(v => v !== observe)
    }
    // 设置价格
    setPrice(price) {
        this.currentPrice = price
        this.notifyObserves()
    }

    notifyObserves() {
        this.observes.forEach(ob => {
            ob.updatePrice(this.currentPrice)
        })
    }
}

const bidder1 = new Bidder('张三', 100)
const bidder2 = new Bidder('李四', 50)

const subject = new Subject()
subject.registerObserve(bidder1)
subject.registerObserve(bidder2)

// subject.setPrice(20)
subject.setPrice(62)