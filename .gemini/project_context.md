# Project Context and Agent Specification

## 1. Project Overview
- **Name:** AI Sales Agent (Web App General Admin v1)
- **Type:** Full-stack Web Application
- **Core Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript 5.x

## 2. Technology Stack & Rules
### Frontend
- **Framework:** Next.js (App Router). Use `src/app`.
- **UI Library:** Shadcn/UI (based on Radix UI).
- **Styling:** Tailwind CSS 4. Use utility classes. Avoid inline styles.
- **Components:** Functional components. PascalCase naming. Use `cn()` for class merging.
- **Icons:** Lucide React.
- **State/Forms:** React Hook Form + Zod validation.

### Backend & Data
- **Auth:** Better Auth (v1.4.10). Config at `src/lib/auth/auth.ts`.
- **Database:** MySQL (accessed via `mysql2`).
- **ORM/Query:** Drizzle or raw queries? *[Note: PROJECT.md mentions MySQL2 and Better Auth schema management, but generic DB access is less clear. Verify if Drizzle is used if needed. For now, assume Better Auth handles auth DB.]*
- **API:** Next.js API Routes (`src/app/api/`).
- **Email:** Resend + React Email (`src/components/emails/`).

## 3. Architecture & Conventions
### Directory Structure
- `src/app`: Routes and Pages.
- `src/components/ui`: Shared UI components (Shadcn).
- `src/lib`: Utilities (axios, auth, utils).
- `src/services`: External API services.
- `src/core/config`: Environment variables (`envs.ts`).

### Coding Standards
- **TypeScript:** Strict mode. Use `interface` for shapes, `type` for unions.
- **Naming:**
  - Components: `PascalCase.tsx`
  - Utilities: `kebab-case.ts`
  - Variables: `camelCase`
- **Imports:** Use aliases `@/` for `src/`.

### Development Workflow
- **Package Manager:** `pnpm`
- **Formatting:** `pnpm format` (Biome)
- **Linting:** `pnpm lint` (Biome)

## 4. Key Patterns
- **Buttons:** Use `Button` from `@/components/ui/button`.
- **API Requests:** Use `baseApiService` from `@/lib/axios/base-api-service`.
- **Env Vars:** Access via `envs` object from `@/core/config/envs`.

## 5. Agent Behavior Rules
- Always check `PROJECT.md` for detailed specific documentation.
- When creating new components, follow the Shadcn/UI pattern.
- Ensure strict type safety. Avoid `any`.
- Use the `view_file` tool to inspect existing patterns before writing new code.
