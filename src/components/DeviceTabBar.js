import React from "react";
import { Box, Typography } from "@mui/material";
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
      role="tablist"
      aria-label="Open device profiles"
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#1E3D2F",
        borderBottom: "2px solid #546E7A",
        overflowX: "auto",
        minHeight: 42,
        flexShrink: 0,
        "&::-webkit-scrollbar": { height: "3px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#546E7A" },
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          /*
           * ARIA closeable-tab pattern: the entire tab (including the ×) is role="tab".
           * The close icon is a visual-only <span> (not a <button>) to avoid
           * nested-interactive / aria-required-children violations.
           * Keyboard users close the tab with Delete or Backspace.
           */
          <Box
            key={tab.id}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            aria-label={`${tab.hostname} — press Delete to close`}
            onClick={() => onTabClick(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTabClick(tab.id); }
              if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); onTabClose(tab.id); }
              if (e.key === 'ArrowRight') { const idx = tabs.findIndex(t => t.id === tab.id); const next = tabs[(idx + 1) % tabs.length]; onTabClick(next.id); }
              if (e.key === 'ArrowLeft') { const idx = tabs.findIndex(t => t.id === tab.id); const prev = tabs[(idx - 1 + tabs.length) % tabs.length]; onTabClick(prev.id); }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: "8px 14px",
              cursor: "pointer",
              borderRight: "1px solid #2a2a2a",
              backgroundColor: isActive ? "#546E7A20" : "transparent",
              borderBottom: isActive ? "2px solid #546E7A" : "2px solid transparent",
              minWidth: "fit-content",
              height: "100%",
              transition: "all 0.15s ease",
              "&:hover": { backgroundColor: isActive ? "#546E7A30" : "#ffffff10" },
              "&:focus-visible": { outline: "2px solid #546E7A", outlineOffset: "-2px" },
            }}
          >
            <RouterIcon aria-hidden="true" sx={{ fontSize: 14, color: isActive ? "#546E7A" : "#888888" }} />
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
            {/* Visual-only close icon — not a button, so no nested-interactive violation.
                Keyboard users use Delete/Backspace on the focused tab instead. */}
            <span
              aria-hidden="true"
              onClick={(e) => { e.stopPropagation(); onTabClose(tab.id); }}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "#888888",
                borderRadius: "4px",
                padding: "2px",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#E63946"; e.currentTarget.style.backgroundColor = "#E6394620"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#888888"; e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <CloseIcon sx={{ fontSize: 12 }} />
            </span>
          </Box>
        );
      })}
    </Box>
  );
}
