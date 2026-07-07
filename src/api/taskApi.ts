import api from "./axios";
import type { Task } from "../types/task";

export const getTasks = async (
  date?: string
): Promise<Task[]> => {
  const response = await api.get("tasks/", {
    params: date ? { date } : {},
  });

  return response.data;
};

export const createTask = async (task: Partial<Task>) => {
  const response = await api.post("tasks/", task);
  return response.data;
};

export const updateTask = async (
  id: number,
  task: Partial<Task>
) => {
  const response = await api.patch(`tasks/${id}/`, task);
  return response.data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`tasks/${id}/`);
};


export const getTask = async (id: number) => {
  const response = await api.get(`tasks/${id}/`);
  return response.data;
};

