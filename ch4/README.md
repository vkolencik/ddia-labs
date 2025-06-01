# Chapter 4 - Encoding and Evolution

## 0. Prerequisites
Python 3.8
```bash
python --version
```

**Set up Python environment:**
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Cleanup:**
*(Run this after you're done)*
```bash
deactivate
```

---

## Lab 1: Avro

### 0. Prerequisites
Install Avro
```bash
    pip install fastavro==1.9.5
```

### 1. Run the script
```bash
    python lab1.py
```

### 2. Observe schema compatiblity

Notice that:
1. `name` got renamed to `full_name`
2. the new optional `email` field is populated by the specified default (it's not present in serialized data)
3. When trying forward compatibility, we need to create a variant of old schema with alias; the read would fail if the original schema was used (so it's not fully forward compatible)

### 3. Check the data file in hex editor (`users_v1.avro`)

---

## Lab 2: Protobuf

### 0. Prerequisites
Install protobuff
```bash
    pip install "protobuf>=5.26" "grpcio-tools>=1.63"
```

### 1. Compile protobuf schema
```bash
    python -m grpc_tools.protoc -I. --python_out=. user_v1.proto
```
see the result in [user_v1_pb2.py](user_v1_pb2.py)

### 2. Write generate data

```bash
    python protobuf_write_v1.py
```

Unzip `users_v1.pb.gz` and peek into `users_v1.pb` in hex editor to see raw Protobuf format.

###

### 3. Compile v2 schema

```bash
    python -m grpc_tools.protoc -I. --python_out=. user_v2.proto
```

### 4. Read v1 file with v2 schema

```bash
    python protobuf_read_with_v2.py
```

### 5. Compile bad v3 schema with reused numerical tag

```bash
    python -m grpc_tools.protoc -I. --python_out=. user_v3_bad.proto
```

Try reading v1 data with v3:
```bash
     python protobuf_read_with_v3.py
```

Wire safety kicks in and second field is not displayed, only `id`.

### 6. Write v2 data and read with v1 (forward compatibility)

Write data with v2 schema:
```bash
    python write_v2.py
```

Read with v1:
```bash
    python read_v2_with_v1.py
```

Email is dropped but otherwise reading works.

### 7. Compare performance

```bash
    python perf.py
```