
## Description

Easy generator backend

Dependencies
- Mongodb
- Yarn
- Node
- Docker

## Run using docker

```bash
$ docker-compose up
```

- Server is running at http://localhost:8000
- Swagger is running at http://localhost:8000/docs

Project is using JWT for authentication.


## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## TODOs

- Add redis store for refresh token invalidation instead of local in-memory store
- Change secret based HMAC to RSA based JWT signing


