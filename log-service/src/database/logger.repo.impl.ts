import { InfluxDB, Point } from "@influxdata/influxdb-client";
import { Log } from "../domain/log";
import { LogFilter } from "../domain/filter";
import { LoggerRepository } from "../domain/repositories/logger.repo";
import { Container, Scope } from "typescript-ioc";
import { env } from "../config/env";

export class InfluxLoggerRepository extends LoggerRepository {
  private client: InfluxDB;
  private org: string;
  private bucket: string;

  constructor() {
    super();
    this.org = env.INFLUX_ORG;
    this.bucket = env.INFLUX_BUCKET;
    this.client = new InfluxDB({
      url: env.INFLUX_URL,
      token: env.INFLUX_TOKEN,
    });
  }

  async save(log: Log): Promise<void> {
    const writeApi = this.client.getWriteApi(this.org, this.bucket);
    const point = new Point("logs")
      .tag("serviceId", log.serviceId)
      .tag("severity", log.severity)
      .stringField("message", log.message)
      .timestamp(new Date(log.timestamp));

    writeApi.writePoint(point);
    await writeApi.close();
  }

  async find(filters: LogFilter): Promise<Log[]> {
    const queryApi = this.client.getQueryApi(this.org);
    const start = filters.timeRange?.start || "-1h";
    const stop = filters.timeRange?.end ? `, stop: ${filters.timeRange.end}` : "";
    
    let fluxQuery = `from(bucket: "${this.bucket}") |> range(start: ${start}${stop})`;

    if (filters.serviceId) {
      fluxQuery += ` |> filter(fn: (r) => r.serviceId == "${filters.serviceId}")`;
    }
    if (filters.severity) {
      fluxQuery += ` |> filter(fn: (r) => r.severity == "${filters.severity}")`;
    }

    fluxQuery += ` |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`;

    const result: Log[] = [];
    return new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          result.push({
            severity: o.severity,
            message: o.message,
            timestamp: o._time,
            serviceId: o.serviceId,
          });
        },
        error(error) {
          reject(error);
        },
        complete() {
          resolve(result);
        },
      });
    });
  }
}
Container.bind(LoggerRepository)
  .to(InfluxLoggerRepository)
  .scope(Scope.Singleton);
