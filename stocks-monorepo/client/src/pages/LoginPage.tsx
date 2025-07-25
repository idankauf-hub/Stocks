import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { useState } from 'react';
import { useAuthStore } from '../stores/AuthStore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const authStore = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await authStore.login(email, password);
        if (authStore.user) navigate('/portfolio');
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <Typography variant="h4" mb={2}>Login</Typography>
            <form onSubmit={handleLogin} style={{ width: 300 }}>
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={authStore.loading}
                    sx={{ mt: 2 }}
                >
                    {authStore.loading ? 'Signing in...' : 'Login'}
                </Button>
                {authStore.error && (
                    <Typography color="error" mt={2}>
                        {authStore.error}
                    </Typography>
                )}
                <Box mt={2}>
                    <Link component="button" onClick={() => navigate('/register')}>
                        Don’t have an account? Register
                    </Link>
                </Box>
            </form>
        </Box>
    );
}
