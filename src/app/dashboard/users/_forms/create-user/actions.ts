"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { createUserSchema } from "./schema";

export type CreateUserState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
};

export async function createUserAction(
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const validatedFields = createUserSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Falha na validação",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    await auth.api.createUser({
      headers: await headers(),
      body: {
        name,
        email,
        password,
        role,
      },
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "Usuário criado com sucesso",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Falha ao criar usuário",
    };
  }
}
