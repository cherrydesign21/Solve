export interface PropertyTaxInputs {
  propertyValue: number;
  assessmentRatioPct: number;
  taxRatePct: number;
  exemption: number;
}

export interface PropertyTaxResult {
  assessedValue: number;
  taxableValue: number;
  annualTax: number;
  monthlyTax: number;
  effectiveRatePct: number;
}

export function calculatePropertyTax(inputs: PropertyTaxInputs): PropertyTaxResult {
  const { propertyValue, assessmentRatioPct, taxRatePct, exemption } = inputs;
  const assessedValue = propertyValue * (assessmentRatioPct / 100);
  const taxableValue = Math.max(0, assessedValue - exemption);
  const annualTax = taxableValue * (taxRatePct / 100);
  const monthlyTax = annualTax / 12;
  const effectiveRatePct = propertyValue > 0 ? (annualTax / propertyValue) * 100 : 0;

  return { assessedValue, taxableValue, annualTax, monthlyTax, effectiveRatePct };
}
