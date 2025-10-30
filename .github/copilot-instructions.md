# AI Coding Agent Instructions

## Project Overview
This is a task management application with a monorepo structure containing:
- **API**: Node.js/Express backend with TypeORM and SQLite (`apps/api/`)
- **Web**: Static HTML/JS frontend served via http-server (`apps/web/`)
- **E2E Tests**: Playwright test suite (`tests/` - currently empty, config in root)

## Architecture & Key Patterns

### Backend Structure (`apps/api/`)
- **Data Layer**: TypeORM 0.3.x with Better SQLite3, decorators-based entities
- **API Layer**: Express with CORS enabled, async error handling middleware
- **File Organization**: Controllers → Models pattern (custom repositories deprecated)
- **Database**: SQLite file at `./src/database/database.sqlite`
- **Migrations**: Located in `./src/database/migrations/`
- **Repository Pattern**: Uses `AppDataSource.getRepository(Entity)` (TypeORM 0.3.x style)

### Key Files to Understand
- `apps/api/src/data-source.js`: TypeORM DataSource configuration (0.3.x pattern)
- `apps/api/src/database/index.js`: Initializes AppDataSource connection
- `apps/api/src/app.js`: Express app setup with middleware stack
- `apps/api/src/routes.js`: REST API routes with conditional helper endpoints
- `apps/api/src/models/Task.js`: Compiled TypeScript entity with decorators
- `apps/api/src/controllers/TaskController.js`: Uses AppDataSource.getRepository() pattern

### API Conventions
- **Task Entity**: Uses UUID primary keys, snake_case columns (`is_done`, `created_at`)
- **Helper Routes**: Non-production endpoints for testing (`/helper/tasks`)
- **Error Handling**: Custom `AppError` class with centralized middleware
- **CORS**: Configured for wildcard origin (`*`)

## Development Workflows

### Starting the Application
```bash
# API (port 3333)
cd apps/api && npm run dev

# Web (port 8080) 
cd apps/web && npm start

# Database setup
cd apps/api && npm run db:init
```

### Key Commands
- `npm run db:drop`: Reset database schema
- `npm run db:init`: Run pending migrations
- `npm run rebuild-sqlite`: Rebuild better-sqlite3 native bindings

### Testing Infrastructure
- **Unit Tests**: Jest setup in `apps/api/src/__tests__/`
- **E2E Tests**: Playwright configured for Chromium/Firefox/WebKit
- **Test Config**: Cross-browser testing with HTML reporter

## Code Generation Guidelines

### When Working with the API
- **Repository Access**: Use `AppDataSource.getRepository(Entity)` - NOT `getCustomRepository()`
- **FindOne Queries**: Use `{ where: { field: value } }` syntax (TypeORM 0.3.x requirement)
- **Entity Decorators**: Use TypeORM decorators for entity definitions
- **Validation**: Add validation with Yup schema (see existing controller patterns)
- **Helper Endpoints**: Include helper endpoints for test cleanup when adding new entities

### TypeORM 0.3.x Migration Notes
- Custom repositories with `@EntityRepository` decorator are deprecated
- Use standard repository pattern: `AppDataSource.getRepository(EntityClass)`
- Connection initialization uses `AppDataSource.initialize()` instead of `createConnection()`
- FindOne/FindOneBy methods require explicit `where` clause

### When Working with Database
- Migrations must be in `apps/api/src/database/migrations/`
- Use TypeORM CLI: `npx typeorm migration:generate -d src/data-source.js`
- Entity files use compiled TypeScript with decorator metadata

### When Adding E2E Tests
- Tests go in root `tests/` directory
- Playwright config already set for multi-browser testing
- Consider adding `webServer` config to auto-start local dev servers

## Integration Points
- API runs on port 3333, Web on port 8080
- Frontend likely makes AJAX calls to API (check `apps/web/assets/index.*.js`)
- Database resets available via helper endpoints for test isolation