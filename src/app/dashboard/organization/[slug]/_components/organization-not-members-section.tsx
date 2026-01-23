import { getAllNotMembers } from "@/services/db/member/member-cached-service";
import type { TblMemberNotFindAll } from "@/services/db/member/types/member.type";
import type { User } from "@/services/db/schema";
import NotMembersTable from "./not-members-table";
import { InviteUsersTableSkeleton } from "./skeleton/invite-users-table-skeleton";

type OrganizationNotMembersSectionProps = {
  organizationId: string;
};

async function OrganizationNotMembersSectionContent({
  organizationId,
}: OrganizationNotMembersSectionProps) {
  const rawNotMembers = await getAllNotMembers(organizationId);

  const users: User[] = rawNotMembers.map((u: TblMemberNotFindAll) => ({
    id: u.id.toString(),
    name: u.name,
    email: u.email,
    image: u.image,
    emailVerified: true,
    createdAt: u.createdAt,
    updatedAt: new Date(),
    twoFactorEnabled: false,
  }));

  return <NotMembersTable organizationId={organizationId} users={users} />;
}

export function OrganizationNotMembersSection(
  props: OrganizationNotMembersSectionProps,
) {
  return <OrganizationNotMembersSectionContent {...props} />;
}

export function OrganizationNotMembersSectionSkeleton() {
  return <InviteUsersTableSkeleton />;
}
