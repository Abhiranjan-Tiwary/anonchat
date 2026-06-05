# AnonChat

AnonChat is a full-stack, production-ready anonymous college chat application. It provides real-time messaging, campus-based rooms, moderation tools, and an admin console, all built with Node.js, Express, Socket.io, and MongoDB Atlas.

## Features
- **Anonymous Identities:** Users register with their real details but chat using auto-generated anonymous identities.
- **Campus Rooms:** Topic-specific chat rooms (e.g., Confessions, Events, CS Department).
- **Real-Time Engine:** Built on Socket.io for typing indicators, live messaging, reactions, and seen/delivered statuses.
- **Moderation:** Built-in reporting system and an Admin Console for suspending users and deleting messages.
- **MongoDB Persistence:** All users, sessions, rooms, messages, reports, and admin state persist in MongoDB through Mongoose models.

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=anonchat
CORS_ORIGIN=https://your-production-domain.com
CLIENT_URL=http://localhost:3000
JWT_SECRET=replace_with_a_32_plus_character_secret
EMAIL_USER=supportanonchat@gmail.com
EMAIL_PASS=your_gmail_app_password
OTP_EXPIRE_MINUTES=10

# Admin Credentials
ADMIN_USERNAME=siteadmin
ADMIN_PASSWORD=YourSecurePassword123
ADMIN_NAME=Site Admin
```

### 3. Start the Server
```bash
npm run dev
# or
npm start
```
The application will be available at `http://localhost:3000`.

## Database Behavior
- `MONGODB_URI` is required. If MongoDB is missing or unavailable, the server exits instead of falling back to local files.
- Mongoose models live in `server/models/` and own the app collections and indexes.

## Deployment (Render / Railway)

1. Connect your GitHub repository to Render or Railway.
2. Set the **Build Command**: `npm install`
3. Set the **Start Command**: `npm start`
4. Add the necessary environment variables (`MONGODB_URI`, `CORS_ORIGIN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`).
5. Deploy. The backend will automatically apply `Helmet`-style headers and enforce strict `CORS` when `NODE_ENV=production`.

## Security Features
- Strict CORS validation based on `CORS_ORIGIN`.
- Custom `Content-Security-Policy`, `X-XSS-Protection`, and `Strict-Transport-Security` headers.
- Rate limiting on Auth, Messaging, Reporting, and Password Reset endpoints.
- Error stack traces hidden in production.
- Graceful shutdown handlers for SIGINT/SIGTERM.
