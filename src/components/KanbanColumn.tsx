/**
 * Font-link requirement (add once to index.html):
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 *
 * No logic changed: same Props interface, same droppableId derivation
 * (title -> TODO/IN_PROGRESS/DONE), same Droppable/Draggable structure,
 * same provided.placeholder, same isDraggingOver / isDragging states.
 * Only headerColor() now returns a status object (border/dot) instead of a
 * solid background class, to match the mockup's white-header +
 * colored-border-and-dot look instead of a solid colored block.
 */

import { Droppable, Draggable } from "@hello-pangea/dnd";

import type { Task } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

function KanbanColumn({ title, tasks, onEdit, onDelete }: Props) {
  const statusAccent = () => {
    switch (title) {
      case "To Do":
        return { border: "#FF6B6B", dot: "bg-[#FF6B6B]" };

      case "In Progress":
        return { border: "#F5A623", dot: "bg-[#F5A623]" };

      case "Done":
        return { border: "#1FC8A9", dot: "bg-[#1FC8A9]" };

      default:
        return { border: "#5B5FEF", dot: "bg-[#5B5FEF]" };
    }
  };

  const accent = statusAccent();

  const droppableId =
    title === "To Do" ? "TODO" : title === "In Progress" ? "IN_PROGRESS" : "DONE";

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`rounded-[14px] sm:rounded-[18px] transition-all duration-300 border overflow-hidden font-['Inter'] ${
            snapshot.isDraggingOver
              ? "bg-[#EEF0FE] border-[#5B5FEF]"
              : "bg-white border-[#E7E8F2]"
          }`}
        >
          {/* Header */}
          <div
            className="px-3.5 sm:px-[18px] py-3 sm:py-4 flex justify-between items-center border-b-[2px] sm:border-b-[3px]"
            style={{ borderColor: accent.border }}
          >
            <h2 className="font-['Space_Grotesk'] font-bold text-[13px] sm:text-[14.5px] text-[#12142B] flex items-center gap-2 sm:gap-2.5">
              <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${accent.dot}`} />
              {title}
            </h2>

            <span className="bg-[#F6F7FB] text-[#6B7089] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11.5px] font-bold font-['JetBrains_Mono']">
              {tasks.length}
            </span>
          </div>

          {/* Body */}
          <div className="p-2.5 sm:p-3.5 min-h-[300px] sm:min-h-[420px] flex flex-col gap-2 sm:gap-3">
            {tasks.length === 0 && (
              <div className="flex-1 border-[1.5px] border-dashed border-[#E7E8F2] rounded-xl min-h-[200px] sm:min-h-[380px] flex items-center justify-center text-[#B9BBD4] text-[11px] sm:text-[13px] font-['JetBrains_Mono']">
                No Tasks
              </div>
            )}

            {tasks.map((task, index) => (
              <Draggable
                key={task.id.toString()}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition ${
                      snapshot.isDragging ? "rotate-1 scale-105" : ""
                    }`}
                  >
                    <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default KanbanColumn;