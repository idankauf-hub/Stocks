import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, TextField, Box, Typography, Link } from '@mui/material';
import { useAuthStore } from '../stores/AuthStore';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = observer(() => {
    const authStore = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        await authStore.register(email, password);
        if (authStore.user) navigate('/portfolio');
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <Typography variant="h4" mb={2}>Register</Typography>
            <form onSubmit={handleRegister} style={{ width: 300 }}>
                <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
                <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={authStore.loading} sx={{ mt: 2 }}>
                    {authStore.loading ? 'Registering...' : 'Register'}
                </Button>
                {authStore.error && <Typography color="error" mt={2}>{authStore.error}</Typography>}
                <Box mt={2}>
                    <Link component="button" onClick={() => navigate('/')}>
                        Already have an account? Login
                    </Link>
                </Box>
            </form>
        </Box>
    );
});

