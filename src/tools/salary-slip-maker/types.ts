export interface SalarySlipData {
  // Company
  companyName: string;
  companyAddress: string;
  logoDataUrl: string | null;

  // Employee / pay period
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  payPeriod: string; // yyyy-mm, from <input type="month">
  dateOfIssue: string; // yyyy-mm-dd
  bankAccount: string;
  panNumber: string;

  // Earnings
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  specialAllowance: number;
  otherEarnings: number;

  // Deductions
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;

  // Leaves
  leavesAllotted: number;
  leavesTaken: number;
  lopDays: number;

  currencyCode: string;
}

export interface SalarySlipTotals {
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  leaveBalance: number;
}
