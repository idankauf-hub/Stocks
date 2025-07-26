import React, { useEffect, useState } from 'react';
import {
    Box, Paper, TextField, IconButton, Typography, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDebounce } from '../hooks/useDebounce';
import { searchStocks } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '../stores/PortfolioStore';
import { StockCard } from './StockCard';
import { observer } from 'mobx-react-lite';

interface StockSearchResult {
    symbol: string;
    name: string;
}

export const SearchStocksPanel = observer(() => {

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedSearchText = useDebounce(searchText, 500);
    const portfolioStore = usePortfolioStore();
    const navigate = useNavigate();

    const handleAdd = (symbol: string) => {
        portfolioStore.addStock(symbol);
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedSearchText.length < 2) return setSearchResults([]);
            setLoading(true);
            try {
                const data = await searchStocks(debouncedSearchText);
                setSearchResults(Array.isArray(data) ? data : []);
            } catch {
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [debouncedSearchText]);

    return (
        <Paper elevation={3} sx={{ flex: 1, minWidth: 300, maxHeight: '70vh', overflowY: 'auto', p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="medium" mb={2}>Search Stocks</Typography>

            <TextField
                fullWidth
                placeholder="Enter stock symbol or name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                    endAdornment: searchText && (
                        <IconButton onClick={() => setSearchText('')}>
                            <CloseIcon />
                        </IconButton>
                    ),
                }}
                sx={{ mb: 2 }}
            />

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {searchResults.map(({ symbol, name }) => {
                        const alreadyAdded = portfolioStore.stocks.includes(symbol);
                        return (
                            <Box key={symbol} mb={2}>
                                <StockCard
                                    symbol={symbol}
                                    name={name}
                                    minimal
                                    onClick={() => navigate(`/stock/${symbol}`)}
                                    onAdd={alreadyAdded ? undefined : () => handleAdd(symbol)}
                                />
                            </Box>
                        );
                    })}
                    {debouncedSearchText.length >= 2 && searchResults.length === 0 && (
                        <Typography color="text.secondary">No results found.</Typography>
                    )}
                </>
            )}
        </Paper>
    );
});
