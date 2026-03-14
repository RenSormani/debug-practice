import React, { useMemo, useState, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function NetworkGraph({ data }) {
  const [panel, setPanel] = useState(null); // { x, y, title, rows }
  const containerRef = useRef(null);

  const elements = useMemo(() => {
    if (!data || data.length === 0) return [];

    const nodes = [];
    const edges = [];
    const seenCountries = new Set();
    const seenCities = new Set();
    const seenAsns = new Set();

    data.forEach((row) => {
      // Country node
      if (!seenCountries.has(row.countryCode)) {
        seenCountries.add(row.countryCode);
        nodes.push({
          data: {
            id: `country_${row.countryCode}`,
            label: `🌍 ${row.country}`,
            type: 'country',
            country: row.country,
            countryCode: row.countryCode,
          },
        });
      }

      // City node
      const cityId = `city_${row.city}_${row.countryCode}`;
      if (!seenCities.has(cityId)) {
        seenCities.add(cityId);
        nodes.push({
          data: {
            id: cityId,
            label: `🏙️ ${row.city}`,
            type: 'city',
            city: row.city,
            countryCode: row.countryCode,
          },
        });
        edges.push({
          data: {
            id: `edge_country_city_${cityId}`,
            source: `country_${row.countryCode}`,
            target: cityId,
            type: 'country_city',
            sourceLabel: row.country,
            targetLabel: row.city,
          },
        });
      }

      // ASN node
      const asnId = `asn_${row.asn}`;
      if (!seenAsns.has(asnId)) {
        seenAsns.add(asnId);
        nodes.push({
          data: {
            id: asnId,
            label: `🔌 ${row.asn}`,
            type: 'asn',
            asn: row.asn,
            asnOrg: row.asnOrg,
          },
        });
        edges.push({
          data: {
            id: `edge_city_asn_${asnId}_${cityId}`,
            source: cityId,
            target: asnId,
            type: 'city_asn',
            sourceLabel: row.city,
            targetLabel: row.asn,
          },
        });
      }

      // IP node
      const ipId = `ip_${row.ipAddress}`;
      nodes.push({
        data: {
          id: ipId,
          label: `💻 ${row.ipAddress}`,
          type: 'ip',
          status: row.status,
          protocol: row.protocol,
          port: row.port,
          ipAddress: row.ipAddress,
          asn: row.asn,
        },
      });
      edges.push({
        data: {
          id: `edge_asn_ip_${ipId}`,
          source: asnId,
          target: ipId,
          type: 'asn_ip',
          sourceLabel: row.asn,
          targetLabel: row.ipAddress,
        },
      });
    });

    return [...nodes, ...edges];
  }, [data]);

  const getPanelData = (nodeData) => {
    switch (nodeData.type) {
      case 'country':
        const cities = [...new Set(
          data
            .filter((d) => d.countryCode === nodeData.countryCode)
            .map((d) => d.city)
        )];
        return {
          title: `🌍 ${nodeData.country}`,
          columns: ['City', 'ASNs', 'IPs'],
          rows: cities.map((city) => {
            const cityData = data.filter((d) => d.city === city);
            const asns = [...new Set(cityData.map((d) => d.asn))];
            return [city, asns.join(', '), cityData.length];
          }),
        };

      case 'city':
        const cityData = data.filter(
          (d) => d.city === nodeData.city && d.countryCode === nodeData.countryCode
        );
        const asns = [...new Set(cityData.map((d) => d.asn))];
        return {
          title: `🏙️ ${nodeData.city}`,
          columns: ['ASN', 'Organisation', 'IPs'],
          rows: asns.map((asn) => {
            const asnData = cityData.filter((d) => d.asn === asn);
            return [asn, asnData[0].asnOrg, asnData.length];
          }),
        };

      case 'asn':
        const asnData = data.filter((d) => d.asn === nodeData.asn);
        return {
          title: `🔌 ${nodeData.asn} — ${nodeData.asnOrg}`,
          columns: ['IP Address', 'Protocol', 'Port', 'Status'],
          rows: asnData.map((d) => [d.ipAddress, d.protocol, d.port, d.status]),
        };

      case 'ip':
        const ipData = data.find((d) => d.ipAddress === nodeData.ipAddress);
        return {
          title: `💻 ${nodeData.ipAddress}`,
          columns: ['Field', 'Value'],
          rows: ipData ? [
            ['IP Address', ipData.ipAddress],
            ['ASN', ipData.asn],
            ['ASN Org', ipData.asnOrg],
            ['Protocol', ipData.protocol],
            ['Port', ipData.port],
            ['Status', ipData.status],
            ['City', ipData.city],
            ['Country', ipData.country],
          ] : [],
        };

      default:
        return null;
    }
  };

  const getEdgePanelData = (edgeData) => {
    return {
      title: `Connection`,
      columns: ['Field', 'Value'],
      rows: [
        ['From', edgeData.sourceLabel],
        ['To', edgeData.targetLabel],
        ['Type', edgeData.type?.replace('_', ' → ')],
      ],
    };
  };

  const stylesheet = [
    {
      selector: 'node[type = "country"]',
      style: {
        'background-color': '#1A1A2E',
        label: 'data(label)',
        color: '#ffffff',
        'font-size': '14px',
        'font-weight': 'bold',
        'text-valign': 'center',
        'text-halign': 'center',
        width: 120,
        height: 120,
        'text-wrap': 'wrap',
        'text-max-width': '100px',
      },
    },
    {
      selector: 'node[type = "city"]',
      style: {
        'background-color': '#16213E',
        label: 'data(label)',
        color: '#ffffff',
        'font-size': '12px',
        'text-valign': 'center',
        'text-halign': 'center',
        width: 90,
        height: 90,
        'text-wrap': 'wrap',
        'text-max-width': '80px',
      },
    },
    {
      selector: 'node[type = "asn"]',
      style: {
        'background-color': '#FF6B00',
        label: 'data(label)',
        color: '#ffffff',
        'font-size': '10px',
        'text-valign': 'center',
        'text-halign': 'center',
        width: 80,
        height: 80,
        'text-wrap': 'wrap',
        'text-max-width': '70px',
      },
    },
    {
      selector: 'node[type = "ip"][status = "Active"]',
      style: {
        'background-color': '#4CAF50',
        label: 'data(label)',
        color: '#ffffff',
        'font-size': '9px',
        'text-valign': 'center',
        'text-halign': 'center',
        width: 60,
        height: 60,
        'text-wrap': 'wrap',
        'text-max-width': '55px',
      },
    },
    {
      selector: 'node[type = "ip"][status = "Inactive"]',
      style: {
        'background-color': '#E63946',
        label: 'data(label)',
        color: '#ffffff',
        'font-size': '9px',
        'text-valign': 'center',
        'text-halign': 'center',
        width: 60,
        height: 60,
        'text-wrap': 'wrap',
        'text-max-width': '55px',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 2,
        'line-color': '#cccccc',
        'target-arrow-color': '#cccccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
      },
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': 3,
        'border-color': '#FF6B00',
      },
    },
    {
      selector: 'edge:selected',
      style: {
        'line-color': '#FF6B00',
        'target-arrow-color': '#FF6B00',
        width: 3,
      },
    },
  ];

  return (
    <Box
      ref={containerRef}
      sx={{
        backgroundColor: '#f0f2f5',
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Legend */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          padding: 2,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          flexWrap: 'wrap',
        }}
      >
        <LegendItem color="#1A1A2E" label="Country" />
        <LegendItem color="#16213E" label="City" />
        <LegendItem color="#FF6B00" label="ASN" />
        <LegendItem color="#4CAF50" label="Active IP" />
        <LegendItem color="#E63946" label="Inactive IP" />
      </Box>

      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '600px' }}
        stylesheet={stylesheet}
        layout={{
          name: 'breadthfirst',
          directed: true,
          padding: 30,
          spacingFactor: 1.5,
        }}
        cy={(cy) => {
          // Click on node
          cy.on('tap', 'node', (evt) => {
            const node = evt.target;
            const nodeData = node.data();
            const renderedPos = node.renderedPosition();
            const panelData = getPanelData(nodeData);
            if (panelData) {
              setPanel({
                x: renderedPos.x,
                y: renderedPos.y,
                ...panelData,
              });
            }
          });

          // Click on edge
          cy.on('tap', 'edge', (evt) => {
            const edge = evt.target;
            const edgeData = edge.data();
            const midpoint = edge.midpoint();
            const pan = cy.pan();
            const zoom = cy.zoom();
            const x = midpoint.x * zoom + pan.x;
            const y = midpoint.y * zoom + pan.y;
            const panelData = getEdgePanelData(edgeData);
            setPanel({ x, y, ...panelData });
          });

          // Click on background — dismiss panel
          cy.on('tap', (evt) => {
            if (evt.target === cy) {
              setPanel(null);
            }
          });
        }}
      />

      {/* Floating Panel */}
      {panel && (
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            top: panel.y + 20,
            left: Math.min(panel.x + 20, 600),
            width: 320,
            zIndex: 1000,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
          }}
        >
          {/* Panel Header */}
          <Box
            sx={{
              backgroundColor: '#1A1A2E',
              padding: '8px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 'bold',
                letterSpacing: 1,
              }}
            >
              {panel.title}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setPanel(null)}
              sx={{ color: '#ffffff', padding: '2px' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Panel Table */}
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#16213E' }}>
                {panel.columns.map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      color: '#FF6B00',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      letterSpacing: 1,
                      padding: '6px 12px',
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {panel.rows.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    '&:hover': { backgroundColor: '#f0f2f5' },
                  }}
                >
                  {row.map((cell, j) => (
                    <TableCell
                      key={j}
                      sx={{
                        fontSize: '12px',
                        padding: '6px 12px',
                        color: cell === 'Active' ? '#4CAF50' :
                               cell === 'Inactive' ? '#E63946' : '#333',
                        fontWeight: cell === 'Active' || cell === 'Inactive' ? 'bold' : 'normal',
                      }}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}

function LegendItem({ color, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      <Typography variant="caption" sx={{ color: '#666' }}>
        {label}
      </Typography>
    </Box>
  );
}