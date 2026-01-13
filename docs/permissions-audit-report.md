# Relatório de Auditoria: Sistema de Permissões Better Auth

**Data:** 12 de Janeiro de 2026  
**Arquivos Analisados:**
- `src/lib/auth/auth.ts`
- `src/lib/auth/auth-client.ts`
- `src/lib/auth/permissions.ts`

---

## Sumário Executivo

Este relatório apresenta uma análise detalhada da implementação do sistema de controle de acesso (Access Control) utilizando os plugins `organization` e `admin` do Better Auth. Foram identificadas **inconformidades** e **oportunidades de melhoria** que, se implementadas, aumentarão a segurança, manutenibilidade e conformidade com as melhores práticas recomendadas pela documentação oficial.

---

## 1. Inconformidades Identificadas

### 1.1 ❌ Ausência dos `defaultStatements` do Plugin Admin

**Localização:** `src/lib/auth/permissions.ts`

**Problema:**
O statement atual não inclui os `defaultStatements` do plugin admin, que contém recursos importantes como `user` e `session`:

```typescript
// Atual (incorreto)
const statement = {
  ...defaultStatements1, // Apenas organization defaults
  project: ["create", "share", "update", "delete"],
  organization: ["create", "update", "delete", "manage"],
  user: ["list", "update", "delete"],
} as const;
```

**Impacto:**
- Redefinição manual e parcial do recurso `user` pode causar conflitos
- As permissões padrão do admin plugin (`session`) não estão disponíveis
- As ações `create`, `set-role`, `ban`, `impersonate`, `set-password` do recurso `user` estão ausentes

**Recomendação:**
```typescript
import { defaultStatements as adminDefaultStatements } from "better-auth/plugins/admin/access";
import { defaultStatements as orgDefaultStatements } from "better-auth/plugins/organization/access";

const statement = {
  ...adminDefaultStatements,  // Inclui user e session
  ...orgDefaultStatements,    // Inclui organization, member, invitation
  project: ["create", "share", "update", "delete"],
} as const;
```

---

### 1.2 ❌ Roles do Organization Plugin Não Herdam Permissões Padrão

**Localização:** `src/lib/auth/permissions.ts`

**Problema:**
Os roles `member`, `admin` e `owner` do plugin `organization` não herdam as permissões padrão do Better Auth, sobrescrevendo completamente as permissões esperadas:

```typescript
// Atual (incorreto)
const member = ac.newRole({
  project: ["create"],
  organization: [],
});

const admin = ac.newRole({
  project: ["create", "update"],
  organization: ["update"],
});

const owner = ac.newRole({
  project: ["create", "update", "delete"],
  organization: ["create", "update", "delete", "manage"],
});
```

**Impacto:**
- Roles não possuem permissões sobre `member` e `invitation` (recursos padrão do organization plugin)
- Funcionalidades como convidar membros, listar membros, etc. podem não funcionar corretamente
- Violação do princípio de extensão vs substituição

**Recomendação:**
Utilizar o spread operator com os Access Controls padrão:

```typescript
import { 
  ownerAc, 
  adminAc, 
  memberAc 
} from "better-auth/plugins/organization/access";

const member = ac.newRole({
  ...memberAc.statements,
  project: ["create"],
});

const admin = ac.newRole({
  ...adminAc.statements,
  project: ["create", "update"],
});

const owner = ac.newRole({
  ...ownerAc.statements,
  project: ["create", "update", "delete"],
});
```

---

### 1.3 ❌ Roles Não Configurados no Organization Client Plugin

**Localização:** `src/lib/auth/auth-client.ts`

**Problema:**
O `organizationClient` não recebe a configuração de `ac` e `roles`:

```typescript
// Atual (incorreto)
plugins: [
  organizationClient(), // Sem configuração
  // ...
]
```

**Impacto:**
- Função `checkRolePermission` do cliente não funcionará corretamente
- Verificações de permissão client-side podem falhar
- Inconsistência entre server e client

**Recomendação:**
```typescript
import { ac, owner, admin, member } from "./permissions";

plugins: [
  organizationClient({
    ac,
    roles: {
      owner,
      admin,
      member,
    },
  }),
  // ...
]
```

---

### 1.4 ❌ Console.log em Código de Produção

**Localização:** `src/lib/auth/permissions.ts` (linhas 12-15)

**Problema:**
Existem chamadas `console.log` que expõem informações do sistema de permissões:

```typescript
console.log("defaultStatements: ", admin_defaultStatements);
console.log("adminAc: ", admin_adminAc);
console.log("userAc: ", admin_userAc);
console.log("defaultAc: ", admin_defaultAc);
```

**Impacto:**
- Exposição de informações sensíveis do sistema de autorização
- Poluição do console em produção
- Potencial vazamento de configuração de segurança

**Recomendação:**
Remover completamente os `console.log` ou usar o logger configurado do projeto apenas em ambiente de desenvolvimento.

---

### 1.5 ❌ Imports Não Utilizados

**Localização:** `src/lib/auth/permissions.ts`

**Problema:**
Variáveis importadas mas não utilizadas:

```typescript
import {
  defaultStatements as admin_defaultStatements,
  adminAc as admin_adminAc,
  userAc as admin_userAc,
  defaultAc as admin_defaultAc,
} from "better-auth/plugins/admin/access";
```

**Impacto:**
- Código desnecessário aumentando o bundle size
- Confusão sobre o propósito dessas importações
- Violação de práticas de clean code

**Recomendação:**
Utilizar essas importações para compor os statements corretamente ou removê-las.

---

### 1.6 ❌ Role `superAdmin` com Permissões Incompletas

**Localização:** `src/lib/auth/permissions.ts`

**Problema:**
O role `superAdmin` não herda as permissões padrão do admin plugin:

```typescript
const superAdmin = ac.newRole({
  project: ["create", "share", "update", "delete"],
  organization: ["create", "update", "delete", "manage"],
  user: ["list", "update", "delete"],
});
```

**Impacto:**
- Ausência de permissões como `user: ["create", "set-role", "ban", "impersonate", "set-password"]`
- Ausência de permissões sobre `session: ["list", "revoke", "delete"]`
- SuperAdmin pode não ter acesso total como esperado

**Recomendação:**
```typescript
import { adminAc } from "better-auth/plugins/admin/access";

const superAdmin = ac.newRole({
  ...adminAc.statements,
  project: ["create", "share", "update", "delete"],
  organization: ["create", "update", "delete", "manage"],
});
```

---

## 2. Sugestões de Melhoria

### 2.1 📋 Estruturação Hierárquica de Permissões

**Situação Atual:**
As permissões são definidas de forma flat, sem hierarquia clara.

**Sugestão:**
Implementar uma estrutura hierárquica onde roles superiores automaticamente herdam permissões de roles inferiores:

```typescript
// Base permissions
const baseMemberPermissions = {
  project: ["create"],
};

// Admin extends member
const baseAdminPermissions = {
  ...baseMemberPermissions,
  project: [...baseMemberPermissions.project, "update"],
  organization: ["update"],
};

// Owner extends admin
const baseOwnerPermissions = {
  ...baseAdminPermissions,
  project: [...baseAdminPermissions.project, "delete"],
  organization: ["create", "update", "delete", "manage"],
};
```

---

### 2.2 📋 Separação de Concerns: Arquivo Dedicado para Statements

**Sugestão:**
Criar arquivos separados para melhor organização:

```
src/lib/auth/
├── permissions/
│   ├── index.ts          # Exports públicos
│   ├── statements.ts     # Definição dos statements
│   ├── organization-roles.ts  # Roles do organization plugin
│   └── admin-roles.ts    # Roles do admin plugin
└── auth.ts
```

---

### 2.3 📋 Documentação Inline dos Recursos e Ações

**Sugestão:**
Adicionar comentários explicativos para cada recurso e ação:

```typescript
const statement = {
  // Recurso: Projetos da aplicação
  // Ações disponíveis para controle de projetos
  project: [
    "create",  // Criar novo projeto
    "share",   // Compartilhar projeto com outros usuários
    "update",  // Atualizar dados do projeto
    "delete",  // Remover projeto permanentemente
  ],
  // ... outros recursos
} as const;
```

---

### 2.4 📋 Implementar Validação de Permissões em Runtime

**Sugestão:**
Criar helper functions para validar permissões de forma tipada:

```typescript
// src/lib/auth/permission-helpers.ts
import type { Statement } from "./permissions";

export function hasPermission(
  userPermissions: Partial<Statement>,
  resource: keyof Statement,
  action: Statement[typeof resource][number]
): boolean {
  return userPermissions[resource]?.includes(action) ?? false;
}
```

---

### 2.5 📋 Considerar Dynamic Access Control

**Situação Atual:**
Roles são estáticos e definidos em tempo de build.

**Sugestão:**
Para casos de uso mais avançados, considerar habilitar o Dynamic Access Control do organization plugin:

```typescript
organization({
  ac,
  roles: { owner, admin, member },
  dynamicAccessControl: {
    enabled: true,
    maximumRolesPerOrganization: 10,
  },
})
```

**Benefícios:**
- Permite criar roles customizados por organização
- Maior flexibilidade para diferentes necessidades de clientes
- Roles podem ser gerenciados via API

---

### 2.6 📋 Adicionar Testes Unitários para Permissões

**Sugestão:**
Implementar testes para garantir que as permissões estão configuradas corretamente:

```typescript
// __tests__/permissions.test.ts
import { ac, member, admin, owner, superAdmin } from "@/lib/auth/permissions";

describe("Permission System", () => {
  test("member should only create projects", () => {
    expect(member.statements.project).toContain("create");
    expect(member.statements.project).not.toContain("delete");
  });

  test("owner should have all organization permissions", () => {
    expect(owner.statements.organization).toContain("create");
    expect(owner.statements.organization).toContain("manage");
  });

  test("superAdmin should have all permissions", () => {
    // Verificar todas as permissões do superAdmin
  });
});
```

---

### 2.7 📋 Exportar Statement para Type Safety

**Sugestão:**
Exportar o tipo do statement para uso em outras partes da aplicação:

```typescript
export type Statement = typeof statement;
export type Resource = keyof Statement;
export type Action<R extends Resource> = Statement[R][number];
```

---

## 3. Matriz de Permissões Recomendada

| Recurso | Ação | member | admin | owner | user (system) | superAdmin |
|---------|------|--------|-------|-------|---------------|------------|
| **project** | create | ✅ | ✅ | ✅ | ✅ | ✅ |
| **project** | share | ❌ | ❌ | ❌ | ❌ | ✅ |
| **project** | update | ❌ | ✅ | ✅ | ❌ | ✅ |
| **project** | delete | ❌ | ❌ | ✅ | ❌ | ✅ |
| **organization** | create | ❌ | ❌ | ✅ | ✅ | ✅ |
| **organization** | update | ❌ | ✅ | ✅ | ❌ | ✅ |
| **organization** | delete | ❌ | ❌ | ✅ | ❌ | ✅ |
| **organization** | manage | ❌ | ❌ | ✅ | ❌ | ✅ |
| **member** | create | ❌ | ✅ | ✅ | ❌ | ✅ |
| **member** | update | ❌ | ✅ | ✅ | ❌ | ✅ |
| **member** | delete | ❌ | ❌ | ✅ | ❌ | ✅ |
| **invitation** | create | ❌ | ✅ | ✅ | ❌ | ✅ |
| **invitation** | cancel | ❌ | ✅ | ✅ | ❌ | ✅ |
| **user** | list | ❌ | ❌ | ❌ | ❌ | ✅ |
| **user** | update | ❌ | ❌ | ❌ | ❌ | ✅ |
| **user** | delete | ❌ | ❌ | ❌ | ❌ | ✅ |
| **user** | ban | ❌ | ❌ | ❌ | ❌ | ✅ |
| **user** | impersonate | ❌ | ❌ | ❌ | ❌ | ✅ |
| **session** | list | ❌ | ❌ | ❌ | ❌ | ✅ |
| **session** | revoke | ❌ | ❌ | ❌ | ❌ | ✅ |
| **session** | delete | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Resumo das Ações Necessárias

### Prioridade Alta (Segurança)
1. [ ] Remover `console.log` do código de produção
2. [ ] Incluir `defaultStatements` do admin plugin no statement
3. [ ] Herdar permissões padrão nos roles do organization plugin
4. [ ] Completar permissões do `superAdmin`

### Prioridade Média (Funcionalidade)
5. [ ] Configurar `ac` e `roles` no `organizationClient`
6. [ ] Remover imports não utilizados
7. [ ] Adicionar permissões de `member` e `invitation` nos roles apropriados

### Prioridade Baixa (Melhoria)
8. [ ] Reorganizar estrutura de arquivos
9. [ ] Implementar testes unitários
10. [ ] Documentar recursos e ações
11. [ ] Considerar Dynamic Access Control para futuras necessidades

---

## 5. Referências

- [Better Auth - Organization Plugin](https://www.better-auth.com/docs/plugins/organization)
- [Better Auth - Admin Plugin](https://www.better-auth.com/docs/plugins/admin)
- [Better Auth - Access Control](https://www.better-auth.com/docs/plugins/access)

---

*Relatório gerado automaticamente em 12/01/2026*
