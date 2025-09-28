import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    // Проверяем, есть ли уже юзер
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // Хэшируем пароль
    const hashedPassword = await hash(password, 10);

    // Создаём юзера
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return new Response(JSON.stringify({ id: user.id, email: user.email, role: user.role }), {
      status: 201,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
