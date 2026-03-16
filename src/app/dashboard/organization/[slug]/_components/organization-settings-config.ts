import type { LucideIcon } from "lucide-react";
import {
  Building2,
  FileText,
  Globe,
  Info,
  MapPin,
  StickyNote,
} from "lucide-react";

export type FieldType = "text" | "email" | "digits" | "select" | "textarea";

export type FieldDefinition = {
  metaKey: string;
  label: string;
  type: FieldType;
  icon: LucideIcon;
  options?: { value: string; label: string }[];
};

export type CardDefinition = {
  cardTitle: string;
  cardDescription: string;
  cardIcon: LucideIcon;
  fields: FieldDefinition[];
};

export const SETTINGS_CARDS: CardDefinition[] = [
  {
    cardTitle: "Dados Comerciais",
    cardDescription: "Informações comerciais da organização",
    cardIcon: Building2,
    fields: [
      {
        metaKey: "REGISTRATION_TYPE",
        label: "Tipo de Cadastro",
        type: "select",
        icon: Building2,
        options: [
          { value: "1", label: "Pessoa Física" },
          { value: "2", label: "Pessoa Jurídica" },
        ],
      },
      {
        metaKey: "COMMERCIAL_NAME",
        label: "Nome Comercial",
        type: "text",
        icon: Building2,
      },
      {
        metaKey: "PHONE1",
        label: "Telefone 1",
        type: "digits",
        icon: Building2,
      },
      {
        metaKey: "PHONE2",
        label: "Telefone 2",
        type: "digits",
        icon: Building2,
      },
      { metaKey: "EMAIL", label: "E-mail", type: "email", icon: Building2 },
    ],
  },
  {
    cardTitle: "Dados Fiscais",
    cardDescription: "Documentos e inscrições fiscais",
    cardIcon: FileText,
    fields: [
      { metaKey: "CNPJ", label: "CNPJ", type: "digits", icon: FileText },
      { metaKey: "CPF", label: "CPF", type: "digits", icon: FileText },
      {
        metaKey: "INSC_STATE",
        label: "Inscrição Estadual",
        type: "text",
        icon: FileText,
      },
      {
        metaKey: "INSC_MUNICIPAL",
        label: "Inscrição Municipal",
        type: "text",
        icon: FileText,
      },
    ],
  },
  {
    cardTitle: "Endereço",
    cardDescription: "Endereço da organização",
    cardIcon: MapPin,
    fields: [
      { metaKey: "ZIP_CODE", label: "CEP", type: "digits", icon: MapPin },
      { metaKey: "ADDRESS", label: "Endereço", type: "text", icon: MapPin },
      { metaKey: "NUMBER", label: "Número", type: "text", icon: MapPin },
      {
        metaKey: "COMPLEMENT",
        label: "Complemento",
        type: "text",
        icon: MapPin,
      },
      { metaKey: "NEIGHBORHOOD", label: "Bairro", type: "text", icon: MapPin },
      { metaKey: "CITY", label: "Cidade", type: "text", icon: MapPin },
      { metaKey: "STATE", label: "Estado", type: "text", icon: MapPin },
      {
        metaKey: "FULL_ADDRESS",
        label: "Endereço Completo",
        type: "textarea",
        icon: MapPin,
      },
    ],
  },
  {
    cardTitle: "Links e Redes Sociais",
    cardDescription: "Sites e redes sociais da organização",
    cardIcon: Globe,
    fields: [
      { metaKey: "WEBSITE1", label: "Website 1", type: "text", icon: Globe },
      { metaKey: "WEBSITE2", label: "Website 2", type: "text", icon: Globe },
      {
        metaKey: "WHATS_GROUP1",
        label: "Grupo WhatsApp 1",
        type: "text",
        icon: Globe,
      },
      {
        metaKey: "WHATS_GROUP2",
        label: "Grupo WhatsApp 2",
        type: "text",
        icon: Globe,
      },
      { metaKey: "FACEBOOK", label: "Facebook", type: "text", icon: Globe },
      { metaKey: "INSTAGRAM", label: "Instagram", type: "text", icon: Globe },
      { metaKey: "TWITTER", label: "Twitter", type: "text", icon: Globe },
    ],
  },
  {
    cardTitle: "Observações",
    cardDescription: "Notas e observações gerais",
    cardIcon: StickyNote,
    fields: [
      {
        metaKey: "NOTES",
        label: "Observações",
        type: "textarea",
        icon: StickyNote,
      },
    ],
  },
  {
    cardTitle: "Sobre",
    cardDescription: "Descrição da organização",
    cardIcon: Info,
    fields: [
      { metaKey: "ABOUT", label: "Sobre", type: "textarea", icon: Info },
    ],
  },
];

export const VALID_SETTINGS_META_KEYS = SETTINGS_CARDS.flatMap((card) =>
  card.fields.map((f) => f.metaKey),
);

export const META_KEY_CONFIG: Record<
  string,
  { type: FieldType; options?: { value: string; label: string }[] }
> = Object.fromEntries(
  SETTINGS_CARDS.flatMap((card) =>
    card.fields.map((f) => [
      f.metaKey,
      { type: f.type, ...(f.options ? { options: f.options } : {}) },
    ]),
  ),
);
