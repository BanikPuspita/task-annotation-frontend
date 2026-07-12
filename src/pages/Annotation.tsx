

import AnnotationCanvas from "../components/AnnotationCanvas";
import { useEffect, useState } from "react";
import { uploadImage, getImages } from "../api/imageApi";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Image {
  id: number;
  title: string;
  image: string;
}

function Annotation() {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

  const loadImages = async () => {
  try {
    const data = await getImages();

    console.log(data);

    setImages(data);

    return data;
  } catch (error) {
    console.error(error);
    toast.error("Failed to load images.");
    return [];
  }
};

  useEffect(() => {
    loadImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    const formData = new FormData();

    formData.append("title", file.name);
    formData.append("image", file);

    try {
      setUploading(true);

      await uploadImage(formData);

      const updatedImages = await loadImages();

      if (updatedImages.length > 0) {
        setCurrentIndex(updatedImages.length - 1);
      }

      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 font-['Inter'] pb-24 sm:pb-24 md:pb-8 lg:pb-0">
      <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#E7E8F2] shadow-sm p-5 sm:p-6 md:p-8">
        <span className="font-['JetBrains_Mono'] text-[10px] sm:text-xs uppercase tracking-wider text-[#5B5FEF] font-semibold block mb-1.5 sm:mb-2">
          Image Annotation
        </span>
        <h1 className="font-['Space_Grotesk'] text-2xl sm:text-[26px] font-bold text-[#12142B] tracking-tight">
          Annotation Workspace
        </h1>

        <p className="text-[#6B7089] text-[12.5px] sm:text-[13.5px] mt-1 sm:mt-1.5">
          Upload images and create polygon annotations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* LEFT SIDEBAR */}
        <div className="bg-white rounded-[16px] sm:rounded-[18px] border border-[#E7E8F2] shadow-sm p-3.5 sm:p-4 h-fit">
          <label
            className={`border-[1.5px] border-dashed rounded-[12px] sm:rounded-[14px] h-[90px] sm:h-[110px] flex flex-col justify-center items-center transition ${
              uploading
                ? "bg-[#F6F7FB] border-[#E7E8F2] cursor-not-allowed"
                : "cursor-pointer border-[#C7C9E6] bg-[#EEF0FE] hover:border-[#5B5FEF]"
            }`}
          >
            <Upload
              size={18} 
              className={uploading ? "text-[#B9BBD4]" : "text-[#5B5FEF]"}
            />

            <p className="mt-1.5 sm:mt-2.5 font-semibold text-[12.5px] sm:text-[13.5px] text-[#12142B]">
              {uploading ? "Uploading..." : "Upload Image"}
            </p>

            <p className="text-[10.5px] sm:text-[11.5px] text-[#6B7089] mt-0.5">
              PNG, JPG or JPEG
            </p>

            <input
              hidden
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>

          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6B7089] mt-4 sm:mt-5 mb-2 sm:mb-2.5">
            Images ({images.length})
          </p>

          <div className="space-y-2 sm:space-y-2.5 max-h-[300px] sm:max-h-[600px] overflow-y-auto">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-full rounded-xl overflow-hidden border-[1.5px] transition-all text-left ${
                  currentIndex === index
                    ? "border-[#5B5FEF] ring-4 ring-[#EEF0FE]"
                    : "border-[#E7E8F2] hover:border-[#5B5FEF]"
                }`}
              >
                <img
                  src={img.image}
                  alt={img.title}
                  className="w-full h-[50px] sm:h-[70px] object-cover"
                />

                <div
                  className={`p-1.5 sm:p-2.5 flex justify-between items-center ${
                    currentIndex === index ? "bg-[#EEF0FE]" : ""
                  }`}
                >
                  <p
                    className={`font-semibold text-[11px] sm:text-[12.5px] truncate ${
                      currentIndex === index
                        ? "text-[#5B5FEF]"
                        : "text-[#12142B]"
                    }`}
                  >
                    {img.title}
                  </p>

                  <p className="text-[9px] sm:text-[10px] text-[#6B7089] font-['JetBrains_Mono'] shrink-0 ml-1 sm:ml-2">
                    #{index + 1}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CANVAS */}
        <div className="lg:col-span-2 xl:col-span-3 bg-white rounded-[16px] sm:rounded-[18px] border border-[#E7E8F2] shadow-sm p-4 sm:p-5 md:p-6 overflow-hidden">
          {images.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-5">
                <div>
                  <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#12142B] truncate max-w-[200px] sm:max-w-none">
                    {images[currentIndex].title}
                  </h2>

                  <p className="text-[#6B7089] text-[11px] sm:text-[12px] font-['JetBrains_Mono'] mt-0.5">
                    Image {currentIndex + 1} of {images.length}
                  </p>
                </div>
              </div>

              <AnnotationCanvas
                imageId={images[currentIndex].id}
                imageUrl={images[currentIndex].image}
              />
            </>
          ) : (
            <div className="min-h-[400px] sm:min-h-[500px] md:min-h-[700px] flex flex-col justify-center items-center text-center px-4 sm:px-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#F6F7FB] flex items-center justify-center">
                <ImageIcon size={24} className="text-[#B9BBD4]" />
              </div>

              <h2 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-[#12142B] mt-4 sm:mt-5">
                No Images Uploaded
              </h2>

              <p className="text-[#6B7089] text-[12.5px] sm:text-[13.5px] mt-1 sm:mt-1.5">
                Upload an image to begin annotation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Annotation;