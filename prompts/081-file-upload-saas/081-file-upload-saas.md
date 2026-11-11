# PRD — File Upload SaaS → Google Drive (Next.js + Tailwind)

## 1) Product Summary

### Product Name

**DriveUploader (working title)**

### One-liner

A website where users create an account, upload any file with a title, and manage their uploads — while all files are stored securely inside the admin’s Google Drive.

### Core Value

Users get an easy upload portal + management dashboard, while the storage stays in **your Google Drive** (no extra storage cost).

---

## 2) Goals

### MVP Goals

* Public users can sign up + login
* Users upload **any file** with title
* Files are uploaded to admin’s Google Drive
* Users can view, update, delete their uploaded files
* Admin can manage users/files (optional but recommended)

### Success Metrics

* File upload success rate ≥ 98%
* Dashboard loads uploads in < 1.5s
* Secure access: user cannot access other user’s files
* No Google tokens exposed client-side

---

## 3) Roles & Permissions

### 3.1 User

Can:

* Signup / Login / Logout
* Upload file with title
* View only their uploads
* Update upload:

  * change title
  * replace file (optional in MVP)
* Delete upload

Cannot:

* See other users uploads
* Change global upload folder

### 3.2 Admin (You)

Can:

* Connect Google Drive
* Select destination Drive folder
* View all uploads
* Delete or disable user accounts
* Manage platform settings (limits, allowed size, etc.)

---

## 4) Scope

### MVP Scope (must-have)

✅ Authentication (signup/login)
✅ Upload any file
✅ Upload form: title + file
✅ Drive upload (store in specific folder)
✅ User dashboard: list uploads
✅ Update metadata (title)
✅ Delete upload

### Post-MVP

* Replace file during update
* Share link + permission control
* Folders per user inside Drive
* Upload limits per user plan
* Email verification + reset password
* Admin analytics + activity logs
* Drag/drop reorder / tags

---

## 5) User Flows

### 5.1 Signup / Login

1. User opens app
2. Click signup
3. Enter name + email + password
4. Account created
5. Redirect to dashboard

---

### 5.2 Upload File

1. User clicks “Upload New”
2. Form appears:

   * **Title**
   * **Choose File**
3. Click Upload
4. Show progress bar
5. On success:

   * show success toast
   * new upload appears in dashboard list

---

### 5.3 Manage Files (Dashboard)

User sees a table/grid of uploads:

* Title
* File name
* File size
* Upload date
* Status
* Actions: View / Download / Edit / Delete

User can:

* Edit title
* Replace file (if enabled)
* Delete file

---

## 6) Functional Requirements

## 6.1 Authentication

**Requirements**

* Signup: name, email, password
* Login: email + password
* Logout
* Password reset (recommended for MVP)

**Security**

* Password hashing (bcrypt)
* Rate limit login attempts

---

## 6.2 Upload System

### Upload UI

* Drag and drop zone
* Title input field (required)
* File input (required)
* Upload progress indicator
* Cancel upload (optional but recommended)

### Allowed file types

✅ **All files allowed**
Optional: block dangerous types if required later.

### File limits

Configurable:

* max file size (example: 250MB / 1GB)
* max files per user per day/month

---

## 6.3 Upload to Google Drive

Files must be stored inside admin’s Drive.

### Upload storage strategy (recommended)

✅ Create a **Drive folder per user** inside a main folder:

`DriveUploader/Users/{userId}/`

Benefits:

* Easy organization
* Admin can control
* Easy clean delete
* Better audit

### Metadata stored in DB

Store:

* driveFileId
* driveParentFolderId
* title
* originalFileName
* size
* mimeType
* owner userId

---

## 6.4 Dashboard (User)

### List Uploads

Show all uploads by logged-in user.

**Fields**

* Title
* File name
* Type (mime)
* Size
* Uploaded time
* Action buttons

### Actions

1. **View**

* open Drive preview link (or download)

2. **Edit**

* update title
* optional replace file

3. **Delete**

* delete from Drive
* delete record in DB

---

## 6.5 Update Upload

### Update Title

* title editable
* reflect change in DB
* optionally rename Drive file too

### Replace File (optional)

If enabled:

* upload new file
* replace drive file OR create new drive file + update fileId
* keep audit history optional

---

## 6.6 Delete Upload

* Confirm modal “Are you sure?”
* Deletes:

  1. Drive file
  2. DB upload record

If Drive delete fails:

* mark record “deletion_pending”
* retry through cron/job (post-MVP)

---

## 6.7 Admin Panel (recommended but optional MVP)

Admin can:

* View all uploads
* View uploads by user
* Delete any upload
* Disable user accounts
* Configure:

  * max file size
  * storage folderId
  * allowed daily uploads

---

## 7) Pages Required

### Public Pages

* `/` Landing page
* `/signup`
* `/login`
* `/forgot-password`
* `/terms`
* `/privacy`

### User Pages

* `/dashboard`
* `/dashboard/upload`
* `/dashboard/uploads/[id]` (details view)

### Admin Pages (optional)

* `/admin`
* `/admin/users`
* `/admin/uploads`

---

## 8) API Requirements (Next.js Route Handlers)

### `POST /api/auth/signup`

Create user account

### `POST /api/auth/login`

Login

### `POST /api/files/upload`

* Auth required
* Upload file stream
* Upload to Drive
* Save metadata in DB

### `GET /api/files`

List logged-in user’s files

### `PATCH /api/files/:id`

Update title / replace file

### `DELETE /api/files/:id`

Delete file in Drive + DB

---

## 9) DB Schema (Prisma Proposed)

### User

* id
* name
* email (unique)
* passwordHash
* createdAt

### Upload

* id
* userId (FK)
* title
* originalName
* mimeType
* size
* driveFileId
* driveFolderId
* driveViewLink
* status: `UPLOADED | FAILED | DELETING`
* createdAt
* updatedAt

---

## 10) Security Requirements

✅ No Google Drive access token in frontend
✅ All uploads go through backend API
✅ Users can only access their uploads (ownership check)
✅ API protected using session/JWT
✅ Upload validation:

* max file size
* rate limit uploads per IP/user
  ✅ Prevent abuse (public upload risk):
* CAPTCHA on signup (recommended)
* Email verification (recommended)

---

## 11) Tech Stack

### Frontend

* Next.js (App Router)
* Tailwind CSS
* React Hook Form + Zod validation
* Upload UI: react-dropzone (optional)

### Backend

* Next.js API routes / Route handlers
* Google Drive API via `googleapis`
* Upload streaming using Node streams

### Storage

* Google Drive (Admin connected)

### Database

* PostgreSQL + Prisma

### Auth

* NextAuth.js or custom JWT auth
  ✅ Recommended: **NextAuth Credentials Provider**

---

## 12) Deployment Requirements

⚠️ Large file uploads may not work well on Vercel (timeouts / request limits).

✅ Recommended hosting:

* Railway / Render / VPS (DigitalOcean)
* Use Nginx reverse proxy (optional)

---

## 13) Acceptance Criteria

MVP is complete if:

* ✅ Any user can create account
* ✅ User can upload any file with a title
* ✅ Upload progress shown
* ✅ File stored successfully in admin’s Google Drive
* ✅ Dashboard shows uploaded files instantly
* ✅ User can edit title
* ✅ User can delete file and it disappears from both dashboard and Drive
* ✅ User cannot view other user uploads

