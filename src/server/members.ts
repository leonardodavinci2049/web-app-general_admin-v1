"use server";

import type { OrganizationMemberRole } from "@/database/schema";
import { auth } from "@/lib/auth/auth";
import { MemberAuthService } from "@/services/member/member.service";
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
