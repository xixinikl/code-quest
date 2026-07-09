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
    status: "即将解锁",
    summary: "后续会训练接口分层、数据库事务、缓存、队列、部署和线上排障。",
    promise:
      "规划路线：让用户能读懂后端服务从请求、业务、数据到上线的完整链路。",
    coreSkills: ["接口设计", "事务一致性", "缓存", "部署排障"],
    chapters: [],
    previewChapters: [
      "接口分层与 DTO",
      "事务和锁",
      "缓存击穿与降级",
      "部署与日志排障",
    ],
  },
  {
    id: "frontend-engineering",
    label: "前端工程",
    role: "前端工程师",
    status: "即将解锁",
    summary: "后续会训练组件状态、请求链路、性能、可访问性和前端交付验收。",
    promise:
      "规划路线：让用户能把页面交互、接口状态和用户体验讲成可验收的工程能力。",
    coreSkills: ["组件状态", "请求链路", "性能", "可访问性"],
    chapters: [],
    previewChapters: [
      "组件状态流",
      "表单与接口错误",
      "首屏性能",
      "可访问性交付",
    ],
  },
] as const satisfies readonly CareerRoute[];

export const currentChapter = aiCareerRoadmap[0];
