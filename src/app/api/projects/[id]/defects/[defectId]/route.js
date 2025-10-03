// app/api/projects/[id]/defects/[defectId]/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  const { defectId } = params;
  const { field, value } = await req.json();
  const updated = await prisma.defect.update({
    where: { id: defectId },
    data: { [field]: field === "deadline" ? new Date(value) : value },
  });
  return Response.json(updated);
}

export async function DELETE(_req, { params }) {
  const { defectId } = params;
  await prisma.defect.delete({ where: { id: defectId } });
  return new Response(null, { status: 204 });
}
