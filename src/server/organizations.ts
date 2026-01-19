"use server";

import { createLogger } from "@/core/logger";
import { AuthService } from "@/services/db/auth/auth.service";
import organizationService from "@/services/db/organization/organization.service";
import { getCurrentUser } from "./users";

const logger = createLogger("OrganizationActions");
export async function getOrganizations() {
  const { currentUser } = await getCurrentUser();

  // Usando método otimizado que faz JOIN internamente
  const response = await AuthService.findUserOrganizations({
    userId: currentUser.id,
  });

  if (!response.success || !response.data) {
    console.error(response.error);
    return [];
  }

  return response.data;
}

/**
 * Carrega todas as organizações do sistema
 * Para uso em dashboards de administração global
 * Requer autenticação - redireciona para /sign-in se não houver sessão
 */
export async function getAllOrganizations() {
  // Verifica se existe um usuário logado antes de carregar dados
  // getCurrentUser() redireciona para /sign-in se não houver sessão
  await getCurrentUser();

  try {
    const response = await organizationService.execOrganizationFindAllQuery({});

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading organizations:", response.message);
      return [];
    }

    // Garantir que response.data seja um array
    const organizations = Array.isArray(response.data) ? response.data : [];

    return organizations;
  } catch (error) {
    logger.error("Failed to fetch organizations:", error);
    return [];
  }
}

export async function getActiveOrganization(userId: string) {
  // Usando método otimizado que faz JOIN internamente
  const response = await AuthService.findActiveOrganization({ userId });

  if (!response.success) {
    console.error(response.error);
    return null;
  }

  return response.data;
}

export async function getOrganizationBySlug(slug: string) {
  const response = await AuthService.findOrganizationBySlugWithMembers({
    slug,
  });

  if (!response.success) {
    console.error(response.error);
    return null;
  }

  return response.data;
}
