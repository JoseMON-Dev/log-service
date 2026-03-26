import { Log } from "../log";
import { LogFilter } from "../filter";

export abstract class LoggerRepository {
  abstract save(log: Log): Promise<void>;
  abstract find(filters: LogFilter): Promise<Log[]>;
}
