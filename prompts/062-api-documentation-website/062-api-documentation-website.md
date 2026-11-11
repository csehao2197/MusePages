Create a comprehensive API documentation page for a SaaS product. Include these sections:

1. DOCUMENTATION HEADER
- Product logo
- "API Reference" title
- Version selector dropdown: v2.1 (latest), v2.0, v1.x
- Search bar: "Search documentation..."
- "Get API Key" button
- Status indicator (API Status: Operational)

2. SIDEBAR NAVIGATION (Sticky)
Collapsible sections:
- Getting Started
  - Introduction
  - Authentication
  - Rate Limits
  - Errors
  - Versioning

- Core Resources
  - Users
  - Projects
  - Tasks
  - Comments
  - Files

- Webhooks
  - Setup
  - Events
  - Payloads
  - Security

- SDKs & Libraries
  - JavaScript
  - Python
  - Ruby
  - Go
  - PHP

- Guides
  - Quick Start
  - Pagination
  - Filtering
  - Batch Operations

3. QUICK START SECTION
Get up and running:
- Step 1: Get your API key
- Step 2: Make your first request
- Step 3: Explore the API

Code example:
```bash
curl -X GET "https://api.example.com/v2/users" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Response preview in collapsible panel

4. AUTHENTICATION SECTION
- API Key authentication
- OAuth 2.0 flow explanation
- Token refresh process
- Security best practices
- Example headers

Code tabs: cURL, JavaScript, Python, Ruby

5. ENDPOINT DOCUMENTATION
For each endpoint, include:

Endpoint header:
- Method badge: GET / POST / PUT / DELETE (color-coded)
- Path: /v2/users/{id}
- Description: "Retrieve a user by ID"

Parameters table:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | The user's unique ID |
| include | string | No | Related resources to include |

Request example:
```javascript
const response = await fetch('https://api.example.com/v2/users/123', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
```

Response example:
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-15T10:30:00Z"
}
```

Response fields table with descriptions

6. INTERACTIVE API PLAYGROUND
- "Try it" button on each endpoint
- Pre-filled with example values
- Use your API key (or test key)
- Execute request
- See live response
- Copy code snippet in your language

7. CODE EXAMPLES
Language tabs for each endpoint:
- cURL
- JavaScript (Node.js)
- Python
- Ruby
- Go
- PHP

Full, copy-paste ready examples

8. ERROR HANDLING
Error codes table:
| Code | Name | Description |
|------|------|-------------|
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid API key |
| 404 | Not Found | Resource doesn't exist |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Something went wrong |

Error response format example

9. RATE LIMITS
- Request limits per plan
- Headers showing limit status
- Handling rate limit errors
- Best practices for staying under limits

10. PAGINATION
- Cursor-based pagination explanation
- Page size options
- Example request and response
- Navigating between pages

11. WEBHOOKS DOCUMENTATION
- Available events list
- Webhook payload format
- Signature verification
- Retry policy
- Testing webhooks locally

12. CHANGELOG
- Recent API changes
- Breaking changes highlighted
- Deprecation notices
- Migration guides

13. SDK SECTION
For each language:
- Installation: npm install, pip install, etc.
- Quick example
- Link to GitHub repo
- Documentation link

14. SUPPORT FOOTER
- "Need help?" section
- Developer community link
- Stack Overflow tag
- Support email
- Status page link

Design: Three-column layout (nav, content, code). Syntax highlighting. Dark mode toggle. Sticky navigation. Mobile: Hamburger menu, single column. Copy buttons on all code blocks. Smooth anchor scrolling.