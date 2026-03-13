import { existsSync } from "node:fs";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createLogger } from "@/core/logger";
import { auth } from "@/lib/auth/auth";
import OrganizationMetaService from "@/services/organization-meta/organization-meta.service";

const logger = createLogger("upload-image");

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const VALID_IMAGE_KEYS = [
  "image1",
  "image2",
  "image3",
  "image4",
  "image5",
] as const;

function getExtensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mime] || "jpg";
}

async function removeExistingFileForKey(
  dirPath: string,
  imageKey: string,
): Promise<void> {
  if (!existsSync(dirPath)) return;

  const files = await readdir(dirPath);
  for (const file of files) {
    if (file.startsWith(`${imageKey}.`)) {
      await rm(join(dirPath, file));
    }
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const organizationId = formData.get("organizationId") as string | null;
    const imageKey = formData.get("imageKey") as string | null;

    if (!file || !organizationId || !imageKey) {
      return NextResponse.json(
        { error: "Campos obrigatórios: file, organizationId, imageKey" },
        { status: 400 },
      );
    }

    if (
      !VALID_IMAGE_KEYS.includes(imageKey as (typeof VALID_IMAGE_KEYS)[number])
    ) {
      return NextResponse.json({ error: "imageKey inválida" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Limite: 1MB" },
        { status: 400 },
      );
    }

    const dirPath = join(
      process.cwd(),
      "public",
      "upload",
      "image",
      organizationId,
    );
    await mkdir(dirPath, { recursive: true });

    await removeExistingFileForKey(dirPath, imageKey);

    const extension = getExtensionFromMime(file.type);
    const fileName = `${imageKey}.${extension}`;
    const filePath = join(dirPath, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length === 0) {
      logger.error("Buffer vazio após conversão do arquivo", {
        organizationId,
        imageKey,
        originalSize: file.size,
      });
      return NextResponse.json(
        { error: "Erro ao processar arquivo" },
        { status: 500 },
      );
    }

    await writeFile(filePath, buffer);

    const fileStats = await stat(filePath);
    if (!fileStats.isFile() || fileStats.size !== buffer.length) {
      logger.error("Verificação do arquivo falhou após escrita", {
        filePath,
        expectedSize: buffer.length,
        actualSize: fileStats.size,
        isFile: fileStats.isFile(),
      });
      return NextResponse.json(
        { error: "Erro ao salvar arquivo" },
        { status: 500 },
      );
    }

    logger.info("Arquivo salvo com sucesso", {
      organizationId,
      imageKey,
      filePath,
      size: fileStats.size,
    });

    const imageUrl = `/api/upload/image/${organizationId}/${fileName}`;

    const existing = await OrganizationMetaService.findOrganizationMetaByKey({
      organizationId,
      metaKey: imageKey,
    });

    if (existing.success && existing.data) {
      await OrganizationMetaService.updateOrganizationMeta({
        organizationId,
        metaKey: imageKey,
        metaValue: imageUrl,
      });
    } else {
      await OrganizationMetaService.createOrganizationMeta({
        organizationId,
        metaKey: imageKey,
        metaValue: imageUrl,
      });
    }

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    const e = error as Error;
    logger.error("Erro no upload de imagem", {
      error: e.message,
      stack: e.stack,
    });
    return NextResponse.json(
      { error: e.message || "Erro ao fazer upload" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { organizationId, imageKey } = body;

    if (!organizationId || !imageKey) {
      return NextResponse.json(
        { error: "Campos obrigatórios: organizationId, imageKey" },
        { status: 400 },
      );
    }

    if (
      !VALID_IMAGE_KEYS.includes(imageKey as (typeof VALID_IMAGE_KEYS)[number])
    ) {
      return NextResponse.json({ error: "imageKey inválida" }, { status: 400 });
    }

    const dirPath = join(
      process.cwd(),
      "public",
      "upload",
      "image",
      organizationId,
    );
    await removeExistingFileForKey(dirPath, imageKey);

    await OrganizationMetaService.deleteOrganizationMeta({
      organizationId,
      metaKey: imageKey,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json(
      { error: e.message || "Erro ao excluir imagem" },
      { status: 500 },
    );
  }
}
