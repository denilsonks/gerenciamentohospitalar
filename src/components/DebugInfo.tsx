import { useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function DebugInfo() {
    const { user, profile, loading } = useAuth();

    useEffect(() => {
        console.log('=== DEBUG INFO ===');
        console.log('Environment Variables:', {
            supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
            hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
        });
        console.log('Auth State:', {
            user: user?.id,
            profile: profile,
            loading
        });
    }, [user, profile, loading]);

    if (loading) {
        return null;
    }

    return (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f0f0f0' }}>
            <Typography variant="h6">Debug Info</Typography>
            <Typography variant="body2">
                User ID: {user?.id || 'Not logged in'}
            </Typography>
            <Typography variant="body2">
                Profile: {profile?.nomeCompleto || 'No profile'}
            </Typography>
            <Typography variant="body2">
                Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}
            </Typography>
        </Paper>
    );
}
