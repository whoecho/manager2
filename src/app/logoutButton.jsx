"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button
      variant="destructive"
      onClick={() => signOut({ callbackUrl: "/" })} // куда редиректнуть после выхода
      className="flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      Выйти
    </Button>
  );
}
