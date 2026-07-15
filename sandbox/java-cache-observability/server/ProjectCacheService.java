public final class ProjectCacheService {
  private final ProjectCache cache;
  private final ProjectRepository repository;

  public ProjectCacheService(ProjectCache cache, ProjectRepository repository) {
    this.cache = cache;
    this.repository = repository;
  }

  public Project read(String projectId) {
    Project cached = cache.get(projectId);
    if (cached != null) return cached;

    Project fresh = repository.find(projectId);
    cache.put(projectId, fresh, 60);
    return fresh;
  }
}

interface ProjectCache {
  Project get(String key);

  void put(String key, Project project, int ttlSeconds);
}

interface ProjectRepository {
  Project find(String projectId);
}

record Project(String id, int version, String status) {}
