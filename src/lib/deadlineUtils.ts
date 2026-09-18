import { DeadlineItem, DeadlineStatus, ProcurementState } from "@/types";

export function getDeadlineTiming(deadline: Partial<DeadlineItem> & { targetDate: string }, warningDays: number) {
  let baseTargetTime = new Date(`${deadline.targetDate}T23:59:59`).getTime();
  
  if (deadline.accumulatedPausedDays) {
    baseTargetTime += deadline.accumulatedPausedDays * 86400000;
  }

  let currentTimeToCompare = Date.now();
  if (deadline.pausedAt) {
    currentTimeToCompare = new Date(deadline.pausedAt).getTime();
  }

  const daysRemaining = Number.isNaN(baseTargetTime)
    ? 0
    : Math.ceil((baseTargetTime - currentTimeToCompare) / 86400000);

  if (deadline.status === "Selesai") {
    return { daysRemaining, status: "Selesai" as const };
  }

  const status: Exclude<DeadlineStatus, "Selesai"> = daysRemaining < 0
    ? "Overdue"
    : daysRemaining <= warningDays
      ? "At Risk"
      : "On Track";

  return { daysRemaining, status };
}
