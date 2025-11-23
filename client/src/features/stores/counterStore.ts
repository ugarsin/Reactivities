// import { action, makeObservable, observable } from "mobx";
import { makeAutoObservable } from "mobx";

export class CounterStore {
  title = "Counter store";
  count = 3;
  events: string[] = [`Intial count is ${this.count}`]

  // constructor() {
  //   makeObservable(
  //     this,
  //     {
  //       title: observable,
  //       count: observable,
  //       increment: action,
  //       decrement: action
  //     }
  //   );
  // }
  constructor() {
    makeAutoObservable(this);
  }

  increment = (amount = 1) => {
    this.count += amount;
    this.events.push(`Incremented by ${amount}, count is now ${this.count}`);
  }

  decrement = (amount = 1) => {
    this.count -= amount;
    this.events.push(`Decremented by ${amount}, count is now ${this.count}`);
  }

  get eventCount() {
    return this.events.length;
  }
}