# read_with_v2.py
from user_v2_pb2 import User
import gzip, struct, io

with gzip.open("users_v1.pb.gz", "rb") as f:
    length = struct.unpack(">I", f.read(4))[0]
    blob   = f.read(length)

u = User()
u.ParseFromString(blob)
print("✅  backward read:", dict(id=u.id, full_name=u.full_name, email=u.email))
