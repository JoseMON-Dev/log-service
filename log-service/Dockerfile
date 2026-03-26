FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN INFLUX_URL=http://localhost \
    INFLUX_TOKEN=placeholder \
    INFLUX_ORG=placeholder \
    INFLUX_BUCKET=placeholder \
    API_KEY=placeholder_key \
    npm run build

EXPOSE 3000

CMD ["npm", "start"]
