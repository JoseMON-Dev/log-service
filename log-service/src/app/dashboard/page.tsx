import { fetchLogs } from "./actions";
import LogTable from "./LogTable";
import "./dashboard.css";

export default async function DashboardPage(props: {
  searchParams: Promise<{ 
    serviceId?: string; 
    severity?: string; 
    range?: string; 
    customStart?: string; 
    customEnd?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  
  // Determine start/end times
  let start = searchParams.range || "-1h";
  let end = "";

  if (start === "custom") {
    start = searchParams.customStart ? new Date(searchParams.customStart).toISOString() : "-1h";
    end = searchParams.customEnd ? new Date(searchParams.customEnd).toISOString() : "";
  }

  const filters = {
    serviceId: searchParams.serviceId,
    severity: searchParams.severity as any,
    timeRange: {
      start,
      end,
    },
  };

  const initialLogs = await fetchLogs(filters);

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Log Dashboard</h1>
        <div className="live-badge">
          <span className="dot"></span> LIVE
        </div>
      </header>
      
      <div className="filter-card">
        <form method="get" className="filter-form">
          <div className="input-group">
            <label htmlFor="serviceId">Service ID</label>
            <input 
              id="serviceId"
              name="serviceId" 
              placeholder="e.g. auth-service" 
              defaultValue={searchParams.serviceId} 
            />
          </div>
          <div className="input-group">
            <label htmlFor="severity">Severity</label>
            <select id="severity" name="severity" defaultValue={searchParams.severity}>
              <option value="">All Severities</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
              <option value="debug">Debug</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="range">Time Range</label>
            <select id="range" name="range" defaultValue={searchParams.range || "-1h"}>
              <option value="-1h">Last Hour</option>
              <option value="-6h">Last 6 Hours</option>
              <option value="-24h">Last 24 Hours</option>
              <option value="-7d">Last 7 Days</option>
              <option value="-30d">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {(searchParams.range === "custom") && (
            <>
              <div className="input-group">
                <label htmlFor="customStart">From</label>
                <input 
                  type="datetime-local" 
                  id="customStart" 
                  name="customStart" 
                  defaultValue={searchParams.customStart} 
                />
              </div>
              <div className="input-group">
                <label htmlFor="customEnd">To</label>
                <input 
                  type="datetime-local" 
                  id="customEnd" 
                  name="customEnd" 
                  defaultValue={searchParams.customEnd} 
                />
              </div>
            </>
          )}

          <button type="submit" className="submit-btn">Apply Filters</button>
        </form>
      </div>

      <LogTable initialLogs={initialLogs} filters={filters} />
    </div>
  );
}
