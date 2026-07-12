import { revalidatePath } from "next/cache";
import { requireAdminPage } from "@/lib/require-admin";
import { getAdsenseSettings, saveAdsenseSettings } from "@/lib/settings";
import { Card } from "@/components/ui/Card";

const inputClass =
  "w-full rounded-md border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-accent/60 [color-scheme:dark]";

async function updateAdsenseSettings(formData: FormData) {
  "use server";
  await requireAdminPage();
  await saveAdsenseSettings({
    enabled: formData.get("enabled") === "on",
    publisherId: String(formData.get("publisherId") ?? ""),
    horizontalSlotId: String(formData.get("horizontalSlotId") ?? ""),
    verticalSlotId: String(formData.get("verticalSlotId") ?? ""),
  });
  revalidatePath("/admin/adsense");
  revalidatePath("/", "layout");
}

export default async function AdminAdsensePage() {
  await requireAdminPage();
  const settings = await getAdsenseSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">AdSense</h1>
        <p className="mt-1 text-sm text-white/50">
          Fill this in once your Google AdSense account is approved — the site will automatically start
          serving real ads in place of the placeholder boxes, no redeploy required.
        </p>
      </div>

      <Card className="max-w-xl p-6">
        <form action={updateAdsenseSettings} className="flex flex-col gap-5">
          <label className="flex items-center gap-3 text-sm font-medium text-white">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={settings.enabled}
              className="h-4 w-4 accent-accent"
            />
            Enable AdSense on the site
          </label>

          <div className="flex flex-col gap-2">
            <label htmlFor="publisherId" className="text-sm font-medium text-white">
              Publisher ID
            </label>
            <input
              id="publisherId"
              name="publisherId"
              defaultValue={settings.publisherId}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="horizontalSlotId" className="text-sm font-medium text-white">
              Horizontal ad slot ID
            </label>
            <input
              id="horizontalSlotId"
              name="horizontalSlotId"
              defaultValue={settings.horizontalSlotId}
              placeholder="1234567890"
              className={inputClass}
            />
            <p className="text-xs text-white/40">Used for the banner slot under every tool page.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="verticalSlotId" className="text-sm font-medium text-white">
              Vertical ad slot ID
            </label>
            <input
              id="verticalSlotId"
              name="verticalSlotId"
              defaultValue={settings.verticalSlotId}
              placeholder="0987654321"
              className={inputClass}
            />
            <p className="text-xs text-white/40">Used for the in-tool sidebar/vertical slot.</p>
          </div>

          <button
            type="submit"
            className="self-start rounded-md bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-opacity hover:opacity-90"
          >
            Save
          </button>
        </form>
      </Card>

      <p className="text-xs text-white/40">
        <code className="rounded bg-white/10 px-1.5 py-0.5">/ads.txt</code> is generated automatically from your
        publisher ID above — no manual file to upload.
      </p>
    </div>
  );
}
