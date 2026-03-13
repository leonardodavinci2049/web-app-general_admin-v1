import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { type NextRequest, NextResponse } from "next/server";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

type Params = Promise<{ path: string[] }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const segments = (await params).path;

  if (segments.length !== 2) {
    return NextResponse.json(
      { error: "Not found" },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const [organizationId, fileName] = segments;

  const safeOrgId = organizationId.replace(/[^a-zA-Z0-9_-]/g, "");
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "");

  if (safeOrgId !== organizationId || safeFileName !== fileName) {
    return NextResponse.json(
      { error: "Invalid path" },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const filePath = join(
    process.cwd(),
    "public",
    "upload",
    "image",
    safeOrgId,
    safeFileName,
  );

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: "Not found" },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const ext = safeFileName.split(".").pop()?.toLowerCase() || "";
  const contentType = MIME_TYPES[ext];

  if (!contentType) {
    return NextResponse.json(
      { error: "Unsupported format" },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const buffer = await readFile(filePath);
  const stats = statSync(filePath);
  const etag = `"${stats.mtime.getTime().toString(16)}-${stats.size.toString(16)}"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "no-cache",
      },
    });
  }

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": buffer.length.toString(),
      ETag: etag,
      "Cache-Control": "no-cache",
    },
  });
}
