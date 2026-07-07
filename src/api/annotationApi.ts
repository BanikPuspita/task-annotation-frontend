import api from "./axios";

export interface Annotation {
  id: number;
  image: number;
  label: string;
  polygon: number[];
}

export const createAnnotation = async (data: {
  image: number;
  label: string;
  polygon: number[];
}) => {
  const response = await api.post("annotations/", data);
  return response.data;
};

export const getAnnotations = async (imageId: number) => {
  const response = await api.get(
    `annotations/?image=${imageId}`
  );
  return response.data;
};

export const deleteAnnotation = async (id: number) => {
  await api.delete(`annotations/${id}/`);
};