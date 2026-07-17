import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCopy,
  ChevronLeft,
  ChevronRight,
  FileCode2,
  HelpCircle,
  Lightbulb,
  LoaderCircle,
  Network,
  Search,
  ServerCrash,
  X,
} from "lucide-react";
import questArchive from "./assets/quest-archive.webp";
import questPortal from "./assets/quest-portal.webp";
import questStage from "./assets/quest-stage.webp";
import questWorkbench from "./assets/quest-workbench.webp";
import apiErrorCourtScene from "./assets/scene-api-error-court.webp";
import identityCorridorScene from "./assets/scene-identity-corridor.webp";
import idempotencyForgeScene from "./assets/scene-idempotency-forge.webp";
import hallucinationMirrorScene from "./assets/scene-hallucination-mirror.webp";
import modelKeyForgeScene from "./assets/scene-model-key-forge.webp";
import performanceObservatoryScene from "./assets/scene-performance-observatory.webp";
import morningStarTimingHarborScene from "./assets/scene-morning-star-timing-harbor.webp";
import memoryEchoGalleryScene from "./assets/scene-memory-echo-gallery.webp";
import ragKnowledgeMazeScene from "./assets/scene-rag-knowledge-maze.webp";
import agentBriefForgeScene from "./assets/scene-agent-brief-forge.webp";
import agentToolContractHallScene from "./assets/scene-agent-tool-contract-hall.webp";
import deliveryReviewCourtScene from "./assets/scene-delivery-review-court.webp";
import interviewDefenseHallScene from "./assets/scene-interview-defense-hall.webp";
import releaseReadinessGateScene from "./assets/scene-release-readiness-gate.webp";
import signalStormDispatchTowerScene from "./assets/scene-signal-storm-dispatch-tower.webp";
import verificationTrialArenaScene from "./assets/scene-verification-trial-arena.webp";
import archiveKeeperPortrait from "./assets/portrait-archive-keeper-v2.webp";
import apiClerkPortrait from "./assets/portrait-api-clerk-v2.webp";
import keyVaultEquipment from "./assets/equipment-key-vault.svg";
import foglampCatPet from "./assets/pet-foglamp-cat-v2.webp";
import identityGuardPortrait from "./assets/portrait-identity-guard-v2.webp";
import idempotencyStonePet from "./assets/pet-idempotency-stone-v2.webp";
import inspirationGlowPet from "./assets/pet-inspiration-glow-v2.webp";
import interviewCouncilorPortrait from "./assets/portrait-interview-councilor-v2.webp";
import retrievalFoxPet from "./assets/pet-retrieval-fox-v2.webp";
import mirrorEditorPortrait from "./assets/portrait-mirror-editor-v2.webp";
import knowledgeKeeperPortrait from "./assets/portrait-index-arbiter.webp";
import modelWardenPortrait from "./assets/portrait-model-warden-v2.webp";
import briefForgemasterPortrait from "./assets/portrait-brief-forgemaster-v2.webp";
import deliveryJudgePortrait from "./assets/portrait-delivery-judge-v2.webp";
import portalScribePortrait from "./assets/portrait-portal-scribe-v2.webp";
import releaseGatekeeperPortrait from "./assets/portrait-release-gatekeeper-v2.webp";
import testArbiterPortrait from "./assets/portrait-test-arbiter-v2.webp";
import toolWardenPortrait from "./assets/portrait-tool-warden-v2.webp";
import stormDispatcherPortrait from "./assets/portrait-storm-dispatcher.webp";
import echoForensicsPortrait from "./assets/portrait-echo-forensics-officer.webp";
import indexArbiterPortrait from "./assets/portrait-index-arbiter.webp";
import timingNavigatorPortrait from "./assets/portrait-timing-navigator.webp";
import {
  type ConceptCard,
  type CodeFocus,
  type GlossaryEntry,
  type MapNode,
  type ProjectMap,
  type RemediationLesson,
  type TeachingScenario,
  type TeachingStep,
  glossary,
} from "./teaching";
import { type DeveloperProfile } from "./careerProfile";
import { withChapterRemediation } from "./remediation";
import {
  getChapterShot,
  getMapNodePlacement,
  resolveChapterCinematic,
} from "./chapterCinematics";
import { normalizeScenarioId } from "./scenarioIds";

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

function ChapterMemoryStrip({
  steps,
  currentStepIdx,
  progress,
}: {
  steps: TeachingStep[];
  currentStepIdx: number;
  progress: TeachingApiProgress[];
}) {
  const currentStep = steps[currentStepIdx];
  if (!currentStep) return null;

  const previousStep = steps[currentStepIdx - 1];
  const nextStep = steps[currentStepIdx + 1];
  const completedCount = new Set(
    progress.filter((item) => item.completed).map((item) => item.stepId),
  ).size;

  return (
    <section className="chapter-memory-strip" aria-label="本章记忆线">
      <div className="memory-strip-head">
        <span>本章记忆线</span>
        <strong>
          已收录 {Math.min(completedCount, steps.length)} / {steps.length} 站
        </strong>
      </div>
      <div className="memory-strip-grid">
        <article>
          <span>刚刚看过</span>
          <strong>{previousStep?.title ?? "剧情探索"}</strong>
          <p>
            {previousStep?.goal ??
              "你已经完成本章开场调查，知道事故为什么发生、这一关要解决什么。"}
          </p>
        </article>
        <article className="active">
          <span>当前这一棒</span>
          <strong>{currentStep.title}</strong>
          <p>{currentStep.goal}</p>
        </article>
        <article>
          <span>接下来</span>
          <strong>{nextStep?.title ?? "伙伴会合"}</strong>
          <p>
            {nextStep?.goal ??
              "把本章路线、证据边界和面试复盘收束起来，再进入真实项目实战。"}
          </p>
        </article>
      </div>
    </section>
  );
}

function ChapterNavigationNeedle({
  scenario,
  currentStepIdx,
  routeLabel,
}: {
  scenario: TeachingScenario;
  currentStepIdx: number;
  routeLabel: string;
}) {
  const currentStep = scenario.steps[currentStepIdx];
  if (!currentStep) return null;

  const previousStep = scenario.steps[currentStepIdx - 1];
  const nextStep = scenario.steps[currentStepIdx + 1];
  const currentOutput =
    currentStep.codeFocus?.output ??
    currentStep.projectPosition ??
    currentStep.goal;
  const previousOutput =
    previousStep?.codeFocus?.output ??
    previousStep?.projectPosition ??
    previousStep?.goal ??
    "开场调查已经确认事故为什么发生";
  const nextInput =
    nextStep?.codeFocus?.input ??
    nextStep?.projectPosition ??
    nextStep?.goal ??
    "带着证据进入伙伴会合和实战修复";

  return (
    <section className="chapter-navigation-needle" aria-label="本章导航针">
      <header>
        <span>本章导航针</span>
        <strong>{routeLabel}</strong>
        <small>
          第 {currentStepIdx + 1}/{scenario.steps.length} 站 ·{" "}
          {currentStep.title}
        </small>
      </header>
      <div>
        <article>
          <span>刚从哪里来</span>
          <strong>{previousStep?.title ?? "剧情调查"}</strong>
          <p>{previousOutput}</p>
        </article>
        <article className="active">
          <span>现在做什么</span>
          <strong>{currentStep.title}</strong>
          <p>{currentStep.goal}</p>
        </article>
        <article>
          <span>完成后交给谁</span>
          <strong>{nextStep?.title ?? "实战会合"}</strong>
          <p>{nextInput}</p>
        </article>
      </div>
      <p>
        当前只要交出：<b>{currentOutput}</b>。先把这一站说清楚，再进入下一站。
      </p>
    </section>
  );
}

function ChapterQuestLog({
  scenario,
  currentStepIdx,
  completedCount,
}: {
  scenario: TeachingScenario;
  currentStepIdx: number;
  completedCount: number;
}) {
  const currentStep = scenario.steps[currentStepIdx];
  if (!currentStep) return null;

  const previousStep = scenario.steps[currentStepIdx - 1];
  const nextStep = scenario.steps[currentStepIdx + 1];
  const teachingHandoffStep =
    currentStepIdx > 0 && completedCount >= currentStepIdx
      ? previousStep
      : undefined;
  const teachingHandoff = teachingHandoffStep
    ? `剧情教学已经把「${teachingHandoffStep.title}」整理成委托草案；所以实战从「${currentStep.title}」开始。你没有漏步骤，现在要把刚才看懂的流程拿去读真实材料。`
    : "";

  return (
    <section className="quest-log teaching-quest-log" aria-label="章节冒险日志">
      <header>
        <span>冒险日志</span>
        <strong>{scenario.steps[0]?.title ?? "章节任务"}</strong>
      </header>
      <div>
        <article>
          <span>已收录</span>
          <strong>
            {previousStep?.title ?? `剧情探索 ${completedCount} 站`}
          </strong>
          <p>
            {previousStep?.goal ??
              "你已经看过本章事故现场，知道这关不是背概念，而是沿流程找证据。"}
          </p>
        </article>
        <article className="active">
          <span>当前任务</span>
          <strong>{currentStep.title}</strong>
          <p>{currentStep.goal}</p>
        </article>
        <article>
          <span>下一步</span>
          <strong>{nextStep?.title ?? "伙伴会合"}</strong>
          <p>
            {nextStep?.goal ??
              "把本章证据线整理成工作复盘、Agent 委托和面试表达，再进入实战。"}
          </p>
        </article>
      </div>
      {teachingHandoff && (
        <p className="quest-log-handoff">{teachingHandoff}</p>
      )}
    </section>
  );
}

function ChapterMentorCompanion({
  scenario,
  currentStepIdx,
  scenes,
  routeLabel,
  workBackground,
}: {
  scenario: TeachingScenario;
  currentStepIdx: number;
  scenes: QuestScene[];
  routeLabel: string;
  workBackground?: string;
}) {
  const currentStep = scenario.steps[currentStepIdx];
  const scene = scenes[Math.min(currentStepIdx, scenes.length - 1)];
  if (!currentStep || !scene) return null;

  const firstTerm = scene.terms?.[0];
  const firstClue = scene.clues[0];
  const isMapStep = currentStep.id.includes("map");
  const scenePortrait = getScenePortrait(scene);
  const activeNode =
    scenario.projectMap.nodes[
      Math.min(
        currentStepIdx,
        Math.max(scenario.projectMap.nodes.length - 1, 0),
      )
    ];
  const finalNode = scenario.projectMap.nodes.at(-1);

  return (
    <section
      className={`chapter-mentor-companion ${isMapStep ? "map-step-compact" : ""}`}
      aria-label="本章导师同行"
    >
      <div
        className="mentor-scene-glow"
        style={{ backgroundImage: `url(${scene.image})` }}
        aria-hidden="true"
      />
      {scenePortrait && (
        <img
          className="mentor-companion-portrait"
          src={scenePortrait}
          alt={scene.speaker}
        />
      )}
      <div className="mentor-companion-copy">
        <span>
          导师同行 · {scene.place} · {routeLabel}
        </span>
        <strong>
          {scene.speaker} 正在带你看：{currentStep.title}
        </strong>
        <blockquote className="mentor-scene-dialogue">
          “{scene.dialogue}”
        </blockquote>
        <p>{scene.mentor}</p>
        {workBackground && (
          <div className="mentor-work-bridge">
            <span>工作里什么时候会遇到</span>
            <p>{workBackground}</p>
          </div>
        )}
        <div className="mentor-companion-brief">
          <article>
            <span>这一幕为什么重要</span>
            <b>{scene.goal}</b>
          </article>
          <article>
            <span>先抓住哪个词</span>
            <b>
              {firstTerm
                ? `${firstTerm.term}：${firstTerm.meaning}`
                : currentStep.goal}
            </b>
          </article>
          <article>
            <span>第一眼看哪条线索</span>
            <b>{firstClue?.label ?? currentStep.goal}</b>
          </article>
        </div>
        <div className="mentor-delivery-contract" aria-label="本关交付契约">
          <div>
            <span>现在要证明</span>
            <b>{activeNode?.output ?? currentStep.goal}</b>
          </div>
          <div>
            <span>交给下一棒</span>
            <b>{activeNode?.evidenceSources?.[0] ?? "可复核的项目证据"}</b>
          </div>
          <div>
            <span>学完能带走</span>
            <b>{finalNode?.output ?? "一段能在面试中讲清的工作复盘"}</b>
          </div>
        </div>
      </div>
    </section>
  );
}

const teachingCompanions: Record<
  string,
  { name: string; type: "伙伴" | "宠物" | "装备"; image: string; gift: string }
> = {
  "frontend-component-state": {
    name: "状态编舞师",
    type: "伙伴",
    image: portalScribePortrait,
    gift: "状态流证据",
  },
  "frontend-request-states": {
    name: "提示小灯",
    type: "宠物",
    image: foglampCatPet,
    gift: "请求状态矩阵",
  },
  "java-layered-request": {
    name: "分层守望者",
    type: "伙伴",
    image: apiClerkPortrait,
    gift: "请求接力证据",
  },
  "java-transaction-consistency": {
    name: "事务小锻炉",
    type: "宠物",
    image: idempotencyStonePet,
    gift: "回滚与一致性证据",
  },
  "java-cache-observability": {
    name: "缓存巡航员",
    type: "伙伴",
    image: foglampCatPet,
    gift: "缓存时间线证据",
  },
  "frontend-performance-proof": {
    name: "首屏观测师",
    type: "伙伴",
    image: testArbiterPortrait,
    gift: "性能基线与复测证据",
  },
  "frontend-accessibility-proof": {
    name: "灯塔小鹿",
    type: "宠物",
    image: foglampCatPet,
    gift: "无障碍与回归证据",
  },
  "frontend-testing-proof": {
    name: "回归审查官",
    type: "伙伴",
    image: testArbiterPortrait,
    gift: "测试与回归证据",
  },
  "java-release-harbor": {
    name: "上线港守门人",
    type: "伙伴",
    image: releaseGatekeeperPortrait,
    gift: "上线与回滚证据",
  },
  "java-production-incident": {
    name: "事故回声官",
    type: "伙伴",
    image: deliveryJudgePortrait,
    gift: "报警、止血与复测证据",
  },
  "canvas-save-persistence": {
    name: "档案馆记录员",
    type: "伙伴",
    image: archiveKeeperPortrait,
    gift: "数据流证据",
  },
  "case-002": {
    name: "灵感萤火",
    type: "宠物",
    image: inspirationGlowPet,
    gift: "产品链路",
  },
  "case-003-login-state": {
    name: "回廊守卫",
    type: "伙伴",
    image: identityGuardPortrait,
    gift: "登录态证据",
  },
  "case-004-api-error": {
    name: "审判庭书记员",
    type: "伙伴",
    image: apiClerkPortrait,
    gift: "接口错误证据",
  },
  "case-005-data-consistency": {
    name: "幂等石灵",
    type: "宠物",
    image: idempotencyStonePet,
    gift: "一致性证据",
  },
  "case-006-performance": {
    name: "雾灯猫",
    type: "宠物",
    image: foglampCatPet,
    gift: "性能时间账本",
  },
  "case-007-ai-api": {
    name: "密钥匣",
    type: "装备",
    image: keyVaultEquipment,
    gift: "安全调用边界",
  },
  "case-008-hallucination": {
    name: "镜厅校对师",
    type: "伙伴",
    image: mirrorEditorPortrait,
    gift: "引用校验证据",
  },
  "case-009-rag": {
    name: "检索狐",
    type: "宠物",
    image: retrievalFoxPet,
    gift: "检索命中证据",
  },
  "case-010-agent-tools": {
    name: "塔楼副官",
    type: "伙伴",
    image: toolWardenPortrait,
    gift: "工具权限边界",
  },
  "case-011-testing-proof": {
    name: "验收试炼官",
    type: "伙伴",
    image: testArbiterPortrait,
    gift: "可信测试证据",
  },
  "case-012-agent-brief": {
    name: "委托书锻造师",
    type: "伙伴",
    image: briefForgemasterPortrait,
    gift: "可执行委托",
  },
  "case-013-delivery-review": {
    name: "交付审查官",
    type: "伙伴",
    image: deliveryJudgePortrait,
    gift: "交付判断依据",
  },
  "case-014-release-readiness": {
    name: "上线守门人",
    type: "伙伴",
    image: releaseGatekeeperPortrait,
    gift: "可回滚上线清单",
  },
  "case-015-interview-review": {
    name: "终章答辩官",
    type: "伙伴",
    image: interviewCouncilorPortrait,
    gift: "可追问面试回答",
  },
};

function getCompanionAction(step: TeachingStep) {
  if (step.id.includes("map")) {
    return "先沿路线念一遍谁收到什么、又交出什么；暂时不用记代码。";
  }
  if (step.id.includes("concept") || step.id === "micro-lessons") {
    return "一次只解锁一个词：先看生活类比，再回到本章例子。";
  }
  if (step.id.includes("tour")) {
    return "只盯当前高亮行，先说清它收到什么、做了什么、交出什么。";
  }
  if (step.id.includes("close")) {
    return "把现象、证据、行动和验证各说一句，再把它收进面试复盘。";
  }
  if (step.id.includes("evidence") || step.id.includes("verification")) {
    return "把两条能互相印证的证据连起来，不用页面提示代替事实。";
  }
  return "先完成眼前这一小步；看不懂时回到流程位置和证据来源。";
}

function ChapterCompanionReaction({
  scenario,
  currentStepIdx,
}: {
  scenario: TeachingScenario;
  currentStepIdx: number;
}) {
  const companion =
    teachingCompanions[normalizeScenarioId(scenario.scenarioId)];
  const currentStep = scenario.steps[currentStepIdx];
  if (!companion || !currentStep) return null;
  const isMapStep = currentStep.id.includes("map");

  return (
    <aside
      className={`chapter-companion-reaction ${isMapStep ? "map-step-compact" : ""}`}
      aria-label="同行伙伴反应"
    >
      <div className="companion-reaction-portrait">
        <img src={companion.image} alt={companion.name} />
        <span>{companion.type}</span>
      </div>
      <div className="companion-reaction-copy">
        <span>
          {companion.name} · 正在陪你完成「{currentStep.title}」
        </span>
        <strong>{getCompanionAction(currentStep)}</strong>
      </div>
      <div className="companion-reaction-gift">
        <span>本步收集</span>
        <b>{companion.gift}</b>
      </div>
    </aside>
  );
}

function StepEvidenceTransition({
  scenario,
  completedStepIndex,
  saving,
  onContinue,
}: {
  scenario: TeachingScenario;
  completedStepIndex: number;
  saving: boolean;
  onContinue: (activeRecall?: string) => void;
}) {
  const [activeRecall, setActiveRecall] = useState("");
  const completedStep = scenario.steps[completedStepIndex];
  const nextStep = scenario.steps[completedStepIndex + 1];
  const companion =
    teachingCompanions[normalizeScenarioId(scenario.scenarioId)];
  if (!completedStep || !companion) return null;

  const requiresRecall =
    completedStep.id === "project-map" ||
    completedStep.id.includes("-map") ||
    completedStep.id.includes("-close");
  const isCloseStep = completedStep.id.includes("-close");
  const recallPrompt = isCloseStep
    ? "不用背标准答案：用一句自己的话说，这一关要看什么证据，才能证明真的完成？"
    : "不用抄流程图：用一句自己的话说，起点把什么交给谁，最后又要交出什么？";
  const recallReady = activeRecall.trim().length >= 12;
  const codeFocus = completedStep.codeFocus;
  const codeTransitionSummary = codeFocus
    ? {
        canProve: codeFocus.observationGoal,
        cannotProve: `还不能证明「${codeFocus.output}」已经在真实环境稳定发生。下一站还要看 Network、后端日志、数据库记录或测试结果。`,
        nextEvidence: nextStep
          ? `${nextStep.title}：${nextStep.goal}`
          : "伙伴会合：把代码、证据和实战任务串成一条完整证据链。",
      }
    : null;

  return (
    <div className="step-evidence-transition" role="presentation">
      <section
        className="step-evidence-transition-panel"
        role="dialog"
        aria-modal="true"
        aria-label="伙伴证据收录"
      >
        <div className="step-transition-portrait">
          <img src={companion.image} alt={companion.name} />
          <span>{companion.type}同行</span>
        </div>
        <div className="step-transition-copy">
          <span>证据已收录 · {completedStep.title}</span>
          <h2>{companion.name} 替你守住了这一棒</h2>
          <p>{completedStep.goal}</p>
          <div className="step-transition-handoff">
            <article>
              <span>这一站留下</span>
              <strong>{companion.gift}</strong>
            </article>
            <article>
              <span>交给下一站</span>
              <strong>{nextStep?.title ?? "伙伴会合"}</strong>
              <small>
                {nextStep?.goal ??
                  "把本章证据整理成工作复盘、Agent 委托和面试表达。"}
              </small>
            </article>
          </div>
          <blockquote>“{getCompanionAction(completedStep)}”</blockquote>
          {codeTransitionSummary && (
            <section
              className="step-transition-code-recap"
              aria-label="代码证据交接复盘"
            >
              <span>代码证据交接复盘</span>
              <dl>
                <div>
                  <dt>刚才看懂</dt>
                  <dd>
                    「{codeFocus?.input}」经过「{completedStep.title}
                    」，准备交出「
                    {codeFocus?.output}」。
                  </dd>
                </div>
                <div>
                  <dt>能证明</dt>
                  <dd>{codeTransitionSummary.canProve}</dd>
                </div>
                <div>
                  <dt>还不能证明</dt>
                  <dd>{codeTransitionSummary.cannotProve}</dd>
                </div>
                <div>
                  <dt>下一站带着它查</dt>
                  <dd>{codeTransitionSummary.nextEvidence}</dd>
                </div>
              </dl>
            </section>
          )}
          {requiresRecall && (
            <label className="step-transition-recall">
              <span>主动复述 · 不评分</span>
              <strong>{recallPrompt}</strong>
              <textarea
                value={activeRecall}
                onChange={(event) => setActiveRecall(event.target.value)}
                placeholder={
                  isCloseStep
                    ? "例如：我会同时查看……和……，因为……"
                    : "例如：用户先把……交给……，最后……"
                }
                rows={3}
                autoFocus
              />
              <small>
                {recallReady
                  ? "这句话会作为你的原始理解记录保存，不代表系统已经判定掌握。"
                  : `至少写 12 个字，还差 ${Math.max(0, 12 - activeRecall.trim().length)} 个。`}
              </small>
            </label>
          )}
          <button
            className="v2-button primary"
            onClick={() => onContinue(activeRecall.trim() || undefined)}
            disabled={saving || (requiresRecall && !recallReady)}
            autoFocus={!requiresRecall}
          >
            {saving
              ? "正在保存你的复述…"
              : nextStep
                ? "收下证据，前往下一站"
                : "收下证据，前往伙伴会合"}
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}

function ChapterFlowReplay({
  scenario,
  currentStepIdx,
}: {
  scenario: TeachingScenario;
  currentStepIdx: number;
}) {
  const nodes = scenario.projectMap.nodes;
  if (nodes.length === 0) return null;

  const activeNodeIndex = Math.min(
    Math.max(currentStepIdx, 0),
    nodes.length - 1,
  );
  const activeNode = nodes[activeNodeIndex];
  const nextNode = nodes[activeNodeIndex + 1];
  const incomingEdge = scenario.projectMap.edges.find(
    (edge) => edge.to === activeNode.id,
  );
  const outgoingEdge = scenario.projectMap.edges.find(
    (edge) => edge.from === activeNode.id,
  );

  return (
    <section className="chapter-flow-replay" aria-label="本章流程回放">
      <header>
        <span>流程回放</span>
        <strong>
          当前站点：{activeNode.label}
          {nextNode ? ` → 下一站：${nextNode.label}` : " → 准备结案"}
        </strong>
      </header>
      <ol className="flow-replay-rail">
        {nodes.map((node, index) => {
          const edgeToNext = scenario.projectMap.edges.find(
            (edge) => edge.from === node.id,
          );
          return (
            <li
              key={node.id}
              className={[
                index < activeNodeIndex ? "done" : "",
                index === activeNodeIndex ? "active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flow-replay-marker">
                <span>{index + 1}</span>
              </div>
              <div className="flow-replay-copy">
                <strong>{node.label}</strong>
                <p>
                  收到：{node.input}；交出：{node.output}
                </p>
                <small>
                  证据：{node.evidenceSources.slice(0, 2).join("、")}
                  {edgeToNext ? ` · 交给下一站：${edgeToNext.label}` : ""}
                </small>
              </div>
            </li>
          );
        })}
      </ol>
      <footer className="flow-replay-brief">
        <article>
          <span>上一棒交来</span>
          <strong>{incomingEdge?.label ?? "本章起点"}</strong>
          <p>{activeNode.input}</p>
        </article>
        <article>
          <span>当前要证明</span>
          <strong>{activeNode.label}</strong>
          <p>
            看 {activeNode.evidenceSources.slice(0, 2).join("、") || "本章材料"}
            ，判断它是否真的把材料交给下一站。
          </p>
        </article>
        <article>
          <span>交给下一棒</span>
          <strong>{outgoingEdge?.label ?? "章节结案"}</strong>
          <p>{activeNode.output}</p>
        </article>
      </footer>
    </section>
  );
}

function ChapterMentorTrial({
  scenario,
  currentStepIdx,
}: {
  scenario: TeachingScenario;
  currentStepIdx: number;
}) {
  const [litSeals, setLitSeals] = useState<Record<string, boolean>>({});
  const [copiedTakeaway, setCopiedTakeaway] = useState(false);
  const currentStep = scenario.steps[currentStepIdx];
  if (!currentStep) return null;
  const nextStep = scenario.steps[currentStepIdx + 1];

  const activeNode =
    scenario.projectMap.nodes[
      Math.min(currentStepIdx, scenario.projectMap.nodes.length - 1)
    ];
  const evidence =
    activeNode?.evidenceSources.slice(0, 2).join("、") || "本章证据";
  const seals = [
    {
      id: `${currentStep.id}-flow`,
      label: "流程印章",
      title: "我能说清上一棒和下一棒",
      prompt: `用自己的话说出「${activeNode?.label ?? currentStep.title}」收到什么、交出什么。`,
    },
    {
      id: `${currentStep.id}-evidence`,
      label: "证据印章",
      title: "我知道第一眼看哪份证据",
      prompt: `先看 ${evidence}，不要只凭剧情或绿色提示判断。`,
    },
    {
      id: `${currentStep.id}-agent`,
      label: "委托印章",
      title: "我能把这一步交给 Agent",
      prompt: "能写出背景、边界、验收三句话，再让 Agent 继续协作。",
    },
  ];
  const litCount = seals.filter((seal) => litSeals[seal.id]).length;
  const missingSeals = seals.filter((seal) => !litSeals[seal.id]);
  const trialComplete = litCount === seals.length;
  const abilityMark = `${currentStep.title} · 证据接力印记`;
  const interviewLine = `面试里可以说：我在「${currentStep.title}」这一步，不只看结论，而是用 ${evidence} 证明「${activeNode?.label ?? currentStep.title}」这条链路是否成立。`;
  const takeawayCards = [
    {
      label: "工作能力",
      title: "能讲清这一棒",
      body: `「${activeNode?.label ?? currentStep.title}」收到什么、交出什么，要能说成人话。`,
    },
    {
      label: "Agent 委托",
      title: "能交代协作边界",
      body: "给 Agent 时写清背景、边界、验收，不把判断全丢出去。",
    },
    {
      label: "面试素材",
      title: "能复述证据链",
      body: interviewLine,
    },
  ];
  const takeawayText = [
    "导师试炼本步收获",
    `能力印记：${abilityMark}`,
    `步骤：${currentStep.title}`,
    `流程：${activeNode?.label ?? currentStep.title} 要说清收到什么、交出什么。`,
    `证据：先看 ${evidence}，不要只凭剧情或绿色提示判断。`,
    "Agent：委托时写清背景、边界、验收，再让 Agent 继续协作。",
    `面试：${interviewLine}`,
    `下一步：${nextStep?.title ?? "伙伴会合"}`,
  ].join("\n");
  const copyTakeaway = async () => {
    try {
      await navigator.clipboard?.writeText(takeawayText);
      setCopiedTakeaway(true);
    } catch {
      setCopiedTakeaway(false);
    }
  };

  return (
    <section className="chapter-mentor-trial" aria-label="导师试炼三印章">
      <header>
        <span>导师试炼</span>
        <strong>点亮三枚印章，再说自己看懂了这一棒</strong>
        <small>{litCount}/3 已点亮</small>
      </header>
      <div className="mentor-trial-grid">
        {seals.map((seal) => {
          const active = litSeals[seal.id] === true;
          return (
            <button
              key={seal.id}
              type="button"
              className={active ? "lit" : ""}
              aria-pressed={active}
              onClick={() =>
                setLitSeals((current) => ({
                  ...current,
                  [seal.id]: !current[seal.id],
                }))
              }
            >
              <span>{seal.label}</span>
              <strong>{seal.title}</strong>
              <p>{seal.prompt}</p>
            </button>
          );
        })}
      </div>
      {!trialComplete && (
        <p className="mentor-trial-gap" aria-live="polite">
          还差：{missingSeals.map((seal) => seal.label).join("、")}。
        </p>
      )}
      {trialComplete && (
        <footer className="mentor-trial-complete" aria-live="polite">
          <span>试炼完成</span>
          <strong>你已经能把这一棒讲成流程、证据和 Agent 委托。</strong>
          <div className="mentor-trial-mark">
            <span>获得能力印记</span>
            <strong>{abilityMark}</strong>
          </div>
          <p>
            下一步：{nextStep?.title ?? "伙伴会合"}。带走一句话： 「
            {activeNode?.label ?? currentStep.title}」要用 {evidence}
            证明，不只听页面或剧情说成功。
          </p>
          <div className="mentor-trial-takeaways" aria-label="试炼收获三格">
            {takeawayCards.map((card) => (
              <article key={card.label}>
                <span>{card.label}</span>
                <strong>{card.title}</strong>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
          <button
            className="mentor-trial-copy"
            type="button"
            onClick={() => void copyTakeaway()}
          >
            <ClipboardCopy aria-hidden="true" size={14} />
            {copiedTakeaway ? "已复制本步收获" : "复制本步收获"}
          </button>
        </footer>
      )}
    </section>
  );
}

function ChapterAbilityPassport({
  scenario,
  currentStepIdx,
}: {
  scenario: TeachingScenario;
  currentStepIdx: number;
}) {
  const [copiedSeed, setCopiedSeed] = useState<"agent" | "interview" | null>(
    null,
  );
  const currentStep = scenario.steps[currentStepIdx];
  if (!currentStep) return null;

  const evidenceSources = Array.from(
    new Set(
      scenario.projectMap.nodes.flatMap((node) => node.evidenceSources ?? []),
    ),
  ).slice(0, 5);
  const finalStep = scenario.steps.at(-1);
  const routeStart = scenario.projectMap.nodes[0];
  const routeEnd = scenario.projectMap.nodes.at(-1);
  const agentBriefSeed = {
    background: `我正在学习「${currentStep.title}」，目标是：${currentStep.goal}。`,
    boundary: `只能基于本章材料和证据工具分析，不能替我编造已经验证过的结果。`,
    acceptance: `请交回“看到什么 / 说明什么 / 下一步验证什么”，并引用 ${
      evidenceSources.slice(0, 2).join("、") || "项目材料"
    }。`,
  };
  const interviewSeed = {
    phenomenon: `我遇到的场景是「${currentStep.title}」，不是泛泛学概念。`,
    evidence: `我会引用 ${evidenceSources.slice(0, 2).join("、") || "项目材料"} 说明判断依据。`,
    action: `我先画清 ${routeStart?.label ?? "起点"} 到 ${routeEnd?.label ?? "结案"} 的交接路线，再决定下一步。`,
    verification: finalStep?.goal ?? "最后用本章结论和实战证据收束成复盘。",
  };
  const agentBriefText = [
    "Agent 委托骨架",
    `背景：${agentBriefSeed.background}`,
    `边界：${agentBriefSeed.boundary}`,
    `验收：${agentBriefSeed.acceptance}`,
  ].join("\n");
  const interviewBriefText = [
    "面试复盘骨架",
    `现象：${interviewSeed.phenomenon}`,
    `证据：${interviewSeed.evidence}`,
    `行动：${interviewSeed.action}`,
    `验证：${interviewSeed.verification}`,
  ].join("\n");
  const copySeed = async (
    seed: "agent" | "interview",
    clipboardText: string,
  ) => {
    try {
      await navigator.clipboard?.writeText(clipboardText);
      setCopiedSeed(seed);
    } catch {
      setCopiedSeed(null);
    }
  };

  return (
    <section className="chapter-ability-passport" aria-label="本章能力护照">
      <header>
        <span>能力护照</span>
        <strong>这关不是看完就算，而是要带走一项工作能力</strong>
      </header>
      <div className="ability-passport-grid">
        <article>
          <span>正在训练</span>
          <strong>{currentStep.goal}</strong>
          <p>当前站点：{currentStep.title}。先把这一站讲清楚，再进入下一棒。</p>
        </article>
        <article>
          <span>工作里怎么用</span>
          <strong>
            {routeStart?.label ?? "起点"} → {routeEnd?.label ?? "结案"}
          </strong>
          <p>
            真实工作里遇到同类问题时，先画出谁把什么交给谁，再找证据证明断点。
          </p>
        </article>
        <article>
          <span>证据工具</span>
          <strong>{evidenceSources.join(" / ") || "项目材料"}</strong>
          <p>不用背术语；优先说“我看到什么、它说明什么、下一步验证什么”。</p>
        </article>
        <article>
          <span>Agent 协作</span>
          <strong>背景 / 边界 / 验收</strong>
          <p>
            交给 Agent 前先写清楚现场、不能越过的范围，以及它必须交回什么证据。
          </p>
          <dl className="agent-brief-seed" aria-label="Agent 委托骨架">
            <div>
              <dt>背景</dt>
              <dd>{agentBriefSeed.background}</dd>
            </div>
            <div>
              <dt>边界</dt>
              <dd>{agentBriefSeed.boundary}</dd>
            </div>
            <div>
              <dt>验收</dt>
              <dd>{agentBriefSeed.acceptance}</dd>
            </div>
          </dl>
          <button
            className="seed-copy-button"
            type="button"
            onClick={() => void copySeed("agent", agentBriefText)}
          >
            <ClipboardCopy aria-hidden="true" size={14} />
            {copiedSeed === "agent" ? "已复制委托骨架" : "复制委托骨架"}
          </button>
        </article>
        <article>
          <span>验收动作</span>
          <strong>用证据证明这一棒真的成立</strong>
          <p>
            完成本章前，至少能把「{routeStart?.label ?? "起点"} →{" "}
            {routeEnd?.label ?? "结案"}」讲成一条证据链，并说明用{" "}
            {evidenceSources.slice(0, 2).join("、") || "项目材料"}
            怎么复核。
          </p>
        </article>
        <article>
          <span>面试产出</span>
          <strong>{finalStep?.goal ?? "把本章整理成项目复盘"}</strong>
          <p>通关后把现象、定位证据、行动、验证和边界整理成 1 分钟项目回答。</p>
          <dl className="interview-brief-seed" aria-label="面试复盘骨架">
            <div>
              <dt>现象</dt>
              <dd>{interviewSeed.phenomenon}</dd>
            </div>
            <div>
              <dt>证据</dt>
              <dd>{interviewSeed.evidence}</dd>
            </div>
            <div>
              <dt>行动</dt>
              <dd>{interviewSeed.action}</dd>
            </div>
            <div>
              <dt>验证</dt>
              <dd>{interviewSeed.verification}</dd>
            </div>
          </dl>
          <button
            className="seed-copy-button"
            type="button"
            onClick={() => void copySeed("interview", interviewBriefText)}
          >
            <ClipboardCopy aria-hidden="true" size={14} />
            {copiedSeed === "interview" ? "已复制复盘骨架" : "复制复盘骨架"}
          </button>
        </article>
      </div>
    </section>
  );
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
  portraitOverride?: string;
  place: string;
  title: string;
  speaker: string;
  dialogue: string;
  goal: string;
  mentor: string;
  terms?: QuestTerm[];
  clues: QuestClue[];
};

type StoryProgressSnapshot = {
  sceneIndex: number;
  discovered: Record<string, string[]>;
  sceneRecalls: Record<string, string>;
  sceneDecisions: Record<string, string>;
};

function getStoryProgressStepId(scenarioId: string) {
  scenarioId = normalizeScenarioId(scenarioId);
  const storyStepIds: Record<string, string> = {
    "frontend-component-state": "frontend-component-investigation",
    "frontend-request-states": "frontend-request-states-investigation",
    "java-layered-request": "java-layered-investigation",
    "java-transaction-consistency": "java-transaction-investigation",
    "java-cache-observability": "java-cache-investigation",
    "frontend-performance-proof": "frontend-performance-investigation",
    "frontend-accessibility-proof": "frontend-accessibility-investigation",
    "frontend-testing-proof": "frontend-testing-investigation",
    "java-release-harbor": "java-release-investigation",
    "java-production-incident": "java-release-investigation",
    "canvas-save-persistence": "canvasstorm-investigation",
    "case-002": "canvasstorm-investigation",
    "case-003-login-state": "login-state-investigation",
    "case-004-api-error": "api-error-investigation",
    "case-005-data-consistency": "consistency-investigation",
    "case-006-performance": "performance-investigation",
    "case-007-ai-api": "ai-api-investigation",
    "case-008-hallucination": "hallucination-investigation",
    "case-009-rag": "rag-investigation",
    "case-010-agent-tools": "agent-tools-investigation",
    "case-011-testing-proof": "testing-proof-investigation",
    "case-012-agent-brief": "agent-brief-investigation",
    "case-013-delivery-review": "delivery-review-investigation",
    "case-014-release-readiness": "release-readiness-investigation",
    "case-015-interview-review": "interview-review-investigation",
  };
  return storyStepIds[scenarioId] ?? "story-investigation";
}

function parseStoryProgress(
  response: Record<string, unknown> | undefined,
  maxSceneIndex: number,
): StoryProgressSnapshot | undefined {
  if (!response || typeof response.sceneIndex !== "number") return undefined;
  const readRecord = (value: unknown): Record<string, string[]> => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, items]) =>
        Array.isArray(items)
          ? [
              [
                key,
                items.filter(
                  (item): item is string => typeof item === "string",
                ),
              ],
            ]
          : [],
      ),
    );
  };
  const readStringRecord = (value: unknown): Record<string, string> => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, item]) =>
        typeof item === "string" ? [[key, item]] : [],
      ),
    );
  };
  return {
    sceneIndex: Math.min(
      Math.max(Math.floor(response.sceneIndex), 0),
      maxSceneIndex,
    ),
    discovered: readRecord(response.discovered),
    sceneRecalls: readStringRecord(response.sceneRecalls),
    sceneDecisions: readStringRecord(response.sceneDecisions),
  };
}

const scenePortraitOverrides: Record<string, string> = {
  "archive-vault": knowledgeKeeperPortrait,
  "repair-bench": briefForgemasterPortrait,
  "cs-direction": briefForgemasterPortrait,
  "cookie-portal": portalScribePortrait,
  "session-vault": archiveKeeperPortrait,
  "expiry-bench": echoForensicsPortrait,
  "validation-bench": indexArbiterPortrait,
  "log-archive": echoForensicsPortrait,
  "forge-clicks": stormDispatcherPortrait,
  "unique-vault": indexArbiterPortrait,
  "waterfall-tower": stormDispatcherPortrait,
  "api-clocktower": timingNavigatorPortrait,
  "render-stage": echoForensicsPortrait,
  "key-vault": stormDispatcherPortrait,
  "stream-bridge": portalScribePortrait,
  "context-bag": echoForensicsPortrait,
  "citation-court": indexArbiterPortrait,
  "retrieval-hall": retrievalFoxPet,
  "chunk-workshop": knowledgeKeeperPortrait,
  "schema-hall": indexArbiterPortrait,
  "permission-gate": echoForensicsPortrait,
  "unit-rune-room": timingNavigatorPortrait,
  "report-archive": echoForensicsPortrait,
  "acceptance-contract": indexArbiterPortrait,
  "diff-evidence-room": echoForensicsPortrait,
  "regression-risk-hall": indexArbiterPortrait,
  "backup-archive": timingNavigatorPortrait,
  "monitoring-tower": echoForensicsPortrait,
  "star-orrery": stormDispatcherPortrait,
  "followup-mirror": echoForensicsPortrait,
};

function getScenePortrait(scene: QuestScene) {
  return (
    scene.portraitOverride ?? scenePortraitOverrides[scene.id] ?? scene.portrait
  );
}

function QuestSceneSpotlight({
  scene,
  sceneIndex,
  totalScenes,
  previousScene,
  nextScene,
  activeJourney,
}: {
  scene: QuestScene;
  sceneIndex: number;
  totalScenes: number;
  previousScene: QuestScene | undefined;
  nextScene: QuestScene | undefined;
  activeJourney: QuestJourneyItem | undefined;
}) {
  const portrait = getScenePortrait(scene) ?? archiveKeeperPortrait;
  return (
    <section
      className="quest-scene-spotlight"
      aria-label="剧情舞台镜头"
      style={{ "--spotlight-bg": `url(${scene.image})` } as CSSProperties}
    >
      <div className="quest-scene-spotlight-copy">
        <span>
          第 {sceneIndex + 1}/{totalScenes} 幕 · {scene.place}
        </span>
        <strong className="quest-scene-spotlight-title">{scene.title}</strong>
        <p>{scene.dialogue}</p>
        <dl aria-label="这一幕学习锚点">
          <div>
            <dt>我现在在哪</dt>
            <dd>{scene.place}</dd>
          </div>
          <div>
            <dt>先懂这一句</dt>
            <dd>{activeJourney?.plain ?? scene.goal}</dd>
          </div>
          <div>
            <dt>下一幕交接</dt>
            <dd>
              {nextScene
                ? `${scene.speaker} 会把证据交给 ${nextScene.place}`
                : "收束证据，进入实战修复"}
            </dd>
          </div>
        </dl>
      </div>
      <aside className="quest-scene-spotlight-cast" aria-label="当前登场角色">
        <img src={portrait} alt={scene.speaker} />
        <span>{previousScene ? "接过上一幕证据" : "本章首位向导"}</span>
        <strong>{scene.speaker}</strong>
        <p>{scene.mentor}</p>
      </aside>
    </section>
  );
}

function QuestCollectionContract({
  companion,
  totalFound,
  totalClues,
  sceneFound,
  sceneTotal,
  abilityMark,
}: {
  companion:
    | {
        name: string;
        type: "伙伴" | "宠物" | "装备";
        image: string;
        gift: string;
      }
    | undefined;
  totalFound: number;
  totalClues: number;
  sceneFound: number;
  sceneTotal: number;
  abilityMark: string;
}) {
  const progress = totalClues > 0 ? Math.round((totalFound / totalClues) * 100) : 0;
  const unlockName = companion?.name ?? "本章同行";
  const unlockType = companion?.type ?? "伙伴";
  const unlockGift = companion?.gift ?? abilityMark;

  return (
    <section className="quest-collection-contract" aria-label="本章收集契约">
      <header>
        <span>收集契约</span>
        <strong>通关不是只拿 XP，也会把角色和能力收进图鉴</strong>
      </header>
      <div className="quest-collection-grid">
        <article className="quest-collection-unlock">
          {companion?.image ? <img src={companion.image} alt="" /> : null}
          <span>通关收藏</span>
          <strong>
            {unlockType} · {unlockName}
          </strong>
          <p>完成实战证据后，{unlockName} 会带着「{unlockGift}」归队。</p>
        </article>
        <article>
          <span>线索印记</span>
          <strong>
            {totalFound}/{totalClues}
          </strong>
          <p>
            当前地点 {sceneFound}/{sceneTotal}。先把本幕线索收齐，再进入下一幕。
          </p>
          <i aria-hidden="true">
            <b style={{ width: `${progress}%` }} />
          </i>
        </article>
        <article>
          <span>能力印记</span>
          <strong>{abilityMark}</strong>
          <p>这枚印记会变成结案复盘和面试素材，不靠字数或感觉冒充掌握。</p>
        </article>
      </div>
    </section>
  );
}

type SceneDecisionOption = {
  id: string;
  label: string;
  feedback: string;
};

function getSceneDecision(
  scene: QuestScene,
  journey: QuestJourneyItem | undefined,
): { prompt: string; options: SceneDecisionOption[] } {
  const surfaceEvidence = scene.clues[0]?.label ?? "眼前结果";
  const nextProof = journey?.proof ?? "下一份可观察证据";
  const nextTo = journey?.to ?? "下一站";
  return {
    prompt: `线索已经收齐。现在你要怎么处理「${scene.title}」？`,
    options: [
      {
        id: "trust-surface",
        label: `先把「${surfaceEvidence}」当作结果`,
        feedback: `「${surfaceEvidence}」只是表面线索，不是最终结论。它只能说明当前这一棒发生了，下一步还要检查「${nextProof}」。`,
      },
      {
        id: "trace-next",
        label: `沿证据继续追到${nextTo}`,
        feedback: `这个判断更接近真实排障：把当前线索交给「${nextTo}」，再用下一份证据确认它有没有真的发生。`,
      },
    ],
  };
}

function getDecisionEcho(
  scene: QuestScene | null,
  decisionId: string | undefined,
) {
  if (!scene || !decisionId) return null;
  if (decisionId === "trace-next") {
    return {
      title: "你选择继续追证据",
      body: `这一选择会把「${scene.clues.at(-1)?.label ?? scene.title}」交给下一幕，先核对下一份证据，再下结论。`,
    };
  }
  return {
    title: "你先收下了眼前的结果",
    body: `这一选择不会扣分，但留下一个提醒：${scene.clues.at(-1)?.skill ?? scene.goal} 还不能单独证明事情真的完成。`,
  };
}

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

const javaLayeredJourney: QuestJourneyItem[] = [
  {
    sceneId: "java-request-gate",
    from: "客户端",
    to: "Controller",
    payload: "GET /api/users/u-17",
    proof: "请求记录里的 method、path 和 status",
    plain: "客户端只负责发起请求，把地址和参数交给 Controller 入口。",
  },
  {
    sceneId: "java-controller-hall",
    from: "Controller",
    to: "Service",
    payload: "userId + viewerId",
    proof: "Controller 调用 UserService，而不是直接查库",
    plain:
      "Controller 像前台，负责接待和转换，不应该自己决定权限或直接碰数据库。",
  },
  {
    sceneId: "java-service-forge",
    from: "Service",
    to: "Repository",
    payload: "经过权限判断的 userId",
    proof: "viewerId 不匹配时被拒绝",
    plain: "Service 是业务规则所在的中间层，先做判断，再把合法请求交给数据层。",
  },
  {
    sceneId: "java-repository-vault",
    from: "Repository",
    to: "数据库",
    payload: "findById 查询",
    proof: "SQL 查询只证明数据层拿到了记录",
    plain: "Repository 专心把对象和数据库互相转换，不应该偷偷承担权限规则。",
  },
  {
    sceneId: "java-interview-dais",
    from: "证据链",
    to: "面试表达",
    payload: "现象、边界、修复、验证",
    proof: "能复述一条请求经过三层的完整路线",
    plain:
      "工作能力不是背出三层名字，而是能解释每层为什么存在、证据如何证明它真的经过。",
  },
];

const javaLayeredScenes: QuestScene[] = [
  {
    id: "java-request-gate",
    image: questStage,
    portrait: archiveKeeperPortrait,
    place: "请求城门",
    title: "一封请求刚刚抵达",
    speaker: "分层塔守门人",
    dialogue:
      "先别急着打开数据库。每个请求都要先报到入口，只有知道它从哪里来，才知道下一棒该交给谁。",
    goal: "分清客户端发起请求与服务端处理请求的区别。",
    mentor:
      "你现在看到的 GET 不是答案，它只是任务单。接下来要追踪这张任务单经过了哪些角色。",
    terms: [
      {
        term: "Controller",
        meaning: "接收 HTTP 请求、整理参数并返回响应的入口层。",
      },
      {
        term: "HTTP 响应",
        meaning: "服务端处理完请求后回给客户端的状态、数据和错误信息。",
      },
    ],
    clues: [
      {
        id: "java-request-record",
        label: "查看请求任务单",
        action: "打开 network.json",
        result:
          "记录显示 GET /api/users/u-17 返回 200。这能证明请求到达并有响应，不能证明权限规则已经执行。",
        snippet: "客户端 -> GET /api/users/u-17 -> 服务端 -> 200",
        question:
          "先记住：200 只说明这次请求收到了成功响应，不等于每一层都按职责工作。",
        journeyIndex: 0,
        skill: "学会从请求记录确定排查起点。",
      },
      {
        id: "java-request-terms",
        label: "打开名词卡",
        action: "理解 Controller 和响应",
        result:
          "Controller 是服务端的入口，不是数据库。它应该把请求交给业务层，再把结果包装成响应。",
        snippet:
          "请求进入 Controller\nController -> Service\nService -> Repository -> 数据库",
        question: "名词先放回流程里：它是谁、收到什么、交给谁？",
        journeyIndex: 1,
        skill: "把抽象名词放回真实工作流程。",
      },
    ],
  },
  {
    id: "java-controller-hall",
    image: questPortal,
    portrait: apiClerkPortrait,
    place: "Controller 接待厅",
    title: "前台越过了业务门",
    speaker: "接口接待员",
    dialogue:
      "事故记录写着 Controller 直接拿了 Repository。看起来省了一步，实际上把权限检查绕开了。",
    goal: "找出 Controller 直接访问 Repository 为什么危险。",
    mentor: "前台可以收表、验格式、发回信，但不该自己替业务规则盖章。",
    terms: [
      {
        term: "分层",
        meaning: "按职责把入口、业务规则和数据访问分开，降低修改和排查成本。",
      },
      {
        term: "职责边界",
        meaning: "每层应该负责什么，以及明确不应该负责什么。",
      },
    ],
    clues: [
      {
        id: "java-controller-code",
        label: "查看 Controller 代码",
        action: "打开 UserController.java",
        result:
          "代码直接调用 userRepository.findById，完全没有进入 UserService，所以 viewerId 权限判断没有机会执行。",
        snippet:
          "错误路线：Controller -> Repository\n正确路线：Controller -> Service -> Repository",
        question: "直接查库不是“少写代码”，而是跳过了业务规则所在的关卡。",
        journeyIndex: 1,
        skill: "用代码证据指出职责越界。",
      },
      {
        id: "java-controller-log",
        label: "对照服务日志",
        action: "打开 backend.log",
        result:
          "日志明确记录 service=UserService status=SKIPPED。它和代码互相印证：不是猜测，而是能复现的绕路。",
        snippet:
          "controller=UserController repository=findById\nservice=UserService status=SKIPPED",
        question: "代码告诉你怎么走，日志告诉你这次运行真的怎么走。",
        journeyIndex: 2,
        skill: "让静态代码和运行证据互相验证。",
      },
    ],
  },
  {
    id: "java-service-forge",
    image: questWorkbench,
    portrait: briefForgemasterPortrait,
    place: "Service 规则熔炉",
    title: "业务规则必须有人守",
    speaker: "规则锻造师",
    dialogue:
      "同一个查用户动作，查看自己可以通过，查看别人必须拒绝。规则放在 Service，所有入口才有机会共享同一把锁。",
    goal: "理解 Service 为什么要先做业务判断。",
    mentor:
      "把 viewerId 想成来访者，把 userId 想成要查看的档案。先验身份关系，再允许数据层查找。",
    terms: [
      { term: "Service", meaning: "承载业务规则和用例流程的服务层。" },
      {
        term: "权限检查",
        meaning: "判断当前请求者是否有权执行或查看目标资源。",
      },
    ],
    clues: [
      {
        id: "java-service-rule",
        label: "查看权限规则",
        action: "打开 UserService.java",
        result:
          "UserService 会先比较 viewerId 和 userId，不一致就拒绝；通过后才调用 Repository。",
        snippet:
          "if (!viewerId.equals(userId)) reject\nthen repository.findById(userId)",
        question: "规则先于查询，才能保证数据层不会替绕过权限的请求服务。",
        journeyIndex: 2,
        skill: "说清业务规则和数据访问的先后关系。",
      },
      {
        id: "java-service-test",
        label: "预演失败分支",
        action: "用 viewerId 不匹配的情况思考",
        result:
          "如果 Controller 经过 Service，viewerId 不匹配应在 Service 被拒绝，而不是先查到数据再补救。",
        snippet: "viewer=u-02, target=u-17\nexpected: reject before repository",
        question: "真正重要的不只是成功路径，还包括规则应该在哪一层挡住失败。",
        journeyIndex: 3,
        skill: "开始用失败路径验证架构边界。",
      },
    ],
  },
  {
    id: "java-repository-vault",
    image: questArchive,
    portrait: knowledgeKeeperPortrait,
    place: "Repository 档案库",
    title: "查到数据不等于流程正确",
    speaker: "数据档案员",
    dialogue:
      "档案库确实找到了 u-17，但这只能说明最后一棒工作过，不能替前面的权限规则作证。",
    goal: "区分数据库查询证据与完整业务流程证据。",
    mentor: "一行 SQL 结果很有用，但它回答的是“查到了吗”，不是“应该查吗”。",
    terms: [
      {
        term: "Repository",
        meaning: "负责数据访问的层，封装查询和持久化细节。",
      },
      {
        term: "持久化",
        meaning: "把数据写入数据库等长期存储，重启或刷新后仍可读取。",
      },
    ],
    clues: [
      {
        id: "java-database-proof",
        label: "查看数据库查询",
        action: "打开 database-query.txt",
        result:
          "SELECT 返回 1 行，证明 Repository 查到了数据；文件也明确提醒，它不能证明 Service 权限规则执行过。",
        snippet: "Repository -> SELECT -> 1 row\n不能证明：Service 已执行",
        question:
          "证据要回答具体问题：数据存在、权限正确、流程经过，是三件不同的事。",
        journeyIndex: 3,
        skill: "避免把局部成功误判为全链路正确。",
      },
      {
        id: "java-dto-contract",
        label: "看 DTO 回信",
        action: "打开 UserResponse.java",
        result:
          "DTO 只负责把内部 User 转成对外响应格式。它是数据合同，不负责决定谁有权限读取。",
        snippet: "User -> UserResponse(id, displayName) -> HTTP response",
        question: "DTO 是回信格式，不是业务规则的守门人。",
        journeyIndex: 4,
        skill: "分清数据合同和业务规则。",
      },
    ],
  },
  {
    id: "java-interview-dais",
    image: interviewDefenseHallScene,
    portrait: interviewCouncilorPortrait,
    place: "面试答辩台",
    title: "把三层讲成一条能工作的路",
    speaker: "项目答辩官",
    dialogue:
      "现在轮到你复述：请求从哪里来，为什么不能直达数据库，哪份证据证明你修对了？",
    goal: "把流程、职责、证据和面试表达连起来。",
    mentor:
      "面试官不只问你知不知道 Controller，他们会追问：如果换一个入口，权限规则还在吗？",
    terms: [
      {
        term: "可解释能力",
        meaning: "能说明现象、证据、根因、修改和验证，而不是只报一个结论。",
      },
      {
        term: "迁移能力",
        meaning: "换项目或换岗位后，仍能用同一套追流程和找证据的方法。",
      },
    ],
    clues: [
      {
        id: "java-flow-recall",
        label: "复述请求路线",
        action: "用自己的话说清谁把什么交给谁",
        result:
          "完整路线是：客户端发请求，Controller 接收并交给 Service，Service 执行业务判断后交给 Repository，Repository 查询数据库，结果再沿原路返回。",
        snippet:
          "Client -> Controller -> Service -> Repository -> DB -> Response",
        question: "能复述完整路线，才算真正开始理解这座服务塔。",
        journeyIndex: 4,
        skill: "形成可复用的工作流程表达。",
      },
      {
        id: "java-interview-answer",
        label: "写一段面试回答",
        action: "把现象、根因、修复和验证串起来",
        result:
          "可以这样讲：我发现 Controller 绕过 Service 直接查 Repository，导致权限规则没有执行；我用代码和日志确认了绕路，再让 Controller 调 Service，并用不匹配 viewerId 的失败路径验证规则确实生效。",
        snippet: "现象 -> 证据 -> 根因 -> 修复 -> 失败路径复测",
        question: "这比背“Controller-Service-Repository”更接近真实工作和面试。",
        journeyIndex: 4,
        skill: "把技术理解转成面试可讲的证据故事。",
      },
    ],
  },
];

const frontendComponentJourney: QuestJourneyItem[] = [
  {
    sceneId: "frontend-click-stage",
    from: "用户",
    to: "组件事件",
    payload: "点击加载资料",
    proof: "交互记录出现 click",
    plain: "用户只发起动作，不能替请求宣布成功。",
  },
  {
    sceneId: "frontend-state-stage",
    from: "组件事件",
    to: "状态所有者",
    payload: "idle -> loading",
    proof: "按钮和提示进入加载状态",
    plain: "组件用一个状态描述请求现在走到哪一步。",
  },
  {
    sceneId: "frontend-network-stage",
    from: "状态所有者",
    to: "请求结果",
    payload: "GET /api/profile/me",
    proof: "200 或 503 response",
    plain: "只有请求返回，组件才知道该进入 success 还是 error。",
  },
  {
    sceneId: "frontend-render-stage",
    from: "请求结果",
    to: "页面反馈",
    payload: "success/error + data/message",
    proof: "用户能看到正确下一步",
    plain: "渲染是结果的翻译器，不应该把失败伪装成成功。",
  },
];

const frontendRequestStatesJourney: QuestJourneyItem[] =
  frontendComponentJourney.map((item, index) => ({
    ...item,
    from: index === 0 ? "提交动作" : item.from,
    to: index === frontendComponentJourney.length - 1 ? "面试复盘" : item.to,
    payload:
      ["表单数据", "loading 状态", "201 / 503 响应", "可读错误反馈"][index] ??
      item.payload,
    proof:
      [
        "点击记录出现且请求开始",
        "按钮进入 loading 并禁止重复提交",
        "Network 与浏览器日志对齐",
        "用户能看到失败原因和重试动作",
      ][index] ?? item.proof,
    plain:
      [
        "点击只是起点，组件还不能替请求宣布成功。",
        "请求进行时由 loading 保护状态和按钮，避免用户重复提交。",
        "响应状态码和错误体决定页面下一步，而不是点击时间。",
        "最终要把技术结果翻译成用户能理解、能继续行动的反馈。",
      ][index] ?? item.plain,
  }));

function getFrontendRequestStatesScenes(): QuestScene[] {
  return frontendComponentScenes.map((scene, index) => ({
    ...scene,
    id: `request-states-${index}`,
    place: ["表单传送厅", "状态控制台", "响应观测台", "复盘答辩台"][index],
    title: [
      "申请刚刚送出",
      "先把按钮交给 loading",
      "201 和 503 到底带来什么",
      "把错误翻译成下一步",
    ][index],
    dialogue: [
      "用户只按了一次提交。传送厅的灯还不能替请求宣布成功，先确认这份申请真的走上了路。",
      "状态控制台只有一个主人。请求没有回来之前，按钮要保护现场，页面要诚实地说正在等待。",
      "201、400、503 和超时不是一组装饰数字，它们会决定用户下一步是继续、修改还是稍后重试。",
      "现在请你把事故讲清楚：现象、时间顺序、证据、修复和仍然要复测的边界。",
    ][index],
    goal: [
      "区分点击动作和请求结果。",
      "理解 loading 与防重复提交的必要性。",
      "用 Network 和日志区分成功、失败与超时。",
      "把状态机故障讲成工作和面试都能复述的证据故事。",
    ][index],
    mentor: [
      "点击是出发，不是到达。你要追踪它把什么交给请求。",
      "loading 不是让用户干等，而是让系统明确当前还没有结果。",
      "先看返回，再做判断；错误体要告诉用户能不能重试、该改什么。",
      "好的前端修复会让用户知道发生了什么，也让工程师能用证据验收。",
    ][index],
    clues: scene.clues.map((clue, clueIndex) => ({
      ...clue,
      id: `request-states-${index}-${clueIndex}`,
      label: ["看提交记录", "看状态时间线"][clueIndex],
      action: ["打开 Network 请求", "打开浏览器日志"][clueIndex],
      result: [
        "记录显示 POST /api/applications 可能返回 201，也可能返回 503；点击本身不能替请求选择 success。",
        "日志显示 visibleStatus 早于 response=503，说明页面在证据到达前就宣布了成功。",
      ][clueIndex],
      snippet: [
        "click=submit-application -> POST /api/applications",
        "response=503 -> visibleStatus=success (错误)",
      ][clueIndex],
      question: [
        "先记住：提交动作只证明请求开始，不证明服务端接受了申请。",
        "状态必须跟随 response.ok 和错误体变化，不能跟随点击时间变化。",
      ][clueIndex],
      skill: ["找到请求状态的起点", "用时间顺序定位提前成功"][clueIndex],
    })),
  }));
}

const frontendComponentScenes: QuestScene[] = [
  {
    id: "frontend-click-stage",
    image: questStage,
    portrait: portalScribePortrait,
    place: "组件剧场入口",
    title: "按钮刚刚被按下",
    speaker: "状态编舞师",
    dialogue:
      "观众只看到一次点击，真正的戏还没开始。先记住：动作是起点，不是结果。",
    goal: "区分用户动作与请求成功。",
    mentor: "前端问题常常不是按钮坏了，而是页面太早替用户下了结论。",
    terms: [
      { term: "组件", meaning: "负责一块界面和交互的可复用单元。" },
      { term: "事件处理", meaning: "用户点击后，组件执行的那段函数。" },
    ],
    clues: [
      {
        id: "frontend-click-log",
        label: "查看点击记录",
        action: "打开交互记录",
        result: "记录只证明用户触发了 click，还没有证明 GET 请求成功。",
        snippet: "click=load-profile -> request pending",
        question: "点击可以触发请求，但不能直接变成 success。",
        journeyIndex: 0,
        skill: "学会区分动作和结果。",
      },
      {
        id: "frontend-component-term",
        label: "打开组件名词卡",
        action: "理解组件负责什么",
        result:
          "ProfilePanel 负责把状态翻译成页面，不负责替后端证明资料已经加载。",
        snippet: "事件 -> 状态 -> 渲染",
        question: "组件是舞台，不是后台数据库。",
        journeyIndex: 1,
        skill: "把组件放回整个请求流程。",
      },
    ],
  },
  {
    id: "frontend-state-stage",
    image: questWorkbench,
    portrait: briefForgemasterPortrait,
    place: "状态灯控台",
    title: "同一盏灯不该同时说两句话",
    speaker: "状态编舞师",
    dialogue:
      "loading、success、error 是同一条请求的不同幕次。事故现场却在请求还没回来时亮起 success。",
    goal: "理解 state 为什么必须跟着请求结果变化。",
    mentor:
      "把状态想成舞台灯：点击时亮等待灯，收到 200 才亮成功灯，503 就亮错误灯。",
    terms: [
      { term: "state", meaning: "组件记住的会影响界面的数据。" },
      {
        term: "重新渲染",
        meaning: "状态变化后，组件重新计算并更新用户看到的界面。",
      },
    ],
    clues: [
      {
        id: "frontend-code-order",
        label: "查看状态更新顺序",
        action: "打开 ProfilePanel.jsx",
        result:
          "代码先 setStatus('success')，后 await loadProfile；所以失败也会先显示成功。",
        snippet: "setStatus('success')\nawait loadProfile()",
        question: "时间顺序就是根因证据。",
        journeyIndex: 1,
        skill: "从关键行解释页面行为。",
      },
      {
        id: "frontend-state-terms",
        label: "比较三种状态",
        action: "把 loading/success/error 排成顺序",
        result:
          "正确顺序是 idle -> loading -> success 或 error；success 和 error 互斥。",
        snippet: "idle -> loading -> (success | error)",
        question: "状态图比背 API 更能解释页面为什么变化。",
        journeyIndex: 2,
        skill: "用状态机思路理解交互。",
      },
    ],
  },
  {
    id: "frontend-network-stage",
    image: questPortal,
    portrait: apiClerkPortrait,
    place: "Network 回廊",
    title: "200 和 503 把剧情分成两条路",
    speaker: "接口接待员",
    dialogue:
      "同一个按钮可以走成功路，也可以走失败路。真正专业的页面，两条路都要给用户下一步。",
    goal: "把 Network 状态码连接到页面状态。",
    mentor: "response.ok 是请求回信的判断，不是一个自动把资料交给页面的魔法。",
    terms: [
      {
        term: "response.ok",
        meaning: "浏览器根据响应状态码给出的成功/失败判断。",
      },
      {
        term: "错误反馈",
        meaning: "告诉用户发生了什么，以及他接下来能做什么。",
      },
    ],
    clues: [
      {
        id: "frontend-network-result",
        label: "对照 200 与 503",
        action: "查看 Network 记录",
        result:
          "200 可以进入 success 并展示资料；503 必须进入 error，不能沿用 success 文案。",
        snippet: "200 -> success\n503 -> error + 可读提示",
        question: "同一个按钮不是只有成功剧本。",
        journeyIndex: 2,
        skill: "用两条路径设计验收。",
      },
      {
        id: "frontend-browser-log",
        label: "查看浏览器日志",
        action: "对齐 visibleStatus 和 response",
        result:
          "日志显示 visibleStatus=success 早于 response=503，证明页面反馈领先于真实结果。",
        snippet: "visibleStatus=success -> response=503",
        question: "日志把‘感觉不对’变成了时间证据。",
        journeyIndex: 3,
        skill: "用时间顺序定位异步问题。",
      },
    ],
  },
  {
    id: "frontend-render-stage",
    image: deliveryReviewCourtScene,
    portrait: interviewCouncilorPortrait,
    place: "可见反馈舞台",
    title: "让用户知道下一步该做什么",
    speaker: "项目答辩官",
    dialogue:
      "最后请你证明：成功有资料，失败有解释，加载有等待，而且每一条都能从代码和测试追溯回来。",
    goal: "把状态、证据和交付验收连成面试表达。",
    mentor:
      "会做页面只是起点，能解释状态为什么变化、失败如何被看见，才是工程能力。",
    terms: [
      {
        term: "可访问反馈",
        meaning: "让包括使用辅助技术的用户也能感知加载和错误。",
      },
      {
        term: "状态所有者",
        meaning: "真正负责保存并更新某个状态的组件或模块。",
      },
    ],
    clues: [
      {
        id: "frontend-render-contract",
        label: "检查反馈合同",
        action: "确认 loading/success/error 都有对应文案",
        result:
          "状态和文案必须一一对应，错误提示还要通过 aria-live 等方式让用户感知。",
        snippet: "loading -> 等待\nsuccess -> 资料\nerror -> 原因 + 下一步",
        question: "可见反馈是用户理解系统的最后一棒。",
        journeyIndex: 3,
        skill: "把用户体验纳入工程验收。",
      },
      {
        id: "frontend-interview-line",
        label: "写下前端复盘",
        action: "复述状态故障的现象、证据和修复",
        result:
          "可以这样讲：我发现组件在请求返回前就显示成功，用日志确认状态早于 503，随后让状态由 response.ok 驱动，并用成功/失败两条交互测试复测。",
        snippet: "现象 -> 时间证据 -> 状态修复 -> 双路径复测",
        question: "这比说‘我会 React’更接近真实前端工作。",
        journeyIndex: 3,
        skill: "把前端问题讲成可验证的工程故事。",
      },
    ],
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
    sceneId: "cs-product-recap",
    from: "会话档案",
    to: "面试复盘",
    payload: "Brief、方向、取舍和保存证据",
    proof: "能把 AI 点子讲成输入、决策、输出和验证",
    plain: "这一章最后要把产品链路讲清楚，而不是只说 AI 生成了几个点子。",
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
    id: "cs-product-recap",
    image: interviewDefenseHallScene,
    portrait: interviewCouncilorPortrait,
    place: "产品复盘厅",
    title: "把 AI 点子讲成产品链路",
    speaker: "面试策士",
    dialogue:
      "你已经看过 Brief、方向筛选和会话保存。现在要把它们讲成一条能被同事和面试官听懂的产品链路。",
    goal: "把本章产出整理成工作复盘和面试表达。",
    mentor:
      "不要说“我做了一个 AI 生成工具”。要说清楚用户输入是什么、系统如何筛选、为什么取舍、最后用什么证据证明保存下来了。",
    terms: [
      {
        term: "产品链路",
        meaning:
          "从用户目标到系统处理、候选取舍、保存记录和最终输出的一整条工作路线。",
      },
      {
        term: "面试复盘",
        meaning:
          "把问题背景、你的判断、采取的行动、验证结果和反思讲成一段可信经历。",
      },
    ],
    clues: [
      {
        id: "product-chain-story",
        label: "串起产品链路",
        action: "把 Brief、方向、候选和会话保存连成一句话",
        result:
          "CanvasStorm 的价值不是“AI 多生成几个点子”，而是先让用户写清背景，再按方向筛候选，最后把取舍和草案保存下来。",
        snippet:
          "Brief -> direction=mvp -> candidates -> accepted/rejected -> session saved",
        question:
          "面试里要讲链路：输入是什么、怎么决策、输出是什么、证据在哪里。",
        skill: "把 AI 功能从炫技描述转成产品链路表达。",
      },
      {
        id: "proof-to-interview",
        label: "把证据变成复盘",
        action: "把技术证据翻译成 STAR 里的行动和结果",
        result:
          "Network、日志和会话记录不是孤立材料。它们共同证明你能定位“点子空泛”的原因，并用产品取舍和保存证据收束问题。",
        snippet:
          "现象：点子发散\n行动：补 Brief + 方向筛选 + 保存取舍\n结果：执行草案只保留本轮候选",
        question:
          "这章的面试素材不是背 MVP，而是证明你能把 AI 点子变成可执行方案。",
        skill: "把工程证据组织成求职表达。",
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
    image: identityCorridorScene,
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
    image: deliveryReviewCourtScene,
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
    image: apiErrorCourtScene,
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
    image: verificationTrialArenaScene,
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
    image: idempotencyForgeScene,
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
    image: interviewDefenseHallScene,
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

const javaTransactionScenes: QuestScene[] = consistencyScenes.map(
  (scene, index) => {
    const javaSceneDetails = [
      {
        image: idempotencyForgeScene,
        portraitOverride: apiClerkPortrait,
        place: "订单锻造台",
        speaker: "订单值守官",
        dialogue:
          "值守官把同一张订单草稿摊开三份：客户只点了一次，服务台却收到了三次请求。她把笔递给你：先沿着请求证据找到重复从哪里进来。",
      },
      {
        image: identityCorridorScene,
        portraitOverride: identityGuardPortrait,
        place: "幂等门廊",
        speaker: "幂等门卫",
        dialogue:
          "门卫举起一枚 Idempotency-Key：请求可以重来，但同一张取货牌只能对应同一张订单。你要找出这张牌如何从 Controller 传到业务层。",
      },
      {
        image: deliveryReviewCourtScene,
        portraitOverride: deliveryJudgePortrait,
        place: "唯一索引审查庭",
        speaker: "数据审查官",
        dialogue:
          "审查官没有被前端的 loading 说服。她把唯一索引和事务边界放到案台上：并发请求同时通过时，最后一道裁决必须来自数据库。",
      },
      {
        image: verificationTrialArenaScene,
        portraitOverride: testArbiterPortrait,
        place: "事务回滚试炼场",
        speaker: "回滚试炼官",
        dialogue:
          "试炼官故意让订单写入进行到一半再失败。你要判断哪些动作必须一起成功，哪些证据能证明失败后没有留下半条订单。",
      },
      {
        image: interviewDefenseHallScene,
        portraitOverride: interviewCouncilorPortrait,
        place: "订单答辩厅",
        speaker: "工程答辩官",
        dialogue:
          "答辩官把三次请求、同一个 key 和数据库 count 摆成一条证据链：不要只说“加了防抖”，要说清系统如何在工作压力下保持一条记录。",
      },
    ][index];
    return javaSceneDetails ? { ...scene, ...javaSceneDetails } : scene;
  },
);

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
    image: performanceObservatoryScene,
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
          "用户说“页面慢”还不够。要写成可排查现象：首次打开白屏久、点击筛选慢、列表出现慢，还是滚动时明显卡顿。",
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
          "后端日志或 Server-Timing 显示 projects query 用了 1450ms，就能把浏览器 TTFB 和数据库查询慢连成同一条证据链。",
        snippet:
          "Network TTFB: 1600ms\nServer-Timing: db;dur=1450\nLog: projects query ms=1450\n=> 主要慢在数据库查询",
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
    image: releaseReadinessGateScene,
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
          "可信的性能结论要有数字：优化前列表接口 1800ms，缓存命中后 120ms；X-Cache 从 MISS 变成 HIT；新增项目后缓存失效，列表仍正确。",
        snippet:
          "优化前：GET /api/projects 1800ms, X-Cache: MISS\n优化后：120ms, X-Cache: HIT\n回归：新增项目后列表刷新可见",
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

const frontendPerformanceScenes: QuestScene[] = performanceScenes.map(
  (scene, index) => {
    const frontendSceneDetails = [
      {
        image: morningStarTimingHarborScene,
        portraitOverride: timingNavigatorPortrait,
        place: "首屏计时港",
        speaker: "时序领航员",
        dialogue:
          "领航员把首屏加载拆成一串时间刻度：资源下载、接口等待和页面渲染不是同一件事。先找出哪一棒真的在拖慢用户。",
      },
      {
        image: performanceObservatoryScene,
        portraitOverride: portalScribePortrait,
        place: "浏览器瀑布观测台",
        speaker: "网络观测员",
        dialogue:
          "观测员展开 Network 瀑布图：每条资源都是一笔时间账。你要把最长的等待和页面上的具体体验对应起来。",
      },
      {
        image: apiErrorCourtScene,
        portraitOverride: apiClerkPortrait,
        place: "接口时钟塔",
        speaker: "接口计时官",
        dialogue:
          "计时官把 TTFB 和服务端日志对齐：如果浏览器一直等后端开口，就不能把锅甩给渲染层。证据要能对上同一个请求。",
      },
      {
        image: deliveryReviewCourtScene,
        portraitOverride: deliveryJudgePortrait,
        place: "渲染舞台审查席",
        speaker: "渲染审查官",
        dialogue:
          "审查官让你观察接口已经很快、页面却仍然卡顿的现场。数据到达后还要经过组件更新和绘制，性能问题可能发生在最后一棒。",
      },
      {
        image: verificationTrialArenaScene,
        portraitOverride: testArbiterPortrait,
        place: "性能回归试炼场",
        speaker: "回归试炼官",
        dialogue:
          "试炼官不接受“感觉快了”。你要用优化前后数据、功能结果和移动端复测证明：页面更快了，而且没有因为缓存或拆分而变错。",
      },
    ][index];
    return frontendSceneDetails ? { ...scene, ...frontendSceneDetails } : scene;
  },
);

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
    image: modelKeyForgeScene,
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
    image: verificationTrialArenaScene,
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
    image: hallucinationMirrorScene,
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
    portrait: archiveKeeperPortrait,
    place: "随案资料库",
    title: "没有资料袋，镜子只能靠记忆猜",
    speaker: "资料袋管理员",
    dialogue:
      "资料袋管理员把几页资料装进银色袋子，每页都刻着编号。她说：AI 可以聪明，但产品不能让它凭空替公司发言。",
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
    image: interviewDefenseHallScene,
    portrait: releaseGatekeeperPortrait,
    place: "拒答工坊",
    title: "承认不知道，是保护用户的护盾",
    speaker: "拒答守门人",
    dialogue:
      "最后一面镜子故意没有放入任何资料。它沉默片刻，给出“资料不足”。拒答守门人微笑：这不是失败，这是系统学会了诚实。",
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
    image: ragKnowledgeMazeScene,
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
    image: deliveryReviewCourtScene,
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
    image: agentToolContractHallScene,
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
    portrait: portalScribePortrait,
    place: "参数契约厅",
    title: "申请表填错，钥匙不能出鞘",
    speaker: "参数抄写员",
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
    portrait: identityGuardPortrait,
    place: "权限门禁",
    title: "参数合法，也不代表你有权开门",
    speaker: "权限守卫",
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
    image: verificationTrialArenaScene,
    portrait: echoForensicsPortrait,
    place: "回退与审计台",
    title: "工具失败时，副官要交回可读报告",
    speaker: "审计取证官",
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

function rewriteQuestContent<T>(
  value: T,
  replacements: Array<[string, string]>,
): T {
  if (typeof value === "string") {
    let rewritten: string = value;
    for (const [from, to] of replacements) {
      rewritten = rewritten.replaceAll(from, to);
    }
    return rewritten as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => rewriteQuestContent(item, replacements)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        rewriteQuestContent(item, replacements),
      ]),
    ) as T;
  }

  return value;
}

const frontendTestingCopyReplacements: Array<[string, string]> = [
  ["POST 后再 GET / 查询数据库", "筛选交互 → 可见列表 / 报告指纹"],
  [
    "集成测试守交接：接口、数据层、数据库之间是不是真的把东西传过去了。",
    "集成测试守交接：用户动作、组件状态、接口响应和可见列表是不是同一条路径。",
  ],
  ["验收试炼场", "前端回归试炼场"],
  ["验收试炼官", "测试仲裁官"],
  ["保存成功，刷新后却空无一物", "筛选条件切换后，列表状态和报告不一致"],
  ["保存消失", "筛选错乱"],
  [
    "测试先执行 POST 保存，再执行 GET 读取。旧故障下 GET 返回空数组，测试失败；修复后 GET 能读到刚保存的记录。",
    "测试先选择筛选条件，再读取可见列表和报告指纹。旧故障下列表状态错乱，测试失败；修复后同一条用户路径能得到稳定结果。",
  ],
  [
    "await postJson('/api/canvases', draft)\nconst list = await getJson('/api/canvases')\nassert.equal(list.length, 1)",
    "await applyFilter({ status: 'blocked' })\nconst rows = readVisibleRows()\nassert.deepEqual(rows.map(row => row.status), ['blocked'])",
  ],
  ["保存后刷新仍存在", "筛选后列表仍匹配"],
  [
    "例如 buildCanvasPayload(draft) 应该保留 title 和 nodes。这里不用启动整个页面，只验证这个函数自己的职责。",
    "例如 buildFilterState(filters) 应该保留 keyword、status 和 sort。这里不用启动整个页面，只验证这个函数自己的职责。",
  ],
  [
    "const payload = buildCanvasPayload(draft)\nassert.equal(payload.title, draft.title)\nassert.deepEqual(payload.nodes, draft.nodes)",
    "const state = buildFilterState(filters)\nassert.equal(state.status, filters.status)\nassert.equal(state.sort, filters.sort)",
  ],
  ["空标题或空节点会怎样", "未知状态或空结果会怎样"],
  [
    "边界用例能防止只测最顺的路径。比如 title 为空时应该报错，nodes 为空时是否允许，要写清楚预期。",
    "边界用例能防止只测最顺的路径。比如 status 是未知值时要回到全部列表，筛选结果为空时也要显示清楚的空状态。",
  ],
  [
    "draft.title = ''\nexpect(() => buildCanvasPayload(draft)).toThrow('title required')",
    "filters.status = 'unknown'\nexpect(buildFilterState(filters).status).toBe('all')",
  ],
  [
    "POST 交出去的东西，GET 或数据库能不能再找回来",
    "用户点出的筛选条件，列表和报告能不能一起对上",
  ],
  [
    "理解集成测试如何证明前端、接口、数据层和数据库协作。",
    "理解集成测试如何证明用户操作、组件状态、接口响应和可见结果协作。",
  ],
  [
    "当问题发生在交接处，单元测试不够。要用接口请求、数据库查询或 Network 证明链路真的接上。",
    "当问题发生在交互路径上，单元测试不够。要用用户事件、DOM 结果、Network 和报告指纹证明路径真的接上。",
  ],
  [
    "测试多个模块一起工作时是否完成业务目标，例如接口调用数据层并返回正确结果。",
    "测试多个模块一起工作时是否完成业务目标，例如用户筛选后组件、请求和列表结果保持一致。",
  ],
  ["验证 POST 到 GET", "验证筛选到列表"],
  ["保存后立刻读取", "筛选后立刻复核"],
  [
    "POST /api/canvases 返回 201 只能说明接口回应成功；再 GET 到同一条记录，才说明数据真的进入可读取链路。",
    "筛选按钮点亮只能说明交互触发了；DOM 列表、Network 响应和报告指纹一致，才说明用户路径真的修好。",
  ],
  [
    "POST /api/canvases -> 201 Created\nGET /api/canvases -> [{ title: '试炼草稿' }]",
    "选择 status=blocked -> 列表只剩 blocked\n报告 sourceHash -> 当前源码指纹匹配",
  ],
  [
    "这就是你之前卡住的点：201 是一枚印章，GET/数据库证据才证明档案真的入库。",
    "这就是前端回归最容易漏的点：按钮变色不是证据，可见列表、Network 和报告指纹对齐才是证据。",
  ],
  ["核对数据库证据", "核对 DOM 与报告证据"],
  ["查询记录数量", "核对可见行和源码指纹"],
  [
    "如果数据库 SELECT count(*) 是 1，就能反证“只是内存里看起来成功”。验收要能说清每个证据能证明什么。",
    "如果 DOM 可见行和报告 sourceHash 都对上，就能反证“只是本地状态看起来成功”。验收要能说清每个证据能证明什么。",
  ],
  [
    "SELECT count(*) FROM canvases WHERE title = '试炼草稿'\n结果：1",
    "visibleRows.every(row => row.status === 'blocked')\nreport.sourceHash === currentSourceHash",
  ],
  [
    "测试和数据库证据一起出现时，Agent 的交付才更容易被信任。",
    "DOM、Network 和报告证据一起出现时，Agent 的交付才更容易被信任。",
  ],
  ["数据库证据", "DOM 与报告证据"],
  ["接口、数据层、数据库", "用户事件、组件状态、接口响应和 DOM"],
  ["sourceFingerprint", "sourceHash"],
  ["请修复保存刷新后丢失", "请修复筛选 blocked 后仍混入 done 任务"],
  ["和DOM", "和 DOM"],
];

const frontendTestingJourney: QuestJourneyItem[] = rewriteQuestContent(
  testingProofJourney,
  frontendTestingCopyReplacements,
);

const testingProofScenes: QuestScene[] = [
  {
    id: "test-oath-gate",
    image: verificationTrialArenaScene,
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
    portrait: portalScribePortrait,
    place: "单元符文室",
    title: "单元测试守住一个齿轮",
    speaker: "单元符文师",
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
    portrait: apiClerkPortrait,
    place: "集成竞技场",
    title: "模块交接时，证据不能掉在半路",
    speaker: "接口接力官",
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
    image: deliveryReviewCourtScene,
    portrait: deliveryJudgePortrait,
    place: "验收档案馆",
    title: "报告要能复核，也要敢写未覆盖风险",
    speaker: "证据档案官",
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
    image: agentBriefForgeScene,
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
    portrait: modelWardenPortrait,
    place: "目标铁砧",
    title: "目标要能落锤，不能只是一团愿望",
    speaker: "目标校准官",
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
    portrait: identityGuardPortrait,
    place: "约束符文台",
    title: "护栏刻清楚，Agent 才不会越界",
    speaker: "边界守卫",
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
    image: deliveryReviewCourtScene,
    portrait: testArbiterPortrait,
    place: "契约封印室",
    title: "验收和风险，是委托书最后的封印",
    speaker: "验收契约官",
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
    image: deliveryReviewCourtScene,
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
          "合格交付不能只写“已完成”。它至少要写：本次改了哪一章；跑过哪条 verify；桌面和 390px 走了哪条路径；旧章节、刷新恢复和真人学习效果还存在哪些回归风险与边界。",
        snippet:
          "摘要：第 13-15 章已接入独立场景。\n验证：npm run verify；三章桌面 + 390px 浏览器路径。\n回归风险：真人学习效果未验；共用教学桥需回归旧章节。",
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
    portrait: mirrorEditorPortrait,
    place: "Diff 证物室",
    title: "口供要和现场照片对得上",
    speaker: "Diff 取证师",
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
    portrait: testArbiterPortrait,
    place: "回归风险回廊",
    title: "新门开了，旧门也不能塌",
    speaker: "回归审查官",
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
    image: verificationTrialArenaScene,
    portrait: interviewCouncilorPortrait,
    place: "接收裁决台",
    title: "接收也要写理由，拒收也要给路径",
    speaker: "接收裁决官",
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
          "如果代码已经接入第 13-15 章，HANDOFF、任务表和 changelog 也要写明：15 章都有剧情与实战 Lab；真人学习效果和 Java/前端路线仍是边界。",
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
    image: releaseReadinessGateScene,
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
    portrait: modelWardenPortrait,
    place: "配置钥匙库",
    title: "本地有钥匙，不代表线上也有",
    speaker: "配置调度官",
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
    portrait: archiveKeeperPortrait,
    place: "备份档案库",
    title: "代码能退，数据不一定会自己回来",
    speaker: "恢复审查官",
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
    portrait: testArbiterPortrait,
    place: "监控哨塔",
    title: "上线后，真正的夜巡才开始",
    speaker: "健康检查官",
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
    image: interviewDefenseHallScene,
    portrait: deliveryJudgePortrait,
    place: "回滚机关室",
    title: "退路不是丢脸，是专业",
    speaker: "回滚裁决官",
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

const javaCacheJourney: QuestJourneyItem[] = [
  {
    sceneId: "cache-miss-dock",
    from: "用户请求",
    to: "缓存门",
    payload: "GET /api/projects?id=42",
    proof: "日志显示命中还是未命中",
    plain: "先确认请求有没有找到缓存。没有命中时，才应该继续向数据库取资料。",
  },
  {
    sceneId: "cache-key-atlas",
    from: "请求参数",
    to: "缓存 key",
    payload: "用户、租户、版本组成的 key",
    proof: "相同请求命中同一份数据，不同用户不串数据",
    plain:
      "缓存 key 就像档案柜标签。标签少了，可能拿错资料；标签乱了，缓存永远命不中。",
  },
  {
    sceneId: "cache-stale-mirror",
    from: "数据库更新",
    to: "旧缓存",
    payload: "更新事件和失效策略",
    proof: "更新后不会继续读到旧版本",
    plain:
      "缓存快，但它可能记住昨天的答案。更新数据时，要告诉缓存哪一格需要失效。",
  },
  {
    sceneId: "cache-fallback-lantern",
    from: "缓存/数据库异常",
    to: "用户反馈",
    payload: "降级、超时和可重试错误",
    proof: "故障时不泄露内部细节，用户仍知道下一步",
    plain:
      "缓存不是系统的唯一生命线。它坏了时，服务要有边界清楚的降级和可观察错误。",
  },
  {
    sceneId: "cache-proof-observatory",
    from: "日志与指标",
    to: "面试复盘",
    payload: "命中率、耗时、旧数据复测",
    proof: "优化前后可比较，数据正确性没有被牺牲",
    plain: "最后要同时证明变快了、没串数据、没读旧数据，而且异常时能定位。",
  },
];

const javaCacheScenes: QuestScene[] = [
  {
    id: "cache-miss-dock",
    image: performanceObservatoryScene,
    portrait: timingNavigatorPortrait,
    place: "缓存潮汐码头",
    title: "先看货架有没有这份资料",
    speaker: "缓存巡航员",
    dialogue:
      "码头的请求船一艘接一艘靠岸。巡航员没有直接打开数据库仓库，而是先指向前方货架：先查这一船有没有命中缓存。",
    goal: "理解 cache hit、cache miss 和数据库查询的先后关系。",
    mentor: "缓存排查的第一步不是背 Redis 命令，而是确认请求到底走了哪条路。",
    terms: [
      {
        term: "缓存命中",
        meaning:
          "请求需要的数据已经在缓存里，可以直接返回，通常比查数据库更快。",
      },
      {
        term: "缓存未命中",
        meaning:
          "缓存没有这份数据，需要继续查数据库或其他来源，再决定是否回填缓存。",
      },
    ],
    clues: [
      {
        id: "cache-path",
        label: "追踪请求路线",
        action: "查看一次 GET 的日志",
        result:
          "日志显示 cache miss -> database query -> cache set。说明这次请求没有命中缓存。",
        snippet: "GET /api/projects/42\ncache=miss\nDB SELECT ...\ncache=set",
        question: "先区分命中和未命中，才能知道慢在哪里。",
        journeyIndex: 0,
        skill: "能从日志判断请求是否命中缓存。",
      },
      {
        id: "cache-hit",
        label: "对比第二次请求",
        action: "重复请求同一个项目",
        result: "第二次显示 cache hit，直接返回缓存值，没有再次查询数据库。",
        snippet: "第一次：miss -> DB -> set\n第二次：hit -> return",
        question: "同一个请求第二次更快，不代表所有请求都该无脑缓存。",
        journeyIndex: 0,
        skill: "能解释缓存命中带来的路径变化。",
      },
    ],
  },
  {
    id: "cache-key-atlas",
    image: memoryEchoGalleryScene,
    portrait: archiveKeeperPortrait,
    place: "缓存标签星图室",
    title: "标签少一格，资料就可能串门",
    speaker: "档案库守匠",
    dialogue:
      "星图室里有两位用户的同名项目。守匠把标签拆开：用户、租户和版本都要进 key，不能因为名字一样就把别人的资料递过来。",
    goal: "理解缓存 key 的组成和数据隔离。",
    mentor:
      "缓存 key 是数据边界的一部分。它写得不完整，性能问题会升级成权限和正确性问题。",
    terms: [
      {
        term: "缓存 key",
        meaning: "缓存中定位一份数据的唯一标签，通常由业务身份和版本信息组成。",
      },
      {
        term: "数据串租户",
        meaning:
          "不同用户或租户因为 key 设计错误，读到了不属于自己的缓存数据。",
      },
    ],
    clues: [
      {
        id: "key-shape",
        label: "拆开 key 标签",
        action: "比较两个用户的缓存 key",
        result:
          "project:42 只含项目 id，可能让不同租户读到同一份缓存；project:tenant-a:user-7:42 才包含边界。",
        snippet: "危险：project:42\n更完整：project:tenant-a:user-7:v3:42",
        question: "缓存快不等于正确，先问标签能不能区分数据归属。",
        journeyIndex: 1,
        skill: "能检查缓存 key 是否包含必要边界。",
      },
      {
        id: "key-version",
        label: "看版本标签",
        action: "更新数据后比较旧新 key",
        result:
          "版本或失效策略能帮助系统区分旧快照与当前数据，避免长期命中旧值。",
        snippet: "project:42:v2 -> update -> project:42:v3",
        question: "版本不是装饰，它是旧数据治理的一种办法。",
        journeyIndex: 1,
        skill: "知道缓存版本与旧数据的关系。",
      },
    ],
  },
  {
    id: "cache-stale-mirror",
    image: questPortal,
    portrait: apiClerkPortrait,
    place: "旧影镜廊",
    title: "资料改了，镜子也要知道",
    speaker: "接口接待员",
    dialogue:
      "项目名称已经改成新版本，镜廊里的倒影却还显示旧名字。接待员指向更新链路：写数据库只是第一步，还要处理缓存。",
    goal: "理解缓存失效、回填和一致性之间的关系。",
    mentor:
      "不要笼统说‘缓存导致脏数据’。要说清楚哪个写操作没有让哪一个 key 失效。",
    terms: [
      {
        term: "缓存失效",
        meaning: "让某个缓存条目不再被当作当前答案，下一次请求重新取真实数据。",
      },
      { term: "脏数据", meaning: "缓存里的值已经和真实数据源不一致。" },
    ],
    clues: [
      {
        id: "stale-log",
        label: "比对前后版本",
        action: "查看更新日志和读取日志",
        result:
          "数据库已经是 v3，但读取仍命中 v2，说明更新链路没有正确处理缓存。",
        snippet: "DB version=v3\ncache hit version=v2",
        question: "证据要把‘旧’具体到版本，不要只写感觉过期。",
        journeyIndex: 2,
        skill: "能用版本证据识别脏缓存。",
      },
      {
        id: "invalidate",
        label: "找到失效动作",
        action: "查看写入后的缓存处理",
        result: "更新成功后删除或刷新对应 key，下一次读取才会从数据库拿到 v3。",
        snippet:
          "UPDATE project\nDEL project:tenant-a:user-7:42\nnext GET -> DB v3",
        question: "失效动作要和写入的业务边界对应。",
        journeyIndex: 2,
        skill: "能解释写入与缓存失效的交接。",
      },
    ],
  },
  {
    id: "cache-fallback-lantern",
    image: questArchive,
    portrait: modelWardenPortrait,
    place: "降级灯塔",
    title: "缓存坏了，服务不能一起沉船",
    speaker: "模型守门人",
    dialogue:
      "缓存潮突然退去，灯塔上的巡航员没有把内部异常甩给用户，而是切到受控降级：查数据库、限制重试，并留下可追踪的错误编号。",
    goal: "理解缓存故障时的降级、超时和错误边界。",
    mentor:
      "降级不是吞掉异常。它要让用户得到可行动反馈，让工程师能用日志找到真实原因。",
    terms: [
      {
        term: "降级",
        meaning: "依赖不可用时，使用较慢但可接受的路径或有限功能维持服务。",
      },
      {
        term: "超时",
        meaning: "等待超过可接受时间后主动结束，避免请求无限占用资源。",
      },
    ],
    clues: [
      {
        id: "cache-timeout",
        label: "观察缓存超时",
        action: "查看一次缓存服务不可用请求",
        result:
          "缓存连接超时后走受控数据库回源，没有把 Redis 地址和堆栈直接展示给用户。",
        snippet: "cache timeout 800ms\nfallback=database\nrequestId=req_42",
        question: "用户看到的是可理解的提示，工程师通过 requestId 查详细日志。",
        journeyIndex: 3,
        skill: "能说清缓存故障的用户边界与日志边界。",
      },
      {
        id: "retry-limit",
        label: "检查重试次数",
        action: "查看失败时是否无限重试",
        result:
          "有限重试或快速失败能保护线程和数据库，避免缓存故障放大成全站故障。",
        snippet: "cache retry: 1\nfallback: database\nno infinite loop",
        question: "重试不是越多越可靠，必须有上限和替代路径。",
        journeyIndex: 3,
        skill: "能识别无上限重试的风险。",
      },
    ],
  },
  {
    id: "cache-proof-observatory",
    image: releaseReadinessGateScene,
    portrait: interviewCouncilorPortrait,
    place: "命中率观测台",
    title: "快了，也要证明没有变错",
    speaker: "项目答辩官",
    dialogue:
      "观测台把三条曲线叠在一起：命中率、接口耗时和旧版本读取。答辩官说：只报一个‘变快了’不算结案。",
    goal: "把缓存优化整理成可验收、可复盘的工程证据。",
    mentor:
      "面试和工作里都要同时回答三件事：快了多少、数据对不对、缓存坏了怎么办。",
    terms: [
      {
        term: "命中率",
        meaning:
          "请求中直接从缓存拿到结果的比例，用来判断缓存是否真的发挥作用。",
      },
      {
        term: "可观测性",
        meaning:
          "通过日志、指标和追踪知道系统正在发生什么，而不是只凭体感猜测。",
      },
    ],
    clues: [
      {
        id: "hit-metric",
        label: "读取命中率曲线",
        action: "比较优化前后指标",
        result:
          "命中率上升且数据库压力下降，但还要结合错误率和数据版本一起判断。",
        snippet: "before hit=18%, p95=920ms\nafter hit=84%, p95=180ms",
        question: "命中率是证据之一，不是唯一成功标准。",
        journeyIndex: 4,
        skill: "能用命中率与耗时共同评价缓存。",
      },
      {
        id: "cache-interview",
        label: "写下复盘答案",
        action: "用现象、证据、修复、复测讲一遍",
        result:
          "完整回答应包含 miss/hit、key 边界、失效、降级和复测，而不是只说‘用了 Redis’。",
        snippet: "现象 -> 命中/旧值证据 -> key/失效修复 -> 指标与正确性复测",
        question: "这就是能带进面试的缓存故事。",
        journeyIndex: 4,
        skill: "能把缓存问题讲成可验证的项目复盘。",
      },
    ],
  },
];

const accessibilityJourney: QuestJourneyItem[] = [
  {
    sceneId: "accessibility-contrast",
    from: "页面内容",
    to: "视觉与听觉提示",
    payload: "标题、颜色、错误信息",
    proof: "不同用户都能找到当前状态",
    plain: "可访问性不是额外装饰，而是让更多人能完成同一个任务。",
  },
  {
    sceneId: "accessibility-keyboard",
    from: "键盘用户",
    to: "焦点路线",
    payload: "Tab 顺序、焦点样式、跳过链接",
    proof: "不用鼠标也能走完核心流程",
    plain: "如果按钮藏在鼠标 hover 里，键盘用户就像被关在门外。",
  },
  {
    sceneId: "accessibility-semantic",
    from: "HTML 结构",
    to: "辅助技术",
    payload: "标题、label、button、landmark",
    proof: "读屏器能理解页面结构",
    plain: "语义标签是给辅助技术的路标，不只是代码风格。",
  },
  {
    sceneId: "accessibility-live",
    from: "异步请求",
    to: "用户反馈",
    payload: "loading、错误和成功状态",
    proof: "状态变化会被及时感知",
    plain: "页面变化如果只靠颜色和动画，很多人根本收不到这条消息。",
  },
  {
    sceneId: "accessibility-proof",
    from: "修复改动",
    to: "交付验收",
    payload: "键盘、读屏、对比度和回归测试",
    proof: "功能可用且没有破坏原有路径",
    plain: "最后要证明不是加了一个 aria-label 就结束，而是关键路径真的可用。",
  },
];

const accessibilityScenes: QuestScene[] = [
  {
    id: "accessibility-contrast",
    image: identityCorridorScene,
    portrait: identityGuardPortrait,
    place: "可见性灯廊",
    title: "每个人都要看见这扇门",
    speaker: "身份守卫",
    dialogue:
      "灯廊里有一扇只用浅灰文字标记的门。身份守卫把灯调亮：颜色、文字和焦点都要一起告诉用户门在哪里。",
    goal: "理解可访问性首先是让信息和状态可感知。",
    mentor:
      "不要从规范名词开始。先问：用户能不能看见、听见、找到、理解这一步？",
    terms: [
      {
        term: "对比度",
        meaning: "文字与背景之间的明暗差异，差异太小会让很多用户难以阅读。",
      },
      {
        term: "可感知",
        meaning: "信息能通过不止一种方式被用户获取，例如文字不只依赖颜色。",
      },
    ],
    clues: [
      {
        id: "contrast-check",
        label: "检查文字对比",
        action: "比较正文、按钮和背景",
        result: "低对比度文字即使功能正确，也会让用户找不到重点。",
        snippet: "错误：只用红色表示失败\n修复：红色 + ‘保存失败’文字",
        question: "状态不能只靠颜色表达。",
        journeyIndex: 0,
        skill: "能发现只靠颜色传递信息的问题。",
      },
      {
        id: "focus-visible",
        label: "点亮当前焦点",
        action: "用键盘移动焦点",
        result: "焦点必须有清晰可见的轮廓，用户才知道下一次 Enter 会作用在哪。",
        snippet: "Tab -> focus visible -> Enter",
        question: "看得见焦点，才谈得上能操作。",
        journeyIndex: 0,
        skill: "能检查键盘焦点是否可见。",
      },
    ],
  },
  {
    id: "accessibility-keyboard",
    image: questStage,
    portrait: portalScribePortrait,
    place: "键盘桥",
    title: "不用鼠标，也要走完这条路",
    speaker: "传送门抄写员",
    dialogue:
      "鼠标被收进工具箱，桥上的按钮一个个亮起。抄写员说：Tab 顺序不是随机散步，它应该和任务阅读顺序一致。",
    goal: "理解键盘可操作性、焦点顺序和跳过重复导航。",
    mentor:
      "验收时把鼠标放开，能否打开菜单、填写表单、提交和看到结果？这比口头说支持键盘可靠。",
    terms: [
      {
        term: "焦点顺序",
        meaning: "键盘按 Tab 移动时，控件获得焦点的先后顺序。",
      },
      {
        term: "跳过链接",
        meaning: "让键盘用户跳过重复导航，直接到达页面主要内容的链接。",
      },
    ],
    clues: [
      {
        id: "tab-route",
        label: "走一遍 Tab 路线",
        action: "只用键盘进入主任务",
        result:
          "焦点应从导航进入主内容，再到当前操作，不应跳到不可见或已经离开的元素。",
        snippet:
          "Tab: nav -> main -> quest action\n不能：hidden dialog -> address bar",
        question: "键盘路径要服务任务顺序。",
        journeyIndex: 1,
        skill: "能用键盘发现焦点顺序问题。",
      },
      {
        id: "button-semantics",
        label: "检查操作控件",
        action: "区分链接和按钮",
        result:
          "改变页面状态用 button，跳转页面用 a。语义正确后，键盘和读屏器才更容易理解。",
        snippet: "错误：div onClick\n更清楚：button type=button",
        question: "语义不是形式，它决定浏览器提供什么默认能力。",
        journeyIndex: 1,
        skill: "能选择合适的交互语义。",
      },
    ],
  },
  {
    id: "accessibility-semantic",
    image: questWorkbench,
    portrait: archiveKeeperPortrait,
    place: "语义档案馆",
    title: "给页面画一张读得懂的地图",
    speaker: "档案库守匠",
    dialogue:
      "档案馆里没有视觉标题，却有一堆大小一样的方框。守匠重新挂上 h1、h2、label 和 landmark：结构先被理解，内容才有入口。",
    goal: "理解语义 HTML 如何帮助读屏器和所有用户理解页面层级。",
    mentor:
      "先把页面当成目录：主标题、章节、表单标签和操作名称都要能被准确找到。",
    terms: [
      {
        term: "语义 HTML",
        meaning:
          "使用表达含义的元素，例如 button、nav、main、label，而不是全部用 div。",
      },
      {
        term: "landmark",
        meaning: "页面中的导航地标，例如 main、nav、header，帮助用户快速跳转。",
      },
    ],
    clues: [
      {
        id: "heading-map",
        label: "查看标题树",
        action: "检查页面标题层级",
        result:
          "标题层级能让用户快速定位当前关卡和任务，不应只靠字号大小模拟。",
        snippet: "h1 章节名\n  h2 当前任务\n  h2 证据说明",
        question: "标题是页面地图，不只是大号文字。",
        journeyIndex: 2,
        skill: "能检查页面标题结构。",
      },
      {
        id: "form-label",
        label: "给输入框找名字",
        action: "检查 label 与 input 的关联",
        result: "输入框有明确 label，读屏器和点击文字都能定位到正确控件。",
        snippet: "label htmlFor=task\ninput id=task",
        question: "用户知道要填什么，系统也知道这个输入是什么。",
        journeyIndex: 2,
        skill: "能检查表单控件是否有可理解名称。",
      },
    ],
  },
  {
    id: "accessibility-live",
    image: apiErrorCourtScene,
    portrait: apiClerkPortrait,
    place: "状态回声庭",
    title: "页面变了，要让人收到消息",
    speaker: "接口接待员",
    dialogue:
      "请求失败时，页面只变成一块红色。接待员敲响回声钟：状态变化要有文字、焦点和适合的 live region，不能让用户猜。",
    goal: "理解异步 loading、错误和成功反馈的可访问表达。",
    mentor:
      "用户不一定看得到动画，也不一定听得到颜色。把发生了什么和下一步写出来。",
    terms: [
      {
        term: "aria-live",
        meaning: "告诉辅助技术某块内容更新后需要被播报的机制。",
      },
      {
        term: "错误关联",
        meaning: "把错误说明和对应输入或操作明确关联，让用户知道哪里需要处理。",
      },
    ],
    clues: [
      {
        id: "live-status",
        label: "听见状态变化",
        action: "观察 loading 与成功/失败提示",
        result: "状态变化有可读文本，并通过合适的 live region 告知辅助技术。",
        snippet: "loading -> ‘正在保存’\nerror -> ‘保存失败，请重试’",
        question: "不要只让图标旋转，要把状态说出来。",
        journeyIndex: 3,
        skill: "能设计异步状态的可访问反馈。",
      },
      {
        id: "error-focus",
        label: "把焦点带到错误",
        action: "提交无效表单后观察焦点",
        result: "错误发生后，焦点或错误关联能帮助用户快速回到需要修正的位置。",
        snippet: "submit -> error summary -> focus first invalid field",
        question: "失败之后也要给用户一条回去的路。",
        journeyIndex: 3,
        skill: "能检查错误后的恢复路径。",
      },
    ],
  },
  {
    id: "accessibility-proof",
    image: verificationTrialArenaScene,
    portrait: testArbiterPortrait,
    place: "无障碍验收台",
    title: "不是加一个标签就算交付",
    speaker: "验收试炼官",
    dialogue:
      "试炼官把键盘、读屏器、对比度检查和原有测试排成四列：每一列都通过，才说明这条路真的能交给用户。",
    goal: "形成可复核的无障碍交付证据和面试复盘。",
    mentor:
      "自动化工具能抓一部分问题，但关键流程仍要人工走一遍，并记录未覆盖边界。",
    terms: [
      {
        term: "自动化审计",
        meaning: "用工具检查部分规则，例如缺少 label、对比度或无名称按钮。",
      },
      {
        term: "人工验收",
        meaning:
          "真实使用键盘、读屏或不同视力条件走关键流程，发现工具漏掉的问题。",
      },
    ],
    clues: [
      {
        id: "four-proof",
        label: "收齐四类证据",
        action: "整理自动化与人工结果",
        result:
          "合格报告包括键盘路径、语义/读屏检查、对比度结果和原有功能回归测试。",
        snippet:
          "keyboard: pass\nsemantic: pass\ncontrast: pass\nregression: pass",
        question: "验收要说明覆盖了什么，也要说明没覆盖什么。",
        journeyIndex: 4,
        skill: "能设计无障碍交付证据。",
      },
      {
        id: "accessibility-interview",
        label: "写下复盘答案",
        action: "讲清发现、修复和复测",
        result:
          "面试回答可以说：我用键盘和语义检查发现焦点丢失，修复控件语义与错误反馈，再用人工路径和回归测试证明核心流程可用。",
        snippet: "现象 -> 键盘/读屏证据 -> 语义与反馈修复 -> 人工+自动化复测",
        question: "这比说‘我注意无障碍’更能证明你做过工程验收。",
        journeyIndex: 4,
        skill: "能把无障碍工作讲成证据故事。",
      },
    ],
  },
];

const javaIncidentJourney: QuestJourneyItem[] = [
  {
    sceneId: "incident-signal-tower",
    from: "线上请求",
    to: "监控报警",
    payload: "错误率、P95 延迟、时间窗口",
    proof: "知道异常何时开始、影响有多大",
    plain:
      "事故的第一棒不是猜根因，而是先确认信号：什么指标变红、从什么时候变红、影响是否还在扩大。",
  },
  {
    sceneId: "incident-timeline-archive",
    from: "监控报警",
    to: "请求时间线",
    payload: "requestId、路径、版本号、时间戳",
    proof: "能把一条用户请求从入口追到异常",
    plain:
      "日志像侦探的脚印。requestId 把同一次请求的前端、接口和后端记录串起来，避免把不同事故混在一起。",
  },
  {
    sceneId: "incident-log-corridor",
    from: "请求时间线",
    to: "结构化日志",
    payload: "异常堆栈、错误码、稳定版本",
    proof: "知道发生了什么，而不是只看到红灯",
    plain:
      "结构化日志不是把一大段文字塞进文件，而是让路径、错误码、版本和 requestId 能被搜索和比较。",
  },
  {
    sceneId: "incident-decision-gate",
    from: "证据时间线",
    to: "止血决定",
    payload: "继续观察、降级、暂停或回滚",
    proof: "决定基于阈值和影响，不基于慌乱",
    plain:
      "错误率和 P95 是决定信号。先判断影响范围，再选择止血动作；重启不是默认答案，回滚也要有理由。",
  },
  {
    sceneId: "incident-rollback-chamber",
    from: "止血决定",
    to: "稳定版本",
    payload: "回滚步骤、健康检查、冒烟路径",
    proof: "退回之后，用户路径真的恢复",
    plain:
      "回滚只完成版本切换，不等于事故结束。还要重新走健康检查、登录、保存和关键接口，证明恢复。",
  },
  {
    sceneId: "incident-review-hall",
    from: "恢复证据",
    to: "事故复盘",
    payload: "现象、证据、根因、修复、防复发",
    proof: "能把事故讲成工作和面试都听得懂的故事",
    plain:
      "复盘不是找人背锅，而是把判断依据和改进护栏留下来，让下一次值班的人不用从零开始。",
  },
];

const javaIncidentScenes: QuestScene[] = [
  {
    id: "incident-signal-tower",
    image: signalStormDispatchTowerScene,
    portrait: stormDispatcherPortrait,
    place: "事故回声塔 · 报警层",
    title: "先听清哪一盏灯在响",
    speaker: "风暴调度员",
    dialogue:
      "警报同时响起，调度员按住你的手：先别重启。告诉我错误率从哪一分钟开始升高，P95 是否也一起变坏。",
    goal: "先用错误率、P95 和时间窗口确认事故影响。",
    mentor:
      "错误率告诉你失败占比，P95 告诉你大多数请求里最慢的那一段。它们是判断影响的信号，不是根因本身。",
    terms: [
      {
        term: "错误率",
        meaning: "失败请求占全部请求的比例，用来观察失败是否扩大。",
      },
      {
        term: "P95",
        meaning: "把请求耗时从快到慢排序后，95% 请求都不超过的耗时。",
      },
    ],
    clues: [
      {
        id: "incident-error-rate",
        label: "读取错误率",
        action: "记录变红时间、当前值和正常基线",
        result: "错误率从 21:14 的 0.8% 升到 8.4%，说明失败不是单个用户偶发。",
        snippet: "error_rate: 8.4%\nbaseline: 0.8%\nwindow: 21:14-21:20",
        question: "你现在能证明异常扩大了吗？",
        journeyIndex: 0,
        skill: "能区分偶发错误和正在扩大的事故。",
      },
      {
        id: "incident-p95",
        label: "对照 P95",
        action: "比较耗时指标和错误率是否同时恶化",
        result: "P95 从 420ms 升到 1320ms，说明用户不仅失败，还在等待更久。",
        snippet: "latency_p95: 1320ms\nbaseline: 420ms\nstatus: degraded",
        question: "指标告诉你影响多大，但还不能单独告诉你为什么。",
        journeyIndex: 0,
        skill: "能解释 P95 在事故判断里的作用。",
      },
    ],
  },
  {
    id: "incident-timeline-archive",
    image: memoryEchoGalleryScene,
    portrait: timingNavigatorPortrait,
    place: "事故回声塔 · 时间线档案",
    title: "让一条请求留下完整脚印",
    speaker: "时间线领航员",
    dialogue:
      "领航员展开一张会发光的请求时间线：没有 requestId 的日志，只是一堆互相不认识的纸片。",
    goal: "用 requestId、路径、版本号和时间戳把同一请求串起来。",
    mentor:
      "先锁定一条真实失败请求，再沿同一个 requestId 找前端、网关、Controller 和异常日志。不要一上来翻所有文件。",
    terms: [
      {
        term: "requestId",
        meaning: "给一次请求的唯一编号，用来串起不同层的日志。",
      },
      {
        term: "时间窗口",
        meaning: "围绕故障发生前后划定的搜索范围，避免混入别的请求。",
      },
    ],
    clues: [
      {
        id: "incident-request-id",
        label: "锁定 requestId",
        action: "从失败响应和日志中找到同一个请求编号",
        result:
          "前端 500 响应里的 req-7f3 与后端 ERROR 记录一致，说明两条证据属于同一次请求。",
        snippet: "response.requestId: req-7f3\nserver.log.requestId: req-7f3",
        question: "为什么不能只搜一条模糊的 error 文本？",
        journeyIndex: 1,
        skill: "能用 requestId 缩小排查范围。",
      },
      {
        id: "incident-version-trace",
        label: "对照版本号",
        action: "确认失败请求落在哪个发布版本",
        result:
          "req-7f3 命中 release 2026.07.15-rc2，而稳定版本是 rc1，故障与本次变更存在时间关联。",
        snippet: "request: req-7f3\nrelease: rc2\nstable: rc1",
        question: "时间关联是线索，不是最终根因，还要继续看代码和业务影响。",
        journeyIndex: 1,
        skill: "能把请求证据和发布版本对齐。",
      },
    ],
  },
  {
    id: "incident-log-corridor",
    image: performanceObservatoryScene,
    portrait: echoForensicsPortrait,
    place: "事故回声塔 · 日志回廊",
    title: "日志要能回答发生了什么",
    speaker: "回声取证官",
    dialogue:
      "取证官把一条 failed 推回去：这不是日志，只是情绪。真正的日志要带路径、错误码、版本和上下文。",
    goal: "理解结构化日志如何帮助定位异常，而不是只打印一句 failed。",
    mentor:
      "日志要让下一位值班工程师能搜索、比较、复现。字段越稳定，越容易把事件和指标接起来。",
    terms: [
      {
        term: "结构化日志",
        meaning: "按固定字段记录事件，让机器和人都能搜索和聚合。",
      },
      {
        term: "错误码",
        meaning: "给一类失败一个稳定名字，方便前端提示、日志检索和统计。",
      },
    ],
    clues: [
      {
        id: "incident-structured-log",
        label: "补齐日志字段",
        action: "找出日志里缺少的排障字段",
        result:
          "只有 failed 无法判断哪条路径出错；至少需要 path、requestId、errorCode、release 和 duration。",
        snippet: "{ path, requestId, errorCode, release, durationMs }",
        question: "日志字段缺失时，谁会被迫重新猜一遍事故？",
        journeyIndex: 2,
        skill: "能判断日志是否足以支持排障。",
      },
      {
        id: "incident-root-cause",
        label: "写出当前假设",
        action: "把证据和根因假设分开记录",
        result:
          "证据是 rc2 的 /save 延迟和 5xx 升高；假设是新缓存刷新路径阻塞了数据库写入，还需要复测确认。",
        snippet: "evidence != hypothesis\nnext: reproduce + compare rc1/rc2",
        question: "为什么不能把第一个猜测直接写成根因？",
        journeyIndex: 2,
        skill: "能区分事实、假设和待验证动作。",
      },
    ],
  },
  {
    id: "incident-decision-gate",
    image: agentToolContractHallScene,
    portrait: indexArbiterPortrait,
    place: "事故回声塔 · 决定门",
    title: "先止血，再追求漂亮的根因",
    speaker: "指标裁决官",
    dialogue:
      "裁决官把两枚信号印章放上桌：错误率超过 5% 先回滚，只有轻微延迟才进入观察。线上不是答题比赛，是保护用户。",
    goal: "根据影响阈值选择观察、降级、暂停或回滚。",
    mentor:
      "止血动作要可逆、可解释。你可以先回到稳定版本，再在安全环境里继续查根因。",
    terms: [
      { term: "止血", meaning: "先让影响停止扩大，例如降级、关闭开关或回滚。" },
      {
        term: "回滚",
        meaning: "把服务版本退回已知稳定版本，并验证用户路径恢复。",
      },
    ],
    clues: [
      {
        id: "incident-impact-decision",
        label: "对照阈值",
        action: "把当前指标和预设门槛比较",
        result:
          "错误率 8.4% 已超过 5% 门槛，不能继续只观察；要执行有记录的止血动作。",
        snippet: "if errorRate > 0.05 -> rollback\nelse if p95 > 800 -> hold",
        question: "阈值的作用是让谁在压力下还能做出一致决定？",
        journeyIndex: 3,
        skill: "能用指标阈值支持止血决定。",
      },
      {
        id: "incident-rollback-choice",
        label: "选择回滚",
        action: "说明为什么此刻回滚比重启更合适",
        result:
          "rc2 与故障时间相关、错误率持续超过阈值，回滚到 rc1 可先恢复用户路径；重启不能消除版本缺陷。",
        snippet: "action: rollback\nfrom: rc2\nto: rc1\nreason: sustained 5xx",
        question: "你是在解决用户影响，还是在假装解决根因？",
        journeyIndex: 3,
        skill: "能解释止血动作和根因修复的区别。",
      },
    ],
  },
  {
    id: "incident-rollback-chamber",
    image: releaseReadinessGateScene,
    portrait: deliveryJudgePortrait,
    place: "事故回声塔 · 回滚机关",
    title: "回到稳定版本，还要证明门真的恢复",
    speaker: "交付审查官",
    dialogue:
      "审查官没有因为版本号变回 rc1 就盖章：健康检查、保存、登录和关键日志都要重新走一遍。",
    goal: "理解回滚后的健康检查、冒烟和业务复测。",
    mentor:
      "回滚动作证明版本切换发生了；冒烟和指标恢复才证明用户真的回来了。两者不能混为一谈。",
    terms: [
      { term: "冒烟测试", meaning: "用最短关键路径确认服务还能完成基本功能。" },
      {
        term: "恢复证据",
        meaning: "回滚后用健康、接口、业务动作和指标证明影响消失。",
      },
    ],
    clues: [
      {
        id: "incident-smoke-path",
        label: "走恢复路径",
        action: "按固定顺序复测健康、登录和保存",
        result:
          "health 返回 200，登录成功，保存后刷新可见，说明用户主路径恢复。",
        snippet: "health 200 -> login 200 -> save 201 -> refresh visible",
        question: "为什么只看部署命令成功不够？",
        journeyIndex: 4,
        skill: "能设计回滚后的最短业务复测路径。",
      },
      {
        id: "incident-recovery-signal",
        label: "观察恢复信号",
        action: "确认错误率和 P95 回到基线附近",
        result:
          "rc1 上线 10 分钟后错误率回到 0.9%，P95 回到 450ms，恢复证据与用户复测一致。",
        snippet: "error_rate: 0.9%\np95: 450ms\nwindow: 10min after rollback",
        question: "恢复指标和业务路径为什么要互相作证？",
        journeyIndex: 4,
        skill: "能用指标和业务结果共同确认恢复。",
      },
    ],
  },
  {
    id: "incident-review-hall",
    image: interviewDefenseHallScene,
    portrait: interviewCouncilorPortrait,
    place: "事故回声塔 · 复盘厅",
    title: "把事故留下来的不是恐惧，而是护栏",
    speaker: "复盘议员",
    dialogue:
      "复盘议员收起警报，把六份记录排成一列：现象、证据、根因、修复、验证、防复发。她问：下一位值班的人能少走哪一步弯路？",
    goal: "把线上事故整理成工作复盘和面试回答。",
    mentor:
      "好的复盘不夸大掌握，也不把责任推给某个人。它留下可执行的护栏，例如阈值、测试、日志字段和回滚清单。",
    terms: [
      {
        term: "事故复盘",
        meaning: "围绕事实和改进整理事故全过程，不是单纯追责。",
      },
      { term: "防复发", meaning: "把一次事故转成测试、监控、流程或代码护栏。" },
    ],
    clues: [
      {
        id: "incident-review-chain",
        label: "写完整事故链",
        action: "用固定顺序复述事故",
        result:
          "现象：5xx 与延迟升高；证据：requestId、日志、指标；根因：rc2 路径；修复：回滚；验证：业务复测和指标恢复。",
        snippet: "symptom -> evidence -> cause -> action -> verify -> prevent",
        question: "这条链能不能让没有参与事故的人听懂？",
        journeyIndex: 5,
        skill: "能讲清一次线上故障闭环。",
      },
      {
        id: "incident-prevention",
        label: "补一条护栏",
        action: "为下一次事故留下具体改进",
        result:
          "补充错误率阈值告警、结构化日志字段、rc1/rc2 对比复测和回滚后冒烟清单，避免只靠值班人的记忆。",
        snippet:
          "guardrail: alert + log schema + regression + rollback checklist",
        question: "防复发措施是否能被下一次测试或审查真正执行？",
        journeyIndex: 5,
        skill: "能把事故经验沉淀成工程护栏。",
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
    image: interviewDefenseHallScene,
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
    portrait: echoForensicsPortrait,
    place: "STAR 星盘",
    title: "模板不是答案，证据才会让星盘转动",
    speaker: "STAR 记录官",
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
    portrait: deliveryJudgePortrait,
    place: "故障复盘庭",
    title: "会修 bug 不够，要会讲清为什么修对了",
    speaker: "故障复盘官",
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
    portrait: modelWardenPortrait,
    place: "取舍议会桌",
    title: "技术名词不会替你回答为什么",
    speaker: "取舍议员",
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
          "可以说：第 1-15 章已经接入剧情教学、各自实战 Lab、作品集和本地备份；自动化能证明工程路径可用，但真人学习效果和 Java/前端路线仍需要继续验证与扩展。诚实边界比夸大更可信。",
        snippet:
          "已完成：AI 主线 1-15 章工程闭环、作品集、本地备份。\n未完成：真人学习效果、Java/前端具体路线。",
        question: "面试官不怕你没做完所有事，怕你不知道边界在哪里。",
        journeyIndex: 3,
        skill: "能诚实说明项目边界。",
      },
    ],
  },
  {
    id: "followup-mirror",
    image: questArchive,
    portrait: identityGuardPortrait,
    place: "追问镜厅",
    title: "第二问还能站住，才是真的理解",
    speaker: "追问审查官",
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
    image: releaseReadinessGateScene,
    portrait: briefForgemasterPortrait,
    place: "答辩定稿台",
    title: "终章不是结束，是你能独立讲清楚自己",
    speaker: "回答锻造师",
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

const javaReleaseScenes: QuestScene[] = [
  {
    ...releaseReadinessScenes[0],
    image: releaseReadinessGateScene,
    portrait: releaseGatekeeperPortrait,
    portraitOverride: releaseGatekeeperPortrait,
    place: "Java 发布港",
    speaker: "发布守门人",
    dialogue:
      "守门人把 Java 服务的发布单摊开：配置、健康检查和回滚不是上线后的补救，而是出港前必须逐项确认的护栏。",
    clues: [
      {
        id: "release-plan",
        label: "打开上线卷轴",
        action: "检查计划是否能指导真实上线",
        result:
          "合格计划不只写“今晚发布”。它要写发布窗口、影响范围、发布负责人、上线观察人、上线后验证路径、监控指标和回滚条件。",
        snippet:
          "服务：order-service\n发布窗口：22:00-23:00\n影响范围：下单、支付回调、订单查询\n负责人：后端发布人 + 值守观察人\n验证：health、下单冒烟、订单查询、错误率",
        question: "这一步让你从“我会打包”升级成“我能组织一次可控上线”。",
        journeyIndex: 0,
        skill: "能判断 Java 服务上线计划是否可执行。",
      },
      {
        id: "blast-radius",
        label: "标出影响范围",
        action: "说明这次上线会碰到哪些用户路径",
        result:
          "这次 Java 服务发布会碰到下单接口、订单查询、支付回调和后台任务。影响范围写清后，浏览器和接口验收才不会只看一个健康检查。",
        snippet:
          "影响范围：POST /api/orders、GET /api/orders/{id}、payment callback、order status worker。",
        question: "上线前先知道影响范围，出事时才知道该查哪几扇门。",
        journeyIndex: 0,
        skill: "能说清 Java 服务上线影响范围。",
      },
    ],
  },
  {
    ...releaseReadinessScenes[1],
    image: signalStormDispatchTowerScene,
    portraitOverride: stormDispatcherPortrait,
    place: "环境变量风暴塔",
    speaker: "配置调度官",
    dialogue:
      "调度官让你核对开发、预发和生产的变量边界。值存在不等于服务拿到了正确配置，日志和启动检查必须能证明它。",
    terms: [
      {
        term: "生产配置",
        meaning:
          "Java 服务在线上运行时读取的配置，例如数据库地址、Profile、外部服务地址、日志级别和功能开关。",
      },
      {
        term: "密钥边界",
        meaning:
          "敏感配置只应留在服务端运行环境，不能写进前端代码、日志、截图或交付说明。",
      },
    ],
    clues: [
      {
        id: "env-check",
        label: "核对生产钥匙",
        action: "列出生产环境必须存在的配置",
        result:
          "Java 服务上线常见必查项：SPRING_PROFILES_ACTIVE、DATABASE_URL、PAYMENT_API_URL、JWT_SECRET、APP_ORIGIN、LOG_LEVEL。不能把真实密钥写进代码或交付说明。",
        snippet:
          "requiredEnv:\n- SPRING_PROFILES_ACTIVE=prod\n- DATABASE_URL\n- PAYMENT_API_URL\n- JWT_SECRET\n- APP_ORIGIN\n- LOG_LEVEL",
        question:
          "面试里可以这样讲：我不会只说本地跑通，还会检查生产依赖是否具备。",
        journeyIndex: 1,
        skill: "能列出 Java 服务上线前配置检查项。",
      },
      {
        id: "secret-boundary",
        label: "查密钥边界",
        action: "确认密钥只在服务端使用",
        result:
          "前端可以知道订单功能是否可用，但不能拿到 JWT_SECRET 或支付服务 token。上线前要确认构建产物、日志和页面都没有泄露密钥。",
        snippet:
          '前端：/api/orders/health -> { ready: true }\n后端：System.getenv("JWT_SECRET")\n禁止：把 secret 写进 VITE_* 或日志',
        question: "这一步把密钥安全迁移到真实 Java 服务上线场景。",
        journeyIndex: 1,
        skill: "能解释生产密钥的安全边界。",
      },
    ],
  },
  {
    ...releaseReadinessScenes[2],
    image: deliveryReviewCourtScene,
    portraitOverride: deliveryJudgePortrait,
    place: "备份恢复审查庭",
    speaker: "恢复审查官",
    dialogue:
      "审查官拒绝只看备份文件：真正的上线证据是恢复演练能把数据带回来，并且业务路径可以继续工作。",
    clues: [
      {
        id: "backup-proof",
        label: "确认备份证据",
        action: "检查备份是否真的可用",
        result:
          "备份不是一句“已备份”。要有备份时间、覆盖范围、保存位置、恢复步骤、恢复演练结果和负责人。涉及订单表迁移时还要写清回滚是否只退代码就够。",
        snippet:
          "备份时间：2026-07-05 22:00\n覆盖：orders、payments、order_events\n恢复演练：restore-staging-20260705 passed\n负责人：值守后端",
        question: "这一步让用户明白：数据保护是上线能力，不是后端神秘仪式。",
        journeyIndex: 2,
        skill: "能判断数据备份是否可信。",
      },
      {
        id: "migration-risk",
        label: "识别迁移风险",
        action: "判断数据库变化能否安全回退",
        result:
          "只改 Java 校验逻辑通常不用迁移；如果改订单表 schema、删除字段、重建索引或批量修数据，就必须写迁移前备份和回滚策略。",
        snippet:
          "低风险：只新增订单状态校验。\n高风险：删除 order_status 字段、重建支付索引、批量改订单状态。",
        question: "你不是要害怕上线，而是要知道哪类上线必须保护数据。",
        journeyIndex: 2,
        skill: "能区分代码风险和数据风险。",
      },
    ],
  },
  {
    ...releaseReadinessScenes[3],
    image: performanceObservatoryScene,
    portraitOverride: timingNavigatorPortrait,
    place: "健康检查观测台",
    speaker: "健康检查官",
    dialogue:
      "观测官把启动探针、关键接口和错误率放到同一张图上：上线后的第一分钟，要知道服务是活着，还是只是进程没退出。",
    terms: [
      {
        term: "健康检查",
        meaning:
          "用固定接口或探针确认服务、数据库和关键依赖是否能正常工作，不等同于只看进程还在。",
      },
      {
        term: "业务成功率",
        meaning:
          "用户关键动作成功的比例，例如下单成功率、订单查询成功率和支付回调处理成功率。",
      },
    ],
    clues: [
      {
        id: "monitoring-signals",
        label: "点亮监控灯",
        action: "列出上线后要看的指标",
        result:
          "Java 服务上线后要看：/actuator/health、订单接口 5xx、p95 耗时、下单成功率、支付回调失败率和后端错误日志。真实业务还要看队列堆积和数据库连接池。",
        snippet:
          "watch 30min:\n- /actuator/health\n- order 5xx error rate\n- p95 latency\n- order success rate\n- payment callback failure rate",
        question:
          "这一步让用户明白：上线后的证据来自系统表现，不是来自发布者的自信。",
        journeyIndex: 3,
        skill: "能列出 Java 服务上线后观察指标。",
      },
      {
        id: "smoke-test",
        label: "走一遍冒烟路径",
        action: "从真实入口验证关键用户路径",
        result:
          "冒烟测试要覆盖健康检查、创建订单、查询订单、模拟支付回调和 390px 关键页面。桌面和手机都要走，因为后端放行最终会影响真实用户路径。",
        snippet:
          "health -> create order -> query order -> payment callback -> mobile order page",
        question: "这和你不想反复当测试员是同一件事：Agent 要自己走真实路径。",
        journeyIndex: 3,
        skill: "能设计 Java 服务上线冒烟测试路径。",
      },
    ],
  },
  {
    ...releaseReadinessScenes[4],
    image: interviewDefenseHallScene,
    portraitOverride: interviewCouncilorPortrait,
    place: "发布复盘台",
    speaker: "发布答辩官",
    dialogue:
      "答辩官要求你讲清这次上线如何发现风险、如何回滚、如何确认恢复，并把清单沉淀成下一次能复用的工程证据。",
    terms: [
      {
        term: "回滚条件",
        meaning:
          "触发回滚的明确标准，例如订单接口 500 错误率超过阈值、下单成功率下降、支付回调失败率持续升高。",
      },
      {
        term: "回滚后验证",
        meaning:
          "回滚完成后重新走健康检查、创建订单、查询订单和支付回调路径，证明系统回到稳定状态。",
      },
    ],
    clues: [
      {
        id: "rollback-trigger",
        label: "刻下回滚条件",
        action: "把异常阈值写成可判断标准",
        result:
          "坏回滚条件：出事再说。好回滚条件：订单接口 500、下单成功率下降、支付回调失败率持续升高、数据库连接池耗尽或 390px 订单页不可用。",
        snippet:
          "rollbackWhen:\n- orderErrorRate > 2%\n- order success rate drops\n- payment callback fails\n- db pool exhausted\n- mobile order page smoke test fails",
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
          "回滚后不能只说版本退了。还要复测 health、创建订单、订单查询、支付回调、关键日志和监控指标，确认用户路径恢复。",
        snippet:
          "rollbackVerify:\n- health ok\n- create order ok\n- query order ok\n- payment callback ok\n- no new 5xx logs",
        question:
          "上线面试复盘可以这样讲：我提前定义回滚条件，并用冒烟测试证明恢复。",
        journeyIndex: 5,
        skill: "能说明回滚后如何验收。",
      },
    ],
  },
];

const frontendTestingScenes: QuestScene[] = rewriteQuestContent(
  testingProofScenes,
  frontendTestingCopyReplacements,
).map((scene, index) => {
  const details = [
    {
      image: verificationTrialArenaScene,
      portraitOverride: testArbiterPortrait,
      place: "前端回归试炼场",
      speaker: "测试仲裁官",
      dialogue:
        "仲裁官把失败复现、组件测试和真实浏览器路径摆在一起：前端修复必须证明用户真正看到的状态变对了。",
    },
    {
      image: memoryEchoGalleryScene,
      portraitOverride: echoForensicsPortrait,
      place: "组件行为回声廊",
      speaker: "交互取证师",
      dialogue:
        "取证师让你重放点击、加载、失败和重试：测试不是给按钮盖章，而是记录状态如何随着用户动作变化。",
    },
    {
      image: deliveryReviewCourtScene,
      portraitOverride: deliveryJudgePortrait,
      place: "集成路径审查庭",
      speaker: "路径审查官",
      dialogue:
        "审查官把 Network、页面反馈和移动端截图串成一条路径，提醒你单测通过也不能替代真实交互验收。",
    },
    {
      image: releaseReadinessGateScene,
      portraitOverride: releaseGatekeeperPortrait,
      place: "前端交付门",
      speaker: "交付守门人",
      dialogue:
        "守门人要求你留下失败证据、修复范围和回归结果，只有别人能复查的证据才算真正交付。",
    },
  ][index];
  return details ? { ...scene, ...details } : scene;
});

const teachingStorySceneSets: Record<string, QuestScene[]> = {
  "canvas-save-persistence": questScenes,
  "case-002": canvasStormScenes,
  "case-003-login-state": loginStateScenes,
  "case-004-api-error": apiErrorScenes,
  "case-005-data-consistency": consistencyScenes,
  "case-006-performance": performanceScenes,
  "case-007-ai-api": aiApiScenes,
  "case-008-hallucination": hallucinationScenes,
  "case-009-rag": ragScenes,
  "case-010-agent-tools": agentToolsScenes,
  "case-011-testing-proof": testingProofScenes,
  "case-012-agent-brief": agentBriefScenes,
  "case-013-delivery-review": deliveryReviewScenes,
  "case-014-release-readiness": releaseReadinessScenes,
  "case-015-interview-review": interviewReviewScenes,
  "java-layered-request": javaLayeredScenes,
  "java-transaction-consistency": javaTransactionScenes,
  "java-cache-observability": javaCacheScenes,
  "java-release-harbor": javaReleaseScenes,
  "java-production-incident": javaIncidentScenes,
  "frontend-component-state": frontendComponentScenes,
  "frontend-request-states": getFrontendRequestStatesScenes(),
  "frontend-performance-proof": frontendPerformanceScenes,
  "frontend-accessibility-proof": accessibilityScenes,
  "frontend-testing-proof": frontendTestingScenes,
};

// The route contract test reads the same story registry used by TeachingBridge.
// eslint-disable-next-line react-refresh/only-export-components
export function getTeachingStorySceneImages(scenarioId: string) {
  return (
    teachingStorySceneSets[normalizeScenarioId(scenarioId)] ?? questScenes
  ).map((scene) => scene.image);
}

// Keep the content contract testable without exposing the mutable registry.
// The UI still receives the same scene objects through the teaching bridge.
// eslint-disable-next-line react-refresh/only-export-components
export function getTeachingStoryScenes(scenarioId: string) {
  return teachingStorySceneSets[normalizeScenarioId(scenarioId)] ?? questScenes;
}

function EvidenceStoryQuest({
  scenarioId,
  developer,
  saving,
  scenes = questScenes,
  journey = questJourney,
  journeyTitle = "保存数据的完整旅行路线",
  routeFamilyLabel = "AI 应用开发主线",
  stepLabel = "地点",
  workBackground,
  initialProgress,
  onProgress,
  onComplete,
}: {
  scenarioId: string;
  developer: DeveloperProfile;
  saving: boolean;
  scenes?: QuestScene[];
  journey?: QuestJourneyItem[];
  journeyTitle?: string;
  routeFamilyLabel?: string;
  stepLabel?: string;
  workBackground?: string;
  initialProgress?: StoryProgressSnapshot;
  onProgress?: (snapshot: StoryProgressSnapshot) => void;
  onComplete: (
    sceneRecalls?: Record<string, string>,
    sceneDecisions?: Record<string, string>,
  ) => void;
}) {
  const [sceneIndex, setSceneIndex] = useState(
    initialProgress?.sceneIndex ?? 0,
  );
  const [discovered, setDiscovered] = useState<Record<string, string[]>>(
    initialProgress?.discovered ?? {},
  );
  const [sceneRecalls, setSceneRecalls] = useState<Record<string, string>>(
    initialProgress?.sceneRecalls ?? {},
  );
  const [sceneDecisions, setSceneDecisions] = useState<Record<string, string>>(
    initialProgress?.sceneDecisions ?? {},
  );
  const [recallDraft, setRecallDraft] = useState("");
  const [activeClueId, setActiveClueId] = useState<string | null>(null);
  const [transitionScene, setTransitionScene] = useState<{
    scene: QuestScene;
    index: number;
  } | null>(null);
  const scene = scenes[sceneIndex];
  const companion = teachingCompanions[normalizeScenarioId(scenarioId)];
  const cinematic = resolveChapterCinematic(scenarioId);
  const cameraShot = getChapterShot(scenarioId, sceneIndex);
  const nextScene = scenes[sceneIndex + 1] ?? null;
  const previousScene = scenes[sceneIndex - 1] ?? null;
  const sceneDiscovered = discovered[scene.id] ?? [];
  const activeClue =
    scene.clues.find((clue) => clue.id === activeClueId) ??
    scene.clues.find((clue) => sceneDiscovered.includes(clue.id)) ??
    null;
  const sceneDone = scene.clues.every((clue) =>
    sceneDiscovered.includes(clue.id),
  );
  const recallReady = recallDraft.trim().length >= 12;
  const recallSaved = Boolean(sceneRecalls[scene.id]);
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
  const nextJourney = journey[activeJourneyIndex + 1] ?? null;
  const missingProofJourney =
    journey
      .slice(activeJourneyIndex + 1)
      .find(
        (item) => item.to.includes("数据库") || item.proof.includes("SELECT"),
      ) ?? nextJourney;
  const recallCannotProve = missingProofJourney
    ? `${missingProofJourney.to}真的完成；还没看到「${missingProofJourney.proof}」`
    : "修复已经在真实路径里稳定通过";
  const recallNextEvidence = nextJourney
    ? `${nextJourney.from} → ${nextJourney.to}`
    : "实战修复与验收";
  const decision = getSceneDecision(scene, activeJourney);
  const selectedDecisionId = sceneDecisions[scene.id];
  const previousDecisionEcho = getDecisionEcho(
    previousScene,
    previousScene ? sceneDecisions[previousScene.id] : undefined,
  );
  const selectedDecision = decision.options.find(
    (option) => option.id === selectedDecisionId,
  );
  const recapClue = activeClue ?? scene.clues.at(-1);
  const recallPlaceholder = activeClue
    ? `例如：${activeClue.label} 证明了……下一幕要继续查……`
    : `例如：${scene.title} 说明……下一幕要继续查……`;
  const sceneInterviewLine = `我会这样讲：在「${scene.place}」，我用「${
    recapClue?.label ?? scene.title
  }」这条证据说明：${recapClue?.skill ?? scene.goal}`;
  const sceneRecap = [
    {
      label: "现象",
      value: scene.title,
      note: scene.dialogue,
    },
    {
      label: "证据",
      value: recapClue?.label ?? scene.goal,
      note: recapClue?.result ?? scene.goal,
    },
    {
      label: "结论",
      value: scene.clues.at(-1)?.skill ?? scene.goal,
      note: "把这一幕学到的判断方式，带到下一地点继续验证。",
    },
  ];

  const persistStoryProgress = (snapshot: StoryProgressSnapshot) => {
    onProgress?.(snapshot);
  };

  useEffect(() => {
    if (!transitionScene) return undefined;
    const timer = window.setTimeout(() => {
      setSceneIndex(transitionScene.index);
      setTransitionScene(null);
      scrollPageToTop();
    }, 560);
    return () => window.clearTimeout(timer);
  }, [transitionScene]);

  const discover = (clue: QuestClue) => {
    setActiveClueId(clue.id);
    if (sceneDiscovered.includes(clue.id)) return;
    const nextDiscovered = {
      ...discovered,
      [scene.id]: [...sceneDiscovered, clue.id],
    };
    setDiscovered({
      ...nextDiscovered,
    });
    persistStoryProgress({
      sceneIndex,
      discovered: nextDiscovered,
      sceneRecalls,
      sceneDecisions,
    });
  };

  const goNext = () => {
    setActiveClueId(null);
    if (!sceneRecalls[scene.id]) return;
    if (sceneIndex + 1 < scenes.length) {
      const nextSceneIndex = sceneIndex + 1;
      setTransitionScene({
        scene: scenes[nextSceneIndex],
        index: nextSceneIndex,
      });
      setRecallDraft("");
      persistStoryProgress({
        sceneIndex: nextSceneIndex,
        discovered,
        sceneRecalls,
        sceneDecisions,
      });
      return;
    }
    onComplete(sceneRecalls, sceneDecisions);
  };

  const saveSceneRecall = () => {
    if (!recallReady || !selectedDecisionId) return;
    const nextRecalls = {
      ...sceneRecalls,
      [scene.id]: recallDraft.trim(),
    };
    setSceneRecalls({
      ...nextRecalls,
    });
    persistStoryProgress({
      sceneIndex,
      discovered,
      sceneRecalls: nextRecalls,
      sceneDecisions,
    });
  };

  const chooseDecision = (decisionId: string) => {
    const nextDecisions = { ...sceneDecisions, [scene.id]: decisionId };
    setSceneDecisions(nextDecisions);
    persistStoryProgress({
      sceneIndex,
      discovered,
      sceneRecalls,
      sceneDecisions: nextDecisions,
    });
  };

  return (
    <main
      className={`quest-shell quest-scene-${scene.id} chapter-shot-${cameraShot.shot}`}
      data-camera={cinematic.cameraLabel}
      style={
        {
          "--quest-bg": `url(${scene.image})`,
          "--camera-focus": cameraShot.focus,
          "--camera-entry-x": cameraShot.entryX,
          "--camera-entry-y": cameraShot.entryY,
          "--camera-entry-scale": cameraShot.entryScale,
          "--camera-drift-x": cameraShot.driftX,
          "--camera-drift-y": cameraShot.driftY,
          "--camera-drift-scale": cameraShot.driftScale,
          "--camera-duration": cameraShot.duration,
          "--camera-easing": cameraShot.easing,
        } as CSSProperties
      }
    >
      <div className="quest-camera" />
      {transitionScene && (
        <div className="quest-transition-card" aria-live="polite">
          <div className="quest-transition-character">
            <img
              src={
                getScenePortrait(transitionScene.scene) ?? archiveKeeperPortrait
              }
              alt={transitionScene.scene.speaker}
            />
            <div>
              <span>下一幕登场 · {transitionScene.scene.place}</span>
              <strong>{transitionScene.scene.speaker}</strong>
            </div>
          </div>
          <span className="quest-transition-kicker">场景转移</span>
          <strong className="quest-transition-title">
            前往：{transitionScene.scene.place}
          </strong>
          <span className="quest-transition-case">
            调查：{transitionScene.scene.title}
          </span>
          <p>{transitionScene.scene.dialogue}</p>
          <div className="quest-transition-handoff">
            <span>这一幕要接住的证据</span>
            <strong>
              {transitionScene.scene.clues[0]?.label ??
                transitionScene.scene.goal}
            </strong>
          </div>
        </div>
      )}
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
        {companion && (
          <div className="quest-companion-meter">
            <span>{companion.name}默契</span>
            <strong>
              {sceneDiscovered.length}/{scene.clues.length}
            </strong>
          </div>
        )}
      </header>

      <section className="quest-route-identity" aria-label="当前路线身份">
        <span>{routeFamilyLabel}</span>
        <strong>{scene.title}</strong>
        <small>
          当前{stepLabel}：{scene.place} · {scene.speaker}
        </small>
      </section>

      <section
        className="chapter-navigation-needle quest-navigation-needle"
        aria-label="本章导航针"
      >
        <header>
          <span>本章导航针</span>
          <strong>{scene.title}</strong>
          <small>
            第 {sceneIndex + 1}/{scenes.length} 站 · {scene.place}
          </small>
        </header>
        <div>
          <article>
            <span>刚从哪里来</span>
            <strong>{previousScene ? previousScene.place : "剧情调查"}</strong>
            <p>
              {previousScene
                ? `${previousScene.title} 已收录，继续追它交出的下一份证据。`
                : "序章委托已经确认：这不是背名词，而是追一条保存证据链。"}
            </p>
          </article>
          <article className="active">
            <span>现在做什么</span>
            <strong>{scene.title}</strong>
            <p>{scene.goal}</p>
          </article>
          <article>
            <span>完成后交给谁</span>
            <strong>{nextScene ? nextScene.place : "实战会合"}</strong>
            <p>
              {nextScene
                ? `带着这一幕证据去找「${nextScene.title}」。`
                : "把本章证据带进真实项目实战。"}
            </p>
          </article>
        </div>
        <p>
          当前只要交出：
          <b>{activeJourney?.proof ?? scene.clues[0]?.skill ?? scene.goal}</b>
          。先把这一站说清楚，再进入下一站。
        </p>
      </section>

      <nav className="quest-scene-rail" aria-label="本章地点航线">
        <div className="quest-scene-rail-heading">
          <span>本章地点航线</span>
          <strong>
            已到达 {sceneIndex + 1} / {scenes.length} · 当前在「{scene.place}」
          </strong>
        </div>
        <div className="quest-scene-rail-current" aria-label="当前地点定位">
          <span className="quest-scene-rail-marker">{sceneIndex + 1}</span>
          <div>
            <b>现在只看这一站</b>
            <strong>
              {scene.place} · {scene.speaker}
            </strong>
            <small>
              {nextScene
                ? `收完本地点线索后，再去「${nextScene.place}」。`
                : "这是本章最后一站，收完线索后进入实战会合。"}
            </small>
          </div>
        </div>
        <details className="quest-scene-rail-details" aria-label="完整地点路线">
          <summary>
            <span>查看完整地点路线</span>
            <small>需要复盘地图时再展开</small>
          </summary>
          <ol>
            {scenes.map((item, index) => {
              const status =
                index < sceneIndex
                  ? "done"
                  : index === sceneIndex
                    ? "active"
                    : "next";
              const railPlace = item.place.replace(/大厅|深处/g, "");
              return (
                <li className={status} key={item.id} title={item.place}>
                  <span className="quest-scene-rail-marker">{index + 1}</span>
                  <div>
                    <strong>{railPlace}</strong>
                    <small>
                      {index < sceneIndex
                        ? `已收录 · ${item.speaker}`
                        : index === sceneIndex
                          ? `正在调查 · ${item.speaker}`
                          : `下一站 · ${item.speaker}`}
                    </small>
                  </div>
                </li>
              );
            })}
          </ol>
        </details>
      </nav>

      <QuestSceneSpotlight
        scene={scene}
        sceneIndex={sceneIndex}
        totalScenes={scenes.length}
        previousScene={previousScene}
        nextScene={nextScene}
        activeJourney={activeJourney}
      />

      <QuestCollectionContract
        companion={companion}
        totalFound={totalFound}
        totalClues={totalClues}
        sceneFound={sceneDiscovered.length}
        sceneTotal={scene.clues.length}
        abilityMark={activeJourney?.proof ?? scene.goal}
      />

      <section className="quest-stage">
        <section className="quest-memory-echo" aria-label="上一幕回声">
          <span>{previousScene ? "上一幕回声" : "序章委托"}</span>
          <strong>
            {previousScene
              ? `${previousScene.place} · ${previousScene.speaker}`
              : "你为什么来到这座代码城"}
          </strong>
          <p>
            {previousScene
              ? `你刚刚收录了「${previousScene.clues.at(-1)?.label ?? previousScene.title}」：${(previousScene.clues.at(-1)?.skill ?? previousScene.goal).replace(/[。！？]$/, "")}。这一幕不是重新开始，而是继续追踪它交出的下一份证据。`
              : `你接到的委托是：查清「${scene.title}」背后的证据链。先从「${scene.place}」开始，讲清谁把什么交给谁。`}
          </p>
        </section>

        {previousDecisionEcho && (
          <aside className="quest-decision-echo" aria-label="上一幕判断回声">
            <span>上一幕判断回声</span>
            <strong>{previousDecisionEcho.title}</strong>
            <p>{previousDecisionEcho.body}</p>
          </aside>
        )}

        {journey.length > 0 && activeJourney && (
          <section className="quest-current-contract" aria-label="本幕任务契约">
            <header>
              <span>本幕任务契约</span>
              <strong>先记住这一件事，再开始探索</strong>
            </header>
            <div className="quest-current-contract-grid">
              <article>
                <span>现在在哪</span>
                <strong>{scene.place}</strong>
              </article>
              <article>
                <span>要找什么</span>
                <strong>{activeJourney.payload}</strong>
              </article>
              <article>
                <span>找到后交给</span>
                <strong>{activeJourney.to}</strong>
              </article>
            </div>
            <p>{activeJourney.plain}</p>
            {workBackground && (
              <p className="quest-work-context">
                <b>真实工作现场：</b>
                {workBackground}
              </p>
            )}
          </section>
        )}

        {journey.length > 0 && activeJourney && (
          <div className="quest-flow-brief" aria-label="当前流程定位">
            <div className="quest-flow-focus">
              <b>现在这一幕在看</b>
              <strong>
                {activeJourney.from} 把「{activeJourney.payload}」交给{" "}
                {activeJourney.to}
              </strong>
              <p>{activeJourney.plain}</p>
              <dl
                className="quest-flow-handoff-sheet"
                aria-label="当前流程交接单"
              >
                <div>
                  <dt>收到什么</dt>
                  <dd>{activeJourney.payload}</dd>
                </div>
                <div>
                  <dt>谁来处理</dt>
                  <dd>{activeJourney.to}</dd>
                </div>
                <div>
                  <dt>交出什么证据</dt>
                  <dd>{activeJourney.proof}</dd>
                </div>
                <div>
                  <dt>下一步看哪里</dt>
                  <dd>
                    {nextJourney
                      ? `${nextJourney.from} → ${nextJourney.to}`
                      : "实战修复与验收"}
                  </dd>
                </div>
              </dl>
            </div>
            <details className="quest-flow-board" aria-label="完整流程">
              <summary>
                <span>完整流程卷轴</span>
                <strong>{journeyTitle}</strong>
                <small>需要全局复盘时再展开；当前只记住上面的这一棒。</small>
              </summary>
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
            </details>
          </div>
        )}

        <div className="quest-place-card">
          <div className="quest-character" aria-label="剧情角色">
            <img
              className="quest-character-portrait"
              src={getScenePortrait(scene) ?? archiveKeeperPortrait}
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
                  <small>{found ? "卷宗已收录 · 点击回看" : clue.action}</small>
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
                <section className="quest-clue-acquired" aria-label="线索获得">
                  <span>线索获得</span>
                  <strong>证据 +1 · {activeClue.label}</strong>
                  <div>
                    <article>
                      <b>收进卷宗</b>
                      <p>{activeClue.skill}</p>
                    </article>
                    <article>
                      <b>伙伴默契</b>
                      <p>
                        {companion?.name ?? "本章同行"} {sceneDiscovered.length}/
                        {scene.clues.length}
                      </p>
                    </article>
                    <article>
                      <b>下一步追证据</b>
                      <p>
                        {nextJourney
                          ? `${nextJourney.from} → ${nextJourney.to}`
                          : "进入实战修复与验收"}
                      </p>
                    </article>
                  </div>
                </section>
                {companion && (
                  <div
                    className="quest-companion-whisper"
                    aria-label="伙伴线索回应"
                  >
                    <img src={companion.image} alt={companion.name} />
                    <div>
                      <span>{companion.name} · 线索回应</span>
                      <p>
                        “先把「{activeClue.label}」收进卷宗。它说明：
                        {activeClue.skill}”
                      </p>
                      <small>
                        默契印记 {sceneDiscovered.length}/{scene.clues.length}
                      </small>
                    </div>
                  </div>
                )}
                <small>{activeClue.skill}</small>
              </>
            )}
            {sceneDone && (
              <>
                <div className="quest-scene-reward" aria-label="本幕收获">
                  <span>本幕收获</span>
                  <strong>
                    {scene.place} 已完成：你拿到了 {scene.clues.length}{" "}
                    条证据印记
                  </strong>
                  <ul>
                    {scene.clues.map((clue) => (
                      <li key={clue.id}>{clue.skill}</li>
                    ))}
                  </ul>
                  <div
                    className="quest-recap-board"
                    aria-label="本幕复盘三段式"
                  >
                    <span>本幕复盘</span>
                    <div className="quest-recap-grid">
                      {sceneRecap.map((item) => (
                        <article key={item.label}>
                          <b>{item.label}</b>
                          <strong>{item.value}</strong>
                          <p>{item.note}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                  <div className="quest-interview-line">
                    <span>面试一句话</span>
                    <p>{sceneInterviewLine}</p>
                  </div>
                  <section
                    className="quest-decision-card"
                    aria-label="本幕判断分支"
                  >
                    <span>做出判断 · 不惩罚</span>
                    <strong>{decision.prompt}</strong>
                    <div className="quest-decision-options">
                      {decision.options.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={
                            selectedDecisionId === option.id ? "selected" : ""
                          }
                          aria-pressed={selectedDecisionId === option.id}
                          onClick={() => chooseDecision(option.id)}
                        >
                          <strong>{option.label}</strong>
                          <small>
                            {selectedDecisionId === option.id
                              ? "已选择"
                              : "点击查看结果"}
                          </small>
                        </button>
                      ))}
                    </div>
                    {selectedDecision && (
                      <p className="quest-decision-feedback">
                        {selectedDecision.feedback}
                      </p>
                    )}
                  </section>
                  <section
                    className="quest-recall-card"
                    aria-label="本幕主动复述"
                  >
                    <span>主动复述 · 不评分</span>
                    <strong>
                      用你自己的话说：这一幕的证据证明了什么，下一幕要继续查什么？
                    </strong>
                    <div
                      className="quest-recall-guide"
                      aria-label="主动复述提示"
                    >
                      <span>照着这三句写</span>
                      <ol>
                        <li>这条证据证明：{activeJourney.proof}</li>
                        <li>它还不能证明：{recallCannotProve}。</li>
                        <li>
                          下一幕我要查：{nextScene?.place ?? "实战修复"}
                          的证据，也就是
                          {recallNextEvidence}。
                        </li>
                      </ol>
                    </div>
                    <textarea
                      aria-label="本幕复述原话"
                      value={recallDraft}
                      onChange={(event) => setRecallDraft(event.target.value)}
                      placeholder={recallPlaceholder}
                      rows={3}
                    />
                    <small>
                      {recallSaved
                        ? "已封存原话；这不会直接代表你已经掌握。"
                        : !selectedDecisionId
                          ? "先做出一个判断，再用自己的话复述这一幕。"
                          : recallReady
                            ? "可以封存了。系统只保存你的原话，不自动判定对错。"
                            : `至少写 12 个字，还差 ${Math.max(0, 12 - recallDraft.trim().length)} 个。`}
                    </small>
                    <button
                      className="v2-button ghost"
                      type="button"
                      onClick={saveSceneRecall}
                      disabled={
                        !recallReady || !selectedDecisionId || recallSaved
                      }
                    >
                      {recallSaved ? "本幕复述已封存" : "封存本幕复述"}
                    </button>
                  </section>
                </div>
                <div
                  className="quest-next-preview"
                  aria-label={nextScene ? "下一地点预告" : "结案预告"}
                >
                  <img
                    src={
                      (nextScene && getScenePortrait(nextScene)) ??
                      archiveKeeperPortrait
                    }
                    alt=""
                  />
                  <div>
                    <span>{nextScene ? "下一地点预告" : "结案预告"}</span>
                    <strong>
                      {nextScene
                        ? `${nextScene.place} · ${nextScene.speaker}`
                        : "结案卷宗 · 证据链已闭合"}
                    </strong>
                    <p>
                      {nextScene
                        ? `下一幕要去「${nextScene.title}」：${nextScene.goal}`
                        : "你已经把本关线索串起来了。下一步进入实战，把判断变成可验收的修复。"}
                    </p>
                    <dl className="quest-next-evidence">
                      <div>
                        <dt>带着这份证据</dt>
                        <dd>{activeJourney.proof}</dd>
                      </div>
                      <div>
                        <dt>{nextJourney ? "下一幕要交出" : "实战要证明"}</dt>
                        <dd>
                          {nextJourney
                            ? nextJourney.payload
                            : "保存、刷新、查库和测试都能对上"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
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
                disabled={
                  !sceneDone ||
                  !selectedDecisionId ||
                  !recallSaved ||
                  saving ||
                  Boolean(transitionScene)
                }
                onClick={goNext}
              >
                {sceneIndex + 1 < scenes.length
                  ? sceneDone
                    ? recallSaved
                      ? "继续下一地点"
                      : selectedDecisionId
                        ? "先保存复述"
                        : "先选择判断"
                    : "先收集本地点线索"
                  : sceneDone
                    ? recallSaved
                      ? "进入实战修复"
                      : selectedDecisionId
                        ? "先保存复述"
                        : "先选择判断"
                    : "先收集本地点线索"}
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
  scenarioId,
  map,
  onComplete,
}: {
  scenarioId: string;
  map: ProjectMap;
  onComplete: () => void;
}) {
  const cinematic = resolveChapterCinematic(scenarioId);
  const [selected, setSelected] = useState<MapNode | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const requiredCount = Math.min(3, map.nodes.length);

  const orderedNodes = map.nodes;
  const placements = orderedNodes.map((_, index) =>
    getMapNodePlacement(cinematic.mapTopology, index),
  );
  const maxMapRow = Math.max(...placements.map((placement) => placement.row));
  const connectionLines = map.edges.flatMap((edge) => {
    const fromIndex = orderedNodes.findIndex((node) => node.id === edge.from);
    const toIndex = orderedNodes.findIndex((node) => node.id === edge.to);
    if (fromIndex < 0 || toIndex < 0) return [];
    const from = placements[fromIndex];
    const to = placements[toIndex];
    return [
      {
        ...edge,
        x1: (from.column - 1 + from.span / 2) * 10,
        y1: (from.row - 0.5) * 32,
        x2: (to.column - 1 + to.span / 2) * 10,
        y2: (to.row - 0.5) * 32,
      },
    ];
  });

  return (
    <section
      className={`teaching-shell map-quest-shell map-topology-${cinematic.mapTopology}`}
      data-map-topology={cinematic.mapTopology}
      data-camera={cinematic.cameraLabel}
      aria-label={`${cinematic.chapterTitle}项目地图`}
      style={
        {
          "--map-accent": cinematic.mapAccent,
          "--map-accent-soft": cinematic.mapAccentSoft,
        } as CSSProperties
      }
    >
      <header className="teaching-header">
        <span className="mini-label">教学模式 · 不影响能力分</span>
        <h2>
          <Network size={28} /> 项目地图
        </h2>
        <strong className="chapter-map-title">
          {cinematic.mapLabel}
          <span aria-label="当前探索区域与关键地标">
            {cinematic.mapTerrain} · {cinematic.mapLandmark}
          </span>
        </strong>
        <p>
          点击节点了解它在做什么。看完 <strong>至少 {requiredCount} 个</strong>
          即可继续。
        </p>
      </header>

      <div className="map-guide-board" aria-label="地图向导">
        <img src={portalScribePortrait} alt="" />
        <div>
          <span>地图向导</span>
          <strong>{cinematic.mapInstruction}</strong>
          <p>
            点开节点时只回答三个问题：它收到什么、交出什么、能用哪些证据证明。
          </p>
        </div>
        <ol aria-label="地图阅读顺序">
          <li>看输入</li>
          <li>看输出</li>
          <li>找证据</li>
        </ol>
      </div>

      <div
        className={`flowchart topology-${cinematic.mapTopology}`}
        aria-label={cinematic.mapLabel}
        style={{ "--map-row-count": maxMapRow } as CSSProperties}
      >
        <svg
          className="flowchart-connections"
          viewBox={`0 0 120 ${maxMapRow * 32}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <marker
              id={`map-arrow-${cinematic.chapterId}`}
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" />
            </marker>
          </defs>
          {connectionLines.map((line) => (
            <line
              key={`${line.from}-${line.to}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              markerEnd={`url(#map-arrow-${cinematic.chapterId})`}
            />
          ))}
        </svg>
        {orderedNodes.map((node, idx) => {
          const edgeLabel = map.edges.find((e) => e.from === node.id)?.label;
          const placement = getMapNodePlacement(cinematic.mapTopology, idx);
          return (
            <div
              key={node.id}
              className="flowchart-row"
              style={
                {
                  "--map-column": placement.column,
                  "--map-span": placement.span,
                  "--map-row": placement.row,
                } as CSSProperties
              }
            >
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
          <div className="map-node-handoff" aria-label="当前节点接力解释">
            <span>这一站的接力</span>
            <strong>
              收到「{selected.input}」，处理后交出「{selected.output}」。
            </strong>
            <p>
              如果这里出问题，先找这一站附近的观察证据，不要把整条链路都怀疑一遍。
            </p>
          </div>
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
  remediation,
  onComplete,
}: {
  card: ConceptCard;
  remediation?: ReactNode;
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

      <div className="concept-guide-board" aria-label="术语解锁向导">
        <img src={knowledgeKeeperPortrait} alt="" />
        <div>
          <span>术语解锁室</span>
          <strong>先把术语变成画面，再把画面放回项目。</strong>
          <p>
            这一页不是背定义。你会先听一个类比，再看它在当前项目里的样子，
            最后做一次判断，确认自己真的能用这个概念看问题。
          </p>
        </div>
      </div>

      <div className="concept-section">
        <h3>
          <Lightbulb size={18} />
          第一步 · 生活类比
          {showAnalogy && <Check size={16} className="check-green" />}
        </h3>
        {!showAnalogy ? (
          <button className="reveal-btn" onClick={() => setShowAnalogy(true)}>
            <Lightbulb size={17} /> 点我查看类比
          </button>
        ) : (
          <div className="concept-revealed">
            <span>类比记录</span>
            <p className="concept-text">{card.analogy}</p>
          </div>
        )}
      </div>

      <div className="concept-section">
        <h3>
          <FileCode2 size={18} />
          第二步 · 当前项目例子
          {showExample && <Check size={16} className="check-green" />}
        </h3>
        {!showExample ? (
          <button className="reveal-btn" onClick={() => setShowExample(true)}>
            <Search size={17} /> 点我查看例子
          </button>
        ) : (
          <div className="concept-revealed">
            <span>项目现场</span>
            <p className="concept-text">{card.example}</p>
          </div>
        )}
      </div>

      <div className="concept-section">
        <h3>
          <HelpCircle size={18} />
          第三步 · 预测问题
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

      {remediation}

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

function explainCodeLine(
  line: string,
  focus: CodeFocus,
  projectPosition?: string,
): string {
  const compact = line.trim();
  if (!compact) return "空行只是把代码分段，方便你看清结构。";
  if (compact.startsWith("//"))
    return "这是作者留给读代码的人看的提示，不会被程序执行。";
  if (compact.match(/^import\s/)) {
    return "这里先把外部工具或组件拿进来。先不用背路径，只要知道这段代码接下来会借用它。";
  }
  if (compact.match(/^export\s/)) {
    return `这里把「${focus.functionName}」交给项目其他地方使用。它不是孤立代码，后面会有人调用它。`;
  }
  if (compact.includes("useState")) {
    return `这里给页面准备一份会变化的状态。当前这一步接收「${focus.input}」，后面会把它整理成「${focus.output}」。`;
  }
  if (compact.includes("useEffect")) {
    return "这里声明一个自动发生的副作用：页面状态变化后，还会继续触发请求、保存或同步。";
  }
  if (compact.match(/^(const|let|var)\s+\w+\s*=\s*\{/)) {
    return `这里把分散的信息装进一个对象。先确认对象里有没有「${focus.input}」需要的材料。`;
  }
  if (compact.match(/^(const|let|var)\s+\w+\s*=\s*\[/)) {
    return "这里把一组候选项排成清单。读数组时先看每一项代表什么选择，不急着看样式。";
  }
  if (compact.includes("map(")) {
    return "这里在把一组材料逐个加工。看到 map，就想成“每张卷宗都按同一规则处理一遍”。";
  }
  if (compact.includes("filter(")) {
    return "这里在筛掉不符合条件的材料。它决定哪些证据能继续进入下一步。";
  }
  if (compact.includes("find(")) {
    return "这里是在清单里找目标记录。排障时要确认它找的是不是你以为的那一项。";
  }
  if (compact.includes("fetch(") || compact.includes("POST")) {
    return `这里把当前材料送到接口。下一步去 Network 看请求是否真的带着「${focus.input}」出门。`;
  }
  if (compact.includes("PUT") || compact.includes("PATCH")) {
    return `这里不是新建，而是在更新已有记录。验收时要看「${focus.output}」有没有覆盖到正确对象。`;
  }
  if (compact.includes("GET")) {
    return "这里是在向后端要数据。它能证明页面发起了读取，但还要看返回内容是否来自正确数据源。";
  }
  if (compact.includes("JSON.stringify")) {
    return `这里把页面状态打包成请求体。后端能收到什么字段，基本就由这一包决定。`;
  }
  if (compact.includes("response.ok")) {
    return "这里判断接口状态是否成功。它只能证明接口回应成功，不能单独证明数据已经保存。";
  }
  if (compact.includes("status(") || compact.includes("statusCode")) {
    return "这里给响应盖状态码印章。状态码是证据，但还要结合响应体和后端日志一起判断。";
  }
  if (compact.includes("response.json")) {
    return `这里把后端返回的内容读出来。页面后续能展示或继续传递的「${focus.output}」从这里来。`;
  }
  if (compact.includes("throw new Error") || compact.includes("catch")) {
    return "这里处理失败路径。真实工作里要看失败是否被清楚提示，而不是悄悄吞掉。";
  }
  if (compact.includes("setError")) {
    return "这里把失败原因显示给用户，是前端把接口错误翻译成人能看懂提示的地方。";
  }
  if (compact.includes("setStatus") || compact.includes("setLoading")) {
    return "这里更新页面状态灯。它改变用户看到的反馈，但不等于后端已经完成真实副作用。";
  }
  if (compact.includes("localStorage") || compact.includes("sessionStorage")) {
    return "这里把信息放进浏览器本地柜子。刷新可能还在，但它不是后端数据库证据。";
  }
  if (compact.includes("cookie") || compact.includes("Cookie")) {
    return "这里在处理浏览器门牌 Cookie。登录态排障时要确认它是否被保存、携带和过期。";
  }
  if (compact.includes("token") || compact.includes("Token")) {
    return "这里在处理身份令牌 Token。它能代表登录凭证，但要确认有没有暴露、过期或漏带。";
  }
  if (compact.includes("process.env") || compact.includes("import.meta.env")) {
    return "这里读取环境变量。AI API Key 这类秘密应该停在服务端，不能被打包进前端。";
  }
  if (compact.includes("INSERT") || compact.includes("db.run")) {
    return "这里才像真正写库：把数据刻进数据库。验收时要用查询或测试证明它真的执行过。";
  }
  if (compact.includes("SELECT") || compact.includes("db.get")) {
    return "这里是在查数据库。它能作为反证：如果查不到，前面的成功提示就不够可信。";
  }
  if (compact.includes("return res.status")) {
    return "这里是后端盖章返回结果。状态码会成为前端和 Network 里的关键证据。";
  }
  if (compact.startsWith("return ")) {
    return `这里把这一棒的结果交出去。回到流程里看，它应该交出「${focus.output}」。`;
  }
  if (compact.includes("logger.")) {
    return "这里把原因写进后端日志。页面看不到它，但排障时可以用它确认后端发生了什么。";
  }
  if (compact.includes("await ") || compact.includes("save")) {
    return `这里把事情交给下一层处理。要继续追踪，就沿着「${projectPosition ?? focus.functionName}」往后看证据。`;
  }
  if (compact.includes("const ") || compact.includes("let ")) {
    return `这里是在给一份数据起名字。先问：它来自「${focus.input}」里的哪一块，后面会不会变成「${focus.output}」。`;
  }
  if (compact.match(/^[\w${}\s,.]+,$/) && compact.includes(",")) {
    return `这里列出要一起交接的字段。逐个念变量名，确认它们能不能组成「${focus.input}」。`;
  }
  if (compact.match(/^\w+:\s*/)) {
    const fieldName = compact.split(":")[0];
    return `这里在给对象补上「${fieldName}」这一栏。读对象字段时，要问它后面会不会影响「${focus.output}」。`;
  }
  const callbackMatch = compact.match(/^([A-Za-z]\w*)\((.*)\);?$/);
  if (callbackMatch) {
    const [, callbackName, rawArgs] = callbackMatch;
    const args = rawArgs.trim() || "刚刚整理好的材料";
    if (callbackName.startsWith("on")) {
      return `这里调用「${callbackName}」，把「${args}」交给上一层或下一棒。它是这段代码真正交出结果的动作。`;
    }
    return `这里调用「${callbackName}」，让已经准备好的材料继续往后走。下一步要看它是否产出「${focus.output}」。`;
  }
  const methodMatch = compact.match(/\.(\w+)\(/);
  if (methodMatch) {
    return `这里调用「${methodMatch[1]}」方法处理当前材料。方法名通常会告诉你它是在保存、查询、筛选还是更新。`;
  }
  if (compact.includes("if ")) {
    return "这里是分岔口：条件成立走错误或特殊路径，不成立才继续主流程。";
  }
  if (compact.includes("};") || compact === "}" || compact === "});") {
    return "这里结束一个代码块，说明这一段交接已经收口。";
  }
  return `这一行要结合变量名读：它接在「${focus.input}」之后，目的仍然是交出「${focus.output}」。先标出名词，再沿流程找下一份证据。`;
}

function buildCodeHandoff(line: string, focus: CodeFocus) {
  const compact = line.trim();
  const empty = {
    receives: "上一行留下的上下文",
    action: "把代码分段",
    outputs: "更清楚的阅读节奏",
    proof: "没有业务动作发生",
  };
  if (!compact) return empty;
  if (compact.startsWith("//")) {
    return {
      receives: "读代码的人",
      action: "提示这一段的意图",
      outputs: "阅读方向",
      proof: "注释不会被程序执行",
    };
  }
  if (compact.match(/^import\s/)) {
    return {
      receives: "外部模块",
      action: "引入后面要用的工具",
      outputs: "当前文件可调用的名字",
      proof: "只证明依赖被引用，不证明业务执行",
    };
  }
  if (compact.includes("fetch(") || compact.includes("POST")) {
    return {
      receives: focus.input,
      action: "把材料送到后端接口",
      outputs: "Network 请求",
      proof: "打开 Network 看路径、方法、请求体和状态码",
    };
  }
  if (compact.includes("JSON.stringify")) {
    return {
      receives: "页面状态对象",
      action: "打包成请求体",
      outputs: "后端能收到的 JSON 字段",
      proof: "Network Payload 里能看到这些字段",
    };
  }
  if (compact.includes("response.ok")) {
    return {
      receives: "后端返回的 HTTP 状态",
      action: "判断这次接口回信是否成功",
      outputs: "成功或失败分支",
      proof: "只能证明接口回信成功，不能证明数据库已保存",
    };
  }
  if (compact.includes("response.json")) {
    return {
      receives: "后端响应体",
      action: "把 JSON 内容读出来",
      outputs: focus.output,
      proof: "看响应 body 和页面后续展示是否一致",
    };
  }
  if (compact.includes("INSERT") || compact.includes("db.run")) {
    return {
      receives: focus.input,
      action: "写入数据库",
      outputs: "持久化记录",
      proof: "用 SELECT、测试报告或刷新恢复证明记录存在",
    };
  }
  if (compact.includes("SELECT") || compact.includes("db.get")) {
    return {
      receives: "查询条件",
      action: "读取数据库",
      outputs: "数据库里的真实记录",
      proof: "查不到就是反证，说明前面的成功提示不够",
    };
  }
  if (compact.includes("return ")) {
    return {
      receives: "当前函数整理好的结果",
      action: "把结果交出去",
      outputs: focus.output,
      proof: "看调用方有没有收到并继续使用这个结果",
    };
  }
  if (compact.includes("const ") || compact.includes("let ")) {
    return {
      receives: focus.input,
      action: "给一份中间材料起名字",
      outputs: "后面可继续使用的变量",
      proof: "沿着变量名往下找它有没有被传走",
    };
  }
  return {
    receives: focus.input,
    action: "处理当前材料",
    outputs: focus.output,
    proof: "继续沿下一行、Network、日志或数据库找证据",
  };
}

function buildLineEvidenceAnchor(line: string, focus: CodeFocus) {
  const compact = line.trim();
  if (!compact) {
    return {
      why: "这一行只是留白，用来把代码分成更容易读的段落。",
      checkpoint: "继续读下一行，找真正发生交接的位置。",
      nextEvidence: "下一行代码",
    };
  }
  if (compact.startsWith("//")) {
    return {
      why: "注释像地图旁的标牌，告诉你作者希望读代码的人先看什么。",
      checkpoint: "它不执行业务动作，所以不能当作修复证据。",
      nextEvidence: "继续看注释下面的真实代码",
    };
  }
  if (compact.includes("fetch(") || compact.includes("POST")) {
    return {
      why: "这里是页面真正把材料送出门的瞬间，前端舞台开始把任务交给传送门。",
      checkpoint: `确认请求里有没有带上「${focus.input}」。`,
      nextEvidence: "Network 的 method、url、payload 和 status",
    };
  }
  if (compact.includes("response.ok")) {
    return {
      why: "这里解释了绿色成功提示为什么会亮：页面相信了 HTTP 状态码。",
      checkpoint: "记住它只能证明接口回信成功，不能证明数据库已经写入。",
      nextEvidence: "Network 状态码、后端日志、数据库 SELECT 结果",
    };
  }
  if (compact.includes("response.json")) {
    return {
      why: "这里把后端回信拆开，页面后面能展示什么就从这里来。",
      checkpoint: `核对响应体是否真的包含「${focus.output}」。`,
      nextEvidence: "Response body 和页面状态变化",
    };
  }
  if (compact.includes("JSON.stringify")) {
    return {
      why: "这里把页面状态打包成后端能读懂的信封。",
      checkpoint: "后端收不到的字段，不可能在后面凭空保存成功。",
      nextEvidence: "Network Payload",
    };
  }
  if (compact.includes("INSERT") || compact.includes("db.run")) {
    return {
      why: "这里才接近真正的落库动作，能把临时数据变成可刷新恢复的记录。",
      checkpoint: "写库之后必须能被查询或测试再次证明。",
      nextEvidence: "SQLite SELECT、测试报告、刷新后列表",
    };
  }
  if (compact.includes("SELECT") || compact.includes("db.get")) {
    return {
      why: "这里是在向数据库要事实，不再只看页面怎么说。",
      checkpoint: "查不到就是强反证：前面的成功提示不够可信。",
      nextEvidence: "查询行数和返回记录",
    };
  }
  if (compact.includes("return ")) {
    return {
      why: "这里是当前函数把结果交出去的收口动作。",
      checkpoint: `看调用方是否继续拿到「${focus.output}」。`,
      nextEvidence: "调用方代码、响应体或页面展示",
    };
  }
  if (compact.includes("const ") || compact.includes("let ")) {
    return {
      why: "这里给中间材料起名字，方便你沿着变量继续追踪。",
      checkpoint: "不要停在变量名上，继续看它有没有被传给下一层。",
      nextEvidence: "后续使用这个变量的行",
    };
  }
  if (compact.includes("setStatus") || compact.includes("setLoading")) {
    return {
      why: "这里改变的是用户看到的状态灯。",
      checkpoint: "状态灯属于界面反馈，不等于真实副作用。",
      nextEvidence: "后端响应、数据库记录或测试结果",
    };
  }
  return {
    why: "这一行在处理当前材料，要把它放回上一棒和下一棒之间理解。",
    checkpoint: `继续判断它是否帮助产出「${focus.output}」。`,
    nextEvidence: "下一行代码和后续运行证据",
  };
}

function buildCodeEvidenceMentorCards(
  activeLine: string,
  focus: CodeFocus,
  anchor: ReturnType<typeof buildLineEvidenceAnchor>,
) {
  const compact = activeLine.trim();
  const runtimeEvidence =
    compact.includes("response.ok") || compact.includes("fetch(")
      ? "Network 里的 method、payload、status 和 response body"
      : compact.includes("INSERT") ||
          compact.includes("SELECT") ||
          compact.includes("db.")
        ? "数据库查询结果和测试报告"
        : compact.includes("catch") ||
            compact.includes("throw") ||
            compact.includes("logger")
          ? "后端日志、错误响应和失败路径测试"
          : "Network、日志、数据库或测试结果";

  return [
    {
      label: "这行代码能帮你",
      title: focus.observationGoal,
      body: `先把它放回「${focus.input} → ${focus.output}」这条交接链里，只判断这一棒发生了什么。`,
    },
    {
      label: "这行代码还不能",
      title: "不能单独当作修复完成",
      body: `代码长得对，不等于真实运行已经对。下一步要看 ${runtimeEvidence}。`,
    },
    {
      label: "下一步追证据",
      title: anchor.nextEvidence,
      body: anchor.checkpoint,
    },
  ];
}

function splitProjectPosition(position?: string) {
  return (position ?? "")
    .split(/\s*→\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getCodeTourGuide(step: TeachingStep) {
  if (step.id.startsWith("c2-")) {
    return {
      name: "传送门书记官",
      role: "产品链路带读官",
      image: portalScribePortrait,
      line: "我会把这几行代码翻成一张交接单：用户输入先交给谁，Brief 又被送到哪里。",
    };
  }
  if (step.id.startsWith("case-03") || step.id.includes("login")) {
    return {
      name: "身份回廊守卫",
      role: "登录态带读官",
      image: identityGuardPortrait,
      line: "别急着背 Cookie 和 Token，先看这几行有没有把身份凭证交到下一扇门。",
    };
  }
  if (step.id.startsWith("case-04") || step.id.includes("api")) {
    return {
      name: "审判庭书记员",
      role: "接口证据带读官",
      image: apiClerkPortrait,
      line: "状态码只是判词的一角，真正要读的是请求、响应和日志怎样互相作证。",
    };
  }
  if (step.id.startsWith("case-05") || step.id.includes("consistency")) {
    return {
      name: "幂等石灵",
      role: "一致性带读官",
      image: idempotencyStonePet,
      line: "重复点击会把同一份委托敲出多份影子，我们要找后端有没有守住唯一证据。",
    };
  }
  if (step.id.startsWith("case-07") || step.id.includes("ai")) {
    return {
      name: "模型熔炉执钥人",
      role: "AI 接入带读官",
      image: modelWardenPortrait,
      line: "读 AI 代码时先找密钥、边界和失败兜底，别被流畅输出晃过去。",
    };
  }
  return {
    name: "档案馆记录员",
    role: "代码证据带读官",
    image: archiveKeeperPortrait,
    line: "我只带你看当前几行：上一棒交来了什么，这几行处理了什么，又把证据交给谁。",
  };
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
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const focus = step.codeFocus;

  if (!focus) {
    return (
      <section className="teaching-shell">
        <p>无效的代码导读步骤</p>
      </section>
    );
  }

  const flowParts = splitProjectPosition(step.projectPosition);
  const guide = getCodeTourGuide(step);
  const canProve = focus.observationGoal;
  const cannotProve = `这几行不能单独证明「${focus.output}」已经在真实环境发生。还要继续看 Network、后端日志、数据库记录或测试结果。`;
  const agentBrief = `请只围绕 ${focus.filePath} 的 ${focus.functionName} 检查「${step.projectPosition ?? step.goal}」：输入是「${focus.input}」，输出应该是「${focus.output}」。请说明这几行能证明什么、不能证明什么，并给出下一步验收证据。`;
  const activeLine = focus.lines[activeLineIndex] ?? "";
  const activeLineNumber = activeLineIndex + 1;
  const activeHandoff = buildCodeHandoff(activeLine, focus);
  const activeEvidenceAnchor = buildLineEvidenceAnchor(activeLine, focus);
  const evidenceMentorCards = buildCodeEvidenceMentorCards(
    activeLine,
    focus,
    activeEvidenceAnchor,
  );

  return (
    <section className="teaching-shell code-tour-shell">
      <header className="teaching-header">
        <span className="mini-label">
          教学模式 · 引导式阅读 {stepIndex + 1}/{totalSteps}
        </span>
        <h2>{step.title}</h2>
        <p className="tour-goal">{step.goal}</p>
      </header>

      <div className="code-guide-board" aria-label="代码巡读官">
        <img src={guide.image} alt={guide.name} />
        <div>
          <span>{guide.role}</span>
          <strong>这一页只读当前几行，不把整座项目一次塞进脑子。</strong>
          <p>{guide.line}</p>
        </div>
        <ol aria-label="代码阅读顺序">
          <li>抓输入</li>
          <li>看关键行</li>
          <li>找反证</li>
        </ol>
      </div>

      <div className="code-mentor-dialogue" aria-label="本页导师台词">
        <span>{guide.name}</span>
        <p>
          “先把这段代码当成剧情里的交接镜头：上一棒交来「{focus.input}
          」，这一段必须交出「{focus.output}
          」。如果交接没发生，后面的绿色提示都只是舞台灯。”
        </p>
      </div>

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

      <section className="tour-handoff-card" aria-label="谁把什么交给谁">
        <header>
          <span>先看懂这一步</span>
          <strong>谁把什么交给谁</strong>
        </header>
        <div className="tour-handoff-route">
          <span>{flowParts[0] ?? "上一棒"}</span>
          <ArrowRight size={16} aria-hidden="true" />
          <span className="active">当前代码</span>
          <ArrowRight size={16} aria-hidden="true" />
          <span>{flowParts.at(-1) ?? "下一棒"}</span>
        </div>
        <p>
          <b>{flowParts[0] ?? "上一棒"}</b> 把「{focus.input}
          」交给当前代码；当前代码处理后， 要继续交出「{focus.output}
          」。如果这两次交接没有证据，页面上的成功提示还不能算通关。
        </p>
      </section>

      <section
        className="tour-current-line-contract"
        aria-label="当前只读这一行"
      >
        <header>
          <span>
            当前只读这一行 · {activeLineNumber}/{focus.lines.length}
          </span>
          <strong>{activeLine.trim() || "空行：这一行只是分隔上下文"}</strong>
        </header>
        <div className="current-line-mission">
          <article>
            <span>收到</span>
            <p>{activeHandoff.receives}</p>
          </article>
          <article>
            <span>处理</span>
            <p>{activeHandoff.action}</p>
          </article>
          <article>
            <span>交出</span>
            <p>{activeHandoff.outputs}</p>
          </article>
        </div>
        <dl>
          <div>
            <dt>为什么看</dt>
            <dd>{activeEvidenceAnchor.why}</dd>
          </div>
          <div>
            <dt>下一证据</dt>
            <dd>{activeEvidenceAnchor.nextEvidence}</dd>
          </div>
        </dl>
        <p className="line-reading-rule">
          <b>不要现在读全文件：</b>
          先判断这一行把哪份材料交给谁，再点下一行。等每一行都能说出交接关系，再展开完整文件复盘。
        </p>
      </section>

      <section className="code-evidence-mentor" aria-label="代码证据导师卡">
        <header>
          <span>代码证据导师卡</span>
          <strong>读懂这一行以后，马上问：它能证明到哪一步？</strong>
        </header>
        <div>
          {evidenceMentorCards.map((card) => (
            <article key={card.label}>
              <span>{card.label}</span>
              <strong>{card.title}</strong>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <p>
          规则：代码是线索，不是结案书。只有把代码线索接到运行证据上，才算真正学会排障。
        </p>
      </section>

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
          {showFullFile
            ? "完整文件"
            : `第 ${activeLineIndex + 1}/${focus.lines.length} 行`}
          ）
          <button
            className="v2-button ghost"
            type="button"
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
          <>
            <div className="code-focus-block">
              <div className="code-focus-header">
                <span>{focus.filePath}</span>
                <b>
                  第 {activeLineIndex + 1} 行 / {focus.lines.length}
                </b>
              </div>
              <pre>
                <code className="hl">
                  <span className="line-num">
                    {String(activeLineIndex + 1).padStart(2, " ")}
                  </span>
                  {activeLine || " "}
                </code>
              </pre>
            </div>
            <div className="code-line-stepper" aria-label="逐行读码控制">
              <button
                className="v2-button ghost"
                type="button"
                disabled={activeLineIndex === 0}
                aria-label="上一行"
                onClick={() =>
                  setActiveLineIndex((index) => Math.max(0, index - 1))
                }
              >
                <ChevronLeft size={16} />
                上一行
              </button>
              <span>读懂第 {activeLineIndex + 1} 行，再把它交给下一棒</span>
              <button
                className="v2-button ghost"
                type="button"
                disabled={activeLineIndex === focus.lines.length - 1}
                aria-label="下一行"
                onClick={() =>
                  setActiveLineIndex((index) =>
                    Math.min(focus.lines.length - 1, index + 1),
                  )
                }
              >
                下一行
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="tour-section tour-line-notes">
        <h3>
          <Lightbulb size={16} />
          逐行翻译：第 {activeLineIndex + 1} 行，先看人话，再看语法
        </h3>
        <article>
          <code>{String(activeLineIndex + 1).padStart(2, "0")}</code>
          <p>{explainCodeLine(activeLine, focus, step.projectPosition)}</p>
          <div className="line-evidence-anchor" aria-label="当前行证据锚点">
            <div>
              <span>为什么看这一行</span>
              <strong>{activeEvidenceAnchor.why}</strong>
            </div>
            <div>
              <span>检查点</span>
              <strong>{activeEvidenceAnchor.checkpoint}</strong>
            </div>
            <div>
              <span>下一份证据</span>
              <strong>{activeEvidenceAnchor.nextEvidence}</strong>
            </div>
          </div>
          <dl className="line-handoff-card" aria-label="读码交接单">
            <div>
              <dt>收到</dt>
              <dd>{activeHandoff.receives}</dd>
            </div>
            <div>
              <dt>动作</dt>
              <dd>{activeHandoff.action}</dd>
            </div>
            <div>
              <dt>交出</dt>
              <dd>{activeHandoff.outputs}</dd>
            </div>
            <div>
              <dt>证明</dt>
              <dd>{activeHandoff.proof}</dd>
            </div>
          </dl>
        </article>
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
function RemediationLessonView({ lesson }: { lesson: RemediationLesson }) {
  return (
    <div className="remediation-lesson-body">
      <p className="remediation-summary">{lesson.summary}</p>
      <dl className="remediation-notes">
        {lesson.notes.map((note) => (
          <div key={note.label}>
            <dt>{note.label}</dt>
            <dd>{note.detail}</dd>
          </div>
        ))}
      </dl>
      {lesson.sequence && lesson.sequence.length > 0 && (
        <div className="remediation-sequence">
          <strong>按这个顺序再看一遍</strong>
          <ol>
            {lesson.sequence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      )}
      <p className="remediation-takeaway">
        <Lightbulb size={16} />
        <span>
          <b>这一小课只记一句：</b>
          {lesson.takeaway}
        </span>
      </p>
    </div>
  );
}

function StepRemediation({
  step,
  onRemediation,
}: {
  step: TeachingStep;
  onRemediation: (trigger: string) => void;
}) {
  const [showPanel, setShowPanel] = useState(false);
  const [completedLesson, setCompletedLesson] = useState<string | null>(null);
  const selectedLesson = step.remediation?.find(
    (item) => item.trigger === completedLesson,
  );
  const remediationOpen = showPanel || Boolean(selectedLesson);

  useEffect(() => {
    if (!remediationOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [remediationOpen]);

  if (!step.remediation || step.remediation.length === 0) return null;

  return (
    <div className="remediation-block">
      {!showPanel && !completedLesson && (
        <button
          className="v2-button ghost remediation-trigger"
          type="button"
          onClick={() => setShowPanel(true)}
        >
          <HelpCircle size={16} />
          我有点卡住，需要补课
        </button>
      )}

      {showPanel && !completedLesson && (
        <div className="remediation-overlay">
          <div
            className="remediation-panel"
            role="dialog"
            aria-modal="true"
            aria-label="选择补课方向"
          >
            <header className="remediation-dialog-head">
              <div>
                <span>学习急救站</span>
                <strong>现在卡在哪一步？</strong>
              </div>
              <button
                className="remediation-close"
                type="button"
                aria-label="关闭补课"
                title="关闭补课"
                onClick={() => setShowPanel(false)}
              >
                <X size={18} />
              </button>
            </header>
            <p>选最接近的一项就好。补课不会扣分，也不会影响通关。</p>
            <div className="remediation-options">
              {step.remediation.map((r) => (
                <button
                  key={r.trigger}
                  className="v2-button remediation-option-btn"
                  type="button"
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
              type="button"
              onClick={() => setShowPanel(false)}
            >
              先回到当前内容
            </button>
          </div>
        </div>
      )}

      {selectedLesson && (
        <div className="remediation-overlay">
          <div
            className="remediation-micro-lesson"
            role="dialog"
            aria-modal="true"
            aria-label={`补课：${selectedLesson.label}`}
          >
            <header>
              <Lightbulb size={18} />
              <div>
                <span>补课卷轴</span>
                <strong>{selectedLesson.label}</strong>
              </div>
              <button
                className="remediation-close"
                type="button"
                aria-label="关闭补课"
                title="关闭补课"
                onClick={() => {
                  setCompletedLesson(null);
                  setShowPanel(false);
                }}
              >
                <X size={18} />
              </button>
            </header>
            <RemediationLessonView lesson={selectedLesson.microLesson} />
            <footer>
              <button
                className="v2-button ghost"
                type="button"
                onClick={() => {
                  setCompletedLesson(null);
                  setShowPanel(true);
                }}
              >
                换一个卡点
              </button>
              <button
                className="v2-button primary"
                type="button"
                onClick={() => {
                  setCompletedLesson(null);
                  setShowPanel(false);
                }}
              >
                <Check size={16} /> 带着这句话继续
              </button>
            </footer>
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
                  microLesson: {
                    summary:
                      "把四份证据按时间排好，就能看到成功提示和真正入库不是一回事。",
                    notes: [
                      {
                        label: "页面成功",
                        detail:
                          "来自路由返回 201，只能证明前端收到了成功回信。",
                      },
                      {
                        label: "数据库 0 行",
                        detail:
                          "说明 INSERT 没有发生，这是比成功提示更接近根因的反证。",
                      },
                      {
                        label: "刷新后为空",
                        detail: "刷新读取 SQLite，而刚才的数据只留在内存数组。",
                      },
                    ],
                    sequence: [
                      "先确认前端为什么显示成功。",
                      "再用数据库查询检查成功有没有真实副作用。",
                      "最后用刷新复测确认读取路径是否能拿回数据。",
                    ],
                    takeaway:
                      "写入走内存、读取走数据库，所以表面成功无法经受刷新复测。",
                  },
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
  workBackground,
  onComplete,
}: {
  attemptId: string;
  scenario: TeachingScenario;
  developer: DeveloperProfile;
  workBackground?: string;
  onComplete: () => void;
}) {
  // 从服务端恢复教学进度
  const teachingScenarioId = normalizeScenarioId(scenario.scenarioId);
  const storyProgressStepId = getStoryProgressStepId(teachingScenarioId);
  const [progress, setProgress] = useState<TeachingApiProgress[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [storyQuestComplete, setStoryQuestComplete] = useState(false);
  const [completedStepTransition, setCompletedStepTransition] = useState<
    number | null
  >(null);

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
        if (mapped.some((p) => p.completed)) {
          setShowIntro(false);
          setStoryQuestComplete(true);
        } else if (mapped.some((p) => p.stepId === storyProgressStepId)) {
          setShowIntro(false);
        }

        // 找到第一个未完成的步骤
        const firstIncomplete = scenario.steps.findIndex(
          (step) => !mapped.find((p) => p.stepId === step.id && p.completed),
        );
        if (firstIncomplete >= 0) {
          setCurrentStepIdx(firstIncomplete);
        } else if (scenario.steps.length > 0) {
          setCurrentStepIdx(scenario.steps.length - 1);
          setShowCelebration(true);
        }
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
  }, [attemptId, scenario.steps, storyProgressStepId]);

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
    async (stepId: string, response?: unknown, completed = true) => {
      setSaving(true);
      try {
        await api(`/api/attempts/${attemptId}/teaching/${stepId}`, {
          method: "PATCH",
          body: JSON.stringify({
            response: response ?? {},
            completed,
          }),
        });
        return true;
      } catch (cause) {
        setError(String(cause));
        return false;
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
      setShowIntro(true);
      setStoryQuestComplete(false);
      setCompletedStepTransition(null);
    } catch (cause) {
      setError(String(cause));
    } finally {
      setResetting(false);
    }
  }, [attemptId, setShowIntro, setStoryQuestComplete]);

  const completeStep = useCallback((idx: number) => {
    setCompletedStepTransition(idx);
  }, []);

  const continueAfterEvidence = useCallback(
    async (activeRecall?: string) => {
      if (completedStepTransition === null) return;
      const completedStep = scenario.steps[completedStepTransition];
      if (!completedStep) return;
      const saved = await saveProgress(completedStep.id, {
        completed: true,
        ...(activeRecall ? { activeRecall } : {}),
      });
      if (!saved) return;
      if (completedStepTransition + 1 < scenario.steps.length) {
        setCurrentStepIdx(completedStepTransition + 1);
      } else {
        setShowCelebration(true);
      }
      setCompletedStepTransition(null);
    },
    [completedStepTransition, saveProgress, scenario.steps],
  );

  const isCanvasStorm = teachingScenarioId === "case-002";
  const isJavaLayered = teachingScenarioId === "java-layered-request";
  const isJavaTransaction =
    teachingScenarioId === "java-transaction-consistency";
  const isJavaCache = teachingScenarioId === "java-cache-observability";
  const isJavaIncident = teachingScenarioId === "java-production-incident";
  const isJavaRelease = teachingScenarioId === "java-release-harbor";
  const isFrontendAccessibility =
    teachingScenarioId === "frontend-accessibility-proof";
  const isFrontendTesting = teachingScenarioId === "frontend-testing-proof";
  const isFrontendPerformance =
    teachingScenarioId === "frontend-performance-proof";
  const isFrontendComponent = teachingScenarioId === "frontend-component-state";
  const isFrontendRequestStates =
    teachingScenarioId === "frontend-request-states";
  const isJavaRouteScenario =
    isJavaLayered ||
    isJavaTransaction ||
    isJavaCache ||
    isJavaRelease ||
    isJavaIncident;
  const isFrontendRouteScenario =
    isFrontendComponent ||
    isFrontendRequestStates ||
    isFrontendPerformance ||
    isFrontendAccessibility ||
    isFrontendTesting;
  const isLoginState = teachingScenarioId === "case-003-login-state";
  const isApiError = teachingScenarioId === "case-004-api-error";
  const isConsistency = teachingScenarioId === "case-005-data-consistency";
  const isPerformance = teachingScenarioId === "case-006-performance";
  const isAiApi = teachingScenarioId === "case-007-ai-api";
  const isHallucination = teachingScenarioId === "case-008-hallucination";
  const isRag = teachingScenarioId === "case-009-rag";
  const isAgentTools = teachingScenarioId === "case-010-agent-tools";
  const isTestingProof = teachingScenarioId === "case-011-testing-proof";
  const isAgentBrief = teachingScenarioId === "case-012-agent-brief";
  const isDeliveryReview = teachingScenarioId === "case-013-delivery-review";
  const isReleaseReadiness =
    teachingScenarioId === "case-014-release-readiness";
  const isInterviewReview = teachingScenarioId === "case-015-interview-review";
  const isStoryQuestScenario =
    isFrontendComponent ||
    isFrontendRequestStates ||
    isJavaLayered ||
    isJavaTransaction ||
    isJavaCache ||
    isFrontendPerformance ||
    isFrontendAccessibility ||
    isFrontendTesting ||
    isJavaRelease ||
    isJavaIncident ||
    teachingScenarioId === "canvas-save-persistence" ||
    isCanvasStorm ||
    isLoginState ||
    isApiError ||
    isConsistency ||
    isPerformance ||
    isAiApi ||
    isHallucination ||
    isRag ||
    isAgentTools ||
    isTestingProof ||
    isAgentBrief ||
    isDeliveryReview ||
    isReleaseReadiness ||
    isInterviewReview;
  const chapterCinematic = resolveChapterCinematic(teachingScenarioId);
  const introCameraShot = getChapterShot(teachingScenarioId, 0);
  const storyScenes = isFrontendTesting
    ? frontendTestingScenes
    : isFrontendAccessibility
      ? accessibilityScenes
      : isJavaIncident
        ? javaIncidentScenes
        : isJavaRelease
          ? javaReleaseScenes
          : isFrontendPerformance
            ? frontendPerformanceScenes
            : isJavaCache
              ? javaCacheScenes
              : isJavaTransaction
                ? javaTransactionScenes
                : isFrontendRequestStates
                  ? getFrontendRequestStatesScenes()
                  : isFrontendComponent
                    ? frontendComponentScenes
                    : isJavaLayered
                      ? javaLayeredScenes
                      : isCanvasStorm
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
  const savedStoryProgress = progress.find(
    (item) => item.stepId === storyProgressStepId && !item.completed,
  );
  const initialStoryProgress = parseStoryProgress(
    savedStoryProgress?.teachingResponse,
    Math.max(storyScenes.length - 1, 0),
  );
  const storyJourney = isFrontendTesting
    ? frontendTestingJourney
    : isFrontendAccessibility
      ? accessibilityJourney
      : isJavaIncident
        ? javaIncidentJourney
        : isJavaRelease
          ? releaseReadinessJourney
          : isFrontendPerformance
            ? performanceJourney
            : isJavaCache
              ? javaCacheJourney
              : isJavaTransaction
                ? consistencyJourney
                : isFrontendRequestStates
                  ? frontendRequestStatesJourney
                  : isFrontendComponent
                    ? frontendComponentJourney
                    : isJavaLayered
                      ? javaLayeredJourney
                      : isCanvasStorm
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
  const storyRouteLabel = isFrontendTesting
    ? "前端交付从失败复现到回归验收的证据路线"
    : isFrontendAccessibility
      ? "前端页面从语义、键盘到移动端回归的证据路线"
      : isJavaIncident
        ? "Java 线上事故从报警到回滚复盘的证据路线"
        : isJavaRelease
          ? "Java 服务从交付到健康检查和回滚的证据路线"
          : isFrontendPerformance
            ? "前端首屏从资源到渲染的性能证据路线"
            : isJavaCache
              ? "缓存从请求到数据库和复测的证据路线"
              : isJavaTransaction
                ? "订单从请求到事务回滚的证据路线"
                : isFrontendRequestStates
                  ? "前端点击从组件状态到页面反馈的路线"
                  : isJavaLayered
                    ? "Java 请求从客户端到数据库的分层路线"
                    : isCanvasStorm
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
  const routeFamilyLabel = isFrontendRouteScenario
    ? "前端工程成长路线"
    : isJavaRouteScenario
      ? "Java 后端成长路线"
      : "AI 应用开发主线";

  if (showIntro) {
    const introConfig = isFrontendTesting
      ? {
          badge: "前端工程 · 第 5 关",
          title: "回归试炼场：绿色报告真的可信吗",
          desc: "测试报告亮起绿灯，但审查官发现它可能对应旧代码。你要重新确认前端交付是否真的可靠。",
          copy: "你会从失败复现开始，经过组件边界、请求集成、浏览器手动复测和回归风险，最后决定这份前端交付是接收还是退回。",
          evidence: [
            ["复现", "旧故障红灯"],
            ["回归", "浏览器路径"],
            ["审查", "源码指纹 + 风险"],
          ],
          bg: verificationTrialArenaScene,
        }
      : isFrontendAccessibility
        ? {
            badge: "前端工程 · 第 4 关",
            title: "无障碍交付庭：漂亮的页面是否真的可用",
            desc: "审查官不只看页面截图，还要确认键盘、读屏、焦点、对比度和小屏用户能不能完成任务。",
            copy: "你会从语义按钮和表单标签开始，沿着键盘操作、读屏反馈、焦点可见性和 390px 移动端回归走一遍。每个判断都要落到证据，而不是一句‘看起来没问题’。",
            evidence: [
              ["语义", "button + label"],
              ["操作", "键盘 + focus"],
              ["验收", "390px + 回归"],
            ],
            bg: verificationTrialArenaScene,
          }
        : isJavaIncident
          ? {
              badge: "Java 后端 · 第 5 关",
              title: "事故回声塔：线上故障怎样从日志走到决定",
              desc: "报警塔同时亮起错误率和延迟两盏红灯。你要先判断影响，再决定止血、回滚和如何证明恢复。",
              copy: "你会从监控报警走到 requestId、结构化日志、稳定版本、回滚和恢复复测。每个决定都要有证据，不能把‘重启一下’当成排障方案。",
              evidence: [
                ["信号", "错误率 + P95"],
                ["时间线", "requestId + release"],
                ["退路", "rollback + smoke test"],
              ],
              bg: signalStormDispatchTowerScene,
            }
          : isJavaRelease
            ? {
                badge: "Java 后端 · 第 4 关",
                title: "上线港：服务上线前如何留退路",
                desc: "上线守门人不会因为构建成功就开闸，你要证明配置、健康检查、监控和回滚都已经准备好。",
                copy: "你会从上线计划走到环境配置、备份、冒烟、监控和回滚条件。每一道门都要有证据，不能只写一句‘已部署’。",
                evidence: [
                  ["配置", "secret + feature flag"],
                  ["信号", "health + monitoring"],
                  ["退路", "backup + rollback"],
                ],
                bg: releaseReadinessGateScene,
              }
            : isFrontendPerformance
              ? {
                  badge: "前端工程 · 第 3 关",
                  title: "首屏观测塔：页面为什么慢",
                  desc: "观测塔的首屏被资源、接口和渲染三种等待叠在一起，用户只看到一个转圈。",
                  copy: "你会用瀑布图看资源和接口，用 TTFB 判断服务端等待，再用渲染画像确认是不是页面一次摆了太多内容。每个判断都要有证据。",
                  evidence: [
                    ["资源", "Network waterfall"],
                    ["接口", "TTFB + server timing"],
                    ["验收", "移动端复测"],
                  ],
                  bg: performanceObservatoryScene,
                }
              : isJavaCache
                ? {
                    badge: "Java 后端 · 第 3 关",
                    title: "缓存风廊：为什么用户读到旧数据",
                    desc: "缓存精灵把旧版本递给了用户。你要用命中日志、数据库版本和 TTL 找到真正的断点。",
                    copy: "你会沿着一次读取走过缓存、数据库和异步刷新，先理解缓存命中与失效，再用时间线判断是旧缓存、慢查询还是任务尚未完成。",
                    evidence: [
                      ["入口", "GET /projects/:id"],
                      ["分岔", "cache hit / DB miss"],
                      ["验收", "TTL + 版本复测"],
                    ],
                    bg: performanceObservatoryScene,
                  }
                : isJavaTransaction
                  ? {
                      badge: "Java 后端 · 第 2 关",
                      title: "事务熔炉：两张表不能只成功一张",
                      desc: "订单已经写入，库存却没有扣除。你要找出事务、幂等和唯一约束分别守哪一扇门。",
                      copy: "你会跟着重复下单和中途失败两条路径，先看请求和日志，再对比数据库前后状态。最后用失败复测证明系统没有留下半成品。",
                      evidence: [
                        ["请求", "重复 POST + 幂等键"],
                        ["异常", "订单有 / 库存无"],
                        ["验收", "回滚 + count(*)"],
                      ],
                      bg: idempotencyForgeScene,
                    }
                  : isFrontendRequestStates
                    ? {
                        badge: "前端工程 · 第 2 关",
                        title: "表单传送厅：错误怎样被用户看懂",
                        desc: "传送厅只有一盏成功灯，用户分不清请求正在路上、已经失败还是可以重试。",
                        copy: "你会跟着一次提交走过 loading、Network 响应、错误体和页面反馈。每一站都会解释名词，并用 201、503、超时和键盘可见性证明状态机是否真的诚实。",
                        evidence: [
                          ["起点", "click → loading"],
                          ["分岔", "201 / 503 / timeout"],
                          ["验收", "错误反馈 + 重试"],
                        ],
                        bg: apiErrorCourtScene,
                      }
                    : isFrontendComponent
                      ? {
                          badge: "前端工程 · 第 1 关",
                          title: "按钮为什么一点击就乱跳",
                          desc: "组件剧场的状态灯提前亮了，用户看到成功，Network 却返回了失败。到底谁应该决定页面显示什么？",
                          copy: "你会跟着一次点击走过事件处理、状态所有者、请求结果和重新渲染。每一站都解释名词，并用 200/503、浏览器日志和关键代码证明页面为什么会显示成现在这样。",
                          evidence: [
                            ["起点", "click → loading"],
                            ["分岔", "200 success / 503 error"],
                            ["验收", "双路径交互测试"],
                          ],
                          bg: questStage,
                        }
                      : isJavaLayered
                        ? {
                            badge: "Java 后端 · 第 1 章",
                            title: "请求为什么要经过三层",
                            desc: "一封用户请求抵达服务塔，却被发现绕过了业务层。Controller、Service、Repository 到底各自守什么门？",
                            copy: "你会跟着同一封请求从客户端走进 Controller，再交给 Service 做业务判断，接着由 Repository 查询数据库，最后沿原路返回。每到一层都会解释名词、展示证据，并告诉你这一层不能越过什么边界。",
                            evidence: [
                              ["入口", "GET /api/users/u-17"],
                              ["接力", "Controller → Service → Repository"],
                              ["验收", "权限失败路径 + 日志证据"],
                            ],
                            bg: questPortal,
                          }
                        : isCanvasStorm
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
                                bg: identityCorridorScene,
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
                                  bg: apiErrorCourtScene,
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
                                    bg: idempotencyForgeScene,
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
                                      bg: performanceObservatoryScene,
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
                                        bg: modelKeyForgeScene,
                                      }
                                    : isHallucination
                                      ? {
                                          badge: "主线 1-8",
                                          title: "幻觉镜厅：AI 回复为什么胡说",
                                          desc: "AI 回答得很顺，但没有引用来源。它到底是根据资料回答，还是在补全空白？",
                                          copy: "这一关把“AI 胡说”拆成工程路线：用户问题先写成 Prompt 委托，后端把带编号的资料片段放进 context，模型输出 answer、citations 和 confidence，服务端再校验引用是否真的来自本轮资料。最后你要能证明：有资料时能答，没资料时不编。",
                                          evidence: [
                                            ["委托", "grounded Prompt"],
                                            [
                                              "证物",
                                              "context chunks + citations",
                                            ],
                                            ["验收", "无资料时拒答"],
                                          ],
                                          bg: hallucinationMirrorScene,
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
                                            bg: ragKnowledgeMazeScene,
                                          }
                                        : isAgentTools
                                          ? {
                                              badge: "主线 1-10",
                                              title:
                                                "工具契约大厅：Agent 工具调用",
                                              desc: "Agent 想替你查数据、调接口、执行动作。它能做事，但每一步都必须先验明工具、参数、权限和失败回退。",
                                              copy: "这一关把 Agent 工具调用拆成一条安全路线：用户目标先变成 Agent 计划，Agent 只能选择注册表里的工具；工具执行前先校验参数 schema，再检查当前用户和环境权限；合法调用才执行，失败时返回结构化错误和 requestId。最后你要能证明：正常调用有结果，坏参数被拦，越权动作被拒绝。",
                                              evidence: [
                                                ["工具", "tool registry"],
                                                ["门禁", "schema + permission"],
                                                [
                                                  "回退",
                                                  "TOOL_FAILED + requestId",
                                                ],
                                              ],
                                              bg: agentToolContractHallScene,
                                            }
                                          : isTestingProof
                                            ? {
                                                badge: "主线 1-11",
                                                title:
                                                  "验收试炼场：测试怎么证明修好了",
                                                desc: "验收试炼官拦在门前：Agent 说修好了还不够。你要能拿出复现、自动化测试、手动报告和回归风险，证明交付可信。",
                                                copy: "这一关把测试验收拆成一条证据路线：先把旧故障写成能失败的复现用例，再用单元测试守住关键函数，用集成测试证明模块交接没有掉东西，最后从真实入口生成手动测试报告，并说明哪些风险已经覆盖、哪些还没有。最后你要能写出一份让 Agent、同事和面试官都能复核的验收证据。",
                                                evidence: [
                                                  ["复现", "red → green"],
                                                  [
                                                    "自动化",
                                                    "unit + integration",
                                                  ],
                                                  [
                                                    "报告",
                                                    "generatedAt + fingerprint",
                                                  ],
                                                ],
                                                bg: verificationTrialArenaScene,
                                              }
                                            : isAgentBrief
                                              ? {
                                                  badge: "主线 1-12",
                                                  title:
                                                    "委托书工坊：Agent 任务怎么写",
                                                  desc: "委托书锻造师把空白契约推到你面前：你不是把愿望丢给 Agent，而是把现场、目标、边界、验收和风险锻造成一份可执行委托。",
                                                  copy: "这一关把 Agent 任务拆成五段：先交代问题现场和已有证据，再写出可观察目标；然后划定范围和禁止事项，写清验收命令、浏览器路径和可见结果；最后补上风险、未覆盖项和回滚思路。最后你要能证明：这份任务让 Agent 知道做什么、不做什么、怎么证明做完，并把“我会指挥 Agent 做项目”整理成能讲给面试官听的复盘。",
                                                  evidence: [
                                                    ["背景", "现象 + 证据"],
                                                    [
                                                      "边界",
                                                      "scope + constraints",
                                                    ],
                                                    [
                                                      "验收",
                                                      "verify + browser path",
                                                    ],
                                                  ],
                                                  bg: agentBriefForgeScene,
                                                }
                                              : isDeliveryReview
                                                ? {
                                                    badge: "主线 1-13",
                                                    title:
                                                      "交付审查庭：怎么审查 Agent 交付",
                                                    desc: "Agent 说“已完成”只是开庭铃声。你要审说明、看 Diff、核测试、追边界，再决定接收还是要求补证。",
                                                    copy: "这一关把交付审查拆成六步：先读交付说明，确认它覆盖摘要、验证和风险；再用 Diff 核对改动范围；接着查看自动化和浏览器证据，补上移动端、刷新、旧章节等边界；最后检查 README、HANDOFF、任务表和 changelog 是否同步。你要能把“我觉得不行”改写成“缺这几份证据”。",
                                                    evidence: [
                                                      ["说明", "delivery note"],
                                                      ["证物", "diff + tests"],
                                                      [
                                                        "决定",
                                                        "accept / request changes",
                                                      ],
                                                    ],
                                                    bg: deliveryReviewCourtScene,
                                                  }
                                                : isReleaseReadiness
                                                  ? {
                                                      badge: "主线 1-14",
                                                      title:
                                                        "上线前夜：上线前检查什么",
                                                      desc: "上线守门人挡在城门前：交付通过不等于可以开门。上线前要核计划、环境变量、备份、冒烟测试、监控和回滚，确保出事能发现、能退、能保护数据。",
                                                      copy: "这一关把上线拆成一条工程路线：先写上线计划和影响范围，再核生产环境变量、密钥和功能开关；如果碰到数据变更，就确认备份和恢复步骤；上线前走桌面和 390px 冒烟测试，上线后看错误率、接口耗时和关键业务成功率；最后提前写清回滚条件和回滚后验证。你要能在面试里把“我会部署”升级成“我能负责一次可控上线”。",
                                                      evidence: [
                                                        [
                                                          "计划",
                                                          "release checklist",
                                                        ],
                                                        [
                                                          "运行",
                                                          "env + backup + monitoring",
                                                        ],
                                                        [
                                                          "退路",
                                                          "rollback + smoke test",
                                                        ],
                                                      ],
                                                      bg: releaseReadinessGateScene,
                                                    }
                                                  : isInterviewReview
                                                    ? {
                                                        badge: "主线 1-15",
                                                        title:
                                                          "终章答辩厅：面试怎么讲项目",
                                                        desc: "终章答辩官敲响议会钟：面试官不只听你做过什么，还会追问证据、边界和取舍。终章要把前 14 章的通关产出炼成可追问的项目回答。",
                                                        copy: "这一关把面试复盘拆成一条路线：先从通关记录里挑出能展示、能解释、能验收的证据；再用 STAR 压缩成清楚回答；排障经历要讲现象、证据、根因、修复和验证；技术经历要讲约束、方案、代价和技术取舍；最后用 Agent 扮演面试官追问证据边界和失败路径。你要能把“我学过这些”升级成“我能独立讲清一个真实工程项目，也知道哪些学习效果还要真人复测”。",
                                                        evidence: [
                                                          [
                                                            "结构",
                                                            "STAR + incident review",
                                                          ],
                                                          [
                                                            "取舍",
                                                            "tradeoff + boundary",
                                                          ],
                                                          [
                                                            "定稿",
                                                            "follow-up ready answer",
                                                          ],
                                                        ],
                                                        bg: interviewDefenseHallScene,
                                                      }
                                                    : {
                                                        badge: "主线 1-1",
                                                        title:
                                                          "保存成功，但刷新后消失了",
                                                        desc: "点击保存→提示成功→刷新页面→数据不见。前端骗你？还是后端没存？",
                                                        copy: "这不是一道题，是一份事故卷宗。你要走过现场、传送门和档案库， 把“看起来成功”的表象拆成能讲给面试官听的证据链。",
                                                        evidence: [
                                                          [
                                                            "表象",
                                                            "POST → 201 Created",
                                                          ],
                                                          [
                                                            "反证",
                                                            "SELECT → 0 rows",
                                                          ],
                                                        ],
                                                        bg: questArchive,
                                                      };
    const route = storyScenes.map((scene) => scene.place);

    return (
      <main
        className={`quest-shell mission-gate chapter-shot-${introCameraShot.shot}`}
        data-camera={chapterCinematic.cameraLabel}
        style={
          {
            "--quest-bg": `url(${introConfig.bg})`,
            "--camera-focus": introCameraShot.focus,
            "--camera-entry-x": introCameraShot.entryX,
            "--camera-entry-y": introCameraShot.entryY,
            "--camera-entry-scale": introCameraShot.entryScale,
            "--camera-drift-x": introCameraShot.driftX,
            "--camera-drift-y": introCameraShot.driftY,
            "--camera-drift-scale": introCameraShot.driftScale,
            "--camera-duration": introCameraShot.duration,
            "--camera-easing": introCameraShot.easing,
          } as CSSProperties
        }
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
            <span>
              {isFrontendRouteScenario
                ? "前端工程成长路线 ·"
                : isJavaRouteScenario
                  ? "Java 后端成长路线 ·"
                  : "AI 开发主线 ·"}{" "}
              {introConfig.badge}
            </span>
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
    const completionScene = storyScenes.at(-1) ?? storyScenes[0];
    const firstNode = scenario.projectMap.nodes[0];
    const finalNode = scenario.projectMap.nodes.at(-1);
    const codeFocusSteps = scenario.steps.filter((step) => step.codeFocus);
    const firstCodeFocus = codeFocusSteps[0]?.codeFocus;
    const finalCodeFocus = codeFocusSteps.at(-1)?.codeFocus;
    const completionCards = [
      {
        label: "流程地图",
        value: "看清谁把什么交给谁",
        detail: storyRouteLabel,
      },
      {
        label: "名词小抄",
        value: "先理解名词，再进入代码",
        detail: "术语不再靠猜，先用项目现场解释。",
      },
      {
        label: "关键代码",
        value: "只看当前关卡关键行",
        detail: "每行代码都要能接上上一棒和下一份证据。",
      },
      {
        label: "复盘产出",
        value: "整理成工作和面试表达",
        detail: "把现象、证据、结论和 Agent 委托收束起来。",
      },
    ];
    const practiceEvidencePack = [
      {
        label: "起点别忘",
        value: firstNode
          ? `${firstNode.input} → ${firstNode.label}`
          : "先说清任务从哪里来",
        detail:
          firstNode?.description ??
          "进入实战前先确认上一棒交来的材料，不要直接跳到改代码。",
      },
      {
        label: "代码只带关键行",
        value: firstCodeFocus
          ? firstCodeFocus.filePath
          : "本章关键代码已经读过",
        detail: firstCodeFocus
          ? `刚才只证明「${firstCodeFocus.observationGoal}」`
          : "实战里仍然只看和当前任务有关的几行。",
      },
      {
        label: "下一步验证",
        value: finalCodeFocus?.output ?? finalNode?.output ?? "用证据闭环",
        detail: `${finalCodeFocus?.observationGoal ?? finalNode?.evidenceSources.join(" + ") ?? "继续用证据证明。"} 实战继续用 Network、日志、数据库或测试结果闭环。`,
      },
      {
        label: "实战边界",
        value: isPrimarySandbox ? "只改沙盒，不碰真实项目" : "先会合，再进沙盒",
        detail: isPrimarySandbox
          ? "下面才开始独立练习，提示和验证都会如实记录。"
          : "XP、伙伴和面试素材等实战通过后再结算。",
      },
    ];
    return (
      <main className="teaching-bridge celebration-stage-shell">
        <section
          className="teaching-shell celebration-screen celebration-gate"
          style={
            {
              "--celebration-bg": `url(${completionScene?.image ?? questArchive})`,
            } as CSSProperties
          }
        >
          <div className="celebration-gate-mentor" aria-label="结算前夜导师">
            <img
              src={completionScene?.portrait ?? archiveKeeperPortrait}
              alt=""
            />
            <div>
              <span>会合前夜 · {completionScene?.place ?? "档案馆"}</span>
              <strong>{completionScene?.speaker ?? "档案馆记录员"}</strong>
              <p>
                {completionScene?.mentor ??
                  "路线已经看懂，下一步要把它变成可验收的实战证据。"}
              </p>
            </div>
          </div>
          <header className="celebration-gate-head">
            <span>{isPrimarySandbox ? "实战前夜" : "伙伴会合前夜"}</span>
            <h2>{isPrimarySandbox ? "教学阶段完成！" : "章节教学完成！"}</h2>
            <p>
              你已经完成了 <strong>{stepCount} 个教学步骤</strong>
              ，现在先确认自己收到了哪些证据，再进入下一段真实练习。
            </p>
          </header>
          <div className="celebration-stats" aria-label="已收录的学习证据">
            {completionCards.map((card) => (
              <div key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.detail}</small>
              </div>
            ))}
          </div>
          <section
            className="practice-evidence-pack"
            aria-label="带入实战的证据包"
          >
            <span>带入实战的证据包</span>
            <div>
              {practiceEvidencePack.map((item) => (
                <article key={item.label}>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </section>
          <div className="celebration-handoff">
            <b>{isPrimarySandbox ? "进入独立实战" : "前往伙伴会合"}</b>
            <p>
              {isPrimarySandbox
                ? "教学阶段的帮助不会计入能力分。下面进入真正的练习：你将独立完成修复，提示等级会如实记录。"
                : "章节教学只证明你走完了路线说明。下面先与本章伙伴会合，再一起进入沙盒；XP、阶位、伙伴收藏和面试经历都要等实战证据通过后结算。"}
            </p>
          </div>
          <button className="dialogue-next" onClick={onComplete}>
            {isPrimarySandbox ? "进入实战练习" : "前往伙伴会合"}
            <ArrowRight size={17} />
          </button>
        </section>
      </main>
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

  if (isStoryQuestScenario && !storyQuestComplete) {
    return (
      <EvidenceStoryQuest
        scenarioId={scenario.scenarioId}
        developer={developer}
        saving={saving}
        scenes={storyScenes}
        journey={storyJourney}
        journeyTitle={storyRouteLabel}
        routeFamilyLabel={routeFamilyLabel}
        stepLabel={storyStepLabel}
        workBackground={workBackground}
        initialProgress={initialStoryProgress}
        onProgress={(snapshot) => {
          void saveProgress(storyProgressStepId, snapshot, false);
        }}
        onComplete={async (sceneRecalls, sceneDecisions) => {
          await saveProgress(storyProgressStepId, {
            completedAt: new Date().toISOString(),
            ...(sceneRecalls ? { sceneRecalls } : {}),
            ...(sceneDecisions ? { sceneDecisions } : {}),
            route: isCanvasStorm
              ? "canvasstorm-real-project"
              : isJavaIncident
                ? "java-production-incident-investigation"
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
          });
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

  const closeRecapCards = isCanvasStorm
    ? [
        {
          label: "工作里怎么用",
          title: "把模糊 AI 需求拆成产品链路",
          body: "遇到“做个 AI 功能”时，先追问用户、输入、输出、候选取舍和保存边界。",
        },
        {
          label: "证据链怎么验",
          title: "Brief、方向、候选、会话都要能追到",
          body: "看表单状态、候选请求、取舍记录和会话保存，证明 AI 产出不是空泛生成。",
        },
        {
          label: "面试怎么讲",
          title: "我把 AI 生成从灵感变成可交付流程",
          body: "不要只说用了 AI，要讲清输入结构、决策流程、保存边界和不可用兜底。",
        },
      ]
    : isJavaIncident
      ? [
          {
            label: "工作里怎么用",
            title: "线上先止血，再追根因",
            body: "错误率、P95、requestId 和版本号帮你判断影响；回滚是保护用户的动作，不等于根因已经修好。",
          },
          {
            label: "证据链怎么验",
            title: "报警、日志、回滚、复测要互相作证",
            body: "用时间窗口和 requestId 串起证据，再用健康检查、冒烟路径和恢复指标证明用户真的恢复。",
          },
          {
            label: "面试怎么讲",
            title: "我能把线上故障讲成可复核闭环",
            body: "讲清现象、证据、判断、止血、恢复和防复发，不把事故归结成一句‘重启就好了’。",
          },
        ]
      : isLoginState
        ? [
            {
              label: "工作里怎么用",
              title: "刷新掉登录时先分清前后端状态",
              body: "用户被踢回登录页时，先看浏览器凭证、请求是否带 token、后端是否查到 Session。",
            },
            {
              label: "证据链怎么验",
              title: "Application、Network、后端验证一起看",
              body: "Cookie/Token、GET /me 状态码和后端 Session 查询结果要能互相对上。",
            },
            {
              label: "面试怎么讲",
              title: "我能解释登录态怎么保存、怎么失效",
              body: "讲清浏览器带什么、后端查什么、401 说明什么，以及过期后如何给用户反馈。",
            },
          ]
        : isApiError
          ? [
              {
                label: "工作里怎么用",
                title: "接口失败先看请求，再看状态码",
                body: "不要只说接口坏了，先判断是前端参数、权限、后端校验还是服务异常。",
              },
              {
                label: "证据链怎么验",
                title: "Payload、响应体、日志串起来",
                body: "Network 看到请求和状态码，响应体说明用户可见错误，后端日志说明真实原因。",
              },
              {
                label: "面试怎么讲",
                title: "我能定位失败发生在哪一层",
                body: "用 400/401/500、结构化错误和 requestId 说明自己不是凭感觉排障。",
              },
            ]
          : isConsistency
            ? [
                {
                  label: "工作里怎么用",
                  title: "重复提交要前端拦、后端守、数据库兜底",
                  body: "连点、重试和并发都会出现，不能只靠按钮禁用解决一致性。",
                },
                {
                  label: "证据链怎么验",
                  title: "重复请求来了，但核心记录只有一份",
                  body: "用 Network、Idempotency-Key、唯一约束和 SELECT count 证明数据没有重复落库。",
                },
                {
                  label: "面试怎么讲",
                  title: "我能解释幂等和事务边界",
                  body: "说明为什么前端防抖是体验层，后端幂等和数据库约束才是底线。",
                },
              ]
            : isPerformance
              ? [
                  {
                    label: "工作里怎么用",
                    title: "页面慢先判断慢在哪一段",
                    body: "别急着优化样式，先拆资源加载、接口等待、后端耗时和前端渲染。",
                  },
                  {
                    label: "证据链怎么验",
                    title: "瀑布图、Server-Timing、复测对比",
                    body: "用 TTFB、后端计时、渲染画像和优化前后耗时证明瓶颈与收益。",
                  },
                  {
                    label: "面试怎么讲",
                    title: "我不是说变快了，而是证明变快了",
                    body: "讲清定位方法、优化动作、复测数字、缓存边界和数据新鲜度风险。",
                  },
                ]
              : isAiApi
                ? [
                    {
                      label: "工作里怎么用",
                      title: "AI Key 只能在服务端使用",
                      body: "前端只请求自己的后端，后端读环境变量再调用模型服务。",
                    },
                    {
                      label: "证据链怎么验",
                      title: "前端无密钥、成功流式、失败兜底",
                      body: "检查打包代码、Network 流式响应、上游失败结构化错误和后端日志。",
                    },
                    {
                      label: "面试怎么讲",
                      title: "我能安全接入 AI API",
                      body: "说明密钥隔离、流式体验、错误兜底和日志定位，而不是只展示能聊天。",
                    },
                  ]
                : isHallucination
                  ? [
                      {
                        label: "工作里怎么用",
                        title: "AI 回答必须有来源和拒答边界",
                        body: "资料不足时要拒答，有资料时要带引用，不能让模型顺口补全。",
                      },
                      {
                        label: "证据链怎么验",
                        title: "Prompt、context、citations 都要校验",
                        body: "检查本轮资料、引用 id、引用是否存在，以及无资料问题是否会拒答。",
                      },
                      {
                        label: "面试怎么讲",
                        title: "我把 AI 输出做成可验证流程",
                        body: "讲清 grounding、引用校验、confidence 和拒答策略，证明不是只调 prompt。",
                      },
                    ]
                  : isRag
                    ? [
                        {
                          label: "工作里怎么用",
                          title: "先找资料，再让模型回答",
                          body: "公司知识问答不能靠模型记忆，要从文档 chunk 检索出来源。",
                        },
                        {
                          label: "证据链怎么验",
                          title: "source、chunk、topK、citations 连起来",
                          body: "看命中文档、分数、传入 context 和最终引用是否能回到原文。",
                        },
                        {
                          label: "面试怎么讲",
                          title: "我能解释资料如何进入回答",
                          body: "讲清切分、向量索引、检索命中、引用展示和未命中拒答。",
                        },
                      ]
                    : isAgentTools
                      ? [
                          {
                            label: "工作里怎么用",
                            title: "Agent 能做事，但必须先过工具门禁",
                            body: "让 Agent 只能调用注册表里的工具，参数和权限都要先校验。",
                          },
                          {
                            label: "证据链怎么验",
                            title: "正常调用、坏参数、越权拒绝都要测",
                            body: "看 tool registry、schema 校验、permission gate、失败回退和 audit log。",
                          },
                          {
                            label: "面试怎么讲",
                            title: "我让 Agent 成为受控执行者",
                            body: "说明工具边界、参数校验、权限隔离和失败回退，证明不是放任 Agent乱做。",
                          },
                        ]
                      : isTestingProof
                        ? [
                            {
                              label: "工作里怎么用",
                              title: "Agent 说修好了不算验收",
                              body: "先复现旧问题，再用自动化和手动报告证明当前代码真的修复。",
                            },
                            {
                              label: "证据链怎么验",
                              title: "复现、单测、集成、手动报告一起交",
                              body: "报告要带时间、步骤、源码指纹、结果和仍未覆盖的回归风险。",
                            },
                            {
                              label: "面试怎么讲",
                              title: "我会用证据接收交付",
                              body: "讲清 red to green、边界测试和手动复测，而不是只相信口头完成。",
                            },
                          ]
                        : isAgentBrief
                          ? [
                              {
                                label: "工作里怎么用",
                                title: "把愿望写成 Agent 能执行的委托",
                                body: "任务要包含背景、目标、范围、禁止事项、验收和风险。",
                              },
                              {
                                label: "证据链怎么验",
                                title: "Agent 知道做什么，也知道不能做什么",
                                body: "检查验收命令、浏览器路径、可见结果、回滚和未覆盖项是否写清楚。",
                              },
                              {
                                label: "面试怎么讲",
                                title: "我能指挥 Agent 做工程任务",
                                body: "说明自己会拆目标、设边界、写验收，而不是把判断全部丢给 Agent。",
                              },
                            ]
                          : isDeliveryReview
                            ? [
                                {
                                  label: "工作里怎么用",
                                  title: "审交付先读说明，再看 Diff 和证据",
                                  body: "Agent 说完成只是开始，还要核范围、测试、边界和文档同步。",
                                },
                                {
                                  label: "证据链怎么验",
                                  title: "摘要、Diff、测试、浏览器验收要一致",
                                  body: "过期测试、移动端缺口、文档没同步，都应该要求补证。",
                                },
                                {
                                  label: "面试怎么讲",
                                  title: "我能判断交付是否真的完成",
                                  body: "把“我觉得不行”改成“缺少哪份证据、哪个边界没验”。",
                                },
                              ]
                            : isReleaseReadiness
                              ? [
                                  {
                                    label: "工作里怎么用",
                                    title: "上线不是点部署，而是守门",
                                    body: "上线前确认计划、环境变量、备份、冒烟测试、监控和回滚条件。",
                                  },
                                  {
                                    label: "证据链怎么验",
                                    title: "上线前后都要有可观察信号",
                                    body: "看 env、backup restore、390px 冒烟、错误率、接口耗时和回滚验证。",
                                  },
                                  {
                                    label: "面试怎么讲",
                                    title: "我能负责一次可控上线",
                                    body: "讲清发布风险、监控指标、回滚阈值和恢复后如何证明系统正常。",
                                  },
                                ]
                              : isInterviewReview
                                ? [
                                    {
                                      label: "工作里怎么用",
                                      title: "把项目经历整理成可追问故事",
                                      body: "从证据里挑素材，用 STAR 讲行动和结果，再准备边界和追问。",
                                    },
                                    {
                                      label: "证据链怎么验",
                                      title: "每句话都要能回到具体产出",
                                      body: "现象、证据、根因、行动、验证、取舍和未覆盖项都要能被追问。",
                                    },
                                    {
                                      label: "面试怎么讲",
                                      title: "我能把学习产出转成工程表达",
                                      body: "讲清自己如何读项目、定位 bug、写任务、审交付、上线和复盘。",
                                    },
                                  ]
                                : [
                                    {
                                      label: "工作里怎么用",
                                      title: "先分清内存成功和持久化成功",
                                      body: "页面提示成功不代表数据库真的保存，刷新后消失要追完整数据流。",
                                    },
                                    {
                                      label: "证据链怎么验",
                                      title: "POST 成功和 SELECT 结果要一起看",
                                      body: "201 只能证明接口返回成功，数据库查询和刷新恢复才能证明持久化。",
                                    },
                                    {
                                      label: "面试怎么讲",
                                      title: "我能解释一次保存请求怎么走",
                                      body: "讲清用户、前端、后端、数据层、数据库和验收证据之间的交接。",
                                    },
                                  ];
  const closeAgentBrief = {
    background: `本章要继续实战的是：${closeRecapCards[0].title}。${closeRecapCards[0].body}`,
    boundary:
      "只围绕本章沙盒和白名单材料排查；不要读取真实项目、不要执行用户终端命令、不要声称学习效果已经真人验证。",
    acceptance: `${closeRecapCards[1].title}：${closeRecapCards[1].body}`,
  };
  const closeScene = storyScenes.at(-1) ?? storyScenes[0];
  const closeChapterTitle = isJavaIncident
    ? "Java 第 5 关已通关"
    : isJavaRelease
      ? "Java 第 4 关已通关"
      : isLoginState
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
                                : "主线 1-2 已通关";
  const closeChapterSummary = isJavaIncident
    ? "你已经能把一次线上故障讲成完整证据链：先用错误率和 P95 确认影响，再用 requestId、日志和版本号定位范围；达到阈值时先回滚止血，回滚后用健康检查、业务冒烟和恢复指标证明用户路径回来，最后补上告警、日志和回归护栏。面试里要讲清每个决定依据，而不是只说最后重启或回滚了。"
    : isCanvasStorm
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
                                : "你已经正确识别了登录状态丢失的根因：Token/Session 只存在内存中，服务重启后全部失效。这和主线 1-1「数据消失事件」是同一个根本原理——内存是临时的，持久化才能真正确保数据不丢失。";

  const renderStep = (idx: number) => {
    const step = withChapterRemediation(
      scenario.scenarioId,
      scenario.steps[idx],
    );

    switch (step.id) {
      case "project-map":
        return (
          <ProjectMapView
            scenarioId={scenario.scenarioId}
            map={scenario.projectMap}
            onComplete={() => completeStep(idx)}
          />
        );

      case "micro-lessons":
        return (
          <MicroLessonsView
            key="micro-lessons"
            step={step}
            concepts={step.concepts ?? []}
            onComplete={() => completeStep(idx)}
            onRemediation={(trigger) => recordRemediation(step.id, trigger)}
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
            scenarioId={scenario.scenarioId}
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
            step={step}
            concepts={step.concepts ?? []}
            onComplete={() => completeStep(idx)}
            onRemediation={(trigger) => recordRemediation(step.id, trigger)}
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
          <section className="teaching-shell chapter-close-stage">
            <div className="chapter-close-mentor" aria-label="结案导师">
              <img src={closeScene?.portrait ?? archiveKeeperPortrait} alt="" />
              <div>
                <span>结案导师 · {closeScene?.place ?? "档案馆"}</span>
                <strong>{closeScene?.speaker ?? "档案馆记录员"}</strong>
                <p>
                  {closeScene?.mentor ??
                    "把证据收束成可复述的判断，再进入下一段实战。"}
                </p>
              </div>
            </div>
            <header className="chapter-close-head">
              <span>🧩 章节结案</span>
              <h2>{closeChapterTitle}</h2>
              <p>{closeChapterSummary}</p>
            </header>
            <div className="chapter-close-badges" aria-label="本章能力印记">
              {closeRecapCards.map((card) => (
                <span key={card.label}>{card.title}</span>
              ))}
            </div>
            <div className="chapter-close-recap" aria-label="章节结案复盘">
              {closeRecapCards.map((card) => (
                <article key={card.label}>
                  <span>{card.label}</span>
                  <strong>{card.title}</strong>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
            <section
              className="chapter-agent-brief"
              aria-label="给 Agent 的委托口令"
            >
              <div>
                <span>给 Agent 的委托口令</span>
                <strong>下一步不是“帮我修一下”，而是交出可验收任务。</strong>
                <p>
                  把本章结论改写成三句任务骨架：背景讲清现场，边界守住安全，验收说明怎么证明完成。
                </p>
              </div>
              <dl>
                <div>
                  <dt>背景</dt>
                  <dd>{closeAgentBrief.background}</dd>
                </div>
                <div>
                  <dt>边界</dt>
                  <dd>{closeAgentBrief.boundary}</dd>
                </div>
                <div>
                  <dt>验收</dt>
                  <dd>{closeAgentBrief.acceptance}</dd>
                </div>
              </dl>
            </section>
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

      <section className="teaching-route-identity" aria-label="当前路线身份">
        <span>{routeFamilyLabel}</span>
        <strong>{storyRouteLabel}</strong>
        <small>
          当前这一站：{scenario.steps[currentStepIdx]?.title ?? "剧情探索"}
        </small>
      </section>

      <ChapterNavigationNeedle
        scenario={scenario}
        currentStepIdx={currentStepIdx}
        routeLabel={storyRouteLabel}
      />

      <ChapterMentorCompanion
        key={storyScenes[currentStepIdx]?.id ?? currentStepIdx}
        scenario={scenario}
        currentStepIdx={currentStepIdx}
        scenes={storyScenes}
        routeLabel={storyRouteLabel}
        workBackground={workBackground}
      />

      <ChapterCompanionReaction
        scenario={scenario}
        currentStepIdx={currentStepIdx}
      />

      {renderStep(currentStepIdx)}

      <details className="learning-support-drawer">
        <summary>
          <span>冒险辅助</span>
          <strong>需要时展开流程回放、导师试炼与能力护照</strong>
          <small>当前任务已经在上方，不必先读完这些资料</small>
        </summary>
        <ChapterMemoryStrip
          steps={scenario.steps}
          currentStepIdx={currentStepIdx}
          progress={progress}
        />
        <ChapterQuestLog
          scenario={scenario}
          currentStepIdx={currentStepIdx}
          completedCount={completedScenarioStepCount}
        />
        <ChapterFlowReplay
          scenario={scenario}
          currentStepIdx={currentStepIdx}
        />
        <ChapterMentorTrial
          scenario={scenario}
          currentStepIdx={currentStepIdx}
        />
        <ChapterAbilityPassport
          scenario={scenario}
          currentStepIdx={currentStepIdx}
        />
      </details>

      {saving && (
        <div className="teaching-saving">
          <LoaderCircle className="spin" size={16} />
          保存进度…
        </div>
      )}

      {completedStepTransition !== null && (
        <StepEvidenceTransition
          scenario={scenario}
          completedStepIndex={completedStepTransition}
          saving={saving}
          onContinue={continueAfterEvidence}
        />
      )}

      <GlossaryPanel entries={glossary} />
    </div>
  );
}

/** 微知识列表视图 */
function MicroLessonsView({
  step,
  concepts,
  onComplete,
  onRemediation,
}: {
  step: TeachingStep;
  concepts: ConceptCard[];
  onComplete: () => void;
  onRemediation: (trigger: string) => void;
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
          remediation={
            <StepRemediation step={step} onRemediation={onRemediation} />
          }
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
  const battleRules = [
    {
      label: "目标",
      value: "把临时内存写入真实数据库",
      detail: "这一步不是背答案，而是把刚学到的数据流用在 sandbox 修复里。",
    },
    {
      label: "边界",
      value: "只改沙盒，不读取真实项目",
      detail: "应用不会帮你执行终端命令；测试由你在沙盒里手动运行。",
    },
    {
      label: "验收",
      value: "测试报告 + 刷新恢复 + 数据库证据",
      detail: "真正通关要能证明保存后刷新不丢，数据库也能查到记录。",
    },
  ];
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
      <div className="coaching-briefing" aria-label="实战前夜作战简报">
        <div className="coaching-mentor">
          <img src={archiveKeeperPortrait} alt="" />
          <div>
            <span>实战前夜 · 档案修复台</span>
            <strong>档案馆记录员</strong>
            <p>
              接下来不再只是看故事。你要亲手把“保存成功”变成数据库里真的有记录，
              然后用测试和刷新结果证明它。
            </p>
          </div>
        </div>
        <header className="teaching-header">
          <span className="mini-label">陪练模式 · 提示会被记录但不扣分</span>
          <h2>现在进入实战修复</h2>
          <p>
            下面是修复前的作战清单。每一步都对应一份证据：看代码、找表字段、改写入逻辑、手动跑测试。
            勾完 6 步后，再进入真正的沙盒实战。
          </p>
        </header>
        <div className="coaching-rules" aria-label="实战作战规则">
          {battleRules.map((rule) => (
            <article key={rule.label}>
              <span>{rule.label}</span>
              <strong>{rule.value}</strong>
              <p>{rule.detail}</p>
            </article>
          ))}
        </div>
      </div>

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
          className="dialogue-next coaching-action"
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
        <div
          aria-label="词库本"
          aria-modal="false"
          className="glossary-panel"
          role="dialog"
        >
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
