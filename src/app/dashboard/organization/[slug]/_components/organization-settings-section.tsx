import { getOrganizationMetaByOrganizationId } from "@/services/organization-meta/organization-meta-cached-service";
import { OrganizationSettingsCards } from "./organization-settings-card";
import { VALID_SETTINGS_META_KEYS } from "./organization-settings-config";
import { OrganizationSettingsSectionSkeleton } from "./skeleton/organization-settings-section-skeleton";

type OrganizationSettingsSectionProps = {
  organizationId: string;
};

async function OrganizationSettingsSectionContent({
  organizationId,
}: OrganizationSettingsSectionProps) {
  const allMeta = await getOrganizationMetaByOrganizationId(organizationId);

  const values: Record<string, string> = {};
  for (const meta of allMeta) {
    if (
      VALID_SETTINGS_META_KEYS.includes(meta.metaKey) &&
      meta.metaValue != null
    ) {
      values[meta.metaKey] = meta.metaValue;
    }
  }

  return (
    <OrganizationSettingsCards
      values={values}
      organizationId={organizationId}
    />
  );
}

export function OrganizationSettingsSection(
  props: OrganizationSettingsSectionProps,
) {
  return <OrganizationSettingsSectionContent {...props} />;
}

export { OrganizationSettingsSectionSkeleton };
