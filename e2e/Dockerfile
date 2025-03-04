# base image with Node.js and playwright preinstalled
FROM mcr.microsoft.com/playwright:v1.50.1-noble as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=test
RUN apt-get -y update && apt-get install -y netcat-openbsd make g++
WORKDIR /srv/apps/atj-platform
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./package.json ./package.json
RUN corepack enable
RUN corepack prepare pnpm@9.15.4 --activate

FROM base as test
ENV E2E_ENDPOINT=http://localhost:9090
ENV CI=true
COPY . .
RUN npm install -g serve
EXPOSE 9090
EXPOSE 9191
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build --filter=@gsa-tts/forms-spotlight --filter=@gsa-tts/forms-design
WORKDIR /srv/apps/atj-platform/e2e
RUN serve ../apps/spotlight/dist -p 9090 -L & while ! nc -z localhost 9090; do sleep 1; done; pnpm playwright test;
RUN serve ../packages/design/storybook-static -p 9191 -L & while ! nc -z localhost 9191; do sleep 1; done; pnpm --filter=end-to-end-tests test:storybook --url http://localhost:9191 --config-dir ../packages/design/.storybook/ --browsers firefox chromium

FROM base as serve
ENV E2E_ENDPOINT=http://localhost:4321
EXPOSE 4321 9292 9323 9009 8080
RUN git config --global --add safe.directory /srv/apps/atj-platform
CMD ["pnpm", "dev"]
