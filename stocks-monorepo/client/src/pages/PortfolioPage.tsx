import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    Box,
    Typography,
    CircularProgress,
    TextField,
    IconButton,
    Paper,
    Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { StockCard } from '../components/StockCard';
import { usePortfolioStore } from '../stores/PortfolioStore';
import { useAuthStore } from '../stores/AuthStore';
import axios from 'axios';
import { useDebounce } from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { searchStocks } from '../utils/api';

interface StockSearchResult {
    symbol: string;
    name: string;
}

export const PortfolioPage = observer(() => {
    const portfolioStore = usePortfolioStore();
    const authStore = useAuthStore();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedSearchText = useDebounce(searchText, 500);
    const navigate = useNavigate();

    const username = authStore.user?.email?.split('@')[0] || 'Investor';

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedSearchText.length < 2) {
                setSearchResults([]);
                return;
            }
            setLoading(true);
            try {
                const data = await searchStocks(debouncedSearchText);
                setSearchResults(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setSearchResults([]);
            }
            setLoading(false);
        };

        fetchResults();
    }, [debouncedSearchText]);

    useEffect(() => {
        portfolioStore.loadInitialPortfolio();
    }, []);

    const handleAdd = (symbol: string) => {
        portfolioStore.addStock(symbol);
    };

    return (
        <Box p="4">
            <Typography variant="h4" fontWeight="bold" mb={2}>
                Hey {username}, your stock portfolio
            </Typography>
            <Typography variant="body1" mb={4} color="text.secondary">
                Search, track, and manage your favorite stocks.
            </Typography>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                <Paper
                    elevation={3}
                    sx={{
                        flex: 1,
                        minWidth: 300,
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        p: 3,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="medium" mb={2}>
                        Search Stocks
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter stock symbol or name"
                        variant="outlined"
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
                            {searchResults.map((stock) => {
                                const alreadyAdded = portfolioStore.stocks.includes(stock.symbol);
                                return (
                                    <Box key={stock.symbol} mb={2}>
                                        <StockCard
                                            symbol={stock.symbol}
                                            name={stock.name}
                                            minimal
                                            onClick={() => navigate(`/stock/${stock.symbol}`)}
                                            onAdd={alreadyAdded ? undefined : () => handleAdd(stock.symbol)}
                                        />
                                    </Box>
                                );
                            })}
                            {!loading &&
                                debouncedSearchText.length >= 2 &&
                                searchResults.length === 0 && (
                                    <Typography color="text.secondary">No results found.</Typography>
                                )}
                        </>
                    )}
                </Paper>

                <Paper
                    elevation={3}
                    sx={{
                        flex: 1,
                        minWidth: 300,
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        p: 3,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="medium" mb={2}>
                        My Saved Stocks
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {portfolioStore.stocks.length === 0 ? (
                        <Typography color="text.secondary">
                            You haven’t added any stocks yet.
                        </Typography>
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
            </Box>
        </Box>
    );
});

