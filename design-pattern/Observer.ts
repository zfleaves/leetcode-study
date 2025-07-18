interface ObserverSubject {
	attach(observe: Observe): void;
	detach(observe: Observe): void;
	notify(): void;
}

class ConcreteSubject implements ObserverSubject {
	public state: number | undefined;

	private observers: Observe[] = [];

	public attach(observe: Observe): string {
		const isExist = this.observers.indexOf(observe);
		if (isExist >= 0) {
			return 'Subject: Observer has been attached already.';
		}
		this.observers.push(observe);
		return '';
	}

	public detach(observe: Observe): string {
		const observerIndex = this.observers.indexOf(observe);
		if (observerIndex === -1) {
			return 'Subject: Nonexistent observer.';
		}
		this.observers.splice(observerIndex, 1);
		return '';
	}

	public notify(): string[] {
		const result = [] as string[];
		for (const observer of this.observers) {
			result.push(observer.update(this))
		}
		return result;
	}

	public someBusinessLogic(): string[] {
		return this.notify();
	}
}

interface Observe {
	update(subject: ObserverSubject): string;
}

class ConcreteObserverA implements Observe {
	public update(subject: ObserverSubject): string {
		console.log('subject-ConcreteObserverA: ', subject);
		return  'ConcreteObserverA: Reacted to the event.';
	}
}

class ConcreteObserverB implements Observe {
	public update(subject: ObserverSubject): string {
		console.log('subject-ConcreteObserverB: ', subject);
		return  'ConcreteObserverB: Reacted to the event.';
	}
}

const subject = new ConcreteSubject();
subject.attach(new ConcreteObserverA())
subject.attach(new ConcreteObserverB())
const res = subject.someBusinessLogic();
console.log('res: ', res);