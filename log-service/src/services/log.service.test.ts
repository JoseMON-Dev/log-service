import "reflect-metadata";
import { test, describe, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert";
import { LogService } from "./log.service";
import { Log } from "../domain/log";
import { LoggerRepository } from "../domain/repositories/logger.repo";
import { Container } from "../ioc/container";

describe("LogService", () => {
  let logService: LogService;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      save: mock.fn(async () => {}),
      find: mock.fn(async () => []),
    };
    
    logService = Container.get(LogService);
    
    // Inject the mock manually
    (logService as any).repository = mockRepo;
  });

  afterEach(() => {
    mock.reset();
  });

  test("should call repository.save when createLog is called", async () => {
    const log: Log = {
      severity: "info",
      message: "Test message",
      timestamp: new Date().toISOString(),
      serviceId: "test-service",
    };

    await logService.createLog(log);

    assert.strictEqual(mockRepo.save.mock.callCount(), 1);
    assert.deepStrictEqual(mockRepo.save.mock.calls[0].arguments[0], log);
  });

  test("should call repository.find when getLogs is called", async () => {
    const filters = { serviceId: "test-service" };
    const mockLogs: Log[] = [
      {
        severity: "info",
        message: "Test message",
        timestamp: new Date().toISOString(),
        serviceId: "test-service",
      }
    ];
    mockRepo.find = mock.fn(async () => mockLogs);

    const result = await logService.getLogs(filters as any);

    assert.strictEqual(mockRepo.find.mock.callCount(), 1);
    assert.deepStrictEqual(mockRepo.find.mock.calls[0].arguments[0], filters);
    assert.deepStrictEqual(result, mockLogs);
  });
});
