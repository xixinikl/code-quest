export function createProfileRoutes(repository) {
  return {
    updateAvatar(request) {
      if (!request.user) {
        return { status: 401, body: { error: "UNAUTHORIZED" } };
      }
      if (!request.body?.avatarUrl?.startsWith("/avatars/")) {
        return { status: 400, body: { error: "INVALID_AVATAR_URL" } };
      }

      const profile = repository.updateAvatar(
        request.user.id,
        request.body.avatarUrl,
      );
      return { status: 200, body: profile };
    },

    getProfile(request) {
      if (!request.user) {
        return { status: 401, body: { error: "UNAUTHORIZED" } };
      }
      return { status: 200, body: repository.getProfile(request.user.id) };
    },
  };
}
