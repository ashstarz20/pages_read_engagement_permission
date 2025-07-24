// Accept all three periods
export type InsightPeriod = "day" | "week" | "days_28";

// Calculate percentage change
export const calculateChange = (current: number, previous: number): string => {
  if (previous === 0) {
    return current === 0 ? "0%" : "N/A";
  }
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
};

// Return [current, previous] for any period
export const getComparisonValues = (
  values: number[] | undefined,
  period: InsightPeriod
): [number, number] => {
  if (!values || values.length < 2) {
    return [0, 0];
  }
  const len = values.length;
  const current = values[len - 1];
  // previous is second‑last in the array regardless of period
  const previous = values[len - 2];
  return [current, previous];
};

// Friendly label
export const getComparisonText = (period: InsightPeriod): string => {
  switch (period) {
    case "day":
      return "from yesterday";
    case "week":
      return "from last week";
    case "days_28":
      return "from 28 days ago";
  }
};
