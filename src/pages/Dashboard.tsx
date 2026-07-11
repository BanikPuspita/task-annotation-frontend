
import { useEffect, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  ArrowRight,
  ListTodo,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import StatCard from "../components/StatCard";
import { getTasks } from "../api/taskApi";
import { getImages } from "../api/imageApi";
import type { Task } from "../types/task";

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [taskData, imageData] = await Promise.all([
        getTasks(),
        getImages(),
      ]);

      setTasks(taskData);
      setImages(imageData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((task) => task.status === "TODO").length;

  const progressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const statusStyles: Record<string, string> = {
    TODO: "bg-[#FFEDED] text-[#E14545]",
    IN_PROGRESS: "bg-[#FFF4E0] text-[#C67D0A]",
    DONE: "bg-[#E5FBF6] text-[#0E9A80]",
  };

  const statusAccent: Record<string, string> = {
    TODO: "before:bg-[#FF6B6B]",
    IN_PROGRESS: "before:bg-[#F5A623]",
    DONE: "before:bg-[#1FC8A9]",
  };

  if (loading) {
    return (
      <div className="text-center py-12 sm:py-16 md:py-20 text-base sm:text-lg font-medium text-[#6B7089] font-['Inter']">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B5FEF] border-t-transparent mb-4"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 font-['Inter'] pb-2 sm:pb-20 md:pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#E7E8F2] shadow-sm p-5 sm:p-6 md:p-8">
        <p className="font-['JetBrains_Mono'] text-[10px] sm:text-xs uppercase tracking-wider text-[#5B5FEF] font-semibold">
          Welcome Back 👋
        </p>

        <h1 className="font-['Space_Grotesk'] text-2xl sm:text-[26px] md:text-[30px] font-bold text-[#12142B] tracking-tight mt-1.5 sm:mt-2">
          TaskFlow Dashboard
        </h1>

        <p className="text-[#6B7089] text-[13px] sm:text-[14px] md:text-[14.5px] mt-1.5 sm:mt-2">
          Monitor your tasks and image annotations in one place.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          color="bg-[#5B5FEF]"
          icon={ClipboardList}
        />

        <StatCard
          title="To Do"
          value={todoTasks}
          color="bg-[#FF6B6B]"
          icon={ListTodo}
        />

        <StatCard
          title="In Progress"
          value={progressTasks}
          color="bg-[#F5A623]"
          icon={Clock3}
        />

        <StatCard
          title="Completed"
          value={completedTasks}
          color="bg-[#1FC8A9]"
          icon={CheckCircle2}
        />

        <StatCard
          title="Images"
          value={images.length}
          color="bg-[#8B5CF6]"
          icon={ImageIcon}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#E7E8F2] p-5 sm:p-6 md:p-7 shadow-sm">
          <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#12142B] mb-1">
            Recent Tasks
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#6B7089] mb-4 sm:mb-5">
            Your latest activity across all boards.
          </p>

          {tasks.length === 0 ? (
            <p className="text-[#6B7089] text-sm text-center py-6 sm:py-8">
              No tasks available.
            </p>
          ) : (
            <div className="space-y-2 sm:space-y-2.5">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className={`relative border border-[#E7E8F2] rounded-xl pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-3.5 before:content-[''] before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3px] before:rounded-full ${
                    statusAccent[task.status] ?? "before:bg-[#5B5FEF]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <h3 className="font-semibold text-[13px] sm:text-[14px] md:text-[14.5px] text-[#12142B] truncate max-w-[180px] sm:max-w-none">
                      {task.title}
                    </h3>

                    <span
                      className={`font-['JetBrains_Mono'] text-[9px] sm:text-[10px] md:text-[10.5px] font-bold tracking-wide px-2 sm:px-2.5 py-1 rounded-full self-start sm:self-auto ${
                        statusStyles[task.status] ??
                        "bg-[#EEF0FE] text-[#5B5FEF]"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="font-['JetBrains_Mono'] text-[11px] sm:text-[12px] text-[#6B7089] mt-1 sm:mt-1.5">
                    Due: {task.due_date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#E7E8F2] p-5 sm:p-6 md:p-7 shadow-sm">
          <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#12142B]">
            Quick Actions
          </h2>

          <p className="text-[12px] sm:text-[13px] text-[#6B7089] mt-1 mb-4 sm:mb-5">
            Access your most used features.
          </p>

          <div className="space-y-3">
            <Link
              to="/tasks"
              className="flex justify-between items-center border border-[#E7E8F2] rounded-[12px] sm:rounded-[14px] p-4 sm:p-[18px] hover:bg-[#EEF0FE] hover:border-[#5B5FEF] transition group"
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                <div className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] rounded-[8px] sm:rounded-[10px] bg-[#EEF0FE] text-[#5B5FEF] flex items-center justify-center shrink-0">
                  <ClipboardList size={15} sm:size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[13px] sm:text-[14px] text-[#12142B] truncate">
                    Manage Tasks
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6B7089] mt-0.5 truncate">
                    Create, update and organize tasks.
                  </p>
                </div>
              </div>

              <ArrowRight size={14} sm:size={16} className="text-[#12142B] shrink-0 ml-2" />
            </Link>

            <Link
              to="/annotation"
              className="flex justify-between items-center border border-[#E7E8F2] rounded-[12px] sm:rounded-[14px] p-4 sm:p-[18px] hover:bg-[#EEF0FE] hover:border-[#5B5FEF] transition group"
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                <div className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] rounded-[8px] sm:rounded-[10px] bg-[#EEF0FE] text-[#5B5FEF] flex items-center justify-center shrink-0">
                  <ImageIcon size={15} sm:size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[13px] sm:text-[14px] text-[#12142B] truncate">
                    Image Annotation
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6B7089] mt-0.5 truncate">
                    Upload images and draw polygons.
                  </p>
                </div>
              </div>

              <ArrowRight size={14} sm:size={16} className="text-[#12142B] shrink-0 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;