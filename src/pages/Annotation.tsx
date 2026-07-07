import { useEffect, useState } from "react";
import { uploadImage, getImages } from "../api/imageApi";
import AnnotationCanvas from "../components/AnnotationCanvas";

interface Image {
  id: number;
  title: string;
  image: string;
}

function Annotation() {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadImages = async () => {
    try {
      const data = await getImages();
      setImages(data);

      if (data.length > 0) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("title", file.name);
    formData.append("image", file);

    try {
      await uploadImage(formData);
      loadImages();
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Image Annotation
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-6"
      />

      {images.length > 0 ? (
        <div className="flex flex-col items-center">

          {/* Annotation Canvas */}
          <AnnotationCanvas
  imageUrl={images[currentIndex].image}
  imageId={images[currentIndex].id}
/>

          <h3 className="mt-4 text-lg font-semibold">
            {images[currentIndex].title}
          </h3>

          <div className="flex gap-4 mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="self-center font-semibold">
              {currentIndex + 1} / {images.length}
            </span>

            <button
              disabled={currentIndex === images.length - 1}
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No images uploaded.
        </div>
      )}
    </div>
  );
}

export default Annotation;