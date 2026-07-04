"use client";

import { cloneElement, isValidElement, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import { FileImage, FileText, ImagePlus, X } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { NumberField } from "@/components/ui/NumberField";
import { SelectField } from "@/components/ui/SelectField";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { CURRENCIES } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { defaultSalarySlipData, symbolFor } from "./logic";
import { exportNodeAsJpg, exportNodeAsPdf } from "./export";
import { SlipPreview } from "./SlipPreview";
import type { SalarySlipData } from "./types";

function SectionHeading({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{children}</p>;
}

function LabeledField({ label, children }: { label: string; children: ReactElement<{ id?: string }> }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-white/50">
        {label}
      </label>
      {isValidElement(children) ? cloneElement(children, { id }) : children}
    </div>
  );
}

const currencyOptions = CURRENCIES.map((c) => ({ value: c.code, label: `${c.symbol} ${c.code}` }));

export default function SalarySlipMaker() {
  const tool = getToolBySlug("salary-slip-maker")!;
  const [data, setData] = useState<SalarySlipData>(defaultSalarySlipData);
  const previewRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState<"jpg" | "pdf" | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const symbol = symbolFor(data.currencyCode);

  const update = <K extends keyof SalarySlipData>(key: K, value: SalarySlipData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("logoDataUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleExport = async (kind: "jpg" | "pdf") => {
    if (!previewRef.current) return;
    setExporting(kind);
    setExportError(null);
    try {
      const slug = (data.employeeName || "employee").toLowerCase().replace(/\s+/g, "-");
      await (kind === "jpg"
        ? exportNodeAsJpg(previewRef.current, `salary-slip-${slug}.jpg`)
        : exportNodeAsPdf(previewRef.current, `salary-slip-${slug}.pdf`));
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Could not export the salary slip.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <SectionHeading>Company</SectionHeading>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/20 bg-white/[0.03] text-white/40 transition-colors hover:border-white/40 hover:text-white/70"
                >
                  {data.logoDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.logoDataUrl} alt="Logo" className="h-full w-full object-contain" />
                  ) : (
                    <ImagePlus className="h-5 w-5" />
                  )}
                </button>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="text-left text-sm font-medium text-accent"
                  >
                    {data.logoDataUrl ? "Change logo" : "Upload logo"}
                  </button>
                  {data.logoDataUrl && (
                    <button
                      type="button"
                      onClick={() => update("logoDataUrl", null)}
                      className="flex items-center gap-1 text-left text-xs text-white/40 hover:text-white/70"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoFile(e.target.files?.[0])}
                />
              </div>
              <LabeledField label="Company Name">
                <TextField value={data.companyName} onChange={(v) => update("companyName", v)} placeholder="Company Name" />
              </LabeledField>
              <LabeledField label="Company Address">
                <TextField
                  value={data.companyAddress}
                  onChange={(v) => update("companyAddress", v)}
                  placeholder="Company Address"
                />
              </LabeledField>
              <LabeledField label="Currency">
                <SelectField
                  options={currencyOptions}
                  value={data.currencyCode}
                  onChange={(v) => update("currencyCode", v)}
                  ariaLabel="Currency"
                  className="max-w-[160px]"
                />
              </LabeledField>
            </div>

            <div className="flex flex-col gap-4">
              <SectionHeading>Employee &amp; Pay Period</SectionHeading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LabeledField label="Employee Name">
                  <TextField value={data.employeeName} onChange={(v) => update("employeeName", v)} placeholder="Full name" />
                </LabeledField>
                <LabeledField label="Employee ID">
                  <TextField value={data.employeeId} onChange={(v) => update("employeeId", v)} placeholder="EMP-1024" />
                </LabeledField>
                <LabeledField label="Designation">
                  <TextField value={data.designation} onChange={(v) => update("designation", v)} placeholder="Designation" />
                </LabeledField>
                <LabeledField label="Department">
                  <TextField value={data.department} onChange={(v) => update("department", v)} placeholder="Department" />
                </LabeledField>
                <LabeledField label="Pay Period">
                  <TextField type="month" value={data.payPeriod} onChange={(v) => update("payPeriod", v)} />
                </LabeledField>
                <LabeledField label="Date of Issue">
                  <TextField type="date" value={data.dateOfIssue} onChange={(v) => update("dateOfIssue", v)} />
                </LabeledField>
                <LabeledField label="Bank Account">
                  <TextField value={data.bankAccount} onChange={(v) => update("bankAccount", v)} placeholder="Account number" />
                </LabeledField>
                <LabeledField label="PAN / Tax ID">
                  <TextField value={data.panNumber} onChange={(v) => update("panNumber", v)} placeholder="PAN / Tax ID" />
                </LabeledField>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SectionHeading>Earnings</SectionHeading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LabeledField label="Basic Salary">
                  <NumberField value={data.basicSalary} onChange={(v) => update("basicSalary", v)} prefix={symbol} min={0} />
                </LabeledField>
                <LabeledField label="House Rent Allowance">
                  <NumberField value={data.hra} onChange={(v) => update("hra", v)} prefix={symbol} min={0} />
                </LabeledField>
                <LabeledField label="Conveyance Allowance">
                  <NumberField
                    value={data.conveyanceAllowance}
                    onChange={(v) => update("conveyanceAllowance", v)}
                    prefix={symbol}
                    min={0}
                  />
                </LabeledField>
                <LabeledField label="Special Allowance">
                  <NumberField
                    value={data.specialAllowance}
                    onChange={(v) => update("specialAllowance", v)}
                    prefix={symbol}
                    min={0}
                  />
                </LabeledField>
                <LabeledField label="Other Earnings">
                  <NumberField value={data.otherEarnings} onChange={(v) => update("otherEarnings", v)} prefix={symbol} min={0} />
                </LabeledField>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SectionHeading>Deductions</SectionHeading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LabeledField label="Provident Fund">
                  <NumberField value={data.providentFund} onChange={(v) => update("providentFund", v)} prefix={symbol} min={0} />
                </LabeledField>
                <LabeledField label="Professional Tax">
                  <NumberField
                    value={data.professionalTax}
                    onChange={(v) => update("professionalTax", v)}
                    prefix={symbol}
                    min={0}
                  />
                </LabeledField>
                <LabeledField label="Income Tax (TDS)">
                  <NumberField value={data.incomeTax} onChange={(v) => update("incomeTax", v)} prefix={symbol} min={0} />
                </LabeledField>
                <LabeledField label="Other Deductions">
                  <NumberField
                    value={data.otherDeductions}
                    onChange={(v) => update("otherDeductions", v)}
                    prefix={symbol}
                    min={0}
                  />
                </LabeledField>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SectionHeading>Leaves</SectionHeading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <LabeledField label="Leaves Allotted">
                  <NumberField value={data.leavesAllotted} onChange={(v) => update("leavesAllotted", v)} min={0} />
                </LabeledField>
                <LabeledField label="Leaves Taken">
                  <NumberField value={data.leavesTaken} onChange={(v) => update("leavesTaken", v)} min={0} />
                </LabeledField>
                <LabeledField label="Loss of Pay (Days)">
                  <NumberField value={data.lopDays} onChange={(v) => update("lopDays", v)} min={0} />
                </LabeledField>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-x-auto">
              <SlipPreview ref={previewRef} data={data} />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleExport("jpg")}
                disabled={exporting !== null}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FileImage className="h-4 w-4" />
                {exporting === "jpg" ? "Exporting…" : "Download JPG"}
              </button>
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                disabled={exporting !== null}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FileText className="h-4 w-4" />
                {exporting === "pdf" ? "Exporting…" : "Download PDF"}
              </button>
            </div>

            {exportError && <p className="text-xs text-red-400">{exportError}</p>}

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          Fill in company and employee details, earnings, deductions and leave balances on the left, and
          watch the payslip update live on the right. Net pay is simply total earnings minus total
          deductions — everything else here is formatting and layout.
        </p>
        <p>
          Export renders the preview exactly as shown to an image or PDF entirely in your browser, so your
          salary details are never sent to a server. Use the currency selector on this page (not the site-wide
          one) since a payslip needs to stay in one fixed currency regardless of who&apos;s viewing it.
        </p>
      </ToolExplainer>
    </div>
  );
}
