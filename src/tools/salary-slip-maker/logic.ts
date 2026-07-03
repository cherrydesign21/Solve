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

const today = new Date();

export const defaultSalarySlipData: SalarySlipData = {
  companyName: "Acme Technologies Pvt. Ltd.",
  companyAddress: "4th Floor, Skyline Tower, MG Road, Bengaluru, Karnataka 560001",
  logoDataUrl: null,

  employeeName: "Employee Name",
  employeeId: "EMP-1024",
  designation: "Software Engineer",
  department: "Engineering",
  payPeriod: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
  dateOfIssue: today.toISOString().slice(0, 10),
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
