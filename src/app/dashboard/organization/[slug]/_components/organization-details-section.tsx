import { getOrganizationById } from "@/services/db/organization/organization-cached-service";
import { OrganizationDetailsCard } from "./organization-details-card";
import { OrganizationDetailsCardSkeleton } from "./skeleton/organization-details-card-skeleton";

type OrganizationDetailsSectionProps = {
  userId: string;
  organizationId: string;
};

async function OrganizationDetailsSectionContent({
  userId,
  organizationId,
}: OrganizationDetailsSectionProps) {
  const organizationDetails = await getOrganizationById(userId, organizationId);

  if (!organizationDetails) {
    return null;
  }

  return <OrganizationDetailsCard organization={organizationDetails} />;
}

export function OrganizationDetailsSection(
  props: OrganizationDetailsSectionProps,
) {
  return <OrganizationDetailsSectionContent {...props} />;
}

export function OrganizationDetailsSectionSkeleton() {
  return <OrganizationDetailsCardSkeleton />;
}
