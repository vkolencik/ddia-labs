from kafka import KafkaConsumer, TopicPartition

def partition_counts(topic, partitions):
    consumer = KafkaConsumer(bootstrap_servers="localhost:9092")
    tps = [TopicPartition(topic, p) for p in range(partitions)]
    end = consumer.end_offsets(tps)      # high-watermark for each tp
    consumer.close()
    # return list sorted by partition id
    return [end[TopicPartition(topic, p)] for p in range(partitions)]

hash_counts  = partition_counts("hash_topic", 12)
range_counts = partition_counts("range_topic", 12)

print("hash_counts :", hash_counts)
print("range_counts:", range_counts)

# optional: save for the matplotlib snippet
with open("hash_counts.txt", "w") as f:
    for i,c in enumerate(hash_counts): f.write(f"{i} {c}\n")
with open("range_counts.txt", "w") as f:
    for i,c in enumerate(range_counts): f.write(f"{i} {c}\n")