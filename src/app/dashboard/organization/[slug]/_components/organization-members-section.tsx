import type { Member } from "@/database/schema";
import { MemberAuthService } from "@/services/member/member.service";
import MembersTable from "./members-table";
import { MembersTableSkeleton } from "./skeleton/members-table-skeleton";

type OrganizationMembersSectionProps = {
  organizationId: string;
  appId?: number;
};

async function OrganizationMembersSectionContent({
  organizationId,
  appId,
}: OrganizationMembersSectionProps) {
  const response = await MemberAuthService.findMembersWithUsersByOrganization({
    organizationId,
    appId,
  });

  const members: Member[] = (response.data ?? []).map((m) => ({
    id: m.id,
    organizationId: m.organizationId,
    userId: m.userId,
    role: m.role,
    personId: m.personId,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    user: {
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      image: m.user.image,
      emailVerified: m.user.emailVerified,
      createdAt: m.user.createdAt,
      updatedAt: m.user.updatedAt,
      twoFactorEnabled: m.user.twoFactorEnabled,
      appId: m.user.appId,
    },
  }));

  return <MembersTable members={members} />;
}

export function OrganizationMembersSection(
  props: OrganizationMembersSectionProps,
) {
  return <OrganizationMembersSectionContent {...props} />;
}

export function OrganizationMembersSectionSkeleton() {
  return <MembersTableSkeleton />;
}
