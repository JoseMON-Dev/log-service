# Análisis de cumplimiento: The Twelve-Factor App

A continuación se detalla el cumplimiento de los 12 factores en el proyecto de **Log System (Client SDK & Service)**.

| Factor | Evidencia | Comentario |
| :--- | :--- | :--- |
| **I. Codebase** | Repositorio único con carpetas `log-client`, `log-service` y `demo-app`. | Se utiliza una única base de código gestionada por control de versiones, permitiendo múltiples despliegues (dev, prod) desde la misma fuente. |
| **II. Dependencies** | Archivos `package.json`, `pnpm-lock.yaml` y `Dockerfile`. | Las dependencias se declaran explícitamente y se aíslan. No se asume la existencia de paquetes globales; todo se gestiona vía `pnpm/npm`. |
| **III. Config** | `log-service/src/config/env.ts` y archivos `.env`. | La configuración varía según el entorno y se inyecta mediante variables de entorno, validadas estrictamente con Zod al inicio del proceso. |
| **IV. Backing services** | `InfluxLoggerRepository` y variables `INFLUX_URL`. | InfluxDB se trata como un recurso adjunto. La aplicación se conecta mediante una URL y credenciales, permitiendo cambiar el servicio sin modificar el código. |
| **V. Build, release, run** | Scripts `build` en `package.json` y `Dockerfile`. | Existe una separación estricta: `build` transforma el código TS, `release` combina el build con la config, y `run` ejecuta el servidor Next.js. |
| **VI. Processes** | Arquitectura stateless en `LogService`. | La aplicación es sin estado. Los datos (logs) no se guardan en el sistema de archivos local ni en memoria del proceso, sino en InfluxDB. |
| **VII. Port binding** | `Dockerfile` (EXPOSE 3000) y `docker-compose.yml`. | El servicio es totalmente autónomo y se expone mediante la vinculación a un puerto (3000), siendo accesible para otros servicios. |
| **VIII. Concurrency** | Preparado para escala horizontal en Docker. | Al ser un proceso stateless, se pueden ejecutar múltiples instancias del `log-service` detrás de un balanceador de carga para manejar más tráfico. |
| **IX. Disposability** | `AbortSignal.timeout` en SDK y manejo de señales en Docker. | Se prioriza la robustez con inicios rápidos y cierres elegantes. El SDK implementa tiempos de espera para no bloquear la app principal si el servicio cae. |
| **X. Dev/prod parity** | Uso de Docker y `.env.example`. | Se minimizan las brechas entre entornos usando contenedores y configuraciones consistentes, permitiendo que lo que corre en local corra igual en producción. |
| **XI. Logs** | Todo el ecosistema `log-client` -> `log-service`. | Cumplimiento total: la aplicación trata los logs como flujos de eventos (streams) que se envían a un servicio de agregación centralizado. |
| **XII. Admin processes** | Script `demo-app/index.ts` y scripts de test. | Las tareas de gestión, prueba o demo se ejecutan como procesos independientes y puntuales, utilizando el mismo entorno que la aplicación principal. |
