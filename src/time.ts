export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function getTimeOfDay(now = new Date()): TimeOfDay {
  const hours = now.getHours();
  if (hours >= 6 && hours < 12) return "morning";
  if (hours >= 12 && hours < 18) return "afternoon";
  if (hours >= 18) return "evening";
  return "night";
}
