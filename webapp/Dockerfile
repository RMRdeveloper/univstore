FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

CMD ["docker-entrypoint.sh"]
