import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export const dynamic = "force-dynamic";

// GET all projects
export async function GET() {
  await connectDB();
  const projects = await Project.find().lean();
  return NextResponse.json(projects);
}

// ADD new project
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.name || !data.github) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const exists = await Project.findOne({ name: data.name });
    if (exists) {
      return NextResponse.json({ error: "Project already exists" }, { status: 400 });
    }

    await Project.create(data);
    const projects = await Project.find().lean();
    return NextResponse.json(projects);
  } catch (err: any) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE existing project
export async function PUT(req: Request) {
  try {
    await connectDB();
    const updated = await req.json();

    const project = await Project.findOneAndUpdate(
      { name: updated.name },
      updated,
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projects = await Project.find().lean();
    return NextResponse.json(projects);
  } catch (err: any) {
    console.error("PUT /api/projects error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}


// DELETE project
export async function DELETE(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const name = url.searchParams.get("name");

  if (!name)
    return NextResponse.json({ error: "Missing name" }, { status: 400 });

  await Project.findOneAndDelete({ name });
  const projects = await Project.find().lean();
  return NextResponse.json(projects);
}
