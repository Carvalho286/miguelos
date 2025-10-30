import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/projects.json");

export const dynamic = "force-dynamic";

// ADD new project
export async function POST(req: Request) {
  const newProject = await req.json();
  const raw = fs.readFileSync(filePath, "utf-8");
  const projects = JSON.parse(raw);

  projects.push(newProject);
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));

  return NextResponse.json(projects);
}

// UPDATE existing project
export async function PUT(req: Request) {
  const updatedProject = await req.json();
  const raw = fs.readFileSync(filePath, "utf-8");
  const projects = JSON.parse(raw);

  const index = projects.findIndex((p: any) => p.name === updatedProject.name);
  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  projects[index] = { ...projects[index], ...updatedProject };
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));

  return NextResponse.json(projects);
}

// DELETE project
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  const raw = fs.readFileSync(filePath, "utf-8");
  const projects = JSON.parse(raw);
  const updated = projects.filter((p: any) => p.name !== name);

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}
