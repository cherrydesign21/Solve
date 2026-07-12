import { requireAdminPage } from "@/lib/require-admin";
import { ensureContactMessagesTable, getSql } from "@/lib/db";
import { AdminTable } from "@/components/admin/AdminTable";

interface ContactRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  created_at: string;
}

async function getContactMessages(): Promise<ContactRow[]> {
  try {
    await ensureContactMessagesTable();
    const sql = getSql();
    return (await sql`
      SELECT id, first_name, last_name, email, message, created_at
      FROM contact_messages ORDER BY created_at DESC
    `) as ContactRow[];
  } catch {
    return [];
  }
}

export default async function AdminContactPage() {
  await requireAdminPage();
  const messages = await getContactMessages();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Contact messages</h1>
        <p className="mt-1 text-sm text-white/50">Everything submitted through the public contact form.</p>
      </div>

      <AdminTable
        emptyLabel="No messages yet."
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "message", label: "Message", className: "min-w-[280px]" },
          { key: "date", label: "Received" },
        ]}
        rows={messages.map((m) => ({
          name: `${m.first_name} ${m.last_name}`,
          email: (
            <a href={`mailto:${m.email}`} className="text-accent hover:underline">
              {m.email}
            </a>
          ),
          message: <p className="whitespace-pre-wrap">{m.message}</p>,
          date: new Date(m.created_at).toLocaleString(),
        }))}
      />
    </div>
  );
}
