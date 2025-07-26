import { makeAutoObservable } from 'mobx';

export class ViewedStocksStore {
  viewed: string[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem('viewedStocks');
    this.viewed = stored ? JSON.parse(stored) : [];
  }

  add(symbol: string) {
    if (!this.viewed.includes(symbol)) {
      this.viewed.unshift(symbol);
      localStorage.setItem('viewedStocks', JSON.stringify(this.viewed));
    }
  }

  remove(symbol: string) {
    this.viewed = this.viewed.filter((s) => s !== symbol);
    localStorage.setItem('viewedStocks', JSON.stringify(this.viewed));
  }

  clear() {
    this.viewed = [];
    localStorage.removeItem('viewedStocks');
  }
}

const store = new ViewedStocksStore();
export const useViewedStocksStore = () => store;
