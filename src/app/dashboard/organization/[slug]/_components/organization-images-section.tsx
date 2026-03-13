import { getOrganizationMetaByOrganizationId } from "@/services/organization-meta/organization-meta-cached-service";
import { OrganizationImagesCard } from "./organization-images-card";
import { OrganizationImagesSectionSkeleton } from "./skeleton/organization-images-section-skeleton";

type OrganizationImagesSectionProps = {
  organizationId: string;
};

async function OrganizationImagesSectionContent({
  organizationId,
}: OrganizationImagesSectionProps) {
  const allMeta = await getOrganizationMetaByOrganizationId(organizationId);

  const images: Record<string, string> = {};
  for (const meta of allMeta) {
    if (meta.metaKey.startsWith("image") && meta.metaValue) {
      images[meta.metaKey] = meta.metaValue;
    }
  }

  return (
    <OrganizationImagesCard organizationId={organizationId} images={images} />
  );
}

export function OrganizationImagesSection(
  props: OrganizationImagesSectionProps,
) {
  return <OrganizationImagesSectionContent {...props} />;
}

export { OrganizationImagesSectionSkeleton };
