import { AdvisoryLogEntry } from "@/src/repositories/recommendationRepository/types/advisoryLog";

export interface AdvisoryLogsResponseData {
  logs: AdvisoryLogEntry[];
  pagination: PaginationMeta;
}


export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}