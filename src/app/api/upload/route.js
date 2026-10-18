
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { message: "لطفاً یک عکس انتخاب کن." },
        { status: 400 }
      );
    }

    const allowedTypes = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };

    if (!allowedTypes[file.type]) {
      return NextResponse.json(
        { message: "فرمت عکس باید JPG، PNG یا WEBP باشد." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "حجم عکس باید کمتر از ۵ مگابایت باشد." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${randomUUID()}${allowedTypes[file.type]}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, bytes);

    return NextResponse.json({
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { message: "ذخیره عکس انجام نشد." },
      { status: 500 }
    );
  }
}
