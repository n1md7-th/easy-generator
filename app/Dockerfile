FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn add -D @types/node
ARG EASY_GEN_API_URL
ENV VITE_API_URL=${EASY_GEN_API_URL}
RUN yarn run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
