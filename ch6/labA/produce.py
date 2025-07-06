from kafka import KafkaProducer
import random, struct, time

producer = KafkaProducer(bootstrap_servers="localhost:9092")

TOTAL = 1_000_000
BATCH  = 1000

def rnd_bytes():
    return struct.pack(">Q", random.getrandbits(64))

# --- Workload A : hash-partitioned ---------------------------------
for i in range(TOTAL):
    key = rnd_bytes()
    producer.send("hash_topic", key=key, value=b"x")
    if i % BATCH == 0: producer.flush()
print("hash_topic done")

# --- Workload B : range-like (all to partition 0) ------------------
for i in range(TOTAL):
    key = struct.pack(">Q", i)          # monotonically rising key
    producer.send("range_topic", key=key, value=b"x", partition=0)
    if i % BATCH == 0: producer.flush()
producer.flush()
print("range_topic done")
producer.close()
