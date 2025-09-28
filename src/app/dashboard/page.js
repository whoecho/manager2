"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { projectsStore } from "@/stores/projectsStore";
import { List, Pencil, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
const Logs = observer(() => {
  const store = projectsStore;

  return (
    <div className="font-sans p-6 space-y-6">
      <div className="flex gap-6">
        <Link href="/projects">Проекты</Link>

        <Link href="/defects">Дефекты</Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            Журнал изменений
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!store.logs || store.logs.length === 0 ? (
            <div className="text-gray-500">Изменений пока нет</div>
          ) : (
            store.logs.map((log) => (
              <div
                key={log.id}
                className="p-3 border rounded-lg flex items-start gap-3 hover:bg-gray-50"
              >
                {log.action === "Добавление" && (
                  <Plus className="w-5 h-5 text-green-600 mt-1" />
                )}
                {log.action === "Изменение" && (
                  <Pencil className="w-5 h-5 text-blue-600 mt-1" />
                )}
                {log.action === "Удаление" && (
                  <Trash2 className="w-5 h-5 text-red-600 mt-1" />
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{log.entity}</Badge>
                    <span className="text-xs text-gray-500">{log.time}</span>
                  </div>
                  <div className="text-sm mt-1">{log.message}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
});

export default Logs;
