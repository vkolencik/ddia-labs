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

1. **Spin up containers again:**

   ```bash
   docker compose up -d
   ```
2. Shell into the postgres container:
   ```bash
   docker exec -it pg bash
   ```

   Reconfigure Postgres:
   ```bash
   psql -U postgres -c "ALTER SYSTEM SET wal_level   = 'replica';"
   psql -U postgres -c "ALTER SYSTEM SET archive_mode = on;"
   psql -U postgres -c "ALTER SYSTEM SET archive_command = 'true';"
   psql -U postgres -c "ALTER SYSTEM SET checkpoint_timeout = '30min';"
   psql -U postgres -c "ALTER SYSTEM SET max_wal_size = '4GB';"
   psql -U postgres -c "ALTER SYSTEM SET autovacuum = off;"
   psql -U postgres -c "ALTER SYSTEM SET bgwriter_lru_maxpages = 0;"
   ```

3. Restart postgres (on the host shell):
   ```bash
   docker restart pg
   ```
   Confirm settings in the postgres container:
   ```bash
   psql -U postgres -c "SHOW wal_level; SHOW archive_mode;"
   ```

4. Create test data, using pgAdmin or console:
   ```sql
   DROP TABLE IF EXISTS lab_kv;
   CREATE TABLE lab_kv(id int PRIMARY KEY, val text);
   INSERT INTO lab_kv
      SELECT g, repeat('x',32)
      FROM generate_series(1, 10000) AS g;
   ```

5. Simulate power loss. In the host console:
   ```bash
   docker pause pg
   docker kill -s SIGKILL pg
   ```

6. Observe crash recovery in logs:
   ```
   2025-05-25 07:06:21.436 UTC [29] LOG: database system was interrupted; last known up at 2025-05-25 07:05:51 UTC
   2025-05-25 07:06:24.739 UTC [29] LOG: database system was not properly shut down; automatic recovery in progress
   2025-05-25 07:06:24.777 UTC [29] LOG: redo starts at 1/DE0000A0
   2025-05-25 07:06:24.941 UTC [29] LOG: invalid record length at 1/DE1B76C0: expected at least 24, got 0
   2025-05-25 07:06:24.941 UTC [29] LOG: redo done at 1/DE1B7688 system usage: CPU: user: 0.00 s, system: 0.02 s, elapsed: 0.16 s
   2025-05-25 07:06:24.999 UTC [27] LOG: checkpoint starting: end-of-recovery immediate wait
   2025-05-25 07:06:25.114 UTC [30] FATAL: the database system is not yet accepting connections
   2025-05-25 07:06:25.114 UTC [30] DETAIL: Consistent recovery state has not been yet reached.
   2025-05-25 07:06:25.124 UTC [31] FATAL: the database system is not yet accepting connections
   2025-05-25 07:06:25.124 UTC [31] DETAIL: Consistent recovery state has not been yet reached.
   2025-05-25 07:06:25.235 UTC [27] LOG: checkpoint complete: wrote 154 buffers (0.9%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.101 s, sync=0.085 s, total=0.243 s; sync files=31, longest=0.005 s, average=0.003 s; distance=1757 kB, estimate=1757 kB; lsn=1/DE1B76C0, redo lsn=1/DE1B76C0
   2025-05-25 07:06:25.260 UTC [1] LOG: database system is ready to accept connections
   ```
   
   ensure that the table contains all inserted data:
   ```sql
   select count(1) from lab_kv;
   ```

7. Repeat for 1M rows and observe the difference in time to recovery
   ```
   2025-05-25 07:13:35.999 UTC [29] LOG: redo done at 2/3F049550 system usage: CPU: user: 13.49 s, system: 4.86 s, elapsed: 105.35 s
   2025-05-25 07:13:36.048 UTC [27] LOG: checkpoint starting: end-of-recovery immediate wait
   2025-05-25 07:13:40.674 UTC [27] LOG: checkpoint complete: wrote 16387 buffers (100.0%); 0 WAL file(s) added, 0 removed, 97 recycled; write=2.688 s, sync=0.301 s, total=4.631 s; sync files=32, longest=0.183 s, average=0.010 s; distance=1587783 kB, estimate=1587783 kB; lsn=2/3F049588, redo lsn=2/3F049588
   ```

