import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface StockCardProps {
    symbol: string;
    onRemove: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ symbol, onRemove }) => (
    <Card sx={{ minWidth: 200, mb: 2 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{symbol}</Typography>
            <IconButton onClick={onRemove} color="error">
                <DeleteIcon />
            </IconButton>
        </CardContent>
    </Card>
);

export default StockCard; 