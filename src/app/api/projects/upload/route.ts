import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();
  const projectName = (formData.get("projectName") as string) || "unnamed";
  const files = formData.getAll("photos") as File[];

  const uploadPath = path.join(process.cwd(), "public", "projects", projectName);
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

  const uploadedFiles: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(uploadPath, file.name);
    fs.writeFileSync(filePath, buffer);
    uploadedFiles.push(`/projects/${projectName}/${file.name}`);
  }

  return NextResponse.json(uploadedFiles);
}
