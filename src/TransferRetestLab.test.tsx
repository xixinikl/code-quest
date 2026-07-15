import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransferRetestLab } from "./TransferRetestLab";
import { getTransferRetestConfig } from "./transferRetests";

describe("TransferRetestLab", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("把通过复测报告解释成证据护照", async () => {
    const config = getTransferRetestConfig("verification-trial-arena");
    const sourceHash =
      "9f3a7d12b8c4e6f00112233445566778899aabbccddeeff0011223344556677";
    const steps = Object.fromEntries(
      config.stages.map((stage) => [
        stage.id,
        {
          response: { text: `${stage.label} 原始作答已经完成，等待复测报告。` },
          savedAt: "2026-07-15T01:20:00.000Z",
        },
      ]),
    );

    vi.stubGlobal("scrollTo", vi.fn());
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/transfer-retests/verification-trial-arena/start") {
          return Response.json({
            id: "attempt-retest-11",
            scenarioId: "verification-proof-retest",
            status: "active",
            hintLevel: 0,
            verificationStatus: "passed",
            steps,
            latestVerification: {
              status: "passed",
              report: {
                generatedAt: "2026-07-15T01:30:00.000Z",
                message: "复测报告与当前源码匹配。",
                sourceHash,
                summary: { passed: 2, failed: 0 },
                tests: [
                  { name: "失败复现先红后绿", status: "passed" },
                  { name: "源码指纹匹配当前版本", status: "passed" },
                ],
              },
            },
          });
        }
        if (url === "/api/scenarios/verification-proof-retest") {
          return Response.json({
            artifacts: [
              {
                id: "failing-before",
                label: "失败复现",
                language: "json",
                relativePath: "evidence/failing-before.json",
                content: '{"failed": 1}',
              },
              {
                id: "passing-stale",
                label: "过期通过报告",
                language: "json",
                relativePath: "evidence/passing-after-stale.json",
                content: '{"sourceHash": "old"}',
              },
              {
                id: "manual-report",
                label: "手动复测",
                language: "md",
                relativePath: "evidence/manual-report.md",
                content: "刷新后仍保留状态。",
              },
              {
                id: "logs",
                label: "后端日志",
                language: "log",
                relativePath: "evidence/backend.log",
                content: "sourceHash=current",
              },
              {
                id: "report-validator",
                label: "报告校验器",
                language: "js",
                relativePath: "server/verificationReport.js",
                content: "export function validate() {}",
              },
              {
                id: "network",
                label: "Network",
                language: "json",
                relativePath: "evidence/network-test-run.json",
                content: '{"ok": true}',
              },
              {
                id: "delivery",
                label: "Agent 交付说明",
                language: "md",
                relativePath: "evidence/agent-delivery.md",
                content: "全部通过。",
              },
            ],
          });
        }
        return Response.json({ message: "not found" }, { status: 404 });
      }),
    );

    render(
      <TransferRetestLab
        sourceScenarioId="verification-trial-arena"
        onBack={vi.fn()}
        onCompleted={vi.fn()}
      />,
    );

    const passport = await screen.findByLabelText("复测报告证据护照");
    expect(screen.getByText("测试证据通过")).toBeInTheDocument();
    expect(screen.getByText("复测报告与当前源码匹配。")).toBeInTheDocument();
    expect(within(passport).getByText("生成时间")).toBeInTheDocument();
    expect(within(passport).getByText("源码指纹")).toBeInTheDocument();
    expect(within(passport).getByText("9f3a7d12b8")).toBeInTheDocument();
    expect(within(passport).getByText("2 通过 / 0 失败")).toBeInTheDocument();
    expect(
      within(passport).getByText("变式差异与人工复测风险"),
    ).toBeInTheDocument();
    expect(screen.getByText("通过 · 失败复现先红后绿")).toBeInTheDocument();
    expect(screen.getByText("通过 · 源码指纹匹配当前版本")).toBeInTheDocument();
  });
});
