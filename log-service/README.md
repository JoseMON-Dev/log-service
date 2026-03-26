# Log Service

A monolithic fullstack application using Next.js (App Router) to receive, store, and visualize logs.

## Setup Instructions

1. Clone the repository.
2. Copy `.env.example` to `.env`.
3. Install dependencies: `npm install`.
4. Run locally with Docker: `docker-compose up -d`.

## How to Run

```bash
npm run dev
```

## Environment Variables

* `INFLUX_URL`: The URL of the InfluxDB instance.
* `INFLUX_TOKEN`: The authentication token for InfluxDB.
* `INFLUX_ORG`: The organization name in InfluxDB.
* `INFLUX_BUCKET`: The bucket name in InfluxDB.
* `API_KEY`: The API key for remote logging.

## Usage Examples

POST to `/api/log`:

```json
{
  "severity": "info",
  "message": "User logged in",
  "timestamp": "2026-03-24T10:00:00.000Z",
  "serviceId": "auth-service"
}
```
