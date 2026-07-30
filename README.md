<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://img.shields.io/opencollective/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/opencollective/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# nestjs

A progressive NestJS v11 API server demonstrating layered architecture with guards, middleware, interceptors, DTO validation, and CRUD operations for a User resource.

Built step-by-step: scaffold → service layer → error handling → response transformation → DTO validation → auth middleware → role-based guard.

## Project Structure

```
src/
├── main.ts                                    # Entrypoint
├── app.module.ts                              # Root module
├── app.controller.ts                          # GET / (Hello World)
├── app.service.ts                             # Business logic for root
├── guards/
│   ├── role.guard.ts                          # RoleGuard — checks "role" header
│   └── role.guard.spec.ts
├── middleware/
│   ├── api-key.middleware.ts                  # ApiKeyMiddleware — checks "x-api-key" header
│   └── api-key.middleware.spec.ts
├── user/
│   ├── user.module.ts                         # User module
│   ├── user.controller.ts                     # CRUD routes at /user
│   ├── user.service.ts                        # In-memory CRUD logic for users
│   ├── user.logger.ts                         # Custom LoggerService
│   ├── user.controller.spec.ts
│   ├── user.service.spec.ts
│   └── dto/
│       ├── create-user.dto.ts                 # @IsString / @MinLength / @IsEmail
│       └── update-user.dto.ts                 # PartialType(CreateUserDto)
└── utils/
    ├── transform.interceptor.ts               # Wraps responses as { statusCode, message, data }
    └── transform.interceptor.spec.ts
test/
├── app.e2e-spec.ts                            # E2E test: GET /
└── jest-e2e.json
```

## Build-up (commit-by-commit)

### 1. Scaffold + User module skeleton
- NestJS project generated, `/user` controller with stub routes (GET, POST, PUT, DELETE)

### 2. User service CRUD + LoggerService
- `UserService` with in-memory array, full CRUD methods
- Custom `LoggerService` injected into `UserService`
- Routes wired to real logic

### 3. NotFoundException on missing user
- `findOneUser` throws `NotFoundException` when user ID does not exist

### 4. Global TransformInterceptor
- All responses wrapped as `{ statusCode, message, data }`
- Registered globally in `main.ts`

### 5. DTO validation with class-validator
- `CreateUserDto`: `@IsString()`, `@MinLength(3)`, `@IsEmail()`
- `UpdateUserDto`: `PartialType(CreateUserDto)`
- Global `ValidationPipe` registered in `main.ts`
- `class-validator` and `class-transformer` added to dependencies

### 6. ApiKeyMiddleware
- Checks `x-api-key` header against `secret-key-123`
- Applied to all `UserController` routes via `AppModule.configure()`
- Returns 401 on mismatch

### 7. RoleGuard on delete endpoint
- `RoleGuard` checks `role` header for `'admin'`
- Applied only to `DELETE /user/:id` via `@UseGuards(RoleGuard)`
- Returns 401 if role is not admin

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | — | Hello World |
| GET | `/user?name=...` | `x-api-key` | List users (filter by name) |
| GET | `/user/:id` | `x-api-key` | Get user by ID |
| POST | `/user` | `x-api-key` | Create user |
| PUT | `/user/:id` | `x-api-key` | Update user |
| DELETE | `/user/:id` | `x-api-key` + `role: admin` | Delete user |

All responses are wrapped as `{ statusCode, message, data }` by the `TransformInterceptor`.

## Setup & Running

```bash
npm install
npm run start:dev     # dev with watch mode
npm run build         # production build
```

## Tests

```bash
npm test              # unit tests (.spec.ts in src/)
npm run test:e2e      # e2e tests (test/*.e2e-spec.ts)
npm run test:cov      # unit tests with coverage
```

## Security

- **ApiKeyMiddleware**: global on `/user` routes — pass header `x-api-key: secret-key-123`
- **RoleGuard**: on `DELETE /user/:id` — pass header `role: admin`

## CLI Commands (in order of execution)

```bash
# 1 — Project scaffold
nest new demo-nestjs
cd demo-nestjs

# 2 — Generate user module, controller, service
nest g module user
nest g controller user
nest g service user

# 3 — Manual: create DTO classes
nest g class user/dto/create-user	dto
nest g class user/dto/update-user	dto

# 4 — Manual: create LoggerService
nest g class user/user.logger

# 5 — Install validation dependencies
npm install class-validator class-transformer

# 6 — Generate interceptor
nest g interceptor utils/transform

# 7 — Generate middleware
nest g middleware middleware/api-key

# 8 — Generate guard
nest g guard guards/role
```

After each step, manually edit the generated files to add the actual logic.
