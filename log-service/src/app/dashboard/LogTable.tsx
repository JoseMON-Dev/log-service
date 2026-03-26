"use client";

import { useEffect, useState } from "react";
import { Log } from "../../domain/log";
import { LogFilter } from "../../domain/filter";
import { fetchLogs } from "./actions";

interface LogTableProps {
  initialLogs: Log[];
  filters: LogFilter;
}

function formatDate(isoString: string) {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function LogTable({ initialLogs, filters }: LogTableProps) {
  const [logs, setLogs] = useState<Log[]>(initialLogs);

  useEffect(() => {
    // Only poll if it's a relative time range (like -1h)
    // and not a fixed custom range
    if (filters.timeRange?.end) return;

    const pollInterval = setInterval(async () => {
      try {
        const freshLogs = await fetchLogs(filters);
        setLogs(freshLogs);
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [filters]);

  return (
    <div className="table-container">
      <table className="log-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Service</th>
            <th>Severity</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td className="timestamp">{formatDate(log.timestamp)}</td>
              <td><span className="service-id">{log.serviceId}</span></td>
              <td>
                <span className={`severity-badge severity-${log.severity}`}>
                  {log.severity}
                </span>
              </td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {logs.length === 0 && (
        <div className="empty-state">
          <p>No logs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
