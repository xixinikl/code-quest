import echoOfficerPortrait from "./assets/portrait-echo-forensics-officer.webp";
import nightIdentityOfficerPortrait from "./assets/portrait-model-warden-v2.webp";
import portalScribePortrait from "./assets/portrait-portal-scribe-v2.webp";
import stormDispatcherPortrait from "./assets/portrait-storm-dispatcher.webp";
import indexArbiterPortrait from "./assets/portrait-index-arbiter.webp";
import timingNavigatorPortrait from "./assets/portrait-timing-navigator.webp";
import nightArchiveScene from "./assets/code-archive-night.webp";
import echoGalleryScene from "./assets/scene-memory-echo-gallery.webp";
import signalStormScene from "./assets/scene-signal-storm-dispatch-tower.webp";
import twinStarIndexingScene from "./assets/scene-twin-star-indexing-well.webp";
import morningStarTimingScene from "./assets/scene-morning-star-timing-harbor.webp";
import productWorkshopScene from "./assets/quest-workbench.webp";
import modelWardenPortrait from "./assets/portrait-model-warden-v2.webp";
import modelKeyForgeScene from "./assets/scene-model-key-forge.webp";
import mirrorEditorPortrait from "./assets/portrait-mirror-editor-v2.webp";
import hallucinationMirrorScene from "./assets/scene-hallucination-mirror.webp";
import knowledgeKeeperPortrait from "./assets/portrait-index-arbiter.webp";
import ragKnowledgeMazeScene from "./assets/scene-rag-knowledge-maze.webp";
import toolWardenPortrait from "./assets/portrait-tool-warden-v2.webp";
import agentToolContractHallScene from "./assets/scene-agent-tool-contract-hall.webp";
import testArbiterPortrait from "./assets/portrait-test-arbiter-v2.webp";
import verificationTrialArenaScene from "./assets/scene-verification-trial-arena.webp";
import briefForgemasterPortrait from "./assets/portrait-brief-forgemaster-v2.webp";
import agentBriefForgeScene from "./assets/scene-agent-brief-forge.webp";
import deliveryJudgePortrait from "./assets/portrait-delivery-judge-v2.webp";
import deliveryReviewCourtScene from "./assets/scene-delivery-review-court.webp";
import releaseGatekeeperPortrait from "./assets/portrait-release-gatekeeper-v2.webp";
import releaseReadinessGateScene from "./assets/scene-release-readiness-gate.webp";
import interviewCouncilorPortrait from "./assets/portrait-interview-councilor-v2.webp";
import interviewDefenseHallScene from "./assets/scene-interview-defense-hall.webp";

export type TransferRetestSourceId =
  | "canvas-save-persistence"
  | "canvasstorm-product-brief"
  | "identity-session-corridor"
  | "api-error-court"
  | "data-consistency-forge"
  | "performance-fog-lab"
  | "ai-api-key-vault"
  | "hallucination-mirror-hall"
  | "rag-knowledge-maze"
  | "agent-tool-tower"
  | "verification-trial-arena"
  | "agent-brief-forge"
  | "delivery-review-court"
  | "release-readiness-gate"
  | "interview-answer-forge";

export type TransferRetestStage = {
  id: string;
  label: string;
  title: string;
  prompt: string;
  placeholder: string;
  minimum: number;
  artifactIds: string[];
};

export type TransferRetestConfig = {
  sourceScenarioId: TransferRetestSourceId;
  scenarioId: string;
  chapterId: string;
  chapterLabel: string;
  location: string;
  cardTitle: string;
  cardBody: string;
  mentorName: string;
  mentorTitle: string;
  mentorLine: string;
  mentorBody: string;
  caseTitle: string;
  flowLabel: string;
  flow: Array<[string, string]>;
  mapVariant:
    | "evidence-trail"
    | "workshop-table"
    | "session-ring"
    | "fault-branch"
    | "worker-confluence"
    | "latency-cascade"
    | "secret-boundary"
    | "citation-mirror"
    | "retrieval-maze"
    | "tool-gate-tower"
    | "proof-arena"
    | "brief-contract"
    | "review-court"
    | "release-gate"
    | "interview-constellation";
  cameraVariant:
    | "corridor-dolly"
    | "workshop-crane"
    | "checkpoint-tracking"
    | "alert-descent"
    | "split-orbit"
    | "timeline-glide"
    | "key-vault-pan"
    | "mirror-sweep"
    | "maze-orbit"
    | "tower-ascend"
    | "arena-drop"
    | "brief-unroll"
    | "diamond-sweep"
    | "gate-lock"
    | "answer-orbit";
  scene: string;
  portrait: string;
  command: string;
  stages: TransferRetestStage[];
  hints: string[];
};

const sharedFinalStages = {
  agentBrief: {
    id: "agent-brief",
    label: "Agent 委托",
    title: "把复测现场交给 Agent",
    prompt:
      "写一份不泄露真实项目、范围明确且能验收的修复委托。必须包含现象、证据、允许范围、禁止事项和复测标准。",
    placeholder: "背景：……\n已知证据：……\n允许修改：……\n禁止事项：……\n验收：……",
    minimum: 120,
  },
  reflection: {
    id: "verification-reflection",
    label: "迁移复盘",
    minimum: 100,
  },
} as const;

export const transferRetestConfigs: Record<
  TransferRetestSourceId,
  TransferRetestConfig
> = {
  "canvas-save-persistence": {
    sourceScenarioId: "canvas-save-persistence",
    scenarioId: "avatar-persistence-retest",
    chapterId: "1",
    chapterLabel: "第 1 章能力迁移",
    location: "记忆回声廊",
    cardTitle: "新案件：头像更新后又变回旧图",
    cardBody:
      "业务、文件和证据都已换新。回声鉴证师会记录过程，但不会先告诉你第一章答案。",
    mentorName: "回声鉴证师",
    mentorTitle: "复测导师",
    mentorLine: "这一次，我不会先告诉你答案。",
    mentorBody:
      "画布事件已经过去至少 24 小时。现在业务、文件和证据都换了，你要靠自己的方法证明头像为什么只在当前页面“记住”了。",
    caseTitle: "头像明明更新成功，为什么重新登录又变回旧图？",
    flowLabel: "头像更新证据路线",
    flow: [
      ["上传面板", "新头像 URL"],
      ["PUT 接口", "200 + 新资料"],
      ["数据访问层", "更新动作"],
      ["SQLite", "持久资料"],
      ["重新登录 GET", "旧头像反证"],
    ],
    mapVariant: "evidence-trail",
    cameraVariant: "corridor-dolly",
    scene: echoGalleryScene,
    portrait: echoOfficerPortrait,
    command: "cd sandbox/avatar-persistence-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "独立判断",
        title: "先判断哪一棒断了",
        prompt:
          "头像上传返回 200，当前页面也换了新图；退出并重新登录后却恢复旧头像。先不用第一章术语，写出你认为最可能的断点和理由。",
        placeholder:
          "我先把现象拆成……。200 能证明……，但不能证明……。重新登录读取旧头像说明……。最可能的断点是……。",
        minimum: 80,
        artifactIds: ["upload-network", "relogin-network"],
      },
      {
        id: "evidence-plan",
        label: "证据计划",
        title: "决定下一步看哪三份证物",
        prompt:
          "按顺序选择你要核对的材料，并说明每份材料分别能证明什么、不能证明什么。不要直接给修复代码。",
        placeholder:
          "第一份看……，它能证明……但不能证明……；第二份看……；第三份用来确认……。如果三者出现……冲突，我会定位到……。",
        minimum: 100,
        artifactIds: ["logs", "database", "repository"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["frontend", "route", "repository"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "解释为什么这不是在背第一章答案",
        prompt:
          "比较画布保存和头像更新：业务表象哪里不同，底层证据方法哪里可迁移？再写出这次仍未证明的能力边界。",
        placeholder:
          "不同点是……；我迁移的方法是先区分……再用……互证。测试通过能证明……，仍不能证明……。",
        artifactIds: ["database", "repository"],
      },
    ],
    hints: [
      "先画两条时间线：上传请求结束时页面看到什么；重新登录时 GET 又从哪里取数据。",
      "把 200、当前页面新头像、数据库旧值看成三份不同证据，找出哪两份互相冲突。",
      "只检查 updateAvatar 写到哪里，以及 getProfile 从哪里读；不要先改前端提示。",
    ],
  },
  "canvasstorm-product-brief": {
    sourceScenarioId: "canvasstorm-product-brief",
    scenarioId: "meeting-assistant-retest",
    chapterId: "2",
    chapterLabel: "第 2 章能力迁移",
    location: "需求回声工坊",
    cardTitle: "新案件：AI 会议助手选错方向又忘了取舍",
    cardBody:
      "同样是 AI 产品链路，但用户、成功标准、候选方案和会话证据全部更换。",
    mentorName: "传送门书记官",
    mentorTitle: "产品复测向导",
    mentorLine: "别拿旧 Brief 套答案，先重新问清谁遇到了什么问题。",
    mentorBody:
      "CanvasStorm 事件已经过去至少 24 小时。现在委托人只说“做一个更聪明的会议助手”，候选方向混乱，刷新后还忘了取舍理由。",
    caseTitle: "AI 会议助手功能很多，为什么偏偏选错方向，刷新后还忘了理由？",
    flowLabel: "会议助手产品链路",
    flow: [
      ["模糊委托", "一句空泛想法"],
      ["Project Brief", "用户 + 问题 + 成功标准"],
      ["候选筛选", "匹配当前阶段"],
      ["取舍决定", "方案 + 理由"],
      ["会话恢复", "刷新后仍能解释"],
    ],
    mapVariant: "workshop-table",
    cameraVariant: "workshop-crane",
    scene: productWorkshopScene,
    portrait: portalScribePortrait,
    command: "cd sandbox/meeting-assistant-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "独立判断",
        title: "先把空泛需求拆成可验证 Brief",
        prompt:
          "委托人只说“做一个更聪明的 AI 会议助手”。结合原始需求，写清目标用户、真实问题、当前阶段和成功标准，并判断为什么实时数字人不是当前优先项。",
        placeholder:
          "目标用户是……；真正问题是……；当前阶段是……；成功标准应该是……。实时数字人虽然……，但现在不优先，因为……。",
        minimum: 100,
        artifactIds: ["request", "candidates"],
      },
      {
        id: "evidence-plan",
        label: "证据计划",
        title: "找出候选筛选与会话恢复的两个断点",
        prompt:
          "按顺序核对候选数据、规划逻辑和刷新后的会话证据。分别说明每份材料能证明什么、不能证明什么，再提出修复假设。",
        placeholder:
          "先看候选数据确认……；再看规划器判断……；最后用刷新证据确认……。三份材料互证后，我的修复假设是……。",
        minimum: 120,
        artifactIds: ["candidates", "planner", "session"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["frontend", "planner", "session-store", "delivery"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是产品方法，不是 CanvasStorm 文案",
        prompt:
          "比较 CanvasStorm 和会议助手：业务表象、候选方案哪里不同？Project Brief、候选取舍、会话保存方法哪里可迁移？再写出测试仍不能证明什么。",
        placeholder:
          "不同点是……；可迁移的方法是……；我用……证明选择和理由能恢复。测试通过能证明……，仍不能证明……。",
        artifactIds: ["request", "session", "planner"],
      },
    ],
    hints: [
      "先把“更聪明”换成可观察结果：谁在什么时候，因为哪个问题，需要得到什么输出。",
      "候选方向要先匹配 currentStage，再比较 fitScore；展示效果强不等于解决当前问题。",
      "刷新恢复不只存 selectedCandidateId，还要存选择理由，否则用户无法继续解释取舍。",
    ],
  },
  "identity-session-corridor": {
    sourceScenarioId: "identity-session-corridor",
    scenarioId: "support-shift-session-retest",
    chapterId: "3",
    chapterLabel: "第 3 章能力迁移",
    location: "夜航身份中转站",
    cardTitle: "新案件：认证服务重启后夜班客服集体掉线",
    cardBody:
      "浏览器仍带刷新 Cookie，但新认证实例不认识它。业务、角色、文件和证据都已离开原来的身份回廊。",
    mentorName: "夜航身份官",
    mentorTitle: "会话复测导师",
    mentorLine: "票根还在手里，不代表新值班员的登记册里还有你。",
    mentorBody:
      "夜班客服已经登录，浏览器也收到了 refreshToken。认证服务滚动重启后，下一次续期却返回 401。你要判断 Cookie、访问令牌、刷新会话和数据库分别能证明什么。",
    caseTitle: "浏览器明明还带着 Cookie，为什么认证服务重启后全员掉线？",
    flowLabel: "夜班客服会话续期路线",
    flow: [
      ["客服登录", "账号 + 班次"],
      ["浏览器票根", "refreshToken Cookie"],
      ["认证值班员", "查找刷新会话"],
      ["会话登记库", "可跨进程记录"],
      ["服务重启续期", "200 或 401 反证"],
    ],
    mapVariant: "session-ring",
    cameraVariant: "checkpoint-tracking",
    scene: nightArchiveScene,
    portrait: nightIdentityOfficerPortrait,
    command: "cd sandbox/support-shift-session-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "独立判断",
        title: "先分清票根还在和登记记录还在",
        prompt:
          "登录返回 200，浏览器保存了 refreshToken；认证服务重启后，同一个 Cookie 发起续期却得到 401。写出你认为最可能的断点，并分别说明登录 200、Cookie 仍存在和续期 401 能证明什么、不能证明什么。",
        placeholder:
          "登录 200 只能证明……；Cookie 仍在能证明……，但不能证明……；重启后续期 401 说明……。我最先怀疑……，因为……。",
        minimum: 110,
        artifactIds: ["login-network", "refresh-network"],
      },
      {
        id: "evidence-plan",
        label: "证据计划",
        title: "把浏览器、认证实例和数据库串成时间线",
        prompt:
          "按顺序核对认证日志、刷新会话数据库和会话仓库代码。说明每份材料能排除什么，再判断问题发生在凭证携带、会话查找还是持久化边界。",
        placeholder:
          "先看日志确认……；再查数据库判断……；最后读仓库代码验证……。如果 Cookie 已携带但数据库为 0 行，我会把断点定位到……。",
        minimum: 120,
        artifactIds: ["logs", "database", "repository"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["frontend", "route", "repository", "schema", "delivery"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是登录态证据方法，不是身份回廊答案",
        prompt:
          "比较原身份回廊和夜班客服续期：业务、角色和失败时机哪里不同？Cookie、服务端会话、401、数据库互证的方法哪里可迁移？最后说明当前测试仍不能证明什么。",
        placeholder:
          "不同点是……；我迁移的方法是先区分……，再用……和……互证。测试通过能证明服务重启后……，仍不能证明真实多机部署下……。",
        artifactIds: ["refresh-network", "database", "repository"],
      },
    ],
    hints: [
      "先画两条时间线：浏览器保存 Cookie 的时间线，以及认证服务重启后查会话的时间线。",
      "如果请求已经带 refreshToken，就不要继续把 401 全归咎于前端；去找新实例从哪里读取会话。",
      "比较 issueRefreshSession 和 findRefreshSession 的存储边界：进程内 Map 会不会随着实例一起消失？",
    ],
  },
  "api-error-court": {
    sourceScenarioId: "api-error-court",
    scenarioId: "model-rate-limit-retest",
    chapterId: "4",
    chapterLabel: "第 4 章能力迁移",
    location: "信号风暴调度塔",
    cardTitle: "新案件：模型限流被网关伪装成系统错误",
    cardBody:
      "请求体没有缺字段，这次真正的故障发生在模型依赖边界。你要沿 requestId 找出 429 为什么变成了无信息的 500。",
    mentorName: "风暴调度官",
    mentorTitle: "接口事故导师",
    mentorLine: "同一串 requestId，是穿过四层风暴时唯一不会说谎的路标。",
    mentorBody:
      "夜班客服提交了合法的会话批次，自有 API 也成功呼叫模型供应商；供应商因容量限制返回 429，网关却只交回一句“系统错误”。先别改状态码，先证明每一层收到什么、交出了什么。",
    caseTitle: "合法请求为什么收到 500？上游 429 到底在哪一层被抹掉了？",
    flowLabel: "AI 摘要限流故障分流图",
    flow: [
      ["客服批次", "合法 conversations"],
      ["自有 API", "校验 + requestId"],
      ["模型供应商", "429 + retry-after"],
      ["错误映射器", "错误地变成 500"],
      ["重试出口", "503 + 可行动信息"],
    ],
    mapVariant: "fault-branch",
    cameraVariant: "alert-descent",
    scene: signalStormScene,
    portrait: stormDispatcherPortrait,
    command: "cd sandbox/model-rate-limit-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "独立判断",
        title: "先给四层接口边界分别定责",
        prompt:
          "浏览器请求体完整，自有 API 返回 500，网关日志却记录模型供应商 429。写清浏览器、自有 API、模型供应商和错误映射器各自已经证明什么、还不能证明什么，并指出最可能丢失信息的位置。",
        placeholder:
          "浏览器请求能证明……；自有 API 的 500 只能证明……；供应商 429 能证明……；三份证据用 requestId 串起来后，我把信息丢失点定位在……，因为……。",
        minimum: 120,
        artifactIds: [
          "request-network",
          "gateway-response",
          "upstream-response",
        ],
      },
      {
        id: "evidence-plan",
        label: "证据计划",
        title: "用 requestId 穿过请求、日志和代码",
        prompt:
          "按顺序核对网关日志、路由代码和团队限流约定。说明每份材料能排除哪种假设，再决定对外状态、错误码、requestId 和重试时间应该怎么交付。",
        placeholder:
          "先用日志确认……；再读路由判断……；最后用处理约定决定……。如果三份材料一致，修复后的响应应该包含……，而日志仍需保留……。",
        minimum: 130,
        artifactIds: ["logs", "route", "policy"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["frontend", "route", "provider", "policy", "delivery"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是接口定位方法，不是背 400/500",
        prompt:
          "比较原接口审判庭与模型限流事故：一个是输入校验，一个是上游依赖。说明你如何用请求、状态、结构化错误和关联日志定位不同边界，并写出当前测试仍未证明的生产风险。",
        placeholder:
          "原案件的断点在……，这次在……；我迁移的方法不是记住状态码，而是先画……，再用 requestId 把……串起来。测试通过能证明……，仍不能证明生产环境的……。",
        artifactIds: [
          "gateway-response",
          "upstream-response",
          "logs",
          "policy",
        ],
      },
    ],
    hints: [
      "先问每个状态是谁返回给谁：浏览器看到的 500，不等于模型供应商也返回了 500。",
      "在三份证物里找同一个 req-night-429；它能证明请求确实穿过了自有 API 并到达上游。",
      "只修错误映射边界：保留上游 429 到日志，对浏览器返回团队约定的 503、requestId 与 retryAfterSeconds。",
    ],
  },
  "data-consistency-forge": {
    sourceScenarioId: "data-consistency-forge",
    scenarioId: "rag-index-concurrency-retest",
    chapterId: "5",
    chapterLabel: "第 5 章能力迁移",
    location: "双星索引井",
    cardTitle: "新案件：两名索引工人同时处理了同一份文档",
    cardBody:
      "前端只上传一次，竞争却发生在两个后端 Worker 之间。地图会把两条领取轨道和唯一索引库同时摆到你眼前。",
    mentorName: "索引执衡官",
    mentorTitle: "并发事故导师",
    mentorLine: "井口只有一份卷轴，为什么两条轨道都送来了同一批碎片？",
    mentorBody:
      "一致性熔炉案件已经过去至少 24 小时。这次没有双击按钮：两名索引工人几乎同时读到 pending 任务，又各自写入一套 chunks。先沿双轨地图找出竞争点，再判断原子领取、唯一约束和事务分别守哪一道门。",
    caseTitle: "只有一次上传，为什么 RAG 检索结果出现了两份相同引用？",
    flowLabel: "双 Worker 索引任务汇流图",
    flow: [
      ["文档上传", "1 次请求 · version 7"],
      ["待索引任务", "job 417 · pending"],
      ["Worker A", "02:14:08.101 读到 pending"],
      ["Worker B", "02:14:08.103 也读到 pending"],
      ["索引库", "相同 chunk 出现两次"],
    ],
    mapVariant: "worker-confluence",
    cameraVariant: "split-orbit",
    scene: twinStarIndexingScene,
    portrait: indexArbiterPortrait,
    command: "cd sandbox/rag-index-concurrency-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "独立判断",
        title: "先证明重复不来自上传按钮",
        prompt:
          "Network 只有一次上传，但数据库里同一 document、version、chunkIndex 出现两行。结合双 Worker 时间线，说明每份证据能证明什么、不能证明什么，并指出真正的竞争窗口。",
        placeholder:
          "一次上传能排除……，但不能排除……；数据库重复行能证明……；时间线显示 A 和 B 都在……之前读到……。因此竞争窗口位于……。",
        minimum: 120,
        artifactIds: ["upload-network", "worker-timeline", "duplicate-chunks"],
      },
      {
        id: "evidence-plan",
        label: "边界判断",
        title: "给三道一致性防线分别定责",
        prompt:
          "阅读领取仓库、表结构和日志，分别说明原子领取、chunks 唯一约束、事务边界能阻止什么，以及为什么它们不能互相替代。",
        placeholder:
          "原子领取负责……；唯一约束是最后一道……，它不能……；事务要把……和……放在同一边界。当前代码的先查再改会……。",
        minimum: 140,
        artifactIds: ["repository", "schema", "logs"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["frontend", "repository", "schema", "delivery"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是一致性方法，不是双击答案",
        prompt:
          "比较原案件的前端重复提交与本案的 Worker 竞争：触发来源哪里不同？幂等、原子领取、唯一约束和事务的选择为什么不同？最后说明单进程测试仍未证明什么。",
        placeholder:
          "原案件由……触发，本案由……触发；共同方法是先建立……再用……互证。这里不能只复用……，因为……。测试通过仍不能证明真实多 Worker 环境下的……。",
        artifactIds: ["worker-timeline", "repository", "schema"],
      },
    ],
    hints: [
      "先数请求：只有一个 POST，就不要继续把重复全归咎于前端按钮。",
      "把两条 Worker 时间线并排看：问题不是都执行了 UPDATE，而是它们在 UPDATE 前都读到了同一个 pending。",
      "修复时让领取成为带 status 条件的单个原子写操作；再用业务唯一约束兜底，并审查 chunks 与完成状态的事务边界。",
    ],
  },
  "performance-fog-lab": {
    sourceScenarioId: "performance-fog-lab",
    scenarioId: "ai-briefing-latency-retest",
    chapterId: "6",
    chapterLabel: "第 6 章能力迁移",
    location: "晨星时序港",
    cardTitle: "新案件：AI 客服晨报第二次打开仍要等首字",
    cardBody:
      "页面资源和前端渲染都不慢，这次要沿时间瀑布区分数据查询、模型首字、流式下载和缓存复用。",
    mentorName: "时序巡航官",
    mentorTitle: "性能航线导师",
    mentorLine: "不要盯着转圈猜。哪一段时间最长，哪一座灯塔就该先亮起来。",
    mentorBody:
      "慢速迷雾案件已经过去至少 24 小时。客服主管打开当天晨报，页面外壳立刻出现，正文却三秒后才流出；第二次打开依旧如此。你要先证明等待发生在哪一段，再解释为什么相同业务查询没有复用结果。",
    caseTitle: "页面很快出现，为什么 AI 晨报第一句话总要等三秒？",
    flowLabel: "AI 晨报首字时间瀑布",
    flow: [
      ["页面点击", "0ms · 发起晨报请求"],
      ["数据查询", "82ms · 读取客服事件"],
      ["模型首字", "3210ms · 最长等待"],
      ["流式下载", "47ms · 接收摘要正文"],
      ["浏览器渲染", "42ms · 24 条摘要"],
    ],
    mapVariant: "latency-cascade",
    cameraVariant: "timeline-glide",
    scene: morningStarTimingScene,
    portrait: timingNavigatorPortrait,
    command: "cd sandbox/ai-briefing-latency-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "时间归因",
        title: "先指出三秒到底花在哪里",
        prompt:
          "把首屏 Network、Server-Timing 和浏览器渲染画像放在同一条时间线上。分别说明 TTFB、data、model、download 和 render 能证明什么，再指出最主要瓶颈；不要先猜修复方案。",
        placeholder:
          "页面资源用了……；接口 TTFB 是……；服务端把它拆成 data……和 model……；下载……；渲染……。因此三秒等待主要发生在……，证据是……。",
        minimum: 130,
        artifactIds: ["first-network", "server-timing", "render-profile"],
      },
      {
        id: "evidence-plan",
        label: "复访对照",
        title: "解释为什么第二次仍然一样慢",
        prompt:
          "比较两次相同团队、相同日期的请求，再阅读缓存键代码和关联日志。说明哪些业务条件相同、什么字段只是追踪编号，以及为什么当前实现每次都会重新调用模型。",
        placeholder:
          "两次请求相同的是……，变化的是……。requestId 的作用是……，不应该进入……。当前缓存键导致……，所以第二次仍然……。修复后还要验证不同……不能串缓存。",
        minimum: 140,
        artifactIds: ["second-network", "service", "logs"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["frontend", "service", "delivery"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是性能归因方法，不是背缓存答案",
        prompt:
          "比较原项目列表与本案：一个混有数据库、缓存和大量渲染，一个主要等待模型首字。说明你如何用同一套时间线方法得出不同结论，并写出当前测试仍未覆盖的生产风险。",
        placeholder:
          "原案件的主要证据是……，本案是……；共同方法是先把总耗时拆成……，再用……复测。修复能证明……，仍不能证明真实模型波动、缓存失效和……。",
        artifactIds: ["server-timing", "second-network", "render-profile"],
      },
    ],
    hints: [
      "先比较数量级：3210ms 和 42ms 不在同一个等级，不要因为页面卡着就先怪 React。",
      "TTFB 只说明收到第一字节前在等待；用 Server-Timing 才能继续分清数据查询和模型调用。",
      "两次业务条件相同而 requestId 不同。requestId 应用于日志串联，不应该让同一份晨报生成两个缓存身份。",
    ],
  },
  "ai-api-key-vault": {
    sourceScenarioId: "ai-api-key-vault",
    scenarioId: "model-key-rotation-retest",
    chapterId: "7",
    chapterLabel: "第 7 章能力迁移",
    location: "模型密钥熔炉",
    cardTitle: "新案件：密钥轮换后 AI 助手突然失声",
    cardBody:
      "模型供应商已经换钥，前端请求仍能发出，但密钥泄露扫描、服务端配置和流式错误边界没有对齐。",
    mentorName: "密钥熔炉执钥人",
    mentorTitle: "AI 安全复测导师",
    mentorLine: "能调用模型，不代表密钥放对了地方。",
    mentorBody:
      "模型熔炉的旧接入已经过去至少 24 小时。今天供应商轮换 API Key，生产助手开始返回 401；有人提议把新 Key 临时写进前端，让你判断这是不是修复。",
    caseTitle: "AI 助手为什么在密钥轮换后失声，而且差点把新 Key 发到浏览器？",
    flowLabel: "模型密钥安全接力",
    flow: [
      ["用户提问", "浏览器只交问题"],
      ["自有 API", "读取服务端环境变量"],
      ["模型供应商", "服务端携 Key 请求"],
      ["流式响应", "只回传模型内容"],
      ["失败兜底", "不泄露密钥的可行动错误"],
    ],
    mapVariant: "secret-boundary",
    cameraVariant: "key-vault-pan",
    scene: modelKeyForgeScene,
    portrait: modelWardenPortrait,
    command: "cd sandbox/model-key-rotation-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "边界判断",
        title: "先判断 Key 应该出现在哪里",
        prompt:
          "模型请求返回 401，前端 Network 里却能看到一串疑似 API Key。写出前端、自己的 API、模型供应商各自应该收到什么，并指出最危险的错误修复。",
        placeholder:
          "前端应该只发送……；自有 API 应该从……读取 Key，再向……发请求。401 说明……。把 Key 写进……最危险，因为……。",
        minimum: 110,
        artifactIds: ["frontend-network", "frontend", "route"],
      },
      {
        id: "evidence-plan",
        label: "证据计划",
        title: "用扫描、日志和流式响应互相证明",
        prompt:
          "按顺序阅读前端密钥扫描、服务端配置、上游响应和错误日志。说明每份材料能证明什么，哪些证据仍不能证明 Key 已经安全轮换。",
        placeholder:
          "先看……确认浏览器是否拿到 Key；再看……确认服务端读取……；最后用……判断 401 是否被安全兜底。它们仍不能证明……，所以还要……。",
        minimum: 130,
        artifactIds: ["frontend-network", "env-config", "upstream", "logs"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["frontend", "route", "env-config", "delivery"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是安全边界，不是背 API Key 答案",
        prompt:
          "比较原章节的首次 AI 接入与本案的密钥轮换：故障表现哪里不同？服务端持有 Key、流式回传和错误兜底的方法如何迁移？写出测试仍不能证明的生产风险。",
        placeholder:
          "不同点是……；共同边界是……；我用……证明浏览器没有拿到 Key，用……证明失败可行动。测试通过仍不能证明……。",
        artifactIds: ["frontend-network", "env-config", "logs", "delivery"],
      },
    ],
    hints: [
      "先问一个简单问题：打开浏览器开发者工具，用户能不能复制出供应商 Key？能的话已经是安全事故，不是正常接入。",
      "把 401 分成两层：供应商拒绝服务端凭证，和你自己的 API 如何向用户解释失败；不要把供应商错误原样吐出密钥或内部配置。",
      "流式响应只应该流出模型内容和安全错误；环境变量、请求头和完整上游响应都留在服务端边界内。",
    ],
  },
  "hallucination-mirror-hall": {
    sourceScenarioId: "hallucination-mirror-hall",
    scenarioId: "citation-grounding-retest",
    chapterId: "8",
    chapterLabel: "第 8 章能力迁移",
    location: "幻觉镜厅",
    cardTitle: "新案件：客服回答听起来对，却引用了不存在的规定",
    cardBody:
      "回答语气很自信，引用编号也像真的；但资料库里找不到对应内容。你要把“说得像”与“有依据”分开验收。",
    mentorName: "镜厅校对师",
    mentorTitle: "可验证回答导师",
    mentorLine: "镜子会把空白也照成答案，证据不会。",
    mentorBody:
      "幻觉镜厅的旧案例已经过去至少 24 小时。新的客服机器人回答了退款政策，却给出一个不存在的条款编号。产品经理想加一句“请自信回答”，你要判断真正缺的是 Prompt、资料、引用校验还是拒答边界。",
    caseTitle: "AI 为什么能给出完整解释，却引用了不存在的退款条款？",
    flowLabel: "可验证回答证据链",
    flow: [
      ["用户问题", "退款政策疑问"],
      ["资料上下文", "允许引用的原文"],
      ["Prompt 合约", "回答规则 + 不确定时拒答"],
      ["模型回答", "结论 + 原文引用"],
      ["引用校验", "命中或返回需人工确认"],
    ],
    mapVariant: "citation-mirror",
    cameraVariant: "mirror-sweep",
    scene: hallucinationMirrorScene,
    portrait: mirrorEditorPortrait,
    command: "cd sandbox/citation-grounding-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "真假判断",
        title: "先找出回答为什么像真的",
        prompt:
          "回答包含明确结论、条款编号和礼貌语气，但资料中没有这个编号。写出哪些部分只是表达效果，哪些证据才能证明答案真的有依据。",
        placeholder:
          "结论听起来……，但这只能证明……；条款编号……也不能单独证明……。真正要互证的是……和……，缺资料时应该……。",
        minimum: 110,
        artifactIds: ["answer", "source-doc", "prompt-contract"],
      },
      {
        id: "evidence-plan",
        label: "证据计划",
        title: "把回答、资料和引用逐项对照",
        prompt:
          "阅读模型回答、允许引用的资料和引用校验日志。说明哪一条引用没有命中、Prompt 哪条边界缺失，以及无资料问题应该如何返回。",
        placeholder:
          "回答声称……；资料实际只写……；引用……没有命中。Prompt 缺少……，校验器应在……时……。",
        minimum: 130,
        artifactIds: ["answer", "source-doc", "citation-check", "logs"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: [
          "prompt-contract",
          "citation-check",
          "frontend",
          "delivery",
        ],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是可验证输出，不是背拒答话术",
        prompt:
          "比较原章节的知识迷宫与本案的退款问答：资料如何进入回答、引用如何证明结论、无命中时如何保护用户？写出测试仍不能证明的真实风险。",
        placeholder:
          "原案件更关注……，本案更关注……；共同方法是让回答带着……并经过……。测试通过仍不能证明……，还需要……。",
        artifactIds: ["source-doc", "citation-check", "logs", "delivery"],
      },
    ],
    hints: [
      "先把回答拆成三层：结论、引用、语气。只有引用能在原资料中命中，才有机会证明结论有依据。",
      "Prompt 不是事实来源；它只能规定模型如何使用资料、什么时候承认不知道。",
      "没有命中的引用不能用‘模型很自信’补齐。安全结果应该是明确说明资料不足，并把问题交给人工确认。",
    ],
  },
  "rag-knowledge-maze": {
    sourceScenarioId: "rag-knowledge-maze",
    scenarioId: "retrieval-mismatch-retest",
    chapterId: "9",
    chapterLabel: "第 9 章能力迁移",
    location: "知识迷宫深井",
    cardTitle: "新案件：资料明明在库里，AI 却找错了书页",
    cardBody:
      "上传成功不等于检索正确。两份文档主题相近，检索结果命中了旧版本，回答因此引用了过时规则。",
    mentorName: "知识馆守卷人",
    mentorTitle: "检索证据导师",
    mentorLine: "找到一页，不代表找到的是那一页。",
    mentorBody:
      "知识迷宫的初次建库已经过去至少 24 小时。客服问新退款规则时，系统确实返回了命中结果，却引用了旧版本。有人想把 topK 调大解决一切，你要沿文档来源、chunk、命中分数和最终引用找出真正断点。",
    caseTitle: "RAG 为什么“检索到了”，回答却引用了旧版本规则？",
    flowLabel: "知识检索证据路线",
    flow: [
      ["原始文档", "新旧政策版本"],
      ["切分 Chunk", "保留来源与版本"],
      ["Embedding", "转成可比较表示"],
      ["TopK 检索", "命中候选片段"],
      ["引用回答", "回答对应正确来源"],
    ],
    mapVariant: "retrieval-maze",
    cameraVariant: "maze-orbit",
    scene: ragKnowledgeMazeScene,
    portrait: knowledgeKeeperPortrait,
    command: "cd sandbox/retrieval-mismatch-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "命中判断",
        title: "先分清搜到和搜对",
        prompt:
          "回答带有一个命中片段和引用，但引用来自旧版政策。写出上传成功、chunk 命中、相似度分数和正确回答分别能证明什么，不能证明什么。",
        placeholder:
          "上传成功只能证明……；命中 chunk 能证明……，但不能证明……；相似度分数不能替代……。要证明回答正确还要检查……。",
        minimum: 120,
        artifactIds: ["upload", "matches", "answer"],
      },
      {
        id: "evidence-plan",
        label: "证据计划",
        title: "沿来源、版本和引用回溯错配",
        prompt:
          "阅读文档切分结果、TopK 命中列表、回答引用和检索日志。指出旧版本为什么进入候选，哪一层缺少版本过滤或来源校验，并设计一次复测。",
        placeholder:
          "先看……确认 chunk 来源；再看……比较分数和版本；最后对照……。断点在……，因为……。修复后我会用新旧……各测一次。",
        minimum: 140,
        artifactIds: ["chunks", "matches", "logs", "answer"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["chunks", "retriever", "answer", "delivery"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是检索证据方法，不是背 topK",
        prompt:
          "比较原知识库关卡与本案：文档类型和版本哪里不同？切分、来源保留、检索过滤、引用校验的方法如何迁移？写出测试仍不能证明的真实风险。",
        placeholder:
          "不同点是……；共同方法是让每个 chunk 带着……，再用……检查回答。topK 调大不能解决……。测试通过仍不能证明……。",
        artifactIds: ["chunks", "matches", "answer", "logs"],
      },
    ],
    hints: [
      "先把‘命中’拆成两件事：相似度找到候选，业务规则确认候选是不是当前有效版本。",
      "chunk 如果丢掉文档路径、版本和生效时间，后面再高的相似度也无法解释来源。",
      "复测至少要包含新版本问题、旧版本相似问题和完全无关问题，分别检查命中、引用和拒答。",
    ],
  },
  "agent-tool-tower": {
    sourceScenarioId: "agent-tool-tower",
    scenarioId: "tool-boundary-retest",
    chapterId: "10",
    chapterLabel: "第 10 章能力迁移",
    location: "工具契约高塔",
    cardTitle: "新案件：Agent 调错工具，差点读走整座资料库",
    cardBody:
      "Agent 说自己只是要查询一个订单，却提交了任意路径和越权参数。工具注册表、Schema、权限门和失败回退没有形成完整防线。",
    mentorName: "塔楼副官",
    mentorTitle: "Agent 工具边界导师",
    mentorLine: "会调用工具只是起点，知道什么时候不能调用才是能力。",
    mentorBody:
      "工具契约大厅的旧任务已经过去至少 24 小时。新的客服 Agent 请求查询订单，却把 `path` 改成了内部文件路径。有人建议给 Agent 更高权限让它“别再失败”，你要沿工具注册、参数校验、权限判断和审计日志做出拒绝决定。",
    caseTitle: "Agent 为什么能调用工具，却差点越权读取不该看的资料？",
    flowLabel: "Agent 工具安全接力",
    flow: [
      ["Agent 意图", "查询订单状态"],
      ["工具注册表", "允许的工具与权限"],
      ["参数 Schema", "类型 + 范围校验"],
      ["权限门", "资源归属与动作"],
      ["审计回退", "拒绝并留下可追踪原因"],
    ],
    mapVariant: "tool-gate-tower",
    cameraVariant: "tower-ascend",
    scene: agentToolContractHallScene,
    portrait: toolWardenPortrait,
    command: "cd sandbox/tool-boundary-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "越权判断",
        title: "先判断这次调用该不该放行",
        prompt:
          "Agent 请求查询订单，但参数包含任意文件路径。分别写出意图、工具、参数和资源权限各自应该证明什么，并给出允许、拒绝或转人工的决定。",
        placeholder:
          "Agent 想做的是……；注册表只允许……；参数中的……越过了……边界。因此这次应……，原因是……，不能只因为 Agent 说……就放行。",
        minimum: 120,
        artifactIds: ["agent-request", "registry", "schema"],
      },
      {
        id: "evidence-plan",
        label: "门禁串证",
        title: "把 Schema、权限和审计日志串起来",
        prompt:
          "阅读工具注册表、参数 Schema、权限日志和失败回退响应。指出哪一层放过了越权参数，修复后需要验证哪些合法与非法请求。",
        placeholder:
          "注册表允许……；Schema 校验了……却漏了……；权限日志显示……。真正断点在……。我会分别用合法……、越权……和失败……复测。",
        minimum: 140,
        artifactIds: ["registry", "schema", "audit-log", "fallback"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["registry", "schema", "audit-log", "delivery"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是工具边界，不是背一个拒绝条件",
        prompt:
          "比较原 Agent 工具关卡与本案：工具用途、资源归属和失败方式哪里不同？注册表、Schema、权限门、审计回退如何共同保护系统？写出测试仍不能证明的风险。",
        placeholder:
          "不同点是……；共同边界是……；只有……时才允许执行。测试通过仍不能证明 Agent 在真实……场景下不会……，所以还要……。",
        artifactIds: ["agent-request", "registry", "audit-log", "fallback"],
      },
    ],
    hints: [
      "先把‘Agent 想做什么’和‘工具实际能做什么’分开；自然语言意图不能替代权限判断。",
      "Schema 负责形状和范围，权限门负责资源归属和动作，两者不是同一件事。",
      "拒绝也要是产品能力：返回不泄露内部路径的原因，写入 requestId 和审计记录，并给出下一步可行动建议。",
    ],
  },
  "verification-trial-arena": {
    sourceScenarioId: "verification-trial-arena",
    scenarioId: "verification-proof-retest",
    chapterId: "11",
    chapterLabel: "第 11 章能力迁移",
    location: "验收试炼场",
    cardTitle: "新案件：全部通过的报告，为什么仍然不能合并？",
    cardBody:
      "新项目的修复报告看起来全绿，但它引用了旧源码指纹。你要重新追踪失败复现、单测、集成、手动路径和回归风险，判断这份交付能不能被接收。",
    mentorName: "验收试炼官",
    mentorTitle: "证据链导师",
    mentorLine: "绿色只是结果颜色，可信还要看它证明了什么。",
    mentorBody:
      "上一场试炼已经过去至少 24 小时。现在 Agent 递来一份‘全部通过’的报告，Network 也看起来正常，但日志里藏着旧源码 hash。你要像真正的审查者一样，先问这份证据是不是属于当前代码，再决定是否接受交付。",
    caseTitle: "报告全绿、Network 正常，为什么我仍然不能说修好了？",
    flowLabel: "可信验收证据路线",
    flow: [
      ["失败复现", "先证明旧问题真的存在"],
      ["单元测试", "锁住一个小边界"],
      ["集成测试", "证明真实链路"],
      ["手动复测", "确认用户路径"],
      ["源码指纹", "确认报告属于当前版本"],
    ],
    mapVariant: "proof-arena",
    cameraVariant: "arena-drop",
    scene: verificationTrialArenaScene,
    portrait: testArbiterPortrait,
    command: "cd sandbox/verification-proof-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "报告判伪",
        title: "先判断这份全绿报告能不能信",
        prompt:
          "阅读失败复现、过期通过报告、Network 和后端日志。指出报告声称证明了什么，哪条证据直接暴露它不属于当前代码，并给出接收或退回决定。",
        placeholder:
          "报告声称……；失败复现证明……；Network 只能证明……；日志里的……与当前……不一致。因此我会……，因为……不能替代……。",
        minimum: 120,
        artifactIds: ["failing-before", "passing-stale", "logs"],
      },
      {
        id: "evidence-plan",
        label: "证据补全",
        title: "把自动化、手动和版本对应关系补齐",
        prompt:
          "根据单测、集成测试、手动报告和源码指纹，列出修复后必须复测的路径。说明每份证据能证明什么，不能证明什么。",
        placeholder:
          "单测证明……；集成测试证明……；手动复测补充……；源码指纹负责确认……。我还会补测……，因为当前证据不能证明……。",
        minimum: 140,
        artifactIds: ["report-validator", "network", "manual-report", "logs"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: [
          "failing-before",
          "report-validator",
          "manual-report",
          "delivery",
        ],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是验收方法，不是背 hash",
        prompt:
          "比较原始保存问题和本案的验收现场：业务与代码哪里不同？失败复现、自动化、手动路径、源码版本和回归风险如何共同支撑接收决定？",
        placeholder:
          "不同点是……；共同方法是先……再……，最后确认……。通过测试仍不能证明……，所以我会继续……。",
        artifactIds: [
          "failing-before",
          "passing-stale",
          "manual-report",
          "delivery",
        ],
      },
    ],
    hints: [
      "先区分‘请求成功’和‘问题已修复’：Network 只覆盖一次运行，不自动证明刷新、旧问题和当前源码。",
      "可信验收至少要串起失败复现、单测、集成测试和手动路径；每一层都要写清自己的证据边界。",
      "源码 hash 不是装饰，它用来确认报告对应你正在审查的版本；不匹配时应退回补证，而不是凭绿色数字合并。",
    ],
  },
  "agent-brief-forge": {
    sourceScenarioId: "agent-brief-forge",
    scenarioId: "brief-contract-retest",
    chapterId: "12",
    chapterLabel: "第 12 章能力迁移",
    location: "委托书锻造工坊",
    cardTitle: "新案件：Agent 改对了代码，却把上线风险一起带来了",
    cardBody:
      "这次不是修一个页面，而是给客服知识库增加批量导入。旧委托只写了‘接入上传’，Agent 改了范围外的部署配置，还没有回滚和验收标准。",
    mentorName: "委托书锻造师",
    mentorTitle: "Agent 协作导师",
    mentorLine: "写给 Agent 的不是愿望，是一份可以被验收的契约。",
    mentorBody:
      "上一场委托书工坊已经过去至少 24 小时。新的业务要导入客服知识库，Agent 说‘我已经把上传做了’，但交付里混入了部署改动。你要找出背景、目标、边界、验收和回滚分别缺了什么，再重新写出能安全执行的委托。",
    caseTitle: "Agent 说“上传功能已完成”，为什么这份委托不能直接执行？",
    flowLabel: "Agent 委托契约路线",
    flow: [
      ["背景证据", "为什么现在要做"],
      ["可观察目标", "完成后看见什么"],
      ["允许范围", "只能改哪些地方"],
      ["验收标准", "怎样证明交付"],
      ["风险回滚", "出问题如何退回"],
    ],
    mapVariant: "brief-contract",
    cameraVariant: "brief-unroll",
    scene: agentBriefForgeScene,
    portrait: briefForgemasterPortrait,
    command: "cd sandbox/brief-contract-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "委托判读",
        title: "先找出这份任务为什么会把 Agent 带偏",
        prompt:
          "阅读业务请求、模糊委托、越界修改和 Agent 交付。分别指出背景、目标、范围、验收和回滚缺了什么，并决定这份委托是否应该启动。",
        placeholder:
          "业务要解决……；模糊委托只说……；Agent 于是改了……。缺失的是……，所以我会先……，不能直接让它……。",
        minimum: 120,
        artifactIds: ["request", "vague-brief", "delivery"],
      },
      {
        id: "evidence-plan",
        label: "契约补全",
        title: "把目标、边界和验收写成可检查的条款",
        prompt:
          "比较越界委托与清晰委托，补出本案的可观察目标、允许/禁止范围、验收命令、浏览器路径、风险和回滚。",
        placeholder:
          "完成后必须能观察到……；允许修改……，禁止……；我会运行……并在浏览器……；失败时回滚……。",
        minimum: 140,
        artifactIds: [
          "vague-brief",
          "unsafe-brief",
          "clear-brief",
          "validator",
        ],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["request", "clear-brief", "validator", "delivery"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是委托方法，不是背五个字段",
        prompt:
          "比较原任务与本案：业务、代码范围和风险哪里不同？背景、目标、约束、验收和回滚为什么仍然要一起出现？",
        placeholder:
          "不同点是……；共同方法是先把……变成可观察结果，再限制……，最后约定……。即使委托通过，也不能证明……，还要……。",
        artifactIds: ["request", "clear-brief", "unsafe-brief", "delivery"],
      },
    ],
    hints: [
      "先把‘我要一个上传功能’改成‘哪个用户在什么页面完成什么动作，完成后能观察到什么结果’。",
      "允许范围和禁止事项是 Agent 的护栏；没有它们，Agent 可能把部署、依赖或数据迁移也一起改掉。",
      "验收要包含命令、浏览器路径、期望结果和失败回滚；‘看起来能用’不是验收标准。",
    ],
  },
  "delivery-review-court": {
    sourceScenarioId: "delivery-review-court",
    scenarioId: "review-evidence-retest",
    chapterId: "13",
    chapterLabel: "第 13 章能力迁移",
    location: "交付审查庭",
    cardTitle: "新案件：Diff 很小，但关键证据都漏了",
    cardBody:
      "Agent 只改了一个组件，看起来风险很低；但测试报告来自旧源码，浏览器只测了桌面，README 也没有同步。你要决定这份交付是合并还是退回补证。",
    mentorName: "交付审查官",
    mentorTitle: "质量边界导师",
    mentorLine: "审查不是挑错，而是确认每个承诺都有证据。",
    mentorBody:
      "上一场委托已经过去至少 24 小时。新的交付说明说‘只改了一个按钮’，但 Diff、测试报告、移动端浏览器记录和文档状态没有对齐。你要沿审查庭的四个证据台，判断 Agent 是真的完成，还是只把风险藏在小 Diff 里。",
    caseTitle: "只改一个组件的交付，为什么仍然不能直接合并？",
    flowLabel: "交付审查证据路线",
    flow: [
      ["交付说明", "承诺改了什么"],
      ["Diff 范围", "实际改了什么"],
      ["测试证据", "报告属于哪个版本"],
      ["浏览器边界", "手机也能用吗"],
      ["审查决定", "接收还是补证"],
    ],
    mapVariant: "review-court",
    cameraVariant: "diamond-sweep",
    scene: deliveryReviewCourtScene,
    portrait: deliveryJudgePortrait,
    command: "cd sandbox/review-evidence-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "交付判读",
        title: "先比较承诺、Diff 和证据是否对得上",
        prompt:
          "阅读交付说明、Diff 摘要、测试报告和浏览器记录。指出哪些承诺有证据，哪些证据已经过期或缺少移动端，并给出接收或退回决定。",
        placeholder:
          "交付说明说……；Diff 实际包含……；测试报告的版本是……；浏览器只覆盖……。因此我会……，因为不能用……替代……。",
        minimum: 120,
        artifactIds: ["delivery-note", "diff-summary", "test-evidence"],
      },
      {
        id: "evidence-plan",
        label: "审查补证",
        title: "把回归风险、移动端和文档缺口列成补证清单",
        prompt:
          "对照浏览器验收、文档同步、后端日志和拒收决定，写出合并前必须补的证据，并说明每项为什么影响真实用户或后续维护。",
        placeholder:
          "必须补……；因为当前只证明……，没有证明……。我会重新运行……、验证 390px……，并同步……。",
        minimum: 140,
        artifactIds: ["browser-checks", "docs-sync", "logs", "decision"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: [
          "delivery-note",
          "diff-summary",
          "browser-checks",
          "decision",
        ],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是审查方法，不是背拒收理由",
        prompt:
          "比较原审查庭与本案：改动范围和业务哪里不同？为什么每次都要把 Diff、测试版本、浏览器边界和文档同步放在同一份决定里？",
        placeholder:
          "不同点是……；共同方法是对照……与……，再检查……。即使补证后通过，也不能证明……，还要……。",
        artifactIds: [
          "delivery-note",
          "test-evidence",
          "browser-checks",
          "docs-sync",
        ],
      },
    ],
    hints: [
      "Diff 小不代表风险小；先看它是否覆盖了交付说明承诺的全部文件和行为。",
      "测试报告必须对应当前源码，桌面通过也不能代替 390px 浏览器路径。",
      "文档同步是交付的一部分：未来接手的人需要知道改了什么、怎么验证和哪里仍有风险。",
    ],
  },
  "release-readiness-gate": {
    sourceScenarioId: "release-readiness-gate",
    scenarioId: "release-proof-retest",
    chapterId: "14",
    chapterLabel: "第 14 章能力迁移",
    location: "上线门禁塔",
    cardTitle: "新案件：上线按钮亮了，但回滚和监控都没准备好",
    cardBody:
      "这次是知识库导入服务上线。环境变量看起来齐全，备份也做过，但没有证明能恢复，390px 冒烟和 AI 失败率监控也缺失。",
    mentorName: "上线守门人",
    mentorTitle: "发布安全导师",
    mentorLine: "上线不是按下按钮，而是准备好出问题以后还能回来。",
    mentorBody:
      "上一场交付审查已经过去至少 24 小时。现在发布列车已经到站，负责人催你点上线，但备份恢复、移动端冒烟、监控信号和回滚触发条件都没有闭环。你要沿上线门禁逐项判断，决定是放行还是暂缓。",
    caseTitle: "环境变量都在，为什么上线门禁仍然不能放行？",
    flowLabel: "上线安全证据路线",
    flow: [
      ["上线计划", "谁负责、谁值守"],
      ["环境变量", "生产配置是否安全"],
      ["备份恢复", "出事能不能回来"],
      ["冒烟监控", "用户和信号都覆盖"],
      ["回滚决定", "放行还是暂缓"],
    ],
    mapVariant: "release-gate",
    cameraVariant: "gate-lock",
    scene: releaseReadinessGateScene,
    portrait: releaseGatekeeperPortrait,
    command: "cd sandbox/release-proof-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "上线判读",
        title: "先判断这趟发布列车能不能出站",
        prompt:
          "阅读上线计划、环境变量、备份记录、冒烟测试和监控快照。指出哪些门禁已经有证据，哪些缺口会让上线后无法发现或无法恢复事故。",
        placeholder:
          "负责人和值守是……；环境变量证明……；备份只证明……却没有……；冒烟缺少……；监控缺少……。因此我会……。",
        minimum: 120,
        artifactIds: ["release-plan", "environment", "backup", "smoke-test"],
      },
      {
        id: "evidence-plan",
        label: "门禁补证",
        title: "把上线前必须补齐的证据排出顺序",
        prompt:
          "根据日志、监控快照和回滚方案，写出放行前的补证顺序。说明哪些证据要在生产前完成，哪些信号要在上线后持续观察。",
        placeholder:
          "先补……，再验证……；上线后观察……；如果……超过……就执行……并在……后确认恢复。",
        minimum: 140,
        artifactIds: ["monitoring", "rollback", "logs", "backup"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["release-plan", "smoke-test", "monitoring", "rollback"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是上线判断，不是背一张清单",
        prompt:
          "比较原上线门禁与本案：业务、数据变化和风险哪里不同？为什么负责人、配置、恢复、冒烟、监控和回滚必须互相接上？",
        placeholder:
          "不同点是……；共同方法是先确认……，再证明……，最后约定……。即使门禁通过，也不能证明……，还要……。",
        artifactIds: ["release-plan", "backup", "monitoring", "rollback"],
      },
    ],
    hints: [
      "环境变量存在不等于配置正确；要区分是否存在、是否安全、是否被当前版本使用。",
      "备份只有在恢复演练成功时才有保护价值；上线后还要有能看见 AI 失败和用户异常的信号。",
      "回滚必须写触发条件、执行动作和恢复后的验证，不要只写‘必要时回滚’。",
    ],
  },
  "interview-answer-forge": {
    sourceScenarioId: "interview-answer-forge",
    scenarioId: "interview-proof-retest",
    chapterId: "15",
    chapterLabel: "第 15 章能力迁移",
    location: "终章答辩厅",
    cardTitle: "终场追问：你真的做过，还是只背过答案？",
    cardBody:
      "新的面试官不再问原项目，而是换成 AI 知识库导入事故。你要把证据链讲成 STAR，说明技术取舍和代价，并在追问中承认尚未验证的边界。",
    mentorName: "终章答辩官",
    mentorTitle: "职业表达导师",
    mentorLine: "好的面试回答不是把自己说得无敌，而是让证据和边界都清楚。",
    mentorBody:
      "上一场上线门禁已经过去至少 24 小时。现在面试官换了业务场景，要求你解释一个 AI 知识库导入事故。你不能只背 STAR 四个字，要把现象、证据、行动、结果、取舍、风险和追问连成一段可信的工程故事。",
    caseTitle: "你能把一次工程故障讲成可信、可追问的项目经历吗？",
    flowLabel: "面试证据星图",
    flow: [
      ["故事素材", "真实背景与目标"],
      ["STAR", "行动与可验证结果"],
      ["故障复盘", "证据与修复动作"],
      ["技术取舍", "代价与边界"],
      ["追问应答", "不夸大、不躲闪"],
    ],
    mapVariant: "interview-constellation",
    cameraVariant: "answer-orbit",
    scene: interviewDefenseHallScene,
    portrait: interviewCouncilorPortrait,
    command: "cd sandbox/interview-proof-retest && npm test",
    stages: [
      {
        id: "independent-diagnosis",
        label: "故事判读",
        title: "先判断哪些内容真的能讲进面试",
        prompt:
          "阅读项目素材、STAR 草稿、故障复盘和追问。指出哪些内容有证据，哪些只是自我评价或夸大掌握，并决定这份回答是否可信。",
        placeholder:
          "我负责……；证据是……；结果可以证明……，但不能证明……。因此我会保留……，删掉……。",
        minimum: 120,
        artifactIds: ["story-bank", "star-draft", "incident-review"],
      },
      {
        id: "evidence-plan",
        label: "表达补证",
        title: "把结果、代价和边界补成可追问的回答",
        prompt:
          "根据技术取舍、追问答案和答辩 Rubric，列出回答中必须补充的证据、代价和未验证风险。",
        placeholder:
          "结果由……证明；取舍的代价是……；面试官可能追问……，我会回答……；仍未验证的是……。",
        minimum: 140,
        artifactIds: ["tradeoff", "follow-ups", "rubric", "incident-review"],
      },
      {
        ...sharedFinalStages.agentBrief,
        artifactIds: ["story-bank", "star-draft", "tradeoff", "follow-ups"],
      },
      {
        ...sharedFinalStages.reflection,
        title: "说明你迁移的是讲证据的方法，不是背 STAR",
        prompt:
          "比较原项目和本案的业务差异：你如何把相同的工程方法迁移到新事故？哪些能力可以复用，哪些必须诚实说明还没验证？",
        placeholder:
          "不同点是……；可迁移的是……；不能直接声称……，因为……。下一步我会用……验证。",
        artifactIds: [
          "story-bank",
          "incident-review",
          "tradeoff",
          "follow-ups",
        ],
      },
    ],
    hints: [
      "STAR 不是套话：Situation 和 Task 要说明真实背景，Action 要说你查了什么证据，Result 要能被验证。",
      "技术取舍必须同时说选择和代价；只说‘更安全’不够，要说明多了什么复杂度。",
      "面试里承认尚未做真人迁移复测，比声称‘已经完全掌握’更可信，也更容易继续追问。",
    ],
  },
};

export const transferRetestSourceIds = Object.keys(
  transferRetestConfigs,
) as TransferRetestSourceId[];

export function getTransferRetestConfig(sourceScenarioId: string) {
  const config =
    transferRetestConfigs[sourceScenarioId as TransferRetestSourceId];
  if (!config) throw new Error("未知的延迟变式复测");
  return config;
}
