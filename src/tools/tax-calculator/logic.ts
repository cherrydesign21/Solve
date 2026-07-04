export type CountryCode = "IN" | "US" | "UK" | "CA" | "AU" | "DE" | "JP" | "RU";
export type TaxRegime = "new" | "old";

interface SlabRow {
  upTo: number;
  rate: number;
}

export interface CountryTaxConfig {
  code: CountryCode;
  name: string;
  currencyCode: string;
  locale: string;
  standardDeduction: number;
  slabs: SlabRow[];
  extraLevyRate: number;
  extraLevyLabel: string;
  incomeMin: number;
  incomeMax: number;
  incomeStep: number;
  incomeDefault: number;
  note: string;
}

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

export const countries: CountryTaxConfig[] = [
  {
    code: "IN",
    name: "India",
    currencyCode: "INR",
    locale: "en-IN",
    standardDeduction: 0, // handled per-regime, see calculateTax
    slabs: [],
    extraLevyRate: 4,
    extraLevyLabel: "Health & Education Cess (4%)",
    incomeMin: 2_00_000,
    incomeMax: 1_00_00_000,
    incomeStep: 10_000,
    incomeDefault: 12_00_000,
    note: "Union Budget slabs (old vs. new regime), plus a 4% health & education cess.",
  },
  {
    code: "US",
    name: "United States",
    currencyCode: "USD",
    locale: "en-US",
    standardDeduction: 14_600,
    slabs: [
      { upTo: 11_600, rate: 10 },
      { upTo: 47_150, rate: 12 },
      { upTo: 100_525, rate: 22 },
      { upTo: 191_950, rate: 24 },
      { upTo: 243_725, rate: 32 },
      { upTo: 609_350, rate: 35 },
      { upTo: Infinity, rate: 37 },
    ],
    extraLevyRate: 0,
    extraLevyLabel: "",
    incomeMin: 20_000,
    incomeMax: 500_000,
    incomeStep: 1_000,
    incomeDefault: 85_000,
    note: "Federal income tax only, single filer standard deduction — excludes state tax, FICA and credits.",
  },
  {
    code: "UK",
    name: "United Kingdom",
    currencyCode: "GBP",
    locale: "en-GB",
    standardDeduction: 12_570,
    slabs: [
      { upTo: 37_700, rate: 20 },
      { upTo: 112_570, rate: 40 },
      { upTo: Infinity, rate: 45 },
    ],
    extraLevyRate: 0,
    extraLevyLabel: "",
    incomeMin: 15_000,
    incomeMax: 300_000,
    incomeStep: 1_000,
    incomeDefault: 45_000,
    note: "England/Wales/NI income tax bands with the standard Personal Allowance — excludes National Insurance.",
  },
  {
    code: "CA",
    name: "Canada",
    currencyCode: "CAD",
    locale: "en-CA",
    standardDeduction: 15_705,
    slabs: [
      { upTo: 55_867, rate: 15 },
      { upTo: 111_733, rate: 20.5 },
      { upTo: 173_205, rate: 26 },
      { upTo: 246_752, rate: 29 },
      { upTo: Infinity, rate: 33 },
    ],
    extraLevyRate: 0,
    extraLevyLabel: "",
    incomeMin: 20_000,
    incomeMax: 400_000,
    incomeStep: 1_000,
    incomeDefault: 75_000,
    note: "Federal tax only with the basic personal amount — excludes provincial tax.",
  },
  {
    code: "AU",
    name: "Australia",
    currencyCode: "AUD",
    locale: "en-AU",
    standardDeduction: 18_200,
    slabs: [
      { upTo: 26_800, rate: 16 },
      { upTo: 116_800, rate: 30 },
      { upTo: 171_800, rate: 37 },
      { upTo: Infinity, rate: 45 },
    ],
    extraLevyRate: 2,
    extraLevyLabel: "Medicare Levy (2%)",
    incomeMin: 20_000,
    incomeMax: 400_000,
    incomeStep: 1_000,
    incomeDefault: 90_000,
    note: "Resident individual tax rates plus the 2% Medicare Levy.",
  },
  {
    code: "DE",
    name: "Germany",
    currencyCode: "EUR",
    locale: "de-DE",
    standardDeduction: 11_604,
    slabs: [
      { upTo: 5_401, rate: 14 },
      { upTo: 55_156, rate: 30 },
      { upTo: 266_221, rate: 42 },
      { upTo: Infinity, rate: 45 },
    ],
    extraLevyRate: 0,
    extraLevyLabel: "",
    incomeMin: 15_000,
    incomeMax: 400_000,
    incomeStep: 1_000,
    incomeDefault: 60_000,
    note: "Approximated with flat bands — Germany's real formula is a continuous curve, not fixed slabs.",
  },
  {
    code: "JP",
    name: "Japan",
    currencyCode: "JPY",
    locale: "ja-JP",
    standardDeduction: 480_000,
    slabs: [
      { upTo: 1_950_000, rate: 5 },
      { upTo: 3_300_000, rate: 10 },
      { upTo: 6_950_000, rate: 20 },
      { upTo: 9_000_000, rate: 23 },
      { upTo: 18_000_000, rate: 33 },
      { upTo: 40_000_000, rate: 40 },
      { upTo: Infinity, rate: 45 },
    ],
    extraLevyRate: 10,
    extraLevyLabel: "Local Inhabitant Tax (approx. 10%)",
    incomeMin: 2_000_000,
    incomeMax: 50_000_000,
    incomeStep: 100_000,
    incomeDefault: 6_000_000,
    note: "National income tax plus the standard ~10% local inhabitant tax.",
  },
  {
    code: "RU",
    name: "Russia",
    currencyCode: "RUB",
    locale: "ru-RU",
    standardDeduction: 0,
    slabs: [
      { upTo: 5_000_000, rate: 13 },
      { upTo: Infinity, rate: 15 },
    ],
    extraLevyRate: 0,
    extraLevyLabel: "",
    incomeMin: 300_000,
    incomeMax: 20_000_000,
    incomeStep: 50_000,
    incomeDefault: 2_000_000,
    note: "Personal income tax (NDFL) two-tier rate.",
  },
];

export function getCountry(code: CountryCode): CountryTaxConfig {
  return countries.find((c) => c.code === code) ?? countries[0];
}

export interface TaxResult {
  grossIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  taxBeforeLevy: number;
  rebate: number;
  levy: number;
  levyLabel: string;
  totalTax: number;
  takeHome: number;
  effectiveRate: number;
}

interface IndiaInput {
  annualIncome: number;
  deductions80c: number;
  otherDeductions: number;
  regime: TaxRegime;
}

function calculateIndiaTax(input: IndiaInput): TaxResult {
  const standardDeduction = input.regime === "new" ? 75_000 : 50_000;
  const investmentDeductions =
    input.regime === "old" ? Math.min(input.deductions80c, 1_50_000) + input.otherDeductions : 0;
  const totalDeductions = standardDeduction + investmentDeductions;
  const taxableIncome = Math.max(0, input.annualIncome - totalDeductions);
  const slabs = input.regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;

  let taxBeforeLevy = slabTax(taxableIncome, slabs);

  const rebateThreshold = input.regime === "new" ? 7_00_000 : 5_00_000;
  let rebate = 0;
  if (taxableIncome <= rebateThreshold) {
    rebate = taxBeforeLevy;
    taxBeforeLevy = 0;
  }

  const levy = taxBeforeLevy * 0.04;
  const totalTax = taxBeforeLevy + levy;
  const takeHome = input.annualIncome - totalTax;
  const effectiveRate = input.annualIncome > 0 ? (totalTax / input.annualIncome) * 100 : 0;

  return {
    grossIncome: input.annualIncome,
    standardDeduction: totalDeductions,
    taxableIncome,
    taxBeforeLevy,
    rebate,
    levy,
    levyLabel: "Health & Education Cess (4%)",
    totalTax,
    takeHome,
    effectiveRate,
  };
}

function calculateGenericTax(country: CountryTaxConfig, income: number): TaxResult {
  const taxableIncome = Math.max(0, income - country.standardDeduction);
  const taxBeforeLevy = slabTax(taxableIncome, country.slabs);
  const levy = taxBeforeLevy * (country.extraLevyRate / 100);
  const totalTax = taxBeforeLevy + levy;
  const takeHome = income - totalTax;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    grossIncome: income,
    standardDeduction: country.standardDeduction,
    taxableIncome,
    taxBeforeLevy,
    rebate: 0,
    levy,
    levyLabel: country.extraLevyLabel,
    totalTax,
    takeHome,
    effectiveRate,
  };
}

export function calculateTax(
  countryCode: CountryCode,
  income: number,
  indiaOptions: { regime: TaxRegime; deductions80c: number; otherDeductions: number }
): TaxResult {
  if (countryCode === "IN") {
    return calculateIndiaTax({
      annualIncome: income,
      deductions80c: indiaOptions.deductions80c,
      otherDeductions: indiaOptions.otherDeductions,
      regime: indiaOptions.regime,
    });
  }
  return calculateGenericTax(getCountry(countryCode), income);
}
