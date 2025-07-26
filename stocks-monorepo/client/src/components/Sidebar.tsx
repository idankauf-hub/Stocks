import { FC, ReactNode } from 'react';
import {
    Box,
    Button,
    Typography,
    IconButton,
    Divider,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useAuthStore } from '../stores/AuthStore';
import { useViewedStocksStore } from '../stores/ViewdStocksStore';
import { observer } from 'mobx-react-lite';

interface SidebarLayoutProps {
    children: ReactNode;
}

export const Sidebar = observer(({ children }: SidebarLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const viewedStocksStore = useViewedStocksStore();

    const handleLogout = async () => {
        await authStore.logout();
        navigate('/login');
    };

    return (
        <Box display="flex" height="100vh">
            <Box
                width={240}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                borderRight="1px solid #e0e0e0"
                p={2}
                bgcolor="#fafafa"
            >
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        My Portfolio
                    </Typography>

                    <Button
                        variant={location.pathname === '/portfolio' ? 'contained' : 'outlined'}
                        fullWidth
                        component={Link}
                        to="/portfolio"
                        sx={{
                            mb: 2,
                            textTransform: 'none',
                            borderRadius: 2,
                        }}
                        color="primary"
                    >
                        Your Stocks
                    </Button>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ mb: 1, fontWeight: 500 }}
                    >
                        Recently Viewed
                    </Typography>

                    <Box
                        maxHeight="60vh"
                        overflow="auto"
                        sx={{
                            pr: 1,
                            '&::-webkit-scrollbar': {
                                width: 6,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#ccc',
                                borderRadius: 3,
                            },
                        }}
                    >
                        {viewedStocksStore.viewed.length === 0 ? (
                            <Typography variant="caption">No history yet</Typography>
                        ) : (
                            viewedStocksStore.viewed.map((symbol) => (
                                <Box
                                    key={symbol}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={0.5}
                                    px={1}
                                    py={0.5}
                                    borderRadius={1}
                                    sx={{
                                        transition: 'background 0.2s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                        },
                                    }}
                                    onClick={() => navigate(`/stock/${symbol}`)}
                                >
                                    <Typography
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: '0.875rem',
                                            color: '#333',
                                        }}
                                    >
                                        {symbol}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent row click
                                            viewedStocksStore.remove(symbol);
                                        }}
                                        sx={{ color: 'gray' }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))

                        )}
                    </Box>
                </Box>

                <Button
                    onClick={handleLogout}
                    variant="text"
                    color="error"
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        mt: 2,
                    }}
                >
                    Log Out
                </Button>
            </Box>

            <Box flex={1} p={3} overflow="auto">
                {children}
            </Box>
        </Box>
    );
});
