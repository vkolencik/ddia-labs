from fastavro import writer, reader, parse_schema
from pathlib import Path

# ---------- 1. writer schema v1 ----------
schema_v1 = {
    "type": "record",
    "name": "User",
    "fields": [
        {"name": "id",   "type": "long"},
        {"name": "name", "type": "string"}
    ]
}
records_v1 = [{"id": i, "name": f"user{i}"} for i in range(1, 11_001)]
with open("users_v1.avro", "wb") as fo:
    writer(fo, parse_schema(schema_v1), records_v1)

# ---------- 2. reader schema v2 (add field + rename) ----------
schema_v2 = {
    "type": "record",
    "name": "User",
    "fields": [
        {"name": "id",        "type": "long"},
        {"name": "full_name", "type": "string", "aliases": ["name"]},
        {"name": "email",     "type": ["null", "string"], "default": None}
    ]
}
with open("users_v1.avro", "rb") as fo:
    sample = next(reader(fo, reader_schema=parse_schema(schema_v2)))
print("\n✅  Backward-compatible read with v2:\n", sample)

# ---------- 3. incompatible reader schema v3 (type change) ----------
schema_bad = {
    "type": "record",
    "name": "User",
    "fields": [
        {"name": "id", "type": "string"},          # was long
        {"name": "name", "type": "string"}
    ]
}
try:
    with open("users_v1.avro", "rb") as fo:
        next(reader(fo, reader_schema=parse_schema(schema_bad)))
except Exception as e:
    print("\n❌  Type change breaks compatibility:\n", e)

exit()
# ---------- 4. write new data with email; read using old schema ----------
# TODO: fix this:
records_v2 = [{"id": i, "full_name": f"user{i}", "email": f"user{i}@ex.com"}
              for i in range(1, 11_001)]
with open("users_v2.avro", "wb") as fo:
    writer(fo, parse_schema(schema_v2), records_v2)

print("\nForward-compat test: old schema reading new file")
with open("users_v2.avro", "rb") as fo:
    old_reader_schema = parse_schema(schema_v1)
    print(next(reader(fo, reader_schema=old_reader_schema)))
