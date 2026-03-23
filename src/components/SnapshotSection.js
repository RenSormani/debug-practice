import React from 'react';
import { Box, Typography } from '@mui/material';
import SnapshotCard from './SnapshotCard';

export default function SnapshotSection({ device }) {
  if (!device) return null;

  // Interfaces snapshot — name + status, expandable with hosts
  const interfaceRows = device.interfaces.map((i) => ({
    primary: i.name,
    badge: i.status,
  }));

  // For each interface, find hosts on the same VLAN/subnet (simulated)
  const interfaceExpandedData = device.interfaces.map((iface) => {
    const relatedHosts = device.hosts.slice(0, 2).map((h) => ({
      label: h.hostname,
      value: h.ipAddress,
    }));
    return relatedHosts;
  });

  // Hosts snapshot — hostname + status
  const hostRows = device.hosts.map((h) => ({
    primary: h.hostname,
    badge: h.status,
  }));

  // Users snapshot — username + role
  const userRows = device.users.map((u) => ({
    primary: u.username,
    badge: u.role,
  }));

  // VPNs snapshot — name + status
  const vpnRows = device.vpns.map((v) => ({
    primary: v.name,
    badge: v.status,
  }));

  // ASNs snapshot — asn + organisation
  const asnRows = device.asns.map((a) => ({
    primary: a.asn,
    badge: a.organisation,
  }));

  return (
    <Box sx={{ marginBottom: 3 }}>
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 2,
          paddingBottom: 1,
          borderBottom: '2px solid #1E3D2F',
        }}
      >
        <Typography
          sx={{
            color: '#1E3D2F',
            fontWeight: 'bold',
            fontSize: '12px',
            letterSpacing: 3,
          }}
        >
          SNAPSHOTS
        </Typography>
      </Box>

      {/* Cards */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <SnapshotCard
          title="INTERFACES"
          icon="🔌"
          rows={interfaceRows}
          expandable={true}
          expandedData={interfaceExpandedData}
        />
        <SnapshotCard
          title="HOSTS"
          icon="💻"
          rows={hostRows}
        />
        <SnapshotCard
          title="USERS"
          icon="👤"
          rows={userRows}
        />
        <SnapshotCard
          title="VPNs"
          icon="🔒"
          rows={vpnRows}
        />
        <SnapshotCard
          title="ASNs"
          icon="📡"
          rows={asnRows}
        />
      </Box>
    </Box>
  );
}