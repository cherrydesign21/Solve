import { requireAdminPage } from "@/lib/require-admin";
import { ensureBirthdaysTable, getSql } from "@/lib/db";
import { AdminTable } from "@/components/admin/AdminTable";

interface BirthdayRow {
  id: string;
  name: string;
  dob: string;
  email: string;
  last_notified_year: number | null;
  created_at: string;
}

async function getBirthdays(): Promise<BirthdayRow[]> {
  try {
    await ensureBirthdaysTable();
    const sql = getSql();
    return (await sql`
      SELECT id, name, dob::text AS dob, email, last_notified_year, created_at
      FROM birthdays ORDER BY created_at DESC
    `) as BirthdayRow[];
  } catch {
    return [];
  }
}

export default async function AdminBirthdaysPage() {
  await requireAdminPage();
  const birthdays = await getBirthdays();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Birthday reminders</h1>
        <p className="mt-1 text-sm text-white/50">
          Entries saved from the public Birthday Reminder tool. Email addresses are only ever shown here.
        </p>
      </div>

      <AdminTable
        emptyLabel="No birthdays saved yet."
        columns={[
          { key: "name", label: "Name" },
          { key: "dob", label: "Date of birth" },
          { key: "email", label: "Email" },
          { key: "lastNotified", label: "Last notified" },
          { key: "date", label: "Added" },
        ]}
        rows={birthdays.map((b) => ({
          name: b.name,
          dob: new Date(b.dob).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
          email: (
            <a href={`mailto:${b.email}`} className="text-accent hover:underline">
              {b.email}
            </a>
          ),
          lastNotified: b.last_notified_year ?? "—",
          date: new Date(b.created_at).toLocaleString(),
        }))}
      />
    </div>
  );
}
