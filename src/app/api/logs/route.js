import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Получить все логи
export async function GET() {
  const logs = await prisma.log.findMany({
    orderBy: { time: "desc" },
  });
  return Response.json(logs);
}

// Добавить лог
export async function POST(req) {
  const data = await req.json();
  const log = await prisma.log.create({
    data: {
      action: data.action,
      entity: data.entity,
      message: data.message,
    },
  });
  return Response.json(log);
}
