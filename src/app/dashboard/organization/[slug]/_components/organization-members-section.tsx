import { getAllMembers } from "@/services/db/member/member-cached-service";
import type { TblMemberFindAll } from "@/services/db/member/types/member.type";
import type { Member } from "@/services/db/schema";
import MembersTable from "./members-table";
import { MembersTableSkeleton } from "./skeleton/members-table-skeleton";

type OrganizationMembersSectionProps = {
  organizationId: string;
};

async function OrganizationMembersSectionContent({
  organizationId,
}: OrganizationMembersSectionProps) {
  const rawMembers = await getAllMembers(organizationId);

  const members: Member[] = rawMembers.map((m: TblMemberFindAll) => ({
    id: m.id.toString(),
    organizationId,
    userId: m.id.toString(),
    role: m.role,
    createdAt: m.createdAt,
    updatedAt: new Date(),
    user: {
      id: m.id.toString(),
      name: m.name,
      email: m.email,
      image: m.image,
      emailVerified: true,
      createdAt: m.createdAt,
      updatedAt: new Date(),
      twoFactorEnabled: false,
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
