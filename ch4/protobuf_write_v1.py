from user_v1_pb2 import User
import gzip, struct, io

with gzip.open("users_v1.pb.gz", "wb") as f:
    for i in range(1, 10_001):
        msg = User(id=i, name=f"user{i}")
        blob = msg.SerializeToString()
        f.write(struct.pack(">I", len(blob)))  # length-prefix
        f.write(blob)
print("users_v1.pb.gz written")

# read_with_v2.py
with gzip.open("users_v1.pb.gz", "rb") as f:
    length = struct.unpack(">I", f.read(4))[0]
    blob   = f.read(length)

u = User()
u.ParseFromString(blob)
print("✅  Read:", dict(id=u.id, name=u.name))
