import type { OrganizationMemberRole } from "@/database/schema";

export const MEMBER_ROLES: OrganizationMemberRole[] = [
  "owner",
  "manager",
  "salesperson",
  "operator",
  "cashier",
  "finance",
  "shipping",
  "customer",
];

export const MEMBER_ROLE_LABELS: Record<OrganizationMemberRole, string> = {
  owner: "Proprietário",
  manager: "Gerente",
  salesperson: "Vendedor",
  operator: "Operador",
  cashier: "Caixa",
  finance: "Financeiro",
  shipping: "Expedição",
  customer: "Cliente",
};
