import { makeAutoObservable } from 'mobx';

export class ViewedStocksStore {
  viewed: string[] = [];
  userEmail: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(email: string) {
    this.userEmail = email;
    const stored = localStorage.getItem(`viewedStocks_${email}`);
    this.viewed = stored ? JSON.parse(stored) : [];
  }

  add(symbol: string) {
    if (!this.userEmail) return;

    if (!this.viewed.includes(symbol)) {
      this.viewed.unshift(symbol);
      localStorage.setItem(
        `viewedStocks_${this.userEmail}`,
        JSON.stringify(this.viewed)
      );
    }
  }

  remove(symbol: string) {
    if (!this.userEmail) return;

    this.viewed = this.viewed.filter((s) => s !== symbol);
    localStorage.setItem(
      `viewedStocks_${this.userEmail}`,
      JSON.stringify(this.viewed)
    );
  }

  clear() {
    if (!this.userEmail) return;

    this.viewed = [];
    localStorage.removeItem(`viewedStocks_${this.userEmail}`);
  }
}

export const viewedStocksStore = new ViewedStocksStore();
export const useViewedStocksStore = () => viewedStocksStore;
