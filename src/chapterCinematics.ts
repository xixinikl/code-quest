import { normalizeScenarioId } from "./scenarioIds";

export type ChapterScenarioId =
  | "canvas-save-persistence"
  | "java-layered-request"
  | "java-transaction-consistency"
  | "java-cache-observability"
  | "java-release-harbor"
  | "java-production-incident"
  | "frontend-component-state"
  | "frontend-request-states"
  | "frontend-performance-proof"
  | "frontend-accessibility-proof"
  | "frontend-testing-proof"
  | "case-002"
  | "case-003-login-state"
  | "case-004-api-error"
  | "case-005-data-consistency"
  | "case-006-performance"
  | "case-007-ai-api"
  | "case-008-hallucination"
  | "case-009-rag"
  | "case-010-agent-tools"
  | "case-011-testing-proof"
  | "case-012-agent-brief"
  | "case-013-delivery-review"
  | "case-014-release-readiness"
  | "case-015-interview-review";

export type MapTopology =
  | "relay"
  | "workshop-branch"
  | "session-loop"
  | "fault-tree"
  | "consistency-convergence"
  | "performance-waterfall"
  | "secure-gateway"
  | "mirror-check"
  | "retrieval-maze"
  | "permission-stack"
  | "proof-lanes"
  | "brief-forge"
  | "audit-diamond"
  | "release-gates"
  | "career-constellation";

export type CameraShot =
  | "establishing"
  | "over-shoulder-left"
  | "over-shoulder-right"
  | "top-down"
  | "low-angle"
  | "close-up"
  | "tracking"
  | "locked";

export type ChapterCinematic = {
  scenarioId: ChapterScenarioId;
  chapterId: string;
  chapterTitle: string;
  cameraLabel: string;
  mapTopology: MapTopology;
  mapLabel: string;
  mapInstruction: string;
  shots: [CameraShot, CameraShot, CameraShot];
  focus: string;
  cameraDuration: string;
  cameraEasing: string;
  mapTerrain: string;
  mapLandmark: string;
  mapAccent: string;
  mapAccentSoft: string;
};

const cinematics: ChapterCinematic[] = [
  {
    scenarioId: "java-layered-request",
    chapterId: "java-1",
    chapterTitle: "分层服务塔",
    cameraLabel: "沿请求接力从城门推到数据库",
    mapTopology: "relay",
    mapLabel: "三层请求接力图",
    mapInstruction:
      "从 HTTP 请求进入 Controller，跟到 Service、Repository 和数据库，再回到响应。",
    shots: ["establishing", "tracking", "close-up"],
    focus: "52% 48%",
    cameraDuration: "18s",
    cameraEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    mapTerrain: "分层服务塔",
    mapLandmark: "职责边界门",
    mapAccent: "#8fd3b8",
    mapAccentSoft: "rgba(143, 211, 184, 0.16)",
  },
  {
    scenarioId: "frontend-component-state",
    chapterId: "frontend-1",
    chapterTitle: "组件剧场",
    cameraLabel: "跟随状态灯从点击移动到页面反馈",
    mapTopology: "session-loop",
    mapLabel: "状态渲染回路",
    mapInstruction:
      "点击发出事件，状态驱动请求和重新渲染，成功或失败都要回到可见反馈。",
    shots: ["establishing", "tracking", "close-up"],
    focus: "48% 45%",
    cameraDuration: "16s",
    cameraEasing: "cubic-bezier(0.33, 1, 0.68, 1)",
    mapTerrain: "组件剧场后台",
    mapLandmark: "状态灯控台",
    mapAccent: "#f0b77b",
    mapAccentSoft: "rgba(240, 183, 123, 0.16)",
  },
  {
    scenarioId: "java-transaction-consistency",
    chapterId: "java-2",
    chapterTitle: "事务熔炉",
    cameraLabel: "俯视订单、库存和事务边界汇入同一炉心",
    mapTopology: "consistency-convergence",
    mapLabel: "订单事务汇流图",
    mapInstruction:
      "用户下单、库存扣减、订单写入和回滚验证必须汇成一个事务结果。",
    shots: ["top-down", "tracking", "low-angle"],
    focus: "50% 50%",
    cameraDuration: "17s",
    cameraEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    mapTerrain: "订单熔铸港",
    mapLandmark: "事务回滚炉心",
    mapAccent: "#b8dc78",
    mapAccentSoft: "rgba(184, 220, 120, 0.16)",
  },
  {
    scenarioId: "java-cache-observability",
    chapterId: "java-3",
    chapterTitle: "缓存观测塔",
    cameraLabel: "沿缓存命中、数据库版本和 TTL 逐层下潜",
    mapTopology: "performance-waterfall",
    mapLabel: "缓存版本观测图",
    mapInstruction:
      "从接口读取走到缓存命中、数据库版本、TTL 和异步刷新，证明旧数据会收敛。",
    shots: ["establishing", "top-down", "tracking"],
    focus: "55% 43%",
    cameraDuration: "20s",
    cameraEasing: "linear",
    mapTerrain: "缓存风廊",
    mapLandmark: "版本回声钟塔",
    mapAccent: "#82bdf2",
    mapAccentSoft: "rgba(130, 189, 242, 0.16)",
  },
  {
    scenarioId: "java-release-harbor",
    chapterId: "java-4",
    chapterTitle: "上线港",
    cameraLabel: "逐道推进 Java 服务上线门与回滚吊桥",
    mapTopology: "release-gates",
    mapLabel: "Java 上线连续门禁",
    mapInstruction:
      "计划、配置、备份、390px 冒烟、监控和回滚是一串门禁，任一缺证都不能放行。",
    shots: ["establishing", "low-angle", "locked"],
    focus: "50% 55%",
    cameraDuration: "18s",
    cameraEasing: "cubic-bezier(0.7, 0, 0.84, 0)",
    mapTerrain: "Java 上线港",
    mapLandmark: "回滚吊桥",
    mapAccent: "#91d28a",
    mapAccentSoft: "rgba(145, 210, 138, 0.16)",
  },
  {
    scenarioId: "java-production-incident",
    chapterId: "java-5",
    chapterTitle: "事故回声塔",
    cameraLabel: "从报警塔俯冲到 requestId 与回滚决定",
    mapTopology: "fault-tree",
    mapLabel: "事故排障故障树",
    mapInstruction:
      "从报警指标分辨日志、影响范围、止血动作和回滚复测，先恢复服务再复盘根因。",
    shots: ["low-angle", "close-up", "over-shoulder-right"],
    focus: "50% 54%",
    cameraDuration: "14s",
    cameraEasing: "cubic-bezier(0.5, 0, 0.75, 0)",
    mapTerrain: "报警风暴塔",
    mapLandmark: "requestId 回声井",
    mapAccent: "#ef8c8c",
    mapAccentSoft: "rgba(239, 140, 140, 0.16)",
  },
  {
    scenarioId: "frontend-request-states",
    chapterId: "frontend-2",
    chapterTitle: "请求状态剧场",
    cameraLabel: "跟随加载、成功和失败状态在舞台上切换",
    mapTopology: "session-loop",
    mapLabel: "请求状态回路",
    mapInstruction:
      "用户动作触发请求，loading、success、error 和重试都要回到可见反馈。",
    shots: ["tracking", "over-shoulder-left", "low-angle"],
    focus: "48% 45%",
    cameraDuration: "16s",
    cameraEasing: "cubic-bezier(0.33, 1, 0.68, 1)",
    mapTerrain: "请求状态剧场",
    mapLandmark: "错误反馈灯控台",
    mapAccent: "#f0b77b",
    mapAccentSoft: "rgba(240, 183, 123, 0.16)",
  },
  {
    scenarioId: "frontend-performance-proof",
    chapterId: "frontend-3",
    chapterTitle: "首屏观测塔",
    cameraLabel: "沿首屏瀑布从资源滑到接口与渲染画像",
    mapTopology: "performance-waterfall",
    mapLabel: "前端首屏瀑布图",
    mapInstruction:
      "按资源、接口 TTFB、后端日志、React 渲染和复测顺序判断慢在哪里。",
    shots: ["establishing", "top-down", "tracking"],
    focus: "56% 42%",
    cameraDuration: "22s",
    cameraEasing: "linear",
    mapTerrain: "首屏观测塔",
    mapLandmark: "React 渲染钟面",
    mapAccent: "#82bdf2",
    mapAccentSoft: "rgba(130, 189, 242, 0.16)",
  },
  {
    scenarioId: "frontend-accessibility-proof",
    chapterId: "frontend-4",
    chapterTitle: "无障碍交付庭",
    cameraLabel: "在语义、键盘和读屏证据之间切换审查",
    mapTopology: "audit-diamond",
    mapLabel: "无障碍交付菱形",
    mapInstruction:
      "用户任务分流到语义、键盘、读屏和移动端证据，汇合后才能接收交付。",
    shots: ["over-shoulder-left", "over-shoulder-right", "locked"],
    focus: "50% 47%",
    cameraDuration: "12s",
    cameraEasing: "cubic-bezier(0.55, 0, 1, 0.45)",
    mapTerrain: "无障碍交付庭",
    mapLandmark: "焦点顺序裁决台",
    mapAccent: "#f08f9f",
    mapAccentSoft: "rgba(240, 143, 159, 0.16)",
  },
  {
    scenarioId: "frontend-testing-proof",
    chapterId: "frontend-5",
    chapterTitle: "回归试炼场",
    cameraLabel: "双线跟拍红灯复现与浏览器回归证据",
    mapTopology: "proof-lanes",
    mapLabel: "前端回归双轨场",
    mapInstruction:
      "旧故障红灯、单测、集成、浏览器手测和 sourceHash 最终汇入可信交付判断。",
    shots: ["establishing", "over-shoulder-right", "locked"],
    focus: "50% 48%",
    cameraDuration: "21s",
    cameraEasing: "cubic-bezier(0.37, 0, 0.63, 1)",
    mapTerrain: "回归试炼竞技场",
    mapLandmark: "sourceHash 证据门",
    mapAccent: "#89c9ff",
    mapAccentSoft: "rgba(137, 201, 255, 0.16)",
  },
  {
    scenarioId: "canvas-save-persistence",
    chapterId: "1",
    chapterTitle: "数据断层",
    cameraLabel: "沿数据接力横向推轨",
    mapTopology: "relay",
    mapLabel: "数据接力路线",
    mapInstruction: "从用户点击一路追到数据库，再用刷新读取反向验收。",
    shots: ["establishing", "tracking", "close-up"],
    focus: "52% 46%",
    cameraDuration: "18s",
    cameraEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    mapTerrain: "断流档案河",
    mapLandmark: "失忆数据库",
    mapAccent: "#72d7e7",
    mapAccentSoft: "rgba(114, 215, 231, 0.16)",
  },
  {
    scenarioId: "case-002",
    chapterId: "2",
    chapterTitle: "产品密室",
    cameraLabel: "俯视需求桌面再落到取舍",
    mapTopology: "workshop-branch",
    mapLabel: "产品取舍工作台",
    mapInstruction: "一个模糊想法先分成候选方向，再汇入被保存的产品决定。",
    shots: ["top-down", "over-shoulder-right", "close-up"],
    focus: "58% 40%",
    cameraDuration: "14s",
    cameraEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
    mapTerrain: "候选星盘工坊",
    mapLandmark: "取舍锻造台",
    mapAccent: "#f0c66b",
    mapAccentSoft: "rgba(240, 198, 107, 0.16)",
  },
  {
    scenarioId: "case-003-login-state",
    chapterId: "3",
    chapterTitle: "身份回廊",
    cameraLabel: "跟随身份凭证穿过回廊",
    mapTopology: "session-loop",
    mapLabel: "登录态回环",
    mapInstruction: "登录发出凭证，后续请求带回凭证，验证失败会绕回登录入口。",
    shots: ["tracking", "over-shoulder-left", "low-angle"],
    focus: "46% 48%",
    cameraDuration: "16s",
    cameraEasing: "cubic-bezier(0.33, 1, 0.68, 1)",
    mapTerrain: "环形身份回廊",
    mapLandmark: "凭证回声门",
    mapAccent: "#73e0b2",
    mapAccentSoft: "rgba(115, 224, 178, 0.16)",
  },
  {
    scenarioId: "case-004-api-error",
    chapterId: "4",
    chapterTitle: "接口审判庭",
    cameraLabel: "从请求证物抬镜到错误裁决",
    mapTopology: "fault-tree",
    mapLabel: "接口故障树",
    mapInstruction:
      "从一次失败请求向下分辨参数、权限和服务端异常，再用日志定案。",
    shots: ["low-angle", "close-up", "over-shoulder-right"],
    focus: "50% 54%",
    cameraDuration: "12s",
    cameraEasing: "cubic-bezier(0.5, 0, 0.75, 0)",
    mapTerrain: "裂隙证物庭",
    mapLandmark: "状态码裁决席",
    mapAccent: "#ef8c8c",
    mapAccentSoft: "rgba(239, 140, 140, 0.16)",
  },
  {
    scenarioId: "case-005-data-consistency",
    chapterId: "5",
    chapterTitle: "一致性熔炉",
    cameraLabel: "多路请求向中心记录汇合",
    mapTopology: "consistency-convergence",
    mapLabel: "一致性汇流图",
    mapInstruction:
      "多次点击和网络重试可以产生多路请求，但最终只能汇成一份核心记录。",
    shots: ["establishing", "top-down", "low-angle"],
    focus: "50% 50%",
    cameraDuration: "19s",
    cameraEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    mapTerrain: "多流熔铸盆地",
    mapLandmark: "唯一约束炉心",
    mapAccent: "#b8dc78",
    mapAccentSoft: "rgba(184, 220, 120, 0.16)",
  },
  {
    scenarioId: "case-006-performance",
    chapterId: "6",
    chapterTitle: "慢速迷雾",
    cameraLabel: "沿时间瀑布逐层下潜",
    mapTopology: "performance-waterfall",
    mapLabel: "性能瀑布图",
    mapInstruction:
      "按时间顺序查看资源、接口、后端和渲染，证明等待究竟发生在哪一层。",
    shots: ["establishing", "top-down", "tracking"],
    focus: "56% 42%",
    cameraDuration: "22s",
    cameraEasing: "linear",
    mapTerrain: "时间瀑布峡谷",
    mapLandmark: "首字节钟塔",
    mapAccent: "#82bdf2",
    mapAccentSoft: "rgba(130, 189, 242, 0.16)",
  },
  {
    scenarioId: "case-007-ai-api",
    chapterId: "7",
    chapterTitle: "模型熔炉",
    cameraLabel: "越过密钥安全门再跟随流式返回",
    mapTopology: "secure-gateway",
    mapLabel: "AI 安全网关",
    mapInstruction:
      "浏览器不能跨过密钥门；只有服务端代理可以调用模型并把安全结果送回。",
    shots: ["low-angle", "over-shoulder-left", "tracking"],
    focus: "48% 52%",
    cameraDuration: "13s",
    cameraEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    mapTerrain: "模型熔炉关隘",
    mapLandmark: "密钥禁行门",
    mapAccent: "#efaa63",
    mapAccentSoft: "rgba(239, 170, 99, 0.16)",
  },
  {
    scenarioId: "case-008-hallucination",
    chapterId: "8",
    chapterTitle: "幻觉镜厅",
    cameraLabel: "正反镜面对照回答与来源",
    mapTopology: "mirror-check",
    mapLabel: "回答镜像校验",
    mapInstruction:
      "回答和引用分列对照，最后在展示前汇合校验，资料不足则拒答。",
    shots: ["over-shoulder-right", "over-shoulder-left", "close-up"],
    focus: "52% 45%",
    cameraDuration: "17s",
    cameraEasing: "cubic-bezier(0.65, 0, 0.35, 1)",
    mapTerrain: "双生引用镜湖",
    mapLandmark: "拒答审判镜",
    mapAccent: "#d7a6e8",
    mapAccentSoft: "rgba(215, 166, 232, 0.16)",
  },
  {
    scenarioId: "case-009-rag",
    chapterId: "9",
    chapterTitle: "知识迷宫",
    cameraLabel: "在资料节点间折返追踪命中",
    mapTopology: "retrieval-maze",
    mapLabel: "RAG 检索迷宫",
    mapInstruction:
      "资料经过切分和索引后曲折抵达命中片段，再带着来源进入回答。",
    shots: ["tracking", "top-down", "over-shoulder-right"],
    focus: "54% 44%",
    cameraDuration: "20s",
    cameraEasing: "cubic-bezier(0.45, 0, 0.55, 1)",
    mapTerrain: "切片知识迷城",
    mapLandmark: "命中索引碑",
    mapAccent: "#69d5c5",
    mapAccentSoft: "rgba(105, 213, 197, 0.16)",
  },
  {
    scenarioId: "case-010-agent-tools",
    chapterId: "10",
    chapterTitle: "Agent 高塔",
    cameraLabel: "从计划层逐层仰拍权限塔",
    mapTopology: "permission-stack",
    mapLabel: "Agent 权限塔",
    mapInstruction:
      "计划、工具注册、参数、权限、执行和审计必须逐层过门，不能越级。",
    shots: ["low-angle", "tracking", "close-up"],
    focus: "50% 58%",
    cameraDuration: "15s",
    cameraEasing: "cubic-bezier(0.12, 0, 0.39, 0)",
    mapTerrain: "契约权限高塔",
    mapLandmark: "审计烽火台",
    mapAccent: "#e6bc72",
    mapAccentSoft: "rgba(230, 188, 114, 0.16)",
  },
  {
    scenarioId: "case-011-testing-proof",
    chapterId: "11",
    chapterTitle: "验收试炼场",
    cameraLabel: "双线跟拍自动化与人工证据",
    mapTopology: "proof-lanes",
    mapLabel: "双轨验收场",
    mapInstruction:
      "自动化测试与真实浏览器复测并行前进，最终汇入同一份可信报告。",
    shots: ["establishing", "over-shoulder-right", "locked"],
    focus: "50% 48%",
    cameraDuration: "21s",
    cameraEasing: "cubic-bezier(0.37, 0, 0.63, 1)",
    mapTerrain: "双轨试炼竞技场",
    mapLandmark: "可信报告终点",
    mapAccent: "#89c9ff",
    mapAccentSoft: "rgba(137, 201, 255, 0.16)",
  },
  {
    scenarioId: "case-012-agent-brief",
    chapterId: "12",
    chapterTitle: "委托书工坊",
    cameraLabel: "环绕锻造台逐项落锤",
    mapTopology: "brief-forge",
    mapLabel: "Agent 委托锻造环",
    mapInstruction:
      "背景、目标、边界、验收和风险围绕同一份委托反复锻造，缺一项都不能交付。",
    shots: ["top-down", "close-up", "low-angle"],
    focus: "50% 50%",
    cameraDuration: "14s",
    cameraEasing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    mapTerrain: "环形委托锻炉",
    mapLandmark: "验收落锤台",
    mapAccent: "#ed9d6e",
    mapAccentSoft: "rgba(237, 157, 110, 0.16)",
  },
  {
    scenarioId: "case-013-delivery-review",
    chapterId: "13",
    chapterTitle: "交付审查庭",
    cameraLabel: "在 Agent 与审查官之间切换反打",
    mapTopology: "audit-diamond",
    mapLabel: "交付审查菱形",
    mapInstruction:
      "交付说明分流到 Diff 与测试证据，汇合后再决定接收、补证或回退。",
    shots: ["over-shoulder-left", "over-shoulder-right", "locked"],
    focus: "50% 47%",
    cameraDuration: "11s",
    cameraEasing: "cubic-bezier(0.55, 0, 1, 0.45)",
    mapTerrain: "四向交付审查庭",
    mapLandmark: "接收裁决台",
    mapAccent: "#f08f9f",
    mapAccentSoft: "rgba(240, 143, 159, 0.16)",
  },
  {
    scenarioId: "case-014-release-readiness",
    chapterId: "14",
    chapterTitle: "上线城门",
    cameraLabel: "逐道推进上线门与回滚门",
    mapTopology: "release-gates",
    mapLabel: "上线连续门禁",
    mapInstruction:
      "计划、配置、备份、冒烟、监控和回滚是一串连续门禁，任一未过都不能开城门。",
    shots: ["establishing", "low-angle", "locked"],
    focus: "50% 55%",
    cameraDuration: "18s",
    cameraEasing: "cubic-bezier(0.7, 0, 0.84, 0)",
    mapTerrain: "连续上线城门",
    mapLandmark: "应急回滚吊桥",
    mapAccent: "#91d28a",
    mapAccentSoft: "rgba(145, 210, 138, 0.16)",
  },
  {
    scenarioId: "case-015-interview-review",
    chapterId: "15",
    chapterTitle: "面试议会",
    cameraLabel: "从全景议会收束到个人答辩",
    mapTopology: "career-constellation",
    mapLabel: "职业证据星图",
    mapInstruction:
      "项目、故障、取舍、验证和成长证据围绕回答核心成星图，准备接受追问。",
    shots: ["establishing", "over-shoulder-left", "close-up"],
    focus: "50% 43%",
    cameraDuration: "24s",
    cameraEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
    mapTerrain: "职业证据星穹",
    mapLandmark: "个人答辩主星",
    mapAccent: "#f2d47b",
    mapAccentSoft: "rgba(242, 212, 123, 0.16)",
  },
];

export const chapterCinematics = Object.fromEntries(
  cinematics.map((cinematic) => [cinematic.scenarioId, cinematic]),
) as Record<ChapterScenarioId, ChapterCinematic>;

export const chapterScenarioIds = cinematics.map(
  (cinematic) => cinematic.scenarioId,
);

export function getChapterCinematic(scenarioId: string) {
  const cinematic =
    chapterCinematics[normalizeScenarioId(scenarioId) as ChapterScenarioId];
  if (!cinematic) throw new Error(`未知章节镜头契约：${scenarioId}`);
  return cinematic;
}

export function resolveChapterCinematic(scenarioId: string) {
  return (
    chapterCinematics[normalizeScenarioId(scenarioId) as ChapterScenarioId] ??
    chapterCinematics["canvas-save-persistence"]
  );
}

const shotProfiles: Record<
  CameraShot,
  {
    entryX: string;
    entryY: string;
    entryScale: string;
    driftX: string;
    driftY: string;
    driftScale: string;
  }
> = {
  establishing: {
    entryX: "-1.5%",
    entryY: "-1%",
    entryScale: "1.12",
    driftX: "1%",
    driftY: "0.5%",
    driftScale: "1.05",
  },
  "over-shoulder-left": {
    entryX: "-5%",
    entryY: "0%",
    entryScale: "1.19",
    driftX: "-1.5%",
    driftY: "0.5%",
    driftScale: "1.1",
  },
  "over-shoulder-right": {
    entryX: "5%",
    entryY: "0%",
    entryScale: "1.19",
    driftX: "1.5%",
    driftY: "0.5%",
    driftScale: "1.1",
  },
  "top-down": {
    entryX: "0%",
    entryY: "-5%",
    entryScale: "1.17",
    driftX: "0.5%",
    driftY: "-1%",
    driftScale: "1.08",
  },
  "low-angle": {
    entryX: "0%",
    entryY: "4%",
    entryScale: "1.16",
    driftX: "0.5%",
    driftY: "1%",
    driftScale: "1.08",
  },
  "close-up": {
    entryX: "0%",
    entryY: "0%",
    entryScale: "1.25",
    driftX: "0%",
    driftY: "0%",
    driftScale: "1.14",
  },
  tracking: {
    entryX: "-6%",
    entryY: "1%",
    entryScale: "1.15",
    driftX: "3%",
    driftY: "0%",
    driftScale: "1.08",
  },
  locked: {
    entryX: "0%",
    entryY: "0%",
    entryScale: "1.04",
    driftX: "0%",
    driftY: "0%",
    driftScale: "1.04",
  },
};

export function getChapterShot(scenarioId: string, sceneIndex: number) {
  const cinematic = resolveChapterCinematic(scenarioId);
  const shot = cinematic.shots[sceneIndex % cinematic.shots.length];
  return {
    shot,
    ...shotProfiles[shot],
    focus: cinematic.focus,
    duration: cinematic.cameraDuration,
    easing: cinematic.cameraEasing,
  };
}

export type MapNodePlacement = {
  column: number;
  span: number;
  row: number;
};

const topologyPlacements: Record<
  MapTopology,
  Array<[number, number, number]>
> = {
  relay: [
    [1, 3, 1],
    [4, 3, 1],
    [7, 3, 1],
    [10, 3, 1],
    [7, 3, 2],
    [4, 3, 2],
    [1, 3, 2],
  ],
  "workshop-branch": [
    [5, 4, 1],
    [1, 3, 2],
    [5, 3, 2],
    [9, 3, 2],
    [3, 3, 3],
    [7, 3, 3],
    [5, 4, 4],
  ],
  "session-loop": [
    [5, 4, 1],
    [9, 3, 2],
    [9, 3, 3],
    [5, 4, 4],
    [1, 3, 3],
    [1, 3, 2],
    [5, 4, 2],
  ],
  "fault-tree": [
    [5, 4, 1],
    [3, 3, 2],
    [7, 3, 2],
    [1, 3, 3],
    [5, 3, 3],
    [9, 3, 3],
    [5, 4, 4],
  ],
  "consistency-convergence": [
    [1, 3, 1],
    [5, 3, 1],
    [9, 3, 1],
    [3, 3, 2],
    [7, 3, 2],
    [5, 4, 3],
  ],
  "performance-waterfall": [
    [1, 3, 1],
    [3, 3, 2],
    [5, 3, 3],
    [7, 3, 4],
    [9, 3, 5],
    [5, 3, 6],
  ],
  "secure-gateway": [
    [1, 3, 1],
    [5, 3, 1],
    [9, 3, 1],
    [5, 3, 2],
    [3, 3, 3],
    [7, 3, 3],
    [5, 3, 4],
  ],
  "mirror-check": [
    [1, 4, 1],
    [9, 4, 1],
    [1, 4, 2],
    [9, 4, 2],
    [5, 4, 3],
    [5, 4, 4],
  ],
  "retrieval-maze": [
    [1, 3, 1],
    [5, 3, 1],
    [9, 3, 1],
    [9, 3, 2],
    [5, 3, 2],
    [1, 3, 2],
    [1, 3, 3],
    [5, 3, 3],
  ],
  "permission-stack": [
    [4, 6, 1],
    [4, 6, 2],
    [4, 6, 3],
    [4, 6, 4],
    [4, 6, 5],
    [4, 6, 6],
    [4, 6, 7],
  ],
  "proof-lanes": [
    [1, 5, 1],
    [8, 5, 1],
    [1, 5, 2],
    [8, 5, 2],
    [1, 5, 3],
    [8, 5, 3],
    [4, 6, 4],
  ],
  "brief-forge": [
    [5, 4, 1],
    [9, 3, 2],
    [7, 4, 3],
    [3, 4, 3],
    [1, 3, 2],
    [5, 4, 2],
    [5, 4, 4],
  ],
  "audit-diamond": [
    [5, 4, 1],
    [2, 4, 2],
    [8, 4, 2],
    [5, 4, 3],
    [2, 4, 4],
    [8, 4, 4],
    [5, 4, 5],
  ],
  "release-gates": [
    [1, 2, 1],
    [3, 2, 2],
    [5, 2, 1],
    [7, 2, 2],
    [9, 2, 1],
    [11, 2, 2],
    [5, 4, 3],
  ],
  "career-constellation": [
    [5, 4, 1],
    [1, 3, 2],
    [9, 3, 2],
    [3, 3, 3],
    [7, 3, 3],
    [5, 4, 4],
    [5, 4, 2],
  ],
};

export function getMapNodePlacement(
  topology: MapTopology,
  index: number,
): MapNodePlacement {
  const placement = topologyPlacements[topology][index] ?? [1, 12, index + 1];
  return {
    column: placement[0],
    span: placement[1],
    row: placement[2],
  };
}

export function getTopologySignature(topology: MapTopology) {
  return topologyPlacements[topology]
    .map(([column, span, row]) => `${column}:${span}:${row}`)
    .join("|");
}
