import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { makeAutoObservable } from 'mobx';
import React, { createContext, useContext } from 'react';
import { auth } from '../firebase';

class AuthStore {
    user: User | null = null;
    loading = false;
    error: string | null = null;
    initialized = false;


    constructor() {
        makeAutoObservable(this);
        onAuthStateChanged(auth, (user) => {
            this.user = user;
            this.initialized = true;
        });
    }

    async register(email: string, password: string) {
        this.loading = true;
        this.error = null;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            this.user = userCredential.user;
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.user = userCredential.user;
        } catch (e: any) {
            this.error = e.message || 'Login failed';
        } finally {
            this.loading = false;
        }
    }

    async logout() {
        await signOut(auth);
        this.user = null;
    }
}

const AuthStoreContext = createContext<AuthStore | null>(null);
export const AuthStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const store = React.useMemo(() => new AuthStore(), []);
    return <AuthStoreContext.Provider value={store}>{children}</AuthStoreContext.Provider>;
};

export const useAuthStore = () => {
    const store = useContext(AuthStoreContext);
    if (!store) throw new Error('useAuthStore must be used within AuthStoreProvider');
    return store;
};

export default AuthStore;
