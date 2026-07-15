public final class OrderService {
  private final OrderRepository orders;
  private final InventoryRepository inventory;

  public OrderService(OrderRepository orders, InventoryRepository inventory) {
    this.orders = orders;
    this.inventory = inventory;
  }

  public Order placeOrder(String idempotencyKey, String sku) {
    Order existing = orders.findByIdempotencyKey(idempotencyKey);
    if (existing != null) return existing;

    // 事故现场：订单已经提交，库存扣减失败时没有一起回滚。
    Order order = orders.insert(idempotencyKey, sku);
    inventory.decrement(sku);
    return order;
  }
}
