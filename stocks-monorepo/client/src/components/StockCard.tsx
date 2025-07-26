import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Alert,
    Card,
    CardContent,
    IconButton,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Quote } from '../../../shared/types/quote';
import { usePortfolioStore } from '../stores/PortfolioStore';
import { QuoteDisplay } from './QuoteDisplay';

type StockCardProps = {
    symbol: string;
    name?: string;
    onAdd?: () => void;
    onRemove?: () => void;
    onClick?: () => void;
    minimal?: boolean;
};

export const StockCard = ({ symbol, name, onAdd, onRemove, onClick, minimal }: StockCardProps) => {
    const portfolioStore = usePortfolioStore();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (minimal) return;
        portfolioStore.loadQuote(symbol)
            .then((data) => {
                if (data) {
                    setQuote(data);
                    setError(null);
                } else {
                    setError('No data');
                }
            })
            .catch(() => setError('Failed to fetch quote'));
    }, [symbol]);

    return (
        <Card
            sx={{
                mb: 2,
                width: '100%',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': {
                    boxShadow: 4,
                    transform: 'scale(1.01)',
                    transition: 'all 0.2s',
                },
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
                                <QuoteDisplay quote={quote} />
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
