export interface Zap {
  accountId: number;
  createdAt: string;
  currentVersion?: any;
  customuserId: number;
  deletedAt: string | null;
  description: string;
  draft?: any;
  editMode: string | null;
  executionEngine: string | null;
  folderId: number;
  id: string;
  isEnabled: boolean;
  kind: "workflow" | "transfer";
  lastDisabledAt: string | null;
  lastEnabledAt: string | null;
  lastUpdatedByCustomuserId: string | null;
  legacyNodeId: string | null;
  sourceUrl: string | null;
  title: string;
  updatedAt: string;
}

export type ClusterPoint = number[];

export interface ClusterGroup {
  folderName: string;
  zapList: string[] | Zap[];
}

export type Groupings = ClusterGroup[];
