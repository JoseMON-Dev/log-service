import { test, describe, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert";
import { Logger } from "./logger";

describe("Logger SDK", () => {
  const options = {
    serviceId: "test-service",
    endpoint: "https://logs.example.com/api/log",
    apiKey: "test-api-key",
  };
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger(options);
    // Mock console.log to avoid noise during tests
    mock.method(console, "log", () => {});
    // Mock global fetch
    mock.method(globalThis, "fetch", () =>
      Promise.resolve({ ok: true } as Response),
    );
  });

  afterEach(() => {
    mock.reset();
  });

  test("should print to console for each level", () => {
    const consoleMock = mock.method(console, "log", () => {});

    logger.log("Info message");
    logger.warn("Warn message");
    logger.error("Error message");
    logger.debug("Debug message");

    assert.strictEqual(consoleMock.mock.callCount(), 4);

    const calls = consoleMock.mock.calls;
    assert.ok(calls[0].arguments[0].includes("INFO"));
    assert.ok(calls[1].arguments[0].includes("WARN"));
    assert.ok(calls[2].arguments[0].includes("ERROR"));
    assert.ok(calls[3].arguments[0].includes("DEBUG"));
  });

  test("should call remote endpoint with correct payload", async () => {
    const fetchMock = mock.method(globalThis, "fetch", () =>
      Promise.resolve({ ok: true } as Response),
    );

    logger.log("Remote log message");

    // Wait a bit for the async call to be made
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.strictEqual(fetchMock.mock.callCount(), 1);

    const call = fetchMock.mock.calls[0];
    const [url, init] = call.arguments;

    assert.strictEqual(url, options.endpoint);
    assert.strictEqual(init.method, "POST");
    assert.strictEqual(init.headers["x-api-key"], options.apiKey);

    const body = JSON.parse(init.body);
    assert.strictEqual(body.message, "Remote log message");
    assert.strictEqual(body.severity, "info");
    assert.strictEqual(body.serviceId, options.serviceId);
    assert.ok(body.timestamp);
  });

  test("should retry on non-ok response", async () => {
    let callCount = 0;
    const fetchMock = mock.method(global, "fetch", () => {
      callCount++;
      if (callCount === 1) return Promise.resolve({ ok: false } as Response);
      return Promise.resolve({ ok: true } as Response);
    });

    logger.log("Retry message");

    // Wait for the first call and then for the retry delay (exponential backoff starts at 1s)
    // For testing, we can speed this up by mocking setTimeout if needed, but let's just wait a bit
    // and see if we can reduce the retry delay for testing purposes in the future.
    // However, the current implementation uses a hardcoded 1000ms delay.

    await new Promise((resolve) => setTimeout(resolve, 1100)); // Wait for 1s retry delay

    assert.strictEqual(callCount, 2);
  });
});
