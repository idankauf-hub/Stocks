import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const Spinner = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );
}

