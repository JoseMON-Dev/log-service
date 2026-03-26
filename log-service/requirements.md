# Project Requirements: Log Service

## 1. Overview
The **Log Service** is a centralized observability platform designed to ingest, persist, and visualize distributed system logs. It must provide high-throughput ingestion and a responsive management interface.

## 2. Functional Requirements

### 2.1 Log Ingestion (API)
*   **Unified Endpoint:** The service must expose a `POST /api/log` endpoint for remote log ingestion.
*   **Payload Schema:** Must accept JSON payloads containing `severity`, `message`, `timestamp` (ISO 8601), and `serviceId`.
*   **Validation:** All incoming data must be strictly validated against a schema (Zod) before processing.
*   **Authentication:** Access must be restricted via a mandatory API Key (`x-api-key` header).

### 2.2 Data Persistence
*   **Time-Series Storage:** Logs must be stored in a time-series database (InfluxDB) optimized for high-frequency writes and temporal queries.
*   **Metadata Tagging:** Records must be indexed by `serviceId` and `severity` to ensure sub-second retrieval.

### 2.3 Query & Analytics
*   **Filtering Engine:** The system must support complex queries based on:
    *   Temporal ranges (Time-windowing).
    *   Originating service (Service ID).
    *   Log priority (Severity levels).
*   **Data Aggregation:** Capability to pivot data for analytical visualization.

### 2.4 Observability Dashboard
*   **Real-time Visualization:** A web-based interface built with Next.js to monitor logs.
*   **Search & Filter UI:** Users must be able to dynamically filter the global log stream via the dashboard.
*   **Server-Side Execution:** Data fetching must be handled via Server Actions to ensure security and performance.

## 3. Non-Functional Requirements
*   **Environment Configuration & Validation:** All system configurations, secrets, and database credentials must be managed via environment variables (`.env`). The application must implement a strict validation schema (Zod) that executes during the bootstrap phase. If any required variable is missing or malformed, the process must terminate immediately with a descriptive error message to prevent runtime failures.
*   **Performance:** Ingestion must handle concurrent requests without blocking.
*   **Scalability:** The architecture must allow for horizontal scaling of the API layer.
*   **Reliability:** The system must maintain a Docker-based infrastructure for consistent deployment.
