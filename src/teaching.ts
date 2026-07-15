/** 教学步骤模式 */
export type TeachingMode = "teaching" | "coaching" | "assessment";

/** 概念卡 */
export type ConceptCard = {
  id: string;
  label: string;
  analogy: string;
  example: string;
  prediction: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
};

/** 代码焦点 */
export type CodeFocus = {
  filePath: string;
  functionName: string;
  input: string;
  output: string;
  ignore: string[];
  lines: string[];
  observationGoal: string;
};

/** 学习检查 */
export type LearningCheck = {
  prompt: string;
  correctAnswer: string;
  acceptableAnswers: string[];
};

export type RemediationLesson = {
  summary: string;
  notes: Array<{
    label: string;
    detail: string;
  }>;
  sequence?: string[];
  takeaway: string;
};

/** 补课路径 */
export type RemediationPath = {
  trigger: "term" | "syntax" | "project-position" | "causality";
  label: string;
  microLesson: RemediationLesson;
};

/** 教学步骤定义 */
export type TeachingStep = {
  id: string;
  mode: TeachingMode;
  title: string;
  goal: string;
  projectPosition?: string;
  concepts?: ConceptCard[];
  codeFocus?: CodeFocus;
  check?: LearningCheck;
  remediation?: RemediationPath[];
};

/** 项目地图节点 */
export type MapNode = {
  id: string;
  label: string;
  description: string;
  input: string;
  output: string;
  possibleFaults: string[];
  evidenceSources: string[];
};

/** 项目地图连接 */
export type MapEdge = {
  from: string;
  to: string;
  label: string;
};

/** 完整项目地图 */
export type ProjectMap = {
  nodes: MapNode[];
  edges: MapEdge[];
};

/** 教学步骤进度 */
export type TeachingProgress = {
  completedStepIds: string[];
  currentStepId: string | null;
  lastRemediation: string | null;
};

/** 教学场景定义 */
export type TeachingScenario = {
  scenarioId: string;
  steps: TeachingStep[];
  projectMap: ProjectMap;
};

// ============ 第一关教学场景数据 ============

export const projectMap: ProjectMap = {
  nodes: [
    {
      id: "client-click",
      label: "用户点击",
      description: "用户在浏览器中点击「保存」按钮，触发前端保存逻辑。",
      input: "鼠标点击事件",
      output: "触发 handleSave 函数",
      possibleFaults: ["事件未绑定", "点击被拦截"],
      evidenceSources: ["浏览器 DevTools Console"],
    },
    {
      id: "react-frontend",
      label: "React 前端",
      description: "前端 SaveCanvasButton 组件。负责构造请求并发送到后端 API。",
      input: "点击事件 → fetch POST /api/canvases",
      output: "收到 HTTP 响应后更新界面状态",
      possibleFaults: ["未等待响应就显示成功", "错误判断 response.ok"],
      evidenceSources: ["Network 面板", "前端代码"],
    },
    {
      id: "http-post",
      label: "HTTP POST 请求",
      description: "浏览器发起 HTTP 请求到后端 API。请求包含画布数据。",
      input: "JSON 请求体 (canvas 数据)",
      output: "HTTP 201 Created 响应",
      possibleFaults: ["路由未匹配", "请求超时", "CORS 错误"],
      evidenceSources: ["Network 面板", "后端日志"],
    },
    {
      id: "backend-route",
      label: "后端 API 路由",
      description: "Express 风格的路由处理程序。接收请求并调用数据访问层。",
      input: "Request 对象 (含 body)",
      output: "Response 对象 (201 状态码)",
      possibleFaults: ["返回 201 但未真正调用持久化", "过早返回成功响应"],
      evidenceSources: ["后端日志", "路由代码"],
    },
    {
      id: "repository",
      label: "数据访问层",
      description:
        "负责把业务对象写入或读出存储。当前有两种行为：内存数组和 SQLite。",
      input: "canvas 数据对象",
      output: "保存后的对象（可能只在内存中）",
      possibleFaults: [
        "只 push 到内存数组而未执行 INSERT",
        "使用了错误的数据源读取",
      ],
      evidenceSources: ["数据访问层代码", "数据库查询"],
    },
    {
      id: "sqlite",
      label: "SQLite 数据库",
      description:
        "持久化存储。重启服务或重新查询后数据仍应在，除非写入从未发生。",
      input: "INSERT 语句",
      output: "持久化的行记录",
      possibleFaults: ["INSERT 语句从未被执行", "写入错误表或字段"],
      evidenceSources: ["数据库查询结果", "数据库 schema"],
    },
    {
      id: "refresh-read",
      label: "刷新后 GET 请求",
      description: "用户刷新页面后，前端请求 /api/canvases 获取列表。",
      input: "GET 请求",
      output: "JSON 数组（当前为空）",
      possibleFaults: ["GET 走不同数据源", "内存数据在刷新后丢失"],
      evidenceSources: ["Network 面板", "数据库查询"],
    },
  ],
  edges: [
    { from: "client-click", to: "react-frontend", label: "事件" },
    { from: "react-frontend", to: "http-post", label: "fetch POST" },
    { from: "http-post", to: "backend-route", label: "请求" },
    { from: "backend-route", to: "repository", label: "saveCanvas()" },
    { from: "repository", to: "sqlite", label: "INSERT 预期" },
    { from: "sqlite", to: "repository", label: "SELECT 查询" },
    { from: "repository", to: "refresh-read", label: "GET 响应" },
  ],
};

/** 内存数组概念卡 */
const memoryArrayCard: ConceptCard = {
  id: "memory-array",
  label: "内存数组",
  analogy:
    "🎯 想象你有一块小白板（内存），在上面写了一串购物清单。只要不擦掉，随时都能看到。\n但如果你下班回家（关闭程序），明天再来时白板已经被擦干净了——因为小白板不会自动保存到文件里。\n\n「进程重启 = 白板被擦掉」这个直觉是理解整个故障的关键。",
  example:
    "打开 `canvasRepository.js` 你会看到：\n```js\nconst pendingCanvases = [];  // ← 这就是那块小白板\n\nfunction saveCanvas(name) {\n  const canvas = { id: uuid(), name, createdAt: new Date() };\n  pendingCanvases.push(canvas);  // ← 在小黑板上写了一条\n  return canvas;\n}\n```\n保存的数据只在 `pendingCanvases` 这个数组里——关掉 Node 服务它就没了。",
  prediction: {
    question:
      "🔥 假如你重启了 Node 服务，然后再次请求 GET /api/canvases，\npendingCanvases 数组里还有之前 push 进去的数据吗？",
    options: [
      "有，因为已经 push 进去了，数据就在那里",
      "没有，服务重启后 pendingCanvases 会重新初始化为 []",
      "有，Node.js 会自动把数组保存到硬盘",
      "不确定，得看操作系统怎么处理内存",
    ],
    correctIndex: 1,
    explanation:
      "\n\n`pendingCanvases = []` 这一行在服务启动时执行。每次重启，它都回到一个全新的空数组。\n\n之前 push 进去的数据？就像没保存的 Word 文档一样——断电就没了。\n\n💡 关键认识：**内存是临时的，数据库才是永久的**。如果你的程序只把数据存在内存数组里，用户一刷新页面就全丢了。",
  },
};

/** 数据库持久化概念卡 */
const persistenceCard: ConceptCard = {
  id: "db-persistence",
  label: "数据库持久化副作用",
  analogy:
    "📮 想象你要寄一封信：\n1. 写好信（创建数据对象） ✅\n2. 装进信封放在桌上（存到内存数组）— 信还在你手里\n3. 投进邮筒（执行 INSERT）— 信才真正进入寄送流程\n4. 邮局分拣入库（数据写入数据库文件）— 之后谁查都有\n\n很多新手只做到第 2 步就以为信寄出去了。「把对象建好」不等于「把数据存好」。",
  example:
    "代码里的真相：\n```js\nfunction saveCanvas(name) {\n  const canvas = { id: uuid(), name, createdAt: new Date() };  // 信写好了\n  pendingCanvases.push(canvas);  // 放桌上了 ❌ 没有投邮筒\n  return canvas;\n}\n```\n注意：这里没有出现 `db.run(INSERT INTO canvases ...)`！\n\n如果见过数据库操作长什么样，应该是：\n```js\ndb.run('INSERT INTO canvases (id, name) VALUES (?, ?)', [id, name]);\n```",
  prediction: {
    question: "🎯 下面哪个证据能 100% 确认画布数据真的被写进了数据库？",
    options: [
      "页面上弹出了「保存成功」的绿色提示",
      "浏览器 Network 面板看到 201 Created",
      "打开数据库直接查询：SELECT * FROM canvases 返回了数据",
      "后端控制台打印了「保存完成」的日志",
    ],
    correctIndex: 2,
    explanation:
      "只有数据库查询返回行记录，才能证明 INSERT 真的发生了。\n\n为什么其他选项不行？\n- 📱 页面提示 → 前端自己 show 的，跟数据库无关\n- 🌐 HTTP 201 → 只说明后端返回了 201，没说它写了库\n- 📝 后端日志 → 在 `console.log` 后面写个日志太容易了，不代表 db.run 被执行\n\n💡 核心原则：**不要听别人说了什么，要看数据库里有什么。**",
  },
};

/** HTTP 201 概念卡 */
const http201Card: ConceptCard = {
  id: "http-201",
  label: "HTTP 201 的证据边界",
  analogy:
    "🍜 你在餐厅点了碗面：\n- 服务员大声喊「面已经做了！」（返回 201）\n- 但厨师其实还在切菜，根本没下锅\n\n「喊做了」和「面真的在你面前」是两码事。\nHTTP 201 就是服务员喊的那一声——它不代表饭已经做好上桌了。",
  example:
    "看后端路由代码：\n```js\nrouter.post('/api/canvases', (req, res) => {\n  const canvas = repository.saveCanvas(req.body.name);\n  return res.status(201).json(canvas);  // ← 服务员喊「做好了」\n});\n```\n`res.status(201)` 仅仅是设置了 HTTP 响应的状态码。\n它不检查 `saveCanvas` 里到底有没有执行 `db.run()`。\n\n路由的职责是「返回响应」，不是「确保数据落盘」。",
  prediction: {
    question: "🤔 后端返回 201 Created，以下哪个说法是对的？",
    options: [
      "证明数据库已经成功写入了新画布数据",
      "只证明路由收到了请求并按约定返回了 201，和数据库无关",
      "证明前端代码没有发送错误请求",
      "证明数据已经永久保存在磁盘上了",
    ],
    correctIndex: 1,
    explanation:
      "201 是 HTTP 协议标准状态码，表示「已创建」。\n但它的含义仅限于 HTTP 层面——服务器按要求返回了这个状态码。\n\n它**不能证明**：\n- 数据库写了 INSERT\n- 文件保存到了磁盘\n- 任何持久化副作用发生了\n\n💡 **HTTP 状态码是接口契约，不是数据库收据。**",
  },
};

/** 数据访问层概念卡 */
const dalCard: ConceptCard = {
  id: "data-access-layer",
  label: "数据访问层职责",
  analogy:
    "🏛️ 图书馆管理系统有三个角色：\n1. 前台（路由）— 接待借书请求，说「好的我帮你查」\n2. 管理员（数据访问层）— 进书库找书\n3. 书架（数据库）— 书实际存放的地方\n\n如果管理员只是口头喊「找到了」但从书架上取下书（执行 SQL），书其实没到你手上。\n\n**数据访问层的职责：把手伸到书架上把书拿下来，而不是只在口头说找到了。**",
  example:
    "这就是问题所在：\n```js\n// canvasRepository.js — 数据访问层\nconst pendingCanvases = [];\n\nfunction saveCanvas(name) {\n  const canvas = { id: uuid(), name, createdAt: new Date() };\n  pendingCanvases.push(canvas);  // ← 管理员喊「放书架了」\n  return canvas;                  //    但没真放\n}\n\n// 读取时却查数据库：\nfunction listCanvases() {\n  return db.prepare('SELECT * FROM canvases').all();  // ← 真的去书架找\n}\n```\n这就是故障的根因：**存的时候放桌上，取的时候去书架找，当然找不到。**",
  prediction: {
    question: "🎯 数据访问层（Repository）的核心职责是什么？",
    options: [
      "接收 HTTP 请求并解析 JSON 参数",
      "渲染 HTML 页面返回给浏览器",
      "作为业务逻辑和存储之间的桥梁，执行真正的读写操作",
      "记录用户的操作日志",
    ],
    correctIndex: 2,
    explanation:
      "\n\n数据访问层的核心就是一句话：**负责把数据真正存进去、真正取出来**。\n\n当前故障的完整链条：\n1. 路由调用 `saveCanvas()` → 数据访问层\n2. 数据访问层只做了 `push` 到内存 → **没有写数据库**\n3. 但返回了「成功」给路由\n4. 路由返回 201 → 前端显示成功\n5. 用户刷新 → 前端查数据库 → **空！**\n\n💡 修复方向很简单：在 `saveCanvas` 里加上 `db.run(INSERT INTO canvases ...)` 就行了。",
  },
};

/** 四个微知识 */
export const microLessons: ConceptCard[] = [
  memoryArrayCard,
  persistenceCard,
  http201Card,
  dalCard,
];

/** 引导式代码导读步骤 */
export const codeTourSteps: TeachingStep[] = [
  {
    id: "tour-frontend",
    mode: "teaching",
    title: "前端：只看 fetch 与 response.ok",
    goal: "理解前端为什么相信保存成功",
    projectPosition: "用户点击 → [React 前端] → HTTP POST → ...",
    codeFocus: {
      filePath: "frontend/SaveCanvasButton.jsx",
      functionName: "handleSave",
      input: "画布名称字符串",
      output: "界面显示成功提示",
      ignore: [
        "JSX 渲染和 CSS 样式",
        "useState 和 useEffect 等 React hooks 声明",
        "其他按钮事件处理函数",
      ],
      lines: [
        "const response = await fetch('/api/canvases', {",
        '  method: "POST",',
        "  headers: { 'Content-Type': 'application/json' },",
        "  body: JSON.stringify({ name }),",
        "});",
        "",
        "if (response.ok) {",
        '  setStatus("saved");',
        "}",
      ],
      observationGoal:
        "前端在 response.ok 为 true 后就显示 success。它没有验证数据是否真的入了库。",
    },
  },
  {
    id: "tour-route",
    mode: "teaching",
    title: "路由：只看 saveCanvas 调用与 return 201",
    goal: "理解路由为什么返回成功却可能没有持久化",
    projectPosition: "... → HTTP POST → [后端 API 路由] → repository → ...",
    codeFocus: {
      filePath: "server/canvasRoutes.js",
      functionName: "POST /api/canvases handler",
      input: "Request 对象（含画布 name）",
      output: "HTTP 201 响应",
      ignore: [
        "其他路由（GET、DELETE）",
        "错误处理中间件",
        "请求解析细节（body-parser 等）",
      ],
      lines: [
        "router.post('/api/canvases', (req, res) => {",
        "  const canvas = repository.saveCanvas(req.body.name);",
        "  return res.status(201).json(canvas);",
        "});",
      ],
      observationGoal:
        "路由调用了 repository.saveCanvas()，然后立刻返回 201。但路由并不检查 saveCanvas 是否真的写了数据库。",
    },
  },
  {
    id: "tour-repository",
    mode: "teaching",
    title: "数据访问层：只看 push 与 SQL 查询",
    goal: "发现 save 写入内存，read 却来自 SQLite 的不一致",
    projectPosition: "... → 路由 → [数据访问层] → SQLite → ...",
    codeFocus: {
      filePath: "server/canvasRepository.js",
      functionName: "saveCanvas / listCanvases",
      input: "画布名称 → canvas 对象",
      output: "保存后的对象 / 查询结果数组",
      ignore: ["其他辅助函数", "模块导出语句", "数据库连接配置"],
      lines: [
        "const pendingCanvases = [];",
        "",
        "function saveCanvas(name) {",
        "  const canvas = { id: uuid(), name, createdAt: new Date() };",
        "  pendingCanvases.push(canvas);",
        "  return canvas;",
        "}",
        "",
        "function listCanvases() {",
        "  return db.run('SELECT * FROM canvases');",
        "}",
      ],
      observationGoal:
        "saveCanvas 把对象 push 到内存数组 pendingCanvases，却从未执行 INSERT。而 listCanvases 直接查询 SQLite——这是读写数据源的不一致。",
    },
  },
  {
    id: "tour-inconsistency",
    mode: "teaching",
    title: "数据源不一致：写入内存，读取数据库",
    goal: "理解完整故障链",
    projectPosition:
      "完整路径：点击 → 前端 201 → 路由 → 内存 push → 刷新 → 数据库 SELECT → 空",
    codeFocus: {
      filePath: "server/canvasRepository.js",
      functionName: "saveCanvas vs listCanvases",
      input: "（对比两条函数）",
      output: "发现数据源不一致",
      ignore: ["数据库连接代码", "UUID 生成逻辑", "模块导出"],
      lines: [
        "// saveCanvas 写入的是内存：",
        "pendingCanvases.push(canvas);  // ← 不涉及数据库",
        "",
        "// listCanvases 读取的是数据库：",
        "return db.run('SELECT * FROM canvases');  // ← 数据库查询",
        "",
        "// 因此：保存时只在内存，刷新时查数据库 → 数据丢失",
      ],
      observationGoal:
        "这就是故障根因：写入和读取在两个互不相干的数据源。修复方向是在 saveCanvas 中增加真实的 db.run(INSERT...)。",
    },
  },
];

/** 补课内容 */
export const remediationContent: Record<
  RemediationPath["trigger"],
  { label: string; microLesson: RemediationLesson }
> = {
  term: {
    label: "不懂专业术语",
    microLesson: {
      summary: "先不背定义，只分清四个角色分别能证明什么。",
      notes: [
        {
          label: "HTTP 201",
          detail:
            "后端给前端的成功回执。它只能说明接口这样回复了，不能单独证明数据库已经写入。",
        },
        {
          label: "内存数组",
          detail: "程序运行时的临时白板。服务重启后会重新变成空数组。",
        },
        {
          label: "SQLite",
          detail:
            "保存在磁盘文件里的数据库。数据真的写进去后，刷新或重启仍然可以查到。",
        },
        {
          label: "数据访问层",
          detail:
            "专门替业务代码读写数据库的一层。这里负责把画布对象真正交给 SQLite。",
        },
      ],
      takeaway: "201 是回信，数据库查询结果才是入库证据。",
    },
  },
  syntax: {
    label: "看代码语法有困难",
    microLesson: {
      summary:
        "读这一关的代码不用懂全部 JavaScript，只追四个会改变结果的动作。",
      notes: [
        {
          label: "fetch()",
          detail: "前端用它把画布数据发给后端。前面的 await 表示先等后端回信。",
        },
        {
          label: "response.ok",
          detail:
            "状态码在 200 到 299 时为 true，所以前端会把按钮改成“保存成功”。",
        },
        {
          label: "push()",
          detail: "只把对象放进当前进程的数组，像写在临时白板上。",
        },
        {
          label: "db.run()",
          detail: "执行 SQL，才有机会把对象真正写进 SQLite。",
        },
      ],
      sequence: [
        "先找函数收到什么参数。",
        "再找 fetch、push、db.run 这类真正做事的动作。",
        "最后看 return 把什么结果交给下一层。",
      ],
      takeaway: "先追动作和交接，暂时跳过样式、类型和不影响结果的语法。",
    },
  },
  "project-position": {
    label: "不知道代码在项目中的位置",
    microLesson: {
      summary: "把项目想成一座分工明确的档案馆，每个目录只负责一段路。",
      notes: [
        {
          label: "frontend/",
          detail: "用户看到的 React 页面。这里收集点击和表单数据，再发请求。",
        },
        {
          label: "server/canvasRoutes.js",
          detail:
            "接口接待台。它接收 POST 请求，调用数据访问层，再把状态码和 JSON 回给前端。",
        },
        {
          label: "server/canvasRepository.js",
          detail: "数据访问层。它决定画布只是留在内存，还是交给数据库持久化。",
        },
        {
          label: "database/ 与 evidence/",
          detail:
            "前者定义数据如何存，后者留下 Network、日志和查询结果等证据。",
        },
      ],
      sequence: [
        "React 页面把画布 JSON 交给 fetch。",
        "POST 路由把请求体交给 canvasRepository。",
        "Repository 应该执行 INSERT，把记录交给 SQLite。",
        "刷新后再用 GET 和 SELECT 把记录一路交回页面。",
      ],
      takeaway: "看到一个文件时，先问它位于哪一站、收到什么、应该交出什么。",
    },
  },
  causality: {
    label: "不理解因果关系",
    microLesson: {
      summary:
        "问题不在“刷新”这个动作，而在保存时根本没有把数据写进刷新后会查询的地方。",
      notes: [
        {
          label: "表面成功",
          detail: "路由返回 201，response.ok 变成 true，所以页面亮起成功提示。",
        },
        {
          label: "真正断点",
          detail:
            "saveCanvas 只执行 pendingCanvases.push，没有执行数据库 INSERT。",
        },
        {
          label: "刷新反证",
          detail:
            "刷新后的 GET 查询 SQLite；数据库是 0 行，所以页面只能拿到空列表。",
        },
      ],
      sequence: [
        "用户点击保存，前端发送 POST。",
        "路由调用 saveCanvas，数据只进入内存数组。",
        "路由仍返回 201，页面误以为已经保存。",
        "刷新后 GET 改去查询 SQLite。",
        "SQLite 从未收到 INSERT，所以返回 0 行。",
      ],
      takeaway: "写入走内存、读取走数据库，读写没有接在同一个数据源上。",
    },
  },
};

function buildTeachingSteps(): TeachingStep[] {
  function getRemediation() {
    return Object.entries(remediationContent).map(([trigger, content]) => ({
      trigger: trigger as RemediationPath["trigger"],
      label: content.label,
      microLesson: content.microLesson,
    }));
  }

  return [
    {
      id: "project-map",
      mode: "teaching",
      title: "项目地图",
      goal: "理解完整数据流和每个节点的作用",
      concepts: [],
    },
    {
      id: "micro-lessons",
      mode: "teaching",
      title: "当前任务所需的四个概念",
      goal: "建立阅读代码前的基础认知",
      concepts: microLessons,
      remediation: getRemediation(),
    },
    ...codeTourSteps.map((step) => ({
      ...step,
      remediation: getRemediation(),
    })),
    {
      id: "demo-evidence-connect",
      mode: "teaching",
      title: "共同完成：证据连接示范",
      goal: "示范如何从多份证据形成判断，然后让用户试一个",
      remediation: [
        {
          trigger: "causality" as const,
          label: "不理解因果关系",
          microLesson: remediationContent.causality.microLesson,
        },
      ],
    },
    {
      id: "coaching-hints",
      mode: "coaching",
      title: "陪练：分级提示修复",
      goal: "在逐渐减少的帮助下完成修复",
      remediation: getRemediation(),
    },
  ];
}

/** 完整的教学场景数据 */
export const teachingScenario: TeachingScenario = {
  scenarioId: "canvas-save-persistence",
  steps: buildTeachingSteps(),
  projectMap,
};

/** 词库 */
export type GlossaryEntry = {
  term: string;
  plain: string;
  category: string;
};

export const glossary: GlossaryEntry[] = [
  {
    term: "内存数组",
    plain:
      "程序运行时在内存中临时存放数据的变量。程序关闭后数据就消失了，不会自动保存。",
    category: "基础概念",
  },
  {
    term: "持久化",
    plain:
      "把数据写入硬盘/数据库等永久存储介质的过程。写入后即使程序重启，数据仍然存在。",
    category: "基础概念",
  },
  {
    term: "HTTP 201",
    plain:
      "HTTP 协议中的「已创建」状态码，表示服务器收到了创建资源的请求。注意：这只代表接口返回成功，不代表数据已经写入数据库。",
    category: "网络",
  },
  {
    term: "HTTP POST",
    plain: "浏览器向服务器发送数据的一种请求方式，常用于创建新资源。",
    category: "网络",
  },
  {
    term: "SQLite",
    plain:
      "一种轻量级的文件型数据库。数据以文件形式存储在硬盘上，程序重启后不会丢失。",
    category: "数据库",
  },
  {
    term: "INSERT",
    plain: "SQL 语句，用于向数据库表中插入新的一行数据。是持久化的关键操作。",
    category: "数据库",
  },
  {
    term: "SELECT",
    plain: "SQL 语句，用于从数据库表中查询数据。",
    category: "数据库",
  },
  {
    term: "路由",
    plain:
      "后端代码中根据请求 URL 和 HTTP 方法将请求分发给对应处理函数的机制。",
    category: "后端",
  },
  {
    term: "数据访问层",
    plain:
      "负责在业务逻辑和数据库之间传递数据的代码层。它的核心职责是执行真正的读写操作。",
    category: "后端",
  },
  {
    term: "API",
    plain: "应用程序编程接口。这里指前端通过 HTTP 请求与后端服务通信的接口。",
    category: "网络",
  },
  {
    term: "JSON",
    plain:
      "一种轻量级的数据交换格式，用键值对的方式组织数据，易于人阅读和机器解析。",
    category: "基础概念",
  },
  {
    term: "副作用",
    plain:
      "函数执行过程中除了返回值之外对外部环境产生的影响。这里特指数据库写入操作。",
    category: "基础概念",
  },
  {
    term: "Schema",
    plain: "数据库的结构定义，包括有哪些表、每张表有哪些字段、字段类型等。",
    category: "数据库",
  },
  {
    term: "fetch",
    plain: "浏览器内置的 JavaScript API，用于发送 HTTP 请求并获取响应。",
    category: "前端",
  },
  {
    term: "Promise",
    plain: "JavaScript 中表示异步操作的对象。await 用于等待一个 Promise 完成。",
    category: "前端",
  },
];

// ============ 主线 1-2：AI 点子为什么空泛 ============

const c2Brief: ConceptCard = {
  id: "c2-brief",
  label: "Project Brief",
  analogy:
    "像给画师下委托：只说“画好看点”会很空。说清角色、场景、用途和禁区，作品才会接近你要的方向。",
  example:
    "CanvasStorm 先收集项目名称、目标用户、当前阶段和约束，再让 AI 按方向生成候选。",
  prediction: {
    question: "如果用户只输入“帮我想一个 AI 功能”，最容易出现什么问题？",
    options: [
      "候选方案都很具体",
      "AI 会自动知道项目阶段",
      "输出变成提升效率、优化体验这类空话",
      "后端一定会报错",
    ],
    correctIndex: 2,
    explanation:
      "AI 不知道用户、阶段和约束，就只能补一些通用话。Brief 是为了把输入背景变具体。",
  },
};

const c2Direction: ConceptCard = {
  id: "c2-direction",
  label: "方向筛选",
  analogy:
    "像进迷宫前先选门：MVP、用户痛点、技术实现、风险验证是不同的门。门选错了，AI 再努力也会跑偏。",
  example:
    "想先验证能不能做，就选技术实现；想先找最小版本，就选 MVP；想找失败点，就选风险验证。",
  prediction: {
    question: "为什么 CanvasStorm 不直接一次生成一大堆点子？",
    options: [
      "因为点子越多越专业",
      "因为先选方向，候选才知道要回答哪类问题",
      "因为前端不能保存数组",
      "因为 AI 只能生成一个结果",
    ],
    correctIndex: 1,
    explanation:
      "方向筛选是在控制 AI 的发散范围，让候选围绕同一个产品问题，而不是散成一堆口号。",
  },
};

const c2Decision: ConceptCard = {
  id: "c2-decision",
  label: "候选取舍",
  analogy:
    "AI 像参谋，不是老板。它给你几条路线，你要决定保留、待定或放弃，并写清为什么。",
  example: "保留：进入执行草案；待定：信息不够；放弃：本轮不做，避免范围失控。",
  prediction: {
    question: "候选看板最重要的动作是什么？",
    options: [
      "把所有候选都做完",
      "只看标题，不写原因",
      "明确保留/待定/放弃，并留下取舍理由",
      "跳过保存，直接刷新页面",
    ],
    correctIndex: 2,
    explanation:
      "真实工作里产品能力不是“多加功能”，而是能解释为什么推进这个、暂缓那个。",
  },
};

const c2Session: ConceptCard = {
  id: "c2-session",
  label: "会话保存",
  analogy:
    "像把会议白板拍照归档。Brief、候选、取舍和草案如果刷新后消失，用户就无法继续工作。",
  example:
    "页面状态改变 -> 保存会话请求 -> 后端写入 data/*.json -> 刷新后恢复。",
  prediction: {
    question: "CanvasStorm 的一次会话里应该保存什么？",
    options: [
      "只保存页面主题色",
      "Brief、方向、候选状态、执行草案和 AI 状态",
      "只保存 AI 返回的第一句话",
      "只保存用户浏览器宽度",
    ],
    correctIndex: 1,
    explanation:
      "会话是用户一轮思考过程的档案，不只是某个按钮状态。保存它才算产品链路可信。",
  },
};

export const case02Concepts = [c2Brief, c2Direction, c2Decision, c2Session];

export const case02CodeTour: TeachingStep[] = [
  {
    id: "c2-tour-brief",
    mode: "teaching",
    title: "代码线索：Project Brief 表单",
    goal: "看清 AI 生成前，用户先把哪些背景交给系统",
    projectPosition: "用户输入 → Brief 表单状态 → 生成候选请求",
    codeFocus: {
      filePath: "src/features/storm/ProjectBriefForm.tsx",
      functionName: "ProjectBriefForm",
      input: "项目、目标用户、阶段、约束",
      output: "结构化 brief",
      ignore: ["视觉样式", "输入框细节"],
      lines: [
        "const brief = {",
        "  projectName, targetUser, stage, constraints,",
        "};",
        "onBriefChange(brief);",
      ],
      observationGoal:
        "这里不是随便拼 prompt，而是先把模糊想法整理成 AI 能理解的背景卡。",
    },
  },
  {
    id: "c2-tour-direction",
    mode: "teaching",
    title: "代码线索：方向罗盘",
    goal: "看清方向怎样限制 AI 发散范围",
    projectPosition: "方向按钮 → selectedDirections → 候选生成",
    codeFocus: {
      filePath: "src/features/storm/directions.ts",
      functionName: "STORM_DIRECTIONS",
      input: "用户想优先探索的问题类型",
      output: "MVP、痛点、增长、技术实现等方向",
      ignore: ["排序动画", "图标"],
      lines: [
        "export const STORM_DIRECTIONS = [",
        "  { id: 'mvp', question: '先做哪个最小版本？' },",
        "  { id: 'technical', question: '怎么落到代码？' },",
        "  { id: 'risk', question: '最容易失败的假设是什么？' },",
        "];",
      ],
      observationGoal:
        "方向不是装饰标签，它决定 AI 接下来要回答哪一类产品问题。",
    },
  },
  {
    id: "c2-tour-session-save",
    mode: "teaching",
    title: "代码线索：会话保存",
    goal: "看清用户的 Brief、候选和取舍怎样被保存下来",
    projectPosition: "页面状态 → PUT /api/sessions/:id → data/*.json",
    codeFocus: {
      filePath: "server/routes/sessions.ts",
      functionName: "PUT /api/sessions/:id",
      input: "brief、directions、candidates、draft",
      output: "保存后的 session",
      ignore: ["文件路径兼容", "错误包装"],
      lines: [
        "app.put('/api/sessions/:id', async (req, res) => {",
        "  const saved = await saveSession(req.params.id, req.body);",
        "  return res.json(saved);",
        "});",
      ],
      observationGoal:
        "产品链路最后要落到保存。刷新后能恢复，用户才会相信这个 AI 工作台。",
    },
  },
];

export const case02Map: ProjectMap = {
  nodes: [
    {
      id: "c2-idea",
      label: "用户想法",
      description: "一句模糊的 AI 功能愿望",
      input: "我想做个 AI 工具",
      output: "进入 Brief",
      possibleFaults: ["目标用户不清", "阶段不清"],
      evidenceSources: ["用户输入"],
    },
    {
      id: "c2-brief",
      label: "Project Brief",
      description: "把项目、用户、阶段、约束写成背景卡",
      input: "项目背景",
      output: "结构化 brief",
      possibleFaults: ["约束缺失", "输入太泛"],
      evidenceSources: ["表单状态"],
    },
    {
      id: "c2-directions",
      label: "方向罗盘",
      description: "选择 MVP、痛点、技术、风险等探索方向",
      input: "brief",
      output: "selectedDirections",
      possibleFaults: ["方向太多", "没有取舍"],
      evidenceSources: ["前端状态"],
    },
    {
      id: "c2-candidates",
      label: "候选看板",
      description: "AI 生成候选，用户保留/待定/放弃",
      input: "brief + directions",
      output: "候选与取舍理由",
      possibleFaults: ["全都保留", "没有理由"],
      evidenceSources: ["候选记录"],
    },
    {
      id: "c2-session",
      label: "会话档案",
      description: "保存 Brief、候选、草案和 AI 状态",
      input: "完整工作台状态",
      output: "data/*.json",
      possibleFaults: ["刷新丢失", "只存浏览器"],
      evidenceSources: ["Network", "data 文件"],
    },
  ],
  edges: [
    { from: "c2-idea", to: "c2-brief", label: "写清背景" },
    { from: "c2-brief", to: "c2-directions", label: "限定问题" },
    { from: "c2-directions", to: "c2-candidates", label: "生成候选" },
    { from: "c2-candidates", to: "c2-session", label: "保存取舍" },
    { from: "c2-session", to: "c2-brief", label: "刷新恢复" },
  ],
};

export const case02Scenario: TeachingScenario = {
  scenarioId: "case-002",
  steps: [
    {
      id: "c2-map",
      mode: "teaching",
      title: "产品密室勘测",
      goal: "先看清一个 AI 点子从愿望到可保存草案的完整路线",
    },
    {
      id: "c2-concepts",
      mode: "teaching",
      title: "产品链路小抄",
      goal: "Project Brief、方向筛选、候选取舍和会话保存分别解决什么问题",
      concepts: case02Concepts,
    },
    ...case02CodeTour,
    {
      id: "c2-close",
      mode: "teaching",
      title: "产品密室结案报告",
      goal: "结论：AI 功能不是多生成，而是把输入、选择、保存和兜底讲清楚",
    },
  ],
  projectMap: case02Map,
};

// ============ 主线 1-3：登录状态为什么丢 ============

const c3Token: ConceptCard = {
  id: "c3-token",
  label: "登录令牌（Token）",
  analogy:
    "去游乐园：检票员给你盖了个章（Token），凭章自由进出。洗完澡章没了，就得重新买票。Token 就是那个章：证明你是谁，但需要服务端还能认得它。",
  example:
    "登录 API 返回 Token，但如果后端只把 Token 存在内存里，重启服务后 Token 全没了。",
  prediction: {
    question: "服务重启后，内存中存的 Token 还存在吗？",
    options: [
      "存在，Token 已经生成好了",
      "不存在，重启后内存清空",
      "存在，但需要数据库恢复",
      "不确定",
    ],
    correctIndex: 1,
    explanation:
      "和主线 1-1 一样的道理：内存数据重启就消失。Token 没了，用户就需要重新登录。",
  },
};

const c3Cookie: ConceptCard = {
  id: "c3-cookie",
  label: "Cookie 与 Session",
  analogy:
    "Cookie 是电影院票根，Session 是后台已购票记录。你的票根还在，但后台记录被删了，验票时照样会被赶出去。",
  example:
    "登录时：res.cookie('sessionId', id) 发 Cookie；serverSessions[id] = user 存内存。验证时从内存查，重启后当然找不到。",
  prediction: {
    question: "Cookie 还在浏览器里，但服务器返回 401（未登录）。为什么？",
    options: [
      "Cookie 过期了",
      "服务端 Session 存在内存，重启丢失",
      "浏览器不支持 Cookie",
      "密码改了",
    ],
    correctIndex: 1,
    explanation:
      "Cookie 没问题。服务端 serverSessions 在内存里，重启变空，找不到对应 Session。",
  },
};

const c3Evidence: ConceptCard = {
  id: "c3-evidence",
  label: "三重证据验证法",
  analogy:
    "办案三件套：口供（界面显示已登录）+ 物证（Network 200 + Cookie）+ 交叉验证（用 Cookie 再请求一次受保护接口）。",
  example:
    "登录成功 -> 200 + Cookie。过段时间用同一个 Cookie 请求 /me -> 401。嫌疑：Session 没持久化。",
  prediction: {
    question: "登录成功的直接证据是 200 + Cookie。交叉验证怎么做？",
    options: [
      "再点一次登录",
      "关闭浏览器",
      "用 Cookie 请求另一个受保护接口",
      "查看页面颜色",
    ],
    correctIndex: 2,
    explanation:
      "用同一份 Cookie 访问另一个受保护接口。成功=真实登录；401=看似登录实则失效。",
  },
};

const c3Flow: ConceptCard = {
  id: "c3-flow",
  label: "请求链还原",
  analogy:
    "登录 -> POST /login -> Token + Set-Cookie -> 浏览器存 Cookie -> 再访问带 Cookie -> 查 serverSessions[token] -> 找到或 401。",
  example:
    "Step 1: POST /login -> 200 { token: 'abc123' } + Set-Cookie\nStep 2: 重启服务\nStep 3: GET /me (Cookie: abc123) -> 401",
  prediction: {
    question: "这条链路在哪一步断了？",
    options: [
      "浏览器没带 Cookie",
      "POST /login 格式错",
      "serverSessions[token] 找不到，内存被清了",
      "GET /me 路由写错",
    ],
    correctIndex: 2,
    explanation:
      "Cookie 还在、路由也对。serverSessions 重启变空，查不到对应 Token。",
  },
};

export const case03Concepts = [c3Token, c3Cookie, c3Evidence, c3Flow];

export const case03CodeTour: TeachingStep[] = [
  {
    id: "c3-tour-login",
    mode: "teaching",
    title: "案发现场：登录路由",
    goal: "看登录时发生了什么",
    projectPosition: "POST /login → 后端路由 → serverSessions[内存]",
    codeFocus: {
      filePath: "server/authRoutes.js",
      functionName: "POST /login",
      input: "用户名+密码",
      output: "200 + Token + Set-Cookie",
      ignore: ["密码验证逻辑", "其他路由"],
      lines: [
        "router.post('/login', (req, res) => {",
        "  const token = generateToken();",
        "  serverSessions[token] = { userId, expires };",
        "  res.cookie('sessionId', token);",
        "  return res.status(200).json({ token });",
        "});",
      ],
      observationGoal:
        "token 存进了 serverSessions 这个内存对象。重启后会消失。",
    },
  },
  {
    id: "c3-tour-verify",
    mode: "teaching",
    title: "现场还原：验证断点",
    goal: "看验证读什么，为什么不通过",
    projectPosition: "浏览器(Cookie) → GET /me → 验证路由 → 查 serverSessions",
    codeFocus: {
      filePath: "server/authRoutes.js",
      functionName: "GET /me",
      input: "Cookie: sessionId=abc123",
      output: "200/401",
      ignore: ["数据库查询"],
      lines: [
        "router.get('/me', (req, res) => {",
        "  const t = req.cookies.sessionId;",
        "  const s = serverSessions[t];",
        "  if (!s) return 401;",
        "  return res.json({ user });",
        "});",
      ],
      observationGoal:
        "serverSessions[t] 查内存。重启后变空，返回 401，这就是根因。",
    },
  },
];

export const case03Map: ProjectMap = {
  nodes: [
    {
      id: "c3-login",
      label: "用户登录",
      description: "输入密码点击登录",
      input: "用户名+密码",
      output: "触发 POST",
      possibleFaults: ["密码错"],
      evidenceSources: ["Network"],
    },
    {
      id: "c3-fe",
      label: "React 前端",
      description: "登录表单组件",
      input: "fetch POST",
      output: "Token+Cookie",
      possibleFaults: ["未读 Cookie"],
      evidenceSources: ["前端代码"],
    },
    {
      id: "c3-be-login",
      label: "登录路由",
      description: "验证密码、生成 Token、设置 Cookie",
      input: "用户名密码",
      output: "200+Token",
      possibleFaults: ["Token 存内存"],
      evidenceSources: ["后端代码"],
    },
    {
      id: "c3-sessions",
      label: "Session 存储",
      description: "serverSessions 内存对象",
      input: "Token",
      output: "内存写入",
      possibleFaults: ["重启全丢"],
      evidenceSources: ["代码"],
    },
    {
      id: "c3-verify",
      label: "验证路由",
      description: "查 serverSessions 验证身份",
      input: "Cookie",
      output: "200/401",
      possibleFaults: ["查不到"],
      evidenceSources: ["Network"],
    },
  ],
  edges: [
    { from: "c3-login", to: "c3-fe", label: "提交" },
    { from: "c3-fe", to: "c3-be-login", label: "POST" },
    { from: "c3-be-login", to: "c3-sessions", label: "存内存" },
    { from: "c3-sessions", to: "c3-verify", label: "查询" },
    { from: "c3-verify", to: "c3-fe", label: "200/401" },
  ],
};

export const case03Scenario: TeachingScenario = {
  scenarioId: "case-003-login-state",
  steps: [
    {
      id: "c3-map",
      mode: "teaching",
      title: "身份回廊勘测",
      goal: "先看清登录态从浏览器到后端的完整路线",
    },
    {
      id: "c3-concepts",
      mode: "teaching",
      title: "凭证小抄",
      goal: "Token、Cookie、Session 和 401 分别代表什么",
      concepts: case03Concepts,
    },
    ...case03CodeTour,
    {
      id: "c3-close",
      mode: "teaching",
      title: "登录态结案报告",
      goal: "根因：Token 写进内存，服务重启后验证路由查不到",
    },
  ],
  projectMap: case03Map,
};

// ============ 主线 1-4：接口为什么报错 ============

const c4RequestBody: ConceptCard = {
  id: "c4-request-body",
  label: "请求参数",
  analogy:
    "把接口想成办事窗口。你递上去的申请表就是请求参数：少填姓名、字段写错、格式不对，窗口不会知道你想办什么。",
  example:
    "前端发起 POST /api/projects 时，body 里必须有 title 和 ownerId。如果 title 为空，后端校验应该返回 400，而不是继续往下写数据库。",
  prediction: {
    question: "接口返回 400 时，第一步最应该看什么？",
    options: [
      "先重启服务器",
      "看 Network 里的请求体和响应体",
      "先改数据库 schema",
      "把所有 catch 删掉",
    ],
    correctIndex: 1,
    explanation:
      "400 通常表示请求不符合接口要求。先看前端到底传了什么、后端回了什么错误说明。",
  },
};

const c4StatusCode: ConceptCard = {
  id: "c4-status-code",
  label: "状态码边界",
  analogy:
    "审判庭会给每个案件盖章：400 是材料不合格，401 是没通行证，500 是审判官自己出错。章不是全部真相，但能告诉你先往哪一层查。",
  example:
    "400: title 缺失；401: 没有登录凭证；500: 后端代码抛异常。不同状态码对应不同排查方向。",
  prediction: {
    question: "如果同一个接口返回 500，更像说明哪一层出问题？",
    options: [
      "用户按钮一定点错了",
      "浏览器一定没联网",
      "后端处理过程抛出了未处理异常",
      "CSS 样式坏了",
    ],
    correctIndex: 2,
    explanation:
      "500 是服务端内部错误。还要看日志才能知道具体是空值、数据库失败还是业务代码异常。",
  },
};

const c4ErrorShape: ConceptCard = {
  id: "c4-error-shape",
  label: "错误响应结构",
  analogy:
    "只说“失败了”像医生只说“你不舒服”。好的错误响应要告诉前端：哪里错、为什么错、用户该怎么改。",
  example:
    "可用响应：{ code: 'TITLE_REQUIRED', message: '项目名称不能为空', field: 'title' }。前端能把它显示到对应输入框。",
  prediction: {
    question: "下面哪个错误响应最利于前端给用户提示？",
    options: [
      "{ error: true }",
      "{ message: 'bad' }",
      "{ code: 'TITLE_REQUIRED', field: 'title', message: '项目名称不能为空' }",
      "直接返回空字符串",
    ],
    correctIndex: 2,
    explanation:
      "结构化错误能让前端知道哪个字段错、该展示什么提示，也方便测试和日志搜索。",
  },
};

const c4LogTrace: ConceptCard = {
  id: "c4-log-trace",
  label: "日志与同一次请求",
  analogy:
    "Network 像前台票据，日志像后台审判记录。要确认它们是不是同一个案件，最好用时间、路径或 requestId 对上。",
  example:
    "Network 显示 500 at 10:03:12，后端日志同一时间出现 POST /api/projects requestId=abc TypeError，就能把前端失败和后端异常连起来。",
  prediction: {
    question: "为什么只看一条后端日志还不够？",
    options: [
      "日志永远没有用",
      "必须确认这条日志对应用户刚才那一次请求",
      "日志只能证明 CSS 错误",
      "因为 Network 不需要看",
    ],
    correctIndex: 1,
    explanation:
      "真实排障要把前端请求、响应和后端日志对成同一次事件，避免拿错证据。",
  },
};

export const case04Concepts = [
  c4RequestBody,
  c4StatusCode,
  c4ErrorShape,
  c4LogTrace,
];

export const case04CodeTour: TeachingStep[] = [
  {
    id: "c4-tour-request",
    mode: "teaching",
    title: "案发现场：前端发了什么",
    goal: "只看请求体、状态码和错误提示如何被展示",
    projectPosition: "页面表单 → fetch POST /api/projects → 错误提示",
    codeFocus: {
      filePath: "frontend/CreateProjectForm.jsx",
      functionName: "submitProject",
      input: "用户填写的项目名称和负责人",
      output: "成功创建项目，或显示接口返回的错误提示",
      ignore: ["表单样式", "按钮动画", "列表刷新细节"],
      lines: [
        "async function submitProject(form) {",
        "  const response = await fetch('/api/projects', {",
        "    method: 'POST',",
        "    headers: { 'Content-Type': 'application/json' },",
        "    body: JSON.stringify({ title: form.title, ownerId: form.ownerId }),",
        "  });",
        "  const result = await response.json();",
        "  if (!response.ok) setError(result.message);",
        "}",
      ],
      observationGoal:
        "前端能证明它发了哪些字段，也能看到后端返回了什么错误，但不能单独证明后端为什么失败。",
    },
  },
  {
    id: "c4-tour-route",
    mode: "teaching",
    title: "审判现场：后端如何判定失败",
    goal: "只看入参校验、日志和错误响应",
    projectPosition:
      "POST /api/projects → validateProject → logger → res.status",
    codeFocus: {
      filePath: "server/projectRoutes.js",
      functionName: "POST /api/projects",
      input: "req.body.title / req.body.ownerId",
      output: "201 Created / 400 Validation Error / 500 Server Error",
      ignore: ["数据库连接池", "权限系统", "复杂业务分支"],
      lines: [
        "router.post('/api/projects', async (req, res) => {",
        "  const { title, ownerId } = req.body;",
        "  if (!title) {",
        "    logger.warn({ path: req.path, field: 'title' }, 'validation failed');",
        "    return res.status(400).json({ code: 'TITLE_REQUIRED', message: '项目名称不能为空' });",
        "  }",
        "  const project = await createProject({ title, ownerId });",
        "  return res.status(201).json(project);",
        "});",
      ],
      observationGoal:
        "400 来自参数校验，日志能证明后端为什么拒绝。若这里抛异常才继续查 500。",
    },
  },
];

export const case04Map: ProjectMap = {
  nodes: [
    {
      id: "c4-user-action",
      label: "用户提交",
      description: "用户点击创建项目，页面把表单数据准备成请求体。",
      input: "表单字段",
      output: "触发 POST 请求",
      possibleFaults: ["必填项为空", "字段名和后端约定不一致"],
      evidenceSources: ["页面输入", "Network 请求体"],
    },
    {
      id: "c4-frontend",
      label: "前端请求",
      description: "前端通过 fetch 把 JSON 请求体发送到后端接口。",
      input: "JSON body",
      output: "HTTP 响应和错误提示",
      possibleFaults: ["Content-Type 缺失", "请求体字段拼错"],
      evidenceSources: ["Network Headers", "Network Payload"],
    },
    {
      id: "c4-route",
      label: "接口路由",
      description: "后端接收请求，先做参数校验，再决定继续业务处理或返回错误。",
      input: "req.body",
      output: "201 / 400 / 500",
      possibleFaults: ["校验缺失", "错误状态码不准确", "未捕获异常"],
      evidenceSources: ["路由代码", "响应状态码"],
    },
    {
      id: "c4-validation",
      label: "参数校验",
      description: "检查 title、ownerId 等字段是否满足接口契约。",
      input: "请求字段",
      output: "结构化错误或合法业务对象",
      possibleFaults: ["只返回 bad request", "没有字段级提示"],
      evidenceSources: ["响应体", "单元测试"],
    },
    {
      id: "c4-logs",
      label: "后端日志",
      description: "记录同一次请求为什么失败，帮助把前端现象和后端原因对上。",
      input: "path、field、requestId",
      output: "可搜索的错误记录",
      possibleFaults: ["没有 requestId", "日志只写 failed 不写原因"],
      evidenceSources: ["后端日志", "时间戳"],
    },
  ],
  edges: [
    { from: "c4-user-action", to: "c4-frontend", label: "提交" },
    { from: "c4-frontend", to: "c4-route", label: "POST" },
    { from: "c4-route", to: "c4-validation", label: "校验" },
    { from: "c4-validation", to: "c4-logs", label: "记录原因" },
    { from: "c4-logs", to: "c4-frontend", label: "错误响应" },
  ],
};

export const case04Scenario: TeachingScenario = {
  scenarioId: "case-004-api-error",
  steps: [
    {
      id: "c4-map",
      mode: "teaching",
      title: "接口审判庭勘测",
      goal: "先看清一次接口失败从页面到日志的完整路线",
    },
    {
      id: "c4-concepts",
      mode: "teaching",
      title: "错误证据小抄",
      goal: "请求参数、状态码、错误响应和日志分别能证明什么",
      concepts: case04Concepts,
    },
    ...case04CodeTour,
    {
      id: "c4-close",
      mode: "teaching",
      title: "接口错误结案报告",
      goal: "能用 Network、响应体和日志定位失败层级",
    },
  ],
  projectMap: case04Map,
};

// ============ 主线 1-5：数据为什么重复/错乱 ============

const c5UniqueKey: ConceptCard = {
  id: "c5-unique-key",
  label: "唯一键",
  analogy:
    "把数据库想成档案馆。每份核心委托都要有唯一编号：同一个编号只能放一份档案。有人重复递交同一份委托时，档案馆会说“这个编号已经存在”。",
  example:
    "订单、报名记录、支付流水这类数据通常不能靠页面感觉判断是否重复。后端要给核心字段建立唯一约束，比如 userId + courseId 只能报名一次。",
  prediction: {
    question: "为什么只靠前端禁用按钮还不够？",
    options: [
      "因为用户可能刷新、网络可能重试，也可能有人绕过页面直接请求接口",
      "因为按钮颜色不够明显",
      "因为数据库不会保存任何数据",
      "因为 Network 面板会自动重复提交",
    ],
    correctIndex: 0,
    explanation:
      "前端禁用按钮能改善体验，但不能作为最终防线。真正的底线要在后端和数据库：重复请求来了，也不能写出重复核心记录。",
  },
};

const c5Idempotency: ConceptCard = {
  id: "c5-idempotency",
  label: "幂等",
  analogy:
    "幂等像工坊里的同一张取货牌。你拿同一张牌问三次，师傅应该给你同一把已经铸好的剑，而不是重新铸三把。",
  example:
    "前端提交时带上 Idempotency-Key。后端先查这个 key 是否已经处理过：处理过就返回旧结果，没处理过才创建新记录。",
  prediction: {
    question: "同一个 Idempotency-Key 重试三次，后端更合理的行为是什么？",
    options: [
      "创建三条一样的数据",
      "前两次失败，第三次一定成功",
      "返回同一条已创建结果，不重复写入",
      "让前端自己决定要不要删除",
    ],
    correctIndex: 2,
    explanation:
      "幂等的目标是：同一动作重复到达后端，结果仍像只执行了一次。这样网络重试和用户连点不会制造脏数据。",
  },
};

const c5Concurrency: ConceptCard = {
  id: "c5-concurrency",
  label: "并发/重试",
  analogy:
    "熔炉门口同时来了三名信使，都拿着同一份委托。看门人不能只相信第一个信使说“我会排队”，还要让门禁系统保证一次只登记一份。",
  example:
    "用户双击按钮、浏览器重发请求、两个页面同时提交，都可能让后端几乎同时收到多次创建请求。",
  prediction: {
    question: "排查重复数据时，哪组证据最关键？",
    options: [
      "按钮有没有动画",
      "重复请求次数、请求 key、数据库最终记录数",
      "页面标题有没有换行",
      "CSS 文件大小",
    ],
    correctIndex: 1,
    explanation:
      "重复提交要看链路证据：前端发了几次、是否带同一个 key、后端是否查重、数据库最终是不是只有一条核心记录。",
  },
};

const c5Transaction: ConceptCard = {
  id: "c5-transaction",
  label: "事务边界",
  analogy:
    "事务像熔炉结界：要么登记委托、写入档案、扣减库存一起成功；要么中途失败就全部撤回。不能只成功一半。",
  example:
    "创建订单时，如果订单写入成功但明细写入失败，就会出现半截数据。事务能把相关写入包成一个整体。",
  prediction: {
    question: "事务最适合解决哪类问题？",
    options: [
      "按钮文案太长",
      "多个相关写入只成功了一部分",
      "页面背景图不好看",
      "用户看不懂标题",
    ],
    correctIndex: 1,
    explanation:
      "事务关心的是一组相关操作的一致性。它不能替代唯一键和幂等，但能避免“写了一半”的错乱状态。",
  },
};

export const case05Concepts = [
  c5UniqueKey,
  c5Idempotency,
  c5Concurrency,
  c5Transaction,
];

export const case05CodeTour: TeachingStep[] = [
  {
    id: "c5-tour-frontend",
    mode: "teaching",
    title: "连点现场：前端如何发出同一份委托",
    goal: "只看提交按钮、请求 key 和 loading 锁定的关系",
    projectPosition:
      "用户连点 → 前端 submitOrder → POST /api/orders + Idempotency-Key",
    codeFocus: {
      filePath: "frontend/SubmitOrderButton.jsx",
      functionName: "submitOrder",
      input: "用户点击提交订单",
      output: "发送创建请求，或在提交中禁用按钮",
      ignore: ["按钮样式", "金额展示", "其他表单字段渲染"],
      lines: [
        "async function submitOrder(draft) {",
        "  setSubmitting(true);",
        "  const requestKey = draft.idempotencyKey;",
        "  const response = await fetch('/api/orders', {",
        "    method: 'POST',",
        "    headers: { 'Idempotency-Key': requestKey },",
        "    body: JSON.stringify(draft),",
        "  });",
        "  setSubmitting(false);",
        "}",
      ],
      observationGoal:
        "前端可以用 submitting 防连点，并把同一次业务动作的 Idempotency-Key 交给后端。但它不能保证所有重复请求都被拦住。",
    },
  },
  {
    id: "c5-tour-backend",
    mode: "teaching",
    title: "熔炉门禁：后端如何让重复请求只生效一次",
    goal: "只看查重、唯一约束和事务提交",
    projectPosition:
      "POST /api/orders → findByIdempotencyKey → transaction → unique index → DB",
    codeFocus: {
      filePath: "server/orderRoutes.js",
      functionName: "POST /api/orders",
      input: "请求体 + Idempotency-Key",
      output: "已存在订单或新创建订单",
      ignore: ["鉴权中间件", "邮件通知", "页面刷新逻辑"],
      lines: [
        "router.post('/api/orders', async (req, res) => {",
        "  const key = req.headers['idempotency-key'];",
        "  const existing = await findByIdempotencyKey(key);",
        "  if (existing) return res.status(200).json(existing);",
        "  const order = await db.transaction(() => {",
        "    return createOrder({ ...req.body, idempotencyKey: key });",
        "  });",
        "  return res.status(201).json(order);",
        "});",
      ],
      observationGoal:
        "后端先查同一个 key 是否处理过，再在事务里创建记录；数据库唯一约束是最后防线。",
    },
  },
];

export const case05Map: ProjectMap = {
  nodes: [
    {
      id: "c5-user-repeat",
      label: "用户重复动作",
      description: "用户双击提交、刷新重试，或浏览器因为网络问题重发请求。",
      input: "多次点击 / 多次请求",
      output: "同一业务动作可能到达后端多次",
      possibleFaults: ["按钮没有提交中状态", "同一动作生成多个请求 key"],
      evidenceSources: ["页面状态", "Network 请求次数"],
    },
    {
      id: "c5-frontend",
      label: "前端提交",
      description: "前端锁定按钮，并把同一次动作的 Idempotency-Key 发给后端。",
      input: "draft + idempotencyKey",
      output: "POST /api/orders",
      possibleFaults: ["没有带 key", "每次重试都生成新 key"],
      evidenceSources: ["Network Headers", "前端代码"],
    },
    {
      id: "c5-route",
      label: "后端接口",
      description: "接口读取 Idempotency-Key，决定返回旧结果还是创建新记录。",
      input: "请求体 + Header",
      output: "200 existing / 201 created",
      possibleFaults: ["没有查重", "重复时仍继续创建"],
      evidenceSources: ["路由代码", "后端日志"],
    },
    {
      id: "c5-idempotency-store",
      label: "幂等登记",
      description: "记录某个请求 key 是否已经处理过，以及对应结果是什么。",
      input: "Idempotency-Key",
      output: "已处理结果或空",
      possibleFaults: ["登记和创建不在同一事务", "key 没有唯一约束"],
      evidenceSources: ["数据库查询", "唯一索引"],
    },
    {
      id: "c5-database",
      label: "数据库约束",
      description: "唯一键和事务保证核心记录不会重复或只写一半。",
      input: "INSERT / transaction",
      output: "最终只有一条核心记录",
      possibleFaults: ["缺少 unique index", "事务边界太窄"],
      evidenceSources: ["SELECT count(*)", "测试报告"],
    },
  ],
  edges: [
    { from: "c5-user-repeat", to: "c5-frontend", label: "连点/重试" },
    { from: "c5-frontend", to: "c5-route", label: "POST + key" },
    { from: "c5-route", to: "c5-idempotency-store", label: "查是否处理过" },
    {
      from: "c5-idempotency-store",
      to: "c5-database",
      label: "创建或返回旧结果",
    },
    { from: "c5-database", to: "c5-frontend", label: "记录数验收" },
  ],
};

export const case05Scenario: TeachingScenario = {
  scenarioId: "case-005-data-consistency",
  steps: [
    {
      id: "c5-map",
      mode: "teaching",
      title: "一致性熔炉勘测",
      goal: "先看清重复提交从页面到数据库的完整路线",
    },
    {
      id: "c5-concepts",
      mode: "teaching",
      title: "防重复小抄",
      goal: "唯一键、幂等、并发和事务分别负责哪一层",
      concepts: case05Concepts,
    },
    ...case05CodeTour,
    {
      id: "c5-close",
      mode: "teaching",
      title: "数据一致性结案报告",
      goal: "能解释为什么前端防连点不够，后端和数据库也要兜底",
    },
  ],
  projectMap: case05Map,
};

/** Java 后端路线第 2 关：事务熔炉。 */
export const javaTransactionConsistencyScenario: TeachingScenario = {
  scenarioId: "java-transaction-consistency",
  projectMap: {
    ...case05Map,
    nodes: case05Map.nodes.map((node) => ({
      ...node,
      description: node.description
        .replaceAll("草稿", "订单")
        .replaceAll("保存", "下单"),
    })),
  },
  steps: case05Scenario.steps.map((step) => {
    const titles: Record<string, string> = {
      "c5-map": "事务熔炉勘测",
      "c5-concepts": "提交、回滚与唯一约束小抄",
      "c5-code-tour-frontend": "关键代码：重复请求从哪里进来",
      "c5-code-tour-backend": "关键代码：哪一步没有一起回滚",
      "c5-close": "事务一致性结案报告",
    };
    const goals: Record<string, string> = {
      "c5-map": "先看清一次下单如何同时影响订单、库存和数据库。",
      "c5-concepts": "用订单和库存的比喻理解事务、回滚、唯一约束和幂等。",
      "c5-code-tour-frontend": "只读请求入口，找到重复提交与业务动作的关系。",
      "c5-code-tour-backend": "找出中途失败后仍留下半成品的事务边界。",
      "c5-close": "能解释为什么事务、唯一约束和失败复测必须一起验收。",
    };
    const nextStep = {
      ...step,
      title: titles[step.id] ?? step.title,
      goal: goals[step.id] ?? step.goal,
    };
    if (step.id === "c5-tour-backend") {
      return {
        ...nextStep,
        codeFocus: {
          ...step.codeFocus!,
          filePath: "server/OrderService.java",
          functionName: "placeOrder",
          lines: [
            "public Order placeOrder(String idempotencyKey, String sku) {",
            "  Order existing = orders.findByIdempotencyKey(idempotencyKey);",
            "  if (existing != null) return existing;",
            "  Order order = orders.insert(idempotencyKey, sku);",
            "  inventory.decrement(sku);",
            "  return order;",
            "}",
          ],
          observationGoal:
            "订单写入和库存扣减没有放进同一个事务；库存失败时，订单可能已经留下。",
        },
      };
    }
    if (step.id === "c5-tour-frontend") {
      return {
        ...nextStep,
        codeFocus: {
          ...step.codeFocus!,
          filePath: "server/OrderRepository.java",
          functionName: "transaction",
          observationGoal:
            "Repository 提供事务边界，Service 应该把订单和库存这两个核心动作交给同一个事务执行。",
        },
      };
    }
    return nextStep;
  }),
};

/** Java 后端路线第 3 关：缓存与可观测性。 */
function buildJavaCacheObservabilityScenario(): TeachingScenario {
  return {
    scenarioId: "java-cache-observability",
    projectMap: {
      ...case06Map,
      nodes: case06Map.nodes.map((node) => ({
        ...node,
        description: node.description
          .replaceAll("页面变慢", "用户读到旧版本")
          .replaceAll("渲染", "读取"),
      })),
    },
    steps: case06Scenario.steps.map((step) => {
      const titles: Record<string, string> = {
        "c6-map": "缓存风廊勘测",
        "c6-concepts": "缓存、TTL 与降级小抄",
        "c6-tour-frontend": "关键代码：请求拿到的是哪一版",
        "c6-tour-backend": "关键代码：缓存命中还是查库",
        "c6-close": "缓存复测结案报告",
      };
      const nextStep = {
        ...step,
        title: titles[step.id] ?? step.title,
        goal:
          step.id === "c6-map"
            ? "先看清请求可能经过缓存、数据库和异步刷新哪些站点。"
            : step.id === "c6-concepts"
              ? "理解命中、TTL、失效、队列和降级分别解决什么问题。"
              : step.goal,
      };
      if (step.id === "c6-tour-backend") {
        return {
          ...nextStep,
          codeFocus: {
            ...step.codeFocus!,
            filePath: "server/ProjectCacheService.java",
            functionName: "read",
            lines: [
              "public Project read(String projectId) {",
              "  Project cached = cache.get(projectId);",
              "  if (cached != null) return cached;",
              "  Project fresh = repository.find(projectId);",
              "  cache.put(projectId, fresh, 60);",
              "  return fresh;",
              "}",
            ],
            observationGoal:
              "缓存命中会直接返回旧对象；修复与验收必须说明失效、版本和降级策略。",
          },
        };
      }
      return nextStep;
    }),
  };
}

// ============ 主线 1-6：页面为什么慢 ============

const c6Waterfall: ConceptCard = {
  id: "c6-waterfall",
  label: "Network 瀑布图",
  analogy:
    "把页面加载想成一队信使进城。瀑布图就是每个信使出发、排队、等门、交货的时间表。哪一条最长，通常就先查哪一条。",
  example:
    "如果 HTML 很快返回，但 /api/projects 等了 1800ms，说明首要瓶颈更像在接口或数据库；如果 JS 文件下载很久，就先查资源体积和缓存。",
  prediction: {
    question: "页面慢时，为什么不能先凭感觉改 CSS 或重写组件？",
    options: [
      "因为 CSS 永远不会影响性能",
      "因为必须先用瀑布图证明时间花在哪一段",
      "因为 Network 只适合看接口报错",
      "因为慢只能是数据库问题",
    ],
    correctIndex: 1,
    explanation:
      "性能优化先要找瓶颈。瀑布图能告诉你时间花在资源下载、等待接口还是其他请求上，避免瞎改。",
  },
};

const c6Ttfb: ConceptCard = {
  id: "c6-ttfb",
  label: "TTFB",
  analogy:
    "TTFB 像你在窗口递申请后，等到窗口第一次开口的时间。窗口迟迟不说话，可能是排队、后端处理慢或数据库查询慢。",
  example:
    "GET /api/reports 的 TTFB 是 1600ms，但下载只有 20ms，说明不是文件太大，而是服务端生成响应前花了很久。",
  prediction: {
    question: "TTFB 很高，更应该优先查什么？",
    options: [
      "按钮圆角",
      "服务端处理、数据库查询或上游接口等待",
      "图片 alt 文案",
      "页面标题",
    ],
    correctIndex: 1,
    explanation:
      "TTFB 高说明浏览器等第一口响应等得久。常见方向是后端逻辑、数据库查询、缓存缺失或外部接口慢。",
  },
};

const c6Render: ConceptCard = {
  id: "c6-render",
  label: "渲染卡顿",
  analogy:
    "接口像仓库把箱子送到舞台，渲染是舞台把箱子摆给观众看。仓库送得快，不代表舞台摆得快。",
  example:
    "接口 120ms 返回 5000 条数据，但页面还卡 2 秒，可能是一次性渲染太多列表、排序计算太重或状态更新太频繁。",
  prediction: {
    question: "接口已经很快，但页面仍然卡，下一步更应该看哪里？",
    options: [
      "列表渲染数量、昂贵计算和重复状态更新",
      "服务器端口号是否好看",
      "HTTP 状态码是不是 201",
      "数据库有没有唯一键",
    ],
    correctIndex: 0,
    explanation:
      "接口快但页面卡，瓶颈可能在前端渲染。要看一次渲染多少 DOM、有没有重复计算、loading 状态是否合理。",
  },
};

const c6Cache: ConceptCard = {
  id: "c6-cache",
  label: "缓存",
  analogy:
    "缓存像常用资料柜。第一次去档案库拿资料很慢，但把常用副本放在手边，下次就不用跑完整路程。",
  example:
    "项目列表不需要每秒都重新查数据库，可以设置缓存或请求去重；但保存后的列表要记得刷新，否则用户会看到旧数据。",
  prediction: {
    question: "缓存最容易带来哪种新风险？",
    options: [
      "页面永远不能加载",
      "用户可能看到过期数据，所以要定义何时刷新或失效",
      "接口状态码全部变成 500",
      "代码不能写测试",
    ],
    correctIndex: 1,
    explanation: "缓存能提速，但必须说明失效策略。否则性能好了，数据却不可信。",
  },
};

export const case06Concepts = [c6Waterfall, c6Ttfb, c6Render, c6Cache];

export const case06CodeTour: TeachingStep[] = [
  {
    id: "c6-tour-frontend",
    mode: "teaching",
    title: "迷雾舞台：前端如何等待和渲染数据",
    goal: "只看 loading、接口耗时记录和列表渲染数量",
    projectPosition:
      "页面打开 → useEffect 请求数据 → loading → renderProjectList",
    codeFocus: {
      filePath: "frontend/ProjectList.jsx",
      functionName: "loadProjects / renderProjectList",
      input: "用户打开项目列表页",
      output: "展示项目列表或 loading 状态",
      ignore: ["卡片装饰样式", "空状态插画", "无关按钮事件"],
      lines: [
        "useEffect(() => {",
        "  const startedAt = performance.now();",
        "  setLoading(true);",
        "  fetch('/api/projects?includeStats=true')",
        "    .then((res) => res.json())",
        "    .then((projects) => {",
        "      reportTiming('projects_api', performance.now() - startedAt);",
        "      setProjects(projects);",
        "    })",
        "    .finally(() => setLoading(false));",
        "}, []);",
        "",
        "return projects.map((project) => <ProjectCard project={project} />);",
      ],
      observationGoal:
        "前端能记录从发请求到拿到数据的耗时，也可能因为一次性渲染过多项目而卡顿。先区分接口等待和渲染等待。",
    },
  },
  {
    id: "c6-tour-backend",
    mode: "teaching",
    title: "迷雾后台：后端为什么迟迟不回第一口气",
    goal: "只看接口计时、数据库查询和缓存命中",
    projectPosition:
      "GET /api/projects → cache.get → db.queryWithStats → response",
    codeFocus: {
      filePath: "server/projectRoutes.js",
      functionName: "GET /api/projects",
      input: "列表查询请求",
      output: "项目列表 JSON",
      ignore: ["鉴权细节", "日志格式配置", "其他路由"],
      lines: [
        "router.get('/api/projects', async (req, res) => {",
        "  const cached = await cache.get('projects:list');",
        "  if (cached) return res.json(cached);",
        "",
        "  const startedAt = Date.now();",
        "  const projects = await db.queryWithStats();",
        "  logger.info({ ms: Date.now() - startedAt }, 'projects query');",
        "  await cache.set('projects:list', projects, { ttl: 60 });",
        "  res.json(projects);",
        "});",
      ],
      observationGoal:
        "后端要么命中缓存快速返回，要么查询数据库并记录耗时。TTFB 高时，先查这里的计时日志和数据库查询。",
    },
  },
];

export const case06Map: ProjectMap = {
  nodes: [
    {
      id: "c6-user-open",
      label: "用户打开页面",
      description: "用户进入列表页，浏览器开始下载资源并发起数据请求。",
      input: "页面访问",
      output: "HTML、JS、CSS 和接口请求",
      possibleFaults: ["资源太大", "首屏请求太多"],
      evidenceSources: ["Network 瀑布图", "资源体积"],
    },
    {
      id: "c6-assets",
      label: "资源加载",
      description: "浏览器下载 JS、CSS、图片等静态资源。",
      input: "资源 URL",
      output: "可执行的前端代码和样式",
      possibleFaults: ["未压缩", "缓存未命中", "图片过大"],
      evidenceSources: ["Network Size", "Cache 状态"],
    },
    {
      id: "c6-api",
      label: "接口等待",
      description: "前端请求 /api/projects，等待后端返回第一口响应。",
      input: "GET 请求",
      output: "JSON 数据",
      possibleFaults: ["TTFB 高", "接口串行等待", "外部服务慢"],
      evidenceSources: ["TTFB", "接口耗时日志"],
    },
    {
      id: "c6-render",
      label: "前端渲染",
      description: "前端把 JSON 数据变成页面上的列表、图表和交互状态。",
      input: "projects JSON",
      output: "可见列表",
      possibleFaults: ["一次渲染太多 DOM", "重复计算", "状态更新过多"],
      evidenceSources: ["React Profiler", "手动计时", "列表数量"],
    },
    {
      id: "c6-cache",
      label: "缓存复测",
      description:
        "优化后用缓存、分页或请求去重减少等待，但要验证数据仍然正确。",
      input: "第二次访问 / 保存后刷新",
      output: "更快响应且数据不旧",
      possibleFaults: ["缓存过期策略不清", "保存后仍显示旧数据"],
      evidenceSources: ["前后耗时对比", "缓存命中日志", "功能回归测试"],
    },
  ],
  edges: [
    { from: "c6-user-open", to: "c6-assets", label: "下载资源" },
    { from: "c6-assets", to: "c6-api", label: "发起接口" },
    { from: "c6-api", to: "c6-render", label: "返回 JSON" },
    { from: "c6-render", to: "c6-cache", label: "优化复测" },
    { from: "c6-cache", to: "c6-user-open", label: "再次访问" },
  ],
};

export const case06Scenario: TeachingScenario = {
  scenarioId: "case-006-performance",
  steps: [
    {
      id: "c6-map",
      mode: "teaching",
      title: "慢速迷雾勘测",
      goal: "先看清页面变慢时，时间可能花在哪几段",
    },
    {
      id: "c6-concepts",
      mode: "teaching",
      title: "性能证据小抄",
      goal: "瀑布图、TTFB、渲染和缓存分别能证明什么",
      concepts: case06Concepts,
    },
    ...case06CodeTour,
    {
      id: "c6-close",
      mode: "teaching",
      title: "性能瓶颈结案报告",
      goal: "能用证据判断慢在前端还是后端，并写出可验收优化任务",
    },
  ],
  projectMap: case06Map,
};

export const javaCacheObservabilityScenario =
  buildJavaCacheObservabilityScenario();

export const frontendPerformanceProofScenario: TeachingScenario = {
  scenarioId: "frontend-performance-proof",
  projectMap: case06Map,
  steps: case06Scenario.steps.map((step) => {
    const titles: Record<string, string> = {
      "c6-map": "首屏观测塔地图",
      "c6-concepts": "性能证据小抄",
      "c6-tour-frontend": "关键代码：页面什么时候开始渲染",
      "c6-tour-backend": "关键代码：接口等待还是页面等待",
      "c6-close": "首屏性能结案报告",
    };
    const nextStep = {
      ...step,
      title: titles[step.id] ?? step.title,
      goal:
        step.id === "c6-map"
          ? "先把资源、接口和渲染放到一条可测量的首屏路线。"
          : step.id === "c6-concepts"
            ? "理解瀑布图、TTFB、渲染画像和缓存复测各自回答什么问题。"
            : step.goal,
    };
    if (step.id === "c6-tour-frontend") {
      return {
        ...nextStep,
        codeFocus: {
          ...step.codeFocus!,
          filePath: "frontend/ProjectList.jsx",
          observationGoal:
            "先记录请求和渲染开始时间，再用证据区分接口返回慢与页面摆放列表慢。",
        },
      };
    }
    return nextStep;
  }),
};

// ============ 主线 1-7：AI 接口怎么接 ============

const c7ApiKey: ConceptCard = {
  id: "c7-api-key",
  label: "API Key",
  analogy:
    "API Key 像模型熔炉的钥匙。拿到钥匙的人就能替你点火、消耗额度。钥匙如果放在前端包里，就等于贴在城门口。",
  example:
    "前端不能写 `const key = 'sk-...'`，也不能把 key 放进 VITE_ 开头的公开环境变量。前端只请求你自己的后端接口。",
  prediction: {
    question: "为什么 AI API Key 不能放在浏览器前端？",
    options: [
      "因为浏览器看不到任何 JavaScript",
      "因为用户能检查前端包和 Network，从而拿到密钥",
      "因为 API Key 只能写在 CSS 里",
      "因为后端不能发 HTTP 请求",
    ],
    correctIndex: 1,
    explanation:
      "前端代码会被下载到用户浏览器。只要密钥进入前端包或请求，就可能被复制和滥用。",
  },
};

const c7Env: ConceptCard = {
  id: "c7-env",
  label: "环境变量",
  analogy:
    "环境变量像只在后台值班室打开的保险柜。代码知道保险柜名字，但真正的钥匙由运行环境提供。",
  example:
    "后端读取 `process.env.AI_API_KEY`，前端只看到 `/api/ai/chat`。部署时在服务器配置密钥，而不是提交到 Git。",
  prediction: {
    question: "下面哪种写法更安全？",
    options: [
      "把 sk-key 直接写进 React 组件",
      "放到 README 示例里让大家复制",
      "后端从环境变量读取，前端只请求本地 API",
      "把 key 放进 localStorage",
    ],
    correctIndex: 2,
    explanation:
      "密钥应该留在服务端运行环境。前端只和自己的后端接口说话，不能接触真实 key。",
  },
};

const c7Stream: ConceptCard = {
  id: "c7-stream",
  label: "流式响应",
  analogy:
    "流式响应像熔炉边一边铸造一边递出火花。用户不用等整把剑铸完，先看到第一段结果，体验会更像对话。",
  example:
    "后端从 AI API 读取 stream，把 token 一段段转发给前端；前端用 reader 不断追加文本。",
  prediction: {
    question: "流式响应主要改善什么体验？",
    options: [
      "让密钥暴露得更快",
      "让用户更早看到输出，而不是等完整结果一次性返回",
      "让数据库自动建表",
      "让所有错误消失",
    ],
    correctIndex: 1,
    explanation:
      "流式不等于更聪明，它主要改善等待体验。失败、超时和限流仍然要处理。",
  },
};

const c7Fallback: ConceptCard = {
  id: "c7-fallback",
  label: "错误兜底",
  analogy:
    "模型熔炉可能熄火：钥匙没配、额度用完、上游超时。兜底不是假装成功，而是给用户可理解的退路。",
  example:
    "AI 服务失败时，接口返回结构化错误；前端显示“AI 暂时不可用，可先保存草稿”，后端日志记录 requestId 和 provider status。",
  prediction: {
    question: "AI 接口失败时，最不专业的处理是什么？",
    options: [
      "提示用户稍后重试",
      "记录后端日志",
      "返回结构化错误",
      "把真实 API Key 打印到前端方便调试",
    ],
    correctIndex: 3,
    explanation:
      "失败路径不能泄露密钥。要给用户可理解提示，同时在后端保留可排查日志。",
  },
};

export const case07Concepts = [c7ApiKey, c7Env, c7Stream, c7Fallback];

export const case07CodeTour: TeachingStep[] = [
  {
    id: "c7-tour-frontend",
    mode: "teaching",
    title: "前端：只请求自己的 AI 接口",
    goal: "只看用户输入、流式 reader 和错误提示",
    projectPosition: "用户输入 → 前端 chat() → POST /api/ai/chat → 流式显示",
    codeFocus: {
      filePath: "frontend/AiChatPanel.jsx",
      functionName: "sendMessage",
      input: "用户输入的 prompt",
      output: "逐段显示 AI 回复，或显示可理解错误",
      ignore: ["消息气泡样式", "滚动到底部动画", "头像装饰"],
      lines: [
        "async function sendMessage(prompt) {",
        "  setStatus('streaming');",
        "  const response = await fetch('/api/ai/chat', {",
        "    method: 'POST',",
        "    headers: { 'Content-Type': 'application/json' },",
        "    body: JSON.stringify({ prompt }),",
        "  });",
        "  if (!response.ok) throw new Error('AI 暂时不可用');",
        "  const reader = response.body.getReader();",
        "  while (true) {",
        "    const { value, done } = await reader.read();",
        "    if (done) break;",
        "    appendToken(decode(value));",
        "  }",
        "}",
      ],
      observationGoal:
        "前端没有 API Key，只请求自己的后端接口；reader 负责把流式内容一段段追加到页面。",
    },
  },
  {
    id: "c7-tour-backend",
    mode: "teaching",
    title: "后端：密钥只在服务端点火",
    goal: "只看环境变量、AI API 请求和失败兜底",
    projectPosition:
      "POST /api/ai/chat → process.env.AI_API_KEY → AI provider → stream",
    codeFocus: {
      filePath: "server/aiRoutes.js",
      functionName: "POST /api/ai/chat",
      input: "用户 prompt + 服务端环境变量",
      output: "AI 流式响应或结构化错误",
      ignore: ["具体模型参数调优", "日志库初始化", "鉴权中间件细节"],
      lines: [
        "router.post('/api/ai/chat', async (req, res) => {",
        "  const apiKey = process.env.AI_API_KEY;",
        "  if (!apiKey) return res.status(503).json({ code: 'AI_NOT_CONFIGURED' });",
        "",
        "  const upstream = await fetch('https://api.example.ai/chat', {",
        "    method: 'POST',",
        "    headers: { Authorization: `Bearer ${apiKey}` },",
        "    body: JSON.stringify({ messages: [{ role: 'user', content: req.body.prompt }], stream: true }),",
        "  });",
        "  if (!upstream.ok) return res.status(502).json({ code: 'AI_PROVIDER_FAILED' });",
        "  upstream.body.pipe(res);",
        "});",
      ],
      observationGoal:
        "真实密钥只在后端读取和使用；失败时返回错误 code，不能把密钥、上游原始敏感信息暴露给前端。",
    },
  },
];

export const case07Map: ProjectMap = {
  nodes: [
    {
      id: "c7-user-prompt",
      label: "用户输入",
      description: "用户在前端输入问题或任务，触发 AI 请求。",
      input: "prompt 文本",
      output: "POST /api/ai/chat",
      possibleFaults: ["空输入", "没有 loading 状态", "错误提示不清楚"],
      evidenceSources: ["页面输入", "Network Payload"],
    },
    {
      id: "c7-frontend-api",
      label: "前端本地接口",
      description: "前端只请求自己的后端接口，不接触真实 AI API Key。",
      input: "prompt JSON",
      output: "本地 API 请求",
      possibleFaults: ["把 key 写进前端", "直接请求第三方 AI API"],
      evidenceSources: ["前端代码", "打包产物扫描", "Network Headers"],
    },
    {
      id: "c7-server-key",
      label: "服务端密钥",
      description: "后端从环境变量读取密钥，并负责调用 AI provider。",
      input: "process.env.AI_API_KEY",
      output: "带 Authorization 的上游请求",
      possibleFaults: ["环境变量缺失", "日志泄露 key", "错误响应暴露敏感信息"],
      evidenceSources: ["后端代码", "服务端日志", "环境配置"],
    },
    {
      id: "c7-ai-provider",
      label: "AI Provider",
      description: "外部模型服务返回流式 token、限流或错误。",
      input: "messages + model + stream",
      output: "token stream / error status",
      possibleFaults: ["超时", "限流", "模型错误", "网络失败"],
      evidenceSources: ["provider status", "requestId", "后端日志"],
    },
    {
      id: "c7-stream-ui",
      label: "流式展示",
      description: "前端逐段读取响应并追加显示，失败时给用户可理解提示。",
      input: "ReadableStream",
      output: "逐字出现的回复或降级提示",
      possibleFaults: ["等待空白", "中途失败无提示", "重复提交"],
      evidenceSources: ["页面状态", "错误提示", "手动复测"],
    },
  ],
  edges: [
    { from: "c7-user-prompt", to: "c7-frontend-api", label: "提交问题" },
    { from: "c7-frontend-api", to: "c7-server-key", label: "请求本地 API" },
    { from: "c7-server-key", to: "c7-ai-provider", label: "服务端带 key 调用" },
    { from: "c7-ai-provider", to: "c7-stream-ui", label: "返回 stream" },
    { from: "c7-stream-ui", to: "c7-user-prompt", label: "展示/重试" },
  ],
};

export const case07Scenario: TeachingScenario = {
  scenarioId: "case-007-ai-api",
  steps: [
    {
      id: "c7-map",
      mode: "teaching",
      title: "模型熔炉勘测",
      goal: "先看清 AI 请求从用户输入到流式展示的完整路线",
    },
    {
      id: "c7-concepts",
      mode: "teaching",
      title: "AI 接口安全小抄",
      goal: "API Key、环境变量、流式响应和错误兜底分别负责什么",
      concepts: case07Concepts,
    },
    ...case07CodeTour,
    {
      id: "c7-close",
      mode: "teaching",
      title: "AI API 接入结案报告",
      goal: "能解释为什么必须服务端转发，以及如何验证密钥不泄露",
    },
  ],
  projectMap: case07Map,
};

// ============ 主线 1-8：AI 回复为什么胡说 ============

const c8Prompt: ConceptCard = {
  id: "c8-prompt",
  label: "Prompt",
  analogy:
    "Prompt 像写给镜厅的委托书。只写“帮我回答”太空，镜子就会自己补剧情；写清角色、资料、格式和不可回答条件，输出才有边界。",
  example:
    "不要只写“总结这个项目”。更好的写法是：只根据给定 context 回答，必须列出引用 id；如果资料里没有答案，就返回 UNKNOWN。",
  prediction: {
    question: "为什么空泛 Prompt 更容易让 AI 胡说？",
    options: [
      "因为模型不能读取任何文字",
      "因为模型会为了完成任务自行补全缺失背景",
      "因为 Prompt 只能写英文",
      "因为引用字段会让输出变慢",
    ],
    correctIndex: 1,
    explanation:
      "模型会尽量给出看似完整的回答。背景和边界不清楚时，它更容易把猜测说得像事实。",
  },
};

const c8Context: ConceptCard = {
  id: "c8-context",
  label: "上下文",
  analogy:
    "上下文像随案资料袋。镜厅校对师不会凭空断案，它必须先看到项目文档、用户问题和允许使用的资料范围。",
  example:
    "后端把检索到的文档片段作为 context 传给模型；模型只能依据这些片段回答，而不是拿训练记忆乱补公司内部信息。",
  prediction: {
    question: "上下文最核心的作用是什么？",
    options: [
      "让模型只在给定资料范围内回答",
      "自动修复所有 bug",
      "把 API Key 发给前端",
      "替代所有测试",
    ],
    correctIndex: 0,
    explanation:
      "上下文提供回答依据，也限制回答范围。没有资料时，专业系统要承认不知道。",
  },
};

const c8Citation: ConceptCard = {
  id: "c8-citation",
  label: "引用来源",
  analogy:
    "引用像证物编号。AI 不能只说“我确定”，它要指出自己依据哪张纸、哪段记录、哪条日志。",
  example:
    "输出结构里带 citations: ['doc-12#chunk-3']。前端展示答案时，同时展示对应资料片段。",
  prediction: {
    question: "为什么 AI 回答最好带引用？",
    options: [
      "为了让 UI 更花",
      "为了让用户和开发者能追查回答依据",
      "为了隐藏错误",
      "为了减少所有接口请求",
    ],
    correctIndex: 1,
    explanation:
      "引用让回答可检查。用户可以看到答案来自哪份资料，开发者也能用引用判断检索是否命中。",
  },
};

const c8Refusal: ConceptCard = {
  id: "c8-refusal",
  label: "拒答边界",
  analogy:
    "拒答像镜厅校对师放下印章：资料不足时不硬编。承认不知道不是失败，而是保护用户不被假答案骗走。",
  example:
    "如果 context 里没有价格政策，就返回 { answer: '资料不足，无法确认', citations: [], confidence: 'low' }。",
  prediction: {
    question: "找不到依据时，最专业的处理是什么？",
    options: [
      "编一个听起来合理的答案",
      "隐藏引用列表",
      "明确说明资料不足，并提示需要补充什么",
      "把问题直接丢给用户",
    ],
    correctIndex: 2,
    explanation:
      "可验证 AI 输出的关键不是永远回答，而是知道什么时候不能回答，并说明缺少哪类证据。",
  },
};

export const case08Concepts = [c8Prompt, c8Context, c8Citation, c8Refusal];

export const case08CodeTour: TeachingStep[] = [
  {
    id: "c8-tour-prompt",
    mode: "teaching",
    title: "镜厅委托书：把回答边界写进 Prompt",
    goal: "只看系统提示、资料上下文和引用要求",
    projectPosition:
      "用户问题 → buildGroundedPrompt(context) → 模型必须按证据回答",
    codeFocus: {
      filePath: "server/groundedAnswer.js",
      functionName: "buildGroundedPrompt",
      input: "用户问题 + 检索到的资料片段",
      output: "带回答边界和引用要求的 messages",
      ignore: ["模型温度参数", "UI 动画", "资料排序优化"],
      lines: [
        "function buildGroundedPrompt(question, contextChunks) {",
        "  return [",
        "    { role: 'system', content: '只根据 context 回答。每句话都要能对应 citation。资料不足时返回 UNKNOWN。' },",
        "    { role: 'user', content: JSON.stringify({",
        "      question,",
        "      context: contextChunks.map(({ id, text }) => ({ id, text })),",
        "      outputSchema: { answer: 'string', citations: ['chunk-id'], confidence: 'high|low' },",
        "    }) },",
        "  ];",
        "}",
      ],
      observationGoal:
        "Prompt 不是一句口令，而是把资料范围、输出格式、引用要求和拒答条件写清楚。",
    },
  },
  {
    id: "c8-tour-verify",
    mode: "teaching",
    title: "镜厅校验：没有引用的回答不能放行",
    goal: "只看引用校验、无资料拒答和前端提示",
    projectPosition:
      "模型输出 → validateCitations → 有依据就展示，没依据就拒答",
    codeFocus: {
      filePath: "server/answerVerifier.js",
      functionName: "validateGroundedAnswer",
      input: "模型 JSON 输出 + 本轮 context chunk id",
      output: "可展示回答或资料不足提示",
      ignore: ["日志美化", "埋点字段", "富文本排版"],
      lines: [
        "function validateGroundedAnswer(answer, allowedChunkIds) {",
        "  const citations = answer.citations ?? [];",
        "  const hasValidCitation = citations.every((id) => allowedChunkIds.has(id));",
        "  if (!answer.answer || citations.length === 0 || !hasValidCitation) {",
        "    return { answer: '资料不足，无法确认。请补充来源材料。', citations: [], confidence: 'low' };",
        "  }",
        "  return answer;",
        "}",
      ],
      observationGoal:
        "验收 AI 输出时，不只看回答顺不顺，而要检查引用是否来自本轮资料；没有依据就明确拒答。",
    },
  },
];

export const case08Map: ProjectMap = {
  nodes: [
    {
      id: "c8-user-question",
      label: "用户问题",
      description: "用户向 AI 提问，问题可能具体，也可能缺少必要背景。",
      input: "question",
      output: "待约束的 AI 任务",
      possibleFaults: ["问题太泛", "目标不清", "没有资料范围"],
      evidenceSources: ["用户输入", "任务记录"],
    },
    {
      id: "c8-prompt-contract",
      label: "Prompt 委托书",
      description: "系统提示写清角色、资料范围、输出格式和拒答条件。",
      input: "question + instruction",
      output: "messages",
      possibleFaults: ["没有限制资料来源", "没有要求引用", "没有拒答条件"],
      evidenceSources: ["Prompt 模板", "请求 payload"],
    },
    {
      id: "c8-context-bag",
      label: "上下文资料袋",
      description: "后端把允许使用的文档片段交给模型，作为回答依据。",
      input: "context chunks",
      output: "带 id 的资料片段",
      possibleFaults: ["资料为空", "资料不相关", "chunk id 丢失"],
      evidenceSources: ["检索结果", "chunk id", "资料预览"],
    },
    {
      id: "c8-model-answer",
      label: "模型回答",
      description: "模型根据 Prompt 和 context 生成答案、引用和置信边界。",
      input: "messages",
      output: "answer + citations + confidence",
      possibleFaults: ["编造引用", "无引用回答", "把猜测说成事实"],
      evidenceSources: ["模型原始输出", "结构化 JSON"],
    },
    {
      id: "c8-verification",
      label: "引用校验",
      description: "服务端检查引用是否来自本轮资料；找不到依据时返回资料不足。",
      input: "citations + allowed chunk ids",
      output: "可展示回答 / 拒答提示",
      possibleFaults: ["引用 id 不存在", "无资料仍放行", "前端隐藏低置信度"],
      evidenceSources: ["校验结果", "反例测试", "前端提示"],
    },
  ],
  edges: [
    { from: "c8-user-question", to: "c8-prompt-contract", label: "写成委托" },
    { from: "c8-prompt-contract", to: "c8-context-bag", label: "带上资料" },
    { from: "c8-context-bag", to: "c8-model-answer", label: "交给模型" },
    { from: "c8-model-answer", to: "c8-verification", label: "检查引用" },
    { from: "c8-verification", to: "c8-user-question", label: "展示或拒答" },
  ],
};

export const case08Scenario: TeachingScenario = {
  scenarioId: "case-008-hallucination",
  steps: [
    {
      id: "c8-map",
      mode: "teaching",
      title: "幻觉镜厅勘测",
      goal: "先看清 AI 回答从用户问题到引用校验的完整路线",
    },
    {
      id: "c8-concepts",
      mode: "teaching",
      title: "可验证 AI 输出小抄",
      goal: "Prompt、上下文、引用和拒答边界分别负责什么",
      concepts: case08Concepts,
    },
    ...case08CodeTour,
    {
      id: "c8-close",
      mode: "teaching",
      title: "幻觉控制结案报告",
      goal: "能解释为什么 AI 回答必须有来源，以及如何验证它没有乱编",
    },
  ],
  projectMap: case08Map,
};

// ============ 主线 1-9：RAG 知识库 ============

const c9Rag: ConceptCard = {
  id: "c9-rag",
  label: "RAG",
  analogy:
    "RAG 像让 AI 先去图书馆找资料，再带着书页回来回答。它不是把资料塞进模型脑子，而是每次回答前先检索证据。",
  example:
    "用户问“退款规则是什么”，系统先检索 docs/refund.md 的相关 chunk，再把 chunk 作为 context 交给模型回答。",
  prediction: {
    question: "RAG 最准确的理解是哪一个？",
    options: [
      "让模型永久记住所有公司文档",
      "先检索相关资料，再让模型基于资料回答",
      "把数据库密码发给前端",
      "让所有回答不需要引用",
    ],
    correctIndex: 1,
    explanation:
      "RAG 的核心是检索增强：先找资料，再回答。资料是否命中，比模型说得顺更重要。",
  },
};

const c9Chunk: ConceptCard = {
  id: "c9-chunk",
  label: "chunk",
  analogy:
    "chunk 像把厚书拆成带编号的书页。书太厚时，AI 不可能每次读完整本；切成片段后，系统才能找到最相关的几页。",
  example:
    "把产品说明按标题和段落切成 doc-12#chunk-3 这种片段，并保留标题、来源路径和原文。",
  prediction: {
    question: "为什么资料要切成 chunk？",
    options: [
      "为了丢掉来源",
      "为了让检索可以定位到更小、更相关的资料片段",
      "为了禁止引用",
      "为了让前端不能显示文本",
    ],
    correctIndex: 1,
    explanation:
      "chunk 让系统能命中具体片段。切得太大噪声多，切得太碎可能丢上下文。",
  },
};

const c9Embedding: ConceptCard = {
  id: "c9-embedding",
  label: "embedding",
  analogy:
    "embedding 像给每页书做气味指纹。用户问题也变成一份指纹，检索狐就能嗅出哪几页最像。",
  example:
    "系统把 chunk.text 转成向量；用户提问也转成向量，再用相似度找 topK 片段。",
  prediction: {
    question: "embedding 在 RAG 里主要用来做什么？",
    options: [
      "把文字变成可比较的向量，方便检索相似片段",
      "直接替用户写代码",
      "隐藏所有资料来源",
      "替代后端日志",
    ],
    correctIndex: 0,
    explanation:
      "embedding 不是答案本身，它帮助系统找到相似资料。命中后还要把原文和引用交给模型。",
  },
};

const c9HitRate: ConceptCard = {
  id: "c9-hit-rate",
  label: "命中率",
  analogy:
    "命中率像检索狐找书的准头。问退款却找到了登录文档，后面模型再聪明也会答偏。",
  example:
    "用一组标准问题检查 topK 是否命中正确 chunk；如果命中错误，要调整切分、索引字段或检索参数。",
  prediction: {
    question: "RAG 回答错了，第一步应该查什么？",
    options: [
      "只调大模型温度",
      "先看检索命中的 chunk 是否正确",
      "删除所有引用",
      "把 API Key 放前端",
    ],
    correctIndex: 1,
    explanation:
      "RAG 的错误常常发生在检索阶段。先看命中的资料对不对，再看 Prompt 和模型回答。",
  },
};

export const case09Concepts = [c9Rag, c9Chunk, c9Embedding, c9HitRate];

export const case09CodeTour: TeachingStep[] = [
  {
    id: "c9-tour-index",
    mode: "teaching",
    title: "知识入库：把文档切成可检索书页",
    goal: "只看切分、chunk id、来源路径和索引写入",
    projectPosition: "上传文档 → splitIntoChunks → embed → upsert index",
    codeFocus: {
      filePath: "server/ragIndexer.js",
      functionName: "indexDocument",
      input: "文档路径和原文内容",
      output: "带来源、chunk id 和向量的索引记录",
      ignore: ["文件上传 UI", "权限系统", "批处理队列优化"],
      lines: [
        "async function indexDocument(doc) {",
        "  const chunks = splitIntoChunks(doc.text, { by: 'heading', maxChars: 900 });",
        "  for (const [index, chunk] of chunks.entries()) {",
        "    const id = `${doc.id}#chunk-${index + 1}`;",
        "    const vector = await embed(chunk.text);",
        "    await vectorStore.upsert({ id, vector, text: chunk.text, source: doc.path });",
        "  }",
        "}",
      ],
      observationGoal:
        "RAG 的第一步不是问模型，而是把资料切成带来源的 chunk，并建立可检索索引。",
    },
  },
  {
    id: "c9-tour-query",
    mode: "teaching",
    title: "知识检索：先找书页，再让 AI 开口",
    goal: "只看 query embedding、topK 命中和引用拼接",
    projectPosition: "用户问题 → embed query → search topK → context → answer",
    codeFocus: {
      filePath: "server/ragAnswer.js",
      functionName: "answerWithSources",
      input: "用户问题",
      output: "带 context 和 citations 的 AI 回答",
      ignore: ["聊天气泡样式", "缓存策略", "模型供应商细节"],
      lines: [
        "async function answerWithSources(question) {",
        "  const queryVector = await embed(question);",
        "  const matches = await vectorStore.search(queryVector, { topK: 4 });",
        "  const context = matches.map(({ id, text, source, score }) => ({ id, text, source, score }));",
        "  const answer = await generateGroundedAnswer({ question, context });",
        "  return { answer: answer.text, citations: answer.citations, matches: context };",
        "}",
      ],
      observationGoal:
        "RAG 回答必须能展示命中的 chunk、相似度和最终引用；如果命中不对，答案再顺也不可信。",
    },
  },
];

export const case09Map: ProjectMap = {
  nodes: [
    {
      id: "c9-upload",
      label: "上传资料",
      description: "项目文档、FAQ 或客服知识被放入知识库入口。",
      input: "PDF / Markdown / 文本",
      output: "待切分文档",
      possibleFaults: ["资料过旧", "来源路径丢失", "权限范围不清"],
      evidenceSources: ["文档路径", "更新时间", "来源元数据"],
    },
    {
      id: "c9-chunk",
      label: "切分 chunk",
      description: "长文档被拆成带编号、带来源的小片段。",
      input: "原文",
      output: "doc-id#chunk-n",
      possibleFaults: ["切太碎", "切太大", "标题丢失"],
      evidenceSources: ["chunk 预览", "chunk id", "source path"],
    },
    {
      id: "c9-index",
      label: "建立索引",
      description: "每个 chunk 生成 embedding，并写入向量索引。",
      input: "chunk text",
      output: "vector + metadata",
      possibleFaults: ["索引未更新", "metadata 缺失", "向量生成失败"],
      evidenceSources: ["索引记录", "embedding 状态", "upsert 日志"],
    },
    {
      id: "c9-search",
      label: "检索命中",
      description: "用户问题转成向量后，系统找出最相近的 topK chunk。",
      input: "question vector",
      output: "matches + score",
      possibleFaults: ["命中错误资料", "topK 太少", "相似度过低"],
      evidenceSources: ["matches 列表", "score", "反例问题"],
    },
    {
      id: "c9-answer",
      label: "带引用回答",
      description: "模型只基于命中的 chunk 回答，并展示来源引用。",
      input: "question + context chunks",
      output: "answer + citations",
      possibleFaults: ["引用不对应", "隐藏命中证据", "无资料仍回答"],
      evidenceSources: ["最终回答", "citations", "命中 chunk 原文"],
    },
  ],
  edges: [
    { from: "c9-upload", to: "c9-chunk", label: "切成书页" },
    { from: "c9-chunk", to: "c9-index", label: "生成向量" },
    { from: "c9-index", to: "c9-search", label: "按问题检索" },
    { from: "c9-search", to: "c9-answer", label: "带资料回答" },
    { from: "c9-answer", to: "c9-search", label: "错答时回查命中" },
  ],
};

export const case09Scenario: TeachingScenario = {
  scenarioId: "case-009-rag",
  steps: [
    {
      id: "c9-map",
      mode: "teaching",
      title: "知识迷宫勘测",
      goal: "先看清资料如何从文档变成 AI 回答里的引用",
    },
    {
      id: "c9-concepts",
      mode: "teaching",
      title: "RAG 知识库小抄",
      goal: "RAG、chunk、embedding 和命中率分别负责什么",
      concepts: case09Concepts,
    },
    ...case09CodeTour,
    {
      id: "c9-close",
      mode: "teaching",
      title: "RAG 知识库结案报告",
      goal: "能解释资料如何被找出、带进回答，并用命中证据验收",
    },
  ],
  projectMap: case09Map,
};

// ============ 主线 1-10：Agent 工具调用 ============

const c10ToolCall: ConceptCard = {
  id: "c10-tool-call",
  label: "工具调用",
  analogy:
    "工具调用像给 Agent 一串塔楼钥匙。它不是只聊天，而是可以查资料、调接口、创建任务；所以每把钥匙都要写清楚能开哪扇门。",
  example:
    "Agent 想查订单时，不能自己乱猜数据库；它只能调用 searchOrders({ userId, status }) 这种被注册过的工具。",
  prediction: {
    question: "Agent 工具调用最重要的边界是什么？",
    options: [
      "让 Agent 想调用什么就调用什么",
      "只允许调用注册过、说明清楚、可校验参数的工具",
      "把所有权限都交给前端",
      "失败时不告诉用户",
    ],
    correctIndex: 1,
    explanation:
      "工具调用的核心是受控执行。工具必须先注册、说明能力边界，并接受参数校验。",
  },
};

const c10Schema: ConceptCard = {
  id: "c10-schema",
  label: "参数 schema",
  analogy:
    "参数 schema 像工具申请表。门卫只接受字段齐全、类型正确、范围合法的申请；少字段、错类型、危险参数都要拦住。",
  example:
    "createIssue 需要 title 和 body；deleteProject 这种危险动作必须额外确认，不能因为 Agent 生成了字符串就执行。",
  prediction: {
    question: "为什么工具参数需要 schema？",
    options: [
      "为了让 UI 更漂亮",
      "为了在执行前检查字段、类型和范围是否安全",
      "为了跳过权限判断",
      "为了隐藏错误日志",
    ],
    correctIndex: 1,
    explanation:
      "schema 是执行前的第一道门。它能把缺失参数、类型错误和不允许的值挡在工具外面。",
  },
};

const c10Permission: ConceptCard = {
  id: "c10-permission",
  label: "权限",
  analogy:
    "权限像塔楼门禁。Agent 拿着工具钥匙，不代表它能进所有房间；读日志、改数据、发消息的权限等级完全不同。",
  example:
    "同一个 Agent 可以 read_docs，但不能 send_email；可以查询测试数据，但不能删除生产数据。",
  prediction: {
    question: "下面哪种设计最安全？",
    options: [
      "工具函数里先检查当前用户和工具权限",
      "只要 Agent 说需要，就执行",
      "把管理员权限写进 Prompt",
      "失败后重试危险动作直到成功",
    ],
    correctIndex: 0,
    explanation:
      "权限不能只靠 Prompt 约束。工具执行前必须用代码检查当前用户、环境和动作范围。",
  },
};

const c10Fallback: ConceptCard = {
  id: "c10-fallback",
  label: "失败回退",
  analogy:
    "失败回退像副官没打开门时递回一张说明单：为什么没开、下一步怎么办、是否需要人类确认。",
  example:
    "工具超时返回 TOOL_TIMEOUT，参数不合法返回 VALIDATION_FAILED，越权返回 PERMISSION_DENIED，并记录 requestId 方便排查。",
  prediction: {
    question: "工具调用失败时，最专业的处理是什么？",
    options: [
      "吞掉错误，假装成功",
      "返回结构化错误、给用户可理解提示，并记录审计信息",
      "把内部堆栈全部展示给用户",
      "自动执行一个更危险的工具",
    ],
    correctIndex: 1,
    explanation:
      "Agent 工具会失败。失败时要可解释、可追踪、可回退，不能假装成功或升级危险动作。",
  },
};

export const case10Concepts = [
  c10ToolCall,
  c10Schema,
  c10Permission,
  c10Fallback,
];

export const case10CodeTour: TeachingStep[] = [
  {
    id: "c10-tour-registry",
    mode: "teaching",
    title: "工具契约：先注册能做什么",
    goal: "只看工具名称、描述、参数 schema 和权限声明",
    projectPosition: "Agent 计划动作 → tool registry → 选择允许的工具",
    codeFocus: {
      filePath: "server/agentTools.js",
      functionName: "toolRegistry",
      input: "Agent 想执行的动作",
      output: "被允许调用的工具定义",
      ignore: ["LLM provider 细节", "UI 聊天气泡", "日志格式美化"],
      lines: [
        "const toolRegistry = {",
        "  searchOrders: {",
        "    description: '按用户和状态查询订单，只读。',",
        "    permission: 'orders:read',",
        "    schema: { userId: 'string', status: ['paid', 'pending', 'failed'] },",
        "    run: async ({ userId, status }, context) => orderStore.search({ userId, status }),",
        "  },",
        "};",
      ],
      observationGoal:
        "工具不是随便调用的函数。它要先注册名称、用途、参数要求和权限边界。",
    },
  },
  {
    id: "c10-tour-executor",
    mode: "teaching",
    title: "工具执行器：校验、授权、失败回退",
    goal: "只看 validate、authorize、try/catch 和结构化错误",
    projectPosition: "toolCall → 参数校验 → 权限检查 → 执行 → 结果/错误",
    codeFocus: {
      filePath: "server/agentToolExecutor.js",
      functionName: "executeToolCall",
      input: "toolName + args + 当前用户上下文",
      output: "工具结果或结构化错误",
      ignore: ["具体数据库实现", "监控上报 SDK", "消息渲染"],
      lines: [
        "async function executeToolCall(toolName, args, context) {",
        "  const tool = toolRegistry[toolName];",
        "  if (!tool) return { ok: false, code: 'TOOL_NOT_FOUND' };",
        "  const parsed = validate(tool.schema, args);",
        "  if (!parsed.ok) return { ok: false, code: 'VALIDATION_FAILED' };",
        "  if (!hasPermission(context.user, tool.permission)) return { ok: false, code: 'PERMISSION_DENIED' };",
        "  try {",
        "    return { ok: true, data: await tool.run(parsed.value, context) };",
        "  } catch (error) {",
        "    return { ok: false, code: 'TOOL_FAILED', requestId: context.requestId };",
        "  }",
        "}",
      ],
      observationGoal:
        "执行工具前必须过三道门：工具存在、参数合法、权限允许。失败时返回可解释 code，而不是失控执行。",
    },
  },
];

export const case10Map: ProjectMap = {
  nodes: [
    {
      id: "c10-user-goal",
      label: "用户目标",
      description: "用户提出一个想让 Agent 帮忙完成的动作。",
      input: "自然语言目标",
      output: "候选工具计划",
      possibleFaults: ["目标含糊", "动作危险", "缺少验收条件"],
      evidenceSources: ["用户任务", "Agent plan"],
    },
    {
      id: "c10-tool-select",
      label: "工具选择",
      description: "Agent 只能从注册表中选择已声明边界的工具。",
      input: "toolName",
      output: "tool definition",
      possibleFaults: ["调用不存在工具", "工具描述过宽", "读写边界不清"],
      evidenceSources: ["tool registry", "工具描述", "工具权限"],
    },
    {
      id: "c10-schema",
      label: "参数校验",
      description: "执行前检查字段、类型、枚举值和危险参数。",
      input: "args",
      output: "parsed args / validation error",
      possibleFaults: ["缺字段", "类型错误", "越界参数"],
      evidenceSources: ["schema", "VALIDATION_FAILED", "反例测试"],
    },
    {
      id: "c10-permission",
      label: "权限检查",
      description: "确认当前用户和环境是否允许执行该工具。",
      input: "user + permission",
      output: "allow / deny",
      possibleFaults: ["越权执行", "环境不分离", "危险动作缺确认"],
      evidenceSources: ["permission code", "PERMISSION_DENIED", "审计日志"],
    },
    {
      id: "c10-result",
      label: "结果与回退",
      description: "合法调用返回结果；失败时返回结构化错误和下一步提示。",
      input: "tool.run",
      output: "data / TOOL_FAILED",
      possibleFaults: ["假装成功", "错误不可读", "无 requestId"],
      evidenceSources: ["工具结果", "错误 code", "requestId"],
    },
  ],
  edges: [
    { from: "c10-user-goal", to: "c10-tool-select", label: "生成计划" },
    { from: "c10-tool-select", to: "c10-schema", label: "提交参数" },
    { from: "c10-schema", to: "c10-permission", label: "参数合法后验权" },
    { from: "c10-permission", to: "c10-result", label: "允许才执行" },
    { from: "c10-result", to: "c10-user-goal", label: "回传结果/错误" },
  ],
};

export const case10Scenario: TeachingScenario = {
  scenarioId: "case-010-agent-tools",
  steps: [
    {
      id: "c10-map",
      mode: "teaching",
      title: "工具契约大厅勘测",
      goal: "先看清 Agent 调工具前后要经过哪些安全门",
    },
    {
      id: "c10-concepts",
      mode: "teaching",
      title: "Agent 工具调用小抄",
      goal: "工具调用、参数 schema、权限和失败回退分别负责什么",
      concepts: case10Concepts,
    },
    ...case10CodeTour,
    {
      id: "c10-close",
      mode: "teaching",
      title: "Agent 工具调用结案报告",
      goal: "能解释如何让 Agent 做事但不越权，并写出可验收边界",
    },
  ],
  projectMap: case10Map,
};

// ============ 主线 1-11：测试怎么证明修好了 ============

const c11ReproCase: ConceptCard = {
  id: "c11-repro-case",
  label: "复现用例",
  analogy:
    "复现用例像试炼场的第一枚封印：你先证明怪物真的会出现，后面的修复才有意义。",
  example:
    "保存后刷新丢数据时，先写一个失败测试：POST 保存后再 GET，应该能看到刚保存的记录。",
  prediction: {
    question: "为什么修 bug 前最好先写复现用例？",
    options: [
      "为了让测试数量看起来更多",
      "为了证明自己真的抓住了旧问题，而不是修了一个无关地方",
      "为了跳过手动验证",
      "为了不看 Network 和日志",
    ],
    correctIndex: 1,
    explanation:
      "复现用例能证明旧问题真实存在。修复后同一个用例变绿，才说明你至少覆盖了原来的故障。",
  },
};

const c11UnitTest: ConceptCard = {
  id: "c11-unit-test",
  label: "单元测试",
  analogy:
    "单元测试像检查单个机关齿轮：不管整座城怎么运转，先确认这个函数在给定输入下会产出正确结果。",
  example:
    "测试 buildCanvasPayload(draft) 是否会保留 title、nodes 和 updatedAt，而不是直接去点整个页面。",
  prediction: {
    question: "单元测试最适合证明什么？",
    options: [
      "证明某个函数或模块在小范围输入下行为正确",
      "证明线上一定不会出问题",
      "证明 UI 一定好看",
      "证明用户已经学会了",
    ],
    correctIndex: 0,
    explanation:
      "单元测试范围小、反馈快，适合守住函数和模块边界；它不能替代完整链路验收。",
  },
};

const c11IntegrationTest: ConceptCard = {
  id: "c11-integration-test",
  label: "集成测试",
  analogy:
    "集成测试像让几座机关塔连在一起转：前端、接口、数据层可能单独都对，但交接时仍会掉东西。",
  example:
    "POST /api/canvases 后再 GET /api/canvases，确认 API 路由和 repository 真的连到同一个数据源。",
  prediction: {
    question: "集成测试比单元测试多证明了什么？",
    options: [
      "多个模块交接后仍然能完成同一条业务链路",
      "代码不需要人工审查",
      "不需要错误用例",
      "只要跑过一次就永远有效",
    ],
    correctIndex: 0,
    explanation:
      "集成测试关注模块之间的交接，比如接口是否真的调用数据层、数据层是否真的写入持久化存储。",
  },
};

const c11ManualReport: ConceptCard = {
  id: "c11-manual-report",
  label: "手动测试报告",
  analogy:
    "手动测试报告像试炼官签字的现场记录：人真的走过用户路径，写下时间、步骤、结果和证据。",
  example:
    "在浏览器里点击保存、刷新页面、看到记录仍在，并记录报告生成时间、测试命令和源码指纹。",
  prediction: {
    question: "手动测试报告为什么要写清时间和步骤？",
    options: [
      "为了让报告看起来更长",
      "为了证明这份报告对应当前代码和真实用户路径",
      "为了隐藏失败日志",
      "为了替代所有自动化测试",
    ],
    correctIndex: 1,
    explanation:
      "报告要能追溯：什么时候测、用什么代码测、走了哪些步骤、结果是什么。否则很难判断它是否可信。",
  },
};

export const case11Concepts = [
  c11ReproCase,
  c11UnitTest,
  c11IntegrationTest,
  c11ManualReport,
];

export const case11CodeTour: TeachingStep[] = [
  {
    id: "c11-tour-regression",
    mode: "teaching",
    title: "回归测试：先封住旧故障",
    goal: "只看 arrange、act、assert 三段，理解测试如何复现旧问题",
    projectPosition: "故障现象 → 复现用例 → 修复前失败 → 修复后通过",
    codeFocus: {
      filePath: "sandbox/canvas-save-persistence/tests/run-tests.js",
      functionName: "persistsCanvasAfterRefresh",
      input: "保存一个 canvas，然后模拟刷新后的读取",
      output: "测试通过或失败报告",
      ignore: ["测试框架启动细节", "彩色终端输出", "报告文件格式美化"],
      lines: [
        "await postJson('/api/canvases', draft);",
        "const listAfterRefresh = await getJson('/api/canvases');",
        "assert.equal(listAfterRefresh.length, 1);",
        "assert.equal(listAfterRefresh[0].title, draft.title);",
      ],
      observationGoal:
        "这段测试不是在背命令。它证明了同一条保存链路：保存之后再读取，数据应该仍然存在。",
    },
  },
  {
    id: "c11-tour-report",
    mode: "teaching",
    title: "测试报告：把证据交给别人复核",
    goal: "只看报告里的 status、generatedAt、sourceFingerprint 和 failures",
    projectPosition: "本地测试结果 → test-results.json → 应用读取 → 成长档案",
    codeFocus: {
      filePath: "sandbox/canvas-save-persistence/test-results.json",
      functionName: "manualTestReport",
      input: "用户手动运行测试后的结果文件",
      output: "应用可读取、可校验的验收证据",
      ignore: ["终端样式", "测试 runner 内部实现", "无关 stdout"],
      lines: [
        "{",
        '  "status": "passed",',
        '  "generatedAt": "2026-07-05T10:00:00.000Z",',
        '  "sourceFingerprint": "sha256:...",',
        '  "cases": [{ "name": "保存后刷新仍存在", "status": "passed" }]',
        "}",
      ],
      observationGoal:
        "可信报告要能回答四件事：测的是当前代码吗、什么时候测的、哪些用例通过、失败时失败在哪里。",
    },
  },
];

export const case11Map: ProjectMap = {
  nodes: [
    {
      id: "c11-bug",
      label: "故障现象",
      description: "用户看到一个问题，例如保存成功但刷新后消失。",
      input: "用户反馈 + 可观察现象",
      output: "需要被复现的失败路径",
      possibleFaults: ["只听描述不复现", "误判故障层", "没有记录初始证据"],
      evidenceSources: ["用户步骤", "Network", "日志", "数据库查询"],
    },
    {
      id: "c11-repro",
      label: "复现测试",
      description: "把旧故障写成能失败的测试或手动步骤。",
      input: "故障步骤",
      output: "红色测试 / 失败报告",
      possibleFaults: ["测试没有打到旧问题", "只测成功路径", "断言太宽"],
      evidenceSources: ["失败截图", "测试输出", "失败断言"],
    },
    {
      id: "c11-unit",
      label: "单元测试",
      description: "守住关键函数或模块的小范围行为。",
      input: "函数输入",
      output: "确定输出",
      possibleFaults: ["mock 太假", "没有边界用例", "只测实现细节"],
      evidenceSources: ["单测结果", "边界用例", "覆盖的函数"],
    },
    {
      id: "c11-integration",
      label: "集成测试",
      description: "验证多个模块交接后，业务链路真的能跑通。",
      input: "接口请求 / 用户动作",
      output: "数据库、响应或页面状态变化",
      possibleFaults: ["路由和数据层脱节", "测试数据污染", "只测内存状态"],
      evidenceSources: ["API 测试", "数据库查询", "Network 记录"],
    },
    {
      id: "c11-manual",
      label: "手动报告",
      description: "从真实入口走一遍，记录步骤、时间、结果和证据。",
      input: "人工操作路径",
      output: "test-results.json / 验收说明",
      possibleFaults: ["报告过期", "报告和源码不匹配", "步骤写不清"],
      evidenceSources: ["报告时间", "源码指纹", "手动步骤", "失败详情"],
    },
    {
      id: "c11-acceptance",
      label: "可信验收",
      description: "把自动化、手动报告和回归风险一起交付。",
      input: "测试结果 + 风险说明",
      output: "可审查的验收证据",
      possibleFaults: ["只说已修复", "没有反例测试", "没有说明未覆盖风险"],
      evidenceSources: ["测试命令", "报告文件", "回归风险清单", "面试复盘"],
    },
  ],
  edges: [
    { from: "c11-bug", to: "c11-repro", label: "写成可复现步骤" },
    { from: "c11-repro", to: "c11-unit", label: "守住关键函数" },
    { from: "c11-unit", to: "c11-integration", label: "验证模块交接" },
    { from: "c11-integration", to: "c11-manual", label: "走真实路径" },
    { from: "c11-manual", to: "c11-acceptance", label: "整理证据" },
  ],
};

export const case11Scenario: TeachingScenario = {
  scenarioId: "case-011-testing-proof",
  steps: [
    {
      id: "c11-map",
      mode: "teaching",
      title: "验收试炼场勘测",
      goal: "先看清一份可信验收证据从哪里来",
    },
    {
      id: "c11-concepts",
      mode: "teaching",
      title: "测试与验收小抄",
      goal: "复现用例、单元测试、集成测试和手动报告分别证明什么",
      concepts: case11Concepts,
    },
    ...case11CodeTour,
    {
      id: "c11-close",
      mode: "teaching",
      title: "验收试炼场结案报告",
      goal: "能写出可信验收证据，并说明哪些风险还没覆盖",
    },
  ],
  projectMap: case11Map,
};

export const frontendTestingProofScenario: TeachingScenario = {
  ...case11Scenario,
  scenarioId: "frontend-testing-proof",
  steps: case11Scenario.steps.map((step) => ({
    ...step,
    title:
      step.id === "c11-map"
        ? "前端回归试炼场勘测"
        : step.id === "c11-close"
          ? "前端交付结案报告"
          : step.title,
    goal:
      step.id === "c11-map"
        ? "先看清前端交互从失败复现到回归证据的完整路线"
        : step.id === "c11-close"
          ? "能说明前端修复覆盖了什么，还有哪些设备和路径需要继续复测"
          : step.goal,
  })),
};

// ============ 主线 1-12：Agent 任务怎么写 ============

const c12Context: ConceptCard = {
  id: "c12-context",
  label: "背景",
  analogy:
    "背景像把 Agent 带进案发现场。你不告诉它项目现在发生了什么，它只能凭空猜，猜出来的路线很容易跑偏。",
  example:
    "不要只写“修保存问题”。要写：用户点击保存后提示成功，但刷新后数据消失；Network 里 POST 是 201，数据库查询是 0 行。",
  prediction: {
    question: "给 Agent 写背景时，最应该包含什么？",
    options: [
      "只写一句“帮我优化一下”",
      "现象、相关页面/接口、已知证据和用户目标",
      "让 Agent 自己猜项目结构",
      "只贴一大段无说明代码",
    ],
    correctIndex: 1,
    explanation:
      "背景要让 Agent 站到同一个现场：发生了什么、影响谁、你已经看到哪些证据。",
  },
};

const c12Goal: ConceptCard = {
  id: "c12-goal",
  label: "目标",
  analogy:
    "目标像任务地图上的终点旗。没有终点，Agent 可能忙很久，但交付的不是你要的东西。",
  example:
    "目标不是“修好登录”。更清楚的写法是：刷新页面后仍能识别当前用户；登录过期时返回登录页并显示可理解提示。",
  prediction: {
    question: "好的目标应该长什么样？",
    options: [
      "越抽象越好",
      "可观察、可判断，并和用户结果有关",
      "只写技术名词",
      "不需要说完成后用户看到什么",
    ],
    correctIndex: 1,
    explanation: "目标要能被验收。别人看完要知道什么叫完成，什么还没完成。",
  },
};

const c12Constraints: ConceptCard = {
  id: "c12-constraints",
  label: "约束",
  analogy:
    "约束像工坊里的护栏：哪些文件能改、哪些安全边界不能碰、哪些风格必须保持一致。",
  example:
    "例如：不要读取真实项目源码；不要执行终端命令；只改 src/TeachingBridge.tsx 和相关测试；保持暗色 RPG 风格。",
  prediction: {
    question: "为什么任务要写约束？",
    options: [
      "为了限制 Agent 做无关重构或危险操作",
      "为了让任务看起来更长",
      "为了跳过验收",
      "为了隐藏真实目标",
    ],
    correctIndex: 0,
    explanation:
      "约束能保护边界：范围、风格、安全、数据、兼容性。它让 Agent 知道什么不能做。",
  },
};

const c12Acceptance: ConceptCard = {
  id: "c12-acceptance",
  label: "验收",
  analogy:
    "验收像工坊门口的通关铭牌：要交哪些证据，跑哪些测试，浏览器要走哪条路径。",
  example:
    "验收写成：npm run verify 通过；浏览器从首页进入第 12 章；390px 无横向溢出；页面能看到背景、目标、约束、验收、风险。",
  prediction: {
    question: "验收标准最重要的特点是什么？",
    options: [
      "听起来很努力",
      "可执行、可观察、可复核",
      "只有开发者自己懂",
      "越模糊越灵活",
    ],
    correctIndex: 1,
    explanation: "验收是判断交付是否可信的标准。它必须能被执行、观察和复核。",
  },
};

const c12Risk: ConceptCard = {
  id: "c12-risk",
  label: "风险",
  analogy:
    "风险像委托书背面的诅咒条款：这次改动可能影响哪里，失败时怎么回退，哪些东西还没验证。",
  example:
    "例如：改教学桥可能影响第 3-11 章入口；需要跑 App 主流程测试和浏览器移动端；未做真人学习效果验证。",
  prediction: {
    question: "为什么任务里要写风险？",
    options: [
      "为了让 Agent 更害怕",
      "为了提前暴露可能受影响的范围和回滚思路",
      "为了证明不需要测试",
      "为了把责任推给别人",
    ],
    correctIndex: 1,
    explanation:
      "风险不是唱衰，而是工程判断。它提醒 Agent 和审查者重点看哪里、失败时怎么退。",
  },
};

export const case12Concepts = [
  c12Context,
  c12Goal,
  c12Constraints,
  c12Acceptance,
  c12Risk,
];

export const case12CodeTour: TeachingStep[] = [
  {
    id: "c12-tour-bad-brief",
    mode: "teaching",
    title: "坏委托：一句话把 Agent 放进迷雾",
    goal: "只看这份委托缺少了哪些关键槽位",
    projectPosition: "用户想法 → 模糊任务 → Agent 猜测 → 返工",
    codeFocus: {
      filePath: "docs/agent-briefs/bad-brief.md",
      functionName: "badAgentBrief",
      input: "一句模糊请求",
      output: "不可验收的交付",
      ignore: ["措辞是否礼貌", "标题装饰", "无关灵感"],
      lines: [
        "帮我把这个项目优化一下，顺便修一下 bug。",
        "UI 好看一点，逻辑也好一点。",
        "你自己看着办。",
      ],
      observationGoal:
        "这份委托缺少背景、目标、范围、验收和风险。Agent 只能猜，猜错后你就会反复返工。",
    },
  },
  {
    id: "c12-tour-good-brief",
    mode: "teaching",
    title: "好委托：把工作交给 Agent 但保留工程边界",
    goal: "只看背景、目标、范围、验收、风险五段",
    projectPosition: "真实问题 → 清晰委托 → Agent 执行 → 证据验收",
    codeFocus: {
      filePath: "docs/agent-briefs/good-brief.md",
      functionName: "goodAgentBrief",
      input: "带证据的任务背景",
      output: "可执行、可验收的 Agent 任务",
      ignore: ["长篇课程解释", "无关重构建议", "个人真实项目源码"],
      lines: [
        "背景：第 11 章已能进入验收试炼场，但第 12 章仍是卷宗预览。",
        "目标：把第 12 章做成委托书工坊剧情关卡，训练背景、目标、约束、验收、风险。",
        "范围：新增教学数据、剧情场景、角色图、入口测试和项目记忆。",
        "验收：npm run verify 通过；浏览器桌面/390px 能从首页进入第 12 章。",
        "风险：不要破坏第 3-11 章共用入口；第 12 章独立沙盒、桌面和 390px 路径都要回归。",
      ],
      observationGoal:
        "好委托不是更啰嗦，而是把 Agent 需要判断的边界提前讲清，让交付可以被验证。",
    },
  },
];

export const case12Map: ProjectMap = {
  nodes: [
    {
      id: "c12-problem",
      label: "问题现场",
      description: "先说明发生了什么、影响谁、已有证据是什么。",
      input: "现象 + 证据",
      output: "Agent 能理解的背景",
      possibleFaults: ["只说感受", "缺少证据", "没有说明用户目标"],
      evidenceSources: ["截图", "Network", "日志", "测试结果", "用户反馈"],
    },
    {
      id: "c12-goal",
      label: "目标",
      description: "把想要的结果写成可观察、可判断的完成状态。",
      input: "业务目标",
      output: "完成定义",
      possibleFaults: ["目标太抽象", "混入多个方向", "用户结果不清"],
      evidenceSources: ["用户路径", "验收描述", "完成定义"],
    },
    {
      id: "c12-scope",
      label: "范围与约束",
      description:
        "告诉 Agent 可以改哪里、不能碰什么、要保持哪些风格和安全边界。",
      input: "文件范围 + 约束",
      output: "执行边界",
      possibleFaults: ["无关重构", "破坏旧流程", "越权读取或执行"],
      evidenceSources: ["改动文件清单", "安全规则", "设计规范"],
    },
    {
      id: "c12-acceptance",
      label: "验收",
      description: "写清要跑什么测试、走什么浏览器路径、看到什么结果。",
      input: "验收命令 + 用户路径",
      output: "可复核证据",
      possibleFaults: ["只说已完成", "没有负面路径", "没有移动端"],
      evidenceSources: ["npm run verify", "浏览器烟测", "截图", "测试报告"],
    },
    {
      id: "c12-risk",
      label: "风险与回滚",
      description: "说明可能影响哪里、哪些没做、失败时怎么退。",
      input: "风险清单",
      output: "审查重点和回滚思路",
      possibleFaults: ["隐瞒未覆盖范围", "无回滚策略", "过度承诺学习效果"],
      evidenceSources: ["已知边界", "diff 审计", "changelog", "HANDOFF"],
    },
  ],
  edges: [
    { from: "c12-problem", to: "c12-goal", label: "明确要什么结果" },
    { from: "c12-goal", to: "c12-scope", label: "限定怎么做" },
    { from: "c12-scope", to: "c12-acceptance", label: "写成可验证标准" },
    { from: "c12-acceptance", to: "c12-risk", label: "说明未覆盖和回滚" },
    { from: "c12-risk", to: "c12-problem", label: "必要时重新收窄任务" },
  ],
};

export const case12Scenario: TeachingScenario = {
  scenarioId: "case-012-agent-brief",
  steps: [
    {
      id: "c12-map",
      mode: "teaching",
      title: "委托书工坊勘测",
      goal: "先看清一份好 Agent 任务从问题现场到验收证据怎么流动",
    },
    {
      id: "c12-concepts",
      mode: "teaching",
      title: "Agent 委托五件套",
      goal: "背景、目标、约束、验收和风险分别解决什么问题",
      concepts: case12Concepts,
    },
    ...case12CodeTour,
    {
      id: "c12-close",
      mode: "teaching",
      title: "委托书工坊结案报告",
      goal: "能写一份让 Agent 可执行、可验收、可审查的任务",
    },
  ],
  projectMap: case12Map,
};

// ============ 主线 1-13：怎么审查交付 ============

const c13DeliveryNote: ConceptCard = {
  id: "c13-delivery-note",
  label: "交付说明",
  analogy:
    "交付说明像 Agent 递上来的结案陈词。陈词可以听，但不能直接当证据，必须和 Diff、测试和实际页面对上。",
  example:
    "Agent 写“已修复保存问题”，你要继续追：改了哪些文件？旧故障用例通过了吗？刷新后数据库能读到吗？",
  prediction: {
    question: "看 Agent 交付说明时，第一反应应该是什么？",
    options: [
      "它说完成就直接合并",
      "把说明和 Diff、测试、真实路径证据逐项对照",
      "只看语气是否自信",
      "只看改动文件数量多不多",
    ],
    correctIndex: 1,
    explanation:
      "交付说明只是入口。可信接收要看代码改动、测试证据、真实路径和风险说明是否一致。",
  },
};

const c13Diff: ConceptCard = {
  id: "c13-diff",
  label: "Diff",
  analogy:
    "Diff 像审判庭里的证物袋：它展示这次到底动了什么，不看证物就无法判断影响范围。",
  example:
    "如果任务只是改第 13 章入口，但 Diff 顺手改了数据库迁移，就要追问为什么。",
  prediction: {
    question: "审查 Diff 时最重要的是看什么？",
    options: [
      "代码颜色好不好看",
      "改动是否和任务目标一致，是否碰到风险区域",
      "文件越多越专业",
      "只看新增行数",
    ],
    correctIndex: 1,
    explanation:
      "Diff 审查关注目标一致性、影响范围、边界条件和是否有无关改动。",
  },
};

const c13RegressionRisk: ConceptCard = {
  id: "c13-regression-risk",
  label: "回归风险",
  analogy:
    "回归风险像旧机关被新齿轮带坏。你修了一个门，也可能让旁边的门打不开。",
  example:
    "改 TeachingBridge 接第 13 章时，可能影响第 3-12 章共用的剧情入口，所以要跑主流程测试和浏览器路径。",
  prediction: {
    question: "为什么审交付要看回归风险？",
    options: [
      "为了证明 Agent 不可信",
      "为了判断这次改动可能影响哪些旧功能，并决定要补哪些测试",
      "为了跳过代码审查",
      "为了让任务无限扩大",
    ],
    correctIndex: 1,
    explanation: "回归风险帮助你从“这次功能能用”扩展到“旧功能是否被破坏”。",
  },
};

const c13BoundaryCase: ConceptCard = {
  id: "c13-boundary-case",
  label: "边界条件",
  analogy:
    "边界条件像审判庭暗门：正常路径过了，不代表空值、权限不足、移动端、失败路径也过了。",
  example:
    "第 13 章桌面能进不够，还要看 390px 是否溢出、线索按钮是否可点、人物图是否加载。",
  prediction: {
    question: "下面哪个属于边界条件？",
    options: [
      "只看首页标题",
      "移动端 390px 无横向溢出，错误输入有提示",
      "交付说明写得很长",
      "截图颜色比较暗",
    ],
    correctIndex: 1,
    explanation:
      "边界条件是容易漏掉但真实用户会遇到的场景，例如移动端、空数据、权限不足和失败路径。",
  },
};

const c13Docs: ConceptCard = {
  id: "c13-docs",
  label: "文档同步",
  analogy:
    "文档像审判庭的档案索引。代码变了，索引不改，下一位接手的人就会走错房间。",
  example:
    "第 13 章完成后，docs/ai-career-rpg-tasks.md、HANDOFF、README 和 changelog 都要同步。",
  prediction: {
    question: "什么时候必须更新文档或交接？",
    options: [
      "用户可见功能、长期边界或后续任务状态发生变化时",
      "永远不用",
      "只有写了很多代码才需要",
      "只在发布到线上时",
    ],
    correctIndex: 0,
    explanation:
      "文档同步是项目记忆。用户可感知变化、长期边界和后续任务状态改变时都要更新。",
  },
};

export const case13Concepts = [
  c13DeliveryNote,
  c13Diff,
  c13RegressionRisk,
  c13BoundaryCase,
  c13Docs,
];

export const case13CodeTour: TeachingStep[] = [
  {
    id: "c13-tour-delivery-note",
    mode: "teaching",
    title: "交付说明：漂亮话不能直接入库",
    goal: "只看摘要、验证、风险三段有没有证据",
    projectPosition: "Agent 交付说明 → 证据核对 → 接收/拒收",
    codeFocus: {
      filePath: "docs/agent-deliveries/delivery-note.md",
      functionName: "deliveryNoteReview",
      input: "Agent 提交的完成说明",
      output: "可审查的摘要、验证和风险",
      ignore: ["礼貌寒暄", "无证据承诺", "泛泛夸赞"],
      lines: [
        "摘要：已接入第 13 章剧情入口。",
        "验证：npm run verify 通过；浏览器 1440px/390px 路径通过。",
        "风险：15 章共用教学桥和 Lab 外壳；需回归旧章节、390px、刷新恢复和当前源码对应的测试证据。",
      ],
      observationGoal:
        "交付说明要能被复核。只写“已完成”不够，要写验证命令、浏览器路径和仍未覆盖的风险。",
    },
  },
  {
    id: "c13-tour-diff",
    mode: "teaching",
    title: "Diff 审查：看改动是否真的对准任务",
    goal: "只看文件范围、关键逻辑和测试是否匹配目标",
    projectPosition: "任务目标 → Diff 文件 → 测试/文档 → 接收决定",
    codeFocus: {
      filePath: "git diff --stat",
      functionName: "diffReviewChecklist",
      input: "当前分支改动",
      output: "接收、要求补证据或拒收",
      ignore: ["自动格式化噪音", "无关统计炫耀", "没有解释的行数"],
      lines: [
        "src/teaching.ts            + 第 13 章教学数据",
        "src/TeachingBridge.tsx     + 第 13 章剧情场景和路线",
        "src/App.tsx                + 第 13 章入口",
        "src/App.test.tsx           + 第 13 章主流程测试",
        "docs/ai-career-rpg-tasks.md + R31 状态",
      ],
      observationGoal:
        "Diff 要和任务目标对应。新增关卡应同时有教学数据、入口、测试和项目记忆；如果多出无关数据库改动，就要追问。",
    },
  },
];

export const case13Map: ProjectMap = {
  nodes: [
    {
      id: "c13-delivery",
      label: "交付说明",
      description: "Agent 说明自己改了什么、怎么验证、还有什么风险。",
      input: "完成摘要",
      output: "待核对清单",
      possibleFaults: ["只说完成", "没有验证证据", "风险被省略"],
      evidenceSources: ["交付说明", "changelog", "HANDOFF"],
    },
    {
      id: "c13-diff",
      label: "Diff 证物",
      description: "检查改动文件、关键逻辑和任务目标是否一致。",
      input: "git diff / diff stat",
      output: "影响范围判断",
      possibleFaults: ["无关重构", "漏改消费方", "删除用户改动"],
      evidenceSources: ["git diff", "文件列表", "关键代码"],
    },
    {
      id: "c13-tests",
      label: "测试证据",
      description: "验证自动化测试、类型检查和构建是否覆盖关键路径。",
      input: "测试命令",
      output: "通过/失败结果",
      possibleFaults: ["只跑窄测试", "没有负面路径", "忽略失败输出"],
      evidenceSources: ["npm run verify", "App.test.tsx", "构建输出"],
    },
    {
      id: "c13-boundary",
      label: "边界条件",
      description: "检查移动端、空状态、权限、失败路径和旧章节回归风险。",
      input: "边界场景",
      output: "补测或风险说明",
      possibleFaults: ["只测桌面", "只测成功路径", "忽略旧章节"],
      evidenceSources: ["390px 浏览器烟测", "错误路径", "回归清单"],
    },
    {
      id: "c13-docs",
      label: "文档同步",
      description:
        "确认任务清单、README、HANDOFF 和 changelog 是否反映真实状态。",
      input: "代码变化",
      output: "项目记忆更新",
      possibleFaults: ["文档过期", "夸大已完成", "边界未记录"],
      evidenceSources: ["docs/ai-career-rpg-tasks.md", "README", "HANDOFF"],
    },
    {
      id: "c13-decision",
      label: "接收/拒收",
      description: "基于证据决定接收、要求补充或拒收交付。",
      input: "审查证据",
      output: "接收理由 / 拒收理由",
      possibleFaults: ["凭感觉接收", "拒收不具体", "缺少下一步要求"],
      evidenceSources: ["审查结论", "补充任务", "风险清单"],
    },
  ],
  edges: [
    { from: "c13-delivery", to: "c13-diff", label: "核对改了什么" },
    { from: "c13-delivery", to: "c13-tests", label: "核对是否验证" },
    { from: "c13-diff", to: "c13-boundary", label: "查改动边界" },
    { from: "c13-tests", to: "c13-boundary", label: "查漏边界" },
    { from: "c13-boundary", to: "c13-docs", label: "同步项目记忆" },
    { from: "c13-docs", to: "c13-decision", label: "形成审查结论" },
  ],
};

export const case13Scenario: TeachingScenario = {
  scenarioId: "case-013-delivery-review",
  steps: [
    {
      id: "c13-map",
      mode: "teaching",
      title: "交付审查庭勘测",
      goal: "先看清一次 Agent 交付要从哪些证据过审",
    },
    {
      id: "c13-concepts",
      mode: "teaching",
      title: "交付审查小抄",
      goal: "交付说明、Diff、回归风险、边界条件和文档同步分别证明什么",
      concepts: case13Concepts,
    },
    ...case13CodeTour,
    {
      id: "c13-close",
      mode: "teaching",
      title: "交付审查庭结案报告",
      goal: "能判断 Agent 是否真的完成，并写出接收或拒收理由",
    },
  ],
  projectMap: case13Map,
};

// ============ 主线 1-14：上线前检查什么 ============

const c14ReleasePlan: ConceptCard = {
  id: "c14-release-plan",
  label: "上线计划",
  analogy:
    "上线计划像打开城门前的巡夜路线：谁开门、什么时候开、开完看哪里、出事怎么关回去，都要提前写清。",
  example:
    "不能只写“今晚部署”。要写部署窗口、影响范围、验证路径、监控指标和回滚条件。",
  prediction: {
    question: "上线前为什么要写上线计划？",
    options: [
      "为了显得流程复杂",
      "为了提前明确步骤、验证、监控和失败时的退路",
      "为了跳过测试",
      "为了让所有人都不能改代码",
    ],
    correctIndex: 1,
    explanation:
      "上线计划把发布从“点一下部署”变成可执行、可观察、可回滚的工程动作。",
  },
};

const c14Environment: ConceptCard = {
  id: "c14-environment",
  label: "环境变量",
  analogy:
    "环境变量像城门钥匙串。开发环境、测试环境、生产环境拿的钥匙不一样，拿错就开错门。",
  example:
    "AI_API_KEY 在本地有，不代表线上也有；线上缺 key，功能可能构建成功但运行失败。",
  prediction: {
    question: "上线前检查环境变量是在检查什么？",
    options: [
      "代码缩进是否统一",
      "线上运行需要的密钥、URL、开关是否存在且不泄露",
      "按钮颜色是否好看",
      "只检查本地 .env",
    ],
    correctIndex: 1,
    explanation:
      "环境变量检查关注生产环境是否具备运行条件，同时不能把密钥放进前端或文档。",
  },
};

const c14Backup: ConceptCard = {
  id: "c14-backup",
  label: "数据备份",
  analogy: "数据备份像开城门前先抄一份档案。门开错了还能退，档案烧了就很难补。",
  example:
    "如果上线包含数据库迁移，必须知道迁移前有没有备份、备份在哪里、恢复要多久。",
  prediction: {
    question: "为什么上线前要关心数据备份？",
    options: [
      "因为所有上线都会删库",
      "因为数据变化一旦出错，回滚代码不一定能恢复用户数据",
      "因为备份可以替代测试",
      "因为备份只影响后端同学",
    ],
    correctIndex: 1,
    explanation:
      "代码回滚只能退代码，不能自动恢复已经写坏的数据。数据变更前必须有保护和恢复方案。",
  },
};

const c14Monitoring: ConceptCard = {
  id: "c14-monitoring",
  label: "监控",
  analogy:
    "监控像城墙哨塔。上线后不是关灯睡觉，而是看错误率、响应时间、日志和关键业务指标有没有异常。",
  example:
    "发布后 10 分钟内观察 500 错误、接口耗时、AI 调用失败率和用户保存成功率。",
  prediction: {
    question: "上线后第一时间应该看什么？",
    options: [
      "只看自己电脑页面能打开",
      "错误率、日志、接口耗时和关键业务路径是否异常",
      "只看聊天群有没有人夸",
      "马上继续开发下一个需求",
    ],
    correctIndex: 1,
    explanation:
      "上线后的监控能尽早发现事故。只看本机页面不能代表真实用户路径稳定。",
  },
};

const c14Rollback: ConceptCard = {
  id: "c14-rollback",
  label: "回滚",
  analogy:
    "回滚像城门的反向机关。它不是失败后才临时找，而是上线前就要知道怎么触发、触发后会影响什么。",
  example:
    "如果新版本导致登录 500，回滚条件可以是错误率超过阈值；回滚动作是恢复上一版本并关闭新开关。",
  prediction: {
    question: "好的回滚方案应该长什么样？",
    options: [
      "出事再看",
      "写清触发条件、回滚步骤、数据影响和回滚后验证",
      "只要有 git 就行",
      "让用户刷新试试",
    ],
    correctIndex: 1,
    explanation:
      "回滚方案要提前写清，尤其要说明代码回滚是否足以恢复数据和配置状态。",
  },
};

export const case14Concepts = [
  c14ReleasePlan,
  c14Environment,
  c14Backup,
  c14Monitoring,
  c14Rollback,
];

export const case14CodeTour: TeachingStep[] = [
  {
    id: "c14-tour-release-checklist",
    mode: "teaching",
    title: "上线清单：不是点部署，是逐项过门",
    goal: "只看发布前必须确认的步骤、证据和责任人",
    projectPosition: "交付通过 → 上线清单 → 发布窗口",
    codeFocus: {
      filePath: "docs/release-checklist.md",
      functionName: "releaseGateChecklist",
      input: "已审查通过的交付",
      output: "可以上线 / 暂缓上线",
      ignore: ["口头承诺", "没有证据的已检查", "临时补的模糊项"],
      lines: [
        "计划：发布窗口、影响范围、负责人、验证路径。",
        "配置：生产 API URL、AI_API_KEY、功能开关均已确认。",
        "数据：迁移前备份完成，恢复步骤已演练或记录。",
        "监控：错误率、接口耗时、关键业务指标已有人值守。",
        "回滚：触发条件、回滚命令、回滚后验证路径已写清。",
      ],
      observationGoal:
        "上线清单要能决定是否放行。每一项都要有可观察证据，而不是写“已确认”。",
    },
  },
  {
    id: "c14-tour-env-and-rollback",
    mode: "teaching",
    title: "配置与回滚：线上不是你的本地电脑",
    goal: "只看环境变量、功能开关和回滚条件如何保护上线",
    projectPosition: "生产环境 → 配置校验 → 监控异常 → 回滚",
    codeFocus: {
      filePath: "release/production-readiness.md",
      functionName: "productionReadiness",
      input: "生产配置和发布版本",
      output: "稳定运行或安全回退",
      ignore: ["真实密钥值", "无关部署平台细节", "未授权线上操作"],
      lines: [
        "requiredEnv: ['DATABASE_URL', 'AI_API_KEY', 'APP_ORIGIN']",
        "featureFlag: aiCareerRpgRoute = 'gradual-rollout'",
        "rollbackWhen: errorRate > 2% 或保存成功率明显下降",
        "rollbackVerify: 旧版本恢复后，登录、保存、AI 调用主路径通过",
      ],
      observationGoal:
        "上线前要知道线上依赖什么配置、如何灰度、何时回滚，以及回滚后怎么证明系统恢复。",
    },
  },
];

export const case14Map: ProjectMap = {
  nodes: [
    {
      id: "c14-plan",
      label: "上线计划",
      description: "明确发布窗口、影响范围、负责人和验证路径。",
      input: "已通过审查的交付",
      output: "发布行动表",
      possibleFaults: ["没有负责人", "没有验证路径", "发布窗口不清"],
      evidenceSources: ["release checklist", "任务单", "交付说明"],
    },
    {
      id: "c14-config",
      label: "配置与环境变量",
      description: "确认生产环境需要的密钥、URL、开关和权限都存在且安全。",
      input: "生产环境配置",
      output: "可运行配置",
      possibleFaults: ["线上缺 key", "前端暴露密钥", "测试 URL 指向生产"],
      evidenceSources: ["env checklist", "构建日志", "运行日志"],
    },
    {
      id: "c14-data",
      label: "数据备份",
      description: "确认数据库迁移、备份和恢复路径，保护用户数据。",
      input: "数据变更计划",
      output: "备份和恢复说明",
      possibleFaults: ["无备份", "备份不可恢复", "迁移不可逆"],
      evidenceSources: ["备份记录", "迁移计划", "恢复演练说明"],
    },
    {
      id: "c14-monitoring",
      label: "监控哨塔",
      description: "上线后观察错误率、耗时、日志和关键业务指标。",
      input: "线上流量",
      output: "健康/异常信号",
      possibleFaults: ["没人值守", "没有指标", "只看首页能打开"],
      evidenceSources: ["错误日志", "接口耗时", "业务成功率"],
    },
    {
      id: "c14-rollback",
      label: "回滚机关",
      description: "预先写清触发条件、回滚步骤和回滚后验证。",
      input: "异常信号",
      output: "恢复到稳定版本",
      possibleFaults: ["触发条件不清", "回滚影响数据", "回滚后未复测"],
      evidenceSources: ["回滚方案", "上一版本", "复测报告"],
    },
    {
      id: "c14-decision",
      label: "上线决定",
      description: "基于清单决定放行、灰度、暂缓或回滚。",
      input: "上线证据",
      output: "放行/暂缓/回滚结论",
      possibleFaults: ["凭感觉上线", "异常不处理", "风险未告知"],
      evidenceSources: ["上线记录", "监控结果", "复盘"],
    },
  ],
  edges: [
    { from: "c14-plan", to: "c14-config", label: "核对运行条件" },
    { from: "c14-config", to: "c14-data", label: "保护数据" },
    { from: "c14-data", to: "c14-monitoring", label: "上线后观察" },
    { from: "c14-monitoring", to: "c14-rollback", label: "异常则回退" },
    { from: "c14-rollback", to: "c14-decision", label: "形成上线结论" },
  ],
};

export const case14Scenario: TeachingScenario = {
  scenarioId: "case-014-release-readiness",
  steps: [
    {
      id: "c14-map",
      mode: "teaching",
      title: "上线前夜巡查",
      goal: "先看清上线前要检查哪些门、哪些证据、哪些退路",
    },
    {
      id: "c14-concepts",
      mode: "teaching",
      title: "上线检查小抄",
      goal: "上线计划、环境变量、数据备份、监控和回滚分别保护什么",
      concepts: case14Concepts,
    },
    ...case14CodeTour,
    {
      id: "c14-close",
      mode: "teaching",
      title: "上线前夜结案报告",
      goal: "能说出上线检查清单，并解释失败后怎么发现、怎么回滚",
    },
  ],
  projectMap: case14Map,
};

export const javaReleaseHarborScenario: TeachingScenario = {
  scenarioId: "java-release-harbor",
  projectMap: case14Map,
  steps: case14Scenario.steps.map((step) => {
    const titles: Record<string, string> = {
      "c14-map": "上线港地图",
      "c14-concepts": "配置、健康检查与回滚小抄",
      "c14-code-tour": "关键代码：谁可以拦住坏版本",
      "c14-evidence": "证据连接：部署成功不等于可上线",
      "c14-close": "上线门禁结案报告",
    };
    return {
      ...step,
      title: titles[step.id] ?? step.title,
      goal:
        step.id === "c14-map"
          ? "先看清版本、配置、健康检查、监控和回滚如何接力。"
          : step.id === "c14-concepts"
            ? "理解环境变量、健康检查、监控和回滚分别守什么风险。"
            : step.goal,
      ...(step.id === "c14-code-tour"
        ? {
            codeFocus: {
              ...step.codeFocus!,
              filePath: "server/ReleaseGate.java",
              functionName: "check",
              lines: [
                "public ReleaseDecision check(Environment env, Backup backup) {",
                '  if (!env.hasRequiredSecrets()) return block("missing secret");',
                '  if (!backup.isRestorable()) return block("backup not restorable");',
                '  if (!env.healthCheckPasses()) return block("health check failed");',
                "  return ReleaseDecision.ready();",
                "}",
              ],
              observationGoal:
                "上线门禁必须在部署前阻断缺密钥、不可恢复备份和健康检查失败。",
            },
          }
        : {}),
    };
  }),
};

export const javaProductionIncidentScenario: TeachingScenario = {
  scenarioId: "java-production-incident",
  projectMap: case14Map,
  steps: case14Scenario.steps.map((step) => {
    const titles: Record<string, string> = {
      "c14-map": "线上故障地图",
      "c14-concepts": "日志、指标与回滚小抄",
      "c14-code-tour": "关键代码：谁先发现故障",
      "c14-evidence": "证据时间线：从报警到止血",
      "c14-close": "线上事故结案报告",
    };
    return {
      ...step,
      title: titles[step.id] ?? step.title,
      goal:
        step.id === "c14-map"
          ? "先画出报警、请求、日志、指标、回滚和复测怎样接力。"
          : step.id === "c14-concepts"
            ? "理解日志告诉你发生了什么、指标告诉你影响多大、回滚保护什么。"
            : step.goal,
      ...(step.id === "c14-code-tour"
        ? {
            codeFocus: {
              ...step.codeFocus!,
              filePath: "server/IncidentTimeline.java",
              functionName: "decide",
              lines: [
                "public IncidentDecision decide(Signals signals, Release previous) {",
                '  if (signals.errorRate() > 0.05) return rollback("error rate");',
                '  if (signals.latencyP95() > 800) return hold("latency");',
                "  return observe(previous);",
                "}",
              ],
              observationGoal:
                "事故处理不是看到红灯就重启，而是把错误率、延迟和稳定版本交给明确的决定函数。",
            },
          }
        : {}),
    };
  }),
};

export const frontendAccessibilityProofScenario: TeachingScenario = {
  scenarioId: "frontend-accessibility-proof",
  projectMap: case14Map,
  steps: case14Scenario.steps.map((step) => {
    const titles: Record<string, string> = {
      "c14-map": "无障碍交付庭地图",
      "c14-concepts": "语义、焦点与响应式小抄",
      "c14-close": "前端交付结案报告",
    };
    return {
      ...step,
      title: titles[step.id] ?? step.title,
      goal:
        step.id === "c14-map"
          ? "先看清语义结构、键盘焦点、移动端和回归如何组成一份交付。"
          : step.id === "c14-concepts"
            ? "理解语义 HTML、ARIA、对比度、响应式和回归证据分别保护谁。"
            : step.goal,
    };
  }),
};

// ============ 主线 1-15：面试怎么讲项目 ============

const c15Star: ConceptCard = {
  id: "c15-star",
  label: "STAR",
  analogy:
    "STAR 像答辩厅的四盏灯：背景照亮现场，任务照亮目标，行动照亮你做了什么，结果照亮证据。",
  example:
    "不要只说“我做了一个 AI 项目”。要说当时遇到保存丢失、接口报错或 AI 幻觉，你负责定位证据、设计修复和验证结果。",
  prediction: {
    question: "STAR 里最容易被初学者漏掉的是哪一部分？",
    options: [
      "只讲 Situation 背景",
      "讲 Action 和 Result 时没有证据",
      "把项目名字说得很长",
      "把所有技术名词堆上去",
    ],
    correctIndex: 1,
    explanation:
      "面试官想知道你做了什么、怎么证明有效。行动和结果必须带证据，否则只是故事。",
  },
};

const c15IncidentReview: ConceptCard = {
  id: "c15-incident-review",
  label: "故障复盘",
  analogy:
    "故障复盘像把事故卷宗重新装订：现象、证据、根因、修复、验证和防复发要能一页接一页。",
  example:
    "保存提示成功但刷新后没了：POST 201 只是接口回执，SELECT 0 rows 证明没落库，修复后用刷新和测试验证。",
  prediction: {
    question: "讲故障复盘时，哪个表达更专业？",
    options: [
      "这个 bug 很玄学，后来好了",
      "我沿 Network、后端和数据库证据定位到数据层没有持久化，并用刷新和测试验证",
      "我让 AI 帮我修了",
      "我改了很多文件",
    ],
    correctIndex: 1,
    explanation:
      "专业复盘要讲证据链和验证闭环，而不是只讲情绪、工具或改动数量。",
  },
};

const c15Tradeoff: ConceptCard = {
  id: "c15-tradeoff",
  label: "技术取舍",
  analogy:
    "技术取舍像在议会桌上放两枚印章：一个解决当前问题，一个带来新成本。你要能说明为什么选它。",
  example:
    "AI API 必须走服务端转发，因为密钥不能进前端；代价是多一层接口和错误处理，但安全边界更清楚。",
  prediction: {
    question: "面试官追问“为什么这样做”时，你应该回答什么？",
    options: [
      "因为教程这么写",
      "说明候选方案、选择理由、代价和验证方式",
      "因为看起来高级",
      "因为 Agent 建议了",
    ],
    correctIndex: 1,
    explanation: "技术取舍不是背结论，而是说明约束、方案、代价和验证。",
  },
};

const c15GrowthEvidence: ConceptCard = {
  id: "c15-growth-evidence",
  label: "成长证据",
  analogy:
    "成长证据像角色升级的徽章。等级不是自己喊出来的，而是每一关留下的可复核产出。",
  example:
    "第 11 章能写验收证据，第 12 章能写 Agent 任务，第 13 章能审交付，第 14 章能说上线退路。",
  prediction: {
    question: "什么才算成长证据？",
    options: [
      "我感觉自己变强了",
      "能展示具体产出、解释流程，并用测试/日志/截图/复盘证明",
      "我看过很多页面",
      "我背了很多名词",
    ],
    correctIndex: 1,
    explanation: "成长证据要能被别人看见和追问：产出、解释和验收缺一不可。",
  },
};

const c15FollowUp: ConceptCard = {
  id: "c15-follow-up",
  label: "追问",
  analogy:
    "追问像答辩厅的第二道门。第一答说得漂亮不够，第二问还能站住，才说明你真的理解。",
  example:
    "你说用了 RAG，面试官可能追问 chunk 怎么切、topK 怎么看、引用错了怎么办。",
  prediction: {
    question: "为什么要准备追问？",
    options: [
      "为了背更多话术",
      "为了检查自己的回答是否真的来自证据和理解",
      "为了避免说项目",
      "为了把面试官绕晕",
    ],
    correctIndex: 1,
    explanation: "追问能暴露你是背答案还是理解工程边界。好的回答要能被追问。",
  },
};

export const case15Concepts = [
  c15Star,
  c15IncidentReview,
  c15Tradeoff,
  c15GrowthEvidence,
  c15FollowUp,
];

export const case15CodeTour: TeachingStep[] = [
  {
    id: "c15-tour-story-bank",
    mode: "teaching",
    title: "素材库：把关卡产出变成面试证据",
    goal: "只看每一关能拿来证明什么能力",
    projectPosition: "关卡产出 → 能力标签 → 面试素材",
    codeFocus: {
      filePath: "career/story-bank.md",
      functionName: "buildInterviewStoryBank",
      input: "每章通关产出、证据和复盘",
      output: "可追问的项目素材库",
      ignore: ["空泛自夸", "没有证据的熟悉", "只列技术名词"],
      lines: [
        "保存丢失：Network 201 + SELECT 0 rows + 持久化修复。",
        "AI API：密钥只在服务端，流式返回，失败有兜底。",
        "RAG：source、chunk、embedding、topK、citations 可追溯。",
        "Agent 协作：任务写清背景/目标/约束/验收/风险。",
        "上线检查：环境变量、备份、监控、回滚和冒烟测试。",
      ],
      observationGoal:
        "面试素材不是把章节标题背一遍，而是把每一章对应到可展示、可解释、可验收的证据。",
    },
  },
  {
    id: "c15-tour-answer-script",
    mode: "teaching",
    title: "答辩稿：一段回答要能扛住追问",
    goal: "只看 STAR、取舍、证据和追问准备是否完整",
    projectPosition: "素材库 → STAR 回答 → 追问演练",
    codeFocus: {
      filePath: "career/interview-answer.md",
      functionName: "composeInterviewAnswer",
      input: "一个项目经历和证据链",
      output: "可复用的面试回答",
      ignore: ["背诵模板", "夸大掌握", "无法验证的结果"],
      lines: [
        "S：用户保存提示成功，但刷新后记录消失。",
        "T：我要定位数据链路断点，并给出可验证修复。",
        "A：沿前端 response.ok、接口 201、数据层和 SQLite SELECT 逐层排查。",
        "R：确认根因是只写内存未落库；修复后用刷新、数据库和测试验证。",
        "Follow-up：为什么 201 不能证明落库？如果并发重复提交怎么办？",
      ],
      observationGoal:
        "一段好回答要能被追问。它必须讲清背景、行动、结果、证据边界和可迁移经验。",
    },
  },
];

export const case15Map: ProjectMap = {
  nodes: [
    {
      id: "c15-evidence",
      label: "关卡证据",
      description: "收集前 14 章留下的代码、测试、日志、路线和复盘产出。",
      input: "通关记录",
      output: "素材候选",
      possibleFaults: ["只有感受", "没有证据", "素材和岗位无关"],
      evidenceSources: ["成长档案", "测试报告", "浏览器路径", "章节复盘"],
    },
    {
      id: "c15-star",
      label: "STAR 结构",
      description: "把素材整理成背景、任务、行动和结果。",
      input: "素材候选",
      output: "第一版回答",
      possibleFaults: ["背景太长", "行动缺自己", "结果没指标"],
      evidenceSources: ["STAR 草稿", "项目证据", "用户影响"],
    },
    {
      id: "c15-incident",
      label: "故障复盘",
      description: "把排障类经历讲成现象、证据、根因、修复和验证。",
      input: "bug/事故素材",
      output: "排障回答",
      possibleFaults: ["只说修好了", "根因不清", "没验证"],
      evidenceSources: ["Network", "日志", "数据库", "测试"],
    },
    {
      id: "c15-tradeoff",
      label: "技术取舍",
      description: "说明为什么选这个方案、放弃什么、代价是什么。",
      input: "方案选择",
      output: "取舍解释",
      possibleFaults: ["只说用了某技术", "没代价", "没约束"],
      evidenceSources: ["约束", "方案对比", "风险说明"],
    },
    {
      id: "c15-follow-up",
      label: "追问演练",
      description: "让 Agent 或自己追问证据边界，检查回答是否站得住。",
      input: "第一版回答",
      output: "可追问回答",
      possibleFaults: ["背模板", "被问细节就空", "夸大掌握"],
      evidenceSources: ["追问清单", "补充证据", "修订回答"],
    },
    {
      id: "c15-answer",
      label: "面试回答",
      description: "形成能复用、能追问、能体现成长的项目回答。",
      input: "修订回答",
      output: "面试素材",
      possibleFaults: ["太泛", "太长", "没有岗位相关性"],
      evidenceSources: ["最终回答", "成长证据", "岗位匹配点"],
    },
  ],
  edges: [
    { from: "c15-evidence", to: "c15-star", label: "整理成结构" },
    { from: "c15-star", to: "c15-incident", label: "补排障链路" },
    { from: "c15-incident", to: "c15-tradeoff", label: "解释选择" },
    { from: "c15-tradeoff", to: "c15-follow-up", label: "准备追问" },
    { from: "c15-follow-up", to: "c15-answer", label: "定稿回答" },
  ],
};

export const case15Scenario: TeachingScenario = {
  scenarioId: "case-015-interview-review",
  steps: [
    {
      id: "c15-map",
      mode: "teaching",
      title: "终章答辩厅勘测",
      goal: "先看清项目经历如何从证据变成面试回答",
    },
    {
      id: "c15-concepts",
      mode: "teaching",
      title: "面试复盘小抄",
      goal: "STAR、故障复盘、技术取舍、成长证据和追问分别解决什么",
      concepts: case15Concepts,
    },
    ...case15CodeTour,
    {
      id: "c15-close",
      mode: "teaching",
      title: "终章答辩厅结案报告",
      goal: "能把每关产出整理成可追问的面试回答",
    },
  ],
  projectMap: case15Map,
};

const javaLayeredProjectMap: ProjectMap = {
  nodes: [
    {
      id: "java-request",
      label: "HTTP 请求",
      description: "客户端带着 userId 和 viewerId 请求用户资料。",
      input: "GET /api/users/:id",
      output: "进入 Controller",
      possibleFaults: ["参数缺失", "身份上下文丢失"],
      evidenceSources: ["Network 请求", "请求日志"],
    },
    {
      id: "java-controller",
      label: "Controller",
      description: "接收请求、调用业务层并把结果转换成响应。",
      input: "路径参数和身份信息",
      output: "交给 UserService",
      possibleFaults: ["直接访问 Repository", "把业务规则写在入口"],
      evidenceSources: ["UserController.java", "调用日志"],
    },
    {
      id: "java-service",
      label: "Service",
      description: "执行权限和业务规则，不负责 HTTP 细节。",
      input: "userId + viewerId",
      output: "通过校验后的 User",
      possibleFaults: ["权限校验缺失", "规则分散在多个入口"],
      evidenceSources: ["UserService.java", "失败请求日志"],
    },
    {
      id: "java-repository",
      label: "Repository",
      description: "只负责把查询翻译成数据库访问。",
      input: "userId",
      output: "数据库记录",
      possibleFaults: ["拼接错误条件", "承担业务判断"],
      evidenceSources: ["UserRepository.java", "SQL 查询"],
    },
    {
      id: "java-database",
      label: "数据库",
      description: "保存 users 表中的真实记录。",
      input: "SELECT users",
      output: "一行 User",
      possibleFaults: ["记录不存在", "查询条件错误"],
      evidenceSources: ["schema.sql", "database-query.txt"],
    },
  ],
  edges: [
    { from: "java-request", to: "java-controller", label: "路由分发" },
    { from: "java-controller", to: "java-service", label: "调用业务层" },
    { from: "java-service", to: "java-repository", label: "查询数据" },
    { from: "java-repository", to: "java-database", label: "SELECT" },
  ],
};

export const javaLayeredScenario: TeachingScenario = {
  scenarioId: "java-layered-request",
  projectMap: javaLayeredProjectMap,
  steps: [
    {
      id: "java-map",
      mode: "teaching",
      title: "服务塔地图",
      goal: "先看清一次 Java 请求经过哪些层，不急着背类名。",
      concepts: [],
    },
    {
      id: "java-layer-terms",
      mode: "teaching",
      title: "四个名词先站好位置",
      goal: "用简单比喻理解 Controller、Service、Repository 和 DTO。",
      concepts: [
        {
          id: "java-controller-term",
          label: "Controller",
          analogy: "像服务塔的前台：接待请求，但不替业务规则做决定。",
          example: "它接收 userId，调用 UserService，再把 User 转成响应。",
          prediction: {
            question: "权限判断应该放在哪里？",
            options: ["Controller", "Service", "数据库表名", "浏览器按钮"],
            correctIndex: 1,
            explanation: "Service 负责业务规则，多个入口才能复用同一条规则。",
          },
        },
        {
          id: "java-service-term",
          label: "Service",
          analogy: "像值班主管：根据业务规则判断请求能不能继续。",
          example: "viewerId 不是本人时，Service 拒绝读取资料。",
          prediction: {
            question: "Service 最重要的职责是什么？",
            options: ["画页面", "执行业务判断", "直接返回 HTTP 状态码", "建表"],
            correctIndex: 1,
            explanation: "业务规则集中在 Service，入口层只负责接待和转换。",
          },
        },
      ],
    },
    {
      id: "java-code-tour",
      mode: "teaching",
      title: "关键代码：谁绕过了谁",
      goal: "只读 Controller 的调用行，找到越层访问的证据。",
      projectPosition:
        "HTTP 请求 → [Controller] → Service → Repository → 数据库",
      codeFocus: {
        filePath: "server/UserController.java",
        functionName: "getUser",
        input: "userId 与 viewerId",
        output: "UserResponse",
        ignore: ["package 声明", "构造函数样板", "DTO 字段细节"],
        lines: [
          "public UserResponse getUser(String userId) {",
          "  User user = userRepository.findById(userId);",
          "  return UserResponse.from(user);",
          "}",
        ],
        observationGoal:
          "Controller 直接调用 Repository，UserService 的权限判断没有机会执行。",
      },
      check: {
        prompt: "用自己的话说明：Controller 直接查 Repository 会漏掉什么？",
        correctAnswer: "会绕过 Service 的业务和权限规则",
        acceptableAnswers: [
          "绕过业务层",
          "权限校验不执行",
          "Controller 越层访问 Repository",
        ],
      },
    },
    {
      id: "java-evidence-connect",
      mode: "teaching",
      title: "证据连接：200 不等于规则执行",
      goal: "把 Network、日志和数据库查询放到同一条证据链上。",
      concepts: [],
    },
    {
      id: "java-coaching",
      mode: "coaching",
      title: "沙盒修复：让三层重新接上",
      goal: "在减少提示的情况下修复 Controller 的调用边界，并运行手动测试。",
    },
  ],
};

const frontendComponentStateProjectMap: ProjectMap = {
  nodes: [
    {
      id: "frontend-click",
      label: "用户点击",
      description: "用户点击加载资料，触发组件事件处理函数。",
      input: "click 事件",
      output: "调用 loadProfile",
      possibleFaults: ["重复点击", "没有进入 loading"],
      evidenceSources: ["交互记录", "组件代码"],
    },
    {
      id: "frontend-state",
      label: "状态所有者",
      description: "组件保存请求状态，并决定页面现在应该显示什么。",
      input: "idle / loading / success / error",
      output: "触发重新渲染",
      possibleFaults: ["提前显示成功", "多个状态来源互相覆盖"],
      evidenceSources: ["ProfilePanel.jsx", "浏览器日志"],
    },
    {
      id: "frontend-request",
      label: "请求结果",
      description: "异步请求返回成功或失败，决定状态能否继续前进。",
      input: "GET /api/profile/me",
      output: "response.ok + data/error",
      possibleFaults: ["忽略 503", "错误没有进入界面"],
      evidenceSources: ["Network 记录", "错误响应"],
    },
    {
      id: "frontend-render",
      label: "可见反馈",
      description: "组件根据状态渲染按钮、加载提示、资料或错误。",
      input: "状态变化",
      output: "用户看到下一步",
      possibleFaults: ["成功/失败文案冲突", "没有 aria-live"],
      evidenceSources: ["交互测试", "页面截图"],
    },
  ],
  edges: [
    { from: "frontend-click", to: "frontend-state", label: "事件交给状态" },
    { from: "frontend-state", to: "frontend-request", label: "发起请求" },
    { from: "frontend-request", to: "frontend-state", label: "结果更新状态" },
    { from: "frontend-state", to: "frontend-render", label: "重新渲染" },
  ],
};

export const frontendComponentStateScenario: TeachingScenario = {
  scenarioId: "frontend-component-state",
  projectMap: frontendComponentStateProjectMap,
  steps: [
    {
      id: "frontend-map",
      mode: "teaching",
      title: "组件剧场地图",
      goal: "先看清一次点击如何变成状态变化和可见反馈。",
    },
    {
      id: "frontend-state-terms",
      mode: "teaching",
      title: "四个前端名词先站好位置",
      goal: "用简单比喻理解组件、props、state 和重新渲染。",
      concepts: [
        {
          id: "frontend-component-term",
          label: "组件",
          analogy:
            "像剧场里的一个演员：接收输入，保存必要状态，决定自己演什么。",
          example:
            "ProfilePanel 接收 loadProfile 函数，自己管理请求状态并展示资料。",
          prediction: {
            question: "组件最适合负责什么？",
            options: [
              "接收输入并渲染自己的界面",
              "直接修改数据库",
              "替后端决定权限",
              "运行部署命令",
            ],
            correctIndex: 0,
            explanation:
              "组件负责界面和交互边界，数据与权限仍要通过明确的接口协作。",
          },
        },
        {
          id: "frontend-state-term",
          label: "state",
          analogy: "像剧场的灯光台：状态变了，观众看到的舞台也要跟着变。",
          example: "loading、success、error 描述同一次请求当前走到哪一步。",
          prediction: {
            question: "什么时候应该显示 success？",
            options: [
              "用户刚点击时",
              "收到 response.ok 后",
              "组件第一次渲染时",
              "请求还没发出时",
            ],
            correctIndex: 1,
            explanation: "success 是请求结果，不应该在请求还没返回时提前宣布。",
          },
        },
      ],
    },
    {
      id: "frontend-code-tour",
      mode: "teaching",
      title: "关键代码：成功为什么提前亮灯",
      goal: "只看事件处理和状态更新的几行，找到状态与请求结果脱节的证据。",
      projectPosition:
        "用户点击 → 状态所有者 → GET 请求 → response.ok → 重新渲染",
      codeFocus: {
        filePath: "frontend/ProfilePanel.jsx",
        functionName: "load",
        input: "click 事件",
        output: "status + profile",
        ignore: ["import", "section 外壳", "CSS 细节"],
        lines: [
          "async function load() {",
          '  setStatus("success");',
          "  const response = await loadProfile();",
          "  if (response.ok) setProfile(response.data);",
          "}",
        ],
        observationGoal:
          "success 在 await 请求前就被写入，失败响应没有进入用户可见状态。",
      },
      check: {
        prompt: "为什么不能在 await loadProfile() 前设置 success？",
        correctAnswer:
          "因为请求还没有返回，无法证明成功；失败时用户会看到错误的成功提示",
        acceptableAnswers: [
          "请求未完成",
          "response.ok 还没判断",
          "失败时显示错误成功",
        ],
      },
    },
    {
      id: "frontend-evidence-connect",
      mode: "teaching",
      title: "证据连接：Network 到页面反馈",
      goal: "把点击、Network 状态码、浏览器日志和页面文案放到同一条链路。",
    },
    {
      id: "frontend-coaching",
      mode: "coaching",
      title: "沙盒修复：让状态和结果重新对齐",
      goal: "在减少提示的情况下修复状态流，并用成功/失败两条路径运行测试。",
    },
  ],
};

/** 前端岗位第 2 关：把接口结果翻译成用户能看懂的状态。 */
export const frontendRequestStatesScenario: TeachingScenario = {
  scenarioId: "frontend-request-states",
  projectMap: {
    nodes: [
      {
        id: "submit-event",
        label: "提交动作",
        description: "用户点击提交，组件只知道请求开始了，还不知道结果。",
        input: "点击事件与表单数据",
        output: "进入 loading",
        possibleFaults: ["提前显示成功", "重复点击"],
        evidenceSources: ["交互记录", "SubmitPanel.jsx"],
      },
      {
        id: "request-response",
        label: "请求结果",
        description: "服务端返回 201、400、503 或超时，组件要据此选择下一步。",
        input: "POST /api/applications",
        output: "response.ok 与错误体",
        possibleFaults: ["只测 201", "忽略错误体"],
        evidenceSources: ["Network 记录", "浏览器日志"],
      },
      {
        id: "visible-feedback",
        label: "可见反馈",
        description: "页面告诉用户正在提交、已经成功、失败原因和是否可以重试。",
        input: "loading / success / error",
        output: "按钮、提示和下一步",
        possibleFaults: ["失败不可见", "按钮重复提交"],
        evidenceSources: ["页面交互", "aria-live"],
      },
    ],
    edges: [
      { from: "submit-event", to: "request-response", label: "发起请求" },
      {
        from: "request-response",
        to: "visible-feedback",
        label: "结果更新状态",
      },
    ],
  },
  steps: frontendComponentStateScenario.steps.map((step) => {
    const copy: Record<string, { title: string; goal: string }> = {
      "frontend-map": {
        title: "表单传送厅地图",
        goal: "先看清提交动作、请求结果和用户反馈如何接力。",
      },
      "frontend-state-terms": {
        title: "四个状态先站好位置",
        goal: "理解 idle、loading、success、error，不把点击误认为成功。",
      },
      "frontend-code-tour": {
        title: "关键代码：成功为什么提前亮灯",
        goal: "只读提交函数的几行，找到请求结果与页面状态脱节的证据。",
      },
      "frontend-evidence-connect": {
        title: "证据连接：201、503 和超时",
        goal: "把 Network、浏览器日志和用户看到的文案放到同一条证据链。",
      },
      "frontend-coaching": {
        title: "沙盒修复：让每个结果都有下一步",
        goal: "修复状态机，覆盖成功、失败、超时和重复提交。",
      },
    };
    const next = copy[step.id];
    if (!next) return step;
    if (step.id !== "frontend-code-tour") {
      return { ...step, ...next };
    }
    return {
      ...step,
      ...next,
      projectPosition:
        "用户点击 → loading → POST 请求 → response.ok → 成功/失败反馈",
      codeFocus: {
        ...step.codeFocus!,
        filePath: "frontend/SubmitPanel.jsx",
        functionName: "handleSubmit",
        lines: [
          "async function handleSubmit() {",
          '  setStatus("success");',
          "  const response = await submit();",
          "  if (response.ok) return;",
          "}",
        ],
        observationGoal:
          "success 在 await 请求前就被写入，400、503 和超时都没有进入可见的失败状态。",
        check: {
          prompt: "为什么点击后不能马上设置 success？",
          correctAnswer:
            "点击只代表请求开始；只有 response.ok 为真，才有证据说明提交成功",
          acceptableAnswers: [
            "请求还没完成",
            "response.ok 还没判断",
            "失败时会显示错误的成功提示",
          ],
        },
      },
    };
  }),
};
