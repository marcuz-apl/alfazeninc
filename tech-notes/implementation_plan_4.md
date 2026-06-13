# Admin Dashboard Implementation Plan

We will add a secure Admin Dashboard at `/admin` to let the administrator log in and manage the messages submitted by guests.

## User Review Required

> [!IMPORTANT]
> - **Credentials**: The admin dashboard will use simple username/password validation. Credentials can be configured via environment variables (`ADMIN_USERNAME` and `ADMIN_PASSWORD`), defaulting to `admin` and `admin123` for development.
> - **Authentication**: We will use secure, HTTP-only session cookies (`admin_session`) to verify requests to the admin API, avoiding the need for heavy session databases or OAuth setups.
> - **Actions**: The admin will be able to view all submitted messages (Name, Email, Phone, Message, Timestamp) and delete individual messages.

## Proposed Changes

### 1. API Endpoints
- **[NEW] [login/route.ts](file:///root/projects/alfazeninc-agy/src/app/api/admin/login/route.ts)**: Validates admin credentials and sets the HTTP-only cookie.
- **[NEW] [logout/route.ts](file:///root/projects/alfazeninc-agy/src/app/api/admin/logout/route.ts)**: Clears the session cookie.
- **[NEW] [messages/route.ts](file:///root/projects/alfazeninc-agy/src/app/api/admin/messages/route.ts)**: 
  - `GET`: Returns a list of all messages if authenticated.
  - `DELETE`: Deletes a specific message by its SQLite ID.

### 2. Frontend Admin Page
- **[NEW] [page.tsx](file:///root/projects/alfazeninc-agy/src/app/admin/page.tsx)**: 
  - Render a premium Glassmorphic Login Card if unauthorized.
  - Render a clean, animated Dashboard Table (using `framer-motion`) if logged in.
  - Displays counters (Total Messages, Today's Messages).
  - Handles login, log out, and message deletions dynamically.

### 3. Styling (`src/app/globals.css`)
- Add dashboard layout, tables, stats cards, and login wrapper styles in Vanilla CSS.

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm everything compiles without warnings.

### Manual Verification
- Navigate to `/admin`.
- Try logging in with incorrect credentials (should show error).
- Log in with `admin` / `admin123`.
- Submit a mock contact form message from the homepage.
- Verify the message appears in the admin dashboard.
- Delete the message and verify it is removed from the SQLite database.
- Click logout and verify access to `/admin` returns to the login screen.
