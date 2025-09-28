FROM node:24-alpine AS build
WORKDIR /app

ARG REACT_APP_CLIENT_ID
ARG REACT_APP_CLIENT_SECRET
ARG CI=false

ENV REACT_APP_CLIENT_ID=${REACT_APP_CLIENT_ID}
ENV REACT_APP_CLIENT_SECRET=${REACT_APP_CLIENT_SECRET}
ENV CI=${CI}

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

COPY . .

COPY .env.example .env

RUN npm run build

FROM build AS development
EXPOSE ${DEVELOPMENT_PORT:-3000}
CMD ["npm", "start"]

FROM nginx:alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${PRODUCTION_PORT:-443}
CMD ["nginx", "-g", "daemon off;"]
