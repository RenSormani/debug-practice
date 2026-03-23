import React, { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { formatCellValue } from "../utils/cellFormatters";

export default function DataTable({ title, data, loading, error }) {
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      size: 150,
      filterFn: "contains",
      accessorFn: (row) => formatCellValue(row[key]),
      Cell: ({ renderedCellValue }) => <span>{renderedCellValue}</span>,
    }));
  }, [data]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress sx={{ color: "#1A1A2E" }} aria-label="Loading data" role="status" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 4 }}>
        Failed to load data: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          letterSpacing: 3,
          marginBottom: 3,
          color: "#1A1A2E",
        }}
      >
        {title}
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={data || []}
        enableSorting
        enableColumnFilters
        enablePagination
        enableGlobalFilter
        globalFilterFn="contains"
        initialState={{
          showColumnFilters: true,
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "#16213E",
            color: "#ffffff",
            fontWeight: "bold",
            letterSpacing: 1,
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
      />
    </Box>
  );
}
