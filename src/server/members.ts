"use server";

import type { OrganizationMemberRole } from "@/database/schema";
import { auth } from "@/lib/auth/auth";
import { MemberAuthService } from "@/services/member/member.service";
import { UserAuthService } from "@/services/user/user.service";
import { isAdmin } from "./permissions";

export const addMember = async (
  organizationId: string,
  userId: string,
  role: OrganizationMemberRole,
) => {
  try {
    await auth.api.addMember({
      body: {
        userId,
        organizationId,
        role,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add member.");
  }
};

export const removeMember = async (memberId: string) => {
  const admin = await isAdmin();

  if (!admin) {
    return {
      success: false,
      error: "You are not authorized to remove members.",
    };
  }

  const result = await MemberAuthService.deleteMember({ memberId });

  if (!result.success) {
    console.error(result.error);
    return {
      success: false,
      error: result.error || "Failed to remove member.",
    };
  }

  return {
    success: true,
    error: null,
  };
};

export const removeMemberAndUser = async (memberId: string, userId: string) => {
  const admin = await isAdmin();

  if (!admin) {
    return {
      success: false,
      error: "Você não tem permissão para remover membros.",
    };
  }

  const memberResult = await MemberAuthService.deleteMember({ memberId });

  if (!memberResult.success) {
    console.error(memberResult.error);
    return {
      success: false,
      error: memberResult.error || "Falha ao remover membro da organização.",
    };
  }

  const userResult = await MemberAuthService.deleteUser({ userId });

  if (!userResult.success) {
    console.error(userResult.error);
    return {
      success: false,
      error: userResult.error || "Falha ao excluir cadastro do usuário.",
    };
  }

  return {
    success: true,
    error: null,
  };
};

export const updateMemberPersonId = async (
  memberId: string,
  personId: number,
) => {
  const admin = await isAdmin();

  if (!admin) {
    return {
      success: false,
      error: "You are not authorized to update members.",
    };
  }

  if (!Number.isInteger(personId) || personId <= 0) {
    return {
      success: false,
      error: "Person ID must be a positive integer.",
    };
  }

  const result = await MemberAuthService.updateMemberPersonId({
    memberId,
    personId,
  });

  if (!result.success) {
    console.error(result.error);
    return {
      success: false,
      error: result.error || "Failed to update Person ID.",
    };
  }

  return {
    success: true,
    error: null,
  };
};

export const updateMemberRole = async (memberId: string, role: string) => {
  const admin = await isAdmin();

  if (!admin) {
    return {
      success: false,
      error: "Você não tem permissão para atualizar membros.",
    };
  }

  if (!role || typeof role !== "string") {
    return {
      success: false,
      error: "Cargo inválido.",
    };
  }

  const result = await MemberAuthService.updateMemberRole({ memberId, role });

  if (!result.success) {
    console.error(result.error);
    return {
      success: false,
      error: result.error || "Falha ao atualizar cargo.",
    };
  }

  return {
    success: true,
    error: null,
  };
};

export const updateUserName = async (userId: string, name: string) => {
  const admin = await isAdmin();

  if (!admin) {
    return {
      success: false,
      error: "Você não tem permissão para atualizar usuários.",
    };
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return {
      success: false,
      error: "Nome inválido.",
    };
  }

  const result = await UserAuthService.updateUserName({
    userId,
    name: name.trim(),
  });

  if (!result.success) {
    console.error(result.error);
    return {
      success: false,
      error: result.error || "Falha ao atualizar nome do usuário.",
    };
  }

  return {
    success: true,
    error: null,
  };
};

export const updateUserAppId = async (userId: string, appId: number) => {
  const admin = await isAdmin();

  if (!admin) {
    return {
      success: false,
      error: "Você não tem permissão para atualizar usuários.",
    };
  }

  if (appId === undefined || typeof appId !== "number") {
    return {
      success: false,
      error: "App ID inválido.",
    };
  }

  const result = await UserAuthService.updateUserAppId({
    userId,
    appId,
  });

  if (!result.success) {
    console.error(result.error);
    return {
      success: false,
      error: result.error || "Falha ao atualizar appId do usuário.",
    };
  }

  return {
    success: true,
    error: null,
  };
};
