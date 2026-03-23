import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DevicesIcon from '@mui/icons-material/Devices';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate } from 'react-router-dom';
import SummaryPanel from '../components/SummaryPanel';
import SnapshotSection from '../components/SnapshotSection';
import DeviceTabBar from '../components/DeviceTabBar';
import { formatAsConfig, formatAsJson } from '../utils/configFormatters';
import { deviceProfiles } from '../data/devicedata';
import OverviewPanel from '../components/OverViewPanel';
import CollapsibleTable from '../components/CollapsibleTable ';
import ConfigDrawer from '../components/configDrawer';

export default function DeviceProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tableRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Tab state
  const params = new URLSearchParams(location.search);
  const deviceIdFromUrl = params.get('device');

  const [tabs, setTabs] = useState(() => {
    const initialId = deviceIdFromUrl || deviceProfiles[0].id;
    const initialDevice = deviceProfiles.find((d) => d.id === initialId);
    return initialDevice ? [{ id: initialId, hostname: initialDevice.identity.hostname }] : [];
  });

  const [activeTabId, setActiveTabId] = useState(
    deviceIdFromUrl || deviceProfiles[0].id
  );

  const [openTables, setOpenTables] = useState(
    ['INTERFACES', 'HOSTS', 'USERS', 'VPNs', 'ASNs'].reduce(
      (acc, t) => ({ ...acc, [t]: false }), {}
    )
  );

  // Sync URL when active tab changes
  useEffect(() => {
    if (activeTabId) {
      navigate(`/device-profile?device=${activeTabId}`, { replace: true });
    }
  }, [activeTabId, navigate]);

  const device = deviceProfiles.find((d) => d.id === activeTabId);

  const tableDefs = device ? [
    { title: 'INTERFACES', icon: '🔌', data: device.interfaces },
    { title: 'HOSTS', icon: '💻', data: device.hosts },
    { title: 'USERS', icon: '👤', data: device.users },
    { title: 'VPNs', icon: '🔒', data: device.vpns },
    { title: 'ASNs', icon: '📡', data: device.asns },
  ] : [];

  // Handle selecting a device — opens new tab if not already open
  const handleDeviceSelect = (id) => {
    const selectedDevice = deviceProfiles.find((d) => d.id === id);
    if (!selectedDevice) return;

    // If tab already exists, just switch to it
    if (tabs.find((t) => t.id === id)) {
      setActiveTabId(id);
      return;
    }

    // Otherwise open a new tab
    setTabs((prev) => [...prev, { id, hostname: selectedDevice.identity.hostname }]);
    setActiveTabId(id);
    setOpenTables(
      ['INTERFACES', 'HOSTS', 'USERS', 'VPNs', 'ASNs'].reduce(
        (acc, t) => ({ ...acc, [t]: false }), {}
      )
    );
  };

  // Handle closing a tab
  const handleTabClose = (id) => {
    const idx = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
      if (newTabs.length === 0) {
        setActiveTabId(null);
      } else {
        // Show previous tab
        const newActiveIdx = Math.max(0, idx - 1);
        setActiveTabId(newTabs[newActiveIdx].id);
      }
    }
  };

  const handleToggle = (title) => {
    setOpenTables((prev) => ({ ...prev, [title]: !prev[title] }));
    if (!openTables[title] && tableRefs.current[title]) {
      setTimeout(() => {
        tableRefs.current[title].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const filterData = (data) => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  };

  const totalMatches = tableDefs.reduce(
    (acc, t) => acc + filterData(t.data).length,
    0
  );

  const summaryTables = tableDefs.map((t) => ({
    title: t.title,
    icon: t.icon,
    count: t.data.length,
  }));

  const handleOpenConfig = () => {
    const config = formatAsConfig(device);
    const blob = new Blob([config], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleOpenJson = () => {
    const json = formatAsJson(device);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarVisible(true), 50);
    setTimeout(() => {
      setSnackbarVisible(false);
      setTimeout(() => setSnackbarOpen(false), 400);
    }, 4000);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Tab Bar */}
        <DeviceTabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={(id) => setActiveTabId(id)}
          onTabClose={handleTabClose}
        />

        <Box sx={{ flex: 1, padding: 4 }}>
          {/* Page Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
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
              DEVICE PROFILE
            </Typography>

            {/* Device Selector */}
            <FormControl sx={{ minWidth: 240 }}>
              <InputLabel sx={{ color: '#1A1A2E' }}>Select Device</InputLabel>
              <Select
                value=""
                label="Select Device"
                onChange={(e) => handleDeviceSelect(e.target.value)}
                displayEmpty
                sx={{
                  backgroundColor: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1A1A2E' },
                }}
              >
                {deviceProfiles.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DevicesIcon sx={{ fontSize: 16, color: '#FF6B00' }} />
                      {d.identity.hostname}
                      {tabs.find((t) => t.id === d.id) && (
                        <Typography sx={{ fontSize: '10px', color: '#FF6B00', ml: 1 }}>
                          OPEN
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* No tabs open */}
          {!device && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                gap: 2,
              }}
            >
              <Typography sx={{ color: '#888', fontSize: '16px', letterSpacing: 2 }}>
                NO DEVICE SELECTED
              </Typography>
              <Typography sx={{ color: '#aaa', fontSize: '13px' }}>
                Use the dropdown above to open a device profile
              </Typography>
            </Box>
          )}

          {device && (
            <>
              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1,
                  marginBottom: 2,
                }}
              >
                <Tooltip title="Open raw config in a new tab" arrow>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleOpenConfig}
                    sx={{
                      borderColor: '#1A1A2E',
                      color: '#1A1A2E',
                      fontSize: '11px',
                      letterSpacing: 1,
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#1A1A2E',
                        color: '#ffffff',
                      },
                    }}
                  >
                    OPEN CONFIG
                  </Button>
                </Tooltip>
                <Tooltip title="Open raw JSON in a new tab" arrow>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleOpenJson}
                    sx={{
                      borderColor: '#1A1A2E',
                      color: '#1A1A2E',
                      fontSize: '11px',
                      letterSpacing: 1,
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#1A1A2E',
                        color: '#ffffff',
                      },
                    }}
                  >
                    OPEN JSON
                  </Button>
                </Tooltip>
                <Tooltip title="Copy link to this device profile" arrow>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleCopyLink}
                    sx={{
                      backgroundColor: '#FF6B00',
                      color: '#ffffff',
                      fontSize: '11px',
                      letterSpacing: 1,
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#e65f00' },
                    }}
                  >
                    COPY LINK
                  </Button>
                </Tooltip>
              </Box>

              {/* Top section — Summary Panel + Overview Panels */}
              <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                <SummaryPanel
                  tables={summaryTables}
                  openTables={openTables}
                  onToggle={handleToggle}
                />
                <Box sx={{ flex: 1 }}>
                  <OverviewPanel
                    title="IDENTITY"
                    data={device.identity}
                    collapsible={false}
                  />
                  <OverviewPanel
                    title="PROVENANCE"
                    data={device.provenance}
                    collapsible={false}
                  />
                  <OverviewPanel
                    title="TECHNICAL"
                    data={device.technical}
                    collapsible={true}
                  />
                </Box>
              </Box>

              {/* Snapshot Section */}
              <SnapshotSection device={device} />

              {/* Search Bar */}
              <Box sx={{ marginBottom: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search across all tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#1A1A2E' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <Typography
                          sx={{
                            backgroundColor: totalMatches > 0 ? '#1A1A2E' : '#E63946',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '2px 8px',
                            borderRadius: 1,
                          }}
                        >
                          {totalMatches} results
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      '&:hover fieldset': { borderColor: '#1A1A2E' },
                      '&.Mui-focused fieldset': { borderColor: '#1A1A2E' },
                    },
                  }}
                />
              </Box>

              {/* Tables */}
              {tableDefs.map((table) => {
                const filteredData = filterData(table.data);
                return (
                  <Box
                    key={table.title}
                    ref={(el) => (tableRefs.current[table.title] = el)}
                  >
                    <CollapsibleTable
                      title={table.title}
                      icon={table.icon}
                      data={[...filteredData]}
                      searchTerm={searchTerm}
                      totalCount={table.data.length}
                      expanded={openTables[table.title]}
                      onToggle={() => handleToggle(table.title)}
                    />
                  </Box>
                );
              })}
            </>
          )}
        </Box>
      </Box>

      {/* Config Drawer */}
      <ConfigDrawer device={device} />

      {/* Custom Snackbar */}
      {snackbarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: '15%',
            right: snackbarVisible ? '33%' : '-400px',
            zIndex: 9999,
            transition: 'right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            backgroundColor: '#1A1A2E',
            color: '#ffffff',
            borderRadius: 2,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            borderLeft: '4px solid #FF6B00',
            minWidth: 260,
          }}
        >
          <Typography sx={{ fontSize: '13px', fontWeight: 'bold', flex: 1 }}>
            ✓ URL copied to clipboard
          </Typography>
          <IconButton
            size="small"
            onClick={() => {
              setSnackbarVisible(false);
              setTimeout(() => setSnackbarOpen(false), 400);
            }}
            sx={{ color: '#ffffff', padding: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}