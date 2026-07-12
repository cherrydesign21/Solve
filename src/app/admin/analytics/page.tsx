import { Eye, CalendarDays, TrendingUp } from "lucide-react";
import { requireAdminPage } from "@/lib/require-admin";
import { ensurePageViewsTable, getSql } from "@/lib/db";
import { StatCard } from "@/components/admin/StatCard";
import { AdminTable } from "@/components/admin/AdminTable";

interface TopPageRow {
  path: string;
  count: number;
}

interface RecentViewRow {
  path: string;
  referrer: string | null;
  created_at: string;
}

interface AnalyticsData {
  total: number;
  today: number;
  last7Days: number;
  topPages: TopPageRow[];
  recent: RecentViewRow[];
}

async function getAnalytics(): Promise<AnalyticsData> {
  try {
    await ensurePageViewsTable();
    const sql = getSql();
    const [totals] = (await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE created_at >= now() - interval '1 day')::int AS today,
        COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS last7days
      FROM page_views
    `) as { total: number; today: number; last7days: number }[];

    const topPages = (await sql`
      SELECT path, COUNT(*)::int AS count FROM page_views
      WHERE created_at >= now() - interval '30 days'
      GROUP BY path ORDER BY count DESC LIMIT 10
    `) as TopPageRow[];

    const recent = (await sql`
      SELECT path, referrer, created_at FROM page_views ORDER BY created_at DESC LIMIT 20
    `) as RecentViewRow[];

    return {
      total: totals?.total ?? 0,
      today: totals?.today ?? 0,
      last7Days: totals?.last7days ?? 0,
      topPages,
      recent,
    };
  } catch {
    return { total: 0, today: 0, last7Days: 0, topPages: [], recent: [] };
  }
}

export default async function AdminAnalyticsPage() {
  await requireAdminPage();
  const data = await getAnalytics();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Visitor console</h1>
        <p className="mt-1 text-sm text-white/50">
          Lightweight page-view tracking — path, referrer and time only, no cookies or IP storage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Eye} label="Views, last 24h" value={data.today} />
        <StatCard icon={CalendarDays} label="Views, last 7 days" value={data.last7Days} />
        <StatCard icon={TrendingUp} label="Views, all time" value={data.total} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Top pages (last 30 days)</h2>
        <AdminTable
          emptyLabel="No page views recorded yet."
          columns={[
            { key: "path", label: "Path" },
            { key: "count", label: "Views" },
          ]}
          rows={data.topPages.map((p) => ({ path: p.path, count: p.count }))}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Recent visits</h2>
        <AdminTable
          emptyLabel="No page views recorded yet."
          columns={[
            { key: "path", label: "Path" },
            { key: "referrer", label: "Referrer" },
            { key: "date", label: "Time" },
          ]}
          rows={data.recent.map((v) => ({
            path: v.path,
            referrer: v.referrer || "—",
            date: new Date(v.created_at).toLocaleString(),
          }))}
        />
      </div>
    </div>
  );
}
