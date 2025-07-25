import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import QuoteDisplay from '../components/QuoteDisplay';

const StockDetailPage: React.FC = () => {
    const { symbol } = useParams<{ symbol: string }>();

    // Mock data for now
    const quote = {
        symbol: symbol?.toUpperCase() || '',
        price: 123.45,
        percentChange: 1.23,
        lastUpdated: new Date().toISOString(),
    };

    return (
        <Box p={4}>
            <Typography variant="h4" mb={2}>{quote.symbol} Details</Typography>
            <QuoteDisplay quote={quote} />
        </Box>
    );
};

export default StockDetailPage; 