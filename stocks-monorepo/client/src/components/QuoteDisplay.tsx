import React from 'react';
import { Box, Typography } from '@mui/material';
import { Quote } from '../../../shared/types/quote';


type QuoteDisplayProps = {
    quote: Quote
}

export const QuoteDisplay = ({ quote }: QuoteDisplayProps) => {
    const isPositive = quote.changePercentage >= 0;

    return (
        <Box>
            <Typography variant="h6">
                Price: ${quote.price.toFixed(2)}
            </Typography>

            <Typography variant="subtitle1" color={isPositive ? 'green' : 'red'}>
                {isPositive ? '+' : ''}
                {quote.change.toFixed(2)} ({quote.changePercentage.toFixed(2)}%)
            </Typography>

            <Typography variant="caption" color="textSecondary">
                Last updated: {new Date(quote.timestamp * 1000).toLocaleString()}
            </Typography>
        </Box>
    );
};

