export const setUserOnline = async () => {};

export const setUserOffline = async () => {};

export const getOnlineUsers = async () => [];

export const getOnlineCount = async () => {
  try {
    return globalThis.anonchatIo?.engine?.clientsCount || 0;
  } catch {
    return 0;
  }
};

export const joinRoomPresence = async () => {};

export const leaveRoomPresence = async () => {};

export const getRoomMemberCount = async () => 0;

export const leaveAllRooms = async () => {};
