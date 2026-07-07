import { Droppable } from "@hello-pangea/dnd";
import type { Task } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

function KanbanColumn({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
}: Props)
{
  return (
  <Droppable droppableId={status}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="bg-gray-100 rounded-lg p-4 min-h-[500px]"
      >
        <h2 className="text-xl font-bold mb-4">
    {title} ({tasks.length})
</h2>

        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
    🎉 No tasks here
</div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}

        {provided.placeholder}
      </div>
    )}
  </Droppable>
);
}

export default KanbanColumn;