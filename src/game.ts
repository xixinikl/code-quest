export const SKILLS = [
  "workflow",
  "git",
  "debugging",
  "api",
  "database",
] as const;

export type SkillId = (typeof SKILLS)[number];

export type Skill = {
  id: SkillId;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
};

export type Lesson = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  skill: SkillId;
  xp: number;
  minutes: number;
  metaphor: string;
  projectPosition: string;
  checkpoint: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  unlockMessage: string;
};

export type DictionaryEntry = {
  term: string;
  meaning: string;
  projectUse: string;
  custom?: boolean;
};

export type Progress = {
  version: 1;
  diagnosed: boolean;
  skills: Record<SkillId, number>;
  completedLessons: string[];
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  dictionary: DictionaryEntry[];
};

export const skillList: Skill[] = [
  {
    id: "workflow",
    name: "项目流程",
    shortName: "流程",
    icon: "🧭",
    color: "#7c5cff",
    description: "知道现在在哪一步，下一步该验证什么",
  },
  {
    id: "git",
    name: "版本控制",
    shortName: "Git",
    icon: "🌿",
    color: "#28c991",
    description: "安全存档、比较和撤回自己的代码变化",
  },
  {
    id: "debugging",
    name: "报错阅读",
    shortName: "调试",
    icon: "🔍",
    color: "#ffb23f",
    description: "从错误信息中找到位置、原因和下一步",
  },
  {
    id: "api",
    name: "API / 数据流",
    shortName: "API",
    icon: "🔌",
    color: "#2e9dff",
    description: "追踪一次操作如何穿过前端与后端",
  },
  {
    id: "database",
    name: "数据库认知",
    shortName: "数据",
    icon: "🗃️",
    color: "#ff6f91",
    description: "理解数据如何被组织、查询和安全修改",
  },
];

export const lessons: Lesson[] = [
  {
    id: "workflow-loop",
    order: 1,
    title: "找到任务坐标",
    subtitle: "需求不是一句“帮我做完”",
    skill: "workflow",
    xp: 80,
    minutes: 6,
    metaphor: "像出发前看地图：先圈终点，再选择路线，最后确认真的到了。",
    projectPosition:
      "任何功能都应该经过需求 → 方案 → 实现 → 验证。Agent 写代码只是其中一段，不是整个任务。",
    checkpoint: "你能说出当前任务处于哪一步，以及这一步结束的可见证据。",
    question: "你让 Agent 增加“删除画布”功能。下面哪项最像可验证的需求？",
    options: [
      "帮我把删除做得高级一点",
      "登录用户二次确认后可删除自己的画布，删除成功后列表不再显示它",
      "使用最流行的删除技术",
    ],
    answer: 1,
    explanation:
      "第二项包含使用者、动作、权限、确认步骤和可观察结果，完成后能够真正验收。",
    unlockMessage: "你获得了「任务罗盘」：以后先定义终点，再让 Agent 出发。",
  },
  {
    id: "git-savepoint",
    order: 2,
    title: "建立安全存档",
    subtitle: "让每次尝试都能回头",
    skill: "git",
    xp: 90,
    minutes: 7,
    metaphor: "Git commit 就像游戏存档点；工作区是你还没存档的现场。",
    projectPosition:
      "`git status` 看现场，`git add` 选择要放进存档的变化，`git commit` 创建有名字的存档。",
    checkpoint: "你能独立使用 status、add 和 commit，并解释每一步的区别。",
    question: "修改了三个文件，但只想把其中一个纳入这次存档，应该先做什么？",
    options: [
      "直接 git commit -a",
      "用 git add 指定那个文件，再检查 git status",
      "删除另外两个文件",
    ],
    answer: 1,
    explanation:
      "`git add <文件>` 可以精确选择本次存档内容，随后用 status 检查是最稳妥的做法。",
    unlockMessage: "你获得了「时间锚点」：实验不再意味着冒险丢失全部进度。",
  },
  {
    id: "debug-trace",
    order: 3,
    title: "追踪红色线索",
    subtitle: "报错不是判决书，是藏宝图",
    skill: "debugging",
    xp: 100,
    minutes: 8,
    metaphor: "错误堆栈像案发路线：先找最靠近自己代码的文件名与行号。",
    projectPosition:
      "复现问题 → 读错误类型与位置 → 缩小范围 → 提出假设 → 做最小验证，而不是随机改代码。",
    checkpoint: "看到报错时，能先找到错误类型、自己代码的文件名和行号。",
    question: "Agent 修 Bug 前，你提供哪组信息最有帮助？",
    options: [
      "“坏了，快修”",
      "整个项目的所有截图",
      "复现步骤、完整报错、预期结果、实际结果和最近改动",
    ],
    answer: 2,
    explanation:
      "这五项能让问题稳定复现并缩小搜索范围，也能定义修复后的验收条件。",
    unlockMessage: "你获得了「堆栈透镜」：红字开始变成可以逐条追踪的线索。",
  },
  {
    id: "api-journey",
    order: 4,
    title: "护送一次请求",
    subtitle: "从按钮到数据库，再回来",
    skill: "api",
    xp: 110,
    minutes: 9,
    metaphor: "API 像餐厅服务员：前端点菜，后端厨房处理，再把结果端回来。",
    projectPosition:
      "用户点击 → 前端发 HTTP 请求 → 后端路由验证并处理 → 数据库读写 → 响应 → 界面更新。",
    checkpoint: "你能指着代码讲清一次请求的入口、处理、存储和返回。",
    question: "点击“保存”后界面显示成功，但刷新后数据消失，最该先检查哪里？",
    options: [
      "按钮颜色",
      "保存请求是否真的到达后端并成功写入数据库",
      "换一个前端框架",
    ],
    answer: 1,
    explanation:
      "界面成功不等于副作用真实发生。应沿数据流检查请求、响应和数据库写入证据。",
    unlockMessage: "你获得了「数据航线图」：前端和后端不再是两团神秘黑箱。",
  },
  {
    id: "database-home",
    order: 5,
    title: "认识数据住所",
    subtitle: "表、行、字段与查询",
    skill: "database",
    xp: 120,
    minutes: 10,
    metaphor: "数据库像档案馆：表是柜子，行是一份档案，字段是档案上的栏目。",
    projectPosition:
      "SQLite 是应用旁的一本可靠账簿；PostgreSQL 是有专人管理、支持多人同时办理的档案馆。",
    checkpoint:
      "能解释表、行、字段、主键，并知道 SQLite 与 PostgreSQL 的核心场景差异。",
    question:
      "项目从个人原型增长为大量用户同时使用时，为什么常迁移到 PostgreSQL？",
    options: [
      "因为 SQL 语句会变成另一种语言",
      "因为它更适合服务端并发、权限、连接管理和运维",
      "因为 SQLite 不能保存文字",
    ],
    answer: 1,
    explanation:
      "两者都使用 SQL，但服务模型不同。PostgreSQL 更适合多用户并发和生产级管理。",
    unlockMessage:
      "你获得了「数据钥匙」：会区分原理的延续与规模带来的工具变化。",
  },
  {
    id: "integration-boss",
    order: 6,
    title: "Boss：验收真实功能",
    subtitle: "把五种能力串成一次交付",
    skill: "workflow",
    xp: 160,
    minutes: 12,
    metaphor: "Boss 战不是写最多代码，而是证明每一扇门都真的打开了。",
    projectPosition:
      "明确需求，创建 Git 存档点，追踪请求和数据，验证成功与失败路径，最后审计实际改动。",
    checkpoint: "你能要求 Agent 提供可复现的验证证据，而不是只接受“应该可以”。",
    question: "Agent 说“删除功能已经完成”。哪组证据最足以验收？",
    options: [
      "代码看起来合理",
      "编译没有报错",
      "真实入口删除成功、数据库记录消失、无权限用户被拒绝、相关测试通过",
    ],
    answer: 2,
    explanation:
      "完整证据同时覆盖用户结果、真实副作用、失败路径和自动化回归保护。",
    unlockMessage:
      "你获得了「验收徽章」：你已经能像合作者一样判断交付，而不只是等待答案。",
  },
];

export const defaultDictionary: DictionaryEntry[] = [
  {
    term: "API",
    meaning: "餐厅服务员：接收前端点单，把后端结果端回来",
    projectUse: "前端和后端沟通的约定",
  },
  {
    term: "JWT",
    meaning: "带有效期、可验真伪的临时通行证",
    projectUse: "登录后向服务器证明“我是谁”",
  },
  {
    term: "ORM",
    meaning: "代码与 SQL 之间的翻译官",
    projectUse: "用对象或函数读写数据库",
  },
  {
    term: "中间件",
    meaning: "请求进入核心房间前经过的安检门",
    projectUse: "检查登录、记录日志、统一处理错误",
  },
  {
    term: "环境变量",
    meaning: "不同场地使用的幕后配置卡",
    projectUse: "存放数据库地址、运行模式等配置",
  },
  {
    term: "迁移",
    meaning: "给正在使用的档案馆改造柜子并留下施工记录",
    projectUse: "可追踪地改变数据库结构",
  },
];

export const initialProgress: Progress = {
  version: 1,
  diagnosed: false,
  skills: {
    workflow: 1,
    git: 1,
    debugging: 1,
    api: 1,
    database: 1,
  },
  completedLessons: [],
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  dictionary: defaultDictionary,
};

export function levelFromXp(xp: number) {
  return Math.floor(Math.max(0, xp) / 200) + 1;
}

export function xpIntoLevel(xp: number) {
  return Math.max(0, xp) % 200;
}

export function isLessonUnlocked(progress: Progress, lesson: Lesson) {
  return (
    lesson.order === 1 || progress.completedLessons.length >= lesson.order - 1
  );
}

function localDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function completeLesson(
  progress: Progress,
  lesson: Lesson,
  now = new Date(),
): Progress {
  if (progress.completedLessons.includes(lesson.id)) return progress;

  const today = localDate(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const nextStreak =
    progress.lastActiveDate === today
      ? progress.streak
      : progress.lastActiveDate === localDate(yesterday)
        ? progress.streak + 1
        : 1;

  return {
    ...progress,
    completedLessons: [...progress.completedLessons, lesson.id],
    xp: progress.xp + lesson.xp,
    streak: nextStreak,
    lastActiveDate: today,
    skills: {
      ...progress.skills,
      [lesson.skill]: Math.min(5, progress.skills[lesson.skill] + 1),
    },
  };
}

export function sanitizeProgress(value: unknown): Progress {
  if (!value || typeof value !== "object") return initialProgress;
  const candidate = value as Partial<Progress>;
  if (candidate.version !== 1) return initialProgress;

  const safeSkills = { ...initialProgress.skills };
  for (const skill of SKILLS) {
    const score = candidate.skills?.[skill];
    if (typeof score === "number" && Number.isFinite(score)) {
      safeSkills[skill] = Math.max(1, Math.min(5, Math.round(score)));
    }
  }

  const validLessonIds = new Set(lessons.map((lesson) => lesson.id));
  const completedLessons = Array.isArray(candidate.completedLessons)
    ? candidate.completedLessons.filter(
        (id): id is string => typeof id === "string" && validLessonIds.has(id),
      )
    : [];

  const dictionary = Array.isArray(candidate.dictionary)
    ? candidate.dictionary.filter((entry): entry is DictionaryEntry =>
        Boolean(
          entry &&
          typeof entry.term === "string" &&
          typeof entry.meaning === "string" &&
          typeof entry.projectUse === "string",
        ),
      )
    : defaultDictionary;

  return {
    version: 1,
    diagnosed: candidate.diagnosed === true,
    skills: safeSkills,
    completedLessons: [...new Set(completedLessons)],
    xp:
      typeof candidate.xp === "number" && Number.isFinite(candidate.xp)
        ? Math.max(0, Math.round(candidate.xp))
        : 0,
    streak:
      typeof candidate.streak === "number" && Number.isFinite(candidate.streak)
        ? Math.max(0, Math.round(candidate.streak))
        : 0,
    lastActiveDate:
      typeof candidate.lastActiveDate === "string"
        ? candidate.lastActiveDate
        : null,
    dictionary: dictionary.length ? dictionary : defaultDictionary,
  };
}
