from user_v3_bad_pb2 import User
import gzip, struct

with gzip.open("users_v1.pb.gz", "rb") as f:
    length = struct.unpack(">I", f.read(4))[0]
    blob   = f.read(length)

u = User()
u.ParseFromString(blob)
print(u)          # score contains UTF-8 bytes re-interpreted as int64 junk
