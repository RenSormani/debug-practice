import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline, Box, AppBar, Toolbar, Typography } from '@mui/material';
import store from './redux/store';
import UsersTable from './components/UsersTable';

export default function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        {/* Top Navigation Bar */}
        <AppBar position="static" sx={{ backgroundColor: '#1A1A2E' }}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                letterSpacing: 4,
                color: '#FF6B00',
              }}
            >
              DEBUG PRACTICE
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <UsersTable />
      </Box>
    </Provider>
  );
}