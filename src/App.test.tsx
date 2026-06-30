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
  it("以自由回答采集无提示基线，而不是让用户自评技能等级", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    expect(await screen.findByText("刷新后消失？")).toBeInTheDocument();
    expect(screen.getByText(/先不看代码、不看提示/)).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
    expect(screen.queryByText("项目流程")).not.toBeInTheDocument();
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
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);
    const textareas = await screen.findAllByRole("textbox");
    await user.type(
      textareas[0],
      "先稳定复现问题，再查看 Network 请求，最后直接查询数据库，因为要逐层确定断点。",
    );
    await user.type(
      textareas[1],
      "我需要请求响应、后端日志和数据库查询，三者不能互相替代。",
    );
    await user.type(
      textareas[2],
      "用户点击按钮，前端发送请求，后端路由处理，再由数据访问层写入 SQLite。",
    );
    await user.click(
      screen.getByRole("button", { name: /封存基线，进入真实项目/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "根据真实代码和运行证据，提出你的故障假设",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/不执行终端命令/)).toBeInTheDocument();
    expect(localStorage.length).toBe(0);
  });
});
