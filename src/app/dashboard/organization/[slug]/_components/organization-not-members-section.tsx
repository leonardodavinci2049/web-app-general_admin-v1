import type { User } from "@/database/schema";
import { UserAuthService } from "@/services/user/user.service";
import NotMembersTable from "./not-members-table";
import { InviteUsersTableSkeleton } from "./skeleton/invite-users-table-skeleton";

type OrganizationNotMembersSectionProps = {
  organizationId: string;
};

async function OrganizationNotMembersSectionContent({
  organizationId,
}: OrganizationNotMembersSectionProps) {
  const response = await UserAuthService.findUsersWithoutAnyOrganization();

  const users: User[] = (response.data ?? []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    emailVerified: u.emailVerified,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    twoFactorEnabled: u.twoFactorEnabled,
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
