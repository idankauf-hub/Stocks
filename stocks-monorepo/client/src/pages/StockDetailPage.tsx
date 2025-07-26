import {
    Alert,
    CircularProgress,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Quote } from '../../../shared/types/quote';
import { QuoteDisplay } from '../components/QuoteDisplay';
import { useViewedStocksStore } from '../stores/ViewedStocksStore';
import { fetchQuote } from '../utils/api';




export const StockDetailPage = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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


    return (
        <QuoteDisplay quote={quote} showFull onBack={() => navigate('/portfolio')} />
    );
};

