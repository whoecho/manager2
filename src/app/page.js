"use client"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [value, setValue]=useState("Менеджер")
  return (
    <div className="font-sans flex flex-col items-center justify-center h-[100dvh]">

<div className="w-[400px] p-4 rounded-lg border h-fit gap-4 flex flex-col items-center justify-center">
  <h1 className="text-4xl">Вход</h1>
      <Input placeholder="email@gmail.com"/>
        <Input placeholder="password"/>
 <div></div><div className="flex gap-2 items-center ml-auto">  <p>Войти как </p>   <DropdownMenu>
      <DropdownMenuTrigger className="border p-2 rounded-sm">
{value}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
      <DropdownMenuItem onClick={()=>setValue("Менеджер")}>
        Войти как менеджер
      </DropdownMenuItem>
      <DropdownMenuItem onClick={()=>setValue("инженер")}>
        Войти как инженер
      </DropdownMenuItem>
      <DropdownMenuItem onClick={()=>setValue("наблюдатель")}>
        Войти как наблюдатель
      </DropdownMenuItem>

      </DropdownMenuContent>
      </DropdownMenu>
 </div>
<Button className="w-full">Войти</Button>

</div>
    </div>
  );
}
