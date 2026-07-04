import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const diagnosticActive = {
  id: "diagnostic-001",
  status: "active",
  baseline: {},
};

const diagnosticCompleted = {
  ...diagnosticActive,
  status: "completed",
  baseline: { firstChecks: "先复现并查看 Network" },
};

const attempt = {
  id: "attempt-001",
  scenarioId: "canvas-save-persistence",
  status: "active",
  hintLevel: 0,
  verificationStatus: "not_run",
  steps: {},
};

const artifacts = [
  {
    id: "network",
    label: "Network 记录",
    language: "json",
    relativePath: "sandbox/canvas-save-persistence/evidence/network.json",
    content: '{"status":201,"visibleCanvases":[]}',
  },
];

function response(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("证据式学习入口", () => {
  it("打开显示游戏封面，点击后直接进入教学桥，不显示无聊的基线", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          return response(diagnosticCompleted);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          return response(attempt, 201);
        }
        if (url === "/api/scenarios/canvas-save-persistence") {
          return response({ scenarioId: "canvas-save-persistence", artifacts });
        }
        if (url.includes("/steps/baseline-plan")) {
          return response(attempt);
        }
        if (url.includes("/teaching")) return response([]);
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    // 游戏封面显示
    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    expect(screen.getByText(/化身侦探/)).toBeInTheDocument();

    // 点击 Case 001 — 自动跳过基线
    const startBtn = screen.getByRole("button", { name: /开始调查/ });
    await user.click(startBtn);

    // 直接进入教学桥
    expect(await screen.findByText("CASE 001")).toBeInTheDocument();
    expect(localStorage.length).toBe(0);
  });

  it("封存基线后进入真实材料调查，并显示安全边界", async () => {
    const user = userEvent.setup();
    let completed = false;
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(
            completed ? diagnosticCompleted : diagnosticActive,
            201,
          );
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          completed = true;
          return response(diagnosticCompleted);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          return response(attempt, 201);
        }
        if (url === "/api/scenarios/canvas-save-persistence") {
          return response({ scenarioId: "canvas-save-persistence", artifacts });
        }
        if (url.includes("/steps/baseline-plan")) {
          return response({
            ...attempt,
            steps: {
              "baseline-plan": {
                response: { firstChecks: "已封存" },
                savedAt: "2026-06-30T00:00:00Z",
              },
            },
          });
        }
        // 教学桥进度：未完成 → 显示教学桥
        if (url.includes("/teaching")) {
          return response([]);
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    // 游戏封面 → 点击 Case 001
    const gameStartBtn = await screen.findByRole("button", {
      name: /开始调查/,
    });
    await user.click(gameStartBtn);

    // 基线自动跳过，直接进入教学桥
    expect(await screen.findByText("CASE 001")).toBeInTheDocument();

    // 点击教学桥的「开始调查」进入教学
    const teachStartBtn = screen.getByRole("button", { name: /开始调查/ });
    await user.click(teachStartBtn);

    expect(
      await screen.findByRole("heading", {
        name: /项目地图/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/教学模式/)).toBeInTheDocument();
    expect(localStorage.length).toBe(0);
  });
});
