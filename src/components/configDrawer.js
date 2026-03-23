import React, { useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { formatAsConfig, formatAsJson } from "../utils/configFormatters";

const DRAWER_WIDTH = "33vw";

export default function ConfigDrawer({ device }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("config");

  const content =
    mode === "config" ? formatAsConfig(device) : formatAsJson(device);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Drawer Lip — always visible */}
      <Box
        sx={{
          width: 48,
          minWidth: 48,
          backgroundColor: "#1E3D2F",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 1,
          borderLeft: "2px solid #546E7A",
          "&:hover": {
            backgroundColor: "#17301E",
          },
        }}
      >
        <Tooltip
          title={open ? "Click to close" : "Click to open and view config/json"}
          placement="left"
          arrow
        >
          <IconButton
            size="small"
            aria-expanded={open}
            aria-label={open ? "Close file contents drawer" : "Open file contents drawer"}
            onClick={() => setOpen(!open)}
            onKeyDown={(e) => { if (e.key === 'Escape' && open) setOpen(false); }}
            sx={{ color: "#546E7A", padding: 0.5 }}
          >
            {open ? (
              <KeyboardDoubleArrowRightIcon aria-hidden="true" sx={{ fontSize: 40 }} />
            ) : (
              <KeyboardDoubleArrowLeftIcon aria-hidden="true" sx={{ fontSize: 40 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Drawer Content */}
      {open && (
        <Box
          sx={{
            width: DRAWER_WIDTH,
            minWidth: DRAWER_WIDTH,
            backgroundColor: "#0D1117",
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid #333",
            overflow: "hidden",
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              backgroundColor: "#1E3D2F",
              borderBottom: "1px solid #333",
              flexShrink: 0,
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
              FILE CONTENTS
            </Typography>

            {/* Toggle */}
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, val) => val && setMode(val)}
              size="small"
            >
              <ToggleButton
                value="config"
                sx={{
                  color: mode === "config" ? "#546E7A" : "#888888",
                  borderColor: "#333",
                  fontSize: "10px",
                  padding: "2px 8px",
                  "&.Mui-selected": {
                    backgroundColor: "#546E7A20",
                    color: "#546E7A",
                    borderColor: "#546E7A",
                  },
                }}
              >
                CONFIG
              </ToggleButton>
              <ToggleButton
                value="json"
                sx={{
                  color: mode === "json" ? "#546E7A" : "#888888",
                  borderColor: "#333",
                  fontSize: "10px",
                  padding: "2px 8px",
                  "&.Mui-selected": {
                    backgroundColor: "#546E7A20",
                    color: "#546E7A",
                    borderColor: "#546E7A",
                  },
                }}
              >
                JSON
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Content */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              padding: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#0D1117",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#333",
                borderRadius: "3px",
              },
            }}
          >
            <Typography
              component="pre"
              sx={{
                color: "#a8ff78",
                fontSize: "11px",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {content}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
