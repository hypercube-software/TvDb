/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, Observer, ConnectableObservable, Subscription } from 'rxjs';
import { publish, filter } from 'rxjs/operators';

/**
 * The class GlobalStore can used as a singleton to store values into a shared state between various application components.
 * The state is immutable, that mean nobody can't change its content. The only way is to send a message with the method {@link GlobalStore.send}
 * 
 * This is an implementation of the Flux pattern design introduced by Facebook. Here we use RxJS under the hood to implement it.
 * (there are other implementations, more complex, like [Facebook Flux](https://facebook.github.io/flux/), [Redux](http://redux.js.org/))
*/


// adapted from https://stackoverflow.com/a/25921504/7921777
const deepCopy = (o: any) => {
    if (o === null)
        return null;
    if (o === undefined)
        return undefined;
    if (typeof(o)!=="object")
        return o;
    const out: any = Array.isArray(o) ? [] : {};
    for (const key in o) {
        const v = o[key];
        out[key] = (typeof v === "object" && v !== null) ? deepCopy(v) : v;
    }
    return out;
};

export interface StoreUpdate {
    path: string;
    value: any;
}

export const ANYTHING_KEY = "*"

interface StoreState {
    [key: string]: any;
}

export { Subscription } from 'rxjs';

export class GlobalStore {
    /**
     * The output bus. Application components will subscribe to it.
     */
    private outputBus: ConnectableObservable<StoreUpdate>;
    /**
     * The output observer. Used to send event to the output bus
    */
    private outputObserver: Observer<StoreUpdate>;
    /**
     * The internal state of the store (a generic object)
     */
    private state: StoreState;
    /**
     * Name of the store used for logging
     */
    private _name: string;

    get name(): string {
        return this._name;
    }
    constructor(name: string) {
        this._name = name;
        // We must cast pipe() to ConnectableObservable due to an issue in TypeScript
        // https://github.com/ReactiveX/rxjs/issues/2972
        this.outputBus = new Observable<StoreUpdate>(
            (obs: Observer<StoreUpdate>) => {
                this.outputObserver = obs;
            }
        )
            .pipe(publish()) as ConnectableObservable<StoreUpdate>;

        // The output bus have to be Hot
        // (one single stream for all subscribers)
        this.outputBus.connect();

        this.state = {};
    }
    /**
     * Subscribe to an update of the state
     * 
     * @param {String} path - path where to store the value ("a.b.c" or "a.*" are allowed)
     * @param {Function} onUpdate - callback that will be called when the state is updated. It will receive the path in parameter, not the value. Use get for that.
     * @return {Subscription} - object to use to unsubscribe
     */
    subscribe(path: string, onUpdate: (path: StoreUpdate) => void): Subscription {
        if (!path)
            throw new Error("You can't pass an empty path to subscribe");

        const subscribeCallBack = function (update: StoreUpdate) {
            if (onUpdate) {
                try {
                    onUpdate(update);
                }
                catch (error) {
                    console.error(`Unexpected error in ${this.name} notification (${update.path}): ${error}`);
                }
            }
        };

        if (path.endsWith("." + ANYTHING_KEY)) {
            const subscribePath: string = path.substr(0, path.length - 1);
            return this.outputBus.pipe(filter(update => update.path.startsWith(subscribePath)))
                .subscribe(subscribeCallBack);
        }
        if (path === ANYTHING_KEY) {
            return this.outputBus.pipe().subscribe(subscribeCallBack);
        }
        else {
            return this.outputBus.pipe(filter(update => update.path === path))
                .subscribe(subscribeCallBack);
        }
    }
    /**
     * Callback called when a new update comes from the application
     * @private
     * @param {Function} update - callback that will be called when the state is updated
     */
    private onValue(update: StoreUpdate) {
        console.log(`${this.name} receive: ${update.path},${update.value}`);

        let s = this.state;
        const path = update.path.split('.');
        path.forEach((f, idx) => {
            if (idx !== path.length - 1) {
                if (s[f] === undefined) {
                    s[f] = {};
                }
                s = s[f];
            }
            else {
                s[f] = update.value;
            }
        }
        );
        if (this.outputObserver.closed) {
            throw new Error(`Unable to send. The store ${this.name} is dead due to previous errors.`);
        }
        try {
            this.outputObserver.next(update);
        }
        catch (error) {
            console.error(`Unexpected error in ${this.name} notification (${update.path}): " + error`);
        }
    }
    /**
     * send an update event to the input Bus
     * @param {String} path - where to store the value
     * @param {Object} value - the value to store
     */
    send(path: string, value: any):void {
        if (!path)
            throw new Error("path must be set");

        this.onValue({ path: path, value: value });
    }
    /**
     * Retreive a value from the immutable state.
     * We make the difference between a value present equal to **null** and
     * a value not present. In this case it return **undefined**
     * 
     * @param {String} path - where to get the value
     * @return {Object} - the value or **undefined** if it does not exists
     */
    get(path: string):any {
        if (!path)
            throw new Error("You can't pass an empty path to get() method");

        const p = path.split('.');
        const value = p.reduce((prev, current) => (prev ? prev[current] : undefined), this.state);

        // deep clone to keep our state protected
        return deepCopy(value);
    }
}


