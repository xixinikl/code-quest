import {
  type RemediationLesson,
  type RemediationPath,
  type TeachingStep,
} from "./teaching";

type RemediationLessonSet = Record<
  RemediationPath["trigger"],
  RemediationLesson
>;

const remediationLabels: Record<RemediationPath["trigger"], string> = {
  term: "术语听不懂",
  syntax: "代码动作看不懂",
  "project-position": "不知道这一段在哪",
  causality: "不知道为什么会坏",
};

function buildRemediationPaths(
  lessons: RemediationLessonSet,
): RemediationPath[] {
  return (["term", "syntax", "project-position", "causality"] as const).map(
    (trigger) => ({
      trigger,
      label: remediationLabels[trigger],
      microLesson: lessons[trigger],
    }),
  );
}

const case02Remediation: RemediationLessonSet = {
  term: {
    summary: "这章不是让 AI 多想点子，而是把一次产品决策拆成四份能保存的材料。",
    notes: [
      {
        label: "Project Brief",
        detail:
          "生成前的背景卡，写清项目、目标用户、当前阶段和约束。它回答“AI 正在替谁解决什么问题”。",
      },
      {
        label: "方向筛选",
        detail:
          "先选 MVP、痛点、技术或风险等问题类型，限制 AI 这一次只沿相关方向发散。",
      },
      {
        label: "候选取舍",
        detail:
          "对每条建议做保留、待定或放弃，并留下理由。AI 提建议，产品判断仍由人完成。",
      },
      {
        label: "会话",
        detail:
          "把 Brief、方向、候选状态和草案放在同一份可恢复记录里，不是聊天窗口里的一句话。",
      },
    ],
    takeaway:
      "Brief 负责说清背景，方向负责收窄问题，取舍负责做决定，会话负责让决定可继续。",
  },
  syntax: {
    summary: "只追四种会改变产品状态的代码动作，不需要先读懂整份 React 文件。",
    notes: [
      {
        label: "const brief = { ... }",
        detail: "把分散输入装成一张背景卡，后续生成请求会收到这一整个对象。",
      },
      {
        label: "onBriefChange(brief)",
        detail:
          "把新背景卡交给上层工作台保存；括号里的 brief 就是交出去的材料。",
      },
      {
        label: "STORM_DIRECTIONS",
        detail:
          "一组可选的问题方向。每项 id 是机器使用的编号，question 是用户看到的问题。",
      },
      {
        label: "PUT /api/sessions/:id",
        detail:
          "把当前会话的完整状态交给后端覆盖保存；:id 表示正在保存哪一份会话。",
      },
    ],
    sequence: [
      "先看输入如何组成 brief 对象。",
      "再看方向数组如何限制候选问题。",
      "最后看 PUT 请求是否把 Brief、候选和取舍一起保存。",
    ],
    takeaway: "对象在收材料，回调在交材料，PUT 在保存整份工作状态。",
  },
  "project-position": {
    summary:
      "CanvasStorm 从用户的一句话开始，经过前端决策工作台，最后落到后端会话档案。",
    notes: [
      {
        label: "ProjectBriefForm.tsx",
        detail: "前端输入站：收集项目、用户、阶段和约束，交出结构化 brief。",
      },
      {
        label: "directions.ts",
        detail:
          "前端规则站：定义允许用户选择的探索方向，不负责调用模型或保存数据。",
      },
      {
        label: "候选看板",
        detail: "前端决策站：接收 AI 候选，记录保留、待定、放弃及理由。",
      },
      {
        label: "server/routes/sessions.ts",
        detail:
          "后端归档站：接收完整工作台状态，调用 saveSession 写入 data 文件。",
      },
    ],
    sequence: [
      "用户输入交给 Project Brief。",
      "Brief 和方向交给候选生成。",
      "候选与人的取舍交给执行草案。",
      "整份状态交给会话接口保存并在刷新后恢复。",
    ],
    takeaway:
      "判断一个文件时，先问它是在收背景、限制方向、记录决定，还是保存会话。",
  },
  causality: {
    summary:
      "AI 点子空泛通常不是模型突然变笨，而是输入没有背景、过程没有方向、结果没有取舍。",
    notes: [
      {
        label: "输入太空",
        detail:
          "只有“帮我想 AI 功能”，模型不知道用户、阶段和禁区，只能给通用口号。",
      },
      {
        label: "方向太散",
        detail:
          "MVP、增长、技术和风险同时发散，候选彼此不能比较，也无法形成一轮清楚决策。",
      },
      {
        label: "没有人的取舍",
        detail:
          "候选全部保留，没有理由，草案就会无限膨胀，不能变成可执行范围。",
      },
      {
        label: "没有保存",
        detail:
          "刷新后 Brief 和取舍消失，用户下一次只能重新开始，产品链路因此不可信。",
      },
    ],
    sequence: [
      "先补齐 Brief 的用户、阶段和约束。",
      "只选本轮最重要的探索方向。",
      "给候选写下保留或放弃理由。",
      "保存整份会话并刷新验证恢复。",
    ],
    takeaway:
      "具体输入产生可比较候选，明确取舍形成草案，可靠保存让产品工作可以继续。",
  },
};

const case03Remediation: RemediationLessonSet = {
  term: {
    summary:
      "登录态不是页面记住一个名字，而是浏览器凭证和后端身份记录能够互相对上。",
    notes: [
      {
        label: "Token",
        detail:
          "后端签发的身份编号。浏览器以后带着它请求，后端才能知道要查哪位用户。",
      },
      {
        label: "Cookie",
        detail: "浏览器替网站保存并随请求携带的小纸条，这里装着 sessionId。",
      },
      {
        label: "Session",
        detail:
          "后端保存的登录登记，记录某个 sessionId 对应哪个用户、何时过期。",
      },
      {
        label: "401",
        detail:
          "后端无法确认当前请求身份时返回的状态码。它不等于密码一定输错。",
      },
    ],
    takeaway:
      "Cookie 负责带编号，Session 负责解释编号；任意一边缺失，验证路由都会返回 401。",
  },
  syntax: {
    summary: "读登录代码时，只追“生成、保存、携带、查询”四个动作。",
    notes: [
      {
        label: "serverSessions[token] = ...",
        detail:
          "用 token 当钥匙，把用户和过期时间写进后端内存对象。方括号表示按这个编号存取。",
      },
      {
        label: "res.cookie('sessionId', token)",
        detail:
          "让响应要求浏览器保存一个名为 sessionId、值为 token 的 Cookie。",
      },
      {
        label: "req.cookies.sessionId",
        detail: "验证请求到达后端时，从请求 Cookie 中取回刚才的编号。",
      },
      {
        label: "if (!s) return 401",
        detail: "如果后端查不到对应 Session，就立刻停止并告诉浏览器身份无效。",
      },
    ],
    sequence: [
      "先找登录路由在哪里生成 token。",
      "确认 token 同时交给浏览器并登记在后端。",
      "再看 /me 如何取 Cookie、查 Session、决定 200 或 401。",
    ],
    takeaway: "登录路由在发凭证，验证路由在用同一凭证查后端登记。",
  },
  "project-position": {
    summary: "登录态横跨浏览器和后端，不能只盯着 React 页面上的“欢迎回来”。",
    notes: [
      {
        label: "登录表单",
        detail:
          "前端入口：收用户名和密码，发 POST /login，不负责决定身份是否长期有效。",
      },
      {
        label: "POST /login",
        detail:
          "后端签发站：验证账号、生成 token、设置 Cookie，并登记 Session。",
      },
      {
        label: "浏览器 Cookie",
        detail:
          "客户端凭证站：刷新页面后仍能把 sessionId 随 GET /me 发回后端。",
      },
      {
        label: "GET /me",
        detail:
          "后端验证站：读取 Cookie，再查 Session 存储，成功回用户，失败回 401。",
      },
    ],
    sequence: [
      "表单把账号密码交给登录路由。",
      "登录路由把 sessionId 同时交给 Cookie 和 Session 存储。",
      "刷新后浏览器把 Cookie 交给 /me。",
      "/me 用编号查 Session，再把身份结果交回前端。",
    ],
    takeaway:
      "Application 看 Cookie，Network 看请求是否携带，后端代码看 Session 是否还能查到。",
  },
  causality: {
    summary:
      "刷新后掉登录要先区分：浏览器没带凭证，还是后端已经不认识这份凭证。",
    notes: [
      {
        label: "登录时成功",
        detail: "POST /login 返回 200 并设置 Cookie，说明凭证曾经成功签发。",
      },
      {
        label: "刷新仍带 Cookie",
        detail:
          "Application 和 GET /me 请求头都能看到 sessionId，说明浏览器没有失忆。",
      },
      {
        label: "验证返回 401",
        detail:
          "后端用 sessionId 查询 serverSessions，却因为服务重启后内存清空而找不到登记。",
      },
    ],
    sequence: [
      "确认登录响应是否真的设置 Cookie。",
      "确认刷新后的 /me 是否携带同一个 Cookie。",
      "查看后端验证逻辑从哪里读取 Session。",
      "重启服务复测，判断 Session 是否只存在内存。",
    ],
    takeaway:
      "Cookie 还在但 /me 返回 401，证据更指向后端 Session 丢失，而不是前端按钮或密码。",
  },
};

const case04Remediation: RemediationLessonSet = {
  term: {
    summary:
      "接口报错不是一个模糊红框，而是请求材料、判定结果和后台原因三份能互相对上的证据。",
    notes: [
      {
        label: "Payload",
        detail:
          "前端实际发送的请求体。先看字段名和值，不要只看页面输入框里显示了什么。",
      },
      {
        label: "400",
        detail:
          "请求材料不符合接口要求，例如 title 缺失。通常先修前端输入或参数校验。",
      },
      {
        label: "500",
        detail: "后端处理时发生未正确处理的异常，需要结合后端日志继续定位。",
      },
      {
        label: "requestId",
        detail:
          "一次请求的追踪编号，用它把 Network 里的失败和后端同一次日志对起来。",
      },
    ],
    takeaway:
      "Payload 说明发了什么，状态码说明哪类失败，响应体和 requestId 帮你找到具体原因。",
  },
  syntax: {
    summary:
      "读接口错误代码时，只看请求体如何构造、后端如何校验、错误如何返回。",
    notes: [
      {
        label: "JSON.stringify({ ... })",
        detail:
          "把前端对象变成 HTTP 请求体。花括号里的字段名必须和后端契约一致。",
      },
      {
        label: "const { title, ownerId } = req.body",
        detail:
          "后端从请求体取出两个字段，后面的校验都基于这两份实际收到的值。",
      },
      {
        label: "if (!title)",
        detail:
          "title 为空时进入拒绝分支，不再继续创建项目。感叹号可以先理解为“没有”。",
      },
      {
        label: "res.status(400).json(...) ",
        detail:
          "同时交出错误类别和结构化说明，让前端知道哪个字段需要用户修改。",
      },
    ],
    sequence: [
      "先对照前端 JSON 字段和后端 req.body 字段。",
      "再看哪个 if 分支决定 400。",
      "最后用响应体和日志确认前端展示的是同一个原因。",
    ],
    takeaway:
      "字段从前端 body 进入 req.body，校验分支决定状态码，结构化响应把原因交回页面。",
  },
  "project-position": {
    summary:
      "一次接口失败从页面开始，但真正原因可能停在前端构造、路由校验或后端异常。",
    notes: [
      {
        label: "CreateProjectForm.jsx",
        detail:
          "前端提交站：收集 title 和 ownerId，构造 JSON，并展示接口返回的 message。",
      },
      {
        label: "Network",
        detail:
          "链路观察站：同时看到 URL、Payload、状态码、响应体和 requestId。",
      },
      {
        label: "projectRoutes.js",
        detail:
          "后端判定站：从 req.body 取字段，执行参数校验，决定 201、400 或 500。",
      },
      {
        label: "后端日志",
        detail:
          "原因档案站：记录 path、field、requestId 和异常，解释后台为什么拒绝或崩溃。",
      },
    ],
    sequence: [
      "页面表单把字段交给 fetch。",
      "Network 记录请求和响应。",
      "路由把字段交给校验逻辑。",
      "校验结果和日志再把可解释错误交回前端。",
    ],
    takeaway:
      "先在 Network 锁定这次请求，再用 requestId 去日志找同一次后台处理。",
  },
  causality: {
    summary:
      "同一个缺失字段应该得到可修正的 400；如果变成笼统 500，错误边界就放错了位置。",
    notes: [
      {
        label: "前端现象",
        detail:
          "用户只看到“提交失败”，这只能证明界面收到了失败结果，不能说明失败层级。",
      },
      {
        label: "Network 证据",
        detail:
          "Payload 里 title 为空、响应却是 500，说明请求材料有问题但后端没有正确归类。",
      },
      {
        label: "后端原因",
        detail: "路由若先调用业务函数再校验，空值可能抛异常，被包装成 500。",
      },
      {
        label: "正确边界",
        detail:
          "入口先校验 title，记录字段级日志，再返回 code、field、message 组成的 400。",
      },
    ],
    sequence: [
      "复现并固定一次失败请求。",
      "核对 Payload、状态码和响应体。",
      "用时间或 requestId 找到对应日志。",
      "修复校验顺序后复测 400、提示文案和日志。",
    ],
    takeaway: "参数错误应在入口被识别为 400；500 留给真正的服务端异常。",
  },
};

const case05Remediation: RemediationLessonSet = {
  term: {
    summary:
      "防重复不是只禁用按钮，而是让同一个业务动作无论到达几次都只产生一份可信结果。",
    notes: [
      {
        label: "Idempotency-Key",
        detail:
          "同一次业务动作的编号。网络重试时继续带同一个 key，后端才能认出“这件事处理过了”。",
      },
      {
        label: "唯一约束",
        detail:
          "数据库最后一道门，同一个核心编号不能插入两条记录，即使并发请求同时到达。",
      },
      {
        label: "并发",
        detail:
          "多次请求在很接近的时间一起处理，彼此可能都还没看到另一条已创建结果。",
      },
      {
        label: "事务",
        detail:
          "把一组相关写入绑在一起：要么全部成功，要么失败时全部撤回，避免只写一半。",
      },
    ],
    takeaway: "幂等识别同一动作，唯一约束阻止重复落库，事务保证相关写入完整。",
  },
  syntax: {
    summary:
      "读防重复代码时，追 key 从前端请求头进入后端，再看后端如何查旧结果和创建新结果。",
    notes: [
      {
        label: "headers: { 'Idempotency-Key': key }",
        detail:
          "前端把业务动作编号放进请求头。重试时必须复用，不是每次重新生成。",
      },
      {
        label: "findByIdempotencyKey(key)",
        detail: "后端先查询这个动作是否处理过，返回值 existing 是旧结果或空。",
      },
      {
        label: "if (existing) return 200",
        detail: "已有结果就直接交回，不再继续 INSERT；200 表示返回现有结果。",
      },
      {
        label: "db.transaction(() => ...)",
        detail:
          "把创建订单和幂等登记放进受保护的数据库操作边界，失败时一起回滚。",
      },
    ],
    sequence: [
      "确认同一次连点或重试带的是不是同一个 key。",
      "确认后端在创建前先查 key。",
      "确认数据库还有唯一约束兜住并发竞争。",
      "最后查记录数，证明结果真的只有一份。",
    ],
    takeaway: "先查旧结果，再受保护地创建；重复请求返回旧结果，不重复写入。",
  },
  "project-position": {
    summary:
      "重复数据横跨用户动作、前端请求、后端查重和数据库约束，任何一层都不能冒充全部防线。",
    notes: [
      {
        label: "SubmitOrderButton.jsx",
        detail: "体验防线：提交中锁按钮，并把同一次动作的 key 放进请求头。",
      },
      {
        label: "Network",
        detail:
          "请求证据：看实际来了几次 POST、每次 key 是否相同、各自返回 200 还是 201。",
      },
      {
        label: "orderRoutes.js",
        detail:
          "业务防线：读取 key、查询旧结果、决定直接返回还是进入创建事务。",
      },
      {
        label: "数据库",
        detail:
          "最终防线：唯一索引、事务和 SELECT count(*) 证明核心记录只有一份。",
      },
    ],
    sequence: [
      "用户动作交给前端提交函数。",
      "前端把 draft 和 key 交给 POST /api/orders。",
      "后端把 key 交给幂等登记查询。",
      "只有未处理动作才进入事务和数据库唯一约束。",
    ],
    takeaway: "前端减少重复，后端识别重复，数据库保证重复最终写不进去。",
  },
  causality: {
    summary:
      "重复记录通常来自“同一动作到达多次”与“后端把每次都当成新动作”同时发生。",
    notes: [
      {
        label: "重复请求真实存在",
        detail:
          "双击、超时重试、两个标签页都可能让 Network 出现多次 POST，这不是只靠教育用户能消除的。",
      },
      {
        label: "key 使用错误",
        detail: "若每次重试都生成新 key，后端会误以为是多件不同的业务动作。",
      },
      {
        label: "查重存在竞态",
        detail:
          "两个并发请求可能同时查到“还没有”，然后都尝试创建，所以还需要数据库唯一约束。",
      },
      {
        label: "事务边界不完整",
        detail:
          "订单创建成功但幂等登记失败，会让下一次重试再次创建，需要把相关写入放进同一事务。",
      },
    ],
    sequence: [
      "用 Network 复现多次请求并核对 key。",
      "查看后端是否先按 key 查询旧结果。",
      "检查 key 的唯一索引和事务边界。",
      "连续重试后用 SELECT count(*) 验收最终只有一条。",
    ],
    takeaway:
      "可信修复不是“按钮只能点一次”，而是重复请求真的到达后，数据库仍只有一份正确记录。",
  },
};

const case06Remediation: RemediationLessonSet = {
  term: {
    summary:
      "性能排查不是猜哪里慢，而是把一次打开页面拆成下载、等待接口、渲染和再次访问四段时间。",
    notes: [
      {
        label: "Network 瀑布图",
        detail:
          "浏览器里每个资源和接口的时间条。它告诉你谁先开始、谁在排队、谁等待最久。",
      },
      {
        label: "TTFB",
        detail:
          "从请求发出到收到第一口响应的等待时间。它很高时，优先查后端、数据库或上游服务。",
      },
      {
        label: "渲染",
        detail:
          "数据到达浏览器后，React 把它变成列表和按钮的过程。接口快但页面仍卡，可能就慢在这里。",
      },
      {
        label: "缓存",
        detail:
          "保存一份可复用结果，让相同请求不用重走完整链路；同时必须规定何时失效，避免展示旧数据。",
      },
    ],
    takeaway:
      "瀑布图划分整条时间线，TTFB 指向响应前等待，渲染解释数据到达后的卡顿，缓存用于复测提速。",
  },
  syntax: {
    summary:
      "读性能代码时只追四个动作：开始计时、等待数据、记录耗时、决定复用还是重新查询。",
    notes: [
      {
        label: "performance.now()",
        detail:
          "在浏览器记录高精度开始时间；请求完成时再调用一次，两次相减就是前端观察到的等待。",
      },
      {
        label: "fetch(...).then(...) ",
        detail:
          "fetch 发出接口请求，then 里的代码要等数据回来才执行；这段间隔可以和 Network 对照。",
      },
      {
        label: "projects.map(...) ",
        detail:
          "把每条项目数据变成一个组件。数据量很大时，一次创建太多页面节点会造成渲染卡顿。",
      },
      {
        label: "if (cached) return",
        detail:
          "后端命中缓存时提前返回，不再执行数据库查询；return 表示这次请求到这里结束。",
      },
    ],
    sequence: [
      "先用 Network 确认最慢的是资源、接口还是接口后的页面反应。",
      "再把前端计时和后端查询日志放在同一条时间线上。",
      "只针对最长一段选择分页、减少渲染或缓存。",
      "优化后用同一页面、同一数据量再次测量。",
    ],
    takeaway:
      "计时负责留下证据，fetch 负责等待数据，map 负责生成页面，缓存分支负责跳过重复工作。",
  },
  "project-position": {
    summary:
      "页面慢横跨浏览器资源、前端请求、后端查询和 React 渲染，必须先给每一段找到证据位置。",
    notes: [
      {
        label: "Network",
        detail:
          "总路线观察站：查看 JS、图片和 /api/projects 的开始时间、TTFB、下载时间、体积与缓存状态。",
      },
      {
        label: "ProjectList.jsx",
        detail:
          "前端舞台：发起列表请求、显示 loading、记录接口等待，并把 projects 映射成卡片。",
      },
      {
        label: "projectRoutes.js",
        detail:
          "后端关口：先查缓存，未命中才访问数据库，并把查询毫秒数写进日志。",
      },
      {
        label: "React Profiler",
        detail:
          "渲染证据站：当接口已经返回时，检查组件提交花了多久、哪些组件重复更新。",
      },
    ],
    sequence: [
      "浏览器先下载页面资源。",
      "ProjectList 再把 GET 请求交给后端。",
      "路由从缓存或数据库取得 JSON 并返回。",
      "React 把 JSON 变成列表，优化后再次访问做对比。",
    ],
    takeaway:
      "Network 看全程，前端文件看请求与渲染，后端日志看响应前处理，Profiler 看数据到达后的页面工作。",
  },
  causality: {
    summary:
      "“页面慢”至少有三种不同原因：资源没下载完、后端迟迟不回、数据回来后页面摆得太久。",
    notes: [
      {
        label: "资源阶段慢",
        detail:
          "大图片或主 JS 下载时间长，接口甚至还没开始；此时改数据库不会让首屏更快。",
      },
      {
        label: "TTFB 阶段慢",
        detail:
          "请求已经发出但第一口响应很晚，结合后端查询日志可判断数据库或上游是否占用时间。",
      },
      {
        label: "渲染阶段慢",
        detail:
          "接口很快返回大量数据，但列表出现仍要很久，常见原因是一次渲染太多节点或重复计算。",
      },
      {
        label: "缓存制造旧数据",
        detail:
          "缓存让第二次访问更快，但保存后没有失效就会显示旧列表，所以提速和正确性必须一起验收。",
      },
    ],
    sequence: [
      "固定同一页面、数据量和网络条件复现。",
      "记录资源下载、接口 TTFB、后端查询和渲染时间。",
      "只优化证据中最长的一段。",
      "对比前后数据，并验证保存后页面仍是最新状态。",
    ],
    takeaway:
      "性能修复要回答两个问题：时间原来花在哪里，改完后同一段是否真的缩短且数据没有变错。",
  },
};

const case07Remediation: RemediationLessonSet = {
  term: {
    summary:
      "接 AI API 是一条受保护的转交链：浏览器只交问题，服务端保管密钥，上游模型分段交回答。",
    notes: [
      {
        label: "API Key",
        detail:
          "模型服务识别调用者并计费的秘密凭证。任何进入浏览器代码或 Network 的 key 都能被用户复制。",
      },
      {
        label: "环境变量",
        detail:
          "运行服务时注入的配置。代码只写 AI_API_KEY 这个名字，真实值不进入 Git 和前端包。",
      },
      {
        label: "流式响应",
        detail:
          "回答不是等全部完成后一次返回，而是服务端读到一段就转发一段，让用户更早看到内容。",
      },
      {
        label: "错误兜底",
        detail:
          "上游超时、限流或密钥失效时，给用户可理解的退路，并在后端留下不含秘密的定位日志。",
      },
    ],
    takeaway:
      "密钥只留在服务端环境，前端只请求本地接口，流式链路逐段返回，失败路径可解释但不泄密。",
  },
  syntax: {
    summary:
      "读 AI 接口代码时，先分清哪段运行在浏览器、哪段运行在服务端，再追问题和文本片段怎样移动。",
    notes: [
      {
        label: "fetch('/api/ai/chat')",
        detail:
          "前端把 prompt 交给自己的后端。这个请求里不应该出现模型供应商地址或 API Key。",
      },
      {
        label: "process.env.AI_API_KEY",
        detail:
          "只有 Node 服务运行时读取密钥；process.env 不会自动把值交给浏览器。",
      },
      {
        label: "response.body.getReader()",
        detail:
          "拿到响应流的读取器，每次 read 得到一小段字节和一个是否结束的 done 标记。",
      },
      {
        label: "if (!response.ok)",
        detail:
          "在读取正文前检查上游状态；失败时走结构化错误分支，不能把供应商原始秘密直接透传。",
      },
    ],
    sequence: [
      "确认前端请求只包含用户 prompt。",
      "确认后端从环境变量取 key 后再调用模型供应商。",
      "确认服务端和前端都逐段读取并转发 stream。",
      "用超时或测试错误验证用户提示和后端日志。",
    ],
    takeaway:
      "前端 fetch 交问题，后端 env 提供秘密，reader 搬运片段，错误分支保护用户与密钥。",
  },
  "project-position": {
    summary:
      "模型熔炉有两道明确边界：浏览器只能进本地接口，只有服务端才能带着密钥走向 AI provider。",
    notes: [
      {
        label: "AiChatPanel.jsx",
        detail:
          "浏览器入口：收 prompt、请求 /api/ai/chat、追加文本片段并展示可重试提示。",
      },
      {
        label: "POST /api/ai/chat",
        detail:
          "安全中转站：校验输入、读取服务端 key、设置超时并调用上游模型。",
      },
      {
        label: "AI Provider",
        detail:
          "外部模型服务：接收服务端带凭证的请求，返回 stream、限流、鉴权失败或超时。",
      },
      {
        label: "后端日志",
        detail:
          "故障证据站：记录 requestId、供应商状态和耗时，但必须遮蔽 Authorization 与 key。",
      },
    ],
    sequence: [
      "用户输入交给前端 chat 函数。",
      "前端只把 prompt 交给自己的后端。",
      "后端补上环境变量中的 key 后请求模型。",
      "模型片段经后端转发给页面，失败信息留在安全边界内。",
    ],
    takeaway:
      "判断一段 AI 代码时先问它运行在哪：浏览器负责体验，服务端负责秘密、上游调用和故障记录。",
  },
  causality: {
    summary:
      "AI 对话失败不能只显示“出错了”，要区分密钥暴露、配置缺失、上游失败和流中断。",
    notes: [
      {
        label: "前端能看到 key",
        detail:
          "key 被写进 React 或 VITE_ 公开变量，构建后任何人都能搜索出来，这是安全故障而非普通 UI 问题。",
      },
      {
        label: "服务端没有配置",
        detail:
          "process.env.AI_API_KEY 为空时应在请求上游前返回可识别配置错误，不能带 undefined 继续调用。",
      },
      {
        label: "上游 429 或超时",
        detail:
          "429 表示限流，超时表示规定时间内没完成；用户提示、重试策略和日志应分别处理。",
      },
      {
        label: "流读到一半中断",
        detail:
          "页面可能已经显示半段文字，需要保留已生成内容并明确标记中断，不能假装回答完整。",
      },
    ],
    sequence: [
      "先在前端包和 Network 证明 key 没有出现。",
      "再用 requestId 对照本地接口与上游状态。",
      "模拟配置缺失、429、超时和流中断。",
      "验收提示可理解、日志可定位且任何路径都不打印 key。",
    ],
    takeaway:
      "专业 AI 接入既要成功时能流式显示，也要失败时知道断在哪一层，并始终守住密钥边界。",
  },
};

const case08Remediation: RemediationLessonSet = {
  term: {
    summary:
      "控制幻觉不是要求模型永远答对，而是给回答规定资料范围、留下引用，并允许它在证据不足时拒答。",
    notes: [
      {
        label: "Prompt",
        detail:
          "交给模型的任务契约，写清目标、允许使用的资料、输出格式和不能回答时怎么办。",
      },
      {
        label: "上下文",
        detail:
          "本轮随问题一起交给模型的资料片段。它不是模型永久记忆，而是这次回答可使用的证据袋。",
      },
      {
        label: "引用",
        detail:
          "答案声称使用的 chunk id 或来源编号，让用户能回到原文检查这句话是否有依据。",
      },
      {
        label: "拒答边界",
        detail:
          "资料为空、引用无效或问题超出范围时明确说不知道，并说明需要补充哪类材料。",
      },
    ],
    takeaway:
      "Prompt 规定规则，上下文提供证据，引用连接答案与原文，拒答边界阻止没有依据的内容被放行。",
  },
  syntax: {
    summary:
      "读幻觉控制代码时，追三份数据：允许使用的 chunk、模型返回的 citations、校验后能否展示的答案。",
    notes: [
      {
        label: "contextChunks.map(...) ",
        detail:
          "把本轮允许使用的资料整理成 id 和 text，明确交给模型的证据范围。",
      },
      {
        label: "outputSchema",
        detail:
          "要求模型返回 answer、citations 和 confidence，避免只得到一段无法程序检查的自由文本。",
      },
      {
        label: "citations.every(...) ",
        detail:
          "逐个检查模型引用是否存在于 allowedChunkIds；every 表示所有引用都必须通过。",
      },
      {
        label: "return { answer: '资料不足' }",
        detail:
          "答案为空、没有引用或引用越界时返回安全结果，不把未经证明的原始回答交给用户。",
      },
    ],
    sequence: [
      "先确认本轮上下文里实际有哪些 chunk id。",
      "再看 Prompt 是否要求引用与拒答。",
      "拿模型 citations 和允许列表逐个比对。",
      "分别用有资料和无资料问题验证展示或拒答。",
    ],
    takeaway:
      "上下文定义允许证据，schema 要求模型交出引用，校验器决定答案能否真正到达用户。",
  },
  "project-position": {
    summary:
      "幻觉控制不只在 Prompt 文件里，它从资料进入模型一直延伸到回答展示前的最后一道校验门。",
    notes: [
      {
        label: "资料检索结果",
        detail:
          "证据入口：提供本轮 context chunk 与 id；资料本身不相关时，后面写再强的 Prompt 也救不回来。",
      },
      {
        label: "groundedAnswer.js",
        detail:
          "任务契约站：把问题、context、引用要求和 UNKNOWN 规则组成 messages。",
      },
      {
        label: "模型原始输出",
        detail:
          "候选结果站：包含 answer、citations、confidence，但此时还不能直接相信或展示。",
      },
      {
        label: "answerVerifier.js",
        detail:
          "放行门：检查引用是否来自本轮资料，决定交出可展示答案还是资料不足提示。",
      },
    ],
    sequence: [
      "检索器把带 id 的资料交给 Prompt 构造器。",
      "Prompt 和资料一起交给模型。",
      "模型交回答案与引用。",
      "校验器对照允许 id 后才把结果交给前端。",
    ],
    takeaway:
      "Prompt 只是中间一站；真正可信的链路必须同时看输入资料、模型原始输出和展示前校验。",
  },
  causality: {
    summary:
      "AI 说得很像真的却仍然错误，往往是资料没给对、规则没写清或引用根本没有被校验。",
    notes: [
      {
        label: "上下文为空",
        detail:
          "模型仍会依据训练记忆补全一个流畅答案，内部政策等私有信息因此特别容易被编造。",
      },
      {
        label: "Prompt 没有限制",
        detail:
          "只要求“回答问题”却没写仅根据 context、必须引用和资料不足时拒答，模型没有明确边界。",
      },
      {
        label: "引用看起来像真的",
        detail:
          "模型可能生成不存在的 chunk id；如果前端只展示字符串而不校验，假引用也会被包装成证据。",
      },
      {
        label: "低置信仍直接展示",
        detail: "没有资料时继续输出确定语气，会把系统的不确定性隐藏给用户。",
      },
    ],
    sequence: [
      "保留一次错误回答的原始 context 与模型 JSON。",
      "检查 Prompt 是否规定来源、格式和拒答。",
      "把 citations 与本轮 allowedChunkIds 对照。",
      "补有资料、无资料和假引用三类反例测试。",
    ],
    takeaway:
      "可信回答不是“读起来合理”，而是每个引用都能回到本轮资料；找不到依据时系统必须停下来。",
  },
};

const case09Remediation: RemediationLessonSet = {
  term: {
    summary:
      "RAG 是一条先找资料、再回答的证据链；模型没有自动记住知识库，检索质量决定它拿到什么。",
    notes: [
      {
        label: "RAG",
        detail:
          "Retrieval-Augmented Generation，检索增强生成：先检索相关资料，再把资料交给模型生成回答。",
      },
      {
        label: "chunk",
        detail:
          "从长文档切出的带编号小片段，保留原文和来源，让检索能定位到具体内容。",
      },
      {
        label: "embedding",
        detail:
          "把文字转成可比较的数字向量。问题和 chunk 都有向量，系统才能按语义相似度寻找。",
      },
      {
        label: "命中率",
        detail:
          "一组标准问题中，正确资料是否出现在检索结果里的比例；它衡量的是找资料能力，不是文案流畅度。",
      },
    ],
    takeaway:
      "文档先切成 chunk，chunk 变成 embedding，问题检索出 matches，模型最后只基于命中资料回答。",
  },
  syntax: {
    summary:
      "读 RAG 代码时把它分成入库和问答两条路：入库制造可检索书页，问答先找书页再调用模型。",
    notes: [
      {
        label: "splitIntoChunks(doc.text)",
        detail:
          "按标题和长度把原文拆开；返回的是多个片段，不是把整份文档直接塞给模型。",
      },
      {
        label: "await embed(chunk.text)",
        detail:
          "把每个 chunk 转成向量。await 表示必须等向量生成后，才能把完整记录写进索引。",
      },
      {
        label: "vectorStore.search(..., { topK: 4 })",
        detail:
          "用问题向量寻找最相近的四个片段；topK 是候选数量，不代表四个都一定正确。",
      },
      {
        label: "return { answer, citations, matches }",
        detail:
          "同时交回最终回答、模型引用和原始命中资料，便于页面展示，也便于开发者排查错答。",
      },
    ],
    sequence: [
      "入库时先检查 chunk 文本、id 和 source。",
      "确认每个 chunk 的向量与元数据写进索引。",
      "提问时先看 topK matches，再看模型回答。",
      "把 citations 与 matches 原文逐项对上。",
    ],
    takeaway:
      "split 切资料，embed 做可比较指纹，search 找候选，返回值保留回答与检索证据。",
  },
  "project-position": {
    summary:
      "知识库有一条离线入库链和一条在线问答链，它们在向量索引处会合，不能只看聊天页面。",
    notes: [
      {
        label: "ragIndexer.js",
        detail:
          "入库工坊：读取文档、切 chunk、生成 embedding，并把 id、text、source 一起 upsert。",
      },
      {
        label: "向量索引",
        detail:
          "资料柜：保存向量和元数据，文档更新后也需要重新写入，否则检索到的仍是旧内容。",
      },
      {
        label: "ragAnswer.js",
        detail:
          "问答路线：把问题 embed，搜索 topK，整理 context，再调用 grounded answer。",
      },
      {
        label: "回答来源面板",
        detail:
          "用户与开发者证据站：展示 citations、命中 chunk 原文、source 和 score，支持回查错答。",
      },
    ],
    sequence: [
      "文档从上传入口进入 indexer。",
      "indexer 把 chunk 与向量交给索引。",
      "用户问题从 answer 路由进入同一索引检索。",
      "命中资料作为 context 交给模型，答案与来源一起交回页面。",
    ],
    takeaway:
      "入库决定系统里有什么资料，检索决定本次拿到什么资料，回答面板证明模型最终使用了什么。",
  },
  causality: {
    summary:
      "RAG 答错时不要先怪模型，先沿着文档、chunk、索引、matches、citations 五份证据向前查。",
    notes: [
      {
        label: "资料本身没有答案",
        detail:
          "知识库没有目标规则或版本过旧，检索不可能找到正确内容，应先补资料和更新时间。",
      },
      {
        label: "切分破坏上下文",
        detail:
          "标题与正文被拆开或片段太大混入无关内容，会让 embedding 无法准确代表这一段。",
      },
      {
        label: "索引没有更新",
        detail:
          "文档改过但没有重新 upsert，matches 仍来自旧 chunk，页面看起来像模型忽略了新规则。",
      },
      {
        label: "命中正确但回答错",
        detail:
          "只有确认 matches 已含正确原文后，才继续检查 Prompt、引用校验与模型输出。",
      },
    ],
    sequence: [
      "固定一个有标准答案的问题。",
      "查看 topK 是否包含正确 chunk、source 和足够上下文。",
      "若未命中，检查资料、切分、索引更新时间和检索参数。",
      "若已命中，再对照 Prompt、answer 与 citations。",
    ],
    takeaway:
      "RAG 排错先问“找对资料了吗”，再问“模型有没有依据资料回答”，两层证据不能混在一起。",
  },
};

const case10Remediation: RemediationLessonSet = {
  term: {
    summary:
      "Agent 工具调用不是让模型随便执行函数，而是把每个动作放进有名称、参数、权限和回退规则的安全契约。",
    notes: [
      {
        label: "工具调用",
        detail:
          "Agent 选择一个系统预先注册的动作，例如查询订单；模型只提出调用请求，真正执行仍由程序控制。",
      },
      {
        label: "参数 schema",
        detail:
          "执行前的申请表，规定必填字段、类型和允许值。缺字段或越界值会在碰到真实数据前被拒绝。",
      },
      {
        label: "权限与审计",
        detail:
          "权限判断当前用户能否做这件事；审计留下谁、何时、用什么参数调用了哪个工具。",
      },
      {
        label: "失败回退",
        detail:
          "工具不存在、参数不合法、越权或执行异常时，返回明确 code 和下一步，而不是假装成功或升级动作。",
      },
    ],
    takeaway:
      "Agent 负责提出计划，注册表限制能选什么，schema 和权限决定能否执行，回退与审计解释最终发生了什么。",
  },
  syntax: {
    summary:
      "读工具代码时只追四道门：查工具、验参数、查权限、执行并捕获失败。任何一道不通过都应该停下。",
    notes: [
      {
        label: "toolRegistry[toolName]",
        detail:
          "用模型给出的名称查注册表。查不到就返回 TOOL_NOT_FOUND，不能把名称当成任意代码执行。",
      },
      {
        label: "validate(tool.schema, args)",
        detail:
          "把 Agent 生成的 args 与工具 schema 对照，得到安全 parsed.value 或 VALIDATION_FAILED。",
      },
      {
        label: "hasPermission(user, permission)",
        detail:
          "用当前真实用户和工具声明的权限做代码判断；Prompt 里写“不要越权”不能替代这一步。",
      },
      {
        label: "try { tool.run(...) } catch",
        detail:
          "只有前三道门通过才执行。异常被转换成 TOOL_FAILED 与 requestId，避免原始堆栈或秘密泄露给用户。",
      },
    ],
    sequence: [
      "确认 toolName 只能来自注册表。",
      "用正常、缺失和越界参数分别验证 schema。",
      "用有权和无权用户验证权限分支。",
      "模拟工具失败，检查结构化错误与审计记录。",
    ],
    takeaway:
      "查表限定动作，validate 限定材料，permission 限定执行者，try/catch 让失败可解释。",
  },
  "project-position": {
    summary:
      "一次工具调用从用户目标开始，经过 Agent 计划与服务端执行器，最后才到真实资源；聊天气泡不是执行边界。",
    notes: [
      {
        label: "Agent plan",
        detail:
          "计划入口：把自然语言目标整理成 toolName 和 args，但此时只是候选动作，没有获得执行许可。",
      },
      {
        label: "agentTools.js",
        detail:
          "工具注册站：声明工具描述、只读或写入边界、schema、permission 和真正的 run 函数。",
      },
      {
        label: "agentToolExecutor.js",
        detail:
          "安全门：按固定顺序校验工具、参数与权限，再执行并把结果统一包装。",
      },
      {
        label: "审计日志与人类验收",
        detail:
          "结果出口：保留 toolName、requestId、成功或错误 code；危险或写入动作还要由人确认最终结果。",
      },
    ],
    sequence: [
      "用户把目标和允许边界交给 Agent。",
      "Agent 从注册表选择工具并填写 args。",
      "执行器通过 schema 与权限后调用真实资源。",
      "结果和审计记录交回用户，由人判断任务是否完成。",
    ],
    takeaway:
      "模型只负责提出调用，服务端执行器负责守门，真实资源负责产出，最终验收仍由人完成。",
  },
  causality: {
    summary:
      "Agent 越权或假装成功，通常不是模型突然失控，而是系统把计划、授权、执行和结果混成了一步。",
    notes: [
      {
        label: "工具描述过宽",
        detail:
          "一个“manageData”同时读写删除，Agent 无法选择最小权限动作；应拆成边界清楚的小工具。",
      },
      {
        label: "只靠 Prompt 限制",
        detail:
          "Prompt 可以提醒，但不能验证当前用户、环境或参数；权限必须在服务端代码里执行。",
      },
      {
        label: "参数直接传给资源",
        detail:
          "未校验的 userId、路径或枚举值可能越界查询、写错数据，甚至形成注入风险。",
      },
      {
        label: "错误被包装成成功",
        detail:
          "工具超时后 Agent 仍生成“已完成”，用户会误信；执行结果必须带真实 ok、code 和 requestId。",
      },
    ],
    sequence: [
      "固定一次正常调用和三种失败调用。",
      "核对每次是否经过注册、schema 与权限。",
      "确认失败没有触碰真实资源或自动升级动作。",
      "用审计记录证明谁调用了什么以及最终结果。",
    ],
    takeaway:
      "安全 Agent 不是更听话的模型，而是模型之外还有不可绕过的工具契约、权限门和真实结果证据。",
  },
};

const case11Remediation: RemediationLessonSet = {
  term: {
    summary:
      "“修好了”需要一条证据链：先让旧问题稳定失败，再用不同层级的测试和真实操作证明修复没有只停在局部。",
    notes: [
      {
        label: "复现用例",
        detail:
          "把用户故障写成会稳定失败的步骤或测试，证明你抓到的是原问题，而不是猜了另一个原因。",
      },
      {
        label: "单元测试",
        detail:
          "检查一个函数或模块的小范围行为，反馈快，但不能证明接口、数据库和页面已经正确交接。",
      },
      {
        label: "集成测试",
        detail:
          "把多个模块串起来，例如 POST 后再 GET，证明路由与数据层确实使用同一份持久化结果。",
      },
      {
        label: "手动报告与回归",
        detail:
          "从真实入口走用户路径并记录时间、步骤和结果；回归则确认改动没有破坏相关旧功能。",
      },
    ],
    takeaway:
      "复现证明旧问题，单测守住局部，集成测试守住交接，手动报告和回归证明真实用户路径仍可信。",
  },
  syntax: {
    summary:
      "读测试代码时把它翻译成三句话：准备了什么、做了什么、最后要求什么必须为真。",
    notes: [
      {
        label: "Arrange：准备 draft",
        detail:
          "固定输入与初始状态，让每次运行测试都面对同一个问题，避免结果依赖旧数据。",
      },
      {
        label: "Act：POST 再 GET",
        detail:
          "先执行用户真正的保存动作，再模拟刷新后的重新读取；两个动作串起来才覆盖持久化链路。",
      },
      {
        label: "Assert：assert.equal(...) ",
        detail:
          "明确要求记录数量和 title 与输入一致；断言越具体，失败时越容易知道哪份材料丢了。",
      },
      {
        label: "报告字段",
        detail:
          "status 说结果，generatedAt 说何时测，sourceFingerprint 说测哪版代码，cases 说哪些路径通过。",
      },
    ],
    sequence: [
      "先看测试在旧代码上是否真的失败。",
      "对照 Arrange、Act、Assert 是否覆盖原故障。",
      "修复后重跑同一个测试和相关回归。",
      "从真实入口复测并保存带时间与版本的报告。",
    ],
    takeaway:
      "测试不是一条绿色命令；输入、动作、断言、代码版本和报告时间必须能对上同一次修复。",
  },
  "project-position": {
    summary:
      "可信验收分布在故障证据、测试代码、运行结果和浏览器现场，不能只看 Agent 最后的文字说明。",
    notes: [
      {
        label: "Network / 日志 / 数据库",
        detail:
          "故障现场：保存问题用 POST、后端日志和 SELECT 记录修复前现象，作为复现用例的依据。",
      },
      {
        label: "tests/run-tests.js",
        detail:
          "自动化试炼：把 POST→GET 的旧故障写成可重复断言，并补局部函数和边界输入。",
      },
      {
        label: "test-results.json",
        detail:
          "证据档案：应用读取测试状态、生成时间、源码指纹、用例列表和失败原因。",
      },
      {
        label: "浏览器手动复测",
        detail:
          "真实入口：点击保存、刷新、再次读取，确认自动测试之外的页面反馈和数据状态。",
      },
    ],
    sequence: [
      "现场证据交给复现测试。",
      "复现测试在修复前失败、修复后通过。",
      "运行器把当前代码结果写进报告。",
      "人工沿用户路径复测并把未覆盖风险交给审查者。",
    ],
    takeaway:
      "现场证明问题存在，测试证明代码行为，报告证明时效与版本，浏览器证明用户真的走得通。",
  },
  causality: {
    summary:
      "测试显示绿色却仍没修好，通常是测错层、断言太宽、报告过期或真实入口根本没有被走过。",
    notes: [
      {
        label: "复现没有命中旧故障",
        detail:
          "只测 save() 返回 201，却没再 GET 或查数据库，测试无法发现“提示成功但刷新消失”。",
      },
      {
        label: "只有单元测试",
        detail:
          "repository 函数单独正确，不代表路由真的调用它，也不代表页面请求到了同一数据源。",
      },
      {
        label: "报告与源码不匹配",
        detail:
          "昨天的 passed 报告不能证明今天的改动；generatedAt 和 sourceFingerprint 必须对应当前版本。",
      },
      {
        label: "没有负面与回归路径",
        detail:
          "成功保存通过，但空参数、数据库失败或已有读取功能可能被破坏，仍需说明覆盖与未覆盖风险。",
      },
    ],
    sequence: [
      "从原始用户现象重新走一遍失败路径。",
      "检查测试动作和断言是否覆盖同一条链。",
      "确认报告时间、代码指纹与本次改动一致。",
      "补集成、负面、回归和浏览器复测证据。",
    ],
    takeaway:
      "绿色只说明某些断言通过；可信修复要证明这些断言覆盖原故障、当前代码和真实用户路径。",
  },
};

const case12Remediation: RemediationLessonSet = {
  term: {
    summary:
      "一份 Agent 委托要把背景、目标、约束、验收和风险连成闭环，让执行者不用猜，让审查者有标准。",
    notes: [
      {
        label: "背景与目标",
        detail:
          "背景说明发生了什么、影响谁、已有证据；目标说明完成后用户能观察到什么改变。",
      },
      {
        label: "约束",
        detail:
          "规定允许修改的范围、禁止动作、安全与设计边界，防止无关重构或读取不该碰的数据。",
      },
      {
        label: "验收",
        detail:
          "列出可执行命令、浏览器路径和预期结果，让“完成”可以被别人重新检查。",
      },
      {
        label: "风险与回滚",
        detail:
          "说明可能影响什么、哪些尚未验证、失败时如何恢复，避免把不确定性藏在漂亮交付说明后面。",
      },
    ],
    takeaway:
      "背景让 Agent 进入同一现场，目标给终点，约束画边界，验收给证据，风险说明失败时怎么办。",
  },
  syntax: {
    summary:
      "读任务模板时不要当散文看；把每一段当作一个必须能回答的问题，并检查它能否被行动或验证。",
    notes: [
      {
        label: "背景：现象 + 证据",
        detail:
          "“保存提示成功，但 POST 201、GET 空、SELECT 0 行”比“保存坏了”更能让 Agent 定位真实链路。",
      },
      {
        label: "目标：可观察结果",
        detail:
          "写“刷新后仍能读到同一记录”，而不是“优化保存”；前者有明确完成状态。",
      },
      {
        label: "范围：文件 + 禁止事项",
        detail:
          "列出允许改动模块、不得读取真实项目、不得执行任意命令等边界，减少无关改动。",
      },
      {
        label: "验收：命令 + 用户路径",
        detail:
          "同时要求自动化门禁与桌面/手机真实入口，防止只改代码却没有验证用户体验。",
      },
    ],
    sequence: [
      "先用现象和证据固定问题现场。",
      "把目标改写成用户能观察的完成状态。",
      "写清可改范围、禁止事项和兼容边界。",
      "补可执行验收、风险、未覆盖项和回滚。",
    ],
    takeaway:
      "任务里的每一句都应该帮助 Agent 决定做什么、不能做什么，或帮助你判断它是否真的完成。",
  },
  "project-position": {
    summary:
      "Agent 任务不是聊天框里的一句话，它连接用户问题、代码改动、验证证据和最终交接，是协作的事实源。",
    notes: [
      {
        label: "问题现场",
        detail:
          "需求入口：收集用户现象、截图、Network、日志或测试失败，让任务建立在当前事实而非猜测上。",
      },
      {
        label: "agent-brief.md",
        detail:
          "执行契约：固定背景、目标、范围、禁止事项、验收与风险，执行中发生变化也应同步更新。",
      },
      {
        label: "Diff 与测试结果",
        detail:
          "交付证据：改动文件应落在约束范围，测试命令和浏览器结果应逐条对应验收标准。",
      },
      {
        label: "HANDOFF / Changelog",
        detail:
          "协作出口：记录完成了什么、如何验证、剩余风险和后续合并注意事项。",
      },
    ],
    sequence: [
      "用户问题和证据进入委托书。",
      "Agent 按目标与约束修改代码。",
      "测试和浏览器结果逐条对应验收。",
      "Diff、风险与交接记录交给人类审查。",
    ],
    takeaway:
      "委托书管执行前的共识，Diff 与测试管执行后的证据，交接记录管下一位协作者能否安全继续。",
  },
  causality: {
    summary:
      "Agent 交付跑偏，常见原因不是它不会写代码，而是任务没有提供事实、完成定义、边界或可复核验收。",
    notes: [
      {
        label: "背景只有感受",
        detail:
          "“界面很丑、逻辑不好”没有页面、路径和现象，Agent 只能猜优先级，容易改到无关地方。",
      },
      {
        label: "目标混在实现方案里",
        detail:
          "只命令“重写组件”却没说用户结果，Agent 可能完成重构但原问题仍在。",
      },
      {
        label: "没有约束",
        detail:
          "Agent 可能顺手重构服务端、覆盖用户改动或读取真实数据，扩大风险和合并冲突。",
      },
      {
        label: "验收只有“看起来不错”",
        detail:
          "没有命令、路径、尺寸和预期结果，任何漂亮说明都能冒充完成，也无法复现检查。",
      },
    ],
    sequence: [
      "把模糊感受改写成页面、路径与可观察现象。",
      "把完成目标与建议实现方式分开。",
      "列出范围、禁止事项、数据与兼容边界。",
      "为每个目标写对应测试、浏览器路径、风险和回滚。",
    ],
    takeaway:
      "清晰委托不是写得长，而是减少猜测：事实足够、终点明确、边界可守、结果能被重新验证。",
  },
};

const case13Remediation: RemediationLessonSet = {
  term: {
    summary:
      "交付审查不是看 Agent 说了什么，而是让交付说明、Diff、测试证据、边界条件和文档同步互相对账。",
    notes: [
      {
        label: "交付说明",
        detail:
          "声明完成了什么、改了哪里、如何验证、还有什么风险；它是待核对的目录，不是完成证明。",
      },
      {
        label: "Diff 与回归风险",
        detail:
          "Diff 是真实改动清单；审查它是否落在任务范围，并判断旧功能可能被这些改动影响到哪里。",
      },
      {
        label: "边界条件",
        detail:
          "成功路径之外的空输入、失败请求、重复操作和 390px 手机视口，都可能暴露未覆盖的问题。",
      },
      {
        label: "文档同步",
        detail:
          "行为、命令或风险发生变化时，任务记录、Changelog 和 HANDOFF 也要更新，避免下一位协作者拿到旧地图。",
      },
    ],
    takeaway:
      "说明告诉你该查什么，Diff 告诉你真改了什么，测试和边界证明行为，文档把当前事实交给下一位协作者。",
  },
  syntax: {
    summary:
      "读交付材料时把每一项翻成一个核对动作：声明是否有 Diff、证据是否对应当前代码、风险是否覆盖真实入口。",
    notes: [
      {
        label: "changedFiles",
        detail:
          "把交付声明的文件和真实 git diff 对照；多出的文件要说明理由，少掉的文件说明交付描述不完整。",
      },
      {
        label: "generatedAt / commit",
        detail:
          "测试时间和代码版本共同说明这份绿色报告测的是不是当前改动，旧报告不能替今天的代码作证。",
      },
      {
        label: "viewport: 390",
        detail:
          "手机验收记录应包含视口、路径和结果；只写“响应式完成”无法判断按钮是否溢出或被遮挡。",
      },
      {
        label: "decision: reject",
        detail:
          "拒收不是情绪评价，要逐条指出缺失证据、影响风险以及补证后如何重新验收。",
      },
    ],
    sequence: [
      "先把交付声明拆成可核对条目。",
      "再用 Diff 确认真实改动范围。",
      "检查测试、浏览器与文档证据是否对应当前版本。",
      "最后写接收、补证或拒收结论。",
    ],
    takeaway:
      "审查材料里的字段不是装饰，每个字段都要能指向一份当前、可复查、与任务目标相关的证据。",
  },
  "project-position": {
    summary:
      "交付审查庭位于开发完成与上线之前，接收 Agent 交付包，输出的是可接收、需补证或拒收的工程结论。",
    notes: [
      {
        label: "agent-delivery.md",
        detail:
          "审查入口：列出目标、改动、验证、风险和未完成项，为后续证据核对提供索引。",
      },
      {
        label: "diff-summary.json",
        detail:
          "范围证物：记录真实变更文件和范围，帮助发现越界重构、遗漏文件或临时调试内容。",
      },
      {
        label: "test / browser evidence",
        detail:
          "行为证物：自动测试守代码契约，浏览器检查守真实用户路径和桌面、手机布局。",
      },
      {
        label: "review-decision.md",
        detail:
          "审查出口：说明为何接收或拒收、剩余风险、补证要求以及进入上线门禁前还缺什么。",
      },
    ],
    sequence: [
      "交付说明交给 Diff 核对范围。",
      "Diff 交给测试与边界检查行为。",
      "行为变化交给文档同步项目记忆。",
      "全部证据交给审查决定。",
    ],
    takeaway:
      "第 13 章不是再写功能，而是在上线前判断这份功能是否有足够证据被团队接住。",
  },
  causality: {
    summary:
      "交付看起来完整却仍会出事，通常因为说明与 Diff 不一致、测试过期、边界漏测或文档仍描述旧行为。",
    notes: [
      {
        label: "说明漂亮但范围越界",
        detail:
          "交付说只修按钮，Diff 却改了共享数据层；即使目标路径通过，也可能给其他章节带来回归。",
      },
      {
        label: "绿色报告测的是旧版本",
        detail:
          "generatedAt 或源码指纹对不上当前 Diff，绿色只能证明过去某版通过，不能证明眼前交付。",
      },
      {
        label: "只验桌面成功路径",
        detail:
          "桌面能点不代表 390px 按钮可见，正常响应通过也不代表失败、空数据和重复操作可用。",
      },
      {
        label: "文档没有跟着行为变化",
        detail:
          "代码改了命令或数据边界，HANDOFF 仍写旧事实，下一位开发者会按错误前提继续工作。",
      },
    ],
    sequence: [
      "从任务目标重新核对真实 Diff。",
      "确认每份证据对应当前代码和原问题。",
      "补成功、失败、边界和真实视口验收。",
      "同步文档后再形成审查结论。",
    ],
    takeaway:
      "接收交付的标准不是“它说做完了”，而是范围、行为、边界和项目记忆都能被当前证据同时支持。",
  },
};

const case14Remediation: RemediationLessonSet = {
  term: {
    summary:
      "上线准备把一个已审查交付变成可控发布：上线计划定步骤，环境变量供运行，数据备份保档案，监控报异常，回滚给退路。",
    notes: [
      {
        label: "上线计划",
        detail:
          "写清发布窗口、负责人、影响范围、冒烟路径和停止条件，让发布过程有人做、有人看、能暂停。",
      },
      {
        label: "环境变量",
        detail:
          "生产运行所需的数据库地址、API Key 和功能开关；它们不进入前端代码，也不能因为本地存在就假定线上存在。",
      },
      {
        label: "数据备份与监控",
        detail:
          "备份保护变更前的数据，监控在变更后观察错误率、耗时和关键业务成功率，两者分别守住前后。",
      },
      {
        label: "回滚",
        detail:
          "提前定义何时退回旧版本、怎样退、退后验证什么；代码回滚不等于已经恢复被写坏的数据。",
      },
    ],
    takeaway:
      "计划管动作，配置管运行，备份管数据，监控管发现，回滚管恢复，五者一起才构成上线门禁。",
  },
  syntax: {
    summary:
      "读上线清单时只追四类条件：线上依赖是否齐全、数据是否可恢复、异常如何被看见、达到什么阈值就回退。",
    notes: [
      {
        label: "requiredEnv: [...]",
        detail:
          "列出生产运行必需的变量名，只验证存在与权限，不把真实密钥值写进报告或前端。",
      },
      {
        label: "featureFlag: gradual-rollout",
        detail:
          "先让少量流量进入新功能，观察稳定后再扩大；开关也提供比整版回滚更快的止损手段。",
      },
      {
        label: "errorRate > 2%",
        detail:
          "把“出问题就回滚”改成可观察阈值，值守者不用事故发生后再争论是否严重。",
      },
      {
        label: "rollbackVerify",
        detail:
          "退回旧版本后重新检查登录、保存和 AI 调用，确认系统真的恢复，而不是部署命令退出码为 0。",
      },
    ],
    sequence: [
      "发布前核对计划、配置与数据保护。",
      "小范围放量并执行桌面、手机冒烟。",
      "上线后持续观察技术和业务信号。",
      "触发阈值时回滚并复测关键路径。",
    ],
    takeaway:
      "上线条件要能被检查，异常条件要能被度量，回滚结果要能被复测，不能只写一句“已准备”。",
  },
  "project-position": {
    summary:
      "上线门禁位于交付审查之后、真实用户流量之前，输入是已接收版本，输出是放行、灰度、暂缓或回滚决定。",
    notes: [
      {
        label: "release-plan.json",
        detail: "行动入口：固定窗口、负责人、影响范围、验证路径和沟通方式。",
      },
      {
        label: "environment / backup record",
        detail:
          "运行前证据：确认生产配置可用、密钥不泄露，并记录备份位置与恢复步骤。",
      },
      {
        label: "smoke-test / monitoring snapshot",
        detail:
          "发布后证据：桌面和 390px 走关键路径，同时观察 500、耗时、保存成功率等信号。",
      },
      {
        label: "rollback-plan.md",
        detail:
          "恢复出口：把触发条件、版本回退、数据处置和回退后验证交给值守者。",
      },
    ],
    sequence: [
      "已审查交付进入发布计划。",
      "计划交给生产配置和备份检查。",
      "发布流量交给冒烟与监控。",
      "健康则放行，异常则按条件回滚并复测。",
    ],
    takeaway:
      "第 14 章关心的不是代码能否构建，而是它进入生产后能否运行、被观察，并在失败时恢复。",
  },
  causality: {
    summary:
      "本地和构建都成功，上线仍可能失败，因为生产配置、真实数据、流量规模和运行信号都与开发电脑不同。",
    notes: [
      {
        label: "构建成功但线上缺 key",
        detail:
          "构建过程不一定调用 AI 服务；生产请求到来后才读取 AI_API_KEY，于是页面上线后运行时报错。",
      },
      {
        label: "代码回滚但数据没恢复",
        detail:
          "新版本已经把数据迁移或写坏，退回旧代码不会自动把表结构和用户记录还原，必须单独设计数据恢复。",
      },
      {
        label: "首页能开但主路径坏了",
        detail:
          "静态首页 200 不代表登录、保存、AI 调用可用；冒烟测试必须走真实关键业务链。",
      },
      {
        label: "有监控却没人行动",
        detail:
          "只有图表没有阈值、值守者和回滚动作，异常被看见也不会及时止损。",
      },
    ],
    sequence: [
      "先区分本地、构建和生产运行条件。",
      "检查代码与数据两条独立恢复路径。",
      "用真实业务冒烟和监控捕捉异常。",
      "达到阈值立即回滚并验证恢复。",
    ],
    takeaway:
      "上线事故常发生在代码之外；配置、数据、流量和响应机制都必须在发布前拥有证据和负责人。",
  },
};

const case15Remediation: RemediationLessonSet = {
  term: {
    summary:
      "面试表达不是背技术名词，而是用 STAR 组织现场，用故障复盘和技术取舍证明行动，用成长证据扛住追问。",
    notes: [
      {
        label: "STAR",
        detail:
          "Situation 讲必要背景，Task 讲你的目标，Action 讲你亲自做的判断和动作，Result 用证据说明结果。",
      },
      {
        label: "故障复盘",
        detail:
          "按现象、证据、根因、修复、验证和防复发讲排障，避免只说“有 bug，后来修好了”。",
      },
      {
        label: "技术取舍",
        detail:
          "说明约束下有哪些候选方案、为什么选择当前方案、付出什么代价、如何验证选择合理。",
      },
      {
        label: "成长证据与追问",
        detail:
          "代码、测试、日志、截图和原始复述是成长证据；追问用来检查你是否理解这些证据的边界。",
      },
    ],
    takeaway:
      "STAR 给结构，复盘给证据链，取舍给判断力，成长证据和追问共同证明这段经历确实属于你。",
  },
  syntax: {
    summary:
      "读面试稿时逐句判断它在回答 S、T、A、R 还是 Follow-up，并把空泛结论替换为可核对的工程事实。",
    notes: [
      {
        label: "S / T",
        detail:
          "用两三句固定用户现象、影响和你的责任，例如保存成功后刷新消失，目标是找到断点并给出可验证修复。",
      },
      {
        label: "A",
        detail:
          "写你如何沿 response.ok、HTTP 201、数据层和 SQLite SELECT 排查，而不是一句“我让 Agent 修了”。",
      },
      {
        label: "R",
        detail:
          "写修复后的刷新恢复、数据库记录和自动测试证据，同时诚实说明这只是学习沙盒而非线上业务指标。",
      },
      {
        label: "Follow-up",
        detail:
          "准备“为什么 201 不等于落库”“并发重复提交怎么办”等问题，用证据边界而非背诵继续回答。",
      },
    ],
    sequence: [
      "从 15 章产出中选一个岗位相关案例。",
      "用 STAR 压缩背景并突出自己的行动。",
      "给结果补测试、日志或浏览器证据。",
      "用追问检查取舍、边界和未验证部分。",
    ],
    takeaway:
      "面试稿中的每句都应承担结构或证据职责；删掉它不影响事实的句子，多半只是空泛包装。",
  },
  "project-position": {
    summary:
      "终章答辩厅接收前 14 章的真实产出，把分散的关卡记录加工成与 AI 开发岗位相关、可追问的项目故事。",
    notes: [
      {
        label: "story-bank.json",
        detail:
          "素材入口：按能力标签收集每章现象、证据、行动、验证和可迁移经验，不先写漂亮长文。",
      },
      {
        label: "star-draft / incident-review",
        detail:
          "结构加工：一个文件组织回答节奏，另一个守住排障证据链，二者不能互相替代。",
      },
      {
        label: "tradeoff-notes.json",
        detail:
          "判断证据：记录候选方案、约束、选择理由和代价，证明你不是只会复述最终代码。",
      },
      {
        label: "follow-up / answer-rubric",
        detail:
          "答辩出口：用追问暴露薄弱处，再检查回答是否具体、真实、相关且不过度声称掌握。",
      },
    ],
    sequence: [
      "关卡证据进入项目素材库。",
      "素材按 STAR 和故障复盘形成第一稿。",
      "技术取舍补上判断与代价。",
      "追问演练后形成可复用面试回答。",
    ],
    takeaway:
      "第 15 章不创造不存在的经历，而是把你已经留下的工程证据整理成招聘者能理解和追问的表达。",
  },
  causality: {
    summary:
      "面试回答让人听不懂或一追问就断，通常因为背景过长、行动没有自己、结果无证据，或把学习练习夸成生产经验。",
    notes: [
      {
        label: "只讲项目背景",
        detail:
          "花两分钟介绍产品，却没说你的任务、判断和动作，面试官无法识别你真正承担了什么。",
      },
      {
        label: "把工具当成自己的行动",
        detail:
          "“AI 帮我生成了代码”没有体现你如何给约束、审 Diff、验结果和处理风险。",
      },
      {
        label: "结果只有感觉",
        detail:
          "“效果变好了”无法复核；应说明哪个测试、日志、数据库结果或用户路径证明原问题消失。",
      },
      {
        label: "夸大经验边界",
        detail:
          "把本地沙盒说成大规模生产上线，一旦追问流量、指标和事故处置就会失真；诚实边界反而更专业。",
      },
    ],
    sequence: [
      "压缩背景并说清自己的责任。",
      "把 Agent 输出改写为自己的判断、约束和验收动作。",
      "为结果绑定真实工程证据。",
      "明确学习项目边界并准备进一步追问。",
    ],
    takeaway:
      "能站住的面试回答靠真实、具体、相关和可追问，不靠术语密度或夸大项目规模。",
  },
};

const chapterRemediationByScenario: Record<string, RemediationPath[]> = {
  "case-002": buildRemediationPaths(case02Remediation),
  "case-003-login-state": buildRemediationPaths(case03Remediation),
  "case-004-api-error": buildRemediationPaths(case04Remediation),
  "case-005-data-consistency": buildRemediationPaths(case05Remediation),
  "case-006-performance": buildRemediationPaths(case06Remediation),
  "case-007-ai-api": buildRemediationPaths(case07Remediation),
  "case-008-hallucination": buildRemediationPaths(case08Remediation),
  "case-009-rag": buildRemediationPaths(case09Remediation),
  "case-010-agent-tools": buildRemediationPaths(case10Remediation),
  "case-011-testing-proof": buildRemediationPaths(case11Remediation),
  "case-012-agent-brief": buildRemediationPaths(case12Remediation),
  "case-013-delivery-review": buildRemediationPaths(case13Remediation),
  "case-014-release-readiness": buildRemediationPaths(case14Remediation),
  "case-015-interview-review": buildRemediationPaths(case15Remediation),
};

export function withChapterRemediation(
  scenarioId: string,
  step: TeachingStep,
): TeachingStep {
  if (step.remediation?.length) return step;
  const remediation = chapterRemediationByScenario[scenarioId];
  return remediation ? { ...step, remediation } : step;
}
