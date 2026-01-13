# Project Specification: Next.js Base Project V2

## Project Overview

**Project Name:** AI Sales Agent  
**Framework:** Next.js 16.1.1 with App Router  
**Language:** TypeScript 5.x  
**UI Library:** Shadcn/UI (Radix UI primitives)  
**Authentication:** Better Auth  
**Database:** MySQL  
**Package Manager:** pnpm

This is a full-stack web application built with Next.js, featuring authentication, organization management, dashboard, and external API integrations.

---

## Technology Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Shadcn/UI** - Reusable UI components (Radix UI primitives)
- **Radix UI** - Headless UI components
- **Lucide React** - Icons
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Table** - Data tables
- **Recharts** - Charts
- **Sonner** - Toast notifications
- **Vaul** - Drawer component

### Backend & Auth
- **Better Auth 1.4.10** - Authentication solution
- **MySQL2** - Database driver
- **Resend** - Email service
- **React Email** - Email templates

### Tools & Utilities
- **Biome** - Linting and formatting
- **pnpm** - Package manager
- **dotenv-cli** - Environment variable management
- **Axios** - HTTP client
- **class-variance-authority** - Component variants
- **clsx + tailwind-merge** - Utility functions

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (grouped route)
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── dashboard/         # Dashboard pages
│   │   ├── report/       # Reports (sales, customers, products, panel)
│   │   └── admin/        # Admin pages (users, organizations, profile)
│   ├── admin/            # Admin-specific pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/              # Shadcn/UI components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components
│   ├── emails/          # Email templates (React Email)
│   ├── header/          # Header components
│   └── theme/           # Theme provider
├── core/                  # Core configuration and constants
│   ├── config/          # Environment configuration
│   └── constants/       # Application constants
├── db/                    # Database types and schemas
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── auth/            # Authentication utilities
│   └── axios/           # Axios HTTP client setup
├── server/                # Server-side utilities
├── services/              # External API services
│   ├── db/              # Database services
│   ├── api-main/        # Main external API integration
│   ├── api-assets/      # Assets API integration
│   └── api-cep/         # Brazilian CEP API integration
└── types/                 # TypeScript type definitions
```

---

## Key Configuration Files

### Package Scripts
- `pnpm dev` - Start development server with dotenv
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome

### Environment Variables

The project uses environment variables validated with Zod schema in `src/core/config/envs.ts`:

**Required Variables:**
- `PORT` - Server port
- `NEXT_PUBLIC_APP_URL` - Public application URL
- `EXTERNAL_API_MAIN_URL` - External main API URL
- `EXTERNAL_API_ASSETS_URL` - External assets API URL
- `APP_ID`, `SYSTEM_CLIENT_ID`, `STORE_ID` - System IDs
- `ORGANIZATION_ID`, `MEMBER_ID`, `USER_ID` - User/organization IDs
- `PERSON_ID`, `TYPE_BUSINESS` - Business IDs

**Developer Info (Public):**
- `NEXT_PUBLIC_DEVELOPER_NAME`
- `NEXT_PUBLIC_DEVELOPER_URL`
- `NEXT_PUBLIC_COMPANY_NAME`
- `NEXT_PUBLIC_COMPANY_PHONE`
- `NEXT_PUBLIC_COMPANY_EMAIL`
- `NEXT_PUBLIC_COMPANY_WHATSAPP`

**Database:**
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`
- `DATABASE_USER`, `DATABASE_PASSWORD`

**Security:**
- `API_KEY` - API key for external services

**Better Auth:**
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`

**OAuth:**
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Email (Resend):**
- `RESEND_API_KEY`
- `EMAIL_SENDER_NAME`
- `EMAIL_SENDER_ADDRESS`

---

## Coding Conventions

### TypeScript
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Use interfaces for object shapes
- Export types explicitly
- Use `type` for type unions, `interface` for object structures

### Components
- Functional components with TypeScript props
- Use Radix UI primitives via Shadcn/UI
- Class-based variants using `cva` from `class-variance-authority`
- Use `cn()` utility for className merging (from `@/lib/utils`)
- Destructure props explicitly
- Default exports for UI components

### Styling
- Tailwind CSS 4 with CSS variables
- Dark mode supported via `next-themes`
- Use CSS variables for theme colors
- Follow shadcn/ui "New York" style
- Stone color scheme

### Forms
- React Hook Form for form state
- Zod schemas for validation
- Use `@/components/ui/form` for form components
- Use `@hookform/resolvers` for schema integration

### Authentication
- Better Auth configured in `src/lib/auth/auth.ts`
- Session management with cookie caching
- Two-factor authentication enabled
- Email verification required
- Social providers: Google, GitHub
- Organization roles: owner, admin, member
- System roles: admin (superAdmin), user

### API Calls
- Axios-based HTTP client
- Separate client (`src/lib/axios/axios-client.ts`) and server (`src/lib/axios/server-axios-client.ts`) clients
- Base API service pattern in `src/lib/axios/base-api-service.ts`
- Services organized by domain in `src/services/`

### Error Handling
- Use Sonner for toast notifications
- Better Auth handles authentication errors
- Zod validation errors for forms

---

## Development Workflow

### Before Making Changes
1. Understand existing patterns in similar components
2. Check for existing utilities in `src/lib/`
3. Use existing UI components from `src/components/ui/`

### Adding New Pages
- Use App Router: create `page.tsx` in `src/app/`
- Group related pages using route groups (e.g., `(auth)`, `(dashboard)`)
- Follow existing page structure

### Adding New Components
- UI components go in `src/components/ui/` (shadcn/ui style)
- Feature components go in appropriate feature folder
- Follow existing component patterns
- Use `cn()` for className merging
- Support dark mode via theme variables

### Adding API Routes
- Place in `src/app/api/`
- Use TypeScript for request/response
- Use Better Auth for authentication
- Follow Next.js API route patterns

### External API Integration
- Create service in `src/services/`
- Use axios client from `src/lib/axios/`
- Define types in `types/` subfolder
- Add Zod schemas for validation
- Consider caching for frequently accessed data

### Adding Environment Variables
1. Add variable to `.env.example`
2. Add validation to `src/core/config/envs.ts` Zod schema
3. Add to `envs` export object
4. Update `.env` with actual value

---

## Important Patterns

### Button Component Pattern
```typescript
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "base classes",
  {
    variants: { variant: { ... }, size: { ... } },
    defaultVariants: { ... }
  }
)

function Button({ className, variant, size, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}
```

### Form Pattern
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({...})

function MyForm() {
  const form = useForm({ resolver: zodResolver(schema) })
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
    </Form>
  )
}
```

### API Service Pattern
```typescript
import { baseApiService } from "@/lib/axios/base-api-service"

export async function getItems() {
  const response = await baseApiService.get<ItemsResponse>('/endpoint')
  return response.data
}
```

### Permission System
- Defined in `src/lib/auth/permissions.ts`
- Organization roles: owner, admin, member
- System roles: admin (superAdmin), user
- Use better-auth's access control

---

## Testing & Quality

### Linting
Run before committing:
```bash
pnpm lint
```

### Formatting
Run before committing:
```bash
pnpm format
```

### Biome Configuration
- 2-space indentation
- Recommended rules enabled
- Next.js and React domains recommended
- Organize imports on save

---

## Special Notes

### Database
- MySQL database managed via connection pool
- Better Auth manages schema automatically
- Database hooks for session customization (sets activeOrganizationId)

### Email Templates
- Located in `src/components/emails/`
- Built with React Email
- Sent via Resend
- Templates: verification, password reset, organization invitation, account deletion

### Organization Multi-tenancy
- Organization plugin enabled in Better Auth
- Active organization stored in session
- Members have roles within organizations

### React Compiler
- Enabled in next.config.ts
- Automatic optimization

### Development Mode
- Use `.env.local` for local overrides
- `dotenv-cli` loads environment variables

---

## External Dependencies

### Shadcn/UI Components
Install new components:
```bash
npx shadcn@latest add [component-name]
```

### Database Migrations
Better Auth manages schema; create migrations as needed via Better Auth CLI.

### Email Templates
Modify in `src/components/emails/` and rebuild.

---

## Common Commands Reference

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build production
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Check code
pnpm format                 # Format code

# Dependencies
pnpm install                # Install dependencies
pnpm add [package]          # Add package
```

---

## File Naming Conventions

- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Utilities:** kebab-case (e.g., `format-date.ts`)
- **Types:** kebab-case with .types.ts suffix (e.g., `user.types.ts`)
- **Services:** kebab-case with .service.ts suffix (e.g., `auth.service.ts`)
- **API Routes:** Lowercase (e.g., `users/route.ts`)
- **Pages:** `page.tsx` (Next.js convention)
- **Layouts:** `layout.tsx` (Next.js convention)

---

## Quick Reference

### Import Aliases
- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`
- `@/hooks/*` → `src/hooks/*`
- `@/app/*` → `src/app/*`

### Key Locations
- Auth config: `src/lib/auth/auth.ts`
- Environment vars: `src/core/config/envs.ts`
- Utility functions: `src/lib/utils.ts`
- Base API service: `src/lib/axios/base-api-service.ts`
- Database types: `src/db/schema.ts`
- UI components: `src/components/ui/`
