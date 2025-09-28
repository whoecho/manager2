// app/api/projects/[id]/defects/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const projectId = params.id;
  const d = await req.json();
  const defect = await prisma.defect.create({
    data: {
      title: d.title,
      description: d.description,
      priority: d.priority,
      assignee: d.assignee,
      deadline: d.deadline ? new Date(d.deadline) : new Date(),
      attachments: d.attachments ?? [],
      status: d.status ?? "Новая",
      cost: d.cost ?? 0,
      projectId,
    },
  });
  return Response.json(defect);
}
