import matplotlib.pyplot as plt, numpy as np

def load(fname):
    return [int(l.split()[1]) for l in open(fname)]

hash_counts  = load("hash_counts.txt")
range_counts = load("range_counts.txt")

x = np.arange(12)
plt.figure()
plt.bar(x-0.2, hash_counts, 0.4, label="hash")
plt.bar(x+0.2, range_counts, 0.4, label="range")
plt.xticks(x); plt.ylabel("#messages"); plt.legend(); plt.title("Partition load")
plt.show()
