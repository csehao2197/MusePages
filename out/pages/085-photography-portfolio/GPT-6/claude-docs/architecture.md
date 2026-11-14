# Architecture

Static HTML, CSS and ES modules load a bundled JSON album manifest. A bounded validator derives public slugs, ordered JPG/PNG galleries and cover fallback; an in-memory loader provides 90-second freshness, five-minute expiry and manual reload. Google Drive and server APIs are outside this static implementation.
