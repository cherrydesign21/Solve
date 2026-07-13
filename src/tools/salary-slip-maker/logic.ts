import { CURRENCIES } from "@/lib/currency-context";
import { formatNumber } from "@/lib/format";
import type { SalarySlipData, SalarySlipTotals } from "./types";

export function symbolFor(currencyCode: string): string {
  return CURRENCIES.find((c) => c.code === currencyCode)?.symbol ?? currencyCode;
}

export function formatMoney(value: number, currencyCode: string): string {
  const decimals = currencyCode === "INR" || currencyCode === "JPY" ? 0 : 2;
  return `${symbolFor(currencyCode)}${formatNumber(value, decimals)}`;
}

export function computeTotals(data: SalarySlipData): SalarySlipTotals {
  const grossEarnings = data.basicSalary + data.hra + data.conveyanceAllowance + data.specialAllowance + data.otherEarnings;
  const totalDeductions = data.providentFund + data.professionalTax + data.incomeTax + data.otherDeductions;
  const netPay = grossEarnings - totalDeductions;
  const leaveBalance = data.leavesAllotted - data.leavesTaken;

  return { grossEarnings, totalDeductions, netPay, leaveBalance };
}

export function formatPayPeriod(payPeriod: string): string {
  if (!payPeriod) return "";
  const [year, month] = payPeriod.split("-").map(Number);
  if (!year || !month) return payPeriod;
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

// payPeriod/dateOfIssue intentionally start blank rather than from `new Date()`
// here — this file is evaluated both at (static) build time on the server and
// again on the client during hydration, and those two "now"s can land on
// different calendar days, which produces a text-content hydration mismatch.
// The tool seeds both from the visitor's own clock in a useEffect instead.
export const defaultSalarySlipData: SalarySlipData = {
  companyName: "Acme Technologies Pvt. Ltd.",
  companyAddress: "4th Floor, Skyline Tower, MG Road, Bengaluru, Karnataka 560001",
  logoDataUrl: null,

  employeeName: "Employee Name",
  employeeId: "EMP-1024",
  designation: "Software Engineer",
  department: "Engineering",
  payPeriod: "",
  dateOfIssue: "",
  bankAccount: "XXXXXXXX4321",
  panNumber: "ABCDE1234F",

  basicSalary: 50_000,
  hra: 20_000,
  conveyanceAllowance: 3_000,
  specialAllowance: 12_000,
  otherEarnings: 0,

  providentFund: 6_000,
  professionalTax: 200,
  incomeTax: 4_500,
  otherDeductions: 0,

  leavesAllotted: 18,
  leavesTaken: 4,
  lopDays: 0,

  currencyCode: "INR",
};
