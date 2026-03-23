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
          backgroundColor: "#1E3D2F",
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
          <span aria-hidden="true">📊 </span>SUMMARY
        </Typography>
      </Box>

      {/* Table rows */}
      {tables.map((table) => {
        const isOpen = openTables[table.title];
        return (
          <Box
            key={table.title}
            role="button"
            tabIndex={0}
            aria-pressed={!!isOpen}
            onClick={() => onToggle(table.title)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(table.title); } }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "23px 14px",
              cursor: "pointer",
              backgroundColor: isOpen ? "#546E7A15" : "#ffffff",
              borderLeft: isOpen
                ? "3px solid #546E7A"
                : "3px solid transparent",
              borderBottom: "1px solid #f0f0f0",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: isOpen ? "#546E7A20" : "#f5f5f5",
              },
              "&:focus-visible": {
                outline: "2px solid #546E7A",
                outlineOffset: "-2px",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography aria-hidden="true" sx={{ fontSize: "14px" }}>{table.icon}</Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: isOpen ? "bold" : "normal",
                  color: isOpen ? "#546E7A" : "#1E3D2F",
                  letterSpacing: 0.5,
                }}
              >
                {table.title}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: isOpen ? "#546E7A" : "#e0e0e0",
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
                  color: isOpen ? "#ffffff" : "#555555",
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
