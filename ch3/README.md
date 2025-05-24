# Chapter 3: Storage & Retrieval

### Lab 1 Write-heavy vs read-heavy benchmark (≈ 90 min)

1. **Spin up containers:**

   ```bash
   docker compose up -d
   ```
2. **Run the bulk insert+lookup script for both Redis and Postgres:**

   ```bash
   npm run start
   ```
   
3. `charts` directory now contains the measured times, `data` directory contains raw pg/redis data for inspection
4. Cleanup: `docker compose down` and delete the `data` directory

### Lab 2 Observe WAL & crash-recovery (≈ 60 min)

1. In the same Postgres container, enable `archive_mode=on` and `wal_level=replica`.
2. Insert a small table, then **truncate container disk** (`docker pause pg && docker kill -s SIGKILL pg`).
3. Restart container; watch Postgres replay WAL and verify data consistency.
4. Measure recovery time as a function of inserted rows (e.g., 10 k vs 1 M).

### Lab 3 DIY columnar analytics with DuckDB (≈ 1 h)

1. Export 100 MB of production-like JSON logs or csv sample.
2. `duckdb logs.duckdb` → `COPY 'logs.csv' TO logs;`
3. Run a group-by/top-N query that is slow in your OLTP DB; time it in DuckDB.
4. Add `CREATE INDEX` in DuckDB to compare column scan vs indexed execution.
   Outcome: see why column stores + vectorised execution dominate wide-scan analytics.

*(AWS option: use t3.small EC2 with attached gp3 volume; substitute containers with RDS-Postgres and a self-hosted Cassandra for LSM.)*
