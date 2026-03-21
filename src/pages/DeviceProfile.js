import React, { useState, useRef, useEffect } from "react";
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
  Snackbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DevicesIcon from "@mui/icons-material/Devices";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import OverviewPanel from "../components/OverViewPanel";
import SummaryPanel from "../components/SummaryPanel";
import SnapshotSection from "../components/SnapshotSection";
import CollapsibleTable from "../components/CollapsibleTable ";
import ConfigDrawer from "../components/configDrawer";
import { deviceProfiles } from "../data/devicedata";
import { formatAsConfig, formatAsJson } from "../utils/configFormatters";

export default function DeviceProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tableRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Read device from URL on load
  const params = new URLSearchParams(location.search);
  const deviceIdFromUrl = params.get("device");
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    deviceIdFromUrl || deviceProfiles[0].id,
  );

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Sync URL when device changes
  useEffect(() => {
    navigate(`/device-profile?device=${selectedDeviceId}`, { replace: true });
  }, [selectedDeviceId, navigate]);

  const device = deviceProfiles.find((d) => d.id === selectedDeviceId);

  const tableDefs = device
    ? [
        { title: "INTERFACES", icon: "🔌", data: device.interfaces },
        { title: "HOSTS", icon: "💻", data: device.hosts },
        { title: "USERS", icon: "👤", data: device.users },
        { title: "VPNs", icon: "🔒", data: device.vpns },
        { title: "ASNs", icon: "📡", data: device.asns },
      ]
    : [];

  const [openTables, setOpenTables] = useState(() =>
    tableDefs.reduce((acc, t) => ({ ...acc, [t.title]: false }), {}),
  );

  const handleDeviceChange = (id) => {
    setSelectedDeviceId(id);
    setOpenTables(
      ["INTERFACES", "HOSTS", "USERS", "VPNs", "ASNs"].reduce(
        (acc, t) => ({ ...acc, [t]: false }),
        {},
      ),
    );
  };

  const handleToggle = (title) => {
    setOpenTables((prev) => ({ ...prev, [title]: !prev[title] }));
    if (!openTables[title] && tableRefs.current[title]) {
      setTimeout(() => {
        tableRefs.current[title].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const filterData = (data) => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term),
      ),
    );
  };

  const totalMatches = tableDefs.reduce(
    (acc, t) => acc + filterData(t.data).length,
    0,
  );

  const summaryTables = tableDefs.map((t) => ({
    title: t.title,
    icon: t.icon,
    count: t.data.length,
  }));

  // Open Config in new tab
  const handleOpenConfig = () => {
    const config = formatAsConfig(device);
    const blob = new Blob([config], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // Open JSON in new tab
  const handleOpenJson = () => {
    const json = formatAsJson(device);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // Copy link to clipboard
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
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, padding: 4, overflowY: "auto" }}>
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              letterSpacing: 3,
              color: "#1A1A2E",
            }}
          >
            DEVICE PROFILE
          </Typography>

          {/* Device Selector */}
          <FormControl sx={{ minWidth: 240 }}>
            <InputLabel sx={{ color: "#1A1A2E" }}>Select Device</InputLabel>
            <Select
              value={selectedDeviceId}
              label="Select Device"
              onChange={(e) => handleDeviceChange(e.target.value)}
              sx={{
                backgroundColor: "#ffffff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1A1A2E",
                },
              }}
            >
              {deviceProfiles.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DevicesIcon sx={{ fontSize: 16, color: "#FF6B00" }} />
                    {d.identity.hostname}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Action Buttons */}
        {device && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
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
                  borderColor: "#1A1A2E",
                  color: "#1A1A2E",
                  fontSize: "11px",
                  letterSpacing: 1,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#1A1A2E",
                    color: "#ffffff",
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
                  borderColor: "#1A1A2E",
                  color: "#1A1A2E",
                  fontSize: "11px",
                  letterSpacing: 1,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#1A1A2E",
                    color: "#ffffff",
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
                  backgroundColor: "#FF6B00",
                  color: "#ffffff",
                  fontSize: "11px",
                  letterSpacing: 1,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#e65f00",
                  },
                }}
              >
                COPY LINK
              </Button>
            </Tooltip>
          </Box>
        )}

        {device && (
          <>
            {/* Top section — Summary Panel + Overview Panels side by side */}
            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
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
                      <SearchIcon sx={{ color: "#1A1A2E" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <Typography
                        sx={{
                          backgroundColor:
                            totalMatches > 0 ? "#1A1A2E" : "#E63946",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "bold",
                          padding: "2px 8px",
                          borderRadius: 1,
                        }}
                      >
                        {totalMatches} results
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    "&:hover fieldset": { borderColor: "#1A1A2E" },
                    "&.Mui-focused fieldset": { borderColor: "#1A1A2E" },
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
      {/* Custom Snackbar */}
      {snackbarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: '15%',
            right: snackbarVisible ? '33%' : '-400px',
            zIndex: 9999,
            transition: 'right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            backgroundColor: '#2c2c4e',
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
