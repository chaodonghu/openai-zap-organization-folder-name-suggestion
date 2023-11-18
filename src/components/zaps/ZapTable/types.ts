export type HeldRuns = {
  /**
   * Date held runs start expiring
   */
  startsExpiringOn?: string;
  /**
   * Total held task count for this zap
   */
  total: number;
};

/** Status of a draft - enabled, disabled, or other specific state
 *
 * unpublishedDraft - represents a Zap that is disabled and cannot be
 * enabled because it does not have a currentVersion published
 */
export type ZapStatus = "on" | "off" | "unpublishedDraft";

/* Status of Queued Action */
export type QueuedActionStatus =
  | "complete"
  | "failed"
  | "in_progress"
  | "waiting";

/* Type of Queued Action */
export type QueuedActionType =
  | "changeOwner"
  | "disable"
  | "duplicate"
  | "enable"
  | "move";
