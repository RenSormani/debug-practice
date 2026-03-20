import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const SIDEBAR_WIDTH = 240;

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', overflow: 'hidden' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${SIDEBAR_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: '#f0f2f5',
          width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
          maxWidth: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}