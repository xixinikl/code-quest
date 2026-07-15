export type ChapterStatus = "当前" | "预览" | "待解锁";

export type CareerChapter = {
  id: string;
  chapter: number;
  world: string;
  status: ChapterStatus;
  theme: string;
  title: string;
  summary: string;
  storyScene: string;
  learn: string;
  validation: string;
  workBackground: string;
  flow: string;
  flowPayloads: string[];
  glossary: string[];
  codeFocus: string;
  evidenceTask: string;
  agentCollaboration: string;
  acceptanceAction: string;
  interviewReview: string;
  rewards: string[];
  companionUnlock: {
    type: "伙伴" | "宠物" | "装备";
    name: string;
    description: string;
  };
};

export type CareerRouteStatus = "可进入" | "即将解锁";

export type SharedCoreAbilityId =
  | "read-project"
  | "trace-flow"
  | "diagnose-fault"
  | "read-evidence"
  | "direct-agent"
  | "verify-delivery"
  | "explain-work";

export type SharedCoreAbility = {
  id: SharedCoreAbilityId;
  label: string;
  workAction: string;
  evidence: string;
  aiChapterIds: readonly string[];
  transferTo: Readonly<Record<CareerRoute["id"], string>>;
};

export type CareerRoute = {
  id: "ai-development" | "java-backend" | "frontend-engineering";
  label: string;
  role: string;
  status: CareerRouteStatus;
  summary: string;
  promise: string;
  coreSkills: readonly string[];
  chapters: readonly CareerChapter[];
  previewChapters: readonly string[];
};

export const chapterContract = [
  "剧情场景",
  "工作背景",
  "完整流程图",
  "名词小抄",
  "关键代码",
  "证据任务",
  "Agent 协作",
  "验收动作",
  "面试复盘",
  "伙伴/宠物解锁",
] as const;

export const sharedCoreAbilities = [
  {
    id: "read-project",
    label: "读懂项目",
    workAction: "先找入口、模块和职责，再决定从哪个文件开始读。",
    evidence: "项目地图、文件职责和入口调用关系",
    aiChapterIds: ["1", "2"],
    transferTo: {
      "ai-development": "看懂页面、AI 服务、会话和数据分别负责什么。",
      "java-backend": "看懂 Controller、Service、Repository 的分层职责。",
      "frontend-engineering": "看懂页面、组件、状态和请求模块的边界。",
    },
  },
  {
    id: "trace-flow",
    label: "追踪数据流",
    workAction: "说清谁收到什么、做了什么、再把什么交给下一层。",
    evidence: "请求体、响应体、函数参数和数据库记录",
    aiChapterIds: ["1", "3", "9"],
    transferTo: {
      "ai-development": "追踪输入如何经过接口、检索或模型再回到界面。",
      "java-backend": "追踪 DTO 如何经过业务层、事务和数据库。",
      "frontend-engineering": "追踪用户操作如何变成状态、请求和渲染结果。",
    },
  },
  {
    id: "diagnose-fault",
    label: "定位故障",
    workAction: "先复现现象，再沿流程找到第一处证据断点。",
    evidence: "失败复现、时间线和修复前后对比",
    aiChapterIds: ["4", "5", "6", "8"],
    transferTo: {
      "ai-development": "区分参数、数据、性能和模型输出问题。",
      "java-backend": "区分校验、业务、事务、缓存和依赖异常。",
      "frontend-engineering": "区分交互、状态、接口和渲染问题。",
    },
  },
  {
    id: "read-evidence",
    label: "读取证据",
    workAction: "用 Network、日志、数据库和测试互相印证，不凭成功提示下结论。",
    evidence: "Network、服务端日志、数据库查询和测试报告",
    aiChapterIds: ["1", "4", "6", "11"],
    transferTo: {
      "ai-development": "证明请求、模型调用与保存结果是否真的一致。",
      "java-backend": "用日志、SQL 和接口结果锁定服务端断点。",
      "frontend-engineering": "用 Network、性能记录和界面状态证明问题位置。",
    },
  },
  {
    id: "direct-agent",
    label: "委托 Agent",
    workAction: "写清背景、目标、范围、约束、验收和风险。",
    evidence: "可执行任务、允许范围和验收命令",
    aiChapterIds: ["10", "12"],
    transferTo: {
      "ai-development": "约束模型、工具与数据边界，避免 Agent 越权。",
      "java-backend": "约束接口、迁移、数据安全和回滚范围。",
      "frontend-engineering": "约束页面范围、响应式、可访问性和浏览器路径。",
    },
  },
  {
    id: "verify-delivery",
    label: "验收交付",
    workAction: "核对 Diff、自动化、手动路径、风险和项目记忆。",
    evidence: "Diff、测试、浏览器结果、风险与回滚记录",
    aiChapterIds: ["11", "13", "14"],
    transferTo: {
      "ai-development": "验证 AI 行为、工程链路与失败兜底。",
      "java-backend": "验证接口契约、数据迁移、性能和回滚。",
      "frontend-engineering": "验证交互、响应式、可访问性和回归风险。",
    },
  },
  {
    id: "explain-work",
    label: "讲清项目",
    workAction: "把背景、行动、证据结果、取舍和反思讲成可追问故事。",
    evidence: "STAR、故障复盘、技术取舍和追问答案",
    aiChapterIds: ["15"],
    transferTo: {
      "ai-development": "讲清 AI 功能、可信输出与 Agent 协作。",
      "java-backend": "讲清服务端故障、数据取舍和上线保障。",
      "frontend-engineering": "讲清用户体验、状态治理和性能优化。",
    },
  },
] as const satisfies readonly SharedCoreAbility[];

export const aiCareerRoadmap = [
  {
    id: "1",
    chapter: 1,
    world: "数据断层",
    status: "当前",
    theme: "数据为什么消失",
    title: "保存成功，刷新后没了",
    summary: "追踪一次保存请求从页面走到数据库时在哪里断掉。",
    storyScene: "代码城档案馆报警：保存灯亮了，但第二天档案又消失。",
    learn: "前端、接口、数据库、持久化、证据链",
    validation: "能解释一次保存请求从页面到数据库怎么走",
    workBackground: "工作里最常见的保存失败、刷新丢数据和读写不一致问题。",
    flow: "用户 → 前端页面 → 后端接口 → 数据层 → 数据库 → 刷新验收",
    flowPayloads: [
      "点击保存 + 当前草稿",
      "POST /api/canvases + 草稿 JSON",
      "校验后的画布对象",
      "INSERT 写入动作",
      "数据库中的新记录",
    ],
    glossary: ["前端", "接口", "数据库", "持久化", "201", "SELECT"],
    codeFocus: "fetch、response.ok、POST 路由、saveCanvas、INSERT",
    evidenceTask: "对比 Network 201、后端日志、数据库 SELECT 0 rows。",
    agentCollaboration:
      "给 Agent 写清复现路径、断点证据和必须补上的数据库写入。",
    acceptanceAction:
      "保存后刷新仍能看到记录，数据库里能查到对应行，测试通过。",
    interviewReview:
      "我沿请求链定位到数据层只写内存、读取查数据库，修复后用数据库和测试双重验收。",
    rewards: ["数据流追踪", "数据库验证", "结案复盘"],
    companionUnlock: {
      type: "伙伴",
      name: "档案馆记录员",
      description: "会在你被绿色成功提示迷惑时，提醒你去查数据库证据。",
    },
  },
  {
    id: "2",
    chapter: 2,
    world: "产品密室",
    status: "预览",
    theme: "AI 点子为什么空泛",
    title: "把 AI 点子拆成产品链路",
    summary: "从一句空泛想法拆到 Project Brief、方向筛选、候选取舍和会话保存。",
    storyScene: "创意工坊里冒出一堆 AI 点子，却没人知道先做哪一个。",
    learn: "Project Brief、方向筛选、候选取舍、会话保存",
    validation: "能把 AI 功能讲成产品链路",
    workBackground:
      "真实工作里不会只说“做个 AI 功能”，要说清用户、输入、输出和保存。",
    flow: "用户目标 → Brief → 候选方向 → 取舍理由 → 会话保存 → AI 状态解释",
    flowPayloads: [
      "用户、问题和成功标准",
      "结构化 Project Brief",
      "候选方案与利弊",
      "选中方案和取舍原因",
      "可恢复的会话记录",
    ],
    glossary: ["Project Brief", "候选方案", "会话", "状态", "取舍"],
    codeFocus: "方向选择状态、保存会话、AI 状态展示和空状态处理",
    evidenceTask: "给出至少两个候选方案，并说明为什么选一个、放弃另一个。",
    agentCollaboration:
      "让 Agent 先输出 Brief 和验收口径，再开始改界面或接口。",
    acceptanceAction: "用户能看懂功能目标、选择路径、保存结果和下一步动作。",
    interviewReview: "我把模糊 AI 想法拆成可开发链路，并用取舍理由减少返工。",
    rewards: ["需求拆解", "状态管理", "产品表达"],
    companionUnlock: {
      type: "宠物",
      name: "灵感萤火",
      description: "会把空泛想法照成 Brief、方向和取舍三步。",
    },
  },
  {
    id: "3",
    chapter: 3,
    world: "身份回廊",
    status: "待解锁",
    theme: "登录状态为什么丢",
    title: "找回消失的登录状态",
    summary: "解释 Cookie、Session、Token 和前后端状态如何协作、失效与恢复。",
    storyScene: "身份回廊的门牌一刷新就掉落，守卫认不出刚登录的人。",
    learn: "Cookie、Session、Token、前后端状态",
    validation: "能解释登录态怎么保存、怎么失效",
    workBackground:
      "用户刷新后掉登录、换浏览器失效、接口突然返回 401 时都会遇到。",
    flow: "登录表单 → 后端校验 → Token/Cookie → 浏览器保存 → 接口携带 → 过期处理",
    flowPayloads: [
      "账号与密码",
      "校验通过的用户身份",
      "Token 或 Set-Cookie",
      "已保存的登录凭证",
      "携带凭证的接口请求",
    ],
    glossary: ["Cookie", "Session", "Token", "401", "过期时间"],
    codeFocus: "登录响应、保存凭证、请求拦截、401 处理和退出登录",
    evidenceTask:
      "用 Application、Network 和后端日志证明凭证是否被保存和携带。",
    agentCollaboration:
      "要求 Agent 明确登录态存放位置、过期策略和 401 用户提示。",
    acceptanceAction: "刷新后仍保持登录，过期后能回到登录页并解释原因。",
    interviewReview:
      "我能区分前端状态和服务端凭证，并用 Network 证明登录态是否真的传给后端。",
    rewards: ["登录态", "请求凭证", "401 排障"],
    companionUnlock: {
      type: "伙伴",
      name: "回廊守卫",
      description: "负责检查 Cookie 门牌和后端 Session 登记册是否对得上。",
    },
  },
  {
    id: "4",
    chapter: 4,
    world: "接口审判庭",
    status: "待解锁",
    theme: "接口为什么报错",
    title: "定位一次接口失败",
    summary: "从请求参数、状态码、错误处理和后端日志定位接口失败点。",
    storyScene: "接口审判庭只丢出一枚红色状态码，没人知道错在证词还是审判官。",
    learn: "请求参数、状态码、错误处理、后端日志",
    validation: "能定位一次接口失败在哪里",
    workBackground:
      "工作中接口报 400/401/500 时，要能判断是前端传错、权限问题还是后端异常。",
    flow: "页面动作 → 请求参数 → 接口校验 → 业务处理 → 错误响应 → 前端提示",
    flowPayloads: [
      "用户操作和表单值",
      "请求体、路径和请求头",
      "通过校验的业务参数",
      "处理结果或异常",
      "状态码和错误详情",
    ],
    glossary: ["请求参数", "状态码", "400", "500", "日志", "错误边界"],
    codeFocus: "fetch 参数、接口入参校验、try/catch、错误响应结构",
    evidenceTask: "用 Network 请求体、响应体和日志时间戳定位错误发生层。",
    agentCollaboration:
      "让 Agent 复现失败请求，补参数校验、错误提示和日志证据。",
    acceptanceAction:
      "错误输入有清晰提示，正确输入能成功，日志能对应同一次请求。",
    interviewReview:
      "我不是只看报错文案，而是从请求、响应、日志三处定位接口失败。",
    rewards: ["状态码", "日志定位", "错误处理"],
    companionUnlock: {
      type: "伙伴",
      name: "审判庭书记员",
      description: "帮你把请求体、状态码、响应体和日志归档到同一案件。",
    },
  },
  {
    id: "5",
    chapter: 5,
    world: "一致性熔炉",
    status: "待解锁",
    theme: "数据为什么重复/错乱",
    title: "处理重复提交和数据错乱",
    summary: "理解唯一键、幂等、并发和事务基础，避免同一动作写出多份脏数据。",
    storyScene: "一致性熔炉被连敲三下，同一份委托烧出了三份互相冲突的记录。",
    learn: "唯一键、幂等、并发、事务基础",
    validation: "能解释重复提交和数据一致性",
    workBackground:
      "用户连点按钮、网络重试、多人同时编辑时，很容易出现重复或错乱。",
    flow: "用户重复动作 → 请求重试 → 唯一约束 → 幂等判断 → 事务提交 → 查询确认",
    flowPayloads: [
      "连续点击产生的重复意图",
      "同一个 Idempotency-Key",
      "唯一键冲突信号",
      "首次结果或复用结果",
      "一次完整事务结果",
    ],
    glossary: ["唯一键", "幂等", "并发", "事务", "重复提交"],
    codeFocus: "唯一索引、提交按钮锁定、幂等 key、事务边界",
    evidenceTask: "用重复请求、数据库记录数量和测试结果证明没有重复写入。",
    agentCollaboration:
      "让 Agent 给出防重复策略，并说明前端禁用按钮和后端幂等各自边界。",
    acceptanceAction: "连续点击、刷新重试和并发请求都不会生成重复核心数据。",
    interviewReview:
      "我能解释为什么只靠前端禁用不够，还需要后端约束保证一致性。",
    rewards: ["唯一约束", "幂等", "事务意识"],
    companionUnlock: {
      type: "宠物",
      name: "幂等石灵",
      description: "会盯住重复点击和重试请求，避免同一委托烧出多份记录。",
    },
  },
  {
    id: "6",
    chapter: 6,
    world: "慢速迷雾",
    status: "待解锁",
    theme: "页面为什么慢",
    title: "判断慢在前端还是后端",
    summary: "拆分加载、渲染、接口耗时和缓存，找到真实瓶颈。",
    storyScene:
      "慢速迷雾笼罩页面，用户等到不耐烦，却没人知道卡在路上还是舞台。",
    learn: "加载、渲染、接口耗时、缓存",
    validation: "能用证据判断慢在前端还是后端",
    workBackground: "页面慢不能只说“优化一下”，要先证明时间花在哪里。",
    flow: "用户打开页面 → 资源加载 → 接口请求 → 数据渲染 → 交互响应 → 缓存复测",
    flowPayloads: [
      "页面导航请求",
      "HTML、脚本和样式资源",
      "API 请求与耗时",
      "返回数据和渲染任务",
      "可操作页面与性能指标",
    ],
    glossary: ["加载", "渲染", "TTFB", "缓存", "瀑布图"],
    codeFocus: "请求时机、loading 状态、列表渲染、缓存命中",
    evidenceTask: "用 Network 瀑布图、接口耗时和渲染状态判断瓶颈。",
    agentCollaboration:
      "让 Agent 先给性能证据，再决定是缓存、分页还是减少渲染。",
    acceptanceAction: "优化前后有可对比时间数据，且功能结果不变。",
    interviewReview: "我能用证据区分接口慢和页面渲染慢，而不是凭感觉优化。",
    rewards: ["性能证据", "缓存", "瓶颈判断"],
    companionUnlock: {
      type: "宠物",
      name: "雾灯猫",
      description: "照亮瀑布图、接口耗时和渲染等待里的真实瓶颈。",
    },
  },
  {
    id: "7",
    chapter: 7,
    world: "模型熔炉",
    status: "待解锁",
    theme: "AI 接口怎么接",
    title: "安全接入 AI API",
    summary: "训练 API Key、环境变量、流式响应和错误兜底。",
    storyScene: "模型熔炉需要密钥才能点火，但钥匙一旦暴露，整座城都会失守。",
    learn: "API Key、环境变量、流式响应、错误兜底",
    validation: "能安全接入 AI API，不暴露密钥",
    workBackground:
      "AI 应用开发必须会把密钥放在服务端，并处理超时、限流和失败。",
    flow: "用户输入 → 本地接口 → 服务端读取环境变量 → AI API → 流式返回 → 错误兜底",
    flowPayloads: [
      "用户问题",
      "不含密钥的本地请求",
      "服务端密钥 + 模型参数",
      "模型响应流",
      "文本片段或上游错误",
    ],
    glossary: ["API Key", "环境变量", "流式响应", "限流", "超时"],
    codeFocus: "server-only key、fetch AI API、stream reader、错误 fallback",
    evidenceTask: "证明前端包里没有密钥，失败时有可理解提示和日志。",
    agentCollaboration: "给 Agent 明确密钥不得进前端、错误路径必须可测试。",
    acceptanceAction: "成功能流式显示，失败不泄露密钥，日志能定位失败原因。",
    interviewReview:
      "我能说明 AI API 为什么必须经服务端转发，以及如何处理失败路径。",
    rewards: ["AI API", "密钥安全", "流式输出"],
    companionUnlock: {
      type: "装备",
      name: "密钥匣",
      description: "提醒你 API Key 只属于服务端，不能出现在前端包里。",
    },
  },
  {
    id: "8",
    chapter: 8,
    world: "幻觉镜厅",
    status: "待解锁",
    theme: "AI 回复为什么胡说",
    title: "设计可验证的 AI 输出",
    summary: "处理 Prompt、上下文、引用来源和幻觉控制。",
    storyScene: "幻觉镜厅里的 AI 说得很顺，但镜面上没有任何资料来源。",
    learn: "Prompt、上下文、引用来源、幻觉控制",
    validation: "能设计一个可验证的 AI 输出流程",
    workBackground: "AI 回答看起来流畅但可能错，产品必须让用户知道依据和边界。",
    flow: "用户问题 → Prompt 约束 → 上下文输入 → 模型输出 → 引用校验 → 用户提示",
    flowPayloads: [
      "用户问题和回答目标",
      "回答规则与拒答条件",
      "允许使用的资料片段",
      "答案和引用编号",
      "通过校验的引用或拒答原因",
    ],
    glossary: ["Prompt", "上下文", "引用", "幻觉", "置信边界"],
    codeFocus: "系统提示、输出 schema、引用字段、无依据回答处理",
    evidenceTask: "用有资料和无资料两组输入验证 AI 是否乱编。",
    agentCollaboration: "让 Agent 给出反例测试和无资料时的拒答策略。",
    acceptanceAction: "回答必须带依据；找不到依据时明确说不知道。",
    interviewReview:
      "我能解释 AI 输出不能只看文案，还要设计来源、校验和拒答机制。",
    rewards: ["Prompt", "引用校验", "幻觉控制"],
    companionUnlock: {
      type: "伙伴",
      name: "镜厅校对师",
      description: "会追问每一句 AI 回答的来源、边界和不可回答条件。",
    },
  },
  {
    id: "9",
    chapter: 9,
    world: "知识迷宫",
    status: "待解锁",
    theme: "RAG 知识库",
    title: "让资料进入 AI 回答",
    summary: "学习文档切分、检索、引用和命中率。",
    storyScene: "知识迷宫藏着答案，AI 必须先找到正确书页，才能开口回答。",
    learn: "文档切分、检索、引用、命中率",
    validation: "能解释资料如何被找出来并进入回答",
    workBackground: "公司知识库、客服问答和项目文档助手都需要 RAG 的证据链。",
    flow: "上传资料 → 切分 chunk → 建索引 → 用户提问 → 检索命中 → 带引用回答",
    flowPayloads: [
      "原始文档和来源地址",
      "带来源编号的文本块",
      "可检索向量与元数据",
      "问题向量和检索条件",
      "命中文本块与来源",
    ],
    glossary: ["RAG", "chunk", "embedding", "检索", "命中率"],
    codeFocus: "文档切分、检索函数、引用拼接、来源展示",
    evidenceTask: "用问题、命中的片段和最终回答证明资料如何被使用。",
    agentCollaboration: "让 Agent 说明切分策略、检索参数和来源展示验收。",
    acceptanceAction: "命中正确资料时回答带引用，命中错误时能从证据里发现。",
    interviewReview:
      "我能讲清 RAG 不是让模型记住资料，而是先检索再带证据回答。",
    rewards: ["RAG", "检索证据", "来源引用"],
    companionUnlock: {
      type: "宠物",
      name: "检索狐",
      description: "会嗅出命中的 chunk、来源引用和回答依据是否一致。",
    },
  },
  {
    id: "10",
    chapter: 10,
    world: "Agent 高塔",
    status: "待解锁",
    theme: "Agent 工具调用",
    title: "让 Agent 做事但不越权",
    summary: "训练工具边界、参数校验和失败回退。",
    storyScene: "Agent 高塔的副官拿到了工具钥匙，但每扇门都必须先验明权限。",
    learn: "工具边界、参数校验、失败回退",
    validation: "能让 Agent 做事但不越权",
    workBackground:
      "Agent 能查库、发请求、改文件时，边界和验收比调用本身更重要。",
    flow: "用户目标 → 工具选择 → 参数校验 → 执行动作 → 结果回传 → 人类验收",
    flowPayloads: [
      "用户目标与允许边界",
      "工具名和结构化参数",
      "通过 schema 的安全参数",
      "工具执行结果或失败原因",
      "带审计记录的交付结果",
    ],
    glossary: ["工具调用", "参数 schema", "权限", "回退", "审计"],
    codeFocus: "tool schema、参数校验、错误返回、危险动作拦截",
    evidenceTask: "用正常参数、缺失参数和越权参数验证工具边界。",
    agentCollaboration: "让 Agent 先声明工具能做什么、不能做什么，再执行。",
    acceptanceAction: "合法调用有结果，非法调用被拒绝，失败路径可解释。",
    interviewReview:
      "我能把 Agent 从聊天助手变成受控工具执行者，并解释安全边界。",
    rewards: ["工具调用", "参数校验", "安全边界"],
    companionUnlock: {
      type: "伙伴",
      name: "塔楼副官",
      description: "会在工具调用前复核参数、权限和失败回退。",
    },
  },
  {
    id: "11",
    chapter: 11,
    world: "验收仪式厅",
    status: "待解锁",
    theme: "测试怎么证明修好了",
    title: "写出可信验收证据",
    summary: "用单测、集成测试和手动测试报告证明修复真实发生。",
    storyScene: "验收仪式厅不接受口头承诺，只认失败复现和通过证据。",
    learn: "单测、集成测试、手动测试报告",
    validation: "能写出可信验收证据",
    workBackground: "工作里“我修了”不够，要有复现、修复和回归证据。",
    flow: "复现失败 → 写测试/报告 → 修改代码 → 重跑验证 → 记录风险",
    flowPayloads: [
      "稳定复现步骤和失败现象",
      "会失败的测试或手动报告",
      "针对根因的代码改动",
      "新测试结果和复测截图",
    ],
    glossary: ["单元测试", "集成测试", "手动测试", "回归", "证据"],
    codeFocus: "测试断言、测试数据、失败报告读取和验证状态",
    evidenceTask: "保留修复前失败、修复后通过、手动复测三类证据。",
    agentCollaboration:
      "让 Agent 不只改代码，还要交付测试命令、结果和风险说明。",
    acceptanceAction: "测试覆盖核心失败路径，手动报告能对应真实操作。",
    interviewReview: "我能用验收证据说明修复可信，而不是只展示最终代码。",
    rewards: ["测试证据", "回归", "手动报告"],
    companionUnlock: {
      type: "伙伴",
      name: "验收试炼官",
      description: "会追问复现、测试报告和未覆盖风险，防止你轻信“已修复”。",
    },
  },
  {
    id: "12",
    chapter: 12,
    world: "委托书工坊",
    status: "待解锁",
    theme: "Agent 任务怎么写",
    title: "写一份清晰任务给 Agent",
    summary: "训练背景、目标、约束、验收和风险表达。",
    storyScene: "委托书工坊里，模糊命令会把副官带向错误房间。",
    learn: "背景、目标、约束、验收、风险",
    validation: "能写一份清晰任务给 Agent",
    workBackground: "会写任务的人能让 Agent 少走弯路，也能保护项目边界。",
    flow: "背景 → 当前问题 → 目标 → 禁止事项 → 验收标准 → 风险提醒",
    flowPayloads: [
      "项目背景和用户场景",
      "可观察的问题证据",
      "明确的交付结果",
      "文件、数据和安全边界",
      "可执行的验收清单",
    ],
    glossary: ["任务背景", "约束", "验收标准", "风险", "上下文"],
    codeFocus: "任务模板、验收清单、失败路径和禁止操作",
    evidenceTask: "对比模糊任务和清晰任务，看 Agent 交付差异。",
    agentCollaboration: "用户亲自写出可执行委托，不把判断全丢给 Agent。",
    acceptanceAction: "任务包含复现、目标、边界、验收和回滚/风险说明。",
    interviewReview:
      "我能把使用 Agent 讲成工程协作能力，而不是只会发一句需求。",
    rewards: ["任务表达", "约束", "验收标准"],
    companionUnlock: {
      type: "伙伴",
      name: "委托书锻造师",
      description: "帮你把模糊想法锻造成背景、目标、边界和验收。",
    },
  },
  {
    id: "13",
    chapter: 13,
    world: "交付审查庭",
    status: "待解锁",
    theme: "怎么审查交付",
    title: "判断 Agent 是否真的完成",
    summary: "审查 Diff、回归风险、边界条件和文档。",
    storyScene: "交付审查庭收到一份漂亮说明，但证据抽屉里可能什么都没有。",
    learn: "Diff、回归风险、边界条件、文档",
    validation: "能判断 Agent 是否真的完成",
    workBackground:
      "Agent 可能给出看似完整的说明，但漏掉测试、边界或数据迁移。",
    flow: "阅读交付说明 → 看 diff → 查测试 → 找边界 → 追问风险 → 决定是否接收",
    flowPayloads: [
      "Agent 的交付声明",
      "真实文件改动清单",
      "与改动对应的测试证据",
      "遗漏场景和边界条件",
      "未解决风险与补证要求",
    ],
    glossary: ["diff", "回归风险", "边界条件", "迁移", "交付说明"],
    codeFocus: "变更文件、关键逻辑、测试覆盖和文档更新",
    evidenceTask: "指出一份交付说明里缺失的验证证据和风险。",
    agentCollaboration: "要求 Agent 补交 diff 摘要、测试证据、风险和回滚。",
    acceptanceAction: "能拒绝验收不足的交付，并提出具体补充要求。",
    interviewReview: "我不盲信 Agent 结果，会按工程门禁审查交付质量。",
    rewards: ["diff 审查", "风险判断", "交付验收"],
    companionUnlock: {
      type: "伙伴",
      name: "交付审查官",
      description:
        "会核对交付说明、Diff、测试和边界风险，帮你决定接收还是拒收。",
    },
  },
  {
    id: "14",
    chapter: 14,
    world: "上线城门",
    status: "待解锁",
    theme: "上线前检查什么",
    title: "准备一次可回滚上线",
    summary: "检查配置、环境变量、数据备份和回滚路径。",
    storyScene: "上线城门即将打开，任何漏掉的配置都可能变成夜间事故。",
    learn: "配置、环境变量、数据备份、回滚",
    validation: "能说出上线检查清单",
    workBackground:
      "上线不是点击部署，配置错、密钥缺失和数据没备份都会造成事故。",
    flow: "构建 → 环境变量 → 数据备份 → 冒烟测试 → 日志监控 → 回滚预案",
    flowPayloads: [
      "可部署构建产物",
      "生产配置检查结果",
      "可恢复的备份和恢复证据",
      "关键路径冒烟结果",
      "上线指标与告警信号",
    ],
    glossary: ["构建", "环境变量", "备份", "冒烟测试", "回滚"],
    codeFocus: "配置读取、构建命令、健康检查和回滚说明",
    evidenceTask: "用 checklist 证明每个上线风险都有检查动作。",
    agentCollaboration: "让 Agent 帮你生成上线清单，但你要确认每项证据存在。",
    acceptanceAction: "上线前能说清失败后怎么发现、怎么回滚、数据怎么保护。",
    interviewReview: "我能从开发讲到上线风险，说明自己有工程闭环意识。",
    rewards: ["上线清单", "环境配置", "回滚"],
    companionUnlock: {
      type: "伙伴",
      name: "上线守门人",
      description: "会在开城门前核对配置、备份、监控和回滚退路。",
    },
  },
  {
    id: "15",
    chapter: 15,
    world: "面试议会",
    status: "待解锁",
    theme: "面试怎么讲项目",
    title: "把项目经历讲成面试回答",
    summary: "把每关产出整理成 STAR、故障复盘、技术取舍和成长证据。",
    storyScene: "面试议会只听得懂证据清楚、取舍明确、能被追问的项目故事。",
    learn: "STAR、故障复盘、技术取舍、成长证据",
    validation: "能把每关产出整理成面试回答",
    workBackground: "求职时需要把做过的功能和排障经历讲成面试官听得懂的故事。",
    flow: "项目背景 → 我的任务 → 关键行动 → 证据结果 → 技术取舍 → 可迁移经验",
    flowPayloads: [
      "一句话项目背景",
      "我的职责和问题目标",
      "我采取的具体行动",
      "测试、数据和业务结果",
      "方案选择、代价与反思",
    ],
    glossary: ["STAR", "复盘", "技术取舍", "成长证据", "追问"],
    codeFocus: "不看新代码，整理前面关卡的证据和表达结构",
    evidenceTask: "为一个关卡写出 90 秒项目讲述和 3 个追问答案。",
    agentCollaboration: "让 Agent 扮演面试官追问，但答案必须来自自己的证据。",
    acceptanceAction: "能把至少三关产出整理成可复用的面试回答。",
    interviewReview:
      "我能把学习过程转成求职素材，说明自己能独立面对真实工程问题。",
    rewards: ["STAR", "追问应答", "求职作品"],
    companionUnlock: {
      type: "伙伴",
      name: "终章答辩官",
      description:
        "会把通关证据、STAR、技术取舍和追问演练整理成可复用面试回答。",
    },
  },
] as const satisfies readonly CareerChapter[];

export const javaBackendRoadmap = [
  {
    id: "java-1",
    chapter: 1,
    world: "分层服务塔",
    status: "预览",
    theme: "请求为什么要经过三层",
    title: "Controller、Service、Repository 的接力",
    summary: "把一次 HTTP 请求拆成入口、业务判断和数据访问三层。",
    storyScene: "服务塔的三扇门同时亮起，没人能说清请求究竟在哪一层改了结果。",
    learn: "Controller、DTO、Service、Repository、职责边界",
    validation: "能画出一次请求经过三层的流程，并指出每层不该做什么。",
    workBackground:
      "接手 Java 服务时，最先遇到的往往不是语法，而是一个请求在多层之间来回传递。",
    flow: "客户端 → Controller → Service → Repository → 数据库 → HTTP 响应",
    flowPayloads: [
      "请求参数与 DTO",
      "业务对象与校验结果",
      "查询条件与持久化结果",
      "查询结果与响应 DTO",
      "状态码与响应体",
    ],
    glossary: ["Controller", "DTO", "Service", "Repository", "职责边界"],
    codeFocus:
      "只看 Controller 调用 Service 的几行，先确认参数交给谁、返回值从谁回来。",
    evidenceTask:
      "用请求日志、断点记录和数据库查询证明每一层只完成自己的职责。",
    agentCollaboration:
      "让 Agent 先画调用链，再分别列出每层的输入、输出和禁止越界的动作。",
    acceptanceAction: "给出一张调用链图，并用一个失败参数说明故障停在哪一层。",
    interviewReview:
      "我把一个 Java 请求按分层职责拆开，用日志和响应证据定位问题，而不是在所有文件里盲改。",
    rewards: ["分层地图", "请求追踪徽章"],
    companionUnlock: {
      type: "伙伴",
      name: "分层守望者",
      description: "会提醒你先找职责边界，再追一条请求。",
    },
  },
  {
    id: "java-2",
    chapter: 2,
    world: "事务熔炉",
    status: "预览",
    theme: "两张表为什么不能只成功一张",
    title: "事务、锁与一致性",
    summary: "学习一次业务操作如何保持多张表的状态一致。",
    storyScene:
      "熔炉里一半订单已经铸成，另一半库存却没有扣除，事务守门人要求你找出断点。",
    learn: "事务、提交、回滚、唯一约束、并发",
    validation: "能解释异常发生时为什么要回滚，并用数据证明没有半成品写入。",
    workBackground:
      "支付、库存、报名和审批等业务都要求多个写入动作不能只完成一半。",
    flow: "请求 → Service 开启事务 → 写订单 → 写库存 → 异常处理 → 提交或回滚 → 查询复核",
    flowPayloads: [
      "业务意图",
      "事务上下文",
      "订单写入结果",
      "库存写入结果",
      "提交结果",
      "复核查询",
    ],
    glossary: ["事务", "提交", "回滚", "唯一约束", "并发"],
    codeFocus: "高亮事务边界和异常处理，先看哪些操作必须一起成功。",
    evidenceTask:
      "制造一次中途失败，检查数据库是否出现订单有、库存无的半成品。",
    agentCollaboration:
      "要求 Agent 先写失败场景和回滚验收，再讨论如何修改事务边界。",
    acceptanceAction:
      "用失败复现、数据库查询和重复请求测试证明事务与唯一约束都生效。",
    interviewReview:
      "我用失败场景验证事务边界，证明系统不会把半成功状态留给用户。",
    rewards: ["回滚火种", "一致性护符"],
    companionUnlock: {
      type: "宠物",
      name: "事务小锻炉",
      description: "看到半成品数据时会发出警报。",
    },
  },
  {
    id: "java-3",
    chapter: 3,
    world: "缓存风廊",
    status: "预览",
    theme: "缓存为什么会让旧数据留下",
    title: "缓存、队列与降级",
    summary: "理解缓存命中、失效和异步处理对用户看到的数据有什么影响。",
    storyScene: "风廊里三份版本同时飘动，缓存精灵把旧答案递给了刚更新的用户。",
    learn: "缓存命中、失效、TTL、队列、降级",
    validation: "能区分数据库慢、缓存旧和异步任务未完成三种现象。",
    workBackground:
      "高流量接口常用缓存和队列，但出问题时用户看到的未必是数据库最新状态。",
    flow: "请求 → 缓存查询 → 未命中查库 → 写回缓存 → 缓存版本确认 → 异步队列 → 用户读取",
    flowPayloads: [
      "查询意图",
      "缓存 key",
      "数据库结果",
      "TTL 与版本",
      "消息与重试",
      "最终可见状态",
    ],
    glossary: ["缓存命中", "TTL", "失效", "队列", "降级"],
    codeFocus: "只看缓存 key、失效动作和降级分支，先判断旧数据来自哪一层。",
    evidenceTask:
      "比较缓存、数据库和队列日志的时间线，解释用户为什么看到旧版本。",
    agentCollaboration:
      "让 Agent 按缓存命中、查库、失效和降级四种路径设计验收表。",
    acceptanceAction:
      "用时间线和复测数据证明修复后缓存最终会收敛，故障时仍有可读降级。",
    interviewReview:
      "我没有把所有慢和旧数据都归咎于数据库，而是用缓存命中与异步日志拆出真实路径。",
    rewards: ["缓存风铃", "异步航线图"],
    companionUnlock: {
      type: "伙伴",
      name: "缓存巡航员",
      description: "会把缓存、数据库和队列的时间线串起来。",
    },
  },
  {
    id: "java-4",
    chapter: 4,
    world: "服务上线港",
    status: "预览",
    theme: "线上故障怎样可发现、可回退",
    title: "配置、日志与回滚",
    summary: "把 Java 服务从本地交付带到可观察、可恢复的上线流程。",
    storyScene: "上线港的灯塔变红，守门人要你在开闸前说清配置、监控和退路。",
    learn: "环境变量、结构化日志、健康检查、监控、回滚",
    validation: "能写出一次服务上线检查清单，并说明出故障时如何发现和回退。",
    workBackground:
      "真正的工作不止是代码合并，还要确保配置正确、信号可见、数据有退路。",
    flow: "交付物 → 环境配置 → 部署 → 健康检查 → 监控信号 → 回滚条件 → 回滚验证",
    flowPayloads: [
      "版本与变更范围",
      "密钥与配置",
      "部署结果",
      "服务状态",
      "错误率与耗时",
      "回滚后的业务验证",
    ],
    glossary: ["环境变量", "健康检查", "结构化日志", "监控", "回滚"],
    codeFocus: "只看配置读取、健康检查和回滚条件，避免把秘密写进代码。",
    evidenceTask:
      "模拟错误配置，检查启动日志、健康检查、监控信号和回滚后的数据状态。",
    agentCollaboration:
      "给 Agent 一份上线委托，要求它列出风险、验收命令、浏览器路径和回滚条件。",
    acceptanceAction:
      "用部署记录、冒烟结果、监控信号和回滚复测证明服务可控上线。",
    interviewReview:
      "我把上线从‘部署成功’扩展成配置、可观察性、冒烟和回滚都能被验证的闭环。",
    rewards: ["上线港通行证", "回滚罗盘"],
    companionUnlock: {
      type: "装备",
      name: "回滚罗盘",
      description: "在上线前提醒你确认发现问题和撤退的方法。",
    },
  },
  {
    id: "java-5",
    chapter: 5,
    world: "事故回声塔",
    status: "预览",
    theme: "线上故障怎样从日志走到决定",
    title: "报警、止血与回滚复盘",
    summary: "把错误率、延迟、日志、稳定版本和回滚验证串成一次线上事故闭环。",
    storyScene:
      "事故回声塔连续响起三种警报，值班工程师把日志、指标和旧版本交到你手里，要求你先判断影响，再决定止血还是回滚。",
    learn: "错误率、P95 延迟、结构化日志、止血、回滚、事故复盘",
    validation:
      "能用时间线说明故障影响、第一处证据、止血动作和回滚后的复测结果。",
    workBackground:
      "真实线上问题不会等你慢慢读代码，值班时要先确认影响范围，再用证据决定是否降级、回滚或继续观察。",
    flow: "监控报警 → 请求时间线 → 结构化日志 → 影响判断 → 止血/回滚 → 复测验证 → 事故复盘 → 面试复述",
    flowPayloads: [
      "错误率与 P95 指标",
      "请求 ID 与时间窗口",
      "异常堆栈与版本号",
      "受影响用户与业务范围",
      "止血或回滚决定",
      "恢复后的冒烟结果",
      "面试可复述的取舍",
    ],
    glossary: ["错误率", "P95", "结构化日志", "止血", "回滚", "事故复盘"],
    codeFocus:
      "只看 IncidentTimeline.java 的决定函数，理解错误率、延迟和稳定版本如何共同影响下一步动作。",
    evidenceTask:
      "对照监控快照、请求日志、版本号和回滚后的冒烟结果，写出一条可复核的事故时间线。",
    agentCollaboration:
      "要求 Agent 先整理影响、证据、止血动作、回滚条件和复测步骤，再提交事故交付说明。",
    acceptanceAction:
      "确认报警有影响范围、日志能关联请求、回滚条件可执行、恢复后有冒烟和复盘证据。",
    interviewReview:
      "我在一次线上事故里先用错误率和 P95 判断影响，再通过请求日志锁定版本，选择可回滚方案并用复测证明恢复。",
    rewards: ["事故时间线", "回滚信号灯"],
    companionUnlock: {
      type: "伙伴",
      name: "事故回声官",
      description: "会把报警、日志和回滚后的证据串成一条不会被遗忘的时间线。",
    },
  },
] as const satisfies readonly CareerChapter[];

export const frontendEngineeringRoadmap = [
  {
    id: "frontend-1",
    chapter: 1,
    world: "组件剧场",
    status: "预览",
    theme: "状态应该由谁管理",
    title: "组件、状态与渲染",
    summary: "从一个按钮开始，理解状态如何改变页面以及组件如何分工。",
    storyScene:
      "剧场的按钮同时听命于三个演员，页面一刷新就忘了自己应该显示什么。",
    learn: "组件、props、state、派生状态、渲染",
    validation: "能画出一次点击引发状态变化和重新渲染的路径。",
    workBackground:
      "前端复杂问题经常不是样式，而是状态放错位置导致页面互相打架。",
    flow: "用户操作 → 事件处理 → 状态所有者 → 状态更新 → 组件重渲染 → 可见反馈",
    flowPayloads: ["点击事件", "事件参数", "新状态", "组件 props", "页面反馈"],
    glossary: ["组件", "props", "state", "派生状态", "渲染"],
    codeFocus: "只看事件处理和状态更新的几行，先弄清谁改变了什么。",
    evidenceTask: "用组件树和交互复现证明状态来源唯一，页面反馈与状态一致。",
    agentCollaboration:
      "让 Agent 先标出状态所有者和数据流，再提出最小修改方案。",
    acceptanceAction:
      "通过交互测试、组件边界说明和刷新复测证明状态不会互相覆盖。",
    interviewReview:
      "我通过状态所有者和组件边界定位前端问题，而不是在多个组件之间重复补丁。",
    rewards: ["组件剧票", "状态星尘"],
    companionUnlock: {
      type: "伙伴",
      name: "状态编舞师",
      description: "会提醒你先找状态来源，再看页面变化。",
    },
  },
  {
    id: "frontend-2",
    chapter: 2,
    world: "表单传送厅",
    status: "预览",
    theme: "表单错误怎样被用户看懂",
    title: "请求状态与错误反馈",
    summary: "把 loading、成功、失败和重试变成清楚的用户流程。",
    storyScene:
      "传送厅只会亮一盏灯，用户分不清请求正在路上、已经失败还是可以重试。",
    learn: "loading、success、error、空状态、重试",
    validation: "能设计一次提交的完整状态机，并覆盖失败和重复点击。",
    workBackground: "真实用户不会只遇到成功路径，错误反馈决定功能是否可用。",
    flow: "用户提交 → loading → 请求响应 → 成功/失败 → 可读反馈 → 重试",
    flowPayloads: [
      "表单数据",
      "禁用重复提交",
      "状态码与错误体",
      "页面状态",
      "重试动作",
    ],
    glossary: ["loading", "状态机", "错误体", "空状态", "重试"],
    codeFocus: "只看提交按钮状态和 response 分支，理解每个状态给用户什么反馈。",
    evidenceTask:
      "用 Network 和浏览器操作证明成功、失败、超时和重复点击都能被看见。",
    agentCollaboration:
      "要求 Agent 列出所有请求状态和浏览器验收路径，不接受只测 200。",
    acceptanceAction: "逐项复测 loading、400、500、超时、重试和键盘操作。",
    interviewReview:
      "我把接口状态翻译成用户能理解的反馈，并用 Network 和交互复测证明失败路径没有被遗漏。",
    rewards: ["错误回声徽章", "重试钥匙"],
    companionUnlock: {
      type: "宠物",
      name: "提示小灯",
      description: "会在错误状态没有解释时亮起警示。",
    },
  },
  {
    id: "frontend-3",
    chapter: 3,
    world: "首屏观测塔",
    status: "预览",
    theme: "页面为什么第一眼很慢",
    title: "首屏性能与渲染证据",
    summary: "用瀑布图、资源大小和渲染证据判断慢在哪里。",
    storyScene:
      "观测塔的首屏被厚重行李压住，用户还没看到任务，页面已经让他等待。",
    learn: "首屏、懒加载、资源体积、瀑布图、渲染成本",
    validation: "能区分网络资源慢、脚本执行慢和组件渲染慢。",
    workBackground: "性能优化不能靠感觉，必须把用户等待拆成可测量的时间段。",
    flow: "用户打开 → HTML → 资源加载 → 脚本执行 → 数据请求 → 首次可用",
    flowPayloads: [
      "导航请求",
      "静态资源",
      "JavaScript 执行",
      "接口耗时",
      "可交互时间",
    ],
    glossary: ["首屏", "懒加载", "瀑布图", "可交互", "渲染成本"],
    codeFocus: "只看动态 import 和首屏组件边界，理解什么应该晚一点加载。",
    evidenceTask: "用 Network、性能面板和移动端复测定位最大的等待来源。",
    agentCollaboration:
      "让 Agent 先提交性能基线、目标指标和复测设备，再允许它改代码。",
    acceptanceAction: "比较优化前后瀑布图、首屏时间和 390px 浏览器路径。",
    interviewReview:
      "我用性能证据区分资源、脚本和渲染瓶颈，并用移动端复测证明优化没有只对桌面生效。",
    rewards: ["首屏沙漏", "性能观测镜"],
    companionUnlock: {
      type: "伙伴",
      name: "首屏观测师",
      description: "会把用户的等待拆成可以测量的证据。",
    },
  },
  {
    id: "frontend-4",
    chapter: 4,
    world: "无障碍交付庭",
    status: "预览",
    theme: "好看的页面是否真的可用",
    title: "可访问性与前端交付",
    summary: "把键盘、语义、对比度、移动端和回归风险纳入交付验收。",
    storyScene:
      "交付庭里漂亮的门只有鼠标能打开，审查官要求你让更多用户真正走得进去。",
    learn: "语义 HTML、键盘焦点、ARIA、对比度、响应式",
    validation: "能审查一个前端交付的可访问性、移动端和回归证据。",
    workBackground:
      "前端交付不只是截图好看，还要让不同设备和操作方式都能完成任务。",
    flow: "需求 → 组件语义 → 键盘操作 → 移动端布局 → 自动检查 → 回归风险 → 人工复测",
    flowPayloads: [
      "用户目标",
      "语义结构",
      "焦点顺序",
      "响应式布局",
      "检查结果",
      "人工证据",
    ],
    glossary: ["语义 HTML", "焦点", "ARIA", "对比度", "响应式"],
    codeFocus: "只看按钮、标签和焦点管理的关键行，理解可见样式之外的交互契约。",
    evidenceTask: "用键盘、390px 浏览器和可访问性检查逐项证明主要流程可完成。",
    agentCollaboration:
      "要求 Agent 提交桌面、移动端、键盘和回归验收矩阵，不接受只给截图。",
    acceptanceAction:
      "复测主流程、键盘焦点、错误提示、移动端无溢出和旧功能回归。",
    interviewReview:
      "我把前端交付从视觉完成推进到语义、键盘、移动端和回归证据完整。",
    rewards: ["交付审查章", "无障碍灯塔"],
    companionUnlock: {
      type: "宠物",
      name: "灯塔小鹿",
      description: "会在只有鼠标能走通的流程前停下来。",
    },
  },
  {
    id: "frontend-5",
    chapter: 5,
    world: "回归试炼场",
    status: "预览",
    theme: "测试怎样证明前端真的修好了",
    title: "从红灯复现到交付回归",
    summary: "学习把组件交互、请求路径、手动浏览器和回归风险串成可信证据。",
    storyScene:
      "试炼场的绿灯亮得太早，审查官发现它对应的是旧代码，要求你重新建立证据链。",
    learn: "失败复现、单元测试、集成测试、手动复测、回归风险",
    validation: "能解释一份前端测试报告证明了什么、没有证明什么。",
    workBackground:
      "真实交付里‘测试通过’并不自动等于用户流程可用，前端还要复测浏览器、设备和旧路径。",
    flow: "用户复现 → 组件边界 → 请求集成 → 浏览器手动复测 → 回归风险 → Agent 交付说明 → 交付决定",
    flowPayloads: [
      "稳定复现步骤",
      "组件与函数断言",
      "请求和页面反馈",
      "浏览器步骤与截图/日志",
      "未覆盖的设备和路径",
      "可接收或退回的决定",
    ],
    glossary: ["单元测试", "集成测试", "手动复测", "回归", "sourceHash"],
    codeFocus:
      "只看测试如何锁定旧故障、报告如何绑定当前源码，以及浏览器路径如何补足自动化。",
    evidenceTask:
      "对照失败报告、通过报告、Network 记录和手动复测，判断绿灯是否真的对应当前代码。",
    agentCollaboration:
      "要求 Agent 同时提交复现、自动化边界、浏览器步骤、风险和回滚说明。",
    acceptanceAction:
      "确认旧故障曾失败、修复后测试通过、手动路径可走通、报告指纹和当前源码一致。",
    interviewReview:
      "我没有把绿灯当结论，而是用失败复现、自动化、浏览器和源码指纹共同审查前端交付。",
    rewards: ["回归试炼章", "证据放大镜"],
    companionUnlock: {
      type: "伙伴",
      name: "回归审查官",
      description: "会在绿色报告旁边追问：这份证据是不是当前代码的？",
    },
  },
] as const satisfies readonly CareerChapter[];

export const careerRoutes = [
  {
    id: "ai-development",
    label: "AI 应用开发",
    role: "AI 应用开发者",
    status: "可进入",
    summary: "先训练 AI 产品链路、模型接入、RAG、Agent 工具和交付验收。",
    promise:
      "当前主线：从见习开发者成长为能交付 AI 应用、会验收 Agent 的工程新星。",
    coreSkills: ["项目链路", "AI API", "RAG", "Agent 协作", "面试复盘"],
    chapters: aiCareerRoadmap,
    previewChapters: [],
  },
  {
    id: "java-backend",
    label: "Java 后端",
    role: "后端工程师",
    status: "可进入",
    summary: "训练接口分层、数据库事务、缓存、队列、部署、线上排障和事故复盘。",
    promise:
      "规划路线：让用户能读懂后端服务从请求、业务、数据到上线的完整链路。",
    coreSkills: ["接口设计", "事务一致性", "缓存", "部署排障", "事故复盘"],
    chapters: javaBackendRoadmap,
    previewChapters: [
      "接口分层与 DTO",
      "事务和锁：一致性",
      "缓存击穿与降级",
      "部署与日志排障",
      "线上故障与回滚复盘",
    ],
  },
  {
    id: "frontend-engineering",
    label: "前端工程",
    role: "前端工程师",
    status: "可进入",
    summary: "训练组件状态、请求链路、性能、可访问性、测试和前端交付验收。",
    promise:
      "规划路线：让用户能把页面交互、接口状态和用户体验讲成可验收的工程能力。",
    coreSkills: ["组件状态", "请求链路", "性能", "可访问性", "测试回归"],
    chapters: frontendEngineeringRoadmap,
    previewChapters: [
      "组件状态流",
      "表单与接口错误",
      "首屏性能与渲染证据",
      "可访问性交付与回归",
      "测试证据与交付审查",
    ],
  },
] as const satisfies readonly CareerRoute[];

export const currentChapter = aiCareerRoadmap[0];
