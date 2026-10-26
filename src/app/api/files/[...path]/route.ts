import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import { join, normalize } from "path";
import { getUploadDir } from "@/lib/utils";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

/**
 * Serves files from the upload directory.
 *
 * Needed when UPLOAD_DIR points outside `public/` (e.g. a Liara disk mounted at
 * /data). On Netlify the files live in public/uploads and are served by the CDN
 * directly, but this route works there too.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Reject traversal: no "..", no absolute paths, no null bytes
  const joined = segments.join("/");
  if (joined.includes("..") || joined.includes("\0") || joined.startsWith("/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const dir = getUploadDir();
  const filePath = normalize(join(dir, joined));
  if (!filePath.startsWith(normalize(dir))) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  const size = statSync(filePath).size;
  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;

  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
