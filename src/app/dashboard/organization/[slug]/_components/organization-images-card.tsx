"use client";

import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteOrganizationImageAction,
  uploadOrganizationImageAction,
} from "@/app/dashboard/organization/action/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { envs } from "@/core/config/envs";

const IMAGE_KEYS = ["image1", "image2", "image3", "image4", "image5"] as const;

type OrganizationImagesCardProps = {
  organizationId: string;
  images: Record<string, string>;
};

function normalizeUrl(url: string): string {
  if (url.startsWith("http")) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  }
  return url;
}

export function OrganizationImagesCard({
  organizationId,
  images,
}: OrganizationImagesCardProps) {
  const [localImages, setLocalImages] = useState(() => {
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(images)) {
      normalized[key] = normalizeUrl(value);
    }
    return normalized;
  });
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [isPending, startTransition] = useTransition();

  const appUrl = envs.NEXT_PUBLIC_APP_URL || window.location.origin;

  function handleUploadClick(imageKey: string) {
    fileInputRefs.current[imageKey]?.click();
  }

  function handleFileChange(imageKey: string, file: File | undefined) {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error(
        "A imagem ultrapassou o limite máximo de 1MB. Reduza o tamanho e tente novamente.",
      );
      return;
    }

    setLoadingKeys((prev) => new Set(prev).add(imageKey));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("organizationId", organizationId);
    formData.append("imageKey", imageKey);

    startTransition(async () => {
      try {
        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        setLoadingKeys((prev) => {
          const next = new Set(prev);
          next.delete(imageKey);
          return next;
        });

        if (response.ok && result.success) {
          setLocalImages((prev) => ({
            ...prev,
            [imageKey]: result.url,
          }));
          await uploadOrganizationImageAction(organizationId);
          toast.success("Imagem enviada com sucesso");
        } else {
          toast.error(result.error || "Erro ao fazer upload");
        }
      } catch {
        setLoadingKeys((prev) => {
          const next = new Set(prev);
          next.delete(imageKey);
          return next;
        });
        toast.error("Erro ao fazer upload");
      }
    });
  }

  function handleDelete(imageKey: string) {
    setLoadingKeys((prev) => new Set(prev).add(imageKey));

    startTransition(async () => {
      const result = await deleteOrganizationImageAction(
        organizationId,
        imageKey,
      );

      setLoadingKeys((prev) => {
        const next = new Set(prev);
        next.delete(imageKey);
        return next;
      });

      if (result.success) {
        setLocalImages((prev) => {
          const next = { ...prev };
          delete next[imageKey];
          return next;
        });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagens</CardTitle>
        <CardDescription>
          Gerenciar as imagens da organização. Máximo de 5 imagens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {IMAGE_KEYS.map((imageKey, index) => {
          const url = localImages[imageKey];
          const isLoading = loadingKeys.has(imageKey);

          return (
            <div key={imageKey} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border bg-muted">
                {url ? (
                  // biome-ignore lint/performance/noImgElement: static files served from public/
                  <img
                    src={normalizeUrl(url)}
                    alt={`Imagem ${index + 1}`}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <Input
                readOnly
                value={url ? `${appUrl}${normalizeUrl(url)}` : ""}
                placeholder={`Imagem ${index + 1} — nenhuma imagem`}
                className="flex-1"
              />

              <input
                ref={(el) => {
                  fileInputRefs.current[imageKey] = el;
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(imageKey, e.target.files?.[0])
                }
              />

              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || isPending}
                onClick={() => handleUploadClick(imageKey)}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="ml-1.5 hidden sm:inline">Upload</span>
              </Button>

              {url && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isLoading || isPending}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir imagem</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta imagem? Esta ação
                        não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(imageKey)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
