import User from './User.js'
import Session from './Session.js'
import AdminSession from './AdminSession.js'
import Room from './Room.js'
import Message from './Message.js'
import Report from './Report.js'
import DeletedUser from './DeletedUser.js'
import PasswordReset from './PasswordReset.js'
import AuditLog from './AuditLog.js'
import Announcement from './Announcement.js'
import PlatformSettings from './PlatformSettings.js'
import Call from './Call.js'
import FriendRequest from './FriendRequest.js'
import Friendship from './Friendship.js'
import DmThread from './DmThread.js'
import DmMessage from './DmMessage.js'
import PushSubscription from './PushSubscription.js'

const models = {
  User,
  Session,
  AdminSession,
  Room,
  Message,
  Report,
  DeletedUser,
  PasswordReset,
  AuditLog,
  AdminAuditLog: AuditLog,
  Announcement,
  PlatformSettings,
  Call,
  FriendRequest,
  Friendship,
  DmThread,
  DmMessage,
  PushSubscription
}

export {
  User,
  Session,
  AdminSession,
  Room,
  Message,
  Report,
  DeletedUser,
  PasswordReset,
  AuditLog,
  AuditLog as AdminAuditLog,
  Announcement,
  PlatformSettings,
  Call,
  FriendRequest,
  Friendship,
  DmThread,
  DmMessage,
  PushSubscription
}

export default models
