export function DeliveryReviewPanel({ delivery, review }) {
  const status = review?.accepted ? "可接收" : "需要补证";

  return (
    <section className="delivery-review-panel">
      <p className="eyebrow">交付审查庭</p>
      <h2>Agent 说完成了，证据能站住吗？</h2>
      <div className="review-verdict">
        <strong>{status}</strong>
        <span>{review?.reason ?? "等待审查"}</span>
      </div>
      <article>
        <h3>{delivery.title}</h3>
        <p>{delivery.summary}</p>
      </article>
    </section>
  );
}
