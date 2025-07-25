import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography, Button, TextField, List, ListItem } from '@mui/material';
import StockCard from '../components/StockCard';
import { usePortfolioStore } from '../stores/PortfolioStore';

const PortfolioPage: React.FC = observer(() => {
    const portfolioStore = usePortfolioStore();
    const [symbol, setSymbol] = useState('');

    const handleAdd = () => {
        if (symbol) {
            portfolioStore.addStock(symbol.toUpperCase());
            setSymbol('');
        }
    };

    return (
        <Box p={4}>
            <Typography variant="h4" mb={2}>My Portfolio</Typography>
            <Box display="flex" mb={2}>
                <TextField label="Add Stock Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
                <Button onClick={handleAdd} variant="contained" sx={{ ml: 2 }}>Add</Button>
            </Box>
            <List>
                {portfolioStore.stocks.map((s: string) => (
                    <ListItem key={s}>
                        <StockCard symbol={s} onRemove={() => portfolioStore.removeStock(s)} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
});

export default PortfolioPage; 