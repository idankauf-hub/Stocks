import { makeAutoObservable, runInAction } from 'mobx';
import axios, { AxiosRequestConfig } from 'axios';
import React, { createContext, useContext } from 'react';
import { Quote } from '../../../shared/types/quote';
import { addToPortfolio, fetchQuote, getPortfolio, removeFromPortfolio } from '../utils/api';

class PortfolioStore {
    stocks: string[] = [];
    quotes: Record<string, Quote> = {};
    quoteTimestamps: Record<string, number> = {};
    hasLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    private async requestWithAuth<T = any>(config: AxiosRequestConfig): Promise<T> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('User not authenticated');

        const response = await axios({
            ...config,
            headers: {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    }

    async loadInitialPortfolio() {
        if (this.hasLoaded) return;
        try {
            const data = await getPortfolio();
            runInAction(() => {
                this.stocks = data.stocks || [];
                this.hasLoaded = true;
            });
        } catch (error: any) {
            console.error('Failed to load portfolio:', error?.response?.data || error.message);
        }
    }

    async loadQuote(symbol: string): Promise<Quote | null> {
        const now = Date.now();
        const TTL = 60_000;

        if (this.quotes[symbol] && now - (this.quoteTimestamps[symbol] ?? 0) < TTL) {
            return this.quotes[symbol];
        }

        try {
            const data = await fetchQuote(symbol);
            runInAction(() => {
                this.quotes[symbol] = data;
                this.quoteTimestamps[symbol] = now;
            });
            return data;
        } catch (err) {
            console.error(`Failed to load quote for ${symbol}`, err);
            return null;
        }
    }

    async addStock(symbol: string) {
        try {
            await addToPortfolio(symbol);
            runInAction(() => {
                if (!this.stocks.includes(symbol)) {
                    this.stocks.push(symbol);
                }
            });
        } catch (error: any) {
            console.error('Failed to add stock:', error?.response?.data || error.message);
        }
    }

    async removeStock(symbol: string) {
        try {
            await removeFromPortfolio(symbol);
            runInAction(() => {
                this.stocks = this.stocks.filter((s) => s !== symbol);
                delete this.quotes[symbol];
            });
        } catch (error: any) {
            console.error('Failed to remove stock:', error?.response?.data || error.message);
        }
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
