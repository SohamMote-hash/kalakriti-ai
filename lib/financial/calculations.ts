import type { FinancialInputs, FinancialResults } from "@/types";

export function calculateFinancials(inputs: FinancialInputs): FinancialResults {
  const {
    materialCost,
    labourCost,
    packagingCost,
    transportCost,
    otherCost,
    productionQuantity,
    sellingPrice,
  } = inputs;

  const costPerUnit =
    materialCost + labourCost + packagingCost + transportCost + otherCost;

  const totalMonthlyCost = costPerUnit * productionQuantity;
  const totalRevenue = sellingPrice * productionQuantity;
  const estimatedProfit = totalRevenue - totalMonthlyCost;
  const profitPerUnit = sellingPrice - costPerUnit;
  const profitMarginPercent =
    sellingPrice > 0 ? (profitPerUnit / sellingPrice) * 100 : 0;
  const breakEvenUnits =
    profitPerUnit > 0 ? Math.ceil(totalMonthlyCost / sellingPrice) : Infinity;

  return {
    costPerUnit,
    totalMonthlyCost,
    totalRevenue,
    estimatedProfit,
    profitMarginPercent,
    breakEvenUnits,
    profitPerUnit,
  };
}

export function costBreakdown(inputs: FinancialInputs) {
  return [
    { name: "Material", value: inputs.materialCost },
    { name: "Labour", value: inputs.labourCost },
    { name: "Packaging", value: inputs.packagingCost },
    { name: "Transport", value: inputs.transportCost },
    { name: "Other", value: inputs.otherCost },
  ].filter((item) => item.value > 0);
}

export const defaultFinancialInputs: FinancialInputs = {
  materialCost: 150,
  labourCost: 120,
  packagingCost: 30,
  transportCost: 15,
  otherCost: 5,
  productionQuantity: 50,
  sellingPrice: 600,
};
