"use client";

import { Check, Loader2, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { upsertOrganizationMetaAction } from "../../action/actions";
import {
  type CardDefinition,
  type FieldDefinition,
  SETTINGS_CARDS,
} from "./organization-settings-config";

type InlineEditableFieldProps = {
  field: FieldDefinition;
  value: string;
  organizationId: string;
};

function InlineEditableField({
  field,
  value,
  organizationId,
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const Icon = field.icon;

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await upsertOrganizationMetaAction(
        organizationId,
        field.metaKey,
        currentValue,
      );
      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro inesperado ao salvar configuração.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentValue(value);
  };

  const displayValue = () => {
    if (!value) return "—";
    if (field.type === "select" && field.options) {
      const opt = field.options.find((o) => o.value === value);
      return opt ? opt.label : value;
    }
    return value;
  };

  const renderEditInput = () => {
    if (field.type === "select" && field.options) {
      return (
        <Select
          value={currentValue}
          onValueChange={(val) => {
            setCurrentValue(val);
          }}
          disabled={isLoading}
        >
          <SelectTrigger className="h-8 text-sm flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          disabled={isLoading}
          className="text-sm min-h-20"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Escape") handleCancel();
          }}
        />
      );
    }

    return (
      <Input
        type={field.type === "email" ? "email" : "text"}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        disabled={isLoading}
        className="h-8 text-sm flex-1"
        autoFocus
        inputMode={field.type === "digits" ? "numeric" : undefined}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
      />
    );
  };

  return (
    <div
      className={`flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors relative group min-h-20 justify-center ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
    >
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
        <Icon className="h-3.5 w-3.5" /> {field.label}
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 hover:bg-background rounded-md"
            aria-label={`Editar ${field.label}`}
          >
            <Pencil className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </span>
      {isEditing ? (
        <div
          className={`flex ${field.type === "textarea" ? "flex-col" : "items-center"} gap-1 mt-1`}
        >
          {renderEditInput()}
          <div
            className={`flex ${field.type === "textarea" ? "justify-end" : ""} gap-1`}
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 hover:bg-green-100/50 hover:text-green-600"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 hover:bg-red-100/50 hover:text-red-600"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="font-semibold text-lg leading-tight truncate focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded w-full text-left hover:bg-accent hover:text-accent-foreground transition-colors px-1 -ml-1"
          title={value || ""}
          onClick={() => setIsEditing(true)}
        >
          {displayValue()}
        </button>
      )}
    </div>
  );
}

type OrganizationSettingsCardProps = {
  card: CardDefinition;
  values: Record<string, string>;
  organizationId: string;
};

export function OrganizationSettingsCard({
  card,
  values,
  organizationId,
}: OrganizationSettingsCardProps) {
  const CardIcon = card.cardIcon;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CardIcon className="h-5 w-5 text-primary" />
          <CardTitle>{card.cardTitle}</CardTitle>
        </div>
        <CardDescription>{card.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        {card.fields.map((field) => (
          <InlineEditableField
            key={field.metaKey}
            field={field}
            value={values[field.metaKey] || ""}
            organizationId={organizationId}
          />
        ))}
      </CardContent>
    </Card>
  );
}

type OrganizationSettingsCardsProps = {
  values: Record<string, string>;
  organizationId: string;
};

export function OrganizationSettingsCards({
  values,
  organizationId,
}: OrganizationSettingsCardsProps) {
  return (
    <div className="space-y-6">
      {SETTINGS_CARDS.map((card) => (
        <OrganizationSettingsCard
          key={card.cardTitle}
          card={card}
          values={values}
          organizationId={organizationId}
        />
      ))}
    </div>
  );
}
