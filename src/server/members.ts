"use server";

import { auth } from "@/lib/auth/auth";
import { AuthService } from "@/services/db/auth/auth.service";
import type { OrganizationMemberRole } from "@/services/db/schema";
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

  const result = await AuthService.deleteMember({ memberId });

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
