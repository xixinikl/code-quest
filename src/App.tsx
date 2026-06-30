import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Database,
  FileCode2,
  FlaskConical,
  FolderLock,
  HelpCircle,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  Network,
  RefreshCw,
  Save,
  Search,
  Server,
  ShieldCheck,
  TerminalSquare,
  Trophy,
  XCircle,
} from "lucide-react";

type Diagnostic = {
  id: string;
  status: "active" | "completed";
  baseline: Record<string, unknown>;
};

type StepValue = {
  response: Record<string, string>;
  savedAt: string;
};

type Attempt = {
  id: string;
  scenarioId: string;
  status: "active" | "submitted";
  hintLevel: number;
  verificationStatus: "not_run" | "failed" | "passed" | "invalid_report";
  steps: Record<string, StepValue>;
};

type Artifact = {
  id: string;
  label: string;
  language: string;
  relativePath: string;
  content: string;
};

type ApiError = { error: string; message: string };

const SCENARIO_ID = "canvas-save-persistence";

const steps = [
  { id: "baseline-plan", label: "无提示基线", icon: CircleDot },
  { id: "inspect-evidence", label: "调查项目证据", icon: Search },
  { id: "trace-data-flow", label: "还原数据流", icon: Network },
  { id: "practical-fix", label: "真实修复与测试", icon: TerminalSquare },
  { id: "agent-brief", label: "给 Agent 写任务", icon: FileCode2 },
  { id: "delivery-review", label: "审查交付证据", icon: ShieldCheck },
  { id: "causal-explanation", label: "解释故障因果", icon: Lightbulb },
  { id: "transfer-check", label: "迁移预演", icon: FlaskConical },
] as const;

const hints = [
  "先不要猜具体代码。比较“POST 返回 201”“GET 返回空数组”“数据库查询 0 行”分别能证明什么。",
  "沿着前端 → 路由 → repository → SQLite 逐层找：哪一层声称成功，却没有产生下一层可观察的副作用？",
  "检查 `server/canvasRepository.js` 的 `saveCanvas`：创建后的对象最终进入了内存数组，还是执行了数据库 INSERT？",
];

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = (await response.json()) as T | ApiError;
  if (!response.ok) {
    const error = body as ApiError;
    throw new Error(error.message || "本地学习服务请求失败");
  }
  return body as T;
}

function Logo() {
  return (
    <div className="v2-logo">
      <span>
        <Code2 size={21} />
      </span>
      <div>
        <strong>码上冒险</strong>
        <small>EVIDENCE LAB</small>
      </div>
    </div>
  );
}

function SafetyBadge() {
  return (
    <div className="safety-badge">
      <FolderLock size={16} />
      <span>
        <strong>保守安全模式</strong>
        不执行终端命令 · 不读取其他项目
      </span>
    </div>
  );
}

function Loading({ message }: { message: string }) {
  return (
    <main className="loading-screen">
      <Logo />
      <LoaderCircle className="spin" />
      <p>{message}</p>
    </main>
  );
}

function ServiceError({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <main className="loading-screen error-screen">
      <span className="large-icon danger">
        <Server />
      </span>
      <h1>本地学习服务没有响应</h1>
      <p>{message}</p>
      <code>npm run dev</code>
      <button className="v2-button primary" onClick={retry}>
        <RefreshCw size={17} /> 重新连接
      </button>
    </main>
  );
}

type BaselineForm = {
  firstChecks: string;
  evidenceNeeded: string;
  dataFlow: string;
  confidence: string;
};

function BaselineDiagnostic({
  diagnostic,
  onSubmit,
}: {
  diagnostic: Diagnostic;
  onSubmit: (form: BaselineForm) => Promise<void>;
}) {
  const [form, setForm] = useState<BaselineForm>({
    firstChecks: "",
    evidenceNeeded: "",
    dataFlow: "",
    confidence: "2",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const ready =
    form.firstChecks.trim().length >= 20 &&
    form.evidenceNeeded.trim().length >= 15 &&
    form.dataFlow.trim().length >= 15;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    setSaving(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "保存失败");
      setSaving(false);
    }
  };

  return (
    <main className="baseline-page">
      <header className="baseline-header">
        <Logo />
        <SafetyBadge />
      </header>
      <section className="baseline-hero">
        <div className="case-label">
          <span>CASE 001</span>
          <b>真实项目基线诊断</b>
        </div>
        <h1>
          保存提示成功，
          <br />
          为什么<span>刷新后消失？</span>
        </h1>
        <p>
          先不看代码、不看提示。我们需要记录你现在会怎样调查，而不是让你给自己打分。
        </p>
        <div className="case-facts">
          <span>
            <Check size={15} /> POST 返回 201
          </span>
          <span>
            <XCircle size={15} /> 刷新后列表为空
          </span>
          <span>
            <Database size={15} /> SQLite 查询 0 行
          </span>
        </div>
      </section>
      <form className="baseline-form" onSubmit={submit}>
        <div className="baseline-intro">
          <span>无提示区</span>
          <h2>写下你真正会做的第一步</h2>
          <p>
            不追求术语漂亮。模糊、写错都可以——这份原始回答会成为之后判断进步的基线。
          </p>
        </div>
        <label>
          <span>
            <b>01</b> 你会先做哪三个检查？为什么按这个顺序？
          </span>
          <textarea
            value={form.firstChecks}
            onChange={(event) =>
              setForm({ ...form, firstChecks: event.target.value })
            }
            placeholder="例如：先稳定复现……然后……因为……"
            rows={5}
          />
          <small>{form.firstChecks.trim().length} 字 · 至少 20 字</small>
        </label>
        <label>
          <span>
            <b>02</b> 哪些证据能区分“界面显示成功”和“数据真的保存”？
          </span>
          <textarea
            value={form.evidenceNeeded}
            onChange={(event) =>
              setForm({ ...form, evidenceNeeded: event.target.value })
            }
            placeholder="写出你想查看的日志、请求、数据库或测试证据"
            rows={4}
          />
        </label>
        <label>
          <span>
            <b>03</b> 按你的理解，一次保存请求经过哪些地方？
          </span>
          <textarea
            value={form.dataFlow}
            onChange={(event) =>
              setForm({ ...form, dataFlow: event.target.value })
            }
            placeholder="不确定也没关系，按顺序写出你知道的节点"
            rows={4}
          />
        </label>
        <label className="confidence-field">
          <span>你对这次判断有多大把握？这只记录信心，不计能力分。</span>
          <input
            type="range"
            min="1"
            max="5"
            value={form.confidence}
            onChange={(event) =>
              setForm({ ...form, confidence: event.target.value })
            }
          />
          <output>{form.confidence} / 5</output>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="v2-button primary wide" disabled={!ready || saving}>
          {saving ? <LoaderCircle className="spin" /> : <LockKeyhole />}
          封存基线，进入真实项目
        </button>
        <small className="session-id">
          诊断会话：{diagnostic.id.slice(0, 8)}
        </small>
      </form>
    </main>
  );
}

function ArtifactViewer({ artifacts }: { artifacts: Artifact[] }) {
  const [selectedId, setSelectedId] = useState(artifacts[0]?.id ?? "");
  const selected =
    artifacts.find((artifact) => artifact.id === selectedId) ?? artifacts[0];

  if (!selected) return <p>没有可用的项目材料。</p>;

  return (
    <div className="artifact-viewer">
      <div className="artifact-tabs" role="tablist">
        {artifacts.map((artifact) => (
          <button
            key={artifact.id}
            className={selected.id === artifact.id ? "active" : ""}
            onClick={() => setSelectedId(artifact.id)}
            role="tab"
            aria-selected={selected.id === artifact.id}
          >
            {artifact.language === "json" || artifact.language === "log" ? (
              <Network size={14} />
            ) : artifact.language === "sql" ? (
              <Database size={14} />
            ) : (
              <FileCode2 size={14} />
            )}
            {artifact.label}
          </button>
        ))}
      </div>
      <div className="code-window">
        <header>
          <span>
            <i />
            <i />
            <i />
          </span>
          <code>{selected.relativePath}</code>
          <b>{selected.language}</b>
        </header>
        <pre>
          <code>{selected.content}</code>
        </pre>
      </div>
    </div>
  );
}

function ResponseForm({
  title,
  prompt,
  placeholder,
  initialValue,
  minimum = 30,
  onSave,
  children,
}: {
  title: string;
  prompt: string;
  placeholder: string;
  initialValue?: string;
  minimum?: number;
  onSave: (text: string) => Promise<void>;
  children?: React.ReactNode;
}) {
  const [text, setText] = useState(initialValue ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(text.trim());
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="lab-card response-card">
      <span className="mini-label">{title}</span>
      <h2>{prompt}</h2>
      {children}
      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setSaved(false);
        }}
        placeholder={placeholder}
        rows={7}
      />
      <footer>
        <span>
          {text.trim().length} 字 · 至少 {minimum} 字
        </span>
        <button
          className="v2-button primary"
          disabled={text.trim().length < minimum || saving}
          onClick={save}
        >
          {saving ? (
            <LoaderCircle className="spin" size={17} />
          ) : saved ? (
            <Check size={17} />
          ) : (
            <Save size={17} />
          )}
          {saved ? "证据已保存" : "保存并继续"}
        </button>
      </footer>
      {error && <p className="form-error">{error}</p>}
    </section>
  );
}

function VerificationPanel({
  attempt,
  onVerify,
}: {
  attempt: Attempt;
  onVerify: () => Promise<void>;
}) {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const verify = async () => {
    setChecking(true);
    setError("");
    try {
      await onVerify();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "读取报告失败");
    } finally {
      setChecking(false);
    }
  };
  const status = attempt.verificationStatus;

  return (
    <section className="lab-card practical-card">
      <div className="practical-heading">
        <span className="large-icon">
          <TerminalSquare />
        </span>
        <div>
          <span className="mini-label">真实操作 · 应用不会替你运行</span>
          <h2>在独立沙盒里定位并修复故障</h2>
        </div>
      </div>
      <div className="safety-callout">
        <ShieldCheck size={18} />
        <p>
          <strong>安全边界</strong>
          只编辑下面的沙盒目录。测试使用内存 SQLite，不联网，不访问其他项目。
        </p>
      </div>
      <ol className="manual-steps">
        <li>
          <b>1</b>
          <span>
            用编辑器打开
            <code>sandbox/canvas-save-persistence</code>
          </span>
        </li>
        <li>
          <b>2</b>
          <span>
            根据证据修改真实代码。不要为了通过测试修改
            <code>tests/</code>
          </span>
        </li>
        <li>
          <b>3</b>
          <span>
            由你在该目录的终端手动运行
            <code>npm test</code>
          </span>
        </li>
        <li>
          <b>4</b>
          <span>回来点击“读取测试报告”。应用只读结果，不执行命令。</span>
        </li>
      </ol>
      <div className={`verification-state ${status}`}>
        {status === "passed" ? (
          <CheckCircle2 />
        ) : status === "failed" ? (
          <XCircle />
        ) : status === "invalid_report" ? (
          <AlertTriangle />
        ) : (
          <Clock3 />
        )}
        <div>
          <strong>
            {status === "passed"
              ? "真实测试已通过"
              : status === "failed"
                ? "测试已运行，但仍有失败"
                : status === "invalid_report"
                  ? "报告无效或早于本次练习"
                  : "等待你手动运行测试"}
          </strong>
          <span>
            {status === "passed"
              ? "行为证据成立，但还需要解释和迁移复测。"
              : status === "failed"
                ? "这是有效学习证据：请根据失败信息继续定位。"
                : "运行后会生成固定的 test-results.json。"}
          </span>
        </div>
        <button className="v2-button dark" onClick={verify} disabled={checking}>
          {checking ? <LoaderCircle className="spin" /> : <RefreshCw />}
          读取测试报告
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </section>
  );
}

function EvidenceResult({ hintLevel }: { hintLevel: number }) {
  return (
    <section className="result-page">
      <span className="result-medal">
        <Trophy />
      </span>
      <span className="mini-label">工程闭环通过 · 学习效果仍待复测</span>
      <h1>你获得的是候选证据，不是虚假的“满级”</h1>
      <p>
        实际测试已经证明修复行为成立；系统也保存了你的调查过程和解释。但我们尚未进行
        24 小时后的变式复测，也没有可靠地审查解释语义，因此当前最多记录为 L
        {hintLevel >= 3 ? "1" : "2"} 候选证据。
      </p>
      <div className="evidence-summary">
        <div>
          <CheckCircle2 />
          <span>
            <strong>已证明</strong>
            代码产生真实数据库副作用
          </span>
        </div>
        <div>
          <CheckCircle2 />
          <span>
            <strong>已记录</strong>
            原始回答、提示次数与解释
          </span>
        </div>
        <div className="pending">
          <Clock3 />
          <span>
            <strong>仍待证明</strong>
            无提示迁移到不同项目场景
          </span>
        </div>
      </div>
      <div className="rubric-box">
        <h2>为什么还不是 L3？</h2>
        <ul>
          <li>L3 要求两个不同场景通过，而现在只有一个。</li>
          <li>L3 至少有一次零提示完成；本次提示等级为 {hintLevel}。</li>
          <li>自由解释需要检查关键因果，字数不能替代理解。</li>
        </ul>
      </div>
    </section>
  );
}

function Lab({
  attempt,
  artifacts,
  setAttempt,
}: {
  attempt: Attempt;
  artifacts: Artifact[];
  setAttempt: React.Dispatch<React.SetStateAction<Attempt | null>>;
}) {
  const firstIncompleteIndex = useMemo(() => {
    const responseSteps = steps.filter(
      (step) => step.id !== "baseline-plan" && step.id !== "practical-fix",
    );
    const missing = responseSteps.findIndex((step) => !attempt.steps[step.id]);
    return missing < 0 ? 7 : Math.max(1, missing + 1);
  }, [attempt.steps]);
  const [activeIndex, setActiveIndex] = useState(firstIncompleteIndex);
  const [hintBusy, setHintBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const activeStep = steps[activeIndex];

  const saveStep = async (stepId: string, text: string) => {
    const updated = await api<Attempt>(
      `/api/attempts/${attempt.id}/steps/${stepId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { text } }),
      },
    );
    setAttempt(updated);
    const index = steps.findIndex((step) => step.id === stepId);
    if (index >= 0 && index < steps.length - 1) setActiveIndex(index + 1);
  };

  const takeHint = async () => {
    setHintBusy(true);
    try {
      const updated = await api<Attempt>(`/api/attempts/${attempt.id}/hints`, {
        method: "POST",
        body: "{}",
      });
      setAttempt(updated);
    } finally {
      setHintBusy(false);
    }
  };

  const verify = async () => {
    const updated = await api<Attempt>(`/api/attempts/${attempt.id}/verify`, {
      method: "POST",
      body: "{}",
    });
    setAttempt(updated);
  };

  const submit = async () => {
    setSubmitError("");
    try {
      const updated = await api<Attempt>(`/api/attempts/${attempt.id}/submit`, {
        method: "POST",
        body: "{}",
      });
      setAttempt(updated);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "结算失败");
    }
  };

  if (attempt.status === "submitted") {
    return <EvidenceResult hintLevel={attempt.hintLevel} />;
  }

  return (
    <div className="lab-shell">
      <aside className="lab-sidebar">
        <Logo />
        <div className="case-progress">
          <span>CASE 001</span>
          <strong>保存成功，但刷新后消失</strong>
          <small>
            <Clock3 size={13} /> 预计 45–90 分钟
          </small>
        </div>
        <nav aria-label="练习步骤">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const done =
              step.id === "baseline-plan" ||
              (step.id === "practical-fix"
                ? attempt.verificationStatus === "passed"
                : Boolean(attempt.steps[step.id]));
            return (
              <button
                key={step.id}
                className={`${activeIndex === index ? "active" : ""} ${done ? "done" : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                <span>{done ? <Check size={15} /> : <Icon size={15} />}</span>
                <b>{step.label}</b>
                <ChevronRight size={14} />
              </button>
            );
          })}
        </nav>
        <SafetyBadge />
      </aside>
      <main className="lab-main">
        <header className="lab-topbar">
          <div>
            <span>当前阶段</span>
            <strong>{activeStep.label}</strong>
          </div>
          <div className="hint-meter">
            <span>提示等级</span>
            <b>{attempt.hintLevel} / 3</b>
          </div>
        </header>
        <div className="lab-content">
          {activeIndex === 0 && (
            <section className="lab-card baseline-sealed">
              <span className="large-icon">
                <LockKeyhole />
              </span>
              <span className="mini-label">原始证据已封存</span>
              <h2>这份回答不会被后续提示覆盖</h2>
              <p>
                它用于和你的最终解释、变式复测比较。我们不会因为写错而扣
                XP，也不会把信心当能力。
              </p>
              <button
                className="v2-button primary"
                onClick={() => setActiveIndex(1)}
              >
                开始调查项目 <ArrowRight size={17} />
              </button>
            </section>
          )}
          {activeIndex === 1 && (
            <ResponseForm
              title="阶段 02 · 材料调查"
              prompt="根据真实代码和运行证据，提出你的故障假设"
              placeholder="最可能出问题的是……因为 Network 说明……数据库查询又说明……下一步我会验证……"
              initialValue={attempt.steps["inspect-evidence"]?.response.text}
              minimum={60}
              onSave={(text) => saveStep("inspect-evidence", text)}
            >
              <p className="instruction">
                不要只写“数据库有问题”。引用至少两份互相连接的证据，并说出它们分别能证明什么、不能证明什么。
              </p>
              <ArtifactViewer artifacts={artifacts} />
            </ResponseForm>
          )}
          {activeIndex === 2 && (
            <ResponseForm
              title="阶段 03 · 数据流"
              prompt="还原保存请求的完整路径，并标出证据断点"
              placeholder="用户点击 → 前端…… → POST…… → 路由…… → repository…… → SQLite…… → 再次 GET……"
              initialValue={attempt.steps["trace-data-flow"]?.response.text}
              minimum={70}
              onSave={(text) => saveStep("trace-data-flow", text)}
            >
              <div className="flow-strip">
                <span>点击</span>
                <ArrowRight />
                <span>前端状态</span>
                <ArrowRight />
                <span>HTTP</span>
                <ArrowRight />
                <span>路由</span>
                <ArrowRight />
                <span>数据访问</span>
                <ArrowRight />
                <span>SQLite</span>
              </div>
              <p className="instruction">
                必须区分：“收到
                201”“页面出现对象”“数据库存在记录”是三条不同证据。
              </p>
            </ResponseForm>
          )}
          {activeIndex === 3 && (
            <VerificationPanel attempt={attempt} onVerify={verify} />
          )}
          {activeIndex === 4 && (
            <ResponseForm
              title="阶段 05 · 协作能力"
              prompt="给 Agent 写一份可以直接执行和验收的修复任务"
              placeholder="现象与复现：……\n已知证据：……\n期望行为：……\n不得改动：……\n验收标准：……\n失败路径：……"
              initialValue={attempt.steps["agent-brief"]?.response.text}
              minimum={100}
              onSave={(text) => saveStep("agent-brief", text)}
            >
              <p className="instruction">
                不要告诉
                Agent“用最好的方式修”。提供复现、证据、边界、真实副作用和失败路径。
              </p>
            </ResponseForm>
          )}
          {activeIndex === 5 && (
            <ResponseForm
              title="阶段 06 · 交付审查"
              prompt="审查 Agent 的交付说明：哪些证据无效或缺失？"
              placeholder="“编译通过”只能证明……；“页面出现”不能证明……；还必须验证……"
              initialValue={attempt.steps["delivery-review"]?.response.text}
              minimum={80}
              onSave={(text) => saveStep("delivery-review", text)}
            >
              <ArtifactViewer
                artifacts={artifacts.filter(
                  (artifact) => artifact.id === "delivery",
                )}
              />
            </ResponseForm>
          )}
          {activeIndex === 6 && (
            <ResponseForm
              title="阶段 07 · 因果解释"
              prompt="不用背术语，解释故障为什么发生、修复为什么有效"
              placeholder="原来的成功提示来自……但刷新时数据来源是……两者不一致的原因是……修复后……"
              initialValue={attempt.steps["causal-explanation"]?.response.text}
              minimum={100}
              onSave={(text) => saveStep("causal-explanation", text)}
            >
              <div className="rubric-preview">
                <strong>解释必须覆盖</strong>
                <span>成功提示的来源</span>
                <span>刷新后数据的来源</span>
                <span>缺失的持久化副作用</span>
                <span>修复后的验证链</span>
              </div>
            </ResponseForm>
          )}
          {activeIndex === 7 && (
            <ResponseForm
              title="阶段 08 · 迁移预演"
              prompt="换一个表象：头像上传显示成功，重新登录后恢复旧头像。你会如何定位？"
              placeholder="先检查……如果 Network……接着比较……需要证明的真实副作用是……"
              initialValue={attempt.steps["transfer-check"]?.response.text}
              minimum={80}
              onSave={async (text) => {
                await saveStep("transfer-check", text);
              }}
            >
              <div className="transfer-warning">
                <Clock3 />
                <p>
                  <strong>这只是即时迁移预演</strong>
                  它不会让你直接升到 L3。真正的 L3
                  需要隔一段时间、无提示完成第二个可运行场景。
                </p>
              </div>
              <button
                type="button"
                className="v2-button dark wide"
                disabled={
                  attempt.verificationStatus !== "passed" ||
                  !attempt.steps["inspect-evidence"] ||
                  !attempt.steps["trace-data-flow"] ||
                  !attempt.steps["agent-brief"] ||
                  !attempt.steps["delivery-review"] ||
                  !attempt.steps["causal-explanation"] ||
                  !attempt.steps["transfer-check"]
                }
                onClick={submit}
              >
                <Trophy size={18} /> 结算候选证据
              </button>
              {submitError && <p className="form-error">{submitError}</p>}
            </ResponseForm>
          )}
          <aside className="hint-panel">
            <div>
              <HelpCircle size={19} />
              <span>
                <strong>卡住了吗？</strong>
                提示会被记录，但不会清零你的学习成果。
              </span>
              <button
                onClick={takeHint}
                disabled={hintBusy || attempt.hintLevel >= 3}
              >
                {attempt.hintLevel >= 3
                  ? "已显示完整线索"
                  : `领取第 ${attempt.hintLevel + 1} 层提示`}
              </button>
            </div>
            {attempt.hintLevel > 0 && (
              <ol>
                {hints.slice(0, attempt.hintLevel).map((hint, index) => (
                  <li key={hint}>
                    <b>提示 {index + 1}</b>
                    {hint}
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      setLoading(true);
      setError("");
      try {
        await api("/api/health");
        const session = await api<Diagnostic>("/api/diagnostic-sessions", {
          method: "POST",
          body: "{}",
        });
        if (cancelled) return;
        setDiagnostic(session);
        if (session.status === "completed") {
          const [currentAttempt, scenario] = await Promise.all([
            api<Attempt>("/api/attempts", {
              method: "POST",
              body: JSON.stringify({ scenarioId: SCENARIO_ID }),
            }),
            api<{ artifacts: Artifact[] }>(`/api/scenarios/${SCENARIO_ID}`),
          ]);
          if (cancelled) return;
          setAttempt(currentAttempt);
          setArtifacts(scenario.artifacts);
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error ? cause.message : "无法连接本地学习服务",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const finishBaseline = async (form: BaselineForm) => {
    if (!diagnostic) return;
    const saved = await api<Diagnostic>(
      `/api/diagnostic-sessions/${diagnostic.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ baseline: form, completed: true }),
      },
    );
    const [currentAttempt, scenario] = await Promise.all([
      api<Attempt>("/api/attempts", {
        method: "POST",
        body: JSON.stringify({ scenarioId: SCENARIO_ID }),
      }),
      api<{ artifacts: Artifact[] }>(`/api/scenarios/${SCENARIO_ID}`),
    ]);
    const withBaseline = await api<Attempt>(
      `/api/attempts/${currentAttempt.id}/steps/baseline-plan`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: form }),
      },
    );
    setDiagnostic(saved);
    setAttempt(withBaseline);
    setArtifacts(scenario.artifacts);
  };

  if (loading) return <Loading message="正在连接本地学习记录…" />;
  if (error) {
    return (
      <ServiceError
        message={error}
        retry={() => setReloadKey((key) => key + 1)}
      />
    );
  }
  if (!diagnostic) return <Loading message="正在建立诊断会话…" />;
  if (diagnostic.status === "active") {
    return (
      <BaselineDiagnostic diagnostic={diagnostic} onSubmit={finishBaseline} />
    );
  }
  if (!attempt) return <Loading message="正在恢复真实项目练习…" />;
  return (
    <Lab attempt={attempt} artifacts={artifacts} setAttempt={setAttempt} />
  );
}
