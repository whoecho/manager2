// app/projects/page.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projectsStore } from "@/stores/projectsStore";
import { Hammer, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LogoutButton from "../logoutButton";

const Projects = observer(() => {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.user?.role;

  if (session.status === "unauthenticated") {
    router.push("/");
  }

  const store = projectsStore;

  const [newProject, setNewProject] = useState({ name: "", status: "В процессе", defects: [] });
  const [newDefect, setNewDefect] = useState({
    title: "",
    description: "",
    priority: "Низкий",
    assignee: "",
    deadline: "",
    attachments: [],
    status: "Новая",
    cost: 0,
  });

  const isManager = role === "Менеджер";
  const isEngineer = role === "Инженер";
  const isViewer = role === "Наблюдатель";

  const addDefectToNew = () => {
    if (!newDefect.title) return;
    setNewProject((p) => ({ ...p, defects: [...p.defects, newDefect] }));
    setNewDefect({
      title: "",
      description: "",
      priority: "Низкий",
      assignee: "",
      deadline: "",
      attachments: [],
      status: "Новая",
      cost: 0,
    });
  };

  const addProject = async () => {
    if (!newProject.name) return;
    await store.addProject(newProject);
    setNewProject({ name: "", status: "В процессе", defects: [] });
  };

  return (
    <div className="font-sans p-6 space-y-6">
      <div className="flex items-center gap-6">
        {/* Статистика скрыта для инженера */}
        {role !== "Инженер" && <Link href="/dashboard">Статистика</Link>}
        <Link href="/defects">Дефекты</Link>
        <LogoutButton />
        <div>Вход осуществлен как {role}</div>
      </div>

      {/* Добавление проекта (только Менеджер) */}
      {isManager && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Добавить проект
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название проекта"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <Select value={newProject.status} onValueChange={(val) => setNewProject({ ...newProject, status: val })}>
              <SelectTrigger><SelectValue placeholder="Статус" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="В процессе">В процессе</SelectItem>
                <SelectItem value="Завершён">Завершён</SelectItem>
                <SelectItem value="Приостановлен">Приостановлен</SelectItem>
              </SelectContent>
            </Select>

            {/* дефект для нового проекта */}
            <Input placeholder="Заголовок дефекта" value={newDefect.title} onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })} />
            <Textarea placeholder="Описание" value={newDefect.description} onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })} />
            <div className="flex gap-2">
              <Select value={newDefect.priority} onValueChange={(val) => setNewDefect({ ...newDefect, priority: val })}>
                <SelectTrigger><SelectValue placeholder="Приоритет" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Низкий">Низкий</SelectItem>
                  <SelectItem value="Средний">Средний</SelectItem>
                  <SelectItem value="Высокий">Высокий</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Исполнитель" value={newDefect.assignee} onChange={(e) => setNewDefect({ ...newDefect, assignee: e.target.value })} />
            </div>
            <Input type="date" value={newDefect.deadline} onChange={(e) => setNewDefect({ ...newDefect, deadline: e.target.value })} />
            <div className="flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              <Input type="number" placeholder="Стоимость (₽)" value={newDefect.cost} onChange={(e) => setNewDefect({ ...newDefect, cost: +e.target.value })} />
            </div>
            <Select value={newDefect.status} onValueChange={(val) => setNewDefect({ ...newDefect, status: val })}>
              <SelectTrigger><SelectValue placeholder="Статус дефекта" /></SelectTrigger>
              <SelectContent>
                {store.defectStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button onClick={addDefectToNew}><Plus className="w-4 h-4 mr-2" /> Добавить дефект</Button>
          </CardContent>
          <CardFooter>
            <Button onClick={addProject}><Plus className="w-4 h-4 mr-2" /> Добавить проект</Button>
          </CardFooter>
        </Card>
      )}

      {/* список проектов */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {store.projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <Input
                value={project.name}
                onChange={(e) => store.updateProject(project.id, "name", e.target.value)}
                disabled={!isManager} // только менеджер может менять название
              />
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={project.status}
                onValueChange={(val) => store.updateProject(project.id, "status", val)}
                disabled={!isManager}
              >
                <SelectTrigger><SelectValue placeholder="Статус" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="В процессе">В процессе</SelectItem>
                  <SelectItem value="Завершён">Завершён</SelectItem>
                  <SelectItem value="Приостановлен">Приостановлен</SelectItem>
                </SelectContent>
              </Select>

              {project.defects.map((defect) => (
                <Card key={defect.id} className="p-3 space-y-2 bg-gray-50">
                  <Input
                    value={defect.title}
                    onChange={(e) => store.updateDefect(project.id, defect.id, "title", e.target.value)}
                    disabled={isViewer}
                  />
                  <Textarea
                    value={defect.description}
                    onChange={(e) => store.updateDefect(project.id, defect.id, "description", e.target.value)}
                    disabled={isViewer}
                  />
                  <div className="flex gap-2">
                    <Select
                      value={defect.priority}
                      onValueChange={(val) => store.updateDefect(project.id, defect.id, "priority", val)}
                      disabled={isViewer}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Низкий">Низкий</SelectItem>
                        <SelectItem value="Средний">Средний</SelectItem>
                        <SelectItem value="Высокий">Высокий</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={defect.assignee}
                      onChange={(e) => store.updateDefect(project.id, defect.id, "assignee", e.target.value)}
                      placeholder="Исполнитель"
                      disabled={isViewer}
                    />
                  </div>
                  <Input
                    type="date"
                    value={defect.deadline?.slice(0, 10) ?? ""}
                    onChange={(e) => store.updateDefect(project.id, defect.id, "deadline", e.target.value)}
                    disabled={isViewer}
                  />
                  <div className="flex items-center gap-2">
                    <Hammer className="w-4 h-4" />
                    <Input
                      type="number"
                      value={defect.cost ?? 0}
                      onChange={(e) => store.updateDefect(project.id, defect.id, "cost", +e.target.value)}
                      placeholder="Стоимость (₽)"
                      disabled={isViewer}
                    />
                  </div>
                  <Select
                    value={defect.status}
                    onValueChange={(val) => store.updateDefect(project.id, defect.id, "status", val)}
                    disabled={isViewer}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {store.defectStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  {/* Кнопка удаления дефекта только для Менеджера */}
                  {isManager && (
                    <Button variant="destructive" size="sm" onClick={() => store.deleteDefect(project.id, defect.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Удалить дефект
                    </Button>
                  )}
                </Card>
              ))}
            </CardContent>
            <CardFooter>
              {/* Удаление проекта только для Менеджера */}
              {isManager && (
                <Button variant="destructive" onClick={() => store.deleteProject(project.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Удалить проект
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default Projects;
