export interface LogFilter {
  timeRange?: {
    start: string;
    end?: string;
  };
  serviceId?: string;
  severity?: "info" | "warn" | "error" | "debug";
}
