import "reflect-metadata";
import { Container } from "typescript-ioc";
import "./../config/env"; // Trigger environment validation on bootstrap
import { LoggerRepository } from "../domain/repositories/logger.repo";
import { InfluxLoggerRepository } from "../database/logger.repo.impl";

Container.bind(LoggerRepository).to(InfluxLoggerRepository);

export { Container };
