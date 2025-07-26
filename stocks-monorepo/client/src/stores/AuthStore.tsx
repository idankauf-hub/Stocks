import { makeAutoObservable } from 'mobx';
import React, { createContext, useContext } from 'react';

const API_URL = 'http://localhost:3000/api';

class AuthStore {
    user: any = null;
    token: string | null = null;
    loading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);

        // Load token & user from localStorage if available
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            this.token = savedToken;
            this.user = JSON.parse(savedUser);
        }
    }

    async register(email: string, password: string) {
        this.loading = true;
        this.error = null;
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error('Registration failed');
            }

            const data = await res.json();
            this.user = data.user;
            this.token = data.access_token;

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (e: any) {
            this.error = e.message || 'Registration failed';
        } finally {
            this.loading = false;
        }
    }

    async login(email: string, password: string) {
        this.loading = true;
        this.error = null;
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error('Login failed');
            }

            const data = await res.json();
            this.user = data.user;
            this.token = data.access_token;

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (e: any) {
            this.error = e.message || 'Login failed';
        } finally {
            this.loading = false;
        }
    }

    logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

// === Context Setup ===

const AuthStoreContext = createContext<AuthStore | null>(null);

export const AuthStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const store = React.useMemo(() => new AuthStore(), []);
    return (
        <AuthStoreContext.Provider value={store}>
            {children}
        </AuthStoreContext.Provider>
    );
};

export const useAuthStore = () => {
    const store = useContext(AuthStoreContext);
    if (!store) throw new Error('useAuthStore must be used within AuthStoreProvider');
    return store;
};
