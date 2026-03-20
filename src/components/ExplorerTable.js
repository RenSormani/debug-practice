import React, { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function ExplorerTable({
  title,
  icon,
  data = [],
  loading,
  searchTerm = "",
  totalCount = 0,
}) {
  const [expanded, setExpanded] = useState(true);

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
    }));
  }, [data]);

  const hasResults = data.length > 0;
  const isFiltered = (searchTerm || "").trim().length > 0;
  const isReady = hasResults && columns.length > 0;

  return (
    <Box
      sx={{
        marginBottom: 3,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        overflow: "hidden",
      }}
    >
      {/* Table Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#1A1A2E",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: "18px" }}>{icon}</Typography>
          <Typography
            sx={{
              color: "#ffffff",
              fontWeight: "bold",
              letterSpacing: 2,
              fontSize: "14px",
            }}
          >
            {title}
          </Typography>
          <Chip
            label={
              isFiltered ? `${data.length} / ${totalCount}` : `${totalCount}`
            }
            size="small"
            sx={{
              backgroundColor:
                isFiltered && !hasResults
                  ? "#E63946"
                  : isFiltered
                  ? "#FF6B00"
                  : "#ffffff20",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "11px",
            }}
          />
        </Box>
        <IconButton size="small" sx={{ color: "#ffffff" }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Table Content */}
      <Box sx={{ display: expanded ? "block" : "none" }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100px"
          >
            <CircularProgress size={24} sx={{ color: "#1A1A2E" }} />
          </Box>
        ) : !isReady ? (
          <Box
            sx={{
              padding: 3,
              textAlign: "center",
              backgroundColor: "#fafafa",
            }}
          >
            <Typography sx={{ color: "#999", fontSize: "13px" }}>
              {isFiltered
                ? `No results for "${searchTerm}" in this table`
                : "No data available"}
            </Typography>
          </Box>
        ) : (
          <MaterialReactTable
            columns={columns}
            data={data}
            enableSorting
            enablePagination
            initialState={{
              pagination: { pageSize: 5 },
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#16213E",
                color: "#ffffff",
                fontWeight: "bold",
                "& .MuiIconButton-root": { color: "#FF6B00" },
                "& .MuiSvgIcon-root": { color: "#FF6B00" },
              },
            }}
            muiTableBodyRowProps={{
              hover: true,
              sx: {
                "&:hover": { backgroundColor: "#f5f5f5" },
              },
            }}
            enableTopToolbar={false}
          />
        )}
      </Box>
    </Box>
  );
}