import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

function TaskCard({
  task,
  index,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Draggable
      draggableId={task.id.toString()}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow border p-4 mb-4 transition ${
            snapshot.isDragging
              ? "shadow-2xl rotate-2"
              : ""
          }`}
        >
          <h3 className="font-bold text-lg">
            {task.title}
          </h3>

          <p className="text-gray-600 mt-2">
            {task.description}
          </p>

          <div className="flex justify-between mt-4 text-sm">
            <span
  className={`px-2 py-1 rounded text-white text-xs ${
    task.priority === "HIGH"
      ? "bg-red-500"
      : task.priority === "MEDIUM"
      ? "bg-yellow-500"
      : "bg-green-500"
  }`}
>
  {task.priority}
</span>

            <span>{task.due_date}</span>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => onEdit(task)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(task.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;