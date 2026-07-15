export function createSessionRepository(db) {
  // 当前进程能认得这些刷新凭证，但服务重启后 Map 会重新变空。
  const refreshSessions = new Map();

  return {
    issueRefreshSession(session) {
      refreshSessions.set(session.id, session);
      return session;
    },

    findRefreshSession(sessionId) {
      const session = refreshSessions.get(sessionId);
      if (!session || session.revokedAt) return null;
      return session;
    },

    revokeRefreshSession(sessionId, revokedAt) {
      const session = refreshSessions.get(sessionId);
      if (!session) return false;
      refreshSessions.set(sessionId, { ...session, revokedAt });
      return true;
    },

    persistedSessionCount() {
      return db.prepare("SELECT COUNT(*) AS count FROM refresh_sessions").get()
        .count;
    },
  };
}
