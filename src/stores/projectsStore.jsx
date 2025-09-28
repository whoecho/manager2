"use client";

import { makeAutoObservable } from "mobx";

const genId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString() + Math.random().toString(36).slice(2);

class ProjectsStore {
  projects = [];
  logs = []; // <--- всегда массив!

  defectStatuses = ["Новая", "В работе", "На проверке", "Закрыта", "Отменена"];

  constructor() {
    makeAutoObservable(this);

    // Демо-данные
    this.projects = [
      {
        id: genId(),
        name: "ЖК ПИК",
        status: "В процессе",
        defects: [
          {
            id: genId(),
            title: "Течет крыша",
            description: "Протечка в подъезде №3",
            priority: "Высокий",
            assignee: "Иванов",
            deadline: "2025-10-01",
            attachments: [],
            status: "Новая",
            cost: 50000,
          },
        ],
      },
    ];
  }

  // --- ЛОГИ ---
  addLog(action, entity, message) {
    this.logs.unshift({
      id: genId(),
      time: new Date().toLocaleString(),
      action,
      entity,
      message,
    });
  }

  // --- PROJECTS ---
  addProject(project) {
    const withIds = project.defects.map((d) => ({ ...d, id: genId() }));
    const newProject = { ...project, id: genId(), defects: withIds };
    this.projects.push(newProject);

    this.addLog("Добавление", "Проект", `Создан проект "${newProject.name}"`);
  }

  updateProject(index, field, value) {
    const project = this.projects[index];
    const oldValue = project[field];
    project[field] = value;

    this.addLog(
      "Изменение",
      "Проект",
      `Поле "${field}" у проекта "${project.name}" изменено: ${oldValue} → ${value}`
    );
  }

  deleteProject(index) {
    const name = this.projects[index].name;
    this.projects.splice(index, 1);

    this.addLog("Удаление", "Проект", `Удалён проект "${name}"`);
  }

  // --- DEFECTS ---
  addDefect(projectIndex, defect) {
    const newDefect = { ...defect, id: genId() };
    this.projects[projectIndex].defects.push(newDefect);

    this.addLog(
      "Добавление",
      "Дефект",
      `В проект "${this.projects[projectIndex].name}" добавлен дефект "${newDefect.title}"`
    );
  }

  updateDefect(projectIndex, defectIndex, field, value) {
    const defect = this.projects[projectIndex].defects[defectIndex];
    const oldValue = defect[field];
    defect[field] = value;

    this.addLog(
      "Изменение",
      "Дефект",
      `Поле "${field}" у дефекта "${defect.title}" изменено: ${oldValue} → ${value}`
    );
  }

  deleteDefect(projectIndex, defectIndex) {
    const defect = this.projects[projectIndex].defects[defectIndex];
    this.projects[projectIndex].defects.splice(defectIndex, 1);

    this.addLog(
      "Удаление",
      "Дефект",
      `Из проекта "${this.projects[projectIndex].name}" удалён дефект "${defect.title}"`
    );
  }
}

export const projectsStore = new ProjectsStore();
