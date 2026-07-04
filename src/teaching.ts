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

/** 补课路径 */
export type RemediationPath = {
  trigger: "term" | "syntax" | "project-position" | "causality";
  label: string;
  microLesson: string;
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
  { label: string; microLesson: string }
> = {
  term: {
    label: "不懂专业术语",
    microLesson:
      "**HTTP 201**：表示服务器收到了请求并成功创建了资源。它是状态码，不是数据库操作的证明。\n\n**内存数组**：程序运行时在 RAM 中存放数据的变量。关进程后消失。\n\n**SQLite**：一种文件型数据库，数据写入文件后即使程序重启也不会丢。\n\n**数据访问层**：负责把数据从内存搬到数据库（或反向）的代码层。",
  },
  syntax: {
    label: "看代码语法有困难",
    microLesson:
      "**fetch()**：浏览器发 HTTP 请求的方法。返回 Promise，所以前面有 await。\n\n**response.ok**：如果 HTTP 状态码是 200-299 则为 true。\n\n**push()**：把元素加到数组末尾。\n\n**db.run()**：执行 SQL 语句。\n\n**箭头函数 (=>)**：ES6 简化的函数写法。`(参数) => { 代码 }`。\n\n记住：先看函数名和 return，再看关键操作（push、db.run、response）。类型的声明可以暂时跳过。",
  },
  "project-position": {
    label: "不知道代码在项目中的位置",
    microLesson:
      "项目结构：\n```\nsandbox/canvas-save-persistence/\n├── frontend/        ← React 组件（界面）\n├── server/          ← 后端（路由 + 数据访问）\n│   ├── canvasRoutes.js    ← API 路由\n│   └── canvasRepository.js ← 数据访问层\n├── database/        ← 数据库 schema 和迁移\n├── evidence/        ← 运行证据（日志、Network）\n└── tests/           ← 用户手动运行的测试\n```\n数据流路径：React 组件 → fetch → 路由 → 数据访问层 → SQLite → 回来。",
  },
  causality: {
    label: "不理解因果关系",
    microLesson:
      "当前故障的因果链：\n\n1. 用户点击保存 → 前端发 POST 请求\n2. 路由接收请求 → 调用 saveCanvas()\n3. saveCanvas() 把数据 push 到**内存数组**\n4. 返回 201 → 前端显示成功\n5. **关键断裂**: db.run(INSERT...) **从未被执行**\n6. 用户刷新页面 → GET 请求查询 SQLite\n7. SQLite 中没有数据 → 返回空列表\n\n一句话：写入走内存、读取走数据库，两个数据源没连上。",
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

// ============ 案件 002：登录状态消失之谜 ============

/** Case 002 概念卡 */
const c2Token: ConceptCard = {
  id: "c2-token",
  label: "登录令牌（Token）",
  analogy:
    "🎫 去游乐园：检票员给你盖了个章（Token），凭章自由进出。洗完澡章没了——就得重新买票。Token 就是那个章：证明你是谁，但只在当前会话里有效。",
  example:
    "登录 API 返回 Token，但如果后端只把 Token 存在内存里，重启服务后 Token 全没了。",
  prediction: {
    question: "🔥 服务重启后，内存中存的 Token 还存在吗？",
    options: [
      "存在，Token 已经生成好了",
      "不存在，重启后内存清空",
      "存在，但需要数据库恢复",
      "不确定",
    ],
    correctIndex: 1,
    explanation:
      "和 Case 001 一样的道理：内存数据重启就消失。Token 没了 → 所有用户必须重新登录。",
  },
};
const c2Cookie: ConceptCard = {
  id: "c2-cookie",
  label: "Cookie 与 Session",
  analogy:
    "🍪 Cookie = 电影院票根。Session = 后台「已购票记录」。你的票根还在，但后台记录被删了——验票时照样被赶出去。",
  example:
    "登录时：res.cookie('sessionId', id) 发 Cookie；serverSessions[id] = user 存内存。验证时从内存查——重启后当然找不到了。",
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
      "Cookie 没问题。服务端 serverSessions 在内存里，重启变 {} ，找不到对应 Session。",
  },
};
const c2Evidence: ConceptCard = {
  id: "c2-evidence",
  label: "三重证据验证法",
  analogy:
    "办案三件套：口供（界面显示「已登录」）+ 物证（Network 200 + Cookie）+ 交叉验证（用 Cookie 再请求一次 → 401）。口供和物证都说登录了，但交叉验证揭示真相。",
  example:
    "登录成功 → 200 + Cookie ✅。过段时间：用同一个 Cookie → 401 ❌。嫌疑：Session 没持久化。",
  prediction: {
    question: "登录成功的直接证据是 200 + Cookie。交叉验证怎么做？",
    options: [
      "再点一次登录",
      "关闭浏览器",
      "用 Cookie 请求另一个受保护接口",
      "查看日志",
    ],
    correctIndex: 2,
    explanation:
      "用同一份 Cookie 访问另一个接口。成功=真实登录。401=看似登录实则失效。",
  },
};
const c2Flow: ConceptCard = {
  id: "c2-flow",
  label: "请求链还原",
  analogy:
    "🕸️ 登录 → POST /login → Token+SetCookie → 浏览器存 Cookie → 再访问带 Cookie → 查 serverSessions[token] → 找到 ✓ / 找不到 ✗ 401",
  example:
    "Step 1: POST /login → 200 { token: 'abc123' } + Set-Cookie\nStep 2: 重启服务\nStep 3: GET /me (Cookie: abc123) → 401 ← 断了！",
  prediction: {
    question: "这条链路在哪一步断了？",
    options: [
      "浏览器没带 Cookie",
      "POST /login 格式错",
      "serverSessions[token] 找不到——内存被清了",
      "GET /me 路由写错",
    ],
    correctIndex: 2,
    explanation:
      "Cookie 还在、路由也对。serverSessions 重启变 {}，查不到对应 Token。",
  },
};

export const case02Concepts = [c2Token, c2Cookie, c2Evidence, c2Flow];

export const case02CodeTour: TeachingStep[] = [
  {
    id: "c2-tour-login",
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
      observationGoal: "token 存进了 serverSessions——内存对象。重启后消失。",
    },
  },
  {
    id: "c2-tour-verify",
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
        "  const s = serverSessions[t];  // 查内存！",
        "  if (!s) return 401;",
        "  return res.json({ user });",
        "});",
      ],
      observationGoal:
        "serverSessions[t] 查内存。重启后变空，返回401。这就是根因。",
    },
  },
];

export const case02Map: ProjectMap = {
  nodes: [
    {
      id: "c2-login",
      label: "用户登录",
      description: "输入密码点击登录",
      input: "用户名+密码",
      output: "触发 POST",
      possibleFaults: ["密码错"],
      evidenceSources: ["Network"],
    },
    {
      id: "c2-fe",
      label: "React 前端",
      description: "登录表单组件",
      input: "fetch POST",
      output: "Token+Cookie",
      possibleFaults: ["未读 Cookie"],
      evidenceSources: ["前端代码"],
    },
    {
      id: "c2-be-login",
      label: "登录路由",
      description: "验证密码、生成Token、设置Cookie",
      input: "用户名密码",
      output: "200+Token",
      possibleFaults: ["Token存内存"],
      evidenceSources: ["后端代码"],
    },
    {
      id: "c2-sessions",
      label: "Session 存储",
      description: "serverSessions 内存对象",
      input: "Token",
      output: "内存写入",
      possibleFaults: ["重启全丢"],
      evidenceSources: ["代码"],
    },
    {
      id: "c2-verify",
      label: "验证路由",
      description: "查 serverSessions 验证身份",
      input: "Cookie",
      output: "200/401",
      possibleFaults: ["查不到"],
      evidenceSources: ["Network"],
    },
  ],
  edges: [
    { from: "c2-login", to: "c2-fe", label: "提交" },
    { from: "c2-fe", to: "c2-be-login", label: "POST" },
    { from: "c2-be-login", to: "c2-sessions", label: "存内存" },
    { from: "c2-sessions", to: "c2-verify", label: "查询" },
    { from: "c2-verify", to: "c2-fe", label: "200/401" },
  ],
};

export const case02Scenario: TeachingScenario = {
  scenarioId: "case-002",
  steps: [
    {
      id: "c2-map",
      mode: "teaching",
      title: "案发现场勘测",
      goal: "了解登录验证的数据流",
    },
    {
      id: "c2-concepts",
      mode: "teaching",
      title: "证据分析",
      goal: "Token/Cookie/Session/交叉验证",
      concepts: case02Concepts,
    },
    ...case02CodeTour,
    {
      id: "c2-close",
      mode: "teaching",
      title: "结案报告",
      goal: "根因：内存 Token 未持久化",
    },
  ],
  projectMap: case02Map,
};
