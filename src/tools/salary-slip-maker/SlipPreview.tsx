import { forwardRef } from "react";
import { computeTotals, formatDate, formatMoney, formatPayPeriod } from "./logic";
import type { SalarySlipData } from "./types";

// Plain hex colors (not Tailwind's oklch/color-mix-based utilities) so this
// subtree stays exportable via html2canvas, which can't parse modern CSS
// color functions like oklch()/lab()/color-mix().
const c = {
  white: "#ffffff",
  ink: "#111827",
  slate800: "#1f2937",
  slate500: "#6b7280",
  slate400: "#9ca3af",
  slate300: "#d1d5db",
  slate100: "#f3f4f6",
  dark: "#111318",
  accent: "#d9ff00",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: c.slate400 }}>
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium" style={{ color: c.slate800 }}>
        {value || "—"}
      </p>
    </div>
  );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-1.5"
      style={bold ? undefined : { borderBottom: `1px solid ${c.slate100}` }}
    >
      <p className="text-sm" style={{ color: bold ? c.ink : c.slate500, fontWeight: bold ? 600 : 400 }}>
        {label}
      </p>
      <p className="text-sm tabular-nums" style={{ color: bold ? c.ink : c.slate800, fontWeight: bold ? 600 : 500 }}>
        {value}
      </p>
    </div>
  );
}

export const SlipPreview = forwardRef<HTMLDivElement, { data: SalarySlipData }>(function SlipPreview(
  { data },
  ref
) {
  const totals = computeTotals(data);
  const currency = (value: number) => formatMoney(value, data.currencyCode);

  return (
    <div ref={ref} className="w-full overflow-hidden rounded-lg shadow-2xl" style={{ backgroundColor: c.white, color: c.ink }}>
      <div className="h-1.5" style={{ backgroundColor: c.accent }} />

      <div
        className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8"
        style={{ borderBottom: `1px solid ${c.slate100}` }}
      >
        <div className="flex items-center gap-4">
          {data.logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.logoDataUrl} alt="Company logo" className="h-14 w-14 shrink-0 rounded-md object-contain" />
          ) : (
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md text-xs"
              style={{ backgroundColor: c.slate100, color: c.slate400 }}
            >
              Logo
            </div>
          )}
          <div>
            <p className="text-lg font-bold" style={{ color: c.ink }}>
              {data.companyName || "Company Name"}
            </p>
            <p className="mt-0.5 max-w-xs whitespace-pre-line text-xs" style={{ color: c.slate500 }}>
              {data.companyAddress}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: c.slate800 }}>
            Salary Slip
          </p>
          <p className="mt-0.5 text-xs" style={{ color: c.slate400 }}>
            {formatPayPeriod(data.payPeriod)}
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-x-6 gap-y-4 p-6 sm:grid-cols-4 sm:p-8"
        style={{ borderBottom: `1px solid ${c.slate100}` }}
      >
        <Field label="Employee Name" value={data.employeeName} />
        <Field label="Employee ID" value={data.employeeId} />
        <Field label="Designation" value={data.designation} />
        <Field label="Department" value={data.department} />
        <Field label="Pay Period" value={formatPayPeriod(data.payPeriod)} />
        <Field label="Date of Issue" value={formatDate(data.dateOfIssue)} />
        <Field label="Bank Account" value={data.bankAccount} />
        <Field label="PAN / Tax ID" value={data.panNumber} />
      </div>

      <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: c.slate400 }}>
            Earnings
          </p>
          <Row label="Basic Salary" value={currency(data.basicSalary)} />
          <Row label="House Rent Allowance" value={currency(data.hra)} />
          <Row label="Conveyance Allowance" value={currency(data.conveyanceAllowance)} />
          <Row label="Special Allowance" value={currency(data.specialAllowance)} />
          {data.otherEarnings > 0 && <Row label="Other Earnings" value={currency(data.otherEarnings)} />}
          <div className="mt-2 pt-2">
            <Row label="Gross Earnings" value={currency(totals.grossEarnings)} bold />
          </div>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: c.slate400 }}>
            Deductions
          </p>
          <Row label="Provident Fund" value={currency(data.providentFund)} />
          <Row label="Professional Tax" value={currency(data.professionalTax)} />
          <Row label="Income Tax (TDS)" value={currency(data.incomeTax)} />
          {data.otherDeductions > 0 && <Row label="Other Deductions" value={currency(data.otherDeductions)} />}
          <div className="mt-2 pt-2">
            <Row label="Total Deductions" value={currency(totals.totalDeductions)} bold />
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-2 px-6 py-5 sm:px-8"
        style={{ backgroundColor: c.dark }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: c.slate300 }}>
          Net Pay
        </p>
        <p className="text-2xl font-bold" style={{ color: c.accent }}>
          {currency(totals.netPay)}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6 sm:p-8" style={{ borderTop: `1px solid ${c.slate100}` }}>
        <Field label="Leaves Allotted" value={String(data.leavesAllotted)} />
        <Field label="Leaves Taken" value={String(data.leavesTaken)} />
        <Field label="Leave Balance" value={String(totals.leaveBalance)} />
        {data.lopDays > 0 && <Field label="Loss of Pay (Days)" value={String(data.lopDays)} />}
      </div>

      <p className="px-6 pb-6 text-[10px] sm:px-8" style={{ color: c.slate400 }}>
        This is a computer-generated salary slip and does not require a signature.
      </p>
    </div>
  );
});
