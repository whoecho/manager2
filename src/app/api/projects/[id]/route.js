// app/api/projects/[id]/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(_req, { params }) {
  const id = params.id;
  const { field, value } = await _req.json();
  const project = await prisma.project.update({
    where: { id },
    data: { [field]: value },
    include: { defects: true },
  });
  return Response.json(project);
}

export async function DELETE(_req, { params }) {
  const id = params.id;
  await prisma.defect.deleteMany({ where: { projectId: id } }); // каскад вручную, если нет onDelete
  await prisma.project.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
