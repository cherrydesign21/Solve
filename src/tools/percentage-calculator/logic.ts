export type PercentageMode = "percent-of" | "what-percent" | "percent-change";

export interface ModeConfig {
  id: PercentageMode;
  tabLabel: string;
  xLabel: string;
  yLabel: string;
  resultLabel: string;
  suffix: string;
  describe: (x: number, y: number, result: number) => string;
}

export const modeConfigs: ModeConfig[] = [
  {
    id: "percent-of",
    tabLabel: "X% of Y",
    xLabel: "Percentage",
    yLabel: "Of Value",
    resultLabel: "Result",
    suffix: "",
    describe: (x, y, result) => `${x}% of ${y} is ${result.toLocaleString()}`,
  },
  {
    id: "what-percent",
    tabLabel: "X is What % of Y",
    xLabel: "Value",
    yLabel: "Total",
    resultLabel: "Percentage",
    suffix: "%",
    describe: (x, y, result) => `${x} is ${result.toFixed(2)}% of ${y}`,
  },
  {
    id: "percent-change",
    tabLabel: "% Change",
    xLabel: "From Value",
    yLabel: "To Value",
    resultLabel: "Change",
    suffix: "%",
    describe: (x, y, result) =>
      `${x} to ${y} is ${result >= 0 ? "an increase" : "a decrease"} of ${Math.abs(result).toFixed(2)}%`,
  },
];

export function calculatePercentage(mode: PercentageMode, x: number, y: number): number {
  switch (mode) {
    case "percent-of":
      return (x / 100) * y;
    case "what-percent":
      return y !== 0 ? (x / y) * 100 : 0;
    case "percent-change":
      return x !== 0 ? ((y - x) / x) * 100 : 0;
  }
}
