import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { fetchUsersRequest } from "../redux/actions";

export default function UsersTable() {
  const dispatch = useDispatch();
const users = useSelector((state) => state.users);
const loading = useSelector((state) => state.loading);
const error = useSelector((state) => state.error);

  // Fetch users when the component mounts
  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  // Define the table columns
  // Dynamically generate columns from the API data
const columns = useMemo(() => {
    if (!users || users.length === 0) return [];

    return Object.keys(users[0]).map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      size: 150,
      accessorFn: (row) => {
        const value = row[key];
        if (typeof value === 'object' && value !== null) {
          if (value.street && value.city) {
            return `${value.street}, ${value.city}`;
          }
          if (value.name) {
            return value.name;
          }
          return JSON.stringify(value);
        }
        return String(value ?? '');
      },
      Cell: ({ renderedCellValue }) => (
        <span>{renderedCellValue}</span>
      ),
    }));
  }, [users]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress sx={{ color: "#FF6B00" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 4 }}>
        Failed to load users: {error}
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
        USERS
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={users}
        enableSorting
        enableFilters
        enableColumnFilters
        enablePagination
        enableGlobalFilter
        muiTableProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "#afafb1",
            color: "#ffffff",
            fontWeight: "bold",
            letterSpacing: 1,
            "& .MuiIconButton-root": {
              color: "#ffffff",
            },
            "& .MuiSvgIcon-root": {
              color: "#ffffff",
            },
          },
        }}
        muiTableBodyRowProps={{
          hover: true,
          sx: {
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
        }}
      />
    </Box>
  );
}
