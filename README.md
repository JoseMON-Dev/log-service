# Distributed Logging System & SDK

Este proyecto consiste en un ecosistema completo para la gestión de logs en sistemas distribuidos, compuesto por un **SDK de cliente (log-client)**, un **servicio de ingestión y visualización (log-service)** y una **aplicación de demostración (demo-app)**.

## 🚀 Arquitectura del Sistema

- **Log Client SDK**: Librería TypeScript ligera con reintentos automáticos (backoff exponencial) y fallos silenciosos.
- **Log Service**: API construida en Next.js que valida logs con Zod y los persiste en **InfluxDB**.
- **Dashboard**: Interfaz en tiempo real con polling dinámico para monitoreo de logs.

---

## 🛠 Requisitos Técnicos

### Desarrollo
- **Node.js**: v18.0.0 o superior (se recomienda v22 para el test runner nativo).
- **pnpm**: v9.0.0 o superior.
- **InfluxDB**: Instancia local o remota (v2.x).

### Producción
- **Docker & Docker Compose**.
- **Memoria**: 1GB RAM mínimo para InfluxDB + App.

---

## ⚙️ Configuración (Variables de Entorno)

La aplicación requiere las siguientes variables en el `log-service/.env`:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `INFLUX_URL` | URL de la instancia de InfluxDB | `http://influxdb:8086` |
| `INFLUX_TOKEN` | Token de autenticación de InfluxDB | `my-super-secret-token` |
| `INFLUX_ORG` | Organización en InfluxDB | `my-org` |
| `INFLUX_BUCKET` | Bucket (base de datos) para logs | `logs` |
| `API_KEY` | Clave para autorizar el SDK (x-api-key) | `at-least-8-chars-key` |
| `PORT` | Puerto donde se expondrá la App | `3000` |

---

## 📦 Despliegue con Docker

### 1. Construir y desplegar el servicio
Desde la carpeta raíz del proyecto:

```bash
# Construir la imagen
docker build -t log-service ./log-service

# Desplegar junto con InfluxDB
docker-compose up -d
```

El servicio se expondrá en el puerto configurado mediante la variable `PORT`. Por defecto, Docker Compose lo mapea al `3000`.

---

## 🛠 Desarrollo Local

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```
2. **Ejecutar tests**:
   ```bash
   # SDK
   npx tsx --test log-client/src/logger.test.ts
   # Service
   npx tsx --test log-service/src/test-runner.ts
   ```
3. **Ejecutar Demo App**:
   ```bash
   npx tsx demo-app/index.ts
   ```

---

## 🤖 GitHub Actions (CI/CD Flows)

### 1. Build & Publish Log Service (Docker)
Crea un archivo en `.github/workflows/docker-publish.yml`:

```yaml
name: Publish Docker Image

on:
  push:
    branches: [ master ]
    paths: [ 'log-service/**' ]

jobs:
  push_to_registry:
    name: Push Docker image to Docker Hub
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v4
      
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./log-service
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/log-service:latest
```

### 2. Publish Log Client (NPM)
Crea un archivo en `.github/workflows/npm-publish.yml`:

```yaml
name: Publish SDK to NPM

on:
  push:
    branches: [ master ]
    paths: [ 'log-client/**' ]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: pnpm install
        working-directory: ./log-client

      - name: Build SDK
        run: pnpm run build
        working-directory: ./log-client

      - name: Publish to NPM
        run: npm publish --access public
        working-directory: ./log-client
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 📜 Licencia
Este proyecto está bajo la licencia MIT.
