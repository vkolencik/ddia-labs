# Chapter 5: Replication

## Lab 5A: Single leader replication and failover (PostgreSQL + Patroni)

1. Run three PostgreSQL replicas:
```bash
    docker compose up -d
```
observe docker logs as containers boot up

2. Explore replicas
Connect to replicas at `localhost:5433` and `localhost:5432` using pgAdmin. Run this in `repmgr` database:
```sql
    SELECT * FROM repmgr.nodes;
```
and see the list of nodes.

3. Create database and fill a table in the leader node (`localhost:5433`)

```sql
   DROP TABLE IF EXISTS lab_kv;
   CREATE TABLE lab_kv(id int PRIMARY KEY, val text);
   INSERT INTO lab_kv
      SELECT g, repeat('x',32)
      FROM generate_series(1, 10000) AS g;
```

then connect to follower node (`localhost:4324`) and see the table is there:
```sql
    SELECT count(1) FROM lab_kv;
```

4. Simulate a failover

First run this in the leader node:
```sql
   DROP TABLE IF EXISTS lab_kv;
   CREATE TABLE lab_kv(id int PRIMARY KEY, val text);
   INSERT INTO lab_kv
      SELECT g, repeat('x',32)
      FROM generate_series(1, 1000000) AS g;
```

While it's running (takes about 10-20 secs) kill the leader from console:
```bash
docker pause  docker pause ch5-pg-1-1
docker kill -s SIGKILL ch5-pg-1-1
```

Observe logs of other containers and see the failover process. Look for a line looking like this:
```
    /opt/bitnami/repmgr/events/router.sh 1002 standby_promote 1 "2025-06-07 17:51:34.08476+00" "server \"pg-2\" (ID: 1002) was successfully promoted to primary"
```

5. See results of the failovers
In the new leader, run
```sql
SELECT count(1) FROM lab_kv;
```
see that a portion or none of the entries were synced.

See the updated nodes list:
```sql
    SELECT * FROM repmgr.nodes;
```

6. Bring the old leader back up
```bash
    docker start ch5-pg-1-1
```

(You might have to delete `/tmp/repmgrd.pid` in the started container right after bringing it up, otherwise repmgr will not start.)

See this in the logs:
```
    postgresql-repmgr 17:56:15.72 INFO ==> Cloning data from primary node...
```
