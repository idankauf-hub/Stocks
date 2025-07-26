import React from 'react';
import {
    Box, Paper, Typography, Divider
} from '@mui/material';
import { usePortfolioStore } from '../stores/PortfolioStore';
import { useNavigate } from 'react-router-dom';
import { StockCard } from './StockCard';
import { observer } from 'mobx-react-lite';

export const SavedStocksPanel = observer(() => {
    const portfolioStore = usePortfolioStore();
    const navigate = useNavigate();

    return (
        <Paper elevation={3} sx={{ flex: 1, minWidth: 300, maxHeight: '70vh', overflowY: 'auto', p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="medium" mb={2}>My Saved Stocks</Typography>
            <Divider sx={{ mb: 2 }} />
            {portfolioStore.stocks.length === 0 ? (
                <Typography color="text.secondary">You haven’t added any stocks yet.</Typography>
            ) : (
                portfolioStore.stocks.map((s) => (
                    <Box key={s} mb={2}>
                        <StockCard
                            symbol={s}
                            onClick={() => navigate(`/stock/${s}`)}
                            onRemove={() => portfolioStore.removeStock(s)}
                        />
                    </Box>
                ))
            )}
        </Paper>
    );
});
