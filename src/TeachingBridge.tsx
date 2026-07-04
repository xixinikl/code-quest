import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  FileCode2,
  HelpCircle,
  Lightbulb,
  LoaderCircle,
  Network,
  Search,
  ServerCrash,
} from "lucide-react";
import {
  type ConceptCard,
  type GlossaryEntry,
  type MapNode,
  type ProjectMap,
  type TeachingScenario,
  type TeachingStep,
  glossary,
} from "./teaching";
import { type DetectiveProfile, RANK_ICONS } from "./detective";

type TeachingApiProgress = {
  stepId: string;
  completed: boolean;
  teachingResponse: Record<string, unknown>;
  remediationEvents: Array<{ trigger: string; timestamp: string }>;
  updatedAt: string;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = (await response.json()) as
    T | { error: string; message: string };
  if (!response.ok) {
    const error = body as { error: string; message: string };
    throw new Error(error.message || "请求失败");
  }
  return body as T;
}

// ============ 子组件 ============

/** 项目地图：可视化数据流 */
function ProjectMapView({
  map,
  onComplete,
}: {
  map: ProjectMap;
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<MapNode | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const requiredCount = Math.min(3, map.nodes.length);

  // 按边顺序排列节点
  const orderedNodes =
    map.edges.length > 0
      ? (() => {
          const result: MapNode[] = [];
          const nodeMap = new Map(map.nodes.map((n) => [n.id, n]));
          const seen = new Set<string>();
          // 从 edges 追踪路径
          const start = map.edges[0].from;
          let current = start;
          while (current && !seen.has(current)) {
            const node = nodeMap.get(current);
            if (node) {
              result.push(node);
              seen.add(current);
            }
            const next = map.edges.find((e) => e.from === current);
            current = next?.to ?? "";
          }
          // 补上没被 edges 覆盖的节点
          for (const node of map.nodes) {
            if (!seen.has(node.id)) result.push(node);
          }
          return result;
        })()
      : map.nodes;

  return (
    <section className="teaching-shell">
      <header className="teaching-header">
        <span className="mini-label">教学模式 · 不影响能力分</span>
        <h2>🗺️ 项目地图</h2>
        <p>
          点击节点了解它在做什么。看完 <strong>至少 {requiredCount} 个</strong>
          即可继续。
        </p>
      </header>

      <div className="flowchart">
        {orderedNodes.map((node, idx) => {
          const edgeLabel = map.edges.find((e) => e.from === node.id)?.label;
          return (
            <div key={node.id} className="flowchart-row">
              <button
                className={`flowchart-node ${selected?.id === node.id ? "active" : ""} ${dismissed.has(node.id) ? "seen" : ""}`}
                onClick={() => setSelected(node)}
              >
                <span className="flowchart-node-idx">{idx + 1}</span>
                <strong>{node.label}</strong>
                <small>
                  {dismissed.has(node.id) ? "✓ 已了解" : "点击查看"}
                </small>
              </button>
              {edgeLabel && idx < orderedNodes.length - 1 && (
                <div className="flowchart-arrow">
                  <div className="flowchart-arrow-line" />
                  <span className="flowchart-arrow-label">{edgeLabel}</span>
                  <div className="flowchart-arrow-head" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="flowchart-detail">
          <header>
            <strong>{selected.label}</strong>
            <button
              className="v2-button small"
              onClick={() => {
                setDismissed(new Set([...dismissed, selected.id]));
                setSelected(null);
              }}
            >
              <Check size={14} /> 我懂了
            </button>
          </header>
          <p>{selected.description}</p>
          <div className="flowchart-detail-grid">
            <div>
              <b>输入</b>
              <span>{selected.input}</span>
            </div>
            <div>
              <b>输出</b>
              <span>{selected.output}</span>
            </div>
            <div>
              <b>可能故障</b>
              <ul>
                {selected.possibleFaults.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <b>观察证据</b>
              <ul>
                {selected.evidenceSources.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <footer className="teaching-footer">
        {dismissed.size >= requiredCount ? (
          <button
            className="v2-button primary"
            disabled={confirming}
            onClick={() => {
              setConfirming(true);
              onComplete();
            }}
          >
            {confirming ? <LoaderCircle className="spin" /> : <ArrowRight />}
            已了解基本结构，继续教学
          </button>
        ) : (
          <p className="map-hint">
            👆 已查看 {dismissed.size}/{map.nodes.length} 个节点，至少{" "}
            {requiredCount} 个后可以继续
          </p>
        )}
      </footer>
    </section>
  );
}

/** 概念卡微知识 */
function ConceptCardView({
  card,
  onComplete,
}: {
  card: ConceptCard;
  onComplete: () => void;
}) {
  const [showAnalogy, setShowAnalogy] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [predictionIndex, setPredictionIndex] = useState<number | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const correct =
    predictionSubmitted && predictionIndex === card.prediction.correctIndex;

  const canComplete = showAnalogy && showExample && predictionSubmitted;

  return (
    <section className="teaching-shell concept-card-shell">
      <header className="teaching-header">
        <span className="mini-label">教学模式 · {card.label}</span>
        <h2>{card.label}</h2>
      </header>

      <div className="concept-section">
        <h3>
          <Lightbulb size={18} />
          生活类比
          {showAnalogy && <Check size={16} className="check-green" />}
        </h3>
        {!showAnalogy ? (
          <button className="reveal-btn" onClick={() => setShowAnalogy(true)}>
            <span>💡</span> 点我查看类比
          </button>
        ) : (
          <div className="concept-revealed">
            <p className="concept-text">{card.analogy}</p>
          </div>
        )}
      </div>

      <div className="concept-section">
        <h3>
          <FileCode2 size={18} />
          当前项目例子
          {showExample && <Check size={16} className="check-green" />}
        </h3>
        {!showExample ? (
          <button className="reveal-btn" onClick={() => setShowExample(true)}>
            <span>🔍</span> 点我查看例子
          </button>
        ) : (
          <div className="concept-revealed">
            <p className="concept-text">{card.example}</p>
          </div>
        )}
      </div>

      <div className="concept-section">
        <h3>
          <HelpCircle size={18} />
          预测问题
          {predictionSubmitted && (
            <span
              className={`prediction-result ${correct ? "correct" : "wrong"}`}
            >
              {correct ? "✓ 正确" : "再想想"}
            </span>
          )}
        </h3>
        <p className="concept-prompt">{card.prediction.question}</p>
        <div className="prediction-options">
          {card.prediction.options.map((opt, idx) => (
            <button
              key={idx}
              className={`prediction-option ${
                predictionSubmitted
                  ? idx === card.prediction.correctIndex
                    ? "correct"
                    : predictionIndex === idx
                      ? "wrong"
                      : ""
                  : predictionIndex === idx
                    ? "selected"
                    : ""
              }`}
              onClick={() => {
                if (!predictionSubmitted) setPredictionIndex(idx);
              }}
              disabled={predictionSubmitted}
            >
              {opt}
            </button>
          ))}
        </div>
        {predictionIndex !== null && !predictionSubmitted && (
          <button
            className="v2-button primary"
            onClick={() => setPredictionSubmitted(true)}
          >
            提交预测
          </button>
        )}
        {predictionSubmitted && (
          <div
            className={`explanation-box ${correct ? "correct" : "incorrect"}`}
          >
            <strong>
              {correct ? "✅ 回答正确！" : "❌ 不对哦，正确答案是："}
              {card.prediction.explanation}
            </strong>
            {!correct && (
              <p className="revisit-hint">
                回头看类比和例子，你就能找到为什么是这个答案。
              </p>
            )}
          </div>
        )}
      </div>

      <footer className="teaching-footer">
        <button
          className="v2-button primary"
          disabled={!canComplete}
          onClick={onComplete}
        >
          {canComplete ? (
            <>
              <Check size={17} /> 理解了这个概念
            </>
          ) : (
            "先查看类比、例子并做预测题"
          )}
        </button>
      </footer>
    </section>
  );
}

/** 引导式代码导读 */
function GuidedCodeTour({
  step,
  stepIndex,
  totalSteps,
  onComplete,
  onRemediation,
}: {
  step: TeachingStep;
  stepIndex: number;
  totalSteps: number;
  onComplete: () => void;
  onRemediation: (trigger: string) => void;
}) {
  const [showFullFile, setShowFullFile] = useState(false);
  const focus = step.codeFocus;

  if (!focus) {
    return (
      <section className="teaching-shell">
        <p>无效的代码导读步骤</p>
      </section>
    );
  }

  return (
    <section className="teaching-shell code-tour-shell">
      <header className="teaching-header">
        <span className="mini-label">
          教学模式 · 引导式阅读 {stepIndex + 1}/{totalSteps}
        </span>
        <h2>{step.title}</h2>
        <p className="tour-goal">{step.goal}</p>
      </header>

      {/* 项目位置 */}
      <div className="tour-section">
        <h3>
          <Network size={16} />
          这个文件在项目中的位置
        </h3>
        <code className="tour-position">{step.projectPosition}</code>
      </div>

      {/* 焦点信息 */}
      <div className="tour-focus-grid">
        <div>
          <b>文件</b>
          <code>{focus.filePath}</code>
        </div>
        <div>
          <b>函数</b>
          <code>{focus.functionName}</code>
        </div>
        <div>
          <b>输入</b>
          <span>{focus.input}</span>
        </div>
        <div>
          <b>输出</b>
          <span>{focus.output}</span>
        </div>
      </div>

      {/* 忽略项 */}
      <div className="tour-section tour-ignore">
        <h3>
          <BookOpen size={16} />
          现在可以忽略
        </h3>
        <ul>
          {focus.ignore.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 关键代码 */}
      <div className="tour-section">
        <h3>
          <FileCode2 size={16} />
          关键代码（
          {showFullFile ? "完整文件" : "只看这 " + focus.lines.length + " 行"}）
          <button
            className="v2-button ghost"
            onClick={() => setShowFullFile(!showFullFile)}
          >
            {showFullFile ? "只看重点行" : "查看完整文件"}
          </button>
        </h3>
        {showFullFile ? (
          <div className="code-window">
            <header>
              <span className="code-dots">
                <i />
                <i />
                <i />
              </span>
              <code>{focus.filePath}</code>
            </header>
            <pre className="code-lines">
              {focus.lines.map((line, i) => (
                <code key={i}>
                  <span className="line-num">
                    {String(i + 1).padStart(2, " ")}
                  </span>
                  {line || " "}
                </code>
              ))}
            </pre>
          </div>
        ) : (
          <div className="code-focus-block">
            <div className="code-focus-header">
              <span>{focus.filePath}</span>
              <b>关键行 {focus.lines.length}</b>
            </div>
            <pre>
              {focus.lines.map((line, i) => {
                const keyLine =
                  line.includes("// ←") ||
                  line.includes("// 关键") ||
                  line.includes("// 因此");
                return (
                  <code key={i} className={keyLine ? "hl" : ""}>
                    <span className="line-num">
                      {String(i + 1).padStart(2, " ")}
                    </span>
                    {line || " "}
                  </code>
                );
              })}
            </pre>
          </div>
        )}
      </div>

      {/* 观察目标 */}
      <div
        className={`tour-section tour-observation ${showFullFile ? "" : ""}`}
      >
        <h3>
          <Search size={16} />
          这一步只需观察
        </h3>
        <blockquote>{focus.observationGoal}</blockquote>
      </div>

      {/* 没看懂入口 */}
      <StepRemediation step={step} onRemediation={onRemediation} />

      <footer className="teaching-footer">
        <button className="v2-button primary" onClick={onComplete}>
          <Check size={17} /> 我看懂了，继续下一步
        </button>
      </footer>
    </section>
  );
}

/** "我没看懂"补课分支 */
function StepRemediation({
  step,
  onRemediation,
}: {
  step: TeachingStep;
  onRemediation: (trigger: string) => void;
}) {
  const [showPanel, setShowPanel] = useState(false);
  const [completedLesson, setCompletedLesson] = useState<string | null>(null);

  if (!step.remediation || step.remediation.length === 0) return null;

  return (
    <div className="remediation-block">
      {!showPanel && !completedLesson && (
        <button
          className="v2-button ghost remediation-trigger"
          onClick={() => setShowPanel(true)}
        >
          <HelpCircle size={16} />
          这里没看懂
        </button>
      )}

      {showPanel && !completedLesson && (
        <div className="remediation-panel">
          <strong>具体是哪里不懂？</strong>
          <div className="remediation-options">
            {step.remediation.map((r) => (
              <button
                key={r.trigger}
                className="v2-button remediation-option-btn"
                onClick={() => {
                  setCompletedLesson(r.trigger);
                  setShowPanel(false);
                  onRemediation(r.trigger);
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            className="v2-button ghost"
            onClick={() => setShowPanel(false)}
          >
            算了，我继续看
          </button>
        </div>
      )}

      {completedLesson && (
        <div className="remediation-micro-lesson">
          <header>
            <Lightbulb size={18} />
            <strong>补课</strong>
            <button
              className="v2-button small"
              onClick={() => setCompletedLesson(null)}
            >
              回到步骤
            </button>
          </header>
          <div className="micro-lesson-content">
            {step.remediation
              .filter((r) => r.trigger === completedLesson)
              .map((r) => (
                <p key={r.trigger} style={{ whiteSpace: "pre-line" }}>
                  {r.microLesson}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** 共同完成：证据连接示范 */
function DemoEvidenceConnect({
  onComplete,
  onRemediation,
}: {
  onComplete: () => void;
  onRemediation: (trigger: string) => void;
}) {
  const [step, setStep] = useState<"demo" | "practice" | "done">("demo");
  const [practiceAnswer, setPracticeAnswer] = useState("");

  const demoSteps = [
    {
      evidence: "Network 面板：POST /api/canvases → 201 Created",
      claim: "接口返回了「创建成功」",
      limit: "但 201 只证明路由执行完毕",
    },
    {
      evidence: "数据库查询：SELECT * FROM canvases → 0 行",
      claim: "数据库中没有数据",
      limit: "说明持久化副作用没有发生",
    },
    {
      evidence: "前后对比",
      claim: "写入走内存数组（无 INSERT），读取却从 SQLite",
      limit: "因此修复方向：在 saveCanvas 中增加 db.run(INSERT)",
    },
  ];

  return (
    <section className="teaching-shell demo-shell">
      <header className="teaching-header">
        <span className="mini-label">教学模式 · 共同完成</span>
        <h2>如何把证据连接成判断</h2>
      </header>

      {step === "demo" && (
        <>
          <p className="demo-intro">
            下面是一个示范：从两份证据形成一条有效的故障判断。看完后你要自己试一次。
          </p>

          {demoSteps.map((ds, idx) => (
            <div key={idx} className="demo-step">
              <div className="demo-badge">{idx + 1}</div>
              <div>
                <strong>证据：</strong>
                <code>{ds.evidence}</code>
                <br />
                <strong>判断：</strong>
                {ds.claim}
                <br />
                <span className="demo-limit">{ds.limit}</span>
              </div>
            </div>
          ))}

          <footer className="teaching-footer">
            <button
              className="v2-button primary"
              onClick={() => setStep("practice")}
            >
              我理解了，现在自己试 <ArrowRight size={17} />
            </button>
          </footer>
        </>
      )}

      {step === "practice" && (
        <>
          <div className="demo-practice">
            <h3>现在轮到你了</h3>
            <p>已知：</p>
            <ul className="evidence-list">
              <li>前端显示「保存成功」</li>
              <li>Network 返回 201 Created</li>
              <li>数据库查询 0 行</li>
              <li>刷新后列表为空</li>
            </ul>
            <p>
              <strong>问：</strong>
              这些证据综合起来能得出什么结论？用一句话回答。
            </p>
            <textarea
              className="demo-textarea"
              value={practiceAnswer}
              onChange={(e) => setPracticeAnswer(e.target.value)}
              placeholder="例如：201 只证明接口成功，但数据库为 0 行表明保存没有持久化，所以刷新后数据不在了。"
              rows={3}
            />
            <button
              className="v2-button primary"
              disabled={practiceAnswer.trim().length < 15}
              onClick={() => {
                setStep("done");
              }}
            >
              <Check size={17} /> 提交判断
            </button>
          </div>
          <StepRemediation
            step={{
              id: "demo-evidence-connect",
              mode: "teaching" as const,
              title: "共同完成",
              goal: "证据连接",
              remediation: [
                {
                  trigger: "causality",
                  label: "不理解因果关系",
                  microLesson:
                    "1. 前端显示成功 ← 来自路由返回 201\n2. 数据库 0 行 ← INSERT 从未执行\n3. 刷新后空 ← 读取走数据库，数据在内存\n\n所以：成功是假象，因为写和读是两个数据源。",
                },
              ],
            }}
            onRemediation={onRemediation}
          />
        </>
      )}

      {step === "done" && (
        <div className="demo-done">
          <CheckCircle2 size={32} className="check-green" />
          <h3>你已经学会了如何连接证据！</h3>
          <p>
            教学阶段结束，下面进入陪练阶段——你可以逐渐减少提示来完成实战。提示会被记录，但不会作为失败判定。
          </p>
          <button className="v2-button primary" onClick={onComplete}>
            进入陪练阶段 <ArrowRight size={17} />
          </button>
        </div>
      )}
    </section>
  );
}

// ============ 主教学桥组件 ============

export function TeachingBridge({
  attemptId,
  scenario,
  detective,
  onComplete,
}: {
  attemptId: string;
  scenario: TeachingScenario;
  detective: DetectiveProfile;
  onComplete: () => void;
}) {
  // 从服务端恢复教学进度
  const [progress, setProgress] = useState<TeachingApiProgress[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // 载入已保存的教学进度
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const saved = await api<TeachingApiProgress[]>(
          `/api/attempts/${attemptId}/teaching`,
        );
        if (cancelled) return;
        const mapped: TeachingApiProgress[] = saved.map((s) => ({
          ...s,
          completed: s.completed ?? false,
          teachingResponse: s.teachingResponse ?? {},
          remediationEvents: s.remediationEvents ?? [],
          updatedAt: s.updatedAt ?? "",
        }));
        setProgress(mapped);

        // 找到第一个未完成的步骤
        const firstIncomplete = scenario.steps.findIndex(
          (step) => !mapped.find((p) => p.stepId === step.id && p.completed),
        );
        if (firstIncomplete >= 0) setCurrentStepIdx(firstIncomplete);
      } catch (cause) {
        if (!cancelled) setError(String(cause));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [attemptId, scenario.steps]);

  const saveProgress = useCallback(
    async (stepId: string, response?: unknown) => {
      setSaving(true);
      try {
        await api(`/api/attempts/${attemptId}/teaching/${stepId}`, {
          method: "PATCH",
          body: JSON.stringify({
            response: response ?? {},
            completed: true,
          }),
        });
      } catch (cause) {
        setError(String(cause));
      } finally {
        setSaving(false);
      }
    },
    [attemptId],
  );

  const recordRemediation = useCallback(
    async (stepId: string, trigger: string) => {
      try {
        await api(`/api/attempts/${attemptId}/teaching/${stepId}/remediation`, {
          method: "POST",
          body: JSON.stringify({ trigger }),
        });
      } catch {
        // 补课记录失败不影响流程
      }
    },
    [attemptId],
  );

  const handleReset = useCallback(async () => {
    setResetting(true);
    try {
      await api(`/api/attempts/${attemptId}/teaching/reset`, {
        method: "POST",
        body: "{}",
      });
      setProgress([]);
      setCurrentStepIdx(0);
    } catch (cause) {
      setError(String(cause));
    } finally {
      setResetting(false);
    }
  }, [attemptId]);

  const completeStep = useCallback(
    async (idx: number) => {
      const step = scenario.steps[idx];
      if (!step) return;
      await saveProgress(step.id, { completed: true });
      if (idx + 1 < scenario.steps.length) {
        setCurrentStepIdx(idx + 1);
      } else {
        setShowCelebration(true);
      }
    },
    [scenario.steps, saveProgress],
  );

  if (showIntro) {
    const badge =
      scenario.scenarioId === "case-002" ? "CASE 002" : "CASE 001";
    const title =
      scenario.scenarioId === "case-002"
        ? "登录成功，但退出后丢失了"
        : "保存成功，但刷新后消失了";
    const desc =
      scenario.scenarioId === "case-002"
        ? "登录成功→关掉重开→需要重新登录。Token去哪了？"
        : "点击保存→提示成功→刷新页面→数据不见。前端骗你？还是后端没存？";

    const levels = [
      { icon: "🗺️", label: "地形勘测", sub: "了解数据流", stars: "⭐" },
      { icon: "🧠", label: "知识获取", sub: "4个关键概念", stars: "⭐" },
      { icon: "🔍", label: "线索追踪", sub: "逐层读代码", stars: "⭐⭐" },
      { icon: "🤝", label: "串联证据", sub: "连接成判断", stars: "⭐" },
      { icon: "⚔️", label: "收网行动", sub: "分步修复", stars: "⭐⭐" },
    ];

    return (
      <section className="intro">
        <div className="intro-bg" />
        <div className="intro-content">
          <div className="intro-detective">
            {RANK_ICONS[detective.rank]} {detective.rank}
            <span>·</span>
            {detective.xp} XP
          </div>

          <div className="intro-badge">{badge}</div>

          <h1 className="intro-title">{title}</h1>
          <p className="intro-desc">{desc}</p>

          <div className="intro-evidence">
            <div className="intro-ev-card green">
              <span className="intro-ev-dot g" />
              <span>POST → 201 Created</span>
            </div>
            <span className="intro-ev-vs">VS</span>
            <div className="intro-ev-card red">
              <span className="intro-ev-dot r" />
              <span>SELECT → 0 rows</span>
            </div>
          </div>

          <div className="intro-mystery">
            🤔 同一个操作，一个说成功、一个说数据不存在。为什么？
          </div>

          <div className="intro-phases">
            <div className="intro-phase">
              <span className="ip-num">1</span>
              <span className="ip-icon">📋</span>
              <strong>基线诊断</strong>
              <small>封存你现在的判断</small>
            </div>
            <div className="intro-phase teaching">
              <span className="ip-num">2</span>
              <span className="ip-icon">🎓</span>
              <strong>教学指导 · 5 关</strong>
              <div className="ip-levels">
                {levels.map((l) => (
                  <span key={l.label} className="ip-level">
                    {l.icon} {l.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="intro-phase">
              <span className="ip-num">3</span>
              <span className="ip-icon">⚔️</span>
              <strong>独立实战</strong>
              <small>自己动手修复真实代码</small>
            </div>
          </div>

          <button
            className="intro-btn"
            onClick={() => setShowIntro(false)}
          >
            开始调查 🔍
          </button>
        </div>
      </section>
    );
  }

  if (showCelebration) {
    const stepCount = scenario.steps.length;
    return (
      <section className="teaching-shell celebration-screen">
        <div className="celebration-icon">🎉</div>
        <h2>教学阶段完成！</h2>
        <p>
          你已经完成了 <strong>{stepCount} 个教学步骤</strong>，包括项目地图、
          四个核心概念、代码阅读和共同实战示范。
        </p>
        <div className="celebration-stats">
          <div>
            <span>🗺️</span>
            <strong>项目地图</strong>
            <small>了解完整数据流</small>
          </div>
          <div>
            <span>🧠</span>
            <strong>4 个概念</strong>
            <small>内存数组·持久化·HTTP·数据层</small>
          </div>
          <div>
            <span>📖</span>
            <strong>代码阅读</strong>
            <small>前端→路由→数据层→故障链</small>
          </div>
          <div>
            <span>🤝</span>
            <strong>实战示范</strong>
            <small>证据连接方法</small>
          </div>
        </div>
        <p className="celebration-note">
          教学阶段的帮助不会计入能力分。下面进入真正的练习——
          你将独立完成修复，提示等级会如实记录。
        </p>
        <button className="v2-button primary wide" onClick={onComplete}>
          进入实战练习 🚀
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <LoaderCircle className="spin" />
        <p>正在加载教学材料…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="loading-screen error-screen">
        <ServerCrash size={32} />
        <p>{error}</p>
      </main>
    );
  }

  const currentStep = scenario.steps[currentStepIdx];
  if (!currentStep) {
    return (
      <main className="loading-screen">
        <p>教学步骤已全部完成</p>
      </main>
    );
  }

  const renderStep = (idx: number) => {
    const step = scenario.steps[idx];

    switch (step.id) {
      case "project-map":
        return (
          <ProjectMapView
            map={scenario.projectMap}
            onComplete={() => completeStep(idx)}
          />
        );

      case "micro-lessons":
        return (
          <MicroLessonsView
            key="micro-lessons"
            concepts={step.concepts ?? []}
            onComplete={() => completeStep(idx)}
          />
        );

      case "tour-frontend":
      case "tour-route":
      case "tour-repository":
      case "tour-inconsistency":
        return (
          <GuidedCodeTour
            key={step.id}
            step={step}
            stepIndex={currentStepIdx - 1}
            totalSteps={4}
            onComplete={() => completeStep(idx)}
            onRemediation={(trigger) => recordRemediation(step.id, trigger)}
          />
        );

      case "demo-evidence-connect":
        return (
          <DemoEvidenceConnect
            key="demo-evidence-connect"
            onComplete={() => completeStep(idx)}
            onRemediation={(trigger) => recordRemediation(step.id, trigger)}
          />
        );

      case "coaching-hints":
        return (
          <CoachingIntro
            key="coaching-hints"
            onComplete={() => completeStep(idx)}
          />
        );

      case "c2-map":
        return (
          <ProjectMapView
            map={scenario.projectMap}
            onComplete={() => completeStep(idx)}
          />
        );

      case "c2-concepts":
        return (
          <MicroLessonsView
            key="c2-concepts"
            concepts={step.concepts ?? []}
            onComplete={() => completeStep(idx)}
          />
        );

      case "c2-tour-login":
      case "c2-tour-verify":
        return (
          <GuidedCodeTour
            key={step.id}
            step={step}
            stepIndex={currentStepIdx - 2}
            totalSteps={2}
            onComplete={() => completeStep(idx)}
            onRemediation={(trigger) => recordRemediation(step.id, trigger)}
          />
        );

      case "c2-close":
        return (
          <section
            className="teaching-shell"
            style={{ textAlign: "center", padding: "60px 40px" }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧩</div>
            <h2>案件 002 已破！</h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: 28,
              }}
            >
              你已经正确识别了登录状态丢失的根因：
              <strong>Token/Session 只存在内存中</strong>，
              服务重启后全部失效。这和 Case
              001「内存数组保存数据」是同一个根本原理——
              <strong>内存是临时的，持久化才能真正确保数据不丢失</strong>。
            </p>
            <button
              className="v2-button primary wide"
              onClick={() => completeStep(idx)}
            >
              完成调查 🔍
            </button>
          </section>
        );

      default:
    }
  };

  return (
    <div className="teaching-bridge">
      <div className="teaching-steps-bar">
        {scenario.steps.map((step, idx) => {
          const completed = progress.find(
            (p) => p.stepId === step.id,
          )?.completed;
          return (
            <div
              key={step.id}
              className={`teaching-step-dot ${
                idx === currentStepIdx ? "active" : ""
              } ${completed ? "done" : ""}`}
            >
              <span>{completed ? <Check size={12} /> : idx + 1}</span>
              <small>{step.title}</small>
            </div>
          );
        })}
        <button
          className="teaching-reset-btn"
          onClick={handleReset}
          disabled={resetting}
          title="重置教学进度，重新开始"
        >
          {resetting ? <LoaderCircle className="spin" size={14} /> : "↺"}
        </button>
      </div>

      <div className="teaching-score">
        <span>
          🏆 进度{" "}
          {Math.round(
            (progress.filter((p) => p.completed).length /
              scenario.steps.length) *
              100,
          )}
          %
        </span>
      </div>

      {renderStep(currentStepIdx)}

      {saving && (
        <div className="teaching-saving">
          <LoaderCircle className="spin" size={16} />
          保存进度…
        </div>
      )}

      <GlossaryPanel entries={glossary} />
    </div>
  );
}

/** 微知识列表视图 */
function MicroLessonsView({
  concepts,
  onComplete,
}: {
  concepts: ConceptCard[];
  onComplete: () => void;
}) {
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());
  const allDone = concepts.every((c) => completedCards.has(c.id));

  if (allDone) {
    return (
      <section className="teaching-shell">
        <header className="teaching-header">
          <span className="mini-label">教学模式 · 所有概念已理解</span>
          <h2>你已经完成了四个基础知识</h2>
          <p>现在准备进入引导式代码阅读。</p>
        </header>
        <footer className="teaching-footer">
          <button className="v2-button primary" onClick={onComplete}>
            开始代码导读 <ArrowRight size={17} />
          </button>
        </footer>
      </section>
    );
  }

  const nextCard = concepts.find((c) => !completedCards.has(c.id));

  return (
    <div>
      {/* 当前概念卡 */}
      {nextCard && (
        <ConceptCardView
          key={nextCard.id}
          card={nextCard}
          onComplete={() => {
            setCompletedCards(new Set([...completedCards, nextCard.id]));
          }}
        />
      )}

      {/* 进度显示 */}
      <div className="micro-progress">
        <span>
          概念进度：{completedCards.size} / {concepts.length}
        </span>
        <div className="micro-progress-bar">
          {concepts.map((c) => (
            <div
              key={c.id}
              className={`micro-progress-dot ${completedCards.has(c.id) ? "done" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** 陪练介绍 */
function CoachingIntro({ onComplete }: { onComplete: () => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const coachingSteps = [
    {
      step: "找出当前写入位置",
      detail: "在 canvasRepository.js 中找到 saveCanvas 函数",
      file: "server/canvasRepository.js",
      hint1: "查找 function saveCanvas",
    },
    {
      step: "判断写入目标",
      detail: "是 push 到内存数组，还是执行了 db.run？",
      file: "canvasRepository.js",
      hint1: "看 saveCanvas 里有没有 db.run(...)",
    },
    {
      step: "找到表字段",
      detail: "查看 database/schema.sql 了解 canvases 表的字段",
      file: "database/schema.sql",
      hint1: "看看 canvases 表有哪些列",
    },
    {
      step: "组合 INSERT 语句",
      detail: "用 db.run 实现真实持久化",
      file: "canvasRepository.js",
      hint1:
        "db.run('INSERT INTO canvases (id, name) VALUES (?, ?)', [id, name])",
    },
    {
      step: "在自己的编辑器中修改代码",
      detail: "修改 sandbox/canvas-save-persistence/server/canvasRepository.js",
      file: "canvasRepository.js",
      hint1: "在 saveCanvas 里加上 db.run(...)，注意参数顺序",
    },
    {
      step: "手动运行测试",
      detail: "在沙盒目录执行 npm test，然后回到这里读取报告",
      file: "终端",
      hint1: "cd sandbox/canvas-save-persistence && npm test",
    },
  ];

  const allChecked = checked.size === coachingSteps.length;

  const toggleCheck = (idx: number) => {
    const next = new Set(checked);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setChecked(next);
  };

  return (
    <section className="teaching-shell coaching-shell">
      <header className="teaching-header">
        <span className="mini-label">陪练模式 · 提示会被记录但不扣分</span>
        <h2>🛠️ 现在进入实战修复</h2>
        <p>
          教学阶段已完成。下面是修复的 6 个步骤，每步都有可领取的提示。
          完成一步就勾选 ✓
        </p>
      </header>

      <div className="coaching-checklist">
        {coachingSteps.map((cs, idx) => (
          <div
            key={idx}
            className={`coaching-item ${checked.has(idx) ? "done" : ""}`}
          >
            <button
              className={`coaching-checkbox ${checked.has(idx) ? "checked" : ""}`}
              onClick={() => toggleCheck(idx)}
            >
              {checked.has(idx) ? "✓" : `${idx + 1}`}
            </button>
            <div className="coaching-item-content">
              <strong>{cs.step}</strong>
              <p>{cs.detail}</p>
              <div className="coaching-item-meta">
                <code>{cs.file}</code>
                {!checked.has(idx) && (
                  <span className="coaching-hint-preview">{cs.hint1}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="coaching-progress">
        <div className="coaching-progress-bar">
          <div
            className="coaching-progress-fill"
            style={{ width: `${(checked.size / coachingSteps.length) * 100}%` }}
          />
        </div>
        <span>
          {checked.size}/{coachingSteps.length} 已完成
        </span>
      </div>

      <footer className="teaching-footer">
        <button
          className="v2-button primary wide"
          disabled={!allChecked}
          onClick={onComplete}
        >
          {allChecked ? (
            <>
              全部完成，进入实战 <ArrowRight size={17} />
            </>
          ) : (
            <>
              已完成 {checked.size}/{coachingSteps.length} 步后继续
            </>
          )}
        </button>
      </footer>
    </section>
  );
}

/** 词库面板 */
function GlossaryPanel({ entries }: { entries: GlossaryEntry[] }) {
  const [open, setOpen] = useState(false);

  const categories = [...new Set(entries.map((e) => e.category))];

  return (
    <>
      <button
        className="glossary-fab"
        onClick={() => setOpen(!open)}
        title="打开词库"
      >
        <span>📖</span>
        {open ? "关闭词库" : "词库"}
      </button>

      {open && (
        <div className="glossary-panel">
          <header>
            <strong>📖 词库本</strong>
            <small>{entries.length} 个术语 · 随时查看</small>
            <button className="glossary-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </header>
          <div className="glossary-content">
            {categories.map((cat) => (
              <div key={cat} className="glossary-category">
                <h4>{cat}</h4>
                {entries
                  .filter((e) => e.category === cat)
                  .map((entry) => (
                    <div key={entry.term} className="glossary-term">
                      <strong>{entry.term}</strong>
                      <p>{entry.plain}</p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export {
  ProjectMapView,
  ConceptCardView,
  GuidedCodeTour,
  StepRemediation,
  DemoEvidenceConnect,
};
