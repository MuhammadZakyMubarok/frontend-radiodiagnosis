FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .
COPY .env.example .env

RUN npm run build

FROM build AS development

EXPOSE ${DEVELOPMENT_PORT:-3000}
CMD ["npm", "start"]

FROM nginx:alpine AS production

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE ${PRODUCTION_PORT:-80}
CMD ["nginx", "-g", "daemon off;"]