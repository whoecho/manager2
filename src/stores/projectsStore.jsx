// stores/projectsStore.js
"use client";
import { makeAutoObservable } from "mobx";

class ProjectsStore {
  projects = [];
  logs = [];
  defectStatuses = ["Новая", "В работе", "На проверке", "Закрыта", "Отменена"];

  constructor() {
    makeAutoObservable(this);
    this.fetchProjects();
  }

  async fetchProjects() {
    const res = await fetch("/api/projects", { cache: "no-store" });
    this.projects = await res.json();
  }

  // ===== LOGS =====
  async fetchLogs() {
    const res = await fetch("/api/logs", { cache: "no-store" });
    this.logs = await res.json();
  }

  async addLog(action, entity, message) {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, entity, message }),
    });
    await this.fetchLogs();
  }

  // ===== PROJECTS =====
  async addProject(project) {
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    await this.fetchProjects();
    await this.addLog("Добавление", "Проект", `Создан проект "${project.name}"`);
  }

  async updateProject(projectId, field, value) {
    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });
    await this.fetchProjects();
    await this.addLog("Изменение", "Проект", `Поле "${field}" изменено → ${value}`);
  }

  async deleteProject(projectId) {
    await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    await this.fetchProjects();
    await this.addLog("Удаление", "Проект", `Удалён проект`);
  }

  // ===== DEFECTS =====
  async addDefect(projectId, defect) {
    await fetch(`/api/projects/${projectId}/defects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(defect),
    });
    await this.fetchProjects();
    await this.addLog("Добавление", "Дефект", `Добавлен дефект "${defect.title}"`);
  }

  async updateDefect(projectId, defectId, field, value) {
    await fetch(`/api/projects/${projectId}/defects/${defectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });
    await this.fetchProjects();
    await this.addLog("Изменение", "Дефект", `Поле "${field}" изменено → ${value}`);
  }

  async deleteDefect(projectId, defectId) {
    await fetch(`/api/projects/${projectId}/defects/${defectId}`, {
      method: "DELETE",
    });
    await this.fetchProjects();
    await this.addLog("Удаление", "Дефект", `Удалён дефект`);
  }

  // (если нужно для Defects page)
  async fetchDefects() {
    const res = await fetch("/api/defects", { cache: "no-store" });
    return await res.json();
  }
}

export const projectsStore = new ProjectsStore();
