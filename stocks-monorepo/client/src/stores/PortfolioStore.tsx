import { makeAutoObservable } from 'mobx';
import React, { createContext, useContext } from 'react';

class PortfolioStore {
    stocks: string[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    addStock(symbol: string) {
        if (!this.stocks.includes(symbol)) {
            this.stocks.push(symbol);
        }
    }

    removeStock(symbol: string) {
        this.stocks = this.stocks.filter((s) => s !== symbol);
    }
}

const PortfolioStoreContext = createContext<PortfolioStore | null>(null);
export const PortfolioStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const store = React.useMemo(() => new PortfolioStore(), []);
    return (
        <PortfolioStoreContext.Provider value={store}>
            {children}
        </PortfolioStoreContext.Provider>
    );
};

export const usePortfolioStore = () => {
    const store = useContext(PortfolioStoreContext);
    if (!store) throw new Error('usePortfolioStore must be used within PortfolioStoreProvider');
    return store;
};
