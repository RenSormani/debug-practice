import React, { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function OverviewPanel({
  title,
  icon,
  data,
  collapsible = false,
}) {
  const [expanded, setExpanded] = useState(!collapsible);

  return (
    <Box
      sx={{
        marginBottom: 2,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Panel Header */}
      <Box
        role={collapsible ? "button" : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? expanded : undefined}
        aria-controls={collapsible ? `overview-panel-${title}` : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#1A1A2E",
          cursor: collapsible ? "pointer" : "default",
          '&:focus-visible': collapsible ? { outline: '2px solid #FF6B00', outlineOffset: '-2px' } : undefined,
        }}
        onClick={() => collapsible && setExpanded(!expanded)}
        onKeyDown={(e) => { if (collapsible && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setExpanded(!expanded); } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography component="span" aria-hidden="true" sx={{ fontSize: "18px" }}>{icon}</Typography>
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
        </Box>
        {collapsible && (
          <span aria-hidden="true" style={{ color: "#ffffff", display: "flex", alignItems: "center" }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </span>
        )}
      </Box>

      {/* Panel Content */}
      <div id={`overview-panel-${title}`}>
        {expanded && (
          <Box
            sx={{
              backgroundColor: "#ffffff",
              padding: 1.5,
            }}
          >
            <Grid container spacing={2}>
              {Object.entries(data).map(([key, value]) => (
                <Grid item xs={4} key={key}>
                  <Box
                    sx={{
                      padding: "6px 10px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: 1,
                      borderLeft: "3px solid #FF6B00",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#6d6d6d",
                        fontSize: "9px",
                        letterSpacing: 2,
                        fontWeight: "bold",
                        marginBottom: "2px",
                        textTransform: "uppercase",
                      }}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#1A1A2E",
                        fontSize: "12px",
                        fontWeight: "bold",
                        letterSpacing: 0.5,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </div>
    </Box>
  );
}
