import type { MetadataRoute } from "next";
import { sports } from "@/data/sports";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.saeacademynl.com";
  const staticRoutes = ["/", "/sports", "/schools", "/faq", "/schedule"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1.0 : 0.8,
    })),
    ...sports.map((sport) => ({
      url: `${base}/sports/${sport.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
