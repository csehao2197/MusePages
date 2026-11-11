import type { MetadataRoute } from "next";
import { projects, siteUrl } from "@/lib/data";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: siteUrl }, ...projects.map(p => ({ url: `${siteUrl}/work/${p.slug}` })), { url: `${siteUrl}/inquiry` }]; }
