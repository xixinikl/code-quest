public interface OrderRepository {
  Order findByIdempotencyKey(String key);

  Order insert(String key, String sku);

  void transaction(Runnable work);
}

interface InventoryRepository {
  void decrement(String sku);
}

record Order(String id, String sku) {}
