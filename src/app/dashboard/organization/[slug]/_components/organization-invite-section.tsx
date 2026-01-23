import { getAllNotMembers } from "@/services/db/member/member-cached-service";
import type { TblMemberNotFindAll } from "@/services/db/member/types/member.type";
import type { User } from "@/services/db/schema";
import InviteUsersTable from "./invite-users-table";
import { InviteUsersTableSkeleton } from "./skeleton/invite-users-table-skeleton";

type OrganizationInviteSectionProps = {
  organizationId: string;
};

async function OrganizationInviteSectionContent({
  organizationId,
}: OrganizationInviteSectionProps) {
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

  return <InviteUsersTable organizationId={organizationId} users={users} />;
}

export function OrganizationInviteSection(
  props: OrganizationInviteSectionProps,
) {
  return <OrganizationInviteSectionContent {...props} />;
}

export function OrganizationInviteSectionSkeleton() {
  return <InviteUsersTableSkeleton />;
}
