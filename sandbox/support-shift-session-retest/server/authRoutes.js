export function createAuthRoutes(repository) {
  return {
    login(request) {
      if (request.body?.staffCode !== "night-17") {
        return { status: 401, body: { error: "INVALID_CREDENTIALS" } };
      }

      const session = repository.issueRefreshSession({
        id: "refresh_night_17",
        userId: "support_17",
        createdAt: "2026-07-14T00:10:00.000Z",
        revokedAt: null,
      });
      return {
        status: 200,
        body: { accessToken: "access_night_17", expiresIn: 900 },
        setCookie: `refreshToken=${session.id}; HttpOnly; SameSite=Lax`,
      };
    },

    refresh(request) {
      const sessionId = request.cookies?.refreshToken;
      const session = sessionId
        ? repository.findRefreshSession(sessionId)
        : null;
      if (!session) {
        return { status: 401, body: { error: "SESSION_EXPIRED" } };
      }
      return {
        status: 200,
        body: { accessToken: `access_${session.userId}`, expiresIn: 900 },
      };
    },

    logout(request) {
      const sessionId = request.cookies?.refreshToken;
      if (sessionId) {
        repository.revokeRefreshSession(sessionId, "2026-07-14T01:00:00.000Z");
      }
      return { status: 204, body: null };
    },
  };
}
