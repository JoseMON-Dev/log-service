export type Severity = "info" | "warn" | "error" | "debug";

export interface LoggerOptions {
  serviceId: string;
  endpoint: string;
  apiKey: string;
}

export class Logger {
  private options: LoggerOptions;

  constructor(options: LoggerOptions) {
    this.options = options;
  }

  log(message: string) {
    this.printToConsole("info", message);
    this.sendRemoteLog("info", message);
  }

  error(message: string) {
    this.printToConsole("error", message);
    this.sendRemoteLog("error", message);
  }

  warn(message: string) {
    this.printToConsole("warn", message);
    this.sendRemoteLog("warn", message);
  }

  debug(message: string) {
    this.printToConsole("debug", message);
    this.sendRemoteLog("debug", message);
  }

  private printToConsole(severity: Severity, message: string) {
    const timestamp = new Date().toISOString();
    const colors: Record<Severity, string> = {
      info: "\x1b[32m", // Green
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      debug: "\x1b[90m", // Gray
    };
    const reset = "\x1b[0m";
    const color = colors[severity] || reset;

    console.log(`[${this.options.serviceId}] ${timestamp} ${color}${severity.toUpperCase()}${reset}: ${message}`);
  }

  private async sendRemoteLog(severity: Severity, message: string, retryCount = 0) {
    const payload = {
      severity,
      message,
      timestamp: new Date().toISOString(),
      serviceId: this.options.serviceId,
    };

    try {
      const response = await fetch(this.options.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.options.apiKey,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok && retryCount < 3) {
        this.scheduleRetry(severity, message, retryCount);
      }
    } catch (error: any) {
      if (retryCount < 3) {
        this.scheduleRetry(severity, message, retryCount);
      }
      // Silent failure: errors in the SDK must not crash the parent application.
    }
  }

  private scheduleRetry(severity: Severity, message: string, retryCount: number) {
    const delay = 1000 * Math.pow(2, retryCount);
    setTimeout(() => this.sendRemoteLog(severity, message, retryCount + 1), delay);
  }
}
