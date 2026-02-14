# Physical Hosting Recommendation (Georgia + Nearby Regions)

## Target
Run Bowen on company-owned always-on physical infrastructure with strong responsiveness in Georgia and nearby countries.

## Recommended architecture (MVP)
- 1 primary physical server (application + database)
- 1 backup server (daily replication + backups)
- 1 cloud CDN/WAF layer for static/media delivery and DDoS baseline protection

## Primary server baseline
- CPU: 8 cores (modern Intel Xeon E / AMD EPYC)
- RAM: 32 GB ECC
- Storage: 2 x NVMe SSD 1 TB in RAID1
- Network: 1 Gbps uplink (preferably redundant ISP)
- OS: Ubuntu Server LTS

## Backup server baseline
- CPU: 4 cores
- RAM: 16 GB
- Storage: 2 TB SSD/NVMe
- Location: separate physical site for resilience

## Software layout
- Nginx reverse proxy
- Backend NestJS process manager (systemd or PM2)
- PostgreSQL with WAL archiving and nightly backup
- Optional Redis for cache/session later
- MinIO or AWS S3-compatible target for files

## Performance and regional responsiveness
- Use CDN POPs near Caucasus/Eastern Europe.
- Enable Brotli/Gzip and HTTP/2.
- Keep image/PDF assets cached at edge.
- Add synthetic monitoring from Tbilisi + neighboring regions.

## Security baseline
- Firewall + strict inbound rules
- Automatic security updates
- TLS certificates + HSTS
- Offsite encrypted backups
- Centralized logs and failed login alerts
