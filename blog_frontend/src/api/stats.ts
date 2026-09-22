export interface SiteStats {
  posts: number
  tags: number
}

/** 模拟后端（真实项目换成 fetch('/api/stats')） */
export async function fetchSiteStats(): Promise<SiteStats> {
  await new Promise((r) => setTimeout(r, 300))
  return { posts: 40, tags: 39 }
}