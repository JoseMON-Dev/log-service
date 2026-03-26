"use server";

import { Container } from "../../ioc/container";
import { LogService } from "../../services/log.service";
import { LogFilter } from "../../domain/filter";

export async function fetchLogs(filters: LogFilter) {
  const logService = Container.get(LogService);
  return logService.getLogs(filters);
}
