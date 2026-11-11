# Photography Portfolio — Project Specification

Version: 1.0  
Last Updated: 2026-01-25

---

## 1. Project Overview

This project is a public-facing photography portfolio and project gallery built with:

- React
- TypeScript
- Next.js (App Router)
- Tailwind CSS
- TanStack Query

The website displays photography projects that are automatically synchronized from a private Google Drive folder. Clients upload images via Google Drive, and the website dynamically pulls and displays them without requiring manual updates.

The system uses a Google Drive Service Account for secure, server-side access.

---

## 2. Project Goals

### Primary Goals

- Provide a professional public portfolio website.
- Allow clients to upload and manage photos using Google Drive.
- Automatically reflect additions and deletions on the website.
- Display projects in clean, modern galleries.
- Support scalable expansion (videos, booking, payments).

### Secondary Goals

- Minimize manual content management.
- Maintain strong performance via caching.
- Provide a high-quality visual experience.
- Ensure long-term maintainability.

### Non-Goals (MVP)

- No admin dashboard.
- No client login system.
- No image downloads.
- No CMS integration.
- No payments (planned for future versions).

---

## 3. Target Users

### Primary Users

- Photography clients uploading project photos.
- Public visitors viewing the portfolio.

### Secondary Users

- Site owner/administrator managing the Drive folder.
- Developers maintaining the project.

---

## 4. Core User Flows

### Visitor Flow

1. Visitor opens homepage.
2. Views Hero and can scroll to featured projects.
3. Navigates to /projects.
4. Selects an album.
5. Browses images in grid.
6. Opens images in modal.
7. Navigates via arrows/swipe.
8. Optionally visits Hire page (future).

### Client Flow

1. Client opens shared Google Drive folder.
2. Creates new album folder.
3. Uploads JPG/PNG images.
4. Optionally renames files for ordering.
5. Website auto-updates.

---

## 5. Project Milestones

### MVP (Version 1)

- Google Drive integration
- Album listing page (/projects)
- Album detail page (/projects/[slug])
- Uniform gallery grid
- Modal image viewer
- Service account authentication
- Caching with TanStack Query

### Version 2

- Video support (separate section)
- Featured masonry sections
- Performance optimizations
- Enhanced metadata
- SEO improvements

### Version 3+

- Booking system
- Payments
- Admin dashboard
- CMS integration
- Internationalization

---

## 6. Storage Architecture

### Google Drive Setup

Parent Folder:
Photography Site Albums/

Album Folder Naming:
YYYY-MM-DD__Project-Title

Example:
2026-01-25__Winter-Portraits

Slug Generation:
Project-Title → lowercase → dash-separated

Example:
Winter-Portraits → winter-portraits

### File Naming

Ordering:
001__filename.jpg
002__filename.jpg

Allowed Formats:
- JPG
- PNG

Disallowed:
- RAW
- HEIC
- Unsupported formats

### Cover Image

Optional:
__cover.jpg

If missing, use first image by filename sort.

### Video Files (V2)

- MP4, MOV
- Stored in same album folder
- Displayed in separate section

---

## 7. Data Access Model

### Authentication

- Google Drive Service Account
- Private Drive access
- Folder shared with service account
- No public Drive sharing

### Access Pattern

Client Browser → Next.js API → Google Drive API → Service Account

All Drive access is server-side.

---

## 8. API Design

### GET /api/projects

Returns list of albums.

Response Shape:

[
  {
    "slug": "winter-portraits",
    "title": "Winter Portraits",
    "date": "2026-01-25",
    "coverUrl": "string",
    "updatedTime": "ISO8601"
  }
]

---

### GET /api/projects/[slug]

Returns album content.

Response Shape:

{
  "slug": "winter-portraits",
  "title": "Winter Portraits",
  "date": "2026-01-25",
  "images": [
    {
      "id": "string",
      "name": "001__image.jpg",
      "url": "string",
      "thumbUrl": "string"
    }
  ],
  "videos": []
}

---

### GET /api/media/[id]

Streams media files from Google Drive.

Used for private image proxying.

---

## 9. Frontend Architecture

### Routes

/ → Home  
/projects → Album Grid  
/projects/[slug] → Album Page  
/about → About Page  
/hire → Hire Page (future)

---

### Layout

Global Layout:
- Navbar
- Footer
- QueryClientProvider

---

### Gallery Display Modes

#### Featured Masonry (Home / Featured)

- CSS columns
- No cropping
- Natural aspect ratio

#### Project Gallery (Main Album)

- Uniform grid
- Fixed aspect ratio (portrait)
- object-fit: cover
- Cropped edges allowed

---

### Modal Viewer

Features:
- Left/right arrows
- Swipe gestures
- Keyboard navigation
- ESC close
- Looping navigation

---

## 10. Data Fetching Strategy

### TanStack Query

- useProjects()
- useProject(slug)

Default Settings:
- staleTime: 60–120 seconds
- cacheTime: 5 minutes
- refetchOnWindowFocus: false

Manual Refresh:
- Invalidate queries on demand

---

## 11. Performance Strategy

- Next.js Image Optimization
- Server-side prefetching
- Query caching
- Lazy loading
- Responsive images

---

## 12. Security Constraints

- Service account credentials stored in environment variables
- No secrets in repository
- No client-side Drive access
- No direct Drive URLs exposed
- Media proxied via API

---

## 13. Coding Standards

- Strict TypeScript
- ESLint + Prettier
- Modular components
- Feature-based folders
- Typed API responses

---

## 14. Documentation Requirements

Maintain the following:

- claude-docs/architecture.md
- claude-docs/changelog.md
- claude-docs/status.md
- claude-docs/frontend.md

Update after major changes.

---

## 15. Development Workflow (PSB Aligned)

### Plan Phase

- Update this spec before major changes
- Use Claude plan mode
- Clarify assumptions
- Define success criteria

### Setup Phase

- Initialize GitHub repo
- Configure environment variables
- Create CLAUDE.md
- Install plugins and MCPs
- Configure permissions

### Build Phase

Use three workflows:

1. Feature workflow: Research → Plan → Implement → Test
2. Issue-based workflow
3. Multi-agent workflow (git worktrees)

---

## 16. Regression Prevention

- Update CLAUDE.md when mistakes occur
- Document new rules
- Add automated tests
- Maintain changelog

---

## 17. Testing Strategy

- Unit tests for utilities
- Integration tests for API routes
- Playwright E2E tests for galleries
- Manual mobile testing for swipe gestures

---

## 18. Deployment

- GitHub → Vercel integration
- Preview deployments per branch
- Environment secrets via Vercel dashboard

---

## 19. Success Criteria (MVP)

The MVP is considered complete when:

- Albums auto-sync from Drive
- /projects loads correctly
- /projects/[slug] renders gallery
- Modal navigation works
- Images are private in Drive
- No manual content updates required
- Performance meets Lighthouse “Good” standards

---

## 20. Known Risks

- Google API quota limits
- Large album performance
- Image bandwidth usage
- Mobile layout bugs
- OAuth credential misconfiguration

---

## 21. Future Considerations

- Stripe integration
- Booking calendar
- CMS
- Admin panel
- CDN-backed media cache
- AI-assisted tagging

---

End of Specification
