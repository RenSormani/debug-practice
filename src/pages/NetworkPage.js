import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DataTable from '../components/DataTable';
import NetworkGraph from '../components/NetworkGraph';
import { fetchNetworkRequest } from '../redux/network/actions';

export default function NetworkPage() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.network.data);
  const loading = useSelector((state) => state.network.loading);
  const error = useSelector((state) => state.network.error);

  const [view, setView] = useState('table');

  useEffect(() => {
    dispatch(fetchNetworkRequest());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress sx={{ color: '#1A1A2E' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 4 }}>
        Failed to load network data: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            letterSpacing: 3,
            color: '#1A1A2E',
          }}
        >
          NETWORK
        </Typography>

        {/* Toggle Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={view === 'table' ? 'contained' : 'outlined'}
            startIcon={<TableChartIcon />}
            onClick={() => setView('table')}
            sx={{
              backgroundColor: view === 'table' ? '#1A1A2E' : 'transparent',
              borderColor: '#1A1A2E',
              color: view === 'table' ? '#ffffff' : '#1A1A2E',
              '&:hover': {
                backgroundColor: view === 'table' ? '#16213E' : '#1A1A2E20',
              },
            }}
          >
            Table
          </Button>
          <Button
            variant={view === 'graph' ? 'contained' : 'outlined'}
            startIcon={<AccountTreeIcon />}
            onClick={() => setView('graph')}
            sx={{
              backgroundColor: view === 'graph' ? '#FF6B00' : 'transparent',
              borderColor: '#FF6B00',
              color: view === 'graph' ? '#ffffff' : '#FF6B00',
              '&:hover': {
                backgroundColor: view === 'graph' ? '#e65f00' : '#FF6B0020',
              },
            }}
          >
            Graph
          </Button>
        </Box>
      </Box>

      {/* Content */}
      {view === 'table' ? (
        <DataTable
          title=""
          data={data}
          loading={loading}
          error={error}
        />
      ) : (
        <NetworkGraph data={data} />
      )}
    </Box>
  );
}