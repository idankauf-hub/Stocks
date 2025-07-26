import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Alert,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStockQuote } from '../utils/api';
import { Quote } from '../../../shared/types/quote';

type StockCardProps = {
    symbol: string;
    name?: string;
    onAdd?: () => void;
    onRemove?: () => void;
    onClick?: () => void;
    minimal?: boolean;
};

export const StockCard = ({ symbol, name, onAdd, onRemove, onClick, minimal }: StockCardProps) => {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (minimal) return;
        getStockQuote(symbol)
            .then((data) => {
                setQuote(data);
                setError(null);
            })
            .catch((err) => {
                const message = err?.response?.data?.message || 'Failed to load stock data.';
                setError(message);
            });
    }, [symbol, minimal]);

    return (
        <Card
            sx={{
                mb: 2,
                width: '100%',
                cursor: onClick ? 'pointer' : 'default',
            }}
            onClick={onClick}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <Typography variant="h6">{symbol}</Typography>
                    <Typography variant="subtitle1">{name}</Typography>

                    {!minimal && (
                        <>
                            {error ? (
                                <Alert severity="error">{error}</Alert>
                            ) : quote ? (
                                <>
                                    <Typography color="textSecondary">
                                        Price: ${quote.price.toFixed(2)}
                                    </Typography>
                                    <Typography
                                        color={quote.changePercentage >= 0 ? 'success.main' : 'error.main'}
                                    >
                                        {quote.changePercentage >= 0 ? '+' : ''}
                                        {quote.changePercentage.toFixed(2)}%
                                    </Typography>
                                </>
                            ) : (
                                <Typography>Loading...</Typography>
                            )}
                        </>
                    )}
                </div>

                {minimal ? (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd?.();
                        }}
                        disabled={!onAdd}
                        size="small"
                        color={onAdd ? 'primary' : 'success'}
                    >
                        {onAdd ? <AddIcon /> : <CheckIcon />}
                    </IconButton>
                ) : (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove?.();
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                )}
            </CardContent>
        </Card>
    );
};

