import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();
  const projectName = (formData.get("projectName") as string) || "unnamed";
  const files = formData.getAll("photos") as File[];

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const blob = await put(`projects/${projectName}/${file.name}`, file, {
      access: "public",
    });
    uploadedUrls.push(blob.url);
  }

  return NextResponse.json(uploadedUrls);
}
