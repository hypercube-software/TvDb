import { GlobalStore, StoreUpdate } from '../../src/stores/GlobalStore';

function subscribeAndSend(store: GlobalStore, path: string, input: { a: string; }, subscriptionPath: string): Promise<StoreUpdate> {
    return new Promise((resolve, reject) => {
        const subscription = store.subscribe(subscriptionPath, (path: StoreUpdate) => {
            try {
                subscription.unsubscribe();
                resolve(path);
            }
            catch (e) {
                reject(e);
            }
        });
        store.send(path, input);
    });
}


describe('GlobalStore tests', () => {

    it('clone object properly', () => {
        const store = new GlobalStore("my store");
        const input = {
            a: "b"
        };
        store.send("a.b.c", input);
        const output = store.get("a.b.c");

        expect(output.a).toEqual(input.a);
        output.a = "dirty";

        const clone = store.get("a.b.c");
        expect(clone.a).toEqual(input.a);
    });

    it('is notified properly', () => {
        const store = new GlobalStore("my store");
        const input = {
            a: "b"
        };
        const event: Promise<StoreUpdate> = subscribeAndSend(store, "a.b.c", input, "a.b.c");
        const expectedObject: StoreUpdate = {
            path: "a.b.c",
            value: input
        };
        return expect(event).resolves.toMatchObject(expectedObject);
    });

    it('is notified properly with \'.*\'', () => {
        const store = new GlobalStore("my store");
        const input = {
            a: "b"
        };
        const event: Promise<StoreUpdate> = subscribeAndSend(store, "a.b.c", input, "a.*");
        const expectedObject: StoreUpdate = {
            path: "a.b.c",
            value: input
        };
        return expect(event).resolves.toMatchObject(expectedObject);
    });

    it('is notified properly with \'*\'', () => {
        const store = new GlobalStore("my store");
        const input = {
            a: "b"
        };
        const event: Promise<StoreUpdate> = subscribeAndSend(store, "a.b.c", input, "*");
        const expectedObject: StoreUpdate = {
            path: "a.b.c",
            value: input
        };
        return expect(event).resolves.toMatchObject(expectedObject);
    });

});