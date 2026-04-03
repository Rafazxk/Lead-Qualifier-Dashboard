# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### LeadFilter (`artifacts/lead-filter`)
- **Type**: React + Vite web app
- **Preview path**: `/`
- **Description**: Dashboard de qualificação de leads com IA simulada (client-side).
- **Features**:
  - Formulário: Nome, E-mail, Orçamento (R$), Descrição do projeto
  - Motor de qualificação em `src/lib/qualification.ts` — calcula Score 1–5 e feedback baseado em orçamento, palavras-chave e urgência
  - Tabela lateral com leads qualificados, score estrelas, tags coloridas, e detalhes expansíveis
  - Design dark estilo security dashboard, responsivo
  - Ícones Lucide React, validação Zod + react-hook-form

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
