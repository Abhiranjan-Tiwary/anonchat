import { useEffect, useState } from "react";
import Button from "../../components/Button.jsx";
import { Card, CardHeader } from "../../components/Card.jsx";
import Avatar from "../../components/Avatar.jsx";
import GuestUpgradeBanner from "../../components/GuestUpgradeBanner.jsx";
import { useToast } from "../../hooks/useToast.js";
import { useAuthStore } from "../../store/authStore.js";

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const blockedUsers = useAuthStore((state) => state.blockedUsers);
  const blockedUserDetails = useAuthStore((state) => state.blockedUserDetails);
  const loadBlockedUsers = useAuthStore((state) => state.loadBlockedUsers);
  const unblockUser = useAuthStore((state) => state.unblockUser);
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState("");

  useEffect(() => {
    if (!user?.isGuest) {
      loadBlockedUsers().catch(() => {
        // The stored ids still let the UI hide messages if this request fails.
      });
    }
  }, [loadBlockedUsers, user?.isGuest]);

  if (user?.isGuest) {
    return (
      <div className="workspace-page">
        <CardHeader title="Settings" subtitle="Blocked users and privacy controls need a free AnonChat account." />
        <GuestUpgradeBanner />
      </div>
    );
  }

  async function handleUnblock(blockedUserId) {
    setLoadingId(blockedUserId);
    try {
      await unblockUser(blockedUserId);
      toast("User unblocked \u2705", "success");
    } catch (error) {
      toast(error.message || "Could not unblock user.", "error");
    } finally {
      setLoadingId("");
    }
  }

  const rows = blockedUserDetails.length
    ? blockedUserDetails
    : blockedUsers.map((id) => ({ id, anonymousName: "Anonymous User", username: id }));

  return (
    <div className="workspace-page">
      <CardHeader title="Settings" subtitle="Manage account safety controls." />
      <Card className="blocked-users-card">
        <CardHeader title="Blocked Users" subtitle="Unblock users when you want their messages to appear again." />
        <div className="blocked-users-list">
          {rows.map((blockedUser) => {
            const id = String(blockedUser.id || blockedUser._id || "");
            return (
              <article className="blocked-user-row" key={id}>
                <Avatar name={blockedUser.anonymousName || blockedUser.name || "Anonymous User"} src={blockedUser.avatarDataUrl} color={blockedUser.avatarColor} />
                <div>
                  <strong>{blockedUser.anonymousName || blockedUser.name || "Anonymous User"}</strong>
                  <span>{blockedUser.username ? `@${blockedUser.username}` : id}</span>
                </div>
                <Button size="sm" variant="ghost" loading={loadingId === id} onClick={() => handleUnblock(id)}>
                  Unblock
                </Button>
              </article>
            );
          })}
          {!rows.length ? (
            <div className="blocked-users-empty">
              <strong>No blocked users</strong>
              <span>Blocked people will appear here.</span>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
