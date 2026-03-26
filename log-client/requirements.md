# Project Requirements: Log Client SDK

## 1. Overview
The **Log Client SDK** is a lightweight TypeScript library for distributed services. It enables standardized logging with integrated remote ingestion into the **Log Service**.

## 2. Functional Requirements

### 2.1 Logger Interface
*   **Parity:** Must mimic the NestJS `ConsoleLogger` API (log, error, warn, debug).
*   **Initialization:** Requires `serviceId`, `endpoint`, and `apiKey` for configuration.

### 2.2 Local Output (Console)
*   **Formatting:** Every log must be prefixed with `[ServiceId] ISO-8601 Timestamp`.
*   **Visual Distinction:** Logs must be color-coded by severity level using ANSI escape codes.

### 2.3 Remote Ingestion
*   **Asynchronous Dispatch:** Remote logging must be non-blocking.
*   **Automatic Formatting:** Automatically include machine-generated metadata (timestamps).

## 3. Resilience & Failure Strategy
*   **Retry Mechanism:** Must include a basic retry strategy with exponential backoff for failed network calls.
*   **Timeouts:** Each request must be aborted after 5 seconds to prevent memory leaks in the host application.
*   **Silent Failure:** Errors in the SDK must not crash the parent application.

## 4. Technical Constraints
*   **Pure TypeScript:** No heavy external dependencies (e.g., Axios).
*   **Native Fetch:** Must utilize native Fetch API for zero-footprint network requests.
