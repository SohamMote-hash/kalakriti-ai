// Categorical palette — fixed order, validated for colorblind-safe adjacent
// pairs (see dataviz skill). Use as a contiguous prefix for N series; never
// reorder or cycle.
export const CATEGORICAL = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
];

export const STATUS = {
  good: "#0ca30c",
  warning: "#fab219",
  serious: "#ec835a",
  critical: "#d03b3b",
};

export const CHART_CHROME = {
  grid: "#e7dcc7",
  axis: "#d8c8a8",
  mutedText: "#6b6055",
  primaryText: "#2b2420",
};

export const COMPETITION_COLOR: Record<"Low" | "Medium" | "High", string> = {
  Low: STATUS.good,
  Medium: STATUS.warning,
  High: STATUS.serious,
};
