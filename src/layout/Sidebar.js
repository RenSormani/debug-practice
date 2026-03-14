import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HubIcon from '@mui/icons-material/Hub';

const SIDEBAR_WIDTH = 240;

const navItems = [
  { label: 'Users', path: '/users', icon: <PeopleIcon /> },
  { label: 'Posts', path: '/posts', icon: <ArticleIcon /> },
  { label: 'Todos', path: '/todos', icon: <CheckBoxIcon /> },
  { label: 'Network', path: '/network', icon: <HubIcon /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: '100vh',
        backgroundColor: '#1A1A2E',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* Logo */}
      <Box sx={{ padding: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#FF6B00',
            fontWeight: 'bold',
            letterSpacing: 4,
          }}
        >
          DEBUG
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#ffffff',
            fontWeight: 'bold',
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          PRACTICE
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#ffffff20' }} />

      {/* Nav Items */}
      <List sx={{ padding: 1, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ marginBottom: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? '#FF6B00' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? '#FF6B00' : '#ffffff15',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#ffffff' : '#ffffff80',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: isActive ? '#ffffff' : '#ffffff80',
                      fontWeight: isActive ? 'bold' : 'normal',
                      letterSpacing: 1,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ padding: 2 }}>
        <Typography variant="caption" sx={{ color: '#ffffff30', letterSpacing: 1 }}>
          JSONPlaceholder API
        </Typography>
      </Box>
    </Box>
  );
}