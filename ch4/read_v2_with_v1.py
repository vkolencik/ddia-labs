from user_v1_pb2 import User as UserV1
import gzip, struct

with gzip.open("users_v2.pb.gz", "rb") as f:
    length = struct.unpack(">I", f.read(4))[0]
    blob   = f.read(length)
u1 = UserV1(); u1.ParseFromString(blob)
print("✅  forward read:", u1)
