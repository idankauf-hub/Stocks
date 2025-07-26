import { makeAutoObservable, runInAction } from 'mobx';
import axios, { AxiosRequestConfig } from 'axios';
import React, { createContext, useContext } from 'react';

interface PortfolioResponse {
    stocks: string[];
}

class PortfolioStore {
    stocks: string[] = [];
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
            const data = await this.requestWithAuth<PortfolioResponse>({
                method: 'GET',
                url: '/api/portfolio',
            });

            runInAction(() => {
                this.stocks = data.stocks || [];
                this.hasLoaded = true;
            });
        } catch (error: any) {
            console.error('Failed to load portfolio:', error?.response?.data || error.message);
        }
    }

    async addStock(symbol: string) {
        try {
            await this.requestWithAuth({
                method: 'POST',
                url: '/api/portfolio/add',
                data: { symbol },
            });

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
            await this.requestWithAuth({
                method: 'POST',
                url: '/api/portfolio/remove',
                data: { symbol },
            });

            runInAction(() => {
                this.stocks = this.stocks.filter((s) => s !== symbol);
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
