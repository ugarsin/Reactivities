import { makeAutoObservable } from "mobx";

export class ActivityStore {
  filter = "all";
  startDate: Date | null = null;

  constructor() {
    makeAutoObservable(this);    
  }

  setFilter = (filter: string) => {
    this.filter = filter;
  };

  setStartDate = (date: Date | null) => {
    this.startDate = date;
  };
}