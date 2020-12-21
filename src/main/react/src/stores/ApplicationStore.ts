import {GlobalStore} from './GlobalStore'

export {StoreUpdate,Subscription,ANYTHING_KEY} from './GlobalStore';
export const EXERNAL_SEARCH_KEY="search.externalSearch"

class Store extends GlobalStore
{
    constructor(name: string) {
        super(name);

        this.send(EXERNAL_SEARCH_KEY,false);
    }

    get externalSearch():boolean
    {
        return this.get(EXERNAL_SEARCH_KEY);
    }
}
export const ApplicationStore = new Store("ApplicationStore");
