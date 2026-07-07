import { useEffect, useState } from "react";
import { createTask, updateTask } from "../api/taskApi";
import type { Task } from "../types/task";

interface Props {
  editingTask: Task | null;
  selectedDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

function TaskModal({
  editingTask,
  selectedDate,
  onClose,
  onSuccess,
}: Props) {
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
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
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
      } else {
        await createTask(payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-[500px] p-6">

        <h2 className="text-2xl font-bold mb-5">
          {editingTask ? "Edit Task" : "Create Task"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">
              In Progress
            </option>
            <option value="DONE">Done</option>
          </select>

          <div>
            <label className="block mb-1">
              Due Date
            </label>

            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">
              Task Date
            </label>

            <input
              type="date"
              name="task_date"
              value={formData.task_date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <input
            type="text"
            name="tags"
            placeholder="frontend, urgent"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingTask ? "Update" : "Save"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default TaskModal;