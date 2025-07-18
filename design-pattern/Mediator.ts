interface Mediator {
    notify(sender: object, event: string): void;
}

class ConcreteMediator implements Mediator {
    private component1: Component1;

    private component2: Component2;

    constructor(c1: Component1, c2: Component2) {
        this.component1 = c1;
        this.component1.setMediator(this);
        this.component2 = c2;
        this.component2.setMediator(this);
    }

    public notify(sender: object, event: string): void {
        if (event === 'A') {
            this.component2.doC();
        }

        if (event === 'D') {
            this.component1.doB();
            this.component2.doC();
        }
    }
}

class BaseComponent {
    protected mediator: Mediator;

    constructor(mediator?: Mediator) {
        this.mediator = mediator!;
    }

    public setMediator(mediator: Mediator): void {
        this.mediator = mediator;
    }
}

class Component1 extends BaseComponent {
    public doA(): string {
        this.mediator.notify(this, 'A');
        return 'component 1 does A ';
    }

    public doB(): string {
        this.mediator.notify(this, 'B');
        return 'component 1 does B ';
    }
}

class Component2 extends BaseComponent {
    public doC(): string {
        this.mediator.notify(this, 'C');
        return 'component 2 does C ';
    }

    public doD(): string {
        this.mediator.notify(this, 'D');
        return 'component 2 does D ';
    }
}

export { Mediator, ConcreteMediator, BaseComponent, Component1, Component2 };

// 使用示例
const c1 = new Component1();
const c2 = new Component2();
const mediator = new ConcreteMediator(c1, c2);

console.log('Client triggers operation A.');
c1.doA();