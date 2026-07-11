import type { Task } from "../types/task";
import { Calendar, Flag, Pencil, Trash2 } from "lucide-react";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

function TaskCard({ task, onEdit, onDelete }: Props) {
  const priorityColor = {
    LOW: "bg-[#E5FBF6] text-[#0E9A80]",
    MEDIUM: "bg-[#FFF4E0] text-[#C67D0A]",
    HIGH: "bg-[#FFEDED] text-[#E14545]",
  };

  const priorityBar = {
    LOW: "bg-[#1FC8A9]",
    MEDIUM: "bg-[#F5A623]",
    HIGH: "bg-[#FF6B6B]",
  };

  return (
    <div className="relative bg-white rounded-[13px] border border-[#E7E8F2] shadow-[0_1px_2px_rgba(18,20,43,0.04)] hover:shadow-md transition-all duration-300 pl-[14px] sm:pl-[18px] pr-3 sm:pr-4 py-3 sm:py-[15px] font-['Inter']">
      <span
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${priorityBar[task.priority]}`}
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-1.5">
        <h3 className="text-[13px] sm:text-[14.5px] font-bold text-[#12142B] break-words">
          {task.title}
        </h3>

        <span
          className={`px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wide font-['JetBrains_Mono'] self-start sm:self-auto ${priorityColor[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-[#6B7089] text-[11.5px] sm:text-[12.5px] leading-relaxed line-clamp-3 mb-2.5 sm:mb-3">
        {task.description || "No description provided."}
      </p>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] text-[#6B7089] font-['JetBrains_Mono']">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          {task.due_date}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(task)}
            className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] rounded-[6px] sm:rounded-[7px] border border-[#E7E8F2] flex items-center justify-center text-[#5B5FEF] hover:bg-[#EEF0FE] transition"
          >
            <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] rounded-[6px] sm:rounded-[7px] border border-[#E7E8F2] flex items-center justify-center text-[#FF6B6B] hover:bg-[#FFEDED] transition"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#6B7089] mt-2 sm:mt-2.5 pt-2 sm:pt-2.5 border-t border-[#F0F1F7]">
        <Flag className="w-3 h-3" />
        {task.status.replace("_", " ")}
      </div>
    </div>
  );
}

export default TaskCard;