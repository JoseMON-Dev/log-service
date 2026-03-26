import { Inject } from "typescript-ioc";
import { Log } from "../domain/log";
import { LogFilter } from "../domain/filter";
import { LoggerRepository } from "../domain/repositories/logger.repo";
import { Singleton, Container } from "typescript-ioc";

@Singleton
export class LogService {
  @Inject
  private repository!: LoggerRepository;

  constructor() {
    // If injection fails (common in some Next.js environments), try manual resolution
    if (!this.repository) {
      try {
        this.repository = Container.get(LoggerRepository);
      } catch (e) {
        // Silently fail if container is not ready yet
      }
    }
  }

  async createLog(log: Log): Promise<void> {
    await this.repository.save(log);
  }

  async getLogs(filters: LogFilter): Promise<Log[]> {
    if (!this.repository) {
      this.repository = Container.get(LoggerRepository);
    }
    return this.repository.find(filters);
  }
}
