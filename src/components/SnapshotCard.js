import React, { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';

export default function SnapshotCard({ title, icon, rows, expandable = false, expandedData = [] }) {
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <Box
      sx={{
        flex: '1 1 200px',
        maxWidth: '280px',
        minWidth: '180px',
        backgroundColor: '#ffffff',
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          backgroundColor: '#16213E',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: '16px' }}>{icon}</Typography>
        <Typography
          sx={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '12px',
            letterSpacing: 2,
          }}
        >
          {title}
        </Typography>
        <Chip
          label={rows.length}
          size="small"
          sx={{
            backgroundColor: '#FF6B00',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '10px',
            height: 18,
            marginLeft: 'auto',
          }}
        />
      </Box>

      {/* Rows */}
      <Box>
        {rows.slice(0, 10).map((row, i) => (
          <Box key={i}>
            {/* Row */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '7px 14px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: expandedRow === i ? '#f0f4ff' : i % 2 === 0 ? '#ffffff' : '#fafafa',
                cursor: expandable ? 'pointer' : 'default',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
              onClick={() => expandable && setExpandedRow(expandedRow === i ? null : i)}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#1A1A2E',
                  fontWeight: '500',
                  flex: 1,
                }}
              >
                {row.primary}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {row.badge && (
                  <Chip
                    label={row.badge}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: '9px',
                      fontWeight: 'bold',
                      backgroundColor:
                        row.badge === 'Active' || row.badge === 'Up' || row.badge === 'Enabled'
                          ? '#4CAF5020'
                          : row.badge === 'Inactive' || row.badge === 'Down' || row.badge === 'Disabled'
                          ? '#E6394620'
                          : '#FF6B0020',
                      color:
                        row.badge === 'Active' || row.badge === 'Up' || row.badge === 'Enabled'
                          ? '#4CAF50'
                          : row.badge === 'Inactive' || row.badge === 'Down' || row.badge === 'Disabled'
                          ? '#E63946'
                          : '#FF6B00',
                    }}
                  />
                )}
                {expandable && (
                  <Typography sx={{ color: '#FF6B00', fontSize: '12px' }}>
                    {expandedRow === i ? '▲' : '▼'}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Expanded content */}
            {expandable && expandedRow === i && expandedData[i] && (
              <Box
                sx={{
                  backgroundColor: '#f0f4ff',
                  borderBottom: '1px solid #e0e0e0',
                  padding: '6px 14px',
                }}
              >
                {expandedData[i].map((item, j) => (
                  <Box
                    key={j}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '4px 0',
                      borderBottom: j < expandedData[i].length - 1 ? '1px dashed #e0e0e0' : 'none',
                    }}
                  >
                    <Typography sx={{ fontSize: '11px', color: '#444', flex: 1 }}>
                      💻 {item.label}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#888' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}

        {rows.length === 0 && (
          <Box sx={{ padding: 2, textAlign: 'center' }}>
            <Typography sx={{ color: '#999', fontSize: '12px' }}>No data</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}