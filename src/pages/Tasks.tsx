import DateSelector from "../components/DateSelector";
import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { getTasks, deleteTask, updateTask } from "../api/taskApi";
import type { Task } from "../types/task";
import KanbanColumn from "../components/KanbanColumn";
import TaskModal from "../components/TaskModal";

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to delete task.");
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
        status: destination.droppableId,
      });
    } catch (error) {
      console.error(error);

      // Restore original data if API update fails
      loadTasks();

      alert("Failed to update task.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Management</h1>

        <button
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          + New Task
        </button>
      </div>

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          <KanbanColumn
            title="To Do"
            status="TODO"
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
            status="IN_PROGRESS"
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
            status="DONE"
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
    </div>
  );
}

export default Tasks;
