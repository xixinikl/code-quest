import { readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { ContractError, requireScenario } from "./scenarios.js";

const MAX_ARTIFACT_BYTES = 64 * 1024;

export function readScenarioArtifacts(projectRoot: string, scenarioId: string) {
  const scenario = requireScenario(scenarioId);
  const sandboxRoot = realpathSync(resolve(projectRoot, "sandbox"));

  return scenario.artifacts.map((artifact) => {
    const configuredPath = resolve(sandboxRoot, artifact.relativePath);
    const realPath = realpathSync(configuredPath);
    const relativePath = relative(sandboxRoot, realPath);
    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
      throw new ContractError(
        "ARTIFACT_OUTSIDE_SANDBOX",
        "场景材料越出固定沙盒边界",
      );
    }
    if (statSync(realPath).size > MAX_ARTIFACT_BYTES) {
      throw new ContractError("ARTIFACT_TOO_LARGE", "场景材料超过 64KB");
    }
    return {
      id: artifact.id,
      label: artifact.label,
      language: artifact.language,
      relativePath: `sandbox/${artifact.relativePath}`,
      content: readFileSync(realPath, "utf8"),
    };
  });
}
