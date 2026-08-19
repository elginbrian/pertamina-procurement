"use client";

import { TaskItem } from "@/components/widgets/tasks/TaskItem";

type TaskListItem = {
  id: string;
  title: string;
  department: string;
  due: string;
  priority: string;
  status: string;
};

type TaskListProps = {
  items: TaskListItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export function TaskList({ items, selectedId, onSelect }: TaskListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <TaskItem
          key={item.id}
          {...item}
          active={selectedId === item.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default TaskList;
