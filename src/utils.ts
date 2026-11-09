function calculateNumber(
  type: "increase" | "decrease" | "replace",
  currentValue: number,
  maxValue: number,
  minValue: number,
) {
  if (type === "increase") {
    const nextValue = currentValue + 1;
    return nextValue <= maxValue ? nextValue : minValue;
  }
  if (type === "decrease") {
    const prevValue = currentValue - 1;
    return prevValue >= minValue ? prevValue : maxValue;
  }
  return currentValue;
}

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHTML(value: string) {
  return value.replace(/[&<>"']/g, (character) => htmlEscapes[character]);
}

export default calculateNumber;
