export function createCanvasRoutes(repository) {
  return {
    async create(request) {
      if (!request.user) {
        return { status: 401, body: { error: "UNAUTHORIZED" } };
      }

      if (!request.body?.title?.trim()) {
        return { status: 400, body: { error: "TITLE_REQUIRED" } };
      }

      const canvas = repository.saveCanvas({
        ownerId: request.user.id,
        title: request.body.title.trim(),
        content: request.body.content ?? "{}",
      });

      console.log("canvas.create", {
        canvasId: canvas.id,
        ownerId: request.user.id,
        status: "created",
      });

      return { status: 201, body: canvas };
    },
  };
}
