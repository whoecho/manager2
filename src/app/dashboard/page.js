"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectsStore } from "@/stores/projectsStore";
import { FileDown, List, Pencil, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "../logoutButton";

const Logs = observer(() => {
  const store = projectsStore;
  const session = useSession();
  const router = useRouter();

  if (session.status == "unauthenticated") {
    router.push("/"); // редирект на страницу входа
  }

  useEffect(() => {
    store.fetchLogs();
    store.fetchProjects();
  }, []);

  // 🔥 Генерация статистики
  const buildStats = () => {
    const stats = {
      projectsAdded: 0,
      projectsUpdated: 0,
      projectsDeleted: 0,
      defectsAdded: 0,
      defectsUpdated: 0,
      defectsDeleted: 0,
      defectsByStatus: {},
      totalCost: 0,
    };

    for (const log of store.logs) {
      if (log.entity === "Проект") {
        if (log.action === "Добавление") stats.projectsAdded++;
        if (log.action === "Изменение") stats.projectsUpdated++;
        if (log.action === "Удаление") stats.projectsDeleted++;
      }
      if (log.entity === "Дефект") {
        if (log.action === "Добавление") stats.defectsAdded++;
        if (log.action === "Изменение") stats.defectsUpdated++;
        if (log.action === "Удаление") stats.defectsDeleted++;
      }
    }

    // считаем дефекты по статусам и стоимость
    for (const project of store.projects) {
      for (const defect of project.defects) {
        stats.defectsByStatus[defect.status] =
          (stats.defectsByStatus[defect.status] || 0) + 1;
        stats.totalCost += defect.cost ?? 0;
      }
    }

    return stats;
  };

  // Экспорт статистики в CSV
  const exportReport = () => {
    const stats = buildStats();

    const lines = [
      "Метрика;Значение",
      `Добавлено проектов;${stats.projectsAdded}`,
      `Изменено проектов;${stats.projectsUpdated}`,
      `Удалено проектов;${stats.projectsDeleted}`,
      `Добавлено дефектов;${stats.defectsAdded}`,
      `Изменено дефектов;${stats.defectsUpdated}`,
      `Удалено дефектов;${stats.defectsDeleted}`,
      `Общая стоимость дефектов;${stats.totalCost} ₽`,
      "",
      "Статусы дефектов;",
      ...Object.entries(stats.defectsByStatus).map(
        ([status, count]) => `${status};${count}`
      ),
    ];

    const csvContent = lines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.csv");
    link.click();
  };

  return (
    <div className="font-sans p-6 space-y-6">
      <div className="flex items-center gap-6">
        <Link href="/projects">Проекты</Link>
        <Link href="/defects">Дефекты</Link>
        <LogoutButton />
        <div>Вход осуществлен как {session?.data?.user?.role}</div>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            Журнал изменений
          </CardTitle>
          <Button onClick={exportReport}>
            <FileDown className="w-4 h-4 mr-2" /> Экспорт отчёта
          </Button>
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
