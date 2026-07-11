import { useEffect, useState } from "react";
import { createTask, updateTask } from "../api/taskApi";
import type { Task } from "../types/task";
import { toast } from "sonner";
import { X, Calendar, Tag } from "lucide-react";

interface Props {
  editingTask: Task | null;
  selectedDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

function TaskModal({ editingTask, selectedDate, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    due_date: "",
    task_date: selectedDate,
    tags: "",
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        due_date: editingTask.due_date,
        task_date: editingTask.task_date,
        tags: editingTask.tags.join(", "),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        due_date: "",
        task_date: selectedDate,
        tags: "",
      });
    }
  }, [editingTask, selectedDate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
        toast.success("Task updated successfully.");
      } else {
        await createTask(payload);
        toast.success("Task created successfully.");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save task.");
    }
  };

  const baseInputClass =
    "w-full border-[1.5px] border-[#E7E8F2] rounded-[10px] px-3.5 py-2.5 sm:py-3 text-base sm:text-[14px] font-['Inter'] outline-none transition focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#EEF0FE] bg-white";
  const labelClass =
    "block text-[12px] sm:text-[12.5px] font-semibold text-[#12142B] mb-1.5";

  const priorityAccent: Record<string, string> = {
    LOW: "border-l-[3px] !border-l-[#1FC8A9]",
    MEDIUM: "border-l-[3px] !border-l-[#F5A623]",
    HIGH: "border-l-[3px] !border-l-[#FF6B6B]",
  };

  return (
    <div
      className="fixed inset-0 bg-[#0B0E1F]/55 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-[20px]
shadow-[0_30px_60px_-12px_rgba(11,14,31,0.4)]
w-full max-w-[480px]
font-['Inter']
flex flex-col
h-[92vh]
max-h-[720px]
overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - fixed */}
        <div className="border-b border-[#E7E8F2] px-4 sm:px-7 py-3.5 sm:py-6 flex justify-between items-start shrink-0">
          <div className="pr-2 min-w-0 flex-1">
            <h2 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-[#12142B] truncate">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-[#6B7089] text-[12px] sm:text-[13px] mt-1">
              Fill in the information below.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#6B7089] hover:text-[#12142B] hover:bg-[#F6F7FB] transition shrink-0 w-10 h-10 -mr-1.5 -mt-1 rounded-lg flex items-center justify-center"
          >
            <X size={19} />
          </button>
        </div>

        <form
          id="task-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-7 pb-8 space-y-4 sm:space-y-[18px]"
        >
          {/* Title */}
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              className={baseInputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write task description..."
              className={`${baseInputClass} resize-y min-h-[64px]`}
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={labelClass}>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`${baseInputClass} ${priorityAccent[formData.priority] ?? ""}`}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={baseInputClass}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} />
                  Due Date
                </span>
              </label>

              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
                className={baseInputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} />
                  Task Date
                </span>
              </label>

              <input
                type="date"
                name="task_date"
                value={formData.task_date}
                onChange={handleChange}
                required
                className={baseInputClass}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Tag size={12} />
                Tags
              </span>
            </label>

            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="frontend, urgent, bug"
              className={baseInputClass}
            />
          </div>
        </form>
        <div className="border-t border-[#E7E8F2] bg-white px-4 py-4 sm:px-7 sm:py-5 shrink-0">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-[#E7E8F2] px-6 font-semibold text-[#12142B] hover:bg-[#F6F7FB] transition w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="task-form"
              className="h-11 rounded-xl px-6 text-white font-['Space_Grotesk'] font-semibold w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg,#5B5FEF,#4245C7)",
                boxShadow: "0 10px 20px -8px rgba(91,95,239,.55)",
              }}
            >
              {editingTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
