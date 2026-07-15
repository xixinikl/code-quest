export function createSessionStore() {
  const sessions = new Map();
  return {
    save(id, value) {
      sessions.set(id, structuredClone(value));
    },
    load(id) {
      const value = sessions.get(id);
      return value ? structuredClone(value) : null;
    },
  };
}
