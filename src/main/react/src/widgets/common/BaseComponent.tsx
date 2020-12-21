/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Component } from 'react';

export default class BaseComponent<P, S> extends Component<P, S> {
    constructor(props: P) {
        super(props);

        this.autoBind();
    }
    /**
     * This method will make your life easier. It bind every method starting with "on" to "this", so you can use them as callback without using bind.
     * Technically this method create "shortcuts" in the current object, the prototype chain wont be used anymore on the binded methods
     * 
     * We restric ourselves to methods starting with "on", because binding all methods would be completely crazy.
     * 
     */
    autoBind():void {
        let currentObject: any = this;
        const self: any = this;
        while  (currentObject.constructor !== BaseComponent) {
            for (const name of Object.getOwnPropertyNames(currentObject)) {

                if (typeof currentObject[name] === "function") {

                    // method found in the prototype chain
                    const method = self[name];

                    if (name.length > 3 &&
                        (name.startsWith("on") || name.startsWith("async")) &&
                        name[2] >= 'A' && name[2] <= 'Z') {
                        //console.log("Autobind method " + this.constructor.name + "." + name);

                        // use bind to create a new method that me place in the current object
                        self[name] = method.bind(this);
                    }

                }
            }
           
            // follow the prototype chain
            currentObject = Object.getPrototypeOf(currentObject);

        }
    }
}