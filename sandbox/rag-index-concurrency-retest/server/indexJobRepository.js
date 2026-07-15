export function createIndexJobRepository(database) {
  return {
    async claimNextJob(workerId, hooks = {}) {
      const job = database
        .prepare(
          "SELECT * FROM index_jobs WHERE status = 'pending' ORDER BY id LIMIT 1",
        )
        .get();

      if (!job) return null;

      // 两个 Worker 都可能停在这里，并同时相信任务仍是 pending。
      await hooks.afterRead?.(job);

      database
        .prepare(
          "UPDATE index_jobs SET status = 'running', worker_id = ?, started_at = ? WHERE id = ?",
        )
        .run(workerId, new Date().toISOString(), job.id);

      return { ...job, status: "running", worker_id: workerId };
    },

    completeJob(jobId) {
      database
        .prepare("UPDATE index_jobs SET status = 'completed' WHERE id = ?")
        .run(jobId);
    },
  };
}
