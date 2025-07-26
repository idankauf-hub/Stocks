import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    Box,
    Typography,
    CircularProgress,
    TextField,
    IconButton,
} from '@mui/material';

import { StockCard } from '../components/StockCard';
import { usePortfolioStore } from '../stores/PortfolioStore';
import axios from 'axios';
import { useDebounce } from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

interface StockSearchResult {
    symbol: string;
    name: string;
}

const PortfolioPage: React.FC = observer(() => {
    const portfolioStore = usePortfolioStore();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedSearchText = useDebounce(searchText, 500);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedSearchText.length < 2) {
                setSearchResults([]);
                return;
            }
            setLoading(true);
            try {
                const { data } = await axios.get<StockSearchResult[]>(
                    `/api/portfolio/search/${debouncedSearchText}`
                );
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
        <Box p={4}>
            <Typography variant="h4" mb={4}>
                Manage Your Portfolio
            </Typography>

            <Box display="flex" gap={4} flexWrap="wrap">
                <Box
                    flex={1}
                    minWidth="350px"
                    maxHeight="70vh"
                    overflow="auto"
                    border="1px solid #ddd"
                    borderRadius={1}
                    p={2}
                >
                    <TextField
                        fullWidth
                        label="Search Stocks"
                        variant="outlined"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: searchText && (
                                <IconButton onClick={() => setSearchText('')}>
                                    ✕
                                </IconButton>
                            ),
                        }}
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
                        </>
                    )}
                    {!loading && debouncedSearchText.length >= 2 && searchResults.length === 0 && (
                        <Typography>No results found.</Typography>
                    )}
                </Box>

                <Box
                    flex={1}
                    minWidth="350px"
                    maxHeight="70vh"
                    overflow="auto"
                    border="1px solid #ddd"
                    borderRadius={1}
                    p={2}
                >                    <Typography variant="h5" mb={2}>
                        My Saved Stocks
                    </Typography>
                    {portfolioStore.stocks.map((s) => (
                        <Box key={s} mb={2}>
                            <StockCard
                                symbol={s}
                                onClick={() => navigate(`/stock/${s}`)}
                                onRemove={() => portfolioStore.removeStock(s)}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
});

export default PortfolioPage;
