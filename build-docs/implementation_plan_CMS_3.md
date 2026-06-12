# Implementation Plan - CMS Media Manager

This plan details the addition of a dedicated **Media Tab** in the Admin Panel, supporting file uploads from local drives, downloads from external URLs, dynamic usage tracking, file deletion, and a local folder file explorer interface.

## User Review Required

> [!IMPORTANT]
> - **Direct File Deletions:** Deleting a file through the Media Manager will physically remove it from disk (`public/images/...`). To prevent broken links on the website, the server will check if the asset is in use across the database (Hero, Services, Gallery, Team, or Articles) and warn or block deletion.
> - **HTML5 Multipart Form Uploads:** We will use Next.js's native `request.formData()` parsing for uploads, saving the binary buffer directly to the filesystem.

## Open Questions

> [!NOTE]
> 1. **Filename Collisions:** If an uploaded/downloaded file has the same name as an existing file (e.g. `logo.png` or `avatar.jpg`), should we overwrite it, append a timestamp, or warn the user? (We propose appending a unique timestamp to prevent accidental overwrites).
> 2. **File Size/Type Limits:** We propose restricting uploads to standard image formats (JPEG, PNG, WEBP, GIF) and video formats (MP4, WEBM) under `50MB` to maintain system speed.

---

## Proposed Changes

### Backend API Routes

#### [NEW] [route.ts](file:///root/projects/alfazeninc-agy/src/app/api/admin/media/route.ts)
- **`GET`:** List all files inside each section subfolder under `public/images/` (returning an object grouped by section: `hero`, `services`, `gallery`, `team`, `articles`).
- **`DELETE`:** Accepts `{ filename, section }`. Checks if the file path `/images/<section>/<filename>` is currently linked in the database. If in use, blocks deletion with a warning. Otherwise, deletes the file from disk using `fs.unlinkSync`.

#### [NEW] [route.ts](file:///root/projects/alfazeninc-agy/src/app/api/admin/media/upload/route.ts)
- **`POST`:** Handles multipart file uploads. Accepts fields `file` (binary) and 
<truncated 2168 bytes>