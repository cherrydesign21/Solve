export interface SolarInput {
  monthlyUnits: number;
  costPerUnit: number;
  sunHours: number;
  panelWattage: number;
  costPerKw: number;
}

export interface SolarResult {
  dailyUnits: number;
  systemSizeKw: number;
  panelCount: number;
  areaRequiredSqm: number;
  totalCost: number;
  monthlySavings: number;
  paybackYears: number;
  co2OffsetTonnesPerYear: number;
}

const SYSTEM_EFFICIENCY = 0.8; // accounts for inverter, wiring and temperature losses
const AREA_PER_KW_SQM = 6.5; // approx roof area needed per kW of standard panels
const CO2_FACTOR_KG_PER_KWH = 0.82; // approx grid emission factor

export function calculateSolar(input: SolarInput): SolarResult {
  const dailyUnits = input.monthlyUnits / 30;
  const systemSizeKw = dailyUnits / (input.sunHours * SYSTEM_EFFICIENCY);
  const panelCount = Math.ceil((systemSizeKw * 1000) / input.panelWattage);
  const areaRequiredSqm = systemSizeKw * AREA_PER_KW_SQM;
  const totalCost = systemSizeKw * input.costPerKw;
  const monthlySavings = input.monthlyUnits * input.costPerUnit;
  const annualSavings = monthlySavings * 12;
  const paybackYears = annualSavings > 0 ? totalCost / annualSavings : 0;
  const co2OffsetTonnesPerYear = (input.monthlyUnits * 12 * CO2_FACTOR_KG_PER_KWH) / 1000;

  return {
    dailyUnits,
    systemSizeKw,
    panelCount,
    areaRequiredSqm,
    totalCost,
    monthlySavings,
    paybackYears,
    co2OffsetTonnesPerYear,
  };
}
