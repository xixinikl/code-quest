import { useState } from "react";

export function SaveCanvasButton({ draft, onSaved }) {
  const [status, setStatus] = useState("idle");

  async function save() {
    setStatus("saving");
    const response = await fetch("/api/canvases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const savedCanvas = await response.json();
    onSaved(savedCanvas);
    setStatus("saved");
  }

  return (
    <button onClick={save} disabled={status === "saving"}>
      {status === "saving" ? "保存中…" : "保存画布"}
    </button>
  );
}
