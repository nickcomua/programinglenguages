import { localStorageStore } from "@skeletonlabs/skeleton";
import { get } from "svelte/store";
import type { Writable } from "svelte/store";
export class GlobalState {
    // The Singleton's instance
    private static instance: GlobalState;

    // The global state data
    private state: Writable<Record<string, any>>

    // The Singleton's constructor should always be private to prevent direct 
    // construction calls with the `new` operator.
    private constructor() {
        this.state = localStorageStore<Record<string, any>>('GlobalState', {})
        // Initialize your global state data here
    }

    // The static method that controls the access to the singleton instance.
    public static getInstance(): GlobalState {
        if (!GlobalState.instance) {
            GlobalState.instance = new GlobalState();
        }

        return GlobalState.instance;
    }

    // Method to get a state value
    public get(key: string): any {
        return get(this.state)?.[key];
    }

    // Method to set a state value
    public set(key: string, value: any): void {
        this.state.set({ ...get(this.state), [key]: value });
    }

    public getAll(): any {
        return get(this.state)
    }

    public setAll(data: any) {
        this.state.set(data)
    }
    // Memento related methods
    // public save(): Memento {
    //     return new ConcreteMemento(JSON.stringify(get(this.state)));
    // }

    // public restore(memento: Memento): void {
    //     this.state.set(JSON.parse(memento.getState()));
    // }
}



interface Memento {
    getState(): string;
    getName(): string;
    getDate(): string;
}

class ConcreteMemento implements Memento {
    private state: string;
    private date: string;

    constructor(state: string) {
        this.state = state;
        this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    public getState(): string {
        return this.state;
    }

    public getName(): string {
        return `${this.date} / (${this.state.substr(0, 9)}...)`;
    }

    public getDate(): string {
        return this.date;
    }
}

export class Caretaker {
    private mementos: Memento[] = [];
    historyExist: boolean

    constructor() {
        this.historyExist = false
    }

    public backup(): void {
        this.mementos.push(new ConcreteMemento(JSON.stringify(GlobalState.getInstance().getAll())));
        console.log(this.mementos.length);
        
        this.historyExist = (this.mementos.length > 1)
    }

    public undo(): void {
        if (!this.mementos.length) {
            return;
        }

        const memento = this.mementos.pop();
        //@ts-ignore
        GlobalState.getInstance().setAll(JSON.parse(memento.getState()))
    }

    public showHistory(): void {
        for (const memento of this.mementos) {
            console.log(memento.getName());
        }
    }

}
