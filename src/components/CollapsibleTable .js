import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import DataTable from './DataTable';

export default function CollapsibleTable({
  title,
  icon,
  data = [],
  searchTerm = '',
  totalCount = 0,
  loading = false,
  expanded,
  onToggle,
}) {
  const isFiltered = (searchTerm || '').trim().length > 0;
  const hasResults = data.length > 0;

  return (
    <Box
      sx={{
        marginBottom: 3,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: '#1A1A2E',
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '18px' }}>{icon}</Typography>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 'bold',
              letterSpacing: 2,
              fontSize: '14px',
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
                  ? '#E63946'
                  : isFiltered
                  ? '#FF6B00'
                  : '#ffffff20',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '11px',
            }}
          />
        </Box>
        <Typography sx={{ color: '#ffffff', fontSize: '20px' }}>
          {expanded ? '▲' : '▼'}
        </Typography>
      </Box>

      {/* Content */}
      {expanded && (
        !hasResults ? (
          <Box
            sx={{
              padding: 3,
              textAlign: 'center',
              backgroundColor: '#fafafa',
            }}
          >
            <Typography sx={{ color: '#999', fontSize: '13px' }}>
              {isFiltered
                ? `No results for "${searchTerm}" in this table`
                : 'No data available'}
            </Typography>
          </Box>
        ) : (
          <DataTable
            title=""
            data={[...data]}
            loading={loading}
            error={null}
          />
        )
      )}
    </Box>
  );
}