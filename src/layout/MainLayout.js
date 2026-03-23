import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const SIDEBAR_WIDTH = 240;

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', overflow: 'hidden' }}>
      {/* Skip navigation link — visually hidden until focused */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          top: '-48px',
          left: 8,
          zIndex: 10000,
          backgroundColor: '#FF6B00',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: 1,
          fontWeight: 'bold',
          fontSize: '14px',
          textDecoration: 'none',
          '&:focus': { top: 8 },
        }}
      >
        Skip to main content
      </Box>
      <Sidebar />
      <Box
        id="main-content"
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