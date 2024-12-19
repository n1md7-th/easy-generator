# Easy generator

# Quickstart

Clone the repository

Go to the root directory of the project and run the following command

```bash
$ docker compose up
```

Dependencies
- Docker
- Docker Compose

- Frontend is running at http://localhost:8080
- Frontend is using React and Bootstrap
- Validations are performed at backend so the FE is not doing any validations but displays errors thrown from backend
- It has a simple sign-in, sign-up and sign-out flow.

## Frontend

Dependencies
- Node
- Yarn

## Project setup

```bash
$ yarn install
$ yarn run dev
```


## Backend

Dependencies
- Mongodb
- Yarn
- Node
- Docker

About the project
- Project is using JWT for authentication.
- It has some unit tests for the auth verification.
- Project has Swagger documentation.
- It has custom password validators for password strength.
- Sign-in, sign-up and sign-out flows are implemented.


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
- Implement refresh token endpoint


