// app/api/projects/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const projects = await prisma.project.findMany({ include: { defects: true } });
  return Response.json(projects);
}

export async function POST(req) {
  const data = await req.json();
  const project = await prisma.project.create({
    data: {
      name: data.name,
      status: data.status ?? "В процессе",
      defects: data.defects?.length
        ? {
            create: data.defects.map((d) => ({
              title: d.title,
              description: d.description,
              priority: d.priority,
              assignee: d.assignee,
              deadline: d.deadline ? new Date(d.deadline) : new Date(),
              attachments: d.attachments ?? [],
              status: d.status ?? "Новая",
              cost: d.cost ?? 0,
            })),
          }
        : undefined,
    },
    include: { defects: true },
  });
  return Response.json(project);
}
