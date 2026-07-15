export function MeetingBriefForm({ onPlan }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onPlan({
          sessionId: "meeting_weekly_01",
          user: "每周项目会主持人",
          problem: "会后没人知道谁要做什么",
          stage: "follow-up",
          success: "会后 2 分钟内得到带负责人和截止时间的行动项",
        });
      }}
    >
      <button type="submit">生成会议助手方案</button>
    </form>
  );
}
