# Análisis de cumplimiento: The Twelve-Factor App

A continuación se detalla el cumplimiento de los 12 factores en el proyecto de **Log System (Client SDK & Service)**.

| Factor | Evidencia | Comentario |
| :--- | :--- | :--- |
| **I. Codebase** | [Estructura del Proyecto](https://github.com/JoseMON-Dev/log-service/tree/master) | Un solo repositorio gestiona el SDK, el servicio y la demo, permitiendo múltiples despliegues desde una única fuente de verdad. |
| **II. Dependencies** | [log-service/package.json](https://github.com/JoseMON-Dev/log-service/tree/master/log-service/package.json#L11-23) | Se declaran explícitamente todas las dependencias necesarias. No se depende de la existencia implícita de paquetes en el sistema. |
| **III. Config** | [log-service/src/config/env.ts](https://github.com/JoseMON-Dev/log-service/tree/master/log-service/src/config/env.ts#L3-12) | La configuración se almacena en el entorno y se valida estrictamente mediante Zod antes de que la aplicación inicie. |
| **IV. Backing services** | [InfluxLoggerRepository.ts](https://github.com/JoseMON-Dev/log-service/tree/master/log-service/src/database/logger.repo.impl.ts#L16-20) | InfluxDB se trata como un recurso adjunto, configurado mediante credenciales inyectadas, facilitando el intercambio de servicios. |
| **V. Build, release, run** | [Dockerfile](https://github.com/JoseMON-Dev/log-service/tree/master/log-service/Dockerfile) | El proceso de despliegue separa estrictamente la construcción de la imagen de su ejecución final en el contenedor. |
| **VI. Processes** | [LogService.ts](https://github.com/JoseMON-Dev/log-service/tree/master/log-service/src/services/log.service.ts#L9-11) | La aplicación es stateless; cualquier estado persistente se delega a InfluxDB, permitiendo que los procesos se destruyan y reinicien sin pérdida de datos. |
| **VII. Port binding** | [docker-compose.yml](https://github.com/JoseMON-Dev/log-service/tree/master/log-service/docker-compose.yml#L10) | El servicio expone su funcionalidad a través de un puerto específico, permitiendo la comunicación entre servicios de forma autónoma. |
| **VIII. Concurrency** | [Architecture Pattern](https://github.com/JoseMON-Dev/log-service/tree/master/log-service/src/app/api/log/route.ts) | Diseñado para escalar horizontalmente. Al ser stateless, se pueden levantar múltiples réplicas del servicio API para manejar carga masiva. |
| **IX. Disposability** | [Logger.ts (SDK)](https://github.com/JoseMON-Dev/log-service/tree/master/log-client/src/logger.ts#L65) | El uso de `AbortSignal.timeout` asegura que las peticiones no queden colgadas, favoreciendo un cierre elegante y robustez ante fallos. |
| **X. Dev/prod parity** | [.env.example](https://github.com/JoseMON-Dev/log-service/tree/master/log-service/.env.example) | El uso de archivos de ejemplo y Docker asegura que el entorno de desarrollo sea lo más parecido posible al de producción. |
| **XI. Logs** | [logger.ts](https://github.com/JoseMON-Dev/log-service/tree/master/log-client/src/logger.ts#L52-67) | Los logs se tratan como flujos de eventos continuos que se emiten y se ingieren en tiempo real en una base de datos de series temporales. |
| **XII. Admin processes** | [demo-app/index.ts](https://github.com/JoseMON-Dev/log-service/tree/master/demo-app/index.ts) | Las tareas de gestión o demostración se ejecutan como procesos de una sola vez (one-off), compartiendo la misma base de código y configuración. |
