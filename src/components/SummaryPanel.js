import React from "react";
import { Box, Typography } from "@mui/material";

export default function SummaryPanel({ tables, openTables, onToggle }) {
  if (!tables || tables.length === 0) return null;
  return (
    <Box
      sx={{
        width: 200,
        minWidth: 200,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        overflow: "hidden",
        alignSelf: "flex-start",
        position: "sticky",
        top: 16,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#1A1A2E",
          padding: "12px 16px",
        }}
      >
        <Typography
          sx={{
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "12px",
            letterSpacing: 2,
          }}
        >
          📊 SUMMARY
        </Typography>
      </Box>

      {/* Table rows */}
      {tables.map((table) => {
        const isOpen = openTables[table.title];
        return (
          <Box
            key={table.title}
            onClick={() => onToggle(table.title)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "23px 14px",
              cursor: "pointer",
              backgroundColor: isOpen ? "#FF6B0015" : "#ffffff",
              borderLeft: isOpen
                ? "3px solid #FF6B00"
                : "3px solid transparent",
              borderBottom: "1px solid #f0f0f0",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: isOpen ? "#FF6B0020" : "#f5f5f5",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "14px" }}>{table.icon}</Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: isOpen ? "bold" : "normal",
                  color: isOpen ? "#FF6B00" : "#1A1A2E",
                  letterSpacing: 0.5,
                }}
              >
                {table.title}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: isOpen ? "#FF6B00" : "#e0e0e0",
                borderRadius: 10,
                minWidth: 24,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 6px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: isOpen ? "#ffffff" : "#666",
                }}
              >
                {table.count}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
