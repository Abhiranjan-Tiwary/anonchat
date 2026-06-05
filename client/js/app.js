const SESSION_KEY = "anonchat-session-v4";
const ROOM_KEY = "anonchat-active-room-v4";
const API_BASE = "";
const LANDING_ROUTE = "/";
const LOGIN_ROUTE = "/login";
const SIGNUP_ROUTE = "/signup";
const ADMIN_LOGIN_ROUTE = "/admin/login";
const PRIVACY_ROUTE = "/privacy";
const DATA_DELETION_ROUTE = "/data-deletion";
const CHAT_ROUTE = "/chat";
const DASHBOARD_ROUTE = "/dashboard";
const MY_ROOMS_ROUTE = "/my-rooms";
const SETTINGS_ROUTE = "/settings";
const PROFILE_ROUTE = "/profile";
const NOTIFICATIONS_ROUTE = "/notifications";
const USER_ROUTE_VALUES = Object.freeze([CHAT_ROUTE, DASHBOARD_ROUTE, MY_ROOMS_ROUTE, SETTINGS_ROUTE, PROFILE_ROUTE, NOTIFICATIONS_ROUTE]);
const PUBLIC_ROUTE_VALUES = Object.freeze([PRIVACY_ROUTE, DATA_DELETION_ROUTE]);
const NOTIFICATION_READ_KEY = "anonchat-notifications-read-v1";
const USER_SETTINGS_KEY = "anonchat-user-settings-v1";
const THEME_KEY = "anonchat-theme-v1";
const INSTALL_PROMPT_DISMISSED_KEY = "anonchat-install-dismissed-at-v1";
const INSTALL_PROMPT_DISMISS_MS = 24 * 60 * 60 * 1000;
const CONNECTION_TOAST_COOLDOWN_MS = 8000;
const API_TIMEOUT_MS = 25000;
const PINNED_ROOMS_KEY = "anonchat-pinned-rooms-v1";
const PINNED_MESSAGES_KEY = "anonchat-pinned-messages-v1";
const STARRED_MESSAGES_KEY = "anonchat-starred-messages-v1";
const ADMIN_ROUTES = Object.freeze({
  dashboard: "/admin/dashboard",
  users: "/admin/users",
  chatRooms: "/admin/chat-rooms",
  reports: "/admin/reports",
  blockedUsers: "/admin/blocked-users",
  messagesMonitoring: "/admin/messages-monitoring",
  announcements: "/admin/announcements",
  settings: "/admin/settings",
});
const ADMIN_DASHBOARD_ROUTE = ADMIN_ROUTES.dashboard;
const ADMIN_ROUTE_ITEMS = Object.freeze([
  { label: "Dashboard", route: ADMIN_ROUTES.dashboard, icon: "DB" },
  { label: "Users", route: ADMIN_ROUTES.users, icon: "US" },
  { label: "Chat Rooms", route: ADMIN_ROUTES.chatRooms, icon: "CR" },
  { label: "Reports", route: ADMIN_ROUTES.reports, icon: "RP" },
  { label: "Blocked Users", route: ADMIN_ROUTES.blockedUsers, icon: "BU" },
  { label: "Messages Monitoring", route: ADMIN_ROUTES.messagesMonitoring, icon: "MM" },
  { label: "Announcements", route: ADMIN_ROUTES.announcements, icon: "AN" },
  { label: "Settings", route: ADMIN_ROUTES.settings, icon: "ST" },
]);
const ADMIN_ROUTE_VALUES = Object.freeze(Object.values(ADMIN_ROUTES));
const ADMIN_PAGE_META = Object.freeze({
  [ADMIN_ROUTES.dashboard]: ["Dashboard", "Platform overview, reports, and system health."],
  [ADMIN_ROUTES.users]: ["Users", "Review registered accounts, profile details, and safety status."],
  [ADMIN_ROUTES.chatRooms]: ["Chat Rooms", "Manage public rooms, activity levels, and room health."],
  [ADMIN_ROUTES.reports]: ["Reports", "Track moderation reports with status, priority, and actions."],
  [ADMIN_ROUTES.blockedUsers]: ["Blocked Users", "See suspended accounts and reactivate users when needed."],
  [ADMIN_ROUTES.messagesMonitoring]: ["Messages Monitoring", "Monitor recent conversations for safety signals."],
  [ADMIN_ROUTES.announcements]: ["Announcements", "Draft platform notices and review recent broadcasts."],
  [ADMIN_ROUTES.settings]: ["Settings", "Manage admin profile, platform defaults, and moderation controls."],
});
const ROOM_DISPLAY_FALLBACKS = Object.freeze({
  general: {
    id: "general",
    slug: "general",
    name: "General Chat",
    desc: "Campus-wide open discussion",
    category: "Public Room",
    icon: "💬",
    color: "#7c3aed",
  },
  "random-talk": {
    id: "random-talk",
    slug: "random-talk",
    name: "Random Talk",
    desc: "Casual anonymous conversations",
    category: "Public Room",
    icon: "🎲",
    color: "#0ea5e9",
  },
  "deep-talk": {
    id: "deep-talk",
    slug: "deep-talk",
    name: "Deep Talk",
    desc: "Late-night honest thoughts",
    category: "Public Room",
    icon: "🌙",
    color: "#a855f7",
  },
  confessions: {
    id: "confessions",
    slug: "confessions",
    name: "Confessions",
    desc: "Anonymous thoughts and campus secrets",
    category: "Public Room",
    icon: "🤫",
    color: "#ec4899",
  },
});
const HOME_ROOM_ORDER = Object.freeze([
  "general",
  "random-talk",
  "deep-talk",
  "confessions",
]);
const HIDDEN_LEGACY_ROOM_IDS = Object.freeze(new Set([
  "seniors-help",
  "cs-dept",
  "clubs",
  "placements",
  "polls",
  "gaming-zone",
  "music-lounge",
  "events",
  "lost-found",
  "lost-and-found",
]));
const MESSAGE_REACTION_EMOJIS = Object.freeze(["\u2764\uFE0F", "\u{1F602}", "\u{1F525}", "\u{1F44D}", "\u{1F62D}", "\u{1F440}", "\u{1F389}"]);
const RECENT_REACTIONS_KEY = "anonchat-recent-reactions-v1";
const PASSWORD_RULE_TEXT =
  "Password must be 8-64 characters and include uppercase, lowercase, number, and symbol (! @ # $ % ^ & * _ - + = . ?).";
const CALL_TIMEOUT_MS = 45000;
const RTC_CONFIGURATION = Object.freeze({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});
const CLIENT_ALLOWED_ATTACHMENT_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "audio/webm",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/ogg",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);
const VOICE_MIME_CANDIDATES = Object.freeze([
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
  "audio/ogg",
]);
const VOICE_EXTENSION_BY_MIME = Object.freeze({
  "audio/webm": "webm",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
});
let state = {
  session: loadSession(),
  activeRoomId: localStorage.getItem(ROOM_KEY) || "",
  route: normalizeRoute(window.location.pathname),
  authMode: "login",
  authSubmitting: false,
  adminView: "review",
  adminUserSearchQuery: "",
  adminMessageSearchQuery: "",
  adminAnnouncementEditingId: null,
  replyToMessageId: null,
  editingMessageId: null,
  deleteMessageId: null,
  activeReactionMessageId: null,
  blockMessageId: null,
  messageSearchQuery: "",
  pendingAttachment: null,
  notifications: [],
  announcements: [],
  resetToken: "",
  resetEmail: "",
  resetStep: "email",
  rooms: [],
  messages: [],
  reports: [],
  typing: [],
  presence: {},
  myRooms: [],
  blockedUsers: [],
  unlockedRoomIds: new Set(),
  userSettings: defaultUserSettings(),
  admin: {
    users: [],
    reports: [],
    deletedUsers: [],
    auditLogs: [],
    rooms: [],
    messages: [],
    announcements: [],
    settings: {},
  },
  stats: {
    online: 0,
    users: 0,
    openReports: 0,
    hiddenMessages: 0,
  },
};

let selectedReportMessageId = null;
let activePanel = "pulse";
let socket = null;
let socketClientLoadPromise = null;
let joinedRoomId = null;
let typingTimer = null;
let typingRequestTimer = null;
let roomMessageFetchToken = 0;
const roomMessagesLoadedAt = new Map();
let adminSearchDebounce = null;
let selectedMonitorUserId = null;
let selectedMonitorUserName = "";
let selectedMonitorUserColor = "#6c63ff";
let monitorAutoRefresh = null;
let monitorUserSearchQuery = "";
let monitorUsersCache = [];
let selectedProfileAuthorId = null;
let selectedProfileMessageId = null;
let pendingAvatarDataUrl = "";
let cropState = null;
let mediaRecorder = null;
let voiceChunks = [];
let voiceRecorderStream = null;
let voiceRecorderStartedAt = 0;
let voiceRecorderPausedAt = 0;
let voiceRecorderPausedMs = 0;
let voiceRecorderTimer = null;
let voiceRecorderFinalizing = false;
let voiceRecorderDurationSeconds = 0;
let voiceRecorderUploadProgress = 0;
let messageLongPressTimer = null;
let pendingRoomJoin = null;
let activeContextChatId = null;
let activeContextChatEl = null;
let chatContextIsScrolling = false;
let chatContextScrollTimer = null;
let chatContextTouchTimer = null;
let chatContextTouchMoved = false;
let joiningRoomId = null;
let isSubmittingMessage = false;
let lastMessageSubmitKey = "";
let messageSubmitCooldownTimer = null;
let activeMessageContextId = null;
let activeMessageContextEl = null;
let messageTouchState = null;
let presenceRenderTimer = null;
let mediaGalleryTab = "images";
let themePreferenceTimer = null;
let messageRenderState = {
  roomId: "",
  query: "",
  ready: false,
};
let roomSummaryRenderTimer = null;
let deferredInstallPrompt = null;
let socketHasConnectedOnce = false;
let connectionStatus = "offline";
let lastConnectionToastAt = 0;
let notificationAudioContext = null;
let ringtoneTimer = null;
const originalDocumentTitle = document.title;
let mediaViewerState = {
  type: "image",
  src: "",
  caption: "",
  scale: 1,
  panX: 0,
  panY: 0,
  dragging: false,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
};
let callState = {
  active: false,
  direction: "",
  status: "idle",
  type: "audio",
  callId: "",
  roomId: "",
  peer: null,
  pendingIncoming: null,
  pc: null,
  localStream: null,
  remoteStream: null,
  startedAt: 0,
  durationTimer: null,
  timeoutTimer: null,
  muted: false,
  cameraOff: false,
  facingMode: "user",
  minimized: false,
  ending: false,
};
let sidebarTouchStartX = null;
let sidebarTouchStartY = null;
let adminSidebarTouchStartX = null;
let adminSidebarTouchStartY = null;

const elements = {};

document.addEventListener("DOMContentLoaded", async () => {
  cacheElements();
  applyThemeChoice(loadInitialThemeChoice(), { persist: false, transition: false });
  updateConnectionStatusUi();
  initThemeSystem();
  bindGlobalClickFallbacks();
  bindSocialAuthListener();
  try {
    bindEvents();
  } catch (error) {
    console.error("Some click handlers could not be bound:", error);
  }
  initPwaExperience();
  syncAuthModeFromRoute();
  renderAuthShell();

  try {
    await refreshState();
    applyThemeChoice(loadUserSettings().theme, { persist: false, transition: false });
    if (state.session) connectLiveUpdates();
    render();
  } catch (error) {
    showOfflineError(error);
  }
});

function cacheElements() {
  elements.authView = document.querySelector("#authView");
  elements.publicPageView = document.querySelector("#publicPageView");
  elements.chatView = document.querySelector("#chatView");
  elements.adminDashboardView = document.querySelector("#adminDashboardView");
  elements.adminDashboardShell = document.querySelector("#adminDashboardShell");
  elements.authPanel = document.querySelector(".auth-panel");
  elements.authForm = document.querySelector("#authForm");
  elements.authTitle = document.querySelector("#authTitle");
  elements.authSubtitle = document.querySelector("#authSubtitle");
  elements.authInlineError = document.querySelector("#authInlineError");
  elements.authSubmitButton = document.querySelector("#authSubmitButton");
  elements.authTabs = document.querySelectorAll("[data-auth-mode]");
  elements.closeAuthPanel = document.querySelector("#closeAuthPanel");
  elements.socialRow = document.querySelector("#socialRow");
  elements.authDivider = document.querySelector("#authDivider");
  elements.authFooterText = document.querySelector("#authFooterText");
  elements.authModeLink = document.querySelector("#authModeLink");
  elements.adminModeLink = document.querySelector("#adminModeLink");
  elements.guestModeButton =
    document.querySelector("[data-guest-mode], #continueAsGuest, .guest-link, #guestModeButton") ||
    [...document.querySelectorAll("button, a")].find((item) => item.textContent.trim().toLowerCase().includes("continue as guest"));
  elements.socialButtons = document.querySelectorAll("[data-social-provider]");
  elements.forgotPasswordButton = document.querySelector("#forgotPasswordButton");
  elements.accountAccessButton = document.querySelector("#accountAccessButton");
  elements.loginIdentifierInput = document.querySelector("#loginIdentifierInput");
  elements.adminUsernameInput = document.querySelector("#adminUsernameInput");
  elements.fullNameInput = document.querySelector("#fullNameInput");
  elements.usernameInput = document.querySelector("#usernameInput");
  elements.emailInput = document.querySelector("#emailInput");
  elements.passwordInput = document.querySelector("#passwordInput");
  elements.passwordLabel = document.querySelector("#passwordLabel");
  elements.dateOfBirthInput = document.querySelector("#dateOfBirthInput");
  elements.passwordToggleButtons = document.querySelectorAll("[data-password-toggle]");
  elements.campusName = document.querySelector("#campusName");
  elements.sidebarMenu = document.querySelector("#sidebarMenu");
  elements.sidebarChannelTitle = document.querySelector("#sidebarChannelTitle");
  elements.roomList = document.querySelector("#roomList");
  elements.sidebarDmList = document.querySelector("#sidebarDmList");
  elements.roomSearch = document.querySelector("#roomSearch");
  elements.messageSearch = document.querySelector("#messageSearch");
  elements.chatRoomTitle = document.querySelector("#chatRoomTitle");
  elements.chatTopbar = document.querySelector(".chat-topbar");
  elements.guidelineNotice = document.querySelector(".guideline-notice");
  elements.chatSearchBar = document.querySelector("#chatSearchBar");
  elements.chatSearchInput = document.querySelector("#chatSearchInput");
  elements.chatSearchCount = document.querySelector("#chatSearchCount");
  elements.closeSearchButton = document.querySelector("#closeSearchBtn");
  elements.activeRoomName = document.querySelector("#activeRoomName");
  elements.activeRoomMeta = document.querySelector("#activeRoomMeta");
  elements.activeRoomIcon = document.querySelector("#activeRoomIcon");
  elements.roomCategory = document.querySelector("#roomCategory");
  elements.topbarOnlineCount = document.querySelector("#topbarOnlineCount");
  elements.connectionStatus = document.querySelector("#connectionStatus");
  elements.topbarAudioCallButton = document.querySelector("#topbarAudioCallButton");
  elements.topbarVideoCallButton = document.querySelector("#topbarVideoCallButton");
  elements.topbarSearchButton = document.querySelector("#topbarSearchButton");
  elements.mediaGalleryButton = document.querySelector("#mediaGalleryButton");
  elements.chatFeed = document.querySelector("#chatFeed");
  elements.scrollToBottomButton = document.querySelector("#scrollToBottomButton");
  elements.scrollUnreadBadge = document.querySelector("#scrollUnreadBadge");
  elements.typingIndicator = document.querySelector("#typingIndicator");
  elements.replyPreview = document.querySelector("#replyPreview");
  elements.messageForm = document.querySelector("#messageForm");
  elements.messageInput = document.querySelector("#messageInput");
  elements.attachButton = document.querySelector("#attachButton");
  elements.emojiButton = document.querySelector("#emojiButton");
  elements.voiceButton = document.querySelector("#voiceButton");
  elements.sendMessageButton = document.querySelector("#sendMessageButton");
  elements.pollButton = document.querySelector("#pollButton");
  elements.attachmentMenu = document.querySelector("#attachmentMenu");
  elements.emojiPicker = document.querySelector("#emojiPicker");
  elements.messageAttachmentInput = document.querySelector("#messageAttachmentInput");
  elements.attachmentPreview = document.querySelector("#attachmentPreview");
  elements.voiceRecorderBar = document.querySelector("#voiceRecorderBar");
  elements.pwaInstallButton = document.querySelector("#pwaInstallButton");
  elements.mobileAppMenuButton = document.querySelector("#mobileAppMenuButton");
  elements.mobileAppMenu = document.querySelector("#mobileAppMenu");
  elements.mobileAppMenuSheet = document.querySelector("#mobileAppMenu .mobile-app-menu-sheet");
  elements.mobileMenuRooms = document.querySelector("#mobileMenuRooms");
  elements.themeToggleButtons = document.querySelectorAll("[data-theme-toggle]");
  elements.profileName = document.querySelector("#profileName");
  elements.profileMeta = document.querySelector("#profileMeta");
  elements.profileAvatar = document.querySelector("#profileAvatar");
  elements.chatMain = document.querySelector(".chat-main");
  elements.homeView = document.querySelector("#homeView");
  elements.logoutButton = document.querySelector("#logoutButton");
  elements.profileButton = document.querySelector("#profileButton");
  elements.quickConfession = document.querySelector("#quickConfession");
  elements.sidebar = document.querySelector("#sidebar");
  elements.openSidebar = document.querySelector("#hamburgerBtn, #openSidebar");
  elements.hamburgerButton = document.querySelector("#hamburgerBtn");
  elements.sidebarOverlay = document.querySelector("#sidebarOverlay");
  elements.closeSidebar = document.querySelector("#closeSidebar");
  elements.detailsPanel = document.querySelector("#detailsPanel");
  elements.togglePanel = document.querySelector("#togglePanel");
  elements.settingsTopButton = document.querySelector("#settingsTopButton");
  elements.closeDetailsPanel = document.querySelector("#closeDetailsPanel");
  elements.notificationButton = document.querySelector("#notificationButton");
  elements.notificationCount = document.querySelector("#notificationCount");
  elements.sidebarNotificationDot = document.querySelector("#sidebarNotificationDot");
  elements.userInfoPanel = document.querySelector("#userInfoPanel");
  elements.safetyPanel = document.querySelector("#safetyPanel");
  elements.pulsePanel = document.querySelector("#pulsePanel");
  elements.profilePanel = document.querySelector("#profilePanel");
  elements.moderationPanel = document.querySelector("#moderationPanel");
  elements.reportModal = document.querySelector("#reportModal");
  elements.reportForm = document.querySelector("#reportForm");
  elements.reportPreview = document.querySelector("#reportPreview");
  elements.reportReason = document.querySelector("#reportReason");
  elements.closeReportModal = document.querySelector("#closeReportModal");
  elements.deleteMessageSheet = document.querySelector("#deleteMessageSheet");
  elements.blockUserModal = document.querySelector("#blockUserModal");
  elements.blockUserName = document.querySelector("#blockUserName");
  elements.cancelBlockUserButton = document.querySelector("#cancelBlockUserButton");
  elements.confirmBlockUserButton = document.querySelector("#confirmBlockUserButton");
  elements.closeBlockUserModal = document.querySelector("#closeBlockUserModal");
  elements.cancelDeleteMessageButton = document.querySelector("#cancelDeleteMessageButton");
  elements.roomPasswordModal = document.querySelector("#roomPasswordModal");
  elements.passwordModalRoomIcon = document.querySelector("#passwordModalRoomIcon");
  elements.passwordModalRoomName = document.querySelector("#passwordModalRoomName");
  elements.roomPasswordInput = document.querySelector("#roomPasswordInput");
  elements.roomPasswordError = document.querySelector("#roomPasswordError");
  elements.toggleRoomPassword = document.querySelector("#toggleRoomPassword");
  elements.cancelRoomPassword = document.querySelector("#cancelRoomPassword");
  elements.cancelRoomPasswordFooter = document.querySelector("#cancelRoomPasswordFooter");
  elements.confirmRoomPassword = document.querySelector("#confirmRoomPassword");
  elements.avatarCropModal = document.querySelector("#avatarCropModal");
  elements.avatarCropCanvas = document.querySelector("#avatarCropCanvas");
  elements.avatarZoomInput = document.querySelector("#avatarZoomInput");
  elements.closeAvatarCropModal = document.querySelector("#closeAvatarCropModal");
  elements.cancelAvatarCropButton = document.querySelector("#cancelAvatarCropButton");
  elements.saveAvatarCropButton = document.querySelector("#saveAvatarCropButton");
  elements.passwordResetModal = document.querySelector("#passwordResetModal");
  elements.passwordResetForm = document.querySelector("#passwordResetForm");
  elements.closePasswordResetModal = document.querySelector("#closePasswordResetModal");
  elements.requestResetButton = document.querySelector("#requestResetButton");
  elements.verifyResetOtpButton = document.querySelector("#verifyResetOtpButton");
  elements.submitResetPasswordButton = document.querySelector("#submitResetPasswordButton");
  elements.resetEmailInput = document.querySelector("#resetEmailInput");
  elements.resetOtpInput = document.querySelector("#resetOtpInput");
  elements.resetPasswordInput = document.querySelector("#resetPasswordInput");
  elements.resetUsernameInput = document.querySelector("#resetUsernameInput");
  elements.resetOtpStep = document.querySelector("#resetOtpStep");
  elements.resetPasswordStep = document.querySelector("#resetPasswordStep");
  elements.passwordResetHelp = document.querySelector("#passwordResetHelp");
  elements.composerPlaceholderModal = document.querySelector("#composerPlaceholderModal");
  elements.composerPlaceholderTitle = document.querySelector("#composerPlaceholderTitle");
  elements.composerPlaceholderBody = document.querySelector("#composerPlaceholderBody");
  elements.closeComposerPlaceholderModal = document.querySelector("#closeComposerPlaceholderModal");
  elements.composerPlaceholderOkButton = document.querySelector("#composerPlaceholderOkButton");
  elements.chatContextMenu = document.querySelector("#chatContextMenu");
  elements.imageLightbox = document.querySelector("#imageLightbox");
  elements.lightboxOverlay = document.querySelector("#lightboxOverlay");
  elements.lightboxClose = document.querySelector("#lightboxClose");
  elements.lightboxZoomIn = document.querySelector("#lightboxZoomIn");
  elements.lightboxZoomOut = document.querySelector("#lightboxZoomOut");
  elements.lightboxDownload = document.querySelector("#lightboxDownload");
  elements.lightboxShare = document.querySelector("#lightboxShare");
  elements.lightboxStage = document.querySelector("#lightboxStage");
  elements.lightboxImg = document.querySelector("#lightboxImg");
  elements.lightboxVideo = document.querySelector("#lightboxVideo");
  elements.lightboxAudio = document.querySelector("#lightboxAudio");
  elements.lightboxCaption = document.querySelector("#lightboxCaption");
  elements.messageContextMenu = document.querySelector("#messageContextMenu");
  elements.mediaGalleryModal = document.querySelector("#mediaGalleryModal");
  elements.mediaGalleryOverlay = document.querySelector("#mediaGalleryOverlay");
  elements.closeMediaGallery = document.querySelector("#closeMediaGallery");
  elements.mediaGalleryGrid = document.querySelector("#mediaGalleryGrid");
  elements.mediaGalleryTabs = document.querySelectorAll("[data-gallery-tab]");
  elements.userProfilePanel = document.querySelector("#userProfilePanel");
  elements.profileOverlay = document.querySelector("#userProfilePanel .profile-overlay");
  elements.profileDrawer = document.querySelector("#userProfilePanel .profile-drawer");
  elements.closeProfilePanel = document.querySelector("#closeProfilePanel");
  elements.viewAvatar = document.querySelector("#viewAvatar");
  elements.viewName = document.querySelector("#viewName");
  elements.viewUsername = document.querySelector("#viewUsername");
  elements.viewAbout = document.querySelector("#viewAbout");
  elements.viewDept = document.querySelector("#viewDept");
  elements.viewCampus = document.querySelector("#viewCampus");
  elements.viewJoined = document.querySelector("#viewJoined");
  elements.blockFromProfile = document.querySelector("#blockFromProfile");
  elements.reportFromProfile = document.querySelector("#reportFromProfile");
  elements.audioCallFromProfile = document.querySelector("#audioCallFromProfile");
  elements.videoCallFromProfile = document.querySelector("#videoCallFromProfile");
  elements.callLayer = document.querySelector("#callLayer");
  elements.incomingCallCard = document.querySelector("#incomingCallCard");
  elements.incomingCallAvatar = document.querySelector("#incomingCallAvatar");
  elements.incomingCallName = document.querySelector("#incomingCallName");
  elements.incomingCallType = document.querySelector("#incomingCallType");
  elements.acceptCallButton = document.querySelector("#acceptCallButton");
  elements.rejectCallButton = document.querySelector("#rejectCallButton");
  elements.callScreen = document.querySelector("#callScreen");
  elements.remoteVideo = document.querySelector("#remoteVideo");
  elements.localVideo = document.querySelector("#localVideo");
  elements.audioCallFocus = document.querySelector("#audioCallFocus");
  elements.callPeerAvatar = document.querySelector("#callPeerAvatar");
  elements.callPeerName = document.querySelector("#callPeerName");
  elements.callStatusText = document.querySelector("#callStatusText");
  elements.callDuration = document.querySelector("#callDuration");
  elements.muteCallButton = document.querySelector("#muteCallButton");
  elements.cameraCallButton = document.querySelector("#cameraCallButton");
  elements.switchCameraButton = document.querySelector("#switchCameraButton");
  elements.fullscreenCallButton = document.querySelector("#fullscreenCallButton");
  elements.minimizeCallButton = document.querySelector("#minimizeCallButton");
  elements.endCallButton = document.querySelector("#endCallButton");
  elements.floatingCallWidget = document.querySelector("#floatingCallWidget");
  elements.floatingCallAvatar = document.querySelector("#floatingCallAvatar");
  elements.floatingCallName = document.querySelector("#floatingCallName");
  elements.floatingCallStatus = document.querySelector("#floatingCallStatus");
  elements.toastStack = document.querySelector("#toastStack");
  elements.authOnlineCount = document.querySelector("#authOnlineCount");
}

function bindEvents() {
  elements.authTabs.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openAuthRoute(button.dataset.authMode);
    });
  });
  elements.closeAuthPanel.addEventListener("click", closeAuthPanel);
  elements.authForm.addEventListener("input", clearAuthError);
  elements.authForm.addEventListener("submit", handleAuthSubmit);
  elements.authSubmitButton.addEventListener("click", (event) => {
    if (event.defaultPrevented || state.authSubmitting) return;

    event.preventDefault();
    if (typeof elements.authForm.requestSubmit === "function") {
      elements.authForm.requestSubmit(elements.authSubmitButton);
      return;
    }

    handleAuthSubmit(event);
  });

  elements.socialButtons.forEach((button) => {
    button.addEventListener("click", () => startSocialAuth(button.dataset.socialProvider));
  });

  elements.guestModeButton?.addEventListener("click", startGuestMode);
  elements.forgotPasswordButton.addEventListener("click", openPasswordResetModal);

  elements.accountAccessButton.addEventListener("click", () => {
    toast("Contact the site admin for manual recovery.");
  });

  elements.passwordToggleButtons.forEach((button) => {
    button.addEventListener("click", () => togglePasswordVisibility(button));
  });
elements.roomSearch?.addEventListener("input", renderRooms);
elements.sidebarMenu?.addEventListener("click", handleDashboardMenuClick);
elements.sidebar?.addEventListener("click", (event) => {
  if (!event.target.closest(".sidebar-section-title [data-menu-action]")) return;
  handleDashboardMenuClick(event);
});

elements.messageSearch.addEventListener("input", () => {
  state.messageSearchQuery = elements.messageSearch.value.trim().toLowerCase();
  renderMessages();
});

elements.messageForm.addEventListener("submit", handleMessageSubmit);
elements.messageInput.addEventListener("keydown", handleComposerKeydown);
elements.messageInput.addEventListener("input", handleTypingInput);

elements.attachButton.addEventListener("click", toggleAttachmentMenu);
elements.emojiButton.addEventListener("click", toggleEmojiPicker);

elements.attachmentMenu.addEventListener("click", handleAttachmentMenuClick);
elements.emojiPicker.addEventListener("click", handleEmojiPick);

elements.messageAttachmentInput.addEventListener("change", handleAttachmentSelect);

elements.voiceButton.addEventListener("click", toggleVoiceRecording);
elements.voiceRecorderBar?.addEventListener("click", handleVoiceRecorderAction);

elements.messageForm?.addEventListener("dragenter", handleComposerDragEnter);
elements.messageForm?.addEventListener("dragover", handleComposerDragOver);
elements.messageForm?.addEventListener("dragleave", handleComposerDragLeave);
elements.messageForm?.addEventListener("drop", handleComposerDrop);

elements.pwaInstallButton?.addEventListener("click", installPwaApp);

elements.mobileAppMenuButton?.addEventListener("click", toggleMobileAppMenu);
elements.mobileAppMenu?.addEventListener("click", handleMobileAppMenuClick);

document.addEventListener("visibilitychange", handleVisibilityChange);

window.addEventListener("beforeunload", () => {
  if (callState.active && socket?.connected) {
    socket.emit("call:end", {
      token: state.session?.token,
      callId: callState.callId,
      reason: "page-leave",
      durationSeconds: callState.status === "active" ? callElapsedSeconds() : 0,
    });
  }
    callState.localStream?.getTracks?.().forEach((track) => track.stop());
    callState.remoteStream?.getTracks?.().forEach((track) => track.stop());
  });
  elements.pollButton.addEventListener("click", () => {
    closeComposerPopovers();
    createPoll();
  });
  elements.logoutButton.addEventListener("click", logout);
  elements.profileButton.addEventListener("click", () => navigateTo(PROFILE_ROUTE));
  elements.quickConfession.addEventListener("click", startConfession);
  elements.openSidebar?.addEventListener("click", toggleMobileSidebar);
  elements.closeSidebar?.addEventListener("click", closeMobileSidebar);
  elements.sidebarOverlay?.addEventListener("click", closeMobileSidebar);
  elements.chatView?.addEventListener("click", handleChatShellClick);
  elements.sidebar?.addEventListener("touchstart", handleSidebarTouchStart, { passive: true });
  elements.sidebar?.addEventListener("touchend", handleSidebarTouchEnd, { passive: true });
  elements.togglePanel.addEventListener("click", () => elements.detailsPanel.classList.toggle("open"));
  elements.settingsTopButton?.addEventListener("click", () => navigateTo(SETTINGS_ROUTE));
  elements.topbarSearchButton?.addEventListener("click", openInlineMessageSearch);
  elements.mediaGalleryButton?.addEventListener("click", openMediaGallery);
  elements.chatSearchInput?.addEventListener("input", handleInlineMessageSearchInput);
  elements.chatSearchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeInlineMessageSearch();
  });
  elements.closeSearchButton?.addEventListener("click", closeInlineMessageSearch);
  elements.closeDetailsPanel.addEventListener("click", () => elements.detailsPanel.classList.remove("open"));
  elements.notificationButton.addEventListener("click", openNotifications);
  elements.safetyPanel?.addEventListener("click", handleSafetyPanelClick);
  elements.closeReportModal.addEventListener("click", closeReportModal);
  elements.reportForm.addEventListener("submit", submitReport);
  elements.closeAvatarCropModal.addEventListener("click", closeAvatarCropper);
  elements.cancelAvatarCropButton.addEventListener("click", closeAvatarCropper);
  elements.saveAvatarCropButton.addEventListener("click", saveCroppedAvatar);
  elements.closePasswordResetModal.addEventListener("click", closePasswordResetModal);
  elements.requestResetButton.addEventListener("click", requestPasswordReset);
  elements.verifyResetOtpButton?.addEventListener("click", verifyPasswordResetOtp);
  elements.resetOtpInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      verifyPasswordResetOtp();
    }
  });
  elements.passwordResetForm.addEventListener("submit", confirmPasswordReset);
  elements.closeComposerPlaceholderModal.addEventListener("click", closeComposerPlaceholderModal);
  elements.composerPlaceholderOkButton.addEventListener("click", closeComposerPlaceholderModal);
  elements.chatContextMenu?.addEventListener("click", handleChatContextMenuAction);
  elements.lightboxOverlay?.addEventListener("click", closeLightbox);
  elements.lightboxClose?.addEventListener("click", closeLightbox);
  elements.lightboxZoomIn?.addEventListener("click", () => zoomMediaViewer(0.25));
  elements.lightboxZoomOut?.addEventListener("click", () => zoomMediaViewer(-0.25));
  elements.lightboxDownload?.addEventListener("click", downloadOpenMedia);
  elements.lightboxShare?.addEventListener("click", shareOpenMedia);
  elements.lightboxStage?.addEventListener("wheel", handleMediaViewerWheel, { passive: false });
  elements.lightboxStage?.addEventListener("pointerdown", startMediaPan);
  elements.lightboxStage?.addEventListener("pointermove", moveMediaPan);
  elements.lightboxStage?.addEventListener("pointerup", stopMediaPan);
  elements.lightboxStage?.addEventListener("pointerleave", stopMediaPan);
  elements.messageContextMenu?.addEventListener("click", handleMessageContextMenuClick);
  elements.mediaGalleryOverlay?.addEventListener("click", closeMediaGallery);
  elements.closeMediaGallery?.addEventListener("click", closeMediaGallery);
  elements.mediaGalleryGrid?.addEventListener("click", handleMediaGalleryClick);
  elements.mediaGalleryTabs?.forEach((button) => {
    button.addEventListener("click", () => switchMediaGalleryTab(button.dataset.galleryTab));
  });
  elements.closeProfilePanel?.addEventListener("click", closeUserProfilePanel);
  elements.profileOverlay?.addEventListener("click", closeUserProfilePanel);
  elements.blockFromProfile?.addEventListener("click", blockUserFromProfile);
  elements.reportFromProfile?.addEventListener("click", reportUserFromProfile);
  elements.audioCallFromProfile?.addEventListener("click", () => startCallFromProfile("audio"));
  elements.videoCallFromProfile?.addEventListener("click", () => startCallFromProfile("video"));
  elements.topbarAudioCallButton?.addEventListener("click", () => startCallWithLatestPeer("audio"));
  elements.topbarVideoCallButton?.addEventListener("click", () => startCallWithLatestPeer("video"));
  elements.acceptCallButton?.addEventListener("click", acceptIncomingCall);
  elements.rejectCallButton?.addEventListener("click", () => rejectIncomingCall("rejected"));
  elements.endCallButton?.addEventListener("click", () => endCurrentCall("ended", true));
  elements.muteCallButton?.addEventListener("click", toggleCallMute);
  elements.cameraCallButton?.addEventListener("click", toggleCallCamera);
  elements.switchCameraButton?.addEventListener("click", switchCallCamera);
  elements.fullscreenCallButton?.addEventListener("click", toggleCallFullscreen);
  elements.minimizeCallButton?.addEventListener("click", minimizeCallUi);
  elements.floatingCallWidget?.addEventListener("click", restoreCallUi);
  elements.avatarZoomInput.addEventListener("input", handleCropZoom);
  elements.avatarCropCanvas.addEventListener("pointerdown", startCropDrag);
  elements.avatarCropCanvas.addEventListener("pointermove", moveCropDrag);
  elements.avatarCropCanvas.addEventListener("pointerup", stopCropDrag);
  elements.avatarCropCanvas.addEventListener("pointerleave", stopCropDrag);

  window.addEventListener("popstate", () => {
    syncAuthModeFromRoute();
    render();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMobileSidebar();
  });

  document.querySelectorAll(".panel-tab").forEach((button) => {
    button.addEventListener("click", () => openPanel(button.dataset.panel));
  });

  elements.roomList.addEventListener("click", (event) => {
    const roomButton = event.target.closest("[data-room-id]");
    if (!roomButton) return;
    if (getChatContextItem(event.target)) return;

    handleJoinRoom(roomButton.dataset.roomId);
    closeMobileSidebar();
  });

  elements.sidebarDmList?.addEventListener("click", (event) => {
    if (elements.sidebarDmList.hidden) return;
    const profileTrigger = event.target.closest("[data-profile-author-id]");
    if (!profileTrigger) return;
    openUserProfileFromTrigger(profileTrigger);
    closeMobileSidebar();
  });

  elements.homeView?.addEventListener("click", handleHomeViewClick);
  elements.homeView?.addEventListener("keydown", handleHomeViewKeydown);
  elements.homeView?.addEventListener("click", handleProfilePanelClick);
  elements.homeView?.addEventListener("change", handleProfilePanelChange);

  elements.chatFeed.addEventListener("click", async (event) => {
    const mediaTrigger = event.target.closest("[data-media-viewer]");
    if (mediaTrigger && !event.target.closest("[data-media-action]")) {
      event.preventDefault();
      event.stopPropagation();
      openLightbox(
        mediaTrigger.dataset.mediaSrc || mediaTrigger.currentSrc || mediaTrigger.src,
        mediaTrigger.dataset.mediaCaption || mediaTrigger.alt || "",
        mediaTrigger.dataset.mediaType || mediaTrigger.dataset.lightboxType || "image"
      );
      return;
    }

    const lightboxImage = event.target.closest("img[data-lightbox-image], .message-image, .msg-image, .chat-image, .image-attachment img, .attachment img");
    if (lightboxImage && !isAvatarLightboxImage(lightboxImage)) {
      event.preventDefault();
      event.stopPropagation();
      openLightbox(lightboxImage.src, lightboxImage.alt || "", "image");
      return;
    }

    const profileTrigger = event.target.closest(".msg-avatar, .msg-author, .message-sender, [data-profile-author-id]");
    if (profileTrigger && !event.target.closest("[data-action]")) {
      openUserProfileFromTrigger(profileTrigger);
      return;
    }

    const loadMoreButton = event.target.closest("#loadMoreMessages");
    if (loadMoreButton) {
      await loadEarlierMessages(loadMoreButton);
      return;
    }

    const replyJump = event.target.closest(".message-reply[data-jump-message-id]");
    if (replyJump) {
      event.preventDefault();
      jumpToMessage(replyJump.dataset.jumpMessageId);
      return;
    }

    const mediaAction = event.target.closest("[data-media-action]");
    if (mediaAction) {
      event.preventDefault();
      event.stopPropagation();
      try {
        if (mediaAction.dataset.mediaAction === "open") {
          openLightbox(mediaAction.dataset.mediaSrc, mediaAction.dataset.mediaName || "", mediaAction.dataset.mediaType || "image");
        }
        if (mediaAction.dataset.mediaAction === "download") {
          downloadMedia(mediaAction.dataset.mediaSrc, mediaAction.dataset.mediaName);
        }
        if (mediaAction.dataset.mediaAction === "share") {
          await shareMedia(mediaAction.dataset.mediaSrc, mediaAction.dataset.mediaName);
        }
      } catch (error) {
        handleApiError(error);
      }
      return;
    }

    const playButton = event.target.closest("[data-voice-play]");
    if (playButton) {
      event.preventDefault();
      event.stopPropagation();
      await toggleVoiceNotePlayback(playButton);
      return;
    }

    const speedButton = event.target.closest("[data-voice-speed]");
    if (speedButton) {
      const audio = speedButton.closest(".voice-note-shell")?.querySelector("audio");
      if (audio) {
        const speeds = [1, 1.5, 2];
        const current = speeds.indexOf(Number(audio.playbackRate || 1));
        const next = speeds[(current + 1) % speeds.length];
        audio.playbackRate = next;
        speedButton.textContent = `${next}x`;
      }
      return;
    }

    const action = event.target.closest("[data-action]");
    if (!action) return;

    try {
      if (action.dataset.action === "react-menu") {
        openReactionPicker(action.dataset.messageId);
      }

      if (action.dataset.action === "more") {
        openMessageContextMenu(action.dataset.messageId, action);
      }

      if (action.dataset.action === "react-emoji") {
        await toggleReaction(action.dataset.messageId, action.dataset.emoji);
      }

      if (action.dataset.action === "report") {
        openReportModal(action.dataset.messageId);
      }

      if (action.dataset.action === "block") {
        await blockUserByMessage(action.dataset.messageId);
      }

      if (action.dataset.action === "delete") {
        openDeleteMessageSheet(action.dataset.messageId);
      }

      if (action.dataset.action === "reply") {
        startReply(action.dataset.messageId);
      }

      if (action.dataset.action === "edit") {
        await editMessage(action.dataset.messageId);
      }

      if (action.dataset.action === "vote-poll") {
        await votePoll(action.dataset.messageId, action.dataset.optionId);
      }

    } catch (error) {
      handleApiError(error);
    }
  });

  elements.chatFeed.addEventListener("play", handleVoiceAudioStateChange, true);
  elements.chatFeed.addEventListener("pause", handleVoiceAudioStateChange, true);
  elements.chatFeed.addEventListener("ended", handleVoiceAudioStateChange, true);
  elements.chatFeed.addEventListener("input", handleChatFeedInput);
  elements.chatFeed.addEventListener("touchstart", handleMessageTouchStart, { passive: true });
  elements.chatFeed.addEventListener("touchend", handleMessageTouchEnd);
  elements.chatFeed.addEventListener("touchmove", handleMessageTouchMove, { passive: true });
  elements.chatFeed.addEventListener("scroll", updateScrollToBottomButton, { passive: true });
  elements.scrollToBottomButton?.addEventListener("click", scrollChatToBottom);
  elements.deleteMessageSheet?.addEventListener("click", handleDeleteMessageSheetClick);
  elements.cancelDeleteMessageButton?.addEventListener("click", closeDeleteMessageSheet);
  elements.blockUserModal?.addEventListener("click", (event) => {
    if (event.target === elements.blockUserModal) closeBlockUserModal();
  });
  elements.cancelBlockUserButton?.addEventListener("click", closeBlockUserModal);
  elements.closeBlockUserModal?.addEventListener("click", closeBlockUserModal);
  elements.confirmBlockUserButton?.addEventListener("click", confirmBlockUser);
  elements.confirmRoomPassword?.addEventListener("click", confirmRoomPasswordJoin);
  elements.cancelRoomPassword?.addEventListener("click", closeRoomPasswordModal);
  elements.cancelRoomPasswordFooter?.addEventListener("click", closeRoomPasswordModal);
  elements.toggleRoomPassword?.addEventListener("click", toggleRoomPasswordVisibility);
  elements.roomPasswordInput?.addEventListener("input", clearRoomPasswordError);
  elements.roomPasswordInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmRoomPasswordJoin();
    }
  });
  elements.roomPasswordModal?.addEventListener("click", (event) => {
    if (event.target === elements.roomPasswordModal) closeRoomPasswordModal();
  });

  elements.profilePanel.addEventListener("change", handleProfilePanelChange);
  elements.profilePanel.addEventListener("click", handleProfilePanelClick);
  elements.moderationPanel.addEventListener("click", handleAdminPanelClick);
  elements.adminDashboardView?.addEventListener("click", handleAdminDashboardClick);
  elements.adminDashboardView?.addEventListener("input", handleAdminDashboardInput);
  elements.adminDashboardView?.addEventListener("touchstart", handleAdminSidebarTouchStart, { passive: true });
  elements.adminDashboardView?.addEventListener("touchend", handleAdminSidebarTouchEnd, { passive: true });
  document.addEventListener("click", handleChatContextDocumentClick);
  document.addEventListener("keydown", handleChatContextKeydown);
  document.addEventListener("touchstart", handleChatContextTouchStart, { passive: true });
  document.addEventListener("touchend", clearChatContextTouchTimer, { passive: true });
  document.addEventListener("touchmove", handleChatContextTouchMove, { capture: true, passive: true });
  document.addEventListener("keydown", handleLightboxKeydown);
  document.addEventListener("click", handleMessageContextDocumentClick);
  document.addEventListener("contextmenu", handleMessageContextNativeMenu);
  document.addEventListener("scroll", hideMessageContextMenu, true);
  document.addEventListener("keydown", handleUserProfileKeydown);
  document.addEventListener("keydown", handleMobileAppMenuKeydown);
  document.addEventListener("click", handleThemeDocumentClick);
  document.addEventListener("scroll", handleChatContextScroll, true);
  document.addEventListener("wheel", handleChatContextWheel, { capture: true, passive: true });
  window.addEventListener("resize", hideChatContextMenu);
  document.addEventListener("click", handleComposerOutsideClick);
}

function normalizeRoute(pathname = window.location.pathname) {
  const path = pathname.replace(/\/+$/, "") || LANDING_ROUTE;
  if (path === "/dashboard/my-rooms") return MY_ROOMS_ROUTE;
  if (path === "/dashboard/settings") return SETTINGS_ROUTE;
  if (path === "/dashboard/profile") return PROFILE_ROUTE;
  if (path === "/dashboard/notifications") return NOTIFICATIONS_ROUTE;
  if ([LANDING_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE, ADMIN_LOGIN_ROUTE, ...PUBLIC_ROUTE_VALUES, ...USER_ROUTE_VALUES, ...ADMIN_ROUTE_VALUES].includes(path)) {
    return path;
  }
  return LANDING_ROUTE;
}

function isAuthRoute(route = state.route) {
  return route === LOGIN_ROUTE || route === SIGNUP_ROUTE || route === ADMIN_LOGIN_ROUTE;
}

function isPublicRoute(route = state.route) {
  return PUBLIC_ROUTE_VALUES.includes(route);
}

function setAuthRouteScroll(enabled) {
  document.documentElement.classList.toggle("auth-route-scroll", enabled);
  document.body.classList.toggle("auth-route-scroll", enabled);
  if (enabled) {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.classList.remove("mobile-nav-open", "mobile-app-menu-open", "no-scroll");
  }
}

function primeAuthRouteScroll() {
  const enabled = isAuthRoute(normalizeRoute(window.location.pathname));
  setAuthRouteScroll(enabled);
  document.querySelector("#authView")?.classList.toggle("auth-route-mode", enabled);
}

primeAuthRouteScroll();

function isChatRoute(route = state.route) {
  return USER_ROUTE_VALUES.includes(route);
}

function isAdminRoute(route = state.route) {
  return ADMIN_ROUTE_VALUES.includes(route);
}

function navigateTo(path, options = {}) {
  const route = normalizeRoute(path);
  const method = options.replace ? "replaceState" : "pushState";

  if (window.location.pathname !== route) {
    window.history[method]({}, "", route);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  state.route = route;
  handleMobileNav();
  updateInstallButtonState();
  updateMobileAppMenuState();
  if (options.render !== false) render();
}

function routeForAuthMode(mode) {
  if (mode === "register") return SIGNUP_ROUTE;
  if (mode === "admin") return ADMIN_LOGIN_ROUTE;
  return LOGIN_ROUTE;
}

function openAuthRoute(mode = "login") {
  const nextMode = ["login", "register", "admin"].includes(mode) ? mode : "login";
  updateAuthMode(nextMode);
  navigateTo(routeForAuthMode(nextMode), { render: false });
  openAuthPanel();
  render();
}

function syncAuthModeFromRoute() {
  state.route = normalizeRoute(window.location.pathname);
  if (state.route === SIGNUP_ROUTE) {
    updateAuthMode("register");
  } else if (state.route === ADMIN_LOGIN_ROUTE) {
    updateAuthMode("admin");
  } else if (state.route === LOGIN_ROUTE) {
    updateAuthMode("login");
  }
}

function resolveRouteForSession(loggedIn) {
  let route = normalizeRoute(window.location.pathname);
  const admin = loggedIn && isAdmin();
  const guest = loggedIn && isGuestSession();

  if (isAdminRoute(route) && !loggedIn) {
    route = LOGIN_ROUTE;
    window.history.replaceState({}, "", route);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } else if (guest && isAdminRoute(route)) {
    route = CHAT_ROUTE;
    window.history.replaceState({}, "", route);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } else if (guest && isChatRoute(route) && ![CHAT_ROUTE, DASHBOARD_ROUTE].includes(route)) {
    route = SIGNUP_ROUTE;
    window.history.replaceState({}, "", route);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } else if (isAdminRoute(route) && loggedIn && !admin) {
    route = CHAT_ROUTE;
    window.history.replaceState({}, "", route);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } else if (isChatRoute(route) && !loggedIn) {
    route = LOGIN_ROUTE;
    window.history.replaceState({}, "", route);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } else if (loggedIn && isAuthRoute(route) && !guest) {
    route = admin ? ADMIN_DASHBOARD_ROUTE : CHAT_ROUTE;
    window.history.replaceState({}, "", route);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } else if (admin && isChatRoute(route)) {
    route = ADMIN_DASHBOARD_ROUTE;
    window.history.replaceState({}, "", route);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  state.route = route;
  return route;
}

function updateAuthMode(mode) {
  state.authMode = mode;
  clearAuthError();
  const isRegister = mode === "register";
  const isAdmin = mode === "admin";
  const isLogin = mode === "login";

  document.querySelectorAll(".register-only").forEach((item) => {
    item.classList.toggle("hidden", !isRegister);
  });

  document.querySelectorAll(".login-only").forEach((item) => {
    item.classList.toggle("hidden", !isLogin);
  });

  document.querySelectorAll(".admin-only").forEach((item) => {
    item.classList.toggle("hidden", !isAdmin);
  });

  if (elements.authPanel) elements.authPanel.dataset.mode = mode;
  elements.authTitle.textContent = isRegister ? "Create account" : isAdmin ? "Admin login" : "Welcome back";
  if (elements.authSubtitle) {
    elements.authSubtitle.textContent = isRegister
      ? "Join AnonChat - it's free and anonymous"
      : isAdmin
        ? "Restricted to authorized personnel only"
        : "Sign in to continue your anonymous journey";
  }
  elements.authFooterText.textContent = isRegister
    ? "Already have an account?"
    : isAdmin
      ? "Back to user login"
      : "Don't have an account?";
  elements.authModeLink.textContent = isRegister || isAdmin ? "Log in" : "Sign up free";
  elements.authModeLink.dataset.authMode = isRegister || isAdmin ? "login" : "register";
  elements.adminModeLink.classList.toggle("hidden", isAdmin);

  elements.authTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === mode);
  });

  elements.socialRow.classList.toggle("hidden", isAdmin);
  elements.authDivider.classList.toggle("hidden", isAdmin);
  elements.authSubmitButton.textContent = isRegister
    ? "Create Account"
    : isAdmin
      ? "Open Admin"
      : "Login";
  elements.loginIdentifierInput.required = isLogin;
  elements.adminUsernameInput.required = isAdmin;
  elements.fullNameInput.required = isRegister;
  elements.usernameInput.required = isRegister;
  elements.emailInput.required = isRegister;
  elements.dateOfBirthInput.required = isRegister;
  elements.dateOfBirthInput.max = new Date().toISOString().slice(0, 10);
  if (elements.passwordLabel) {
    elements.passwordLabel.textContent = isRegister ? "Password *" : "Password";
  }
  elements.passwordInput.autocomplete = isRegister ? "new-password" : "current-password";
  elements.passwordInput.placeholder = isRegister ? "Minimum 8 characters" : "Enter password";
  resetPasswordVisibility();
}

function openAuthPanel() {
  elements.authView.classList.add("auth-modal-open");
}

function closeAuthPanel() {
  elements.authView.classList.remove("auth-modal-open");
  if (isAuthRoute(normalizeRoute(window.location.pathname)) && !state.session) {
    navigateTo(LANDING_ROUTE, { replace: true, render: false });
  }
}

function togglePasswordVisibility(button) {
  const input = document.querySelector(`#${button.dataset.passwordToggle}`);
  if (!input) return;

  const showPassword = input.type === "password";
  input.type = showPassword ? "text" : "password";
  button.textContent = showPassword ? "Hide" : "Show";
  button.setAttribute("aria-label", `${showPassword ? "Hide" : "Show"} password`);
}

function resetPasswordVisibility() {
  elements.passwordToggleButtons.forEach((button) => {
    const input = document.querySelector(`#${button.dataset.passwordToggle}`);
    if (!input) return;

    input.type = "password";
    button.textContent = "Show";
    button.setAttribute("aria-label", "Show password");
  });
}

function bindGlobalClickFallbacks() {
  if (document.documentElement.dataset.anonchatClickFallbackBound === "true") return;
  document.documentElement.dataset.anonchatClickFallbackBound = "true";
  document.addEventListener("click", handleGlobalClickFallback, true);
}

function claimClick(event) {
  event.preventDefault();
  event.stopPropagation();
}

function clickedEnabled(target) {
  return !target?.closest?.("button:disabled, [aria-disabled='true'], .disabled");
}

function handleGlobalClickFallback(event) {
  const target = event.target;
  if (!clickedEnabled(target)) return;

  const authModeButton = target.closest?.("[data-auth-mode]");
  if (authModeButton) {
    claimClick(event);
    openAuthRoute(authModeButton.dataset.authMode);
    return;
  }

  const passwordToggle = target.closest?.("[data-password-toggle]");
  if (passwordToggle) {
    claimClick(event);
    togglePasswordVisibility(passwordToggle);
    return;
  }

  const socialButton = target.closest?.("[data-social-provider]");
  if (socialButton) {
    claimClick(event);
    startSocialAuth(socialButton.dataset.socialProvider);
    return;
  }

  const roomButton = target.closest?.("[data-room-id]");
  if (roomButton && elements.roomList?.contains(roomButton)) {
    claimClick(event);
    if (!getChatContextItem(target)) {
      handleJoinRoom(roomButton.dataset.roomId);
      closeMobileSidebar();
    }
    return;
  }

  const menuAction = target.closest?.("[data-menu-action]");
  if (menuAction && !target.closest?.(".admin-dashboard-view")) {
    claimClick(event);
    handleDashboardMenuClick({ target: menuAction, preventDefault() {}, stopPropagation() {} });
    return;
  }

  const dmProfile = target.closest?.(".slack-dm-list [data-profile-author-id]");
  if (dmProfile && !elements.sidebarDmList?.hidden) {
    claimClick(event);
    openUserProfileFromTrigger(dmProfile);
    closeMobileSidebar();
    return;
  }

  if (target.closest?.("#sidebarOverlay")) {
    claimClick(event);
    closeMobileSidebar();
    return;
  }

  const button = target.closest?.("button, a");
  if (!button) return;
  const id = button.id;

  const handlers = {
    guestModeButton: startGuestMode,
    closeAuthPanel,
    forgotPasswordButton: openPasswordResetModal,
    accountAccessButton: () => toast("Contact the site admin for manual recovery."),
    hamburgerBtn: toggleMobileSidebar,
    closeSidebar: closeMobileSidebar,
    mobileAppMenuButton: toggleMobileAppMenu,
    pwaInstallButton: installPwaApp,
    attachButton: toggleAttachmentMenu,
    emojiButton: toggleEmojiPicker,
    voiceButton: toggleVoiceRecording,
    pollButton: () => {
      closeComposerPopovers();
      createPoll();
    },
    logoutButton: logout,
    profileButton: () => navigateTo(PROFILE_ROUTE),
    quickConfession: startConfession,
    togglePanel: () => elements.detailsPanel?.classList.toggle("open"),
    settingsTopButton: () => navigateTo(SETTINGS_ROUTE),
    topbarSearchButton: openInlineMessageSearch,
    mediaGalleryButton: openMediaGallery,
    closeSearchBtn: closeInlineMessageSearch,
    closeDetailsPanel: () => elements.detailsPanel?.classList.remove("open"),
    notificationButton: openNotifications,
    closeReportModal: closeReportModal,
    closeAvatarCropModal: closeAvatarCropper,
    cancelAvatarCropButton: closeAvatarCropper,
    saveAvatarCropButton: saveCroppedAvatar,
    closePasswordResetModal: closePasswordResetModal,
    requestResetButton: requestPasswordReset,
    verifyResetOtpButton: verifyPasswordResetOtp,
    closeComposerPlaceholderModal: closeComposerPlaceholderModal,
    composerPlaceholderOkButton: closeComposerPlaceholderModal,
    closeMediaGallery: closeMediaGallery,
    closeProfilePanel: closeUserProfilePanel,
    blockFromProfile: blockUserFromProfile,
    reportFromProfile: reportUserFromProfile,
    audioCallFromProfile: () => startCallFromProfile("audio"),
    videoCallFromProfile: () => startCallFromProfile("video"),
    topbarAudioCallButton: () => startCallWithLatestPeer("audio"),
    topbarVideoCallButton: () => startCallWithLatestPeer("video"),
    acceptCallButton: acceptIncomingCall,
    rejectCallButton: () => rejectIncomingCall("rejected"),
    endCallButton: () => endCurrentCall("ended", true),
    muteCallButton: toggleCallMute,
    cameraCallButton: toggleCallCamera,
    switchCameraButton: switchCallCamera,
    fullscreenCallButton: toggleCallFullscreen,
    minimizeCallButton: minimizeCallUi,
    floatingCallWidget: restoreCallUi,
  };

  if (handlers[id]) {
    claimClick(event);
    handlers[id]();
    return;
  }

}

function startGuestMode() {
  const animals = ["Wolf", "Fox", "Bear", "Eagle", "Tiger", "Hawk", "Lion", "Panda", "Lynx", "Owl", "Raven", "Cobra", "Viper", "Phoenix"];
  const colors = ["Blue", "Red", "Dark", "Gold", "Silver", "Neon", "Jade", "Rose", "Ash", "Storm", "Violet", "Cyan", "Amber", "Crimson"];
  const avatarColors = ["#6c63ff", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomNum = Math.floor(Math.random() * 9000 + 1000);
  const guestName = `${randomColor}${randomAnimal}#${randomNum}`;
  const guestId = `guest_${Date.now()}_${randomNum}`;
  const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
  const guestSession = {
    token: `guest_token_${guestId}`,
    isGuest: true,
    user: {
      id: guestId,
      fullName: guestName,
      name: guestName,
      username: guestId,
      email: "",
      role: "user",
      status: "active",
      avatarColor,
      avatarDataUrl: "",
      isGuest: true,
    },
  };

  state.session = guestSession;
  saveSession(guestSession);
  closeAuthPanel();
  if (!socket) connectLiveUpdates();
  navigateTo(CHAT_ROUTE, { render: false });
  render();
  toast(`Welcome, ${guestName}! You are in Guest Mode.`);
}

async function handleAuthSubmit(event) {
  event?.preventDefault?.();
  if (state.authSubmitting) return;

  state.authSubmitting = true;
  let resetLoading = () => {};
  clearAuthError();

  try {
    const validationError = validateAuthInputs();
    if (validationError) {
      showAuthError(validationError.message, validationError.field);
      return;
    }

    const endpoint =
      state.authMode === "register"
        ? "/api/auth/register"
        : state.authMode === "admin"
          ? "/api/auth/admin-login"
          : "/api/auth/login";
    const payload =
      state.authMode === "register"
        ? createRegisterPayload()
        : state.authMode === "admin"
          ? {
              identifier: elements.adminUsernameInput.value.trim(),
              password: elements.passwordInput.value,
            }
          : {
              identifier: elements.loginIdentifierInput.value.trim(),
              password: elements.passwordInput.value,
            };

    resetLoading = setButtonLoading(
      elements.authSubmitButton,
      true,
      state.authMode === "register" ? "Creating account..." : "Signing in..."
    );

    const session = await api(endpoint, {
      method: "POST",
      body: payload,
    });

    state.session = session;
    saveSession(session);
    elements.authForm.reset();
    resetPasswordVisibility();
    connectLiveUpdates();
    closeAuthPanel();
    navigateTo(isAdmin() ? ADMIN_DASHBOARD_ROUTE : CHAT_ROUTE, { render: false });
    render();
    toast(state.authMode === "register" ? "Account created and logged in." : "Logged in successfully.");
    refreshAuthenticatedStateAfterAuth();
  } catch (error) {
    const message = error?.message || "Request failed.";
    showAuthError(message, getAuthErrorField(message));
  } finally {
    resetLoading();
    state.authSubmitting = false;
  }
}

function refreshAuthenticatedStateAfterAuth() {
  refreshState()
    .then(() => (isAdmin() ? refreshAdminState() : null))
    .then(() => render())
    .catch(() => {
      toast("Logged in, but latest data is still refreshing.");
    });
}

function validateAuthInputs() {
  if (state.authMode === "login") {
    if (!elements.loginIdentifierInput.value.trim()) {
      return { field: elements.loginIdentifierInput, message: "Username or email is required." };
    }

    if (!elements.passwordInput.value) {
      return { field: elements.passwordInput, message: "Password is required." };
    }

    return null;
  }

  if (state.authMode === "admin") {
    if (!elements.adminUsernameInput.value.trim()) {
      return { field: elements.adminUsernameInput, message: "Admin username is required." };
    }

    if (!elements.passwordInput.value) {
      return { field: elements.passwordInput, message: "Admin password is required." };
    }

    return null;
  }

  const fullName = elements.fullNameInput.value.trim();
  const username = elements.usernameInput.value.trim().toLowerCase();
  const email = elements.emailInput.value.trim();
  const password = elements.passwordInput.value;
  const dateOfBirth = elements.dateOfBirthInput.value;

  if (!fullName) return { field: elements.fullNameInput, message: "Full name is required." };
  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    return { field: elements.usernameInput, message: "Username must be 3-24 characters using letters, numbers, or underscore." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { field: elements.emailInput, message: "Enter a valid email address." };
  }

  try {
    validatePasswordRules(password);
  } catch (error) {
    return { field: elements.passwordInput, message: error.message };
  }

  const birthDateError = validateDateOfBirthValue(dateOfBirth);
  if (birthDateError) {
    return { field: elements.dateOfBirthInput, message: birthDateError };
  }

  return null;
}

function showAuthError(message, field) {
  openAuthPanel();
  elements.authInlineError.textContent = message || "Please check the highlighted field.";
  elements.authInlineError.classList.remove("hidden");
  elements.authPanel?.classList?.add?.("has-auth-error");

  clearAuthFieldHighlights();
  const target = field || getAuthErrorField(message);
  if (target) {
    showFieldError(target, message || "Please check this field.");
    window.setTimeout(() => {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 40);
  }
}

function clearAuthError() {
  if (!elements.authInlineError) return;
  elements.authInlineError.textContent = "";
  elements.authInlineError.classList.add("hidden");
  elements.authPanel?.classList?.remove?.("has-auth-error");
  clearAuthFieldHighlights();
}

function clearAuthFieldHighlights() {
  elements.authForm?.querySelectorAll(".field-invalid").forEach(clearFieldError);
  elements.authForm?.querySelectorAll(".field-error").forEach((error) => error.remove());
}

function showFieldError(input, message) {
  if (!input) return;
  input.classList.add("field-invalid");

  const existing = input.parentNode?.querySelector(".field-error");
  if (existing) existing.remove();

  const error = document.createElement("small");
  error.className = "field-error";
  error.textContent = message;
  input.parentNode?.appendChild(error);
}

function clearFieldError(input) {
  if (!input) return;
  input.classList.remove("field-invalid");
  input.parentNode?.querySelector(".field-error")?.remove();
}

function getAuthErrorField(message = "") {
  const text = String(message).toLowerCase();

  if (text.includes("username") || text.includes("email") || text.includes("credentials")) {
    return state.authMode === "register" ? elements.usernameInput : elements.loginIdentifierInput;
  }
  if (text.includes("admin")) return elements.adminUsernameInput;
  if (text.includes("password") || text.includes("symbol") || text.includes("uppercase") || text.includes("lowercase")) {
    return elements.passwordInput;
  }
  if (text.includes("birth") || text.includes("date")) return elements.dateOfBirthInput;
  if (text.includes("full name")) return elements.fullNameInput;

  return null;
}

function createRegisterPayload() {
  const password = elements.passwordInput.value;

  validatePasswordRules(password);

  return {
    fullName: elements.fullNameInput.value.trim(),
    username: elements.usernameInput.value.trim(),
    email: elements.emailInput.value.trim(),
    password,
    dateOfBirth: elements.dateOfBirthInput.value,
  };
}

function validateDateOfBirthValue(value) {
  const text = String(value || "").trim();
  if (!text) return "Date of birth is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return "Enter a valid date of birth.";

  const birthDate = new Date(`${text}T00:00:00.000Z`);
  if (Number.isNaN(birthDate.getTime()) || birthDate.toISOString().slice(0, 10) !== text) {
    return "Enter a valid date of birth.";
  }

  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (birthDate.getTime() > todayUtc) return "Date of birth cannot be in the future.";

  return "";
}

function validatePasswordRules(password) {
  const allowedPattern = /^[A-Za-z0-9!@#$%^&*_\-+=.?]{8,64}$/;

  if (!allowedPattern.test(password)) {
    throw new Error(PASSWORD_RULE_TEXT);
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*_\-+=.?]/.test(password)) {
    throw new Error(PASSWORD_RULE_TEXT);
  }
}

async function startSocialAuth(provider) {
  const normalizedProvider = String(provider || "").trim().toLowerCase();
  if (!["google", "facebook"].includes(normalizedProvider)) {
    toast("Choose Google or Facebook login.");
    return;
  }

  if (state.authMode === "admin") {
    toast("Admin accounts must use admin login.");
    return;
  }

  const params = new URLSearchParams({
    mode: state.authMode === "register" ? "register" : "login",
  });

  if (state.authMode === "register") {
    const dateOfBirth = elements.dateOfBirthInput?.value || "";
    const birthDateError = validateDateOfBirthValue(dateOfBirth);
    if (birthDateError) {
      showAuthError("Select date of birth before social signup.", elements.dateOfBirthInput);
      return;
    }
    params.set("dateOfBirth", dateOfBirth);
  }

  const label = normalizedProvider === "google" ? "Google" : "Facebook";
  toast(`Redirecting to ${label}...`);
  window.location.assign(`/api/auth/social/${encodeURIComponent(normalizedProvider)}/start?${params.toString()}`);
}

function bindSocialAuthListener() {
  if (document.documentElement.dataset.anonchatSocialAuthBound === "true") return;
  document.documentElement.dataset.anonchatSocialAuthBound = "true";
  window.addEventListener("message", handleSocialAuthMessage);
  window.addEventListener("storage", handleSocialAuthStorage);
}

function handleSocialAuthMessage(event) {
  if (!isTrustedSocialAuthOrigin(event.origin)) return;
  const payload = event.data || {};
  if (payload.type !== "anonchat:social-auth") return;
  completeSocialAuth(payload);
}

function handleSocialAuthStorage(event) {
  if (event.key !== "anonchat-social-auth-result" || !event.newValue) return;
  try {
    completeSocialAuth(JSON.parse(event.newValue));
    localStorage.removeItem("anonchat-social-auth-result");
  } catch {
    toast("Social login response could not be read.");
  }
}

function isTrustedSocialAuthOrigin(origin) {
  if (!origin || origin === "null") return false;
  if (origin === window.location.origin) return true;

  try {
    const current = new URL(window.location.origin);
    const candidate = new URL(origin);
    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    return localHosts.has(current.hostname) && localHosts.has(candidate.hostname);
  } catch {
    return false;
  }
}

function completeSocialAuth(payload) {
  if (!payload.ok) {
    showAuthError(payload.error || "Social login failed.");
    return;
  }

  const session = payload.session;
  if (!session?.token || !session?.user) {
    showAuthError("Social login returned an invalid session.");
    return;
  }

  state.session = session;
  saveSession(session);
  elements.authForm?.reset();
  resetPasswordVisibility();
  connectLiveUpdates();
  closeAuthPanel();
  navigateTo(CHAT_ROUTE, { render: false });
  render();
  toast("Logged in successfully.");
  refreshAuthenticatedStateAfterAuth();
}

function openPasswordResetModal() {
  state.resetToken = "";
  state.resetEmail = "";
  state.resetStep = "email";
  elements.passwordResetForm.reset();
  updatePasswordResetStep("email", "Enter your email to get a reset OTP.");
  elements.passwordResetModal.classList.remove("hidden");
  setTimeout(() => elements.resetEmailInput?.focus(), 80);
}

function closePasswordResetModal() {
  elements.passwordResetModal.classList.add("hidden");
  state.resetToken = "";
  state.resetEmail = "";
  state.resetStep = "email";
  elements.passwordResetForm.reset();
  updatePasswordResetStep("email", "Enter your email to get a reset OTP.");
}

function updatePasswordResetStep(step, message) {
  state.resetStep = step;
  if (elements.passwordResetHelp) {
    elements.passwordResetHelp.textContent = message || "Enter your email to get a reset OTP.";
  }

  elements.resetOtpStep?.classList.toggle("hidden", step !== "otp");
  elements.resetPasswordStep?.classList.toggle("hidden", step !== "password");
  if (elements.requestResetButton) elements.requestResetButton.classList.toggle("hidden", step !== "email");
  if (elements.resetEmailInput) elements.resetEmailInput.disabled = step !== "email";
  if (elements.resetOtpInput) elements.resetOtpInput.disabled = step !== "otp";
  if (elements.resetPasswordInput) elements.resetPasswordInput.disabled = step !== "password";
  if (elements.resetUsernameInput) elements.resetUsernameInput.disabled = step !== "password";
}

function normalizeResetEmail() {
  return elements.resetEmailInput?.value.trim().toLowerCase() || "";
}

async function requestPasswordReset() {
  const email = normalizeResetEmail();
  if (!email) {
    updatePasswordResetStep("email", "Email is required.");
    elements.resetEmailInput?.focus();
    return;
  }

  const resetLoading = setButtonLoading(elements.requestResetButton, true, "Sending...");
  try {
    const payload = await api("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
    });

    state.resetEmail = email;
    state.resetToken = "";
    elements.resetOtpInput.value = "";
    elements.resetPasswordInput.value = "";

    if (payload.devOtp) {
      updatePasswordResetStep("otp", `OTP sent successfully. Development OTP: ${payload.devOtp}`);
    } else {
      updatePasswordResetStep("otp", payload.message || "OTP sent successfully.");
    }

    toast("OTP sent successfully");
    setTimeout(() => elements.resetOtpInput?.focus(), 80);
  } catch (error) {
    const message = error.message || "Request failed.";
    updatePasswordResetStep("email", message);
    toast(message);
  } finally {
    resetLoading();
  }
}

async function verifyPasswordResetOtp() {
  const email = state.resetEmail || normalizeResetEmail();
  const otp = elements.resetOtpInput?.value.trim() || "";

  if (!/^\d{6}$/.test(otp)) {
    updatePasswordResetStep("otp", "Invalid OTP");
    elements.resetOtpInput?.focus();
    return;
  }

  const resetLoading = setButtonLoading(elements.verifyResetOtpButton, true, "Verifying...");
  try {
    const payload = await api("/api/auth/verify-reset-otp", {
      method: "POST",
      body: { email, otp },
    });

    state.resetEmail = email;
    state.resetToken = payload.resetToken || "";
    elements.resetPasswordInput.value = "";
    if (elements.resetUsernameInput) elements.resetUsernameInput.value = "";
    updatePasswordResetStep("password", payload.message || "OTP verified. Set a new password.");
    toast("OTP verified");
    setTimeout(() => elements.resetPasswordInput?.focus(), 80);
  } catch (error) {
    const message = error.message || "Invalid OTP";
    updatePasswordResetStep("otp", message);
    elements.resetOtpInput.value = "";
    elements.resetOtpInput?.focus();
    toast(message);
  } finally {
    resetLoading();
  }
}

async function confirmPasswordReset(event) {
  event.preventDefault();

  if (state.resetStep !== "password") {
    if (state.resetStep === "otp") await verifyPasswordResetOtp();
    return;
  }

  const resetLoading = setButtonLoading(elements.submitResetPasswordButton, true, "Updating...");
  try {
    validatePasswordRules(elements.resetPasswordInput.value);
    const resetUsername = elements.resetUsernameInput?.value.trim().toLowerCase() || "";
    if (resetUsername && !/^[a-z0-9_]{3,24}$/.test(resetUsername)) {
      throw new Error("Username must be 3-24 characters using letters, numbers, or underscore.");
    }
    const payload = await api("/api/auth/reset-password", {
      method: "POST",
      body: {
        email: state.resetEmail || normalizeResetEmail(),
        resetToken: state.resetToken,
        password: elements.resetPasswordInput.value,
        username: resetUsername,
      },
    });

    closePasswordResetModal();
    toast(payload.message || "Password reset successful.");
  } catch (error) {
    const message = error.message || "Request failed.";
    updatePasswordResetStep(message.toLowerCase().includes("otp") ? "otp" : "password", message);
    toast(message);
  } finally {
    resetLoading();
  }
}

function toggleAttachmentMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  elements.emojiPicker.classList.add("hidden");
  elements.attachmentMenu.classList.toggle("hidden");
}

function toggleEmojiPicker(event) {
  event.preventDefault();
  event.stopPropagation();
  elements.attachmentMenu.classList.add("hidden");
  elements.emojiPicker.classList.toggle("hidden");
}

function closeComposerPopovers() {
  elements.attachmentMenu.classList.add("hidden");
  elements.emojiPicker.classList.add("hidden");
}

function handleComposerOutsideClick(event) {
  if (!event.target.closest(".message")) {
    elements.chatFeed?.querySelectorAll(".message.touch-actions-open").forEach((item) => item.classList.remove("touch-actions-open"));
  }
  if (event.target.closest("#messageForm")) return;
  closeComposerPopovers();
}

function handleAttachmentMenuClick(event) {
  const option = event.target.closest("[data-attach-type], [data-placeholder-modal]");
  if (!option) return;

  event.preventDefault();
  closeComposerPopovers();

  if (isGuestSession()) {
    promptGuestUpgrade("Sign up to share files!");
    return;
  }

  const attachmentType = option.dataset.attachType;
  if (attachmentType) {
    configureAttachmentInput(attachmentType);
    elements.messageAttachmentInput.click();
    return;
  }

  const placeholder = option.dataset.placeholderModal || "";
  if (placeholder.toLowerCase().includes("camera")) {
    openCameraCapture();
    return;
  }
  if (placeholder.toLowerCase().includes("contact")) {
    pickContactForComposer();
    return;
  }

  toast(`${placeholder || "This option"} is not available yet.`);
}

function configureAttachmentInput(type) {
  elements.messageAttachmentInput.removeAttribute("capture");
  elements.messageAttachmentInput.value = "";

  const acceptMap = {
    document:
      ".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain",
    media: "image/*,video/*",
    audio: "audio/*",
  };

  elements.messageAttachmentInput.accept = acceptMap[type] || "image/*,.pdf,.doc,.docx,.txt,audio/*";
}

function openCameraCapture() {
  configureAttachmentInput("media");
  elements.messageAttachmentInput.setAttribute("capture", "environment");
  elements.messageAttachmentInput.click();
}

async function pickContactForComposer() {
  if (!("contacts" in navigator) || typeof navigator.contacts?.select !== "function") {
    toast("Contacts are not supported in this browser.");
    return;
  }

  try {
    const contacts = await navigator.contacts.select(["name", "tel", "email"], { multiple: false });
    const contact = contacts?.[0];
    if (!contact) return;
    const lines = [
      contact.name?.[0] || "Contact",
      contact.tel?.[0] ? `Phone: ${contact.tel[0]}` : "",
      contact.email?.[0] ? `Email: ${contact.email[0]}` : "",
    ].filter(Boolean);
    insertAtCursor(elements.messageInput, lines.join("\n"));
    updateComposerAction();
    elements.messageInput.focus();
  } catch (error) {
    toast(error?.name === "NotAllowedError" ? "Contact permission was denied." : "Could not open contacts.");
  }
}

function handleEmojiPick(event) {
  const button = event.target.closest("[data-emoji]");
  if (!button) return;

  event.preventDefault();
  insertAtCursor(elements.messageInput, button.dataset.emoji);
  elements.emojiPicker.classList.add("hidden");
  elements.messageInput.focus();
  updateComposerAction();
  handleTypingInput();
}

function insertAtCursor(input, value) {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.value = `${input.value.slice(0, start)}${value}${input.value.slice(end)}`;
  const nextPosition = start + value.length;
  input.setSelectionRange(nextPosition, nextPosition);
}

function openComposerPlaceholderModal(name = "This option") {
  elements.composerPlaceholderModal.querySelector(".modal-card")?.classList.remove("create-room-modal");
  elements.composerPlaceholderBody.classList.remove("create-room-modal-body");
  elements.composerPlaceholderTitle.textContent = name;
  elements.composerPlaceholderBody.textContent = `${name} is available from this device when the browser grants access.`;
  elements.composerPlaceholderOkButton.classList.remove("hidden");
  elements.composerPlaceholderOkButton.textContent = "Got it";
  elements.composerPlaceholderModal.classList.remove("hidden");
}

function closeComposerPlaceholderModal() {
  elements.composerPlaceholderModal.classList.add("hidden");
  elements.composerPlaceholderModal.querySelector(".modal-card")?.classList.remove("create-room-modal");
  elements.composerPlaceholderBody.classList.remove("create-room-modal-body");
  elements.composerPlaceholderOkButton.classList.remove("hidden");
  elements.composerPlaceholderOkButton.textContent = "Got it";
  elements.composerPlaceholderBody.textContent = "";
}

function updateComposerAction() {
  const hasMessage = Boolean(elements.messageInput.value.trim());
  const hasPayload = hasMessage || Boolean(state.pendingAttachment);
  elements.voiceButton.classList.toggle("hidden", hasPayload);
  elements.sendMessageButton.classList.toggle("hidden", !hasPayload);
  elements.messageForm.classList.toggle("has-text", hasMessage);
  autoResizeMessageInput();
}

function autoResizeMessageInput() {
  elements.messageInput.style.height = "auto";
  elements.messageInput.style.height = `${Math.min(elements.messageInput.scrollHeight, 128)}px`;
}

async function handleMessageSubmit(event) {
  event.preventDefault();
  const text = elements.messageInput.value.trim();
  const attachment = state.pendingAttachment ? { ...state.pendingAttachment } : null;
  if (!text && !attachment) return;
  if (attachment?.uploading) {
    toast("Please wait for the upload to finish.");
    return;
  }

  if (isGuestSession()) {
    promptGuestUpgrade("Sign up to send messages!");
    return;
  }

  if (!state.session?.token) {
    toast("Please login to send messages");
    return;
  }

  if (isAdmin()) {
    toast("Admin console cannot send student chat messages.");
    return;
  }

  if (!socket || !socket.connected) {
    connectLiveUpdates();
  }

  const submitKey = messageSubmitKey(text, attachment, state.replyToMessageId);
  if (isSubmittingMessage && submitKey === lastMessageSubmitKey) return;
  isSubmittingMessage = true;
  lastMessageSubmitKey = submitKey;
  window.clearTimeout(messageSubmitCooldownTimer);

  let clientTempId = "";
  let replyToMessageId = state.replyToMessageId;

  try {
    if (state.editingMessageId) {
      await submitMessageEdit(text);
      updateComposerAction();
      return;
    }

    clientTempId = createClientTempId();
    const pendingMessage = createOptimisticMessage({ text, attachment, replyToMessageId, clientTempId });
    upsertMessage(pendingMessage);

    elements.messageInput.value = "";
    state.replyToMessageId = null;
    clearAttachment();
    updateComposerAction();
    renderMessages({ preserveScroll: true });
    scheduleRoomSummaryRender();
    sendTyping(false);

    const result = await api("/api/messages", {
      method: "POST",
      body: {
        token: state.session.token,
        roomId: state.activeRoomId,
        text,
        replyToMessageId,
        attachment,
        clientTempId,
      },
    });

    if (result.message) {
      upsertMessage({ ...result.message, clientTempId: result.message.clientTempId || clientTempId });
      renderMessages({ preserveScroll: true });
      scheduleRoomSummaryRender();
    }
  } catch (error) {
    console.error("Send failed:", error);
    if (canFallbackToSocketMessageSend(error)) {
      socket.emit("message:send", {
        token: state.session.token,
        roomId: state.activeRoomId,
        text,
        replyToMessageId: replyToMessageId || null,
        attachment,
      });
      return;
    }

    const failed = state.messages.find((message) =>
      message.localStatus === "pending" &&
      (message.clientTempId === clientTempId || message.submitKey === submitKey)
    );
    if (failed) {
      failed.localStatus = "failed";
      failed.delivery = { ...failed.delivery, failedAt: Date.now() };
      renderMessages({ preserveScroll: true });
    }
    if (isSessionExpiredError(error)) {
      handleApiError(error);
    } else {
      toast("Message failed to send. Try again.");
    }
  } finally {
    isSubmittingMessage = false;
    messageSubmitCooldownTimer = window.setTimeout(() => {
      if (lastMessageSubmitKey === submitKey) lastMessageSubmitKey = "";
    }, 800);
  }
}

function canFallbackToSocketMessageSend(error) {
  if (!socket?.connected || !state.session?.token || !state.activeRoomId) return false;
  const status = Number(error?.status);
  return status === 404 || status === 405;
}

function messageSubmitKey(text, attachment, replyToMessageId) {
  return JSON.stringify({
    roomId: state.activeRoomId,
    text,
    replyToMessageId: replyToMessageId || "",
    attachment: attachment
      ? {
          name: attachment.name,
          size: attachment.size,
          url: attachment.url || attachment.dataUrl || "",
        }
      : null,
  });
}

function createClientTempId() {
  const random = window.crypto?.getRandomValues
    ? Array.from(window.crypto.getRandomValues(new Uint32Array(2)), (value) => value.toString(36)).join("")
    : Math.random().toString(36).slice(2, 14);
  return `ct_${Date.now().toString(36)}_${random}`;
}

function createOptimisticMessage({ text, attachment, replyToMessageId, clientTempId }) {
  const user = state.session.user;
  const replyTo = replyToMessageId
    ? state.messages.find((message) => String(message.id) === String(replyToMessageId))
    : null;
  const createdAt = Date.now();
  const submitKey = messageSubmitKey(text, attachment, replyToMessageId);

  return normalizeMessage({
    id: clientTempId || `pending_${createdAt}_${Math.random().toString(36).slice(2, 8)}`,
    roomId: state.activeRoomId,
    authorId: user.id,
    author: user.anonymousName || user.name || "Anonymous User",
    username: user.username || "",
    about: user.about || "",
    customStatus: user.customStatus || "",
    department: user.department || "",
    campus: user.campus || "",
    avatarColor: user.avatarColor || "#6c63ff",
    avatarDataUrl: user.avatarDataUrl || "",
    text,
    type: attachment ? "media" : "text",
    attachment,
    replyTo: replyTo
      ? {
          id: replyTo.id,
          messageId: replyTo.id,
          author: replyTo.author,
          text: replyTo.text || replyTo.attachment?.name || "Attachment",
        }
      : null,
    createdAt,
    delivery: { sentAt: null, deliveredTo: [], seenBy: [] },
    localStatus: "pending",
    submitKey,
    clientTempId,
  });
}

function handleComposerKeydown(event) {
  const enterToSend = loadUserSettings().enterToSend !== false;
  if (enterToSend && event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    elements.messageForm.requestSubmit();
  }
}

function handleTypingInput() {
  updateComposerAction();
  if (!state.session || isAdmin()) return;

  if (typingRequestTimer) return;
  typingRequestTimer = window.setTimeout(async () => {
    typingRequestTimer = null;
    await sendTyping(Boolean(elements.messageInput.value.trim()));
  }, 350);

  window.clearTimeout(typingTimer);
  typingTimer = window.setTimeout(() => sendTyping(false), 1800);
}

async function sendTyping(isTypingNow) {
  if (!state.session || isAdmin()) return;

  if (!socket?.connected) return;

  socket.emit(isTypingNow ? "typing:start" : "typing:stop", {
    token: state.session.token,
    roomId: state.activeRoomId,
  });
}

function startConfession() {
  state.activeRoomId = state.rooms.find((room) => room.slug === "deep-talk" || room.id === "deep-talk")?.id || state.rooms[0]?.id || "general";
  localStorage.setItem(ROOM_KEY, state.activeRoomId);
  elements.messageInput.value = "Confession: ";
  elements.messageInput.focus();
  updateComposerAction();
  render();
}

async function handleAttachmentSelect(event) {
  const file = event.target.files?.[0];
  if (file) await setPendingAttachmentFromFile(file);
  event.target.value = "";
}

async function setPendingAttachmentFromFile(file) {
  try {
    state.pendingAttachment = await buildAttachment(file);
    state.pendingAttachment.uploading = true;
    state.pendingAttachment.uploadProgress = 0;
    renderAttachmentPreview();
    updateComposerAction();

    try {
      const uploadRes = await uploadMultipart("/api/upload/chat", "file", file, (progress) => {
        if (!state.pendingAttachment) return;
        state.pendingAttachment.uploadProgress = progress;
        renderAttachmentPreview();
      });
      state.pendingAttachment = {
        ...state.pendingAttachment,
        ...uploadRes.attachment,
        dataUrl: uploadRes.attachment?.dataUrl || uploadRes.attachment?.url || state.pendingAttachment.dataUrl,
        uploading: false,
        uploadProgress: 100,
      };
    } catch (uploadErr) {
      console.warn("Chat upload failed, using local preview until send:", uploadErr);
      state.pendingAttachment.uploading = false;
      state.pendingAttachment.uploadProgress = 0;
    }

    renderAttachmentPreview();
    updateComposerAction();
  } catch (error) {
    toast(error.message);
  }
}

function buildAttachment(file) {
  const maxBytes = 8 * 1024 * 1024;
  const mimeType = normalizeMimeType(file.type || "application/octet-stream");

  if (file.size > maxBytes) {
    throw new Error("File too large. Maximum size is 8MB.");
  }

  if (!CLIENT_ALLOWED_ATTACHMENT_TYPES.has(mimeType)) {
    throw new Error("This file type is not supported yet.");
  }

  return fileToDataUrl(file).then((dataUrl) => ({
    kind: mimeType.startsWith("image/")
      ? "image"
      : mimeType.startsWith("video/")
        ? "video"
      : mimeType.startsWith("audio/")
        ? "audio"
        : "file",
    name: file.name || "attachment",
    mimeType,
    size: file.size,
    dataUrl,
  }));
}

function normalizeMimeType(mimeType) {
  return String(mimeType || "application/octet-stream").split(";")[0].trim().toLowerCase() || "application/octet-stream";
}

function supportedVoiceMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  return VOICE_MIME_CANDIDATES.find((mimeType) => MediaRecorder.isTypeSupported?.(mimeType)) || "";
}

function voiceFileExtension(mimeType) {
  return VOICE_EXTENSION_BY_MIME[normalizeMimeType(mimeType)] || "webm";
}

function renderAttachmentPreview() {
  const attachment = state.pendingAttachment;

  if (!attachment) {
    elements.attachmentPreview.classList.add("hidden");
    elements.attachmentPreview.innerHTML = "";
    elements.messageForm.classList.remove("has-attachment");
    return;
  }

  const typeLabel =
    attachment.kind === "audio"
      ? "Voice note ready"
      : attachment.kind === "image"
        ? "Image attached"
        : attachment.kind === "video"
          ? "Video attached"
        : "File attached";
  const kindLabel =
    attachment.kind === "audio"
      ? "Audio"
      : attachment.kind === "image"
        ? "Image"
        : attachment.kind === "video"
          ? "Video"
          : "File";

  elements.messageForm.classList.add("has-attachment");
  elements.attachmentPreview.classList.remove("hidden");
  elements.attachmentPreview.innerHTML = `
    <div class="attachment-chip">
      ${renderAttachmentPreviewMedia(attachment)}
      <strong class="attachment-kind">${escapeHtml(kindLabel)}</strong>
      <span class="attachment-copy">
        <b>${escapeHtml(typeLabel)}</b>
        <small>${escapeHtml(attachment.name)} - ${formatBytes(attachment.size)}${attachment.uploading ? ` - Uploading ${Math.max(1, Math.round(attachment.uploadProgress || 0))}%` : ""}</small>
        ${attachment.uploading ? `<span class="upload-progress" aria-label="Upload progress"><i style="width:${Math.max(1, Math.min(100, Number(attachment.uploadProgress || 0)))}%"></i></span>` : ""}
      </span>
      <button class="icon-btn attachment-remove" type="button" id="clearAttachmentButton" aria-label="Remove attachment">x</button>
    </div>
  `;

  elements.attachmentPreview.querySelector("#clearAttachmentButton").addEventListener("click", clearAttachment);
}

function renderAttachmentPreviewMedia(attachment) {
  if (attachment.kind === "image") {
    return `<img class="attachment-thumb" src="${escapeAttr(attachment.dataUrl)}" alt="${escapeAttr(attachment.name)}"${mediaSecurityAttrs(attachment.dataUrl)} />`;
  }

  if (attachment.kind === "video") {
    return `<video class="attachment-thumb" src="${escapeAttr(attachment.dataUrl)}" muted${mediaSecurityAttrs(attachment.dataUrl)}></video>`;
  }

  const label = attachment.kind === "audio" ? "AUD" : "FILE";
  return `<span class="attachment-thumb attachment-file-thumb">${label}</span>`;
}

function clearAttachment() {
  state.pendingAttachment = null;
  renderAttachmentPreview();
  updateComposerAction();
}

function handleComposerDragEnter(event) {
  if (!event.dataTransfer?.types?.includes("Files")) return;
  event.preventDefault();
  elements.messageForm?.classList.add("drag-over");
}

function handleComposerDragOver(event) {
  if (!event.dataTransfer?.types?.includes("Files")) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  elements.messageForm?.classList.add("drag-over");
}

function handleComposerDragLeave(event) {
  if (elements.messageForm?.contains(event.relatedTarget)) return;
  elements.messageForm?.classList.remove("drag-over");
}

async function handleComposerDrop(event) {
  if (!event.dataTransfer?.files?.length) return;
  event.preventDefault();
  elements.messageForm?.classList.remove("drag-over");
  await setPendingAttachmentFromFile(event.dataTransfer.files[0]);
}

async function toggleVoiceRecording() {
  if (voiceRecorderFinalizing) return;

  if (mediaRecorder?.state === "recording") {
    stopVoiceRecording();
    return;
  }

  if (mediaRecorder?.state === "paused") {
    resumeVoiceRecording();
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    toast("Voice recording is not supported in this browser.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const preferredMimeType = supportedVoiceMimeType();
    voiceRecorderStream = stream;
    voiceChunks = [];
    mediaRecorder = new MediaRecorder(stream, preferredMimeType ? { mimeType: preferredMimeType } : undefined);
    mediaRecorder.cancelled = false;
    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) voiceChunks.push(event.data);
    });
    mediaRecorder.addEventListener("stop", async (event) => {
      const recorder = event.currentTarget;
      const duration = voiceRecorderDurationSeconds || voiceRecorderElapsedSeconds();
      window.clearInterval(voiceRecorderTimer);
      voiceRecorderTimer = null;
      stream.getTracks().forEach((track) => track.stop());
      voiceRecorderStream = null;

      const recordedMimeType = normalizeMimeType(recorder.mimeType || voiceChunks[0]?.type || preferredMimeType || "audio/webm");
      const blob = new Blob(voiceChunks, { type: recordedMimeType });
      if (recorder.cancelled || !blob.size || duration < 1) {
        resetVoiceRecorderUi();
        if (!recorder.cancelled) toast("Voice note was too short.");
        return;
      }

      voiceRecorderFinalizing = true;
      voiceRecorderUploadProgress = 1;
      renderVoiceRecorderBar();

      try {
        const voiceFile = new File([blob], `voice-${Date.now()}.${voiceFileExtension(recordedMimeType)}`, { type: recordedMimeType });
        let attachment = await buildAttachment(voiceFile);
        attachment = {
          ...attachment,
          voiceNote: true,
          duration,
        };

        try {
          const uploadRes = await uploadMultipart("/api/upload/chat", "file", voiceFile, (progress) => {
            voiceRecorderUploadProgress = progress;
            renderVoiceRecorderBar();
          });
          attachment = {
            ...attachment,
            ...uploadRes.attachment,
            dataUrl: uploadRes.attachment?.dataUrl || uploadRes.attachment?.url || attachment.dataUrl,
            voiceNote: true,
            duration,
            uploading: false,
            uploadProgress: 100,
          };
        } catch (uploadErr) {
          console.warn("Voice upload failed, using local preview until send:", uploadErr);
          attachment.uploading = false;
          attachment.uploadProgress = 0;
        }

        state.pendingAttachment = attachment;
        resetVoiceRecorderUi();
        renderAttachmentPreview();
        updateComposerAction();
        elements.messageForm?.requestSubmit();
      } catch (uploadErr) {
        resetVoiceRecorderUi();
        handleApiError(uploadErr);
      }
    });
    mediaRecorder.start(1000);
    voiceRecorderStartedAt = Date.now();
    voiceRecorderPausedAt = 0;
    voiceRecorderPausedMs = 0;
    voiceRecorderDurationSeconds = 0;
    voiceRecorderUploadProgress = 0;
    closeComposerPopovers();
    elements.messageForm?.classList.add("recording-voice");
    renderVoiceRecorderBar();
    voiceRecorderTimer = window.setInterval(renderVoiceRecorderBar, 500);
    elements.voiceButton.classList.add("recording");
    elements.voiceButton.setAttribute("aria-label", "Stop recording");
    elements.voiceButton.setAttribute("aria-pressed", "true");
    toast("Recording voice note...");
  } catch (error) {
    resetVoiceRecorderUi();
    elements.voiceButton.classList.remove("recording");
    elements.voiceButton.setAttribute("aria-label", "Record voice note");
    elements.voiceButton.setAttribute("aria-pressed", "false");
    toast(error?.name === "NotAllowedError" ? "Microphone permission was denied." : "Microphone permission is needed for voice notes.");
  }
}

function renderVoiceRecorderBar() {
  if (!elements.voiceRecorderBar || (!mediaRecorder && !voiceRecorderFinalizing)) return;
  const paused = mediaRecorder?.state === "paused";
  const elapsed = voiceRecorderFinalizing ? voiceRecorderDurationSeconds : voiceRecorderElapsedSeconds();
  elements.voiceRecorderBar.classList.toggle("paused", paused);
  elements.voiceRecorderBar.classList.toggle("finalizing", voiceRecorderFinalizing);
  elements.voiceRecorderBar.classList.remove("hidden");
  elements.voiceRecorderBar.innerHTML = `
    <button class="voice-recorder-icon voice-recorder-delete" type="button" data-voice-action="cancel" aria-label="Discard voice note" title="Discard" ${voiceRecorderFinalizing ? "disabled" : ""}>Del</button>
    <div class="voice-recorder-status">
      <span class="recording-dot" aria-hidden="true"></span>
      <strong>${voiceRecorderFinalizing ? "Sending" : paused ? "Paused" : "Recording"}</strong>
      <span>${formatCallClock(elapsed)}</span>
    </div>
    <div class="voice-waveform" aria-hidden="true">${Array.from({ length: 24 }, () => "<i></i>").join("")}</div>
    <div class="voice-recorder-actions">
      ${voiceRecorderFinalizing ? `<span class="voice-upload-progress">${Math.max(1, Math.round(voiceRecorderUploadProgress || 1))}%</span>` : ""}
      ${!voiceRecorderFinalizing && mediaRecorder && typeof mediaRecorder.pause === "function" ? `<button type="button" data-voice-action="${paused ? "resume" : "pause"}">${paused ? "Resume" : "Pause"}</button>` : ""}
      <button type="button" data-voice-action="stop" ${voiceRecorderFinalizing ? "disabled" : ""}>${voiceRecorderFinalizing ? "..." : "Send"}</button>
    </div>
  `;
}

function handleVoiceRecorderAction(event) {
  const button = event.target.closest("[data-voice-action]");
  if (!button || !mediaRecorder) return;
  const action = button.dataset.voiceAction;
  if (action === "pause") pauseVoiceRecording();
  if (action === "resume") resumeVoiceRecording();
  if (action === "stop") stopVoiceRecording();
  if (action === "cancel") cancelVoiceRecording();
}

function pauseVoiceRecording() {
  if (mediaRecorder?.state !== "recording") return;
  mediaRecorder.pause();
  voiceRecorderPausedAt = Date.now();
  renderVoiceRecorderBar();
}

function resumeVoiceRecording() {
  if (mediaRecorder?.state !== "paused") return;
  voiceRecorderPausedMs += Date.now() - voiceRecorderPausedAt;
  voiceRecorderPausedAt = 0;
  mediaRecorder.resume();
  renderVoiceRecorderBar();
}

function stopVoiceRecording() {
  if (!mediaRecorder || mediaRecorder.state === "inactive") return;
  voiceRecorderDurationSeconds = voiceRecorderElapsedSeconds();
  if (typeof mediaRecorder.requestData === "function") {
    try {
      mediaRecorder.requestData();
    } catch (error) {
      console.warn("Unable to flush voice recorder data:", error);
    }
  }
  mediaRecorder.stop();
}

function cancelVoiceRecording() {
  if (!mediaRecorder || mediaRecorder.state === "inactive") return;
  mediaRecorder.cancelled = true;
  voiceChunks = [];
  mediaRecorder.stop();
  toast("Voice note discarded.");
}

function resetVoiceRecorderUi() {
  window.clearInterval(voiceRecorderTimer);
  voiceRecorderTimer = null;
  voiceRecorderStartedAt = 0;
  voiceRecorderPausedAt = 0;
  voiceRecorderPausedMs = 0;
  voiceRecorderFinalizing = false;
  voiceRecorderDurationSeconds = 0;
  voiceRecorderUploadProgress = 0;
  mediaRecorder = null;
  voiceRecorderStream?.getTracks().forEach((track) => track.stop());
  voiceRecorderStream = null;
  elements.voiceRecorderBar?.classList.add("hidden");
  elements.voiceRecorderBar?.classList.remove("paused", "finalizing");
  elements.messageForm?.classList.remove("recording-voice");
  elements.voiceButton.classList.remove("recording");
  elements.voiceButton.setAttribute("aria-label", "Record voice note");
  elements.voiceButton.setAttribute("aria-pressed", "false");
}

function voiceRecorderElapsedSeconds() {
  if (!voiceRecorderStartedAt) return 0;
  const pauseMs = voiceRecorderPausedAt ? Date.now() - voiceRecorderPausedAt : 0;
  return Math.max(0, Math.round((Date.now() - voiceRecorderStartedAt - voiceRecorderPausedMs - pauseMs) / 1000));
}

async function createPoll() {
  if (isAdmin()) {
    toast("Admin console cannot create student polls.");
    return;
  }

  const question = window.prompt("Poll question");
  if (!question) return;

  const optionsText = window.prompt("Options separated by comma", "Yes, No");
  if (!optionsText) return;

  const options = optionsText.split(",").map((item) => item.trim()).filter(Boolean);

  try {
    await api("/api/messages", {
      method: "POST",
      body: {
        token: state.session.token,
        roomId: state.activeRoomId,
        text: `Poll: ${question}\nOptions: ${options.join(", ")}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
}

async function votePoll(messageId, optionId) {
  toast("Poll voting will be available when poll routes are enabled.");
}

function openReportModal(messageId) {
  const message = state.messages.find((item) => item.id === messageId);
  if (!message) return;

  selectedReportMessageId = messageId;
  elements.reportPreview.textContent = message.text;
  elements.reportModal.classList.remove("hidden");
}

function closeReportModal() {
  selectedReportMessageId = null;
  elements.reportModal.classList.add("hidden");
}

function openUserProfileFromTrigger(trigger) {
  const authorId = trigger.dataset.profileAuthorId || trigger.dataset.authorId || "";
  const messageId = trigger.closest(".message")?.dataset.messageId || "";
  const message = findProfileMessage(authorId, messageId);

  if (!message) {
    toast("User profile is not available for this message.");
    return;
  }

  openUserProfilePanel(message);
}

function findProfileMessage(authorId, messageId = "") {
  const id = String(authorId || "");
  const direct = messageId
    ? state.messages.find((message) => String(message.id) === String(messageId))
    : null;
  if (direct) return direct;

  return [...state.messages]
    .reverse()
    .find((message) => String(message.authorId || "") === id && !message.hidden);
}

function openUserProfilePanel(message) {
  selectedProfileAuthorId = String(message.authorId || "");
  selectedProfileMessageId = String(message.id || "");

  elements.viewName.textContent = message.author || "Anonymous";
  elements.viewUsername.textContent = `@${message.username || message.authorId || "user"} - ${presenceLabel(message.authorId)}`;
  elements.viewAbout.textContent = [message.customStatus, message.about].filter(Boolean).join(" - ") || "No bio yet";
  elements.viewDept.textContent = message.department || "-";
  elements.viewCampus.textContent = message.campus || "-";
  elements.viewJoined.textContent = formatProfileJoined(message.joinedAt || message.createdAt);

  renderProfileAvatar(message);
  updateCallButtonsAvailability();

  elements.userProfilePanel?.classList.remove("hidden");
  window.requestAnimationFrame(() => {
    elements.profileDrawer?.classList.add("open");
    elements.profileOverlay?.classList.add("open");
  });
}

function renderProfileAvatar(message) {
  if (!elements.viewAvatar) return;
  elements.viewAvatar.innerHTML = "";

  if (message.avatarDataUrl) {
    const image = document.createElement("img");
    image.src = message.avatarDataUrl;
    image.alt = message.author || "User avatar";
    elements.viewAvatar.style.background = "transparent";
    elements.viewAvatar.append(image);
    return;
  }

  elements.viewAvatar.style.background = message.avatarColor || "#6c63ff";
  elements.viewAvatar.textContent = (message.author || "A").slice(0, 1).toUpperCase();
}

function closeUserProfilePanel() {
  selectedProfileAuthorId = null;
  selectedProfileMessageId = null;
  elements.profileDrawer?.classList.remove("open");
  elements.profileOverlay?.classList.remove("open");
  window.setTimeout(() => {
    if (!elements.profileDrawer?.classList.contains("open")) {
      elements.userProfilePanel?.classList.add("hidden");
    }
  }, 250);
}

function handleUserProfileKeydown(event) {
  if (event.key === "Escape") closeUserProfilePanel();
}

function profileSelectedMessage() {
  return state.messages.find((message) => String(message.id) === String(selectedProfileMessageId));
}

function blockUserFromProfile() {
  const message = profileSelectedMessage();
  if (!message?.authorId || String(message.authorId) === String(state.session?.user?.id)) {
    toast("You cannot block this profile.");
    return;
  }

  closeUserProfilePanel();
  openBlockUserModal(message.id);
}

function reportUserFromProfile() {
  const message = profileSelectedMessage();
  if (!message?.id || String(message.authorId) === String(state.session?.user?.id)) {
    toast("You cannot report this profile.");
    return;
  }

  closeUserProfilePanel();
  openReportModal(message.id);
}

function defaultCallState() {
  return {
    active: false,
    direction: "",
    status: "idle",
    type: "audio",
    callId: "",
    roomId: "",
    peer: null,
    pendingIncoming: null,
    pc: null,
    localStream: null,
    remoteStream: null,
    startedAt: 0,
    durationTimer: null,
    timeoutTimer: null,
    muted: false,
    cameraOff: false,
    facingMode: "user",
    minimized: false,
    ending: false,
  };
}

function createCallId() {
  return `call_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeCallPeer(source = {}) {
  const id = String(source.id || source.authorId || source.userId || source._id || "");
  return {
    id,
    name: source.name || source.author || source.anonymousName || source.username || "Anonymous User",
    username: source.username || "",
    avatarColor: source.avatarColor || "#6c63ff",
    avatarDataUrl: source.avatarDataUrl || "",
  };
}

function latestCallablePeer() {
  const currentUserId = String(state.session?.user?.id || "");
  const activeRoom = getActiveRoom();
  const activeRoomId = String(activeRoom?.id || state.activeRoomId || "");
  const latestMessage = [...state.messages]
    .filter((message) => String(message.roomId || "") === activeRoomId)
    .filter((message) => message.authorId && String(message.authorId) !== currentUserId)
    .filter((message) => !message.hidden && !message.deletedAt && !isBlockedUserId(message.authorId))
    .sort((first, second) => Number(second.createdAt || 0) - Number(first.createdAt || 0))[0];

  return latestMessage ? normalizeCallPeer(latestMessage) : null;
}

function startCallFromProfile(type) {
  const message = profileSelectedMessage();
  if (!message?.authorId || String(message.authorId) === String(state.session?.user?.id)) {
    toast("You cannot call this profile.");
    return;
  }

  closeUserProfilePanel();
  startOutgoingCall(normalizeCallPeer(message), type);
}

function startCallWithLatestPeer(type) {
  const peer = latestCallablePeer();
  if (!peer?.id) {
    toast("Open a user profile or select a chat with another active user first.");
    return;
  }
  startOutgoingCall(peer, type);
}

async function startOutgoingCall(peer, type = "audio") {
  if (!state.session?.token || isAdmin() || isGuestSession()) {
    toast("Log in with a user account to start calls.");
    return;
  }
  if (!ensureCallSocket()) return;
  if (!window.RTCPeerConnection || !navigator.mediaDevices?.getUserMedia) {
    toast("Audio and video calls are not supported in this browser.");
    return;
  }
  if (callState.active) {
    toast("You are already in a call.");
    return;
  }
  if (!peer?.id || isBlockedUserId(peer.id)) {
    toast("Calls are not available for this user.");
    return;
  }

  const callId = createCallId();
  callState = {
    ...defaultCallState(),
    active: true,
    direction: "outgoing",
    status: "calling",
    type: type === "video" ? "video" : "audio",
    callId,
    roomId: getActiveRoom()?.id || state.activeRoomId || "",
    peer,
  };
  showCallScreen();

  try {
    await prepareLocalMedia(callState.type);
    const pc = setupPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    updateCallUi();

    const response = await emitCallEvent("call:offer", {
      token: state.session.token,
      callId,
      type: callState.type,
      targetUserId: peer.id,
      roomId: callState.roomId,
      offer,
    });

    if (!response?.ok) {
      if (callState.callId === callId) {
        cleanupCall(false);
        toast(callFailureMessage(response?.reason || response?.error));
      }
      return;
    }

    if (callState.callId === callId) {
      callState.timeoutTimer = window.setTimeout(markOutgoingCallMissed, CALL_TIMEOUT_MS);
    }
  } catch (error) {
    if (callState.callId === callId || callState.active) cleanupCall(false);
    toast(getMediaErrorMessage(error));
  }
}

function ensureCallSocket() {
  if (!socket) connectLiveUpdates();
  if (!socket?.connected) {
    toast("Live connection is reconnecting. Try again in a moment.");
    return false;
  }
  return true;
}

function emitCallEvent(eventName, payload, timeoutMs = 10000) {
  return new Promise((resolve) => {
    if (!socket?.connected) {
      resolve({ ok: false, reason: "offline" });
      return;
    }

    const timer = window.setTimeout(() => resolve({ ok: false, reason: "timeout" }), timeoutMs);
    socket.emit(eventName, payload, (response = {}) => {
      window.clearTimeout(timer);
      resolve(response);
    });
  });
}

async function prepareLocalMedia(type) {
  const constraints = {
    audio: true,
    video: type === "video" ? { facingMode: callState.facingMode || "user" } : false,
  };
  callState.localStream = await navigator.mediaDevices.getUserMedia(constraints);
  if (elements.localVideo) {
    elements.localVideo.srcObject = callState.localStream;
    elements.localVideo.muted = true;
  }
}

function setupPeerConnection() {
  const pc = new RTCPeerConnection(RTC_CONFIGURATION);
  callState.pc = pc;
  callState.remoteStream = new MediaStream();
  if (elements.remoteVideo) elements.remoteVideo.srcObject = callState.remoteStream;

  callState.localStream?.getTracks().forEach((track) => pc.addTrack(track, callState.localStream));

  pc.ontrack = (event) => {
    const stream = event.streams?.[0];
    const tracks = stream?.getTracks?.() || [event.track].filter(Boolean);
    tracks.forEach((track) => {
      if (!callState.remoteStream.getTracks().some((existing) => existing.id === track.id)) {
        callState.remoteStream.addTrack(track);
      }
    });
    if (elements.remoteVideo) elements.remoteVideo.srcObject = callState.remoteStream;
  };

  pc.onicecandidate = (event) => {
    if (!event.candidate || !callState.callId || !socket?.connected) return;
    socket.emit("call:ice-candidate", {
      token: state.session?.token,
      callId: callState.callId,
      candidate: event.candidate,
    });
  };

  pc.onconnectionstatechange = () => {
    if (!callState.active) return;
    if (["disconnected", "connecting"].includes(pc.connectionState) && callState.status === "active") {
      callState.status = "reconnecting";
      updateCallUi();
      return;
    }
    if (pc.connectionState === "connected" && ["connecting", "reconnecting"].includes(callState.status)) {
      callState.status = "active";
      if (!callState.startedAt) {
        callState.startedAt = Date.now();
        startCallDurationTimer();
      }
      updateCallUi();
      return;
    }
    if (["failed", "closed"].includes(pc.connectionState) && callState.active) {
      toast("Call connection ended.");
      endCurrentCall("ended", true);
    }
  };

  return pc;
}

function showIncomingCall(payload) {
  const peer = normalizeCallPeer(payload.caller);
  callState = {
    ...defaultCallState(),
    active: true,
    direction: "incoming",
    status: "incoming",
    type: payload.type === "video" ? "video" : "audio",
    callId: String(payload.callId || ""),
    roomId: payload.roomId || state.activeRoomId || "",
    peer,
    pendingIncoming: payload,
  };

  elements.callLayer?.classList.remove("hidden");
  elements.callLayer?.classList.add("incoming-fullscreen");
  elements.callLayer?.classList.remove("call-minimized", "ending");
  elements.incomingCallCard?.classList.remove("hidden");
  elements.callScreen?.classList.add("hidden");
  renderCallAvatar(elements.incomingCallAvatar, peer);
  if (elements.incomingCallName) elements.incomingCallName.textContent = peer.name;
  if (elements.incomingCallType) elements.incomingCallType.textContent = `Incoming ${callState.type} call`;
  callState.timeoutTimer = window.setTimeout(() => {
    if (callState.status !== "incoming") return;
    socket?.emit("call:missed", { token: state.session?.token, callId: callState.callId });
    cleanupCall(false);
    toast("Missed call.");
  }, CALL_TIMEOUT_MS);
}

function handleIncomingCall(payload = {}) {
  if (!payload.callId) return;
  if (callState.active && callState.callId !== payload.callId) {
    socket?.emit("call:reject", {
      token: state.session?.token,
      callId: payload.callId,
      reason: "busy",
    });
    return;
  }
  notifyIncomingCall(payload);
  showIncomingCall(payload);
}

async function acceptIncomingCall() {
  const incoming = callState.pendingIncoming;
  if (!incoming?.offer || callState.status !== "incoming") return;
  if (!window.RTCPeerConnection || !navigator.mediaDevices?.getUserMedia) {
    rejectIncomingCall("unsupported");
    toast("Audio and video calls are not supported in this browser.");
    return;
  }

  try {
    stopCallRingtone();
    callState.status = "connecting";
    showCallScreen();
    await prepareLocalMedia(callState.type);
    const pc = setupPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(incoming.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket?.emit("call:answer", {
      token: state.session?.token,
      callId: callState.callId,
      answer,
    });
    callState.status = "active";
    callState.startedAt = Date.now();
    startCallDurationTimer();
    updateCallUi();
  } catch (error) {
    socket?.emit("call:reject", {
      token: state.session?.token,
      callId: callState.callId,
      reason: "rejected",
    });
    cleanupCall(false);
    toast(getMediaErrorMessage(error));
  }
}

function rejectIncomingCall(reason = "rejected") {
  if (!callState.callId) return;
  stopCallRingtone();
  socket?.emit("call:reject", {
    token: state.session?.token,
    callId: callState.callId,
    reason,
  });
  cleanupCall(false);
}

function handleCallRinging(payload = {}) {
  if (payload.callId && payload.callId !== callState.callId) return;
  callState.status = "ringing";
  if (payload.target) callState.peer = normalizeCallPeer(payload.target);
  updateCallUi();
}

async function handleCallAnswer(payload = {}) {
  if (!callState.active || payload.callId !== callState.callId || !callState.pc) return;
  try {
    if (payload.user) callState.peer = normalizeCallPeer(payload.user);
    await callState.pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
    window.clearTimeout(callState.timeoutTimer);
    callState.timeoutTimer = null;
    callState.status = "active";
    callState.startedAt = Date.now();
    startCallDurationTimer();
    updateCallUi();
  } catch (error) {
    console.warn("Call answer failed:", error);
    endCurrentCall("ended", true);
  }
}

async function handleRemoteIceCandidate(payload = {}) {
  if (!callState.pc || payload.callId !== callState.callId || !payload.candidate) return;
  try {
    await callState.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
  } catch (error) {
    console.warn("ICE candidate ignored:", error.message);
  }
}

function handleCallRejected(payload = {}) {
  if (payload.callId && payload.callId !== callState.callId) return;
  cleanupCall(false);
  toast("Call declined.");
}

function handleCallBusy(payload = {}) {
  if (payload.reason === "incoming-while-busy") return;
  if (payload.callId && payload.callId !== callState.callId) return;
  if (!payload.callId && callState.direction !== "outgoing") return;
  cleanupCall(false);
  toast("User is busy on another call.");
}

function handleCallMissed(payload = {}) {
  if (payload.callId && payload.callId !== callState.callId) return;
  cleanupCall(false);
  toast("No answer.");
}

function handleCallOffline() {
  cleanupCall(false);
  toast("User is offline or unavailable.");
}

function handleRemoteCallEnded(payload = {}) {
  if (payload.callId && payload.callId !== callState.callId) return;
  cleanupCall(false);
  toast(payload.reason === "disconnect" ? "Call ended because the connection changed." : "Call ended.");
}

function markOutgoingCallMissed() {
  if (!callState.active || !["calling", "ringing"].includes(callState.status)) return;
  socket?.emit("call:missed", {
    token: state.session?.token,
    callId: callState.callId,
  });
  cleanupCall(false);
  toast("No answer.");
}

function endCurrentCall(reason = "ended", emit = true) {
  const callId = callState.callId;
  const durationSeconds = callState.status === "active" ? callElapsedSeconds() : 0;
  if (emit && callId && socket?.connected) {
    socket.emit("call:end", {
      token: state.session?.token,
      callId,
      reason,
      durationSeconds,
    });
  }
  cleanupCall(false);
}

function cleanupCall() {
  const hadVisibleCall = callState.active && elements.callLayer && !elements.callLayer.classList.contains("hidden");
  window.clearInterval(callState.durationTimer);
  window.clearTimeout(callState.timeoutTimer);
  callState.durationTimer = null;
  callState.timeoutTimer = null;
  try {
    if (callState.pc) {
      callState.pc.ontrack = null;
      callState.pc.onicecandidate = null;
      callState.pc.onconnectionstatechange = null;
      callState.pc.close();
    }
  } catch (error) {
    console.warn("Call peer cleanup failed:", error.message);
  }
  callState.localStream?.getTracks().forEach((track) => track.stop());
  callState.remoteStream?.getTracks().forEach((track) => track.stop());
  if (elements.localVideo) elements.localVideo.srcObject = null;
  if (elements.remoteVideo) elements.remoteVideo.srcObject = null;
  elements.incomingCallCard?.classList.add("hidden");
  elements.callScreen?.classList.add("hidden");
  elements.floatingCallWidget?.classList.add("hidden");
  if (hadVisibleCall) {
    elements.callLayer?.classList.add("ending");
    window.setTimeout(() => {
      if (callState.active) return;
      elements.callLayer?.classList.add("hidden");
      elements.callLayer?.classList.remove("incoming-fullscreen", "call-minimized", "ending");
    }, 180);
  } else {
    elements.callLayer?.classList.add("hidden");
    elements.callLayer?.classList.remove("incoming-fullscreen", "call-minimized", "ending");
  }
  stopCallRingtone();
  if (document.fullscreenElement === elements.callScreen) {
    document.exitFullscreen?.().catch(() => {});
  }
  callState = defaultCallState();
  updateCallButtonsAvailability();
}

function showCallScreen() {
  elements.callLayer?.classList.remove("hidden");
  elements.callLayer?.classList.remove("incoming-fullscreen", "call-minimized", "ending");
  elements.floatingCallWidget?.classList.add("hidden");
  elements.incomingCallCard?.classList.add("hidden");
  elements.callScreen?.classList.remove("hidden");
  callState.minimized = false;
  updateCallUi();
}

function updateCallUi() {
  const peer = callState.peer || {};
  elements.callScreen?.classList.toggle("audio-call", callState.type !== "video");
  elements.callScreen?.classList.toggle("video-call", callState.type === "video");
  ["calling", "ringing", "connecting", "active", "reconnecting"].forEach((status) => {
    elements.callScreen?.classList.toggle(status, callState.status === status);
  });
  renderCallAvatar(elements.callPeerAvatar, peer);
  if (elements.callPeerName) elements.callPeerName.textContent = peer.name || "Anonymous User";
  if (elements.callStatusText) elements.callStatusText.textContent = callStatusLabel();
  if (elements.callDuration) elements.callDuration.textContent = ["active", "reconnecting"].includes(callState.status) ? formatCallClock(callElapsedSeconds()) : "00:00";
  if (elements.muteCallButton) elements.muteCallButton.textContent = callState.muted ? "Unmute" : "Mute";
  if (elements.cameraCallButton) elements.cameraCallButton.textContent = callState.cameraOff ? "Camera On" : "Camera Off";
  if (elements.endCallButton) elements.endCallButton.textContent = ["calling", "ringing"].includes(callState.status) ? "Cancel" : "End";
  updateCallButtonsAvailability();
  updateFloatingCallWidget();
}

function callStatusLabel() {
  if (callState.status === "incoming") return `Incoming ${callState.type} call`;
  if (callState.status === "ringing") return "Ringing...";
  if (callState.status === "connecting") return "Connecting...";
  if (callState.status === "reconnecting") return "Reconnecting...";
  if (callState.status === "active") return callState.type === "video" ? "Video call" : "Audio call";
  return "Calling...";
}

function minimizeCallUi() {
  if (!callState.active || !elements.callLayer) return;
  callState.minimized = true;
  elements.callLayer.classList.add("call-minimized");
  elements.floatingCallWidget?.classList.remove("hidden");
  updateFloatingCallWidget();
}

function restoreCallUi() {
  if (!callState.active || !elements.callLayer) return;
  callState.minimized = false;
  elements.callLayer.classList.remove("call-minimized");
  elements.floatingCallWidget?.classList.add("hidden");
  if (callState.status === "incoming") {
    elements.callLayer.classList.add("incoming-fullscreen");
    elements.incomingCallCard?.classList.remove("hidden");
  } else {
    elements.callScreen?.classList.remove("hidden");
  }
  updateCallUi();
}

function updateFloatingCallWidget() {
  if (!elements.floatingCallWidget) return;
  const peer = callState.peer || {};
  renderCallAvatar(elements.floatingCallAvatar, peer);
  if (elements.floatingCallName) elements.floatingCallName.textContent = peer.name || "AnonChat Call";
  if (elements.floatingCallStatus) {
    elements.floatingCallStatus.textContent = callState.status === "active"
      ? formatCallClock(callElapsedSeconds())
      : callStatusLabel();
  }
  elements.floatingCallWidget.classList.toggle("hidden", !callState.active || !callState.minimized);
}

function renderCallAvatar(element, peer = {}) {
  if (!element) return;
  element.innerHTML = "";
  if (peer.avatarDataUrl) {
    const image = document.createElement("img");
    image.src = peer.avatarDataUrl;
    image.alt = peer.name || "Caller";
    element.style.background = "transparent";
    element.append(image);
    return;
  }
  element.style.background = peer.avatarColor || "#6c63ff";
  element.textContent = (peer.name || "A").slice(0, 1).toUpperCase();
}

function startCallDurationTimer() {
  window.clearInterval(callState.durationTimer);
  updateCallUi();
  callState.durationTimer = window.setInterval(updateCallUi, 1000);
}

function callElapsedSeconds() {
  if (!callState.startedAt) return 0;
  return Math.max(0, Math.round((Date.now() - callState.startedAt) / 1000));
}

function formatCallClock(seconds) {
  const safe = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function toggleCallMute() {
  const audioTrack = callState.localStream?.getAudioTracks?.()[0];
  if (!audioTrack) return;
  audioTrack.enabled = !audioTrack.enabled;
  callState.muted = !audioTrack.enabled;
  updateCallUi();
}

function toggleCallCamera() {
  const videoTrack = callState.localStream?.getVideoTracks?.()[0];
  if (!videoTrack) return;
  videoTrack.enabled = !videoTrack.enabled;
  callState.cameraOff = !videoTrack.enabled;
  updateCallUi();
}

async function switchCallCamera() {
  if (callState.type !== "video" || !callState.localStream || !callState.pc) return;
  callState.facingMode = callState.facingMode === "user" ? "environment" : "user";

  try {
    const nextStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: callState.facingMode },
    });
    const nextTrack = nextStream.getVideoTracks()[0];
    if (!nextTrack) throw new Error("Camera is not available.");
    const sender = callState.pc.getSenders().find((item) => item.track?.kind === "video");
    if (sender && nextTrack) await sender.replaceTrack(nextTrack);
    callState.localStream.getVideoTracks().forEach((track) => {
      callState.localStream.removeTrack(track);
      track.stop();
    });
    callState.localStream.addTrack(nextTrack);
    if (elements.localVideo) elements.localVideo.srcObject = callState.localStream;
    callState.cameraOff = false;
    updateCallUi();
  } catch (error) {
    toast(getMediaErrorMessage(error));
  }
}

function toggleCallFullscreen() {
  if (!elements.callScreen) return;
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
    return;
  }
  elements.callScreen.requestFullscreen?.().catch(() => {
    toast("Fullscreen is not available in this browser.");
  });
}

function updateCallButtonsAvailability() {
  const peer = latestCallablePeer();
  const disabled = isAdmin() || isGuestSession() || callState.active || !peer;
  [
    elements.topbarAudioCallButton,
    elements.topbarVideoCallButton,
    ...document.querySelectorAll("[data-call-latest]"),
  ].filter(Boolean).forEach((button) => {
    button.disabled = disabled;
    button.classList.toggle("disabled", disabled);
  });

  const selected = profileSelectedMessage();
  const profileDisabled = !selected?.authorId ||
    String(selected.authorId) === String(state.session?.user?.id) ||
    isBlockedUserId(selected.authorId) ||
    callState.active;
  [elements.audioCallFromProfile, elements.videoCallFromProfile].filter(Boolean).forEach((button) => {
    button.disabled = profileDisabled;
  });
}

function callFailureMessage(reason) {
  const text = String(reason || "").toLowerCase();
  if (text.includes("offline")) return "User is offline or unavailable.";
  if (text.includes("busy")) return "User is busy on another call.";
  if (text.includes("timeout")) return "Call signaling timed out.";
  return reason || "Call could not be started.";
}

function getMediaErrorMessage(error) {
  const name = error?.name || "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Microphone or camera permission was denied.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "No microphone or camera was found for this call.";
  }
  if (name === "NotReadableError") {
    return "Your microphone or camera is already in use.";
  }
  return error?.message || "Call could not be completed.";
}

function formatProfileJoined(value) {
  const date = new Date(value || Date.now());
  const safeDate = Number.isNaN(date.getTime()) ? new Date(Number(value || Date.now())) : date;
  return safeDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function submitReport(event) {
  event.preventDefault();
  if (!selectedReportMessageId) return;

  try {
    await api("/api/reports", {
      method: "POST",
      body: {
        token: state.session.token,
        messageId: selectedReportMessageId,
        reason: elements.reportReason.value,
      },
    });

    closeReportModal();
    await refreshState();
    render();
    toast("Report submitted \u2705");
  } catch (error) {
    handleApiError(error);
  }
}

function openReactionPicker(messageId) {
  state.activeReactionMessageId = state.activeReactionMessageId === messageId ? null : messageId;
  renderMessages({ preserveScroll: true });
}

async function toggleReaction(messageId, emoji = "\u{1F44D}") {
  if (isAdmin()) {
    toast("Admin console cannot react as a student.");
    return;
  }

  const { message } = await api(`/api/messages/${messageId}/react`, {
    method: "POST",
    body: { token: state.session.token, emoji },
  });

  saveRecentReaction(emoji);
  state.activeReactionMessageId = null;
  upsertMessage(message);
  renderMessages({ preserveScroll: true });
}

async function editMessage(messageId) {
  const message = state.messages.find((item) => item.id === messageId);
  if (!message) return;

  clearAttachment();
  state.replyToMessageId = null;
  state.editingMessageId = messageId;
  elements.messageInput.value = message.text || "";
  renderReplyPreview();
  updateComposerAction();
  autoResizeMessageInput();
  elements.messageInput.focus();
  elements.messageInput.setSelectionRange(elements.messageInput.value.length, elements.messageInput.value.length);
}

async function submitMessageEdit(text) {
  const messageId = state.editingMessageId;
  if (!messageId) return false;

  const { message: updated } = await api(`/api/messages/${messageId}`, {
    method: "PATCH",
    body: {
      token: state.session.token,
      text,
    },
  });

  state.editingMessageId = null;
  elements.messageInput.value = "";
  upsertMessage(updated);
  renderMessages({ preserveScroll: true });
  renderReplyPreview();
  toast("Message updated.");
  return true;
}

function openDeleteMessageSheet(messageId) {
  state.deleteMessageId = messageId;
  elements.deleteMessageSheet?.classList.remove("hidden");
}

function closeDeleteMessageSheet() {
  state.deleteMessageId = null;
  elements.deleteMessageSheet?.classList.add("hidden");
}

async function handleDeleteMessageSheetClick(event) {
  if (event.target === elements.deleteMessageSheet) {
    closeDeleteMessageSheet();
    return;
  }

  const button = event.target.closest("[data-delete-scope]");
  if (!button || !state.deleteMessageId) return;

  try {
    await deleteMessage(state.deleteMessageId, button.dataset.deleteScope || "everyone");
    closeDeleteMessageSheet();
  } catch (error) {
    handleApiError(error);
  }
}

async function deleteMessage(messageId, scope = "everyone") {
  const { message } = await api(`/api/messages/${messageId}`, {
    method: "DELETE",
    body: { token: state.session.token, scope },
  });

  if (scope === "me" || message?.deletedAt) {
    upsertMessage(message);
  } else {
    removeMessage(messageId);
  }

  renderMessages({ preserveScroll: true });
  scheduleRoomSummaryRender();
  toast(scope === "me" ? "Message deleted for you." : "Message deleted for everyone.");
}

async function logout() {
  const token = state.session?.token;
  state.session = null;
  state.admin = {
    users: [],
    reports: [],
    deletedUsers: [],
    auditLogs: [],
    rooms: [],
    messages: [],
    announcements: [],
    settings: {},
  };
  localStorage.removeItem(SESSION_KEY);

  if (socket) {
    socket.disconnect();
    socket = null;
    joinedRoomId = null;
  }

  navigateTo(LOGIN_ROUTE, { replace: true, render: false });
  render();

  if (token) {
    try {
      await api("/api/auth/logout", {
        method: "POST",
        body: { token },
      });
      await refreshState();
    } catch (error) {
      console.warn(error);
    }
  }
}

async function refreshState() {
  const path = state.session?.token
    ? `/api/state?token=${encodeURIComponent(state.session.token)}`
    : "/api/state";
  const data = await api(path);
  applyState(data);
  applyRoomFromUrl();
  if (state.session?.token && !isGuestSession() && !isAdmin()) {
    await loadBlockedUsers({ silent: true });
  }
}

async function refreshAdminState() {
  if (!isAdmin()) return;

  const [data, messagesData] = await Promise.all([
    api("/api/admin/state", {
      method: "POST",
      body: { token: state.session.token },
    }),
    api("/api/admin/messages", {
      method: "GET",
      headers: { Authorization: `Bearer ${state.session.token}` },
    }).catch(() => ({ messages: [] })),
  ]);

  state.admin = {
    users: (data.users || []).map((user) => ({
      ...user,
      id: String(user._id || user.id),
    })),
    reports: (data.reports || []).map((report) => ({
      ...report,
      id: String(report._id || report.id),
    })),
    deletedUsers: (data.deletedUsers || []).map((user) => ({
      ...user,
      id: String(user._id || user.id),
    })),
    auditLogs: data.auditLogs || [],
    rooms: (data.rooms || []).map(normalizeRoom),
    messages: dedupeNormalizedMessages(messagesData.messages || data.messages || []),
    announcements: (data.announcements || []).map(normalizeAnnouncement),
    settings: data.settings || {},
  };

  if (data.stats) state.stats = { ...state.stats, ...data.stats };
}

function applyState(data, options = {}) {
  const previousActiveRoomId = String(state.activeRoomId || "");
  if (Array.isArray(data.rooms)) {
    state.rooms = data.rooms.map(normalizeRoom);
  }

  if (Array.isArray(data.messages)) {
    const incomingMessages = normalizeMessageList(data.messages);
    state.messages = options.mergeMessages
      ? normalizeMessageList([...state.messages, ...incomingMessages])
      : incomingMessages;
  }

  if (Array.isArray(data.reports)) state.reports = data.reports;
  if (Array.isArray(data.announcements)) state.announcements = data.announcements.map(normalizeAnnouncement);
  if (Array.isArray(data.typing)) state.typing = data.typing;
  if (data.presence) state.presence = { ...(state.presence || {}), ...data.presence };
  state.stats = data.stats ? { ...state.stats, ...data.stats } : state.stats;

  const activeRoomStillExists = state.rooms.some((room) =>
    room.id === previousActiveRoomId ||
    room.slug === previousActiveRoomId ||
    String(room._id || "") === previousActiveRoomId
  );

  if (!activeRoomStillExists) {
    state.activeRoomId = state.rooms[0]?.id || "general";
  }
  const activeRoom = state.rooms.find((room) => room.id === state.activeRoomId);
  if (!options.preserveActiveRoom && activeRoom && !canEnterRoom(activeRoom)) {
    state.activeRoomId = state.rooms.find((room) => canEnterRoom(room))?.id || state.rooms[0]?.id || "general";
  }
  localStorage.setItem(ROOM_KEY, state.activeRoomId);

  if (previousActiveRoomId && String(state.activeRoomId || "") !== previousActiveRoomId) {
    resetMessageSearch({ render: false });
  }
}

function applyRoomFromUrl() {
  const roomParam = new URLSearchParams(window.location.search).get("room");
  if (!roomParam) return;
  const room = state.rooms.find((item) =>
    String(item.id) === String(roomParam) ||
    String(item.slug) === String(roomParam) ||
    String(item._id) === String(roomParam)
  );
  if (!room || !canEnterRoom(room)) return;
  state.activeRoomId = room.id;
  localStorage.setItem(ROOM_KEY, room.id);
}

function normalizeAnnouncement(announcement = {}) {
  const id = String(announcement.id || announcement._id || announcement.announcementId || announcement.createdAt || Date.now());
  return {
    ...announcement,
    id,
    status: announcement.status || "published",
    createdAt: Number(announcement.createdAt || Date.now()),
  };
}

function upsertAnnouncement(announcement) {
  if (!announcement) return null;
  const normalized = normalizeAnnouncement(announcement);
  const mergeInto = (list = []) => [
    normalized,
    ...list.filter((item) => String(item.id || item._id) !== String(normalized.id)),
  ];

  state.announcements = mergeInto(state.announcements);
  state.admin.announcements = mergeInto(state.admin.announcements);
  return normalized;
}

function removeAnnouncement(announcementId) {
  const id = String(announcementId || "");
  state.announcements = (state.announcements || []).filter((item) => String(item.id || item._id) !== id);
  state.admin.announcements = (state.admin.announcements || []).filter((item) => String(item.id || item._id) !== id);
  if (String(state.adminAnnouncementEditingId) === id) {
    state.adminAnnouncementEditingId = null;
  }
}

function normalizeRoom(room = {}) {
  const key = roomKey(room);
  const fallback = ROOM_DISPLAY_FALLBACKS[key] || {};
  const icon = fallback.icon || (room.icon && room.icon !== "#" ? room.icon : "");
  const desc = fallback.desc || room.desc || room.description || "";
  const color = fallback.color || room.color || "#6c63ff";

  return {
    id: String(room.slug || room.id || fallback.id || room._id || ""),
    _id: room._id,
    slug: room.slug || room.id || fallback.slug || "",
    name: fallback.name || room.name || "Room",
    desc,
    description: room.description || desc,
    icon: icon || fallback.icon || "💬",
    color,
    category: fallback.category || room.category || "Public Room",
    activeMembers: Number(room.onlineMembers ?? room.activeMembers ?? 0),
    onlineMembers: Number(room.onlineMembers ?? room.activeMembers ?? 0),
    messageCount: Number(room.messageCount || 0),
    status: room.status || "active",
    visibility: room.visibility || "public",
    isPasswordProtected: Boolean(room.isPasswordProtected || room.passwordProtected || room.hasPassword || room.password),
    passwordProtected: Boolean(room.isPasswordProtected || room.passwordProtected || room.hasPassword || room.password),
    hasPassword: Boolean(room.isPasswordProtected || room.passwordProtected || room.hasPassword || room.password),
    canAccess: Boolean(room.canAccess) || String(room.createdById || room.createdByPublicId || "") === String(state.session?.user?.id || ""),
    createdById: room.createdById || room.createdByPublicId || "",
    maxCapacity: Number(room.maxCapacity || 250),
    isSeeded: Boolean(room.isSeeded),
  };
}

function roomKey(room = {}) {
  const source = String(room.slug || room.id || room.name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (source === "lost-found") return "lost-and-found";
  if (source === "general-chat") return "general";
  return source;
}

function normalizeMessage(message = {}) {
  const id = String(message.id || message._id || message.messageId || message.clientTempId || message.createdAt || Date.now());
  const createdAt = typeof message.createdAt === "number"
    ? message.createdAt
    : new Date(message.createdAt || Date.now()).getTime();

  return {
    id,
    _id: message._id,
    roomId: String(message.roomId || ""),
    authorId: String(message.authorId || ""),
    author: message.author || "Anonymous User",
    username: message.username || "",
    about: message.about || "",
    customStatus: message.customStatus || "",
    department: message.department || "",
    campus: message.campus || "",
    joinedAt: message.joinedAt || message.createdAt || "",
    avatarColor: message.avatarColor || "#6c63ff",
    avatarDataUrl: message.avatarDataUrl || "",
    text: message.text || "",
    type: message.type || "text",
    attachment: message.attachment || null,
    replyTo: message.replyTo || null,
    poll: message.poll || null,
    reactions: Number(message.reactions || 0),
    reactedBy: Array.isArray(message.reactedBy) ? message.reactedBy.map(String) : [],
    reactionSummary: message.reactionSummary || {},
    reactionsByUser: message.reactionsByUser || {},
    userReaction: message.userReaction || message.reactionsByUser?.[state.session?.user?.id] || "",
    delivery: normalizeDelivery(message.delivery || {}),
    hidden: Boolean(message.hidden),
    deletedFor: Array.isArray(message.deletedFor) ? message.deletedFor.map(String) : [],
    deletedAt: message.deletedAt || null,
    editedAt: message.editedAt || null,
    reported: Boolean(message.reported),
    moderationReasons: Array.isArray(message.moderationReasons) ? message.moderationReasons : [],
    createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
    localStatus: message.localStatus,
    submitKey: message.submitKey || "",
    clientTempId: String(message.clientTempId || ""),
  };
}

function normalizeMessageList(messages = []) {
  return dedupeNormalizedMessages(messages).sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
}

function dedupeNormalizedMessages(messages = []) {
  return dedupeMessages(messages.map(normalizeMessage));
}

function upsertMessage(message) {
  if (!message) return;
  const normalizedMessage = normalizeMessage(message);
  if (!normalizedMessage.id) return;

  const existingIndex = findExistingMessageIndex(normalizedMessage);

  if (existingIndex > -1) {
    const existingMessage = state.messages[existingIndex];
    state.messages[existingIndex] = mergeDuplicateMessages(existingMessage, normalizedMessage);
    state.messages = dedupeMessages(state.messages);
    state.messages.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
    return;
  }

  state.messages.push(normalizedMessage);
  state.messages = dedupeMessages(state.messages);
  state.messages.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
}

function findExistingMessageIndex(incoming) {
  const incomingIds = messageIdentityValues(incoming);
  const exactIndex = state.messages.findIndex((item) => setsIntersect(messageIdentityValues(item), incomingIds));

  if (exactIndex > -1) return exactIndex;

  return state.messages.findIndex((item) => messagesLookLikeSameSend(item, incoming));
}

function dedupeMessages(messages) {
  return messages.reduce((next, message) => {
    const normalizedMessage = normalizeMessage(message);
    const incomingIds = messageIdentityValues(normalizedMessage);
    const existingIndex = next.findIndex((item) => setsIntersect(messageIdentityValues(item), incomingIds));
    const fallbackIndex = existingIndex > -1
      ? existingIndex
      : next.findIndex((item) => messagesLookLikeSameSend(item, normalizedMessage));

    if (fallbackIndex > -1) {
      next[fallbackIndex] = mergeDuplicateMessages(next[fallbackIndex], normalizedMessage);
    } else {
      next.push(normalizedMessage);
    }

    return next;
  }, []);
}

function setsIntersect(first, second) {
  for (const value of first) {
    if (second.has(value)) return true;
  }
  return false;
}

function mergeDuplicateMessages(existingMessage, incomingMessage) {
  const preferred = messageHasServerId(incomingMessage) ? incomingMessage : existingMessage;
  const secondary = preferred === incomingMessage ? existingMessage : incomingMessage;

  return {
    ...secondary,
    ...preferred,
    id: messageHasServerId(preferred) ? preferred.id : secondary.id,
    _id: preferred._id || secondary._id,
    clientTempId: preferred.clientTempId || secondary.clientTempId || "",
    submitKey: preferred.submitKey || secondary.submitKey || "",
    delivery: {
      ...normalizeDelivery(secondary.delivery),
      ...normalizeDelivery(preferred.delivery),
    },
  };
}

function messageIdentityValues(message = {}) {
  return new Set([
    message.id,
    message._id,
    message.clientTempId,
  ].map((value) => String(value || "")).filter(Boolean));
}

function messageHasServerId(message = {}) {
  const id = String(message.id || "");
  return Boolean(id && !id.startsWith("pending_") && !id.startsWith("ct_"));
}

function messagesLookLikeSameSend(first = {}, second = {}) {
  if (first.clientTempId && second.clientTempId && first.clientTempId !== second.clientTempId) return false;
  if (String(first.roomId || "") !== String(second.roomId || "")) return false;
  if (String(first.authorId || "") !== String(second.authorId || "")) return false;
  if (String(first.text || "") !== String(second.text || "")) return false;
  if (String(first.replyTo?.id || first.replyTo?.messageId || "") !== String(second.replyTo?.id || second.replyTo?.messageId || "")) return false;
  if (attachmentFingerprint(first.attachment) !== attachmentFingerprint(second.attachment)) return false;

  const delta = Math.abs(Number(first.createdAt || 0) - Number(second.createdAt || 0));
  const hasPendingSide = [first, second].some((message) =>
    message.localStatus === "pending" ||
    message.localStatus === "failed" ||
    String(message.id || "").startsWith("pending_") ||
    String(message.id || "").startsWith("ct_") ||
    Boolean(message.clientTempId)
  );

  if (!hasPendingSide && messageHasServerId(first) && messageHasServerId(second)) return false;

  return delta <= (hasPendingSide ? 10000 : 1500);
}

function attachmentFingerprint(attachment) {
  if (!attachment) return "";
  return [
    attachment.kind || "",
    attachment.name || "",
    attachment.size || "",
    attachment.url || attachment.dataUrl || "",
  ].join("|");
}

function removeMessage(messageId) {
  const id = String(messageId || "");
  state.messages = state.messages.filter((message) => !messageIdentityValues(message).has(id));
  if (state.replyToMessageId === messageId) {
    state.replyToMessageId = null;
  }
}

function normalizeDelivery(delivery = {}) {
  const arrayFrom = (value) => Array.isArray(value)
    ? value.map(String)
    : value
      ? [String(value)]
      : [];

  return {
    sentAt: delivery.sentAt || null,
    deliveredTo: arrayFrom(delivery.deliveredTo),
    seenBy: arrayFrom(delivery.seenBy),
  };
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

function showConnectionToast(message, { force = false } = {}) {
  if (!message) return;
  const now = Date.now();
  if (!force && now - lastConnectionToastAt < CONNECTION_TOAST_COOLDOWN_MS) return;
  lastConnectionToastAt = now;
  toast(message);
}

function updateConnectionStatusUi() {
  const statusEl = elements.connectionStatus || document.querySelector("#connectionStatus");
  if (!statusEl) return;

  const labels = {
    online: "Online",
    reconnecting: "Reconnecting...",
    offline: "Offline",
  };
  const label = labels[connectionStatus] || labels.offline;
  statusEl.dataset.status = connectionStatus;
  statusEl.classList.toggle("online", connectionStatus === "online");
  statusEl.classList.toggle("reconnecting", connectionStatus === "reconnecting");
  statusEl.classList.toggle("offline", connectionStatus === "offline");
  statusEl.title = `Realtime status: ${label}`;
  const labelEl = statusEl.querySelector("[data-connection-label]");
  if (labelEl) labelEl.textContent = label;
  else statusEl.textContent = label;
}

function setConnectionStatus(status, options = {}) {
  if (!["online", "reconnecting", "offline"].includes(status)) return;
  const previous = connectionStatus;
  connectionStatus = status;
  updateConnectionStatusUi();

  if (options.toastMessage && (previous !== status || options.forceToast)) {
    showConnectionToast(options.toastMessage, { force: options.forceToast });
  }
}

function debugSocketWarning(...args) {
  if (localStorage.getItem("anonchat-debug") === "1") {
    console.warn(...args);
  }
}

function connectLiveUpdates() {
  if (typeof io === "undefined") {
    loadSocketClient()
      .then(() => {
        if (typeof io !== "undefined") connectLiveUpdates();
      })
      .catch((error) => {
        setConnectionStatus("offline", { toastMessage: "Realtime chat is unavailable." });
        debugSocketWarning("Socket.io client not loaded:", error?.message || error);
      });
    return;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.io?.removeAllListeners?.();
    socket.disconnect();
    joinedRoomId = null;
    joiningRoomId = null;
  }

  socket = io(API_BASE, {
    auth: {
      token: state.session?.token || "",
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4000,
    randomizationFactor: 0.4,
    timeout: 10000,
    transports: ["websocket", "polling"],
  });
  setConnectionStatus("reconnecting");

  socket.io?.on("reconnect_attempt", () => {
    setConnectionStatus("reconnecting", { toastMessage: "Reconnecting to AnonChat..." });
  });

  socket.io?.on("reconnect", () => {
    setConnectionStatus("online", { toastMessage: "Back online.", forceToast: true });
  });

  socket.io?.on("reconnect_error", (error) => {
    setConnectionStatus("reconnecting");
    debugSocketWarning("Socket reconnect waiting:", error?.message || error);
  });

  socket.on("state", (data) => {
    const stableChatRoom = Boolean(state.session && state.route === CHAT_ROUTE && !isAdmin());
    applyState(data, { mergeMessages: true, preserveActiveRoom: stableChatRoom });
    if (isAdmin()) {
      refreshAdminState().then(render).catch(console.warn);
    } else if (stableChatRoom) {
      renderRooms();
      renderMessages({ preserveScroll: true });
      renderTypingIndicator();
      scheduleRoomSummaryRender();
      renderNotifications();
      loadRecentMessagesForRoom(state.activeRoomId, { renderAfter: true }).catch(debugSocketWarning);
    } else {
      render();
    }
    joinActiveRoom();
  });

  socket.on("message:new", (message) => {
    if (isBlockedUserId(message.authorId)) return;
    message.id = String(message.id || message._id || "");
    if (!message.id) return;

    const existedBefore = findExistingMessageIndex(normalizeMessage(message)) > -1;

    upsertMessage(message);

    markMessageDeliveredAndSeen(message);

    if (!existedBefore && message.roomId !== state.activeRoomId && message.authorId !== state.session?.user?.id) {
      state.notifications.unshift({
        id: message.id,
        type: "invite",
        roomId: message.roomId,
        title: "Room invite",
        text: message.text || "New attachment",
        createdAt: message.createdAt || Date.now(),
      });
      toast(`New message in ${roomName(message.roomId)}`);
    }
    if (!existedBefore && String(message.authorId) !== String(state.session?.user?.id)) {
      notifyIncomingMessage(message);
    }
    renderMessages({ preserveScroll: true });
    scheduleRoomSummaryRender();
  });

  socket.on("rooms:update", ({ rooms, room, stats }) => {
    if (rooms) {
      state.rooms = rooms.map(normalizeRoom);
    } else if (room) {
      const normalizedRoom = normalizeRoom(room);
      state.rooms = [
        ...state.rooms.filter((item) => item.id !== normalizedRoom.id),
        normalizedRoom,
      ].filter((item) => item.status !== "deleted");
    }
    state.stats = stats ? { ...state.stats, ...stats } : state.stats;
    scheduleRoomSummaryRender();
  });

  socket.on("message:update", (message) => {
    if (isBlockedUserId(message.authorId)) {
      removeMessage(message.id || message._id);
      renderMessages({ preserveScroll: true });
      return;
    }
    upsertMessage(message);
    renderMessages({ preserveScroll: true });
  });

  socket.on("message:delete", ({ messageId }) => {
    removeMessage(messageId);
    renderMessages({ preserveScroll: true });
    scheduleRoomSummaryRender();
  });

  socket.on("reaction:update", (message) => {
    if (isBlockedUserId(message.authorId)) return;
    upsertMessage(message);
    renderMessages({ preserveScroll: true });
  });

  socket.on("message:delivery", (message) => {
    upsertMessage(message);
    renderMessages({ preserveScroll: true });
  });

  socket.on("message:seen", ({ roomId, userId }) => {
    state.messages = state.messages.map((message) => {
      if (String(message.roomId) !== String(roomId) || String(message.authorId) === String(userId)) return message;
      const delivery = normalizeDelivery(message.delivery);
      return {
        ...message,
        delivery: {
          ...delivery,
          deliveredTo: uniqueList([...delivery.deliveredTo, userId]),
          seenBy: uniqueList([...delivery.seenBy, userId]),
        },
      };
    });
    renderMessages({ preserveScroll: true });
  });

  socket.on("typing:start", (typingUser) => {
    if (String(typingUser.userId) === String(state.session?.user?.id)) return;
    state.typing = [
      ...state.typing.filter((item) => item.userId !== typingUser.userId),
      typingUser,
    ];
    renderTypingIndicator();
    window.setTimeout(renderTypingIndicator, 3600);
  });

  socket.on("typing:stop", (typingUser) => {
    state.typing = state.typing.filter((item) => item.userId !== typingUser.userId);
    renderTypingIndicator();
  });

  socket.on("presence:update", ({ presence = {} } = {}) => {
    state.presence = { ...(state.presence || {}), ...presence };
    schedulePresenceRender();
  });

  socket.on("connect_error", (error) => {
    setConnectionStatus("reconnecting", { toastMessage: "Reconnecting to AnonChat..." });
    debugSocketWarning("Live connection paused:", error?.message || error);
  });

  socket.on("server-error", (payload) => {
    debugSocketWarning(payload?.error || "Live server error.");
  });

  socket.on("connect", () => {
    const hadConnectedBefore = socketHasConnectedOnce;
    socketHasConnectedOnce = true;
    setConnectionStatus("online", {
      toastMessage: hadConnectedBefore ? "Connected to AnonChat." : "",
      forceToast: hadConnectedBefore,
    });
    joinedRoomId = null;
    joiningRoomId = null;
    joinActiveRoom();
  });

  socket.on("disconnect", (reason) => {
    console.warn("Socket disconnected", reason);
    joinedRoomId = null;
    joiningRoomId = null;
    const canReconnect = socket?.active !== false && reason !== "io client disconnect";
    setConnectionStatus(canReconnect ? "reconnecting" : "offline", {
      toastMessage: canReconnect ? "Connection interrupted. Reconnecting..." : "You are offline.",
    });
    debugSocketWarning("Socket disconnected:", reason);
    if (callState.active && reason === "io server disconnect") {
      handleRemoteCallEnded({ reason: "disconnect" });
    } else if (callState.active && canReconnect && callState.status === "active") {
      callState.status = "reconnecting";
      updateCallUi();
    }
    window.setTimeout(() => {
      if (socket && !socket.connected && canReconnect) {
        socket.connect();
      }
    }, 2000);
  });

  socket.on("call:incoming", handleIncomingCall);
  socket.on("call:ringing", handleCallRinging);
  socket.on("call:answer", handleCallAnswer);
  socket.on("call:ice-candidate", handleRemoteIceCandidate);
  socket.on("call:reject", handleCallRejected);
  socket.on("call:end", handleRemoteCallEnded);
  socket.on("call:busy", handleCallBusy);
  socket.on("call:missed", handleCallMissed);
  socket.on("call:offline", handleCallOffline);
  socket.on("call:error", (payload = {}) => {
    if (callState.active && callState.direction === "outgoing" && ["calling", "ringing"].includes(callState.status)) return;
    toast(payload.error || "Call could not be completed.");
  });

  const handleAnnouncementLiveUpdate = (data, options = {}) => {
    const announcement = upsertAnnouncement(data);
    if (!announcement) return;
    if (options.toast !== false && !isAdmin()) toast(`${announcement.title}: ${announcement.body}`);
    renderNotifications();
    if (state.route === NOTIFICATIONS_ROUTE) renderNotificationsPage();
    if (state.route === ADMIN_ROUTES.announcements) render();
  };

  socket.on("announcement", (data) => handleAnnouncementLiveUpdate(data));
  socket.on("announcement:new", (data) => handleAnnouncementLiveUpdate(data));
  socket.on("announcement:update", (data) => handleAnnouncementLiveUpdate(data, { toast: false }));
  socket.on("announcement:delete", ({ id, announcementId }) => {
    removeAnnouncement(id || announcementId);
    renderNotifications();
    if (state.route === NOTIFICATIONS_ROUTE) renderNotificationsPage();
    if (state.route === ADMIN_ROUTES.announcements) render();
  });

  socket.on("report:new", async () => {
    if (!isAdmin()) return;
    await refreshAdminState().catch(console.warn);
    if (isAdminRoute(state.route)) renderAdminDashboard();
  });

  socket.on("admin:moderation-alert", async (alert = {}) => {
    if (!isAdmin()) return;
    toast(`Moderation alert: ${alert.reason || "Message flagged"}`);
    await refreshAdminState().catch(console.warn);
    if (isAdminRoute(state.route)) renderAdminDashboard();
  });

  socket.on("admin:call-activity", (activity = {}) => {
    if (!isAdmin()) return;
    state.stats = {
      ...state.stats,
      activeCalls: Number(activity.activeCalls || 0),
    };
    if (isAdminRoute(state.route)) renderAdminDashboard();
  });
}

function loadSocketClient() {
  if (typeof io !== "undefined") return Promise.resolve();
  if (socketClientLoadPromise) return socketClientLoadPromise;

  socketClientLoadPromise = new Promise((resolve, reject) => {
    const finish = () => {
      socketClientLoadPromise = null;
      if (typeof io !== "undefined") {
        resolve();
        return;
      }
      reject(new Error("Socket.io client did not initialize."));
    };

    let script = document.querySelector('script[data-socket-client-loader]:not([data-failed="true"])');
    if (!script) {
      script = document.createElement("script");
      script.src = `/socket.io/socket.io.js?v=${Date.now()}`;
      script.async = true;
      script.dataset.socketClientLoader = "true";
      document.head.appendChild(script);
    }

    const timeout = window.setTimeout(() => {
      script.dataset.failed = "true";
      socketClientLoadPromise = null;
      reject(new Error("Socket.io client request timed out."));
    }, 5000);

    script.addEventListener("load", () => {
      window.clearTimeout(timeout);
      finish();
    }, { once: true });

    script.addEventListener("error", () => {
      window.clearTimeout(timeout);
      script.dataset.failed = "true";
      socketClientLoadPromise = null;
      reject(new Error("Socket.io client request failed."));
    }, { once: true });
  });

  return socketClientLoadPromise;
}

function joinActiveRoom() {
  if (!socket?.connected) return;
  if (!state.session?.token) return;
  if (isAdmin()) return;
  if (!state.activeRoomId) return;

  const roomId = String(state.activeRoomId);
  if (String(joinedRoomId || "") === roomId) return;
  if (String(joiningRoomId || "") === roomId) return;
  joiningRoomId = roomId;

  socket.emit("room:join", {
    token: state.session.token,
    roomId,
  }, (response = {}) => {
    if (String(state.activeRoomId) !== roomId) return;
    joiningRoomId = null;

    if (response.ok) {
      if (response.roomId && String(response.roomId) !== String(state.activeRoomId)) {
        state.activeRoomId = String(response.roomId);
        localStorage.setItem(ROOM_KEY, state.activeRoomId);
        resetMessageSearch({ render: false });
      }
      joinedRoomId = String(state.activeRoomId || response.roomId || roomId);
      loadRecentMessagesForRoom(joinedRoomId, { renderAfter: true }).catch(debugSocketWarning);
      return;
    }

    joinedRoomId = null;
    debugSocketWarning(response.error || "Room join was not confirmed.");
    window.setTimeout(joinActiveRoom, 1000);
  });

  window.setTimeout(() => {
    if (joiningRoomId !== roomId) return;
    joiningRoomId = null;
    if (socket?.connected && String(joinedRoomId || "") !== roomId) joinActiveRoom();
  }, 4000);
}

function renderAuthShell() {
  elements.authView.classList.toggle("hidden", isChatRoute(state.route) || isAdminRoute(state.route));
  elements.authView.classList.toggle("auth-route-mode", isAuthRoute(state.route));
  elements.authView.classList.toggle("public-page-route", isPublicRoute(state.route));
  elements.publicPageView?.classList.toggle("hidden", !isPublicRoute(state.route));
  setAuthRouteScroll(isAuthRoute(state.route));
  elements.chatView.classList.add("hidden");
  elements.adminDashboardView?.classList.add("hidden");
  elements.authOnlineCount.textContent = "Connecting...";
}

function render() {
  const loggedIn = Boolean(state.session?.user && state.session?.token);
  const route = resolveRouteForSession(loggedIn);
  const showAdminDashboard = loggedIn && isAdmin() && isAdminRoute(route);
  const showChat = loggedIn && !isAdmin() && isChatRoute(route);
  const showHome = showChat && route === DASHBOARD_ROUTE;
  const showMyRooms = showChat && route === MY_ROOMS_ROUTE;
  const showSettings = showChat && route === SETTINGS_ROUTE;
  const showProfile = showChat && route === PROFILE_ROUTE;
  const showNotificationsPage = showChat && route === NOTIFICATIONS_ROUTE;
  const showContentPage = showHome || showMyRooms || showSettings || showProfile || showNotificationsPage;
  const showLanding = !showChat && !showAdminDashboard;
  const showAuthRoute = showLanding && isAuthRoute(route);
  const showPublicRoute = showLanding && isPublicRoute(route);

  elements.authView.classList.toggle("auth-route-mode", showAuthRoute);
  elements.authView.classList.toggle("public-page-route", showPublicRoute);
  elements.authView.classList.toggle("hidden", !showLanding);
  elements.publicPageView?.classList.toggle("hidden", !showPublicRoute);
  setAuthRouteScroll(showAuthRoute);
  elements.chatView.classList.toggle("hidden", !showChat);
  elements.chatView.classList.toggle("admin-mode", Boolean(loggedIn && isAdmin()));
  elements.chatView.classList.toggle("user-dashboard", Boolean(loggedIn && !isAdmin()));
  elements.chatView.classList.toggle("chat-room-dashboard", Boolean(showChat && route === CHAT_ROUTE));
  elements.chatView.classList.toggle("content-page-route", Boolean(showContentPage));
  elements.chatMain?.classList.toggle("home-mode", Boolean(showContentPage));
  elements.chatMain?.classList.toggle("content-page-mode", Boolean(showContentPage));
  elements.homeView?.classList.toggle("hidden", !showContentPage);
  syncContentPageChrome(showContentPage);
  elements.adminDashboardView?.classList.toggle("hidden", !showAdminDashboard);
  updateInstallButtonState();
  updateMobileAppMenuState();
  updateSidebarMenuActive(showHome);
  elements.authOnlineCount.textContent = `${state.stats.users || 0} registered users`;
  if (showChat) updateComposerAction();

  if (showLanding) {
    if (route === SIGNUP_ROUTE) {
      updateAuthMode("register");
      openAuthPanel();
    } else if (route === ADMIN_LOGIN_ROUTE) {
      updateAuthMode("admin");
      openAuthPanel();
    } else if (route === LOGIN_ROUTE) {
      updateAuthMode("login");
      openAuthPanel();
    } else if (showPublicRoute) {
      closeAuthPanel();
      renderPublicPage(route);
    } else {
      closeAuthPanel();
      clearPublicPage();
    }
  }

  if (showAdminDashboard) {
    renderAdminDashboard();
    if (route === ADMIN_ROUTES.messagesMonitoring) {
      activateMessagesMonitor();
    } else {
      stopMessagesMonitor();
    }
    renderNotifications();
    return;
  }

  stopMessagesMonitor();
  if (!showChat) return;

  const user = state.session.user;
  state.userSettings = loadUserSettings();
  document.body.dataset.chatWallpaper = state.userSettings.wallpaper;
  document.body.dataset.chatFontSize = state.userSettings.fontSize;
  ensureVisibleActiveRoom();
  elements.campusName.textContent = isAdmin() ? "Admin Console" : "Stay in touch with your team!";
  elements.profileName.textContent = isAdmin() ? user.name : anonymousUserLabel(user);
  elements.profileMeta.textContent = isAdmin() ? "site owner" : "Online";
  renderSidebarAvatar(user);

  renderRooms();
  syncContentPageChrome(showContentPage);
  updatePresenceUi();
  if (showHome) renderHomeView();
  if (showMyRooms) renderMyRoomsPage();
  if (showSettings) renderSettingsPage();
  if (showProfile) renderProfilePage();
  if (showNotificationsPage) renderNotificationsPage();
  if (showContentPage) {
    renderNotifications();
    return;
  }
  renderMessages();
  renderTypingIndicator();
  renderPanels();
  renderNotifications();
  joinActiveRoom();
}

function setRouteHidden(element, hidden) {
  if (!element) return;
  element.hidden = Boolean(hidden);
  element.classList.toggle("route-hidden", Boolean(hidden));
  if (hidden) {
    element.setAttribute("aria-hidden", "true");
  } else {
    element.removeAttribute("aria-hidden");
  }
}

function syncContentPageChrome(showContentPage) {
  const hidden = Boolean(showContentPage);
  setRouteHidden(elements.sidebarChannelTitle, hidden);
  setRouteHidden(elements.roomList, hidden);
  elements.sidebarMenu?.querySelectorAll('[data-menu-action="create-private"]').forEach((button) => {
    setRouteHidden(button, hidden);
  });

  [
    elements.chatTopbar,
    elements.guidelineNotice,
    elements.chatFeed,
    elements.typingIndicator,
    elements.replyPreview,
    elements.attachmentPreview,
    elements.messageForm,
    elements.detailsPanel,
  ].forEach((element) => setRouteHidden(element, hidden));
}

function themeChoices() {
  return ["dark", "light", "system"];
}

function clearPublicPage() {
  if (!elements.publicPageView) return;
  elements.publicPageView.innerHTML = "";
  elements.publicPageView.classList.add("hidden");
}

function renderPublicPage(route) {
  if (!elements.publicPageView) return;
  const email = "supportanonchat@gmail.com";
  const mailLink = `<a href="mailto:${email}">${email}</a>`;

  if (route === DATA_DELETION_ROUTE) {
    elements.publicPageView.innerHTML = `
      <section class="public-policy-shell">
        <div class="public-policy-card">
          <p class="public-policy-eyebrow">Account control</p>
          <h1>User Data Deletion</h1>
          <p class="public-policy-lead">
            If you would like your account and associated data removed from AnonChat, please send a request to:
          </p>
          <p class="public-contact-line">${mailLink}</p>
          <div class="public-policy-section">
            <h2>Email subject</h2>
            <p><strong>Data Deletion Request</strong></p>
          </div>
          <div class="public-policy-section">
            <h2>Include</h2>
            <ul>
              <li>Registered Email Address</li>
              <li>Username</li>
            </ul>
          </div>
          <p class="public-policy-note">We will process deletion requests within 30 days.</p>
        </div>
      </section>
    `;
    return;
  }

  elements.publicPageView.innerHTML = `
    <section class="public-policy-shell">
      <div class="public-policy-card">
        <p class="public-policy-eyebrow">Legal</p>
        <h1>AnonChat Privacy Policy</h1>
        <p class="public-policy-lead">
          This policy explains what AnonChat collects and how we use it to keep the service secure, private, and reliable.
        </p>
        <div class="public-policy-grid">
          <article class="public-policy-section">
            <h2>Information collected</h2>
            <p>We collect account details such as full name, username, and email address when you register.</p>
          </article>
          <article class="public-policy-section">
            <h2>Google and Facebook authentication</h2>
            <p>When you use Google or Facebook login, we receive basic authentication information needed to create or access your AnonChat account.</p>
          </article>
          <article class="public-policy-section">
            <h2>Cookies and sessions</h2>
            <p>AnonChat uses cookies and session tokens to keep users signed in and protect authenticated routes.</p>
          </article>
          <article class="public-policy-section">
            <h2>User-generated chat content</h2>
            <p>Messages, attachments, reports, and room activity may be stored so chat, moderation, and safety features work correctly.</p>
          </article>
          <article class="public-policy-section">
            <h2>Security practices</h2>
            <p>We use password hashing, session protection, moderation tools, access controls, and security-focused server practices.</p>
          </article>
          <article class="public-policy-section">
            <h2>Contact</h2>
            <p>For privacy questions, contact ${mailLink}.</p>
          </article>
        </div>
      </div>
    </section>
  `;
}

function normalizeThemeChoice(choice) {
  return themeChoices().includes(choice) ? choice : "dark";
}

function resolveTheme(choice = "dark") {
  const normalized = normalizeThemeChoice(choice);
  if (normalized !== "system") return normalized;
  return window.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "light" : "dark";
}

function loadInitialThemeChoice() {
  return normalizeThemeChoice(localStorage.getItem(THEME_KEY) || document.documentElement.dataset.themeChoice || "dark");
}

function initThemeSystem() {
  const media = window.matchMedia?.("(prefers-color-scheme: light)");
  media?.addEventListener?.("change", () => {
    if (document.documentElement.dataset.themeChoice === "system") {
      applyThemeChoice("system", { persist: false });
    }
  });
  syncThemeControls();
}

function activateThemeControl(control) {
  if (!control || control.dataset.themeBound === "true") return;
  control.dataset.themeBound = "true";
  control.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (control.dataset.themeChoice) {
      setThemePreference(control.dataset.themeChoice, { syncServer: true });
      return;
    }
    const current = resolveTheme(document.documentElement.dataset.themeChoice || "dark");
    setThemePreference(current === "light" ? "dark" : "light", { syncServer: true });
  });
}

function applyThemeChoice(choice = "dark", options = {}) {
  const normalized = normalizeThemeChoice(choice);
  const resolved = resolveTheme(normalized);
  const root = document.documentElement;
  const body = document.body;

  if (options.transition !== false) {
    root.classList.add("theme-transitioning");
    window.clearTimeout(applyThemeChoice.transitionTimer);
    applyThemeChoice.transitionTimer = window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 260);
  }

  root.dataset.themeChoice = normalized;
  root.dataset.theme = resolved;
  root.classList.remove("theme-dark", "theme-light", "theme-choice-dark", "theme-choice-light", "theme-choice-system");
  root.classList.add(`theme-${resolved}`, `theme-choice-${normalized}`);
  root.style.colorScheme = resolved;
  if (body) {
    body.dataset.themeChoice = normalized;
    body.dataset.theme = resolved;
    body.classList.remove("theme-dark", "theme-light", "theme-choice-dark", "theme-choice-light", "theme-choice-system");
    body.classList.add(`theme-${resolved}`, `theme-choice-${normalized}`);
  }
  localStorage.setItem(THEME_KEY, normalized);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolved === "light" ? "#f6f8ff" : "#0a0b14");

  if (state.userSettings) state.userSettings.theme = normalized;
  if (options.persist !== false && state.session?.user) state.session.user.themePreference = normalized;
  if (options.persist !== false) {
    localStorage.setItem(userSettingsStorageKey(), JSON.stringify({ ...loadUserSettings(), theme: normalized }));
  }

  syncThemeControls();
}

function syncThemeControls() {
  const choice = normalizeThemeChoice(document.documentElement.dataset.themeChoice || "dark");
  const resolved = resolveTheme(choice);
  const icon = resolved === "light" ? "\u2600\uFE0F" : "\u{1F319}";
  const label = choice === "system" ? "Auto" : capitalizeLabel(resolved);

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    activateThemeControl(button);
    button.dataset.themeState = resolved;
    button.setAttribute("aria-label", `Switch to ${resolved === "light" ? "dark" : "light"} mode`);
    const thumb = button.querySelector(".theme-toggle-thumb");
    const labelEl = button.querySelector(".theme-toggle-label");
    if (thumb) thumb.textContent = icon;
    if (labelEl) labelEl.textContent = label;
  });

  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    activateThemeControl(button);
    button.classList.toggle("active", button.dataset.themeChoice === choice);
    button.setAttribute("aria-pressed", button.dataset.themeChoice === choice ? "true" : "false");
  });
}

function handleThemeDocumentClick(event) {
  const choiceButton = event.target.closest("[data-theme-choice]");
  if (choiceButton) {
    setThemePreference(choiceButton.dataset.themeChoice, { syncServer: true });
    return;
  }

  const toggle = event.target.closest("[data-theme-toggle]");
  if (!toggle) return;
  const current = resolveTheme(document.documentElement.dataset.themeChoice || "dark");
  setThemePreference(current === "light" ? "dark" : "light", { syncServer: true });
}

function setThemePreference(choice, options = {}) {
  const normalized = normalizeThemeChoice(choice);
  const nextSettings = { ...loadUserSettings(), theme: normalized };
  saveUserSettings(nextSettings);
  applyThemeChoice(normalized);
  if (state.session?.user) saveSession(state.session);
  if (options.syncServer !== false) scheduleThemePreferenceSync(normalized);
  if (state.route === SETTINGS_ROUTE) syncThemeControls();
}

function scheduleThemePreferenceSync(choice) {
  if (!state.session?.token || isGuestSession()) return;

  window.clearTimeout(themePreferenceTimer);

  themePreferenceTimer = window.setTimeout(() => {
    persistThemePreference(choice).catch((error) =>
      console.warn("Theme preference sync failed:", error.message)
    );
  }, 500);
}

async function persistThemePreference(choice) {
  const user = state.session?.user;
  if (!user?.id) return;
  const { user: updatedUser } = await api("/api/users/profile", {
    method: "PATCH",
    body: {
      token: state.session.token,
      profile: {
        fullName: user.fullName || "",
        anonymousName: user.name || "",
        about: user.about || "",
        customStatus: user.customStatus || "",
        gender: user.gender || "",
        department: user.department || "",
        studyYear: user.studyYear || "",
        contactNumber: user.contactNumber || "",
        avatarDataUrl: user.avatarDataUrl || "",
        privacySettings: user.privacySettings || {},
        themePreference: normalizeThemeChoice(choice),
      },
    },
  });
  state.session.user = { ...state.session.user, ...updatedUser };
  saveSession(state.session);
}

function renderRooms() {
  renderChatRoomSummary();
  renderSidebarRooms();
  renderSidebarDirectMessages();
}

function renderSidebarRooms() {
  if (!elements.roomList || isAdmin()) return;
  const query = String(elements.roomSearch?.value || "").trim().toLowerCase();
  const rooms = getVisibleRooms().filter((room) => {
    if (!query) return true;
    const haystack = `${room.name || ""} ${room.desc || ""} ${room.description || ""} ${room.category || ""}`.toLowerCase();
    return haystack.includes(query);
  });

  if (!rooms.length) {
    elements.roomList.innerHTML = `<div class="sidebar-empty-row">No channels found</div>`;
    return;
  }

  elements.roomList.innerHTML = rooms.map((room) => {
    const active = [room.id, room.slug, room._id].map(String).includes(String(state.activeRoomId));
    const unread = unreadCount(room.id);
    const onlineCount = room.onlineMembers ?? room.activeMembers ?? 0;
    return `
      <button
        class="room-button slack-channel-row ${active ? "active" : ""}"
        type="button"
        data-room-id="${escapeAttr(room.id)}"
        aria-current="${active ? "true" : "false"}">
        <span class="room-icon" aria-hidden="true">#</span>
        <span class="room-copy">
          <span class="room-title">${escapeHtml(room.name || "Room")}</span>
          <span class="room-desc">${escapeHtml(numberText(onlineCount))} online</span>
        </span>
        ${unread ? `<span class="room-count unread">${numberText(unread)}</span>` : `<span class="room-count">${numberText(room.messageCount || 0)}</span>`}
      </button>
    `;
  }).join("");
}

function renderSidebarDirectMessages() {
  if (!elements.sidebarDmList || isAdmin()) return;
  elements.sidebarDmList.innerHTML = "";
  elements.sidebarDmList.hidden = true;
  elements.sidebarDmList.setAttribute("aria-hidden", "true");
  elements.sidebarDmList.classList.add("hidden");
  const title = elements.sidebarDmList.previousElementSibling;
  if (title?.classList.contains("sidebar-dm-title")) {
    title.hidden = true;
    title.setAttribute("aria-hidden", "true");
    title.classList.add("hidden");
  }
  return;

  const activeRoom = getActiveRoom();
  const currentUserId = state.session?.user?.id;
  const query = String(elements.roomSearch?.value || "").trim().toLowerCase();
  const recentByAuthor = new Map();

  [...state.messages]
    .filter((message) => String(message.roomId) === String(activeRoom.id))
    .filter((message) => String(message.authorId || "") !== String(currentUserId || ""))
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    .forEach((message) => {
      const authorId = String(message.authorId || message.author || "");
      if (!authorId || recentByAuthor.has(authorId)) return;
      recentByAuthor.set(authorId, {
        id: authorId,
        name: message.author || "Anonymous User",
        color: message.avatarColor,
        avatarDataUrl: message.avatarDataUrl,
        preview: message.deletedAt ? "Deleted message" : (message.text || "Shared an attachment"),
        createdAt: message.createdAt,
      });
    });

  const people = [...recentByAuthor.values()]
    .filter((person) => {
      if (!query) return true;
      return `${person.name || ""} ${person.preview || ""}`.toLowerCase().includes(query);
    })
    .slice(0, 6);

  if (!people.length) {
    const activeCount = Number(activeRoom.onlineMembers || activeRoom.activeMembers || 0);
    elements.sidebarDmList.innerHTML = `
      <div class="slack-dm-empty">
        <span class="avatar">${escapeHtml(initials(activeRoom.name || "AU"))}</span>
        <div>
          <strong>${escapeHtml(numberText(activeCount))} online</strong>
          <small>No recent DMs in this room</small>
        </div>
      </div>
    `;
    return;
  }

  elements.sidebarDmList.innerHTML = people.map((person) => `
    <button class="slack-dm-row" type="button" data-profile-author-id="${escapeAttr(person.id)}" data-author-id="${escapeAttr(person.id)}" data-author="${escapeAttr(person.name)}">
      ${renderAvatar(person.name, person.color, person.avatarDataUrl)}
      <span class="dm-copy">
        <strong>${escapeHtml(person.name)}</strong>
        <small>${escapeHtml(truncateText(person.preview, 34))}</small>
      </span>
      <time>${escapeHtml(relativeTime(person.createdAt || Date.now()))}</time>
    </button>
  `).join("");
}

function renderChatRoomSummary() {
  ensureVisibleActiveRoom();
  const activeRoom = getActiveRoom();
  elements.activeRoomName.textContent = activeRoom.name || "Room";
  if (elements.activeRoomIcon) elements.activeRoomIcon.textContent = activeRoom.icon || "💬";
  if (elements.activeRoomIcon && !activeRoom.icon) elements.activeRoomIcon.textContent = "\u{1F4AC}";
  elements.activeRoomMeta.textContent = isAdmin()
    ? `${activeRoom.messageCount || 0} messages - ${activeRoom.onlineMembers || activeRoom.activeMembers || 0} active members`
    : "Public Room";
  if (elements.roomCategory) elements.roomCategory.textContent = activeRoom.category || "Room";
  if (elements.topbarOnlineCount) elements.topbarOnlineCount.textContent = numberText(activeRoom.onlineMembers || activeRoom.activeMembers || 0);
  renderNotifications();
  updateCallButtonsAvailability();
}

function scheduleRoomSummaryRender() {
  if (roomSummaryRenderTimer) return;

  roomSummaryRenderTimer = window.setTimeout(() => {
    roomSummaryRenderTimer = null;
    renderChatRoomSummary();
    updateUserRightPanel();
  }, 180);
}

function updateSidebarMenuActive(showHome) {
  elements.sidebarMenu?.querySelectorAll("[data-menu-action]").forEach((button) => {
    const action = button.dataset.menuAction;
    const active =
      (action === "home" && state.route === DASHBOARD_ROUTE) ||
      (action === "join-public" && state.route === CHAT_ROUTE) ||
      (action === "profile" && state.route === PROFILE_ROUTE) ||
      (action === "my-rooms" && state.route === MY_ROOMS_ROUTE) ||
      (action === "settings" && state.route === SETTINGS_ROUTE) ||
      (action === "notifications" && state.route === NOTIFICATIONS_ROUTE);
    button.classList.toggle("active", active);
  });
}

function renderHomeView() {
  if (!elements.homeView) return;
  const rooms = getVisibleRooms();
  const activeRooms = rooms.filter((room) => room.status !== "archived" && room.status !== "deleted").length;
  const messagesToday = state.stats.messagesToday ?? state.messages.filter((message) => isToday(message.createdAt)).length;

  elements.homeView.innerHTML = `
    <div class="home-shell">
      <div class="home-header">
        <div>
          <h2>Browse Rooms</h2>
          <p>Join an anonymous room and start chatting safely.</p>
        </div>
      </div>
      <div class="home-stats-bar" aria-label="Platform stats">
        <div class="home-stat"><span aria-hidden="true">🟢</span><strong>${numberText(state.stats.online || 0)}</strong><small>Users Online</small></div>
        <div class="home-stat"><span aria-hidden="true">💬</span><strong>${numberText(activeRooms)}</strong><small>Active Rooms</small></div>
        <div class="home-stat"><span aria-hidden="true">📨</span><strong>${numberText(messagesToday || 0)}</strong><small>Messages Today</small></div>
      </div>
      <div class="home-room-grid">
        ${rooms.map(renderHomeRoomCard).join("")}
      </div>
    </div>
  `;
}

function renderMyRoomsPage() {
  if (!elements.homeView) return;
  if (!state.myRoomsLoading && !state.myRoomsLoaded) loadMyRooms();
  const rooms = state.myRooms || [];

  elements.homeView.innerHTML = `
    <div class="workspace-page my-rooms-page">
      <div class="home-header">
        <div>
          <h2>My Rooms</h2>
          <p>Rooms you have created.</p>
        </div>
        <button class="primary-btn compact-primary" type="button" data-create-room>Create Room</button>
      </div>
      ${
        rooms.length
          ? `<div class="managed-room-grid">${rooms.map(renderManagedRoomCard).join("")}</div>`
          : `<div class="empty-state rich-empty-state">
              <span class="empty-emoji" aria-hidden="true">🏠</span>
              <h3>No rooms yet</h3>
              <p>Create your first room and invite your circle into a safer anonymous space.</p>
              <button class="primary-btn compact-primary" type="button" data-create-room>Create Room</button>
            </div>`
      }
    </div>
  `;
}

function renderManagedRoomCard(room) {
  return `
    <article class="managed-room-card">
      <div class="managed-room-head">
        <div class="home-room-icon" style="--room-color:${escapeAttr(room.color || "#6c63ff")}">${escapeHtml(room.icon || "💬")}</div>
        <div>
          <h3>${escapeHtml(room.name || "Room")}</h3>
          <p>${escapeHtml(room.description || room.desc || "Private room")}</p>
        </div>
      </div>
      <div class="managed-room-meta">
        <span>${numberText(room.onlineMembers || room.activeMembers || 0)} online</span>
        <span>${room.createdAt ? relativeTime(room.createdAt) : "Recently"}</span>
      </div>
      <div class="managed-room-actions">
        <button type="button" data-my-room-open="${escapeAttr(room.id)}">Open</button>
        <button type="button" data-my-room-edit="${escapeAttr(room.id)}">Edit</button>
        <button class="danger-inline" type="button" data-my-room-delete="${escapeAttr(room.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderSettingsPage() {
  if (!elements.homeView) return;
  if (!state.blockedUsersLoading && !state.blockedUsersLoaded) loadBlockedUsers();
  const user = state.session.user;
  const settings = loadUserSettings();
  const privacy = {
    lastSeen: "everyone",
    profilePhoto: "everyone",
    anonymousMode: true,
    readReceipts: true,
    allowCalls: "everyone",
    ...(user.privacySettings || {}),
  };

  elements.homeView.innerHTML = `
    <div class="workspace-page settings-page">
      <div class="home-header settings-page-head">
        <div>
          <h2>Settings</h2>
          <p>Profile, privacy, notifications, chat preferences, and account controls.</p>
        </div>
        <button class="primary-btn compact-primary" type="button" data-settings-action="save-settings">Save Settings</button>
      </div>

      <section class="settings-section profile-settings-section">
        <div class="settings-section-title">Profile</div>
        <p class="settings-section-subtitle">Your public AnonChat identity.</p>
        <div class="settings-profile-row">
          ${renderAvatar(user.name, user.avatarColor, user.avatarDataUrl, "settings-avatar")}
          <div>
            <strong>${escapeHtml(user.name || "Anonymous User")}</strong>
            <span>@${escapeHtml(user.username || "user")}</span>
            <p>${escapeHtml(user.about || "No bio added yet.")}</p>
          </div>
          <button class="ghost-btn small-action" type="button" data-settings-action="edit-profile">Edit Profile</button>
        </div>
      </section>

      <section class="settings-section">
        <div class="settings-section-title">Appearance</div>
        <p class="settings-section-subtitle">Choose how AnonChat looks on this device.</p>
        <div class="settings-row theme-settings-row">
          <div><strong>Theme</strong><span>Dark, light, or system preference</span></div>
          <div class="segmented-control theme-choice-control" data-setting-group="theme">
            ${["dark", "light", "system"].map((item) => `
              <button
                class="${settings.theme === item ? "active" : ""}"
                type="button"
                data-theme-choice="${item}"
                data-setting-value="${item}"
                aria-pressed="${settings.theme === item ? "true" : "false"}">
                <span aria-hidden="true">${item === "light" ? "&#9728;&#65039;" : item === "dark" ? "&#127769;" : "AUTO"}</span>
                ${capitalizeLabel(item)}
              </button>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="settings-section">
        <div class="settings-section-title">Account</div>
        <p class="settings-section-subtitle">Login details and account safety.</p>
        ${settingsInfoRow("Email address", user.email || "Not added")}
        ${settingsInfoRow("Phone number", user.contactNumber || "Not added")}
        <button class="ghost-btn small-action" type="button" data-settings-action="toggle-password-form">Change Password</button>
        <div class="password-change-form hidden" id="passwordChangeForm">
          <input type="password" id="settingsCurrentPassword" placeholder="Current password" autocomplete="current-password" />
          <input type="password" id="settingsNewPassword" placeholder="New password" autocomplete="new-password" />
          <input type="password" id="settingsConfirmPassword" placeholder="Confirm new password" autocomplete="new-password" />
          <button class="primary-btn compact-primary" type="button" data-settings-action="save-password">Save Password</button>
        </div>
        <button class="danger-outline-btn" type="button" data-settings-action="delete-account">Delete Account</button>
      </section>

      <section class="settings-section">
        <div class="settings-section-title">Privacy</div>
        <p class="settings-section-subtitle">Control what other users can see.</p>
        ${settingsSelectRow("Last Seen", "Show my last seen to", "lastSeen", privacy.lastSeen, ["everyone", "nobody"])}
        ${settingsSelectRow("Profile Photo", "Who can see my photo", "profilePhoto", privacy.profilePhoto, ["everyone", "nobody"])}
        ${settingsSelectRow("Calls", "Who can call me", "allowCalls", privacy.allowCalls, ["everyone", "my-rooms", "nobody"])}
        ${settingsSelectRow("Online Status", "Show when I am online", "onlineVisibility", privacy.onlineVisibility || "everyone", ["everyone", "nobody"])}
        ${settingsToggleRow("Anonymous Mode", "Hide my real name in chats", "anonymousMode", privacy.anonymousMode)}
        ${settingsToggleRow("Read Receipts", "Show when I've read messages", "readReceipts", privacy.readReceipts)}
      </section>

      <section class="settings-section">
        <div class="settings-section-title">Notifications</div>
        <p class="settings-section-subtitle">Choose the alerts you want.</p>
        ${settingsToggleRow("Message Notifications", "Get notified for new messages", "messageNotifications", settings.messageNotifications)}
        ${settingsToggleRow("Room Invites", "Get notified when invited to a room", "roomInvites", settings.roomInvites)}
        ${settingsToggleRow("Announcements", "Get notified for platform announcements", "announcements", settings.announcements)}
        ${settingsToggleRow("Sound", "Play notification sound", "sound", settings.sound)}
        <button class="ghost-btn small-action" type="button" data-settings-action="enable-notifications">Enable Browser Notifications</button>
      </section>

      <section class="settings-section">
        <div class="settings-section-title">Chat</div>
        <p class="settings-section-subtitle">Tune the chat workspace.</p>
        <div class="settings-row">
          <div><strong>Chat Wallpaper</strong><span>Pick a background tone</span></div>
          <div class="segmented-control" data-setting-group="wallpaper">
            ${["dark", "navy", "midnight", "forest"].map((item) => `<button class="${settings.wallpaper === item ? "active" : ""}" type="button" data-setting-value="${item}">${capitalizeLabel(item)}</button>`).join("")}
          </div>
        </div>
        <div class="settings-row">
          <div><strong>Font Size</strong><span>Message text size</span></div>
          <div class="segmented-control" data-setting-group="fontSize">
            ${["small", "medium", "large"].map((item) => `<button class="${settings.fontSize === item ? "active" : ""}" type="button" data-setting-value="${item}">${capitalizeLabel(item)}</button>`).join("")}
          </div>
        </div>
        ${settingsToggleRow("Media Auto-Download", "Auto download images in chat", "mediaAutoDownload", settings.mediaAutoDownload)}
        ${settingsToggleRow("Enter to Send", "Press Enter to send message", "enterToSend", settings.enterToSend)}
      </section>

      <section class="settings-section">
        <div class="settings-section-title">Blocked Users</div>
        <p class="settings-section-subtitle">People you have blocked.</p>
        ${renderBlockedUsersList()}
      </section>

      <section class="settings-section">
        <div class="settings-section-title">Storage</div>
        <p class="settings-section-subtitle">Clear local chat state on this device.</p>
        <button class="danger-outline-btn" type="button" data-settings-action="clear-chats">Clear All Chats</button>
        <button class="ghost-btn small-action" type="button" data-settings-action="clear-cache">Clear Cache</button>
      </section>

      <section class="settings-section">
        <div class="settings-section-title">Help</div>
        <p class="settings-section-subtitle">Support and legal information.</p>
        <div class="settings-help-grid">
          <button type="button" data-settings-action="faq">FAQ</button>
          <button type="button" data-settings-action="support">Contact Support</button>
          <button type="button" data-settings-action="privacy">Privacy Policy</button>
          <button type="button" data-settings-action="terms">Terms of Service</button>
          <span>AnonChat v1.0.0</span>
        </div>
      </section>

      <section class="settings-section danger-zone-section">
        <div class="settings-section-title">Danger Zone</div>
        <p class="settings-section-subtitle">These actions affect your account immediately.</p>
        <button class="danger-outline-btn" type="button" data-settings-action="logout">Log Out</button>
        <button class="danger-solid-btn" type="button" data-settings-action="delete-account">Delete Account</button>
      </section>
    </div>
  `;
  syncThemeControls();
}

function settingsInfoRow(label, value) {
  return `
    <div class="settings-row">
      <div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>
    </div>
  `;
}

function settingsToggleRow(title, subtitle, key, checked) {
  return `
    <label class="settings-row toggle-setting-row">
      <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span></div>
      <input type="checkbox" data-setting="${escapeAttr(key)}" ${checked ? "checked" : ""} />
      <span class="switch-ui" aria-hidden="true"></span>
    </label>
  `;
}

function settingsSelectRow(title, subtitle, key, value, options) {
  return `
    <div class="settings-row">
      <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span></div>
      <select data-privacy-setting="${escapeAttr(key)}">
        ${options.map((option) => `<option value="${option}" ${value === option ? "selected" : ""}>${capitalizeLabel(option)}</option>`).join("")}
      </select>
    </div>
  `;
}

function renderBlockedUsersList() {
  const users = state.blockedUsers || [];
  if (!users.length) {
    return `<div class="empty-state compact-empty-state">No blocked users. You're all good! ✌️</div>`;
  }

  return `
    <div class="blocked-user-list">
      ${users.map((user) => `
        <div class="blocked-user-row">
          ${renderAvatar(user.name, user.avatarColor, user.avatarDataUrl)}
          <div>
            <strong>${escapeHtml(user.name || user.username || "Anonymous User")}</strong>
            <span>Blocked ${user.blockedAt ? relativeTime(user.blockedAt) : "recently"}</span>
          </div>
          <button type="button" data-unblock-user="${escapeAttr(user.id)}">Unblock</button>
        </div>
      `).join("")}
    </div>
  `;
}

async function loadMyRooms() {
  state.myRoomsLoading = true;
  try {
    const data = await api(`/api/rooms/mine?token=${encodeURIComponent(state.session.token)}`);
    state.myRooms = (data.rooms || []).map(normalizeRoom);
    state.myRoomsLoaded = true;
    if (state.route === MY_ROOMS_ROUTE) renderMyRoomsPage();
  } catch (error) {
    handleApiError(error);
  } finally {
    state.myRoomsLoading = false;
  }
}

async function loadBlockedUsers({ silent = false } = {}) {
  state.blockedUsersLoading = true;
  try {
    const data = await api(`/api/users/blocked?token=${encodeURIComponent(state.session.token)}`);
    const blockedUserIds = (data.blockedUsers || []).map((item) => String(typeof item === "object" ? item.id : item)).filter(Boolean);
    state.blockedUsers = data.users || [];
    state.session.user.blockedUserIds = blockedUserIds.length
      ? blockedUserIds
      : (state.blockedUsers || []).map((user) => String(user.id)).filter(Boolean);
    saveSession(state.session);
    state.blockedUsersLoaded = true;
    if (state.route === SETTINGS_ROUTE) renderSettingsPage();
  } catch (error) {
    if (!silent) handleApiError(error);
  } finally {
    state.blockedUsersLoading = false;
  }
}

function openCreateRoomModal() {
  const emojis = ["💬", "🎮", "🎵", "🌙", "🤫", "📚", "🎯", "🔥", "💡", "🏆", "🎭", "🌟"];
  const colors = ["#6c63ff", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#a855f7", "#14b8a6"];
  elements.composerPlaceholderModal.querySelector(".modal-card")?.classList.add("create-room-modal");
  elements.composerPlaceholderBody.classList.add("create-room-modal-body");
  elements.composerPlaceholderTitle.textContent = "Create Your Room";
  elements.composerPlaceholderBody.innerHTML = `
    <form class="create-room-form" id="createRoomForm">
      <label for="createRoomName">Room Name</label>
      <input id="createRoomName" name="name" required maxlength="50" placeholder="e.g. Study Squad, Friend Group" />
      <label for="createRoomDescription">Room Description</label>
      <textarea id="createRoomDescription" name="description" rows="3" maxlength="200" placeholder="What is this room about?"></textarea>
      <label>Room Icon</label>
      <div class="emoji-option-grid" role="radiogroup">
        ${emojis.map((emoji, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-room-emoji="${escapeAttr(emoji)}">${escapeHtml(emoji)}</button>`).join("")}
      </div>
      <label>Room Color</label>
      <div class="color-option-grid" role="radiogroup">
        ${colors.map((color, index) => `<button class="${index === 0 ? "active" : ""}" type="button" style="--swatch:${color}" data-room-color="${color}" aria-label="${color}"></button>`).join("")}
      </div>
      <div class="form-two-column">
        <label class="choice-card">
          <input type="radio" name="visibility" value="public" checked />
          <span>Public</span>
          <small>Anyone can join</small>
        </label>
        <label class="choice-card">
          <input type="radio" name="visibility" value="private" />
          <span>Private</span>
          <small>Invite only</small>
        </label>
      </div>
      <label class="settings-row toggle-setting-row create-room-toggle">
        <div><strong>Password Protection</strong><span>Require password to enter</span></div>
        <input type="checkbox" id="createRoomPasswordToggle" />
        <span class="switch-ui" aria-hidden="true"></span>
      </label>
      <input class="hidden" id="createRoomPassword" type="password" minlength="4" maxlength="80" placeholder="Room password" />
      <label for="createRoomMaxMembers">Max Members</label>
      <input id="createRoomMaxMembers" type="number" min="2" max="250" value="50" />
      <div class="modal-actions">
        <button class="ghost-btn" type="button" data-modal-cancel>Cancel</button>
        <button class="primary-btn" type="submit">Create Room</button>
      </div>
    </form>
  `;
  elements.composerPlaceholderOkButton.classList.add("hidden");
  elements.composerPlaceholderModal.classList.remove("hidden");

  const form = elements.composerPlaceholderBody.querySelector("#createRoomForm");
  form.scrollTop = 0;
  elements.composerPlaceholderModal.querySelector(".modal-card").scrollTop = 0;
  form.addEventListener("click", handleCreateRoomFormClick);
  form.addEventListener("submit", submitCreateRoom);
  form.querySelector("#createRoomPasswordToggle").addEventListener("change", (event) => {
    form.querySelector("#createRoomPassword").classList.toggle("hidden", !event.target.checked);
  });
}

function handleCreateRoomFormClick(event) {
  const emojiButton = event.target.closest("[data-room-emoji]");
  if (emojiButton) {
    event.preventDefault();
    emojiButton.parentElement.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button === emojiButton));
    return;
  }

  const colorButton = event.target.closest("[data-room-color]");
  if (colorButton) {
    event.preventDefault();
    colorButton.parentElement.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button === colorButton));
    return;
  }

  if (event.target.closest("[data-modal-cancel]")) {
    event.preventDefault();
    closeComposerPlaceholderModal();
  }
}

async function submitCreateRoom(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const passwordEnabled = form.querySelector("#createRoomPasswordToggle").checked;
  const body = {
    token: state.session.token,
    name: form.querySelector("#createRoomName").value.trim(),
    description: form.querySelector("#createRoomDescription").value.trim(),
    icon: form.querySelector("[data-room-emoji].active")?.dataset.roomEmoji || "💬",
    color: form.querySelector("[data-room-color].active")?.dataset.roomColor || "#6c63ff",
    visibility: form.querySelector("input[name='visibility']:checked")?.value || "public",
    password: passwordEnabled ? form.querySelector("#createRoomPassword").value.trim() : "",
    maxCapacity: Number(form.querySelector("#createRoomMaxMembers").value || 50),
  };

  const resetLoading = setButtonLoading(submitButton, true, "Creating...");
  try {
    const { room } = await api("/api/rooms", { method: "POST", body });
    closeComposerPlaceholderModal();
    state.myRoomsLoaded = false;
    const createdRoom = normalizeRoom(room);
    state.unlockedRoomIds.add(createdRoom.id);
    if (createdRoom.slug) state.unlockedRoomIds.add(createdRoom.slug);
    await refreshState();
    handleJoinRoom(createdRoom.id);
    toast("Room created! \u{1F389}");
  } catch (error) {
    handleApiError(error);
  } finally {
    resetLoading();
  }
}

function renderProfilePage() {
  if (!elements.homeView) return;
  const user = state.session.user;
  pendingAvatarDataUrl = "";
  elements.homeView.innerHTML = `
    <div class="profile-route-page">
      <div class="home-header profile-page-head">
        <div>
          <h2>Profile</h2>
          <p>Your display name and photo appear on your chat messages.</p>
        </div>
      </div>
      ${profileFormMarkup(user)}
    </div>
  `;
}

function profileFormMarkup(user) {
  return `
    <form class="profile-form profile-page-form" id="profileForm">
      <div class="profile-large">
        <button class="profile-photo-button" type="button" id="profilePhotoButton" aria-label="Change profile photo">
          <span class="profile-photo-frame">
            ${renderAvatar(user.name, user.avatarColor, user.avatarDataUrl, "profile-photo-preview")}
          </span>
          <span class="change-photo-text">${user.avatarDataUrl ? "Change photo" : "Add your photo"}</span>
        </button>
        <h2>${escapeHtml(user.name)}</h2>
        <p class="muted">@${escapeHtml(user.username)} - ${escapeHtml(user.campus)}</p>
      </div>
      <input class="visually-hidden" id="profilePhotoInput" type="file" accept="image/*" />
      <label for="profilePublicNameInput">Chat display name</label>
      <input id="profilePublicNameInput" value="${escapeAttr(user.name || "")}" maxlength="40" placeholder="Name shown in chat" />
      <label for="profileAboutInput">Bio</label>
      <textarea id="profileAboutInput" rows="3" maxlength="180" placeholder="Write something about yourself">${escapeHtml(user.about || "")}</textarea>
      <label for="profileStatusInput">Custom status</label>
      <input id="profileStatusInput" value="${escapeAttr(user.customStatus || "")}" maxlength="80" placeholder="Available, studying, on campus..." />
      <label for="profileLastSeenSelect">Last seen privacy</label>
      <select id="profileLastSeenSelect">
        <option value="everyone" ${(user.privacySettings?.lastSeen || "everyone") === "everyone" ? "selected" : ""}>Everyone</option>
        <option value="nobody" ${user.privacySettings?.lastSeen === "nobody" ? "selected" : ""}>Nobody</option>
      </select>
      <label for="profileOnlineVisibilitySelect">Online visibility</label>
      <select id="profileOnlineVisibilitySelect">
        <option value="everyone" ${(user.privacySettings?.onlineVisibility || "everyone") === "everyone" ? "selected" : ""}>Show when online</option>
        <option value="nobody" ${user.privacySettings?.onlineVisibility === "nobody" ? "selected" : ""}>Hide online status</option>
      </select>
      <label for="profileFullNameInput">Full Name</label>
      <input id="profileFullNameInput" value="${escapeAttr(user.fullName || "")}" maxlength="60" />
      <label for="profileContactInput">Contact Number</label>
      <input id="profileContactInput" value="${escapeAttr(user.contactNumber || "")}" maxlength="20" />
      <label for="profileGenderSelect">Gender</label>
      <select id="profileGenderSelect">
        <option value="" ${!user.gender ? "selected" : ""}>Prefer not to say</option>
        <option value="male" ${user.gender === "male" ? "selected" : ""}>Male</option>
        <option value="female" ${user.gender === "female" ? "selected" : ""}>Female</option>
        <option value="other" ${user.gender === "other" ? "selected" : ""}>Other</option>
      </select>
      <label for="profileDepartmentInput">Department</label>
      <input id="profileDepartmentInput" value="${escapeAttr(user.department || "")}" maxlength="60" />
      <label for="profileStudyYearSelect">Study Year</label>
      <select id="profileStudyYearSelect">
        <option value="" ${!user.studyYear ? "selected" : ""}>Select year</option>
        <option value="1" ${user.studyYear === "1" ? "selected" : ""}>1st year</option>
        <option value="2" ${user.studyYear === "2" ? "selected" : ""}>2nd year</option>
        <option value="3" ${user.studyYear === "3" ? "selected" : ""}>3rd year</option>
        <option value="4" ${user.studyYear === "4" ? "selected" : ""}>4th year</option>
        <option value="5" ${user.studyYear === "5" ? "selected" : ""}>5th year</option>
        <option value="alumni" ${user.studyYear === "alumni" ? "selected" : ""}>Alumni</option>
      </select>
      <button class="primary-btn profile-save-button" type="button" id="saveProfileButton">Save Profile</button>
    </form>
  `;
}

function renderNotificationsPage() {
  if (!elements.homeView) return;
  const items = notificationItems();
  const unread = items.filter((item) => item.unread).length;

  elements.homeView.innerHTML = `
    <div class="notifications-route-page">
      <div class="home-header notifications-page-head">
        <div>
          <h2>Notifications</h2>
          <p>System alerts, room invites, and announcements.</p>
        </div>
        <button class="mark-read-btn" type="button" data-notification-action="mark-all-read">Mark all as read</button>
      </div>
      <div class="notification-page-list">
        ${
          items.length
            ? items.map(renderNotificationItem).join("")
            : `<div class="empty-state notification-empty">You're all caught up! 🎉</div>`
        }
      </div>
      <p class="notification-summary">${numberText(unread)} unread notification${unread === 1 ? "" : "s"}</p>
    </div>
  `;
}

function renderNotificationItem(item) {
  return `
    <article class="notification-page-item ${item.unread ? "unread" : ""}" data-notification-type="${escapeAttr(item.type)}">
      <span class="notification-item-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.body)}</p>
      </div>
      <span>${escapeHtml(item.time)}</span>
      ${item.unread ? `<i aria-label="Unread"></i>` : ""}
    </article>
  `;
}

function notificationItems() {
  const readAt = notificationReadAt();
  const items = [];

  (state.notifications || []).forEach((notification) => {
    items.push({
      id: notification.id || `notification-${notification.createdAt || Date.now()}`,
      type: notification.type || "invite",
      title: notification.title || (notification.roomId ? "Room invite" : "System"),
      body: notification.body || notification.text || "You have a new notification.",
      createdAt: Number(notification.createdAt || Date.now()),
      roomId: notification.roomId || "",
    });
  });

  getVisibleRooms().forEach((room) => {
    const count = unreadCount(room.id);
    if (!count) return;
    const latest = [...state.messages]
      .filter((message) => String(message.roomId) === String(room.id))
      .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))[0];
    items.push({
      id: `invite-${room.id}`,
      type: "invite",
      title: "Room invite",
      body: `${room.name} has ${numberText(count)} unread update${count === 1 ? "" : "s"} waiting.`,
      createdAt: Number(latest?.createdAt || Date.now()),
      roomId: room.id,
    });
  });

  (state.announcements || []).forEach((announcement) => {
    items.push({
      id: `announcement-${announcement.id}`,
      type: "announcement",
      title: announcement.title || "Announcement",
      body: announcement.body || announcement.message || "",
      createdAt: Number(announcement.createdAt || Date.now()),
    });
  });

  return items
    .map((item) => ({
      ...item,
      icon: notificationIcon(item.type),
      unread: Number(item.createdAt || 0) > readAt,
      time: relativeTime(item.createdAt),
    }))
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
}

function notificationIcon(type) {
  if (type === "announcement") return "AN";
  if (type === "invite") return "IN";
  return "SY";
}

function notificationReadAt() {
  const userId = state.session?.user?.id || "anonymous";
  return Number(localStorage.getItem(`${NOTIFICATION_READ_KEY}:${userId}`) || 0);
}

function markAllNotificationsRead() {
  const userId = state.session?.user?.id || "anonymous";
  localStorage.setItem(`${NOTIFICATION_READ_KEY}:${userId}`, String(Date.now()));
  renderNotifications();
  if (state.route === NOTIFICATIONS_ROUTE) renderNotificationsPage();
}

function renderHomeRoomCard(room) {
  const onlineCount = room.onlineMembers ?? room.activeMembers ?? 0;
  const locked = roomRequiresPassword(room);
  const roomName = room.name || "Room";
  return `
    <article
      class="home-room-card"
      role="button"
      tabindex="0"
      data-home-room-id="${escapeAttr(room.id)}"
      aria-label="Join ${escapeAttr(roomName)}">
      ${locked ? `<span class="room-lock-badge">&#128274; Private</span>` : ""}
      <div class="home-room-icon" style="--room-color:${escapeAttr(room.color)}">${escapeHtml(room.icon)}</div>
      <h3>${escapeHtml(roomName)}</h3>
      <div class="home-room-online"><span></span>${numberText(onlineCount)} online</div>
      <p>${escapeHtml(room.desc || room.description || "Public anonymous room")}</p>
      <div class="home-room-actions">
        <button class="home-join-btn" type="button" data-home-room-id="${escapeAttr(room.id)}">Join Room →</button>
        <button class="ghost-btn small-action" type="button" data-share-room-id="${escapeAttr(room.id)}">Share</button>
      </div>
    </article>
  `;
}

function getVisibleRooms() {
  const pinnedRoomIds = loadPinnedRoomIds();
  return [...state.rooms]
    .filter((room) => !room.hidden && room.status !== "deleted" && room.status !== "archived")
    .filter((room) => !HIDDEN_LEGACY_ROOM_IDS.has(roomKey(room)))
    .sort((a, b) => {
      const aPinnedIndex = pinnedRoomIds.indexOf(String(a.id));
      const bPinnedIndex = pinnedRoomIds.indexOf(String(b.id));
      if (aPinnedIndex !== -1 || bPinnedIndex !== -1) {
        return (aPinnedIndex === -1 ? 999 : aPinnedIndex) - (bPinnedIndex === -1 ? 999 : bPinnedIndex);
      }

      const aIndex = HOME_ROOM_ORDER.indexOf(roomKey(a));
      const bIndex = HOME_ROOM_ORDER.indexOf(roomKey(b));
      if (aIndex !== -1 || bIndex !== -1) {
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      }
      return String(a.name).localeCompare(String(b.name));
    });
}

function ensureVisibleActiveRoom() {
  if (isAdmin()) return;
  const visibleRooms = getVisibleRooms();
  if (visibleRooms.some((room) =>
    room.id === state.activeRoomId ||
    room.slug === state.activeRoomId ||
    String(room._id) === state.activeRoomId
  )) return;
  state.activeRoomId = visibleRooms[0]?.id || "";
  localStorage.setItem(ROOM_KEY, state.activeRoomId);
  joinedRoomId = null;
}

function unreadCount(roomId) {
  const userId = state.session?.user?.id;
  if (!userId || isAdmin()) return 0;

  return state.messages.filter((message) => {
    const delivery = normalizeDelivery(message.delivery);
    return (
      String(message.roomId) === String(roomId) &&
      String(message.authorId) !== String(userId) &&
      !message.hidden &&
      !(message.deletedFor || []).map(String).includes(String(userId)) &&
      !delivery.seenBy.map(String).includes(String(userId))
    );
  }).length;
}

function totalUnreadCount() {
  return getVisibleRooms().reduce((sum, room) => sum + unreadCount(room.id), 0);
}

function renderNotifications() {
  if (!elements.notificationCount) return;
  const count = notificationItems().filter((item) => item.unread).length;
  elements.notificationCount.textContent = String(count);
  elements.notificationCount.classList.toggle("hidden", count === 0);
  elements.sidebarNotificationDot?.classList.toggle("hidden", count === 0);
  updateUnreadDocumentState(count);
}

function presenceStatusForUser(userId) {
  const id = String(userId || "");
  if (id && id === String(state.session?.user?.id || "")) {
    return { userId: id, online: true, lastSeen: Date.now() };
  }
  return state.presence?.[id] || { userId: id, online: false, lastSeen: null };
}

function presenceLabel(userId) {
  const presence = presenceStatusForUser(userId);
  if (presence.online) return "online";
  if (presence.lastSeen) return `last seen ${relativeTime(presence.lastSeen)}`;
  return "offline";
}

function schedulePresenceRender() {
  if (presenceRenderTimer) return;
  presenceRenderTimer = window.setTimeout(() => {
    presenceRenderTimer = null;
    updatePresenceUi();
  }, 160);
}

function updatePresenceUi() {
  document.querySelectorAll("[data-presence-user-id]").forEach((node) => {
    const presence = presenceStatusForUser(node.dataset.presenceUserId);
    node.textContent = presenceLabel(node.dataset.presenceUserId);
    node.classList.toggle("online", Boolean(presence.online));
    node.classList.toggle("offline", !presence.online);
  });

  if (!isAdmin() && elements.profileMeta) {
    elements.profileMeta.textContent = "Online";
  }

  if (selectedProfileAuthorId && elements.viewUsername) {
    const message = profileSelectedMessage();
    if (message) elements.viewUsername.textContent = `@${message.username || message.authorId || "user"} - ${presenceLabel(message.authorId)}`;
  }
}

function openNotifications() {
  navigateTo(NOTIFICATIONS_ROUTE);
}

async function shareRoomLink(roomId) {
  const room = state.rooms.find((item) => String(item.id) === String(roomId) || String(item.slug) === String(roomId));
  if (!room) return;
  const url = `${window.location.origin}/chat?room=${encodeURIComponent(room.id)}`;
  const text = `Join ${room.name} on AnonChat`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "AnonChat room", text, url });
    } else {
      await navigator.clipboard?.writeText(url);
      toast("Room invite link copied.");
    }
  } catch (error) {
    if (error?.name !== "AbortError") toast("Could not share this room link.");
  }
}

async function createEncryptionReadyKey() {
  if (!window.crypto?.subtle) throw new Error("Web Crypto API is not available.");
  return window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptPrivatePayload(payload, key) {
  if (!window.crypto?.subtle) throw new Error("Web Crypto API is not available.");
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const cipher = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return {
    version: 1,
    algorithm: "AES-GCM",
    iv: Array.from(iv),
    cipherText: Array.from(new Uint8Array(cipher)),
  };
}

async function decryptPrivatePayload(envelope, key) {
  if (!window.crypto?.subtle) throw new Error("Web Crypto API is not available.");
  const plain = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(envelope.iv || []) },
    key,
    new Uint8Array(envelope.cipherText || [])
  );
  return JSON.parse(new TextDecoder().decode(plain));
}

function isStandalonePwa() {
  return Boolean(
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.matchMedia?.("(display-mode: fullscreen)")?.matches ||
      window.navigator.standalone
  );
}

function installPromptDismissedRecently() {
  const dismissedAt = Number(localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) || 0);
  return dismissedAt > 0 && Date.now() - dismissedAt < INSTALL_PROMPT_DISMISS_MS;
}

function canShowInstallButtonOnCurrentScreen() {
  const loggedIn = Boolean(state.session?.user && state.session?.token);
  const route = normalizeRoute(state.route || window.location.pathname);
  return !loggedIn && route === LANDING_ROUTE && !isStandalonePwa();
}

function updateInstallButtonState() {
  const button = elements.pwaInstallButton || document.querySelector("#pwaInstallButton");
  if (!button) return;
  const canInstall = Boolean(deferredInstallPrompt) && canShowInstallButtonOnCurrentScreen() && !installPromptDismissedRecently();
  button.classList.toggle("hidden", !canInstall);
  button.hidden = !canInstall;
  button.disabled = !canInstall;
}

function initPwaExperience() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      debugSocketWarning("Service worker registration failed:", error.message);
    });
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type !== "anonchat:notification-click") return;
      if (event.data.roomId) handleJoinRoom(event.data.roomId);
      else navigateTo(CHAT_ROUTE);
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    if (!canShowInstallButtonOnCurrentScreen() || installPromptDismissedRecently()) {
      deferredInstallPrompt = null;
      updateInstallButtonState();
      return;
    }

    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallButtonState();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    localStorage.removeItem(INSTALL_PROMPT_DISMISSED_KEY);
    updateInstallButtonState();
    toast("AnonChat installed.");
  });

  window.matchMedia?.("(display-mode: standalone)")?.addEventListener?.("change", updateInstallButtonState);
  updateInstallButtonState();
}

async function installPwaApp() {
  if (!deferredInstallPrompt) {
    toast("Install is not available in this browser right now.");
    return;
  }

  const promptEvent = deferredInstallPrompt;
  deferredInstallPrompt = null;
  updateInstallButtonState();

  try {
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice.catch(() => ({ outcome: "dismissed" }));
    if (choice?.outcome === "accepted") {
      localStorage.removeItem(INSTALL_PROMPT_DISMISSED_KEY);
      toast("Installing AnonChat...");
    } else {
      localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, String(Date.now()));
      toast("Install dismissed.");
    }
  } catch (error) {
    localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, String(Date.now()));
    debugSocketWarning("PWA install prompt failed:", error.message);
    toast("Install prompt could not be opened.");
  } finally {
    updateInstallButtonState();
  }
}

async function requestBrowserNotificationPermission() {
  if (!("Notification" in window)) {
    toast("Browser notifications are not supported here.");
    return false;
  }

  if (Notification.permission === "granted") {
    toast("Browser notifications are already enabled.");
    return true;
  }

  if (Notification.permission === "denied") {
    toast("Notifications are blocked in browser settings.");
    return false;
  }

  const result = await Notification.requestPermission();
  toast(result === "granted" ? "Browser notifications enabled." : "Notifications were not enabled.");
  return result === "granted";
}

async function showBrowserNotification(title, options = {}) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const payload = {
    body: options.body || "",
    icon: "/assets/logo/logo.png",
    badge: "/assets/logo/logo.png",
    tag: options.tag || `anonchat-${Date.now()}`,
    data: {
      url: options.url || "/chat",
      roomId: options.roomId || "",
    },
    silent: Boolean(options.silent),
  };

  try {
    const registration = await navigator.serviceWorker?.ready;
    if (registration?.showNotification) {
      await registration.showNotification(title, payload);
      return;
    }
  } catch (error) {
    console.warn("Service worker notification failed:", error.message);
  }

  const notification = new Notification(title, payload);
  notification.onclick = () => {
    window.focus();
    if (payload.data?.roomId) handleJoinRoom(payload.data.roomId);
    notification.close();
  };
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") {
    stopCallRingtone();
    renderNotifications();
  }
}

function notifyIncomingMessage(message) {
  const settings = loadUserSettings();
  if (settings.sound) playMessageSound();
  if (settings.messageNotifications === false) return;

  const active = document.visibilityState === "visible" && String(message.roomId) === String(state.activeRoomId);
  if (active) return;

  showBrowserNotification(message.author || "AnonChat message", {
    body: message.text || message.attachment?.name || "New attachment",
    tag: `message-${message.id}`,
    roomId: message.roomId,
    url: `/chat?room=${encodeURIComponent(message.roomId || "")}`,
  });
}

function notifyIncomingCall(payload = {}) {
  const caller = normalizeCallPeer(payload.caller);
  playCallRingtone();
  showBrowserNotification(`Incoming ${payload.type || "audio"} call`, {
    body: caller.name || "Anonymous User",
    tag: `call-${payload.callId || Date.now()}`,
    roomId: payload.roomId || state.activeRoomId,
    url: "/chat",
  });
}

function updateUnreadDocumentState(count = totalUnreadCount()) {
  document.title = count > 0 ? `(${count}) ${originalDocumentTitle}` : originalDocumentTitle;
  if ("setAppBadge" in navigator) {
    if (count > 0) navigator.setAppBadge(count).catch(() => {});
    else navigator.clearAppBadge?.().catch(() => {});
  }
}

function playMessageSound() {
  playToneSequence([{ frequency: 880, duration: 0.055 }, { frequency: 1174, duration: 0.07 }], 0.055);
}

function playCallRingtone() {
  const settings = loadUserSettings();
  if (settings.sound === false) return;
  stopCallRingtone();
  playToneSequence([{ frequency: 784, duration: 0.16 }, { frequency: 988, duration: 0.16 }], 0.06);
  ringtoneTimer = window.setInterval(() => {
    playToneSequence([{ frequency: 784, duration: 0.16 }, { frequency: 988, duration: 0.16 }], 0.06);
  }, 1600);
}

function stopCallRingtone() {
  window.clearInterval(ringtoneTimer);
  ringtoneTimer = null;
}

function playToneSequence(notes, gap = 0.04) {
  try {
    notificationAudioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = notificationAudioContext.currentTime;
    let offset = 0;
    notes.forEach((note) => {
      const oscillator = notificationAudioContext.createOscillator();
      const gain = notificationAudioContext.createGain();
      oscillator.frequency.value = note.frequency;
      oscillator.type = "sine";
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.08, now + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + note.duration);
      oscillator.connect(gain).connect(notificationAudioContext.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + note.duration + 0.02);
      offset += note.duration + gap;
    });
  } catch (error) {
    console.warn("Notification sound unavailable:", error.message);
  }
}

function openInlineMessageSearch() {
  elements.chatRoomTitle?.classList.add("hidden");
  elements.chatSearchBar?.classList.remove("hidden");
  if (elements.chatSearchInput) {
    elements.chatSearchInput.value = state.messageSearchQuery || "";
    window.requestAnimationFrame(() => {
      elements.chatSearchInput.focus();
      elements.chatSearchInput.select();
    });
  }
  updateMessageSearchCount();
}

function handleInlineMessageSearchInput(event) {
  state.messageSearchQuery = event.target.value.trim().toLowerCase();
  if (elements.messageSearch) elements.messageSearch.value = state.messageSearchQuery;
  renderMessages();
}

function resetMessageSearch(options = {}) {
  state.messageSearchQuery = "";
  if (elements.chatSearchInput) elements.chatSearchInput.value = "";
  if (elements.messageSearch) elements.messageSearch.value = "";
  updateMessageSearchCount(0);
  if (options.closeInline !== false) {
    elements.chatSearchBar?.classList.add("hidden");
    elements.chatRoomTitle?.classList.remove("hidden");
  }
  if (options.render) renderMessages();
}

function closeInlineMessageSearch(options = {}) {
  resetMessageSearch({ closeInline: true, render: false });
  elements.chatSearchBar?.classList.add("hidden");
  elements.chatRoomTitle?.classList.remove("hidden");
  if (options.render !== false) renderMessages();
}

function updateMessageSearchCount(count) {
  if (!elements.chatSearchCount) return;
  const queryActive = String(state.messageSearchQuery || "").trim().length > 0;
  elements.chatSearchCount.classList.toggle("hidden", !queryActive);
  if (queryActive) {
    const safeCount = Number(count ?? 0);
    elements.chatSearchCount.textContent = `${numberText(safeCount)} message${safeCount === 1 ? "" : "s"} found`;
  }
}

function highlightedMessageText(value) {
  const text = String(value || "");
  const query = String(state.messageSearchQuery || "").trim();
  if (!query) return escapeHtml(text);

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let html = "";
  let cursor = 0;
  let matchIndex = lowerText.indexOf(lowerQuery, cursor);

  while (matchIndex !== -1) {
    html += escapeHtml(text.slice(cursor, matchIndex));
    html += `<mark class="message-search-mark">${escapeHtml(text.slice(matchIndex, matchIndex + lowerQuery.length))}</mark>`;
    cursor = matchIndex + lowerQuery.length;
    matchIndex = lowerText.indexOf(lowerQuery, cursor);
  }

  html += escapeHtml(text.slice(cursor));
  return html;
}

function openMobileSidebar() {
  elements.sidebar?.classList.add("open");
  elements.sidebarOverlay?.classList.add("show");
  elements.openSidebar?.setAttribute("aria-expanded", "true");
  elements.chatView?.classList.add("sidebar-open");
  document.body.classList.add("mobile-nav-open");
  document.body.style.overflow = "hidden";
}

function closeMobileSidebar() {
  elements.sidebar?.classList.remove("open");
  elements.sidebarOverlay?.classList.remove("show");
  elements.openSidebar?.setAttribute("aria-expanded", "false");
  elements.chatView?.classList.remove("sidebar-open");
  document.body.classList.remove("mobile-nav-open");
  document.body.style.overflow = "";
}

function toggleMobileSidebar() {
  if (elements.sidebar?.classList.contains("open")) {
    closeMobileSidebar();
  } else {
    openMobileSidebar();
  }
}

function openSidebar() {
  openMobileSidebar();
}

function closeSidebar() {
  closeMobileSidebar();
}

function handleMobileNav() {
  if (window.innerWidth <= 768) closeMobileSidebar();
  closeMobileAppMenu();
}

function handleChatShellClick(event) {
  if (!elements.sidebar?.classList.contains("open")) return;
  if (event.target.closest("#sidebar") || event.target.closest("#hamburgerBtn, #openSidebar")) return;
  closeMobileSidebar();
}

function mobileAppMenuAllowed() {
  return Boolean(state.session?.user && state.session?.token && !isAdmin() && isChatRoute(state.route));
}

function updateMobileAppMenuState() {
  const allowed = mobileAppMenuAllowed();
  elements.mobileAppMenuButton?.classList.toggle("hidden", !allowed);
  if (elements.mobileAppMenuButton) {
    elements.mobileAppMenuButton.hidden = !allowed;
    elements.mobileAppMenuButton.setAttribute("aria-expanded", elements.mobileAppMenu?.classList.contains("open") ? "true" : "false");
  }
  if (!allowed) closeMobileAppMenu();
  else renderMobileAppMenuRooms();
}

function mobileMenuRooms() {
  const merged = new Map();
  [...getVisibleRooms(), ...(state.myRooms || [])].forEach((room) => {
    const normalized = normalizeRoom(room);
    if (!normalized.id || normalized.status === "deleted" || normalized.status === "archived") return;
    merged.set(String(normalized.id), normalized);
  });
  return [...merged.values()];
}

function renderMobileAppMenuRooms() {
  if (!elements.mobileMenuRooms) return;
  const rooms = mobileMenuRooms();

  if (!rooms.length) {
    elements.mobileMenuRooms.innerHTML = `<div class="menu-empty-state">No rooms available</div>`;
    return;
  }

  elements.mobileMenuRooms.innerHTML = rooms.map((room) => {
    const active = String(room.id) === String(state.activeRoomId);
    const privateLabel = room.visibility === "private" || room.isPasswordProtected ? "Private" : "Public";
    return `
      <button type="button" class="${active ? "active" : ""}" data-mobile-room-id="${escapeAttr(room.id)}">
        <span class="room-icon" style="color:${escapeAttr(room.color)}">${escapeHtml(room.icon || "\u{1F4AC}")}</span>
        <span>
          <strong>${escapeHtml(room.name)}</strong>
          <small>${escapeHtml(privateLabel)} room</small>
        </span>
        ${active ? `<em class="room-current">Current</em>` : ""}
      </button>
    `;
  }).join("");
}

async function openMobileAppMenu() {
  if (!mobileAppMenuAllowed()) return;
  closeMobileSidebar();
  renderMobileAppMenuRooms();
  elements.mobileAppMenu?.classList.remove("hidden");
  document.body.classList.add("mobile-app-menu-open");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    elements.mobileAppMenu?.classList.add("open");
    elements.mobileAppMenuButton?.setAttribute("aria-expanded", "true");
    elements.mobileAppMenuSheet?.focus();
  });

  if (!state.myRoomsLoaded && !state.myRoomsLoading) {
    loadMyRooms().then(renderMobileAppMenuRooms).catch(() => {});
  }
}

function closeMobileAppMenu() {
  if (!elements.mobileAppMenu) return;
  elements.mobileAppMenu.classList.remove("open");
  elements.mobileAppMenuButton?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("mobile-app-menu-open");
  if (!elements.sidebar?.classList.contains("open")) document.body.style.overflow = "";

  window.setTimeout(() => {
    if (!elements.mobileAppMenu?.classList.contains("open")) {
      elements.mobileAppMenu?.classList.add("hidden");
    }
  }, 180);
}

function toggleMobileAppMenu() {
  if (elements.mobileAppMenu?.classList.contains("open")) {
    closeMobileAppMenu();
  } else {
    openMobileAppMenu();
  }
}

function handleMobileAppMenuClick(event) {
  if (event.target.closest("[data-mobile-menu-close]")) {
    closeMobileAppMenu();
    return;
  }

  const roomButton = event.target.closest("[data-mobile-room-id]");
  if (roomButton) {
    handleJoinRoom(roomButton.dataset.mobileRoomId);
    closeMobileAppMenu();
    return;
  }

  const actionButton = event.target.closest("[data-mobile-menu-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.mobileMenuAction;
  closeMobileAppMenu();

  if (action === "home") {
    navigateTo(DASHBOARD_ROUTE);
  } else if (action === "chat") {
    handleJoinRoom(state.activeRoomId || getVisibleRooms()[0]?.id || "general");
  } else if (action === "my-rooms") {
    navigateTo(MY_ROOMS_ROUTE);
  } else if (action === "create-private") {
    openCreateRoomModal();
  } else if (action === "profile") {
    navigateTo(PROFILE_ROUTE);
  } else if (action === "settings") {
    navigateTo(SETTINGS_ROUTE);
  } else if (action === "notifications") {
    navigateTo(NOTIFICATIONS_ROUTE);
  } else if (action === "logout") {
    logout();
  }
}

function handleMobileAppMenuKeydown(event) {
  if (event.key === "Escape" && elements.mobileAppMenu?.classList.contains("open")) {
    closeMobileAppMenu();
  }
}

function handleSidebarTouchStart(event) {
  const touch = event.changedTouches?.[0];
  if (!touch) return;
  sidebarTouchStartX = touch.clientX;
  sidebarTouchStartY = touch.clientY;
}

function handleSidebarTouchEnd(event) {
  const touch = event.changedTouches?.[0];
  if (!touch || sidebarTouchStartX === null || sidebarTouchStartY === null) return;

  const deltaX = touch.clientX - sidebarTouchStartX;
  const deltaY = touch.clientY - sidebarTouchStartY;
  sidebarTouchStartX = null;
  sidebarTouchStartY = null;

  if (deltaX < -64 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
    closeMobileSidebar();
  }
}

function handleAdminSidebarTouchStart(event) {
  if (!event.target.closest(".admin-sidebar")) return;
  const touch = event.changedTouches?.[0];
  if (!touch) return;
  adminSidebarTouchStartX = touch.clientX;
  adminSidebarTouchStartY = touch.clientY;
}

function handleAdminSidebarTouchEnd(event) {
  const touch = event.changedTouches?.[0];
  if (!touch || adminSidebarTouchStartX === null || adminSidebarTouchStartY === null) return;

  const deltaX = touch.clientX - adminSidebarTouchStartX;
  const deltaY = touch.clientY - adminSidebarTouchStartY;
  adminSidebarTouchStartX = null;
  adminSidebarTouchStartY = null;

  if (deltaX < -64 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
    elements.adminDashboardView?.classList.remove("sidebar-open");
  }
}

function handleDashboardMenuClick(event) {
  const button = event.target.closest("[data-menu-action]");
  if (!button) return;

  const action = button.dataset.menuAction;
  if ((event.type === "contextmenu" || event.button === 2) && getChatContextItem(button)) {
    event.preventDefault();
    event.stopPropagation();
    showChatContextMenu(button);
    return;
  }

  if (action === "home") {
    navigateTo(DASHBOARD_ROUTE, { render: false });
    render();
  } else if (action === "join-public") {
    handleJoinRoom(state.activeRoomId || getVisibleRooms()[0]?.id || "general");
  } else if (action === "profile") {
    navigateTo(PROFILE_ROUTE);
  } else if (action === "create-private") {
    openCreateRoomModal();
  } else if (action === "my-rooms") {
    navigateTo(MY_ROOMS_ROUTE);
  } else if (action === "settings") {
    navigateTo(SETTINGS_ROUTE);
  } else if (action === "notifications") {
    navigateTo(NOTIFICATIONS_ROUTE);
  }

  closeMobileSidebar();
}

function getChatContextMenu() {
  return elements.chatContextMenu || document.getElementById("chatContextMenu");
}

function getChatContextItem(target) {
  return target?.closest?.(
    ".sidebar .chat-item, .sidebar .conversation-item, .sidebar .room-item, .sidebar .sidebar-room, .sidebar .room-button, .sidebar [data-context-chat-id], .sidebar [data-chat-id], .sidebar .menu-button[data-menu-action='join-public'], .ctx-trigger"
  );
}

function chatContextIdFromItem(chatItem) {
  return String(
    chatItem?.dataset?.roomId ||
      chatItem?.dataset?.chatId ||
      chatItem?.dataset?.id ||
      chatItem?.dataset?.contextChatId ||
      (chatItem?.dataset?.menuAction === "join-public" ? state.activeRoomId || getVisibleRooms()[0]?.id : "") ||
      ""
  ).trim();
}

function showChatContextMenu(chatItem) {
  const menu = getChatContextMenu();
  if (!menu || !chatItem) return;
  if (chatContextIsScrolling) return;

  activeContextChatId = chatContextIdFromItem(chatItem);
  if (!activeContextChatId) {
    hideChatContextMenu();
    return;
  }

  document.querySelectorAll(".ctx-selected").forEach((item) => item.classList.remove("ctx-selected"));
  chatItem.classList.add("ctx-selected");
  activeContextChatEl = chatItem;

  const rect = chatItem.getBoundingClientRect();
  menu.style.display = "block";
  menu.classList.remove("visible");

  const menuWidth = Math.max(menu.offsetWidth || 190, 190);
  const menuHeight = Math.max(menu.offsetHeight || 200, 200);
  let x = rect.right + 4;
  let y = rect.top;

  if (x + menuWidth > window.innerWidth - 8) {
    x = rect.left - menuWidth - 4;
  }

  if (y + menuHeight > window.innerHeight - 8) {
    y = window.innerHeight - menuHeight - 8;
  }

  menu.style.left = `${Math.max(8, x)}px`;
  menu.style.top = `${Math.max(8, y)}px`;
  menu.setAttribute("aria-hidden", "false");
  window.requestAnimationFrame(() => menu.classList.add("visible"));
}

function hideChatContextMenu() {
  const menu = getChatContextMenu();
  if (!menu) return;

  menu.classList.remove("visible");
  menu.setAttribute("aria-hidden", "true");
  activeContextChatId = null;
  if (activeContextChatEl) activeContextChatEl.classList.remove("ctx-selected");
  activeContextChatEl = null;

  window.setTimeout(() => {
    if (!activeContextChatId) menu.style.display = "none";
  }, 150);
}

function handleChatContextDocumentClick(event) {
  if (event.target.closest("#chatContextMenu")) return;

  const chatItem = getChatContextItem(event.target);
  if (!chatItem) {
    hideChatContextMenu();
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  showChatContextMenu(chatItem);
}

function handleChatContextKeydown(event) {
  if (event.key === "Escape") hideChatContextMenu();
}

function handleChatContextScroll() {
  chatContextIsScrolling = true;
  hideChatContextMenu();
  window.clearTimeout(chatContextScrollTimer);
  chatContextScrollTimer = window.setTimeout(() => {
    chatContextIsScrolling = false;
  }, 150);
}

function handleChatContextWheel() {
  handleChatContextScroll();
}

function clearChatContextTouchTimer() {
  window.clearTimeout(chatContextTouchTimer);
  chatContextTouchTimer = null;
}

function handleChatContextTouchStart(event) {
  if (event.target.closest("#chatContextMenu")) return;
  const chatItem = getChatContextItem(event.target);
  if (!chatItem) return;

  chatContextTouchMoved = false;
  clearChatContextTouchTimer();

  const touch = event.touches?.[0];
  chatContextTouchTimer = window.setTimeout(() => {
    if (chatContextTouchMoved || chatContextIsScrolling || !touch) return;
    showChatContextMenu(chatItem);
    const menu = getChatContextMenu();
    if (menu) {
      const menuWidth = Math.max(menu.offsetWidth || 190, 190);
      const menuHeight = Math.max(menu.offsetHeight || 200, 200);
      let x = touch.clientX + 4;
      let y = touch.clientY;
      if (x + menuWidth > window.innerWidth - 8) x = touch.clientX - menuWidth - 4;
      if (y + menuHeight > window.innerHeight - 8) y = window.innerHeight - menuHeight - 8;
      menu.style.left = `${Math.max(8, x)}px`;
      menu.style.top = `${Math.max(8, y)}px`;
    }
    if (navigator.vibrate) navigator.vibrate(50);
  }, 600);
}

function handleChatContextTouchMove() {
  chatContextTouchMoved = true;
  clearChatContextTouchTimer();
  handleChatContextScroll();
}

async function handleChatContextMenuAction(event) {
  const button = event.target.closest(".ctx-btn, .ctx-item");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  const action = button.dataset.action;
  const roomId = activeContextChatId;
  hideChatContextMenu();

  if (!roomId) return;

  if (action === "open") {
    openContextChat(roomId);
  } else if (action === "pin") {
    pinContextChat(roomId);
  } else if (action === "rename") {
    await renameContextChat(roomId);
  } else if (action === "archive") {
    await archiveContextChat(roomId);
  } else if (action === "delete") {
    await deleteContextChat(roomId);
  }
}

function openContextChat(roomId) {
  const room = getContextRoom(roomId);
  handleJoinRoom(room?.id || roomId);
  closeMobileSidebar();
}

function pinnedRoomsStorageKey() {
  return `${PINNED_ROOMS_KEY}:${state.session?.user?.id || "anonymous"}`;
}

function loadPinnedRoomIds() {
  try {
    const data = JSON.parse(localStorage.getItem(pinnedRoomsStorageKey()) || "[]");
    return Array.isArray(data) ? data.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function savePinnedRoomIds(roomIds) {
  localStorage.setItem(pinnedRoomsStorageKey(), JSON.stringify(uniqueList(roomIds.map(String))));
}

function messageCollectionStorageKey(baseKey) {
  return `${baseKey}:${state.session?.user?.id || "anonymous"}`;
}

function loadMessageCollection(baseKey) {
  try {
    const data = JSON.parse(localStorage.getItem(messageCollectionStorageKey(baseKey)) || "[]");
    return Array.isArray(data) ? data.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveMessageCollection(baseKey, ids) {
  localStorage.setItem(messageCollectionStorageKey(baseKey), JSON.stringify(uniqueList(ids.map(String))));
}

function toggleLocalMessageCollection(baseKey, messageId) {
  const ids = loadMessageCollection(baseKey);
  const id = String(messageId);
  const exists = ids.includes(id);
  saveMessageCollection(baseKey, exists ? ids.filter((item) => item !== id) : [id, ...ids]);
  renderMessages({ preserveScroll: true });
  return !exists;
}

function pinContextChat(roomId) {
  const room = findRoomById(roomId);
  if (!room) {
    toast("Chat not found.");
    return;
  }

  const pinned = loadPinnedRoomIds();
  savePinnedRoomIds([room.id, ...pinned.filter((id) => id !== room.id)]);
  renderRooms();
  if (state.route === DASHBOARD_ROUTE) renderHomeView();
  toast("Chat pinned \u{1F4CC}");
}

function getContextRoom(roomId) {
  return findRoomById(roomId) || state.myRooms.find((room) =>
    String(room.id) === String(roomId) ||
    String(room.slug) === String(roomId) ||
    String(room._id) === String(roomId)
  );
}

function userCanManageContextRoom(roomId) {
  const room = getContextRoom(roomId);
  const userId = String(state.session?.user?.id || "");
  if (!room || !userId) return false;

  return state.myRooms.some((item) =>
    String(item.id) === String(room.id) ||
    String(item.slug) === String(room.id) ||
    String(item._id) === String(room._id)
  ) || String(room.createdById || "") === userId;
}

function ensureCanManageContextRoom(roomId, actionLabel) {
  if (!state.session?.token) {
    toast("Login required. Please log in again.");
    return false;
  }

  if (!userCanManageContextRoom(roomId)) {
    toast(`Only rooms you created can be ${actionLabel}.`);
    return false;
  }

  return true;
}

async function refreshRoomsAfterContextAction() {
  state.myRoomsLoaded = false;
  await refreshState();
  if (state.route === MY_ROOMS_ROUTE) await loadMyRooms();
  render();
}

async function renameContextChat(roomId) {
  if (!ensureCanManageContextRoom(roomId, "renamed")) return;

  const room = getContextRoom(roomId);
  const newName = await showInlinePrompt({
    title: "Rename chat",
    placeholder: "Enter new name...",
    value: room?.name || "",
  });
  if (!newName?.trim()) return;

  try {
    await api(`/api/rooms/${encodeURIComponent(roomId)}`, {
      method: "PATCH",
      body: {
        token: state.session.token,
        name: newName.trim(),
        description: room?.description || room?.desc || "",
      },
    });
    await refreshRoomsAfterContextAction();
    toast("Chat renamed");
  } catch (error) {
    handleApiError(error);
  }
}

async function archiveContextChat(roomId) {
  if (!ensureCanManageContextRoom(roomId, "archived")) return;
  const room = getContextRoom(roomId);
  const normalizedRoomId = room?.id || roomId;

  try {
    await api(`/api/rooms/${encodeURIComponent(roomId)}`, {
      method: "PATCH",
      body: {
        token: state.session.token,
        status: "archived",
      },
    });
    if (state.activeRoomId === normalizedRoomId) state.activeRoomId = getVisibleRooms().find((item) => item.id !== normalizedRoomId)?.id || "general";
    await refreshRoomsAfterContextAction();
    toast("Chat archived \u{1F4E6}");
  } catch (error) {
    handleApiError(error);
  }
}

async function deleteContextChat(roomId) {
  if (!ensureCanManageContextRoom(roomId, "deleted")) return;
  const room = getContextRoom(roomId);
  const normalizedRoomId = room?.id || roomId;

  const ok = await showConfirmModal({
    title: "Delete Chat?",
    body: "This will permanently delete this chat. This cannot be undone.",
    confirmText: "Delete",
    danger: true,
  });
  if (!ok) return;

  try {
    await api(`/api/rooms/${encodeURIComponent(roomId)}`, {
      method: "DELETE",
      body: { token: state.session.token },
    });
    if (state.activeRoomId === normalizedRoomId) state.activeRoomId = getVisibleRooms().find((item) => item.id !== normalizedRoomId)?.id || "general";
    await refreshRoomsAfterContextAction();
    toast("Chat deleted");
  } catch (error) {
    handleApiError(error);
  }
}

function handleSafetyPanelClick(event) {
  const button = event.target.closest("[data-safety-action]");
  if (!button) return;

  const action = button.dataset.safetyAction;
  if (action === "report-user") {
    reportLatestUserMessage();
  } else if (action === "block-user") {
    blockLatestUserMessage();
  } else if (action === "clear-chat") {
    clearActiveChatForMe();
  } else if (action === "leave-chat") {
    leaveActiveRoom();
  }
}

function findRoomById(roomId) {
  return state.rooms.find((room) =>
    String(room.id) === String(roomId) ||
    String(room.slug) === String(roomId) ||
    String(room._id) === String(roomId)
  );
}

function roomRequiresPassword(room = {}) {
  return Boolean(room.isPasswordProtected || room.passwordProtected || room.hasPassword || room.password);
}

function userOwnsRoomClient(room = {}) {
  const user = state.session?.user || {};
  return Boolean(
    isAdmin() ||
    String(room.createdById || "") === String(user.id || "") ||
    String(room.createdBy || "") === String(user.id || "")
  );
}

function roomUnlockedForClient(room = {}) {
  if (userOwnsRoomClient(room)) return true;
  return Boolean(
    state.unlockedRoomIds?.has(room.id) ||
    state.unlockedRoomIds?.has(room.slug) ||
    state.unlockedRoomIds?.has(room._id)
  );
}

function canEnterRoom(room = {}) {
  if (!roomRequiresPassword(room)) return true;
  return roomUnlockedForClient(room);
}

function handleJoinRoom(roomId) {
  const room = findRoomById(roomId);
  if (!room) return;

  if (roomRequiresPassword(room) && !roomUnlockedForClient(room)) {
    openRoomPasswordModal(room.id);
    return;
  }

  return switchActiveRoom(room.id || roomId, { skipPassword: true });
}

function openRoomPasswordModal(roomId) {
  const room = findRoomById(roomId);
  if (!room) return;
  pendingRoomJoin = room.id;
  if (elements.passwordModalRoomName) elements.passwordModalRoomName.textContent = room.name || "Private Room";
  if (elements.passwordModalRoomIcon) elements.passwordModalRoomIcon.textContent = room.icon || "\u{1F512}";
  if (elements.roomPasswordInput) {
    elements.roomPasswordInput.value = "";
    elements.roomPasswordInput.type = "password";
    elements.roomPasswordInput.classList.remove("error");
  }
  if (elements.toggleRoomPassword) elements.toggleRoomPassword.textContent = "Show";
  elements.roomPasswordError?.classList.add("hidden");
  elements.roomPasswordModal?.classList.remove("hidden");
  window.setTimeout(() => elements.roomPasswordInput?.focus(), 100);
}

function closeRoomPasswordModal() {
  pendingRoomJoin = null;
  elements.roomPasswordModal?.classList.add("hidden");
  clearRoomPasswordError();
}

function clearRoomPasswordError() {
  elements.roomPasswordInput?.classList.remove("error");
  elements.roomPasswordError?.classList.add("hidden");
}

function toggleRoomPasswordVisibility() {
  if (!elements.roomPasswordInput || !elements.toggleRoomPassword) return;
  const showing = elements.roomPasswordInput.type === "text";
  elements.roomPasswordInput.type = showing ? "password" : "text";
  elements.toggleRoomPassword.textContent = showing ? "Show" : "Hide";
}

async function confirmRoomPasswordJoin() {
  if (!pendingRoomJoin) return;
  const password = elements.roomPasswordInput?.value.trim() || "";
  if (!password) {
    elements.roomPasswordInput?.classList.add("error");
    return;
  }

  const resetLoading = setButtonLoading(elements.confirmRoomPassword, true, "Checking...");
  try {
    const result = await api("/api/rooms/verify-password", {
      method: "POST",
      body: {
        token: state.session.token,
        roomId: pendingRoomJoin,
        password,
      },
    });

    if (result.room) {
      const normalizedRoom = normalizeRoom({ ...result.room, canAccess: true });
      state.rooms = [
        ...state.rooms.filter((room) => room.id !== normalizedRoom.id),
        normalizedRoom,
      ];
      state.unlockedRoomIds.add(normalizedRoom.id);
      if (normalizedRoom.slug) state.unlockedRoomIds.add(normalizedRoom.slug);
    } else {
      state.unlockedRoomIds.add(pendingRoomJoin);
    }
    (result.messages || []).forEach(upsertMessage);
    const roomId = pendingRoomJoin;
    closeRoomPasswordModal();
    switchActiveRoom(roomId, { skipPassword: true });
    toast("Joined room successfully! \u{1F389}");
  } catch (error) {
    elements.roomPasswordError?.classList.remove("hidden");
    elements.roomPasswordInput?.classList.add("error");
    if (elements.roomPasswordInput) {
      elements.roomPasswordInput.value = "";
      elements.roomPasswordInput.focus();
    }
  } finally {
    resetLoading();
  }
}

function switchActiveRoom(roomId, options = {}) {
  const room = findRoomById(roomId);
  if (room && !options.skipPassword && roomRequiresPassword(room) && !roomUnlockedForClient(room)) {
    openRoomPasswordModal(room.id);
    return;
  }
  state.activeRoomId = room?.id || roomId;
  localStorage.setItem(ROOM_KEY, state.activeRoomId);
  state.replyToMessageId = null;
  state.editingMessageId = null;
  state.activeReactionMessageId = null;
  resetMessageSearch({ closeInline: true, render: false });
  joinedRoomId = null;
  joiningRoomId = null;
  joinActiveRoom();
  navigateTo(CHAT_ROUTE, { render: false });
  render();
  loadRecentMessagesForRoom(state.activeRoomId, { force: true, renderAfter: true }).catch(handleApiError);
}

async function handleHomeViewClick(event) {
  const notificationAction = event.target.closest("[data-notification-action]");
  if (notificationAction?.dataset.notificationAction === "mark-all-read") {
    markAllNotificationsRead();
    return;
  }

  if (event.target.closest("[data-create-room]")) {
    openCreateRoomModal();
    return;
  }

  const myRoomOpen = event.target.closest("[data-my-room-open]");
  if (myRoomOpen) {
    handleJoinRoom(myRoomOpen.dataset.myRoomOpen);
    return;
  }

  const myRoomEdit = event.target.closest("[data-my-room-edit]");
  if (myRoomEdit) {
    editMyRoom(myRoomEdit.dataset.myRoomEdit);
    return;
  }

  const myRoomDelete = event.target.closest("[data-my-room-delete]");
  if (myRoomDelete) {
    deleteMyRoom(myRoomDelete.dataset.myRoomDelete);
    return;
  }

  const unblockButton = event.target.closest("[data-unblock-user]");
  if (unblockButton) {
    unblockUser(unblockButton.dataset.unblockUser);
    return;
  }

  const shareRoomButton = event.target.closest("[data-share-room-id]");
  if (shareRoomButton) {
    await shareRoomLink(shareRoomButton.dataset.shareRoomId);
    return;
  }

  const segmentButton = event.target.closest("[data-setting-group] [data-setting-value]");
  if (segmentButton) {
    const group = segmentButton.closest("[data-setting-group]");
    group.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button === segmentButton));
    return;
  }

  const settingsAction = event.target.closest("[data-settings-action]");
  if (settingsAction) {
    handleSettingsAction(settingsAction.dataset.settingsAction, settingsAction);
    return;
  }

  const button = event.target.closest("[data-home-room-id]");
  if (!button) return;
  handleJoinRoom(button.dataset.homeRoomId);
}

function handleHomeViewKeydown(event) {
  if (!["Enter", " "].includes(event.key)) return;
  if (event.target.closest("button, a, input, textarea, select, [contenteditable='true']")) return;
  const roomCard = event.target.closest(".home-room-card[data-home-room-id]");
  if (!roomCard) return;
  event.preventDefault();
  handleJoinRoom(roomCard.dataset.homeRoomId);
}

async function editMyRoom(roomId) {
  const room = state.myRooms.find((item) => item.id === roomId);
  if (!room) return;
  const name = window.prompt("Room name", room.name || "");
  if (!name) return;
  const description = window.prompt("Room description", room.description || room.desc || "") ?? "";

  try {
    await api(`/api/rooms/${encodeURIComponent(roomId)}`, {
      method: "PATCH",
      body: {
        token: state.session.token,
        name,
        description,
      },
    });
    state.myRoomsLoaded = false;
    await refreshState();
    await loadMyRooms();
    renderMyRoomsPage();
    toast("Room updated.");
  } catch (error) {
    handleApiError(error);
  }
}

async function deleteMyRoom(roomId) {
  const confirmed = window.confirm("Delete this room and its messages?");
  if (!confirmed) return;

  try {
    await api(`/api/rooms/${encodeURIComponent(roomId)}`, {
      method: "DELETE",
      body: { token: state.session.token },
    });
    if (state.activeRoomId === roomId) state.activeRoomId = getVisibleRooms()[0]?.id || "general";
    state.myRoomsLoaded = false;
    await refreshState();
    await loadMyRooms();
    renderMyRoomsPage();
    toast("Room deleted.");
  } catch (error) {
    handleApiError(error);
  }
}

async function handleSettingsAction(action, button) {
  if (action === "edit-profile") {
    navigateTo(PROFILE_ROUTE);
    return;
  }

  if (action === "toggle-password-form") {
    activeProfileRoot()?.querySelector("#passwordChangeForm")?.classList.toggle("hidden");
    return;
  }

  if (action === "save-password") {
    await saveChangedPassword(button);
    return;
  }

  if (action === "save-settings") {
    await saveSettingsPage(button);
    return;
  }

  if (action === "enable-notifications") {
    await requestBrowserNotificationPermission();
    return;
  }

  if (action === "clear-chats") {
    await clearAllChatsForMe();
    return;
  }

  if (action === "clear-cache") {
    clearUserCache();
    return;
  }

  if (action === "faq") {
    openInfoModal("FAQ", "AnonChat lets you join public rooms, create private rooms, report unsafe messages, and keep your identity private.");
    return;
  }

  if (action === "support") {
    window.location.href = "mailto:supportanonchat@gmail.com?subject=AnonChat%20Support%20Request";
    return;
  }

  if (action === "privacy") {
    navigateTo(PRIVACY_ROUTE);
    return;
  }

  if (action === "terms") {
    openInfoModal("Terms of Service", "Use AnonChat respectfully. Abuse, spam, harassment, and unsafe content can lead to moderation actions.");
    return;
  }

  if (action === "logout") {
    if (window.confirm("Log out of AnonChat?")) logout();
    return;
  }

  if (action === "delete-account") {
    const typed = window.prompt('Type "DELETE" to permanently delete your account.');
    if (typed !== "DELETE") return;
    try {
      await api("/api/users/profile", {
        method: "DELETE",
        body: { token: state.session.token },
      });
      toast("Account deleted.");
      await logout();
    } catch (error) {
      handleApiError(error);
    }
  }
}

async function saveChangedPassword(button) {
  const root = activeProfileRoot();
  const currentPassword = root?.querySelector("#settingsCurrentPassword")?.value || "";
  const newPassword = root?.querySelector("#settingsNewPassword")?.value || "";
  const confirmPassword = root?.querySelector("#settingsConfirmPassword")?.value || "";
  const resetLoading = setButtonLoading(button, true, "Saving...");

  try {
    await api("/api/users/password", {
      method: "PATCH",
      body: {
        token: state.session.token,
        currentPassword,
        newPassword,
        confirmPassword,
      },
    });
    root?.querySelector("#passwordChangeForm")?.classList.add("hidden");
    toast("Password updated.");
  } catch (error) {
    handleApiError(error);
  } finally {
    resetLoading();
  }
}

async function saveSettingsPage(button) {
  const root = activeProfileRoot();
  const nextSettings = collectUserSettings(root);
  const resetLoading = setButtonLoading(button, true, "Saving...");

  try {
    saveUserSettings(nextSettings);
    const privacySettings = {
      lastSeen: root?.querySelector('[data-privacy-setting="lastSeen"]')?.value || "everyone",
      profilePhoto: root?.querySelector('[data-privacy-setting="profilePhoto"]')?.value || "everyone",
      allowCalls: root?.querySelector('[data-privacy-setting="allowCalls"]')?.value || "everyone",
      onlineVisibility: root?.querySelector('[data-privacy-setting="onlineVisibility"]')?.value || state.session.user.privacySettings?.onlineVisibility || "everyone",
      anonymousMode: Boolean(root?.querySelector('[data-setting="anonymousMode"]')?.checked),
      readReceipts: Boolean(root?.querySelector('[data-setting="readReceipts"]')?.checked),
    };
    const { user } = await api("/api/users/profile", {
      method: "PATCH",
      body: {
        token: state.session.token,
        profile: {
          fullName: state.session.user.fullName,
          anonymousName: state.session.user.name,
          about: state.session.user.about || "",
          customStatus: state.session.user.customStatus || "",
          gender: state.session.user.gender || "",
          department: state.session.user.department || "",
          studyYear: state.session.user.studyYear || "",
          contactNumber: state.session.user.contactNumber || "",
          avatarDataUrl: state.session.user.avatarDataUrl || "",
          privacySettings,
          themePreference: nextSettings.theme,
        },
      },
    });
    state.session.user = { ...state.session.user, ...user };
    saveSession(state.session);
    toast("Settings saved.");
  } catch (error) {
    handleApiError(error);
  } finally {
    resetLoading();
  }
}

async function unblockUser(userId) {
  const confirmed = window.confirm("Unblock this user?");
  if (!confirmed) return;

  try {
    await api("/api/users/unblock", {
      method: "POST",
      body: {
        token: state.session.token,
        blockedUserId: userId,
      },
    });
    state.session.user.blockedUserIds = (state.session.user.blockedUserIds || []).filter((id) => String(id) !== String(userId));
    state.session.user.blockedUsers = (state.session.user.blockedUsers || []).filter((id) => String(id) !== String(userId));
    saveSession(state.session);
    state.blockedUsersLoaded = false;
    await loadBlockedUsers();
    renderSettingsPage();
    toast("User unblocked \u2705");
  } catch (error) {
    handleApiError(error);
  }
}

function reportLatestUserMessage() {
  const currentUserId = state.session?.user?.id;
  const message = [...state.messages]
    .reverse()
    .find((item) => item.roomId === state.activeRoomId && item.authorId !== currentUserId && !item.hidden);

  if (!message) {
    toast("No user message to report in this room yet.");
    return;
  }

  openReportModal(message.id);
}

async function blockLatestUserMessage() {
  const currentUserId = state.session?.user?.id;
  const message = [...state.messages]
    .reverse()
    .find((item) => item.roomId === state.activeRoomId && item.authorId !== currentUserId && !item.hidden);

  if (!message) {
    toast("No user message to block in this room yet.");
    return;
  }

  openBlockUserModal(message.id);
}

function openBlockUserModal(messageId) {
  const message = state.messages.find((item) => item.id === messageId);
  if (!message?.authorId) {
    toast("User not found for this message.");
    return;
  }

  state.blockMessageId = messageId;
  if (elements.blockUserName) {
    elements.blockUserName.textContent = message.author || "Anonymous User";
  }
  elements.blockUserModal?.classList.remove("hidden");
}

function closeBlockUserModal() {
  state.blockMessageId = null;
  elements.blockUserModal?.classList.add("hidden");
}

async function blockUserByMessage(messageId) {
  openBlockUserModal(messageId);
}

function openMessageContextMenu(messageId, anchor) {
  const message = state.messages.find((item) => String(item.id) === String(messageId));
  const menu = elements.messageContextMenu || document.getElementById("messageContextMenu");
  if (!message || !menu || message.deletedAt) return;

  activeMessageContextId = message.id;
  activeMessageContextEl = elements.chatFeed?.querySelector(`.message[data-message-id="${cssEscape(message.id)}"]`) || null;
  const mine = String(message.authorId) === String(state.session?.user?.id);
  const mediaSource = message.attachment?.dataUrl || message.attachment?.url || "";
  const mediaName = message.attachment?.name || "Attachment";

  const reactionRow = MESSAGE_REACTION_EMOJIS.map(
    (emoji) => `<button class="message-ctx-emoji" type="button" data-message-context-action="react" data-emoji="${escapeAttr(emoji)}">${escapeHtml(emoji)}</button>`
  ).join("");
  const rows = [
    ["reply", "↩", "Reply", true],
    ["reply-private", "💬", "Reply privately", !mine],
    ["copy", "⧉", "Copy", Boolean(message.text || mediaSource)],
    ["forward", "➜", "Forward", true],
    ["pin", "📌", "Pin", true],
    ["star", "★", "Star", true],
    ["select", "☑", "Select", true],
    ["save", "↓", mediaSource ? "Save / Download" : "Save text", true],
    ["share", "↗", "Share", Boolean(message.text || mediaSource)],
    ["report", "⚑", "Report", !mine],
    ["block", "⊘", "Block", !mine],
    ["delete-me", "⌫", "Delete for me", true, "danger"],
    ["delete-everyone", "🗑", "Delete for everyone", mine || isAdmin(), "danger"],
  ]
    .filter(([, , , show]) => show)
    .map(([action, icon, label, , tone]) => `
      <button class="message-ctx-item ${tone === "danger" ? "danger" : ""}" type="button" data-message-context-action="${action}" data-media-src="${escapeAttr(mediaSource)}" data-media-name="${escapeAttr(mediaName)}">
        <span>${icon}</span>${label}
      </button>
    `)
    .join("");

  menu.innerHTML = `
    <div class="message-ctx-reactions">${reactionRow}</div>
    <div class="ctx-divider"></div>
    ${rows}
  `;

  const point = messageContextPoint(anchor);
  menu.style.display = "block";
  menu.classList.remove("visible");
  menu.setAttribute("aria-hidden", "false");
  activeMessageContextEl?.classList.add("ctx-selected");

  const menuWidth = Math.max(menu.offsetWidth || 240, 220);
  const menuHeight = Math.max(menu.offsetHeight || 360, 320);
  let left = point.x;
  let top = point.y;
  if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
  if (top + menuHeight > window.innerHeight - 8) top = window.innerHeight - menuHeight - 8;
  menu.style.left = `${Math.max(8, left)}px`;
  menu.style.top = `${Math.max(8, top)}px`;
  window.requestAnimationFrame(() => menu.classList.add("visible"));
}

function messageContextPoint(anchor) {
  if (typeof anchor?.clientX === "number") return { x: anchor.clientX, y: anchor.clientY };
  const rect = anchor?.getBoundingClientRect?.() || activeMessageContextEl?.getBoundingClientRect?.();
  if (!rect) return { x: window.innerWidth / 2 - 110, y: window.innerHeight / 2 - 160 };
  return { x: rect.right + 8, y: rect.top };
}

function hideMessageContextMenu() {
  const menu = elements.messageContextMenu || document.getElementById("messageContextMenu");
  if (!menu) return;
  menu.classList.remove("visible");
  menu.setAttribute("aria-hidden", "true");
  activeMessageContextEl?.classList.remove("ctx-selected");
  activeMessageContextEl = null;
  activeMessageContextId = null;
  window.setTimeout(() => {
    if (!activeMessageContextId) menu.style.display = "none";
  }, 120);
}

function handleMessageContextDocumentClick(event) {
  if (event.target.closest("#messageContextMenu")) return;
  if (event.target.closest("[data-action='more']")) return;
  hideMessageContextMenu();
}

function handleMessageContextNativeMenu(event) {
  const messageEl = event.target.closest(".message[data-message-id]");
  if (!messageEl || !elements.chatFeed?.contains(messageEl)) return;
  event.preventDefault();
  openMessageContextMenu(messageEl.dataset.messageId, event);
}

async function handleMessageContextMenuClick(event) {
  const button = event.target.closest("[data-message-context-action]");
  if (!button || !activeMessageContextId) return;
  event.preventDefault();
  event.stopPropagation();

  const messageId = activeMessageContextId;
  const action = button.dataset.messageContextAction;
  const message = state.messages.find((item) => String(item.id) === String(messageId));
  hideMessageContextMenu();
  if (!message) return;

  try {
    if (action === "react") {
      await toggleReaction(messageId, button.dataset.emoji);
    } else if (action === "reply") {
      startReply(messageId);
    } else if (action === "reply-private") {
      toast("Private replies will open when direct conversations are enabled.");
    } else if (action === "copy") {
      await navigator.clipboard?.writeText?.(message.text || message.attachment?.url || message.attachment?.dataUrl || "");
      toast("Copied.");
    } else if (action === "forward") {
      state.replyToMessageId = null;
      elements.messageInput.value = message.text || "";
      state.pendingAttachment = message.attachment ? { ...message.attachment } : null;
      renderAttachmentPreview();
      renderReplyPreview();
      updateComposerAction();
      elements.messageInput.focus();
      toast("Forward prepared. Choose a room and press send.");
    } else if (action === "pin") {
      toast(toggleLocalMessageCollection(PINNED_MESSAGES_KEY, messageId) ? "Message pinned." : "Message unpinned.");
    } else if (action === "star") {
      toast(toggleLocalMessageCollection(STARRED_MESSAGES_KEY, messageId) ? "Message starred." : "Message unstarred.");
    } else if (action === "select") {
      elements.chatFeed?.querySelector(`.message[data-message-id="${cssEscape(messageId)}"]`)?.classList.toggle("selected-message");
    } else if (action === "save") {
      const source = message.attachment?.dataUrl || message.attachment?.url || "";
      if (source) downloadMedia(source, message.attachment?.name || "anonchat-media");
      else {
        await navigator.clipboard?.writeText?.(message.text || "");
        toast("Message text saved to clipboard.");
      }
    } else if (action === "share") {
      await shareMessage(message);
    } else if (action === "report") {
      openReportModal(messageId);
    } else if (action === "block") {
      await blockUserByMessage(messageId);
    } else if (action === "delete-me") {
      await deleteMessage(messageId, "me");
    } else if (action === "delete-everyone") {
      const mine = String(message.authorId) === String(state.session?.user?.id);
      if (!mine && !isAdmin()) {
        toast("Only the sender can delete for everyone.");
        return;
      }
      await deleteMessage(messageId, "everyone");
    }
  } catch (error) {
    handleApiError(error);
  }
}

async function shareMessage(message) {
  const source = message.attachment?.dataUrl || message.attachment?.url || "";
  const text = message.text || message.attachment?.name || "AnonChat message";
  if (navigator.share && (!source || /^https?:\/\//i.test(source))) {
    await navigator.share(source ? { title: "AnonChat", text, url: source } : { title: "AnonChat", text });
    return;
  }
  await navigator.clipboard?.writeText?.(source || text);
  toast(source ? "Media link copied." : "Message copied.");
}

async function confirmBlockUser() {
  const message = state.messages.find((item) => item.id === state.blockMessageId);
  if (!message?.authorId) {
    closeBlockUserModal();
    toast("User not found for this message.");
    return;
  }

  let resetLoading = () => {};
  try {
    resetLoading = setButtonLoading(elements.confirmBlockUserButton, true, "Blocking...");
    await api("/api/users/block", {
      method: "POST",
      body: {
        token: state.session.token,
        blockedUserId: message.authorId,
      },
    });
    state.session.user.blockedUserIds = [...new Set([...(state.session.user.blockedUserIds || []), String(message.authorId)])];
    saveSession(state.session);
    state.blockedUsersLoaded = false;
    state.messages = state.messages.filter((item) => String(item.authorId) !== String(message.authorId));
    closeBlockUserModal();
    renderMessages({ preserveScroll: true });
    toast("User blocked. Their messages are now hidden. \u{1F6AB}");
  } catch (error) {
    handleApiError(error);
  } finally {
    resetLoading();
  }
}

async function clearActiveChatForMe() {
  const currentUserId = state.session?.user?.id;
  const visibleMessages = state.messages.filter(
    (message) =>
      message.roomId === state.activeRoomId &&
      !message.hidden &&
      !(message.deletedFor || []).includes(currentUserId)
  );

  if (visibleMessages.length === 0) {
    toast("This chat is already clear.");
    return;
  }

  const confirmed = window.confirm("Clear this chat only for you?");
  if (!confirmed) return;

  try {
    await Promise.all(
      visibleMessages.map((message) =>
        api(`/api/messages/${message.id}`, {
          method: "DELETE",
          body: {
            token: state.session.token,
            scope: "me",
          },
        })
      )
    );
    await refreshState();
    render();
    toast("Chat cleared for you.");
  } catch (error) {
    handleApiError(error);
  }
}

function leaveActiveRoom() {
  const activeRoom = getActiveRoom();
  const publicRoom = state.rooms[0];
  if (!publicRoom || state.activeRoomId === publicRoom.id) {
    toast("You are already in the public chat.");
    return;
  }

  handleJoinRoom(publicRoom.id);
  toast(`Left ${activeRoom.name || "room"}.`);
}

function blockedAuthorIdSet() {
  return new Set([
    ...(state.session?.user?.blockedUsers || []),
    ...(state.session?.user?.blockedUserIds || []),
    ...(state.blockedUsers || []).map((user) => user.id),
  ].map(String));
}

function isBlockedUserId(userId) {
  return blockedAuthorIdSet().has(String(userId || ""));
}

function renderMessages(options = {}) {
  const activeRoom = getActiveRoom();
  const currentUserId = state.session?.user?.id;
  const feed = elements.chatFeed;
  if (!feed) return;
  const previousScrollTop = feed.scrollTop;
  const previousScrollHeight = feed.scrollHeight;
  const wasNearBottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 96;
  const blockedIds = blockedAuthorIdSet();
  const query = String(state.messageSearchQuery || "").trim().toLowerCase();
  const hasSearchQuery = query.length > 0;
  const messages = state.messages
    .filter((message) => String(message.roomId) === String(activeRoom.id) && !message.hidden)
    .filter((message) => !(message.deletedFor || []).map(String).includes(String(currentUserId)))
    .filter((message) => !blockedIds.has(String(message.authorId)))
    .filter((message) => {
      if (!hasSearchQuery) return true;
      const text = `${message.text || ""} ${message.author || ""}`.toLowerCase();
      return text.includes(query);
    })
    .sort((a, b) => a.createdAt - b.createdAt);

  updateMessageSearchCount(messages.length);

  if (messages.length === 0) {
    const emptyText = hasSearchQuery ? "No matching messages found." : "No messages yet. Start the room conversation.";
    const existingEmpty = feed.firstElementChild?.dataset.renderKey === "empty" ? feed.firstElementChild : null;
    if (!existingEmpty || existingEmpty.textContent !== emptyText || feed.children.length > 1) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.dataset.renderKey = "empty";
      empty.textContent = emptyText;
      feed.replaceChildren(empty);
    }
    messageRenderState = { roomId: String(activeRoom.id || ""), query, ready: true };
    renderReplyPreview();
    updateScrollToBottomButton();
    if (!elements.mediaGalleryModal?.classList.contains("hidden")) renderMediaGallery();
    if (options.preserveScroll) feed.scrollTop = previousScrollTop;
    return;
  }

  const hasMore = messages.length >= 50;
  let lastDateKey = "";
  let previousMessage = null;
  const descriptors = [];
  if (hasMore) {
    descriptors.push({
      key: "load-more",
      html: `
        <button
          class="load-more-btn"
          type="button"
          id="loadMoreMessages">
          Load earlier messages
        </button>
      `,
    });
  }

  let unreadDividerInserted = false;
  messages.forEach((message) => {
    const dateKey = dateSeparatorKey(message.createdAt);
    if (dateKey !== lastDateKey) {
      descriptors.push({
        key: `date:${dateKey}`,
        html: `<div class="date-separator">${escapeHtml(dateKey)}</div>`,
      });
    }

    const delivery = normalizeDelivery(message.delivery);
    if (
      !unreadDividerInserted &&
      String(message.authorId) !== String(currentUserId) &&
      !delivery.seenBy.map(String).includes(String(currentUserId))
    ) {
      unreadDividerInserted = true;
      descriptors.push({
        key: "unread-divider",
        html: `<div class="date-separator unread-divider">Unread messages</div>`,
      });
    }

    const grouped =
      previousMessage &&
      dateKey === lastDateKey &&
      String(previousMessage.authorId) === String(message.authorId) &&
      Number(message.createdAt) - Number(previousMessage.createdAt) <= 2 * 60 * 1000;
    descriptors.push({
      key: `message:${stableMessageRenderKey(message)}`,
      messageId: message.id,
      html: renderMessage(message, grouped),
    });
    lastDateKey = dateKey;
    previousMessage = message;
  });

  const contextChanged =
    messageRenderState.roomId !== String(activeRoom.id || "") ||
    messageRenderState.query !== query ||
    !messageRenderState.ready;
  const changedNodes = reconcileChatFeed(descriptors, { force: Boolean(options.force || contextChanged) });
  const heightDelta = feed.scrollHeight - previousScrollHeight;

  if (options.preserveVisualOffset) {
    feed.scrollTop = previousScrollTop + heightDelta;
  } else if (wasNearBottom || !options.preserveScroll) {
    feed.scrollTop = feed.scrollHeight;
  } else {
    feed.scrollTop = previousScrollTop;
  }

  messageRenderState = { roomId: String(activeRoom.id || ""), query, ready: true };
  renderReplyPreview();
  markVisibleMessagesSeen(messages);
  changedNodes.forEach((node) => attachLightboxToImages(node));
  updateScrollToBottomButton();
  if (!elements.mediaGalleryModal?.classList.contains("hidden")) renderMediaGallery();
}

function stableMessageRenderKey(message = {}) {
  return String(message.clientTempId || message.id || message._id || message.createdAt || "");
}

function isChatNearBottom() {
  const feed = elements.chatFeed;
  if (!feed) return true;
  return feed.scrollHeight - feed.scrollTop - feed.clientHeight < 120;
}

function scrollChatToBottom() {
  const feed = elements.chatFeed;
  if (!feed) return;
  feed.scrollTo({ top: feed.scrollHeight, behavior: "smooth" });
  updateScrollToBottomButton();
}

function updateScrollToBottomButton() {
  if (!elements.scrollToBottomButton || !elements.chatFeed) return;
  const shouldShow = !isChatNearBottom() && !elements.chatView?.classList.contains("hidden");
  elements.scrollToBottomButton.classList.toggle("hidden", !shouldShow);
  const unread = unreadCount(state.activeRoomId);
  if (elements.scrollUnreadBadge) {
    elements.scrollUnreadBadge.textContent = String(Math.min(unread, 99));
    elements.scrollUnreadBadge.classList.toggle("hidden", !shouldShow || unread <= 0);
  }
}

function reconcileChatFeed(descriptors, options = {}) {
  const feed = elements.chatFeed;
  if (!feed) return [];

  if (options.force) {
    const fragment = document.createDocumentFragment();
    const nodes = descriptors.map(createChatFeedNode);
    nodes.forEach((node) => fragment.appendChild(node));
    feed.replaceChildren(fragment);
    return nodes;
  }

  const existing = new Map(
    [...feed.children]
      .map((node) => [node.dataset.renderKey, node])
      .filter(([key]) => key)
  );
  const desiredKeys = new Set(descriptors.map((descriptor) => descriptor.key));
  const changedNodes = [];
  let lastPlaced = null;

  descriptors.forEach((descriptor) => {
    let node = existing.get(descriptor.key);
    const signature = chatFeedSignature(descriptor.html);

    if (!node) {
      node = createChatFeedNode(descriptor, signature);
      changedNodes.push(node);
    } else if (node.dataset.renderSignature !== signature) {
      const replacement = createChatFeedNode(descriptor, signature);
      copyTransientMessageClasses(node, replacement);
      node.replaceWith(replacement);
      node = replacement;
      changedNodes.push(node);
    }

    if (!lastPlaced) {
      if (feed.firstChild !== node) feed.insertBefore(node, feed.firstChild);
    } else if (lastPlaced.nextSibling !== node) {
      feed.insertBefore(node, lastPlaced.nextSibling);
    }
    lastPlaced = node;
  });

  [...feed.children].forEach((node) => {
    if (!desiredKeys.has(node.dataset.renderKey)) node.remove();
  });

  return changedNodes;
}

function createChatFeedNode(descriptor, signature = chatFeedSignature(descriptor.html)) {
  const template = document.createElement("template");
  template.innerHTML = String(descriptor.html || "").trim();
  const node = template.content.firstElementChild || document.createElement("div");
  node.dataset.renderKey = descriptor.key;
  node.dataset.renderSignature = signature;
  return node;
}

function copyTransientMessageClasses(source, target) {
  ["selected-message", "touch-actions-open", "ctx-selected"].forEach((className) => {
    if (source.classList.contains(className)) target.classList.add(className);
  });
}

function chatFeedSignature(value) {
  const text = String(value || "");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return String(hash);
}

async function loadEarlierMessages(button) {
  const activeRoom = getActiveRoom();
  const roomMessages = state.messages
    .filter((message) => message.roomId === activeRoom.id)
    .sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
  const first = roomMessages[0];
  if (!first) return;

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Loading...";

  try {
    const before = new Date(Number(first.createdAt)).toISOString();
    const data = await api(`/api/messages?roomId=${encodeURIComponent(activeRoom.id)}&limit=50&before=${encodeURIComponent(before)}`);
    (data.messages || []).forEach(upsertMessage);
    renderMessages({ preserveScroll: true, preserveVisualOffset: true });
  } catch (error) {
    handleApiError(error);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function loadRecentMessagesForRoom(roomId, options = {}) {
  const normalizedRoomId = String(roomId || "");
  if (!normalizedRoomId || !state.session?.token || isAdmin()) return;

  const lastLoadedAt = roomMessagesLoadedAt.get(normalizedRoomId) || 0;
  if (!options.force && Date.now() - lastLoadedAt < 10000) return;

  roomMessagesLoadedAt.set(normalizedRoomId, Date.now());
  const fetchToken = ++roomMessageFetchToken;
  const data = await api(`/api/messages?roomId=${encodeURIComponent(normalizedRoomId)}&limit=50`);
  const incomingMessages = data.messages || [];
  if (!incomingMessages.length) return;

  incomingMessages.forEach(upsertMessage);

  if (
    options.renderAfter &&
    fetchToken === roomMessageFetchToken &&
    String(state.activeRoomId) === normalizedRoomId &&
    state.route === CHAT_ROUTE
  ) {
    renderMessages({ preserveScroll: true });
    scheduleRoomSummaryRender();
  }
}

function messageActionHtml(message, mine, deleted) {
  if (isAdmin() || deleted) return "";

  const common = `
    <button class="message-action" type="button" data-action="react-menu" data-message-id="${escapeAttr(message.id)}" aria-label="React" title="React"><span>&#128522;</span><em>React</em></button>
    <button class="message-action" type="button" data-action="reply" data-message-id="${escapeAttr(message.id)}" aria-label="Reply" title="Reply"><span>&#8617;</span><em>Reply</em></button>
    <button class="message-action" type="button" data-action="more" data-message-id="${escapeAttr(message.id)}" aria-label="More actions" title="More"><span>&#8942;</span><em>More</em></button>
  `;

  if (mine) {
    return `
      ${common}
      <button class="message-action" type="button" data-action="edit" data-message-id="${escapeAttr(message.id)}" aria-label="Edit" title="Edit"><span>&#9999;&#65039;</span><em>Edit</em></button>
      <button class="message-action" type="button" data-action="delete" data-message-id="${escapeAttr(message.id)}" aria-label="Delete" title="Delete"><span>&#128465;&#65039;</span><em>Delete</em></button>
    `;
  }

  return `
    ${common}
    <button class="message-action" type="button" data-action="report" data-message-id="${escapeAttr(message.id)}" aria-label="Report" title="Report"><span>&#128681;</span><em>Report</em></button>
    <button class="message-action" type="button" data-action="block" data-message-id="${escapeAttr(message.id)}" aria-label="Block" title="Block"><span>&#128683;</span><em>Block</em></button>
  `;
}

function renderMessage(message, grouped = false) {
  const user = state.session.user;
  const mine = String(message.authorId) === String(user.id);
  const pinned = loadMessageCollection(PINNED_MESSAGES_KEY).includes(String(message.id));
  const starred = loadMessageCollection(STARRED_MESSAGES_KEY).includes(String(message.id));
  const profileAttrs = `data-profile-author-id="${escapeAttr(message.authorId)}" data-author-id="${escapeAttr(message.authorId)}" data-author="${escapeAttr(message.author || "Anonymous")}"`;
  const reactedBy = Array.isArray(message.reactedBy) ? message.reactedBy : [];
  const canEdit = true;
  const deleted = Boolean(message.deletedAt);
  const legacyActions = isAdmin()
    ? ""
    : deleted
      ? ""
    : `
      <button class="message-action" type="button" data-action="react-menu" data-message-id="${message.id}" aria-label="React"><span>😊</span><em>React</em></button>
      <button class="message-action" type="button" data-action="reply" data-message-id="${message.id}" aria-label="Reply"><span>↩</span><em>Reply</em></button>
      ${
        mine
          ? `${canEdit ? `<button class="message-action" type="button" data-action="edit" data-message-id="${message.id}" aria-label="Edit"><span>✏️</span><em>Edit</em></button>` : ""}
             <button class="message-action" type="button" data-action="delete" data-message-id="${message.id}" aria-label="Delete"><span>🗑️</span><em>Delete</em></button>`
          : `<button class="message-action" type="button" data-action="report" data-message-id="${message.id}" aria-label="Report"><span>🚩</span><em>Report</em></button>`
      }
    `;
  const actions = messageActionHtml(message, mine, deleted);
  const delivery = normalizeDelivery(message.delivery);
  const deliveryClass = message.localStatus === "failed"
    ? "failed"
    : message.localStatus === "pending"
      ? "pending"
      : delivery.seenBy.length
        ? "seen"
        : delivery.deliveredTo.length
          ? "delivered"
          : "sent";
  const deliveryStatus = mine ? `<span class="delivery-status ${deliveryClass}">${messageDeliveryLabel(message)}</span>` : "";
  const replyBlock = message.replyTo && !deleted
    ? `<div class="message-reply" role="button" tabindex="0" data-jump-message-id="${escapeAttr(message.replyTo.id || message.replyTo.messageId || "")}" title="Jump to original message">
        <strong>${escapeHtml(message.replyTo.author || "Message")}</strong>
        <span>${escapeHtml(replyPreviewText(message.replyTo))}</span>
      </div>`
    : "";
  const bodyBlock = deleted
    ? `<p class="message-text deleted-message">This message was deleted</p>`
    : message.type === "poll"
      ? renderPoll(message)
      : `<p class="message-text">${highlightedMessageText(message.text)}</p>`;
  const attachmentBlock = deleted ? "" : renderAttachment(message.attachment);
  const reactionPicker = state.activeReactionMessageId === message.id ? renderReactionPicker(message.id) : "";
  const reactionBlock = deleted ? "" : renderMessageReactions(message);

  return `
    <article class="message ${mine ? "mine" : ""} ${grouped ? "grouped" : ""} ${pinned ? "pinned-message" : ""} ${starred ? "starred-message" : ""}" data-message-id="${escapeAttr(message.id)}">
      ${grouped ? `<span class="avatar avatar-spacer" aria-hidden="true"></span>` : renderAvatar(message.author, message.avatarColor, message.avatarDataUrl, "msg-avatar", profileAttrs)}
      <div class="message-card">
        ${actions ? `<div class="message-tools">${actions}</div>` : ""}
        ${reactionPicker}
        <div class="message-top">
          <button class="message-sender msg-author" type="button" ${profileAttrs}>${escapeHtml(message.author)}</button>
          <span>${relativeTime(message.createdAt)}</span>
          ${!mine ? `<span class="presence-chip ${presenceStatusForUser(message.authorId).online ? "online" : "offline"}" data-presence-user-id="${escapeAttr(message.authorId)}">${escapeHtml(presenceLabel(message.authorId))}</span>` : ""}
          ${message.editedAt ? `<span>edited</span>` : ""}
          ${pinned ? `<span class="message-flag">pinned</span>` : ""}
          ${starred ? `<span class="message-flag">starred</span>` : ""}
          ${deliveryStatus}
          ${message.reported ? `<span class="message-flag">review</span>` : ""}
        </div>
        ${replyBlock}
        ${bodyBlock}
        ${attachmentBlock}
        ${reactionBlock}
      </div>
    </article>
  `;
}

function renderReactionPicker(messageId) {
  const recent = loadRecentReactions().filter((emoji) => MESSAGE_REACTION_EMOJIS.includes(emoji));
  const ordered = [...new Set([...recent, ...MESSAGE_REACTION_EMOJIS])];
  return `
    <div class="message-reaction-picker">
      <input class="reaction-search" type="search" placeholder="Search emoji..." aria-label="Search reactions" />
      ${recent.length ? `<span class="reaction-recent">Recent</span>` : ""}
      ${ordered.map(
        (emoji) => `<button type="button" data-action="react-emoji" data-message-id="${escapeAttr(messageId)}" data-emoji="${escapeAttr(emoji)}" data-emoji-label="${escapeAttr(reactionEmojiLabel(emoji))}">${escapeHtml(emoji)}</button>`
      ).join("")}
    </div>
  `;
}

function reactionEmojiLabel(emoji) {
  const labels = {
    "\u2764\uFE0F": "heart love",
    "\u{1F602}": "laugh funny",
    "\u{1F525}": "fire hot",
    "\u{1F44D}": "thumbs up like",
    "\u{1F62D}": "cry sad",
    "\u{1F440}": "eyes watching",
    "\u{1F389}": "party celebrate",
  };
  return labels[emoji] || emoji;
}

function loadRecentReactions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_REACTIONS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.slice(0, 7) : [];
  } catch {
    return [];
  }
}

function saveRecentReaction(emoji) {
  const next = [emoji, ...loadRecentReactions().filter((item) => item !== emoji)].slice(0, 7);
  localStorage.setItem(RECENT_REACTIONS_KEY, JSON.stringify(next));
}

function handleChatFeedInput(event) {
  const search = event.target.closest(".reaction-search");
  if (!search) return;
  const query = search.value.trim().toLowerCase();
  search.closest(".message-reaction-picker")?.querySelectorAll("[data-emoji-label]").forEach((button) => {
    const label = `${button.dataset.emojiLabel || ""} ${button.dataset.emoji || ""}`.toLowerCase();
    button.hidden = Boolean(query && !label.includes(query));
  });
}

function renderMessageReactions(message) {
  const summary = message.reactionSummary && typeof message.reactionSummary === "object" ? message.reactionSummary : {};
  const entries = Object.entries(summary).filter(([, count]) => Number(count) > 0);
  if (!entries.length && message.reactions) entries.push(["\u{1F44D}", Number(message.reactions)]);
  if (!entries.length) return "";

  const userReaction = message.userReaction || message.reactionsByUser?.[state.session?.user?.id] || "";
  return `
    <div class="message-reactions">
      ${entries.map(([emoji, count]) => `
        <button
          class="reaction ${emoji === userReaction ? "mine" : ""}"
          type="button"
          data-action="react-emoji"
          data-message-id="${escapeAttr(message.id)}"
          data-emoji="${escapeAttr(emoji)}">
          ${escapeHtml(emoji)} ${numberText(count)}
        </button>
      `).join("")}
    </div>
  `;
}

function replyPreviewText(message = {}) {
  const attachment = message.attachment || {};
  if (message.text) return message.text;
  if (attachment.voiceNote) return "Voice note";
  if (attachment.kind === "image") return "Image";
  if (attachment.kind === "video") return "Video";
  if (attachment.kind === "audio") return "Audio";
  if (attachment.kind === "file") return attachment.name || "File";
  return attachment.name || "Attachment";
}

function renderReplyPreview() {
  const editingMessage = state.editingMessageId
    ? state.messages.find((item) => item.id === state.editingMessageId)
    : null;

  if (editingMessage) {
    elements.replyPreview.classList.remove("hidden");
    elements.replyPreview.classList.add("edit-preview");
    elements.replyPreview.innerHTML = `
      <div>
        <strong>✏️ Editing message</strong>
        <span>${escapeHtml(editingMessage.text || "")}</span>
      </div>
      <button class="icon-btn" type="button" id="cancelEditButton" aria-label="Cancel edit">&times;</button>
    `;

    elements.replyPreview.querySelector("#cancelEditButton").addEventListener("click", () => {
      state.editingMessageId = null;
      elements.messageInput.value = "";
      updateComposerAction();
      renderReplyPreview();
    });
    return;
  }

  const message = state.messages.find((item) => item.id === state.replyToMessageId);

  if (!message) {
    elements.replyPreview.classList.add("hidden");
    elements.replyPreview.classList.remove("edit-preview");
    elements.replyPreview.innerHTML = "";
    return;
  }

  elements.replyPreview.classList.remove("hidden");
  elements.replyPreview.classList.remove("edit-preview");
  elements.replyPreview.innerHTML = `
    <div>
      <strong>↩ Replying to ${escapeHtml(message.author)}</strong>
      <span>${escapeHtml(replyPreviewText(message))}</span>
    </div>
    <button class="icon-btn" type="button" id="cancelReplyButton" aria-label="Cancel reply">&times;</button>
  `;

  const cancelButton = elements.replyPreview.querySelector("#cancelReplyButton");
  cancelButton.addEventListener("click", () => {
    state.replyToMessageId = null;
    renderReplyPreview();
  });
}

function renderAttachment(attachment) {
  if (!attachment) return "";
  const source = attachmentPlayableSource(attachment);
  const name = attachment.name || "Attachment";
  const actions = mediaAttachmentActions(source, name, attachment.kind);
  const secureMediaAttrs = mediaSecurityAttrs(source);

  if (attachment.kind === "image") {
    return `
      <div class="message-attachment image-attachment">
        <img
          class="message-image msg-image chat-image"
          loading="lazy"
          src="${escapeAttr(source)}"
          alt="${escapeAttr(name || "Image")}"
          ${secureMediaAttrs}
          data-lightbox-image="true"
          data-media-viewer="true"
          data-media-type="image"
          data-media-src="${escapeAttr(source)}"
          data-media-caption="${escapeAttr(name)}"
        />
        ${actions}
      </div>
    `;
  }

  if (attachment.kind === "audio") {
    return `
      <div class="message-attachment audio-attachment ${attachment.voiceNote ? "voice-note-attachment" : ""}">
        <div class="voice-note-shell">
          <button class="voice-play-btn" type="button" data-voice-play aria-label="Play voice note">Play</button>
          <div class="voice-waveform" aria-hidden="true">${Array.from({ length: 18 }, () => "<i></i>").join("")}</div>
          <div class="voice-note-controls">
            ${source ? `<audio preload="metadata" src="${escapeAttr(source)}"${secureMediaAttrs} data-voice-audio data-voice-source="${escapeAttr(source)}" data-mime="${escapeAttr(normalizeMimeType(attachment.mimeType || "audio/webm"))}"></audio>` : `<span class="voice-note-error">Audio unavailable</span>`}
            <button class="voice-speed-btn" type="button" data-voice-speed>1x</button>
          </div>
        </div>
        <span>${escapeHtml(attachment.voiceNote ? `Voice note${attachment.duration ? ` - ${formatCallClock(attachment.duration)}` : ""}` : name)}</span>
        ${actions}
      </div>
    `;
  }

  if (attachment.kind === "video") {
    return `
      <div class="message-attachment video-attachment">
        <video controls playsinline src="${escapeAttr(source)}"${secureMediaAttrs}></video>
        <span>${escapeHtml(name)}</span>
        ${actions}
      </div>
    `;
  }

  return `
    <div class="message-attachment file-attachment">
      <strong>${escapeHtml(name)}</strong>
      <span>${formatBytes(attachment.size)}</span>
      ${actions}
    </div>
  `;
}

function attachmentPlayableSource(attachment = {}) {
  const source = attachment.url || attachment.dataUrl || "";
  if (/^https?:\/\//i.test(source)) return source;
  if (/^blob:/i.test(source)) return source;
  if (/^data:audio\/[^;]+;base64,/i.test(source)) return source;
  if (/^data:(image|video|application|text)\//i.test(source)) return source;
  return "";
}

function isRemoteMediaSource(source = "") {
  return /^https?:\/\//i.test(String(source || ""));
}

function mediaSecurityAttrs(source = "") {
  return isRemoteMediaSource(source) ? ' crossorigin="anonymous" referrerpolicy="no-referrer"' : "";
}

function applyMediaElementSecurity(element, source = "") {
  if (!element) return;
  if (isRemoteMediaSource(source)) {
    element.crossOrigin = "anonymous";
    element.referrerPolicy = "no-referrer";
  } else {
    element.removeAttribute("crossorigin");
    element.removeAttribute("referrerpolicy");
  }
}

async function toggleVoiceNotePlayback(button) {
  const shell = button.closest(".voice-note-shell");
  const audio = shell?.querySelector("audio[data-voice-audio]");
  if (!audio?.src) {
    toast("Voice note audio is not available.");
    return;
  }

  document.querySelectorAll(".voice-note-shell audio[data-voice-audio]").forEach((candidate) => {
    if (candidate !== audio && !candidate.paused) candidate.pause();
  });

  try {
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
    syncVoicePlayButton(audio);
  } catch (error) {
    console.warn("Voice note playback failed:", error);
    toast("Could not play this voice note.");
  }
}

function handleVoiceAudioStateChange(event) {
  const audio = event.target?.matches?.("audio[data-voice-audio]") ? event.target : null;
  if (!audio) return;
  syncVoicePlayButton(audio);
}

function syncVoicePlayButton(audio) {
  const shell = audio.closest(".voice-note-shell");
  const button = shell?.querySelector("[data-voice-play]");
  if (!button) return;

  const playing = !audio.paused && !audio.ended;
  button.textContent = playing ? "Pause" : "Play";
  button.setAttribute("aria-label", playing ? "Pause voice note" : "Play voice note");
  shell?.classList.toggle("playing", playing);
}

function mediaAttachmentActions(source, name = "Attachment", type = "file") {
  if (!source) return "";
  const canPreview = ["image", "video", "audio"].includes(type);
  return `
    <div class="media-attachment-actions">
      ${canPreview ? `<button type="button" data-media-action="open" data-media-src="${escapeAttr(source)}" data-media-name="${escapeAttr(name)}" data-media-type="${escapeAttr(type)}">Open</button>` : ""}
      <button type="button" data-media-action="download" data-media-src="${escapeAttr(source)}" data-media-name="${escapeAttr(name)}">Download</button>
      <button type="button" data-media-action="share" data-media-src="${escapeAttr(source)}" data-media-name="${escapeAttr(name)}">Share</button>
    </div>
  `;
}

function openMediaGallery() {
  if (!elements.mediaGalleryModal) return;
  mediaGalleryTab = mediaGalleryTab || "images";
  elements.mediaGalleryModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  renderMediaGallery();
}

function closeMediaGallery() {
  elements.mediaGalleryModal?.classList.add("hidden");
  if (elements.imageLightbox?.style.display !== "flex") document.body.style.overflow = "";
}

function switchMediaGalleryTab(tab) {
  mediaGalleryTab = tab || "images";
  elements.mediaGalleryTabs?.forEach((button) => {
    button.classList.toggle("active", button.dataset.galleryTab === mediaGalleryTab);
  });
  renderMediaGallery();
}

function mediaGalleryItems() {
  const activeRoomId = String(getActiveRoom()?.id || state.activeRoomId || "");
  const items = [];
  const linkRegex = /https?:\/\/[^\s<>"']+/gi;

  state.messages
    .filter((message) => String(message.roomId || "") === activeRoomId && !message.hidden && !message.deletedAt)
    .forEach((message) => {
      const attachment = message.attachment;
      if (attachment) {
        const source = attachmentPlayableSource(attachment);
        const kind = attachment.voiceNote ? "voice" : attachment.kind;
        items.push({
          id: `${message.id}:attachment`,
          tab: kind === "image" ? "images" : kind === "video" ? "videos" : kind === "voice" ? "voice" : "files",
          type: attachment.kind,
          source,
          name: attachment.name || (attachment.voiceNote ? "Voice note" : "Attachment"),
          message,
          attachment,
        });
      }

      String(message.text || "").match(linkRegex)?.forEach((url, index) => {
        items.push({
          id: `${message.id}:link:${index}`,
          tab: "links",
          type: "link",
          source: url,
          name: url.replace(/^https?:\/\//i, ""),
          message,
        });
      });
    });

  return items.sort((a, b) => Number(b.message.createdAt || 0) - Number(a.message.createdAt || 0));
}

function renderMediaGallery() {
  const grid = elements.mediaGalleryGrid;
  if (!grid) return;
  const items = mediaGalleryItems().filter((item) => item.tab === mediaGalleryTab);
  elements.mediaGalleryTabs?.forEach((button) => {
    button.classList.toggle("active", button.dataset.galleryTab === mediaGalleryTab);
  });

  if (!items.length) {
    grid.innerHTML = `<div class="gallery-empty">No ${escapeHtml(mediaGalleryTab.replace("-", " "))} shared yet.</div>`;
    return;
  }

  grid.innerHTML = items.map(renderMediaGalleryItem).join("");
}

function renderMediaGalleryItem(item) {
  const name = escapeHtml(item.name || "Shared media");
  const source = escapeAttr(item.source || "");
  const time = escapeHtml(relativeTime(item.message.createdAt));

  if (item.type === "image") {
    return `
      <button class="gallery-item" type="button" data-gallery-action="open" data-media-type="image" data-media-src="${source}" data-media-name="${escapeAttr(item.name)}">
        <img loading="lazy" src="${source}" alt="${escapeAttr(item.name || "Image")}"${mediaSecurityAttrs(item.source)} />
      </button>
    `;
  }

  if (item.type === "video") {
    return `
      <button class="gallery-item" type="button" data-gallery-action="open" data-media-type="video" data-media-src="${source}" data-media-name="${escapeAttr(item.name)}">
        <video muted preload="metadata" src="${source}"${mediaSecurityAttrs(item.source)}></video>
      </button>
    `;
  }

  if (item.type === "audio") {
    return `
      <button class="gallery-item file-like" type="button" data-gallery-action="open" data-media-type="audio" data-media-src="${source}" data-media-name="${escapeAttr(item.name)}">
        <strong>${item.attachment?.voiceNote ? "Voice note" : name}</strong>
        <span>${escapeHtml(formatBytes(item.attachment?.size || 0))} - ${time}</span>
      </button>
    `;
  }

  if (item.type === "link") {
    return `
      <a class="gallery-item file-like" href="${source}" target="_blank" rel="noopener noreferrer">
        <strong>${name}</strong>
        <span>${time}</span>
      </a>
    `;
  }

  return `
    <button class="gallery-item file-like" type="button" data-gallery-action="download" data-media-src="${source}" data-media-name="${escapeAttr(item.name)}">
      <strong>${name}</strong>
      <span>${escapeHtml(formatBytes(item.attachment?.size || 0))} - ${time}</span>
    </button>
  `;
}

async function handleMediaGalleryClick(event) {
  const target = event.target.closest("[data-gallery-action]");
  if (!target) return;
  event.preventDefault();
  const source = target.dataset.mediaSrc || "";
  const name = target.dataset.mediaName || "Shared media";
  if (target.dataset.galleryAction === "open") {
    openLightbox(source, name, target.dataset.mediaType || "image");
  } else {
    await downloadMedia(source, name);
  }
}

function isAvatarLightboxImage(img) {
  return Boolean(
    img?.closest?.(".avatar, .msg-avatar, .profile-chip, .profile-photo-button, .big-avatar, .admin-table-user, .brand-mark") ||
      img?.classList?.contains("avatar") ||
      img?.classList?.contains("msg-avatar")
  );
}

function attachLightboxToImages(root = null) {
  const scope = root || elements.chatFeed || document.querySelector("#chatFeed, .chat-feed, #messages");
  if (!scope) return;

  const images = scope.matches?.("img") ? [scope] : [...scope.querySelectorAll("img")];
  images.forEach((img) => {
    if (isAvatarLightboxImage(img)) return;

    const parent = img.parentElement;
    if (parent?.tagName === "A") {
      const wrapper = document.createElement("div");
      wrapper.className = parent.className || "message-attachment image-attachment";
      parent.replaceWith(wrapper);
      wrapper.appendChild(img);
    }

    img.classList.add("message-image", "msg-image", "chat-image");
    img.dataset.lightboxImage = "true";
    img.style.cursor = "zoom-in";
    applyMediaElementSecurity(img, img.currentSrc || img.src);
    img.removeAttribute("onclick");
    img.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      openLightbox(img.src, img.alt || "");
    };
  });
}

function openLightbox(src, caption = "", type = "image") {
  const lightbox = elements.imageLightbox || document.getElementById("imageLightbox");
  const img = elements.lightboxImg || document.getElementById("lightboxImg");
  const video = elements.lightboxVideo || document.getElementById("lightboxVideo");
  const audio = elements.lightboxAudio || document.getElementById("lightboxAudio");
  const cap = elements.lightboxCaption || document.getElementById("lightboxCaption");
  if (!lightbox || !src) return;

  stopMediaPlayback();
  mediaViewerState = {
    type,
    src,
    caption,
    scale: 1,
    panX: 0,
    panY: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  };

  [img, video, audio].forEach((item) => {
    if (!item) return;
    item.classList.add("hidden");
    item.removeAttribute("src");
    item.removeAttribute("crossorigin");
    item.removeAttribute("referrerpolicy");
    item.style.transform = "";
  });

  if (type === "video" && video) {
    applyMediaElementSecurity(video, src);
    video.src = src;
    video.classList.remove("hidden");
  } else if (type === "audio" && audio) {
    applyMediaElementSecurity(audio, src);
    audio.src = src;
    audio.classList.remove("hidden");
  } else if (img) {
    applyMediaElementSecurity(img, src);
    img.src = src;
    img.alt = caption || "Image";
    img.classList.remove("hidden");
  }

  elements.lightboxZoomIn?.classList.toggle("hidden", type !== "image");
  elements.lightboxZoomOut?.classList.toggle("hidden", type !== "image");
  if (cap) cap.textContent = caption || "";
  lightbox.style.display = "flex";
  lightbox.style.opacity = "";
  lightbox.style.transition = "";
  lightbox.style.animation = "";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = elements.imageLightbox || document.getElementById("imageLightbox");
  if (!lightbox || lightbox.style.display === "none") return;

  stopMediaPlayback();
  lightbox.style.animation = "none";
  lightbox.style.opacity = "0";
  lightbox.style.transition = "opacity 0.15s";

  window.setTimeout(() => {
    lightbox.style.display = "none";
    lightbox.style.opacity = "";
    lightbox.style.transition = "";
    lightbox.style.animation = "";
    const img = elements.lightboxImg || document.getElementById("lightboxImg");
    if (img) {
      img.src = "";
      img.removeAttribute("crossorigin");
      img.removeAttribute("referrerpolicy");
    }
    const video = elements.lightboxVideo || document.getElementById("lightboxVideo");
    const audio = elements.lightboxAudio || document.getElementById("lightboxAudio");
    if (video) {
      video.removeAttribute("src");
      video.removeAttribute("crossorigin");
      video.removeAttribute("referrerpolicy");
    }
    if (audio) {
      audio.removeAttribute("src");
      audio.removeAttribute("crossorigin");
      audio.removeAttribute("referrerpolicy");
    }
    document.body.style.overflow = "";
  }, 150);
}

function handleLightboxKeydown(event) {
  const lightbox = elements.imageLightbox || document.getElementById("imageLightbox");
  if (lightbox?.style.display === "none") return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "+" || event.key === "=") zoomMediaViewer(0.25);
  if (event.key === "-") zoomMediaViewer(-0.25);
}

function openImageLightbox(src, caption = "") {
  openLightbox(src, caption, "image");
}

function closeImageLightbox() {
  closeLightbox();
}

function stopMediaPlayback() {
  [elements.lightboxVideo, elements.lightboxAudio].forEach((item) => {
    if (!item) return;
    item.pause?.();
    item.currentTime = 0;
  });
}

function applyMediaViewerTransform() {
  const img = elements.lightboxImg || document.getElementById("lightboxImg");
  if (!img || mediaViewerState.type !== "image") return;
  img.style.transform = `translate(${mediaViewerState.panX}px, ${mediaViewerState.panY}px) scale(${mediaViewerState.scale})`;
  img.style.cursor = mediaViewerState.scale > 1 ? "grab" : "zoom-in";
}

function zoomMediaViewer(delta) {
  if (mediaViewerState.type !== "image") return;
  mediaViewerState.scale = Math.max(0.5, Math.min(5, mediaViewerState.scale + delta));
  if (mediaViewerState.scale <= 1) {
    mediaViewerState.panX = 0;
    mediaViewerState.panY = 0;
  }
  applyMediaViewerTransform();
}

function handleMediaViewerWheel(event) {
  if (mediaViewerState.type !== "image") return;
  event.preventDefault();
  zoomMediaViewer(event.deltaY < 0 ? 0.18 : -0.18);
}

function startMediaPan(event) {
  if (mediaViewerState.type !== "image" || mediaViewerState.scale <= 1 || event.target.closest("button")) return;
  mediaViewerState.dragging = true;
  mediaViewerState.startX = event.clientX;
  mediaViewerState.startY = event.clientY;
  mediaViewerState.originX = mediaViewerState.panX;
  mediaViewerState.originY = mediaViewerState.panY;
  event.target.setPointerCapture?.(event.pointerId);
}

function moveMediaPan(event) {
  if (!mediaViewerState.dragging) return;
  mediaViewerState.panX = mediaViewerState.originX + event.clientX - mediaViewerState.startX;
  mediaViewerState.panY = mediaViewerState.originY + event.clientY - mediaViewerState.startY;
  applyMediaViewerTransform();
}

function stopMediaPan() {
  mediaViewerState.dragging = false;
}

function downloadOpenMedia() {
  downloadMedia(mediaViewerState.src, mediaViewerState.caption || "anonchat-media");
}

async function shareOpenMedia() {
  await shareMedia(mediaViewerState.src, mediaViewerState.caption || "AnonChat media");
}

function downloadMedia(src, name = "anonchat-media") {
  if (!src) return;
  const link = document.createElement("a");
  link.href = src;
  link.download = name || "anonchat-media";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function shareMedia(src, name = "AnonChat media") {
  if (!src) return;
  if (navigator.share && /^https?:\/\//i.test(src)) {
    await navigator.share({ title: name, url: src });
    return;
  }
  await navigator.clipboard?.writeText?.(src);
  toast("Media link copied.");
}

function renderPoll(message) {
  const poll = message.poll || { question: message.text, options: [] };
  const options = Array.isArray(poll.options) ? poll.options : [];
  const totalVotes = options.reduce((sum, option) => sum + (option.votes || 0), 0);
  const userId = state.session?.user?.id;

  return `
    <div class="poll-card">
      <strong>${escapeHtml(poll.question || message.text)}</strong>
      <div class="poll-options">
        ${options
          .map((option) => {
            const voted = (option.votedBy || []).includes(userId);
            const percent = totalVotes ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
            return `
              <button class="poll-option ${voted ? "active" : ""}" type="button" data-action="vote-poll" data-message-id="${message.id}" data-option-id="${option.id}">
                <span>${escapeHtml(option.text)}</span>
                <small>${option.votes || 0} votes</small>
                <i style="width:${percent}%"></i>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function startReply(messageId) {
  state.editingMessageId = null;
  state.activeReactionMessageId = null;
  state.replyToMessageId = messageId;
  elements.messageInput.focus();
  renderReplyPreview();
}

function jumpToMessage(messageId) {
  if (!messageId) return;
  const target = elements.chatFeed?.querySelector(`.message[data-message-id="${escapeCssIdentifier(String(messageId))}"]`);
  if (!target) {
    toast("Original message is not loaded in this chat.");
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.classList.add("jump-highlight");
  window.setTimeout(() => target.classList.remove("jump-highlight"), 1300);
}

function escapeCssIdentifier(value) {
  return window.CSS?.escape ? window.CSS.escape(value) : value.replace(/["\\]/g, "\\$&");
}

function handleMessageTouchStart(event) {
  const message = event.target.closest(".message");
  if (!message) return;

  clearMessageLongPressTimer();
  const touch = event.touches?.[0];
  messageTouchState = touch
    ? {
        message,
        startX: touch.clientX,
        startY: touch.clientY,
        latestX: touch.clientX,
        latestY: touch.clientY,
      }
    : null;
  messageLongPressTimer = window.setTimeout(() => {
    elements.chatFeed.querySelectorAll(".message.touch-actions-open").forEach((item) => {
      if (item !== message) item.classList.remove("touch-actions-open");
    });
    message.classList.add("touch-actions-open");
    if (message.dataset.messageId && touch) {
      openMessageContextMenu(message.dataset.messageId, {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    }
    if (navigator.vibrate) navigator.vibrate(35);
  }, 500);
}

function handleMessageTouchMove(event) {
  if (!messageTouchState) return;
  const touch = event.touches?.[0];
  if (!touch) return;
  messageTouchState.latestX = touch.clientX;
  messageTouchState.latestY = touch.clientY;
  const deltaX = touch.clientX - messageTouchState.startX;
  const deltaY = Math.abs(touch.clientY - messageTouchState.startY);

  if (deltaY > 36 || Math.abs(deltaX) > 16) clearMessageLongPressTimer();
  messageTouchState.message.classList.toggle("reply-swipe-hint", deltaX > 44 && deltaY < 42);
}

function handleMessageTouchEnd() {
  const touchState = messageTouchState;
  clearMessageLongPressTimer();
  messageTouchState = null;
  if (!touchState?.message) return;

  touchState.message.classList.remove("reply-swipe-hint");
  const deltaX = touchState.latestX - touchState.startX;
  const deltaY = Math.abs(touchState.latestY - touchState.startY);
  if (deltaX > 72 && deltaY < 46 && touchState.message.dataset.messageId) {
    startReply(touchState.message.dataset.messageId);
    if (navigator.vibrate) navigator.vibrate(20);
  }
}

function clearMessageLongPressTimer() {
  if (!messageLongPressTimer) return;
  window.clearTimeout(messageLongPressTimer);
  messageLongPressTimer = null;
}

function dateSeparatorKey(timestamp) {
  const date = new Date(Number(timestamp));
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: today.getFullYear() === date.getFullYear() ? undefined : "numeric",
  });
}

function messageDeliveryLabel(message) {
  if (message.localStatus === "pending") return "Sending...";
  if (message.localStatus === "failed") return "Failed";
  const delivery = normalizeDelivery(message.delivery);
  if (delivery.seenBy.length > 0) return "\u2713\u2713 Seen";
  if (delivery.deliveredTo.length > 0) return "\u2713\u2713 Delivered";
  return "\u2713 Sent";
}

function messageDeliveryText(message) {
  const delivery = normalizeDelivery(message.delivery);
  if (delivery.seenBy.length > 0) return "✓✓";
  if (delivery.deliveredTo.length > 0) return "✓✓";
  return "✓";
}

function markVisibleMessagesSeen(messages) {
  if (!socket?.connected || !state.session?.token || isAdmin()) return;
  const hasUnreadFromOthers = messages.some((message) => {
    const delivery = normalizeDelivery(message.delivery);
    return String(message.authorId) !== String(state.session.user.id) && !delivery.seenBy.map(String).includes(String(state.session.user.id));
  });
  if (!hasUnreadFromOthers) return;

  socket.emit("message:seen", {
    token: state.session.token,
    roomId: state.activeRoomId,
  });
}

function markMessageDeliveredAndSeen(message) {
  if (!socket?.connected || !state.session?.token || isAdmin()) return;
  if (String(message.authorId) === String(state.session.user.id)) return;

  socket.emit("message:delivered", {
    token: state.session.token,
    messageId: message.id,
  });

  if (message.roomId === state.activeRoomId) {
    socket.emit("message:seen", {
      token: state.session.token,
      roomId: state.activeRoomId,
    });
  }
}

function renderTypingIndicator() {
  const user = state.session?.user;
  const now = Date.now();
  state.typing = state.typing.filter((item) => !item.expiresAt || Number(item.expiresAt) > now);
  const names = [...new Set(state.typing
    .filter((item) => String(item.roomId) === String(state.activeRoomId) && String(item.userId) !== String(user?.id))
    .map((item) => item.name || "Someone"))];

  if (names.length === 0) {
    elements.typingIndicator.classList.add("hidden");
    elements.typingIndicator.innerHTML = "";
    return;
  }

  const label = names.length === 1
    ? `${names[0]} is typing`
    : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : `${names[0]} and ${names.length - 1} others are typing`;

  elements.typingIndicator.classList.remove("hidden");
  elements.typingIndicator.innerHTML = `
    ${escapeHtml(label)}
    <span class="typing-dots"><span></span><span></span><span></span></span>
  `;
}

function renderAdminDashboard() {
  if (!elements.adminDashboardShell) return;
  const route = currentAdminRoute();

  elements.adminDashboardShell.innerHTML = `
    ${AdminSidebar()}
    <main class="admin-main">
      ${AdminHeader(route)}
      <section class="admin-content">
        ${AdminPageContent(route)}
      </section>
    </main>
  `;
}

function AdminSidebar() {
  const activeRoute = currentAdminRoute();

  return `
    <aside class="admin-sidebar">
      <div class="admin-sidebar-brand">
        <span class="admin-logo-mark">A</span>
        <div>
          <strong>AnonChat <span>Admin</span></strong>
          <small>Moderation SaaS</small>
        </div>
      </div>
      <p class="admin-sidebar-title">ADMIN PANEL</p>
      <nav class="admin-nav" aria-label="Admin panel navigation">
        ${ADMIN_ROUTE_ITEMS
          .map((item) => {
            const active = item.route === activeRoute ? "active" : "";
            return `
              <button class="admin-nav-item ${active}" type="button" data-admin-route="${escapeAttr(item.route)}">
                <span>${escapeHtml(item.icon)}</span>
                <strong>${escapeHtml(item.label)}</strong>
              </button>
            `;
          })
          .join("")}
      </nav>
      <button class="admin-logout" type="button" data-admin-dashboard-action="logout">
        <span>LO</span>
        Logout
      </button>
    </aside>
  `;
}

function AdminHeader(route = currentAdminRoute()) {
  const page = adminPageMeta(route);
  const user = state.session?.user || {};

  return `
    <header class="admin-header">
      <button class="admin-mobile-toggle" type="button" data-admin-dashboard-action="toggle-sidebar" aria-label="Open admin menu">
        <span></span><span></span><span></span>
      </button>
      <div>
        <h1>${escapeHtml(page.title)}</h1>
        <p>${escapeHtml(page.subtitle)}</p>
      </div>
      <button class="admin-profile" type="button" data-admin-dashboard-action="profile">
        <span class="admin-avatar">A</span>
        <span>
          <strong>${escapeHtml(user.fullName || user.name || "Admin")}</strong>
          <small>${escapeHtml(user.role || "admin")}</small>
        </span>
        <i aria-hidden="true"></i>
      </button>
    </header>
  `;
}

function currentAdminRoute() {
  return isAdminRoute(state.route) ? state.route : ADMIN_DASHBOARD_ROUTE;
}

function adminPageMeta(route = currentAdminRoute()) {
  const [title, subtitle] = ADMIN_PAGE_META[route] || ADMIN_PAGE_META[ADMIN_DASHBOARD_ROUTE];
  return { title, subtitle };
}

function AdminPageContent(route = currentAdminRoute()) {
  if (route === ADMIN_ROUTES.users) return AdminUsersPage();
  if (route === ADMIN_ROUTES.chatRooms) return AdminChatRoomsPage();
  if (route === ADMIN_ROUTES.reports) return AdminReportsPage();
  if (route === ADMIN_ROUTES.blockedUsers) return AdminBlockedUsersPage();
  if (route === ADMIN_ROUTES.messagesMonitoring) return AdminMessagesMonitoringPage();
  if (route === ADMIN_ROUTES.announcements) return AdminAnnouncementsPage();
  if (route === ADMIN_ROUTES.settings) return AdminSettingsPage();
  return AdminDashboardHome();
}

function AdminDashboardHome() {
  const users = state.admin.users || [];
  const reports = state.admin.reports || [];
  const messages = state.admin.messages || state.messages || [];
  const rooms = state.rooms || [];
  const blockedUsers = users.filter((user) => user.status === "suspended").length;
  const messagesToday = state.stats.messagesToday ?? messages.filter((message) => isSameDay(message.createdAt, Date.now())).length;
  const activeUsers = state.stats.activeUsers ?? users.filter((user) => user.role !== "admin" && user.status !== "deleted").length;
  const callsToday = state.stats.callsToday ?? state.admin.stats?.callsToday ?? 0;
  const activeCalls = state.stats.activeCalls ?? state.admin.stats?.activeCalls ?? 0;

  return `
    <div class="admin-stat-grid">
      ${StatCard("Total Users", numberText(users.length), "")}
      ${StatCard("Active Users", numberText(activeUsers), "")}
      ${StatCard("Total Rooms", numberText(rooms.length), "")}
      ${StatCard("Reports Pending", numberText(reports.filter((report) => report.status === "open").length), "", "negative")}
      ${StatCard("Blocked Users", numberText(blockedUsers), "")}
      ${StatCard("Messages Today", numberText(messagesToday), "")}
      ${StatCard("Calls Today", numberText(callsToday), "metadata only")}
      ${StatCard("Active Calls", numberText(activeCalls), "live metadata")}
    </div>
    <div class="admin-dashboard-grid">
      ${RecentReports()}
      ${ActivityChart()}
      ${SystemOverview()}
    </div>
  `;
}

function StatCard(title, value, growth, tone = "positive") {
  return `
    <article class="admin-stat-card">
      <span>${escapeHtml(title)}</span>
      <div>
        <strong>${escapeHtml(value)}</strong>
        <small class="${tone}">${escapeHtml(growth)}</small>
      </div>
    </article>
  `;
}

function RecentReports() {
  const reports = adminReportsForPage().slice(0, 5);

  return `
    <section class="admin-panel admin-reports-panel">
      <div class="admin-panel-head">
        <h2>Recent Reports</h2>
      </div>
      <div class="admin-report-list">
        ${reports.length ? reports
          .map(
            (report) => `
              <div class="admin-report-row">
                <span class="report-user-icon">${escapeHtml(initials(report.user || "AU"))}</span>
                <strong>${escapeHtml(report.user || "Anonymous User")}</strong>
                <span>${escapeHtml(report.type || "Report")}</span>
                <small>${escapeHtml(report.time || "")}</small>
                <button type="button" data-admin-dashboard-action="view-report">View</button>
              </div>
            `
          )
          .join("") : `<p class="empty-state">No recent reports available.</p>`}
      </div>
      <button class="admin-link-button" type="button" data-admin-route="${ADMIN_ROUTES.reports}">View All Reports</button>
    </section>
  `;
}

function ActivityChart() {
  const messages = state.admin.messages || state.messages || [];
  const buckets = Array.from({ length: 12 }, () => 0);
  messages.forEach((message) => {
    const date = new Date(Number(message.createdAt || 0));
    if (Number.isNaN(date.getTime())) return;
    buckets[Math.floor(date.getHours() / 2)] += 1;
  });
  const max = Math.max(...buckets, 1);
  const points = buckets
    .map((count, index) => `${index * 44},${160 - (count / max) * 130}`)
    .join(" ");
  const fillPoints = `${points} 484,160 0,160`;
  const dots = buckets
    .map((count, index) => `<circle cx="${index * 44}" cy="${160 - (count / max) * 130}" r="4"></circle>`)
    .join("");

  return `
    <section class="admin-panel admin-activity-panel">
      <div class="admin-panel-head">
        <h2>Activity Overview</h2>
        <select aria-label="Activity range">
          <option>Today</option>
        </select>
      </div>
      <div class="chart-wrap">
        <svg viewBox="0 0 484 170" role="img" aria-label="Messages activity chart">
          <polyline class="chart-grid" points="0,132 484,132"></polyline>
          <polyline class="chart-grid" points="0,86 484,86"></polyline>
          <polyline class="chart-grid" points="0,40 484,40"></polyline>
          <polygon class="chart-fill" points="${fillPoints}"></polygon>
          <polyline class="chart-line" points="${points}"></polyline>
          <g class="chart-dots">
            ${dots}
          </g>
        </svg>
        <div class="chart-labels">
          <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
        </div>
      </div>
    </section>
  `;
}

function SystemOverview() {
  const rooms = state.admin.rooms?.length || state.rooms.length;
  const users = state.admin.users?.length || state.stats.users || state.stats.totalUsers || 0;
  const openReports = state.admin.reports?.filter((report) => report.status === "open").length || state.stats.openReports || 0;

  return `
    <section class="admin-panel admin-system-panel">
      <h2>System Overview</h2>
      <div class="system-grid">
        <div>
          <span>MongoDB Users</span>
          <strong>${escapeHtml(numberText(users))}</strong>
        </div>
        <div>
          <span>Active Rooms</span>
          <strong>${escapeHtml(numberText(rooms))}</strong>
        </div>
        <div>
          <span>Open Reports</span>
          <strong>${escapeHtml(numberText(openReports))}</strong>
        </div>
      </div>
    </section>
  `;
}

function adminMenuIcon(label) {
  const icons = {
    Dashboard: "DB",
    Users: "US",
    "Chat Rooms": "CR",
    Reports: "RP",
    "Blocked Users": "BU",
    "Messages Monitoring": "MM",
    Announcements: "AN",
    Settings: "ST",
  };

  return icons[label] || "AD";
}

function AdminUsersPage() {
  const users = adminUsersForPage();
  const activeCount = users.filter((user) => user.status !== "suspended").length;
  const suspendedCount = users.filter((user) => user.status === "suspended").length;

  return `
    <div class="admin-page-grid">
      ${AdminMiniMetric("Registered Users", users.length, "Synced from auth")}
      ${AdminMiniMetric("Active Accounts", activeCount, "Allowed to chat")}
      ${AdminMiniMetric("Suspended", suspendedCount, "Safety holds")}
    </div>
    <section class="admin-panel admin-wide-panel">
      <div class="admin-panel-head">
        <h2>User Directory</h2>
        <div class="admin-page-actions">
          <input id="adminUserSearchInput" type="search" value="${escapeAttr(state.adminUserSearchQuery)}" placeholder="Search users" />
          <button class="admin-secondary-action" type="button" data-admin-dashboard-action="export-users">Export</button>
        </div>
      </div>
      ${AdminTable(
        ["User", "Contact", "Campus", "Status", "Actions"],
        users.map((user) => {
          const suspended = user.status === "suspended";
          return [
            `<div class="admin-table-user"><span>${initials(user.fullName || user.username)}</span><strong>${escapeHtml(user.fullName || user.username)}</strong><small>@${escapeHtml(user.username || "anonymous")}</small></div>`,
            `<span>${escapeHtml(user.email || "N/A")}</span><small>${escapeHtml(user.contactNumber || "No phone")}</small>`,
            `<span>${escapeHtml(user.campus || "Campus")}</span><small>${escapeHtml(user.department || "Department")}</small>`,
            AdminStatusPill(suspended ? "suspended" : "active"),
            `<div class="admin-row-actions"><button type="button" data-admin-action="${suspended ? "reactivate-user" : "suspend-user"}" data-user-id="${escapeAttr(user.id)}">${suspended ? "Reactivate" : "Suspend"}</button><button class="danger" type="button" data-admin-action="delete-user" data-user-id="${escapeAttr(user.id)}">Delete</button></div>`,
          ];
        }),
        "No users found yet."
      )}
    </section>
  `;
}

function AdminChatRoomsPage() {
  const rooms = adminRoomsForPage();

  return `
    <div class="admin-page-grid">
      ${AdminMiniMetric("Total Rooms", rooms.length, "Public and private")}
      ${AdminMiniMetric("Active Rooms", rooms.filter((room) => room.status !== "archived").length, "Open now")}
      ${AdminMiniMetric("Messages", numberText(state.stats.messagesToday || state.admin.messages?.length || state.messages.length), "Tracked today")}
    </div>
    <section class="admin-panel admin-wide-panel">
      <div class="admin-panel-head">
        <h2>Room Management</h2>
        <div class="admin-page-actions">
          <button class="admin-primary-action" type="button" data-admin-dashboard-action="create-room">Create Room</button>
        </div>
      </div>
      ${AdminTable(
        ["Room", "Type", "Messages", "Status", "Actions"],
        rooms.map((room) => [
          `<div class="admin-table-user"><span>${escapeHtml(room.icon || "#")}</span><strong>${escapeHtml(room.name || "Room")}</strong><small>${escapeHtml(room.desc || room.category || "Community room")}</small></div>`,
          `<span>${escapeHtml(room.category || "Public Room")}</span>`,
          `<strong>${getRoomMessageCount(room.id)}</strong>`,
          AdminStatusPill(room.status || "active"),
          room.isSeeded
            ? `<span class="muted">Default room</span>`
            : `<div class="admin-row-actions"><button class="danger" type="button" data-admin-action="delete-room" data-room-id="${escapeAttr(room.id)}">Delete</button></div>`,
        ]),
        "No chat rooms available."
      )}
    </section>
  `;
}

function AdminReportsPage() {
  const reports = adminReportsForPage();

  return `
    <div class="admin-page-grid">
      ${AdminMiniMetric("Open Reports", reports.filter((report) => report.status === "open").length, "Needs review")}
      ${AdminMiniMetric("Hidden Messages", reports.filter((report) => report.status === "hidden").length, "Protected from view")}
      ${AdminMiniMetric("Resolved", reports.filter((report) => report.status === "dismissed" || report.status === "deleted").length, "Closed reports")}
    </div>
    <section class="admin-panel admin-wide-panel">
      <div class="admin-panel-head">
        <h2>Reports Queue</h2>
        <div class="admin-page-actions">
          <button class="admin-secondary-action" type="button" data-admin-dashboard-action="refresh-admin">Refresh</button>
        </div>
      </div>
      ${AdminTable(
        ["User", "Report Type", "Status", "Time", "Actions"],
        reports.map((report) => {
          const real = Boolean(report.id);
          return [
            `<div class="admin-table-user"><span>${escapeHtml(String(report.user || "U").slice(-2))}</span><strong>${escapeHtml(report.user || "Anonymous User")}</strong><small>${escapeHtml(report.reporter || "Community report")}</small></div>`,
            `<span>${escapeHtml(report.type || report.reason || "Report")}</span><small>${escapeHtml(report.preview || "Message review required")}</small>`,
            AdminStatusPill(report.status || "open"),
            `<span>${escapeHtml(report.time || relativeTime(report.createdAt || Date.now()))}</span>`,
            real
              ? `<div class="admin-row-actions"><button type="button" data-admin-action="hide" data-report-id="${escapeAttr(report.id)}">Hide</button><button type="button" data-admin-action="dismiss" data-report-id="${escapeAttr(report.id)}">Dismiss</button></div>`
              : `<div class="admin-row-actions"><button type="button" disabled>View</button></div>`,
          ];
        }),
        "No reports found."
      )}
    </section>
  `;
}

function AdminBlockedUsersPage() {
  const blockedUsers = adminUsersForPage().filter((user) => user.status === "suspended");
  const openReports = state.admin.reports?.filter((report) => report.status === "open").length || 0;

  return `
    <div class="admin-page-grid">
      ${AdminMiniMetric("Blocked Users", blockedUsers.length, "Suspended accounts")}
      ${AdminMiniMetric("Open Reports", openReports, "Needs follow-up")}
      ${AdminMiniMetric("Reactivated", state.admin.auditLogs?.filter((log) => log.action === "user_reactivated").length || 0, "Audit log")}
    </div>
    <section class="admin-panel admin-wide-panel">
      <div class="admin-panel-head">
        <h2>Blocked Users</h2>
      </div>
      ${AdminTable(
        ["User", "Reason", "Blocked Since", "Action"],
        blockedUsers.map((user) => [
          `<div class="admin-table-user"><span>${initials(user.fullName || user.username)}</span><strong>${escapeHtml(user.fullName || user.username)}</strong><small>@${escapeHtml(user.username || "anonymous")}</small></div>`,
          `<span>${escapeHtml(user.suspensionReason || "Community safety")}</span>`,
          `<span>${escapeHtml(user.blockedAt || user.createdAt ? relativeTime(user.blockedAt || user.createdAt) : "Recently")}</span>`,
          `<div class="admin-row-actions"><button type="button" data-admin-action="reactivate-user" data-user-id="${escapeAttr(user.id)}">Unblock</button></div>`,
        ]),
        "No blocked users right now."
      )}
    </section>
  `;
}

function AdminMessagesMonitoringPage() {
  return `
    <div class="mm-container">
      <div class="mm-users-panel">
        <div class="mm-search">
          <input type="text" id="mmUserSearch" placeholder="Search users..." value="${escapeAttr(monitorUserSearchQuery)}" autocomplete="off" />
        </div>
        <div class="mm-users-list" id="mmUsersList">
          <div class="mm-loading">Loading message users...</div>
        </div>
      </div>

      <div class="mm-messages-panel">
        <div class="mm-empty" id="mmEmptyState">
          <span aria-hidden="true">&#128172;</span>
          <p>&larr; Select a user to view their messages</p>
        </div>

        <div class="mm-messages-view hidden" id="mmMessagesView">
          <div class="mm-msg-header" id="mmMsgHeader"></div>
          <div class="mm-msg-list" id="mmMsgList"></div>
        </div>
      </div>
    </div>
  `;
}

function activateMessagesMonitor() {
  loadMonitorUsers({ silent: true });
  if (selectedMonitorUserId) {
    loadUserMessages(selectedMonitorUserId, selectedMonitorUserName, selectedMonitorUserColor, { silent: true });
  }

  if (monitorAutoRefresh) return;

  monitorAutoRefresh = window.setInterval(() => {
    loadMonitorUsers({ silent: true });
    if (selectedMonitorUserId) {
      loadUserMessages(selectedMonitorUserId, selectedMonitorUserName, selectedMonitorUserColor, { silent: true });
    }
  }, 5000);
}

function stopMessagesMonitor() {
  if (!monitorAutoRefresh) return;
  window.clearInterval(monitorAutoRefresh);
  monitorAutoRefresh = null;
}

async function loadMonitorUsers({ silent = false } = {}) {
  const list = document.getElementById("mmUsersList");
  if (!list || !isAdmin()) return;

  try {
    const data = await api("/api/admin/message-users", { method: "GET" });
    monitorUsersCache = data.users || [];
    renderMonitorUsersList(monitorUsersCache);
  } catch (error) {
    if (!silent) handleApiError(error);
    list.innerHTML = `<div class="mm-loading">Unable to load message users.</div>`;
  }
}

function renderMonitorUsersList(users) {
  const list = document.getElementById("mmUsersList");
  if (!list) return;

  const query = monitorUserSearchQuery.trim().toLowerCase();
  const filteredUsers = query
    ? users.filter((user) => String(user.author || user._id || "").toLowerCase().includes(query))
    : users;

  if (!filteredUsers.length) {
    list.innerHTML = `<div class="mm-loading">No messages yet</div>`;
    return;
  }

  list.innerHTML = filteredUsers
    .map((user) => {
      const userId = String(user._id || "");
      const name = user.author || "Anonymous User";
      const avatarColor = user.avatarColor || "#6c63ff";
      const lastMessage = truncateText(user.lastMessage || "No messages", 35);
      const active = selectedMonitorUserId === userId ? "active" : "";

      return `
        <button
          class="mm-user-row ${active}"
          type="button"
          data-user-id="${escapeAttr(userId)}"
          data-user-name="${escapeAttr(name)}"
          data-avatar-color="${escapeAttr(avatarColor)}">
          <span class="mm-user-avatar" style="background:${escapeAttr(avatarColor)}">${escapeHtml(initials(name))}</span>
          <span class="mm-user-info">
            <span class="mm-user-name">${escapeHtml(name)}</span>
            <span class="mm-user-preview">${escapeHtml(lastMessage)}</span>
          </span>
          <span class="mm-user-meta">
            <span class="mm-user-time">${escapeHtml(relativeTime(user.lastTime || Date.now()))}</span>
            <span class="mm-msg-count">${numberText(user.totalMessages || 0)}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

async function loadUserMessages(userId, userName = "", avatarColor = "#6c63ff", { silent = false } = {}) {
  const emptyState = document.getElementById("mmEmptyState");
  const messagesView = document.getElementById("mmMessagesView");
  const header = document.getElementById("mmMsgHeader");
  const list = document.getElementById("mmMsgList");
  if (!emptyState || !messagesView || !header || !list) return;

  selectedMonitorUserId = String(userId || "");
  selectedMonitorUserName = userName || selectedMonitorUserName || "Anonymous User";
  selectedMonitorUserColor = avatarColor || selectedMonitorUserColor || "#6c63ff";

  emptyState.classList.add("hidden");
  messagesView.classList.remove("hidden");
  if (!silent || !list.querySelector(".mm-msg-row")) {
    list.innerHTML = `<div class="mm-loading">Loading messages...</div>`;
  }

  try {
    const data = await api(`/api/admin/user-messages/${encodeURIComponent(selectedMonitorUserId)}`, { method: "GET" });
    const messages = dedupeMonitorMessages(data.messages || []);
    const totalMessages = data.totalMessages || messages.length;

    header.innerHTML = `
      <span class="mm-user-avatar" style="background:${escapeAttr(selectedMonitorUserColor)}">${escapeHtml(initials(selectedMonitorUserName))}</span>
      <span class="mm-header-copy">
        <strong>${escapeHtml(selectedMonitorUserName)}</strong>
        <small>${numberText(totalMessages)} total messages</small>
      </span>
    `;

    if (!messages.length) {
      list.innerHTML = `<div class="mm-loading">No messages found</div>`;
      return;
    }

    list.innerHTML = messages.map(renderMonitorMessageRow).join("");
  } catch (error) {
    if (!silent) handleApiError(error);
    list.innerHTML = `<div class="mm-loading">Unable to load messages.</div>`;
  }
}

function dedupeMonitorMessages(messages) {
  const seen = new Set();
  return messages.filter((message) => {
    const id = String(message.id || message._id || "");
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function renderMonitorMessageRow(message) {
  const messageId = String(message.id || message._id || "");
  const text = message.deletedAt
    ? "This message was deleted"
    : message.text || (message.attachment ? "[attachment]" : "[empty message]");
  const status = monitorMessageStatus(message);
  const hideDisabled = status === "hidden" ? "disabled" : "";

  return `
    <div class="mm-msg-row" data-message-id="${escapeAttr(messageId)}">
      <div class="mm-msg-text" title="${escapeAttr(text)}">${escapeHtml(text)}</div>
      <div class="mm-room-badge">${escapeHtml(roomName(message.roomId) || message.roomId || "general")}</div>
      <div class="mm-msg-time">${escapeHtml(formatMonitorExactTime(message.createdAt || Date.now()))}</div>
      <div><span class="mm-status status-${escapeAttr(status)}">${escapeHtml(capitalizeLabel(status))}</span></div>
      <div class="mm-msg-actions">
        <button class="mm-btn-flag" type="button" data-mm-message-action="flag" data-message-id="${escapeAttr(messageId)}">Flag</button>
        <button class="mm-btn-delete" type="button" data-mm-message-action="delete" data-message-id="${escapeAttr(messageId)}">Delete</button>
        <button class="mm-btn-hide" type="button" data-mm-message-action="hide" data-message-id="${escapeAttr(messageId)}" ${hideDisabled}>Hide</button>
      </div>
    </div>
  `;
}

function monitorMessageStatus(message) {
  if (message.deletedAt || message.status === "deleted") return "deleted";
  if (message.hidden || message.status === "hidden") return "hidden";
  return "visible";
}

function formatMonitorExactTime(value) {
  const date = new Date(value);
  const safeDate = Number.isNaN(date.getTime()) ? new Date(Number(value || Date.now())) : date;
  return safeDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function handleMonitorUserRow(row) {
  document.querySelectorAll(".mm-user-row").forEach((item) => item.classList.remove("active"));
  row.classList.add("active");
  loadUserMessages(row.dataset.userId, row.dataset.userName, row.dataset.avatarColor);
}

async function handleMonitorMessageAction(button) {
  const action = button.dataset.mmMessageAction;
  const messageId = button.dataset.messageId;
  if (!messageId) return;

  if (action === "delete" && !window.confirm("Delete this message?")) return;

  const resetLoading = setButtonLoading(button, true, "...");
  try {
    if (action === "delete") {
      await api(`/api/admin/messages/${encodeURIComponent(messageId)}`, {
        method: "DELETE",
        body: { token: state.session.token },
      });
      toast("Message deleted");
    } else {
      await api(`/api/admin/messages/${encodeURIComponent(messageId)}`, {
        method: "PATCH",
        body: {
          token: state.session.token,
          action,
        },
      });
      toast(action === "hide" ? "Message hidden" : "Message flagged");
    }

    await loadMonitorUsers({ silent: true });
    if (selectedMonitorUserId) {
      await loadUserMessages(selectedMonitorUserId, selectedMonitorUserName, selectedMonitorUserColor, { silent: true });
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    resetLoading();
  }
}

function AdminAnnouncementsPage() {
  const announcements = (state.admin.announcements || []).map(normalizeAnnouncement);
  const editingAnnouncement = announcements.find(
    (announcement) => String(announcement.id) === String(state.adminAnnouncementEditingId)
  );
  const formTitle = editingAnnouncement ? "Edit Announcement" : "Create Announcement";
  const submitText = editingAnnouncement ? "Update Announcement" : "Publish Announcement";

  return `
    <div class="admin-admin-grid">
      <section class="admin-panel admin-form-panel">
        <div class="admin-panel-head">
          <h2>${formTitle}</h2>
        </div>
        <form class="admin-form" id="adminAnnouncementForm">
          <label>
            <span>Title</span>
            <input type="text" maxlength="80" placeholder="Platform update" value="${escapeAttr(editingAnnouncement?.title || "")}" />
          </label>
          <label>
            <span>Message</span>
            <textarea rows="5" maxlength="280" placeholder="Write a concise announcement for AnonChat users.">${escapeHtml(editingAnnouncement?.body || "")}</textarea>
          </label>
          <button class="admin-primary-action" type="button" data-admin-dashboard-action="save-announcement">${submitText}</button>
          ${editingAnnouncement ? `<button class="admin-cancel-edit" type="button" data-admin-dashboard-action="cancel-announcement-edit">Cancel Edit</button>` : ""}
        </form>
      </section>
      <section class="admin-panel admin-wide-panel">
        <div class="admin-panel-head">
          <h2>Recent Announcements</h2>
        </div>
        <div class="admin-card-list">
          ${announcements.length ? announcements
            .map(
              (announcement) => `
                <article class="admin-list-card admin-announcement-card" data-announcement-id="${escapeAttr(announcement.id)}">
                  <div class="admin-announcement-content">
                    <div class="admin-announcement-title-row">
                      <strong>${escapeHtml(announcement.title)}</strong>
                      ${AdminStatusPill(announcement.status || "published")}
                    </div>
                    <p>${escapeHtml(announcement.body)}</p>
                    <div class="admin-announcement-actions">
                      <button class="announcement-edit-btn" type="button" data-admin-dashboard-action="edit-announcement" data-announcement-id="${escapeAttr(announcement.id)}">Edit</button>
                      <button class="announcement-delete-btn" type="button" data-admin-dashboard-action="delete-announcement" data-announcement-id="${escapeAttr(announcement.id)}">Delete</button>
                    </div>
                  </div>
                </article>
              `
            )
            .join("") : `<div class="announcement-empty-state"><span aria-hidden="true">&#128226;</span><strong>No announcements yet</strong></div>`}
        </div>
      </section>
    </div>
  `;
}

function AdminSettingsPage() {
  const adminName = state.session?.user?.name || "Admin";
  const settings = { ...state.admin.settings };

  return `
    <div class="admin-admin-grid">
      <section class="admin-panel admin-form-panel">
        <div class="admin-panel-head">
          <h2>Admin Profile</h2>
        </div>
        <form class="admin-form">
          <label>
            <span>Display Name</span>
            <input type="text" value="${escapeAttr(adminName)}" />
          </label>
          <label>
            <span>Role</span>
            <input type="text" value="${escapeAttr(state.session?.user?.role || "admin")}" disabled />
          </label>
          <button class="admin-primary-action" type="button" data-admin-dashboard-action="save-settings">Save Settings</button>
        </form>
      </section>
      <section class="admin-panel admin-wide-panel">
        <div class="admin-panel-head">
          <h2>Platform Settings</h2>
        </div>
        <div class="admin-setting-list">
          ${AdminSettingCard("Open Registration", "Allow new student accounts.", settings.openRegistration !== false, "openRegistration")}
          ${AdminSettingCard("Profanity Filter", "Apply moderation checks to chat content.", settings.profanityFilter !== false, "profanityFilter")}
          ${AdminSettingCard("Guest Mode", "Allow guest browsing where supported.", settings.guestModeAllowed !== false, "guestModeAllowed")}
          ${AdminSettingCard("Maintenance Mode", "Show temporary downtime behavior.", Boolean(settings.maintenanceMode), "maintenanceMode")}
          ${AdminSettingCard("Auto Delete Messages", "Expire messages according to backend retention.", settings.autoDeleteMessages !== false, "autoDeleteMessages")}
          ${AdminSettingCard("Email Notifications", "Send account and moderation emails when configured.", Boolean(settings.emailNotifications), "emailNotifications")}
        </div>
      </section>
    </div>
  `;
}

function AdminMiniMetric(title, value, note) {
  return `
    <article class="admin-mini-card">
      <span>${escapeHtml(title)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(note)}</small>
    </article>
  `;
}

function AdminTable(headers, rows, emptyText) {
  if (!rows.length) {
    return AdminEmptyState("AD", emptyText, "Nothing needs attention in this workspace.");
  }

  return `
    <div class="admin-table cols-${headers.length}" role="table">
      <div class="admin-table-row admin-table-head" role="row">
        ${headers.map((header) => `<div role="columnheader">${escapeHtml(header)}</div>`).join("")}
      </div>
      ${rows
        .map(
          (row) => `
            <div class="admin-table-row" role="row">
              ${row.map((cell) => `<div role="cell">${cell}</div>`).join("")}
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function AdminStatusPill(status) {
  const safeStatus = String(status || "active").toLowerCase();
  const tone =
    safeStatus.includes("open") || safeStatus.includes("pending") || safeStatus.includes("suspended") || safeStatus.includes("draft")
      ? "warning"
      : safeStatus.includes("blocked") || safeStatus.includes("deleted")
        ? "danger"
        : "safe";

  return `<span class="admin-status-pill ${tone}">${escapeHtml(safeStatus.replaceAll("-", " "))}</span>`;
}

function AdminEmptyState(icon, title, body) {
  return `
    <div class="admin-empty-state">
      <span>${escapeHtml(icon)}</span>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(body)}</p>
    </div>
  `;
}

function AdminSettingCard(title, body, enabled, key) {
  return `
    <article class="admin-setting-card">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(body)}</p>
      </div>
      <label class="admin-toggle">
        <input type="checkbox" data-admin-setting="${escapeAttr(key)}" ${enabled ? "checked" : ""} />
        <span></span>
      </label>
    </article>
  `;
}

function collectAdminSettings() {
  const settings = {
    ...state.admin.settings,
  };

  document.querySelectorAll("[data-admin-setting]").forEach((input) => {
    settings[input.dataset.adminSetting] = input.checked;
  });

  return settings;
}

function showInlinePrompt({ title, placeholder = "", value = "", confirmText = "Save", cancelText = "Cancel" } = {}) {
  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className = "confirm-modal-backdrop";
    backdrop.innerHTML = `
      <div class="confirm-modal-card inline-prompt-card" role="dialog" aria-modal="true" aria-label="${escapeAttr(title || "Input")}">
        <h2>${escapeHtml(title || "Input")}</h2>
        <input
          class="inline-prompt-input"
          type="text"
          value="${escapeAttr(value)}"
          placeholder="${escapeAttr(placeholder)}"
          autocomplete="off"
        />
        <div class="confirm-modal-actions">
          <button class="confirm-cancel-btn" type="button" data-prompt-cancel>${escapeHtml(cancelText)}</button>
          <button class="confirm-danger-btn" type="button" data-prompt-accept>${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    const cleanup = (result) => {
      document.removeEventListener("keydown", handleKeydown);
      backdrop.remove();
      resolve(result);
    };

    const input = backdrop.querySelector(".inline-prompt-input");
    const handleKeydown = (event) => {
      if (event.key === "Escape") cleanup(null);
      if (event.key === "Enter") cleanup(input?.value || "");
    };

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop || event.target.closest("[data-prompt-cancel]")) {
        cleanup(null);
        return;
      }
      if (event.target.closest("[data-prompt-accept]")) cleanup(input?.value || "");
    });

    document.addEventListener("keydown", handleKeydown);
    document.body.appendChild(backdrop);
    input?.focus();
    input?.select();
  });
}

function showConfirmModal({ title, body, confirmText = "Confirm", cancelText = "Cancel", danger = false }) {
  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className = "confirm-modal-backdrop";
    backdrop.innerHTML = `
      <div class="confirm-modal-card" role="dialog" aria-modal="true" aria-label="${escapeAttr(title)}">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(body)}</p>
        <div class="confirm-modal-actions">
          <button class="confirm-cancel-btn" type="button" data-confirm-cancel>${escapeHtml(cancelText)}</button>
          <button class="confirm-danger-btn ${danger ? "danger" : ""}" type="button" data-confirm-accept>${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    const cleanup = (result) => {
      document.removeEventListener("keydown", handleKeydown);
      backdrop.remove();
      resolve(result);
    };

    const handleKeydown = (event) => {
      if (event.key === "Escape") cleanup(false);
    };

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop || event.target.closest("[data-confirm-cancel]")) {
        cleanup(false);
        return;
      }
      if (event.target.closest("[data-confirm-accept]")) cleanup(true);
    });

    document.addEventListener("keydown", handleKeydown);
    document.body.appendChild(backdrop);
    backdrop.querySelector("[data-confirm-cancel]")?.focus();
  });
}

function adminUsersForPage() {
  const users = state.admin.users || [];
  const query = state.adminUserSearchQuery.trim().toLowerCase();
  if (!query) return users;

  return users.filter((user) => {
    const haystack = `${user.fullName || ""} ${user.username || ""} ${user.email || ""}`.toLowerCase();
    return haystack.includes(query);
  });
}

function adminRoomsForPage() {
  const rooms = state.admin.rooms?.length ? state.admin.rooms : state.rooms;
  return rooms.map((room) => ({ status: "active", ...room }));
}

function adminReportsForPage() {
  const reports = state.admin.reports || [];
  if (reports.length) {
    return reports.map((report) => ({
      id: report.id,
      user: report.message?.userName || "Anonymous User",
      reporter: report.reporterName || "Community member",
      type: report.reason || "Report",
      status: report.status || "open",
      time: relativeTime(report.createdAt || Date.now()),
      preview: report.message?.text || "Message review required",
    }));
  }

  return [];
}

function adminMessagesForPage() {
  const query = state.adminMessageSearchQuery.trim().toLowerCase();
  let messages = state.admin.messages?.length ? state.admin.messages : state.messages;
  if (query) {
    messages = messages.filter((message) => {
      const haystack = `${message.author || ""} ${message.userName || ""} ${message.authorId || ""} ${message.text || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  if (messages.length) {
    return messages
      .slice(-8)
      .reverse()
      .map((message) => ({ ...message, status: message.hidden ? "hidden" : "visible" }));
  }

  return [];
}

function getRoomMessageCount(roomId) {
  const count = state.messages.filter((message) => message.roomId === roomId).length;
  if (count) return count;
  return state.rooms.find((room) => room.id === roomId)?.messageCount || 0;
}

function truncateText(value, maxLength = 72) {
  const text = String(value || "");
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}...`;
}

async function handleAdminDashboardClick(event) {
  const sidebarOpen = elements.adminDashboardView?.classList.contains("sidebar-open");
  if (
    sidebarOpen &&
    !event.target.closest(".admin-sidebar") &&
    !event.target.closest(".admin-mobile-toggle")
  ) {
    elements.adminDashboardView.classList.remove("sidebar-open");
    return;
  }

  const routeButton = event.target.closest("[data-admin-route]");
  if (routeButton) {
    navigateTo(routeButton.dataset.adminRoute, { render: false });
    elements.adminDashboardView.classList.remove("sidebar-open");
    render();
    return;
  }

  const monitorUserRow = event.target.closest(".mm-user-row");
  if (monitorUserRow) {
    handleMonitorUserRow(monitorUserRow);
    return;
  }

  const monitorMessageAction = event.target.closest("[data-mm-message-action]");
  if (monitorMessageAction) {
    await handleMonitorMessageAction(monitorMessageAction);
    return;
  }

  const moderationAction = event.target.closest("[data-admin-action]");
  if (moderationAction) {
    handleAdminPanelClick(event);
    return;
  }

  const action = event.target.closest("[data-admin-dashboard-action]");
  if (action) {
    const actionName = action.dataset.adminDashboardAction;
    if (actionName === "logout") {
      logout();
      return;
    }

    if (actionName === "toggle-sidebar") {
      elements.adminDashboardView.classList.toggle("sidebar-open");
      return;
    }

    if (actionName === "view-report") {
      navigateTo(ADMIN_ROUTES.reports, { render: false });
      render();
      return;
    }

    if (actionName === "view-all-users") {
      navigateTo(ADMIN_ROUTES.users);
      return;
    }

    if (actionName === "profile") {
      navigateTo(ADMIN_ROUTES.settings);
      return;
    }

    if (actionName === "create-room") {
      const name = window.prompt("Room name");
      if (!name) return;

      const resetLoading = setButtonLoading(action, true);
      try {
        await api("/api/rooms", {
          method: "POST",
          body: {
            token: state.session.token,
            name,
            visibility: "public",
          },
        });
        await refreshState();
        await refreshAdminState();
        render();
        toast("Room created.");
      } catch (err) {
        toast(err.message);
      } finally {
        resetLoading();
      }
      return;
    }

    if (actionName === "edit-announcement") {
      const announcementId = action.dataset.announcementId;
      if (!announcementId) return;
      state.adminAnnouncementEditingId = String(announcementId);
      render();
      window.requestAnimationFrame(() => document.querySelector("#adminAnnouncementForm input")?.focus());
      return;
    }

    if (actionName === "cancel-announcement-edit") {
      state.adminAnnouncementEditingId = null;
      render();
      return;
    }

    if (actionName === "delete-announcement") {
      const announcementId = action.dataset.announcementId;
      if (!announcementId) return;

      const confirmed = await showConfirmModal({
        title: "Delete Announcement?",
        body: "This will permanently delete this announcement. This cannot be undone.",
        cancelText: "Cancel",
        confirmText: "Delete Permanently",
        danger: true,
      });
      if (!confirmed) return;

      const resetLoading = setButtonLoading(action, true);
      try {
        await api(`/api/admin/announcements/${encodeURIComponent(announcementId)}`, {
          method: "DELETE",
          body: { token: state.session.token },
        });
        removeAnnouncement(announcementId);
        render();
        toast("Announcement deleted");
      } catch (err) {
        toast(err.message);
      } finally {
        resetLoading();
      }
      return;
    }

    if (actionName === "save-announcement") {
      const form = document.querySelector("#adminAnnouncementForm");
      const title = form?.querySelector("input")?.value?.trim();
      const body = form?.querySelector("textarea")?.value?.trim();
      const editingId = state.adminAnnouncementEditingId;

      if (!title || !body) {
        toast("Title and body are required.");
        return;
      }

      const resetLoading = setButtonLoading(action, true);
      try {
        const response = editingId
          ? await api(`/api/admin/announcements/${encodeURIComponent(editingId)}`, {
              method: "PATCH",
              body: {
                token: state.session.token,
                title,
                body,
              },
            })
          : await api("/api/admin/announcements", {
              method: "POST",
              body: {
                token: state.session.token,
                title,
                body,
                priority: "normal",
                target: "all",
                status: "published",
              },
            });

        upsertAnnouncement(response.announcement);
        state.adminAnnouncementEditingId = null;
        render();
        toast(editingId ? "Announcement updated \u2705" : "Announcement published!");
      } catch (err) {
        toast(err.message);
      } finally {
        resetLoading();
      }
      return;
    }

    if (actionName === "save-settings") {
      const resetLoading = setButtonLoading(action, true);
      try {
        await api("/api/admin/settings", {
          method: "PATCH",
          body: {
            token: state.session.token,
            ...collectAdminSettings(),
          },
        });
        await refreshAdminState();
        render();
        toast("Settings saved.");
      } catch (err) {
        toast(err.message);
      } finally {
        resetLoading();
      }
      return;
    }

    if (actionName === "refresh-admin" || actionName === "export-users") {
      const resetLoading = setButtonLoading(action, true);
      try {
        await refreshAdminState();
        render();
      } catch (err) {
        handleApiError(err);
      } finally {
        resetLoading();
      }
      return;
    }
  }
}

function handleAdminDashboardInput(event) {
  const searchInput = event.target.closest("#adminUserSearchInput");
  const messageSearchInput = event.target.closest("#adminMessageSearchInput");
  const monitorSearchInput = event.target.closest("#mmUserSearch");
  if (!searchInput && !messageSearchInput && !monitorSearchInput) return;

  if (monitorSearchInput) {
    monitorUserSearchQuery = monitorSearchInput.value.trim();
    renderMonitorUsersList(monitorUsersCache);
    return;
  }

  if (messageSearchInput) {
    state.adminMessageSearchQuery = messageSearchInput.value.trim();
    window.clearTimeout(adminSearchDebounce);
    adminSearchDebounce = window.setTimeout(renderAdminDashboard, 300);
    return;
  }

  state.adminUserSearchQuery = searchInput.value.trim();
  window.clearTimeout(adminSearchDebounce);
  adminSearchDebounce = window.setTimeout(async () => {
    try {
      await refreshAdminUsersSearch(state.adminUserSearchQuery);
      renderAdminDashboard();
    } catch (error) {
      handleApiError(error);
    }
  }, 300);
}

async function refreshAdminUsersSearch(search = "") {
  if (!isAdmin()) return;

  const data = await api(`/api/admin/users?search=${encodeURIComponent(search)}`, {
    method: "GET",
  });

  state.admin.users = (data.users || []).map((user) => ({
    ...user,
    id: String(user._id || user.id),
  }));
}

function renderPanels() {
  if (!isAdmin()) {
    renderUserRightPanel();
    elements.userInfoPanel?.classList.remove("hidden");
    elements.safetyPanel?.classList.remove("hidden");
    elements.pulsePanel.classList.add("hidden");
    elements.profilePanel.classList.add("hidden");
    elements.moderationPanel.classList.add("hidden");
    return;
  }

  elements.userInfoPanel?.classList.add("hidden");
  elements.safetyPanel?.classList.add("hidden");
  activePanel = "moderation";
  renderModerationPanel();

  elements.pulsePanel.classList.add("hidden");
  elements.profilePanel.classList.add("hidden");
  elements.moderationPanel.classList.remove("hidden");
}

function renderUserRightPanel() {
  const user = state.session.user;

  if (!elements.userInfoPanel) return;
  if (!elements.userInfoPanel.querySelector('[data-stable-panel="members"]')) {
    elements.userInfoPanel.innerHTML = `
      <div class="user-info-card online-member-card" data-stable-panel="members">
        <div class="profile-large compact-user-card">
          ${renderAvatar(user.name, user.avatarColor, user.avatarDataUrl, "user-info-avatar")}
          <div>
            <h2 data-member-label></h2>
            <p class="online-line"><span class="status-dot"></span> Online in this room</p>
          </div>
        </div>
        <div class="room-info-card">
          <span>Current room</span>
          <strong data-current-room></strong>
          <small data-current-category></small>
        </div>
        <div class="online-call-actions">
          <button class="btn-call-user" type="button" data-call-latest="audio">Audio Call</button>
          <button class="btn-call-user" type="button" data-call-latest="video">Video Call</button>
        </div>
      </div>
    `;

    elements.userInfoPanel.querySelectorAll("[data-call-latest]").forEach((button) => {
      button.addEventListener("click", () => startCallWithLatestPeer(button.dataset.callLatest));
    });
  }

  updateUserRightPanel();
}

function updateUserRightPanel() {
  if (isAdmin() || !elements.userInfoPanel) return;
  const activeRoom = getActiveRoom();
  const activeCount = Number(activeRoom.onlineMembers || activeRoom.activeMembers || 0);
  const memberLabel = `${numberText(activeCount)} anonymous ${activeCount === 1 ? "user" : "users"}`;
  const card = elements.userInfoPanel.querySelector('[data-stable-panel="members"]');
  if (!card) {
    renderUserRightPanel();
    return;
  }

  const detailsTitle = elements.detailsPanel?.querySelector(".details-head span");
  if (detailsTitle) detailsTitle.textContent = "Online Members";
  elements.detailsPanel?.querySelector(".details-head")?.setAttribute("data-active", `${numberText(activeCount)} active`);

  const label = card.querySelector("[data-member-label]");
  const roomName = card.querySelector("[data-current-room]");
  const category = card.querySelector("[data-current-category]");
  if (label) label.textContent = memberLabel;
  if (roomName) roomName.textContent = activeRoom.name || "General Chat";
  if (category) category.textContent = activeRoom.category || "Public Room";
  updateCallButtonsAvailability();
}

function renderPulsePanel() {
  const topRooms = [...state.rooms]
    .sort((a, b) => (b.messageCount || 0) - (a.messageCount || 0))
    .slice(0, 4)
    .map((room) => {
      return `
        <div class="trend-card">
          <div>
            <strong>${escapeHtml(room.name)}</strong>
            <small>${room.category}</small>
          </div>
          <span>${room.messageCount || 0}</span>
        </div>
      `;
    })
    .join("");

  elements.pulsePanel.innerHTML = `
    <div class="saas-header compact">
      <h2 class="saas-title">Campus Pulse</h2>
      <p class="saas-subtitle">Live room activity, safety status, and platform health.</p>
    </div>
    <div class="stat-grid pulse-metrics">
      <div class="stat-card">
        <div class="stat-icon info">U</div>
        <strong>${state.stats.users || 0}</strong>
        <span>Registered users</span>
      </div>
      <div class="stat-card">
        <div class="stat-icon safe">O</div>
        <strong>${state.stats.online || 0}</strong>
        <span>Online now</span>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">R</div>
        <strong>${state.stats.openReports || 0}</strong>
        <span>Open reports</span>
      </div>
      <div class="stat-card">
        <div class="stat-icon info">#</div>
        <strong>${state.rooms.length || 0}</strong>
        <span>Rooms</span>
      </div>
    </div>
    <h3 class="section-title">Room activity</h3>
    <div class="trend-list">${topRooms}</div>
    <h3 class="section-title">Platform</h3>
    <div class="info-card">
      <strong>Production-ready backend</strong>
      <p class="muted">MongoDB Atlas stores sessions, reports, messages, profiles, and moderation state through the server-side Mongoose models.</p>
    </div>
  `;
}

function renderProfilePanel() {
  const user = state.session.user;

  if (isAdmin()) {
    elements.profilePanel.innerHTML = `
      <div class="profile-large">
        <span class="avatar" style="background:${user.avatarColor}">${initials(user.name)}</span>
        <h2>${escapeHtml(user.name)}</h2>
        <p class="muted">@${escapeHtml(user.username)} - admin console</p>
      </div>
      <div class="info-card">
        <strong>Admin login</strong>
        <p class="muted">This account is separate from student registrations. Normal users can never become admin automatically.</p>
      </div>
    `;
    return;
  }

  pendingAvatarDataUrl = "";
  elements.profilePanel.innerHTML = `
    <form class="profile-form" id="profileForm">
      <div class="profile-large">
        <button class="profile-photo-button" type="button" id="profilePhotoButton" aria-label="Change profile photo">
          <span class="profile-photo-frame">
            ${renderAvatar(user.name, user.avatarColor, user.avatarDataUrl, "profile-photo-preview")}
          </span>
          <span class="change-photo-text">${user.avatarDataUrl ? "Change photo" : "Add your photo"}</span>
        </button>
        <h2>${escapeHtml(user.name)}</h2>
        <p class="muted">@${escapeHtml(user.username)} - ${escapeHtml(user.campus)}</p>
        <p class="muted">Your display name and photo appear on your chat messages.</p>
      </div>
      <input class="visually-hidden" id="profilePhotoInput" type="file" accept="image/*" />
      <label for="profileFullNameInput">Account name</label>
      <input id="profileFullNameInput" value="${escapeAttr(user.fullName || "")}" maxlength="60" />
      <label for="profilePublicNameInput">Chat display name</label>
      <input id="profilePublicNameInput" value="${escapeAttr(user.name || "")}" maxlength="40" placeholder="Name shown in chat" />
      <label for="profileContactInput">Contact number</label>
      <input id="profileContactInput" value="${escapeAttr(user.contactNumber || "")}" maxlength="20" />
      <label for="profileGenderSelect">Gender</label>
      <select id="profileGenderSelect">
        <option value="" ${!user.gender ? "selected" : ""}>Prefer not to say</option>
        <option value="male" ${user.gender === "male" ? "selected" : ""}>Male</option>
        <option value="female" ${user.gender === "female" ? "selected" : ""}>Female</option>
        <option value="other" ${user.gender === "other" ? "selected" : ""}>Other</option>
      </select>
      <label for="profileDepartmentInput">Department</label>
      <input id="profileDepartmentInput" value="${escapeAttr(user.department || "")}" maxlength="60" />
      <label for="profileStudyYearSelect">Year</label>
      <select id="profileStudyYearSelect">
        <option value="" ${!user.studyYear ? "selected" : ""}>Select year</option>
        <option value="1" ${user.studyYear === "1" ? "selected" : ""}>1st year</option>
        <option value="2" ${user.studyYear === "2" ? "selected" : ""}>2nd year</option>
        <option value="3" ${user.studyYear === "3" ? "selected" : ""}>3rd year</option>
        <option value="4" ${user.studyYear === "4" ? "selected" : ""}>4th year</option>
        <option value="5" ${user.studyYear === "5" ? "selected" : ""}>5th year</option>
        <option value="alumni" ${user.studyYear === "alumni" ? "selected" : ""}>Alumni</option>
      </select>
      <label for="profileAboutInput">About</label>
      <textarea id="profileAboutInput" rows="3" maxlength="180" placeholder="Write something about yourself">${escapeHtml(user.about || "")}</textarea>
      <label for="profileStatusInput">Custom status</label>
      <input id="profileStatusInput" value="${escapeAttr(user.customStatus || "")}" maxlength="80" placeholder="Available, studying, on campus..." />
      <label for="profileLastSeenSelect">Last seen privacy</label>
      <select id="profileLastSeenSelect">
        <option value="everyone" ${(user.privacySettings?.lastSeen || "everyone") === "everyone" ? "selected" : ""}>Everyone</option>
        <option value="nobody" ${user.privacySettings?.lastSeen === "nobody" ? "selected" : ""}>Nobody</option>
      </select>
      <label for="profileOnlineVisibilitySelect">Online visibility</label>
      <select id="profileOnlineVisibilitySelect">
        <option value="everyone" ${(user.privacySettings?.onlineVisibility || "everyone") === "everyone" ? "selected" : ""}>Show when online</option>
        <option value="nobody" ${user.privacySettings?.onlineVisibility === "nobody" ? "selected" : ""}>Hide online status</option>
      </select>
      <button class="primary-btn" type="button" id="saveProfileButton">Save Profile</button>
    </form>
  `;
}

function renderModerationPanel() {
  if (!isAdmin()) {
    elements.moderationPanel.innerHTML = `
      <div class="saas-empty-state">
        <div class="empty-icon" aria-hidden="true">AD</div>
        <strong>Admin access required</strong>
        <p class="muted">Only the site owner can use this moderation workspace.</p>
      </div>
    `;
    return;
  }

  const reports = state.admin.reports || [];
  const openReports = reports.filter((report) => report.status === "open");
  const hiddenReports = reports.filter((report) => report.status === "hidden");
  const users = state.admin.users || [];
  const bannedUsers = users.filter((user) => user.status === "suspended");
  const activeUsers = users.filter((user) => user.status !== "suspended").length;

  const body =
    state.adminView === "hidden"
      ? renderHiddenReports(hiddenReports)
      : state.adminView === "users"
        ? renderAdminUsers(users)
        : state.adminView === "banned"
          ? renderAdminUsers(bannedUsers, "Suspended users")
          : state.adminView === "audit"
            ? renderAuditLogs(state.admin.auditLogs || [])
            : renderOpenReports(openReports);

  elements.moderationPanel.innerHTML = `
    <div class="saas-header">
      <p class="eyebrow">AnonChat Admin</p>
      <h2 class="saas-title">Moderation Control Center</h2>
      <p class="saas-subtitle">Review reports, manage users, and monitor campus safety from one workspace.</p>
    </div>
    
    <div class="stat-grid saas-metrics">
      <div class="stat-card">
        <div class="stat-icon warning" aria-hidden="true">!</div>
        <div class="stat-content">
          <strong>${openReports.length}</strong>
          <span>Open Reports</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info" aria-hidden="true">H</div>
        <div class="stat-content">
          <strong>${hiddenReports.length}</strong>
          <span>Hidden Items</span>
        </div>
      </div>
    </div>

    <div class="admin-kpi-grid">
      <div class="admin-kpi-card"><span>Total Users</span><strong>${users.length}</strong></div>
      <div class="admin-kpi-card"><span>Active Users</span><strong>${activeUsers}</strong></div>
      <div class="admin-kpi-card"><span>Suspended</span><strong>${bannedUsers.length}</strong></div>
      <div class="admin-kpi-card"><span>Rooms</span><strong>${state.rooms.length}</strong></div>
    </div>

    <div class="admin-subtabs-container">
      <div class="admin-subtabs">
        <button class="admin-subtab ${state.adminView === "review" ? "active" : ""}" type="button" data-admin-view="review">Review Queue</button>
        <button class="admin-subtab ${state.adminView === "hidden" ? "active" : ""}" type="button" data-admin-view="hidden">Hidden Messages</button>
        <button class="admin-subtab ${state.adminView === "users" ? "active" : ""}" type="button" data-admin-view="users">Users</button>
        <button class="admin-subtab ${state.adminView === "banned" ? "active" : ""}" type="button" data-admin-view="banned">Suspended</button>
        <button class="admin-subtab ${state.adminView === "audit" ? "active" : ""}" type="button" data-admin-view="audit">Audit Log</button>
      </div>
    </div>
    
    <div class="saas-body">
      ${body}
    </div>
  `;
}

function renderOpenReports(reports) {
  return `
    <h3 class="section-title">Review queue</h3>
    <div class="report-list">
      ${
        reports.map(renderReportCard).join("") ||
        `<div class="saas-empty-state">No open reports in the queue.</div>`
      }
    </div>
  `;
}

function renderHiddenReports(reports) {
  return `
    <h3 class="section-title">Hidden messages</h3>
    <div class="report-list">
      ${
        reports.map(renderHiddenReportCard).join("") ||
        `<div class="saas-empty-state">No hidden messages found.</div>`
      }
    </div>
  `;
}

function renderReportCard(report) {
  const message = report.message;
  if (!message) return "";
  return `
    <div class="report-card saas-card">
      <div class="saas-card-header">
        <span class="saas-badge warning">Reported: ${escapeHtml(report.reason)}</span>
        <small class="saas-time">${relativeTime(report.createdAt)} by ${escapeHtml(report.reporterName || "Campus member")}</small>
      </div>
      <div class="saas-card-body">
        <p class="muted">"${escapeHtml(message.text)}"</p>
      </div>
      <div class="report-actions saas-card-footer">
        <button class="danger-btn" type="button" data-admin-action="hide" data-report-id="${report.id}">Hide Message</button>
        <button class="safe-btn" type="button" data-admin-action="dismiss" data-report-id="${report.id}">Dismiss</button>
      </div>
    </div>
  `;
}

function renderHiddenReportCard(report) {
  const message = report.message;
  if (!message) return "";
  return `
    <div class="report-card saas-card">
      <div class="saas-card-header">
        <span class="saas-badge neutral">Hidden</span>
        <small class="saas-time">${relativeTime(report.resolvedAt || report.createdAt)} - ${escapeHtml(report.reason)}</small>
      </div>
      <div class="saas-card-body">
        <p class="muted">"${escapeHtml(message.text)}"</p>
      </div>
      <div class="report-actions saas-card-footer">
        <button class="safe-btn" type="button" data-admin-action="restore" data-report-id="${report.id}">Restore</button>
        <button class="danger-btn" type="button" data-admin-action="delete" data-report-id="${report.id}">Delete Permanently</button>
      </div>
    </div>
  `;
}

function renderAdminUsers(users, title = "Registered users") {
  return `
    <h3 class="section-title">${escapeHtml(title)}</h3>
    <div class="report-list">
      ${
        users.map((user) => {
          const suspended = user.status === "suspended";
          return `
            <div class="user-card saas-card">
              <div class="saas-card-header">
                <div class="saas-user-info">
                  <strong>${escapeHtml(user.fullName || user.username)}</strong>
                  <span class="saas-badge ${suspended ? "danger" : "safe"}">${suspended ? "Suspended" : "Active"}</span>
                </div>
                <small class="saas-time">@${escapeHtml(user.username)}</small>
              </div>
              <div class="saas-card-body user-meta">
                <div class="meta-row"><span>Email:</span> ${escapeHtml(user.email)}</div>
                <div class="meta-row"><span>Contact:</span> ${escapeHtml(user.contactNumber || "N/A")}</div>
                <div class="meta-row"><span>Campus:</span> ${escapeHtml(user.campus || "N/A")} (${user.campusVerified ? "Verified" : "Unverified"})</div>
                <div class="meta-row"><span>Academic:</span> ${escapeHtml(user.department || "N/A")} - ${escapeHtml(user.studyYear || "N/A")}</div>
                ${user.suspensionReason ? `<div class="meta-row warning"><span>Reason:</span> ${escapeHtml(user.suspensionReason)}</div>` : ""}
              </div>
              <div class="report-actions saas-card-footer">
                <button class="${suspended ? "safe-btn" : "warning-btn"}" type="button" data-admin-action="${suspended ? "reactivate-user" : "suspend-user"}" data-user-id="${user.id}">
                  ${suspended ? "Reactivate User" : "Suspend User"}
                </button>
                <button class="danger-btn" type="button" data-admin-action="delete-user" data-user-id="${user.id}">
                  Delete Account
                </button>
              </div>
            </div>
          `;
        }).join("") ||
        `<div class="saas-empty-state">No users found.</div>`
      }
    </div>
  `;
}

function renderAuditLogs(logs) {
  return `
    <h3 class="section-title">Audit log</h3>
    <div class="report-list">
      ${
        logs.map((log) => {
          return `
            <div class="report-card saas-card audit-card">
              <div class="saas-card-header">
                <strong>${escapeHtml(log.action)}</strong>
                <small class="saas-time">${relativeTime(log.createdAt)} by ${escapeHtml(log.adminName || "Admin")}</small>
              </div>
              <div class="saas-card-body">
                <p class="muted"><code>${escapeHtml(JSON.stringify(log.meta || {}))}</code></p>
              </div>
            </div>
          `;
        }).join("") ||
        `<div class="saas-empty-state">No audit log entries yet.</div>`
      }
    </div>
  `;
}

function openPanel(panel) {
  activePanel = panel;
  elements.detailsPanel.classList.add("open");
  renderPanels();
}

async function handleProfilePanelChange(event) {
  if (event.target.id !== "profilePhotoInput") return;
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast("Choose an image file.");
    return;
  }

  openAvatarCropper(await fileToDataUrl(file));
  event.target.value = "";
}

function activeProfileRoot() {
  return document.querySelector(".profile-route-page") ||
    document.querySelector(".settings-page") ||
    document.querySelector(".my-rooms-page") ||
    elements.profilePanel;
}

function openAvatarCropper(dataUrl) {
  const image = new Image();
  image.onload = () => {
    cropState = {
      image,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
    };
    elements.avatarZoomInput.value = "1";
    elements.avatarCropModal.classList.remove("hidden");
    drawAvatarCrop();
  };
  image.onerror = () => toast("Could not load this image.");
  image.src = dataUrl;
}

function closeAvatarCropper() {
  cropState = null;
  elements.avatarCropModal.classList.add("hidden");
}

function handleCropZoom() {
  if (!cropState) return;
  cropState.zoom = Number(elements.avatarZoomInput.value);
  drawAvatarCrop();
}

function startCropDrag(event) {
  if (!cropState) return;
  cropState.dragging = true;
  cropState.lastX = event.clientX;
  cropState.lastY = event.clientY;
  elements.avatarCropCanvas.setPointerCapture?.(event.pointerId);
}

function moveCropDrag(event) {
  if (!cropState?.dragging) return;
  cropState.offsetX += event.clientX - cropState.lastX;
  cropState.offsetY += event.clientY - cropState.lastY;
  cropState.lastX = event.clientX;
  cropState.lastY = event.clientY;
  drawAvatarCrop();
}

function stopCropDrag() {
  if (!cropState) return;
  cropState.dragging = false;
}

function drawAvatarCrop() {
  if (!cropState) return;
  const canvas = elements.avatarCropCanvas;
  const context = canvas.getContext("2d");
  const size = canvas.width;
  const image = cropState.image;
  const baseScale = Math.max(size / image.width, size / image.height);
  const scale = baseScale * cropState.zoom;
  const width = image.width * scale;
  const height = image.height * scale;
  const x = (size - width) / 2 + cropState.offsetX;
  const y = (size - height) / 2 + cropState.offsetY;

  context.clearRect(0, 0, size, size);
  context.fillStyle = "#070914";
  context.fillRect(0, 0, size, size);
  context.drawImage(image, x, y, width, height);

  context.save();
  context.globalCompositeOperation = "destination-in";
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.strokeStyle = "rgba(255,255,255,0.86)";
  context.lineWidth = 3;
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function saveCroppedAvatar() {
  if (!cropState) return;

  pendingAvatarDataUrl = elements.avatarCropCanvas.toDataURL("image/png", 0.92);
  const preview = activeProfileRoot()?.querySelector(".profile-photo-preview");

  if (preview) {
    const nextPreview = document.createElement("img");
    nextPreview.className = preview.className;
    nextPreview.src = pendingAvatarDataUrl;
    nextPreview.alt = "Profile photo preview";
    preview.replaceWith(nextPreview);
  }

  closeAvatarCropper();
  toast("Photo cropped. Click Save profile to update it.");
}

async function handleProfilePanelClick(event) {
  const photoButton = event.target.closest("#profilePhotoButton");
  if (photoButton) {
    const input = activeProfileRoot()?.querySelector("#profilePhotoInput");
    input?.click();
    return;
  }

  const saveButton = event.target.closest("#saveProfileButton");
  if (!saveButton) return;

  const resetLoading = setButtonLoading(saveButton, true);
  try {
    if (pendingAvatarDataUrl) {
      try {
        const uploadRes = await api("/api/upload/avatar/base64", {
          method: "POST",
          body: {
            token: state.session.token,
            dataUrl: pendingAvatarDataUrl,
          },
        });
        pendingAvatarDataUrl = uploadRes.url;
      } catch (err) {
        console.warn("Avatar upload failed:", err);
      }
    }

    const { user } = await api("/api/users/profile", {
      method: "PATCH",
      body: {
        token: state.session.token,
        profile: {
          fullName: activeProfileRoot()?.querySelector("#profileFullNameInput")?.value?.trim(),
          anonymousName: activeProfileRoot()?.querySelector("#profilePublicNameInput")?.value?.trim(),
          contactNumber: activeProfileRoot()?.querySelector("#profileContactInput")?.value?.trim(),
          gender: activeProfileRoot()?.querySelector("#profileGenderSelect")?.value,
          department: activeProfileRoot()?.querySelector("#profileDepartmentInput")?.value?.trim(),
          studyYear: activeProfileRoot()?.querySelector("#profileStudyYearSelect")?.value,
          about: activeProfileRoot()?.querySelector("#profileAboutInput")?.value?.trim(),
          customStatus: activeProfileRoot()?.querySelector("#profileStatusInput")?.value?.trim(),
          avatarDataUrl: pendingAvatarDataUrl || state.session.user.avatarDataUrl || "",
          privacySettings: {
            ...(state.session.user.privacySettings || {}),
            lastSeen: activeProfileRoot()?.querySelector("#profileLastSeenSelect")?.value || state.session.user.privacySettings?.lastSeen || "everyone",
            onlineVisibility: activeProfileRoot()?.querySelector("#profileOnlineVisibilitySelect")?.value || state.session.user.privacySettings?.onlineVisibility || "everyone",
          },
          themePreference: loadUserSettings().theme,
        },
      },
    });

    state.session.user = { ...state.session.user, ...user };
    saveSession(state.session);
    pendingAvatarDataUrl = "";
    await refreshState();
    render();
    toast("Profile updated!");
  } catch (error) {
    handleApiError(error);
  } finally {
    resetLoading();
  }
}

async function handleAdminPanelClick(event) {
  const viewButton = event.target.closest("[data-admin-view]");
  if (viewButton) {
    state.adminView = viewButton.dataset.adminView;
    renderModerationPanel();
    return;
  }

  const action = event.target.closest("[data-admin-action]");
  if (!action) return;

  const resetLoading = setButtonLoading(action, true);
  try {
    if (action.dataset.adminAction === "delete-user") {
      const confirmed = window.confirm("Delete this account permanently? This cannot be undone.");
      if (!confirmed) return;
      await api(`/api/admin/users/${action.dataset.userId}`, {
        method: "DELETE",
        body: { token: state.session.token },
      });
      toast("User account deleted.");
    } else if (action.dataset.adminAction === "suspend-user" || action.dataset.adminAction === "reactivate-user") {
      const suspending = action.dataset.adminAction === "suspend-user";
      const reason = suspending ? window.prompt("Suspension reason", "Community safety") : "";
      if (suspending && reason === null) return;

      await api(`/api/admin/users/${action.dataset.userId}/status`, {
        method: "PATCH",
        body: {
          token: state.session.token,
          status: suspending ? "suspended" : "active",
          reason,
        },
      });
      toast(suspending ? "User suspended." : "User reactivated.");
    } else if (action.dataset.adminAction === "delete-room") {
      const confirmed = window.confirm("Delete this room?");
      if (!confirmed) return;

      await api(`/api/admin/rooms/${action.dataset.roomId}`, {
        method: "DELETE",
        body: { token: state.session.token },
      });
      toast("Room deleted.");
    } else if (action.dataset.adminAction === "delete-message") {
      const confirmed = window.confirm("Delete this message?");
      if (!confirmed) return;

      await api(`/api/admin/messages/${action.dataset.messageId}`, {
        method: "DELETE",
        body: { token: state.session.token },
      });
      toast("Message deleted.");
    } else {
      const adminAction = action.dataset.adminAction;
      if (adminAction === "delete") {
        const confirmed = window.confirm("Delete this hidden message permanently?");
        if (!confirmed) return;
      }
      await api(`/api/admin/reports/${action.dataset.reportId}`, {
        method: "PATCH",
        body: {
          token: state.session.token,
          action: adminAction,
        },
      });
      toast(adminAction === "hide" ? "Message hidden." : "Admin action saved.");
    }

    await refreshState();
    await refreshAdminState();
    render();
  } catch (error) {
    handleApiError(error);
  } finally {
    resetLoading();
  }
}

async function api(path, options = {}) {
  const method = options.method || "GET";
  const token = String(state.session?.token || "").trim();
  const isAuthRequest = ["/api/auth/login", "/api/auth/register", "/api/auth/admin-login"].includes(path);
  const timeoutMs = Number(options.timeoutMs || API_TIMEOUT_MS);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (headers.authorization && !headers.Authorization) {
    headers.Authorization = headers.authorization;
    delete headers.authorization;
  }

  if (!headers.Authorization || /^Bearer\s+(null|undefined)?$/i.test(String(headers.Authorization).trim())) {
    delete headers.Authorization;
  }

  if (token && token !== "null" && token !== "undefined" && !isAuthRequest && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      signal: options.signal || controller.signal,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : {};

    if (!response.ok) {
      const error = new Error(payload.error || payload.message || "Request failed.");
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function uploadMultipart(path, fieldName, file, onProgress) {
  const formData = new FormData();
  formData.append(fieldName, file);

  const headers = {};
  if (state.session?.token) {
    headers.Authorization = `Bearer ${state.session.token}`;
  }

  const response = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}${path}`);
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || typeof onProgress !== "function") return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        headers: {
          get(name) {
            return xhr.getResponseHeader(name);
          },
        },
        json: async () => JSON.parse(xhr.responseText || "{}"),
      });
    };
    xhr.onerror = () => reject(new Error("Upload failed."));
    xhr.ontimeout = () => reject(new Error("Upload timed out."));
    xhr.timeout = 45000;
    xhr.send(formData);
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : {};

  if (!response.ok) {
    const error = new Error(payload.error || "Upload failed.");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

function loadSession() {
  const saved = localStorage.getItem(SESSION_KEY);
  if (!saved) return null;

  try {
    const session = JSON.parse(saved);
    return session?.token && session?.user ? session : null;
  } catch (error) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function setButtonLoading(button, isLoading, loadingText = "Loading...") {
  if (!button || !isLoading) return () => {};

  const originalText = button.textContent;
  const originalDisabled = button.disabled;
  button.disabled = true;
  button.textContent = loadingText;

  return () => {
    button.disabled = originalDisabled;
    button.textContent = originalText;
  };
}

function isSessionExpiredError(error) {
  const msg = String(error?.message || "").toLowerCase();
  return (
    Number(error?.status) === 401 ||
    msg.includes("401") ||
    msg.includes("session") ||
    msg.includes("expired") ||
    msg.includes("unauthorized") ||
    msg.includes("invalid token")
  );
}

function handleApiError(error) {
  if (isSessionExpiredError(error)) {
    localStorage.removeItem(SESSION_KEY);
    state.session = null;
    if (socket) {
      socket.disconnect();
      socket = null;
      joinedRoomId = null;
      joiningRoomId = null;
    }
    render();
    toast("Session expired. Please log in again.");
    window.setTimeout(() => {
      navigateTo(LOGIN_ROUTE, { replace: true });
    }, 1500);
    return;
  }

  toast(error.message || "Request failed.");
}

function isAdmin() {
  return state.session?.user?.role === "admin";
}

function isGuestSession() {
  return Boolean(
    state.session?.isGuest ||
    state.session?.user?.isGuest ||
    String(state.session?.token || "").startsWith("guest_token_")
  );
}

function promptGuestUpgrade(message = "Sign up free to unlock this feature.") {
  toast(message);
}

function anonymousUserLabel(user) {
  if (!user) return "Anonymous User";
  if (String(user.name || "").toLowerCase().startsWith("anonymous user")) return user.name;

  const source = String(user.id || user.username || user.name || "anonymous");
  const total = source.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return `Anonymous User #${String(total % 900 + 100)}`;
}

function renderSidebarAvatar(user) {
  elements.profileAvatar.textContent = "";
  elements.profileAvatar.style.background = user.avatarColor || avatarColor(user.name);
  elements.profileAvatar.style.backgroundImage = "";

  if (user.avatarDataUrl) {
    elements.profileAvatar.classList.add("has-photo");
    elements.profileAvatar.style.backgroundImage = `url("${user.avatarDataUrl}")`;
    elements.profileAvatar.setAttribute("aria-label", `${user.name} profile photo`);
    return;
  }

  elements.profileAvatar.classList.remove("has-photo");
  elements.profileAvatar.textContent = initials(user.name);
  elements.profileAvatar.setAttribute("aria-label", `${user.name} avatar`);
}

function getActiveRoom() {
  const room = state.rooms.find((item) =>
    item.id === state.activeRoomId ||
    item.slug === state.activeRoomId ||
    String(item._id) === state.activeRoomId
  );

  if (room) {
    const fallback = ROOM_DISPLAY_FALLBACKS[room.id] || ROOM_DISPLAY_FALLBACKS[room.slug];
    return fallback && !isAdmin()
      ? {
          ...fallback,
          ...room,
          name: fallback.name,
          desc: fallback.desc,
          category: fallback.category,
          icon: fallback.icon,
          color: fallback.color,
        }
      : room;
  }

  if (!isAdmin() && ROOM_DISPLAY_FALLBACKS[state.activeRoomId]) {
    return ROOM_DISPLAY_FALLBACKS[state.activeRoomId];
  }

  return state.rooms[0] || {};
}

function roomName(roomId) {
  const room = state.rooms.find((item) =>
    item.id === roomId ||
    item.slug === roomId ||
    String(item._id) === String(roomId)
  );
  return room?.name || ROOM_DISPLAY_FALLBACKS[roomId]?.name || "another room";
}

function initials(name) {
  return String(name || "A")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function avatarColor(name) {
  const colors = ["#22d3ee", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];
  const total = String(name)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[total % colors.length];
}

function renderAvatar(name, color, dataUrl, extraClass = "", attrs = "") {
  if (dataUrl) {
    return `<img class="avatar ${extraClass}" src="${escapeAttr(dataUrl)}" alt="${escapeAttr(name)}"${mediaSecurityAttrs(dataUrl)} ${attrs} />`;
  }
  return `<span class="avatar ${extraClass}" style="background:${color || avatarColor(name)}" ${attrs}>${initials(name)}</span>`;
}

function relativeTime(timestamp) {
  const diff = Math.max(0, Date.now() - Number(timestamp));
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function isToday(timestamp) {
  const date = new Date(Number(timestamp) || Date.now());
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
}

function isSameDay(firstTimestamp, secondTimestamp) {
  const first = new Date(Number(firstTimestamp || 0));
  const second = new Date(Number(secondTimestamp || 0));
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function numberText(value) {
  return Number(value || 0).toLocaleString();
}

function maskEmail(email) {
  const [name, domain] = String(email || "").split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function defaultUserSettings() {
  return {
    theme: "dark",
    messageNotifications: true,
    roomInvites: true,
    announcements: true,
    sound: true,
    wallpaper: "dark",
    fontSize: "medium",
    mediaAutoDownload: false,
    enterToSend: true,
  };
}

function userSettingsStorageKey() {
  return `${USER_SETTINGS_KEY}:${state.session?.user?.id || "anonymous"}`;
}

function loadUserSettings() {
  try {
    const raw = localStorage.getItem(userSettingsStorageKey());
    const profileTheme = state.session?.user?.themePreference;
    return {
      ...defaultUserSettings(),
      ...(profileTheme ? { theme: normalizeThemeChoice(profileTheme) } : {}),
      ...(raw ? JSON.parse(raw) : {}),
    };
  } catch (error) {
    return {
      ...defaultUserSettings(),
      ...(state.session?.user?.themePreference ? { theme: normalizeThemeChoice(state.session.user.themePreference) } : {}),
    };
  }
}

function saveUserSettings(settings) {
  state.userSettings = { ...defaultUserSettings(), ...settings };
  localStorage.setItem(userSettingsStorageKey(), JSON.stringify(state.userSettings));
  document.body.dataset.chatWallpaper = state.userSettings.wallpaper;
  document.body.dataset.chatFontSize = state.userSettings.fontSize;
  applyThemeChoice(state.userSettings.theme, { persist: false });
}

function collectUserSettings(root) {
  const settings = { ...defaultUserSettings() };
  root?.querySelectorAll("[data-setting]").forEach((input) => {
    settings[input.dataset.setting] = Boolean(input.checked);
  });
  root?.querySelectorAll("[data-setting-group]").forEach((group) => {
    const key = group.dataset.settingGroup;
    const active = group.querySelector(".active[data-setting-value]");
    if (key && active) settings[key] = active.dataset.settingValue;
  });
  return settings;
}

function clearUserCache() {
  const session = localStorage.getItem(SESSION_KEY);
  const roomId = localStorage.getItem(ROOM_KEY);
  Object.keys(localStorage)
    .filter((key) => key.startsWith("anonchat-") && key !== SESSION_KEY && key !== ROOM_KEY)
    .forEach((key) => localStorage.removeItem(key));
  if (session) localStorage.setItem(SESSION_KEY, session);
  if (roomId) localStorage.setItem(ROOM_KEY, roomId);
  state.userSettings = defaultUserSettings();
  saveUserSettings(state.userSettings);
  toast("Local cache cleared.");
}

async function clearAllChatsForMe() {
  const currentUserId = state.session?.user?.id;
  const visibleMessages = state.messages.filter(
    (message) => !message.hidden && !(message.deletedFor || []).map(String).includes(String(currentUserId))
  );

  if (!visibleMessages.length) {
    toast("No chat history to clear.");
    return;
  }

  const confirmed = window.confirm("Clear all chat history only for you?");
  if (!confirmed) return;

  try {
    await Promise.all(
      visibleMessages.map((message) =>
        api(`/api/messages/${message.id}`, {
          method: "DELETE",
          body: {
            token: state.session.token,
            scope: "me",
          },
        })
      )
    );
    await refreshState();
    render();
    toast("All chats cleared for you.");
  } catch (error) {
    handleApiError(error);
  }
}

function openInfoModal(title, body) {
  elements.composerPlaceholderTitle.textContent = title;
  elements.composerPlaceholderBody.textContent = body;
  elements.composerPlaceholderOkButton.classList.remove("hidden");
  elements.composerPlaceholderOkButton.textContent = "Got it";
  elements.composerPlaceholderModal.classList.remove("hidden");
}

function capitalizeLabel(value) {
  return String(value || "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(String(value));
  return String(value).replace(/["\\]/g, "\\$&");
}

function toast(message) {
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  elements.toastStack.appendChild(item);
  window.setTimeout(() => item.remove(), 3000);
}

function showOfflineError(error) {
  console.error(error);
  elements.authOnlineCount.textContent = "Server offline";
  toast("Start the backend with npm start, then open localhost.");
}

window.addEventListener("offline", () => {
  const banner = document.getElementById("offlineBanner");
  if (banner) banner.classList.add("visible");
});

window.addEventListener("online", () => {
  const banner = document.getElementById("offlineBanner");
  if (banner) {
    banner.classList.remove("visible");
    toast("Reconnected to the network.");
  }
});
