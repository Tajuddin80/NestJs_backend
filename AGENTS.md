# AGENTS.md

This is a standard **NestJS v11** starter. Single package, not a monorepo.

## Commands

| Action | Command |
|---|---|
| dev (watch) | `npm run start:dev` |
| build | `npm run build` (wraps `nest build`) |
| lint | `npm run lint` (includes `--fix`) |
| format | `npm run format` (prettier) |
| test (unit) | `npm test` |
| test:e2e | `npm run test:e2e` |
| test:cov | `npm run test:cov` |
| prod start | `npm run start:prod` (`node dist/main`) |

Verification order: `npm run lint && npm test && npm run test:e2e`

## Architecture

- **Entrypoint**: `src/main.ts` — registers `ValidationPipe` + `TransformInterceptor` globally, listens on `PORT` (default 3000)
- **Modules**: `AppModule` imports `UserModule`
- **User module**: `UserController` (routes under `/user`), `UserService`, `LoggerService`
- **DTOs**: `CreateUserDto` (`src/user/dto/`) uses `class-validator`; `UpdateUserDto` extends via `PartialType`
- **Interceptor**: `TransformInterceptor` wraps all responses as `{ statusCode, message, data }`

## Known issues

- DTO decorators in `create-user.dto.ts` use lowercase names (`@isString`, `@minLength`, `@isEmail`) — these do **not** work with `class-validator`. Should be `@IsString()`, `@MinLength()`, `@IsEmail()`.
- `UserService` depends on `LoggerService` (which was missing from `providers` in `UserModule` — needs to be added for DI to work at runtime).
- `user.service.spec.ts` does not provide `LoggerService` — tests will fail unless it's mocked or provided.
- ESLint `sourceType: 'commonjs'` despite ES module syntax in the config file.

## Testing quirks

- Unit tests use `@nestjs/testing` `Test.createTestingModule` — ensure all providers the class depends on are included
- E2e tests use standalone Jest config at `test/jest-e2e.json` (rootDir `.`, regex `.e2e-spec.ts$`)
- Coverage output goes to `/coverage`
