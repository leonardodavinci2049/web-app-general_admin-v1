import { z } from "zod";

export const VALID_APP_IDS = [2, 3, 6, 7] as const;

export type ValidAppId = (typeof VALID_APP_IDS)[number];

export const createOrganizationMemberUserSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("E-mail inválido")
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(
      /[^a-zA-Z0-9]/,
      "A senha deve conter pelo menos um caractere especial",
    )
    .max(100, "A senha deve ter no máximo 100 caracteres"),
  memberRole: z.enum([
    "owner",
    "manager",
    "salesperson",
    "operator",
    "cashier",
    "finance",
    "shipping",
    "customer",
  ]),
  personId: z.coerce
    .number({ error: "PersonId é obrigatório" })
    .int("PersonId deve ser um número inteiro")
    .positive("PersonId deve ser um número positivo"),
  appId: z.coerce
    .number()
    .int()
    .refine(
      (val): val is ValidAppId => VALID_APP_IDS.includes(val as ValidAppId),
      {
        message: "appId inválido",
      },
    ),
});

export type CreateOrganizationMemberUserInput = z.input<
  typeof createOrganizationMemberUserSchema
>;
