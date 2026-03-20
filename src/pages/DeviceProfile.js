import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DevicesIcon from "@mui/icons-material/Devices";
import OverviewPanel from "../components/OverViewPanel";
import { deviceProfiles } from "../data/devicedata";
import CollapsibleTable from "../components/CollapsibleTable ";
import SnapshotSection from "../components/SnapshotSection";
import SummaryPanel from "../components/SummaryPanel";
import ConfigDrawer from "../components/configDrawer";

export default function DeviceProfilePage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(deviceProfiles[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const tableRefs = useRef({});

  const device = deviceProfiles.find((d) => d.id === selectedDeviceId);

  const tableDefs = device ? [
    { title: 'INTERFACES', icon: '🔌', data: device.interfaces },
    { title: 'HOSTS', icon: '💻', data: device.hosts },
    { title: 'USERS', icon: '👤', data: device.users },
    { title: 'VPNs', icon: '🔒', data: device.vpns },
    { title: 'ASNs', icon: '📡', data: device.asns },
  ] : [];

  const [openTables, setOpenTables] = useState(
    () => tableDefs.reduce((acc, t) => ({ ...acc, [t.title]: false }), {})
  );

  const handleDeviceChange = (id) => {
    setSelectedDeviceId(id);
    setOpenTables(
      ['INTERFACES', 'HOSTS', 'USERS', 'VPNs', 'ASNs'].reduce(
        (acc, t) => ({ ...acc, [t]: false }), {}
      )
    );
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

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, padding: 4, overflowY: 'auto' }}>

        {/* Page Header */}
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
            DEVICE PROFILE
          </Typography>

          {/* Device Selector */}
          <FormControl sx={{ minWidth: 240 }}>
            <InputLabel sx={{ color: '#1A1A2E' }}>Select Device</InputLabel>
            <Select
              value={selectedDeviceId}
              label="Select Device"
              onChange={(e) => handleDeviceChange(e.target.value)}
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
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {device && (
          <>
            {/* Top section — Summary Panel + Overview Panels side by side */}
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
              {/* Left — Summary Panel */}
              <SummaryPanel
                tables={summaryTables}
                openTables={openTables}
                onToggle={handleToggle}
              />

              {/* Right — Overview Panels */}
              <Box sx={{ flex: 1 }}>
                <OverviewPanel
                  title="IDENTITY"
                  icon="🖥️"
                  data={device.identity}
                  collapsible={false}
                />
                <OverviewPanel
                  title="PROVENANCE"
                  icon="📋"
                  data={device.provenance}
                  collapsible={false}
                />
                <OverviewPanel
                  title="TECHNICAL"
                  icon="⚙️"
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

      {/* Config Drawer */}
      <ConfigDrawer device={device} />
    </Box>
  );
}