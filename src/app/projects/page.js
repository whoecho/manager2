"use client";

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
import { projectsStore } from "@/stores/projectsStore";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useState } from "react";

// 🔥 Иконки
import { Hammer, Plus, Trash2 } from "lucide-react";

const Projects = observer(() => {
  const store = projectsStore;

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
    cost: 0,
  });

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
      cost: 0,
    });
  };

  const addProject = () => {
    if (!newProject.name) return;
    store.addProject(newProject);
    setNewProject({ name: "", status: "В процессе", defects: [] });
  };

  return (
    <div className="font-sans p-6 space-y-6">
      {/* Навигация */}
      <div className="flex gap-6">

        <Link href="/dashboard">Статистика</Link>
        <Link href="/defects">Дефекты</Link>
      </div>

      {/* Добавление проекта */}
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
          <Input
            type="number"
            placeholder="Стоимость (₽)"
            value={newDefect.cost}
            onChange={(e) => setNewDefect({ ...newDefect, cost: +e.target.value })}
          />
          <Select
            value={newDefect.status}
            onValueChange={(val) => setNewDefect({ ...newDefect, status: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Статус дефекта" />
            </SelectTrigger>
            <SelectContent>
              {store.defectStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addDefectToNew}>
            <Plus className="w-4 h-4 mr-2" /> Добавить дефект
          </Button>
        </CardContent>
        <CardFooter>
          <Button onClick={addProject}>
            <Plus className="w-4 h-4 mr-2" /> Добавить проект
          </Button>
        </CardFooter>
      </Card>

      {/* Список проектов */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {store.projects.map((project, i) => (
          <Card key={project.id}>
            <CardHeader>
              <Input
                value={project.name}
                onChange={(e) => store.updateProject(i, "name", e.target.value)}
              />
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={project.status}
                onValueChange={(val) => store.updateProject(i, "status", val)}
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
                <Card key={defect.id} className="p-3 space-y-2 bg-gray-50">
                  <Input
                    value={defect.title}
                    onChange={(e) => store.updateDefect(i, j, "title", e.target.value)}
                  />
                  <Textarea
                    value={defect.description}
                    onChange={(e) =>
                      store.updateDefect(i, j, "description", e.target.value)
                    }
                  />
                  <div className="flex gap-2">
                    <Select
                      value={defect.priority}
                      onValueChange={(val) => store.updateDefect(i, j, "priority", val)}
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
                        store.updateDefect(i, j, "assignee", e.target.value)
                      }
                      placeholder="Исполнитель"
                    />
                  </div>
                  <Input
                    type="date"
                    value={defect.deadline}
                    onChange={(e) =>
                      store.updateDefect(i, j, "deadline", e.target.value)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Hammer className="w-4 h-4" />
                    <Input
                      type="number"
                      value={defect.cost}
                      onChange={(e) =>
                        store.updateDefect(i, j, "cost", +e.target.value)
                      }
                      placeholder="Стоимость (₽)"
                    />
                  </div>
                  <Select
                    value={defect.status}
                    onValueChange={(val) => store.updateDefect(i, j, "status", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {store.defectStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => store.deleteDefect(i, j)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Удалить дефект
                  </Button>
                </Card>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => store.deleteProject(i)}>
                <Trash2 className="w-4 h-4 mr-2" /> Удалить проект
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default Projects;
