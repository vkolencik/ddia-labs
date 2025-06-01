# write_v2_data.py
from user_v2_pb2 import User
import gzip, struct

with gzip.open("users_v2.pb.gz", "wb") as f:
    for i in range(1, 10_001):
        msg = User(id=i,
                   full_name=f"user{i}",
                   email=f"user{i}@ex.com")
        blob = msg.SerializeToString()
        f.write(struct.pack(">I", len(blob)))
        f.write(blob)
