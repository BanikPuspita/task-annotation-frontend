import api from "./axios";

export const uploadImage = async (formData: FormData) => {
  const response = await api.post("images/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getImages = async () => {
  const response = await api.get("images/");
  return response.data;
};