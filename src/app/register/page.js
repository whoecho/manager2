"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Менеджер");
  const router = useRouter();

  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Регистрация успешна! Теперь войдите.");
      router.push("/");
    } else {
      alert("❌ Ошибка: " + data.error);
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center h-[100dvh]">
      <div className="w-[400px] p-4 rounded-lg border flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Регистрация</h1>

        <Input placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Менеджер">Менеджер</SelectItem>
            <SelectItem value="Инженер">Инженер</SelectItem>
            <SelectItem value="Наблюдатель">Наблюдатель</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleRegister}>Зарегистрироваться</Button>
      </div>
    </div>
  );
}
