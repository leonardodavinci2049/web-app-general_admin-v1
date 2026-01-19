import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "O nome da organização é obrigatório")
    .min(2, "O nome da organização deve ter pelo menos 2 caracteres")
    .max(50, "O nome da organização deve ter no máximo 50 caracteres"),
  slug: z
    .string()
    .min(1, "O slug é obrigatório")
    .min(2, "O slug deve ter pelo menos 2 caracteres")
    .max(50, "O slug deve ter no máximo 50 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "O slug só pode conter letras minúsculas, números e hifens",
    ),
  system_id: z.coerce
    .number()
    .int("O ID SYSTEM deve ser um número inteiro")
    .min(1, "O ID SYSTEM é obrigatório"),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
