import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchNetworkRequest } from "../redux/network/actions";
import CollapsibleTable from "../components/CollapsibleTable ";

export default function ExplorerPage() {
  const dispatch = useDispatch();
  const networkData = useSelector((state) => state.network.data);
  const loading = useSelector((state) => state.network.loading);
  const [searchTerm, setSearchTerm] = useState("");
  const [localData, setLocalData] = useState([]);
  const [expandedTables, setExpandedTables] = useState({});

  // For serverside — dispatches search to API instead of filtering locally
// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (searchTerm.trim()) {
//       dispatch(searchNetworkRequest(searchTerm));
//     } else {
//       dispatch(fetchNetworkRequest());
//     }
//   }, 300); // wait 300ms after user stops typing

//   return () => clearTimeout(timer);
// }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchNetworkRequest());
  }, [dispatch]);

  // Store data in local state when it arrives
  useEffect(() => {
    console.log("networkData changed, length:", networkData.length);
    if (networkData.length > 0) {
      console.log("Setting localData");
      setLocalData([...networkData]);
    }
  }, [networkData]);

  // 1. All network hosts
  const allHosts = useMemo(() => localData, [localData]);

  // 2. ASN Registry — unique ASNs
  const asnRegistry = useMemo(() => {
    const asnMap = {};
    localData.forEach((d) => {
      if (!asnMap[d.asn]) {
        asnMap[d.asn] = {
          asn: d.asn,
          organisation: d.asnOrg,
          country: d.country,
          ipCount: 0,
          activeIps: 0,
        };
      }
      asnMap[d.asn].ipCount += 1;
      if (d.status === "Active") asnMap[d.asn].activeIps += 1;
    });
    return Object.values(asnMap);
  }, [localData]);

  // 3. City Locations — unique cities
  const cityLocations = useMemo(() => {
    const cityMap = {};
    localData.forEach((d) => {
      const key = `${d.city}_${d.countryCode}`;
      if (!cityMap[key]) {
        cityMap[key] = {
          city: d.city,
          country: d.country,
          countryCode: d.countryCode,
          ipCount: 0,
          asnCount: 0,
          asns: new Set(),
        };
      }
      cityMap[key].ipCount += 1;
      cityMap[key].asns.add(d.asn);
      cityMap[key].asnCount = cityMap[key].asns.size;
    });
    return Object.values(cityMap).map(({ asns, ...rest }) => rest);
  }, [localData]);

  // 4. Active IPs only
  const activeIps = useMemo(
    () => localData.filter((d) => d.status === "Active"),
    [localData],
  );

  // 5. Inactive IPs only
  const inactiveIps = useMemo(
    () => localData.filter((d) => d.status === "Inactive"),
    [localData],
  );

  // Global filter function
  const filterData = (data) => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term),
      ),
    );
  };

  const tables = [
    { title: "NETWORK HOSTS", icon: "🌐", data: allHosts },
    { title: "ASN REGISTRY", icon: "🔌", data: asnRegistry },
    { title: "CITY LOCATIONS", icon: "🏙️", data: cityLocations },
    { title: "ACTIVE IPs", icon: "✅", data: activeIps },
    { title: "INACTIVE IPs", icon: "❌", data: inactiveIps },
  ];

  const totalMatches = tables.reduce(
    (acc, t) => acc + filterData(t.data).length,
    0,
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          letterSpacing: 3,
          color: "#1E3D2F",
          marginBottom: 3,
        }}
      >
        EXPLORER
      </Typography>

      {/* Search Bar */}
      <Box sx={{ marginBottom: 3 }}>
        <TextField
          fullWidth
          placeholder="Search across all tables... (e.g. 192.168.1.1, AS7922, London)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{ 'aria-label': 'Search across all tables' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon aria-hidden="true" sx={{ color: "#1E3D2F" }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Chip
                  label={`${totalMatches} results`}
                  size="small"
                  sx={{
                    backgroundColor: totalMatches > 0 ? "#1E3D2F" : "#E63946",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#ffffff",
              "&:hover fieldset": { borderColor: "#1E3D2F" },
              "&.Mui-focused fieldset": { borderColor: "#1E3D2F" },
            },
          }}
        />
      </Box>

      {/* Tables */}
      {localData.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress sx={{ color: '#1E3D2F' }} aria-label="Loading data" role="status" />
        </Box>
      ) : (
        tables.map((table) => {
          const filteredData = filterData(table.data);
          return (
            <CollapsibleTable
              key={table.title}
              title={table.title}
              icon={table.icon}
              data={filteredData}
              loading={loading}
              searchTerm={searchTerm}
              totalCount={table.data.length}
              expanded={!!expandedTables[table.title]}
              onToggle={() => setExpandedTables((prev) => ({ ...prev, [table.title]: !prev[table.title] }))}
            />
          );
        })
      )}
    </Box>
  );
}
