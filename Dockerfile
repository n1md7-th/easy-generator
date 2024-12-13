ARG BUILD_IMAGE='node:22.12.0-alpine3.20'

FROM $BUILD_IMAGE AS server

ARG BUILD_ENV
ARG PORT=8000

ENV PORT=${PORT}
ENV BUILD_ENV=${BUILD_ENV:-production}

WORKDIR /service

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build

ENTRYPOINT ["yarn", "run", "start:prod"]
