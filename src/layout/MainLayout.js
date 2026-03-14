import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const SIDEBAR_WIDTH = 240;

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${SIDEBAR_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: '#f0f2f5',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}