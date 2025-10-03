"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { projectsStore } from "@/stores/projectsStore";
import { observer } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import LogoutButton from "../logoutButton";

const Defects = observer(() => {
  const store = projectsStore;

  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [allDefects, setAllDefects] = useState([]);
  const session = useSession()
  const router = useRouter()
  console.log(session)
   if (session.status=="unauthenticated") {
     router.push("/"); // редирект на страницу входа
   }
  // Загружаем дефекты из API при монтировании
  useEffect(() => {
    store.fetchDefects().then(setAllDefects);
  }, []);

  // Поиск, фильтрация, сортировка
  const filteredDefects = useMemo(() => {
    let defects = [...allDefects];

    if (search) {
      defects = defects.filter(
        (defect) =>
          defect.title.toLowerCase().includes(search.toLowerCase()) ||
          defect.description.toLowerCase().includes(search.toLowerCase()) ||
          defect.assignee.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterPriority && filterPriority !== "all") {
      defects = defects.filter((defect) => defect.priority === filterPriority);
    }

    if (sortField) {
      defects.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return defects;
  }, [allDefects, search, filterPriority, sortField, sortDirection]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-6">
        <Link href="/projects">Проекты</Link>
        <Link href="/dashboard">Журнал изменений</Link>
        <LogoutButton />
        <div>Вход осуществлен как {session?.data?.user?.role}</div>
      </div>

      <h1 className="text-2xl font-bold">Дефекты проектов</h1>

      <div className="flex gap-4">
        <Input
          placeholder="Поиск по названию, описанию или исполнителю..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все приоритеты" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="Высокий">Высокий</SelectItem>
            <SelectItem value="Средний">Средний</SelectItem>
            <SelectItem value="Низкий">Низкий</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() =>
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
          }
        >
          Сортировать по{" "}
          {sortField == "projectName"
            ? "Проекту"
            : sortField == "title"
            ? "Названию"
            : sortField == "priority"
            ? "Приоритету"
            : sortField == "assignee"
            ? "Исполнителю"
            : sortField == "deadline"
            ? "Сроку"
            : sortField == "status"
            ? "Статусу"
            : "полю"}{" "}
          ({sortDirection})
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => setSortField("projectName")}>
              Проект
            </TableHead>
            <TableHead onClick={() => setSortField("title")}>
              Название
            </TableHead>
            <TableHead>Описание</TableHead>
            <TableHead onClick={() => setSortField("priority")}>
              Приоритет
            </TableHead>
            <TableHead onClick={() => setSortField("assignee")}>
              Исполнитель
            </TableHead>
            <TableHead onClick={() => setSortField("deadline")}>
              Срок
            </TableHead>
            <TableHead onClick={() => setSortField("status")}>
              Статус
            </TableHead>
            <TableHead onClick={() => setSortField("cost")}>
              Стоимость (₽)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDefects.map((defect) => (
            <TableRow key={defect.id}>
              <TableCell>{defect.projectName}</TableCell>
              <TableCell>{defect.title}</TableCell>
              <TableCell>{defect.description}</TableCell>
              <TableCell>{defect.priority}</TableCell>
              <TableCell>{defect.assignee}</TableCell>
              <TableCell>{defect.deadline}</TableCell>
              <TableCell>{defect.status}</TableCell>
              <TableCell>{defect.cost ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

export default Defects;
