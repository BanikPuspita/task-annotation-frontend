
import DateSelector from "../components/DateSelector";
import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { getTasks, deleteTask, updateTask } from "../api/taskApi";
import type { Task } from "../types/task";
import KanbanColumn from "../components/KanbanColumn";
import TaskModal from "../components/TaskModal";
import { toast } from "sonner";
import ConfirmDialog from "../components/ConfirmDialog";
import { Plus, Search } from "lucide-react";

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const loadTasks = async () => {
    try {
      const data = await getTasks(selectedDate);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const handleDelete = (id: number) => {
    setDeleteTaskId(id);
  };

  const confirmDelete = async () => {
    if (deleteTaskId === null) return;

    try {
      await deleteTask(deleteTaskId);

      toast.success("Task deleted successfully.");

      loadTasks();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete task.");
    } finally {
      setDeleteTaskId(null);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movedTask = tasks.find((task) => task.id.toString() === draggableId);

    if (!movedTask) return;

    // Update UI immediately
    const updatedTasks = tasks.map((task) =>
      task.id === movedTask.id
        ? {
            ...task,
            status: destination.droppableId as "TODO" | "IN_PROGRESS" | "DONE",
          }
        : task,
    );

    setTasks(updatedTasks);

    try {
      await updateTask(movedTask.id, {
        status: destination.droppableId as Task["status"],
      });
    } catch (error) {
      console.error(error);

      // Restore original data if API update fails
      loadTasks();

      toast.error("Failed to update task.");
    }
  };

  return (
    <div className="font-['Inter'] pb-24 sm:pb-24 md:pb-8 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <span className="font-['JetBrains_Mono'] text-[10px] sm:text-xs uppercase tracking-wider text-[#5B5FEF] font-semibold block mb-1 sm:mb-1.5">
            Task Management
          </span>
          <h1 className="font-['Space_Grotesk'] text-2xl sm:text-[27px] font-bold text-[#12142B] tracking-tight">
            Task Management
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
          className="text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-[11px] font-['Space_Grotesk'] font-semibold text-sm flex items-center justify-center gap-2 transition w-full sm:w-auto"
          style={{
            background: "linear-gradient(135deg, #5B5FEF, #4245C7)",
            boxShadow: "0 10px 20px -8px rgba(91,95,239,0.55)",
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          New Task
        </button>
      </div>

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="mb-4 sm:mb-6 relative">
        <Search
          size={16}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#6B7089]"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[#E7E8F2] rounded-xl pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-[13px] sm:text-[14px] outline-none transition focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#EEF0FE] bg-white"
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          <KanbanColumn
            title="To Do"
            tasks={tasks.filter(
              (t) =>
                t.status === "TODO" &&
                t.title.toLowerCase().includes(search.toLowerCase()),
            )}
            onEdit={(task) => {
              setEditingTask(task);
              setShowModal(true);
            }}
            onDelete={handleDelete}
          />

          <KanbanColumn
            title="In Progress"
            tasks={tasks.filter(
              (t) =>
                t.status === "IN_PROGRESS" &&
                t.title.toLowerCase().includes(search.toLowerCase()),
            )}
            onEdit={(task) => {
              setEditingTask(task);
              setShowModal(true);
            }}
            onDelete={handleDelete}
          />

          <KanbanColumn
            title="Done"
            tasks={tasks.filter(
              (t) =>
                t.status === "DONE" &&
                t.title.toLowerCase().includes(search.toLowerCase()),
            )}
            onEdit={(task) => {
              setEditingTask(task);
              setShowModal(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </DragDropContext>

      {showModal && (
        <TaskModal
          editingTask={editingTask}
          selectedDate={selectedDate}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSuccess={loadTasks}
        />
      )}

      <ConfirmDialog
        open={deleteTaskId !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTaskId(null)}
      />
    </div>
  );
}

export default Tasks;