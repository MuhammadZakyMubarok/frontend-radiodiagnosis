FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM build AS development
COPY .env.example .env

EXPOSE ${DEVELOPMENT_PORT:-3000}
CMD ["npm", "start"]

FROM nginx:alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
COPY .env.production .env
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${PRODUCTION_PORT:-80}
ENV HOST=0.0.0.0
CMD ["nginx", "-g", "daemon off;"]
