export function KnowledgeUploadPanel({ uploadDocument }) {
  async function submit(file) {
    await uploadDocument({
      documentId: "handbook-ai-101",
      version: 7,
      file,
    });
  }

  return (
    <button onClick={() => submit("ai-handbook.pdf")}>上传知识文档</button>
  );
}
