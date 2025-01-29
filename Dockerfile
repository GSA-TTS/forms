FROM node:22-bookworm AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
ARG APP_DIR

RUN apt update && \
  apt install -y git
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm --filter=$APP_DIR --prod deploy /app/$APP_DIR

FROM base AS app
ARG APP_DIR

LABEL org.opencontainers.image.description 10x Forms Platform

COPY --from=build /app/$APP_DIR /app/$APP_DIR
COPY --from=build /usr/src/app/apps/$APP_DIR/dist /app/$APP_DIR/dist
WORKDIR /app/$APP_DIR

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD [ "node", "./dist/index.js" ]

#HEALTHCHECK --interval=5m --timeout=3s \
#  CMD curl -f http://localhost:4321/ || exit 1
