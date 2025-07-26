import React from 'react';
import {
    Box,
    Typography,
    Divider,
    Grid,
    IconButton,
    Card,
    CardContent,
    useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Quote } from '../../../shared/types/quote';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface QuoteDisplayProps {
    quote: Quote;
    showFull?: boolean;
    onBack?: () => void;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
    quote,
    showFull = false,
    onBack,
}) => {
    const theme = useTheme();
    const isPositive = quote.changePercentage >= 0;
    const priceColor = isPositive ? theme.palette.success.main : theme.palette.error.main;

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
            {onBack && (
                <IconButton onClick={onBack} sx={{ mb: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
            )}

            <Typography variant={showFull ? 'h3' : 'h6'} fontWeight="bold" gutterBottom>
                {quote.name} ({quote.symbol})
            </Typography>

            <Typography variant={showFull ? 'h4' : 'body1'} fontWeight={500} sx={{ color: priceColor, mb: 2 }}>
                {formatCurrency(quote.price)}{' '}
                <Typography component="span" fontWeight="bold" sx={{ color: priceColor }}>
                    ({quote.change >= 0 ? '+' : ''}
                    {quote.change.toFixed(2)} | {quote.changePercentage.toFixed(2)}%)
                </Typography>
            </Typography>

            {showFull && (
                <>
                    <Typography variant="h6" gutterBottom>
                        Key Stats
                    </Typography>
                    <Grid container spacing={2}>
                        {metrics.map(({ label, value }) => (
                            <Grid item xs={12} sm={6} md={4} key={label}>
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
                </>
            )}

            <Divider sx={{ my: 4 }} />
            <Typography variant="caption" color="textSecondary">
                Last updated: {new Date(quote.timestamp * 1000).toLocaleString()}
            </Typography>
        </Box>
    );
};
