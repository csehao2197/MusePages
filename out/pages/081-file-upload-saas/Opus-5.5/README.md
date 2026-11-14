# DriveUploader — upload portal backed by Google Drive

- **Original prompt**: `data/prompts/081-file-upload-saas/081-file-upload-saas.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript app with hash routes
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/file-upload-saas/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Pages

The PRD's pages map to hash routes:

| PRD route | Hash route |
|---|---|
| `/` | `#/` |
| `/signup` | `#/signup` |
| `/login` | `#/login` |
| `/forgot-password` | `#/forgot` |
| `/terms`, `/privacy` | `#/terms`, `#/privacy` |
| `/dashboard` | `#/dashboard` |
| `/dashboard/upload` | `#/dashboard/upload` |
| `/dashboard/uploads/[id]` | `#/dashboard/uploads/:id` |
| `/admin`, `/admin/users`, `/admin/uploads` | `#/admin`, `#/admin/users`, `#/admin/uploads` |

## Implementation choice

The PRD's backend (Next.js route handlers, Prisma DB, bcrypt, Google Drive API) can't run in a static collection. Each piece has a browser equivalent:

| PRD piece | Browser equivalent |
|---|---|
| Users and Upload tables | `localStorage` (`du-v1`), same fields as the Prisma schema (driveFileId, driveFolderId, driveViewLink, status, …) |
| Google Drive files | Real file bytes in **IndexedDB**, keyed by upload id, so preview, download and replace actually work |
| bcrypt | Salted SHA-256, 1,000 rounds (Web Crypto) |
| Session | `localStorage` session pointer |
| Password reset email | The reset code is shown on screen (demo) |
| Drive OAuth | Connect/disconnect is simulated in the admin panel |

## Features

- **Sign-up:** validation (duplicate email, password rules, terms) and a strength meter
- **Login:** a failed-attempt counter with a 30-second lockout, a disabled-account block, and demo account fill buttons
- **Upload:** drag-and-drop, required title (pre-filled from the file name), max-size and daily limits, progress bar with Cancel
- **Dashboard:**
  - table or grid view with image thumbnails
  - search, type filter, sort
  - per-file view, download, edit title, delete
- **Details:**
  - preview (text, image, PDF, audio, video)
  - metadata, including the Drive folder path `DriveUploader/Users/{userId}/`
  - rename, replace file (keeps the Drive file id), delete with a confirmation dialog
- **Ownership checks:** another user's file shows "File not found", and non-admins are blocked from `/admin`
- **Admin:** stats, Drive connection, settings (max size, daily limit, folder id, validated), user enable/disable, all uploads filtered by user

## Mocks and limitations

- **Single browser:** nothing goes to a server or Google Drive. Data persists only in this browser, so users and admins share it.
- **Client-side security only:** password hashing and ownership checks run in the browser. In production they belong on the server.
- **Simulated upload progress:** progress is timed, because storing in IndexedDB is near-instant.

## Run and verify

From the repo root, `node out/pages/081-file-upload-saas/Opus-5.5/page.test.mjs` runs 10 Playwright checks:

- landing, legal pages and the protected-route redirect
- sign-up validation and hashing
- upload with cancel and success
- size limit
- search, filter, grid, edit and download
- details preview, rename, replace and delete confirmation
- ownership and admin block
- lockout, admin settings, disable user and upload filter
- disabled login and the password-reset flow
- mobile layout and 44px targets
- no runtime errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots of the landing page, dashboard and detail view were reviewed visually.
