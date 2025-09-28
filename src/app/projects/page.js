"use client"

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      name: "ЖК ПИК",
      status: "В процессе",
      defects: [
        {
          title: "Течет крыша",
          description: "Протечка в подъезде №3",
          priority: "Высокий",
          assignee: "Иванов",
          deadline: "2025-10-01",
          attachments: [],
          status: "Новая",
        },
      ],
    },
  ]);

  const [newProject, setNewProject] = useState({
    name: "",
    status: "В процессе",
    defects: [],
  });

  const [newDefect, setNewDefect] = useState({
    title: "",
    description: "",
    priority: "Низкий",
    assignee: "",
    deadline: "",
    attachments: [],
    status: "Новая",
  });

  const defectStatuses = [
    "Новая",
    "В работе",
    "На проверке",
    "Закрыта",
    "Отменена",
  ];

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const deleteProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addDefectToNew = () => {
    if (!newDefect.title) return;
    setNewProject({
      ...newProject,
      defects: [...newProject.defects, newDefect],
    });
    setNewDefect({
      title: "",
      description: "",
      priority: "Низкий",
      assignee: "",
      deadline: "",
      attachments: [],
      status: "Новая",
    });
  };

  const addProject = () => {
    if (!newProject.name) return;
    setProjects([...projects, newProject]);
    setNewProject({ name: "", status: "В процессе", defects: [] });
  };

  const updateDefect = (
    projectIndex,
    defectIndex,
    field,
    value
  ) => {
    const updated = [...projects];
    updated[projectIndex].defects[defectIndex][field] = value;
    setProjects(updated);
  };

  const deleteDefect = (projectIndex, defectIndex) => {
    const updated = [...projects];
    updated[projectIndex].defects = updated[projectIndex].defects.filter(
      (_, i) => i !== defectIndex
    );
    setProjects(updated);
  };

  return (
    <div className="font-sans p-6 space-y-6">
      {/* Навигация */}
      <div className="flex gap-6">
        <Link href="/">Проекты</Link>
        <Link href="/">Статистика</Link>
        <Link href="/defects">Дефекты</Link>
      </div>

      {/* Добавление проекта */}
      <Card>
        <CardHeader>
          <CardTitle>Добавить проект</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Название проекта"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <Select
            value={newProject.status}
            onValueChange={(val) => setNewProject({ ...newProject, status: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="В процессе">В процессе</SelectItem>
              <SelectItem value="Завершён">Завершён</SelectItem>
              <SelectItem value="Приостановлен">Приостановлен</SelectItem>
            </SelectContent>
          </Select>

          {/* Дефекты */}
          <Input
            placeholder="Заголовок дефекта"
            value={newDefect.title}
            onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })}
          />
          <Textarea
            placeholder="Описание"
            value={newDefect.description}
            onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
          />
          <div className="flex gap-2">
            <Select
              value={newDefect.priority}
              onValueChange={(val) => setNewDefect({ ...newDefect, priority: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Приоритет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Низкий">Низкий</SelectItem>
                <SelectItem value="Средний">Средний</SelectItem>
                <SelectItem value="Высокий">Высокий</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Исполнитель"
              value={newDefect.assignee}
              onChange={(e) => setNewDefect({ ...newDefect, assignee: e.target.value })}
            />
          </div>
          <Input
            type="date"
            value={newDefect.deadline}
            onChange={(e) => setNewDefect({ ...newDefect, deadline: e.target.value })}
          />
          <Select
            value={newDefect.status}
            onValueChange={(val) => setNewDefect({ ...newDefect, status: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Статус дефекта" />
            </SelectTrigger>
            <SelectContent>
              {defectStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="default" onClick={addDefectToNew}>
            Добавить дефект
          </Button>

          <div className="text-sm text-gray-600">
            {newProject.defects.map((d, idx) => (
              <div key={idx}>
                {d.title} — {d.status}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addProject}>Добавить проект</Button>
        </CardFooter>
      </Card>

      {/* Список проектов */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Card key={i}>
            <CardHeader>
              <Input
                value={project.name}
                onChange={(e) => updateProject(i, "name", e.target.value)}
              />
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={project.status}
                onValueChange={(val) => updateProject(i, "status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="В процессе">В процессе</SelectItem>
                  <SelectItem value="Завершён">Завершён</SelectItem>
                  <SelectItem value="Приостановлен">Приостановлен</SelectItem>
                </SelectContent>
              </Select>

              {project.defects.map((defect, j) => (
                <Card key={j} className="p-3 space-y-2 bg-gray-50">
                  <Input
                    value={defect.title}
                    onChange={(e) => updateDefect(i, j, "title", e.target.value)}
                  />
                  <Textarea
                    value={defect.description}
                    onChange={(e) =>
                      updateDefect(i, j, "description", e.target.value)
                    }
                  />
                  <div className="flex gap-2">
                    <Select
                      value={defect.priority}
                      onValueChange={(val) =>
                        updateDefect(i, j, "priority", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Низкий">Низкий</SelectItem>
                        <SelectItem value="Средний">Средний</SelectItem>
                        <SelectItem value="Высокий">Высокий</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={defect.assignee}
                      onChange={(e) =>
                        updateDefect(i, j, "assignee", e.target.value)
                      }
                      placeholder="Исполнитель"
                    />
                  </div>
                  <Input
                    type="date"
                    value={defect.deadline}
                    onChange={(e) =>
                      updateDefect(i, j, "deadline", e.target.value)
                    }
                  />
                  <Select
                    value={defect.status}
                    onValueChange={(val) =>
                      updateDefect(i, j, "status", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {defectStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteDefect(i, j)}
                  >
                    Удалить дефект
                  </Button>
                </Card>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => deleteProject(i)}>
                Удалить проект
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
