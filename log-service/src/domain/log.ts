export interface Log {
  severity: "info" | "warn" | "error" | "debug";
  message: string;
  timestamp: string;
  serviceId: string;
}
