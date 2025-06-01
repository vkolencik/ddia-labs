import json, time, gzip, os, struct
from user_v2_pb2 import User

records = [{"id": i, "full_name": f"user{i}", "email": f"user{i}@ex.com"}
           for i in range(1, 500_001)]

# JSON
t0=time.perf_counter()
with gzip.open("users.json.gz","wt") as f:
    for r in records: json.dump(r, f); f.write('\n')
print("json write", time.perf_counter()-t0, "s  size", os.path.getsize("users.json.gz")//1024, "KiB")

# Protobuf
t0=time.perf_counter()
with gzip.open("users.pb.gz","wb") as f:
    for r in records:
        blob = User(**r).SerializeToString()
        f.write(struct.pack(">I",len(blob))); f.write(blob)
print("pb write", time.perf_counter()-t0, "s  size", os.path.getsize("users.pb.gz")//1024, "KiB")
