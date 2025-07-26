import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { usePortfolioStore } from '../stores/PortfolioStore';
import { useAuthStore } from '../stores/AuthStore';
import { getUsernameFromEmail } from '../utils/user';
import { SearchStocksPanel } from '../components/SearchStocksPanel';
import { SavedStocksPanel } from '../components/SavedStocksPanel';

export const PortfolioPage = observer(() => {
    const portfolioStore = usePortfolioStore();
    const authStore = useAuthStore();
    const username = getUsernameFromEmail(authStore.user?.email);

    useEffect(() => {
        portfolioStore.loadInitialPortfolio();
    }, []);

    return (
        <Box p="4">
            <Typography variant="h4" fontWeight="bold" mb={2}>
                Hey {username}, your stock portfolio
            </Typography>
            <Typography variant="body1" mb={4} color="text.secondary">
                Search, track, and manage your favorite stocks.
            </Typography>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                <SearchStocksPanel />
                <SavedStocksPanel />
            </Box>
        </Box>
    );
});
