const registry = {
  readOrder: {
    input: { orderId: "string" },
    permission: "orders:read",
  },
  searchKnowledge: {
    input: { query: "string" },
    permission: "knowledge:read",
  },
};

export function getRegistry() {
  return registry;
}

export function invokeTool(name, args, context = {}) {
  const tool = registry[name];
  if (!tool) {
    return { ok: false, error: "UNKNOWN_TOOL", requestId: context.requestId };
  }

  // This visible prefix check is useful evidence, but it is not resource ownership.
  if (args.path?.startsWith("/internal")) {
    return { ok: false, error: "TOOL_DENIED", requestId: context.requestId };
  }

  return { ok: true, tool: name, data: "订单状态：处理中" };
}
