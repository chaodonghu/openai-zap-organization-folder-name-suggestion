export interface ZapierSession {
  zap_session: string;
  csrf_token: string;
  sso_hint: string;
}

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

export interface ScoredZapNode {
  action: string
  authId: number;
  id: number;
  parentId: number;
  rootId: number;
  selectedApi: string;
  type: "read" | "write";
}

export interface ScoredZapOwner {
  code: string;
  email: string;
  fullName: string;
  id: number;
  photoUrl: string;
  timezone: string;

}

export interface ScoredZap {
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
  id: number;
  isEnabled: boolean;
  kind: "workflow" | "transfer";
  lastDisabledAt: string | null;
  lastEnabledAt: string | null;
  lastUpdatedByCustomuserId: string | null;
  legacyNodeId: string | null;
  nodes: ScoredZapNode[];
  owner: ScoredZapOwner;
  ownerId: number;
  score: number;
  sourceUrl: string | null;
  title: string;
  updatedAt: string;
}

export interface Service {
  name: string;
  src: string;
}

export type ZapStatus = "on" | "off" | "unpublishedDraft";

export type SearchSource = "redis" | "pinecone";

export type SearchType = "plain" | "zdl";

export type ResultRating = "thumbsUp" | "thumbsDown";