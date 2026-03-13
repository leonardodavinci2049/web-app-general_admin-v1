"use client";

import { Check, Copy, ImagePlus, Loader2, Replace, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { envs } from "@/core/config/envs";
import { cn } from "@/lib/utils";

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [isPending, startTransition] = useTransition();

  const appUrl = envs.NEXT_PUBLIC_APP_URL || window.location.origin;

  const uploadedCount = IMAGE_KEYS.filter((k) => localImages[k]).length;

  function handleUploadClick(imageKey: string) {
    fileInputRefs.current[imageKey]?.click();
  }

  function handleCopyUrl(imageKey: string) {
    const url = localImages[imageKey];
    if (!url) return;
    navigator.clipboard.writeText(`${appUrl}${normalizeUrl(url)}`);
    setCopiedKey(imageKey);
    toast.success("URL copiada para a área de transferência");
    setTimeout(() => setCopiedKey(null), 2000);
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
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs tabular-nums">
            {uploadedCount} / {IMAGE_KEYS.length}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Formatos aceitos: JPEG, PNG, WebP, GIF — máx. 1 MB por imagem
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {IMAGE_KEYS.map((imageKey, index) => {
            const url = localImages[imageKey];
            const isLoading = loadingKeys.has(imageKey);

            return (
              <div key={imageKey} className="group relative">
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

                {url ? (
                  <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                      {/* biome-ignore lint/performance/noImgElement: static files served from public/ */}
                      <img
                        src={normalizeUrl(url)}
                        alt={`Imagem ${index + 1}`}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent sm:opacity-0 transition-opacity duration-200 sm:group-hover:opacity-100" />

                      <Badge
                        variant="secondary"
                        className="absolute top-2.5 left-2.5 text-xs bg-background/80 backdrop-blur-sm"
                      >
                        Imagem {index + 1}
                      </Badge>

                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      )}

                      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 p-3 sm:opacity-0 sm:translate-y-1 transition-all duration-200 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background"
                              disabled={isLoading || isPending}
                              onClick={() => handleCopyUrl(imageKey)}
                            >
                              {copiedKey === imageKey ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copiar URL</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background"
                              disabled={isLoading || isPending}
                              onClick={() => handleUploadClick(imageKey)}
                            >
                              <Replace className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Substituir imagem</TooltipContent>
                        </Tooltip>

                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:bg-destructive hover:text-white"
                                  disabled={isLoading || isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Excluir imagem</TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Excluir imagem
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta imagem? Esta
                                ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(imageKey)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isLoading || isPending}
                    onClick={() => handleUploadClick(imageKey)}
                    className={cn(
                      "relative flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed",
                      "bg-muted/30 transition-all duration-200",
                      "hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <ImagePlus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            Imagem {index + 1}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Clique para enviar
                          </p>
                        </div>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
