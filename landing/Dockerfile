FROM node:lts AS build
WORKDIR /app
COPY . .
RUN corepack enable pnpm
ENV CI=true
RUN pnpm install
RUN pnpm run build

FROM httpd:2.4 AS runtime
COPY --from=build /app/dist /usr/local/apache2/htdocs/
EXPOSE 80
