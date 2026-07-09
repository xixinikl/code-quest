import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
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
import questArchive from "./assets/quest-archive.png";
import questPortal from "./assets/quest-portal.png";
import questStage from "./assets/quest-stage.png";
import questWorkbench from "./assets/quest-workbench.png";
import archiveKeeperPortrait from "./assets/portrait-archive-keeper.svg";
import apiClerkPortrait from "./assets/portrait-api-clerk.svg";
import keyVaultEquipment from "./assets/equipment-key-vault.svg";
import foglampCatPet from "./assets/pet-foglamp-cat.svg";
import identityGuardPortrait from "./assets/portrait-identity-guard.svg";
import idempotencyStonePet from "./assets/pet-idempotency-stone.svg";
import interviewCouncilorPortrait from "./assets/portrait-interview-councilor.svg";
import retrievalFoxPet from "./assets/pet-retrieval-fox.svg";
import mirrorEditorPortrait from "./assets/portrait-mirror-editor.svg";
import knowledgeKeeperPortrait from "./assets/portrait-knowledge-keeper.svg";
import modelWardenPortrait from "./assets/portrait-model-warden.svg";
import briefForgemasterPortrait from "./assets/portrait-brief-forgemaster.svg";
import deliveryJudgePortrait from "./assets/portrait-delivery-judge.svg";
import portalScribePortrait from "./assets/portrait-portal-scribe.svg";
import releaseGatekeeperPortrait from "./assets/portrait-release-gatekeeper.svg";
import testArbiterPortrait from "./assets/portrait-test-arbiter.svg";
import toolWardenPortrait from "./assets/portrait-tool-warden.svg";
import {
  type ConceptCard,
  type GlossaryEntry,
  type MapNode,
  type ProjectMap,
  type TeachingScenario,
  type TeachingStep,
  glossary,
} from "./teaching";
import { type DeveloperProfile } from "./careerProfile";

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

function scrollPageToTop() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// ============ 子组件 ============

type QuestClue = {
  id: string;
  label: string;
  action: string;
  result: string;
  skill: string;
  snippet?: string;
  question?: string;
  journeyIndex?: number;
};

type QuestTerm = {
  term: string;
  meaning: string;
};

type QuestJourneyItem = {
  sceneId: string;
  from: string;
  to: string;
  payload: string;
  proof: string;
  plain: string;
};

type QuestScene = {
  id: string;
  image: string;
  portrait?: string;
  place: string;
  title: string;
  speaker: string;
  dialogue: string;
  goal: string;
  mentor: string;
  terms?: QuestTerm[];
  clues: QuestClue[];
};

const questJourney: QuestJourneyItem[] = [
  {
    sceneId: "frontend-stage",
    from: "用户",
    to: "前端页面",
    payload: "点击保存，把画布名字交给页面",
    proof: "你能看到按钮变成“保存成功”",
    plain:
      "第一棒只是用户和页面之间的动作：用户点了保存，页面准备把这份数据送出去。",
  },
  {
    sceneId: "frontend-stage",
    from: "前端页面",
    to: "后端接口",
    payload: "POST /api/canvases 请求",
    proof: "Network 里看到 201 Created",
    plain:
      "response.ok 不是“继续传东西”，它是前端收到后端回信后做出的判断：这封回信看起来成功。",
  },
  {
    sceneId: "api-portal",
    from: "后端接口",
    to: "数据层函数",
    payload: "调用 saveCanvas(canvas)",
    proof: "路由拿到返回值后盖了 201 印章",
    plain: "接口像收件窗口：它接到前端请求，再把真正保存这件事交给数据层函数。",
  },
  {
    sceneId: "archive-vault",
    from: "数据层函数",
    to: "数据库",
    payload: "本来应该 INSERT 一行记录",
    proof: "SELECT 查询却是 0 行",
    plain:
      "问题就在这里：它没有把记录刻进数据库，只是放进了临时内存，所以刷新后会消失。",
  },
  {
    sceneId: "repair-bench",
    from: "修复方案",
    to: "验收证据",
    payload: "保存后刷新，再查数据库",
    proof: "刷新后仍能看到记录，测试通过",
    plain:
      "最后不是只改代码，而是证明这条路真的走通：页面、接口、数据库三边都对上。",
  },
];

const canvasStormJourney: QuestJourneyItem[] = [
  {
    sceneId: "cs-brief",
    from: "用户",
    to: "Project Brief",
    payload: "项目、用户、阶段、约束",
    proof: "AI 有了具体背景",
    plain: "先把问题说清楚，AI 才不会泛泛而谈。",
  },
  {
    sceneId: "cs-direction",
    from: "Project Brief",
    to: "方向选择",
    payload: "选择 MVP、痛点、增长等问题类型",
    proof: "候选开始围绕一个方向生成",
    plain: "不是让 AI 多说，而是先规定它要回答哪类问题。",
  },
  {
    sceneId: "cs-direction",
    from: "AI 候选",
    to: "用户筛选",
    payload: "保留、待定、放弃",
    proof: "执行草案只吸收被保留的候选",
    plain: "AI 给建议，人做取舍，这才像真实产品工作流。",
  },
  {
    sceneId: "cs-session",
    from: "页面状态",
    to: "会话档案",
    payload: "PUT /api/sessions/:id",
    proof: "data/*.json 保存了这次工作台记录",
    plain: "用户的思考过程要能保存，刷新后还在，产品才可信。",
  },
  {
    sceneId: "cs-ai-status",
    from: "后端环境变量",
    to: "前端状态灯",
    payload: "只告诉是否配置 AI，不暴露 API Key",
    proof: "/api/storm/status 不返回密钥",
    plain: "AI 能力可以展示给用户，密钥必须留在后端。",
  },
];

const questScenes: QuestScene[] = [
  {
    id: "frontend-stage",
    image: questStage,
    portrait: archiveKeeperPortrait,
    place: "前端舞台",
    title: "灯亮了，但戏还没演完",
    speaker: "舞台记录员",
    dialogue:
      "观众席爆出掌声：保存按钮亮起绿色。可向导把你拉到幕侧：舞台上的光，只能证明演员说了台词，不能证明档案真的入库。",
    goal: "找出前端为什么相信“保存成功”。",
    mentor:
      "先别怀疑所有代码。只看舞台上的两件东西：按钮何时亮起，以及它相信了谁。",
    terms: [
      {
        term: "前端",
        meaning:
          "用户能看到和点击的页面。它负责展示结果，但不等于真的保存成功。",
      },
      {
        term: "response.ok",
        meaning:
          "它不是传东西的人，而是前端收到后端回信后的判断：状态码是 2xx，所以页面先亮绿灯。",
      },
    ],
    clues: [
      {
        id: "frontend-ok",
        label: "检查绿色灯牌",
        action: "查看 SaveCanvasButton.jsx 的保存逻辑",
        result:
          "前端先把数据发给后端接口。等后端回了 201，response.ok 变成 true，页面就显示成功；但它没有再去确认数据库里是不是真的多了一行。",
        snippet:
          "用户点击保存\n  -> 前端 fetch('/api/canvases')\n  -> 后端回 201\n  -> response.ok === true\n  -> 页面显示“保存成功”",
        question:
          "先记住一句：页面亮绿灯，只能说明它收到了成功回信，不等于数据库已经保存。",
        journeyIndex: 1,
        skill: "学会区分“界面反馈”和“真实副作用”。",
      },
      {
        id: "frontend-fetch",
        label: "追踪发出的委托",
        action: "观察 fetch POST /api/canvases",
        result:
          "舞台把“要保存的画布数据”交给传送门，也就是 POST /api/canvases。舞台本身不知道传送门另一端有没有真的把数据刻进档案馆。",
        snippet:
          "前端页面\n  --画布数据--> POST /api/canvases\n  <--201 Created-- 后端接口",
        question:
          "所以这里先不要问“数据库在哪”，先看清：前端只负责发请求和看回信。",
        journeyIndex: 1,
        skill: "知道前端只负责发请求和呈现结果。",
      },
    ],
  },
  {
    id: "api-portal",
    image: questPortal,
    portrait: portalScribePortrait,
    place: "传送门大厅",
    title: "201 印章不是档案收据",
    speaker: "传送门守卫",
    dialogue:
      "传送门吐回一枚金色印章：201 Created。守卫说它代表“请求已被接待”，但你不能把接待印章当成档案馆的入库凭证。",
    goal: "理解 HTTP 状态码的证据边界。",
    mentor: "看到 201 先别高兴。问一句：谁发的章？它能证明哪一层的事实？",
    terms: [
      {
        term: "接口",
        meaning: "前端和后端说话的入口。这里是 POST /api/canvases。",
      },
      {
        term: "HTTP 201",
        meaning: "接口层的“我接待了创建请求”，不是数据库写入收据。",
      },
    ],
    clues: [
      {
        id: "route-call",
        label: "查看传送门回执",
        action: "阅读路由如何 return 201",
        result:
          "路由收到 POST 后，把保存动作交给 saveCanvas。saveCanvas 返回后，路由就给前端 201。这里能证明接口有回应，但还不能证明数据库写入了。",
        snippet:
          "POST /api/canvases\n  -> canvasRoutes 调 saveCanvas(canvas)\n  -> 路由返回 201 Created",
        question:
          "这一关的重点：后端接口也只是中间人，它还要继续把保存动作交给数据层。",
        journeyIndex: 2,
        skill: "学会给证据划边界：状态码属于接口层。",
      },
      {
        id: "route-limit",
        label: "审问守卫的证词",
        action: "比较“已创建”和“已落库”",
        result:
          "201 是传送门口头回执。它像“我收到了你的申请”，不是“你的档案已经放进库里”。真正的落库证据必须来自数据库查询。",
        snippet:
          "201 能证明：接口回复了\n201 不能证明：数据库里已经有记录\n要证明落库：看 SELECT 查询结果",
        question: "你不用背状态码，只要分清：接口回信和数据库证据不是一回事。",
        journeyIndex: 2,
        skill: "面试时能解释为什么不能只用 Network 证明修复。",
      },
    ],
  },
  {
    id: "archive-vault",
    image: questArchive,
    portrait: archiveKeeperPortrait,
    place: "档案库深处",
    title: "空格位揭穿了真相",
    speaker: "档案馆管理员",
    dialogue:
      "你终于走进档案库。所有晶格都安静发光，唯独新画布应该出现的位置空着。灯亮、印章、日志都在，唯独档案没有。",
    goal: "用数据库证据判断根因。",
    mentor: "现在不要再听谁说成功。看档案架上有没有那一行记录。",
    terms: [
      {
        term: "数据库",
        meaning: "真正长期存数据的地方。刷新、重启后还能查到，才算保存住。",
      },
      {
        term: "SELECT",
        meaning: "数据库查询语句。SELECT 0 行，说明档案馆里没有这条记录。",
      },
    ],
    clues: [
      {
        id: "db-zero",
        label: "照亮空档案格",
        action: "查看 SELECT * FROM canvases 的结果",
        result: "查询结果是 0 行。它直接证明数据库没有收到这次保存。",
        snippet: "保存后查数据库：\nSELECT * FROM canvases;\n结果：0 rows",
        question:
          "这就是反证：前面都说成功，但档案馆里没有记录，所以成功只是表面成功。",
        journeyIndex: 3,
        skill: "掌握最强证据：数据库查询结果。",
      },
      {
        id: "source-split",
        label: "比对读写路径",
        action: "比较 saveCanvas 和 listCanvases",
        result:
          "保存时写进 pendingCanvases 这个临时内存数组，读取时却查 SQLite 数据库。写在 A 地方，读去 B 地方，所以刷新后看不到。",
        snippet:
          "写入：saveCanvas -> pendingCanvases 内存数组\n读取：listCanvases -> SQLite 数据库\n问题：写和读不在同一个地方",
        question:
          "这就是整条流程的根因：不是按钮错了，而是数据最后没有走到数据库。",
        journeyIndex: 3,
        skill: "能把故障讲成清晰因果链。",
      },
    ],
  },
  {
    id: "repair-bench",
    image: questWorkbench,
    portrait: archiveKeeperPortrait,
    place: "修复台",
    title: "把临时记忆刻进档案馆",
    speaker: "向导",
    dialogue:
      "所有线索都指向同一处断裂：对象只是放在临时白板上，没有刻进档案馆。现在你要做的不是猜，而是把证据转成修复动作。",
    goal: "形成修复方案和面试复盘。",
    mentor:
      "真正的通关不是点亮按钮，而是能说清：现象、证据、根因、修改、验证。",
    terms: [
      {
        term: "持久化",
        meaning: "把临时数据写进数据库或文件，让它刷新和重启后还存在。",
      },
      {
        term: "INSERT",
        meaning: "数据库写入语句。修复的核心就是让保存动作真正执行 INSERT。",
      },
    ],
    clues: [
      {
        id: "insert-plan",
        label: "铸造 INSERT 符文",
        action: "在 saveCanvas 中加入真实数据库写入",
        result:
          "修复方向：创建 canvas 后执行 INSERT，把 id、name、createdAt 写进 canvases 表。",
        snippet:
          "修复前：saveCanvas -> pendingCanvases\n修复后：saveCanvas -> INSERT INTO canvases (...)",
        question: "修复不是让按钮更像成功，而是让数据真的走到数据库。",
        journeyIndex: 4,
        skill: "能把根因转化为具体代码改动。",
      },
      {
        id: "verification-plan",
        label: "封存验收仪式",
        action: "保存后刷新并运行测试",
        result:
          "验收方式：再次保存、刷新后列表仍存在，并用测试证明数据库查询能读到记录。",
        snippet:
          "验收路线：\n保存一次 -> 刷新页面 -> 列表还在\n再查数据库 -> 能 SELECT 到这一行",
        question: "最后你要能讲清：我怎么证明它真的修好了。",
        journeyIndex: 4,
        skill: "形成可用于求职面试的项目复盘。",
      },
    ],
  },
];

const canvasStormScenes: QuestScene[] = [
  {
    id: "cs-brief",
    image: questStage,
    portrait: portalScribePortrait,
    place: "Project Brief 前台",
    title: "先把项目说清楚",
    speaker: "工作台接待员",
    dialogue:
      "真实项目 CanvasStorm 不是让 AI 随便出点子。用户先写项目、目标用户、阶段和约束，AI 才知道该往哪里发散。",
    goal: "理解 CanvasStorm 的真实业务入口：Project Brief。",
    mentor:
      "如果这里没写清楚，后面生成的候选就会很空泛。你先学会看“输入背景”是否足够。",
    terms: [
      {
        term: "Project Brief",
        meaning: "项目背景卡：项目想做什么、给谁用、现在什么阶段、不能做什么。",
      },
      {
        term: "约束",
        meaning: "明确不做什么。比如先不做多人协作、不做大而全项目管理。",
      },
    ],
    clues: [
      {
        id: "brief-fields",
        label: "先看背景卡",
        action: "项目、用户、阶段、约束分别是什么",
        result:
          "CanvasStorm 的真实入口不是“让 AI 随便想”，而是先把项目背景写成一张 Brief。AI 要先知道项目是谁用、现在到哪一步、哪些事先不做。",
        snippet:
          "项目：CanvasStorm 功能拓展工作台\n用户：有一个产品想法，但不知道下一步做什么的人\n阶段：从功能想法走到可执行草案\n约束：先本地保存，不做账号系统和大而全项目管理",
        question:
          "你这一章只要记住：AI 输出不好，常常不是模型笨，而是输入背景太空。",
        skill: "学会判断 AI 功能的第一步：输入背景是否清楚。",
      },
      {
        id: "brief-risk",
        label: "为什么会空泛",
        action: "把空输入和具体输入放在一起比较",
        result:
          "如果 Brief 只写“帮我想功能”，AI 不知道产品阶段和目标用户，就只能说“提升效率、优化体验”这种空话。Brief 越具体，候选越像真的能执行。",
        snippet:
          "空泛输入：帮我想一些功能\n可用输入：给初学者做 AI 开发学习工具，目标是求职复盘，当前只做本地单机版",
        question:
          "面试里可以这样讲：我先定义输入结构，避免 AI 生成不可落地的泛化建议。",
        skill: "理解 Prompt 不是魔法，背景越具体，输出越可用。",
      },
    ],
  },
  {
    id: "cs-direction",
    image: questPortal,
    portrait: portalScribePortrait,
    place: "方向选择大厅",
    title: "不是多生成，而是选方向",
    speaker: "方向守卫",
    dialogue:
      "CanvasStorm 把发散拆成 MVP、用户痛点、增长获客、留存复用、商业化、技术实现、风险验证。每个方向问的是不同问题。",
    goal: "理解为什么产品要先选方向，再让 AI 生成候选。",
    mentor:
      "很多 AI 工具失败，是因为它只会给一堆点子。这个项目真正有价值的是：先限制方向，再做取舍。",
    terms: [
      {
        term: "MVP",
        meaning: "最小可验证版本。先做最少功能，看用户是否真的需要。",
      },
      {
        term: "候选",
        meaning: "AI 给出的可选方案，不是命令。用户要保留、待定或放弃。",
      },
    ],
    clues: [
      {
        id: "direction-list",
        label: "翻开方向罗盘",
        action: "MVP、痛点、增长、留存等分别问什么",
        result:
          "每个方向都不是装饰标签，而是在问一个不同的产品问题：先做什么、用户哪里痛、怎么验证、怎么增长、怎么留住用户。",
        snippet:
          "MVP：先做最小可验证功能\n用户痛点：用户现在哪里卡住\n技术实现：这个想法怎么落到代码\n风险验证：最容易失败的假设是什么",
        question: "你不用背七个词，只要知道：先选问题类型，再让 AI 给候选。",
        skill: "学会把“让 AI 想一想”改成“让 AI 按方向解决问题”。",
      },
      {
        id: "choice-meaning",
        label: "筛候选不是全都要",
        action: "保留、待定、放弃分别代表什么",
        result:
          "候选看板不是答案板。保留代表这轮要推进，待定代表信息还不够，放弃代表本轮明确不做。产品能力很大一部分就是取舍。",
        snippet:
          "保留 -> 进入执行草案\n待定 -> 暂不进入当前版本\n放弃 -> 明确排除，避免范围失控",
        question:
          "求职复盘可以讲：我不是让 AI 多生成，而是设计了筛选动作，让用户做决策。",
        skill: "理解产品决策不是加功能，而是做取舍。",
      },
    ],
  },
  {
    id: "cs-session",
    image: questArchive,
    portrait: archiveKeeperPortrait,
    place: "会话档案库",
    title: "用户的选择不能丢",
    speaker: "档案管理员",
    dialogue:
      "用户填了 Brief、筛了候选、生成了执行草案。如果刷新后全没了，这个工具就不可信。所以 CanvasStorm 用 /api/sessions 保存会话到 data/*.json。",
    goal: "理解真实项目里的会话保存和持久化。",
    mentor:
      "这比抽象讲 Session 更好懂：一次工作台记录就是一个会话。保存它，就是把用户的思考过程放进档案库。",
    terms: [
      {
        term: "会话 Session",
        meaning:
          "这里指一次工作台记录：Brief、方向、候选、保留/放弃、执行草案。",
      },
      {
        term: "持久化",
        meaning: "保存到 data 目录的 JSON 文件。刷新后还能恢复，才叫持久化。",
      },
      {
        term: "localStorage",
        meaning: "浏览器本地小仓库。可做降级，但换设备或清缓存会丢。",
      },
    ],
    clues: [
      {
        id: "session-api",
        label: "追踪保存路线",
        action: "从页面状态追到 data 文件",
        result:
          "用户填 Brief、筛候选、写草案，这些都属于一次会话。页面状态变化后触发保存，请求后端 sessions API，再写到 data 目录的 JSON 文件。",
        snippet:
          "页面状态改变\n  -> scheduleSave()\n  -> PUT /api/sessions/:id\n  -> server 写入 data/*.json",
        question: "这就是你之前 1-1 学过的持久化：刷新后还在，才是真的保存。",
        skill: "理解真实项目的数据保存链路：前端状态 → API → 文件。",
      },
      {
        id: "fallback",
        label: "看懂备用仓库",
        action: "localStorage 为什么只能兜底",
        result:
          "后端保存才是主路线。localStorage 像浏览器里的临时抽屉，适合兜底和草稿，但清缓存、换浏览器、换设备都可能丢。",
        snippet:
          "优先：后端 sessions API -> data/*.json\n备用：localStorage -> 只在当前浏览器里保存",
        question: "面试里不要只说“用了 localStorage”，要能说清它的边界。",
        skill: "知道为什么不能只靠浏览器本地存储承载正式数据。",
      },
    ],
  },
  {
    id: "cs-ai-status",
    image: questWorkbench,
    portrait: portalScribePortrait,
    place: "AI 状态台",
    title: "连上 AI，也不能泄露钥匙",
    speaker: "安全记录员",
    dialogue:
      "CanvasStorm 会调用 DeepSeek 生成候选，但前端不能看到 API Key。它只通过 /api/storm/status 显示“AI 已连接”或“本地示例”。",
    goal: "理解 AI 功能里的安全边界和降级体验。",
    mentor:
      "用户只需要知道 AI 能不能用，不需要也不应该看到密钥。AI 不可用时，项目还要有本地模板兜底。",
    terms: [
      {
        term: "API Key",
        meaning: "调用 AI 服务的密钥。它只能放后端环境变量，不能暴露给浏览器。",
      },
      {
        term: "降级",
        meaning: "外部 AI 不可用时，用本地模板继续演示核心流程。",
      },
    ],
    clues: [
      {
        id: "status-api",
        label: "检查 AI 灯塔",
        action: "前端能看到什么，不能看到什么",
        result:
          "状态接口只告诉前端 AI 是否可用、当前模型是什么，不把 API Key 交给浏览器。用户需要状态反馈，密钥必须留在后端。",
        snippet:
          'GET /api/storm/status\n返回：{ configured: true, model: "deepseek-chat" }\n不返回：API Key',
        question: "AI 应用开发很重要的一条线：能力可以展示，密钥不能暴露。",
        skill: "掌握 AI 应用开发的安全边界：密钥不上前端。",
      },
      {
        id: "fallback-template",
        label: "AI 熄灯后怎么办",
        action: "外部服务失败时，主流程如何继续",
        result:
          "AI 不可用时，CanvasStorm 用本地模板生成示例候选。这样用户仍然能体验“写 Brief、选方向、筛候选、出草案”的主流程。",
        snippet:
          "DeepSeek 可用 -> 调 AI 生成候选\nDeepSeek 不可用 -> 本地模板生成示例\n共同目标 -> 主流程不断掉",
        question: "这叫降级体验：外部服务坏了，产品仍然能让用户走完核心路径。",
        skill: "理解工程化体验：外部服务失败时，主流程不能直接崩。",
      },
    ],
  },
];

const loginStateJourney: QuestJourneyItem[] = [
  {
    sceneId: "login-gate",
    from: "用户",
    to: "登录表单",
    payload: "输入账号密码并提交",
    proof: "Network 里出现 POST /login",
    plain:
      "第一棒只是用户把身份材料交给页面。页面还没有证明你真的拥有一张通行证。",
  },
  {
    sceneId: "login-gate",
    from: "登录表单",
    to: "后端登录路由",
    payload: "POST /login 请求",
    proof: "后端返回 200，并设置 Cookie",
    plain: "登录成功不是前端自己说了算，而是后端校验后发回一张凭证。",
  },
  {
    sceneId: "cookie-portal",
    from: "后端登录路由",
    to: "浏览器 Cookie",
    payload: "Set-Cookie: sessionId=token",
    proof: "Application 面板能看到 Cookie",
    plain:
      "Cookie 像贴在浏览器门口的门牌。它负责以后每次请求时把 token 带回去。",
  },
  {
    sceneId: "session-vault",
    from: "浏览器 Cookie",
    to: "后端验证路由",
    payload: "GET /me 携带 sessionId",
    proof: "Network 请求头里能看到 Cookie",
    plain:
      "验证路由会拿 Cookie 里的 token 去后端 Session 仓库查：查得到才算仍然登录。",
  },
  {
    sceneId: "expiry-bench",
    from: "Session 仓库",
    to: "401 响应",
    payload: "serverSessions[token] 查不到",
    proof: "刷新或重启后 GET /me 返回 401",
    plain:
      "如果 token 只放在内存，服务重启就像仓库失火。浏览器还拿着门牌，但后端已经不认识它。",
  },
];

const loginStateScenes: QuestScene[] = [
  {
    id: "login-gate",
    image: questPortal,
    portrait: identityGuardPortrait,
    place: "身份回廊入口",
    title: "门牌发出来了，但谁来认它？",
    speaker: "回廊守卫",
    dialogue:
      "你刚输入账号密码，回廊立刻亮起绿灯。守卫递来一张门牌，却提醒你：门牌本身不是身份，后端愿意认它，才算登录还在。",
    goal: "理解登录成功时，前端、后端和凭证各自做了什么。",
    mentor:
      "先别背 Cookie 和 Session。把它们想成门牌和登记册：门牌在浏览器，登记册在后端。",
    terms: [
      {
        term: "Token",
        meaning: "一串临时身份编号。浏览器之后拿它证明“我是刚才登录过的人”。",
      },
      {
        term: "Cookie",
        meaning:
          "浏览器会自动保存和携带的小纸条。后端可以通过 Set-Cookie 发给浏览器。",
      },
    ],
    clues: [
      {
        id: "login-post",
        label: "查看登录委托",
        action: "观察 POST /login",
        result:
          "用户提交账号密码后，前端把材料交给 POST /login。后端校验通过才生成 token，并通过 Set-Cookie 让浏览器保存它。",
        snippet:
          "用户输入账号密码\n  -> 前端 POST /login\n  -> 后端生成 token\n  -> Set-Cookie: sessionId=token",
        question:
          "所以登录不是页面自己记住你，而是后端发了一张以后可验证的凭证。",
        journeyIndex: 1,
        skill: "知道登录成功来自后端回信，而不是只看页面状态。",
      },
      {
        id: "front-state-limit",
        label: "拆开页面状态",
        action: "比较页面显示和凭证保存",
        result:
          "页面可以显示“已登录”，但刷新后能不能继续登录，要看浏览器是否带着 Cookie，以及后端还能不能查到对应 Session。",
        snippet:
          "页面状态：isLoggedIn = true\n真正验证：Cookie -> GET /me -> 后端查 Session",
        question:
          "前端状态像临时贴纸，刷新可能重置；凭证链路才是判断登录态的主线。",
        journeyIndex: 0,
        skill: "区分 UI 状态和真实登录凭证。",
      },
    ],
  },
  {
    id: "cookie-portal",
    image: questStage,
    portrait: identityGuardPortrait,
    place: "Cookie 传送门",
    title: "浏览器替你把门牌带回去",
    speaker: "传送门记录员",
    dialogue:
      "你没有手动把 token 塞进每个请求，但传送门会在同站请求里自动携带 Cookie。问题是：带回去，不等于后端一定认得。",
    goal: "理解 Cookie 的作用和证据来源。",
    mentor:
      "看 Application 证明 Cookie 有没有保存，看 Network 证明请求有没有带上它。",
    terms: [
      {
        term: "Application 面板",
        meaning:
          "浏览器开发者工具里查看 Cookie、localStorage 等本地存储的地方。",
      },
      {
        term: "Network 请求头",
        meaning: "一次请求真实带了哪些信息。Cookie 是否发送，要在这里确认。",
      },
    ],
    clues: [
      {
        id: "cookie-saved",
        label: "查看门牌是否收好",
        action: "打开 Application → Cookies",
        result:
          "如果能看到 sessionId，说明浏览器确实收到了后端给的门牌。它只能证明浏览器保存了凭证，不能证明后端仓库还认得这张门牌。",
        snippet: "Application / Cookies\nsessionId = abc123",
        question: "Cookie 是浏览器侧证据，不是服务端 Session 仍存在的证据。",
        journeyIndex: 2,
        skill: "会判断 Cookie 是否被保存。",
      },
      {
        id: "cookie-sent",
        label: "追踪门牌是否带回",
        action: "查看 GET /me 的请求头",
        result:
          "GET /me 请求头里带着 Cookie，说明浏览器把门牌交回了后端。下一步要看后端拿这张门牌去哪里查。",
        snippet: "GET /me\nRequest Headers:\nCookie: sessionId=abc123",
        question: "带了 Cookie 还 401，通常要继续查后端验证逻辑。",
        journeyIndex: 3,
        skill: "会用 Network 判断凭证是否随请求发送。",
      },
    ],
  },
  {
    id: "session-vault",
    image: questArchive,
    portrait: identityGuardPortrait,
    place: "Session 登记库",
    title: "登记册一清空，门牌就失效",
    speaker: "档案管理员",
    dialogue:
      "档案柜里不是用户资料，而是一张 token 到用户身份的登记表。如果这张表只写在内存里，服务重启时它会整本消失。",
    goal: "理解 Session 存在后端，以及为什么内存 Session 会丢。",
    mentor:
      "这一章的根因不是 Cookie 坏了，而是后端把登记册放在会被擦掉的地方。",
    terms: [
      {
        term: "Session",
        meaning: "后端保存的登录记录：某个 token 对应哪个用户、什么时候过期。",
      },
      {
        term: "内存",
        meaning:
          "程序运行时的临时空间。服务重启后会重新初始化，不能当长期仓库。",
      },
    ],
    clues: [
      {
        id: "session-memory",
        label: "检查登记册材质",
        action: "阅读 serverSessions[token]",
        result:
          "登录路由把 token 存进 serverSessions 这个内存对象。只要 Node 服务重启，这个对象就回到空状态。",
        snippet:
          "const serverSessions = {};\nserverSessions[token] = { userId, expires };",
        question:
          "这和第一章很像：临时内存可以让当下看起来成功，但不能跨重启保存事实。",
        journeyIndex: 4,
        skill: "能解释为什么内存 Session 会失效。",
      },
      {
        id: "verify-read",
        label: "看验证路由查什么",
        action: "阅读 GET /me",
        result:
          "验证路由从 Cookie 里取 sessionId，再查 serverSessions[token]。查不到就返回 401，所以浏览器还带着 Cookie 也没用。",
        snippet:
          "const token = req.cookies.sessionId;\nconst session = serverSessions[token];\nif (!session) return res.status(401).end();",
        question:
          "401 的意思不是“用户一定没登录过”，而是“这次请求没有通过后端验证”。",
        journeyIndex: 4,
        skill: "能把 401 解释成验证失败，而不是简单报错。",
      },
    ],
  },
  {
    id: "expiry-bench",
    image: questWorkbench,
    portrait: identityGuardPortrait,
    place: "过期与验收台",
    title: "修复登录态，要证明两件事",
    speaker: "向导",
    dialogue:
      "你已经知道断点在登记册。真正的修复不是让页面少刷新，而是设计凭证保存、过期策略和 401 提示，再用证据复测。",
    goal: "形成登录态修复和面试复盘口径。",
    mentor:
      "面试官不只问 Cookie 是什么，还会问：你怎么证明登录态真的稳定？过期后用户看到什么？",
    terms: [
      {
        term: "401",
        meaning:
          "未通过身份验证。常见原因是没带凭证、凭证过期、后端查不到 Session。",
      },
      {
        term: "过期时间",
        meaning: "凭证应该有失效规则，避免永久有效带来安全风险。",
      },
    ],
    clues: [
      {
        id: "fix-options",
        label: "制定修复路线",
        action: "比较持久 Session 和短期 Token",
        result:
          "修复方向可以是把 Session 存进可持久化存储，也可以采用可验证的短期 token 策略。无论哪种，都要明确过期和退出登录。",
        snippet:
          "目标：刷新后仍登录\n边界：过期后返回登录页\n验收：Application + Network + 后端日志三处对上",
        question:
          "不要只说“用 JWT 就好了”。要说清存哪里、何时过期、失败怎么提示。",
        journeyIndex: 4,
        skill: "能把登录态方案讲成工程取舍。",
      },
      {
        id: "acceptance-proof",
        label: "封存验收证据",
        action: "设计复测清单",
        result:
          "复测要包含：登录后刷新仍通过 GET /me；清除 Cookie 后返回 401；过期后跳回登录页；日志能对应同一次请求。",
        snippet:
          "1. POST /login -> 200 + Cookie\n2. 刷新 -> GET /me -> 200\n3. 清 Cookie -> GET /me -> 401\n4. 过期 -> 回登录页并给提示",
        question:
          "这一关的面试产出：我能解释登录态链路，也能给出可验证的异常路径。",
        journeyIndex: 4,
        skill: "能写出登录态验收清单。",
      },
    ],
  },
];

const apiErrorJourney: QuestJourneyItem[] = [
  {
    sceneId: "api-court-gate",
    from: "用户",
    to: "前端表单",
    payload: "点击提交，把字段交给页面",
    proof: "页面触发 submitProject",
    plain: "第一棒只是用户发起动作。排接口错误时，先看页面到底准备了哪些字段。",
  },
  {
    sceneId: "api-court-gate",
    from: "前端表单",
    to: "接口路由",
    payload: "POST /api/projects + JSON body",
    proof: "Network 能看到 Payload",
    plain: "Network 的 Payload 像申请表复印件。它能证明前端实际交了什么材料。",
  },
  {
    sceneId: "validation-bench",
    from: "接口路由",
    to: "参数校验",
    payload: "检查 title、ownerId 等字段",
    proof: "400 + 结构化错误响应",
    plain: "400 常常不是系统炸了，而是材料不符合接口契约。先查请求体和响应体。",
  },
  {
    sceneId: "log-archive",
    from: "后端处理",
    to: "日志档案",
    payload: "path、field、requestId、异常信息",
    proof: "日志时间和 Network 请求对上",
    plain:
      "日志不是单独看的，要和 Network 的时间、路径或 requestId 对成同一次请求。",
  },
  {
    sceneId: "error-verdict",
    from: "修复方案",
    to: "验收证据",
    payload: "合法输入成功，错误输入有清晰提示",
    proof: "400/500 路径都有测试或手动复测",
    plain: "接口错误修复不是让红字消失，而是让正确路径成功、错误路径可解释。",
  },
];

const apiErrorScenes: QuestScene[] = [
  {
    id: "api-court-gate",
    image: questPortal,
    portrait: apiClerkPortrait,
    place: "接口审判庭入口",
    title: "红色状态码不是一句“坏了”",
    speaker: "审判庭书记员",
    dialogue:
      "前端递交了一份项目申请，审判庭却盖回一枚红章。书记员提醒你：红章不等于所有地方都坏了，它只是告诉你先查哪一层。",
    goal: "理解接口失败要先看请求体、状态码和响应体。",
    mentor:
      "不要一看到报错就改代码。先问：前端交了什么？接口回了什么？状态码指向哪一类问题？",
    terms: [
      {
        term: "请求体 Payload",
        meaning:
          "前端交给后端的材料。创建项目时，通常是 JSON 里的 title、ownerId 等字段。",
      },
      {
        term: "状态码",
        meaning:
          "接口给这次请求盖的章。400 偏向请求材料问题，500 偏向后端处理异常。",
      },
    ],
    clues: [
      {
        id: "payload-copy",
        label: "查看申请表复印件",
        action: "打开 Network Payload",
        result:
          "Payload 能证明前端实际发了哪些字段。比如 title 是空字符串，后端返回 400 就很可能是参数校验拒绝。",
        snippet:
          'POST /api/projects\nPayload: { "title": "", "ownerId": "u_01" }\nResponse: 400 TITLE_REQUIRED',
        question: "第一步不要猜后端。先用 Network 看清前端到底交了什么材料。",
        journeyIndex: 1,
        skill: "会用 Network 请求体判断前端传参是否符合接口契约。",
      },
      {
        id: "status-direction",
        label: "解读红色印章",
        action: "比较 400、401、500",
        result:
          "400 通常表示请求不合格，401 是身份没通过，500 是后端处理内部失败。状态码不是最终答案，但能决定排查方向。",
        snippet:
          "400 -> 先查请求参数和校验\n401 -> 先查登录态和权限\n500 -> 先查后端日志和异常栈",
        question: "学会这一步，你就不会把所有红色请求都混成“接口坏了”。",
        journeyIndex: 2,
        skill: "能根据状态码选择第一排查方向。",
      },
    ],
  },
  {
    id: "validation-bench",
    image: questStage,
    portrait: apiClerkPortrait,
    place: "参数校验席",
    title: "材料不合格，要说明哪一项不合格",
    speaker: "校验官",
    dialogue:
      "校验官不接受一张空白申请，却也不能只喊“bad request”。好的接口会告诉前端：哪个字段错了，用户应该怎么改。",
    goal: "理解结构化错误响应为什么重要。",
    mentor:
      "前端要做清晰提示，后端就要给清楚错误。只返回 failed，会让用户和开发者都迷路。",
    terms: [
      {
        term: "400",
        meaning: "Bad Request。请求材料不符合接口要求，常见于必填字段缺失。",
      },
      {
        term: "错误响应结构",
        meaning:
          "用 code、field、message 等字段描述错误，让前端能准确展示提示。",
      },
    ],
    clues: [
      {
        id: "field-error",
        label: "检查字段级提示",
        action: "阅读响应体",
        result:
          "结构化错误会告诉前端 code、field 和 message。这样页面能把“项目名称不能为空”放到 title 输入框旁边。",
        snippet:
          "{\n  code: 'TITLE_REQUIRED',\n  field: 'title',\n  message: '项目名称不能为空'\n}",
        question:
          "好的错误不是为了开发者好看，是为了让用户知道下一步怎么修正。",
        journeyIndex: 2,
        skill: "知道结构化错误响应如何影响前端体验。",
      },
      {
        id: "route-branch",
        label: "追踪路由分支",
        action: "阅读 POST /api/projects",
        result:
          "路由先检查 title，没有就直接返回 400；只有参数合法，才继续 createProject。这能避免无效数据进入业务层。",
        snippet:
          "if (!title) {\n  return res.status(400).json({ code: 'TITLE_REQUIRED', message: '项目名称不能为空' });\n}\nconst project = await createProject(...);",
        question:
          "这就是接口契约：不合格的输入要被挡在入口，而不是等数据库报错。",
        journeyIndex: 2,
        skill: "能看懂后端参数校验如何产生 400。",
      },
    ],
  },
  {
    id: "log-archive",
    image: questArchive,
    portrait: apiClerkPortrait,
    place: "后端日志档案库",
    title: "日志要和同一次请求对上",
    speaker: "日志管理员",
    dialogue:
      "档案库里塞满了错误记录。管理员不会让你随便拿一条当证据：你得用路径、时间或 requestId 证明它就是刚才那次失败。",
    goal: "理解日志如何补足 Network 看不到的后端原因。",
    mentor:
      "Network 告诉你前台收到了什么回信；日志告诉你后台为什么这么回。两边要对上。",
    terms: [
      {
        term: "requestId",
        meaning:
          "一次请求的编号。前端、后端日志都带同一个编号时，排障会更可靠。",
      },
      {
        term: "500",
        meaning: "服务端内部错误。要继续看后端异常日志，不能只停在状态码。",
      },
    ],
    clues: [
      {
        id: "log-match",
        label: "匹配同一次请求",
        action: "对齐时间、路径和 requestId",
        result:
          "Network 看到 POST /api/projects 返回 500，日志同一时间出现同一路径和 requestId，就能证明这条日志对应这次用户操作。",
        snippet:
          "Network: POST /api/projects 500 requestId=req_42\nLog: req_42 TypeError: Cannot read properties of undefined",
        question: "排障证据要能互相咬合。拿错日志，比没有日志更危险。",
        journeyIndex: 3,
        skill: "会把前端失败和后端日志连成同一条证据链。",
      },
      {
        id: "log-quality",
        label: "判断日志是否有用",
        action: "比较 vague log 和 useful log",
        result:
          "只写 failed 没什么帮助。有用日志至少包含路径、关键字段、错误 code 或 requestId，方便复现和搜索。",
        snippet:
          "差：console.log('failed')\n好：logger.warn({ path, field: 'title', requestId }, 'validation failed')",
        question: "面试里可以讲：我不只处理报错，还补了可定位的日志上下文。",
        journeyIndex: 3,
        skill: "能解释什么样的日志才对排障有帮助。",
      },
    ],
  },
  {
    id: "error-verdict",
    image: questWorkbench,
    portrait: apiClerkPortrait,
    place: "错误判决台",
    title: "修复接口，要同时验收成功和失败",
    speaker: "向导",
    dialogue:
      "你已经看清红章来自哪里。现在真正的修复不是隐藏错误，而是让合法输入走通，让非法输入被清楚地挡住，让未知异常有日志可查。",
    goal: "形成接口错误修复和面试复盘口径。",
    mentor:
      "接口排障的最终产出不是“我改好了”，而是：哪个输入失败、失败在哪层、我如何证明正确路径和错误路径都符合预期。",
    terms: [
      {
        term: "正向路径",
        meaning: "合法输入应该成功，比如返回 201 Created 并生成项目。",
      },
      {
        term: "负向路径",
        meaning: "错误输入也要可预期，比如返回 400 和清晰字段提示。",
      },
    ],
    clues: [
      {
        id: "acceptance-paths",
        label: "列出双路径验收",
        action: "同时验证成功和失败",
        result:
          "验收清单要包含：合法 title 返回 201；空 title 返回 400 + TITLE_REQUIRED；后端异常返回 500 且日志能定位。",
        snippet:
          "合法输入 -> 201 + project\n空 title -> 400 + TITLE_REQUIRED\n模拟异常 -> 500 + requestId log",
        question: "只测成功不够。真实工作里，错误路径也属于产品体验。",
        journeyIndex: 4,
        skill: "能写出接口错误的完整验收清单。",
      },
      {
        id: "agent-brief",
        label: "写给 Agent 的委托",
        action: "把证据变成任务",
        result:
          "给 Agent 的任务要包含复现请求、期望状态码、错误结构、日志要求和测试用例。否则它可能只改表面提示。",
        snippet:
          "请修复 POST /api/projects：\n- 空 title 返回 400 + TITLE_REQUIRED\n- 合法输入返回 201\n- 日志包含 path、field、requestId\n- 补正向/负向测试",
        question:
          "这就是你要练的工作能力：不是让 Agent 猜，而是给它一份可验收的工程任务。",
        journeyIndex: 4,
        skill: "能把接口故障写成清晰 Agent 任务。",
      },
    ],
  },
];

const consistencyJourney: QuestJourneyItem[] = [
  {
    sceneId: "forge-clicks",
    from: "用户",
    to: "前端按钮",
    payload: "连续点击提交，同一份草稿被触发多次",
    proof: "Network 里看到多次 POST",
    plain:
      "第一棒不是数据库错了，而是同一个动作可能被送出去很多次：双击、刷新、网络重试都会发生。",
  },
  {
    sceneId: "forge-clicks",
    from: "前端按钮",
    to: "后端接口",
    payload: "POST /api/orders + Idempotency-Key",
    proof: "请求头里能看到同一个 key",
    plain:
      "前端要告诉后端：这些请求其实来自同一次业务动作。这个标记就是 Idempotency-Key。",
  },
  {
    sceneId: "idempotency-forge",
    from: "后端接口",
    to: "幂等登记册",
    payload: "先查这个 key 有没有处理过",
    proof: "已处理则返回同一个结果，不再 INSERT",
    plain:
      "后端像熔炉门禁：先看这张取货牌是不是来过。来过，就把旧结果还给你；没来过，才开始铸造。",
  },
  {
    sceneId: "unique-vault",
    from: "幂等登记册",
    to: "数据库唯一约束",
    payload: "唯一索引 + 事务提交",
    proof: "重复写入会被数据库挡住",
    plain:
      "前端和后端都可能出错，所以数据库要做最后的门闩：同一份核心记录只能存在一份。",
  },
  {
    sceneId: "consistency-verdict",
    from: "验收动作",
    to: "面试复盘",
    payload: "连点、重试、并发复测",
    proof: "SELECT count(*) 仍然是 1",
    plain:
      "最后不是说“我加了防抖”，而是证明：重复请求真的来了，但数据库最终没有重复核心数据。",
  },
];

const consistencyScenes: QuestScene[] = [
  {
    id: "forge-clicks",
    image: questStage,
    portrait: idempotencyStonePet,
    place: "一致性熔炉入口",
    title: "同一锤，不该敲出三把剑",
    speaker: "幂等石灵",
    dialogue:
      "熔炉外传来急促的敲击声：同一份委托被连敲三下，火光里竟浮出三把一模一样的剑。石灵皱起眉头：这不是勤奋，是数据重复。",
    goal: "理解重复提交从哪里来，以及前端能挡住什么、挡不住什么。",
    mentor:
      "先别背幂等。你只要看清一件事：同一个用户动作，为什么可能变成多次请求。",
    terms: [
      {
        term: "重复提交",
        meaning:
          "同一次业务动作被提交多次。可能来自用户双击、页面刷新、网络重试或多个窗口同时操作。",
      },
      {
        term: "前端防连点",
        meaning:
          "提交中禁用按钮或显示 loading。它能减少误点，但不能作为最终防线。",
      },
    ],
    clues: [
      {
        id: "double-click",
        label: "查看连点现场",
        action: "观察同一次动作发出了几次 POST",
        result:
          "Network 里出现多次 POST。说明问题不是用户真的想创建三份数据，而是同一动作被重复送到了后端。",
        snippet:
          "用户双击提交\n  -> POST /api/orders\n  -> POST /api/orders\n  -> POST /api/orders",
        question:
          "第一句要讲清：重复数据常常不是数据库自己变出来，而是重复请求进入了系统。",
        journeyIndex: 0,
        skill: "能从 Network 判断是否发生重复提交。",
      },
      {
        id: "frontend-limit",
        label: "检查按钮护盾",
        action: "看 submitting 如何禁用按钮",
        result:
          "前端可以 setSubmitting(true) 禁用按钮，减少用户连点。但网络重试、刷新重放或绕过页面的请求，前端按钮管不到。",
        snippet:
          "setSubmitting(true)\n<button disabled={submitting}>提交</button>\n\n能减少连点，不能保证后端不会收到重复请求",
        question: "所以前端防连点是体验层，不是数据一致性的最终答案。",
        journeyIndex: 1,
        skill: "能解释前端防重的边界。",
      },
    ],
  },
  {
    id: "idempotency-forge",
    image: questPortal,
    portrait: idempotencyStonePet,
    place: "幂等熔炉门禁",
    title: "同一张取货牌，只能领同一把剑",
    speaker: "幂等石灵",
    dialogue:
      "石灵递给你一枚刻着 Idempotency-Key 的取货牌。它说：请求可以来三次，但如果牌号相同，熔炉就应该承认这是同一件事。",
    goal: "理解 Idempotency-Key 如何把多次请求绑定成同一次业务动作。",
    mentor:
      "幂等不是玄学。它就是一句工程约定：同一个 key 重复提交，返回同一个结果，不重复创建。",
    terms: [
      {
        term: "Idempotency-Key",
        meaning:
          "同一次业务动作的唯一请求标记。前端生成并传给后端，后端用它判断是否处理过。",
      },
      {
        term: "幂等",
        meaning:
          "重复执行同一个请求，最终效果仍然像只执行了一次。常用于支付、订单、报名等场景。",
      },
    ],
    clues: [
      {
        id: "key-header",
        label: "读取取货牌编号",
        action: "查看请求头里的 Idempotency-Key",
        result:
          "多次 POST 带着同一个 Idempotency-Key，后端就能知道它们来自同一次业务动作，而不是三份新委托。",
        snippet:
          "POST /api/orders\nHeaders:\nIdempotency-Key: req_2026_0705_001",
        question: "关键不是请求来了几次，而是后端能不能认出它们是同一件事。",
        journeyIndex: 1,
        skill: "知道 key 如何连接前端动作和后端查重。",
      },
      {
        id: "backend-dedupe",
        label: "查看门禁查重",
        action: "先 findByIdempotencyKey，再决定是否创建",
        result:
          "后端收到请求后先查这个 key 是否已有结果。查到就返回旧订单；查不到才进入创建流程。",
        snippet:
          "const existing = findByIdempotencyKey(key);\nif (existing) return existing;\nreturn createOrder(draft);",
        question: "这就是幂等的白话：来过就还旧结果，没来过才真的创建。",
        journeyIndex: 2,
        skill: "能解释后端幂等判断的位置。",
      },
    ],
  },
  {
    id: "unique-vault",
    image: questArchive,
    portrait: idempotencyStonePet,
    place: "唯一约束档案库",
    title: "最后一道门闩必须在数据库",
    speaker: "档案库守匠",
    dialogue:
      "熔炉门禁很聪明，但档案库仍然要求每把剑刻唯一编号。石灵说：别把希望全压在某一层，真正的系统要层层兜底。",
    goal: "理解唯一约束和事务为什么是数据一致性的底线。",
    mentor:
      "如果两次请求几乎同时冲进来，代码层查重可能都觉得“还没有”。数据库唯一约束会做最后裁决。",
    terms: [
      {
        term: "唯一约束",
        meaning:
          "数据库规则：某个字段或字段组合不能重复，比如同一用户同一课程只能报名一次。",
      },
      {
        term: "事务",
        meaning:
          "把一组相关写入包成一个整体。要么一起成功，要么失败时一起回滚。",
      },
    ],
    clues: [
      {
        id: "unique-index",
        label: "检查唯一门闩",
        action: "查看 userId + courseId 的 unique index",
        result:
          "数据库层的 unique index 能保证同一用户对同一目标只产生一条核心记录。即使请求绕过页面，数据库也会挡住重复写入。",
        snippet:
          "CREATE UNIQUE INDEX unique_user_course\nON enrollments(user_id, course_id);",
        question: "面试里要讲清：前端防连点是第一层，数据库唯一约束才是底线。",
        journeyIndex: 3,
        skill: "知道为什么防重复必须落到数据库约束。",
      },
      {
        id: "transaction-boundary",
        label: "画出事务结界",
        action: "把幂等登记和创建记录放进同一事务",
        result:
          "如果先登记 key 成功、创建订单失败，就会留下假记录；如果订单成功、登记失败，又可能重试重复创建。事务要把相关动作包在一起。",
        snippet:
          "db.transaction(() => {\n  createIdempotencyRecord(key);\n  createOrder(draft);\n});",
        question: "事务解决的是“写了一半”的错乱，不是替代幂等和唯一键。",
        journeyIndex: 3,
        skill: "能解释事务边界的作用。",
      },
    ],
  },
  {
    id: "consistency-verdict",
    image: questWorkbench,
    portrait: idempotencyStonePet,
    place: "一致性验收台",
    title: "别说防住了，证明只剩一条",
    speaker: "幂等石灵",
    dialogue:
      "石灵把三次请求、一张取货牌和数据库计数摆在你面前：如果最后档案库里仍只有一条记录，这场熔炉事故才算真正结案。",
    goal: "形成数据一致性修复和面试复盘口径。",
    mentor:
      "这一关的产出不是一句“加了防抖”。你要能说：重复请求如何产生，我在哪几层防住，最后怎样证明数据库没重复。",
    terms: [
      {
        term: "验收证据",
        meaning:
          "能证明行为的东西：重复请求日志、相同 key、数据库 count、并发测试结果。",
      },
      {
        term: "Agent 任务",
        meaning:
          "交给 Agent 的任务要写清复现、边界和验收，否则它可能只改按钮。",
      },
    ],
    clues: [
      {
        id: "count-proof",
        label: "封存记录数证据",
        action: "连点三次后查询数据库记录数",
        result:
          "重复请求真的发生了，但 SELECT count(*) 返回 1。这个证据比“按钮看起来不能点了”更可靠。",
        snippet:
          "连续点击 3 次\nPOST 到达 3 次\nSELECT count(*) FROM orders WHERE request_key = ?\n结果：1",
        question: "验收要证明最坏情况：重复请求进来了，核心数据仍然只有一份。",
        journeyIndex: 4,
        skill: "能设计重复提交的验收动作。",
      },
      {
        id: "agent-task",
        label: "写给 Agent 的修复委托",
        action: "把防重复策略写成可验收任务",
        result:
          "给 Agent 的任务要包括：前端禁用按钮、后端 Idempotency-Key、数据库唯一约束、重复请求测试、事务边界说明。",
        snippet:
          "请修复重复提交：\n- 前端提交中禁用按钮\n- POST 携带 Idempotency-Key\n- 后端重复 key 返回旧结果\n- DB 加唯一约束\n- 测试连续请求后 count 仍为 1",
        question: "这就是工程协作：你不是说“优化一下”，而是给出能验收的任务。",
        journeyIndex: 4,
        skill: "能把数据一致性问题写成清晰 Agent 任务。",
      },
    ],
  },
];

const performanceJourney: QuestJourneyItem[] = [
  {
    sceneId: "fog-gate",
    from: "用户",
    to: "浏览器",
    payload: "打开项目列表页",
    proof: "Network 开始出现 HTML、JS、CSS 和接口请求",
    plain:
      "第一棒只是用户推开雾门。页面慢可能从资源下载开始，也可能从接口等待开始，先不要猜。",
  },
  {
    sceneId: "waterfall-tower",
    from: "浏览器",
    to: "Network 瀑布图",
    payload: "每个资源和接口的等待时间",
    proof: "哪一条最长，先查哪一条",
    plain:
      "瀑布图像时间账本。它告诉你慢是花在下载资源、等后端第一口响应，还是多个请求排队。",
  },
  {
    sceneId: "api-clocktower",
    from: "前端请求",
    to: "后端接口",
    payload: "GET /api/projects",
    proof: "TTFB 和后端日志能对上",
    plain:
      "如果 TTFB 高，浏览器是在等后端开口。下一步要查服务端计时、数据库查询和上游接口。",
  },
  {
    sceneId: "render-stage",
    from: "接口 JSON",
    to: "前端渲染",
    payload: "projects 列表、图表和状态更新",
    proof: "接口快但页面仍卡，说明可能卡在渲染",
    plain:
      "数据送到舞台后，还要摆给观众看。一次性渲染太多内容，也会让页面像被迷雾拖住。",
  },
  {
    sceneId: "cache-lighthouse",
    from: "优化方案",
    to: "复测证据",
    payload: "缓存、分页、请求去重和回归测试",
    proof: "优化前后耗时可对比，数据没有变旧",
    plain:
      "性能优化最后要复测：变快了，还要证明功能结果没变、缓存不会让用户看到旧数据。",
  },
];

const performanceScenes: QuestScene[] = [
  {
    id: "fog-gate",
    image: questStage,
    portrait: foglampCatPet,
    place: "慢速迷雾入口",
    title: "别急着优化，先点亮时间账本",
    speaker: "雾灯猫",
    dialogue:
      "用户在雾门外等得不耐烦，所有人都喊“页面太慢”。雾灯猫把灯递给你：慢不是一个原因，是一段段时间叠出来的。",
    goal: "理解页面慢要先拆成资源、接口、渲染和复测几段。",
    mentor:
      "这关先训练一个职业习惯：不要说“感觉是前端慢”或“感觉是后端慢”，先拿时间证据。",
    terms: [
      {
        term: "性能瓶颈",
        meaning:
          "真正拖慢体验的那一段。可能是资源下载、接口等待、数据库查询，也可能是前端渲染。",
      },
      {
        term: "首屏",
        meaning: "用户刚打开页面时最先看到的区域。首屏慢会让用户最先感到卡。",
      },
    ],
    clues: [
      {
        id: "slow-symptom",
        label: "记录用户体感",
        action: "先写清楚用户到底觉得哪里慢",
        result:
          "用户说“页面慢”还不够。要写成可排查现象：首次打开慢、点击筛选慢、列表出现慢，还是保存后刷新慢。",
        snippet:
          "模糊：页面很慢\n可排查：首次打开项目列表，空白持续 2 秒后才出现 loading，再过 3 秒列表才出现",
        question:
          "性能排查第一句：把抱怨翻译成可观察现象。否则 Agent 也只能乱猜。",
        journeyIndex: 0,
        skill: "能把用户体感转成可排查问题。",
      },
      {
        id: "split-timeline",
        label: "拆开时间段",
        action: "把慢拆成资源、接口、渲染和复测",
        result:
          "同一个慢页面至少有四段：资源下载、接口等待、前端渲染、优化后复测。每段都有不同证据和不同修法。",
        snippet:
          "打开页面\n  -> 下载 JS/CSS/图片\n  -> GET /api/projects\n  -> 渲染列表\n  -> 缓存/分页后复测",
        question: "你不用马上知道答案，只要先知道：慢要分段查。",
        journeyIndex: 0,
        skill: "能画出页面性能排查主路线。",
      },
    ],
  },
  {
    id: "waterfall-tower",
    image: questPortal,
    portrait: foglampCatPet,
    place: "瀑布钟塔",
    title: "最长的那条水线，通常先查它",
    speaker: "雾灯猫",
    dialogue:
      "钟塔墙上流下许多蓝色水线：HTML、JS、图片、接口。雾灯猫指向最长的一条：别被总耗时吓住，先问哪一段最长。",
    goal: "理解 Network 瀑布图如何决定第一排查方向。",
    mentor: "瀑布图不是给高级工程师看的装饰，它就是新手最该看的时间账本。",
    terms: [
      {
        term: "瀑布图",
        meaning:
          "Network 面板里每个请求的时间条。可以看下载、排队、等待响应和总耗时。",
      },
      {
        term: "资源体积",
        meaning:
          "JS、CSS、图片等文件大小。体积过大会让下载变慢，尤其在弱网下明显。",
      },
    ],
    clues: [
      {
        id: "longest-bar",
        label: "找最长水线",
        action: "比较 JS、图片和 /api/projects 的耗时",
        result:
          "如果 /api/projects 用了 1800ms，而 JS 和图片都很快，第一排查方向就是接口等待，不是重写页面样式。",
        snippet:
          "app.js: 120ms\nhero.png: 90ms\nGET /api/projects: 1800ms\n=> 先查接口/后端",
        question: "优化不是哪里顺眼改哪里，而是哪条证据最长先查哪里。",
        journeyIndex: 1,
        skill: "能用瀑布图选择排查方向。",
      },
      {
        id: "asset-cache",
        label: "看资源是否命中缓存",
        action: "检查 Size / Cache 状态",
        result:
          "第二次打开时，静态资源应该尽量命中缓存。如果每次都重新下载大图或大 JS，首屏会一直慢。",
        snippet:
          "第一次：quest-bg.png 2.4MB from network\n第二次：quest-bg.png from memory cache",
        question: "缓存不是只用于接口，静态资源也要看是否重复下载。",
        journeyIndex: 1,
        skill: "知道资源缓存也会影响首屏速度。",
      },
    ],
  },
  {
    id: "api-clocktower",
    image: questArchive,
    portrait: foglampCatPet,
    place: "接口钟楼",
    title: "浏览器等第一口气，后端在做什么？",
    speaker: "钟楼记录员",
    dialogue:
      "钟楼敲了三下，前端还没收到第一口响应。雾灯猫压低声音：如果 TTFB 高，问题可能在后端开口之前。",
    goal: "理解 TTFB 和后端日志如何判断慢在接口或数据库。",
    mentor:
      "TTFB 高时，先看后端计时日志。不要只说接口慢，要说清它慢在查库、外部接口还是计算。",
    terms: [
      {
        term: "TTFB",
        meaning: "Time To First Byte，浏览器从发出请求到收到第一口响应的时间。",
      },
      {
        term: "接口耗时日志",
        meaning:
          "后端记录一次请求内部花了多久，比如数据库查询 1200ms、外部接口 600ms。",
      },
    ],
    clues: [
      {
        id: "ttfb-proof",
        label: "读取第一口气",
        action: "对比 TTFB 和下载时间",
        result:
          "TTFB 1600ms、下载 20ms，说明浏览器不是在下载大文件，而是在等后端准备响应。",
        snippet:
          "GET /api/projects\nTTFB: 1600ms\nContent Download: 20ms\n=> 等后端第一口响应",
        question:
          "这就是面试里要讲的证据边界：TTFB 高指向后端等待，不是图片太大。",
        journeyIndex: 2,
        skill: "能解释 TTFB 的排查意义。",
      },
      {
        id: "server-log",
        label: "翻后端计时日志",
        action: "查 projects query 花了多久",
        result:
          "后端日志显示 projects query 用了 1450ms，就能把浏览器 TTFB 和数据库查询慢连成同一条证据链。",
        snippet:
          "Network TTFB: 1600ms\nLog: projects query ms=1450\n=> 主要慢在数据库查询",
        question: "Network 和日志要对上，才是可信排障。",
        journeyIndex: 2,
        skill: "能把前端等待和后端日志连起来。",
      },
    ],
  },
  {
    id: "render-stage",
    image: questStage,
    portrait: foglampCatPet,
    place: "渲染舞台",
    title: "数据到了，舞台也可能摆不动",
    speaker: "舞台记录员",
    dialogue:
      "接口很快送来了五千份项目卡，舞台却被道具压住。雾灯猫提醒你：后端快，不代表前端渲染也快。",
    goal: "理解接口返回后，前端渲染也可能成为瓶颈。",
    mentor:
      "当接口已经很快，下一步就看页面一次渲染了多少、有没有重复计算、loading 是否挡住用户。",
    terms: [
      {
        term: "渲染",
        meaning: "前端把数据变成用户能看到的 DOM、列表、图表和交互状态。",
      },
      {
        term: "分页/虚拟列表",
        meaning: "不要一次把大量数据全摆出来，只展示当前需要看的部分。",
      },
    ],
    clues: [
      {
        id: "render-count",
        label: "数舞台道具",
        action: "检查一次渲染多少张卡片",
        result:
          "接口 120ms 返回，但一次渲染 5000 张卡片，用户仍会觉得卡。此时优化方向是分页、虚拟列表或减少重复计算。",
        snippet:
          "接口耗时：120ms\n渲染数量：5000 cards\n用户体感：滚动卡顿\n=> 查前端渲染",
        question: "不要把所有慢都甩给后端。数据回来之后，前端也有工作要做。",
        journeyIndex: 3,
        skill: "能判断接口快但页面卡的情况。",
      },
      {
        id: "loading-state",
        label: "检查等待提示",
        action: "看 loading 是否解释当前等待",
        result:
          "性能体验不只是更快。等待真的存在时，页面要告诉用户正在加载，避免用户以为卡死。",
        snippet:
          "loading=true -> 显示骨架屏\n数据回来 -> 渲染列表\n错误 -> 显示重试入口",
        question: "真实产品里，慢要优化，也要解释；不能让用户面对空白。",
        journeyIndex: 3,
        skill: "知道 loading 状态也是体验验收的一部分。",
      },
    ],
  },
  {
    id: "cache-lighthouse",
    image: questWorkbench,
    portrait: foglampCatPet,
    place: "缓存灯塔",
    title: "变快之后，还要证明没有变旧",
    speaker: "雾灯猫",
    dialogue:
      "灯塔把常用资料照亮，第二次访问快了很多。可雾灯猫没有立刻盖章：缓存让路变短，也可能让用户看到旧地图。",
    goal: "形成性能优化和面试复盘口径。",
    mentor:
      "性能关的最终产出是前后对比：优化前多慢，优化后多快，功能和数据是否仍然正确。",
    terms: [
      {
        term: "缓存命中",
        meaning: "这次请求直接用了已有结果，不用重新走完整查询或下载流程。",
      },
      {
        term: "回归测试",
        meaning:
          "优化后证明原功能没有坏，比如新增项目后列表会刷新，不会一直显示旧缓存。",
      },
    ],
    clues: [
      {
        id: "before-after",
        label: "封存前后对比",
        action: "记录优化前后耗时",
        result:
          "可信的性能结论要有数字：优化前列表接口 1800ms，缓存命中后 120ms；保存新项目后缓存失效，列表仍正确。",
        snippet:
          "优化前：GET /api/projects 1800ms\n优化后：缓存命中 120ms\n回归：新增项目后列表刷新可见",
        question: "不要只说“快多了”。要拿出能复测的数字和功能证明。",
        journeyIndex: 4,
        skill: "能写出性能优化验收证据。",
      },
      {
        id: "agent-performance-task",
        label: "写给 Agent 的性能委托",
        action: "把证据、目标和边界写清楚",
        result:
          "给 Agent 的任务要包含：当前耗时证据、目标指标、允许方案、不能破坏的数据新鲜度、必须补的测试。",
        snippet:
          "请优化项目列表：\n- 当前 /api/projects TTFB 1600ms\n- 目标二次访问 < 300ms\n- 可用缓存/分页/请求去重\n- 新增项目后列表必须刷新\n- 补前后耗时和回归测试",
        question:
          "这关的工作能力：你不是喊“优化一下”，而是给出可验证的性能任务。",
        journeyIndex: 4,
        skill: "能把性能问题写成清晰 Agent 任务。",
      },
    ],
  },
];

const aiApiJourney: QuestJourneyItem[] = [
  {
    sceneId: "model-forge-gate",
    from: "用户",
    to: "前端页面",
    payload: "输入 prompt 并点击发送",
    proof: "Network 里出现 POST /api/ai/chat",
    plain:
      "第一棒只是用户把问题交给页面。页面负责收集输入和展示等待状态，不应该拿到真正的 AI API Key。",
  },
  {
    sceneId: "key-vault",
    from: "前端页面",
    to: "本地后端接口",
    payload: "POST /api/ai/chat，不携带真实密钥",
    proof: "前端请求头里没有 Authorization: Bearer sk-...",
    plain: "前端只敲自己家的门。真正去外部 AI 服务点火的人，必须是后端。",
  },
  {
    sceneId: "key-vault",
    from: "本地后端接口",
    to: "服务端环境变量",
    payload: "process.env.AI_API_KEY",
    proof: "密钥只在后端读取，前端包里搜不到",
    plain:
      "环境变量像后台保险柜。代码知道保险柜名字，真正的钥匙由服务器运行环境给。",
  },
  {
    sceneId: "stream-bridge",
    from: "AI Provider",
    to: "前端 reader",
    payload: "token stream",
    proof: "页面逐段出现回复，而不是一直空白等待",
    plain:
      "流式响应不是更神秘，只是把模型生成的内容一段段送回来，让用户更早看到结果。",
  },
  {
    sceneId: "fallback-bench",
    from: "失败路径",
    to: "用户提示和后端日志",
    payload: "AI_NOT_CONFIGURED / AI_PROVIDER_FAILED",
    proof: "用户看得懂，日志能定位，密钥不泄露",
    plain:
      "AI 服务会失败。专业的接入要能解释失败、记录原因，并且不把密钥或敏感上游信息扔给前端。",
  },
];

const aiApiScenes: QuestScene[] = [
  {
    id: "model-forge-gate",
    image: questStage,
    portrait: modelWardenPortrait,
    place: "模型熔炉入口",
    title: "钥匙不在舞台上，火才不会烧到城外",
    speaker: "模型熔炉执钥人",
    dialogue:
      "熔炉深处有模型火焰，学徒们都想直接点火。执钥人拦住你：真正的钥匙不能交给观众席，前端只能递申请，后端才去开炉。",
    goal: "理解 AI API 请求的第一条安全边界：前端不能接触真实密钥。",
    mentor:
      "先别研究模型参数。第一问永远是：用户输入交给谁？密钥在哪里？前端包里能不能搜到？",
    terms: [
      {
        term: "AI API",
        meaning:
          "外部模型服务的接口。你把消息发过去，它返回模型生成的内容，也会消耗额度。",
      },
      {
        term: "API Key",
        meaning:
          "调用模型服务的密钥。拿到它的人可以花你的额度，所以不能出现在浏览器前端。",
      },
    ],
    clues: [
      {
        id: "prompt-submit",
        label: "查看用户委托",
        action: "用户输入 prompt 后，前端发给谁",
        result:
          "前端把 prompt 发给 /api/ai/chat。这里的重点不是模型回答了什么，而是前端只请求自己的后端接口。",
        snippet:
          "用户输入 prompt\n  -> 前端 POST /api/ai/chat\n  -> 不直接请求外部 AI Provider",
        question:
          "第一句要记住：前端负责收集输入和展示结果，不负责保管真正的模型密钥。",
        journeyIndex: 0,
        skill: "能说清 AI 请求的第一棒。",
      },
      {
        id: "no-front-key",
        label: "搜查舞台钥匙",
        action: "检查前端代码和 Network Headers",
        result:
          "前端代码里不应该出现 sk- 开头密钥，Network 请求也不应该把 Authorization: Bearer sk-... 发给浏览器可见的第三方。",
        snippet:
          "应该看到：POST /api/ai/chat\n不该看到：Authorization: Bearer sk-live-xxx 出现在前端请求里",
        question:
          "验证密钥安全不是口头说安全，而是能证明前端包和请求里没有密钥。",
        journeyIndex: 1,
        skill: "会检查密钥是否暴露到前端。",
      },
    ],
  },
  {
    id: "key-vault",
    image: questArchive,
    portrait: modelWardenPortrait,
    place: "密钥匣后台",
    title: "环境变量是后台保险柜",
    speaker: "执钥人",
    dialogue:
      "他打开一只发光的密钥匣：代码只写保险柜名字，真正的钥匙由服务器放进去。前端看不到，也不该猜得到。",
    goal: "理解服务端读取环境变量并转发 AI 请求。",
    mentor:
      "你可以把后端想成安全代理：它收前端的 prompt，用自己的密钥去找模型，再把结果转回来。",
    terms: [
      {
        term: "环境变量",
        meaning:
          "运行环境提供的配置。密钥放在服务器环境里，不提交到 Git，也不放进前端公开变量。",
      },
      {
        term: "服务端转发",
        meaning:
          "前端请求自己的后端；后端再带密钥请求外部 AI 服务，并把结果返回给前端。",
      },
    ],
    clues: [
      {
        id: "env-key",
        label: "打开后台保险柜",
        action: "阅读 process.env.AI_API_KEY",
        result:
          "后端从环境变量读取 AI_API_KEY。前端只知道 /api/ai/chat，不知道真实第三方密钥。",
        snippet:
          "const apiKey = process.env.AI_API_KEY;\nheaders: { Authorization: `Bearer ${apiKey}` }",
        question: "这里的重点：密钥不是不存在，而是只在服务端出现。",
        journeyIndex: 2,
        skill: "知道环境变量在 AI 接入里的作用。",
      },
      {
        id: "server-proxy",
        label: "追踪后端转发",
        action: "看后端如何调用 AI Provider",
        result:
          "后端把用户 prompt 包成 messages，带上服务端密钥请求 AI Provider。这样前端不会直接暴露密钥，也方便统一处理日志、限流和错误。",
        snippet:
          "前端 -> /api/ai/chat\n后端 -> https://api.example.ai/chat + server key\nAI Provider -> stream",
        question:
          "服务端转发不是多此一举，它是密钥安全、日志和错误兜底的控制点。",
        journeyIndex: 2,
        skill: "能解释为什么 AI API 要经后端。",
      },
    ],
  },
  {
    id: "stream-bridge",
    image: questPortal,
    portrait: modelWardenPortrait,
    place: "流式火桥",
    title: "火花一段段回来，用户就不会盯着空白",
    speaker: "火桥记录员",
    dialogue:
      "熔炉没有等整把剑铸完才开门，而是一点点递出火花。执钥人说：这就是流式响应，改善的是等待体验。",
    goal: "理解后端 stream 和前端 reader 如何配合。",
    mentor:
      "流式不是魔法。后端一段段转发，前端一段段读取并追加。中途失败也要能提示。",
    terms: [
      {
        term: "流式响应",
        meaning: "服务端不是一次性返回完整文本，而是边生成边发送小片段。",
      },
      {
        term: "reader",
        meaning: "前端读取流的工具。它循环 read，把每段内容追加到页面。",
      },
    ],
    clues: [
      {
        id: "stream-reader",
        label: "观察火花流",
        action: "前端 reader 如何读 token",
        result:
          "response.body.getReader() 会不断读取新片段。每读到一段，页面就 appendToken，所以用户看到回复逐渐出现。",
        snippet:
          "const reader = response.body.getReader();\nwhile (!done) {\n  appendToken(decode(value));\n}",
        question:
          "流式响应的验收：用户不再长时间空白等待，而是能看到内容逐段出现。",
        journeyIndex: 3,
        skill: "能解释流式显示的前端逻辑。",
      },
      {
        id: "stream-boundary",
        label: "识别流式边界",
        action: "流式能解决什么，不能解决什么",
        result:
          "流式改善等待感，但不能解决密钥暴露、模型胡说、上游限流。那些要靠服务端安全、引用校验和错误兜底。",
        snippet:
          "流式能做：更早显示第一段输出\n流式不能做：保证内容正确、隐藏前端密钥、消除上游错误",
        question: "面试里别把流式讲成万能优化。它主要解决等待体验。",
        journeyIndex: 3,
        skill: "能说明流式响应的边界。",
      },
    ],
  },
  {
    id: "fallback-bench",
    image: questWorkbench,
    portrait: keyVaultEquipment,
    place: "熄火兜底台",
    title: "熔炉会熄火，交付不能失语",
    speaker: "密钥匣",
    dialogue:
      "密钥匣发出低鸣：没有配置 key、上游限流、模型超时，都会让熔炉熄火。真正的产品不能把一串没人懂的错误甩给用户。",
    goal: "形成 AI API 接入的失败处理和面试复盘口径。",
    mentor:
      "AI 应用开发不是只让成功路径跑通。你要证明失败时不泄露密钥、用户看得懂、日志能定位。",
    terms: [
      {
        term: "限流",
        meaning:
          "外部服务限制请求次数或额度。常见表现是 429 或 provider-specific error。",
      },
      {
        term: "降级",
        meaning:
          "外部 AI 不可用时，产品仍给用户可用退路，比如保存草稿、稍后重试或本地示例。",
      },
    ],
    clues: [
      {
        id: "failure-shape",
        label: "检查错误回执",
        action: "比较 AI_NOT_CONFIGURED 和 AI_PROVIDER_FAILED",
        result:
          "后端应该返回结构化错误 code，前端据此展示可理解提示。不能把上游原始敏感信息或 API Key 传给用户。",
        snippet:
          "{ code: 'AI_NOT_CONFIGURED', message: 'AI 暂时不可用' }\n{ code: 'AI_PROVIDER_FAILED', requestId: 'req_42' }",
        question:
          "失败路径的目标：用户知道怎么做，开发者知道去哪查，密钥仍然安全。",
        journeyIndex: 4,
        skill: "能设计 AI 接口失败提示。",
      },
      {
        id: "agent-ai-task",
        label: "写给 Agent 的接入委托",
        action: "把安全、流式和失败验收写清楚",
        result:
          "给 Agent 的任务要包含：密钥只在后端、前端走 /api/ai/chat、支持流式显示、失败返回结构化错误、测试前端包不含密钥。",
        snippet:
          "请接入 AI API：\n- API Key 只读 process.env.AI_API_KEY\n- 前端不得出现真实 key\n- 支持 stream reader 逐段显示\n- 未配置/上游失败有结构化错误\n- 补密钥不泄露和失败路径测试",
        question:
          "这就是能用于求职的表达：我不只是会调模型，还会设计安全边界和验收。",
        journeyIndex: 4,
        skill: "能把 AI API 接入写成可验收 Agent 任务。",
      },
    ],
  },
];

const hallucinationJourney: QuestJourneyItem[] = [
  {
    sceneId: "mirror-gate",
    from: "用户",
    to: "Prompt 委托书",
    payload: "问题、角色、输出格式和拒答条件",
    proof: "请求 payload 里能看到明确 instruction",
    plain:
      "第一棒不是让 AI 随便发挥，而是把用户问题写成有边界的委托书：只能用资料回答，必须给引用。",
  },
  {
    sceneId: "context-bag",
    from: "资料库",
    to: "上下文资料袋",
    payload: "带 id 的 context chunks",
    proof: "每段资料都有 chunk id 和原文预览",
    plain:
      "上下文像随案资料袋。模型可以看这些资料，但不能把没有交给它的内容说成事实。",
  },
  {
    sceneId: "citation-court",
    from: "模型回答",
    to: "引用校验",
    payload: "answer + citations + confidence",
    proof: "每个 citation 都能对应本轮资料 id",
    plain:
      "模型说得顺不等于可信。引用校验要检查每个证物编号是不是本轮真的给过它。",
  },
  {
    sceneId: "refusal-bench",
    from: "无依据问题",
    to: "拒答提示",
    payload: "UNKNOWN / 资料不足",
    proof: "无资料测试不会产出编造答案",
    plain:
      "找不到资料时，专业系统要承认不知道。拒答不是失败，是避免假答案伤害用户。",
  },
];

const hallucinationScenes: QuestScene[] = [
  {
    id: "mirror-gate",
    image: questPortal,
    portrait: mirrorEditorPortrait,
    place: "幻觉镜厅入口",
    title: "镜子会补全空白，所以委托书必须写清楚",
    speaker: "镜厅校对师",
    dialogue:
      "镜厅里的 AI 回答得很流畅，甚至流畅到危险。校对师递给你一张委托书：如果不写清资料范围和不可回答条件，镜子就会把猜测说成事实。",
    goal: "理解 Prompt 不是一句咒语，而是限制 AI 输出边界的工程契约。",
    mentor:
      "先别追模型参数。先问：这个回答允许用哪些资料？必须输出什么字段？找不到依据时怎么办？",
    terms: [
      {
        term: "Prompt",
        meaning:
          "写给模型的任务说明。它要包含角色、资料范围、输出格式和不可回答条件。",
      },
      {
        term: "幻觉",
        meaning: "模型把没有依据的猜测说得像事实。它看起来顺，但不一定真。",
      },
    ],
    clues: [
      {
        id: "prompt-contract",
        label: "阅读镜厅委托书",
        action: "看系统提示怎么限制回答",
        result:
          "系统提示要求 AI 只根据 context 回答、每句话都要有 citation、资料不足时返回 UNKNOWN。这样模型不是自由发挥，而是在一份合同里工作。",
        snippet:
          "只根据 context 回答\n每句话必须对应 citation\n资料不足时返回 UNKNOWN\n输出：answer + citations + confidence",
        question:
          "这就是可验证 AI 的第一步：先把“不能乱说”写进任务，而不是事后祈祷它别乱说。",
        journeyIndex: 0,
        skill: "能把 Prompt 写成有边界的工程委托。",
      },
      {
        id: "empty-prompt-risk",
        label: "照见空白风险",
        action: "比较空泛问题和有边界问题",
        result:
          "“帮我总结项目风险”太空，模型可能把常见风险套进来；“只根据这 3 段资料总结风险，并列引用 id”才会把回答拴在证据上。",
        snippet:
          "空泛：帮我总结项目风险\n可验证：只根据 chunks A/B/C，总结风险，并给 citations",
        question:
          "初学者最容易误会：Prompt 不是让 AI 更会说话，而是让 AI 按证据说话。",
        journeyIndex: 0,
        skill: "知道为什么空泛 Prompt 会导致胡说。",
      },
    ],
  },
  {
    id: "context-bag",
    image: questArchive,
    portrait: mirrorEditorPortrait,
    place: "随案资料库",
    title: "没有资料袋，镜子只能靠记忆猜",
    speaker: "镜厅校对师",
    dialogue:
      "校对师把几页资料装进银色袋子，每页都刻着编号。她说：AI 可以聪明，但产品不能让它凭空替公司发言。",
    goal: "理解上下文为什么要带资料 id、原文和范围。",
    mentor:
      "你不用马上懂 RAG。先懂这件事：模型本轮能用什么资料，必须被系统明确交给它。",
    terms: [
      {
        term: "上下文 context",
        meaning:
          "本次请求交给模型的资料。它可以是文档片段、日志、用户选择或项目说明。",
      },
      {
        term: "chunk id",
        meaning: "资料片段编号。后面引用和校验都靠它追踪答案来自哪一段资料。",
      },
    ],
    clues: [
      {
        id: "context-chunks",
        label: "检查资料袋编号",
        action: "查看 context chunks",
        result:
          "每段资料都有 id 和 text。模型输出 citations 时，只能引用这些 id。没有 id，后面就无法证明答案来自哪份资料。",
        snippet:
          "context: [\n  { id: 'doc-12#chunk-3', text: '退款规则...' },\n  { id: 'doc-18#chunk-1', text: '试用期说明...' }\n]",
        question:
          "引用不是装饰，它要能回到具体资料编号。否则用户无法检查，开发者也无法排查。",
        journeyIndex: 1,
        skill: "能解释上下文和引用编号的关系。",
      },
      {
        id: "missing-context",
        label: "抽走资料再提问",
        action: "用无资料问题做反例",
        result:
          "如果 context 为空，却问公司退款政策，模型最容易编常见答案。专业系统应该让它返回资料不足，而不是补一段听起来合理的政策。",
        snippet:
          "question: 公司退款政策是什么？\ncontext: []\n期望：资料不足，无法确认。",
        question: "这一关的验收要有反例：有资料能答，无资料不能编。",
        journeyIndex: 1,
        skill: "会设计无资料反例测试。",
      },
    ],
  },
  {
    id: "citation-court",
    image: questStage,
    portrait: mirrorEditorPortrait,
    place: "引用审判席",
    title: "说得好听不够，每一句都要有证物编号",
    speaker: "镜厅校对师",
    dialogue:
      "回答在审判席上展开，字句华丽却悬在半空。校对师敲响银槌：没有引用的句子，不能进入正式答案。",
    goal: "理解 citation 校验为什么是 AI 产品的验收动作。",
    mentor:
      "不要只看答案通不通顺。看 citations 是否存在，是否来自本轮资料，是否真的支持回答。",
    terms: [
      {
        term: "Citation",
        meaning:
          "引用来源。通常是资料片段 id、文档链接或页码，用来证明回答依据。",
      },
      {
        term: "置信边界",
        meaning:
          "系统对回答可信度的标记。资料不足、引用不全时要降低置信度或拒答。",
      },
    ],
    clues: [
      {
        id: "citation-check",
        label: "核对证物编号",
        action: "检查 citations 是否属于本轮资料",
        result:
          "校验逻辑会把模型给出的 citations 和 allowedChunkIds 比对。只要引用为空、引用不存在或不属于本轮资料，就不能放行。",
        snippet:
          "citations.every((id) => allowedChunkIds.has(id))\n如果 false -> 资料不足，无法确认",
        question:
          "可验证回答不是“模型说它有引用”，而是程序真的检查这些引用存在。",
        journeyIndex: 2,
        skill: "能说清引用校验的代码逻辑。",
      },
      {
        id: "answer-boundary",
        label: "拆开一句回答",
        action: "判断哪句话有资料支持",
        result:
          "“试用期 14 天”如果能对应 doc-18#chunk-1，就可以展示；“高级版支持企业私有化”如果资料里没有，就必须删掉或标为资料不足。",
        snippet:
          "可展示：试用期 14 天 [doc-18#chunk-1]\n不可展示：支持企业私有化 [没有 citation]",
        question: "这就是面试能讲的能力：我不只调模型，还能设计答案验收规则。",
        journeyIndex: 2,
        skill: "会判断回答是否真的被资料支持。",
      },
    ],
  },
  {
    id: "refusal-bench",
    image: questWorkbench,
    portrait: mirrorEditorPortrait,
    place: "拒答工坊",
    title: "承认不知道，是保护用户的护盾",
    speaker: "镜厅校对师",
    dialogue:
      "最后一面镜子故意没有放入任何资料。它沉默片刻，给出“资料不足”。校对师微笑：这不是失败，这是系统学会了诚实。",
    goal: "形成幻觉控制的 Agent 任务、验收动作和面试复盘。",
    mentor:
      "产品不能要求 AI 永远回答。专业交付要定义：什么时候回答，什么时候拒答，拒答时用户下一步该怎么办。",
    terms: [
      {
        term: "拒答策略",
        meaning:
          "资料不足、越权、风险太高时，系统明确不回答，并说明需要补充什么。",
      },
      {
        term: "反例测试",
        meaning: "故意用无资料、错资料或越界问题验证系统不会编造答案。",
      },
    ],
    clues: [
      {
        id: "refusal-test",
        label: "运行无资料试炼",
        action: "用无资料问题验证拒答",
        result:
          "测试输入没有任何相关 context，期望输出是“资料不足，无法确认”，citations 为空，confidence 为 low。只要它编了答案，就不能算通过。",
        snippet:
          "输入：context=[]，question='退款政策是什么？'\n期望：answer='资料不足，无法确认'，citations=[]，confidence='low'",
        question:
          "拒答不是偷懒，而是在证据不足时保护用户。AI 产品最怕自信地错。",
        journeyIndex: 3,
        skill: "能设计幻觉控制验收用例。",
      },
      {
        id: "agent-brief-hallucination",
        label: "写给 Agent 的防幻觉委托",
        action: "把 Prompt、引用、反例测试写清楚",
        result:
          "给 Agent 的任务要包含：只基于 context 回答、必须输出 citations、引用必须校验、无资料时拒答，并补有资料/无资料两组测试。",
        snippet:
          "请实现可验证 AI 回答：\n- Prompt 限制只用 context\n- 输出 answer/citations/confidence\n- 校验 citations 属于本轮 chunk\n- 无资料时返回资料不足\n- 补有资料和无资料测试",
        question:
          "面试复盘可以这样讲：我把 AI 输出从“看起来会说”改成“有来源、可校验、会拒答”。",
        journeyIndex: 3,
        skill: "能把幻觉控制写成可验收 Agent 任务。",
      },
    ],
  },
];

const ragJourney: QuestJourneyItem[] = [
  {
    sceneId: "library-gate",
    from: "原始资料",
    to: "知识库入口",
    payload: "文档路径、更新时间、来源元数据",
    proof: "能看到这份资料从哪里来",
    plain:
      "RAG 的第一棒不是问模型，而是确认资料来源。来源不清，后面引用再漂亮也不可信。",
  },
  {
    sceneId: "chunk-workshop",
    from: "长文档",
    to: "chunk 书页",
    payload: "doc-id#chunk-n + 原文片段",
    proof: "每个片段都有 id、标题和 source",
    plain:
      "系统把厚书拆成可检索的书页。chunk 太大容易噪声多，太碎又可能丢上下文。",
  },
  {
    sceneId: "index-tower",
    from: "chunk 书页",
    to: "向量索引",
    payload: "embedding + metadata",
    proof: "索引记录里保留 text、source 和 vector 状态",
    plain:
      "embedding 像资料气味指纹。问题和资料都变成可比较的向量，系统才能找相似片段。",
  },
  {
    sceneId: "retrieval-hall",
    from: "用户问题",
    to: "topK 命中片段",
    payload: "matches + score",
    proof: "能看到命中的 chunk 和相似度",
    plain: "RAG 答错时先看命中。问退款却命中登录文档，模型再会说也会答偏。",
  },
  {
    sceneId: "source-answer",
    from: "命中片段",
    to: "带引用回答",
    payload: "context + citations",
    proof: "最终回答能追到原文 chunk",
    plain:
      "最后模型不是凭空回答，而是带着命中资料开口。验收时要能从答案回到原文。",
  },
];

const ragScenes: QuestScene[] = [
  {
    id: "library-gate",
    image: questArchive,
    portrait: knowledgeKeeperPortrait,
    place: "知识迷宫入口",
    title: "答案不在模型脑子里，先看资料从哪来",
    speaker: "知识馆守卷人",
    dialogue:
      "守卷人把一摞公司文档放在迷宫门口：别急着让 AI 回答。先确认这些资料是谁写的、何时更新、能不能被当前用户使用。",
    goal: "理解 RAG 的起点是可信资料，而不是模型自由发挥。",
    mentor:
      "先问三个问题：资料来源在哪里？更新时间是什么？这份资料允许被当前回答使用吗？",
    terms: [
      {
        term: "RAG",
        meaning:
          "检索增强生成。先从资料库找相关片段，再让模型基于这些片段回答。",
      },
      {
        term: "来源元数据",
        meaning:
          "资料路径、标题、更新时间、权限范围等信息。它们决定引用是否可信。",
      },
    ],
    clues: [
      {
        id: "source-ledger",
        label: "查看资料来源",
        action: "检查文档路径和更新时间",
        result:
          "每份资料都要保留 source、title 和 updatedAt。没有来源，后面就没法向用户证明答案来自哪里。",
        snippet:
          "source: docs/refund-policy.md\ntitle: 退款规则\nupdatedAt: 2026-06-20",
        question:
          "这一步的白话：AI 不能空口说“根据资料”，系统要知道资料是哪一份。",
        journeyIndex: 0,
        skill: "能判断 RAG 资料来源是否可信。",
      },
      {
        id: "permission-scope",
        label: "检查使用范围",
        action: "资料是否允许进入本次回答",
        result:
          "客服知识、内部排障文档、用户私有文档的权限不同。RAG 不能把不该给当前用户看的资料塞进 context。",
        snippet:
          "allowedFor: ['support-agent']\nnotAllowedFor: ['public-user']",
        question:
          "真实工作里，知识库不是越多越好；资料权限错了，就是安全事故。",
        journeyIndex: 0,
        skill: "知道 RAG 也有权限边界。",
      },
    ],
  },
  {
    id: "chunk-workshop",
    image: questWorkbench,
    portrait: knowledgeKeeperPortrait,
    place: "切页工坊",
    title: "厚书要拆成能被找到的书页",
    speaker: "知识馆守卷人",
    dialogue:
      "一整本文档被放上切页台，守卷人沿着标题和段落切开。每一页都挂上编号，方便检索狐以后准确叼回来。",
    goal: "理解 chunk 切分为什么影响后续检索质量。",
    mentor:
      "你不需要背复杂算法。先看切分后，每个 chunk 是否还有标题、原文和来源。",
    terms: [
      {
        term: "chunk",
        meaning:
          "从长文档切出来的小片段。它要足够小，方便检索；也要保留足够上下文。",
      },
      {
        term: "source path",
        meaning: "chunk 对应的原始文档路径。引用回查要靠它。",
      },
    ],
    clues: [
      {
        id: "chunk-id",
        label: "检查书页编号",
        action: "看 chunk id 和原文片段",
        result:
          "chunk id 形如 doc-12#chunk-3，旁边保留原文 text 和 source。之后引用能回到这个编号。",
        snippet:
          "id: doc-12#chunk-3\nsource: docs/refund-policy.md\ntext: 用户可在 14 天内申请退款...",
        question: "chunk id 就像书页编号。没有编号，答案就无法指回具体来源。",
        journeyIndex: 1,
        skill: "能解释 chunk 和引用来源的关系。",
      },
      {
        id: "chunk-size",
        label: "判断切分是否合适",
        action: "比较过大和过碎的 chunk",
        result:
          "chunk 太大，检索命中后带进很多无关内容；chunk 太碎，模型可能看不到完整条件。常见做法是按标题/段落切，再限制长度。",
        snippet:
          "太大：整篇退款文档 8000 字\n太碎：每句话一个 chunk，丢掉条件\n更稳：按小标题切，约 500-1000 字",
        question: "RAG 的质量不是只靠模型，切分策略本身就是工程能力。",
        journeyIndex: 1,
        skill: "能说清切分策略如何影响命中质量。",
      },
    ],
  },
  {
    id: "index-tower",
    image: questPortal,
    portrait: knowledgeKeeperPortrait,
    place: "向量索引塔",
    title: "给每页资料做气味指纹",
    speaker: "知识馆守卷人",
    dialogue:
      "塔顶漂浮着许多微光指纹。守卷人解释：embedding 不是答案，它只是让问题和资料能互相比较。",
    goal: "理解 embedding 和向量索引在 RAG 里的位置。",
    mentor:
      "把它想成气味：用户问题有一种气味，资料片段也有气味。检索就是找气味最接近的几页。",
    terms: [
      {
        term: "embedding",
        meaning: "把文字转成向量，方便系统计算问题和资料片段的相似度。",
      },
      {
        term: "向量索引",
        meaning: "保存 chunk 向量和 metadata 的检索结构。查询时从这里找 topK。",
      },
    ],
    clues: [
      {
        id: "vector-upsert",
        label: "查看索引写入",
        action: "chunk 如何进入 vectorStore",
        result:
          "系统为每个 chunk 生成 vector，然后连同 id、text、source 写入索引。metadata 不能丢，否则命中后无法展示来源。",
        snippet:
          "vectorStore.upsert({\n  id,\n  vector,\n  text: chunk.text,\n  source: doc.path\n})",
        question:
          "这里不要被向量吓到：你要看的是 id、text、source 有没有一起入库。",
        journeyIndex: 2,
        skill: "能读懂 RAG 建索引的关键字段。",
      },
      {
        id: "stale-index",
        label: "寻找过期索引",
        action: "文档更新后索引是否重建",
        result:
          "如果文档改了但索引没更新，检索会命中过期资料。验收时要检查 updatedAt 或索引重建日志。",
        snippet:
          "doc.updatedAt = 2026-07-01\nindex.updatedAt = 2026-06-10\n风险：回答引用旧规则",
        question: "知识库不是建一次就永远正确。资料更新后，索引也要跟着更新。",
        journeyIndex: 2,
        skill: "知道 RAG 需要处理资料更新。",
      },
    ],
  },
  {
    id: "retrieval-hall",
    image: questStage,
    portrait: retrievalFoxPet,
    place: "检索回声厅",
    title: "问对问题，还要命中对书页",
    speaker: "检索狐",
    dialogue:
      "检索狐嗅着用户问题跑进迷宫，叼回四张书页。它摇摇尾巴：先别看 AI 怎么写，先看我叼回来的页是不是对。",
    goal: "理解 topK 命中、score 和错答排查。",
    mentor: "RAG 出错时，第一眼看 matches。命中不对，后面的回答通常也会偏。",
    terms: [
      {
        term: "topK",
        meaning: "检索时返回最相近的 K 个片段，例如 topK=4。",
      },
      {
        term: "score",
        meaning: "相似度分数。它不是绝对真理，但能帮助判断命中是否可靠。",
      },
    ],
    clues: [
      {
        id: "matches-list",
        label: "检查命中列表",
        action: "看问题命中了哪些 chunk",
        result:
          "用户问退款时，matches 应该命中退款规则相关 chunk。如果命中登录态或价格文档，就要先修检索，而不是怪模型。",
        snippet:
          "question: 退款规则是什么？\nmatch 1: docs/refund-policy.md#chunk-2 score=0.86\nmatch 2: docs/login.md#chunk-1 score=0.42",
        question: "RAG 的调试顺序：先看命中，再看 Prompt，最后看模型回答。",
        journeyIndex: 3,
        skill: "能用命中列表定位 RAG 错答原因。",
      },
      {
        id: "answer-sources",
        label: "把答案牵回书页",
        action: "检查最终回答的 citations",
        result:
          "最终回答展示 citations，用户可以点回原文 chunk。验收时要确认答案引用的 chunk 正是检索命中的资料。",
        snippet:
          "answer: 用户可在 14 天内申请退款。\ncitations: ['docs/refund-policy.md#chunk-2']",
        question:
          "这就是面试可以讲的重点：我让 AI 回答可以被追溯，而不是只看起来很会说。",
        journeyIndex: 4,
        skill: "能把 RAG 回答验收到来源引用。",
      },
    ],
  },
];

const agentToolsJourney: QuestJourneyItem[] = [
  {
    sceneId: "tool-contract-gate",
    from: "用户目标",
    to: "Agent 计划",
    payload: "想完成什么动作",
    proof: "Agent 先说明要调用哪个工具",
    plain:
      "第一棒不是直接执行。Agent 要先把用户目标翻译成计划：准备调用哪个工具，为什么需要它。",
  },
  {
    sceneId: "tool-contract-gate",
    from: "Agent 计划",
    to: "工具注册表",
    payload: "toolName",
    proof: "工具必须存在于 registry",
    plain:
      "Agent 不能凭空发明工具。工具注册表像武器库清单，只允许拿已经登记、写清边界的工具。",
  },
  {
    sceneId: "schema-hall",
    from: "工具申请",
    to: "参数 schema",
    payload: "args 字段、类型、枚举范围",
    proof: "缺字段/错类型会返回 VALIDATION_FAILED",
    plain:
      "参数 schema 像申请表。字段不齐、类型不对、范围危险，工具还没执行就要被挡下。",
  },
  {
    sceneId: "permission-gate",
    from: "合法参数",
    to: "权限门禁",
    payload: "user + permission + environment",
    proof: "越权动作返回 PERMISSION_DENIED",
    plain:
      "参数合法不代表可以执行。读文档、查数据、发消息、删东西，权限等级完全不同。",
  },
  {
    sceneId: "fallback-audit",
    from: "工具执行",
    to: "结果或结构化错误",
    payload: "data / TOOL_FAILED + requestId",
    proof: "失败有 code、提示和审计记录",
    plain:
      "工具失败不是世界末日。专业系统会解释失败原因、保留 requestId，并告诉用户下一步怎么办。",
  },
];

const agentToolsScenes: QuestScene[] = [
  {
    id: "tool-contract-gate",
    image: questPortal,
    portrait: toolWardenPortrait,
    place: "工具契约大厅",
    title: "副官不能凭空拿钥匙，工具必须先登记",
    speaker: "塔楼副官",
    dialogue:
      "高塔里挂着许多工具钥匙：查订单、读文档、创建任务、发送通知。副官停在门前：能拿哪把钥匙，不由 Prompt 决定，而由工具契约决定。",
    goal: "理解 Agent 工具调用的第一层边界：只能调用注册过的工具。",
    mentor:
      "先别让 Agent 执行。看它准备调用什么工具、这个工具有没有登记、描述是否写清只读还是会改变数据。",
    terms: [
      {
        term: "工具调用",
        meaning:
          "Agent 不只是聊天，而是通过受控函数查资料、调用接口或执行任务。",
      },
      {
        term: "工具注册表",
        meaning:
          "系统允许 Agent 使用的工具清单，包含名称、用途、参数、权限和执行函数。",
      },
    ],
    clues: [
      {
        id: "tool-registry",
        label: "查看工具清单",
        action: "检查 searchOrders 是否登记",
        result:
          "searchOrders 在 toolRegistry 里写清楚：它只能按用户和状态查询订单，是只读工具，需要 orders:read 权限。",
        snippet:
          "searchOrders: {\n  description: '按用户和状态查询订单，只读。',\n  permission: 'orders:read'\n}",
        question:
          "工具调用不是“Agent 想做什么就做什么”。第一步要证明工具存在且边界清楚。",
        journeyIndex: 1,
        skill: "能解释工具注册表的作用。",
      },
      {
        id: "tool-boundary",
        label: "分清读写边界",
        action: "比较 searchOrders 和 deleteOrder",
        result:
          "查询订单是只读动作；删除订单是破坏性动作。即使两个都是工具，权限、确认和验收要求也完全不同。",
        snippet:
          "searchOrders -> orders:read -> 可直接查\n deleteOrder -> orders:delete -> 必须额外确认/可能禁止",
        question:
          "真实工作里，Agent 最大风险不是不会做事，而是越权做了不该做的事。",
        journeyIndex: 1,
        skill: "能区分只读工具和危险工具。",
      },
    ],
  },
  {
    id: "schema-hall",
    image: questArchive,
    portrait: toolWardenPortrait,
    place: "参数契约厅",
    title: "申请表填错，钥匙不能出鞘",
    speaker: "塔楼副官",
    dialogue:
      "副官把工具申请表递给你：userId 必须是字符串，status 只能是 paid、pending、failed。少一个字段，门就不会开。",
    goal: "理解参数 schema 如何在执行前挡住错误和危险输入。",
    mentor:
      "不要相信模型生成的 JSON 天然正确。字段、类型、枚举值都要用代码检查。",
    terms: [
      {
        term: "参数 schema",
        meaning:
          "工具参数的规则表：需要哪些字段、字段类型是什么、值允许落在哪些范围。",
      },
      {
        term: "VALIDATION_FAILED",
        meaning:
          "参数校验失败。说明工具没有执行，系统在执行前就拦下了错误申请。",
      },
    ],
    clues: [
      {
        id: "schema-fields",
        label: "检查申请表字段",
        action: "看 userId 和 status 的规则",
        result:
          "schema 要求 userId 是 string，status 只能从 paid、pending、failed 里选。传入 unknown 或缺少 userId 都会被拒绝。",
        snippet:
          "schema: {\n  userId: 'string',\n  status: ['paid', 'pending', 'failed']\n}",
        question: "这一步的白话：Agent 说要查订单，也得先把正确参数交上来。",
        journeyIndex: 2,
        skill: "能读懂工具参数 schema。",
      },
      {
        id: "bad-args-test",
        label: "运行坏参数试炼",
        action: "缺失 userId 会怎样",
        result:
          "当 args = { status: 'paid' } 时，validate 返回失败，工具不会执行。测试要证明没有越过 schema 直接调用 run。",
        snippet:
          "输入：{ status: 'paid' }\n输出：{ ok: false, code: 'VALIDATION_FAILED' }\n断言：tool.run 没有被调用",
        question: "验收 Agent 工具调用时，反例测试比成功路径更能证明边界。",
        journeyIndex: 2,
        skill: "会设计参数校验反例测试。",
      },
    ],
  },
  {
    id: "permission-gate",
    image: questStage,
    portrait: toolWardenPortrait,
    place: "权限门禁",
    title: "参数合法，也不代表你有权开门",
    speaker: "塔楼副官",
    dialogue:
      "申请表终于填对了，但高塔门禁仍然没有亮绿灯。副官说：字段合法只是第二道门，权限才决定这次能不能执行。",
    goal: "理解权限检查不能靠 Prompt，必须在工具执行器里做。",
    mentor:
      "看 context.user 有什么权限，看工具要求什么 permission。两者不匹配，就必须拒绝。",
    terms: [
      {
        term: "权限 permission",
        meaning:
          "当前用户或 Agent 被允许做的动作范围，例如 orders:read、orders:write。",
      },
      {
        term: "PERMISSION_DENIED",
        meaning: "权限拒绝。说明参数可能合法，但当前身份不允许执行该工具。",
      },
    ],
    clues: [
      {
        id: "permission-check",
        label: "核对门禁铭牌",
        action: "比较 user permissions 和 tool.permission",
        result:
          "工具要求 orders:read，当前用户只有 docs:read，就要返回 PERMISSION_DENIED。不能因为 Agent 解释得很合理就放行。",
        snippet:
          "tool.permission = 'orders:read'\ncontext.user.permissions = ['docs:read']\n结果：PERMISSION_DENIED",
        question: "Prompt 约束是提醒，代码权限检查才是门禁。",
        journeyIndex: 3,
        skill: "能解释权限检查为什么必须在代码里。",
      },
      {
        id: "environment-boundary",
        label: "检查环境边界",
        action: "测试环境和生产环境能否混用",
        result:
          "测试环境可查测试订单，不代表能查生产订单。工具执行器要知道当前 environment，避免 Agent 把练习动作打到生产。",
        snippet:
          "context.environment = 'sandbox'\n工具只允许访问 sandbox 数据\n禁止访问 production orders",
        question: "真实工作里，环境边界和权限边界一样重要。",
        journeyIndex: 3,
        skill: "知道 Agent 工具要区分环境。",
      },
    ],
  },
  {
    id: "fallback-audit",
    image: questWorkbench,
    portrait: toolWardenPortrait,
    place: "回退与审计台",
    title: "工具失败时，副官要交回可读报告",
    speaker: "塔楼副官",
    dialogue:
      "工具执行到一半，远处接口熄火。副官没有假装成功，而是递回一张带编号的失败报告：TOOL_FAILED，requestId 已记录。",
    goal: "形成 Agent 工具调用的失败回退、审计和面试复盘。",
    mentor:
      "工具调用不是只看成功。你要能证明失败时不会越权重试、不会吞错误、能给用户下一步。",
    terms: [
      {
        term: "结构化错误",
        meaning:
          "用 code、message、requestId 描述失败，方便前端展示和后端排查。",
      },
      {
        term: "审计日志",
        meaning: "记录谁在什么时候尝试调用了什么工具、参数是什么、结果如何。",
      },
    ],
    clues: [
      {
        id: "tool-failed",
        label: "读取失败报告",
        action: "工具超时后返回什么",
        result:
          "工具失败返回 TOOL_FAILED 和 requestId。前端可以提示用户稍后重试；开发者可以用 requestId 查后端日志。",
        snippet:
          "{ ok: false,\n  code: 'TOOL_FAILED',\n  requestId: 'req_42' }",
        question:
          "失败不是一句“出错了”。要让用户知道怎么做，让开发者知道去哪查。",
        journeyIndex: 4,
        skill: "能设计工具失败回退。",
      },
      {
        id: "agent-tool-brief",
        label: "写给 Agent 的工具委托",
        action: "把工具边界、参数、权限和验收写清楚",
        result:
          "给 Agent 的任务要包含：允许调用哪些工具、参数 schema、权限要求、失败 code、反例测试和审计要求。",
        snippet:
          "请接入 Agent 工具调用：\n- 只允许 registry 内工具\n- 执行前校验 schema\n- 执行前检查 permission/environment\n- 失败返回结构化错误\n- 补正常/坏参数/越权测试",
        question:
          "面试复盘可以这样讲：我让 Agent 从聊天助手变成受控执行者，而不是放任它越权做事。",
        journeyIndex: 4,
        skill: "能把 Agent 工具调用写成可验收任务。",
      },
    ],
  },
];

const testingProofJourney: QuestJourneyItem[] = [
  {
    sceneId: "test-oath-gate",
    from: "故障现象",
    to: "复现用例",
    payload: "旧问题步骤",
    proof: "修复前测试会失败",
    plain:
      "先别急着说修好了。要先把旧问题变成能失败的用例，证明你抓住的是同一只问题。",
  },
  {
    sceneId: "unit-rune-room",
    from: "关键函数",
    to: "单元测试",
    payload: "输入、输出、边界条件",
    proof: "小范围行为稳定",
    plain: "单元测试守单个齿轮：输入是什么、输出应该是什么、边界会不会坏。",
  },
  {
    sceneId: "integration-arena",
    from: "接口请求",
    to: "集成测试",
    payload: "POST 后再 GET / 查询数据库",
    proof: "模块交接没有掉东西",
    plain: "集成测试守交接：接口、数据层、数据库之间是不是真的把东西传过去了。",
  },
  {
    sceneId: "report-archive",
    from: "真实路径",
    to: "手动测试报告",
    payload: "步骤、时间、结果、源码指纹",
    proof: "报告可追溯、可复核",
    plain:
      "手动报告不是一句“我测了”。它要写清什么时候、用哪份代码、走了哪些步骤、结果是什么。",
  },
  {
    sceneId: "report-archive",
    from: "测试结果",
    to: "可信验收",
    payload: "通过项 + 失败项 + 未覆盖风险",
    proof: "能交给 Agent/同事/面试官复核",
    plain: "真正专业的验收会同时说：哪些证据证明修好了，哪些风险还没覆盖。",
  },
];

const testingProofScenes: QuestScene[] = [
  {
    id: "test-oath-gate",
    image: questStage,
    portrait: testArbiterPortrait,
    place: "验收试炼场",
    title: "先让旧故障现形，再谈修复",
    speaker: "验收试炼官",
    dialogue:
      "试炼场中央亮着一枚红色封印：保存成功，刷新后却空无一物。试炼官合上卷宗：没有复现，就没有资格宣布修好。",
    goal: "理解复现用例为什么是可信修复的第一步。",
    mentor:
      "先把用户遇到的问题写成步骤或测试。修复前它应该失败，修复后它应该通过。",
    terms: [
      {
        term: "复现用例",
        meaning:
          "能稳定触发旧问题的测试或手动步骤。它证明你真的抓住了原来的故障。",
      },
      {
        term: "回归测试",
        meaning:
          "把修过的问题长期留在测试里，防止以后改代码时同类问题再次回来。",
      },
    ],
    clues: [
      {
        id: "old-bug-repro",
        label: "复现旧故障",
        action: "把保存消失写成测试",
        result:
          "测试先执行 POST 保存，再执行 GET 读取。旧故障下 GET 返回空数组，测试失败；修复后 GET 能读到刚保存的记录。",
        snippet:
          "await postJson('/api/canvases', draft)\nconst list = await getJson('/api/canvases')\nassert.equal(list.length, 1)",
        question:
          "白话理解：不是“我觉得修了”，而是旧问题被测试抓住，然后被同一个测试放行。",
        journeyIndex: 0,
        skill: "能把用户故障转成复现用例。",
      },
      {
        id: "red-green-proof",
        label: "看红绿变化",
        action: "比较修复前失败和修复后通过",
        result:
          "可信修复最好能说明：这个用例修复前是红的，修复后变绿。这样别人知道你不是碰巧跑了一个无关测试。",
        snippet:
          "修复前：保存后刷新仍存在 -> failed\n修复后：保存后刷新仍存在 -> passed",
        question:
          "面试里这很好讲：我先用测试复现旧问题，再修改代码让同一个测试通过。",
        journeyIndex: 0,
        skill: "能解释红绿测试为什么可信。",
      },
    ],
  },
  {
    id: "unit-rune-room",
    image: questWorkbench,
    portrait: testArbiterPortrait,
    place: "单元符文室",
    title: "单元测试守住一个齿轮",
    speaker: "验收试炼官",
    dialogue:
      "墙上刻着许多小符文：输入、输出、边界值。试炼官提醒你：整条链路太长时，先确认关键函数这颗齿轮没有滑牙。",
    goal: "理解单元测试适合证明函数和模块的小范围行为。",
    mentor:
      "单元测试不要试图证明整个世界。它只回答：这个函数拿到这些输入，会不会产出我们期待的输出。",
    terms: [
      {
        term: "单元测试",
        meaning:
          "针对一个函数或模块的小范围测试，反馈快，适合检查边界和纯逻辑。",
      },
      {
        term: "断言 assert",
        meaning: "测试里的判断句：实际结果必须等于预期结果，否则测试失败。",
      },
    ],
    clues: [
      {
        id: "function-boundary",
        label: "圈出函数边界",
        action: "只看输入和输出",
        result:
          "例如 buildCanvasPayload(draft) 应该保留 title 和 nodes。这里不用启动整个页面，只验证这个函数自己的职责。",
        snippet:
          "const payload = buildCanvasPayload(draft)\nassert.equal(payload.title, draft.title)\nassert.deepEqual(payload.nodes, draft.nodes)",
        question:
          "这一步让你知道：单元测试是在守齿轮，不是在证明整台机器已经交付。",
        journeyIndex: 1,
        skill: "能说明单元测试证明范围。",
      },
      {
        id: "edge-case",
        label: "补边界用例",
        action: "空标题或空节点会怎样",
        result:
          "边界用例能防止只测最顺的路径。比如 title 为空时应该报错，nodes 为空时是否允许，要写清楚预期。",
        snippet:
          "draft.title = ''\nexpect(() => buildCanvasPayload(draft)).toThrow('title required')",
        question:
          "真实工作里，很多 bug 就藏在空值、重复值、权限不足这些边界里。",
        journeyIndex: 1,
        skill: "能给测试补边界条件。",
      },
    ],
  },
  {
    id: "integration-arena",
    image: questPortal,
    portrait: testArbiterPortrait,
    place: "集成竞技场",
    title: "模块交接时，证据不能掉在半路",
    speaker: "验收试炼官",
    dialogue:
      "竞技场两端分别是接口门和数据库门。单独看每扇门都很漂亮，但真正的试炼是：POST 交出去的东西，GET 或数据库能不能再找回来。",
    goal: "理解集成测试如何证明前端、接口、数据层和数据库协作。",
    mentor:
      "当问题发生在交接处，单元测试不够。要用接口请求、数据库查询或 Network 证明链路真的接上。",
    terms: [
      {
        term: "集成测试",
        meaning:
          "测试多个模块一起工作时是否完成业务目标，例如接口调用数据层并返回正确结果。",
      },
      {
        term: "测试数据隔离",
        meaning: "每次测试用独立数据或清理数据，避免上一次测试污染下一次结果。",
      },
    ],
    clues: [
      {
        id: "post-get-chain",
        label: "验证 POST 到 GET",
        action: "保存后立刻读取",
        result:
          "POST /api/canvases 返回 201 只能说明接口回应成功；再 GET 到同一条记录，才说明数据真的进入可读取链路。",
        snippet:
          "POST /api/canvases -> 201 Created\nGET /api/canvases -> [{ title: '试炼草稿' }]",
        question:
          "这就是你之前卡住的点：201 是一枚印章，GET/数据库证据才证明档案真的入库。",
        journeyIndex: 2,
        skill: "能用接口链路证明修复。",
      },
      {
        id: "database-proof",
        label: "核对数据库证据",
        action: "查询记录数量",
        result:
          "如果数据库 SELECT count(*) 是 1，就能反证“只是内存里看起来成功”。验收要能说清每个证据能证明什么。",
        snippet:
          "SELECT count(*) FROM canvases WHERE title = '试炼草稿'\n结果：1",
        question: "测试和数据库证据一起出现时，Agent 的交付才更容易被信任。",
        journeyIndex: 2,
        skill: "能把测试结果和数据库证据连起来。",
      },
    ],
  },
  {
    id: "report-archive",
    image: questArchive,
    portrait: testArbiterPortrait,
    place: "验收档案馆",
    title: "报告要能复核，也要敢写未覆盖风险",
    speaker: "验收试炼官",
    dialogue:
      "档案馆里不是只收藏绿色勾。试炼官把一份报告摊开：生成时间、源码指纹、通过用例、失败详情、未覆盖风险，一项都不能含糊。",
    goal: "形成可以交给 Agent、同事和面试官复核的验收表达。",
    mentor:
      "专业交付不是只说“测试通过”。你要写清测了什么、没测什么、哪些风险还需要下一轮处理。",
    terms: [
      {
        term: "测试报告",
        meaning:
          "记录测试时间、代码版本、用例结果和失败详情的文件，方便别人复核。",
      },
      {
        term: "回归风险",
        meaning:
          "改动可能影响的旧功能或边界。验收时要说明已经覆盖和暂未覆盖的部分。",
      },
    ],
    clues: [
      {
        id: "report-fields",
        label: "检查报告字段",
        action: "看 status、generatedAt 和 sourceFingerprint",
        result:
          "报告必须能证明它对应当前代码。过期报告、源码指纹不匹配或缺少失败详情，都不能直接当作可信验收。",
        snippet:
          "{ status: 'passed',\n  generatedAt: '2026-07-05T10:00:00.000Z',\n  sourceFingerprint: 'sha256:...' }",
        question:
          "这一步让用户明白：报告不是装饰，它是别人判断你有没有真的测过的证据。",
        journeyIndex: 3,
        skill: "能判断测试报告是否可信。",
      },
      {
        id: "agent-acceptance-brief",
        label: "写给 Agent 的验收要求",
        action: "把测试、报告和风险写进任务",
        result:
          "给 Agent 的任务不能只写“修一下”。要写：先复现、补回归测试、跑单测/集成测试、提供手动报告、说明回归风险。",
        snippet:
          "请修复保存刷新后丢失：\n- 先补复现用例\n- 修复后跑单测和集成测试\n- 给出手动测试报告\n- 说明未覆盖风险和回滚方式",
        question:
          "面试复盘可以这样讲：我不是被动接受 Agent 说修好了，而是要求它交出可复核验收证据。",
        journeyIndex: 4,
        skill: "能把验收标准写进 Agent 任务。",
      },
    ],
  },
];

const agentBriefJourney: QuestJourneyItem[] = [
  {
    sceneId: "brief-fog-gate",
    from: "问题现场",
    to: "任务背景",
    payload: "现象、影响、已有证据",
    proof: "Agent 知道它站在哪个现场",
    plain:
      "第一棒是把现场讲清楚。没有背景，Agent 会把你的情绪当需求，把猜测当事实。",
  },
  {
    sceneId: "goal-anvil",
    from: "任务背景",
    to: "可观察目标",
    payload: "用户完成后能看到什么",
    proof: "目标能被判断完成/未完成",
    plain: "目标不是口号。它要让人知道做到什么才算结束，用户会看到什么变化。",
  },
  {
    sceneId: "constraint-rune",
    from: "可观察目标",
    to: "范围与约束",
    payload: "能改哪里、不能碰什么",
    proof: "Agent 不越界、不乱重构",
    plain:
      "约束不是束缚创造力，而是保护项目：安全边界、风格边界、文件范围都要写清。",
  },
  {
    sceneId: "acceptance-contract",
    from: "范围与约束",
    to: "验收标准",
    payload: "命令、浏览器路径、可见结果",
    proof: "交付可以被复核",
    plain: "验收把任务从“帮我做一下”变成“做到这些证据才算完成”。",
  },
  {
    sceneId: "acceptance-contract",
    from: "验收标准",
    to: "风险与回滚",
    payload: "影响范围、未覆盖项、退路",
    proof: "审查者知道重点看哪里",
    plain:
      "风险不是丢脸。它说明你知道这次改动可能碰到哪里，也知道失败时怎么收住。",
  },
];

const agentBriefScenes: QuestScene[] = [
  {
    id: "brief-fog-gate",
    image: questPortal,
    portrait: briefForgemasterPortrait,
    place: "委托迷雾门",
    title: "一句“你自己看着办”，会把副官丢进迷雾",
    speaker: "委托书锻造师",
    dialogue:
      "工坊门口堆满失败的委托：‘优化一下’、‘高级一点’、‘你自己决定’。锻造师敲了敲铁笔：模糊不是信任，是把判断成本丢给 Agent。",
    goal: "理解任务背景要交代现象、影响、已有证据和用户目标。",
    mentor: "先告诉 Agent 现场发生了什么。不要只给情绪和结论，要给证据和边界。",
    terms: [
      {
        term: "任务背景",
        meaning:
          "让 Agent 进入同一个现场的信息：发生了什么、影响谁、已知证据是什么。",
      },
      {
        term: "上下文",
        meaning:
          "Agent 做判断需要的项目、用户、代码、约束和历史信息，不是越多越好，而是要相关。",
      },
    ],
    clues: [
      {
        id: "bad-brief",
        label: "拆开坏委托",
        action: "看一句话任务缺了什么",
        result:
          "“帮我优化一下”缺少现象、目标、范围和验收。Agent 可能改 UI、重构代码、加无关功能，但都不一定解决你的真实问题。",
        snippet:
          "坏委托：帮我把这个项目优化一下，顺便修一下 bug。\n缺失：背景 / 目标 / 约束 / 验收 / 风险",
        question:
          "这不是用户笨，而是任务没有把现场交给 Agent。清晰任务能减少返工。",
        journeyIndex: 0,
        skill: "能指出模糊任务缺少哪些槽位。",
      },
      {
        id: "context-evidence",
        label: "放入现场证据",
        action: "把现象和证据写成背景",
        result:
          "背景应写：用户保存后刷新丢失；POST 是 201；GET 返回空；数据库查询 0 行。这样 Agent 知道问题在保存链路，而不是凭空改按钮样式。",
        snippet:
          "背景：保存提示成功，但刷新后记录消失。\n证据：POST 201；GET []；SELECT count(*) = 0。",
        question: "给 Agent 的背景越像事故卷宗，它越容易沿着正确证据链工作。",
        journeyIndex: 0,
        skill: "能把现象和证据写进任务背景。",
      },
    ],
  },
  {
    id: "goal-anvil",
    image: questWorkbench,
    portrait: briefForgemasterPortrait,
    place: "目标铁砧",
    title: "目标要能落锤，不能只是一团愿望",
    speaker: "委托书锻造师",
    dialogue:
      "铁砧上摆着两块矿石：‘更好用’和‘刷新后仍能看到刚保存的记录’。锻造师只拿起第二块：它有形状，才能被锻造。",
    goal: "把想法改写成可观察、可判断、和用户结果有关的目标。",
    mentor:
      "目标要回答：用户完成后会看到什么？系统状态会变成什么？什么情况算没完成？",
    terms: [
      {
        term: "目标",
        meaning:
          "任务想达成的可观察结果。它不是技术动作，而是用户和系统最终要变成什么样。",
      },
      {
        term: "完成定义",
        meaning:
          "用来判断任务是否结束的标准。没有完成定义，Agent 很容易交付一个看起来忙过的结果。",
      },
    ],
    clues: [
      {
        id: "goal-rewrite",
        label: "重写目标",
        action: "把愿望改成可验收结果",
        result:
          "“UI 好看一点”可以改成：第 12 章入口、封面、四个剧情地点和结案页都保持暗色 RPG 风格，390px 下无横向溢出。",
        snippet:
          "模糊：UI 好看一点\n清晰：第 12 章四个地点均为暗色 RPG；390px 无横向溢出。",
        question: "目标越可观察，后面越容易验收；否则只剩审美争论。",
        journeyIndex: 1,
        skill: "能把模糊目标改成可验收目标。",
      },
      {
        id: "done-not-done",
        label: "写完成/未完成边界",
        action: "列出什么算完成，什么不算",
        result:
          "完成：能从首页进入第 12 章并看到背景、目标、约束、验收、风险。未完成：只有卷宗预览、没有剧情、没有角色图、没有浏览器验收。",
        snippet:
          "完成：入口可点 + 剧情四幕 + 名词小抄 + 浏览器验收\n未完成：只有一页说明或复用旧背景",
        question: "这一步会防止 Agent 把半成品包装成完成。",
        journeyIndex: 1,
        skill: "能写出完成定义。",
      },
    ],
  },
  {
    id: "constraint-rune",
    image: questStage,
    portrait: briefForgemasterPortrait,
    place: "约束符文台",
    title: "护栏刻清楚，Agent 才不会越界",
    speaker: "委托书锻造师",
    dialogue:
      "符文台上刻着几条发光边界：不读真实项目、不执行危险命令、不破坏旧章节、不把学习效果说成已验证。锻造师说：这不是胆小，是工程纪律。",
    goal: "理解约束如何保护范围、风格、安全和已有功能。",
    mentor:
      "写任务时同时告诉 Agent 可以做什么和不能做什么。不能只写目标，不写边界。",
    terms: [
      {
        term: "范围",
        meaning: "这次任务允许触碰的文件、页面、功能和行为边界。",
      },
      {
        term: "禁止事项",
        meaning:
          "明确不能做的事，例如删除无关功能、上传源码、执行危险命令、改变冻结基线。",
      },
    ],
    clues: [
      {
        id: "scope-list",
        label: "圈定改动范围",
        action: "写清可以改哪些模块",
        result:
          "这类章节任务通常只需要改 teaching 数据、TeachingBridge 剧情、App 入口、测试和文档，不该顺手重写服务端或沙盒。",
        snippet:
          "范围：src/teaching.ts、src/TeachingBridge.tsx、src/App.tsx、App.test.tsx、docs/HANDOFF/changelog",
        question: "范围越清楚，Agent 越不容易做出“看起来勤快但无关”的改动。",
        journeyIndex: 2,
        skill: "能给 Agent 划定文件和功能范围。",
      },
      {
        id: "safety-boundary",
        label: "刻下安全边界",
        action: "写清禁止读取/执行/上传",
        result:
          "任务里要明确：不读取用户真实项目源码，不执行任意终端命令，不上传个人数据，不宣称真人学习效果已验证。",
        snippet:
          "禁止：读取真实项目 / 执行任意命令 / 上传源码 / 声称学习效果已通过",
        question: "好的 Agent 协作不是放权给它乱做，而是让它在清楚边界内发挥。",
        journeyIndex: 2,
        skill: "能把安全边界写进任务。",
      },
    ],
  },
  {
    id: "acceptance-contract",
    image: questArchive,
    portrait: briefForgemasterPortrait,
    place: "契约封印室",
    title: "验收和风险，是委托书最后的封印",
    speaker: "委托书锻造师",
    dialogue:
      "最后一页委托书被压进金色封印。锻造师递给你羽笔：写下要跑的测试、要走的浏览器路径、还没覆盖的风险。没有这些，交付不能离开工坊。",
    goal: "能写出可执行验收和风险说明，让 Agent 交付可以被复核。",
    mentor:
      "验收要具体到命令和页面路径。风险要说明可能影响哪里、哪些没做、失败时怎么处理。",
    terms: [
      {
        term: "验收标准",
        meaning:
          "判断任务是否完成的可执行标准，例如命令通过、页面路径走通、移动端无溢出。",
      },
      {
        term: "风险与回滚",
        meaning:
          "这次改动可能带来的影响、尚未验证的边界，以及出问题时如何退回或收窄。",
      },
    ],
    clues: [
      {
        id: "acceptance-checklist",
        label: "写验收清单",
        action: "列出命令、路径和可见结果",
        result:
          "验收要写：npm run verify 通过；浏览器从首页进入第 12 章；桌面和 390px 都能看到四幕剧情、人物图和证据点；无横向溢出。",
        snippet:
          "验收：\n- npm run verify\n- 首页 -> 第 12 章 -> 开始闯关\n- 桌面/390px 无横向溢出",
        question:
          "这就是你不想反复当测试员的根源：Agent 应该自己按验收清单走完。",
        journeyIndex: 3,
        skill: "能把验收写成可执行清单。",
      },
      {
        id: "risk-brief",
        label: "写风险说明",
        action: "说明可能影响和未覆盖内容",
        result:
          "风险要写：可能影响第 3-12 章教学桥入口；第 12 章 Lab 和沙盒都要走通桌面/390px；学习效果不能用自动化测试证明。",
        snippet:
          "风险：\n- 可能影响第 3-12 章入口\n- 第 12 章 Lab 需桌面/390px 验收\n- 未做真人学习效果验证",
        question:
          "面试复盘可以这样讲：我会给 Agent 明确任务，也会审查它有没有按证据交付。",
        journeyIndex: 4,
        skill: "能把风险和未覆盖项写清楚。",
      },
    ],
  },
];

const deliveryReviewJourney: QuestJourneyItem[] = [
  {
    sceneId: "delivery-docket",
    from: "Agent 交付",
    to: "交付说明",
    payload: "摘要、验证、风险",
    proof: "说明能对上用户原始目标",
    plain:
      "第一棒不是看它说得漂亮，而是看交付说明有没有回答：改了什么、怎么验、还剩什么风险。",
  },
  {
    sceneId: "diff-evidence-room",
    from: "交付说明",
    to: "Diff 证物",
    payload: "变更文件和改动范围",
    proof: "Diff 没有无关改动",
    plain:
      "交付说明像口供，Diff 像现场照片。两者要对得上：说只改第 13 章，就不该偷偷动服务端迁移。",
  },
  {
    sceneId: "regression-risk-hall",
    from: "Diff 证物",
    to: "测试证据",
    payload: "自动化、浏览器路径、失败记录",
    proof: "新功能走通，旧入口没有回归",
    plain:
      "测试不是仪式。它要证明这次改动真的能从用户入口走通，也没有把前面章节弄坏。",
  },
  {
    sceneId: "regression-risk-hall",
    from: "测试证据",
    to: "边界条件",
    payload: "移动端、空状态、未覆盖风险",
    proof: "390px、刷新恢复和图片加载都被看过",
    plain:
      "边界条件是最容易漏掉的角落。桌面看起来能用，不代表手机、刷新和旧进度都没问题。",
  },
  {
    sceneId: "accept-or-reject-bench",
    from: "边界条件",
    to: "文档同步",
    payload: "README、HANDOFF、changelog、任务表",
    proof: "下一个人能接上上下文",
    plain:
      "长期项目不能只改代码。文档同步是把交付放回项目记忆里，避免下一轮又从零开始。",
  },
  {
    sceneId: "accept-or-reject-bench",
    from: "文档同步",
    to: "接收/拒收",
    payload: "接收理由或补证要求",
    proof: "决定基于证据，不基于语气",
    plain:
      "最后你可以接收，也可以要求补证。专业审查不是挑刺，是把“我觉得”变成“证据还缺什么”。",
  },
];

const deliveryReviewScenes: QuestScene[] = [
  {
    id: "delivery-docket",
    image: questStage,
    portrait: deliveryJudgePortrait,
    place: "交付审查庭",
    title: "漂亮结案陈词，不能直接过审",
    speaker: "交付审查官",
    dialogue:
      "夜审钟声响起，Agent 把一份写着“已完成”的卷宗推上桌。审查官没有点头，只把灯照向三处空格：改了什么？怎么证明？还剩什么风险？",
    goal: "学会先看交付说明是否覆盖摘要、验证证据和风险。",
    mentor:
      "Agent 说完成只是开场白。你要把它的话拆成三张票据：结果、证据、风险。",
    terms: [
      {
        term: "交付说明",
        meaning:
          "Agent 交付时写给审查者看的说明，通常包括改动摘要、验证证据、风险和后续边界。",
      },
      {
        term: "风险",
        meaning: "这次改动可能影响哪里、哪些场景没测、哪些结论不能夸大。",
      },
    ],
    clues: [
      {
        id: "delivery-note-review",
        label: "核对交付说明",
        action: "检查摘要、验证和风险是否齐全",
        result:
          "合格交付不能只写“已完成”。它至少要写：接入第 13 章；跑过 npm run verify；桌面和 390px 路径走通；第 14-15 章仍是预览；回归风险在哪里。",
        snippet:
          "摘要：第 13 章已接入交付审查庭。\n验证：npm run verify；桌面/390px 浏览器路径。\n风险：第 14-15 章仍未接入剧情。",
        question: "这一步解决的是：用户看到“完成了”时，应该先问它拿什么证据。",
        journeyIndex: 0,
        skill: "能判断交付说明是不是可复核。",
      },
      {
        id: "original-goal-match",
        label: "对照原始目标",
        action: "确认交付有没有回应用户真正要的东西",
        result:
          "你的目标不是多一页说明，而是角色扮演、流程可懂、风格统一、能帮助工作和面试。因此交付说明要对应这些点，而不是只列文件名。",
        snippet:
          "用户目标：有剧情代入感；能解释工程流程；能面向工作/面试；Agent 自己完成验收。",
        question:
          "审查第一问永远是：它解决的是原始问题，还是只完成了一个技术动作？",
        journeyIndex: 0,
        skill: "能把交付和原始需求对齐。",
      },
    ],
  },
  {
    id: "diff-evidence-room",
    image: questArchive,
    portrait: deliveryJudgePortrait,
    place: "Diff 证物室",
    title: "口供要和现场照片对得上",
    speaker: "交付审查官",
    dialogue:
      "证物室的柜门一格格打开：教学数据、剧情组件、首页入口、测试、文档。审查官说：Diff 不会撒谎，但你要会读它在说什么。",
    goal: "理解 Diff 如何证明改动范围，也如何暴露无关改动。",
    mentor:
      "先看文件清单，再看每个文件承担的职责。不要陷进每一行代码，先判断它有没有越界。",
    terms: [
      {
        term: "Diff",
        meaning:
          "当前代码相对上一次提交的变更。它告诉你哪些文件被改了、加了、删了。",
      },
      {
        term: "无关改动",
        meaning:
          "和本次目标没有关系的改动，可能引入风险，也会让审查者不知道真正意图。",
      },
    ],
    clues: [
      {
        id: "diff-scope-check",
        label: "查看改动文件",
        action: "把 Diff 文件按职责分组",
        result:
          "第 13 章合理会改：teaching 数据、TeachingBridge 剧情、App 入口、路线 manifest、测试和文档。若出现数据库迁移、认证逻辑或真实项目读取，就要追问。",
        snippet:
          "git diff --stat\nsrc/teaching.ts\nsrc/TeachingBridge.tsx\nsrc/App.tsx\nsrc/App.test.tsx\ndocs/...",
        question:
          "你不需要一开始就看懂全部代码，先问：这些改动是不是都为同一个目标服务？",
        journeyIndex: 1,
        skill: "能用 Diff 判断改动范围是否合理。",
      },
      {
        id: "unrelated-change-trap",
        label: "找无关改动",
        action: "识别顺手改、旧代码删除和范围漂移",
        result:
          "如果交付说只是加第 13 章，却改了 server/db.ts 或删了安全边界，就不是直接拒绝，而是要求解释原因和补验证。",
        snippet:
          "可接受：新增第 13 章角色图。\n需追问：修改 SQLite schema、读取真实项目、删除安全提示。",
        question: "专业审查不是怕改动多，而是要每个改动都有理由和验证。",
        journeyIndex: 1,
        skill: "能发现范围漂移和潜在回归。",
      },
    ],
  },
  {
    id: "regression-risk-hall",
    image: questPortal,
    portrait: deliveryJudgePortrait,
    place: "回归风险回廊",
    title: "新门开了，旧门也不能塌",
    speaker: "交付审查官",
    dialogue:
      "回廊里有十三扇门。新开的第 13 扇闪着银光，但审查官让你回头看前十二扇：共用入口一改，旧章节也可能被牵动。",
    goal: "理解回归测试、边界条件和真实浏览器路径为什么必须一起看。",
    mentor:
      "测试证据要回答两个问题：新东西能用吗？旧东西还好吗？边界场景有没有看过？",
    terms: [
      {
        term: "回归风险",
        meaning: "新增或修改功能时，把原来能用的流程弄坏的可能性。",
      },
      {
        term: "边界条件",
        meaning:
          "容易被忽略但用户会遇到的情况，例如手机宽度、刷新恢复、空数据和图片加载失败。",
      },
    ],
    clues: [
      {
        id: "test-proof-check",
        label: "检查测试证据",
        action: "看自动化测试和真实路径是否覆盖目标",
        result:
          "第 13 章需要至少有 App 测试证明卷宗可进入剧情；还要跑 npm run verify，确保格式、lint、类型、测试和 build 没被破坏。",
        snippet:
          "npm run verify\nApp.test.tsx: 从首页 -> 第 13 章 -> 开始闯关 -> 点击线索",
        question:
          "自动化测试证明基础链路，浏览器验证证明用户真的看得到、点得到。",
        journeyIndex: 2,
        skill: "能审查测试证据是否对应目标。",
      },
      {
        id: "mobile-boundary-check",
        label: "补移动端边界",
        action: "检查 390px 是否横向溢出、文本是否遮挡",
        result:
          "UI 好看不能只看桌面截图。390px 下要能看到剧情、路线、人物图、按钮和线索详情，不能因为卡片太宽把内容挤出屏幕。",
        snippet:
          "桌面：1440x900\n手机：390x844\n检查：horizontalOverflow === false",
        question:
          "这就是用户思维：不是我机器上能跑，而是用户打开时不会被界面卡住。",
        journeyIndex: 3,
        skill: "能把移动端和视觉边界列入验收。",
      },
    ],
  },
  {
    id: "accept-or-reject-bench",
    image: questWorkbench,
    portrait: deliveryJudgePortrait,
    place: "接收裁决台",
    title: "接收也要写理由，拒收也要给路径",
    speaker: "交付审查官",
    dialogue:
      "裁决台上有两枚印章：接收、补证。审查官把它们推给你：别凭心情盖章。你要写清楚证据足在哪里，或者还缺哪一份。",
    goal: "学会把审查结论写成接收理由、拒收理由和后续补证要求。",
    mentor:
      "好审查会让下一步更清楚：可以合并，就写为什么可信；不能接收，就写缺什么证据。",
    terms: [
      {
        term: "文档同步",
        meaning:
          "把长期有效的变化写回 README、HANDOFF、任务表和 changelog，让后续 Agent 接得上。",
      },
      {
        term: "拒收理由",
        meaning:
          "基于证据提出的补充要求，例如缺测试、缺浏览器验证、风险没写清，而不是简单说“不满意”。",
      },
    ],
    clues: [
      {
        id: "memory-sync-check",
        label: "查项目记忆",
        action: "确认文档是否跟代码状态一致",
        result:
          "如果代码已经接入第 13 章，HANDOFF、README、任务表和 changelog 也要写明：第 3-13 章可进入剧情，第 14-15 章仍是预览。",
        snippet:
          "HANDOFF.md\nREADME.md\ndocs/ai-career-rpg-tasks.md\nchangelogs/2026-07-04-ui-refresh.md",
        question: "长期项目的记忆不该只留在聊天里。文档会保护下一次接力。",
        journeyIndex: 4,
        skill: "能检查代码和项目记忆是否同步。",
      },
      {
        id: "acceptance-decision",
        label: "写审查结论",
        action: "把接收/拒收写成证据清单",
        result:
          "接收理由可以写：需求目标覆盖、Diff 范围合理、verify 通过、桌面/手机路径通过、已记录边界。拒收理由要写缺口和补证路径。",
        snippet:
          "接收：证据链完整。\n补证：请补 390px 截图、旧章节回归、风险说明。",
        question:
          "这一步会直接迁移到工作和面试：你能说明自己如何判断一个交付是否可信。",
        journeyIndex: 5,
        skill: "能写清接收理由和补证要求。",
      },
    ],
  },
];

const releaseReadinessJourney: QuestJourneyItem[] = [
  {
    sceneId: "release-gate",
    from: "已审查交付",
    to: "上线计划",
    payload: "发布窗口、影响范围、负责人",
    proof: "知道何时上线、谁值守、上线后验什么",
    plain:
      "上线不是按下按钮。第一棒是把发布行动写清楚：什么时候开门、谁守门、开门后看哪里。",
  },
  {
    sceneId: "env-key-vault",
    from: "上线计划",
    to: "生产配置",
    payload: "环境变量、密钥、功能开关",
    proof: "线上具备运行条件，密钥没有暴露到前端",
    plain:
      "本地能跑不代表线上能跑。生产环境要有自己的钥匙、地址和开关，而且这些东西不能泄露。",
  },
  {
    sceneId: "backup-archive",
    from: "生产配置",
    to: "数据保护",
    payload: "备份、迁移、恢复步骤",
    proof: "数据出事时知道能不能退、怎么退",
    plain: "代码可以回滚，写坏的数据不一定能自己恢复。上线前要先保护档案。",
  },
  {
    sceneId: "monitoring-tower",
    from: "数据保护",
    to: "监控哨塔",
    payload: "错误率、接口耗时、业务成功率",
    proof: "上线后能及时发现异常",
    plain:
      "发布后不是散场，而是观察。错误率、日志和关键业务指标会告诉你城门有没有开稳。",
  },
  {
    sceneId: "rollback-bench",
    from: "监控哨塔",
    to: "回滚机关",
    payload: "触发条件、回滚步骤、复测路径",
    proof: "异常时能退回稳定版本",
    plain:
      "回滚不是失败后临时想办法。上线前就要知道什么情况触发、怎么退、退完怎么证明恢复。",
  },
  {
    sceneId: "rollback-bench",
    from: "回滚机关",
    to: "上线决定",
    payload: "放行、灰度、暂缓或回滚",
    proof: "决定基于清单和监控，不基于侥幸",
    plain:
      "最后的决定不是勇敢或保守，而是证据够不够：能放行就放行，缺证据就暂缓。",
  },
];

const releaseReadinessScenes: QuestScene[] = [
  {
    id: "release-gate",
    image: questPortal,
    portrait: releaseGatekeeperPortrait,
    place: "上线城门",
    title: "城门要开，但不能只靠一声“冲”",
    speaker: "上线守门人",
    dialogue:
      "午夜的上线城门亮起金色纹路。守门人把钥匙按在门上，却没有立刻转动：上线不是勇气测试，是证据测试。",
    goal: "理解上线计划要写清发布窗口、影响范围、负责人和验证路径。",
    mentor:
      "先把上线当成一场有退路的行动。你要知道谁负责、影响谁、上线后看什么。",
    terms: [
      {
        term: "上线计划",
        meaning:
          "发布前写清的行动表，包括时间、范围、负责人、验证路径、监控和回滚。",
      },
      {
        term: "发布窗口",
        meaning:
          "允许上线和观察的时间段，通常要避开高峰，并确保有人能处理异常。",
      },
    ],
    clues: [
      {
        id: "release-plan",
        label: "打开上线卷轴",
        action: "检查计划是否能指导真实上线",
        result:
          "合格计划不只写“今晚发布”。它要写发布窗口、影响范围、负责人、上线后验证路径、监控指标和回滚条件。",
        snippet:
          "发布窗口：22:00-23:00\n影响范围：AI 开发路线第 14 章入口\n负责人：发布人 + 观察人\n验证：登录、保存、第 14 章路径",
        question: "这一步让你从“我会部署”升级成“我能组织一次可控上线”。",
        journeyIndex: 0,
        skill: "能判断上线计划是否可执行。",
      },
      {
        id: "blast-radius",
        label: "标出影响范围",
        action: "说明这次上线会碰到哪些用户路径",
        result:
          "第 14 章入口会改首页路线、教学桥、角色图鉴和测试。影响范围写清后，浏览器验收才不会只看一个按钮。",
        snippet: "影响范围：任务板、章节卷宗、教学桥、伙伴图鉴、移动端布局。",
        question: "上线前先知道影响范围，出事时才知道该查哪几扇门。",
        journeyIndex: 0,
        skill: "能说清上线影响范围。",
      },
    ],
  },
  {
    id: "env-key-vault",
    image: questArchive,
    portrait: releaseGatekeeperPortrait,
    place: "配置钥匙库",
    title: "本地有钥匙，不代表线上也有",
    speaker: "上线守门人",
    dialogue:
      "钥匙库里挂着三排钥匙：本地、测试、生产。守门人摘下生产那一串：上线前看的是这串，不是你口袋里的本地钥匙。",
    goal: "理解环境变量、密钥、URL 和功能开关为什么必须上线前确认。",
    mentor:
      "本地成功只是开发证据。上线要确认生产环境有需要的配置，而且密钥没有被打包进前端。",
    terms: [
      {
        term: "环境变量",
        meaning:
          "运行环境提供给应用的配置，例如数据库地址、AI API Key、站点域名和功能开关。",
      },
      {
        term: "功能开关",
        meaning:
          "用来灰度或关闭新功能的开关。出问题时可以先关功能，而不是立刻大面积回滚。",
      },
    ],
    clues: [
      {
        id: "env-check",
        label: "核对生产钥匙",
        action: "列出生产环境必须存在的配置",
        result:
          "AI 应用上线常见必查项：DATABASE_URL、AI_API_KEY、APP_ORIGIN、模型服务地址、日志开关。不能把真实密钥写进前端代码或交付说明。",
        snippet:
          "requiredEnv:\n- DATABASE_URL\n- AI_API_KEY\n- APP_ORIGIN\n- LOG_LEVEL",
        question:
          "面试里可以这样讲：我不会只说本地跑通，还会检查生产依赖是否具备。",
        journeyIndex: 1,
        skill: "能列出上线前配置检查项。",
      },
      {
        id: "secret-boundary",
        label: "查密钥边界",
        action: "确认密钥只在服务端使用",
        result:
          "前端能知道 AI 功能是否可用，但不能拿到 API Key。上线前要确认构建产物、日志和页面都没有泄露密钥。",
        snippet:
          "前端：/api/ai/status -> { configured: true }\n后端：process.env.AI_API_KEY\n禁止：把 key 写进 VITE_*",
        question: "这一步把第 7 章的密钥安全迁移到真实上线场景。",
        journeyIndex: 1,
        skill: "能解释生产密钥的安全边界。",
      },
    ],
  },
  {
    id: "backup-archive",
    image: questWorkbench,
    portrait: releaseGatekeeperPortrait,
    place: "备份档案库",
    title: "代码能退，数据不一定会自己回来",
    speaker: "上线守门人",
    dialogue:
      "档案库深处摆着一只沙漏。守门人把它倒转：代码回滚像倒回时间，数据写坏却可能已经改变现实。",
    goal: "理解数据备份、迁移和恢复步骤为什么是上线前的硬门槛。",
    mentor:
      "只要上线涉及数据库、用户数据或迁移，就要问：备份在哪里？恢复步骤是什么？迁移能不能回退？",
    terms: [
      {
        term: "数据备份",
        meaning:
          "上线前保存关键数据的可恢复副本。它要能找到、能恢复、恢复时间可接受。",
      },
      {
        term: "迁移",
        meaning:
          "改变数据库结构或数据形态的操作，例如新增字段、改索引、批量改数据。",
      },
    ],
    clues: [
      {
        id: "backup-proof",
        label: "确认备份证据",
        action: "检查备份是否真的可用",
        result:
          "备份不是一句“已备份”。要有备份时间、覆盖范围、保存位置、恢复步骤和负责人。涉及迁移时还要写清回滚是否只退代码就够。",
        snippet:
          "备份时间：2026-07-05 22:00\n覆盖：production.sqlite\n恢复：restore --from backup-id\n负责人：值守开发",
        question: "这一步让用户明白：数据保护是上线能力，不是后端神秘仪式。",
        journeyIndex: 2,
        skill: "能判断数据备份是否可信。",
      },
      {
        id: "migration-risk",
        label: "识别迁移风险",
        action: "判断数据库变化能否安全回退",
        result:
          "新增展示页面通常不需要迁移；如果改 schema、删除字段或批量改数据，就必须写迁移前备份和回滚策略。",
        snippet:
          "低风险：只新增第 14 章前端入口。\n高风险：删除字段、重建索引、批量改用户数据。",
        question: "你不是要害怕上线，而是要知道哪类上线必须保护数据。",
        journeyIndex: 2,
        skill: "能区分代码风险和数据风险。",
      },
    ],
  },
  {
    id: "monitoring-tower",
    image: questStage,
    portrait: releaseGatekeeperPortrait,
    place: "监控哨塔",
    title: "上线后，真正的夜巡才开始",
    speaker: "上线守门人",
    dialogue:
      "城门开了，远处却安静得不正常。守门人举起望远镜：没有报警不等于没事故，先看指标，再看日志。",
    goal: "理解上线后要观察错误率、接口耗时、日志和关键业务成功率。",
    mentor:
      "上线验收不是自己点一次页面就结束。要看真实路径、错误日志和关键业务指标有没有变坏。",
    terms: [
      {
        term: "错误率",
        meaning:
          "一段时间内失败请求占比。上线后错误率升高，通常说明新版本影响了真实流量。",
      },
      {
        term: "业务成功率",
        meaning:
          "用户关键动作成功的比例，例如保存成功率、登录成功率、AI 回复成功率。",
      },
    ],
    clues: [
      {
        id: "monitoring-signals",
        label: "点亮监控灯",
        action: "列出上线后要看的指标",
        result:
          "第 14 章上线后要看：页面能进入、教学进度能保存、API 没有 500、移动端无溢出、日志没有新错误。真实业务还要看保存成功率和 AI 调用失败率。",
        snippet:
          "watch 30min:\n- 5xx error rate\n- p95 latency\n- save success rate\n- AI call failure rate",
        question:
          "这一步让用户明白：上线后的证据来自系统表现，不是来自发布者的自信。",
        journeyIndex: 3,
        skill: "能列出上线后观察指标。",
      },
      {
        id: "smoke-test",
        label: "走一遍冒烟路径",
        action: "从真实入口验证关键用户路径",
        result:
          "冒烟测试要从首页开始：开场剧情、任务板、第 14 章卷宗、进入教学、点击第一条线索。桌面和 390px 都要走。",
        snippet:
          "首页 -> 领取委托 -> 第 14 章 -> 进入教学 -> 开始闯关 -> 打开上线卷轴",
        question: "这和你不想反复当测试员是同一件事：Agent 要自己走真实路径。",
        journeyIndex: 3,
        skill: "能设计上线冒烟测试路径。",
      },
    ],
  },
  {
    id: "rollback-bench",
    image: questPortal,
    portrait: releaseGatekeeperPortrait,
    place: "回滚机关室",
    title: "退路不是丢脸，是专业",
    speaker: "上线守门人",
    dialogue:
      "机关室中央有一枚反向齿轮。守门人把手放在齿轮旁：真正可靠的上线，是你在开门前就知道怎么关门。",
    goal: "能写清回滚触发条件、回滚步骤、数据影响和回滚后验证。",
    mentor:
      "回滚方案要回答四件事：什么时候退？怎么退？数据会怎样？退完怎么证明恢复？",
    terms: [
      {
        term: "回滚条件",
        meaning:
          "触发回滚的明确标准，例如 500 错误率超过阈值、保存成功率下降、关键页面无法进入。",
      },
      {
        term: "回滚后验证",
        meaning: "回滚完成后重新走关键路径，证明系统回到稳定状态。",
      },
    ],
    clues: [
      {
        id: "rollback-trigger",
        label: "刻下回滚条件",
        action: "把异常阈值写成可判断标准",
        result:
          "坏回滚条件：出事再说。好回滚条件：第 14 章入口 500、登录/保存主路径失败、错误率超过 2%、AI 调用失败率持续升高。",
        snippet:
          "rollbackWhen:\n- errorRate > 2%\n- chapter14 cannot open\n- save/login smoke test fails",
        question:
          "这一步会让你在面试里显得像能负责上线的人，而不是只会写功能。",
        journeyIndex: 4,
        skill: "能写出明确回滚条件。",
      },
      {
        id: "post-rollback-proof",
        label: "写回滚后验收",
        action: "说明退回稳定版本后怎么证明恢复",
        result:
          "回滚后不能只说版本退了。还要复测登录、保存、章节入口、API 健康和关键日志，确认用户路径恢复。",
        snippet:
          "rollbackVerify:\n- health ok\n- login ok\n- save ok\n- chapter route ok\n- no new 5xx logs",
        question:
          "上线面试复盘可以这样讲：我提前定义回滚条件，并用冒烟测试证明恢复。",
        journeyIndex: 5,
        skill: "能说明回滚后如何验收。",
      },
    ],
  },
];

const interviewReviewJourney: QuestJourneyItem[] = [
  {
    sceneId: "evidence-archive",
    from: "通关记录",
    to: "关卡证据",
    payload: "代码、测试、日志、数据库、浏览器路径",
    proof: "每个故事都有可复核证据",
    plain:
      "终章第一棒不是写简历，而是找证据。没有证据的项目经历，只是听起来很努力。",
  },
  {
    sceneId: "star-orrery",
    from: "关卡证据",
    to: "STAR 结构",
    payload: "Situation / Task / Action / Result",
    proof: "回答有现场、有目标、有行动、有结果",
    plain: "STAR 不是模板填空。它把混乱经历整理成面试官能跟上的故事路线。",
  },
  {
    sceneId: "incident-court",
    from: "STAR 结构",
    to: "故障复盘",
    payload: "现象、证据、根因、修复、验证",
    proof: "能讲清 bug 怎么被定位和证明修好",
    plain:
      "排障经历最有价值。你要让面试官看到你不是碰巧修好，而是沿证据链找到根因。",
  },
  {
    sceneId: "tradeoff-council",
    from: "故障复盘",
    to: "技术取舍",
    payload: "约束、方案、代价、验证",
    proof: "能解释为什么这样做，而不是只说用了什么",
    plain:
      "真正像工程师的地方在取舍：你知道为什么选、放弃了什么、承担了什么成本。",
  },
  {
    sceneId: "followup-mirror",
    from: "技术取舍",
    to: "追问演练",
    payload: "证据边界、失败路径、可迁移经验",
    proof: "第二问、第三问还能站住",
    plain: "好回答要能被追问。追问不是刁难，是检查你有没有真的理解。",
  },
  {
    sceneId: "answer-forge",
    from: "追问演练",
    to: "面试回答",
    payload: "可复用项目故事",
    proof: "能展示、能解释、能验收、能复盘",
    plain: "最后定稿不是背稿，而是形成一段真实、克制、可追问的项目经历。",
  },
];

const interviewReviewScenes: QuestScene[] = [
  {
    id: "evidence-archive",
    image: questArchive,
    portrait: interviewCouncilorPortrait,
    place: "证据档案馆",
    title: "证据不是简历装饰，是你的角色徽章",
    speaker: "终章答辩官",
    dialogue:
      "终章的门缓缓打开，十四枚徽章从暗处亮起。答辩官没有问你会什么技术，只问：哪一枚徽章能被追问？",
    goal: "理解面试素材必须来自具体证据，而不是空泛自夸。",
    mentor:
      "先从前 14 章挑证据：Network、日志、数据库、测试、交付说明、上线清单。每个证据都要能讲清它证明什么、不能证明什么。",
    terms: [
      {
        term: "面试素材",
        meaning: "能被讲述和追问的项目片段，必须包含场景、行动、证据和结果。",
      },
      {
        term: "成长证据",
        meaning:
          "证明你能力变化的产出，例如测试报告、修复复盘、Agent 任务、交付审查和上线清单。",
      },
    ],
    clues: [
      {
        id: "collect-evidence",
        label: "收集通关证据",
        action: "把前 14 章产出放进素材库",
        result:
          "素材库不要写“熟悉前后端”。要写：保存链路排障、登录态证据、AI API 密钥边界、RAG 引用、Agent 任务、交付审查、上线回滚。",
        snippet:
          "素材：保存丢失\n证据：POST 201 + SELECT 0 rows\n能力：能沿前端、接口、数据层定位持久化问题",
        question:
          "这一步让用户明白：面试讲项目不是包装，而是把证据整理成别人听得懂的故事。",
        journeyIndex: 0,
        skill: "能从学习产出里挑出面试证据。",
      },
      {
        id: "evidence-boundary",
        label: "写证据边界",
        action: "说明证据能证明什么、不能证明什么",
        result:
          "Network 201 能证明接口返回成功，不能证明数据库落库；SELECT 0 rows 才能反证持久化没发生。边界讲清楚，回答才专业。",
        snippet:
          "能证明：POST 到达接口并返回 201。\n不能证明：数据已经持久化。\n补证据：数据库 SELECT 和刷新复测。",
        question: "面试官喜欢追问边界。能说清边界，说明你不是背答案。",
        journeyIndex: 0,
        skill: "能解释证据的证明范围。",
      },
    ],
  },
  {
    id: "star-orrery",
    image: questStage,
    portrait: interviewCouncilorPortrait,
    place: "STAR 星盘",
    title: "模板不是答案，证据才会让星盘转动",
    speaker: "终章答辩官",
    dialogue:
      "四枚星环悬在空中：S、T、A、R。答辩官拨动第一枚：背景太长会遮住行动，结果没有证据会失去重量。",
    goal: "学会用 STAR 把项目经历讲成清楚、短、可验证的回答。",
    mentor:
      "STAR 的重点是 Action 和 Result。面试官最关心你做了什么、怎么判断有效。",
    terms: [
      {
        term: "STAR",
        meaning:
          "Situation 背景、Task 任务、Action 行动、Result 结果，用来组织项目经历。",
      },
      {
        term: "Result",
        meaning:
          "结果不是感觉变好了，而是测试通过、错误下降、用户路径走通、风险被记录。",
      },
    ],
    clues: [
      {
        id: "star-rewrite",
        label: "重写 STAR",
        action: "把空泛项目经历改成可追问回答",
        result:
          "空泛：我做过 AI 学习项目。清晰：我把保存丢失排障拆成前端、接口、数据层和数据库证据链，定位到只写内存没落库，并用刷新、SELECT 和测试验证。",
        snippet:
          "S：保存提示成功但刷新后消失\nT：定位断点并修复\nA：沿 response.ok、201、repository、SELECT 排查\nR：落库后刷新可见，测试通过",
        question:
          "这一步让用户知道：STAR 不是背模板，而是把项目证据压缩成清楚故事。",
        journeyIndex: 1,
        skill: "能把经历整理成 STAR 回答。",
      },
      {
        id: "result-proof",
        label: "给结果加证据",
        action: "把“变好了”改成可验证结果",
        result:
          "结果可以写：npm run verify 通过；桌面/390px 浏览器路径通过；保存后刷新仍可见；数据库能查到记录。不要写“体验提升很多”却没有证据。",
        snippet:
          "弱结果：页面更稳定了。\n强结果：保存 -> 刷新 -> 查询数据库均通过，回归测试通过。",
        question: "有证据的 Result，才不会在面试追问里塌掉。",
        journeyIndex: 1,
        skill: "能给面试结果补证据。",
      },
    ],
  },
  {
    id: "incident-court",
    image: questPortal,
    portrait: interviewCouncilorPortrait,
    place: "故障复盘庭",
    title: "会修 bug 不够，要会讲清为什么修对了",
    speaker: "终章答辩官",
    dialogue:
      "复盘庭里回放着每一关事故：登录掉线、接口报错、数据重复、页面变慢。答辩官说：你要讲的不是 bug 多，而是你如何让混乱变成证据。",
    goal: "能把排障经历讲成现象、证据、根因、修复、验证和防复发。",
    mentor:
      "故障复盘最能体现工程能力：不要只说修好了，要讲你怎么定位，怎么证明不是猜中。",
    terms: [
      {
        term: "根因",
        meaning:
          "造成问题的真正断点，不是表面报错。例如保存失败的根因可能在数据层没有写库。",
      },
      {
        term: "防复发",
        meaning:
          "防止同类问题再发生的措施，例如测试、唯一约束、监控、任务模板或审查清单。",
      },
    ],
    clues: [
      {
        id: "incident-chain",
        label: "串起故障链",
        action: "把故障按证据顺序讲出来",
        result:
          "讲排障时用固定顺序：现象是什么、看了哪些证据、排除了什么、根因在哪里、怎么修、怎么验证、之后怎么防复发。",
        snippet:
          "现象 -> Network -> 后端日志 -> 数据库 -> 根因 -> 修复 -> 测试 -> 防复发",
        question: "这会帮助初学者不再说“我不知道从哪讲起”。",
        journeyIndex: 2,
        skill: "能讲清一次故障复盘。",
      },
      {
        id: "prevention-note",
        label: "补防复发措施",
        action: "把一次修复沉淀成下次护栏",
        result:
          "保存丢失可以补持久化测试；重复提交可以补唯一约束和幂等；Agent 交付可以补验收清单；上线事故可以补回滚条件。",
        snippet:
          "防复发：\n- 回归测试\n- 验收清单\n- 日志/监控\n- Agent 任务模板",
        question: "面试里这很加分：你不只是救火，还会把经验变成系统护栏。",
        journeyIndex: 2,
        skill: "能把修复转成防复发措施。",
      },
    ],
  },
  {
    id: "tradeoff-council",
    image: questWorkbench,
    portrait: interviewCouncilorPortrait,
    place: "取舍议会桌",
    title: "技术名词不会替你回答为什么",
    speaker: "终章答辩官",
    dialogue:
      "议会桌上摆着三封方案：快做、稳做、可回滚地做。答辩官推给你羽笔：说出你选哪一个，也说出你付出了什么代价。",
    goal: "能解释技术取舍：约束、候选方案、选择理由、代价和验证。",
    mentor: "技术取舍不是炫技。你要讲清当时约束是什么，为什么不选另一个方案。",
    terms: [
      {
        term: "技术取舍",
        meaning: "在多个方案之间基于目标、风险、成本和时间做选择，并承认代价。",
      },
      {
        term: "代价",
        meaning:
          "方案带来的成本，例如多一层接口、更多测试、性能开销或维护复杂度。",
      },
    ],
    clues: [
      {
        id: "tradeoff-answer",
        label: "回答为什么这样做",
        action: "把方案选择讲成取舍",
        result:
          "AI API 走后端转发，是因为密钥不能进前端；代价是多一层服务端接口和错误兜底；验证是前端包无密钥、失败有提示、日志能定位。",
        snippet:
          "选择：服务端转发 AI API\n理由：密钥安全\n代价：多一层接口和错误处理\n验证：前端无 key + fallback + logs",
        question: "这一步让用户从“我用了某技术”变成“我知道为什么用”。",
        journeyIndex: 3,
        skill: "能讲清技术取舍。",
      },
      {
        id: "scope-honesty",
        label: "承认边界",
        action: "说明哪些没做、为什么没做",
        result:
          "可以说：第 1-15 章已经接入剧情教学和各自实战 Lab；自动化能证明路径可用，但真人学习效果、作品集导出和多岗位路线仍需要继续验证与扩展。诚实边界比夸大更可信。",
        snippet:
          "已完成：AI 主线 1-15 章工程闭环。\n未完成：真人学习效果、作品集导出、多岗位路线。",
        question: "面试官不怕你没做完所有事，怕你不知道边界在哪里。",
        journeyIndex: 3,
        skill: "能诚实说明项目边界。",
      },
    ],
  },
  {
    id: "followup-mirror",
    image: questArchive,
    portrait: interviewCouncilorPortrait,
    place: "追问镜厅",
    title: "第二问还能站住，才是真的理解",
    speaker: "终章答辩官",
    dialogue:
      "镜厅里回荡着面试官的追问：为什么 201 不能证明落库？RAG 引用错了怎么办？Agent 越权怎么拦？答辩官笑了：现在，别躲。",
    goal: "准备追问，把回答从背稿变成可讨论的工程理解。",
    mentor:
      "追问要围绕证据边界、失败路径和可迁移经验。每一问都回到你真正看过的证据。",
    terms: [
      {
        term: "证据边界",
        meaning: "某个证据能证明什么、不能证明什么。说清边界可以避免夸大。",
      },
      {
        term: "可迁移经验",
        meaning:
          "这次项目经验能迁移到类似工作问题里的方法，例如沿数据流排查、用测试证明、用回滚保护上线。",
      },
    ],
    clues: [
      {
        id: "followup-list",
        label: "生成追问清单",
        action: "给每段回答准备 2 个追问",
        result:
          "保存丢失追问：为什么 201 不能证明落库？如果用户连点导致重复写怎么办？RAG 追问：chunk 怎么切？引用不存在怎么处理？",
        snippet:
          "追问：\n1. 这个证据不能证明什么？\n2. 同类问题换个场景怎么排查？",
        question: "这一步让回答不再是背稿，而是有下一层理解。",
        journeyIndex: 4,
        skill: "能准备面试追问。",
      },
      {
        id: "agent-interviewer",
        label: "让 Agent 扮演面试官",
        action: "写清追问规则，不让 Agent 只夸你",
        result:
          "给 Agent 的面试官任务要写：请基于我的项目回答追问证据边界、失败路径和技术取舍；不要直接给标准答案，先指出薄弱点。",
        snippet:
          "请扮演严格面试官：\n- 追问证据边界\n- 追问失败路径\n- 追问技术取舍\n- 不要只夸我",
        question: "这和第 12 章呼应：会写任务，才能让 Agent 帮你练面试。",
        journeyIndex: 4,
        skill: "能写面试追问 Agent 任务。",
      },
    ],
  },
  {
    id: "answer-forge",
    image: questStage,
    portrait: interviewCouncilorPortrait,
    place: "答辩定稿台",
    title: "终章不是结束，是你能独立讲清楚自己",
    speaker: "终章答辩官",
    dialogue:
      "定稿台上，十五枚徽章排成一条星河。答辩官把最后一枚递给你：你不需要假装无所不能，你要证明自己会学习、会定位、会验证、会复盘。",
    goal: "形成一段可复用、可追问、能体现成长的面试回答。",
    mentor:
      "最后的回答要短、真、有证据、有边界。别夸大，别背稿，把你如何解决问题讲清楚。",
    terms: [
      {
        term: "面试回答",
        meaning:
          "一段可以在求职场景复用的项目表达，包含背景、行动、结果、取舍和可追问证据。",
      },
      {
        term: "岗位匹配",
        meaning:
          "把项目经历和目标岗位能力连接起来，例如 AI 开发岗位关注 AI API、RAG、Agent、安全和验收。",
      },
    ],
    clues: [
      {
        id: "final-answer",
        label: "定稿一段回答",
        action: "把证据、STAR、取舍和追问合成面试回答",
        result:
          "终稿应该能说明：我接手了一个 AI 开发学习项目，把保存、登录、接口、AI、RAG、Agent、测试、上线拆成关卡；每关都有证据链和验收，最后能转成面试复盘。",
        snippet:
          "我做的不只是页面，而是一条工程能力路线：读项目 -> 定位问题 -> 写 Agent 任务 -> 验收交付 -> 上线复盘。",
        question: "这一章把整个 RPG 的学习目标收束到求职表达。",
        journeyIndex: 5,
        skill: "能形成可复用面试回答。",
      },
      {
        id: "growth-close",
        label: "写成长结论",
        action: "说明自己从见习到能独立处理问题的变化",
        result:
          "成长结论不是“我学会了很多”。要写：我现在能看懂前后端和数据库链路，能用证据定位 bug，能写 Agent 任务，能审交付，能说上线退路和面试复盘。",
        snippet:
          "成长证据：\n- 会追数据流\n- 会读 Network/日志/数据库\n- 会写任务和验收\n- 会讲项目复盘",
        question:
          "这就是用户打开产品要成为的人：不是刷题的人，而是能独立面对工作的人。",
        journeyIndex: 5,
        skill: "能把成长讲成证据链。",
      },
    ],
  },
];

function EvidenceStoryQuest({
  developer,
  saving,
  scenes = questScenes,
  journey = questJourney,
  journeyTitle = "保存数据的完整旅行路线",
  stepLabel = "地点",
  onComplete,
}: {
  developer: DeveloperProfile;
  saving: boolean;
  scenes?: QuestScene[];
  journey?: QuestJourneyItem[];
  journeyTitle?: string;
  stepLabel?: string;
  onComplete: () => void;
}) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [discovered, setDiscovered] = useState<Record<string, string[]>>({});
  const [activeClueId, setActiveClueId] = useState<string | null>(null);
  const scene = scenes[sceneIndex];
  const sceneDiscovered = discovered[scene.id] ?? [];
  const activeClue =
    scene.clues.find((clue) => clue.id === activeClueId) ??
    scene.clues.find((clue) => sceneDiscovered.includes(clue.id)) ??
    null;
  const sceneDone = scene.clues.every((clue) =>
    sceneDiscovered.includes(clue.id),
  );
  const totalFound = Object.values(discovered).reduce(
    (total, items) => total + items.length,
    0,
  );
  const totalClues = scenes.reduce(
    (total, item) => total + item.clues.length,
    0,
  );
  const activeJourneyIndex =
    activeClue?.journeyIndex ??
    Math.max(
      journey.findIndex((item) => item.sceneId === scene.id),
      0,
    );
  const activeJourney = journey[activeJourneyIndex] ?? journey[0];

  const discover = (clue: QuestClue) => {
    setActiveClueId(clue.id);
    if (sceneDiscovered.includes(clue.id)) return;
    setDiscovered({
      ...discovered,
      [scene.id]: [...sceneDiscovered, clue.id],
    });
  };

  const goNext = () => {
    setActiveClueId(null);
    if (sceneIndex + 1 < scenes.length) {
      setSceneIndex(sceneIndex + 1);
      scrollPageToTop();
      return;
    }
    onComplete();
  };

  return (
    <main
      className={`quest-shell quest-scene-${scene.id}`}
      style={{ "--quest-bg": `url(${scene.image})` } as CSSProperties}
    >
      <div className="quest-camera" />
      <header className="quest-hud" aria-label="调查进度">
        <div>
          <span>{developer.rank}</span>
          <strong>{developer.xp} XP</strong>
        </div>
        <div>
          <span>线索</span>
          <strong>
            {totalFound}/{totalClues}
          </strong>
        </div>
        <div>
          <span>{stepLabel}</span>
          <strong>
            {sceneIndex + 1}/{scenes.length}
          </strong>
        </div>
      </header>

      <section className="quest-stage">
        {journey.length > 0 && activeJourney && (
          <section className="quest-flow-board" aria-label="完整流程">
            <header>
              <span>先看整条路</span>
              <strong>{journeyTitle}</strong>
              <p>
                每个地点只是在放大其中一棒。你不用背术语，先看清谁把什么交给谁。
              </p>
            </header>
            <div className="quest-flow-track">
              {journey.map((item, index) => {
                const active = index === activeJourneyIndex;
                const done = index < activeJourneyIndex;
                return (
                  <article
                    className={`${active ? "active" : ""} ${
                      done ? "done" : ""
                    }`}
                    key={`${item.sceneId}-${item.from}-${item.to}`}
                  >
                    <small>第 {index + 1} 棒</small>
                    <b>
                      {item.from} → {item.to}
                    </b>
                    <strong>{item.payload}</strong>
                    <span>{item.proof}</span>
                  </article>
                );
              })}
            </div>
            <div className="quest-flow-focus">
              <b>现在这一幕在看</b>
              <strong>
                {activeJourney.from} 把「{activeJourney.payload}」交给{" "}
                {activeJourney.to}
              </strong>
              <p>{activeJourney.plain}</p>
            </div>
          </section>
        )}

        <div className="quest-place-card">
          <div className="quest-character" aria-label="剧情角色">
            <img
              className="quest-character-portrait"
              src={scene.portrait ?? archiveKeeperPortrait}
              alt=""
            />
            <div>
              <b>{scene.speaker}</b>
              <small>{scene.place} 角色</small>
            </div>
          </div>
          <span>{scene.place}</span>
          <h1>{scene.title}</h1>
          <p>{scene.goal}</p>
          {scene.terms && (
            <div className="quest-terms" aria-label="名词小抄">
              <b>名词小抄</b>
              {scene.terms.map((item) => (
                <div key={item.term}>
                  <strong>{item.term}</strong>
                  <span>{item.meaning}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quest-play-area">
          <aside className="quest-clues" aria-label="可探索线索">
            <span>探索点</span>
            {scene.clues.map((clue) => {
              const found = sceneDiscovered.includes(clue.id);
              return (
                <button
                  key={clue.id}
                  className={`${activeClueId === clue.id ? "active" : ""} ${
                    found ? "found" : ""
                  }`}
                  onClick={() => discover(clue)}
                >
                  <strong>{clue.label}</strong>
                  <small>{found ? "已记录" : clue.action}</small>
                </button>
              );
            })}
          </aside>

          <div className="quest-dialogue">
            <span className="speaker">
              {activeClue ? "线索记录" : scene.speaker}
            </span>
            {!activeClue ? (
              <>
                <p>{scene.dialogue}</p>
                <small>{scene.mentor}</small>
              </>
            ) : (
              <>
                <p>{activeClue.result}</p>
                {activeClue.snippet && (
                  <pre className="quest-snippet">
                    <code>{activeClue.snippet}</code>
                  </pre>
                )}
                {activeClue.question && (
                  <div className="quest-question">{activeClue.question}</div>
                )}
                <small>{activeClue.skill}</small>
              </>
            )}
            <footer>
              <div className="quest-scene-dots" aria-hidden="true">
                {scenes.map((item, index) => (
                  <i
                    key={item.id}
                    className={index === sceneIndex ? "active" : ""}
                  />
                ))}
              </div>
              <button
                className="dialogue-next"
                disabled={!sceneDone || saving}
                onClick={goNext}
              >
                {sceneIndex + 1 < scenes.length
                  ? sceneDone
                    ? "前往下一地点"
                    : "先找齐本地点线索"
                  : sceneDone
                    ? "进入实战修复"
                    : "先找齐本地点线索"}
                <ArrowRight size={17} />
              </button>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}

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
        <h2>
          <Network size={28} /> 项目地图
        </h2>
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
            已查看 {dismissed.size}/{map.nodes.length} 个节点，至少{" "}
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

function explainCodeLine(line: string): string {
  const compact = line.trim();
  if (!compact) return "空行只是把代码分段，方便你看清结构。";
  if (compact.startsWith("//"))
    return "这是作者留给读代码的人看的提示，不会被程序执行。";
  if (compact.includes("fetch(") || compact.includes("POST")) {
    return "这里把页面里的动作送到接口，下一步要去 Network 或后端路由看它有没有到达。";
  }
  if (compact.includes("JSON.stringify")) {
    return "这里把页面状态打包成请求体，后端收到的字段就从这里来。";
  }
  if (compact.includes("response.ok")) {
    return "这里判断接口状态是否成功。它只能证明接口回应成功，不能单独证明数据已经保存。";
  }
  if (compact.includes("response.json")) {
    return "这里把后端返回的内容读出来，页面后续展示或保存的对象来自这里。";
  }
  if (compact.includes("setError")) {
    return "这里把失败原因显示给用户，是前端把接口错误翻译成人能看懂提示的地方。";
  }
  if (compact.includes("return res.status")) {
    return "这里是后端盖章返回结果。状态码会成为前端和 Network 里的关键证据。";
  }
  if (compact.includes("logger.")) {
    return "这里把原因写进后端日志。页面看不到它，但排障时可以用它确认后端发生了什么。";
  }
  if (compact.includes("await ") || compact.includes("save")) {
    return "这里把事情交给下一层处理。要继续追踪，就看被调用的函数或保存后的证据。";
  }
  if (compact.includes("const ") || compact.includes("let ")) {
    return "这里是在给一份数据起名字。先看它从哪里来，再看后面交给了谁。";
  }
  if (compact.includes("if ")) {
    return "这里是分岔口：条件成立走错误或特殊路径，不成立才继续主流程。";
  }
  if (compact.includes("};") || compact === "}" || compact === "});") {
    return "这里结束一个代码块，说明这一段交接已经收口。";
  }
  return "这一行负责把当前这棒的材料继续加工。先不用背语法，抓住输入和输出。";
}

function splitProjectPosition(position?: string) {
  return (position ?? "")
    .split(/\s*→\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
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

  const flowParts = splitProjectPosition(step.projectPosition);
  const canProve = focus.observationGoal;
  const cannotProve = `这几行不能单独证明「${focus.output}」已经在真实环境发生。还要继续看 Network、后端日志、数据库记录或测试结果。`;
  const agentBrief = `请只围绕 ${focus.filePath} 的 ${focus.functionName} 检查「${step.projectPosition ?? step.goal}」：输入是「${focus.input}」，输出应该是「${focus.output}」。请说明这几行能证明什么、不能证明什么，并给出下一步验收证据。`;

  return (
    <section className="teaching-shell code-tour-shell">
      <header className="teaching-header">
        <span className="mini-label">
          教学模式 · 引导式阅读 {stepIndex + 1}/{totalSteps}
        </span>
        <h2>{step.title}</h2>
        <p className="tour-goal">{step.goal}</p>
      </header>

      <div className="tour-reading-compass" aria-label="代码阅读罗盘">
        <div>
          <span>这一棒</span>
          <strong>{step.projectPosition ?? step.goal}</strong>
          <p>先把代码放回完整流程里看，不要一上来就逐字硬啃。</p>
        </div>
        <div>
          <span>入口</span>
          <strong>{focus.input}</strong>
          <p>这就是上一棒交给这段代码的材料。</p>
        </div>
        <div>
          <span>出口</span>
          <strong>{focus.output}</strong>
          <p>读完之后，你要能说清它把材料交给了谁。</p>
        </div>
      </div>

      {flowParts.length > 1 && (
        <div className="tour-route-ladder" aria-label="这几行在流程中的位置">
          {flowParts.map((part, index) => (
            <Fragment key={`${part}-${index}`}>
              <span
                className={
                  index === Math.max(0, Math.floor(flowParts.length / 2))
                    ? "active"
                    : ""
                }
              >
                {part}
              </span>
              {index < flowParts.length - 1 && <ArrowRight size={14} />}
            </Fragment>
          ))}
        </div>
      )}

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

      <div className="tour-section tour-line-notes">
        <h3>
          <Lightbulb size={16} />
          逐行翻译：先看人话，再看语法
        </h3>
        <div>
          {focus.lines.map((line, i) => (
            <article key={`${line}-${i}`}>
              <code>{String(i + 1).padStart(2, "0")}</code>
              <p>{explainCodeLine(line)}</p>
            </article>
          ))}
        </div>
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

      <div className="tour-proof-grid" aria-label="证据边界和 Agent 交接">
        <article>
          <span>能证明</span>
          <p>{canProve}</p>
        </article>
        <article>
          <span>不能证明</span>
          <p>{cannotProve}</p>
        </article>
        <article>
          <span>交给 Agent</span>
          <p>{agentBrief}</p>
        </article>
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
  developer,
  onComplete,
}: {
  attemptId: string;
  scenario: TeachingScenario;
  developer: DeveloperProfile;
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
  const [storyQuestComplete, setStoryQuestComplete] = useState(false);

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

  useEffect(() => {
    if (!showIntro) scrollPageToTop();
  }, [currentStepIdx, showIntro]);

  const scenarioStepIds = new Set(scenario.steps.map((step) => step.id));
  const completedScenarioStepCount = new Set(
    progress
      .filter((p) => p.completed && scenarioStepIds.has(p.stepId))
      .map((p) => p.stepId),
  ).size;
  const teachingProgressPercent =
    scenario.steps.length === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (completedScenarioStepCount / scenario.steps.length) * 100,
          ),
        );

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
      setStoryQuestComplete(false);
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

  const isCanvasStorm = scenario.scenarioId === "case-002";
  const isLoginState = scenario.scenarioId === "case-003-login-state";
  const isApiError = scenario.scenarioId === "case-004-api-error";
  const isConsistency = scenario.scenarioId === "case-005-data-consistency";
  const isPerformance = scenario.scenarioId === "case-006-performance";
  const isAiApi = scenario.scenarioId === "case-007-ai-api";
  const isHallucination = scenario.scenarioId === "case-008-hallucination";
  const isRag = scenario.scenarioId === "case-009-rag";
  const isAgentTools = scenario.scenarioId === "case-010-agent-tools";
  const isTestingProof = scenario.scenarioId === "case-011-testing-proof";
  const isAgentBrief = scenario.scenarioId === "case-012-agent-brief";
  const isDeliveryReview = scenario.scenarioId === "case-013-delivery-review";
  const isReleaseReadiness =
    scenario.scenarioId === "case-014-release-readiness";
  const isInterviewReview = scenario.scenarioId === "case-015-interview-review";
  const storyScenes = isCanvasStorm
    ? canvasStormScenes
    : isLoginState
      ? loginStateScenes
      : isApiError
        ? apiErrorScenes
        : isConsistency
          ? consistencyScenes
          : isPerformance
            ? performanceScenes
            : isAiApi
              ? aiApiScenes
              : isHallucination
                ? hallucinationScenes
                : isRag
                  ? ragScenes
                  : isAgentTools
                    ? agentToolsScenes
                    : isTestingProof
                      ? testingProofScenes
                      : isAgentBrief
                        ? agentBriefScenes
                        : isDeliveryReview
                          ? deliveryReviewScenes
                          : isReleaseReadiness
                            ? releaseReadinessScenes
                            : isInterviewReview
                              ? interviewReviewScenes
                              : questScenes;
  const storyJourney = isCanvasStorm
    ? canvasStormJourney
    : isLoginState
      ? loginStateJourney
      : isApiError
        ? apiErrorJourney
        : isConsistency
          ? consistencyJourney
          : isPerformance
            ? performanceJourney
            : isAiApi
              ? aiApiJourney
              : isHallucination
                ? hallucinationJourney
                : isRag
                  ? ragJourney
                  : isAgentTools
                    ? agentToolsJourney
                    : isTestingProof
                      ? testingProofJourney
                      : isAgentBrief
                        ? agentBriefJourney
                        : isDeliveryReview
                          ? deliveryReviewJourney
                          : isReleaseReadiness
                            ? releaseReadinessJourney
                            : isInterviewReview
                              ? interviewReviewJourney
                              : questJourney;
  const storyRouteLabel = isCanvasStorm
    ? "CanvasStorm 从想法到草案的路线"
    : isLoginState
      ? "登录态从页面到后端验证的路线"
      : isApiError
        ? "接口失败从页面到日志的路线"
        : isConsistency
          ? "重复提交从页面到数据库的路线"
          : isPerformance
            ? "页面变慢从用户到复测的路线"
            : isAiApi
              ? "AI 请求从用户到模型再回到页面的路线"
              : isHallucination
                ? "AI 回答从问题到引用校验的路线"
                : isRag
                  ? "RAG 资料从文档到回答引用的路线"
                  : isAgentTools
                    ? "Agent 工具从计划到受控执行的路线"
                    : isTestingProof
                      ? "可信验收从复现到报告的路线"
                      : isAgentBrief
                        ? "Agent 委托从现场到验收的路线"
                        : isDeliveryReview
                          ? "Agent 交付从说明到接收决定的路线"
                          : isReleaseReadiness
                            ? "上线从交付到回滚决定的路线"
                            : isInterviewReview
                              ? "面试回答从证据到追问定稿的路线"
                              : "保存数据的完整旅行路线";
  const storyStepLabel = isCanvasStorm ? "章节" : "地点";

  if (showIntro) {
    const introConfig = isCanvasStorm
      ? {
          badge: "主线 1-2",
          title: "思维风暴：AI 点子为什么会空泛",
          desc: "真实项目 CanvasStorm：先写 Project Brief，再选方向、筛候选、保存会话。",
          copy: "这次我们拆 CanvasStorm 这种真实产品思路：用户先写项目背景，AI 按方向生成候选，用户筛选后保存成会话。每一章都会先解释名词，再给一条很短的链路，让你知道它为什么影响产品效果。",
          evidence: [
            ["输入", "Project Brief"],
            ["输出", "候选看板 + 执行草案"],
            ["能力", "把 AI 功能讲成产品链路"],
          ],
          bg: questStage,
        }
      : isLoginState
        ? {
            badge: "主线 1-3",
            title: "身份回廊：登录状态为什么会丢",
            desc: "用户刚登录成功，刷新后却又被赶回门外。Cookie、Token 和 Session 到底谁失忆了？",
            copy: "这一关先不甩概念定义。你会跟着一张门牌从登录表单走到后端登记库，看到浏览器把什么带回去、后端又查什么。最后你要能说清：刷新后掉登录，应该用哪些证据判断是前端状态、Cookie 还是后端 Session 的问题。",
            evidence: [
              ["门牌", "Cookie + Token"],
              ["登记册", "后端 Session"],
              ["反证", "GET /me → 401"],
            ],
            bg: questPortal,
          }
        : isApiError
          ? {
              badge: "主线 1-4",
              title: "接口审判庭：接口为什么会报错",
              desc: "页面只看到红色报错，但真正的原因可能在请求参数、状态码、后端校验或日志里。",
              copy: "这一关把接口报错拆成一场审判：前端递交申请表，接口盖状态码，校验官指出字段问题，日志档案记录后台原因。你要学会用 Network、响应体和日志判断失败到底发生在哪一层。",
              evidence: [
                ["申请表", "Network Payload"],
                ["红章", "400 / 500"],
                ["档案", "后端日志"],
              ],
              bg: questStage,
            }
          : isConsistency
            ? {
                badge: "主线 1-5",
                title: "一致性熔炉：数据为什么重复/错乱",
                desc: "用户只是点了一次，数据库却多出几条记录。是按钮太快，还是后端没有守门？",
                copy: "这一关把重复提交讲成一条清楚的路线：用户动作可能变成多次请求，前端要减少连点，后端要用 Idempotency-Key 查重，数据库要用唯一约束和事务兜底。最后你要能证明：重复请求真的来了，但核心数据只留下了一份。",
                evidence: [
                  ["重复", "多次 POST"],
                  ["门牌", "Idempotency-Key"],
                  ["验收", "SELECT count(*) → 1"],
                ],
                bg: questWorkbench,
              }
            : isPerformance
              ? {
                  badge: "主线 1-6",
                  title: "慢速迷雾：页面为什么慢",
                  desc: "页面打开很慢，到底是资源太大、接口太慢、数据库卡住，还是前端渲染撑不住？",
                  copy: "这一关不让你凭感觉优化。你会跟着雾灯猫查看 Network 瀑布图、TTFB、后端计时日志、渲染数量和缓存复测，最后能写出一份 Agent 看得懂、面试官也听得懂的性能优化任务。",
                  evidence: [
                    ["账本", "Network 瀑布图"],
                    ["等待", "TTFB + 后端日志"],
                    ["复测", "优化前后耗时对比"],
                  ],
                  bg: questPortal,
                }
              : isAiApi
                ? {
                    badge: "主线 1-7",
                    title: "模型熔炉：AI 接口怎么接",
                    desc: "用户想让 AI 回复，但真正的密钥不能放在前端。谁去点火？流式结果怎么回来？失败时怎么兜底？",
                    copy: "这一关把 AI API 接入拆成一条工程路线：用户输入交给前端，前端只请求自己的后端；后端从环境变量读取密钥，再调用模型服务；模型流式返回内容，前端逐段显示。最后你要能证明：前端包里没有密钥，失败时用户看得懂，日志能定位。",
                    evidence: [
                      ["密钥", "server-only API Key"],
                      ["通道", "POST /api/ai/chat"],
                      ["体验", "stream reader + fallback"],
                    ],
                    bg: questWorkbench,
                  }
                : isHallucination
                  ? {
                      badge: "主线 1-8",
                      title: "幻觉镜厅：AI 回复为什么胡说",
                      desc: "AI 回答得很顺，但没有引用来源。它到底是根据资料回答，还是在补全空白？",
                      copy: "这一关把“AI 胡说”拆成工程路线：用户问题先写成 Prompt 委托，后端把带编号的资料片段放进 context，模型输出 answer、citations 和 confidence，服务端再校验引用是否真的来自本轮资料。最后你要能证明：有资料时能答，没资料时不编。",
                      evidence: [
                        ["委托", "grounded Prompt"],
                        ["证物", "context chunks + citations"],
                        ["验收", "无资料时拒答"],
                      ],
                      bg: questPortal,
                    }
                  : isRag
                    ? {
                        badge: "主线 1-9",
                        title: "知识迷宫：RAG 知识库",
                        desc: "AI 想回答公司资料问题，不能靠记忆猜。它必须先找到正确书页，再带着引用开口。",
                        copy: "这一关把 RAG 拆成一条可检查路线：资料先进入知识库，长文档被切成带来源的 chunk，chunk 生成 embedding 写入索引；用户提问时，系统检索 topK 命中片段，把它们作为 context 交给模型，最后展示带 citations 的回答。最后你要能证明：命中了哪几页、分数如何、答案引用是否真的来自这些页。",
                        evidence: [
                          ["资料", "source + chunk id"],
                          ["检索", "topK matches + score"],
                          ["回答", "citations 指回原文"],
                        ],
                        bg: questArchive,
                      }
                    : isAgentTools
                      ? {
                          badge: "主线 1-10",
                          title: "工具契约大厅：Agent 工具调用",
                          desc: "Agent 想替你查数据、调接口、执行动作。它能做事，但每一步都必须先验明工具、参数、权限和失败回退。",
                          copy: "这一关把 Agent 工具调用拆成一条安全路线：用户目标先变成 Agent 计划，Agent 只能选择注册表里的工具；工具执行前先校验参数 schema，再检查当前用户和环境权限；合法调用才执行，失败时返回结构化错误和 requestId。最后你要能证明：正常调用有结果，坏参数被拦，越权动作被拒绝。",
                          evidence: [
                            ["工具", "tool registry"],
                            ["门禁", "schema + permission"],
                            ["回退", "TOOL_FAILED + requestId"],
                          ],
                          bg: questPortal,
                        }
                      : isTestingProof
                        ? {
                            badge: "主线 1-11",
                            title: "验收试炼场：测试怎么证明修好了",
                            desc: "验收试炼官拦在门前：Agent 说修好了还不够。你要能拿出复现、自动化测试、手动报告和回归风险，证明交付可信。",
                            copy: "这一关把测试验收拆成一条证据路线：先把旧故障写成能失败的复现用例，再用单元测试守住关键函数，用集成测试证明模块交接没有掉东西，最后从真实入口生成手动测试报告，并说明哪些风险已经覆盖、哪些还没有。最后你要能写出一份让 Agent、同事和面试官都能复核的验收证据。",
                            evidence: [
                              ["复现", "red → green"],
                              ["自动化", "unit + integration"],
                              ["报告", "generatedAt + fingerprint"],
                            ],
                            bg: questStage,
                          }
                        : isAgentBrief
                          ? {
                              badge: "主线 1-12",
                              title: "委托书工坊：Agent 任务怎么写",
                              desc: "委托书锻造师把空白契约推到你面前：你不是把愿望丢给 Agent，而是把现场、目标、边界、验收和风险锻造成一份可执行委托。",
                              copy: "这一关把 Agent 任务拆成五段：先交代问题现场和已有证据，再写出可观察目标；然后划定范围和禁止事项，写清验收命令、浏览器路径和可见结果；最后补上风险、未覆盖项和回滚思路。最后你要能证明：这份任务让 Agent 知道做什么、不做什么、怎么证明做完，并把“我会指挥 Agent 做项目”整理成能讲给面试官听的复盘。",
                              evidence: [
                                ["背景", "现象 + 证据"],
                                ["边界", "scope + constraints"],
                                ["验收", "verify + browser path"],
                              ],
                              bg: questWorkbench,
                            }
                          : isDeliveryReview
                            ? {
                                badge: "主线 1-13",
                                title: "交付审查庭：怎么审查 Agent 交付",
                                desc: "Agent 说“已完成”只是开庭铃声。你要审说明、看 Diff、核测试、追边界，再决定接收还是要求补证。",
                                copy: "这一关把交付审查拆成六步：先读交付说明，确认它覆盖摘要、验证和风险；再用 Diff 核对改动范围；接着查看自动化和浏览器证据，补上移动端、刷新、旧章节等边界；最后检查 README、HANDOFF、任务表和 changelog 是否同步。你要能把“我觉得不行”改写成“缺这几份证据”。",
                                evidence: [
                                  ["说明", "delivery note"],
                                  ["证物", "diff + tests"],
                                  ["决定", "accept / request changes"],
                                ],
                                bg: questStage,
                              }
                            : isReleaseReadiness
                              ? {
                                  badge: "主线 1-14",
                                  title: "上线前夜：上线前检查什么",
                                  desc: "上线守门人挡在城门前：交付通过不等于可以开门。上线前要核计划、环境变量、备份、冒烟测试、监控和回滚，确保出事能发现、能退、能保护数据。",
                                  copy: "这一关把上线拆成一条工程路线：先写上线计划和影响范围，再核生产环境变量、密钥和功能开关；如果碰到数据变更，就确认备份和恢复步骤；上线前走桌面和 390px 冒烟测试，上线后看错误率、接口耗时和关键业务成功率；最后提前写清回滚条件和回滚后验证。你要能在面试里把“我会部署”升级成“我能负责一次可控上线”。",
                                  evidence: [
                                    ["计划", "release checklist"],
                                    ["运行", "env + backup + monitoring"],
                                    ["退路", "rollback + smoke test"],
                                  ],
                                  bg: questPortal,
                                }
                              : isInterviewReview
                                ? {
                                    badge: "主线 1-15",
                                    title: "终章答辩厅：面试怎么讲项目",
                                    desc: "终章答辩官敲响议会钟：面试官不只听你做过什么，还会追问证据、边界和取舍。终章要把前 14 章的通关产出炼成可追问的项目回答。",
                                    copy: "这一关把面试复盘拆成一条路线：先从通关记录里挑出能展示、能解释、能验收的证据；再用 STAR 压缩成清楚回答；排障经历要讲现象、证据、根因、修复和验证；技术经历要讲约束、方案、代价和技术取舍；最后用 Agent 扮演面试官追问证据边界和失败路径。你要能把“我学过这些”升级成“我能独立讲清一个真实工程项目，也知道哪些学习效果还要真人复测”。",
                                    evidence: [
                                      ["结构", "STAR + incident review"],
                                      ["取舍", "tradeoff + boundary"],
                                      ["定稿", "follow-up ready answer"],
                                    ],
                                    bg: questArchive,
                                  }
                                : {
                                    badge: "主线 1-1",
                                    title: "保存成功，但刷新后消失了",
                                    desc: "点击保存→提示成功→刷新页面→数据不见。前端骗你？还是后端没存？",
                                    copy: "这不是一道题，是一份事故卷宗。你要走过现场、传送门和档案库， 把“看起来成功”的表象拆成能讲给面试官听的证据链。",
                                    evidence: [
                                      ["表象", "POST → 201 Created"],
                                      ["反证", "SELECT → 0 rows"],
                                    ],
                                    bg: questArchive,
                                  };
    const route = storyScenes.map((scene) => scene.place);

    return (
      <main
        className="quest-shell mission-gate"
        style={{ "--quest-bg": `url(${introConfig.bg})` } as CSSProperties}
      >
        <div className="quest-camera" />
        <header className="quest-hud" aria-label="委托状态">
          <div>
            <span>{developer.rank}</span>
            <strong>{developer.xp} XP</strong>
          </div>
          <div>
            <span>委托</span>
            <strong>{introConfig.badge}</strong>
          </div>
        </header>

        <section className="mission-gate-stage">
          <div className="mission-dossier">
            <span>AI 开发主线 · {introConfig.badge}</span>
            <h1>{introConfig.title}</h1>
            <p>{introConfig.desc}</p>
            <blockquote>{introConfig.copy}</blockquote>
            <div className="dossier-evidence">
              {introConfig.evidence.map(([label, value]) => (
                <Fragment key={label}>
                  <b>{label}</b>
                  <strong>{value}</strong>
                </Fragment>
              ))}
            </div>
            <button
              className="dialogue-next"
              onClick={() => {
                scrollPageToTop();
                setShowIntro(false);
              }}
            >
              开始闯关 <ArrowRight size={17} />
            </button>
          </div>

          <aside className="mission-route-scroll" aria-label="调查路线">
            <span>调查路线</span>
            {route.map((place, index) => (
              <div key={place}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{place}</strong>
              </div>
            ))}
          </aside>
        </section>
      </main>
    );
  }

  if (showCelebration) {
    const stepCount = scenario.steps.length;
    const isPrimarySandbox = scenario.scenarioId === "canvas-save-persistence";
    return (
      <section className="teaching-shell celebration-screen">
        <div className="celebration-icon">🎉</div>
        <h2>{isPrimarySandbox ? "教学阶段完成！" : "章节教学完成！"}</h2>
        <p>
          你已经完成了 <strong>{stepCount} 个教学步骤</strong>
          ，包括流程地图、概念小抄、关键代码导读和章节复盘。
        </p>
        <div className="celebration-stats">
          <div>
            <span>🗺️</span>
            <strong>流程地图</strong>
            <small>看清谁把什么交给谁</small>
          </div>
          <div>
            <span>🧠</span>
            <strong>概念小抄</strong>
            <small>先理解名词，再进入代码</small>
          </div>
          <div>
            <span>📖</span>
            <strong>代码阅读</strong>
            <small>只看当前关卡关键行</small>
          </div>
          <div>
            <span>🤝</span>
            <strong>复盘产出</strong>
            <small>整理成工作和面试表达</small>
          </div>
        </div>
        <p className="celebration-note">
          {isPrimarySandbox
            ? "教学阶段的帮助不会计入能力分。下面进入真正的练习——你将独立完成修复，提示等级会如实记录。"
            : "章节教学证明你看懂了路线和证据边界。下面进入章节结算，记录本章解锁物和面试复盘；真实工程能力仍需要后续沙盒、测试报告和迁移复盘证明。"}
        </p>
        <button className="v2-button primary wide" onClick={onComplete}>
          {isPrimarySandbox ? "进入实战练习 🚀" : "进入章节结算"}
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

  if (
    (scenario.scenarioId === "canvas-save-persistence" ||
      scenario.scenarioId === "case-002" ||
      scenario.scenarioId === "case-003-login-state" ||
      scenario.scenarioId === "case-004-api-error" ||
      scenario.scenarioId === "case-005-data-consistency" ||
      scenario.scenarioId === "case-006-performance" ||
      scenario.scenarioId === "case-007-ai-api" ||
      scenario.scenarioId === "case-008-hallucination" ||
      scenario.scenarioId === "case-009-rag" ||
      scenario.scenarioId === "case-010-agent-tools" ||
      scenario.scenarioId === "case-011-testing-proof" ||
      scenario.scenarioId === "case-012-agent-brief" ||
      scenario.scenarioId === "case-013-delivery-review" ||
      scenario.scenarioId === "case-014-release-readiness" ||
      scenario.scenarioId === "case-015-interview-review") &&
    !storyQuestComplete
  ) {
    return (
      <EvidenceStoryQuest
        developer={developer}
        saving={saving}
        scenes={storyScenes}
        journey={storyJourney}
        journeyTitle={storyRouteLabel}
        stepLabel={storyStepLabel}
        onComplete={async () => {
          await saveProgress(
            isCanvasStorm
              ? "canvasstorm-investigation"
              : isLoginState
                ? "login-state-investigation"
                : isApiError
                  ? "api-error-investigation"
                  : isConsistency
                    ? "consistency-investigation"
                    : isPerformance
                      ? "performance-investigation"
                      : isAiApi
                        ? "ai-api-investigation"
                        : isHallucination
                          ? "hallucination-investigation"
                          : isRag
                            ? "rag-investigation"
                            : isAgentTools
                              ? "agent-tools-investigation"
                              : isTestingProof
                                ? "testing-proof-investigation"
                                : isAgentBrief
                                  ? "agent-brief-investigation"
                                  : isDeliveryReview
                                    ? "delivery-review-investigation"
                                    : isReleaseReadiness
                                      ? "release-readiness-investigation"
                                      : isInterviewReview
                                        ? "interview-review-investigation"
                                        : "story-investigation",
            {
              completedAt: new Date().toISOString(),
              route: isCanvasStorm
                ? "canvasstorm-real-project"
                : isLoginState
                  ? "login-state-investigation"
                  : isApiError
                    ? "api-error-investigation"
                    : isConsistency
                      ? "data-consistency-investigation"
                      : isPerformance
                        ? "performance-bottleneck-investigation"
                        : isAiApi
                          ? "ai-api-secure-stream-investigation"
                          : isHallucination
                            ? "grounded-answer-hallucination-investigation"
                            : isRag
                              ? "rag-retrieval-source-investigation"
                              : isAgentTools
                                ? "agent-tools-guarded-execution-investigation"
                                : isTestingProof
                                  ? "testing-proof-acceptance-investigation"
                                  : isAgentBrief
                                    ? "agent-brief-workshop-investigation"
                                    : isDeliveryReview
                                      ? "delivery-review-acceptance-investigation"
                                      : isReleaseReadiness
                                        ? "release-readiness-launch-investigation"
                                        : isInterviewReview
                                          ? "interview-review-answer-forge"
                                          : "visual-novel-investigation",
            },
          );
          setStoryQuestComplete(true);
          if (
            !isCanvasStorm &&
            !isLoginState &&
            !isApiError &&
            !isConsistency &&
            !isPerformance &&
            !isAiApi &&
            !isHallucination &&
            !isRag &&
            !isAgentTools &&
            !isTestingProof &&
            !isAgentBrief &&
            !isDeliveryReview &&
            !isReleaseReadiness &&
            !isInterviewReview
          )
            onComplete();
        }}
      />
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
      case "c3-map":
      case "c4-map":
      case "c5-map":
      case "c6-map":
      case "c7-map":
      case "c8-map":
      case "c9-map":
      case "c10-map":
      case "c11-map":
      case "c12-map":
      case "c13-map":
      case "c14-map":
      case "c15-map":
        return (
          <ProjectMapView
            map={scenario.projectMap}
            onComplete={() => completeStep(idx)}
          />
        );

      case "c2-concepts":
      case "c3-concepts":
      case "c4-concepts":
      case "c5-concepts":
      case "c6-concepts":
      case "c7-concepts":
      case "c8-concepts":
      case "c9-concepts":
      case "c10-concepts":
      case "c11-concepts":
      case "c12-concepts":
      case "c13-concepts":
      case "c14-concepts":
      case "c15-concepts":
        return (
          <MicroLessonsView
            key={step.id}
            concepts={step.concepts ?? []}
            onComplete={() => completeStep(idx)}
          />
        );

      case "c2-tour-brief":
      case "c2-tour-direction":
      case "c2-tour-session-save":
      case "c3-tour-login":
      case "c3-tour-verify":
      case "c4-tour-request":
      case "c4-tour-route":
      case "c5-tour-frontend":
      case "c5-tour-backend":
      case "c6-tour-frontend":
      case "c6-tour-backend":
      case "c7-tour-frontend":
      case "c7-tour-backend":
      case "c8-tour-prompt":
      case "c8-tour-verify":
      case "c9-tour-index":
      case "c9-tour-query":
      case "c10-tour-registry":
      case "c10-tour-executor":
      case "c11-tour-regression":
      case "c11-tour-report":
      case "c12-tour-bad-brief":
      case "c12-tour-good-brief":
      case "c13-tour-delivery-note":
      case "c13-tour-diff":
      case "c14-tour-release-checklist":
      case "c14-tour-env-and-rollback":
      case "c15-tour-story-bank":
      case "c15-tour-answer-script":
        return (
          <GuidedCodeTour
            key={step.id}
            step={step}
            stepIndex={currentStepIdx - 2}
            totalSteps={isCanvasStorm ? 3 : 2}
            onComplete={() => completeStep(idx)}
            onRemediation={(trigger) => recordRemediation(step.id, trigger)}
          />
        );

      case "c2-close":
      case "c3-close":
      case "c4-close":
      case "c5-close":
      case "c6-close":
      case "c7-close":
      case "c8-close":
      case "c9-close":
      case "c10-close":
      case "c11-close":
      case "c12-close":
      case "c13-close":
      case "c14-close":
      case "c15-close":
        return (
          <section
            className="teaching-shell"
            style={{ textAlign: "center", padding: "60px 40px" }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧩</div>
            <h2>
              {isLoginState
                ? "主线 1-3 已通关"
                : isApiError
                  ? "主线 1-4 已通关"
                  : isConsistency
                    ? "主线 1-5 已通关"
                    : isPerformance
                      ? "主线 1-6 已通关"
                      : isAiApi
                        ? "主线 1-7 已通关"
                        : isHallucination
                          ? "主线 1-8 已通关"
                          : isRag
                            ? "主线 1-9 已通关"
                            : isAgentTools
                              ? "主线 1-10 已通关"
                              : isTestingProof
                                ? "主线 1-11 已通关"
                                : isAgentBrief
                                  ? "主线 1-12 已通关"
                                  : isDeliveryReview
                                    ? "主线 1-13 已通关"
                                    : isReleaseReadiness
                                      ? "主线 1-14 已通关"
                                      : isInterviewReview
                                        ? "主线 1-15 已通关"
                                        : "主线 1-2 已通关"}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: 28,
              }}
            >
              {isCanvasStorm
                ? "你已经能把一个空泛 AI 点子讲成产品链路：用户先写 Project Brief，系统按方向限制 AI 发散，候选看板让用户保留、待定或放弃，最后把 Brief、候选、取舍和草案保存成会话。面试里不要只说“我做了 AI 生成”，要讲清输入结构、决策流程、保存边界和 AI 不可用时的兜底。"
                : isLoginState
                  ? "你已经能把登录态讲成一条证据链：页面提交账号密码，后端发 token，浏览器用 Cookie 携带它，验证路由再查后端 Session。掉登录时，不要只看页面，要用 Application、Network 和后端验证逻辑共同判断。"
                  : isApiError
                    ? "你已经能把接口报错讲成一条证据链：用户提交表单，前端发出请求，后端校验参数并返回状态码，日志记录具体原因。定位接口失败时，不要只说接口坏了，要用 Network、响应体和后端日志判断失败发生在哪一层。"
                    : isConsistency
                      ? "你已经能把重复提交讲成一条证据链：同一次动作可能产生多次请求，前端负责减少连点，后端用 Idempotency-Key 识别同一件事，数据库用唯一约束和事务兜底。验收时要证明重复请求真的进来了，但核心记录最终只有一份。"
                      : isPerformance
                        ? "你已经能把页面慢讲成一条证据链：用户打开页面，浏览器下载资源，接口等待后端第一口响应，前端渲染列表，最后用缓存、分页或请求去重优化并复测。性能优化不能只说变快了，要给出优化前后耗时、数据新鲜度和回归测试。"
                        : isAiApi
                          ? "你已经能把 AI API 接入讲成一条证据链：用户输入交给前端，前端只请求自己的后端，后端从环境变量读取密钥并调用模型服务，模型流式返回内容，前端逐段显示。验收时要证明前端不含密钥、成功能流式输出、失败有结构化错误和日志。"
                          : isHallucination
                            ? "你已经能把 AI 幻觉控制讲成一条证据链：用户问题先写成 Prompt 委托，后端把带编号的 context 资料交给模型，模型输出 answer、citations 和 confidence，服务端再校验引用是否属于本轮资料。验收时要证明有资料能答、无资料不编、每个引用都能追到来源。"
                            : isRag
                              ? "你已经能把 RAG 知识库讲成一条证据链：原始资料先保留来源元数据，长文档被切成 chunk，chunk 生成 embedding 写入索引；用户提问时检索 topK 命中片段，再把这些片段作为 context 交给模型生成带 citations 的回答。验收时要先看命中是否正确，再看引用能否回到原文。"
                              : isAgentTools
                                ? "你已经能把 Agent 工具调用讲成一条证据链：用户目标先变成 Agent 计划，Agent 只能选择注册表里的工具；工具执行前先校验参数 schema，再检查当前用户和环境权限；合法调用才执行，失败时返回结构化错误、requestId 和可理解提示。验收时要证明正常调用有结果、坏参数被拦、越权动作被拒绝。"
                                : isTestingProof
                                  ? "你已经能把测试验收讲成一条证据链：先把旧故障写成能失败的复现用例，再用单元测试守住关键函数，用集成测试证明接口、数据层和数据库交接正确，最后用手动测试报告记录时间、步骤、源码指纹和回归风险。验收 Agent 交付时，不要只接受“已修复”，要要求它交出可复核证据。"
                                  : isAgentBrief
                                    ? "你已经能把 Agent 任务写成一份可执行委托：先交代问题现场、影响和已有证据，再写出可观察目标；然后划定范围、约束和禁止事项，最后给出验收命令、浏览器路径、可见结果、风险和未覆盖项。好的委托不是把判断全部丢给 Agent，而是让 Agent 在清楚边界内交出可复核成果。"
                                    : isDeliveryReview
                                      ? "你已经能把 Agent 交付审查讲成一条证据链：先读交付说明确认摘要、验证和风险，再用 Diff 核对改动范围；接着看自动化、浏览器和移动端边界证据，最后检查项目记忆是否同步。接收或拒收都要基于证据，而不是基于 Agent 的语气。"
                                      : isReleaseReadiness
                                        ? "你已经能把上线前检查讲成一条证据链：交付通过后先写上线计划和影响范围，再核生产环境变量、密钥和功能开关；涉及数据就确认备份和恢复步骤，上线后观察错误率、接口耗时和业务成功率，异常时按提前写好的条件回滚，并用冒烟测试证明恢复。上线不是点部署，而是让发布可观察、可回退、可复盘。"
                                        : isInterviewReview
                                          ? "你已经能把项目经历讲成一条可追问的证据链：先从前面关卡挑出可展示、可解释、可验收的证据，再用 STAR 压缩回答；排障经历讲现象、证据、根因、修复和验证，技术经历讲约束、方案、代价和取舍。最后准备追问和边界，让面试回答经得起第二问。"
                                          : "你已经正确识别了登录状态丢失的根因：Token/Session 只存在内存中，服务重启后全部失效。这和主线 1-1「数据消失事件」是同一个根本原理——内存是临时的，持久化才能真正确保数据不丢失。"}
            </p>
            <button
              className="v2-button primary wide"
              onClick={() => completeStep(idx)}
            >
              完成这一关
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
        <span>🏆 进度 {teachingProgressPercent}%</span>
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
        <BookOpen size={17} />
        {open ? "关闭词库" : "词库"}
      </button>

      {open && (
        <div className="glossary-panel">
          <header>
            <strong>词库本</strong>
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
