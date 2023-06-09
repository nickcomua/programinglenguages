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
}
