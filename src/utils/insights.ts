// Helper function to calculate percentage changes
export const calculateChange = (current: number, previous: number): string => {
  if (previous === 0) {
    return current === 0 ? "0%" : "N/A";
  }
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
};

// Helper function to get current and previous values
export const getComparisonValues = (
  values: number[] | undefined,
  period: "day" | "week"
): [number, number] => {
  if (!values || values.length < 2) {
    return [0, 0];
  }

  const current = values[values.length - 1];
  let previous = 0;

  if (period === "day") {
    previous = values[values.length - 2];
  } else if (period === "week") {
    previous = values.length >= 2 ? values[values.length - 2] : 0;
  }

  return [current, previous];
};

// Helper to get comparison text
export const getComparisonText = (period: "day" | "week"): string => {
  return period === "day" ? "from yesterday" : "from last week";
};
