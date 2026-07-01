export type TaxRegime = "new" | "old";

interface SlabRow {
  upTo: number;
  rate: number;
}

const NEW_REGIME_SLABS: SlabRow[] = [
  { upTo: 3_00_000, rate: 0 },
  { upTo: 7_00_000, rate: 5 },
  { upTo: 10_00_000, rate: 10 },
  { upTo: 12_00_000, rate: 15 },
  { upTo: 15_00_000, rate: 20 },
  { upTo: Infinity, rate: 30 },
];

const OLD_REGIME_SLABS: SlabRow[] = [
  { upTo: 2_50_000, rate: 0 },
  { upTo: 5_00_000, rate: 5 },
  { upTo: 10_00_000, rate: 20 },
  { upTo: Infinity, rate: 30 },
];

function slabTax(taxableIncome: number, slabs: SlabRow[]): number {
  let tax = 0;
  let lower = 0;
  for (const slab of slabs) {
    if (taxableIncome <= lower) break;
    const taxableInSlab = Math.min(taxableIncome, slab.upTo) - lower;
    tax += taxableInSlab * (slab.rate / 100);
    lower = slab.upTo;
  }
  return tax;
}

export interface TaxInput {
  annualIncome: number;
  deductions80c: number;
  otherDeductions: number;
  regime: TaxRegime;
}

export interface TaxResult {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  rebate: number;
  cess: number;
  totalTax: number;
  takeHome: number;
  effectiveRate: number;
}

export function calculateTax(input: TaxInput): TaxResult {
  const standardDeduction = input.regime === "new" ? 75_000 : 50_000;
  const investmentDeductions =
    input.regime === "old" ? Math.min(input.deductions80c, 1_50_000) + input.otherDeductions : 0;
  const totalDeductions = standardDeduction + investmentDeductions;
  const taxableIncome = Math.max(0, input.annualIncome - totalDeductions);
  const slabs = input.regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;

  let taxBeforeCess = slabTax(taxableIncome, slabs);

  const rebateThreshold = input.regime === "new" ? 7_00_000 : 5_00_000;
  let rebate = 0;
  if (taxableIncome <= rebateThreshold) {
    rebate = taxBeforeCess;
    taxBeforeCess = 0;
  }

  const cess = taxBeforeCess * 0.04;
  const totalTax = taxBeforeCess + cess;
  const takeHome = input.annualIncome - totalTax;
  const effectiveRate = input.annualIncome > 0 ? (totalTax / input.annualIncome) * 100 : 0;

  return {
    grossIncome: input.annualIncome,
    standardDeduction,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
    rebate,
    cess,
    totalTax,
    takeHome,
    effectiveRate,
  };
}
