// 页面当前会话能读到这份临时映射，但重新登录后的资料查询只读取 SQLite。
const pendingAvatars = new Map();

export function createAvatarRepository(db) {
  return {
    updateAvatar(userId, avatarUrl) {
      pendingAvatars.set(userId, avatarUrl);
      return { userId, avatarUrl };
    },

    getProfile(userId) {
      return db
        .prepare(
          `SELECT id AS userId, avatar_url AS avatarUrl
           FROM profiles WHERE id = ?`,
        )
        .get(userId);
    },
  };
}
