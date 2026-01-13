# Relatório de Auditoria de Segurança

**Projeto:** nextjs-base-project-v2  
**Data:** 04 de Janeiro de 2026  
**Versão:** 1.0  
**Classificação:** Confidencial

---

## Sumário Executivo

Este relatório apresenta os resultados de uma análise de segurança do projeto Next.js Base Project v2. Foram identificadas **15 vulnerabilidades e pontos de atenção**, categorizados por criticidade:

| Criticidade | Quantidade |
|-------------|------------|
| 🔴 Crítica  | 2          |
| 🟠 Alta     | 4          |
| 🟡 Média    | 5          |
| 🔵 Baixa    | 4          |

---

## Índice

1. [Vulnerabilidades Críticas](#1-vulnerabilidades-críticas)
2. [Vulnerabilidades de Alta Criticidade](#2-vulnerabilidades-de-alta-criticidade)
3. [Vulnerabilidades de Média Criticidade](#3-vulnerabilidades-de-média-criticidade)
4. [Vulnerabilidades de Baixa Criticidade](#4-vulnerabilidades-de-baixa-criticidade)
5. [Boas Práticas Identificadas](#5-boas-práticas-identificadas)
6. [Recomendações Gerais](#6-recomendações-gerais)
7. [Plano de Ação Sugerido](#7-plano-de-ação-sugerido)

---

## 1. Vulnerabilidades Críticas

### 1.1 🔴 Exposição de Credenciais em Logs (Console Log com Senha)

**Arquivo:** `src/server/users.ts` (linha 32)

**Descrição:**  
A função `signIn` registra email e senha em texto plano no console:

```typescript
export const signIn = async (email: string, password: string) => {
  console.log("signIn: ", email, password);
```

**Impacto:**
- Senhas em texto plano podem ser capturadas em logs de servidor
- Violação de conformidade LGPD/GDPR
- Exposição crítica em ambientes com agregadores de logs (CloudWatch, Datadog, etc.)

**Mitigação:**
```typescript
export const signIn = async (email: string, password: string) => {
  // Remover completamente o log ou usar apenas email (mascarado)
  if (process.env.NODE_ENV === 'development') {
    console.log("signIn attempt for:", email.replace(/(.{2})(.*)(@.*)/, '$1***$3'));
  }
```

**Severidade:** CRÍTICA  
**CVSS:** 9.1  
**CWE:** CWE-532 (Insertion of Sensitive Information into Log File)

---

### 1.2 🔴 Middleware de Autenticação Inseguro

**Arquivo:** `src/proxy.ts` (linhas 10-17)

**Descrição:**  
O próprio código admite a insegurança com o comentário "THIS IS NOT SECURE!":

```typescript
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
```

**Impacto:**
- Verificação de autenticação otimista (não bloqueante)
- Possibilidade de bypass do middleware
- Rotas protegidas podem ser acessadas antes da verificação completa

**Mitigação:**
- Implementar verificação de autenticação em cada página/rota individualmente
- Usar middleware apenas para redirecionamento, não como camada de segurança principal
- Implementar verificação server-side em todas as Server Actions

**Severidade:** CRÍTICA  
**CVSS:** 8.6  
**CWE:** CWE-287 (Improper Authentication)

---

## 2. Vulnerabilidades de Alta Criticidade

### 2.1 🟠 Ausência de Rate Limiting

**Arquivos Afetados:**
- `src/app/(auth)/sign-in/actions.ts`
- `src/app/api/auth/[...all]/route.ts`
- `src/server/users.ts`

**Descrição:**  
Não há implementação de rate limiting para endpoints de autenticação, permitindo ataques de força bruta.

**Impacto:**
- Vulnerabilidade a ataques de força bruta
- Possibilidade de credential stuffing
- DoS em endpoints de autenticação

**Mitigação:**
```typescript
// Implementar rate limiting com upstash/ratelimit ou similar
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 tentativas por minuto
});

// Na action de login:
const ip = headers().get('x-forwarded-for') ?? 'unknown';
const { success } = await ratelimit.limit(ip);
if (!success) {
  return { success: false, message: "Muitas tentativas. Aguarde 1 minuto." };
}
```

**Severidade:** ALTA  
**CVSS:** 7.5  
**CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)

---

### 2.2 🟠 Logs Excessivos em Produção

**Arquivos Afetados:**
- `src/lib/axios/axios-client.ts` (linhas 53-108)
- `src/lib/axios/server-axios-client.ts` (linhas 90-105)
- `src/lib/auth.ts` (linhas 63-65)
- `src/services/db/dbConnection.ts` (múltiplas linhas)

**Descrição:**  
Logs detalhados incluindo headers, parâmetros de requisição e dados de resposta, alguns condicionados apenas ao ambiente de desenvolvimento, outros não.

```typescript
// axios-client.ts - Logs em desenvolvimento
if (process.env.NODE_ENV === "development") {
  console.log(`[${new Date().toISOString()}] 🚀 ${config.method?.toUpperCase()} ${config.url}`, {
    params: config.params,
    headers: config.headers, // Headers podem conter tokens
  });
}

// auth.ts - Logs sempre ativos
console.log("Email sent successfully:", response.data);
```

**Impacto:**
- Exposição de tokens e headers de autenticação
- Vazamento de dados sensíveis em logs de produção
- Violação de privacidade de dados

**Mitigação:**
- Criar uma camada de logging centralizada com níveis de log
- Nunca logar headers completos (mascarar Authorization)
- Usar structured logging com sanitização automática

```typescript
// Exemplo de logger seguro
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['password', 'headers.authorization', 'headers.cookie', 'apiKey'],
    censor: '[REDACTED]'
  }
});
```

**Severidade:** ALTA  
**CVSS:** 6.5  
**CWE:** CWE-200 (Exposure of Sensitive Information)

---

### 2.3 🟠 Uso de dangerouslySetInnerHTML

**Arquivo:** `src/components/ui/chart.tsx` (linhas 83-99)

**Descrição:**  
Uso de `dangerouslySetInnerHTML` para injeção de CSS dinâmico:

```typescript
<style
  dangerouslySetInnerHTML={{
    __html: Object.entries(THEMES)
      .map(([theme, prefix]) => `...`)
      .join("\n"),
  }}
/>
```

**Impacto:**
- Potencial vetor de XSS se dados de entrada não forem validados
- Comentário do Biome indica conhecimento do risco, mas não há sanitização explícita

**Mitigação:**
- Validar e sanitizar todos os valores de `colorConfig`
- Usar CSS-in-JS ou styled-components como alternativa
- Implementar Content Security Policy (CSP) restritiva

```typescript
// Sanitização de valores CSS
const sanitizeCSSValue = (value: string): string => {
  return value.replace(/[;<>{}]/g, '');
};
```

**Severidade:** ALTA  
**CVSS:** 6.1  
**CWE:** CWE-79 (Cross-site Scripting)

---

### 2.4 🟠 Exposição de API Key no Header

**Arquivo:** `src/lib/axios/server-axios-client.ts` (linhas 78-80)

**Descrição:**  
API Key é enviada como Bearer token em todas as requisições do servidor:

```typescript
if (this.apiKey) {
  config.headers.Authorization = `Bearer ${this.apiKey}`;
}
```

**Impacto:**
- Se a API externa for comprometida, todas as requisições podem ser rastreadas
- API Key pode ser exposta em logs do servidor de destino
- Sem rotação automática de chaves

**Mitigação:**
- Implementar rotação periódica de API Keys
- Usar tokens de curta duração quando possível
- Monitorar uso anômalo da API Key
- Implementar IP allowlist para a API Key

**Severidade:** ALTA  
**CVSS:** 6.0  
**CWE:** CWE-798 (Use of Hard-coded Credentials)

---

## 3. Vulnerabilidades de Média Criticidade

### 3.1 🟡 Ausência de Proteção CSRF Explícita

**Arquivos Afetados:**
- `src/app/(auth)/sign-in/actions.ts`
- `src/server/members.ts`
- `src/server/users.ts`

**Descrição:**  
Não há proteção CSRF explícita implementada nas Server Actions. Embora Next.js 14+ tenha proteções built-in, não há validação adicional.

**Impacto:**
- Possíveis ataques CSRF em formulários
- Ações não autorizadas em nome de usuários autenticados

**Mitigação:**
- Better Auth já inclui proteção CSRF por padrão
- Adicionar validação de Origin/Referer nas Server Actions críticas
- Implementar tokens CSRF personalizados para operações sensíveis

```typescript
// Validação de origem
const origin = headers().get('origin');
const host = headers().get('host');
if (origin && !origin.includes(host)) {
  throw new Error('Invalid origin');
}
```

**Severidade:** MÉDIA  
**CVSS:** 5.4  
**CWE:** CWE-352 (Cross-Site Request Forgery)

---

### 3.2 🟡 Configuração de Sessão Não Explícita

**Arquivo:** `src/lib/auth.ts`

**Descrição:**  
Não há configuração explícita para duração de sessão, configurações de cookie (httpOnly, secure, sameSite), ou invalidação de sessão.

**Impacto:**
- Sessões podem ter duração excessivamente longa
- Cookies podem não estar configurados com máxima segurança
- Falta de controle sobre sessões ativas

**Mitigação:**
```typescript
export const auth = betterAuth({
  // ... configurações existentes
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualiza a cada 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache de 5 minutos
    }
  },
  advanced: {
    cookiePrefix: "__app",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    }
  }
});
```

**Severidade:** MÉDIA  
**CVSS:** 5.3  
**CWE:** CWE-613 (Insufficient Session Expiration)

---

### 3.3 🟡 Ausência de Configuração de Security Headers

**Arquivo:** `next.config.ts`

**Descrição:**  
A configuração do Next.js não inclui headers de segurança:

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  // Sem configuração de headers de segurança
};
```

**Impacto:**
- Vulnerabilidade a clickjacking
- Ausência de Content Security Policy
- Falta de proteção contra MIME sniffing

**Mitigação:**
```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          },
          { 
            key: 'Permissions-Policy', 
            value: 'camera=(), microphone=(), geolocation=()'
          },
          { 
            key: 'Strict-Transport-Security', 
            value: 'max-age=31536000; includeSubDomains'
          }
        ],
      },
    ];
  },
};
```

**Severidade:** MÉDIA  
**CVSS:** 5.0  
**CWE:** CWE-693 (Protection Mechanism Failure)

---

### 3.4 🟡 Validação de Input Insuficiente em Rotas API

**Arquivo:** `src/app/api/accept-invitation/[invitationId]/route.ts`

**Descrição:**  
O `invitationId` é usado diretamente sem validação:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  const { invitationId } = await params;

  try {
    const data = await auth.api.acceptInvitation({
      body: { invitationId }, // Sem validação
    });
```

**Impacto:**
- Possibilidade de injeção através de parâmetros malformados
- IDs inválidos podem causar erros não tratados

**Mitigação:**
```typescript
import { z } from 'zod';

const invitationIdSchema = z.string().uuid();

export async function GET(request: NextRequest, { params }: ...) {
  const { invitationId } = await params;
  
  const validation = invitationIdSchema.safeParse(invitationId);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid invitation ID' }, 
      { status: 400 }
    );
  }
  // ...
}
```

**Severidade:** MÉDIA  
**CVSS:** 4.3  
**CWE:** CWE-20 (Improper Input Validation)

---

### 3.5 🟡 Redirecionamento Sempre para Dashboard em Erro

**Arquivo:** `src/app/api/accept-invitation/[invitationId]/route.ts`

**Descrição:**  
Em caso de erro, o usuário é redirecionado para o dashboard sem feedback:

```typescript
} catch (error) {
  console.error(error);
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

**Impacto:**
- Usuário não sabe que houve erro
- Erro silencioso pode mascarar problemas de segurança
- Falta de auditoria adequada

**Mitigação:**
```typescript
} catch (error) {
  logger.error('Failed to accept invitation', { invitationId, error });
  return NextResponse.redirect(
    new URL("/dashboard?error=invitation_failed", request.url)
  );
}
```

**Severidade:** MÉDIA  
**CVSS:** 3.7  
**CWE:** CWE-754 (Improper Check for Unusual or Exceptional Conditions)

---

## 4. Vulnerabilidades de Baixa Criticidade

### 4.1 🔵 Fallback de URL Hardcoded

**Arquivo:** `src/lib/auth-client.ts` (linha 9)

**Descrição:**  
URL de fallback hardcoded para localhost:

```typescript
baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
```

**Impacto:**
- Em produção sem variável configurada, tentará conectar em localhost
- Pode causar erros silenciosos ou comportamento inesperado

**Mitigação:**
```typescript
const baseURL = process.env.NEXT_PUBLIC_APP_URL;
if (!baseURL && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_APP_URL not configured, using window.location.origin');
}

baseURL: baseURL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
```

**Severidade:** BAIXA  
**CVSS:** 2.4  
**CWE:** CWE-1188 (Insecure Default Initialization)

---

### 4.2 🔵 Uso de process.env Direto em Código (Não via envs)

**Arquivo:** `src/lib/auth.ts` (linhas 84-85, 92)

**Descrição:**  
Acesso direto a `process.env` em vez de usar o objeto `envs` validado:

```typescript
google: {
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
},
// ...
const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/accept-invitation/${data.id}`;
```

**Impacto:**
- Bypass da validação centralizada de variáveis de ambiente
- Inconsistência no acesso a configurações
- Pode falhar silenciosamente se variável não existir

**Mitigação:**
```typescript
google: {
  clientId: envs.GOOGLE_CLIENT_ID,
  clientSecret: envs.GOOGLE_CLIENT_SECRET,
},
// ...
const inviteLink = `${envs.NEXT_PUBLIC_APP_URL}/api/accept-invitation/${data.id}`;
```

**Severidade:** BAIXA  
**CVSS:** 2.1  
**CWE:** CWE-1188 (Insecure Default Initialization)

---

### 4.3 🔵 Documentação de API Key em README

**Arquivo:** `src/lib/axios/README.md` (linhas 173-174)

**Descrição:**  
Exemplo de API Key em documentação:

```markdown
# .env (servidor apenas)
API_KEY=your-secret-api-key
```

**Impacto:**
- Pode induzir desenvolvedores a usar valores de exemplo
- Se commitado acidentalmente, expõe padrões de chave

**Mitigação:**
- Usar valores claramente fake: `API_KEY=<YOUR_API_KEY_HERE>`
- Adicionar comentário: `# NEVER commit real keys`

**Severidade:** BAIXA  
**CVSS:** 1.8  
**CWE:** CWE-312 (Cleartext Storage of Sensitive Information)

---

### 4.4 🔵 Falta de Validação de Tamanho Máximo em Formulários

**Arquivo:** `src/app/(auth)/sign-in/schema.ts`

**Descrição:**  
Schema de validação não limita tamanho máximo de campos:

```typescript
export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("..."),
  password: z.string().min(1, "...").min(8, "..."),
  // Sem .max() para limitar tamanho
});
```

**Impacto:**
- Possibilidade de envio de payloads muito grandes
- Potencial DoS através de campos excessivamente longos

**Mitigação:**
```typescript
export const signInSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .max(254, "Email too long")
    .email("Please enter a valid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
});
```

**Severidade:** BAIXA  
**CVSS:** 2.7  
**CWE:** CWE-400 (Uncontrolled Resource Consumption)

---

## 5. Boas Práticas Identificadas

O projeto apresenta várias boas práticas de segurança já implementadas:

### ✅ Validação de Variáveis de Ambiente
- Uso de Zod para validação rigorosa em `src/core/config/envs.ts`
- Separação clara entre variáveis públicas e privadas
- Fallback seguro no cliente (valores vazios para dados sensíveis)

### ✅ Proteção contra SQL Injection
- Uso de prepared statements em `src/services/db/auth/auth.service.ts`
- Queries parametrizadas com placeholders (`?`)
- Validação de IDs antes de queries

### ✅ Separação Server/Client
- Uso de `"server-only"` em módulos sensíveis
- Server Actions para operações autenticadas
- Dados sensíveis não expostos ao cliente

### ✅ Validação de Entrada
- Schemas Zod para formulários
- Validação de IDs e slugs no AuthService
- Tratamento de erros estruturado

### ✅ Arquivos Sensíveis no .gitignore
- `.env*` corretamente ignorado
- Proteção contra commit acidental de credenciais

### ✅ Autenticação Robusta
- Better Auth com plugins de segurança
- Verificação de email obrigatória
- Sistema de permissões baseado em roles

---

## 6. Recomendações Gerais

### 6.1 Implementar Observabilidade de Segurança
- Integrar com SIEM (Security Information and Event Management)
- Configurar alertas para eventos de segurança
- Implementar audit trail para ações sensíveis

### 6.2 Adicionar Testes de Segurança
- Testes de penetração automatizados
- SAST (Static Application Security Testing)
- DAST (Dynamic Application Security Testing)

### 6.3 Documentação de Segurança
- Criar runbook de incidentes
- Documentar processo de rotação de credenciais
- Estabelecer política de disclosure de vulnerabilidades

### 6.4 Monitoramento em Produção
- Implementar health checks
- Monitorar tentativas de login falhas
- Alertas para padrões suspeitos de acesso

---

## 7. Plano de Ação Sugerido

| Prioridade | Item | Esforço | Prazo Sugerido |
|------------|------|---------|----------------|
| 🔴 P0 | Remover log de senha | 5 min | Imediato |
| 🔴 P0 | Revisar middleware de auth | 4h | 1 dia |
| 🟠 P1 | Implementar rate limiting | 8h | 1 semana |
| 🟠 P1 | Sanitizar logs | 4h | 1 semana |
| 🟠 P1 | Revisar dangerouslySetInnerHTML | 2h | 1 semana |
| 🟡 P2 | Configurar security headers | 2h | 2 semanas |
| 🟡 P2 | Configurar sessão explicitamente | 2h | 2 semanas |
| 🟡 P2 | Validar inputs em rotas API | 4h | 2 semanas |
| 🔵 P3 | Corrigir fallbacks hardcoded | 1h | 1 mês |
| 🔵 P3 | Padronizar uso de envs | 2h | 1 mês |

---

## Conclusão

O projeto demonstra maturidade em segurança básica, com boas práticas de validação e separação de concerns. Entretanto, as vulnerabilidades críticas identificadas (exposição de senha em logs e middleware inseguro) requerem atenção imediata.

A implementação de rate limiting e security headers elevará significativamente a postura de segurança da aplicação.

---

**Elaborado por:** GitHub Copilot - Análise Automatizada  
**Revisão necessária:** Equipe de Segurança  
**Próxima auditoria sugerida:** Após implementação das correções P0 e P1
