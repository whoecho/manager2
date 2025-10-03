// app/api/defects/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const defects = await prisma.defect.findMany({ include: { project: true } });
  return Response.json(
    defects.map((d) => ({ ...d, projectName: d.project?.name ?? "" }))
  );
}
