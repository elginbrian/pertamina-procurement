import type { DeadlineItem, DeadlineStatus } from "./types";

export function getDeadlineTiming(targetDate: string, warningDays: number, currentStatus?: DeadlineStatus) {
  const targetTime = new Date(`${targetDate}T23:59:59`).getTime();
  const daysRemaining = Number.isNaN(targetTime)
    ? 0
    : Math.ceil((targetTime - Date.now()) / 86400000);

  if (currentStatus === "Selesai") {
    return { daysRemaining, status: "Selesai" as const };
  }

  const status: Exclude<DeadlineStatus, "Selesai"> = daysRemaining < 0
    ? "Overdue"
    : daysRemaining <= warningDays
      ? "At Risk"
      : "On Track";

  return { daysRemaining, status };
}
