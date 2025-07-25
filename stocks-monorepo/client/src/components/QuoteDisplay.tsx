import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface QuoteDisplayProps {
    quote: {
        symbol: string;
        price: number;
        percentChange: number;
        lastUpdated: string;
    };
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => (
    <Card sx={{ minWidth: 200, mb: 2 }}>
        <CardContent>
            <Typography variant="h6">{quote.symbol}</Typography>
            <Typography>Price: ${quote.price}</Typography>
            <Typography color={quote.percentChange >= 0 ? 'green' : 'red'}>
                {quote.percentChange >= 0 ? '+' : ''}{quote.percentChange}%
            </Typography>
            <Typography variant="caption">Last updated: {quote.lastUpdated}</Typography>
        </CardContent>
    </Card>
);

export default QuoteDisplay; 