# Log Client

A TypeScript logging library (SDK) that mimics NestJS ConsoleLogger and sends logs to log-service.

## Setup Instructions

1. Install via npm (if published): `npm install log-client`.
2. Configure with your service ID and endpoint.

## Usage Examples

```ts
const logger = new Logger({
  serviceId: "auth-service",
  endpoint: "http://localhost:3000/api/log",
  apiKey: "my-secret-key"
});

logger.log("User logged in");
logger.error("Database connection failed");
```

## Environment Variables

* `LOG_SERVICE_ENDPOINT`: The URL of the log-service.
* `LOG_SERVICE_API_KEY`: The API key for authentication.
* `SERVICE_ID`: The ID of the current service.
