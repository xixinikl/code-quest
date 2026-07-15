public final class IncidentTimeline {
  public ReleaseDecision check(Environment env, Backup backup) {
    if (!env.hasRequiredSecrets()) return ReleaseDecision.block("missing secret");
    if (!backup.isRestorable()) return ReleaseDecision.block("backup not restorable");
    if (!env.healthCheckPasses()) return ReleaseDecision.block("health check failed");
    return ReleaseDecision.ready();
  }
}

record ReleaseDecision(boolean allowed, String reason) {
  static ReleaseDecision ready() { return new ReleaseDecision(true, "ready"); }
  static ReleaseDecision block(String reason) { return new ReleaseDecision(false, reason); }
}

interface Environment {
  boolean hasRequiredSecrets();
  boolean healthCheckPasses();
}

interface Backup {
  boolean isRestorable();
}
