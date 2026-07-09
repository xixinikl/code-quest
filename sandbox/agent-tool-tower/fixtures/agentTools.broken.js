export const toolRegistry = {
  searchProjectDocs: {
    description: "搜索项目文档。",
    permission: "docs:read",
    schema: {
      query: "string",
    },
    run(args, context) {
      return {
        matches: context.docs.filter((doc) => doc.text.includes(args.query)),
      };
    },
  },
  updateProjectStatus: {
    description: "更新项目状态。",
    permission: "project:write",
    schema: {
      projectId: "string",
      status: ["draft", "review", "released"],
    },
    run(args, context) {
      if (args.projectId === "project_fail") {
        throw new Error("database connection refused");
      }
      context.auditLog.push({
        event: "project.status.updated",
        projectId: args.projectId,
        status: args.status,
      });
      return { projectId: args.projectId, status: args.status };
    },
  },
};

export function executeToolCall({ toolName, args, context }) {
  const tool = toolRegistry[toolName];

  if (!tool) {
    return {
      ok: false,
      error: `Unknown tool: ${toolName}`,
    };
  }

  try {
    const data = tool.run(args || {}, context);
    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
