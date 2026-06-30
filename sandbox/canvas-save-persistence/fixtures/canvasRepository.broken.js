import { randomUUID } from "node:crypto";

// 当前页面能看到这些对象，但进程重启或重新查询数据库后它们就不存在。
const pendingCanvases = [];

export function createCanvasRepository(db) {
  return {
    saveCanvas(input) {
      const canvas = {
        id: randomUUID(),
        ownerId: input.ownerId,
        title: input.title,
        content: input.content,
        createdAt: new Date().toISOString(),
      };

      pendingCanvases.push(canvas);
      return canvas;
    },

    listCanvases(ownerId) {
      return db
        .prepare(
          `SELECT id, owner_id AS ownerId, title, content,
                  created_at AS createdAt
           FROM canvases
           WHERE owner_id = ?
           ORDER BY created_at DESC`,
        )
        .all(ownerId);
    },
  };
}
