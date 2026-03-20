// Formats device data as a Cisco-style config
export const formatAsConfig = (device) => {
  if (!device) return "";
  return `! Device Configuration
! Generated: ${new Date().toISOString()}
!
hostname ${device.identity.hostname}
!
! === IDENTITY ===
ip address ${device.identity.ipAddress}
location ${device.identity.location}
device-type ${device.identity.type}
status ${device.identity.status}
!
! === PROVENANCE ===
source ${device.provenance.source}
collector ${device.provenance.collector}
feed ${device.provenance.feed}
confidence ${device.provenance.confidence}
reliability ${device.provenance.reliability}
last-seen ${device.provenance.lastSeen}
!
! === TECHNICAL ===
operating-system ${device.technical.os}
firmware ${device.technical.firmware}
protocol ${device.technical.protocol}
open-ports ${device.technical.openPorts}
asn ${device.technical.asn}
bgp-peer ${device.technical.bgpPeer}
!
! === INTERFACES ===
${device.interfaces
  .map(
    (i) => `interface ${i.name}
 ip address ${i.ipAddress}
 mac-address ${i.macAddress}
 speed ${i.speed}
 vlan ${i.vlan}
 status ${i.status}
!`,
  )
  .join("\n")}
! === HOSTS ===
${device.hosts
  .map(
    (h) => `host ${h.hostname}
 ip address ${h.ipAddress}
 os ${h.os}
 type ${h.type}
 status ${h.status}
!`,
  )
  .join("\n")}
! === USERS ===
${device.users
  .map(
    (u) => `user ${u.username}
 role ${u.role}
 email ${u.email}
 mfa ${u.mfa}
 status ${u.status}
!`,
  )
  .join("\n")}
! === VPNs ===
${device.vpns
  .map(
    (v) => `vpn ${v.name}
 type ${v.type}
 remote-endpoint ${v.remoteEndpoint}
 protocol ${v.protocol}
 encryption ${v.encryption}
 status ${v.status}
!`,
  )
  .join("\n")}
! === ASNs ===
${device.asns
  .map(
    (a) => `asn ${a.asn}
 organisation ${a.organisation}
 country ${a.country}
 ip-range ${a.ipRange}
 peers ${a.peers}
 status ${a.status}
!`,
  )
  .join("\n")}
! End of configuration`;
};

// Formats device data as pretty JSON
export const formatAsJson = (device) => {
  if (!device) return "";
  return JSON.stringify(device, null, 2);
};
