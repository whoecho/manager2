"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState("Менеджер");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    console.log( email,
    password,
    value,)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role: value,
    });

    if (!res.error) {
      router.push("/projects"); // куда перенаправить после входа
    } else {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center h-[100dvh]">
      <div className="w-[400px] p-4 rounded-lg border h-fit gap-4 flex flex-col items-center justify-center">
        <h1 className="text-4xl">Вход</h1>
        <Input
          placeholder="email@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-2 items-center ml-auto">
          <p>Войти как </p>
          <DropdownMenu>
            <DropdownMenuTrigger className="border p-2 rounded-sm">
              {value}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setValue("Менеджер")}>
                Войти как менеджер
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setValue("Инженер")}>
                Войти как инженер
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setValue("Наблюдатель")}>
                Войти как наблюдатель
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button className="w-full" onClick={handleLogin}>
          Войти
        </Button>
      </div>
    </div>
  );
}
