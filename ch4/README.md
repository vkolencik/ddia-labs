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
