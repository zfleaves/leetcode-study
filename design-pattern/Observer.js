console.log('res: ', 242);
var ConcreteSubject = /** @class */ (function () {
    function ConcreteSubject() {
        this.observers = [];
    }
    ConcreteSubject.prototype.attach = function (observe) {
        var isExist = this.observers.indexOf(observe);
        if (isExist >= 0) {
            return 'Subject: Observer has been attached already.';
        }
        this.observers.push(observe);
        return '';
    };
    ConcreteSubject.prototype.detach = function (observe) {
        var observerIndex = this.observers.indexOf(observe);
        if (observerIndex === -1) {
            return 'Subject: Nonexistent observer.';
        }
        this.observers.splice(observerIndex, 1);
        return '';
    };
    ConcreteSubject.prototype.notify = function () {
        var result = [];
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            result.push(observer.update(this));
        }
        return result;
    };
    ConcreteSubject.prototype.someBusinessLogic = function () {
        return this.notify();
    };
    return ConcreteSubject;
}());
var ConcreteObserverA = /** @class */ (function () {
    function ConcreteObserverA() {
    }
    ConcreteObserverA.prototype.update = function (subject) {
        console.log('subject-ConcreteObserverA: ', subject);
        return 'ConcreteObserverA: Reacted to the event.';
    };
    return ConcreteObserverA;
}());
var ConcreteObserverB = /** @class */ (function () {
    function ConcreteObserverB() {
    }
    ConcreteObserverB.prototype.update = function (subject) {
        console.log('subject-ConcreteObserverB: ', subject);
        return 'ConcreteObserverB: Reacted to the event.';
    };
    return ConcreteObserverB;
}());
var subject = new ConcreteSubject();
subject.attach(new ConcreteObserverA());
subject.attach(new ConcreteObserverB());
var res = subject.someBusinessLogic();
console.log('res: ', res);
