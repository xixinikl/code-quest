import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCode2,
  FlaskConical,
  HelpCircle,
  LoaderCircle,
  PlayCircle,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import {
  getTransferRetestConfig,
  type TransferRetestSourceId,
  type TransferRetestStage,
} from "./transferRetests";

type Attempt = {
  id: string;
  scenarioId: string;
  status: "active" | "submitted";
  hintLevel: number;
  verificationStatus: "not_run" | "failed" | "passed" | "invalid_report";
  steps: Record<string, { response: Record<string, string>; savedAt: string }>;
  latestVerification?: {
    status: "not_run" | "failed" | "passed" | "invalid_report";
    report: {
      generatedAt?: string;
      message?: string;
      sourceHash?: string;
      summary?: {
        passed: number;
        failed: number;
      };
      tests?: Array<{
        name: string;
        status: "passed" | "failed";
        message?: string;
      }>;
    };
  } | null;
};

type Artifact = {
  id: string;
  label: string;
  language: string;
  relativePath: string;
  content: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = (await response.json()) as T & {
    message?: string;
    error?: string;
  };
  if (!response.ok) throw new Error(body.message || body.error || "请求失败");
  return body;
}

function firstIncompleteStage(attempt: Attempt, stages: TransferRetestStage[]) {
  const index = stages.findIndex((stage) => !attempt.steps[stage.id]);
  return index < 0 ? stages.length - 1 : index;
}

export function TransferRetestLab({
  sourceScenarioId,
  onBack,
  onCompleted,
}: {
  sourceScenarioId: TransferRetestSourceId;
  onBack: () => void;
  onCompleted: () => void | Promise<void>;
}) {
  const config = getTransferRetestConfig(sourceScenarioId);
  const { stages, hints } = config;
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [selectedArtifactId, setSelectedArtifactId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        const [started, scenario] = await Promise.all([
          request<Attempt>(`/api/transfer-retests/${sourceScenarioId}/start`, {
            method: "POST",
            body: "{}",
          }),
          request<{ artifacts: Artifact[] }>(
            `/api/scenarios/${config.scenarioId}`,
          ),
        ]);
        if (cancelled) return;
        setAttempt(started);
        setArtifacts(scenario.artifacts);
        const index = firstIncompleteStage(started, stages);
        setActiveIndex(index);
        setDraft(started.steps[stages[index].id]?.response.text ?? "");
        setSelectedArtifactId(stages[index].artifactIds[0]);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "无法进入延迟复测");
        }
      }
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, [config.scenarioId, sourceScenarioId, stages]);

  const stage = stages[activeIndex];
  const visibleArtifacts = useMemo(
    () =>
      artifacts.filter((artifact) => stage?.artifactIds.includes(artifact.id)),
    [artifacts, stage],
  );
  const selectedArtifact =
    visibleArtifacts.find((artifact) => artifact.id === selectedArtifactId) ??
    visibleArtifacts[0];
  const completedCount = attempt
    ? stages.filter((item) => attempt.steps[item.id]).length
    : 0;

  function moveTo(index: number, nextAttempt = attempt) {
    if (!nextAttempt) return;
    const bounded = Math.max(0, Math.min(stages.length - 1, index));
    setActiveIndex(bounded);
    setDraft(nextAttempt.steps[stages[bounded].id]?.response.text ?? "");
    setSelectedArtifactId(stages[bounded].artifactIds[0]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveResponse() {
    if (!attempt || draft.trim().length < stage.minimum) return;
    setBusy(true);
    setError("");
    try {
      const updated = await request<Attempt>(
        `/api/attempts/${attempt.id}/steps/${stage.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ response: { text: draft.trim() } }),
        },
      );
      setAttempt(updated);
      if (activeIndex < stages.length - 1) moveTo(activeIndex + 1, updated);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "保存失败");
    } finally {
      setBusy(false);
    }
  }

  async function takeHint() {
    if (!attempt || attempt.hintLevel >= 3) return;
    setBusy(true);
    try {
      setAttempt(
        await request<Attempt>(`/api/attempts/${attempt.id}/hints`, {
          method: "POST",
          body: "{}",
        }),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "领取线索失败");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!attempt) return;
    setBusy(true);
    setError("");
    try {
      setAttempt(
        await request<Attempt>(`/api/attempts/${attempt.id}/verify`, {
          method: "POST",
          body: "{}",
        }),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "读取测试报告失败");
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!attempt) return;
    setBusy(true);
    setError("");
    try {
      await request<Attempt>(`/api/attempts/${attempt.id}/submit`, {
        method: "POST",
        body: "{}",
      });
      await onCompleted();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "复测结算失败");
    } finally {
      setBusy(false);
    }
  }

  if (!attempt && !error) {
    return (
      <main className="retest-loading" aria-live="polite">
        <LoaderCircle className="spin" />
        <p>正在打开{config.location}卷宗...</p>
      </main>
    );
  }

  if (!attempt) {
    return (
      <main className="retest-loading error">
        <ShieldCheck />
        <h1>复测卷宗暂时无法打开</h1>
        <p>{error}</p>
        <button onClick={onBack}>返回路线大厅</button>
      </main>
    );
  }

  const report = attempt.latestVerification?.report;
  const reportTests = report?.tests ?? [];
  const reportPassedCount =
    report?.summary?.passed ??
    reportTests.filter((test) => test.status === "passed").length;
  const reportFailedCount =
    report?.summary?.failed ??
    reportTests.filter((test) => test.status === "failed").length;
  const reportGeneratedAt = report?.generatedAt
    ? new Date(report.generatedAt).toLocaleString("zh-CN", { hour12: false })
    : "报告未提供";
  const reportSourceHash = report?.sourceHash
    ? report.sourceHash.slice(0, 10)
    : "报告未提供";
  const allResponsesReady = stages.every((item) => attempt.steps[item.id]);

  return (
    <main
      className={`retest-shell ${config.cameraVariant}`}
      style={
        { "--retest-scene": `url(${config.scene})` } as React.CSSProperties
      }
    >
      <div className="retest-backdrop" />
      <header className="retest-hud">
        <button onClick={onBack} aria-label="返回路线大厅">
          <ArrowLeft />
        </button>
        <div>
          <span>延迟变式复测 · {config.chapterLabel}</span>
          <strong>{config.location}</strong>
        </div>
        <div className="retest-progress">
          <span>原始作答</span>
          <strong>{completedCount}/4</strong>
        </div>
      </header>

      <section className="retest-stage">
        <aside className="retest-mentor">
          <img src={config.portrait} alt={config.mentorName} />
          <div>
            <span>
              {config.mentorTitle} · {config.mentorName}
            </span>
            <strong>{config.mentorLine}</strong>
            <p>{config.mentorBody}</p>
          </div>
        </aside>

        <section className="retest-workbench">
          <nav aria-label="复测阶段">
            {stages.map((item, index) => (
              <button
                aria-current={index === activeIndex ? "step" : undefined}
                disabled={index > completedCount}
                key={item.id}
                onClick={() => moveTo(index)}
                type="button"
              >
                <b>{attempt.steps[item.id] ? <CheckCircle2 /> : index + 1}</b>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="retest-case-brief">
            <span>新案件 · 不是原题换皮</span>
            <h1>{config.caseTitle}</h1>
            <div
              className={`retest-flow ${config.mapVariant}`}
              aria-label={config.flowLabel}
            >
              {config.flow.map(([label, payload], index) => (
                <div key={label}>
                  {index > 0 && <ArrowRight />}
                  <span>{label}</span>
                  <small>{payload}</small>
                </div>
              ))}
            </div>
          </div>

          <article className="retest-task-card">
            <header>
              <span>当前任务 · {stage.label}</span>
              <strong>{stage.title}</strong>
              <p>{stage.prompt}</p>
            </header>

            <div className="retest-artifacts">
              <div className="retest-artifact-tabs" aria-label="本步证物">
                {visibleArtifacts.map((artifact) => (
                  <button
                    aria-pressed={selectedArtifact?.id === artifact.id}
                    key={artifact.id}
                    onClick={() => setSelectedArtifactId(artifact.id)}
                    type="button"
                  >
                    <FileCode2 /> {artifact.label}
                  </button>
                ))}
              </div>
              {selectedArtifact && (
                <section className="retest-artifact-reader">
                  <header>
                    <span>{selectedArtifact.label}</span>
                    <code>{selectedArtifact.relativePath}</code>
                  </header>
                  <pre>
                    <code>{selectedArtifact.content}</code>
                  </pre>
                </section>
              )}
            </div>

            <label className="retest-response">
              <span>你的原始判断</span>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={stage.placeholder}
                rows={7}
              />
              <small>
                {draft.trim().length}/{stage.minimum}{" "}
                字最低可读门槛。系统只保存原话， 不把字数当成理解分数。
              </small>
            </label>

            <div className="retest-actions">
              {activeIndex > 0 && (
                <button type="button" onClick={() => moveTo(activeIndex - 1)}>
                  <ArrowLeft /> 上一步
                </button>
              )}
              <button
                className="primary"
                disabled={busy || draft.trim().length < stage.minimum}
                onClick={saveResponse}
                type="button"
              >
                {attempt.steps[stage.id] ? "更新原始作答" : "收录并继续"}
                <ArrowRight />
              </button>
            </div>
          </article>

          {activeIndex >= 2 && (
            <section className="retest-verification">
              <div>
                <TerminalSquare />
                <span>独立沙盒验证</span>
                <strong>应用不会替你运行命令</strong>
                <p>
                  在自己的终端进入固定目录，修复后手动运行测试。应用只读取带时间和源码指纹的报告。
                </p>
                <code>{config.command}</code>
              </div>
              <button onClick={verify} disabled={busy} type="button">
                <PlayCircle /> 读取最新测试报告
              </button>
              <div className={`retest-report ${attempt.verificationStatus}`}>
                <strong>
                  {attempt.verificationStatus === "passed"
                    ? "测试证据通过"
                    : attempt.verificationStatus === "failed"
                      ? "测试仍有红灯"
                      : attempt.verificationStatus === "invalid_report"
                        ? "报告与当前代码不匹配"
                        : "还没有本次复测报告"}
                </strong>
                {report?.message && <p>{report.message}</p>}
                {attempt.verificationStatus === "passed" && (
                  <section
                    aria-label="复测报告证据护照"
                    className="retest-proof-passport"
                  >
                    <article>
                      <b>生成时间</b>
                      <span>{reportGeneratedAt}</span>
                      <small>确认它不是昨天旧报告</small>
                    </article>
                    <article>
                      <b>源码指纹</b>
                      <span>{reportSourceHash}</span>
                      <small>确认报告属于当前代码</small>
                    </article>
                    <article>
                      <b>测试汇总</b>
                      <span>
                        {reportPassedCount} 通过 / {reportFailedCount} 失败
                      </span>
                      <small>看自动化覆盖了哪些路径</small>
                    </article>
                    <article>
                      <b>仍要说明</b>
                      <span>变式差异与人工复测风险</span>
                      <small>不能只凭绿色按钮合并</small>
                    </article>
                  </section>
                )}
                {reportTests.map((test) => (
                  <p key={test.name}>
                    {test.status === "passed" ? "通过" : "失败"} · {test.name}
                    {test.message ? `：${test.message}` : ""}
                  </p>
                ))}
              </div>
            </section>
          )}

          <aside className="retest-hints">
            <div>
              <HelpCircle />
              <span>
                <strong>真的卡住再取线索</strong>
                线索不会清空成果，但会如实降低独立程度候选等级。
              </span>
              <button
                disabled={busy || attempt.hintLevel >= 3}
                onClick={takeHint}
                type="button"
              >
                {attempt.hintLevel >= 3
                  ? "线索已全部展开"
                  : `领取第 ${attempt.hintLevel + 1} 条线索`}
              </button>
            </div>
            {attempt.hintLevel > 0 && (
              <ol>
                {hints.slice(0, attempt.hintLevel).map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ol>
            )}
          </aside>

          {activeIndex === stages.length - 1 && (
            <section className="retest-submit">
              <div>
                <FlaskConical />
                <span>复测结算边界</span>
                <strong>
                  零提示 + 原始作答 + 当前源码测试通过，才形成 L3 候选证据
                </strong>
                <p>
                  这仍不代表“完全掌握”。系统会保留你的原话、提示依赖和测试证据，等待后续语义审查与更多场景互证。
                </p>
              </div>
              <button
                disabled={
                  busy ||
                  !allResponsesReady ||
                  attempt.verificationStatus !== "passed"
                }
                onClick={submit}
                type="button"
              >
                <Clock3 /> 封存延迟迁移证据
              </button>
              {error && <p className="retest-error">{error}</p>}
            </section>
          )}
        </section>
      </section>
    </main>
  );
}
