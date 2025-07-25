import React from 'react';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    Box,
    Button,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/AuthStore';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const authStore = useAuthStore();

    const handleLogout = async () => {
        await authStore.logout();
        navigate('/login');
    };

    return (
        <Drawer variant="permanent" anchor="left">
            <Box display="flex" flexDirection="column" height="100%">
                <List>
                    <ListItemButton
                        component={Link}
                        to="/portfolio"
                        selected={location.pathname === '/portfolio'}
                    >
                        <ListItemText primary="Portfolio" />
                    </ListItemButton>
                </List>

                <Box flexGrow={1} /> {/* pushes logout to bottom */}

                <Divider />

                <Box p={2}>
                    <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
