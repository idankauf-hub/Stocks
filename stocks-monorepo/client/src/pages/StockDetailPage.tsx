import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Divider,
    useTheme,
    IconButton,
} from '@mui/material';
import axios from 'axios';
import { Quote } from '../../../shared/types/quote'
import { useViewedStocksStore } from '../stores/ViewdStocksStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid';
import { fetchQuote } from '../utils/api';


const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
const formatNumber = (value: number) => value.toLocaleString();

export const StockDetailPage = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const viewedStocksStore = useViewedStocksStore();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchQuote(symbol!);
                setQuote(data);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to load stock data');
            } finally {
                setLoading(false);
            }
        };

        if (symbol) {
            viewedStocksStore.add(symbol);
            fetchData();
        }
    }, [symbol]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!quote) return <Typography>No data found for {symbol}</Typography>;

    const priceColor = quote.changePercentage >= 0 ? theme.palette.success.main : theme.palette.error.main;

    const metrics = [
        { label: 'Exchange', value: quote.exchange },
        { label: 'Open Price', value: formatCurrency(quote.open) },
        { label: 'Previous Close', value: formatCurrency(quote.previousClose) },
        { label: 'Day Low', value: formatCurrency(quote.dayLow) },
        { label: 'Day High', value: formatCurrency(quote.dayHigh) },
        { label: '52W Low', value: formatCurrency(quote.yearLow) },
        { label: '52W High', value: formatCurrency(quote.yearHigh) },
        { label: 'Market Cap', value: `$${(quote.marketCap / 1e9).toFixed(2)}B` },
        { label: 'Volume', value: formatNumber(quote.volume) },
        { label: '50D Avg', value: formatCurrency(quote.priceAvg50) },
        { label: '200D Avg', value: formatCurrency(quote.priceAvg200) },
    ];

    return (
        <Box p={{ xs: 2, md: 4 }}>
            <IconButton onClick={() => navigate('/portfolio')} sx={{ mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                {quote.name} ({quote.symbol})
            </Typography>

            <Typography variant="h4" fontWeight={500} sx={{ color: priceColor, mb: 4 }}>
                {formatCurrency(quote.price)}{' '}
                <Typography component="span" fontWeight="bold" sx={{ color: priceColor }}>
                    ({quote.change >= 0 ? '+' : ''}
                    {quote.change.toFixed(2)} | {quote.changePercentage.toFixed(2)}%)
                </Typography>
            </Typography>

            <Typography variant="h6" gutterBottom>
                Key Stats
            </Typography>
            <Grid container spacing={2}>
                {metrics.map(({ label, value }) => (
                    <Grid item xs={12} sm={6} md={4} key={label} >
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ textTransform: 'uppercase', mb: 0.5 }}
                                >
                                    {label}
                                </Typography>
                                <Typography variant="h6">{value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>


            <Divider sx={{ my: 4 }} />
            <Typography variant="caption" color="textSecondary">
                Last updated: {new Date(quote.timestamp * 1000).toLocaleString()}
            </Typography>
        </Box>
    );
};

