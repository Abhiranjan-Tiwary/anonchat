import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/Card.jsx";
import Avatar from "../../components/Avatar.jsx";
import GuestUpgradeBanner from "../../components/GuestUpgradeBanner.jsx";
import { useToast } from "../../hooks/useToast.js";
import { api } from "../../lib/api.js";
import { getSocket } from "../../lib/socket.js";
import { useAuthStore } from "../../store/authStore.js";

const roomMeta = {
  general: { name: "General Chat" },
  "general-chat": { name: "General Chat" },
  "random-talk": { name: "Random Talk" },
  "gaming-zone": { name: "Gaming Zone" },
  "music-lounge": { name: "Music Lounge" },
  "deep-talk": { name: "Deep Talk" },
  confessions: { name: "Confessions" },
  events: { name: "Events" },
  "lost-found": { name: "Lost & Found" },
};

const icon = {
  smile: "\u{1F60A}",
  reply: "\u21A9",
  edit: "\u270F\uFE0F",
  delete: "\u{1F5D1}\uFE0F",
  report: "\u{1F6A9}",
  block: "\u{1F6AB}",
  camera: "\u{1F4F7}",
  mic: "\u{1F399}\uFE0F",
  send: "\u27A4",
  close: "\u00D7",
  pin: "\u{1F4CC}",
  star: "\u2606",
};

const emojis = [
  "\u{1F600}",
  "\u{1F602}",
  "\u{1F60A}",
  "\u{1F60D}",
  "\u{1F979}",
  "\u{1F60E}",
  "\u{1F64C}",
  "\u{1F44D}",
  "\u2764\uFE0F",
  "\u{1F525}",
  "\u{1F389}",
  "\u{1F91D}",
  "\u{1F4AC}",
  "\u{1F319}",
  "\u{1F3AE}",
  "\u{1F3B5}",
  "\u{1F62E}",
  "\u{1F622}",
  "\u{1F64F}",
  "\u2728",
  "\u{1F440}",
  "\u{1F92B}",
  "\u{1F4AF}",
  "\u2705",
];

const reactionEmojis = ["\u{1F44D}", "\u2764\uFE0F", "\u{1F602}", "\u{1F62E}", "\u{1F622}", "\u{1F525}"];

const attachmentOptions = [
  { id: "document", label: "Document", icon: "\u{1F4C4}", tone: "#8b5cf6", accept: ".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx" },
  { id: "media", label: "Photos & videos", icon: "\u{1F5BC}\uFE0F", tone: "#0ea5e9", accept: "image/*,video/*" },
  { id: "camera", label: "Camera", icon: "\u{1F4F7}", tone: "#22c55e", accept: "image/*", capture: "environment" },
  { id: "audio", label: "Audio", icon: "\u{1F3A7}", tone: "#f59e0b", accept: "audio/*" },
  { id: "contact", label: "Contact", icon: "\u{1F464}", tone: "#14b8a6", modal: "Share contact" },
  { id: "poll", label: "Poll", icon: "\u{1F4CA}", tone: "#facc15", modal: "Create poll" },
  { id: "event", label: "Event", icon: "\u{1F4C5}", tone: "#ec4899", modal: "Create event" },
  { id: "sticker", label: "New sticker", icon: "\u2795", tone: "#2dd4bf", accept: "image/*" },
];

const reportReasons = ["Spam", "Harassment", "Inappropriate", "Hate Speech", "Threats", "Other"];

export default function Room() {
  const { roomId = "general" } = useParams();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const blockedUsers = useAuthStore((state) => state.blockedUsers);
  const blockUser = useAuthStore((state) => state.blockUser);
  const loadBlockedUsers = useAuthStore((state) => state.loadBlockedUsers);
  const isGuest = Boolean(user?.isGuest);
  const { toast } = useToast();
  const composerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageFeedRef = useRef(null);
  const textareaRef = useRef(null);
  const touchTimerRef = useRef(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [quickModal, setQuickModal] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [reactionPicker, setReactionPicker] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [blockTarget, setBlockTarget] = useState(null);
  const [activeTouchMessageId, setActiveTouchMessageId] = useState(null);
  const [sending, setSending] = useState(false);
  const [guestBannerVisible, setGuestBannerVisible] = useState(isGuest);
  const currentRoomId = normalizeRoomId(roomId);
  const [roomInfo, setRoomInfo] = useState(null);
  const room = {
    name: roomInfo?.name || roomMeta[roomId]?.name || titleCase(roomId),
    online: Number(roomInfo?.onlineMembers || 0),
  };
  const blockedIdSet = useMemo(
    () => new Set((blockedUsers || []).map((id) => String(id))),
    [blockedUsers]
  );
  const visibleMessages = useMemo(
    () => messages.filter((message) => !blockedIdSet.has(String(message.authorId || ""))),
    [blockedIdSet, messages]
  );

  useEffect(() => {
    function closeMenus(event) {
      if (event.target.closest?.(".message-action-bar, .message-reaction-picker, .delete-sheet, .quick-modal, .block-confirm-modal")) {
        return;
      }
      if (event.target.closest?.(".wa-attach-menu, .wa-emoji-picker")) return;
      if (composerRef.current?.contains(event.target)) {
        setReactionPicker(null);
        setActiveTouchMessageId(null);
        if (event.target === textareaRef.current || event.target.closest?.("textarea")) {
          setEmojiOpen(false);
          setPlusOpen(false);
        }
        return;
      }
      setEmojiOpen(false);
      setPlusOpen(false);
      setReactionPicker(null);
      setActiveTouchMessageId(null);
    }

    document.addEventListener("mousedown", closeMenus);
    document.addEventListener("touchstart", closeMenus);
    return () => {
      document.removeEventListener("mousedown", closeMenus);
      document.removeEventListener("touchstart", closeMenus);
    };
  }, []);

  useEffect(() => {
    setGuestBannerVisible(isGuest);
  }, [isGuest]);

  useEffect(() => {
    if (!token || isGuest) return;
    loadBlockedUsers().catch(() => {
      // Existing stored ids still protect the current render if hydration fails.
    });
  }, [isGuest, loadBlockedUsers, token]);

  useEffect(() => {
    const feed = messageFeedRef.current;
    if (!feed) return;

    feed.scrollTo({
      top: feed.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessages.length]);

  useEffect(() => {
    let active = true;

    async function loadRoomMessages() {
      try {
        const state = await api("/api/state", { token });
        if (!active) return;
        const roomMessages = (state.messages || [])
          .filter((message) => message.roomId === currentRoomId && !(message.deletedFor || []).includes(user?.id))
          .map((message) => mapApiMessage(message, user));
        setRoomInfo((state.rooms || []).find((roomItem) => roomItem.id === currentRoomId) || null);
        setMessages(roomMessages);
      } catch (error) {
        toast(error.message || "Could not load room messages.", "error");
      }
    }

    loadRoomMessages();

    if (!token) {
      return () => {
        active = false;
      };
    }

    const socket = getSocket(token);

    function isBlockedAuthor(authorId) {
      return blockedIdSet.has(String(authorId || ""));
    }

    function handleNewMessage(message) {
      if (message.roomId !== currentRoomId || isBlockedAuthor(message.authorId)) return;
      const mapped = mapApiMessage(message, user);
      setMessages((current) => mergeMessage(current, mapped));

      if (message.authorId !== user?.id) {
        socket.emit("message:delivered", { token, messageId: message.id });
        socket.emit("message:seen", { token, roomId: currentRoomId });
      }
    }

    function handleMessageUpdate(message) {
      if (message.roomId !== currentRoomId) return;
      if (isBlockedAuthor(message.authorId)) {
        setMessages((current) => current.filter((item) => item.id !== message.id));
        return;
      }
      const mapped = mapApiMessage(message, user);
      setMessages((current) => current.map((item) => (item.id === mapped.id ? { ...item, ...mapped } : item)));
    }

    function handleMessageDelete(payload) {
      if (payload.roomId !== currentRoomId) return;
      setMessages((current) => current.filter((message) => message.id !== payload.messageId));
    }

    function handleDeliveryUpdate(message) {
      if (message.roomId !== currentRoomId) return;
      const mapped = mapApiMessage(message, user);
      setMessages((current) => current.map((item) => (item.id === mapped.id ? { ...item, delivery: mapped.delivery } : item)));
    }

    function handleSeen(payload) {
      if (payload.roomId !== currentRoomId || !payload.userId) return;
      setMessages((current) =>
        current.map((message) => {
          if (!message.self) return message;
          const seenBy = new Set(message.delivery?.seenBy || []);
          const deliveredTo = new Set(message.delivery?.deliveredTo || []);
          seenBy.add(String(payload.userId));
          deliveredTo.add(String(payload.userId));
          return {
            ...message,
            delivery: {
              ...(message.delivery || {}),
              seenBy: [...seenBy],
              deliveredTo: [...deliveredTo],
            },
          };
        })
      );
    }

    function handleRoomsUpdate(payload) {
      const nextRoom = (payload.rooms || []).find((item) => item.id === currentRoomId);
      if (nextRoom) setRoomInfo(nextRoom);
    }

    function handleServerError(payload) {
      if (payload?.error) toast(payload.error, "error");
    }

    socket.off("message:new", handleNewMessage);
    socket.off("message:update", handleMessageUpdate);
    socket.off("reaction:update", handleMessageUpdate);
    socket.off("message:delivery", handleDeliveryUpdate);
    socket.off("message:seen", handleSeen);
    socket.off("message:delete", handleMessageDelete);
    socket.off("rooms:update", handleRoomsUpdate);
    socket.off("server-error", handleServerError);
    socket.on("message:new", handleNewMessage);
    socket.on("message:update", handleMessageUpdate);
    socket.on("reaction:update", handleMessageUpdate);
    socket.on("message:delivery", handleDeliveryUpdate);
    socket.on("message:seen", handleSeen);
    socket.on("message:delete", handleMessageDelete);
    socket.on("rooms:update", handleRoomsUpdate);
    socket.on("server-error", handleServerError);

    if (!socket.connected) socket.connect();
    socket.emit("room:join", { token, roomId: currentRoomId });
    socket.emit("message:seen", { token, roomId: currentRoomId });

    return () => {
      active = false;
      socket.emit("room:leave", { token, roomId: currentRoomId });
      socket.off("message:new", handleNewMessage);
      socket.off("message:update", handleMessageUpdate);
      socket.off("reaction:update", handleMessageUpdate);
      socket.off("message:delivery", handleDeliveryUpdate);
      socket.off("message:seen", handleSeen);
      socket.off("message:delete", handleMessageDelete);
      socket.off("rooms:update", handleRoomsUpdate);
      socket.off("server-error", handleServerError);
    };
  }, [blockedIdSet, currentRoomId, token, toast, user]);

  function insertEmoji(emoji) {
    setText((current) => `${current}${emoji}`);
    setEmojiOpen(true);
    setPlusOpen(false);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function openAttachment(option) {
    setPlusOpen(false);
    setEmojiOpen(false);

    if (isGuest) {
      setGuestBannerVisible(true);
      toast("Create a free account to unlock attachments and rich message tools.", "info");
      return;
    }

    if (option.modal) {
      setQuickModal(option);
      return;
    }

    const input = fileInputRef.current;
    if (!input) return;
    input.value = "";
    input.accept = option.accept || "*/*";
    if (option.capture) input.setAttribute("capture", option.capture);
    else input.removeAttribute("capture");
    input.dataset.kind = option.id;
    input.click();
  }

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const inferredMimeType = mimeTypeFromName(file.name);
      const mimeType = inferredMimeType !== "application/octet-stream" ? inferredMimeType : file.type || inferredMimeType;
      const rawDataUrl = String(reader.result || "");
      const dataUrl = rawDataUrl.replace(/^data:[^;]*;base64,/, `data:${mimeType};base64,`);
      setAttachment({
        kind: event.target.dataset.kind || "file",
        name: file.name,
        size: file.size,
        mimeType,
        dataUrl,
      });
      toast("Attachment ready. Press Send.", "success");
    };
    reader.readAsDataURL(file);
  }

  function attachQuick(type, value) {
    setAttachment({ kind: type.id, name: value || type.label, text: value || `${type.label} attachment` });
    setQuickModal(null);
    toast(`${type.label} ready. Press Send.`, "success");
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function openReactionPicker(message) {
    setReactionPicker((current) => (current === message.id ? null : message.id));
    setEmojiOpen(false);
    setPlusOpen(false);
  }

  async function reactToMessage(message, emoji) {
    setReactionPicker(null);
    setActiveTouchMessageId(null);

    if (!isBackendMessage(message.id) || isGuest || !token) {
      setMessages((current) => current.map((item) => (item.id === message.id ? toggleLocalReaction(item, emoji, user?.id) : item)));
      if (isGuest) toast("Guest reactions are local. Sign up to react live.", "info");
      return;
    }

    try {
      const result = await api(`/api/messages/${message.id}/react`, {
        method: "POST",
        token,
        body: { token, emoji },
      });
      if (result.message) {
        const mapped = mapApiMessage(result.message, user);
        setMessages((current) => current.map((item) => (item.id === mapped.id ? { ...item, ...mapped } : item)));
      }
    } catch (error) {
      toast(error.message || "Could not update reaction.", "error");
    }
  }

  function replyToMessage(message) {
    setReplyTo(message);
    setEditingMessage(null);
    setReactionPicker(null);
    setActiveTouchMessageId(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function startEditing(message) {
    if (!message.self || !message.body || message.deletedAt) return;
    setText(message.body);
    setEditingMessage(message);
    setReplyTo(null);
    setAttachment(null);
    setReactionPicker(null);
    setActiveTouchMessageId(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function cancelEdit() {
    setEditingMessage(null);
    setText("");
  }

  function requestDelete(message) {
    setDeleteTarget(message);
    setReactionPicker(null);
    setActiveTouchMessageId(null);
  }

  async function deleteMessageFromChat(message, scope) {
    if (scope === "everyone" && !message.self) {
      toast("Delete for everyone is available only for your messages.", "error");
      return;
    }

    const previousMessages = messages;

    if (scope === "me") {
      setMessages((current) => current.filter((item) => item.id !== message.id));
    } else {
      setMessages((current) => current.map((item) => (item.id === message.id ? markDeleted(item, user?.id) : item)));
    }

    try {
      if (isBackendMessage(message.id) && token) {
        const result = await api(`/api/messages/${message.id}`, {
          method: "DELETE",
          token,
          body: { token, scope },
        });
        if (scope === "everyone" && result.message) {
          const mapped = mapApiMessage(result.message, user);
          setMessages((current) => current.map((item) => (item.id === mapped.id ? { ...item, ...mapped } : item)));
        }
      }
      toast(scope === "everyone" ? "Message deleted for everyone." : "Message deleted for you.", "success");
    } catch (error) {
      setMessages(previousMessages);
      toast(error.message || "Delete failed. Please try again.", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  function reportMessageRequest(message) {
    if (message.self) {
      toast("You cannot report your own message.", "error");
      return;
    }

    if (!isBackendMessage(message.id)) {
      toast("Only live chat messages can be reported.", "error");
      return;
    }

    setReportTarget(message);
    setReactionPicker(null);
    setActiveTouchMessageId(null);
  }

  async function reportMessage(reason) {
    if (!reportTarget) return;

    try {
      await api("/api/reports", {
        method: "POST",
        token,
        body: { token, messageId: reportTarget.id, reason },
      });
      toast("Report submitted \u2705", "success");
      setReportTarget(null);
    } catch (error) {
      toast(error.message || "Report failed. Please try again.", "error");
    }
  }

  function requestBlock(message) {
    if (message.self || !message.authorId) return;
    setBlockTarget(message);
    setReactionPicker(null);
    setActiveTouchMessageId(null);
  }

  async function confirmBlockUser() {
    if (!blockTarget?.authorId) return;

    try {
      await blockUser(blockTarget.authorId);
      setMessages((current) => current.filter((message) => String(message.authorId) !== String(blockTarget.authorId)));
      setBlockTarget(null);
      toast("User blocked. Their messages are now hidden. \u{1F6AB}", "success");
    } catch (error) {
      toast(error.message || "Could not block user.", "error");
    }
  }

  async function sendMessage(event) {
    event?.preventDefault?.();
    if (sending) return;

    const cleanBody = text.trim();

    if (editingMessage) {
      if (!cleanBody) {
        toast("Edited message cannot be empty.", "error");
        return;
      }

      await submitEdit(cleanBody);
      return;
    }

    if (!cleanBody && !attachment) return;

    const optimisticId = crypto.randomUUID();
    const messageText = quickAttachmentText(cleanBody, attachment);
    const createdAt = Date.now();
    const optimisticMessage = {
      id: optimisticId,
      roomId: currentRoomId,
      authorId: user?.id,
      author: user?.anonymousName || user?.name || "You",
      body: messageText,
      time: formatTime(createdAt),
      createdAt,
      self: true,
      attachment: attachment?.dataUrl ? attachment : null,
      replyTo: replyTo ? { author: replyTo.self ? "You" : replyTo.author, text: replyTo.body || replyTo.attachment?.name || "Attachment" } : null,
      pending: !isGuest,
      guestLocal: isGuest,
      delivery: {
        sentAt: createdAt,
        deliveredTo: [],
        seenBy: [],
      },
      reactionSummary: {},
      reactionsByUser: {},
      reactedBy: [],
      reactions: 0,
    };

    setMessages((current) => [...current, optimisticMessage]);
    setText("");
    setAttachment(null);
    setEmojiOpen(false);
    setPlusOpen(false);

    if (isGuest) {
      setReplyTo(null);
      toast("Guest message sent locally. Sign up to chat live across devices.", "info");
      requestAnimationFrame(() => textareaRef.current?.focus());
      return;
    }

    setSending(true);

    try {
      const payload = {
        token,
        roomId: currentRoomId,
        text: messageText,
        attachment: attachment?.dataUrl ? toApiAttachment(attachment) : null,
        replyToMessageId: replyTo && isBackendMessage(replyTo.id) ? replyTo.id : "",
      };
      const result = await api("/api/messages", { method: "POST", token, body: payload });
      const savedMessage = result.message ? mapApiMessage(result.message, user) : null;

      setMessages((current) => {
        if (!savedMessage) {
          return current.map((message) => (message.id === optimisticId ? { ...message, pending: false } : message));
        }

        const withoutOptimistic = current.filter((message) => message.id !== optimisticId);
        return mergeMessage(withoutOptimistic, savedMessage);
      });
    } catch (error) {
      setMessages((current) =>
        current.map((message) => (message.id === optimisticId ? { ...message, pending: false, failed: true } : message))
      );
      toast(error.message || "Message send failed. Please try again.", "error");
    } finally {
      setReplyTo(null);
      setSending(false);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }

  async function submitEdit(cleanBody) {
    const message = editingMessage;
    const previousMessages = messages;
    const editedAt = Date.now();
    setMessages((current) =>
      current.map((item) => (item.id === message.id ? { ...item, body: cleanBody, editedAt, time: item.time } : item))
    );
    setText("");
    setEditingMessage(null);
    setSending(true);

    try {
      if (isBackendMessage(message.id) && token && !isGuest) {
        const result = await api(`/api/messages/${message.id}`, {
          method: "PATCH",
          token,
          body: { token, text: cleanBody },
        });
        if (result.message) {
          const mapped = mapApiMessage(result.message, user);
          setMessages((current) => current.map((item) => (item.id === mapped.id ? { ...item, ...mapped } : item)));
        }
      }
      toast("Message edited.", "success");
    } catch (error) {
      setMessages(previousMessages);
      setText(message.body || "");
      setEditingMessage(message);
      toast(error.message || "Edit failed. Please try again.", "error");
    } finally {
      setSending(false);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }

  function startLongPress(message) {
    clearLongPress();
    touchTimerRef.current = window.setTimeout(() => {
      setActiveTouchMessageId(message.id);
      setReactionPicker(null);
    }, 500);
  }

  function clearLongPress() {
    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  }

  return (
    <div className="chat-room-page">
      <header className="room-header">
        <div>
          <h1># {room.name}</h1>
          <p><span className="status-dot" /> Public Room - {room.online} online now</p>
        </div>
        <strong>{room.online} online</strong>
      </header>
      {isGuest && guestBannerVisible ? <GuestUpgradeBanner compact onDismiss={() => setGuestBannerVisible(false)} /> : null}
      <div className="chat-workspace">
        <div className="chat-main-column">
          <Card className="message-feed">
            <div className="message-feed-scroll" ref={messageFeedRef}>
              <div className="guideline">Be respectful and follow community guidelines.</div>
              {visibleMessages.map((message, index) => {
                const previous = visibleMessages[index - 1];
                const grouped = isGroupedMessage(message, previous);

                return (
                  <article
                    className={`message-row ${message.self ? "self" : ""} ${grouped ? "grouped" : ""} ${message.selected ? "selected" : ""}`}
                    key={message.id}
                  >
                    {!message.self ? (
                      grouped ? (
                        <span className="message-avatar-spacer" aria-hidden="true" />
                      ) : (
                        <Avatar name={message.author} src={message.avatarDataUrl} tone={index === 0 ? "cyan" : "green"} />
                      )
                    ) : null}
                    <div
                      className={`chat-bubble ${message.self ? "self" : ""} ${message.failed ? "failed" : ""} ${message.pinned ? "pinned" : ""} ${message.starred ? "starred" : ""} ${activeTouchMessageId === message.id ? "touch-actions-visible" : ""} ${message.deletedAt ? "deleted" : ""}`}
                      onTouchStart={() => startLongPress(message)}
                      onTouchEnd={clearLongPress}
                      onTouchCancel={clearLongPress}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setActiveTouchMessageId(message.id);
                        }
                      }}
                      role="group"
                      tabIndex={0}
                    >
                      <MessageActionBar
                        message={message}
                        touchVisible={activeTouchMessageId === message.id}
                        onReact={openReactionPicker}
                        onReply={replyToMessage}
                        onEdit={startEditing}
                        onDelete={requestDelete}
                        onReport={reportMessageRequest}
                        onBlock={requestBlock}
                      />
                      {reactionPicker === message.id ? <ReactionPicker message={message} onPick={reactToMessage} /> : null}
                      {!grouped ? <strong>{message.self ? "You" : message.author}</strong> : null}
                      {message.replyTo ? <ReplySnippet replyTo={message.replyTo} /> : null}
                      {message.body ? <p>{message.body}</p> : null}
                      {message.attachment ? <AttachmentChip attachment={message.attachment} /> : null}
                      <MessageReactionSummary message={message} currentUserId={user?.id} onReact={reactToMessage} />
                      <footer className="message-meta">
                        <time>{message.time}</time>
                        {message.editedAt ? <span>edited</span> : null}
                        {message.pending ? <span>Sending</span> : null}
                        {message.failed ? <span>Failed</span> : null}
                        {message.guestLocal ? <span>Guest local</span> : null}
                        {message.self ? <DeliveryStatus message={message} /> : null}
                      </footer>
                    </div>
                    {message.self && !grouped ? <Avatar name={user?.anonymousName || user?.name || "You"} src={user?.avatarDataUrl} tone="violet" color={user?.avatarColor} /> : null}
                  </article>
                );
              })}
              {!visibleMessages.length ? <div className="chat-empty-state">No messages yet. Start the conversation.</div> : null}
            </div>
          </Card>

          {replyTo ? (
            <div className="composer-reply-preview">
              <span>Replying to <strong>{replyTo.self ? "You" : replyTo.author}</strong></span>
              <p>{replyTo.body || replyTo.attachment?.name || "Attachment"}</p>
              <button type="button" onClick={() => setReplyTo(null)} aria-label="Cancel reply">{icon.close}</button>
            </div>
          ) : null}

          {editingMessage ? (
            <div className="composer-edit-preview">
              <span>Editing message</span>
              <p>{editingMessage.body}</p>
              <button type="button" onClick={cancelEdit} aria-label="Cancel edit">{icon.close}</button>
            </div>
          ) : null}

          <form className="message-composer premium-composer whatsapp-composer" ref={composerRef} onSubmit={sendMessage}>
            {plusOpen ? (
              <div className="wa-attach-menu">
                {attachmentOptions.map((option) => (
                  <button type="button" key={option.id} onClick={() => openAttachment(option)}>
                    <span style={{ "--option-color": option.tone }}>{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}

            {emojiOpen ? (
              <div className="wa-emoji-picker" aria-label="Emoji picker">
                {emojis.map((emoji) => (
                  <button type="button" key={emoji} onClick={() => insertEmoji(emoji)}>{emoji}</button>
                ))}
              </div>
            ) : null}

            {attachment ? (
              <div className="attachment-preview">
                <AttachmentChip attachment={attachment} />
                <button type="button" onClick={() => setAttachment(null)} aria-label="Remove attachment">{icon.close}</button>
              </div>
            ) : null}

            <button
              className="composer-icon plus"
              type="button"
              aria-expanded={plusOpen}
              aria-label="Open attachment menu"
              onClick={() => {
                setPlusOpen((open) => !open);
                setEmojiOpen(false);
              }}
            >
              +
            </button>
            <button
              className="composer-icon emoji"
              type="button"
              aria-expanded={emojiOpen}
              aria-label="Open emoji picker"
              onClick={() => {
                setEmojiOpen((open) => !open);
                setPlusOpen(false);
              }}
            >
              {icon.smile}
            </button>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onMouseDown={() => {
                setReactionPicker(null);
                setActiveTouchMessageId(null);
                setEmojiOpen(false);
                setPlusOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={editingMessage ? "Edit message" : "Type a message"}
            />
            <button
              className="composer-send"
              type="submit"
              disabled={sending}
              aria-label={text.trim() || attachment ? (editingMessage ? "Save edit" : "Send message") : "Voice message"}
              title={text.trim() || attachment ? (editingMessage ? "Save edit" : "Send message") : "Voice message"}
            >
              {sending ? "Sending..." : text.trim() || attachment || editingMessage ? icon.send : icon.mic}
            </button>
            <input ref={fileInputRef} type="file" hidden onChange={handleFile} />
          </form>
        </div>

        <aside className="online-panel">
          <div>
            <h2>Online Members</h2>
            <span>{room.online} active</span>
          </div>
          <article className="member-row">
            <Avatar name="Anonymous" tone="violet" />
            <div>
              <strong>{room.online} anonymous user{room.online === 1 ? "" : "s"}</strong>
              <small><span />Online in this room</small>
            </div>
          </article>
        </aside>
      </div>

      {quickModal ? <QuickActionModal option={quickModal} onCancel={() => setQuickModal(null)} onSave={attachQuick} /> : null}
      {reportTarget ? <ReportModal message={reportTarget} onCancel={() => setReportTarget(null)} onReport={reportMessage} /> : null}
      {deleteTarget ? (
        <DeleteSheet
          message={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onDelete={(scope) => deleteMessageFromChat(deleteTarget, scope)}
        />
      ) : null}
      {blockTarget ? (
        <BlockConfirmModal
          message={blockTarget}
          onCancel={() => setBlockTarget(null)}
          onConfirm={confirmBlockUser}
        />
      ) : null}
    </div>
  );
}

function MessageActionBar({ message, touchVisible, onReact, onReply, onEdit, onDelete, onReport, onBlock }) {
  const actions = message.self
    ? [
        { id: "react", icon: icon.smile, label: "React", onClick: onReact },
        { id: "reply", icon: icon.reply, label: "Reply", onClick: onReply },
        { id: "edit", icon: icon.edit, label: "Edit", onClick: onEdit, disabled: message.deletedAt },
        { id: "delete", icon: icon.delete, label: "Delete", onClick: onDelete },
      ]
    : [
        { id: "react", icon: icon.smile, label: "React", onClick: onReact },
        { id: "reply", icon: icon.reply, label: "Reply", onClick: onReply },
        { id: "report", icon: icon.report, label: "Report", onClick: onReport },
        { id: "block", icon: icon.block, label: "Block", onClick: onBlock },
      ];

  return (
    <div className={`message-action-bar ${message.self ? "self" : ""} ${touchVisible ? "visible" : ""}`} aria-label="Message actions">
      {actions.map((action) => (
        <button
          type="button"
          key={action.id}
          title={action.label}
          aria-label={action.label}
          disabled={action.disabled}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            action.onClick(message);
          }}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

function ReactionPicker({ message, onPick }) {
  return (
    <div className={`message-reaction-picker ${message.self ? "self" : ""}`} aria-label="Choose reaction">
      {reactionEmojis.map((emoji) => (
        <button type="button" key={emoji} onClick={() => onPick(message, emoji)} title={`React ${emoji}`}>
          {emoji}
        </button>
      ))}
    </div>
  );
}

function MessageReactionSummary({ message, currentUserId, onReact }) {
  const entries = reactionEntries(message);
  if (!entries.length) return null;

  const myReaction = currentUserId ? message.reactionsByUser?.[currentUserId] : "";

  return (
    <div className="message-reactions">
      {entries.map(([emoji, count]) => (
        <button
          className={`reaction ${myReaction === emoji ? "active" : ""}`}
          type="button"
          key={emoji}
          onClick={(event) => {
            event.stopPropagation();
            onReact(message, emoji);
          }}
        >
          {emoji} {count}
        </button>
      ))}
    </div>
  );
}

function DeliveryStatus({ message }) {
  if (message.pending) return null;
  const seen = (message.delivery?.seenBy || []).length > 0;
  const delivered = (message.delivery?.deliveredTo || []).length > 0;

  if (seen) return <span className="delivery-status seen">{"\u2713\u2713"} Seen</span>;
  if (delivered) return <span className="delivery-status delivered">{"\u2713\u2713"} Delivered</span>;
  return <span className="delivery-status sent">{"\u2713"} Sent</span>;
}

function ReplySnippet({ replyTo }) {
  return (
    <div className="message-reply-snippet">
      <strong>{replyTo.author}</strong>
      <span>{replyTo.text}</span>
    </div>
  );
}

function AttachmentChip({ attachment }) {
  const mimeType = attachment.mimeType || attachment.type || "";
  const isImage = mimeType.startsWith("image/");

  return (
    <div className="attachment-chip">
      {isImage ? <img src={attachment.dataUrl} alt={attachment.name} /> : <span>{iconForAttachment(attachment.kind)}</span>}
      <div>
        <strong>{attachment.name}</strong>
        <small>{attachment.size ? `${Math.ceil(attachment.size / 1024)} KB` : attachment.kind}</small>
      </div>
    </div>
  );
}

function QuickActionModal({ option, onCancel, onSave }) {
  const [value, setValue] = useState("");

  return (
    <div className="quick-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <form className="quick-modal" onSubmit={(event) => { event.preventDefault(); onSave(option, value); }}>
        <div>
          <h2>{option.modal}</h2>
          <p>Add a quick {option.label.toLowerCase()} card to your next message.</p>
        </div>
        <input value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholderFor(option.id)} autoFocus />
        <div>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Attach</button>
        </div>
      </form>
    </div>
  );
}

function ReportModal({ message, onCancel, onReport }) {
  const [reason, setReason] = useState("Spam");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const finalReason = reason === "Other" && details.trim() ? details.trim() : reason;
      await onReport(finalReason);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="quick-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <form className="quick-modal report-modal" onSubmit={submit}>
        <div>
          <h2>Report message</h2>
          <p>Send this message to moderators for review.</p>
        </div>
        <div className="report-preview">
          <strong>{message.author}</strong>
          <span>{message.body || message.attachment?.name || "Attachment"}</span>
        </div>
        <div className="report-reason-list" role="radiogroup" aria-label="Report reason">
          {reportReasons.map((item) => (
            <button
              className={reason === item ? "active" : ""}
              type="button"
              key={item}
              onClick={() => setReason(item)}
              role="radio"
              aria-checked={reason === item}
            >
              {item}
            </button>
          ))}
        </div>
        {reason === "Other" ? (
          <label>
            <span>Details</span>
            <textarea rows="3" value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Optional note for moderators" />
          </label>
        ) : null}
        <div>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" disabled={loading}>{loading ? "Reporting..." : "Submit Report"}</button>
        </div>
      </form>
    </div>
  );
}

function DeleteSheet({ onCancel, onDelete }) {
  const [loadingScope, setLoadingScope] = useState("");

  async function submit(scope) {
    setLoadingScope(scope);
    await onDelete(scope);
    setLoadingScope("");
  }

  return (
    <div className="delete-sheet-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="delete-sheet" role="dialog" aria-modal="true" aria-label="Delete message">
        <h2>Delete message?</h2>
        <button className="delete-outline" type="button" disabled={Boolean(loadingScope)} onClick={() => submit("me")}>
          {loadingScope === "me" ? "Deleting..." : "Delete for me"}
        </button>
        <button className="delete-solid" type="button" disabled={Boolean(loadingScope)} onClick={() => submit("everyone")}>
          {loadingScope === "everyone" ? "Deleting..." : "Delete for everyone"}
        </button>
        <button className="delete-ghost" type="button" disabled={Boolean(loadingScope)} onClick={onCancel}>Cancel</button>
      </section>
    </div>
  );
}

function BlockConfirmModal({ message, onCancel, onConfirm }) {
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="quick-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="block-confirm-modal" role="dialog" aria-modal="true" aria-label="Block this user">
        <h2>{icon.block} Block this user?</h2>
        <p>Blocking "{message.author || "Anonymous User"}" will:</p>
        <ul>
          <li>Hide their messages</li>
          <li>They will not know you blocked them</li>
          <li>You can unblock anytime in Settings</li>
        </ul>
        <div>
          <button type="button" onClick={onCancel} disabled={loading}>Cancel</button>
          <button type="button" onClick={confirm} disabled={loading}>{loading ? "Blocking..." : "Block User"}</button>
        </div>
      </section>
    </div>
  );
}

function toApiAttachment(file) {
  return {
    kind: file.kind || "file",
    name: file.name || "attachment",
    size: file.size,
    mimeType: file.mimeType || file.type || mimeTypeFromName(file.name),
    dataUrl: file.dataUrl,
  };
}

function mapApiMessage(message, user) {
  const createdAt = toMillis(message.createdAt) || Date.now();
  const self = message.authorId && user?.id ? String(message.authorId) === String(user.id) : message.author === user?.name;

  return {
    id: message.id,
    roomId: message.roomId,
    authorId: message.authorId,
    author: message.author || user?.name || "Anonymous User",
    body: message.text || "",
    time: formatTime(createdAt),
    createdAt,
    self,
    attachment: message.attachment || null,
    avatarDataUrl: message.avatarDataUrl || "",
    avatarColor: message.avatarColor || "",
    replyTo: message.replyTo
      ? { author: message.replyTo.author || "Message", text: message.replyTo.text || message.replyTo.body || "Attachment" }
      : null,
    pending: false,
    editedAt: toMillis(message.editedAt),
    deletedAt: toMillis(message.deletedAt),
    delivery: {
      sentAt: toMillis(message.delivery?.sentAt) || createdAt,
      deliveredTo: Array.isArray(message.delivery?.deliveredTo) ? message.delivery.deliveredTo.map(String) : [],
      seenBy: Array.isArray(message.delivery?.seenBy) ? message.delivery.seenBy.map(String) : [],
    },
    reactions: Number(message.reactions || 0),
    reactedBy: Array.isArray(message.reactedBy) ? message.reactedBy.map(String) : [],
    reactionSummary: normalizeReactionSummary(message.reactionSummary),
    reactionsByUser: normalizeReactionsByUser(message.reactionsByUser, message.reactedBy),
  };
}

function mergeMessage(current, incoming) {
  const existingIndex = current.findIndex((message) => message.id === incoming.id);

  if (existingIndex !== -1) {
    return current.map((message) => (message.id === incoming.id ? { ...message, ...incoming, pending: false } : message));
  }

  const optimisticIndex = current.findIndex(
    (message) => message.pending && message.self && incoming.self && message.body === incoming.body
  );

  if (optimisticIndex !== -1) {
    return current.map((message, index) => (index === optimisticIndex ? incoming : message));
  }

  return [...current, incoming].sort((first, second) => Number(first.createdAt || 0) - Number(second.createdAt || 0));
}

function toggleLocalReaction(message, emoji, userId = "local-user") {
  const actorId = String(userId || "local-user");
  const reactionsByUser = { ...(message.reactionsByUser || {}) };

  if (reactionsByUser[actorId] === emoji) {
    delete reactionsByUser[actorId];
  } else {
    reactionsByUser[actorId] = emoji;
  }

  const reactionSummary = summarizeReactionMap(reactionsByUser);
  const reactedBy = Object.keys(reactionsByUser);

  return {
    ...message,
    reactionsByUser,
    reactionSummary,
    reactedBy,
    reactions: reactedBy.length,
  };
}

function markDeleted(message, userId) {
  return {
    ...message,
    body: "This message was deleted",
    attachment: null,
    editedAt: null,
    deletedAt: Date.now(),
    deletedBy: userId,
    reactionSummary: {},
    reactionsByUser: {},
    reactedBy: [],
    reactions: 0,
  };
}

function quickAttachmentText(body, file) {
  if (!file || file.dataUrl) return body;
  const label = `[${titleCase(file.kind)}] ${file.text || file.name}`.trim();
  return body ? `${body}\n${label}` : label;
}

function isGroupedMessage(message, previous) {
  if (!message || !previous) return false;
  const sameAuthor = String(message.authorId || message.author || message.self) === String(previous.authorId || previous.author || previous.self);
  const closeInTime = Math.abs(Number(message.createdAt || 0) - Number(previous.createdAt || 0)) <= 2 * 60 * 1000;
  return sameAuthor && closeInTime;
}

function isBackendMessage(id = "") {
  return String(id).startsWith("msg_");
}

function normalizeRoomId(value) {
  return value === "general-chat" ? "general" : value;
}

function toMillis(value) {
  if (!value) return null;
  if (typeof value === "number") return value;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeReactionSummary(summary = {}) {
  if (!summary || typeof summary !== "object") return {};
  return Object.entries(summary).reduce((next, [emoji, count]) => {
    if (Number(count) > 0) next[emoji] = Number(count);
    return next;
  }, {});
}

function normalizeReactionsByUser(reactionsByUser = {}, reactedBy = []) {
  const entries = reactionsByUser && typeof reactionsByUser === "object" ? Object.entries(reactionsByUser) : [];
  if (entries.length) {
    return entries.reduce((next, [userId, emoji]) => {
      next[String(userId)] = String(emoji);
      return next;
    }, {});
  }

  return (Array.isArray(reactedBy) ? reactedBy : []).reduce((next, userId) => {
    next[String(userId)] = "\u{1F44D}";
    return next;
  }, {});
}

function reactionEntries(message) {
  const summary = normalizeReactionSummary(message.reactionSummary);
  const entries = reactionEmojis
    .map((emoji) => [emoji, Number(summary[emoji] || 0)])
    .filter(([, count]) => count > 0);

  if (entries.length) return entries;
  if (message.reactions > 0) return [["\u{1F44D}", Number(message.reactions)]];
  return [];
}

function summarizeReactionMap(reactionsByUser = {}) {
  return Object.values(reactionsByUser).reduce((summary, emoji) => {
    summary[emoji] = (summary[emoji] || 0) + 1;
    return summary;
  }, {});
}

function mimeTypeFromName(name = "") {
  const extension = name.split(".").pop()?.toLowerCase();
  return {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    webm: "audio/webm",
    mp4: "video/mp4",
    mov: "video/quicktime",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
  }[extension] || "application/octet-stream";
}

function iconForAttachment(kind) {
  return {
    document: "\u{1F4C4}",
    media: "\u{1F5BC}\uFE0F",
    camera: "\u{1F4F7}",
    audio: "\u{1F3A7}",
    contact: "\u{1F464}",
    poll: "\u{1F4CA}",
    event: "\u{1F4C5}",
    sticker: "\u2728",
  }[kind] || "\u{1F4CE}";
}

function placeholderFor(kind) {
  return {
    contact: "Name, phone number",
    poll: "Poll question",
    event: "Event title and time",
  }[kind] || "Attachment details";
}

function titleCase(value = "") {
  return value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
