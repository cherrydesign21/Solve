import Link from "next/link";
import { Mail, Cake, Megaphone, Eye, ArrowUpRight } from "lucide-react";
import { requireAdminPage } from "@/lib/require-admin";
import { ensureBirthdaysTable, ensureContactMessagesTable, ensurePageViewsTable, getSql } from "@/lib/db";
import { getAdsenseSettings } from "@/lib/settings";
import { StatCard } from "@/components/admin/StatCard";

async function safeCount(ensure: () => Promise<void>, table: string): Promise<number> {
  try {
    await ensure();
    const sql = getSql();
    const rows = (await sql`SELECT COUNT(*)::int AS count FROM ${sql(table)}`) as { count: number }[];
    return rows[0]?.count ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminOverviewPage() {
  await requireAdminPage();

  const [contactCount, birthdayCount, viewCount, adsense] = await Promise.all([
    safeCount(ensureContactMessagesTable, "contact_messages"),
    safeCount(ensureBirthdaysTable, "birthdays"),
    safeCount(ensurePageViewsTable, "page_views"),
    getAdsenseSettings(),
  ]);

  const links = [
    { href: "/admin/contact", label: "Contact messages", icon: Mail },
    { href: "/admin/birthdays", label: "Birthday reminders", icon: Cake },
    { href: "/admin/adsense", label: "AdSense settings", icon: Megaphone },
    { href: "/admin/analytics", label: "Visitor analytics", icon: Eye },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="mt-1 text-sm text-white/50">A snapshot of everything happening on Solve.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Mail} label="Contact messages" value={contactCount} />
        <StatCard icon={Cake} label="Birthday reminders" value={birthdayCount} />
        <StatCard icon={Eye} label="Page views (all time)" value={viewCount} />
        <StatCard
          icon={Megaphone}
          label="AdSense"
          value={adsense.enabled && adsense.publisherId ? "Live" : "Not set up"}
          hint={adsense.enabled && adsense.publisherId ? adsense.publisherId : "Add your publisher ID once approved"}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-accent/40 hover:bg-white/[0.06]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 group-hover:text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-white">{label}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-white/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </Link>
        ))}
      </div>
    </div>
  );
}
