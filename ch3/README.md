# Chapter 3: Storage & Retrieval

### Lab 1 Write-heavy vs read-heavy benchmark (≈ 90 min)

1. **Spin up containers**

   ```bash
   docker compose up -d
   ```
2. **Generate postgres entries**:

   ```bash
   npm run postgres
   ```
   
3. Measure throughput for:

   * bulk insert,
   * random single-row read,
   * range scan (first 1 000 contiguous keys).
4. Compare numbers; observe Pg (B-Tree) win on range read, RocksDB win on insert.
5. Delete 10 % of keys in RocksDB, trigger manual compaction (`redis-cli BGREWRITEAOF`), re-run reads → note improved latency.

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
