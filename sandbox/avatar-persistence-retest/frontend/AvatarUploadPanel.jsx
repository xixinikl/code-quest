import { useState } from "react";

export function AvatarUploadPanel({ currentUser, onAvatarChanged }) {
  const [status, setStatus] = useState("idle");

  async function updateAvatar(avatarUrl) {
    setStatus("saving");
    const response = await fetch("/api/profile/avatar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const profile = await response.json();
    onAvatarChanged(profile.avatarUrl);
    setStatus("saved");
  }

  return (
    <section>
      <img src={currentUser.avatarUrl} alt="当前头像" />
      <button onClick={() => updateAvatar("/avatars/new-moon.webp")}>
        上传新头像
      </button>
      <span>{status === "saved" ? "头像已更新" : status}</span>
    </section>
  );
}
