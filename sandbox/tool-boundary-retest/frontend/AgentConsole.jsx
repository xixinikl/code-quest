export function AgentConsole({ request }) {
  return fetch("/api/agent/tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  }).then((response) => response.json());
}
