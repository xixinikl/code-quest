import { TeachingBridge } from "./TeachingBridge";
import {
  case02Scenario,
  case03Scenario,
  case04Scenario,
  case05Scenario,
  case06Scenario,
  case07Scenario,
  case08Scenario,
  case09Scenario,
  case10Scenario,
  case11Scenario,
  case12Scenario,
  case13Scenario,
  case14Scenario,
  case15Scenario,
  teachingScenario,
} from "./teaching";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import archiveNight from "./assets/code-archive-night.png";
import keyVaultEquipment from "./assets/equipment-key-vault.svg";
import foglampCatPet from "./assets/pet-foglamp-cat.svg";
import retrievalFoxPet from "./assets/pet-retrieval-fox.svg";
import archiveKeeperPortrait from "./assets/portrait-archive-keeper.svg";
import apiClerkPortrait from "./assets/portrait-api-clerk.svg";
import briefForgemasterPortrait from "./assets/portrait-brief-forgemaster.svg";
import deliveryJudgePortrait from "./assets/portrait-delivery-judge.svg";
import identityGuardPortrait from "./assets/portrait-identity-guard.svg";
import idempotencyStonePet from "./assets/pet-idempotency-stone.svg";
import mirrorEditorPortrait from "./assets/portrait-mirror-editor.svg";
import releaseGatekeeperPortrait from "./assets/portrait-release-gatekeeper.svg";
import interviewCouncilorPortrait from "./assets/portrait-interview-councilor.svg";
import testArbiterPortrait from "./assets/portrait-test-arbiter.svg";
import toolWardenPortrait from "./assets/portrait-tool-warden.svg";
import questArchive from "./assets/quest-archive.png";
import questPortal from "./assets/quest-portal.png";
import questStage from "./assets/quest-stage.png";
import questWorkbench from "./assets/quest-workbench.png";
import {
  aiCareerRoadmap,
  careerRoutes,
  currentChapter,
  type CareerChapter,
  type CareerRoute,
} from "./careerRoadmap";
import {
  loadDeveloper,
  saveDeveloper,
  awardXP,
  completeChapter,
  getRank,
  getNextRank,
  isChapterCleared,
  type DeveloperProfile,
} from "./careerProfile";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
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
  type LucideIcon,
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

type LearningBackup = {
  format: "code-quest-learning-backup";
  formatVersion: number;
  schemaVersion: number;
  exportedAt: string;
  developerProfile?: DeveloperProfile;
  tables: Record<string, unknown[]>;
};

type BackupImportResult = {
  importedAt: string;
  counts: Record<string, number>;
};

type ApiError = { error: string; message: string };

const SCENARIO_ID = "canvas-save-persistence";
const CASE02_SCENARIO_ID = "canvasstorm-product-brief";
const CASE03_SCENARIO_ID = "identity-session-corridor";
const CASE04_SCENARIO_ID = "api-error-court";
const CASE05_SCENARIO_ID = "data-consistency-forge";
const CASE06_SCENARIO_ID = "performance-fog-lab";
const CASE07_SCENARIO_ID = "ai-api-key-vault";
const CASE08_SCENARIO_ID = "hallucination-mirror-hall";
const CASE09_SCENARIO_ID = "rag-knowledge-maze";
const CASE10_SCENARIO_ID = "agent-tool-tower";
const CASE11_SCENARIO_ID = "verification-trial-arena";
const CASE12_SCENARIO_ID = "agent-brief-forge";
const CASE13_SCENARIO_ID = "delivery-review-court";
const CASE14_SCENARIO_ID = "release-readiness-gate";
const CASE15_SCENARIO_ID = "interview-answer-forge";

type LabStep = {
  id: string;
  label: string;
  icon: LucideIcon;
  kind: "baseline" | "response" | "verification";
  response?: {
    title: string;
    prompt: string;
    placeholder: string;
    minimum: number;
    instruction?: string;
    artifactIds?: string[];
    flowStrip?: string[];
    rubricItems?: string[];
    warning?: {
      title: string;
      body: string;
    };
  };
};

type ArtifactGuide = {
  place: string;
  focus: string;
  keyLines: string[];
  proves: string;
  cannotProve: string;
};

type LabConfig = {
  scenarioId: string;
  missionLabel: string;
  missionTitle: string;
  duration: string;
  backgroundImage: string;
  flowAriaLabel: string;
  flowEyebrow: string;
  flowTitle: string;
  flowItems: Array<{
    label: string;
    title: string;
    detail: string;
  }>;
  baseline: {
    label: string;
    title: string;
    body: string;
    action: string;
  };
  practical: {
    title: string;
    sandboxPath: string;
    statusPassed: string;
    statusFailed: string;
  };
  result: {
    label: string;
    title: string;
    body: (hintLevel: number) => string;
    proved: string;
    recorded: string;
    pending: string;
    nextTitle: string;
    nextItems: string[];
  };
  hints: string[];
  steps: LabStep[];
  verificationStepId: string;
  requiredResponseStepIds: string[];
  artifactGuides: Record<string, ArtifactGuide>;
};

const labConfigs: Record<string, LabConfig> = {
  [SCENARIO_ID]: {
    scenarioId: SCENARIO_ID,
    missionLabel: "主线 1-1 · AI 应用开发",
    missionTitle: "数据消失事件",
    duration: "45-90 分钟 · 产出面试复盘",
    backgroundImage: questArchive,
    flowAriaLabel: "保存数据旅行路线",
    flowEyebrow: "固定路线",
    flowTitle: "保存数据从哪里来，又在哪里断掉",
    flowItems: [
      { label: "用户", title: "点击保存", detail: "把画布草稿交给页面" },
      { label: "前端", title: "发出 POST", detail: "收到 201 后先显示成功" },
      { label: "后端接口", title: "接待请求", detail: "把保存动作交给数据层" },
      { label: "数据层", title: "应该写库", detail: "现在断在这里" },
      { label: "数据库", title: "查询反证", detail: "SELECT 结果为 0 行" },
    ],
    baseline: {
      label: "项目委托已领取",
      title: "先进入真实项目现场",
      body: "这一步记录你选择的 AI 应用开发路线。接下来会从材料、数据流和关键代码开始，一步步带你完成真实排障。",
      action: "进入项目现场",
    },
    practical: {
      title: "在独立沙盒里定位并修复故障",
      sandboxPath: "sandbox/canvas-save-persistence",
      statusPassed: "行为证据成立，但还需要解释和迁移复测。",
      statusFailed: "这是有效学习证据：请根据失败信息继续定位。",
    },
    result: {
      label: "工程闭环通过 · 成长档案已更新",
      title: "这次通关已经能写进你的项目复盘",
      body: (hintLevel) =>
        `实际测试证明修复行为成立；系统也保存了你的排查路径和解释。这不是空泛 XP，而是一段可以继续打磨成面试讲述的真实项目经历。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "代码产生真实数据库副作用",
      recorded: "排查路径、提示次数与解释",
      pending: "换一个项目场景独立迁移",
      nextTitle: "下一步怎么变成更强的面试材料？",
      nextItems: [
        "再完成一个不同场景，证明你不是只会这一题。",
        "尽量减少提示依赖；本次提示等级会记录在成长档案里。",
        "把“现象、定位、修改、验证”讲成 1 分钟项目复盘。",
      ],
    },
    hints: [
      "先不要猜具体代码。比较“POST 返回 201”“GET 返回空数组”“数据库查询 0 行”分别能证明什么。",
      "沿着前端 → 路由 → repository → SQLite 逐层找：哪一层声称成功，却没有产生下一层可观察的副作用？",
      "检查 `server/canvasRepository.js` 的 `saveCanvas`：创建后的对象最终进入了内存数组，还是执行了数据库 INSERT？",
    ],
    verificationStepId: "practical-fix",
    requiredResponseStepIds: [
      "inspect-evidence",
      "trace-data-flow",
      "agent-brief",
      "delivery-review",
      "causal-explanation",
      "transfer-check",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "inspect-evidence",
        label: "读取项目材料",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 项目材料",
          prompt: "先看这一棒在流程里的位置，再提出故障假设",
          placeholder:
            "最可能出问题的是……因为 Network 说明……数据库查询又说明……下一步我会验证……",
          minimum: 60,
          instruction:
            "不要只写“数据库有问题”。引用至少两份互相连接的证据，并说出它们分别能证明什么、不能证明什么。",
        },
      },
      {
        id: "trace-data-flow",
        label: "还原数据流",
        icon: Network,
        kind: "response",
        response: {
          title: "阶段 03 · 数据流",
          prompt: "还原保存请求的完整路径，并标出证据断点",
          placeholder:
            "用户点击 → 前端…… → POST…… → 路由…… → repository…… → SQLite…… → 再次 GET……",
          minimum: 70,
          instruction:
            "必须区分：“收到 201”“页面出现对象”“数据库存在记录”是三条不同证据。",
          flowStrip: ["点击", "前端状态", "HTTP", "路由", "数据访问", "SQLite"],
        },
      },
      {
        id: "practical-fix",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 05 · 协作能力",
          prompt: "给 Agent 写一份可以直接执行和验收的修复任务",
          placeholder:
            "现象与复现：……\n已知证据：……\n期望行为：……\n不得改动：……\n验收标准：……\n失败路径：……",
          minimum: 100,
          instruction:
            "不要告诉 Agent“用最好的方式修”。提供复现、证据、边界、真实副作用和失败路径。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 06 · 交付审查",
          prompt: "审查 Agent 的交付说明：哪些证据无效或缺失？",
          placeholder:
            "“编译通过”只能证明……；“页面出现”不能证明……；还必须验证……",
          minimum: 80,
          artifactIds: ["delivery"],
        },
      },
      {
        id: "causal-explanation",
        label: "解释故障因果",
        icon: Lightbulb,
        kind: "response",
        response: {
          title: "阶段 07 · 因果解释",
          prompt: "不用背术语，解释故障为什么发生、修复为什么有效",
          placeholder:
            "原来的成功提示来自……但刷新时数据来源是……两者不一致的原因是……修复后……",
          minimum: 100,
          rubricItems: [
            "成功提示的来源",
            "刷新后数据的来源",
            "缺失的持久化副作用",
            "修复后的验证链",
          ],
        },
      },
      {
        id: "transfer-check",
        label: "面试迁移题",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试迁移题",
          prompt:
            "换一个表象：头像上传显示成功，重新登录后恢复旧头像。你会如何定位？",
          placeholder:
            "先检查……如果 Network……接着比较……需要证明的真实副作用是……",
          minimum: 80,
          warning: {
            title: "这只是即时迁移预演",
            body: "它会进入成长档案，但真正能打动面试官的，是你换一个可运行场景后仍能独立复现、定位和验证。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 2 棒：前端页面 → 后端接口",
        focus:
          "只看 save() 里 fetch、response.ok 和 setStatus('saved') 的关系。",
        keyLines: [
          "fetch('/api/canvases', { method: 'POST', body: ... })",
          "if (!response.ok) setStatus('error')",
          "onSaved(savedCanvas); setStatus('saved')",
        ],
        proves: "页面把草稿发给了后端，并且后端回 2xx 后页面会显示保存成功。",
        cannotProve: "不能证明数据库里真的多了一行记录。",
      },
      route: {
        place: "第 3 棒：后端接口 → 数据层函数",
        focus: "只看 POST 路由收到请求后，把数据交给哪个函数。",
        keyLines: [
          "router.post('/api/canvases', ...)",
          "const saved = saveCanvas(...)",
          "res.status(201).json(saved)",
        ],
        proves: "接口接到了前端请求，并把保存动作委托给数据访问层。",
        cannotProve: "不能单独证明 saveCanvas 内部真的写入数据库。",
      },
      repository: {
        place: "第 4 棒：数据层函数 → 数据库",
        focus: "只看 saveCanvas 写到哪里，listCanvases 又从哪里读。",
        keyLines: [
          "saveCanvas(...)",
          "pendingCanvases.push(...)",
          "listCanvases() 查询 SQLite",
        ],
        proves: "读写位置不一致：写进临时内存，读取却查数据库。",
        cannotProve: "不能证明修复已经完成；它只证明根因在哪里。",
      },
      schema: {
        place: "第 4 棒的目标：数据库应该长什么样",
        focus: "只看 canvases 表需要哪些字段。",
        keyLines: ["CREATE TABLE canvases", "id", "name", "created_at"],
        proves: "数据库有可写入的表结构，修复应该把记录 INSERT 到这里。",
        cannotProve: "表存在不等于保存动作已经写入。",
      },
      network: {
        place: "第 2 棒证据：前端收到了接口回信",
        focus: "只看请求方法、路径、状态码和响应体。",
        keyLines: ["POST /api/canvases", "201 Created", "response body"],
        proves: "接口给了成功回信，所以前端亮绿灯有来源。",
        cannotProve: "201 不是数据库收据，不能证明落库。",
      },
      logs: {
        place: "第 3 棒旁证：后端确实处理了请求",
        focus: "只看保存请求进入后端、后端返回的时间点。",
        keyLines: ["POST /api/canvases", "created", "request id"],
        proves: "请求到过后端，不是前端没发出去。",
        cannotProve: "日志说处理过，不等于数据库写入成功。",
      },
      database: {
        place: "第 5 棒反证：数据库里到底有没有",
        focus: "只看 SELECT 查询结果。",
        keyLines: ["SELECT * FROM canvases", "0 rows"],
        proves: "数据库没有这条记录，这是最强反证。",
        cannotProve: "只能证明当前版本没写入，不能告诉你代码该怎么改。",
      },
      delivery: {
        place: "交付审查：Agent 的说明是否可信",
        focus: "只看它有没有提到真实副作用、测试和边界。",
        keyLines: ["改了哪里", "如何验证", "还有什么风险"],
        proves: "交付说明可以作为审查入口。",
        cannotProve: "说明写得好不代表行为真的修好了，仍要看测试和证据。",
      },
    },
  },
  [CASE02_SCENARIO_ID]: {
    scenarioId: CASE02_SCENARIO_ID,
    missionLabel: "主线 1-2 · AI 应用开发",
    missionTitle: "产品链路密室",
    duration: "45-90 分钟 · 产出产品链路复盘",
    backgroundImage: questWorkbench,
    flowAriaLabel: "CanvasStorm 产品链路路线",
    flowEyebrow: "本关路线",
    flowTitle: "一个 AI 点子怎样变成可执行草案",
    flowItems: [
      { label: "用户", title: "写 Brief", detail: "说明目标、阶段和约束" },
      {
        label: "前端",
        title: "提交方向",
        detail: "把 MVP/growth/ops 交给接口",
      },
      { label: "后端规划器", title: "筛候选", detail: "应该只保留本轮方向" },
      {
        label: "会话记录",
        title: "保存取舍",
        detail: "要留下为什么选和为什么放弃",
      },
      {
        label: "面试表达",
        title: "讲产品链路",
        detail: "把 AI 功能讲成输入、决策、输出",
      },
    ],
    baseline: {
      label: "CanvasStorm 委托已领取",
      title: "先把 AI 点子放进产品链路",
      body: "这一关不急着写模型能力，而是先证明你能把用户目标、方向筛选、候选取舍和会话保存串起来。",
      action: "进入产品现场",
    },
    practical: {
      title: "在 CanvasStorm Brief 沙盒里修正产品链路",
      sandboxPath: "sandbox/canvasstorm-product-brief",
      statusPassed: "产品取舍、会话保存和错误提示已经有测试证据。",
      statusFailed:
        "失败报告会告诉你：方向筛选、会话记录或空目标处理哪里还没成立。",
    },
    result: {
      label: "产品链路闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成 AI 产品能力",
      body: (hintLevel) =>
        `你不只是让页面返回 200，而是证明了 Project Brief、方向筛选、候选取舍和会话保存之间的关系。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "执行草案只接收符合方向的候选",
      recorded: "Brief、取舍理由、下一步动作与验收证据",
      pending: "换一个 AI 功能继续练产品拆解",
      nextTitle: "下一步怎么变成面试里的产品能力？",
      nextItems: [
        "把“AI 点子”讲成用户目标、输入、处理、输出和约束。",
        "说明为什么拒绝不符合阶段的候选，而不是把所有想法都塞进去。",
        "用测试结果证明会话保存了取舍理由，不只证明接口返回 200。",
      ],
    },
    hints: [
      "先看 Brief：用户目标、阶段和约束决定了本轮只能做什么。",
      "比较 Network 和后端日志：接口返回了三个候选，但方向是 mvp，为什么 growth 也进来了？",
      "检查 `server/briefPlanner.js` 的 `acceptedCandidates`：它有没有按 direction 过滤，并保存 rejectedCandidateIds？",
    ],
    verificationStepId: "session-save",
    requiredResponseStepIds: [
      "product-brief",
      "candidate-direction",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "product-brief",
        label: "读 Project Brief",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 读懂 Brief",
          prompt: "先说清用户目标、输入、输出和约束",
          placeholder:
            "用户想要……输入是……输出应该是……当前阶段/约束意味着不能做……",
          minimum: 70,
          instruction:
            "不要只写“做 AI 产品”。要把 Project Brief 拆成目标、阶段、约束和本轮可交付结果。",
        },
      },
      {
        id: "candidate-direction",
        label: "筛方向候选",
        icon: Network,
        kind: "response",
        response: {
          title: "阶段 03 · 候选取舍",
          prompt: "解释为什么不是所有 AI 点子都应该进入执行草案",
          placeholder:
            "本轮方向是 mvp，所以……growth 候选虽然有价值，但现在不能进入草案，因为……",
          minimum: 80,
          instruction:
            "把候选看成任务背包：当前关卡只拿能解决本轮目标的装备，别把未来想法全塞进去。",
          flowStrip: ["Brief", "方向", "候选池", "筛选", "执行草案"],
        },
      },
      {
        id: "session-save",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 05 · 协作能力",
          prompt: "把产品链路修复任务交给 Agent，但写清边界",
          placeholder:
            "背景：CanvasStorm 的 Brief 规划……\n目标：只保留……\n不要改：……\n验收：……\n风险：……",
          minimum: 100,
          instruction:
            "任务里必须说明用户目标、方向过滤、会话保存和测试验收。不要只写“优化产品逻辑”。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 06 · 交付审查",
          prompt: "审查 Agent 的交付说明：它漏掉了哪些关键证据？",
          placeholder:
            "POST 200 只能证明……前端展示三个候选反而说明……还必须证明……",
          minimum: 80,
          artifactIds: ["delivery"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 07 · 面试复盘",
          prompt: "把这一关讲成一次 AI 产品链路排障",
          placeholder:
            "我遇到的问题是 AI 点子过于发散……我先看 Brief……再用 Network/日志/会话证明……最后用测试验证……",
          minimum: 100,
          warning: {
            title: "这不是背产品术语",
            body: "面试官想听的是：你如何把模糊需求拆成输入、取舍、输出和可验证结果。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 1 棒：用户 → Project Brief 表单",
        focus: "只看 brief、direction 和 submit 里发给后端的数据。",
        keyLines: [
          "projectName / userGoal / stage / constraints",
          "direction = 'mvp'",
          "fetch('/api/storm/brief-plan', ...)",
        ],
        proves: "前端把用户目标和本轮方向交给了后端。",
        cannotProve: "不能证明后端真的按方向筛选候选。",
      },
      planner: {
        place: "第 2 棒：规划器决定哪些候选进入草案",
        focus:
          "只看 acceptedCandidates 从哪里来，以及 savedSession 保存了什么。",
        keyLines: [
          "const acceptedCandidates = candidates",
          "executionDraft: acceptedCandidates.map(...)",
          "candidateIds: candidates.map(...)",
        ],
        proves: "当前实现没有做方向取舍，所有候选都进入草案和会话。",
        cannotProve: "只能证明故障点，不等于修复已经完成。",
      },
      network: {
        place: "第 3 棒证据：接口回了什么",
        focus: "只看 direction=mvp 和 acceptedCandidates 里混入的候选。",
        keyLines: [
          "POST /api/storm/brief-plan",
          "direction: mvp",
          "acceptedCandidates: growth-share-loop",
        ],
        proves: "用户选的是 MVP，但返回结果包含增长方案。",
        cannotProve: "不能单独证明会话保存里是否记录了取舍理由。",
      },
      logs: {
        place: "第 4 棒旁证：后端处理过候选",
        focus: "只看 accepted=3 rejected=0。",
        keyLines: [
          "direction=mvp candidates=3",
          "accepted=3 rejected=0",
          "saved candidateIds=...",
        ],
        proves: "后端没有拒绝任何候选，问题不是前端没传方向。",
        cannotProve: "日志不能替代测试；它只是定位线索。",
      },
      "session-before": {
        place: "会话保存前：旧记录是什么",
        focus: "只看 session_01 里原本只有项目名和空 notes。",
        keyLines: ["session_01", "projectName", "notes: []"],
        proves: "这是保存前状态，可以和保存后做对照。",
        cannotProve: "它不能说明保存逻辑是否正确。",
      },
      "session-after": {
        place: "会话保存后：当前错误结果",
        focus: "只看 candidateIds 是否混入不该进入本轮的候选。",
        keyLines: [
          "lastDirection: mvp",
          "candidateIds: growth-share-loop",
          "缺少 rejectedCandidateIds",
        ],
        proves: "会话保存了候选 id，但没有保存取舍理由和拒绝项。",
        cannotProve: "只看保存结果不能知道代码该怎么改，需要回到 planner。",
      },
      delivery: {
        place: "交付审查：完成说明是否可信",
        focus: "只看它有没有证明方向筛选、取舍理由和会话保存。",
        keyLines: ["POST 返回 200", "展示三个候选", "风险：未说明为什么"],
        proves: "这份说明只证明接口有响应，没有证明产品链路正确。",
        cannotProve: "Agent 说完成不等于真的满足 MVP 取舍。",
      },
    },
  },
  [CASE03_SCENARIO_ID]: {
    scenarioId: CASE03_SCENARIO_ID,
    missionLabel: "主线 1-3 · AI 应用开发",
    missionTitle: "身份回廊",
    duration: "45-90 分钟 · 产出登录态排障复盘",
    backgroundImage: questPortal,
    flowAriaLabel: "登录态从登录到刷新恢复的路线",
    flowEyebrow: "本关路线",
    flowTitle: "登录成功以后，身份凭证要交给谁保管",
    flowItems: [
      { label: "用户", title: "输入账号", detail: "把身份交给登录表单" },
      {
        label: "登录接口",
        title: "返回 200",
        detail: "发 user 和 accessToken",
      },
      {
        label: "浏览器凭证",
        title: "应该保存",
        detail: "Cookie 或 Token 要能刷新恢复",
      },
      {
        label: "受保护接口",
        title: "GET /api/me",
        detail: "每次带凭证问后端我是谁",
      },
      {
        label: "服务端会话",
        title: "登记身份",
        detail: "session 表要能查到当前用户",
      },
      {
        label: "面试表达",
        title: "讲登录态",
        detail: "区分页面状态和可恢复凭证",
      },
    ],
    baseline: {
      label: "身份回廊委托已领取",
      title: "先分清“登录成功”和“登录态可恢复”",
      body: "这一关的陷阱是：页面短暂显示用户名，不等于刷新后后端还能认出你。你要沿着登录响应、浏览器凭证、/api/me 和服务端会话找断点。",
      action: "进入身份现场",
    },
    practical: {
      title: "在身份回廊沙盒里修复刷新后掉登录",
      sandboxPath: "sandbox/identity-session-corridor",
      statusPassed: "登录、凭证保存、/api/me 和刷新恢复都有测试证据。",
      statusFailed:
        "失败报告会告诉你：凭证保存、服务端会话或刷新恢复哪里还断着。",
    },
    result: {
      label: "登录态闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次登录态排障",
      body: (hintLevel) =>
        `你不只是让登录接口返回 200，而是证明了凭证保存、受保护请求、服务端会话和刷新恢复之间的关系。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "刷新后 /api/me 能携带有效凭证并恢复用户",
      recorded: "登录响应、浏览器凭证、401 反证和后端会话日志",
      pending: "换一种鉴权方式继续迁移",
      nextTitle: "下一步怎么变成面试里的登录态能力？",
      nextItems: [
        "把“页面显示用户名”和“后端能识别当前用户”分开讲。",
        "说明 Cookie、Token、Session 各自负责哪一段，以及证据在哪里。",
        "用刷新后 /api/me 的 Network 结果证明修复，不只看登录接口 200。",
      ],
    },
    hints: [
      "先区分页面短暂显示用户名和刷新后还能识别用户。200 只能说明登录接口成功。",
      "比较 login 200、storage-after 只有 memory、/api/me 401：凭证在哪一棒没有留下来？",
      "检查 `server/sessionGateway.js`：pendingSessionId 有没有写进 serverSessions，并且前端能否拿到可恢复凭证。",
    ],
    verificationStepId: "refresh-restore",
    requiredResponseStepIds: [
      "identity-map",
      "credential-storage",
      "protected-request",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "identity-map",
        label: "画身份路线",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 身份路线",
          prompt: "先说清登录态从哪里来、存在哪里、请求时怎么带回去",
          placeholder:
            "用户登录后……登录接口返回……浏览器应该保存……刷新后 /api/me 应该带着……后端再通过……认出用户。",
          minimum: 80,
          instruction:
            "不要只写“Token 丢了”。要把登录表单、登录接口、浏览器凭证、/api/me 和服务端会话串成一条路线。",
        },
      },
      {
        id: "credential-storage",
        label: "查凭证存储",
        icon: Network,
        kind: "response",
        response: {
          title: "阶段 03 · 凭证存放",
          prompt: "判断 Cookie、Authorization 或浏览器存储哪一处没有留下凭证",
          placeholder:
            "network-login 说明……storage-after 说明……没有 Set-Cookie/持久 Token 会导致……",
          minimum: 90,
          instruction:
            "把凭证看成出入身份回廊的门牌：只拿在手上不算登记，刷新以后还能拿出来才算有效。",
          flowStrip: ["登录响应", "Set-Cookie/Token", "浏览器保存", "刷新恢复"],
        },
      },
      {
        id: "protected-request",
        label: "读 401 反证",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 04 · 401 反证",
          prompt: "用 /api/me 401 说明后端为什么认不出当前用户",
          placeholder:
            "GET /api/me 的 Cookie 是……Authorization 是……所以 401 能证明……但还不能证明……",
          minimum: 80,
          artifactIds: ["me-401-network", "logs"],
          rubricItems: [
            "请求有没有 Cookie",
            "请求有没有 Authorization",
            "服务端有没有 session 记录",
            "401 能证明和不能证明什么",
          ],
        },
      },
      {
        id: "refresh-restore",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · 协作能力",
          prompt: "把登录态修复任务交给 Agent，但写清凭证和验收边界",
          placeholder:
            "背景：登录后刷新变游客……\n现有证据：……\n目标：……\n不要改：……\n验收：……\n风险：……",
          minimum: 110,
          instruction:
            "任务里必须说明登录响应、凭证保存、服务端会话、刷新恢复和 /api/me 验收。不要只写“修一下登录”。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 07 · 交付审查",
          prompt: "审查 Agent 的交付说明：哪些证据不足以证明登录态修好了？",
          placeholder:
            "登录 200 只能证明……页面显示用户名不能证明……还必须验证……",
          minimum: 90,
          artifactIds: ["delivery"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次登录态排障",
          placeholder:
            "我遇到的问题是刷新后掉登录……我先比较登录 200、浏览器凭证和 /api/me 401……根因是……最后用……验证。",
          minimum: 110,
          warning: {
            title: "这不是背 Cookie 和 Token",
            body: "面试官想听的是：你如何证明身份凭证有没有保存、有没有携带、后端有没有登记。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 1 棒：登录页 → 登录接口",
        focus:
          "只看 handleLogin、restoreCurrentUser 和 checkProfile 分别在什么时候触发。",
        keyLines: [
          "restoreCurrentUser({ browserStorage, serverSessions })",
          "signIn({ email, password, browserStorage, serverSessions })",
          "callProtectedApi({ path: '/api/me', ... })",
        ],
        proves: "前端有登录、刷新恢复和检查 /api/me 三个动作入口。",
        cannotProve: "不能证明凭证真的被写进可刷新恢复的位置。",
      },
      "session-gateway": {
        place: "第 2/5 棒：登录逻辑 → 服务端会话",
        focus:
          "只看 signIn 把身份写到了哪里，以及 callProtectedApi 从哪里查用户。",
        keyLines: [
          "browserStorage.memory.currentUser = demoUser",
          "serverSessions.pendingSessionId = sessionId",
          "const session = serverSessions.byToken?.[token]",
        ],
        proves:
          "当前实现只把用户和 token 放在 memory，并没有把 session 登记成可查询记录。",
        cannotProve: "只能证明故障点，不等于修复已经完成。",
      },
      "login-network": {
        place: "第 2 棒证据：登录接口回了什么",
        focus: "只看 200、响应体 accessToken 和响应头里缺少什么。",
        keyLines: ["POST /api/login", "status: 200", "headers: content-type"],
        proves: "登录接口成功返回用户和 accessToken。",
        cannotProve:
          "没有 Set-Cookie，也不能证明前端把 token 存到了刷新后还在的位置。",
      },
      "me-401-network": {
        place: "第 4 棒反证：受保护接口为什么拒绝",
        focus: "只看 GET /api/me 请求头里的 cookie 和 authorization。",
        keyLines: ["GET /api/me", "cookie: ''", "authorization: ''", "401"],
        proves: "刷新后请求没有携带可用凭证，所以后端无法识别当前用户。",
        cannotProve:
          "不能单独判断是前端没保存，还是后端没登记；要结合 storage 和日志。",
      },
      "storage-before": {
        place: "登录前：凭证栏是什么状态",
        focus: "只看 cookies、localStorage 和 memory 是否为空。",
        keyLines: ["cookies: {}", "localStorage: {}", "memory: {}"],
        proves: "登录前没有凭证，这是正常基线。",
        cannotProve: "不能说明登录后有没有正确保存。",
      },
      "storage-after": {
        place: "登录后：凭证留在了哪里",
        focus: "只看 currentUser 和 accessToken 是否只在 memory 里。",
        keyLines: [
          "memory.currentUser",
          "memory.accessToken",
          "cookies: {} / localStorage: {}",
        ],
        proves: "凭证只停在内存里，刷新后会丢。",
        cannotProve:
          "不能说明服务端会话是否也登记失败，需要看日志和 sessionGateway。",
      },
      logs: {
        place: "服务端旁证：会话有没有落档",
        focus: "只看 pendingSessionId、not saved 和 missing credential。",
        keyLines: [
          "pendingSessionId=session_user_apprentice",
          "was not saved into serverSessions.bySessionId",
          "cookie.sessionId=missing authorization=missing status=401",
        ],
        proves:
          "服务端知道登录发生过，但后续没有可查询 session，也没有收到凭证。",
        cannotProve:
          "日志不能替代刷新后复测；修复后仍要看 /api/me 和测试报告。",
      },
      delivery: {
        place: "交付审查：完成说明是否可信",
        focus: "只看它有没有证明凭证保存、服务端 session 和刷新恢复。",
        keyLines: [
          "登录接口返回 200",
          "页面能显示“见习开发者”",
          "没有证明登录后写入 Cookie",
        ],
        proves: "这份说明自己承认缺少刷新恢复和会话登记证据。",
        cannotProve: "Agent 说登录完成不等于登录态闭环完成。",
      },
    },
  },
  [CASE04_SCENARIO_ID]: {
    scenarioId: CASE04_SCENARIO_ID,
    missionLabel: "主线 1-4 · AI 应用开发",
    missionTitle: "接口审判庭",
    duration: "45-90 分钟 · 产出接口失败定位复盘",
    backgroundImage: questArchive,
    flowAriaLabel: "接口错误从请求体到日志的路线",
    flowEyebrow: "本关路线",
    flowTitle: "红色状态码背后，谁的证词不完整",
    flowItems: [
      { label: "用户", title: "提交 Brief", detail: "少填了 userGoal" },
      { label: "前端", title: "发 POST", detail: "把请求体送到 /api/briefs" },
      { label: "接口路由", title: "校验参数", detail: "应该识别缺字段" },
      {
        label: "错误响应",
        title: "返回结构",
        detail: "400 + fields 告诉用户补什么",
      },
      {
        label: "后端日志",
        title: "串 requestId",
        detail: "把 payload、状态码和原因连起来",
      },
      {
        label: "面试表达",
        title: "讲定位过程",
        detail: "区分前端、接口和后端异常",
      },
    ],
    baseline: {
      label: "接口审判庭委托已领取",
      title: "先把“接口坏了”拆成证据链",
      body: "这一关不接受一句“提交失败”。你要比较请求体、状态码、响应结构和后端日志，判断这是用户少填字段、前端没拦截、后端校验包装错，还是服务器真的异常。",
      action: "进入审判现场",
    },
    practical: {
      title: "在接口审判庭沙盒里修正错误路径",
      sandboxPath: "sandbox/api-error-court",
      statusPassed: "缺字段、400 响应、字段级提示和日志追踪都有测试证据。",
      statusFailed:
        "失败报告会告诉你：请求体校验、状态码、字段级错误或日志追踪哪里还没成立。",
    },
    result: {
      label: "接口错误闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次接口排障",
      body: (hintLevel) =>
        `你不只是把错误提示换得好看，而是证明了请求体、状态码、字段级错误、requestId 日志和前端提示之间的关系。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "缺 userGoal 时返回 400 VALIDATION_ERROR，并指出字段原因",
      recorded: "无效请求体、500 反证、结构化错误和后端日志 requestId",
      pending: "换一个接口错误继续迁移",
      nextTitle: "下一步怎么变成面试里的接口排障能力？",
      nextItems: [
        "把 400、401、500 分别讲成不同层级的问题，而不是统称接口坏了。",
        "说明 payload、response body 和 backend.log 如何用 requestId 串起来。",
        "用错误路径测试证明用户能看到该补哪个字段，不只证明正常请求 201。",
      ],
    },
    hints: [
      "先看 request body：userGoal 为空，这是可预期校验错误，不应该直接变成 500。",
      "比较 wrong-response 和 expectedShape：状态码、error code、requestId、fields 少了哪些？",
      "检查 `server/briefRoutes.js` 的 catch：它是不是把所有 Error 都包装成 INTERNAL_ERROR，而不是区分校验错误。",
    ],
    verificationStepId: "error-shape",
    requiredResponseStepIds: [
      "payload-inspection",
      "status-code-judgement",
      "log-correlation",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "payload-inspection",
        label: "检查请求体",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 请求体证词",
          prompt: "先说清前端实际把哪些字段交给了后端，缺了什么",
          placeholder:
            "POST /api/briefs 的 payload 里……projectName 是……userGoal 是……所以这更像……下一步要看……",
          minimum: 80,
          instruction:
            "不要只写“接口失败”。要先引用 payload，说明它能证明前端实际发送了什么、不能证明后端为什么返回 500。",
          artifactIds: ["invalid-payload"],
        },
      },
      {
        id: "status-code-judgement",
        label: "判断状态码",
        icon: AlertTriangle,
        kind: "response",
        response: {
          title: "阶段 03 · 状态码判词",
          prompt: "判断这次应该是 400 校验错误，还是 500 服务器异常",
          placeholder:
            "缺 userGoal 属于……所以应该返回……当前返回 500 会让用户误以为……",
          minimum: 90,
          instruction:
            "把状态码看成审判庭的判词：400 是证词不完整，500 是审判庭自己出事故，两者不能混。",
          artifactIds: ["wrong-response"],
          flowStrip: ["Payload", "校验", "400/500", "错误体", "前端提示"],
        },
      },
      {
        id: "error-shape",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "log-correlation",
        label: "串日志证据",
        icon: Server,
        kind: "response",
        response: {
          title: "阶段 05 · 日志串证",
          prompt: "用 requestId 把请求体、响应和后端日志连起来",
          placeholder:
            "requestId 是……payload 里……response 返回……backend.log 里……所以我能判断……",
          minimum: 90,
          instruction:
            "必须说明日志能证明请求到过后端，也要说明日志不能替代前端可理解的字段级错误。",
          artifactIds: ["invalid-payload", "wrong-response", "logs"],
          rubricItems: [
            "同一个 requestId",
            "payload 缺哪个字段",
            "当前响应为什么误导",
            "日志应该如何记录可追踪原因",
          ],
        },
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · 协作能力",
          prompt: "把接口错误修复任务交给 Agent，但写清错误路径验收",
          placeholder:
            "背景：Project Brief 缺 userGoal 时……\n目标：……\n不要改：……\n验收：……\n风险：……",
          minimum: 110,
          instruction:
            "任务里必须包含缺字段 payload、400 VALIDATION_ERROR、fields.userGoal、requestId 日志和前端错误提示。不要只写“优化错误处理”。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 07 · 交付审查",
          prompt:
            "审查 Agent 的交付说明：哪些证据不足以证明接口错误处理修好了？",
          placeholder:
            "正常 201 只能证明……“提交失败”不能证明……还必须验证缺 userGoal 时……",
          minimum: 90,
          artifactIds: ["delivery"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次接口失败定位",
          placeholder:
            "我遇到的问题是接口只返回提交失败……我先看 payload……再比较 500 响应和日志……最后用……验证。",
          minimum: 110,
          warning: {
            title: "这不是背状态码表",
            body: "面试官想听的是：你如何用请求体、响应体和日志判断问题发生在哪一层，并让用户知道下一步怎么改。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 1 棒：提交按钮 → 接口路由",
        focus:
          "只看 submit 里构造 request、调用 handleBriefRequest 和错误提示。",
        keyLines: [
          "path: '/api/briefs'",
          "body: draft",
          "if (response.status >= 400) setMessage('提交失败，请稍后再试')",
        ],
        proves: "前端确实把草稿交给接口，并且错误时只显示泛泛提示。",
        cannotProve: "不能证明后端为什么返回 500，也不能告诉用户该补哪个字段。",
      },
      route: {
        place: "第 2/3 棒：接口路由 → 参数校验",
        focus: "只看 handleBriefRequest 如何处理 createBrief 抛出的校验错误。",
        keyLines: [
          "const brief = createBrief(request.body)",
          "catch (error) { status: 500 }",
          "if (!body.userGoal) throw new Error('userGoal is required')",
        ],
        proves: "当前实现把可预期的缺字段校验错误包装成了 500。",
        cannotProve: "只能证明故障点，不等于修复后错误体已经可用。",
      },
      "invalid-payload": {
        place: "第 1 棒证据：前端实际发送了什么",
        focus: "只看 userGoal 为空、x-request-id 和请求路径。",
        keyLines: [
          "POST /api/briefs",
          "x-request-id: req_brief_042",
          "userGoal: ''",
        ],
        proves: "请求已经到后端，而且 userGoal 缺失是可观察事实。",
        cannotProve: "不能单独证明状态码应该是多少，需要结合响应和后端逻辑。",
      },
      "wrong-response": {
        place: "第 3 棒反证：接口给了什么判词",
        focus: "只看当前 500 和期望 400 的结构差异。",
        keyLines: [
          "status: 500",
          "error: INTERNAL_ERROR",
          "expected status: 400",
          "fields.userGoal",
        ],
        proves: "当前响应把缺字段问题误判成内部错误，并且没有字段级提示。",
        cannotProve: "不能说明日志是否能串起来，需要看 backend.log。",
      },
      logs: {
        place: "第 4 棒旁证：后端如何记录这次失败",
        focus: "只看 requestId、status=500 和 userGoal is required。",
        keyLines: [
          "requestId=req_brief_042",
          "status=500 message=userGoal is required",
          "validation error was reported as INTERNAL_ERROR",
        ],
        proves: "后端知道是 userGoal 校验失败，但记录和响应都把它归成了 500。",
        cannotProve: "日志不能替代用户可见错误；前端仍需要字段级提示。",
      },
      delivery: {
        place: "交付审查：完成说明是否可信",
        focus: "只看它有没有覆盖缺字段、400/500 区分和字段级错误。",
        keyLines: [
          "正常请求会返回 201",
          "异常时前端会提示“提交失败”",
          "没有区分 400 参数错误和 500 服务器异常",
        ],
        proves: "这份说明只证明正常路径和泛泛错误提示，缺少错误路径验收。",
        cannotProve: "Agent 说接口完成不等于错误处理符合真实工作要求。",
      },
    },
  },
  [CASE05_SCENARIO_ID]: {
    scenarioId: CASE05_SCENARIO_ID,
    missionLabel: "主线 1-5 · AI 应用开发",
    missionTitle: "一致性熔炉",
    duration: "45-90 分钟 · 产出数据一致性复盘",
    backgroundImage: questWorkbench,
    flowAriaLabel: "重复提交从按钮到数据库的路线",
    flowEyebrow: "本关路线",
    flowTitle: "同一份草稿为什么被锻造成多份记录",
    flowItems: [
      {
        label: "用户",
        title: "连点保存",
        detail: "同一个动作可能被送出两次",
      },
      {
        label: "前端",
        title: "带幂等键",
        detail: "Idempotency-Key 和 clientMutationId 是同一枚锤印",
      },
      {
        label: "后端数据层",
        title: "查旧结果",
        detail: "重复请求应该返回第一次的草稿",
      },
      {
        label: "数据库约束",
        title: "挡住重复",
        detail: "唯一约束是最后一道城门",
      },
      {
        label: "事务边界",
        title: "避免半截写入",
        detail: "审计失败时草稿也要一起回滚",
      },
      {
        label: "面试表达",
        title: "讲一致性",
        detail: "说明前端、后端、数据库各自兜底什么",
      },
    ],
    baseline: {
      label: "一致性熔炉委托已领取",
      title: "先别只怪用户连点",
      body: "这一关的关键是：前端防连点只能减少重复请求，不能保证数据一定不重复。你要用 Network、数据库记录数和日志证明同一枚锤印为什么敲出了多份草稿。",
      action: "进入熔炉现场",
    },
    practical: {
      title: "在一致性熔炉沙盒里修复重复写入",
      sandboxPath: "sandbox/data-consistency-forge",
      statusPassed: "重复提交、幂等键、唯一约束和事务回滚都有测试证据。",
      statusFailed:
        "失败报告会告诉你：重复请求、唯一约束、幂等返回或事务边界哪里还没成立。",
    },
    result: {
      label: "数据一致性闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次真实数据保护",
      body: (hintLevel) =>
        `你不只是把保存按钮变灰，而是证明了重复请求、Idempotency-Key、clientMutationId、唯一约束和事务回滚之间的关系。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "同一用户同一 clientMutationId 最终只产生一条核心草稿",
      recorded: "重复请求、数据库前后记录、后端日志和交付审查证据",
      pending: "换一个支付、下单或收藏场景继续迁移",
      nextTitle: "下一步怎么变成面试里的数据一致性能力？",
      nextItems: [
        "解释为什么只靠按钮 disabled 不能抵抗刷新重试和并发请求。",
        "说明 Idempotency-Key、唯一约束和事务分别守住哪一层。",
        "用数据库 count 和失败回滚测试证明没有重复或半截数据。",
      ],
    },
    hints: [
      "先看 Network：两次请求的 Idempotency-Key 和 clientMutationId 一样，这不是两个独立草稿。",
      "比较 database-before 和 database-after：相同 userId + clientMutationId 最终多了几条？",
      "检查 `server/draftRepository.js`：它有没有先查幂等记录、用唯一约束兜底，并把草稿和审计日志放在同一个事务里？",
    ],
    verificationStepId: "transaction-boundary",
    requiredResponseStepIds: [
      "duplicate-reproduction",
      "idempotency-key",
      "unique-constraint",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "duplicate-reproduction",
        label: "复现重复提交",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 连点现场",
          prompt: "先证明这是同一次用户动作被重复送达，不是两份不同草稿",
          placeholder:
            "两次 POST 的 Idempotency-Key 是……clientMutationId 是……title 是……所以它们应该被当成……",
          minimum: 90,
          instruction:
            "不要只写“用户点了两次”。要引用 Network 里的 key、mutationId 和响应状态，说明它们能证明什么。",
          artifactIds: ["double-submit"],
        },
      },
      {
        id: "idempotency-key",
        label: "检查幂等键",
        icon: Network,
        kind: "response",
        response: {
          title: "阶段 03 · 幂等锤印",
          prompt: "解释 Idempotency-Key 和 clientMutationId 应该如何防重复",
          placeholder:
            "Idempotency-Key 像……clientMutationId 像……第一次请求应该……第二次请求应该……",
          minimum: 90,
          instruction:
            "把幂等键想成熔炉锤印：同一枚锤印再次出现时，系统应该返回旧结果，而不是再造一把剑。",
          artifactIds: ["double-submit", "logs"],
          flowStrip: ["连点", "幂等键", "查旧结果", "创建或返回", "数据库数量"],
        },
      },
      {
        id: "unique-constraint",
        label: "查数据库数量",
        icon: Database,
        kind: "response",
        response: {
          title: "阶段 04 · 数据库反证",
          prompt: "用数据库前后记录证明当前实现已经写重复了",
          placeholder:
            "保存前 drafts 有……保存后相同 userId/clientMutationId 出现……所以前端显示成功不能证明……",
          minimum: 90,
          instruction:
            "数据库数量是最终反证。必须说明唯一约束为什么比前端防连点更可靠。",
          artifactIds: ["database-before", "database-after"],
          rubricItems: [
            "保存前记录数",
            "保存后重复记录数",
            "同一 userId + clientMutationId",
            "唯一约束应该挡住什么",
          ],
        },
      },
      {
        id: "transaction-boundary",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · 协作能力",
          prompt: "把数据一致性修复任务交给 Agent，但写清三层兜底",
          placeholder:
            "背景：连点保存写出重复草稿……\n目标：……\n不要只改：……\n验收：……\n风险：……",
          minimum: 110,
          instruction:
            "任务里必须包含重复请求、幂等返回、唯一约束、事务回滚和测试验收。不要只写“防止重复点击”。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 07 · 交付审查",
          prompt: "审查 Agent 的交付说明：哪些证据不足以证明一致性成立？",
          placeholder:
            "POST 201 只能证明……写审计日志不能证明……还必须证明同一 key……以及审计失败时……",
          minimum: 90,
          artifactIds: ["delivery"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次重复提交和事务边界排障",
          placeholder:
            "我遇到的问题是用户连点后出现重复草稿……我先看 Network……再对比数据库……最后用……证明修复。",
          minimum: 110,
          warning: {
            title: "这不是背数据库术语",
            body: "面试官想听的是：你如何证明重复发生、如何让系统承受重试、如何确认没有半截写入。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 1 棒：保存按钮 → 重复请求入口",
        focus:
          "只看 handleSave 如何生成 clientMutationId、是否稳定携带 Idempotency-Key。",
        keyLines: [
          "clientMutationId",
          "headers: { 'Idempotency-Key': ... }",
          "saveDraft(draft)",
        ],
        proves: "前端有把同一次保存动作打上标记的入口。",
        cannotProve: "不能证明后端真的按这个标记做幂等处理。",
      },
      repository: {
        place: "第 2/4 棒：后端数据层 → 数据库",
        focus: "只看 saveDraft 是否先查旧记录、是否保证唯一和事务。",
        keyLines: [
          "saveDraft({ userId, clientMutationId })",
          "drafts.push(newDraft)",
          "auditLogs.push(...)",
        ],
        proves: "当前实现直接创建新草稿，重复请求会重复写入。",
        cannotProve: "只能证明故障点，不等于修复后已经抗住重试。",
      },
      "double-submit": {
        place: "第 1 棒证据：同一动作被送了两次",
        focus:
          "只看两次 POST 的 Idempotency-Key、clientMutationId 和响应状态。",
        keyLines: [
          "POST /api/drafts",
          "Idempotency-Key: draft-save-abc",
          "clientMutationId: mutation_2026_0705_001",
        ],
        proves: "两次请求属于同一保存动作，系统应该幂等返回。",
        cannotProve: "不能说明数据库最后是否重复，需要看 database-after。",
      },
      "database-before": {
        place: "保存前基线：数据库原本有什么",
        focus: "只看 drafts 和 auditLogs 的初始数量。",
        keyLines: ["drafts", "auditLogs", "before save"],
        proves: "这是判断重复写入的基线。",
        cannotProve: "不能说明故障是否发生。",
      },
      "database-after": {
        place: "最终反证：数据库被写成什么样",
        focus: "只看相同 userId 和 clientMutationId 出现了几次。",
        keyLines: [
          "user_apprentice",
          "mutation_2026_0705_001",
          "duplicate drafts",
        ],
        proves: "同一动作写出了多条核心记录，说明后端和数据库没有兜住。",
        cannotProve: "不能单独告诉你事务边界，需要结合日志和测试。",
      },
      logs: {
        place: "后端旁证：系统如何处理重复和半失败",
        focus: "只看 repeated key、created twice 和 audit failure。",
        keyLines: [
          "Idempotency-Key=draft-save-abc",
          "created draft twice",
          "audit log failed after draft insert",
        ],
        proves:
          "后端看到了相同幂等键，但没有返回旧结果，并且存在半截写入风险。",
        cannotProve: "日志不能替代数据库数量和失败回滚测试。",
      },
      delivery: {
        place: "交付审查：完成说明是否可信",
        focus: "只看它有没有覆盖连点、幂等、唯一约束和事务回滚。",
        keyLines: [
          "POST /api/drafts 能创建草稿",
          "没有模拟用户连点两次",
          "没有证明审计日志失败时数据库会回滚",
        ],
        proves: "这份说明承认缺少一致性验收，只能证明正常创建路径。",
        cannotProve: "Agent 说保存完成不等于数据一致性成立。",
      },
    },
  },
  [CASE06_SCENARIO_ID]: {
    scenarioId: CASE06_SCENARIO_ID,
    missionLabel: "主线 1-6 · AI 应用开发",
    missionTitle: "慢速迷雾",
    duration: "45-90 分钟 · 产出性能瓶颈复盘",
    backgroundImage: questStage,
    flowAriaLabel: "页面变慢从打开页面到缓存复测的路线",
    flowEyebrow: "本关路线",
    flowTitle: "用户说慢的时候，时间到底花在了哪一段",
    flowItems: [
      {
        label: "用户",
        title: "打开列表",
        detail: "先把体感慢翻译成可观察页面动作",
      },
      {
        label: "Network",
        title: "读瀑布图",
        detail: "区分资源下载、TTFB 和接口下载",
      },
      {
        label: "后端日志",
        title: "拆接口耗时",
        detail: "Server-Timing 要说清 db/cache/app",
      },
      {
        label: "前端渲染",
        title: "看卡顿画像",
        detail: "接口回了以后还可能卡在渲染",
      },
      {
        label: "缓存复测",
        title: "二次访问",
        detail: "优化后要证明更快且数据不旧",
      },
      {
        label: "面试表达",
        title: "讲瓶颈",
        detail: "用证据说明慢在前端还是后端",
      },
    ],
    baseline: {
      label: "慢速迷雾委托已领取",
      title: "先把“页面很慢”翻译成时间账本",
      body: "这一关不接受一句“优化一下”。你要先看 Network 瀑布图，判断最长的是资源、TTFB 还是下载；再用后端日志、渲染画像和缓存复测证明瓶颈在哪里。",
      action: "进入迷雾现场",
    },
    practical: {
      title: "在慢速迷雾沙盒里定位性能瓶颈",
      sandboxPath: "sandbox/performance-fog-lab",
      statusPassed: "瀑布图、Server-Timing、渲染画像和缓存复测都有测试证据。",
      statusFailed:
        "失败报告会告诉你：后端计时、缓存命中、渲染数量或复测证据哪里还没成立。",
    },
    result: {
      label: "性能瓶颈闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次性能排查",
      body: (hintLevel) =>
        `你不只是让 loading 文案好看，而是证明了 Network 瀑布图、TTFB、后端查询、前端渲染和缓存复测之间的关系。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "慢点被拆成接口等待、后端查询、前端渲染和缓存命中证据",
      recorded: "瀑布图、后端日志、渲染画像、缓存复测和交付审查记录",
      pending: "换一个列表、仪表盘或 AI 对话场景继续迁移",
      nextTitle: "下一步怎么变成面试里的性能能力？",
      nextItems: [
        "把“页面慢”讲成时间花在资源、接口、数据库、渲染或缓存的哪一段。",
        "说明 Server-Timing、后端日志和前端画像各自能证明什么。",
        "用优化前后数据证明变快，同时说明缓存不会让用户看到旧数据。",
      ],
    },
    hints: [
      "先看 waterfall：JS 资源 96ms，不是主要瓶颈；/api/projects 的 TTFB 超过 1600ms。",
      "再看 backend.log：两次请求都是 cache=miss、dbRows=2500，还缺 Server-Timing。",
      "最后看 render-profile 和 cache-retest：接口返回后还有 1180ms 渲染卡顿，第二次访问仍然 MISS。",
    ],
    verificationStepId: "cache-retest",
    requiredResponseStepIds: [
      "waterfall-reading",
      "server-timing",
      "render-bottleneck",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "waterfall-reading",
        label: "读瀑布图",
        icon: Network,
        kind: "response",
        response: {
          title: "阶段 02 · 首屏时间账本",
          prompt: "先判断最长的等待发生在资源下载、TTFB 还是接口下载",
          placeholder:
            "瀑布图里 app.js 用时……/api/projects 的 TTFB 是……download 是……所以首要瓶颈更像……",
          minimum: 90,
          instruction:
            "不要只写“接口慢”。要引用 duration、TTFB、download 和 cache，说明每个数字代表哪一段时间。",
          artifactIds: ["waterfall"],
        },
      },
      {
        id: "server-timing",
        label: "查后端计时",
        icon: Server,
        kind: "response",
        response: {
          title: "阶段 03 · 后端迷雾灯",
          prompt: "用后端日志判断接口等待是不是数据库、缓存或应用逻辑造成",
          placeholder:
            "backend.log 里 req_perf_001 显示……req_perf_002 显示……缺少 Server-Timing 会导致前端无法区分……",
          minimum: 90,
          instruction:
            "把 Server-Timing 想成迷雾里的路牌：它要告诉浏览器 db/cache/app 分别花了多久。",
          artifactIds: ["waterfall", "logs"],
          flowStrip: [
            "Waterfall",
            "TTFB",
            "后端日志",
            "DB rows",
            "Server-Timing",
          ],
        },
      },
      {
        id: "render-bottleneck",
        label: "看渲染画像",
        icon: Clock3,
        kind: "response",
        response: {
          title: "阶段 04 · 舞台卡顿画像",
          prompt: "判断接口返回后，前端是否还因为渲染太多内容而卡住",
          placeholder:
            "render-profile 里 commitMs 是……renderedItems 是……longTasks 说明……所以不能只优化后端，因为……",
          minimum: 90,
          instruction:
            "仓库送货快，不代表舞台摆货快。必须区分接口等待和浏览器渲染卡顿。",
          artifactIds: ["render-profile"],
          rubricItems: [
            "commitMs 有多高",
            "一次渲染多少条",
            "long task 花在哪里",
            "前端和后端各自该怎么验收",
          ],
        },
      },
      {
        id: "cache-retest",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · 协作能力",
          prompt: "把性能排查任务交给 Agent，但先要求证据再要求方案",
          placeholder:
            "背景：项目列表首屏慢……\n现有证据：……\n目标：……\n不要只改：……\n验收：……\n风险：……",
          minimum: 110,
          instruction:
            "任务里必须包含 waterfall、Server-Timing、render-profile、cache-retest 和前后对比。不要只写“优化性能”。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 07 · 交付审查",
          prompt: "审查 Agent 的交付说明：哪些证据不足以证明页面真的变快？",
          placeholder:
            "改 loading 文案只能证明……手动打开能看到列表不能证明……还必须证明……",
          minimum: 90,
          artifactIds: ["delivery"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次性能瓶颈定位",
          placeholder:
            "我遇到的问题是项目列表首屏慢……我先看瀑布图……再看后端日志和渲染画像……最后用缓存复测证明……",
          minimum: 110,
          warning: {
            title: "这不是背性能名词",
            body: "面试官想听的是：你如何定位时间花在哪里、为什么选择这个优化、怎样证明没有引入旧数据问题。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 4 棒：接口数据 → 前端渲染",
        focus: "只看加载状态、接口耗时记录和一次性渲染项目列表的地方。",
        keyLines: [
          "fetch('/api/projects?includeStats=true')",
          "reportTiming('projects_api', ...)",
          "projects.map((project) => <ProjectCard ... />)",
        ],
        proves: "前端会等待接口，并可能一次性渲染过多项目。",
        cannotProve: "不能单独证明后端为什么慢，也不能证明缓存是否命中。",
      },
      "performance-service": {
        place: "第 3 棒：后端接口 → 数据库/缓存",
        focus:
          "只看 getProjectList 如何读取缓存、查询数据库和返回 Server-Timing。",
        keyLines: [
          "cache.get('projects:list')",
          "queryProjectsWithStats()",
          "serverTiming",
        ],
        proves: "当前服务端需要给出缓存命中、数据库耗时和响应计时证据。",
        cannotProve: "只看代码不能证明用户体感变快，仍要看前后耗时复测。",
      },
      waterfall: {
        place: "第 1/2 棒证据：浏览器时间账本",
        focus: "只看 app.js、/api/projects、TTFB、download 和 cache。",
        keyLines: [
          "app.js durationMs=96",
          "/api/projects ttfbMs=1640",
          "cache: MISS",
        ],
        proves: "主要等待不像资源下载，而是 /api/projects 的第一口响应太慢。",
        cannotProve: "不能单独判断慢在数据库还是业务逻辑，需要后端计时。",
      },
      logs: {
        place: "第 3 棒旁证：后端内部花了多久",
        focus:
          "只看 cache=miss、dbRows=2500、durationMs 和 Server-Timing 缺失。",
        keyLines: [
          "cache=miss dbRows=2500 durationMs=1638",
          "cache=miss dbRows=2500 durationMs=1619",
          "missing Server-Timing header",
        ],
        proves: "两次请求都查了大量数据且没有给前端拆分计时证据。",
        cannotProve: "日志不能证明渲染不卡，也不能证明缓存复测已经成功。",
      },
      "render-profile": {
        place: "第 4 棒证据：接口返回以后浏览器还在忙什么",
        focus: "只看 commitMs、renderedItems 和 longTasks。",
        keyLines: [
          "commitMs: 1180",
          "renderedItems: 2500",
          "render project rows durationMs=742",
        ],
        proves: "接口返回后仍有明显前端渲染卡顿。",
        cannotProve: "不能说明接口 TTFB 为什么高；它只证明前端也有瓶颈。",
      },
      "cache-retest": {
        place: "第 5 棒证据：优化后要复测第二次访问",
        focus:
          "只看 firstVisit、secondVisit 的 xCache、apiDurationMs 和 queryCount。",
        keyLines: [
          "firstVisit xCache=MISS duration=1672",
          "secondVisit xCache=MISS duration=1653",
          "databaseQueryCount: 2",
        ],
        proves: "当前第二次访问没有变快，缓存并没有真正命中。",
        cannotProve: "不能证明最终方案安全，需要修复后重新生成报告。",
      },
      delivery: {
        place: "交付审查：完成说明是否可信",
        focus: "只看它有没有覆盖 waterfall、缓存命中、渲染画像和前后对比。",
        keyLines: [
          "loading 文案和列表样式调整",
          "手动打开页面，能看到项目列表",
          "没有回答最长的是资源、TTFB，还是接口下载",
        ],
        proves: "这份说明只证明页面可见，没有证明性能瓶颈被定位和修复。",
        cannotProve: "Agent 说更顺滑不等于性能真的变快。",
      },
    },
  },
  [CASE07_SCENARIO_ID]: {
    scenarioId: CASE07_SCENARIO_ID,
    missionLabel: "主线 1-7 · AI 应用开发",
    missionTitle: "密钥金库",
    duration: "45-90 分钟 · 产出 AI API 安全接入复盘",
    backgroundImage: questPortal,
    flowAriaLabel: "AI 请求从用户输入到模型返回的安全路线",
    flowEyebrow: "本关路线",
    flowTitle: "模型熔炉要点火，但钥匙不能出现在舞台上",
    flowItems: [
      {
        label: "用户",
        title: "输入任务",
        detail: "先明确前端只收 prompt，不收密钥",
      },
      {
        label: "前端",
        title: "请求本地 API",
        detail: "Network 里只能看到 /api/ai/chat",
      },
      {
        label: "后端",
        title: "读取环境变量",
        detail: "API Key 留在服务端保险柜里",
      },
      {
        label: "AI Provider",
        title: "流式返回",
        detail: "上游要开启 stream，并处理限流超时",
      },
      {
        label: "失败兜底",
        title: "不泄露敏感信息",
        detail: "用户看得懂，日志能定位，密钥不出现",
      },
      {
        label: "面试表达",
        title: "讲安全边界",
        detail: "说明为什么服务端转发，以及如何验收",
      },
    ],
    baseline: {
      label: "密钥金库委托已领取",
      title: "先把“接 AI 接口”拆成一条安全通道",
      body: "这一关不是让页面能生成一句话就算完。你要证明密钥没有进入前端包和 Network，后端只从环境变量取 key，成功路径能流式返回，失败路径有结构化兜底且不泄露敏感信息。",
      action: "进入模型熔炉",
    },
    practical: {
      title: "在密钥金库沙盒里修复 AI API 接入边界",
      sandboxPath: "sandbox/ai-api-key-vault",
      statusPassed:
        "密钥扫描、服务端环境变量、流式响应和上游失败兜底都有测试证据。",
      statusFailed:
        "失败报告会指出：前端密钥、服务端 key 来源、stream 或错误兜底哪里还没有成立。",
    },
    result: {
      label: "AI API 安全接入闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次 AI 接口安全接入",
      body: (hintLevel) =>
        `你证明了前端、后端、模型服务和失败兜底之间的边界：密钥不出现在浏览器，后端统一调用上游，流式体验和失败路径都可测试。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "前端不暴露 API Key，后端只用环境变量，成功和失败路径都有证据",
      recorded:
        "密钥扫描、Network 请求、stream trace、provider error、后端日志和交付审查记录",
      pending: "换一个真实 AI 功能继续验证权限、限流、超时和成本边界",
      nextTitle: "下一步怎么变成面试里的 AI 工程能力？",
      nextItems: [
        "把“接了 AI API”讲成前端、本地后端、环境变量、AI Provider 和流式 UI 的链路。",
        "说明为什么 VITE_ 公开变量、前端 Authorization 和浏览器传 apiKey 都不可信。",
        "用前端扫描、Network、后端日志和失败测试证明密钥安全与兜底边界。",
      ],
    },
    hints: [
      "先看前端扫描：`sk-demo-leaked-key-in-browser` 和 Authorization 都出现在浏览器可见代码里。",
      "再看后端：当前 `request.body?.apiKey || env.AI_API_KEY` 会信任浏览器传来的 key。",
      "最后看 stream-trace 和 provider-error：成功路径 stream=false，失败响应和日志还可能泄露敏感调试信息。",
    ],
    verificationStepId: "streaming-response",
    requiredResponseStepIds: [
      "frontend-secret-scan",
      "server-env-key",
      "failure-fallback",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "frontend-secret-scan",
        label: "查前端泄露",
        icon: LockKeyhole,
        kind: "response",
        response: {
          title: "阶段 02 · 城门口的钥匙",
          prompt: "证明浏览器前端是否暴露了 AI API Key 或第三方 Authorization",
          placeholder:
            "frontend-bundle-scan 发现……Network 里出现……这说明前端用户可以……所以第一处边界应该改成……",
          minimum: 90,
          instruction:
            "不要只写“有安全问题”。要指出密钥在哪个文件、哪个请求、为什么浏览器用户能拿到。",
          artifactIds: ["bundle-scan", "network", "frontend"],
        },
      },
      {
        id: "server-env-key",
        label: "守服务端保险柜",
        icon: Server,
        kind: "response",
        response: {
          title: "阶段 03 · 服务端钥匙匣",
          prompt: "判断后端到底用了谁给的 key：浏览器传来的，还是环境变量里的",
          placeholder:
            "aiGateway.js 现在先看……这会导致……正确边界是……缺少 AI_API_KEY 时应该返回……",
          minimum: 90,
          instruction:
            "把环境变量想成后台保险柜：代码可以知道保险柜名字，但不能让浏览器递钥匙。",
          artifactIds: ["gateway", "logs"],
          flowStrip: [
            "前端 prompt",
            "/api/ai/chat",
            "env.AI_API_KEY",
            "AI Provider",
            "结构化错误",
          ],
        },
      },
      {
        id: "streaming-response",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "failure-fallback",
        label: "验失败兜底",
        icon: AlertTriangle,
        kind: "response",
        response: {
          title: "阶段 05 · 熔炉熄火时怎么退场",
          prompt:
            "用 provider-error 和后端日志说明上游失败时该给用户什么、给工程师什么",
          placeholder:
            "provider-error 里上游状态是……用户应该看到……日志应该保留 requestId……但不能出现……",
          minimum: 90,
          instruction:
            "失败兜底不是吞错误，也不是把上游原文吐给用户；它要同时照顾用户体验和工程排查。",
          artifactIds: ["provider-error", "logs"],
          rubricItems: [
            "用户看到的结构化错误 code",
            "后端日志保留 requestId",
            "响应和日志都不泄露 key",
            "限流、超时和缺 key 的区别",
          ],
        },
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · 协作能力",
          prompt: "把 AI API 接入任务交给 Agent，但明确安全边界和验收证据",
          placeholder:
            "背景：模型熔炉要接 AI 生成……\n安全约束：……\n需要修改：……\n验收证据：……\n失败路径：……\n不要做：……",
          minimum: 110,
          instruction:
            "任务里必须写明：密钥不得进前端、后端只读环境变量、成功要 stream、失败要结构化且不泄露敏感信息。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 07 · 交付审查",
          prompt: "审查 Agent 的交付说明：哪些说法不足以证明 AI API 接入安全？",
          placeholder:
            "说“能生成文本”只能证明……没有前端扫描不能证明……没有 provider-error 不能证明……我会拒收因为……",
          minimum: 90,
          artifactIds: ["delivery"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次 AI API 安全接入和故障兜底",
          placeholder:
            "我接入 AI API 时，先把密钥边界收回到服务端……前端只请求……后端读取……成功路径……失败路径……最后用……证明安全和可用。",
          minimum: 110,
          warning: {
            title: "这不是背一个“密钥不能暴露”",
            body: "面试官想听的是：你知道密钥为什么不能在前端、后端转发带来什么边界、stream 和失败兜底如何验收。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 1 棒：用户输入 → 前端请求",
        focus: "只看 demoApiKey、Authorization、请求 URL 和 body 里的 apiKey。",
        keyLines: [
          "const demoApiKey = 'sk-demo-leaked-key-in-browser'",
          "fetch('https://api.example.ai/v1/chat'",
          "Authorization: `Bearer ${demoApiKey}`",
          "apiKey: demoApiKey",
        ],
        proves: "当前前端把密钥和第三方调用细节暴露给浏览器用户。",
        cannotProve: "不能证明后端已经安全转发，也不能证明失败兜底正确。",
      },
      gateway: {
        place: "第 2/3 棒：本地 API → 服务端钥匙匣 → AI Provider",
        focus:
          "只看 apiKey 来源、provider.complete 的 stream 参数，以及失败时返回什么。",
        keyLines: [
          "request.body?.apiKey || env.AI_API_KEY",
          "stream: false",
          "debug: { apiKey, providerStatus, providerBody }",
        ],
        proves: "后端当前信任浏览器传来的 key，且成功/失败路径都没有守住边界。",
        cannotProve:
          "代码片段不能证明前端包无泄露，仍要配合扫描和 Network 证据。",
      },
      "bundle-scan": {
        place: "第 1 棒证据：浏览器能拿到什么",
        focus: "只看 findings 里的 sk-demo、Authorization 和 apiKey。",
        keyLines: [
          "sk-demo-leaked-key-in-browser",
          "Authorization header found in frontend bundle",
          "apiKey field present in browser request",
        ],
        proves: "密钥风险已经进入前端可见范围。",
        cannotProve: "不能证明后端是否正确读取环境变量。",
      },
      network: {
        place: "第 1/2 棒证据：Network 请求是否绕过后端",
        focus: "只看 requestUrl、headers、body 和 stream。",
        keyLines: [
          "https://api.example.ai/v1/chat",
          "Authorization: Bearer sk-demo...",
          "stream: false",
        ],
        proves: "浏览器直接请求第三方 AI API，且请求中带有敏感字段。",
        cannotProve: "不能说明上游失败时后端如何兜底，因为请求绕过了后端。",
      },
      "stream-trace": {
        place: "第 4 棒证据：成功路径是否能一段段返回",
        focus: "只看 contentType、chunks、providerCall.stream。",
        keyLines: [
          "contentType: text/event-stream",
          "providerCall.stream: false",
          "chunks: []",
        ],
        proves: "当前实现没有真正开启可验证的流式响应。",
        cannotProve:
          "不能证明密钥是否泄露；它只证明用户等待体验和 provider 参数问题。",
      },
      "provider-error": {
        place: "第 5 棒证据：上游失败时是否安全退场",
        focus: "只看 status、body.debug、expected 和密钥泄露风险。",
        keyLines: [
          "providerStatus: 429",
          "debug.apiKey",
          "expected: AI_PROVIDER_FAILED",
        ],
        proves: "失败路径当前会把内部调试信息暴露给前端。",
        cannotProve: "不能证明成功路径可流式，也不能证明前端包已清理。",
      },
      logs: {
        place: "第 5 棒旁证：工程师如何定位失败",
        focus: "只看 requestId、provider status 和是否打印 apiKey。",
        keyLines: [
          "requestId=req_ai_004",
          "provider=429",
          "apiKey=sk-server-only-key",
        ],
        proves: "日志当前有定位线索，但也可能泄露密钥。",
        cannotProve: "日志不能代替用户可见错误提示，也不能证明前端无泄露。",
      },
      delivery: {
        place: "交付审查：能生成文本是否等于完成",
        focus: "只看它有没有覆盖密钥扫描、服务端 key、stream 和失败兜底。",
        keyLines: [
          "已经接入 AI 生成能力",
          "没有提供前端包扫描结果",
          "没有验证失败路径不泄露密钥",
        ],
        proves: "这份说明只能证明功能表面可用，不能证明 AI API 接入可信。",
        cannotProve:
          "Agent 说接入完成不等于安全边界、失败路径和流式体验都成立。",
      },
    },
  },
  [CASE08_SCENARIO_ID]: {
    scenarioId: CASE08_SCENARIO_ID,
    missionLabel: "主线 1-8 · AI 应用开发",
    missionTitle: "幻觉镜厅",
    duration: "45-90 分钟 · 产出可验证 AI 输出复盘",
    backgroundImage: questArchive,
    flowAriaLabel: "AI 回答从用户问题到引用校验的可验证路线",
    flowEyebrow: "本关路线",
    flowTitle: "镜子说得再顺，也要能指出每句话来自哪份资料",
    flowItems: [
      {
        label: "用户",
        title: "提出问题",
        detail: "先判断问题是否需要项目资料支撑",
      },
      {
        label: "Prompt",
        title: "写回答边界",
        detail: "只根据 context，必须带 citation",
      },
      {
        label: "上下文",
        title: "交出资料袋",
        detail: "模型只能使用本轮 chunk id",
      },
      {
        label: "模型回答",
        title: "输出答案和引用",
        detail: "顺畅不等于可信，要看引用是否存在",
      },
      {
        label: "引用校验",
        title: "拦住编造来源",
        detail: "无效引用或无资料时明确拒答",
      },
      {
        label: "面试表达",
        title: "讲可信输出",
        detail: "说明为什么不能盲信 AI 回答",
      },
    ],
    baseline: {
      label: "幻觉镜厅委托已领取",
      title: "先把“AI 胡说”翻译成可验证输出问题",
      body: "这一关不接受一句“Prompt 写好一点”。你要证明回答是否只来自本轮资料、引用是否真实存在、无资料时是否拒答，以及前端有没有把低置信和来源展示给用户。",
      action: "进入幻觉镜厅",
    },
    practical: {
      title: "在幻觉镜厅沙盒里修复可验证回答链路",
      sandboxPath: "sandbox/hallucination-mirror-hall",
      statusPassed:
        "Prompt 约束、上下文边界、引用校验和无资料拒答都有测试证据。",
      statusFailed:
        "失败报告会指出：Prompt 边界、citation 校验、无资料拒答或来源展示哪里还没有成立。",
    },
    result: {
      label: "可验证 AI 输出闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次幻觉控制设计",
      body: (hintLevel) =>
        `你证明了 AI 回答不是“看起来像对”就能上线：Prompt 要写清资料范围，context 要带来源 id，引用要经过服务端校验，无资料时要低置信拒答。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "模型输出被限制在本轮资料内，无效引用和无资料硬答会被拦截",
      recorded:
        "Prompt 合约、context chunks、编造引用反例、无资料反例、Network、日志和交付审查记录",
      pending: "换一个 RAG、客服问答或项目助手场景继续验证来源、引用和拒答边界",
      nextTitle: "下一步怎么变成面试里的 AI 工程能力？",
      nextItems: [
        "把“AI 胡说”讲成 Prompt、context、model answer、citation verifier、前端提示之间的链路。",
        "说明为什么引用 id 必须来自本轮资料，不能只相信模型自己写的 citations。",
        "用有资料和无资料两组反例证明系统知道什么时候回答、什么时候拒答。",
      ],
    },
    hints: [
      "先看 context-chunks：资料只提到 Project Brief 目标和会话保存，没有任何自动发布信息。",
      "再看 model-answer-unsupported：模型给出 deploy#auto，但这个 citation 不在本轮 context 里。",
      "最后看 no-context-answer 和 backend.log：没有资料时仍然硬答，日志也显示 verifier=skipped。",
    ],
    verificationStepId: "citation-verification",
    requiredResponseStepIds: [
      "prompt-contract",
      "context-boundary",
      "refusal-policy",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "prompt-contract",
        label: "查 Prompt 合约",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 02 · 镜厅委托书",
          prompt: "判断 Prompt 是否写清资料范围、引用要求和拒答条件",
          placeholder:
            "groundedAnswer.js 现在的 system prompt 是……它没有要求……这会导致模型……正确合约应该包含……",
          minimum: 90,
          instruction:
            "不要只写“Prompt 不好”。要指出缺少资料范围、citation、UNKNOWN/资料不足这三个边界里的哪几个。",
          artifactIds: ["grounded-answer"],
        },
      },
      {
        id: "context-boundary",
        label: "核对资料袋",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 03 · 上下文资料袋",
          prompt: "用本轮 context 判断“自动发布到线上”有没有资料依据",
          placeholder:
            "context-chunks 里只有……没有……所以模型关于自动发布的回答属于……",
          minimum: 90,
          instruction:
            "把 context 当成案件资料袋：资料袋没有的内容，模型说得再顺也不能盖章。",
          artifactIds: ["context", "network"],
          flowStrip: [
            "用户问题",
            "context chunks",
            "模型回答",
            "citation id",
            "引用校验",
          ],
        },
      },
      {
        id: "citation-verification",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "refusal-policy",
        label: "验拒答边界",
        icon: HelpCircle,
        kind: "response",
        response: {
          title: "阶段 05 · 拒答不是失败",
          prompt: "用编造引用和无资料硬答两个反例说明系统应该如何拒答",
          placeholder:
            "unsupported-answer 里的 citation 是……allowedCitationCount 是……no-context-answer 说明……所以正确返回应该是……",
          minimum: 90,
          instruction:
            "拒答边界要同时看答案、citations、confidence 和用户提示，不是只把文案改温柔。",
          artifactIds: ["unsupported-answer", "no-context-answer", "logs"],
          rubricItems: [
            "无效 citation 是否被清空",
            "confidence 是否降为 low",
            "无资料时是否说明需要补充资料",
            "日志是否记录 verifier 或 requestId",
          ],
        },
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · 协作能力",
          prompt: "把幻觉控制任务交给 Agent，但要求它先补反例测试再改 Prompt",
          placeholder:
            "背景：AI 会编造项目能力……\n现有证据：……\n需要修改：……\n验收反例：……\n不要只做：……\n交付说明必须包含：……",
          minimum: 110,
          instruction:
            "任务里必须包含 context 为空、citation 不存在、有效 citation 三类测试；不要只写“优化 Prompt”。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 07 · 交付审查",
          prompt:
            "审查 Agent 的交付说明：为什么“AI 能回答中文”不足以证明可信？",
          placeholder:
            "能回答中文只能证明……没有 context 测试不能证明……没有 citation 校验不能证明……我会拒收因为……",
          minimum: 90,
          artifactIds: ["delivery"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次可验证 AI 输出设计",
          placeholder:
            "我遇到的问题是 AI 回答会编造项目能力……我先限定 Prompt……再检查 context 和 citation……最后用无资料反例证明……",
          minimum: 110,
          warning: {
            title: "这不是背一个“AI 会幻觉”",
            body: "面试官想听的是：你如何设计来源、校验和拒答，让 AI 输出从好听变成可信。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 5 棒：校验结果 → 前端提示",
        focus: "只看 answer、confidence 和 sources/citations 是否展示给用户。",
        keyLines: [
          "setAnswer(body)",
          "<p>{answer.answer}</p>",
          "置信度：{answer.confidence || 'unknown'}",
        ],
        proves:
          "前端当前能显示答案和置信度，但没有清楚展示引用来源或资料不足提示。",
        cannotProve:
          "不能证明模型回答有依据，也不能证明服务端校验过 citation。",
      },
      "grounded-answer": {
        place: "第 2/5 棒：Prompt 合约 → 引用校验",
        focus:
          "只看 buildGroundedPrompt、validateGroundedAnswer 和 answerQuestion。",
        keyLines: [
          "请尽量回答用户问题",
          "context: contextChunks.map((chunk) => chunk.text).join('\\n')",
          "allowedCitationCount",
        ],
        proves:
          "当前 Prompt 太宽，校验器只统计有效引用数量，没有拦截无效引用。",
        cannotProve:
          "代码片段不能证明真实问题下不会胡说，仍要看反例测试和 Network。",
      },
      context: {
        place: "第 3 棒证据：本轮资料袋里到底有什么",
        focus: "只看 question、chunks 的 id/title/text 和 observation。",
        keyLines: ["brief#goal", "brief#save", "没有任何自动发布信息"],
        proves: "本轮资料没有支持“自动发布到线上”的证据。",
        cannotProve: "不能单独证明模型不会编造；还要看模型输出和引用校验。",
      },
      "unsupported-answer": {
        place: "第 4/5 棒证据：模型编造了哪个引用",
        focus:
          "只看 rawModelAnswer、citations、expectedVerifierAction 和 risk。",
        keyLines: [
          "CanvasStorm 会在用户接受候选方向后自动发布到线上",
          "citations: ['deploy#auto']",
          "deploy#auto 不在本轮 context 里",
        ],
        proves: "模型输出看起来顺，但 citation id 是编造的。",
        cannotProve: "不能证明无资料场景是否拒答，需要看 no-context 反例。",
      },
      "no-context-answer": {
        place: "拒答边界证据：资料袋为空时能不能硬答",
        focus: "只看 contextChunks、currentAnswer 和 expected。",
        keyLines: [
          "contextChunks: []",
          "系统已经支持自动发布",
          "资料不足，无法确认",
        ],
        proves: "没有资料时当前仍然给 high confidence 硬答。",
        cannotProve: "不能证明有效资料时会保留引用，需要看有效 citation 测试。",
      },
      network: {
        place: "用户可见证据：接口返回了什么",
        focus:
          "只看 request question、response citations、confidence 和 allowedCitationCount。",
        keyLines: [
          "/api/ai/grounded-answer",
          "citations: ['deploy#auto']",
          "allowedCitationCount: 0",
        ],
        proves: "响应自己暴露出引用不被允许，却仍然 high confidence 展示。",
        cannotProve: "不能证明 Prompt 已修复；它只是当前错误链路的证据。",
      },
      logs: {
        place: "后端旁证：校验有没有真的执行",
        focus: "只看 verifier、allowed=false 和 contextChunks=0。",
        keyLines: [
          "verifier=skipped",
          "citation=deploy#auto allowed=false action=still-returned",
          "contextChunks=0 action=model-called",
        ],
        proves: "后端知道引用不被允许，却没有拦住；无资料时还调用了模型。",
        cannotProve: "日志不能代替前端提示，也不能证明用户看见了拒答边界。",
      },
      delivery: {
        place: "交付审查：Prompt 优化是否真的可信",
        focus: "只看它有没有覆盖 context、citation、无资料和反例测试。",
        keyLines: [
          "请准确回答",
          "手动问了一个问题",
          "没有证明 citation 是否真的来自本轮 context",
        ],
        proves: "这份说明只证明模型能输出答案，没有证明答案可信。",
        cannotProve: "Agent 说优化 Prompt 不等于有来源、可校验、会拒答。",
      },
    },
  },
  [CASE09_SCENARIO_ID]: {
    scenarioId: CASE09_SCENARIO_ID,
    missionLabel: "主线 1-9 · AI 应用开发",
    missionTitle: "知识迷宫",
    duration: "45-90 分钟 · 产出 RAG 检索证据复盘",
    backgroundImage: questArchive,
    flowAriaLabel: "RAG 资料从文档进入回答的证据路线",
    flowEyebrow: "本关路线",
    flowTitle: "AI 不是凭空知道资料，它要先在迷宫里找到正确书页",
    flowItems: [
      {
        label: "原始文档",
        title: "进入知识库",
        detail: "先确认资料有标题、路径和正文",
      },
      {
        label: "Chunk",
        title: "切成可引用片段",
        detail: "每段都要保留稳定 id 和 sourcePath",
      },
      {
        label: "Embedding",
        title: "变成可检索线索",
        detail: "问题和片段要能按语义匹配",
      },
      {
        label: "topK",
        title: "取出命中资料",
        detail: "分数最高不代表一定正确，要看问题是否匹配",
      },
      {
        label: "模型回答",
        title: "带证据作答",
        detail: "answer、matches、citations 必须互相对得上",
      },
      {
        label: "面试表达",
        title: "讲 RAG 证据链",
        detail: "说明资料如何被找出、引用和拒答",
      },
    ],
    baseline: {
      label: "知识迷宫委托已领取",
      title: "先把“接入 RAG”翻译成检索证据问题",
      body: "这一关不接受一句“已经有知识库”。你要证明资料有没有带来源、chunk 是否可引用、topK 是否命中正确资料、回答有没有展示 matches/citations，以及无关问题是否拒答。",
      action: "进入知识迷宫",
    },
    practical: {
      title: "在知识迷宫沙盒里修复 RAG 检索链路",
      sandboxPath: "sandbox/rag-knowledge-maze",
      statusPassed:
        "chunk 来源、topK 命中、回答引用和无关问题拒答都有测试证据。",
      statusFailed:
        "失败报告会指出：chunk 索引、检索命中、引用展示或未命中拒答哪里还没有成立。",
    },
    result: {
      label: "RAG 检索证据闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次知识库问答排障",
      body: (hintLevel) =>
        `你证明了 RAG 不是“把资料丢给 AI”：文档要切成带来源的 chunk，检索要按问题命中 topK，回答要展示 matches 和 citations，未命中时要低置信拒答。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "资料能从 source docs 进入 chunk 索引、检索命中和最终引用",
      recorded:
        "原始文档、错误 chunk 索引、检索错配反例、Network 响应、后端日志和交付审查记录",
      pending:
        "换一个客服知识库、项目文档助手或简历问答场景继续验证检索命中与引用边界",
      nextTitle: "下一步怎么变成面试里的 RAG 工程能力？",
      nextItems: [
        "把 RAG 讲成 source docs、chunk、embedding/search、topK、citations 的证据路线。",
        "说明为什么 topK 命中错了，模型回答再顺也不能算可信。",
        "用无关问题或低分命中证明系统知道什么时候不回答。",
      ],
    },
    hints: [
      "先看 source-docs：每份资料原本都有 id、path、title 和 text，切 chunk 时这些来源不能丢。",
      "再看 search-miss：问 Project Brief 时，top1 却是登录资料，说明检索不是按语义命中。",
      "最后看 network 和 backend.log：响应没有 matches/citations，日志显示 strategy=slice-first。",
    ],
    verificationStepId: "citation-grounding",
    requiredResponseStepIds: [
      "chunk-indexing",
      "embedding-search",
      "topk-evidence",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "chunk-indexing",
        label: "查资料来源",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 知识库入口",
          prompt: "判断原始文档进入 chunk 后丢了哪些来源证据",
          placeholder:
            "source-docs 里每份资料原本有……但 chunk-index 只保留了……这会导致用户无法……",
          minimum: 90,
          instruction:
            "不要只写“chunk 有问题”。要明确 id、title、sourcePath 和原文片段分别能证明什么。",
          artifactIds: ["source-docs", "chunk-index"],
          flowStrip: [
            "source docs",
            "splitIntoChunks",
            "chunk id",
            "sourcePath",
            "citation",
          ],
        },
      },
      {
        id: "embedding-search",
        label: "看检索策略",
        icon: Network,
        kind: "response",
        response: {
          title: "阶段 03 · 检索不是取前三条",
          prompt: "用 search-miss 解释为什么 Brief 问题命中了登录资料",
          placeholder:
            "问题是……当前 top1 是……expectedTop1 是……说明 searchTopK 现在只是……正确策略应该……",
          minimum: 90,
          instruction:
            "把 topK 当成迷宫寻路：第一名必须和问题语义相关，不是数组前几项。",
          artifactIds: ["search-miss", "rag-engine"],
          rubricItems: [
            "是否指出 slice-first",
            "是否比较 currentMatches 和 expectedTop1",
            "是否说明 score 的意义",
            "是否提出复测问题",
          ],
        },
      },
      {
        id: "topk-evidence",
        label: "核对命中证据",
        icon: Database,
        kind: "response",
        response: {
          title: "阶段 04 · 命中资料要给用户看见",
          prompt: "审查 Network 响应为什么不能证明 RAG 可信",
          placeholder:
            "Network 返回了 answer，但 citations 是……matches 是……所以用户不能知道……正确响应应该包含……",
          minimum: 90,
          instruction:
            "RAG 的用户体验不是只显示答案，还要显示命中片段、score 和来源路径。",
          artifactIds: ["network", "frontend"],
          flowStrip: [
            "question",
            "topK matches",
            "score",
            "citations",
            "前端来源展示",
          ],
        },
      },
      {
        id: "citation-grounding",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · RAG 任务委托",
          prompt: "把知识库修复任务交给 Agent，但要求它先补检索反例测试",
          placeholder:
            "背景：RAG 当前直接取前几个 chunk……\n现有证据：……\n需要修改：……\n验收反例：……\n不要只做：……\n交付说明必须包含：……",
          minimum: 110,
          instruction:
            "任务必须覆盖 chunk 来源、Brief 问题 top1、无关问题拒答、前端 matches/citations 展示。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 07 · 拒收空泛 RAG 交付",
          prompt:
            "审查 Agent 的交付说明：为什么“页面返回中文回答”不足以证明 RAG 完成？",
          placeholder:
            "中文回答只能证明……没有 chunk 来源不能证明……没有 topK 反例不能证明……没有 citations 展示不能证明……我会拒收因为……",
          minimum: 100,
          artifactIds: ["delivery", "logs"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次 RAG 知识库问答排障",
          placeholder:
            "我遇到的问题是 RAG 回答看似有答案但来源不可追……我先检查 source docs 和 chunk……再验证 topK 命中……最后用 Network 和日志证明……",
          minimum: 110,
          warning: {
            title: "这不是背一个“RAG = 检索增强”",
            body: "面试官想听的是：你如何证明资料真的被找出来、带进回答、展示来源，并在找不到资料时拒答。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 5 棒：RAG 响应 → 用户看见来源",
        focus: "只看 answer、matches、citations 有没有展示给用户。",
        keyLines: [
          "setAnswer(body.answer)",
          "<p>{answer}</p>",
          "没有渲染 matches/sourcePath",
        ],
        proves: "前端当前能显示回答文本，但用户看不到命中资料、score 或来源。",
        cannotProve:
          "不能证明检索命中正确，也不能证明 citations 来自本次 matches。",
      },
      "rag-engine": {
        place: "第 2/5 棒：文档切分 → 检索 → 回答拼接",
        focus: "只看 splitIntoChunks、searchTopK 和 answerWithSources。",
        keyLines: [
          "document.text.slice(index, index + 120)",
          "index.slice(0, topK)",
          "citations: [], matches: []",
        ],
        proves:
          "当前 chunk 丢了来源，检索只是取前几条，最终回答没有 matches/citations。",
        cannotProve:
          "代码片段不能证明用户问题下真实命中情况，仍要看 search-miss、Network 和日志。",
      },
      "source-docs": {
        place: "第 1 棒证据：知识库原始资料",
        focus: "只看 documents 的 id、path、title 和 text。",
        keyLines: ["docs/login.md", "docs/project-brief.md", "docs/rag.md"],
        proves: "原始资料本来有可追溯来源，后续 chunk 应该继承这些字段。",
        cannotProve: "不能证明检索命中正确；它只证明资料源头存在。",
      },
      "chunk-index": {
        place: "第 2 棒证据：chunk 是否保留来源",
        focus: "只看 id、text、missing 和 observation。",
        keyLines: [
          "missing: ['sourcePath', 'title', 'stable citation id']",
          "doc-login-1",
          "doc-brief-1",
        ],
        proves: "当前索引能保存文字，但丢掉了用户最需要的来源证据。",
        cannotProve: "不能证明 searchTopK 会命中正确资料，还要看检索反例。",
      },
      "search-miss": {
        place: "第 3/4 棒证据：topK 是否命中问题相关资料",
        focus: "只看 question、currentMatches 和 expectedTop1。",
        keyLines: [
          "Project Brief 需要包含哪些内容？",
          "currentMatches[0].id: doc-login-1",
          "expectedTop1: doc-brief#chunk-1",
        ],
        proves: "Brief 问题当前先命中登录资料，说明检索策略不可信。",
        cannotProve: "不能单独证明前端是否展示来源；要看 Network 和 UI。",
      },
      network: {
        place: "用户可见证据：RAG 接口返回了什么",
        focus: "只看 question、answer、citations、matches 和 observation。",
        keyLines: ["/api/rag/answer", "citations: []", "matches: []"],
        proves: "用户拿到回答文本，但没有任何命中资料或引用来源。",
        cannotProve: "不能证明 chunk 是否保留来源；它只证明当前响应不透明。",
      },
      logs: {
        place: "后端旁证：为什么命中错了",
        focus: "只看 strategy、topK、top1 和 expected。",
        keyLines: [
          "strategy=slice-first",
          "top1=doc-login-1",
          "expected=doc-brief#chunk-1",
        ],
        proves: "后端日志直接暴露检索策略和 top1 错配。",
        cannotProve: "日志不能代替用户可见来源展示，也不能证明修复已完成。",
      },
      delivery: {
        place: "交付审查：RAG 能回答是否等于完成",
        focus: "只看它有没有覆盖 chunk 来源、topK、citations 和未命中拒答。",
        keyLines: [
          "页面可以展示回答文本",
          "没有证明四件事",
          "最终 citations 是否来自本次 matches",
        ],
        proves: "这份说明只证明功能表面可用，不能证明检索增强可信。",
        cannotProve: "Agent 说接入 RAG 不等于来源、命中和拒答边界成立。",
      },
    },
  },
  [CASE10_SCENARIO_ID]: {
    scenarioId: CASE10_SCENARIO_ID,
    missionLabel: "主线 1-10 · AI 应用开发",
    missionTitle: "工具契约大厅",
    duration: "45-90 分钟 · 产出 Agent 工具边界复盘",
    backgroundImage: questPortal,
    flowAriaLabel: "Agent 工具从计划到受控执行的安全路线",
    flowEyebrow: "本关路线",
    flowTitle: "副官能开门，但每把钥匙都要登记、校验和审计",
    flowItems: [
      {
        label: "用户目标",
        title: "提出要做的事",
        detail: "先判断是查资料、改状态还是危险动作",
      },
      {
        label: "Agent 计划",
        title: "选择工具",
        detail: "只能从 tool registry 里挑已注册能力",
      },
      {
        label: "参数 schema",
        title: "检查输入",
        detail: "缺字段、错类型、非法枚举都要拦住",
      },
      {
        label: "权限门禁",
        title: "判断能不能执行",
        detail: "只读用户不能调用写入工具",
      },
      {
        label: "工具执行",
        title: "成功或失败回退",
        detail: "失败要结构化返回，不泄露内部错误",
      },
      {
        label: "审计复盘",
        title: "留下证据",
        detail: "requestId、toolName、结果和风险要能追踪",
      },
    ],
    baseline: {
      label: "工具契约委托已领取",
      title: "先把“让 Agent 做事”翻译成工具边界问题",
      body: "这一关不接受一句“Agent 已经能调用工具”。你要证明工具是否注册清楚、参数是否按 schema 校验、用户权限是否足够、失败是否有结构化回退，以及合法调用是否留下审计日志。",
      action: "进入工具契约大厅",
    },
    practical: {
      title: "在 Agent 高塔沙盒里修复工具调用边界",
      sandboxPath: "sandbox/agent-tool-tower",
      statusPassed:
        "工具注册、schema 校验、权限拒绝、失败回退和审计日志都有测试证据。",
      statusFailed:
        "失败报告会指出：工具注册表、参数校验、权限门禁、失败回退或审计日志哪里还没有成立。",
    },
    result: {
      label: "Agent 工具边界闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次受控 Agent 工具设计",
      body: (hintLevel) =>
        `你证明了 Agent 不是“想做什么就做什么”：工具必须先注册，参数要按 schema 校验，权限不足要拒绝，工具失败要结构化回退，成功和失败都要留下审计线索。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "Agent 工具调用经过注册、schema、权限、失败回退和审计日志",
      recorded:
        "工具注册表、非法枚举 Network、越权调用反例、工具失败反例、后端日志和交付审查记录",
      pending: "换一个查库、发请求或写文件工具场景继续验证越权、失败和审计边界",
      nextTitle: "下一步怎么变成面试里的 Agent 工程能力？",
      nextItems: [
        "把 Agent 工具调用讲成 tool registry、schema validation、permission gate、executor、audit log 的链路。",
        "说明为什么非法 status=shipped、只读用户写入和 database error 都不能直接放行给用户。",
        "用合法调用、非法参数、权限不足和工具失败四组反例证明边界可信。",
      ],
    },
    hints: [
      "先看 tool-registry：searchProjectDocs 是只读工具，updateProjectStatus 是写入工具，风险等级不同。",
      "再看 network-tool-call：status=shipped 不在允许枚举里，却仍然 ok=true。",
      "最后看 permission-denied、tool-failure 和 backend.log：权限检查被跳过，内部错误也被直接泄露给前端。",
    ],
    verificationStepId: "failure-fallback",
    requiredResponseStepIds: [
      "tool-registry",
      "schema-validation",
      "permission-check",
      "failure-review",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "tool-registry",
        label: "查工具注册表",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 工具钥匙登记册",
          prompt: "判断 tool registry 是否写清工具能力、参数和权限边界",
          placeholder:
            "searchProjectDocs 是……权限是……updateProjectStatus 是……权限是……风险在于……",
          minimum: 90,
          instruction:
            "不要只写“有工具”。要区分只读工具和写入工具，并说明 description、schema、permission 分别证明什么。",
          artifactIds: ["registry", "tool-executor"],
          flowStrip: [
            "toolName",
            "toolRegistry",
            "description",
            "schema",
            "permission",
          ],
        },
      },
      {
        id: "schema-validation",
        label: "验参数契约",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 03 · 参数不是随便传",
          prompt: "用 Network 记录解释为什么 status=shipped 不应该执行成功",
          placeholder:
            "请求调用了……args.status 是……schema 允许的是……当前返回 ok=true 说明……正确行为应该……",
          minimum: 90,
          instruction:
            "schema 要能拦缺字段、错类型、非法枚举；这里重点看 status 枚举和 ok=true 的矛盾。",
          artifactIds: ["network", "tool-executor"],
          rubricItems: [
            "是否指出 status=shipped 非法",
            "是否引用 schema 允许值",
            "是否说明 ok=true 的风险",
            "是否提出 INVALID_ARGS 类错误",
          ],
        },
      },
      {
        id: "permission-check",
        label: "守权限门禁",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 04 · 只读用户不能改项目",
          prompt: "用越权反例说明为什么工具执行前必须检查用户权限",
          placeholder:
            "user_apprentice 只有……但调用了……需要的权限是……当前结果是……正确应该返回……",
          minimum: 90,
          instruction:
            "权限不是靠 Agent 自觉。执行 updateProjectStatus 前必须检查 context.user.permissions。",
          artifactIds: ["permission", "registry", "logs"],
          flowStrip: [
            "user.permissions",
            "tool.permission",
            "permission gate",
            "execute",
            "audit log",
          ],
        },
      },
      {
        id: "failure-fallback",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "failure-review",
        label: "看失败回退",
        icon: AlertTriangle,
        kind: "response",
        response: {
          title: "阶段 05 · 工具失败不能泄露内部错误",
          prompt:
            "用 tool-failure 说明为什么 database connection refused 不能直接给用户",
          placeholder:
            "project_fail 触发了……当前 error 暴露了……正确响应应该包含 code、requestId 和……日志应该记录……",
          minimum: 90,
          instruction:
            "失败回退要同时保护用户体验和内部细节：用户看到可行动提示，工程师用 requestId 查日志。",
          artifactIds: ["failure", "logs", "frontend"],
          rubricItems: [
            "是否隐藏内部错误",
            "是否返回 TOOL_FAILED",
            "是否带 requestId",
            "是否说明用户下一步",
          ],
        },
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · 工具边界任务委托",
          prompt: "把 Agent 工具修复任务交给 Agent，但要求它先补四类反例测试",
          placeholder:
            "背景：Agent 工具当前绕过 schema 和权限……\n现有证据：……\n需要修改：……\n验收反例：……\n不要只做：……\n交付说明必须包含：……",
          minimum: 120,
          instruction:
            "任务必须覆盖非法参数、权限不足、工具失败、合法调用审计四类测试；不要只写“增强安全”。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 07 · 拒收无边界工具交付",
          prompt:
            "审查 Agent 的交付说明：为什么“按钮能触发工具”不足以证明完成？",
          placeholder:
            "按钮能触发只能证明……没有 schema 测试不能证明……没有权限反例不能证明……没有失败回退不能证明……我会拒收因为……",
          minimum: 100,
          artifactIds: ["delivery", "logs"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次 Agent 工具边界设计",
          placeholder:
            "我遇到的问题是 Agent 能调用工具但没有边界……我先检查 registry……再补 schema 和权限门禁……最后用失败回退和 audit log 证明……",
          minimum: 120,
          warning: {
            title: "这不是背一个“Agent 会调工具”",
            body: "面试官想听的是：你如何限制工具能做什么、谁能调用、失败怎么退场，以及如何审计每一次动作。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "第 5 棒：工具结果 → 用户看见的状态",
        focus: "只看成功、越权和失败是否被区分展示。",
        keyLines: [
          "setResult(body)",
          "没有区分 PERMISSION_DENIED",
          "没有 requestId 提示",
        ],
        proves:
          "前端当前能展示工具返回，但没有把越权、非法参数和工具失败变成清楚状态。",
        cannotProve:
          "不能证明后端真的做了 schema 或权限检查，也不能证明审计日志存在。",
      },
      "tool-executor": {
        place: "第 2-5 棒：注册表 → 执行器 → 回退",
        focus: "只看 toolRegistry、executeToolCall、tool.run 和 catch。",
        keyLines: [
          "const tool = toolRegistry[toolName]",
          "const data = tool.run(args || {}, context)",
          "error.message",
        ],
        proves:
          "当前会查工具是否存在，但没有执行 schema 校验、权限门禁和结构化失败回退。",
        cannotProve:
          "代码片段不能证明真实请求是否越权；还要看 Network、permission 反例和日志。",
      },
      registry: {
        place: "第 2 棒证据：工具钥匙登记册",
        focus: "只看 name、description、permission、schema 和 risk。",
        keyLines: [
          "searchProjectDocs",
          "docs:read",
          "updateProjectStatus",
          "project:write",
        ],
        proves:
          "工具能力、参数和权限要求已经被登记，但风险说明提示边界还不够。",
        cannotProve: "登记表不能证明执行器真的校验了 schema 和权限。",
      },
      network: {
        place: "用户可见证据：非法参数是否被放行",
        focus: "只看 request.args.status、response.ok 和 observation。",
        keyLines: ["status: shipped", "ok: true", "status 不在允许枚举里"],
        proves: "非法枚举值被当成成功工具调用执行。",
        cannotProve: "不能证明权限检查是否存在；要看越权反例。",
      },
      permission: {
        place: "权限门禁证据：只读用户是否能写入",
        focus: "只看 user.permissions、toolCall 和 expected.code。",
        keyLines: [
          "permissions: ['docs:read']",
          "updateProjectStatus",
          "PERMISSION_DENIED",
        ],
        proves: "只读用户当前能执行写入工具，权限门禁缺失。",
        cannotProve: "不能证明工具失败时是否安全回退；要看 tool-failure。",
      },
      failure: {
        place: "失败回退证据：内部错误有没有泄露",
        focus: "只看 project_fail、currentResult.error 和 expected。",
        keyLines: [
          "database connection refused",
          "TOOL_FAILED",
          "requestId: req_tool_001",
        ],
        proves: "工具内部错误当前被直接暴露给前端，没有结构化回退。",
        cannotProve: "不能证明合法调用是否留下审计日志；要看日志和测试。",
      },
      logs: {
        place: "后端旁证：schema、权限和错误如何被记录",
        focus: "只看 validation、permission、leaked_to_client 和 requestId。",
        keyLines: [
          "validation=skipped status=shipped",
          "permission=skipped user=user_apprentice",
          "leaked_to_client=true",
        ],
        proves: "日志直接暴露 schema、权限和失败回退都没有守住。",
        cannotProve: "日志不能代替用户可见提示，也不能证明修复已完成。",
      },
      delivery: {
        place: "交付审查：Agent 能调工具是否等于完成",
        focus: "只看它有没有覆盖只读/写入边界、schema、权限、失败回退和审计。",
        keyLines: [
          "前端能点击按钮触发工具调用",
          "没有证明五件事",
          "合法工具调用是否留下审计日志",
        ],
        proves: "这份说明只证明工具表面可触发，不能证明 Agent 工具调用可信。",
        cannotProve: "Agent 说能调用工具不等于权限、失败和审计边界都成立。",
      },
    },
  },
  [CASE11_SCENARIO_ID]: {
    scenarioId: CASE11_SCENARIO_ID,
    missionLabel: "主线 1-11 · AI 应用开发",
    missionTitle: "验收试炼场",
    duration: "45-90 分钟 · 产出可信验收证据",
    backgroundImage: questStage,
    flowAriaLabel: "可信验收从旧故障到交付审查的证据路线",
    flowEyebrow: "本关路线",
    flowTitle: "试炼官不听口头承诺，只看复现、测试、手动报告和风险",
    flowItems: [
      {
        label: "旧故障",
        title: "先让问题复现",
        detail: "红灯证明测试真的抓住原问题",
      },
      {
        label: "单元边界",
        title: "守住小逻辑",
        detail: "验证核心函数和校验器是否独立可靠",
      },
      {
        label: "集成流程",
        title: "串起真实路径",
        detail: "证明 POST 后再 GET 能读到同一条数据",
      },
      {
        label: "手动复测",
        title: "从浏览器入口走一遍",
        detail: "记录步骤、期望、实际和证据边界",
      },
      {
        label: "报告指纹",
        title: "确认不是过期绿灯",
        detail: "sourceHash、时间和当前代码要对得上",
      },
      {
        label: "交付决定",
        title: "说明风险和是否接收",
        detail: "缺复现、缺边界或报告过期都要拒收",
      },
    ],
    baseline: {
      label: "验收试炼委托已领取",
      title: "先把“测试通过”翻译成可复核证据",
      body: "这一关不接受一句“全部通过”。你要证明旧问题先失败过，修复后单元测试和集成测试都覆盖到关键路径，手动复测从真实入口走通，并且测试报告对应当前源码而不是旧代码。",
      action: "进入验收试炼场",
    },
    practical: {
      title: "在验收试炼沙盒里修复报告校验器",
      sandboxPath: "sandbox/verification-trial-arena",
      statusPassed:
        "复现、单元、集成、手动报告、当前源码指纹和回归风险都被校验器识别。",
      statusFailed:
        "失败报告会指出：旧问题复现、自动化边界、手动复测、sourceHash 或回归风险哪里还不能证明可信。",
    },
    result: {
      label: "可信验收闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次交付验收审查",
      body: (hintLevel) =>
        `你证明了“测试通过”不是一句口号：要有旧故障红灯、修复后的单元和集成测试、从浏览器入口走通的手动报告、当前源码指纹，以及还没覆盖的回归风险。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved: "修复证据覆盖复现、自动化、手动复测、报告指纹和风险说明",
      recorded:
        "失败复现报告、过期通过报告、Network 复测、手动复测报告、后端日志和交付审查记录",
      pending:
        "换一个登录、接口或 Agent 工具场景继续训练 red-green、手动报告和回归风险说明",
      nextTitle: "下一步怎么变成面试里的验收能力？",
      nextItems: [
        "把验收讲成 red → green、unit、integration、manual report、source hash 和 risk 的证据链。",
        "说明为什么旧源码的通过报告、没有复现红灯、没有手动路径，都不能直接接收交付。",
        "用一段拒收理由证明你会审 Agent 交付，而不是只看它说“测试通过”。",
      ],
    },
    hints: [
      "先看 failing-before：旧问题必须能红，才说明测试真的抓住了要修的问题。",
      "再看 passing-after-stale 和 backend.log：测试全绿但 sourceHash 是旧的，说明报告可能已经过期。",
      "最后看 manual-report、network 和 agent-delivery：手动路径能补用户视角，但还要写清证据边界和回归风险。",
    ],
    verificationStepId: "manual-report",
    requiredResponseStepIds: [
      "repro-case",
      "unit-boundary",
      "integration-flow",
      "regression-risk",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "repro-case",
        label: "复现旧故障",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 先让旧问题亮红灯",
          prompt: "用 failing-before 解释为什么修复前失败复现是可信验收的起点",
          placeholder:
            "旧问题是……复现用例名称是……当前状态 failed 说明……如果没有这一步，只看到通过报告不能证明……",
          minimum: 90,
          instruction:
            "不要只写“有测试”。要说明旧问题先失败，才证明测试覆盖了真正的故障。",
          artifactIds: ["failing-before", "report-validator"],
          flowStrip: ["旧故障", "reproduction test", "failed", "修复目标"],
        },
      },
      {
        id: "unit-boundary",
        label: "守单元边界",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 03 · 单元测试守住小逻辑",
          prompt: "审查报告校验器为什么不能只看 passed 数字",
          placeholder:
            "validateVerificationReport 现在只看……这会误收……单元测试应该检查……例如缺少 reproduction 或 sourceHash 不匹配时应该……",
          minimum: 100,
          instruction:
            "单元测试要守住小逻辑：报告结构、失败复现、sourceHash、风险字段，而不是只看数字漂亮。",
          artifactIds: ["report-validator", "passing-stale"],
          rubricItems: [
            "是否指出只看 passed 数字不可信",
            "是否说明 sourceHash 要匹配当前代码",
            "是否区分 report validator 和业务功能测试",
            "是否提出拒收过期报告",
          ],
        },
      },
      {
        id: "integration-flow",
        label: "串集成流程",
        icon: Network,
        kind: "response",
        response: {
          title: "阶段 04 · POST 后再 GET 才像真实流程",
          prompt: "用 Network 复测说明集成测试和手动路径分别能证明什么",
          placeholder:
            "POST /api/canvases 返回……GET /api/canvases 返回……这证明本次请求链路……但不能单独证明……还需要……",
          minimum: 100,
          instruction:
            "集成测试关注模块交接。这里要把 POST 和 GET 串起来，而不是只说“接口没报错”。",
          artifactIds: ["network", "logs"],
          flowStrip: [
            "POST 保存",
            "201 Created",
            "GET 列表",
            "count=1",
            "复测证据",
          ],
        },
      },
      {
        id: "manual-report",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "regression-risk",
        label: "审过期报告",
        icon: AlertTriangle,
        kind: "response",
        response: {
          title: "阶段 05 · 全绿也可能是过期绿灯",
          prompt:
            "用 passing-after-stale 和 backend.log 判断这份通过报告为什么不能直接接收",
          placeholder:
            "报告显示 passed=……但 sourceHash 是……日志里的 currentHash 提示……所以我会拒收，因为……还要补……",
          minimum: 100,
          instruction:
            "过期报告是工作里很常见的坑。要看报告时间、sourceHash、当前代码和未覆盖风险。",
          artifactIds: ["passing-stale", "logs", "manual-report"],
          rubricItems: [
            "是否指出 sourceHash 不匹配",
            "是否区分自动化全绿和当前代码可信",
            "是否引用手动报告的证据边界",
            "是否写出剩余回归风险",
          ],
        },
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · 验收任务委托",
          prompt: "把报告校验器修复任务交给 Agent，要求它补齐可信验收证据",
          placeholder:
            "背景：Agent 交付只说测试通过……\n现有证据：……\n需要修改：……\n验收必须覆盖：red reproduction、unit、integration、manual report、sourceHash、risk……\n不要只做：……",
          minimum: 130,
          instruction:
            "任务要写清测试证据本身的验收标准：不是让 Agent 只把测试改绿。",
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 07 · 拒收空泛通过报告",
          prompt:
            "审查 Agent 的交付说明：为什么“单元、集成、手动都通过”还不足以证明完成？",
          placeholder:
            "这份说明缺少……没有展示旧问题先失败……没有证明报告对应当前代码……风险写暂无也不可信……我的接收/拒收决定是……",
          minimum: 110,
          artifactIds: ["delivery", "logs", "passing-stale"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次可信验收设计",
          placeholder:
            "我遇到的问题是 Agent 说修好了但证据不可信……我先要求旧问题复现红灯……再看单元和集成……然后用手动报告和 sourceHash 防止过期报告……最后说明回归风险……",
          minimum: 130,
          warning: {
            title: "这不是背“我会写测试”",
            body: "面试官想听的是：你如何证明旧问题被覆盖、当前代码真的通过、用户路径可用，以及还有哪些风险没覆盖。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "用户可见证据：验收报告怎么展示",
        focus: "只看报告面板是否区分通过、过期、缺证据和风险。",
        keyLines: ["accepted", "tests", "manualReport"],
        proves: "前端能展示 Agent 交付的报告内容。",
        cannotProve: "不能证明报告对应当前源码，也不能证明旧问题先失败过。",
      },
      "report-validator": {
        place: "验收门禁：报告校验器",
        focus: "只看 validateVerificationReport 和 buildDeliveryDossier。",
        keyLines: ["ok: true", "code: VERIFIED", "Agent 已提供通过报告"],
        proves: "当前校验器几乎无条件接收报告。",
        cannotProve: "不能证明它检查了复现、sourceHash、手动报告或回归风险。",
      },
      "failing-before": {
        place: "第 1 棒证据：旧问题红灯",
        focus: "只看 phase、summary.failed、tests[0].status 和 message。",
        keyLines: [
          "phase: before-fix",
          "failed: 1",
          "刷新页面后，GET /api/canvases 返回空数组",
        ],
        proves: "旧问题能被复现用例抓住。",
        cannotProve: "不能证明修复后已经通过，还要看修复后的报告和当前源码。",
      },
      "passing-stale": {
        place: "第 5 棒证据：过期绿灯",
        focus: "只看 sourceHash、summary、manual 和 tests。",
        keyLines: [
          "old_source_hash_from_before_latest_change",
          "passed: 3",
          "旧问题复现用例已经转绿",
        ],
        proves: "这份报告声称全绿，但它绑定的是旧源码 hash。",
        cannotProve: "不能证明当前代码仍然通过。",
      },
      network: {
        place: "集成路径证据：POST 后再 GET",
        focus: "只看 requestId、POST、GET 和 explain。",
        keyLines: [
          "POST /api/canvases status 201",
          "GET /api/canvases status 200",
          "不能单独证明测试报告对应当前代码",
        ],
        proves: "本次浏览器/API 链路能保存并读回同一条记录。",
        cannotProve: "不能替代自动化测试和源码指纹校验。",
      },
      "manual-report": {
        place: "手动复测证据：真实入口走通",
        focus: "只看操作步骤、期望结果、实际结果、证据边界和回归风险。",
        keyLines: [
          "POST /api/canvases 返回 201",
          "刷新后，画布仍然存在",
          "只测了单用户保存",
        ],
        proves: "浏览器主路径可用，并且报告写出了边界。",
        cannotProve: "不能单独证明所有代码路径和并发边界都安全。",
      },
      logs: {
        place: "后端旁证：报告是否对应当前代码",
        focus: "只看 requestId、count 和 sourceHash warning。",
        keyLines: [
          "requestId=req_verify_011",
          "count=1",
          "sourceHash=old_source_hash_from_before_latest_change currentHash=runtime_hash_mismatch",
        ],
        proves: "后端日志支持本次链路可用，同时暴露报告指纹不匹配。",
        cannotProve: "日志不能替代测试断言和人工审查决定。",
      },
      delivery: {
        place: "交付审查：Agent 说全部通过是否等于完成",
        focus: "只看验证列表、风险和审查提醒。",
        keyLines: ["测试全部通过，可以合并", "风险：暂无", "没有展示失败复现"],
        proves: "Agent 交付说明过于空泛，缺少可复核证据。",
        cannotProve: "不能证明交付可以接收。",
      },
    },
  },
  [CASE12_SCENARIO_ID]: {
    scenarioId: CASE12_SCENARIO_ID,
    missionLabel: "主线 1-12 · AI 应用开发",
    missionTitle: "委托书工坊",
    duration: "45-90 分钟 · 产出可执行 Agent 任务",
    backgroundImage: questWorkbench,
    flowAriaLabel: "Agent 委托从现场到交付格式的任务路线",
    flowEyebrow: "本关路线",
    flowTitle: "锻造师不收“你看着办”，只收有证据、有边界、有验收的委托书",
    flowItems: [
      {
        label: "问题现场",
        title: "写清背景证据",
        detail: "先说发生了什么、证据在哪里、为什么要做",
      },
      {
        label: "可见目标",
        title: "定义完成样子",
        detail: "用户完成后看到什么，系统状态变成什么",
      },
      {
        label: "安全边界",
        title: "限制范围和权限",
        detail: "哪些文件、命令、数据和项目不能碰",
      },
      {
        label: "验收路径",
        title: "写可执行检查",
        detail: "命令、浏览器路径、预期结果都要能复核",
      },
      {
        label: "风险回滚",
        title: "承认未覆盖风险",
        detail: "失败时怎么停、怎么退、还剩什么边界",
      },
      {
        label: "交付格式",
        title: "让 Agent 回交证据",
        detail: "摘要、验证、风险、后续缺一不可",
      },
    ],
    baseline: {
      label: "委托书工坊已开炉",
      title: "先把“帮我优化一下”熔成工程任务",
      body: "这一关训练你把模糊愿望变成 Agent 能执行、你也能验收的任务。好的委托书要有背景证据、可观察目标、安全约束、验收命令、浏览器路径、风险回滚和交付格式。",
      action: "进入委托书工坊",
    },
    practical: {
      title: "在委托书沙盒里修复任务校验器",
      sandboxPath: "sandbox/agent-brief-forge",
      statusPassed:
        "空泛委托、不可测目标、越界约束和缺验收都会被拒绝，清晰委托会生成可复核 handoff。",
      statusFailed:
        "失败报告会指出：背景、目标、约束、验收、风险或交付格式哪里还不能保护 Agent 协作。",
    },
    result: {
      label: "Agent 委托闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次工程任务拆解",
      body: (hintLevel) =>
        `你把一句模糊的“优化一下”拆成了背景、目标、约束、验收、风险和交付格式。现在你不是把项目丢给 Agent 猜，而是在设计它能安全执行、你能检查结果的任务。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved:
        "委托书校验覆盖背景证据、可观察目标、安全边界、验收路径、风险回滚和交付格式",
      recorded:
        "空泛委托反例、越界委托反例、清晰委托样例、Network 拒绝记录、后端日志和 Agent 交付说明",
      pending: "换一个真实功能、Bug 或上线任务继续训练任务边界和验收定义",
      nextTitle: "下一步怎么变成工作里的 Agent 协作能力？",
      nextItems: [
        "把任务写成背景、目标、约束、验收、风险、交付格式，而不是一句“你看着办”。",
        "说明哪些内容是可观察完成，哪些只是主观形容，为什么后者不能验收。",
        "用越界委托反例证明你会保护项目边界，不让 Agent 任意读项目或运行命令。",
      ],
    },
    hints: [
      "先看 vague-brief：它有愿望，但缺少证据、验收和风险，所以 Agent 只能猜。",
      "再看 unsafe-brief：它看似有目标，但允许读取任意项目和任意命令，边界是危险的。",
      "最后看 clear-brief、network 和 backend.log：清晰委托要能被后端接收，也要能解释被拒绝的原因。",
    ],
    verificationStepId: "acceptance-plan",
    requiredResponseStepIds: [
      "context-evidence",
      "observable-goal",
      "scope-constraints",
      "risk-rollback",
      "delivery-format",
      "agent-brief",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "context-evidence",
        label: "拆坏委托",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 空泛委托会让 Agent 乱猜",
          prompt:
            "用 vague-brief 解释为什么“帮我优化一下项目”不能直接交给 Agent",
          placeholder:
            "这份委托只说……缺少的背景证据是……Agent 不知道要改哪里、为什么改、怎么判断完成……所以我会先要求补……",
          minimum: 90,
          instruction:
            "不要只说“太笼统”。要指出缺少现象、证据、目标和验收，Agent 会因此猜范围。",
          artifactIds: ["vague-brief", "brief-validator"],
          flowStrip: ["模糊愿望", "缺证据", "Agent 猜范围", "拒绝委托"],
        },
      },
      {
        id: "observable-goal",
        label: "写可见目标",
        icon: Lightbulb,
        kind: "response",
        response: {
          title: "阶段 03 · 目标要能被看见和判断",
          prompt: "比较 vague-brief 和 clear-brief：什么叫可观察目标？",
          placeholder:
            "“更专业、更好看”不能验收，因为……clear-brief 的目标写成……用户能看到……系统状态会……所以可以判断完成/未完成……",
          minimum: 100,
          instruction:
            "可观察目标要回答：完成后用户看到什么，系统状态如何变化，什么情况算失败。",
          artifactIds: ["vague-brief", "clear-brief"],
          rubricItems: [
            "是否区分主观形容和可观察结果",
            "是否指出 expectedResult 的作用",
            "是否能写出完成/未完成边界",
            "是否避免把 XP 或字数当成完成",
          ],
        },
      },
      {
        id: "scope-constraints",
        label: "守安全边界",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 04 · 约束不是礼貌，是护栏",
          prompt: "用 unsafe-brief 说明为什么允许任意读取和任意命令是危险委托",
          placeholder:
            "unsafe-brief 的危险点是……它允许……这违反了项目边界……正确约束应该写清……例如不能读取真实项目、不能执行任意终端命令……",
          minimum: 110,
          instruction:
            "把约束写成可执行边界：文件范围、命令范围、数据边界、禁止事项和停止条件。",
          artifactIds: ["unsafe-brief", "logs"],
          flowStrip: ["任务范围", "允许/禁止", "安全边界", "停止条件"],
        },
      },
      {
        id: "acceptance-plan",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "risk-rollback",
        label: "写风险回滚",
        icon: AlertTriangle,
        kind: "response",
        response: {
          title: "阶段 05 · 没有风险和回滚的委托不完整",
          prompt: "用 clear-brief 和后端日志说明风险、回滚为什么要写进任务",
          placeholder:
            "clear-brief 里写了风险……回滚方式是……backend.log 显示……如果没有风险和回滚，Agent 可能……所以我会要求……",
          minimum: 100,
          instruction:
            "风险不是唱衰项目，而是告诉 Agent 哪些边界没有覆盖，以及失败时怎么安全退回。",
          artifactIds: ["clear-brief", "logs"],
          rubricItems: [
            "是否指出风险列表",
            "是否引用 rollback",
            "是否说明失败时怎么停",
            "是否区分已覆盖和未覆盖",
          ],
        },
      },
      {
        id: "delivery-format",
        label: "定交付格式",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 06 · 让 Agent 回交可审查证据",
          prompt: "审查 buildAgentHandoff 为什么不能只写“完成后告诉我结果”",
          placeholder:
            "当前 buildAgentHandoff 只要求……这会导致交付缺少……clear-brief 期望的 deliveryFormat 包含……所以 handoff 应该要求 Agent 返回……",
          minimum: 110,
          instruction:
            "交付格式要让你能审查：摘要、验证证据、风险、后续，而不是一句“已完成”。",
          artifactIds: ["brief-validator", "clear-brief", "delivery"],
          rubricItems: [
            "是否指出 expectedDelivery 太空泛",
            "是否要求验证证据",
            "是否要求风险说明",
            "是否要求后续或回滚",
          ],
        },
      },
      {
        id: "agent-brief",
        label: "给 Agent 写任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 07 · 写一份可执行委托书",
          prompt: "把第 12 章 Lab 接入任务写给 Agent，要求它不要做成空页面",
          placeholder:
            "背景：第 12 章只有剧情教学……\n现有证据：……\n目标：……\n范围/约束：……\n验收命令：……\n浏览器路径：……\n风险和回滚：……\n交付格式：……",
          minimum: 140,
          instruction:
            "这一步就是本章最终能力：把真实需求写成 Agent 能执行、你能验收的任务。",
          artifactIds: ["clear-brief", "network"],
        },
      },
      {
        id: "delivery-review",
        label: "审查交付说明",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 08 · 检查 Agent 是否按委托交付",
          prompt: "审查 Agent 交付说明：它证明了什么，还缺什么？",
          placeholder:
            "这份交付说明证明了……但它也承认……如果我要接收，还需要看到……如果缺少……我会要求补充……",
          minimum: 100,
          artifactIds: ["delivery", "logs"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 09 · 面试复盘",
          prompt: "把这一关讲成一次高质量 Agent 协作",
          placeholder:
            "我遇到的问题是任务太空泛会让 Agent 猜范围……我把需求拆成背景、目标、约束、验收、风险和交付格式……这样 Agent 能……我也能用……验收……",
          minimum: 130,
          warning: {
            title: "这不是背一份 Prompt 模板",
            body: "面试官想听的是：你如何把模糊需求变成可执行任务，如何保护项目边界，如何要求 Agent 给出可复核证据。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "用户可见入口：委托书编辑器",
        focus: "只看表单字段是否覆盖背景、目标、约束、验收、风险和交付格式。",
        keyLines: ["context", "goal", "constraints", "acceptance"],
        proves: "前端能收集委托书字段。",
        cannotProve: "不能证明后端真的拒绝空泛或越界任务。",
      },
      "brief-validator": {
        place: "工坊门禁：委托书校验器",
        focus: "只看 validateAgentBrief 和 buildAgentHandoff。",
        keyLines: ["wordCount < 80", "READY_FOR_AGENT", "完成后告诉我结果"],
        proves: "当前校验器只看字数，交付格式也过于空泛。",
        cannotProve: "不能证明背景、目标、约束、验收、风险都被检查。",
      },
      "vague-brief": {
        place: "坏委托反例：Agent 只能猜",
        focus: "只看 title、context、goal、constraints 和 acceptance。",
        keyLines: ["帮我优化一下项目", "做得更好看、更专业", "你看着办"],
        proves: "这份任务缺少可复核背景、目标、约束和验收。",
        cannotProve: "不能证明任务可以交给 Agent 执行。",
      },
      "unsafe-brief": {
        place: "越界委托反例：范围和权限失控",
        focus: "只看 constraints、risks 和 rollback。",
        keyLines: ["可以读取任何项目", "可以运行任意终端命令", "risks: []"],
        proves: "这份任务把安全边界交给 Agent 猜，必须拒绝。",
        cannotProve: "不能证明项目边界得到保护。",
      },
      "clear-brief": {
        place: "合格样例：可执行工程委托",
        focus:
          "只看 context、goal、constraints、acceptance、risks、rollback 和 deliveryFormat。",
        keyLines: ["现象：第 12 章只有剧情教学", "browserPath", "验证证据"],
        proves: "清晰委托能说明为什么做、做到什么、怎么验收和怎么回交证据。",
        cannotProve: "不能单独证明校验器已经正确实现。",
      },
      network: {
        place: "接口拒绝证据：缺验收被拦住",
        focus: "只看 requestId、status、response.code 和 explain。",
        keyLines: [
          "status: 422",
          "MISSING_ACCEPTANCE",
          "任务缺少可执行验收标准",
        ],
        proves: "后端会拒绝缺少验收标准的委托。",
        cannotProve: "不能证明所有坏委托都会被拒绝。",
      },
      logs: {
        place: "后端旁证：拒绝和接收理由",
        focus: "只看 rejected/accepted、requestId 和 code。",
        keyLines: [
          "code=MISSING_ACCEPTANCE",
          "code=MISSING_RISK_PLAN",
          "brief accepted",
        ],
        proves: "日志能展示不同委托为什么被拒绝或接收。",
        cannotProve: "日志不能替代校验器单元测试和浏览器路径验收。",
      },
      delivery: {
        place: "交付审查：Agent 是否按格式说明",
        focus: "只看摘要、验证证据、风险和后续。",
        keyLines: ["摘要", "验证证据", "风险", "后续"],
        proves: "交付说明至少按约定结构回交信息。",
        cannotProve: "不能证明第 12 章完整 UI 实战 Lab 已接入。",
      },
    },
  },
  [CASE13_SCENARIO_ID]: {
    scenarioId: CASE13_SCENARIO_ID,
    missionLabel: "主线 1-13 · AI 应用开发",
    missionTitle: "交付审查庭",
    duration: "45-90 分钟 · 产出可信交付审查",
    backgroundImage: questArchive,
    flowAriaLabel: "Agent 交付从说明到接收决定的审查路线",
    flowEyebrow: "本关路线",
    flowTitle: "审查官不看漂亮话，只看 Diff、测试、浏览器边界和文档证据",
    flowItems: [
      {
        label: "交付说明",
        title: "先看 Agent 说了什么",
        detail: "摘要、验证、风险和后续是否完整",
      },
      {
        label: "Diff 范围",
        title: "确认改动有没有越界",
        detail: "任务范围外文件要解释、回退或补证",
      },
      {
        label: "测试证据",
        title: "检查报告是否可信",
        detail: "命令、通过数、失败数和源码指纹要对应当前版本",
      },
      {
        label: "浏览器边界",
        title: "补桌面和 390px 验收",
        detail: "只跑命令不等于用户路径真的可用",
      },
      {
        label: "文档同步",
        title: "核对交接和任务源",
        detail: "README、HANDOFF、任务表和 changelog 要对齐",
      },
      {
        label: "接收决定",
        title: "写出接收或拒收理由",
        detail: "结论要能复核，而不是凭感觉点通过",
      },
    ],
    baseline: {
      label: "交付审查庭已开庭",
      title: "先把“已完成”放到证据台上",
      body: "这一关训练你审查 Agent 交付：说明写得漂亮不等于真的完成。你要核对 Diff 范围、测试证据、移动端和边界路径、文档同步，再决定接收、补证或拒收。",
      action: "进入交付审查庭",
    },
    practical: {
      title: "在交付审查沙盒里拒收不可信交付",
      sandboxPath: "sandbox/delivery-review-court",
      statusPassed:
        "审查器能识别范围外 Diff、过期测试证据、缺少移动端验收和文档同步缺口，并输出补证决定。",
      statusFailed:
        "失败报告会指出审查器仍被“测试通过”带走，没有检查 Diff、报告指纹、390px 或文档事实源。",
    },
    result: {
      label: "交付审查闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次可信交付验收",
      body: (hintLevel) =>
        `你没有被“已完成”三个字带走，而是沿着交付说明、Diff、测试、浏览器边界和文档同步逐项核对，最后写出可复核的接收/补证决定。这是工作里验收 Agent 的关键能力。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved:
        "交付审查覆盖摘要、Diff 范围、测试时效、浏览器边界、文档同步和拒收理由",
      recorded:
        "Agent 交付说明、Diff 摘要、测试证据、浏览器验收记录、文档同步缺口、后端日志和拒收决定",
      pending:
        "换一个真实 PR 或 Agent 交付继续训练：哪些证据足够接收，哪些必须要求补证",
      nextTitle: "下一步怎么变成工作里的验收能力？",
      nextItems: [
        "审查交付时先看证据，不先看态度：摘要、验证、风险、后续缺一不可。",
        "Diff、测试、浏览器、文档必须能互相对上；任何一环过期或缺失都要要求补证。",
        "把拒收理由写清楚，避免只说“不行”，让 Agent 知道下一步补什么。",
      ],
    },
    hints: [
      "先看 agent-delivery：它说测试通过，但没有移动端、报告指纹和风险说明。",
      "再看 diff-summary 和 backend.log：范围外删除 `src/game.ts`，这不是本章任务自然包含的改动。",
      "最后把 test-evidence、browser-checks、docs-sync 串起来：测试过期、缺 390px、任务事实源未同步，都足以要求补证。",
    ],
    verificationStepId: "browser-boundary",
    requiredResponseStepIds: [
      "delivery-summary",
      "diff-scope",
      "test-evidence",
      "docs-sync",
      "review-decision",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "delivery-summary",
        label: "核对交付说明",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 漂亮说明不能直接接收",
          prompt: "审查 agent-delivery：它证明了什么，缺少什么？",
          placeholder:
            "这份交付说明声称……它提供的证据只有……缺少移动端、风险和源码对应关系……所以我不能直接接收，而要继续核对……",
          minimum: 90,
          instruction:
            "不要只写“说明不完整”。指出摘要、验证证据、风险、后续分别有什么、缺什么。",
          artifactIds: ["delivery-note", "reviewer"],
          flowStrip: ["Agent 结论", "验证证据", "风险说明", "补证清单"],
        },
      },
      {
        id: "diff-scope",
        label: "审 Diff 范围",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 03 · Diff 不能越出任务边界",
          prompt: "用 diff-summary 和后端日志判断：哪些改动需要解释或回退？",
          placeholder:
            "allowedPaths 允许……但 files 里出现……这说明……backend.log 的 OUT_OF_SCOPE_DIFF 也支持这个判断……我会要求 Agent……",
          minimum: 110,
          instruction:
            "要把“范围外”讲具体：哪个文件、为什么不在允许范围、接收前要补什么。",
          artifactIds: ["diff-summary", "logs"],
          rubricItems: [
            "是否引用 allowedPaths",
            "是否指出 src/game.ts 删除",
            "是否说明范围外改动的风险",
            "是否提出解释、回退或补证",
          ],
        },
      },
      {
        id: "test-evidence",
        label: "查测试证据",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 04 · 测试通过也可能过期",
          prompt: "用 test-evidence 和 backend.log 说明为什么旧报告不能接收",
          placeholder:
            "报告显示 failed=0，但 sourceHash 是……backend.log 提示……这只能证明旧版本可能通过，不能证明当前版本……所以还需要……",
          minimum: 110,
          instruction:
            "区分“有测试报告”和“当前代码被测试过”。过期报告不能当验收证据。",
          artifactIds: ["test-evidence", "logs"],
          flowStrip: ["命令", "通过数", "源码指纹", "当前版本"],
        },
      },
      {
        id: "browser-boundary",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "docs-sync",
        label: "查文档同步",
        icon: FolderLock,
        kind: "response",
        response: {
          title: "阶段 05 · 文档不同步会让下一位接手的人迷路",
          prompt: "用 docs-sync 判断交付还缺哪些项目记忆",
          placeholder:
            "docs-sync 显示已更新……但 missing 里还有……这意味着任务事实源和交接入口没有同步……我会要求补……",
          minimum: 90,
          instruction:
            "文档同步不是形式主义。任务事实源、交接入口和 changelog 要让下一位 Agent 不从零猜。",
          artifactIds: ["docs-sync", "logs"],
          rubricItems: [
            "是否指出 missing 文档",
            "是否解释 HANDOFF 的作用",
            "是否解释任务事实源的作用",
            "是否提出补文档的验收方式",
          ],
        },
      },
      {
        id: "review-decision",
        label: "写拒收决定",
        icon: XCircle,
        kind: "response",
        response: {
          title: "阶段 06 · 写一份可执行的补证决定",
          prompt:
            "根据 review-decision，总结为什么现在不能接收，以及 Agent 下一步要补什么",
          placeholder:
            "结论：要求补证，不接收。\n理由 1：……\n理由 2：……\n下一步要求：……\n补证通过后我会检查……",
          minimum: 130,
          instruction:
            "拒收不是发脾气。它要让 Agent 明白：哪条证据不成立、怎么补、补完怎么验。",
          artifactIds: ["decision", "browser-checks", "docs-sync"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 07 · 面试复盘",
          prompt: "把这一关讲成一次你如何验收 Agent 交付的项目经历",
          placeholder:
            "我收到 Agent 交付后，没有只看“测试通过”……我核对了 Diff 范围、测试报告指纹、浏览器 390px 和文档同步……最后要求补证，因为……这说明我能……",
          minimum: 130,
          warning: {
            title: "这不是挑刺",
            body: "面试官想听的是：你怎样保护项目质量，怎样用证据接收或拒收交付，而不是只会说 Agent 做完了。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "用户可见入口：交付审查面板",
        focus: "只看 status、review.reason 和 delivery.summary。",
        keyLines: ["review?.accepted", "需要补证", "delivery.summary"],
        proves: "前端能展示审查结论和 Agent 交付摘要。",
        cannotProve: "不能证明审查器检查了 Diff、测试、浏览器和文档。",
      },
      reviewer: {
        place: "审查门禁：交付审查器",
        focus: "只看 reviewDelivery 和 buildReviewDecision。",
        keyLines: ["delivery.summary", "failed === 0", 'decision: "accept"'],
        proves: "当前审查器只要有说明且测试 0 失败就接收。",
        cannotProve: "不能证明范围、时效、移动端和文档同步都合格。",
      },
      "delivery-note": {
        place: "Agent 交付说明：漂亮话先上证据台",
        focus: "只看摘要、验证证据、风险和审查提醒。",
        keyLines: ["测试通过，可以接收", "`npm run test` 通过", "风险：暂无"],
        proves: "Agent 给出了结论和一条测试命令。",
        cannotProve: "不能证明移动端、当前源码、风险和边界都验过。",
      },
      "diff-summary": {
        place: "Diff 范围：有没有越界改动",
        focus: "只看 allowedPaths、files 和 explain。",
        keyLines: ["allowedPaths", "src/game.ts", "不在本章允许范围"],
        proves: "Diff 出现范围外删除，需要解释、回退或补证。",
        cannotProve: "不能证明交付可以接收。",
      },
      "test-evidence": {
        place: "测试证据：通过报告是否对应当前源码",
        focus: "只看 sourceHash、failed 和 commands。",
        keyLines: ["sourceHash", "old_delivery_review_hash", "failed: 0"],
        proves: "报告显示旧指纹下测试 0 失败。",
        cannotProve: "不能证明当前代码已经通过同一组测试。",
      },
      "browser-checks": {
        place: "浏览器边界：用户路径是否真的验过",
        focus: "只看 viewport、path 和 result。",
        keyLines: ["1280px", "desktop-refresh", "缺少 390px"],
        proves: "桌面路径有记录。",
        cannotProve: "不能证明 390px 移动端可用，也不能证明异常路径覆盖。",
      },
      "docs-sync": {
        place: "项目记忆：下一位接手是否会迷路",
        focus: "只看 updated、missing 和 explain。",
        keyLines: ["README.md", "HANDOFF.md", "docs/ai-career-rpg-tasks.md"],
        proves: "README 和 changelog 有更新，但交接入口和任务事实源缺失。",
        cannotProve: "不能证明长期项目记忆已同步。",
      },
      logs: {
        place: "后端旁证：审查器发现了哪些风险",
        focus: "只看 requestId 和 code。",
        keyLines: [
          "OUT_OF_SCOPE_DIFF",
          "STALE_TEST_EVIDENCE",
          "MISSING_MOBILE_CHECK",
          "MISSING_DOC_SYNC",
        ],
        proves: "后端日志能串起四个拒收理由。",
        cannotProve: "日志不能替代单元测试和浏览器复测。",
      },
      decision: {
        place: "拒收决定书：结论是否可执行",
        focus: "只看结论、四条理由和面试表达。",
        keyLines: ["要求补证，不接收", "src/game.ts", "390px 移动端路径"],
        proves: "这份决定能说明为什么不能接收，以及下一步该补什么。",
        cannotProve: "不能证明审查器已经实现这些判断。",
      },
    },
  },
  [CASE14_SCENARIO_ID]: {
    scenarioId: CASE14_SCENARIO_ID,
    missionLabel: "主线 1-14 · AI 应用开发",
    missionTitle: "上线城门",
    duration: "45-90 分钟 · 产出上线检查清单",
    backgroundImage: questPortal,
    flowAriaLabel: "从交付审查到可回滚上线的门禁路线",
    flowEyebrow: "本关路线",
    flowTitle: "守门人不看构建绿灯，只看计划、配置、备份、冒烟、监控和回滚",
    flowItems: [
      {
        label: "上线计划",
        title: "确认窗口和负责人",
        detail: "影响范围、owner、observer 和值守安排要明确",
      },
      {
        label: "环境配置",
        title: "检查生产变量和密钥",
        detail: "生产缺 key 不能靠本地通过糊过去，也不能让密钥进前端",
      },
      {
        label: "数据备份",
        title: "证明备份可恢复",
        detail: "有备份文件不等于恢复步骤真实可执行",
      },
      {
        label: "冒烟测试",
        title: "覆盖桌面与 390px",
        detail: "关键路径、刷新和移动端都要走一遍",
      },
      {
        label: "监控信号",
        title: "上线后能看见风险",
        detail: "错误率、耗时、业务成功率和 AI 失败率要可观察",
      },
      {
        label: "回滚方案",
        title: "写清触发条件和退路",
        detail: "什么时候退、怎么退、退后怎么证明恢复",
      },
    ],
    baseline: {
      label: "上线城门已点灯",
      title: "先把“构建通过”变成上线证据链",
      body: "这一关训练你做上线前检查。构建通过和桌面能打开，只能证明一小段路径可用；真正上线要看计划、生产配置、备份恢复、冒烟测试、监控信号和回滚方案。",
      action: "进入上线城门",
    },
    practical: {
      title: "在上线门禁沙盒里拦住不安全发布",
      sandboxPath: "sandbox/release-readiness-gate",
      statusPassed:
        "上线门禁能识别缺负责人、缺生产密钥、备份未恢复测试、缺 390px 冒烟、缺监控信号和回滚计划不完整。",
      statusFailed:
        "失败报告会指出：门禁仍把构建通过误当成可上线，没有检查配置、数据、移动端、监控或回滚证据。",
    },
    result: {
      label: "上线门禁闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一次可回滚上线准备",
      body: (hintLevel) =>
        `你把“可以部署吗”拆成了上线计划、生产环境、数据备份、冒烟路径、监控信号和回滚退路。现在你能说明什么时候不能上线、缺什么证据、出事时怎么退。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved:
        "上线门禁覆盖负责人、生产变量、备份恢复、桌面/390px 冒烟、监控信号和回滚条件",
      recorded:
        "上线计划、环境变量检查、备份记录、冒烟测试、监控快照、回滚方案、后端日志和 Agent 交付说明",
      pending:
        "换一个真实发布场景继续训练：是否能解释上线窗口、风险阈值、回滚步骤和恢复验证",
      nextTitle: "下一步怎么变成工作里的上线能力？",
      nextItems: [
        "上线前不要只看构建绿灯，要把配置、数据、监控和回滚都变成证据。",
        "如果缺少负责人、生产 key、恢复测试或移动端冒烟，要明确暂缓上线。",
        "面试里把上线讲成可观察、可回退、可复盘的流程，而不是一句“我会部署”。",
      ],
    },
    hints: [
      "先看 release-plan：有发布窗口和影响范围，但 owner/observer 为空，出事时没人判断回滚。",
      "再看 environment、backup 和 smoke-test：生产缺 AI_API_KEY、备份没恢复测试、冒烟缺 390px。",
      "最后看 monitoring、rollback 和 backend.log：缺 AI 失败率信号，回滚条件也没有量化。",
    ],
    verificationStepId: "smoke-test",
    requiredResponseStepIds: [
      "release-plan",
      "environment-check",
      "backup-restore",
      "monitoring-signals",
      "rollback-plan",
      "agent-brief",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "release-plan",
        label: "审上线计划",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 02 · 没有负责人和值守人，不能放心上线",
          prompt: "用 release-plan 判断这次上线计划还缺什么",
          placeholder:
            "这份计划有发布窗口和影响范围……但 owner/observer 是……这意味着事故发生时……所以我会要求补……",
          minimum: 90,
          instruction:
            "不要只写“计划不完整”。指出发布窗口、影响范围、负责人和值守人的作用。",
          artifactIds: ["release-plan", "release-gate"],
          flowStrip: ["发布窗口", "影响范围", "负责人", "值守人"],
        },
      },
      {
        id: "environment-check",
        label: "查生产配置",
        icon: LockKeyhole,
        kind: "response",
        response: {
          title: "阶段 03 · 本地有 key 不等于生产有 key",
          prompt: "用 environment-check 说明为什么当前不能直接上线",
          placeholder:
            "DATABASE_URL 是……AI_API_KEY 是……APP_ORIGIN 是……前端包是否含密钥……这证明……上线前必须……",
          minimum: 110,
          instruction:
            "区分生产变量缺失和密钥泄露：缺 key 会导致功能失败，泄露 key 会造成安全事故。",
          artifactIds: ["environment", "logs"],
          rubricItems: [
            "是否指出 AI_API_KEY missing",
            "是否说明 safeToShow",
            "是否检查前端包无密钥",
            "是否提到功能开关",
          ],
        },
      },
      {
        id: "backup-restore",
        label: "验备份恢复",
        icon: Database,
        kind: "response",
        response: {
          title: "阶段 04 · 有备份不等于能恢复",
          prompt: "用 backup-record 说明备份证据哪里不够",
          placeholder:
            "这次 requiresBackup 是……backupId 是……但 restoreTested 是……recoveryTimeMinutes 是……所以它只能证明……不能证明……",
          minimum: 100,
          instruction:
            "数据相关上线要证明恢复路径真实跑过；否则备份文件只是安慰剂。",
          artifactIds: ["backup", "logs"],
          flowStrip: ["需要备份", "备份位置", "恢复测试", "恢复耗时"],
        },
      },
      {
        id: "smoke-test",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "monitoring-signals",
        label: "查监控信号",
        icon: Network,
        kind: "response",
        response: {
          title: "阶段 05 · 上线后要能看见坏消息",
          prompt: "用 monitoring-snapshot 和 backend.log 判断监控还缺什么",
          placeholder:
            "监控里有 errorRate、p95LatencyMs 和 saveSuccessRate……但缺少……backend.log 也提示……这意味着上线后无法判断……",
          minimum: 100,
          instruction:
            "监控不是装饰。它要让你在上线后看到错误、变慢和核心业务失败。",
          artifactIds: ["monitoring", "logs"],
          rubricItems: [
            "是否引用 errorRate",
            "是否引用 p95LatencyMs",
            "是否引用 saveSuccessRate",
            "是否指出缺 AI 调用失败率",
          ],
        },
      },
      {
        id: "rollback-plan",
        label: "写回滚退路",
        icon: RefreshCw,
        kind: "response",
        response: {
          title: "阶段 06 · 回滚不能只写“页面打不开就退”",
          prompt: "用 rollback-plan 写出可执行的回滚要求",
          placeholder:
            "当前回滚方案只写……缺少量化触发条件……缺少步骤……缺少回滚后验证……我会要求写成……",
          minimum: 130,
          instruction:
            "回滚方案要回答：什么指标触发、执行哪些步骤、退回后用什么路径证明恢复。",
          artifactIds: ["rollback", "smoke-test", "logs"],
        },
      },
      {
        id: "agent-brief",
        label: "给 Agent 补证任务",
        icon: FileCode2,
        kind: "response",
        response: {
          title: "阶段 07 · 把暂缓上线写成 Agent 可执行任务",
          prompt: "给 Agent 写一份补齐上线门禁证据的任务",
          placeholder:
            "背景：第 14 章上线门禁还会误放行……\n缺失证据：……\n目标：……\n范围/约束：……\n验收命令和浏览器路径：……\n回滚和风险：……",
          minimum: 140,
          instruction: "任务要明确补哪些证据，不要只写“完善上线检查”。",
          artifactIds: ["delivery", "release-plan", "environment"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 08 · 面试复盘",
          prompt: "把这一关讲成一次你如何准备安全上线的项目经历",
          placeholder:
            "我没有把构建通过等同于可上线……我核对了发布窗口、生产变量、备份恢复、390px 冒烟、监控和回滚……最后暂缓上线，因为……这说明我能……",
          minimum: 130,
          warning: {
            title: "这不是背上线清单",
            body: "面试官想听的是：你如何用证据判断能不能上线、如何提前设计回滚和监控，而不是只说会点部署。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "用户可见入口：上线门禁面板",
        focus: "只看 status、missing 和 release.name。",
        keyLines: ["可以放行", "暂缓上线", "requestedEvidence"],
        proves: "前端能展示上线门禁结论和缺失证据。",
        cannotProve: "不能证明门禁真的检查了配置、备份、监控和回滚。",
      },
      "release-gate": {
        place: "上线门禁：当前误把构建和冒烟当全部",
        focus: "只看 reviewReleaseReadiness 和 buildReleaseDecision。",
        keyLines: [
          'build?.status === "passed"',
          "smokeTest?.passed",
          'decision: "release"',
        ],
        proves: "当前门禁只要构建和冒烟通过就放行。",
        cannotProve: "不能证明计划、环境、备份、监控和回滚都合格。",
      },
      "release-plan": {
        place: "上线计划：谁负责，谁值守",
        focus: "只看 window、impact、owner、observer 和 smokePath。",
        keyLines: ["2026-07-05 22:00-23:00", "owner", "observer"],
        proves: "计划有窗口和影响范围，但缺负责人和值守人。",
        cannotProve: "不能证明事故发生时有人判断回滚。",
      },
      environment: {
        place: "生产配置：缺 key 和泄密是两类风险",
        focus:
          "只看 AI_API_KEY、safeToShow、featureFlag 和 frontendBundleContainsSecret。",
        keyLines: ["AI_API_KEY", "missing", "frontendBundleContainsSecret"],
        proves: "生产缺 AI_API_KEY，同时前端包没有暴露密钥。",
        cannotProve: "不能证明 AI 功能上线后能调用成功。",
      },
      backup: {
        place: "数据退路：备份是否真的可恢复",
        focus:
          "只看 requiresBackup、backupId、restoreTested 和 recoveryTimeMinutes。",
        keyLines: [
          "requiresBackup",
          "restoreTested: false",
          "recoveryTimeMinutes",
        ],
        proves: "有备份记录，但没有恢复测试和恢复耗时。",
        cannotProve: "不能证明上线失败后数据能恢复。",
      },
      "smoke-test": {
        place: "冒烟路径：桌面通过不等于全路径通过",
        focus: "只看 paths、missing 和 explain。",
        keyLines: ["1280px", "desktop-refresh", "390px 移动端路径"],
        proves: "桌面路径和刷新路径有记录。",
        cannotProve: "不能证明 390px 移动端和登录后保存主路径可用。",
      },
      monitoring: {
        place: "上线监控：上线后能不能看见坏消息",
        focus: "只看 errorRate、p95LatencyMs、saveSuccessRate 和 explain。",
        keyLines: ["errorRate", "p95LatencyMs", "saveSuccessRate"],
        proves: "已有错误率、延迟和保存成功率信号。",
        cannotProve: "不能证明 AI 调用失败率可观察。",
      },
      rollback: {
        place: "回滚退路：什么时候退，怎么退，怎么验",
        focus: "只看缺口和面试表达。",
        keyLines: [
          "没有量化触发条件",
          "没有说明回滚步骤",
          "没有写回滚后验证路径",
        ],
        proves: "当前回滚方案太空泛，不能指导真实事故处理。",
        cannotProve: "不能证明上线风险可控。",
      },
      logs: {
        place: "后端旁证：上线门禁拦截理由",
        focus: "只看 requestId 和 code。",
        keyLines: [
          "MISSING_RELEASE_OWNER",
          "MISSING_ENV_VAR",
          "UNVERIFIED_BACKUP_RESTORE",
          "MISSING_MOBILE_SMOKE",
          "MISSING_MONITORING_SIGNAL",
          "MISSING_ROLLBACK_PLAN",
        ],
        proves: "日志能串起六个暂缓上线理由。",
        cannotProve: "日志不能替代沙盒测试和浏览器冒烟。",
      },
      delivery: {
        place: "Agent 交付说明：构建通过是否等于可上线",
        focus: "只看摘要、验证证据、风险和审查提醒。",
        keyLines: ["构建通过，可以上线", "`npm run verify` 通过", "风险：暂无"],
        proves: "Agent 给出了构建和桌面入口证据。",
        cannotProve: "不能证明生产变量、备份恢复、390px、监控和回滚都合格。",
      },
    },
  },
  [CASE15_SCENARIO_ID]: {
    scenarioId: CASE15_SCENARIO_ID,
    missionLabel: "主线 1-15 · AI 应用开发",
    missionTitle: "终章答辩厅",
    duration: "45-90 分钟 · 产出面试答辩作品集",
    backgroundImage: questStage,
    flowAriaLabel: "从关卡证据到可追问面试回答的答辩路线",
    flowEyebrow: "本关路线",
    flowTitle:
      "答辩官不收空泛自夸，只收 STAR、故障复盘、技术取舍、追问和边界证据",
    flowItems: [
      {
        label: "项目素材",
        title: "从 14 章里挑证据",
        detail: "每段经历都要能指向 Network、日志、数据库、测试或浏览器路径",
      },
      {
        label: "STAR 结构",
        title: "把经历讲完整",
        detail: "背景、任务、行动和结果缺一段，面试官都会继续追问",
      },
      {
        label: "故障复盘",
        title: "讲清现象到验证",
        detail: "不是只说修好了，而是说明证据、根因、修复和复测",
      },
      {
        label: "技术取舍",
        title: "说明选择和代价",
        detail: "会选方案，也要讲放弃了什么、承担了什么成本",
      },
      {
        label: "追问演练",
        title: "让回答扛住追问",
        detail: "用 Agent 面试官追问证据边界，删掉背模板和夸大表达",
      },
      {
        label: "答辩定稿",
        title: "形成可复用作品集",
        detail: "最终回答要能展示、能解释、能验收，也承认真人学习边界",
      },
    ],
    baseline: {
      label: "终章答辩钟已敲响",
      title: "先把“我做过项目”变成可追问证据",
      body: "这一关训练你把前 14 章的通关产出整理成面试回答。面试官不只听你用过什么技术，还会问你怎么证明、为什么这样选、出错后怎么复盘、哪些结果仍需要真人验证。",
      action: "进入终章答辩厅",
    },
    practical: {
      title: "在答辩作品集沙盒里打磨面试回答",
      sandboxPath: "sandbox/interview-answer-forge",
      statusPassed:
        "答辩校验器能拒绝缺 STAR 结果、缺项目证据、故障复盘无验证、技术取舍无代价、追问不足和夸大学习效果的回答。",
      statusFailed:
        "失败报告会指出：当前校验器只看 opening 长度，放过了空泛自夸、缺结果、缺验证、缺追问和夸大掌握。",
    },
    result: {
      label: "终章答辩闭环通过 · 成长档案已更新",
      title: "这次通关可以讲成一套可追问的项目复盘",
      body: (hintLevel) =>
        `你把前 14 章素材整理成了 STAR、故障复盘、技术取舍、追问答案和边界说明。现在你不只是说“我做过 AI 项目”，而是能讲清证据、行动、结果、代价和未验证边界。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
      proved:
        "面试答辩覆盖 STAR 完整性、至少两项项目证据、故障验证、技术取舍代价、三个追问和不夸大边界",
      recorded:
        "项目素材库、STAR 草稿、故障复盘、技术取舍笔记、追问清单、Rubric、Agent 面试官和后端日志",
      pending:
        "换一个岗位 JD 继续训练：是否能把同一项目经历改写成更贴合岗位的回答",
      nextTitle: "下一步怎么变成真正的求职表达？",
      nextItems: [
        "每个回答都要从证据出发，不要只说熟悉技术或让 Agent 帮忙。",
        "讲项目时要主动说明取舍、风险和未真人验证边界，避免过度承诺。",
        "让 Agent 扮演面试官持续追问，直到回答能经得起细节追问。",
      ],
    },
    hints: [
      "先看 story-bank：第 13 章只有 Diff 范围摘要，证据链不够厚。",
      "再看 star-draft、incident-review 和 tradeoff：STAR 缺 result，故障复盘缺 verification，取舍缺 cost。",
      "最后看 follow-ups、rubric、backend.log 和 agent-interviewer：追问只有 2 个，还出现了“已经完全掌握”的夸大表达。",
    ],
    verificationStepId: "answer-dossier",
    requiredResponseStepIds: [
      "story-bank",
      "star-answer",
      "incident-review",
      "tradeoff",
      "follow-up-drill",
      "interview-dossier",
    ],
    steps: [
      {
        id: "baseline-plan",
        label: "任务委托",
        icon: CircleDot,
        kind: "baseline",
      },
      {
        id: "story-bank",
        label: "整理项目素材",
        icon: BookOpen,
        kind: "response",
        response: {
          title: "阶段 02 · 项目素材必须来自证据",
          prompt: "用 story-bank 判断哪些素材能进入面试回答",
          placeholder:
            "素材库里第 1 章有……证据是……第 7 章能证明……第 13 章只有……所以我会补……",
          minimum: 110,
          instruction:
            "不要只列章节名。指出每个素材对应的能力、证据和面试用途。",
          artifactIds: ["story-bank", "rubric"],
          flowStrip: ["章节", "能力", "证据", "面试用途"],
        },
      },
      {
        id: "star-answer",
        label: "修 STAR 草稿",
        icon: Trophy,
        kind: "response",
        response: {
          title: "阶段 03 · STAR 缺结果就不是完整经历",
          prompt: "用 star-draft 找出这段回答为什么不能直接用于面试",
          placeholder:
            "这份 STAR 有 situation、task、action……但 result 是……opening 里还写了……这会导致……我会改成……",
          minimum: 120,
          instruction:
            "结果必须是可验证结果，不能写“已经完全掌握”“保证不会出错”。",
          artifactIds: ["star-draft", "logs"],
          rubricItems: [
            "是否指出 result 为空",
            "是否识别夸大掌握表述",
            "是否补可验证结果",
            "是否区分学习效果和工程证据",
          ],
        },
      },
      {
        id: "incident-review",
        label: "补故障复盘",
        icon: Search,
        kind: "response",
        response: {
          title: "阶段 04 · 排障回答必须讲到验证",
          prompt: "用 incident-review 说明故障复盘还缺哪一段",
          placeholder:
            "现象是……证据是……根因是……修复是……但 verification 是……所以它只能证明……不能证明……",
          minimum: 120,
          instruction:
            "故障复盘要闭环到修复后的验证动作，例如刷新、数据库查询、测试或浏览器路径。",
          artifactIds: ["incident-review", "logs"],
          flowStrip: ["现象", "证据", "根因", "修复", "验证"],
        },
      },
      {
        id: "tradeoff",
        label: "讲技术取舍",
        icon: ShieldCheck,
        kind: "response",
        response: {
          title: "阶段 05 · 取舍不是只说我选了什么",
          prompt: "用 tradeoff-notes 说明这段技术取舍为什么还不完整",
          placeholder:
            "两个方案是……选择是……验证是……但 cost 是……面试官会追问……我会补充代价是……",
          minimum: 120,
          instruction: "取舍要讲候选方案、选择理由、代价、边界和验证方式。",
          artifactIds: ["tradeoff", "rubric"],
          rubricItems: [
            "是否说出两个候选方案",
            "是否说明选择服务端代理",
            "是否补代价",
            "是否引用密钥扫描或结构化错误验证",
          ],
        },
      },
      {
        id: "answer-dossier",
        label: "沙盒修复与测试",
        icon: TerminalSquare,
        kind: "verification",
      },
      {
        id: "follow-up-drill",
        label: "Agent 追问演练",
        icon: HelpCircle,
        kind: "response",
        response: {
          title: "阶段 06 · 让 Agent 面试官追问到边界清楚",
          prompt:
            "用 follow-up-questions 和 agent-interviewer 补至少一个追问答案",
          placeholder:
            "已有追问覆盖了……但 Rubric 要求至少 3 个。Agent 面试官还会问……我的补充回答会引用……",
          minimum: 130,
          instruction: "追问答案必须来自证据，不能只写“我会排查、我会优化”。",
          artifactIds: ["follow-ups", "agent-interviewer", "rubric", "logs"],
          flowStrip: ["追问", "证据", "边界", "补充回答"],
        },
      },
      {
        id: "interview-dossier",
        label: "面试复盘",
        icon: FlaskConical,
        kind: "response",
        response: {
          title: "阶段 07 · 终章面试复盘",
          prompt: "把这条 AI 开发路线讲成一段可追问的项目经历",
          placeholder:
            "这个项目不是普通课程页……我把它拆成 15 章工程闯关……其中一次故障复盘是……我用……证明……技术取舍是……如果被追问，我会回答……未验证边界是……",
          minimum: 160,
          warning: {
            title: "不要把学习效果说满",
            body: "可以说你整理了工程证据和复盘路径；不能说所有用户已经学会，除非有真人试玩和复测证据。",
          },
        },
      },
    ],
    artifactGuides: {
      frontend: {
        place: "用户可见入口：答辩故事板",
        focus: "只看 answer.opening、requestedRevisions 和缺口列表。",
        keyLines: ["answer.opening", "requestedRevisions", "missing.map"],
        proves: "前端能展示面试开场和需要修改的答辩缺口。",
        cannotProve: "不能证明回答真的满足 STAR、证据、取舍和追问要求。",
      },
      reviewer: {
        place: "面试稿校验器：当前误把长度当质量",
        focus: "只看 reviewInterviewAnswer 和 buildInterviewDossier。",
        keyLines: [
          'answer.opening ?? ""',
          "length > 80",
          "requestedRevisions: []",
        ],
        proves: "当前校验器只要 opening 足够长就放行。",
        cannotProve:
          "不能证明 STAR、项目证据、故障验证、技术取舍、追问和学习边界都合格。",
      },
      "story-bank": {
        place: "项目素材库：素材是否有证据",
        focus: "只看 chapter、ability、evidence 和 interviewUse。",
        keyLines: ["Network POST 201", "SQLite SELECT 0 rows", "Diff 范围摘要"],
        proves: "素材库已把章节能力和部分证据连起来。",
        cannotProve: "不能证明每个素材都有足够厚的证据链。",
      },
      "star-draft": {
        place: "STAR 草稿：结果和边界是否可靠",
        focus: "只看 opening、star.result 和 explain。",
        keyLines: ["已经完全掌握", '"result": ""', "缺少可验证结果"],
        proves: "草稿有背景、任务和行动，但缺结果，并且有夸大表达。",
        cannotProve: "不能证明这段回答能被面试官追问。",
      },
      "incident-review": {
        place: "故障复盘：有没有修复后验证",
        focus: "只看 phenomenon、evidence、rootCause、fix 和 verification。",
        keyLines: [
          "POST 返回 201",
          "数据库查询是 0 rows",
          '"verification": ""',
        ],
        proves: "复盘能讲出现象、证据、根因和修复方向。",
        cannotProve: "不能证明修复后真的刷新、查库或跑测试验证过。",
      },
      tradeoff: {
        place: "技术取舍：选择是否讲了代价",
        focus: "只看 options、choice、cost 和 verification。",
        keyLines: ["前端直接调模型 API", "服务端代理模型 API", '"cost": ""'],
        proves: "笔记能说明选择了服务端代理，并有密钥验证方向。",
        cannotProve: "不能证明候选方案的代价和边界已经讲清。",
      },
      "follow-ups": {
        place: "追问清单：回答能不能扛住细节",
        focus: "只看 question 和 answer 数量。",
        keyLines: [
          "为什么 201 不能证明数据落库？",
          "如果 RAG 引用错了怎么办？",
        ],
        proves: "已有两个基于证据的追问答案。",
        cannotProve: "不能满足至少三个追问答案的 Rubric。",
      },
      rubric: {
        place: "答辩 Rubric：面试稿验收标准",
        focus: "只看 mustHave 和 rejectWhen。",
        keyLines: ["STAR 四段完整", "至少两个项目证据", "不夸大真人学习效果"],
        proves: "Rubric 明确了面试稿必须满足的证据门槛。",
        cannotProve: "不能证明当前草稿已经满足这些门槛。",
      },
      "agent-interviewer": {
        place: "Agent 面试官：用追问检查理解",
        focus: "只看四个追问和提醒。",
        keyLines: [
          "怎么证明不是只改了提示文案？",
          "什么情况下你会拒收？",
          "什么时候回滚？",
        ],
        proves: "Agent 可以扮演面试官，逼回答回到证据和边界。",
        cannotProve: "不能替代真人面试反馈。",
      },
      logs: {
        place: "后端旁证：答辩校验失败原因",
        focus: "只看 requestId 和 code。",
        keyLines: [
          "MISSING_STAR_SECTION",
          "MISSING_PROJECT_EVIDENCE",
          "INCOMPLETE_INCIDENT_REVIEW",
          "MISSING_TRADEOFF",
          "MISSING_FOLLOW_UPS",
          "OVERCLAIMED_LEARNING_RESULT",
        ],
        proves: "日志能串起六个不能进入面试稿的原因。",
        cannotProve: "日志不能替代沙盒测试和真人追问。",
      },
    },
  },
};

function getLabConfig(scenarioId: string) {
  return labConfigs[scenarioId] ?? labConfigs[SCENARIO_ID];
}

const chapterScenarioIds: Partial<Record<number, string>> = {
  1: SCENARIO_ID,
  2: CASE02_SCENARIO_ID,
  3: CASE03_SCENARIO_ID,
  4: CASE04_SCENARIO_ID,
  5: CASE05_SCENARIO_ID,
  6: CASE06_SCENARIO_ID,
  7: CASE07_SCENARIO_ID,
  8: CASE08_SCENARIO_ID,
  9: CASE09_SCENARIO_ID,
  10: CASE10_SCENARIO_ID,
  11: CASE11_SCENARIO_ID,
  12: CASE12_SCENARIO_ID,
  13: CASE13_SCENARIO_ID,
  14: CASE14_SCENARIO_ID,
  15: CASE15_SCENARIO_ID,
};

function getScenarioIdForChapter(chapter: number) {
  return chapterScenarioIds[chapter] ?? SCENARIO_ID;
}

const companionPortraits: Record<string, string> = {
  档案馆记录员: archiveKeeperPortrait,
  回廊守卫: identityGuardPortrait,
  审判庭书记员: apiClerkPortrait,
  塔楼副官: toolWardenPortrait,
  验收试炼官: testArbiterPortrait,
  委托书锻造师: briefForgemasterPortrait,
  交付审查官: deliveryJudgePortrait,
  上线守门人: releaseGatekeeperPortrait,
  终章答辩官: interviewCouncilorPortrait,
  幂等石灵: idempotencyStonePet,
  雾灯猫: foglampCatPet,
  密钥匣: keyVaultEquipment,
  镜厅校对师: mirrorEditorPortrait,
  检索狐: retrievalFoxPet,
};

type ChapterReward = {
  chapter: CareerChapter;
  xpGained: number;
  wasAlreadyCleared: boolean;
  beforeRank: DeveloperProfile["rank"];
  afterRank: DeveloperProfile["rank"];
};

type CompanionArchiveEntry = {
  chapter: CareerChapter;
  collected: boolean;
  status: string;
  portrait: string | undefined;
};

const INTERVIEW_DOSSIER_STEP_ID = "interview-dossier";

const interviewDossierFields = [
  {
    id: "phenomenon",
    label: "现象",
    title: "先讲发生了什么",
    prompt: "例：用户点击保存后页面显示成功，但刷新后列表变空。",
  },
  {
    id: "evidence",
    label: "定位证据",
    title: "再讲你怎么判断断点",
    prompt:
      "例：Network 是 201，但数据库 SELECT 是 0 行，所以不能只信前端成功提示。",
  },
  {
    id: "action",
    label: "行动/修改",
    title: "说明你做了什么推进",
    prompt: "例：沿前端、路由、数据层逐段查，要求 Agent 补充测试和持久化写入。",
  },
  {
    id: "verification",
    label: "验证动作",
    title: "证明结果真的成立",
    prompt: "例：重新保存、刷新、查看数据库行数，并跑测试确认不会回归。",
  },
  {
    id: "transfer",
    label: "可迁移经验",
    title: "落到工作和面试表达",
    prompt: "例：我学会了用证据链判断成功提示和真实落库之间的差别。",
  },
] as const;

type InterviewDossierFieldId = (typeof interviewDossierFields)[number]["id"];

function dossierResponseKey(
  chapterId: string,
  fieldId: InterviewDossierFieldId,
) {
  return `chapter-${chapterId}-${fieldId}`;
}

function readDossierFields(
  response: Record<string, string>,
  chapterId: string,
): Record<InterviewDossierFieldId, string> {
  return Object.fromEntries(
    interviewDossierFields.map((field) => [
      field.id,
      response[dossierResponseKey(chapterId, field.id)] ?? "",
    ]),
  ) as Record<InterviewDossierFieldId, string>;
}

function getDossierReferenceFields(
  chapter: CareerChapter,
): Record<InterviewDossierFieldId, string> {
  return {
    phenomenon: chapter.storyScene,
    evidence: `${chapter.flow}。证据任务：${chapter.evidenceTask}`,
    action: chapter.agentCollaboration,
    verification: chapter.acceptanceAction,
    transfer: chapter.interviewReview,
  };
}

function buildInterviewPortfolioMarkdown(
  developer: DeveloperProfile,
  response: Record<string, string>,
) {
  const lines = [
    "# 码上冒险 · AI 应用开发面试作品集",
    "",
    `身份：${developer.rank} · ${developer.xp} XP · 已通关 ${developer.missionsCleared} 章`,
    "边界：这是学习项目复盘草稿，用来训练面试表达；自动化只能证明工程路径可用，真人学习效果仍需试玩验证。",
    "",
  ];

  for (const chapter of aiCareerRoadmap) {
    const saved = readDossierFields(response, chapter.id);
    const reference = getDossierReferenceFields(chapter);

    lines.push(`## 第 ${chapter.id} 章 · ${chapter.title}`);
    lines.push("");
    lines.push(`- 工作场景：${chapter.workBackground}`);
    lines.push(`- 学会：${chapter.learn}`);
    lines.push(`- 验收目标：${chapter.validation}`);

    for (const field of interviewDossierFields) {
      const value = saved[field.id].trim();
      lines.push(
        `- ${field.label}：${
          value || `待填写，可参考路线素材：${reference[field.id]}`
        }`,
      );
    }

    lines.push(`- 面试表达：${chapter.interviewReview}`);
    lines.push("");
  }

  return lines.join("\n");
}

function scrollPageToTop() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

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
        <small>AI CAREER RPG</small>
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

function RoleAvatar() {
  return (
    <div className="role-avatar" aria-hidden="true">
      <div className="avatar-screen">
        <span />
        <i />
      </div>
      <div className="avatar-core" />
      <div className="avatar-rune one" />
      <div className="avatar-rune two" />
      <div className="avatar-base" />
    </div>
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

function ArtifactViewer({
  artifacts,
  guides,
}: {
  artifacts: Artifact[];
  guides: Record<string, ArtifactGuide>;
}) {
  const [selectedId, setSelectedId] = useState(artifacts[0]?.id ?? "");
  const selected =
    artifacts.find((artifact) => artifact.id === selectedId) ?? artifacts[0];
  const guide = selected ? guides[selected.id] : undefined;

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
      {guide && (
        <section className="artifact-reading-guide">
          <span>阅读导览 · {guide.place}</span>
          <strong>{guide.focus}</strong>
          <div>
            <b>这次只盯住</b>
            {guide.keyLines.map((line) => (
              <code key={line}>{line}</code>
            ))}
          </div>
          <dl>
            <div>
              <dt>能证明</dt>
              <dd>{guide.proves}</dd>
            </div>
            <div>
              <dt>不能证明</dt>
              <dd>{guide.cannotProve}</dd>
            </div>
          </dl>
        </section>
      )}
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

function LabFlowMap({ config }: { config: LabConfig }) {
  return (
    <section className="lab-flow-map" aria-label={config.flowAriaLabel}>
      <span>{config.flowEyebrow}</span>
      <strong>{config.flowTitle}</strong>
      <div>
        {config.flowItems.map((item, index) => (
          <article key={item.label}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <b>{item.label}</b>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
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
          {saved ? "记录已保存" : "保存并继续"}
        </button>
      </footer>
      {error && <p className="form-error">{error}</p>}
    </section>
  );
}

function VerificationPanel({
  attempt,
  onVerify,
  config,
}: {
  attempt: Attempt;
  onVerify: () => Promise<void>;
  config: LabConfig;
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
          <h2>{config.practical.title}</h2>
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
            <code>{config.practical.sandboxPath}</code>
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
              ? config.practical.statusPassed
              : status === "failed"
                ? config.practical.statusFailed
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

function CareerDossier({
  hintLevel,
  config,
}: {
  hintLevel: number;
  config: LabConfig;
}) {
  return (
    <section className="result-page">
      <span className="result-medal">
        <Trophy />
      </span>
      <span className="mini-label">{config.result.label}</span>
      <h1>{config.result.title}</h1>
      <p>{config.result.body(hintLevel)}</p>
      <div className="dossier-summary">
        <div>
          <CheckCircle2 />
          <span>
            <strong>已证明</strong>
            {config.result.proved}
          </span>
        </div>
        <div>
          <CheckCircle2 />
          <span>
            <strong>已记录</strong>
            {config.result.recorded}
          </span>
        </div>
        <div className="pending">
          <Clock3 />
          <span>
            <strong>仍待证明</strong>
            {config.result.pending}
          </span>
        </div>
      </div>
      <div className="rubric-box">
        <h2>{config.result.nextTitle}</h2>
        <ul>
          {config.result.nextItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>本次提示等级为 {hintLevel}，后续尽量减少提示依赖。</li>
        </ul>
      </div>
    </section>
  );
}

function ChapterRewardGate({
  developer,
  reward,
  onBackToRoadmap,
}: {
  developer: DeveloperProfile;
  reward: ChapterReward;
  onBackToRoadmap: () => void;
}) {
  const unlock = reward.chapter.companionUnlock;
  const portrait = companionPortraits[unlock.name];
  const nextRank = getNextRank(developer.xp);
  const rankChanged = reward.beforeRank !== reward.afterRank;

  return (
    <main
      className="quest-shell chapter-reward-gate"
      style={{ "--quest-bg": `url(${questArchive})` } as CSSProperties}
    >
      <div className="quest-camera" />
      <header className="quest-hud" aria-label="章节结算">
        <div>
          <span>{developer.rank}</span>
          <strong>{developer.xp} XP</strong>
        </div>
        <div>
          <span>主线</span>
          <strong>第 {reward.chapter.id} 章</strong>
        </div>
      </header>

      <section className="chapter-reward-stage">
        <div className="reward-portrait-card">
          {portrait ? (
            <img src={portrait} alt={unlock.name} />
          ) : (
            <div className="reward-portrait-fallback">
              {unlock.name.slice(0, 1)}
            </div>
          )}
          <span>{unlock.type}解锁</span>
          <strong>{unlock.name}</strong>
          <p>{unlock.description}</p>
        </div>

        <div className="mission-dossier reward-dossier">
          <span>章节结算 · {reward.chapter.world}</span>
          <h1>
            第 {reward.chapter.id} 章已通关：{reward.chapter.theme}
          </h1>
          <p>{reward.chapter.summary}</p>
          <blockquote>{reward.chapter.interviewReview}</blockquote>

          <div className="reward-ledger" aria-label="本章奖励">
            <div>
              <b>XP</b>
              <strong>
                {reward.wasAlreadyCleared ? "复习完成" : `+${reward.xpGained}`}
              </strong>
              <span>
                {reward.wasAlreadyCleared
                  ? "已通关章节不重复刷能力分"
                  : rankChanged
                    ? `阶位提升：${reward.beforeRank} → ${reward.afterRank}`
                    : nextRank
                      ? `距离 ${nextRank.name} 还差 ${nextRank.need} XP`
                      : "已到当前最高阶位"}
              </span>
            </div>
            <div>
              <b>能力印记</b>
              <strong>{reward.chapter.learn}</strong>
              <span>{reward.chapter.validation}</span>
            </div>
          </div>

          <div className="reward-chip-grid" aria-label="本章收获">
            {reward.chapter.rewards.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="reward-boundary">
            <ShieldCheck size={17} />
            <p>
              本章剧情教学证明你看懂了路线和证据边界。要证明真实工程能力，
              后续还需要完成独立沙盒、测试报告和复盘迁移。
            </p>
          </div>

          <button className="dialogue-next" onClick={onBackToRoadmap}>
            回到路线图，查看伙伴图鉴 <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </main>
  );
}

function CompanionArchive({ entries }: { entries: CompanionArchiveEntry[] }) {
  const [filter, setFilter] = useState<"all" | "collected" | "available">(
    "all",
  );
  const defaultEntry =
    [...entries].reverse().find((entry) => entry.collected) ?? entries[0];
  const [selectedChapterId, setSelectedChapterId] = useState(
    defaultEntry?.chapter.id ?? "1",
  );
  const filteredEntries = entries.filter((entry) =>
    filter === "collected"
      ? entry.collected
      : filter === "available"
        ? !entry.collected && entry.status === "可获取"
        : true,
  );
  const selected =
    entries.find((entry) => entry.chapter.id === selectedChapterId) ??
    defaultEntry;
  const collectedCount = entries.filter((entry) => entry.collected).length;

  return (
    <section className="companion-archive" aria-label="伙伴背包">
      <header className="companion-archive-head">
        <div>
          <span>伙伴背包</span>
          <strong>
            已收集能力 {collectedCount}/{entries.length}
          </strong>
          <p>每个解锁物都对应一章工程能力，也对应一段可复盘的面试素材。</p>
        </div>
        <div className="archive-filter" role="group" aria-label="收藏筛选">
          {[
            ["all", "全部"],
            ["collected", "已收集"],
            ["available", "可获取"],
          ].map(([id, label]) => (
            <button
              className={filter === id ? "active" : ""}
              key={id}
              onClick={() => setFilter(id as typeof filter)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="companion-archive-grid">
        <div className="archive-list" aria-label="解锁物列表">
          {filteredEntries.map((entry) => (
            <button
              className={`${entry.collected ? "collected" : ""} ${
                selected?.chapter.id === entry.chapter.id ? "active" : ""
              }`}
              key={entry.chapter.id}
              onClick={() => setSelectedChapterId(entry.chapter.id)}
              type="button"
            >
              {entry.portrait ? (
                <img src={entry.portrait} alt="" />
              ) : (
                <i>{entry.chapter.companionUnlock.name.slice(0, 1)}</i>
              )}
              <span>
                <small>
                  第 {entry.chapter.id} 章 ·{" "}
                  {entry.chapter.companionUnlock.type}
                </small>
                <strong>{entry.chapter.companionUnlock.name}</strong>
                <b>{entry.status}</b>
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <article
            className={`archive-detail ${selected.collected ? "collected" : ""}`}
          >
            <div className="archive-detail-portrait">
              {selected.portrait ? (
                <img
                  src={selected.portrait}
                  alt={selected.chapter.companionUnlock.name}
                />
              ) : (
                <i>{selected.chapter.companionUnlock.name.slice(0, 1)}</i>
              )}
            </div>
            <div className="archive-detail-body">
              <span>
                {selected.collected ? "已归队" : "等待解锁"} ·{" "}
                {selected.chapter.world}
              </span>
              <h2>{selected.chapter.companionUnlock.name}</h2>
              <p>{selected.chapter.companionUnlock.description}</p>
              <dl>
                <div>
                  <dt>能力印记</dt>
                  <dd>{selected.chapter.learn}</dd>
                </div>
                <div>
                  <dt>工作场景</dt>
                  <dd>{selected.chapter.workBackground}</dd>
                </div>
                <div>
                  <dt>面试复盘</dt>
                  <dd>{selected.chapter.interviewReview}</dd>
                </div>
              </dl>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

function InterviewDossierBook({
  entries,
  onOpenDossier,
  onOpenPortfolio,
}: {
  entries: CompanionArchiveEntry[];
  onOpenDossier: (chapterId: string) => void;
  onOpenPortfolio: () => void;
}) {
  const defaultEntry =
    [...entries].reverse().find((entry) => entry.collected) ?? entries[0];
  const [selectedChapterId, setSelectedChapterId] = useState(
    defaultEntry?.chapter.id ?? "1",
  );
  const selected =
    entries.find((entry) => entry.chapter.id === selectedChapterId) ??
    defaultEntry;

  if (!selected) return null;

  const chapter = selected.chapter;
  const dossierRows = [
    {
      label: "现象",
      title: "先讲为什么会发生这件事",
      content: chapter.storyScene,
    },
    {
      label: "定位证据",
      title: "再讲你沿着哪条链路判断",
      content: `${chapter.flow}。证据任务：${chapter.evidenceTask}`,
    },
    {
      label: "行动/修改",
      title: "说明你怎么推进，不只说“我做了”",
      content: chapter.agentCollaboration,
    },
    {
      label: "验证动作",
      title: "证明结果真的成立",
      content: chapter.acceptanceAction,
    },
    {
      label: "可迁移经验",
      title: "最后落到工作和面试表达",
      content: chapter.interviewReview,
    },
  ];

  return (
    <section className="interview-dossier-book" aria-label="面试复盘册">
      <header className="dossier-book-head">
        <div>
          <span>面试复盘册</span>
          <strong>把每章通关产出整理成可讲述项目经历</strong>
          <p>
            先用固定结构练表达：现象、定位、行动、验证、迁移。这里只整理素材，
            不把剧情教学冒充真实工作经验。
          </p>
        </div>
        <select
          aria-label="选择复盘章节"
          onChange={(event) => setSelectedChapterId(event.target.value)}
          value={selectedChapterId}
        >
          {entries.map((entry) => (
            <option key={entry.chapter.id} value={entry.chapter.id}>
              第 {entry.chapter.id} 章 · {entry.chapter.theme}
            </option>
          ))}
        </select>
        <div className="dossier-book-actions">
          <button
            className="dossier-book-open secondary"
            onClick={onOpenPortfolio}
            type="button"
          >
            打开作品集 <BookOpen size={15} />
          </button>
          <button
            className="dossier-book-open"
            onClick={() => onOpenDossier(chapter.id)}
            type="button"
          >
            进入复盘房间 <ArrowRight size={15} />
          </button>
        </div>
      </header>

      <article className="dossier-book-card">
        <div className="dossier-book-title">
          <small>
            第 {chapter.id} 章 · {selected.collected ? "已通关" : "待练习"}
          </small>
          <h2>{chapter.title}</h2>
          <p>{chapter.validation}</p>
        </div>
        <div className="dossier-book-rows">
          {dossierRows.map((row, index) => (
            <section key={row.label}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <div>
                <span>{row.label}</span>
                <strong>{row.title}</strong>
                <p>{row.content}</p>
              </div>
            </section>
          ))}
        </div>
      </article>
    </section>
  );
}

function LearningBackupCard({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="backup-card" aria-label="本地备份库">
      <div>
        <span>本地备份库</span>
        <strong>封存学习记录，换设备也能恢复证据线。</strong>
        <p>
          导出 SQLite 学习记录中的诊断、答题、提示、验证、复盘草稿和成长档案；
          不包含真实项目源码或账号信息。
        </p>
      </div>
      <button
        className="dossier-book-open secondary"
        onClick={onOpen}
        type="button"
      >
        打开备份库 <ArrowRight size={15} />
      </button>
    </section>
  );
}

function InterviewPortfolio({
  attempt,
  developer,
  onBack,
  onOpenDossier,
}: {
  attempt: Attempt;
  developer: DeveloperProfile;
  onBack: () => void;
  onOpenDossier: (chapterId: string) => void;
}) {
  const response = useMemo(
    () => attempt.steps[INTERVIEW_DOSSIER_STEP_ID]?.response ?? {},
    [attempt.steps],
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    aiCareerRoadmap[0]?.id ?? "1",
  );
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const markdown = useMemo(
    () => buildInterviewPortfolioMarkdown(developer, response),
    [developer, response],
  );
  const chapters = aiCareerRoadmap.map((chapter) => {
    const saved = readDossierFields(response, chapter.id);
    const filledCount = interviewDossierFields.filter(
      (field) => saved[field.id].trim().length > 0,
    ).length;
    return { chapter, saved, filledCount };
  });
  const selected =
    chapters.find((entry) => entry.chapter.id === selectedChapterId) ??
    chapters[0];
  const selectedReference = getDossierReferenceFields(selected.chapter);
  const totalFilled = chapters.reduce(
    (sum, entry) => sum + entry.filledCount,
    0,
  );
  const totalFields = chapters.length * interviewDossierFields.length;

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <section
      className="dossier-room portfolio-room"
      style={{ "--quest-bg": `url(${archiveNight})` } as CSSProperties}
    >
      <div className="dossier-room-panel portfolio-panel">
        <header className="dossier-room-head portfolio-head">
          <button className="novel-back" onClick={onBack} type="button">
            返回任务简报
          </button>
          <div>
            <span>面试作品集 · AI 应用开发</span>
            <h1>把 15 章通关经历整理成可讲的项目证据。</h1>
            <p>
              左侧选章节补齐故事线，右侧生成
              Markdown。它是学习复盘和面试训练稿，
              不能替代真实项目经历，也不会上传任何代码或个人信息。
            </p>
          </div>
          <div className="portfolio-actions">
            <button
              className="dossier-book-open secondary"
              onClick={() => onOpenDossier(selected.chapter.id)}
              type="button"
            >
              补本章草稿 <FileCode2 size={15} />
            </button>
            <button
              className="dossier-book-open"
              onClick={() => void copyMarkdown()}
              type="button"
            >
              复制 Markdown <BookOpen size={15} />
            </button>
          </div>
          {copyState === "copied" && (
            <p className="dossier-save-ok">已复制作品集 Markdown。</p>
          )}
          {copyState === "failed" && (
            <p className="dossier-save-ok">
              浏览器拒绝剪贴板权限，请直接选中下方 Markdown 复制。
            </p>
          )}
        </header>

        <div className="portfolio-summary" aria-label="作品集完成度">
          <div>
            <span>章节</span>
            <strong>{chapters.length}</strong>
          </div>
          <div>
            <span>复盘字段</span>
            <strong>
              {totalFilled}/{totalFields}
            </strong>
          </div>
          <div>
            <span>当前身份</span>
            <strong>{developer.rank}</strong>
          </div>
        </div>

        <div className="portfolio-layout">
          <aside className="portfolio-chapter-list" aria-label="作品集章节">
            {chapters.map((entry) => (
              <button
                aria-pressed={entry.chapter.id === selected.chapter.id}
                className={
                  entry.chapter.id === selected.chapter.id ? "active" : ""
                }
                key={entry.chapter.id}
                onClick={() => setSelectedChapterId(entry.chapter.id)}
                type="button"
              >
                <span>第 {entry.chapter.id} 章</span>
                <strong>{entry.chapter.theme}</strong>
                <small>{entry.filledCount}/5 段复盘</small>
              </button>
            ))}
          </aside>

          <article className="portfolio-preview">
            <span>当前章节预览</span>
            <h2>{selected.chapter.title}</h2>
            <p>{selected.chapter.workBackground}</p>
            <div className="portfolio-field-grid">
              {interviewDossierFields.map((field) => {
                const saved = selected.saved[field.id].trim();
                return (
                  <section key={field.id}>
                    <b>{field.label}</b>
                    <p>{saved || `待填写：${selectedReference[field.id]}`}</p>
                  </section>
                );
              })}
            </div>
          </article>

          <article className="portfolio-markdown-card">
            <div>
              <span>Markdown 导出稿</span>
              <strong>可复制到简历素材库、面试准备文档或 Agent 委托中</strong>
            </div>
            <pre className="portfolio-markdown">{markdown}</pre>
          </article>
        </div>
      </div>
    </section>
  );
}

function LearningBackupVault({
  developer,
  onBack,
  onImported,
}: {
  developer: DeveloperProfile;
  onBack: () => void;
  onImported: (profile?: DeveloperProfile) => void;
}) {
  const [backupText, setBackupText] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<{
    exportedAt: string;
    tableCount: number;
    rowCount: number;
  } | null>(null);

  const createBackup = async () => {
    setBusy(true);
    setStatus("");
    try {
      const serverBackup = await api<LearningBackup>("/api/learning-backup");
      const backup: LearningBackup = {
        ...serverBackup,
        developerProfile: developer,
      };
      const text = JSON.stringify(backup, null, 2);
      setBackupText(text);
      const rowCount = Object.values(backup.tables).reduce(
        (total, rows) => total + rows.length,
        0,
      );
      setSummary({
        exportedAt: backup.exportedAt,
        tableCount: Object.keys(backup.tables).length,
        rowCount,
      });
      setStatus("已生成本地学习记录备份。");
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "生成备份失败");
    } finally {
      setBusy(false);
    }
  };

  const copyBackup = async () => {
    if (!backupText.trim()) {
      setStatus("请先生成或粘贴备份 JSON。");
      return;
    }
    try {
      await navigator.clipboard.writeText(backupText);
      setStatus("已复制备份 JSON。");
    } catch {
      setStatus("浏览器拒绝剪贴板权限，请手动选中 JSON 复制。");
    }
  };

  const downloadBackup = () => {
    if (!backupText.trim()) {
      setStatus("请先生成备份 JSON。");
      return;
    }
    if (!window.URL?.createObjectURL) {
      setStatus("当前浏览器不支持直接下载，请复制 JSON 后自行保存。");
      return;
    }
    const blob = new Blob([backupText], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `code-quest-learning-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    setStatus("已准备下载备份文件。");
  };

  const importBackup = async () => {
    if (!backupText.trim()) {
      setStatus("请先粘贴备份 JSON。");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      const backup = JSON.parse(backupText) as LearningBackup;
      const result = await api<BackupImportResult>(
        "/api/learning-backup/import",
        {
          method: "POST",
          body: JSON.stringify({ backup }),
        },
      );
      const restoredProfile = normalizeBackupDeveloperProfile(
        backup.developerProfile,
      );
      if (restoredProfile) saveDeveloper(restoredProfile);
      const rowCount = Object.values(result.counts).reduce(
        (total, count) => total + count,
        0,
      );
      setStatus(
        restoredProfile
          ? `已恢复学习记录：${rowCount} 条记录已合并，成长档案已同步。`
          : `已恢复学习记录：${rowCount} 条记录已合并。`,
      );
      onImported(restoredProfile ?? undefined);
    } catch (cause) {
      setStatus(
        cause instanceof SyntaxError
          ? "备份 JSON 格式不正确。"
          : cause instanceof Error
            ? cause.message
            : "恢复备份失败",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      className="dossier-room backup-vault"
      style={{ "--quest-bg": `url(${questArchive})` } as CSSProperties}
    >
      <div className="dossier-room-panel backup-vault-panel">
        <header className="dossier-room-head backup-vault-head">
          <button className="novel-back" onClick={onBack} type="button">
            返回任务简报
          </button>
          <div>
            <span>本地备份库 · 学习记录</span>
            <h1>把你的通关证据封存成一份可恢复的本地备份。</h1>
            <p>
              备份包含诊断、关卡尝试、复盘草稿、验证事件、能力证据、教学进度和成长档案；
              不包含真实项目源码、个人账号或终端命令。
            </p>
          </div>
        </header>

        <div className="backup-vault-grid">
          <aside className="backup-vault-guide">
            <section>
              <Database size={19} />
              <div>
                <span>导出什么</span>
                <strong>SQLite 学习记录</strong>
                <p>
                  包含你写过的回答、提示等级、测试验证、面试复盘草稿和成长档案。
                </p>
              </div>
            </section>
            <section>
              <ShieldCheck size={19} />
              <div>
                <span>不导出什么</span>
                <strong>真实项目和隐私</strong>
                <p>不会打包沙盒源码以外的项目，也不会读取系统文件。</p>
              </div>
            </section>
            <section>
              <Save size={19} />
              <div>
                <span>恢复方式</span>
                <strong>粘贴 JSON 合并恢复</strong>
                <p>恢复会合并白名单学习表，不会执行任意 SQL。</p>
              </div>
            </section>
          </aside>

          <article className="backup-vault-workbench">
            <div className="backup-vault-actions">
              <button
                className="dossier-book-open"
                disabled={busy}
                onClick={() => void createBackup()}
                type="button"
              >
                生成备份 JSON <Database size={15} />
              </button>
              <button
                className="dossier-book-open secondary"
                disabled={busy}
                onClick={() => void copyBackup()}
                type="button"
              >
                复制 JSON <BookOpen size={15} />
              </button>
              <button
                className="dossier-book-open secondary"
                disabled={busy}
                onClick={downloadBackup}
                type="button"
              >
                下载文件 <Save size={15} />
              </button>
            </div>

            {summary && (
              <div className="backup-vault-summary" aria-label="备份摘要">
                <div>
                  <span>学习表</span>
                  <strong>{summary.tableCount}</strong>
                </div>
                <div>
                  <span>记录行</span>
                  <strong>{summary.rowCount}</strong>
                </div>
                <div>
                  <span>导出时间</span>
                  <strong>
                    {new Date(summary.exportedAt).toLocaleString()}
                  </strong>
                </div>
              </div>
            )}

            <label className="backup-vault-editor">
              <span>备份 JSON</span>
              <textarea
                aria-label="备份 JSON"
                onChange={(event) => setBackupText(event.target.value)}
                placeholder="点击“生成备份 JSON”，或粘贴之前保存的 code-quest-learning-backup JSON。"
                spellCheck={false}
                value={backupText}
              />
            </label>

            <div className="backup-vault-restore">
              <button
                className="dossier-book-open"
                disabled={busy}
                onClick={() => void importBackup()}
                type="button"
              >
                恢复这份备份 <ArrowRight size={15} />
              </button>
              <p>
                恢复前会校验备份格式、schema 版本、场景 ID、步骤 ID 和 JSON
                字段。校验失败不会写入数据库。
              </p>
            </div>

            {status && <p className="dossier-save-ok">{status}</p>}
          </article>
        </div>
      </div>
    </section>
  );
}

function normalizeBackupDeveloperProfile(
  profile: unknown,
): DeveloperProfile | null {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    return null;
  }
  const record = profile as Partial<DeveloperProfile>;
  if (
    typeof record.name !== "string" ||
    typeof record.joinedAt !== "string" ||
    !Number.isFinite(record.xp) ||
    !Array.isArray(record.clearedChapterIds) ||
    !Array.isArray(record.unlockedCompanionNames)
  ) {
    throw new Error("成长档案格式不正确。");
  }
  const clearedChapterIds = Array.from(
    new Set(record.clearedChapterIds.map((chapterId) => String(chapterId))),
  ).sort((a, b) => Number(a) - Number(b));
  const unlockedCompanionNames = Array.from(
    new Set(record.unlockedCompanionNames.map((name) => String(name))),
  );
  const xp = Number(record.xp);
  return {
    name: record.name,
    xp,
    rank: getRank(xp),
    missionsCleared: clearedChapterIds.length,
    clearedChapterIds,
    unlockedCompanionNames,
    joinedAt: record.joinedAt,
  };
}

function InterviewDossierRoom({
  attempt,
  chapterId,
  developer,
  onBack,
  setAttempt,
}: {
  attempt: Attempt;
  chapterId: string;
  developer: DeveloperProfile;
  onBack: () => void;
  setAttempt: React.Dispatch<React.SetStateAction<Attempt | null>>;
}) {
  const [selectedChapterId, setSelectedChapterId] = useState(chapterId);
  const selectedStepResponse = useMemo(
    () => attempt.steps[INTERVIEW_DOSSIER_STEP_ID]?.response ?? {},
    [attempt.steps],
  );
  const [fields, setFields] = useState<Record<InterviewDossierFieldId, string>>(
    () => readDossierFields(selectedStepResponse, chapterId),
  );
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const selectedChapter =
    aiCareerRoadmap.find((chapter) => chapter.id === selectedChapterId) ??
    currentChapter;
  const filledCount = interviewDossierFields.filter(
    (field) => fields[field.id].trim().length > 0,
  ).length;

  const updateField = (fieldId: InterviewDossierFieldId, value: string) => {
    setFields((current) => ({ ...current, [fieldId]: value }));
    setSavedMessage("");
    setSaveError("");
  };

  const saveDossier = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const nextResponse = { ...selectedStepResponse };
      interviewDossierFields.forEach((field) => {
        nextResponse[dossierResponseKey(selectedChapterId, field.id)] =
          fields[field.id];
      });
      const updated = await api<Attempt>(
        `/api/attempts/${attempt.id}/steps/${INTERVIEW_DOSSIER_STEP_ID}`,
        {
          method: "PATCH",
          body: JSON.stringify({ response: nextResponse }),
        },
      );
      setAttempt(updated);
      setSavedMessage("已封存到本地学习记录，刷新后仍可继续整理。");
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "保存复盘失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main
      className="dossier-room"
      style={{ "--quest-bg": `url(${questArchive})` } as CSSProperties}
    >
      <div className="quest-camera" />
      <header className="quest-hud" aria-label="复盘房间状态">
        <div>
          <span>{developer.rank}</span>
          <strong>{developer.xp} XP</strong>
        </div>
        <div>
          <span>复盘进度</span>
          <strong>{filledCount}/5</strong>
        </div>
      </header>

      <section className="dossier-room-panel">
        <div className="dossier-room-head">
          <button className="novel-back" onClick={onBack} type="button">
            返回任务简报
          </button>
          <div>
            <span>面试复盘房间</span>
            <h1>把通关经历写成你自己的项目回答</h1>
            <p>
              这里不是让你背答案，而是把“我看到了什么、怎么定位、怎么验证”
              练成能被面试官追问的表达。
            </p>
          </div>
        </div>

        <div className="dossier-room-layout">
          <aside className="dossier-room-guide">
            <label>
              <span>选择章节</span>
              <select
                aria-label="选择复盘房间章节"
                onChange={(event) => {
                  const nextChapterId = event.target.value;
                  setSelectedChapterId(nextChapterId);
                  setFields(
                    readDossierFields(selectedStepResponse, nextChapterId),
                  );
                  setSavedMessage("");
                  setSaveError("");
                }}
                value={selectedChapterId}
              >
                {aiCareerRoadmap.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    第 {chapter.id} 章 · {chapter.theme}
                  </option>
                ))}
              </select>
            </label>
            <div className="dossier-room-card">
              <span>本章素材</span>
              <h2>{selectedChapter.title}</h2>
              <p>{selectedChapter.workBackground}</p>
              <dl>
                <div>
                  <dt>流程</dt>
                  <dd>{selectedChapter.flow}</dd>
                </div>
                <div>
                  <dt>证据</dt>
                  <dd>{selectedChapter.evidenceTask}</dd>
                </div>
                <div>
                  <dt>面试方向</dt>
                  <dd>{selectedChapter.interviewReview}</dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="dossier-writing-board">
            {interviewDossierFields.map((field, index) => (
              <label className="dossier-writing-field" key={field.id}>
                <span>
                  {String(index + 1).padStart(2, "0")} · {field.label}
                </span>
                <strong>{field.title}</strong>
                <textarea
                  aria-label={`${field.label}复盘`}
                  onChange={(event) =>
                    updateField(field.id, event.target.value)
                  }
                  placeholder={field.prompt}
                  value={fields[field.id]}
                />
              </label>
            ))}

            <div className="dossier-room-actions">
              <button
                className="dialogue-next"
                disabled={saving}
                onClick={saveDossier}
                type="button"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={16} /> 保存中
                  </>
                ) : (
                  <>
                    <Save size={16} /> 保存复盘草稿
                  </>
                )}
              </button>
              <p>
                保存的是学习复盘草稿，不代表真实工作经历；后续可以基于真实项目证据再改写。
              </p>
            </div>
            {savedMessage && <p className="dossier-save-ok">{savedMessage}</p>}
            {saveError && <p className="form-error">{saveError}</p>}
          </div>
        </div>
      </section>
    </main>
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
  const config = getLabConfig(attempt.scenarioId);
  const firstIncompleteIndex = useMemo(() => {
    const responseSteps = config.steps.filter(
      (step) => step.kind === "response",
    );
    const missing = responseSteps.findIndex((step) => !attempt.steps[step.id]);
    return missing < 0
      ? config.steps.length - 1
      : config.steps.findIndex((step) => step.id === responseSteps[missing].id);
  }, [attempt.steps, config]);
  const [activeIndex, setActiveIndex] = useState(firstIncompleteIndex);
  const [hintBusy, setHintBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const activeStep = config.steps[activeIndex] ?? config.steps[0];

  const saveStep = async (stepId: string, text: string) => {
    const updated = await api<Attempt>(
      `/api/attempts/${attempt.id}/steps/${stepId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { text } }),
      },
    );
    setAttempt(updated);
    const index = config.steps.findIndex((step) => step.id === stepId);
    if (index >= 0 && index < config.steps.length - 1) {
      setActiveIndex(index + 1);
    }
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
    return <CareerDossier hintLevel={attempt.hintLevel} config={config} />;
  }

  return (
    <div
      className="lab-shell lab-rpg-shell"
      style={{ "--lab-bg": `url(${config.backgroundImage})` } as CSSProperties}
    >
      <div className="lab-rpg-backdrop" />
      <aside className="lab-sidebar">
        <Logo />
        <div className="mission-progress">
          <span>{config.missionLabel}</span>
          <strong>{config.missionTitle}</strong>
          <small>
            <Clock3 size={13} /> {config.duration}
          </small>
        </div>
        <nav aria-label="练习步骤">
          {config.steps.map((step, index) => {
            const Icon = step.icon;
            const done =
              step.kind === "baseline" ||
              (step.kind === "verification"
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
          <LabFlowMap config={config} />
          {activeStep.kind === "baseline" && (
            <section className="lab-card baseline-sealed">
              <span className="large-icon">
                <LockKeyhole />
              </span>
              <span className="mini-label">{config.baseline.label}</span>
              <h2>{config.baseline.title}</h2>
              <p>{config.baseline.body}</p>
              <button
                className="v2-button primary"
                onClick={() => setActiveIndex(1)}
              >
                {config.baseline.action} <ArrowRight size={17} />
              </button>
            </section>
          )}
          {activeStep.kind === "verification" && (
            <VerificationPanel
              attempt={attempt}
              onVerify={verify}
              config={config}
            />
          )}
          {activeStep.kind === "response" && activeStep.response && (
            <ResponseForm
              title={activeStep.response.title}
              prompt={activeStep.response.prompt}
              placeholder={activeStep.response.placeholder}
              initialValue={attempt.steps[activeStep.id]?.response.text}
              minimum={activeStep.response.minimum}
              onSave={(text) => saveStep(activeStep.id, text)}
            >
              {activeStep.response.instruction && (
                <p className="instruction">{activeStep.response.instruction}</p>
              )}
              {activeStep.response.flowStrip && (
                <div className="flow-strip">
                  {activeStep.response.flowStrip.map((label, index) => (
                    <span key={label}>
                      {index > 0 && <ArrowRight />}
                      <b>{label}</b>
                    </span>
                  ))}
                </div>
              )}
              {(activeStep.response.artifactIds || activeIndex === 1) && (
                <ArtifactViewer
                  artifacts={
                    activeStep.response.artifactIds
                      ? artifacts.filter((artifact) =>
                          activeStep.response?.artifactIds?.includes(
                            artifact.id,
                          ),
                        )
                      : artifacts
                  }
                  guides={config.artifactGuides}
                />
              )}
              {activeStep.response.rubricItems && (
                <div className="rubric-preview">
                  <strong>解释必须覆盖</strong>
                  {activeStep.response.rubricItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
              {activeStep.response.warning && (
                <div className="transfer-warning">
                  <Clock3 />
                  <p>
                    <strong>{activeStep.response.warning.title}</strong>
                    {activeStep.response.warning.body}
                  </p>
                </div>
              )}
              {activeIndex === config.steps.length - 1 && (
                <>
                  <button
                    type="button"
                    className="v2-button dark wide"
                    disabled={
                      attempt.verificationStatus !== "passed" ||
                      config.requiredResponseStepIds.some(
                        (stepId) => !attempt.steps[stepId],
                      )
                    }
                    onClick={submit}
                  >
                    <Trophy size={18} /> 生成成长档案
                  </button>
                  {submitError && <p className="form-error">{submitError}</p>}
                </>
              )}
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
                {config.hints.slice(0, attempt.hintLevel).map((hint, index) => (
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
  const [teachingComplete, setTeachingComplete] = useState(false);
  const [developer, setDeveloper] = useState<DeveloperProfile>(loadDeveloper);
  const [currentMission, setCurrentMission] = useState(1);
  const [chapterReward, setChapterReward] = useState<ChapterReward | null>(
    null,
  );
  const [showInterviewDossier, setShowInterviewDossier] = useState(false);
  const [showInterviewPortfolio, setShowInterviewPortfolio] = useState(false);
  const [showBackupVault, setShowBackupVault] = useState(false);
  const [dossierChapterId, setDossierChapterId] = useState("1");
  const [showMissionSelect, setShowMissionSelect] = useState(false);
  const [showGameIntro, setShowGameIntro] = useState(true);
  const [introScene, setIntroScene] = useState(0);
  const [selectedRouteId, setSelectedRouteId] = useState<CareerRoute["id"]>(
    careerRoutes[0].id,
  );
  const [selectedChapterId, setSelectedChapterId] = useState("3");
  const [storyChoice, setStoryChoice] = useState<
    "rush" | "evidence" | "agent" | null
  >(null);

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
          // 恢复时检查教学进度
          try {
            const teaching = await api<
              Array<{ stepId: string; completed: boolean }>
            >(`/api/attempts/${currentAttempt.id}/teaching`);
            const allSteps = teachingScenario.steps;
            const allDone =
              allSteps.length > 0 &&
              allSteps.every((step) =>
                teaching.find((t) => t.stepId === step.id && t.completed),
              );
            if (allDone) setTeachingComplete(true);
          } catch {
            // 新 schema 下没有 teaching_progress 记录=未完成教学
          }
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

  const prepareRouteAttempt = async (scenarioId = SCENARIO_ID) => {
    if (!diagnostic) return;

    if (attempt?.scenarioId === scenarioId) return;

    const routeRecord = {
      firstChecks: "AI 应用开发路线入口",
      evidenceNeeded: "从真实项目委托开始，先学习数据流、关键代码和验证方式。",
      dataFlow: "职业路线 → 项目委托 → 教学引导 → 沙盒实战 → 成长档案",
      confidence: "3",
    };

    try {
      if (diagnostic.status === "active") {
        const saved = await api<Diagnostic>(
          `/api/diagnostic-sessions/${diagnostic.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({ baseline: routeRecord, completed: true }),
          },
        );
        setDiagnostic(saved);
      }

      const [currentAttempt, scenario] = await Promise.all([
        api<Attempt>("/api/attempts", {
          method: "POST",
          body: JSON.stringify({ scenarioId }),
        }),
        api<{ artifacts: Artifact[] }>(`/api/scenarios/${scenarioId}`),
      ]);
      if (scenarioId === SCENARIO_ID) {
        const withRouteRecord = await api<Attempt>(
          `/api/attempts/${currentAttempt.id}/steps/baseline-plan`,
          {
            method: "PATCH",
            body: JSON.stringify({ response: routeRecord }),
          },
        );
        setAttempt(withRouteRecord);
      } else {
        setAttempt(currentAttempt);
      }
      setArtifacts(scenario.artifacts);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "无法进入职业路线");
    }
  };

  const startMissionOne = async () => {
    scrollPageToTop();
    setShowGameIntro(false);
    setChapterReward(null);
    setCurrentMission(1);
    await prepareRouteAttempt();
  };

  const startChapter = async (
    chapter: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15,
  ) => {
    scrollPageToTop();
    setShowGameIntro(false);
    setShowMissionSelect(false);
    setTeachingComplete(false);
    setChapterReward(null);
    setCurrentMission(chapter);
    await prepareRouteAttempt(getScenarioIdForChapter(chapter));
  };

  const openInterviewDossier = async (chapterId: string) => {
    scrollPageToTop();
    setDossierChapterId(chapterId);
    await prepareRouteAttempt();
    setShowInterviewPortfolio(false);
    setShowInterviewDossier(true);
  };

  const openInterviewPortfolio = async () => {
    scrollPageToTop();
    if (!attempt) await prepareRouteAttempt();
    setShowInterviewDossier(false);
    setShowInterviewPortfolio(true);
  };

  const openBackupVault = () => {
    scrollPageToTop();
    setShowInterviewDossier(false);
    setShowInterviewPortfolio(false);
    setShowBackupVault(true);
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

  if (showInterviewDossier) {
    if (!attempt) return <Loading message="正在打开面试复盘房间…" />;
    return (
      <InterviewDossierRoom
        attempt={attempt}
        chapterId={dossierChapterId}
        developer={developer}
        onBack={() => {
          scrollPageToTop();
          setShowInterviewDossier(false);
          setShowGameIntro(true);
          setIntroScene(2);
          setSelectedChapterId(dossierChapterId);
        }}
        setAttempt={setAttempt}
      />
    );
  }

  if (showInterviewPortfolio) {
    if (!attempt) return <Loading message="正在整理面试作品集…" />;
    return (
      <InterviewPortfolio
        attempt={attempt}
        developer={developer}
        onBack={() => {
          scrollPageToTop();
          setShowInterviewPortfolio(false);
          setShowGameIntro(true);
          setIntroScene(2);
        }}
        onOpenDossier={(chapterId) => {
          void openInterviewDossier(chapterId);
        }}
      />
    );
  }

  if (showBackupVault) {
    return (
      <LearningBackupVault
        developer={developer}
        onBack={() => {
          scrollPageToTop();
          setShowBackupVault(false);
          setShowGameIntro(true);
          setIntroScene(2);
        }}
        onImported={(profile) => {
          if (profile) setDeveloper(profile);
        }}
      />
    );
  }

  // 职业路线封面 — 最先展示
  if (showGameIntro) {
    const selectedRoute =
      careerRoutes.find((route) => route.id === selectedRouteId) ??
      careerRoutes[0];
    const selectedChapter =
      aiCareerRoadmap.find((chapter) => chapter.id === selectedChapterId) ??
      aiCareerRoadmap[2] ??
      currentChapter;
    const playableChapter =
      selectedChapter.id === "2"
        ? 2
        : selectedChapter.id === "3"
          ? 3
          : selectedChapter.id === "4"
            ? 4
            : selectedChapter.id === "5"
              ? 5
              : selectedChapter.id === "6"
                ? 6
                : selectedChapter.id === "7"
                  ? 7
                  : selectedChapter.id === "8"
                    ? 8
                    : selectedChapter.id === "9"
                      ? 9
                      : selectedChapter.id === "10"
                        ? 10
                        : selectedChapter.id === "11"
                          ? 11
                          : selectedChapter.id === "12"
                            ? 12
                            : selectedChapter.id === "13"
                              ? 13
                              : selectedChapter.id === "14"
                                ? 14
                                : selectedChapter.id === "15"
                                  ? 15
                                  : null;
    const companionCodex = aiCareerRoadmap.map((chapter) => {
      const collected = isChapterCleared(developer, chapter.id);
      const playable = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
      ].includes(chapter.id);
      return {
        chapter,
        collected,
        status: collected ? "已收集" : playable ? "可获取" : "待解锁",
        portrait: companionPortraits[chapter.companionUnlock.name],
      };
    });
    const choiceFeedback = {
      rush: "你冲向代码仓库，向导拦住你：灯亮只是舞台效果，不能证明档案馆真的写入了记录。",
      evidence:
        "你先调取证据。向导点头：真正的调试师，会先分清“看起来成功”和“真的保存”。",
      agent:
        "你召唤副官。它可以帮你执行任务，但前提是你写清楚目标、边界和验收方式。",
    }[storyChoice ?? "evidence"];

    return (
      <section
        className={`intro visual-novel scene-${introScene}`}
        style={{ "--scene-image": `url(${archiveNight})` } as CSSProperties}
      >
        <div className="novel-backdrop" />
        <div className="novel-topbar">
          <div className="intro-profile">
            <Code2 size={15} />
            <span>{developer.rank}</span>
            <span>{developer.xp} XP</span>
          </div>
          <div className="intro-vitals" aria-label="路线状态">
            <span>
              <b>01</b> 当前章节
            </span>
            <span>
              <b>{developer.missionsCleared}</b> 已通关
            </span>
          </div>
        </div>

        {introScene === 0 && (
          <div className="novel-scene opening-scene">
            <div className="novel-title-block">
              <p className="intro-badge">AI 应用开发 · 序章 · 代码城失忆夜</p>
              <h1 className="intro-title">
                码上冒险：<span>代码城失去了记忆</span>
              </h1>
            </div>
            <div className="dialogue-box">
              <span className="speaker">档案馆警报</span>
              <p>
                02:17，代码城的档案馆突然变空。市民明明按下了“保存”，灯也亮了；
                但第二天醒来，所有记录都像从没存在过。
              </p>
              <button
                className="dialogue-next"
                onClick={() => {
                  scrollPageToTop();
                  setIntroScene(1);
                }}
              >
                走进档案馆 <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}

        {introScene === 1 && (
          <div className="novel-scene choice-scene">
            <div className="mentor-panel">
              <RoleAvatar />
              <div>
                <span>向导</span>
                <strong>你被临时召回为见习 AI 调试师。</strong>
                <p>
                  别急着改代码。眼前这座城由舞台、传送门、档案馆和副官组成。
                  你第一步会怎么做？
                </p>
              </div>
            </div>
            <div className="choice-grid" role="group" aria-label="剧情选择">
              {[
                ["rush", "冲进代码仓库", "先把看起来可疑的地方改掉。"],
                [
                  "evidence",
                  "调取现场证据",
                  "先比较灯亮、传送门回执和档案馆记录。",
                ],
                [
                  "agent",
                  "召唤 Agent 副官",
                  "让副官先帮你修，但你要写清验收。",
                ],
              ].map(([id, title, desc]) => (
                <button
                  className={storyChoice === id ? "selected" : ""}
                  key={id}
                  onClick={() =>
                    setStoryChoice(id as "rush" | "evidence" | "agent")
                  }
                >
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </button>
              ))}
            </div>
            {storyChoice && (
              <div className="choice-feedback">
                <p>{choiceFeedback}</p>
                <button
                  className="dialogue-next"
                  onClick={() => {
                    scrollPageToTop();
                    setIntroScene(2);
                  }}
                >
                  领取委托 <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>
        )}

        {introScene === 2 && (
          <div className="novel-scene briefing-scene">
            <div className="intro-hud">
              <button className="novel-back" onClick={() => setIntroScene(1)}>
                返回选择
              </button>
            </div>
            <div className="briefing-layout">
              <div className="briefing-left">
                <p className="intro-badge">任务简报 · {selectedRoute.label}</p>
                <h1 className="briefing-title">先看懂这座城，再修复它。</h1>
                <div className="career-selector" aria-label="岗位路线选择">
                  {careerRoutes.map((route) => (
                    <button
                      aria-pressed={selectedRoute.id === route.id}
                      className={`career-chip ${
                        selectedRoute.id === route.id ? "active" : ""
                      } ${route.status !== "可进入" ? "locked" : ""}`}
                      key={route.id}
                      onClick={() => setSelectedRouteId(route.id)}
                      type="button"
                    >
                      <span>{route.label}</span>
                      <small>{route.status}</small>
                    </button>
                  ))}
                </div>
                <section className="career-promise" aria-label="当前路线目标">
                  <span>{selectedRoute.role}</span>
                  <strong>{selectedRoute.promise}</strong>
                  <p>{selectedRoute.summary}</p>
                  <div>
                    {selectedRoute.coreSkills.map((skill) => (
                      <b key={skill}>{skill}</b>
                    ))}
                  </div>
                  {selectedRoute.status !== "可进入" && (
                    <ul>
                      {selectedRoute.previewChapters.map((chapter) => (
                        <li key={chapter}>{chapter}</li>
                      ))}
                    </ul>
                  )}
                </section>
                <div className="analogy-grid" aria-label="本关比喻地图">
                  {[
                    [
                      "前端",
                      "舞台",
                      "观众看到灯亮，但不代表后台真的存了道具。",
                    ],
                    [
                      "接口",
                      "传送门",
                      "它负责把请求送进城里，只返回成功不等于任务完成。",
                    ],
                    [
                      "数据库",
                      "档案馆",
                      "只有写进档案馆，刷新和重启后记忆才不会消失。",
                    ],
                    [
                      "Agent",
                      "副官",
                      "副官能执行命令，但你要会写清目标和验收标准。",
                    ],
                  ].map(([term, metaphor, desc]) => (
                    <div className="analogy-card" key={term}>
                      <span>{term}</span>
                      <strong>{metaphor}</strong>
                      <p>{desc}</p>
                    </div>
                  ))}
                </div>
                <section className="companion-codex" aria-label="伙伴图鉴">
                  <div className="companion-codex-head">
                    <span>伙伴图鉴</span>
                    <strong>收集角色、宠物与装备</strong>
                    <p>
                      每章通关都会留下一个可复盘的能力印记，也会解锁一位同伴或一件装备。
                    </p>
                  </div>
                  <div className="companion-codex-grid">
                    {companionCodex.map(
                      ({ chapter, collected, status, portrait }) => (
                        <article
                          className={`companion-card ${
                            collected ? "collected" : ""
                          }`}
                          key={chapter.id}
                        >
                          {portrait ? (
                            <img
                              src={portrait}
                              alt=""
                              className="companion-card-portrait"
                            />
                          ) : (
                            <div className="companion-card-sigil">
                              {chapter.companionUnlock.name.slice(0, 1)}
                            </div>
                          )}
                          <div>
                            <small>
                              第 {chapter.id} 章 ·{" "}
                              {chapter.companionUnlock.type}
                            </small>
                            <strong>{chapter.companionUnlock.name}</strong>
                            <span>{status}</span>
                          </div>
                        </article>
                      ),
                    )}
                  </div>
                </section>
                <CompanionArchive entries={companionCodex} />
                <InterviewDossierBook
                  entries={companionCodex}
                  onOpenDossier={(chapterId) => {
                    void openInterviewDossier(chapterId);
                  }}
                  onOpenPortfolio={() => {
                    void openInterviewPortfolio();
                  }}
                />
                <LearningBackupCard onOpen={openBackupVault} />
              </div>
              <div className="intro-panel">
                <div className="roadmap-summary">
                  <span>{selectedRoute.label}成长主线</span>
                  <strong>
                    {selectedRoute.chapters.length > 0
                      ? `${selectedRoute.chapters.length} 章`
                      : "规划中"}
                  </strong>
                </div>
                <div className="world-map" aria-label="AI 开发世界地图">
                  <div className="world-map-line" />
                  {selectedRoute.chapters.length > 0
                    ? selectedRoute.chapters.map((chapter) => (
                        <div
                          className={`world-node ${
                            chapter.status === "当前" ? "active" : ""
                          } ${chapter.status === "预览" ? "preview" : ""}`}
                          key={chapter.id}
                        >
                          <span>{chapter.id}</span>
                          <strong>{chapter.world}</strong>
                          <small>{chapter.status}</small>
                        </div>
                      ))
                    : selectedRoute.previewChapters.map((chapter, index) => (
                        <div
                          className="world-node locked-preview"
                          key={chapter}
                        >
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <strong>{chapter}</strong>
                          <small>即将解锁</small>
                        </div>
                      ))}
                </div>
                <div className="intro-panel-head">
                  <span>
                    {selectedRoute.status === "可进入"
                      ? "任务板"
                      : "当前可玩任务板"}
                  </span>
                  <strong>
                    {selectedRoute.status === "可进入"
                      ? "打开就从这里开始"
                      : "这条路线未开放，先从 AI 主线训练共通能力"}
                  </strong>
                </div>
                <div
                  className={`intro-mission active ${
                    developer.missionsCleared >= 1 ? "solved" : ""
                  }`}
                >
                  <div className="mission-index">{currentChapter.id}</div>
                  <div className="intro-mission-main">
                    <div className="intro-mission-kicker">
                      <span>
                        第 {currentChapter.id} 章 · {currentChapter.theme}
                      </span>
                      {developer.missionsCleared >= 1 && (
                        <b>
                          <CheckCircle2 size={14} /> 已通关
                        </b>
                      )}
                    </div>
                    <strong>{currentChapter.title}</strong>
                    <p>{currentChapter.summary}</p>
                    <div className="mission-contract">
                      <span>验收目标</span>
                      <strong>{currentChapter.validation}</strong>
                    </div>
                    <div className="mission-rewards">
                      {currentChapter.rewards.map((reward) => (
                        <span key={reward}>{reward}</span>
                      ))}
                    </div>
                    <div className="mission-companion">
                      <span>{currentChapter.companionUnlock.type}解锁</span>
                      <strong>{currentChapter.companionUnlock.name}</strong>
                    </div>
                  </div>
                  <button
                    className="intro-mission-action"
                    onClick={startMissionOne}
                  >
                    {developer.missionsCleared >= 1 ? "重新练习" : "进入主线"}
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="mission-roadmap" aria-label="后续主线关卡">
                  {aiCareerRoadmap.slice(1).map((mission) => (
                    <button
                      aria-pressed={selectedChapter.id === mission.id}
                      className={`intro-mission roadmap-preview ${
                        mission.status === "预览" ? "preview" : "locked"
                      } ${selectedChapter.id === mission.id ? "selected" : ""}`}
                      key={mission.id}
                      onClick={() => setSelectedChapterId(mission.id)}
                      type="button"
                    >
                      <div className="mission-index">{mission.id}</div>
                      <div className="intro-mission-main">
                        <div className="intro-mission-kicker">
                          <span>
                            第 {mission.id} 章 · {mission.theme}
                          </span>
                          <b>
                            <LockKeyhole size={13} />
                            {mission.status}
                          </b>
                        </div>
                        <strong>{mission.title}</strong>
                        <p>{mission.workBackground}</p>
                        <div className="mission-contract">
                          <span>学会</span>
                          <strong>{mission.learn}</strong>
                          <span>验收</span>
                          <strong>{mission.validation}</strong>
                        </div>
                        <div className="mission-rewards">
                          {mission.rewards.map((reward) => (
                            <span key={reward}>{reward}</span>
                          ))}
                        </div>
                        <div className="mission-companion">
                          <span>{mission.companionUnlock.type}解锁</span>
                          <strong>{mission.companionUnlock.name}</strong>
                        </div>
                      </div>
                      <span className="intro-mission-status">路线规划</span>
                    </button>
                  ))}
                </div>
                <section className="chapter-dossier" aria-label="选中章节卷宗">
                  <div className="chapter-dossier-head">
                    <span>
                      第 {selectedChapter.id} 章 · {selectedChapter.status}
                    </span>
                    <strong>{selectedChapter.title}</strong>
                    <p>{selectedChapter.summary}</p>
                  </div>
                  <div className="chapter-dossier-grid">
                    {[
                      ["剧情场景", selectedChapter.storyScene],
                      ["工作背景", selectedChapter.workBackground],
                      ["完整流程图", selectedChapter.flow],
                      ["关键代码", selectedChapter.codeFocus],
                      ["证据任务", selectedChapter.evidenceTask],
                      ["Agent 协作", selectedChapter.agentCollaboration],
                      ["验收动作", selectedChapter.acceptanceAction],
                      ["面试复盘", selectedChapter.interviewReview],
                      [
                        "伙伴/宠物解锁",
                        `${selectedChapter.companionUnlock.type} · ${selectedChapter.companionUnlock.name}：${selectedChapter.companionUnlock.description}`,
                      ],
                    ].map(([label, value]) => (
                      <div className="chapter-dossier-item" key={label}>
                        <span>{label}</span>
                        <p>{value}</p>
                      </div>
                    ))}
                    <div className="chapter-dossier-item glossary">
                      <span>名词小抄</span>
                      <div>
                        {selectedChapter.glossary.map((term) => (
                          <b key={term}>{term}</b>
                        ))}
                      </div>
                    </div>
                  </div>
                  {playableChapter && (
                    <button
                      className="dialogue-next chapter-dossier-action"
                      onClick={() => startChapter(playableChapter)}
                      type="button"
                    >
                      进入第 {selectedChapter.id} 章教学关卡{" "}
                      <ArrowRight size={17} />
                    </button>
                  )}
                </section>
                <div className="intro-safety-strip">
                  <ShieldCheck size={15} />
                  <span>
                    本地沙盒 + 手动测试 + 成长档案。系统不会执行你的终端命令。
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  if (diagnostic.status === "active") {
    return <Loading message="正在进入 AI 应用开发路线…" />;
  }
  if (!attempt) return <Loading message="正在恢复真实项目练习…" />;
  if (!teachingComplete) {
    const scenario =
      currentMission === 1
        ? teachingScenario
        : currentMission === 3
          ? case03Scenario
          : currentMission === 4
            ? case04Scenario
            : currentMission === 5
              ? case05Scenario
              : currentMission === 6
                ? case06Scenario
                : currentMission === 7
                  ? case07Scenario
                  : currentMission === 8
                    ? case08Scenario
                    : currentMission === 9
                      ? case09Scenario
                      : currentMission === 10
                        ? case10Scenario
                        : currentMission === 11
                          ? case11Scenario
                          : currentMission === 12
                            ? case12Scenario
                            : currentMission === 13
                              ? case13Scenario
                              : currentMission === 14
                                ? case14Scenario
                                : currentMission === 15
                                  ? case15Scenario
                                  : case02Scenario;
    const handleTeachingComplete = () => {
      const chapter =
        aiCareerRoadmap.find(
          (roadmapChapter) => roadmapChapter.id === String(currentMission),
        ) ?? currentChapter;
      const wasAlreadyCleared = isChapterCleared(developer, chapter.id);
      const xpGained = currentMission === 1 ? 150 : 120;
      const beforeRank = developer.rank;
      const rewarded = wasAlreadyCleared
        ? developer
        : awardXP(developer, xpGained);
      const updated = completeChapter(
        rewarded,
        chapter.id,
        chapter.companionUnlock.name,
      );
      if (currentMission === 1) {
        setDeveloper(updated);
        setShowMissionSelect(true);
      } else if (
        currentMission === 2 ||
        currentMission === 3 ||
        currentMission === 4 ||
        currentMission === 5 ||
        currentMission === 6 ||
        currentMission === 7 ||
        currentMission === 8 ||
        currentMission === 9 ||
        currentMission === 10 ||
        currentMission === 11 ||
        currentMission === 12 ||
        currentMission === 13 ||
        currentMission === 14 ||
        currentMission === 15
      ) {
        setDeveloper(updated);
        setTeachingComplete(true);
      } else {
        setDeveloper(updated);
        setChapterReward({
          chapter,
          xpGained,
          wasAlreadyCleared,
          beforeRank,
          afterRank: updated.rank,
        });
        setTeachingComplete(true);
      }
    };
    if (showMissionSelect) {
      return (
        <main
          className="quest-shell case-complete-gate"
          style={{ "--quest-bg": `url(${questWorkbench})` } as CSSProperties}
        >
          <div className="quest-camera" />
          <header className="quest-hud" aria-label="结案状态">
            <div>
              <span>{developer.rank}</span>
              <strong>{developer.xp} XP</strong>
            </div>
            <div>
              <span>卷宗</span>
              <strong>主线 1-1</strong>
            </div>
          </header>

          <section className="mission-gate-stage case-complete-stage">
            <div className="mission-dossier">
              <span>结案卷宗 · 数据消失事件</span>
              <h1>主线 1-1 已结案</h1>
              <p>
                你已经知道：按钮亮起、接口返回成功，都只是局部证据。
                真正能证明保存成功的，是数据刷新后仍然留在档案馆里。
              </p>
              <blockquote>
                你现在能讲出一段完整排障故事：现象是刷新后数据消失； 证据是 201
                与数据库 0 行冲突；根因是读写数据源不一致；
                修复方向是把临时记忆写入持久化存储。
              </blockquote>
              <div className="dossier-evidence">
                <b>获得</b>
                <strong>内存 vs 持久化</strong>
                <b>产出</b>
                <strong>一段可面试复盘的排障故事</strong>
              </div>
              <div className="case-complete-actions">
                <button
                  className="dialogue-next"
                  onClick={() => {
                    setCurrentMission(2);
                    setShowMissionSelect(false);
                    void prepareRouteAttempt(CASE02_SCENARIO_ID);
                  }}
                >
                  继续主线 1-2：拆解 CanvasStorm <ArrowRight size={17} />
                </button>
                <button
                  className="novel-back"
                  onClick={() => {
                    setTeachingComplete(true);
                  }}
                >
                  进入实战练习
                </button>
              </div>
            </div>
          </section>
        </main>
      );
    }
    return (
      <TeachingBridge
        attemptId={attempt.id}
        scenario={scenario}
        developer={developer}
        onComplete={handleTeachingComplete}
      />
    );
  }
  if (chapterReward) {
    return (
      <ChapterRewardGate
        developer={developer}
        reward={chapterReward}
        onBackToRoadmap={() => {
          scrollPageToTop();
          setChapterReward(null);
          setTeachingComplete(false);
          setShowMissionSelect(false);
          setShowGameIntro(true);
          setIntroScene(2);
          setSelectedChapterId(chapterReward.chapter.id);
        }}
      />
    );
  }
  return (
    <Lab attempt={attempt} artifacts={artifacts} setAttempt={setAttempt} />
  );
}
