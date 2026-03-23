import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RouterIcon from "@mui/icons-material/Router";

export default function DeviceTabBar({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
}) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#1A1A2E",
        borderBottom: "2px solid #FF6B00",
        overflowX: "auto",
        minHeight: 42,
        flexShrink: 0,
        "&::-webkit-scrollbar": { height: "3px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#FF6B00" },
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <Box
            key={tab.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: "8px 14px",
              cursor: "pointer",
              borderRight: "1px solid #2a2a2a",
              backgroundColor: isActive ? "#FF6B0020" : "transparent",
              borderBottom: isActive
                ? "2px solid #FF6B00"
                : "2px solid transparent",
              minWidth: "fit-content",
              height: "100%",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: isActive ? "#FF6B0030" : "#ffffff10",
              },
            }}
            onClick={() => onTabClick(tab.id)}
          >
            <RouterIcon
              sx={{
                fontSize: 14,
                color: isActive ? "#FF6B00" : "#888888",
              }}
            />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#ffffff" : "#888888",
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
              }}
            >
              {tab.hostname}
            </Typography>
            <Tooltip title="Close tab" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                sx={{
                  color: "#888888",
                  padding: "2px",
                  "&:hover": {
                    color: "#E63946",
                    backgroundColor: "#E6394620",
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      })}
    </Box>
  );
}
