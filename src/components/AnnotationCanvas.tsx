
import { Stage, Layer, Line, Circle, Image as KonvaImage } from "react-konva";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import {
  createAnnotation,
  getAnnotations,
  deleteAnnotation,
  type Annotation,
} from "../api/annotationApi";
import ConfirmDialog from "./ConfirmDialog";
import { Eraser, Save, Trash2 } from "lucide-react";

interface Props {
  imageUrl: string;
  imageId: number;
}

function AnnotationCanvas({ imageUrl, imageId }: Props) {

  console.log("imageUrl =", imageUrl);
  console.log("imageId =", imageId);

  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const [points, setPoints] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<number | null>(
    null,
  );

  const [label, setLabel] = useState("Person");
  const containerRef = useRef<HTMLDivElement>(null);

  const [stageSize, setStageSize] = useState({
    width: 1000,
    height: 650,
  });

  const loadAnnotations = async () => {
    try {
      const data = await getAnnotations(imageId);
      setAnnotations(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load annotations.");
    }
  };

  const updateStageSize = () => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;

    const ratio = 650 / 1000;

    setStageSize({
      width,
      height: width * ratio,
    });
  };

  useEffect(() => {
  console.log("Loading image:", imageUrl);

  const img = new window.Image();

  img.crossOrigin = "anonymous";

  img.onload = () => {
    console.log("Image loaded", img.width, img.height);
    setImage(img);
  };

  img.onerror = (e) => {
    console.log("Image failed", e);
  };

  img.src = imageUrl;

  loadAnnotations();

  setPoints([]);
  setFinished(false);
  setSelectedAnnotation(null);
}, [imageUrl, imageId]);

 
  useEffect(() => {
    updateStageSize();

    window.addEventListener("resize", updateStageSize);

    return () => {
      window.removeEventListener("resize", updateStageSize);
    };
  }, []);

  const handleClick = (e: any) => {
    if (finished) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    if (!pos) return;

    setPoints((prev) => [...prev, pos.x, pos.y]);
  };

  const handleDoubleClick = () => {
    if (points.length >= 6) {
      setFinished(true);
    }
  };

  const resetPolygon = () => {
    setPoints([]);
    setFinished(false);
  };

  const savePolygon = async () => {
    if (!finished) {
      toast.warning("Finish the polygon before saving.");
      return;
    }

    try {
      await createAnnotation({
        image: imageId,
        label,
        polygon: points,
      });

      await loadAnnotations();

      setPoints([]);
      setFinished(false);

      toast.success("Annotation saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save annotation.");
    }
  };

  const removeAnnotation = () => {
    if (selectedAnnotation === null) {
      toast.warning("Please select an annotation first.");
      return;
    }

    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedAnnotation === null) return;

    try {
      await deleteAnnotation(selectedAnnotation);

      setSelectedAnnotation(null);

      await loadAnnotations();

      toast.success("Annotation deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete annotation.");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="font-['Inter'] pb-24 sm:pb-24 md:pb-8 lg:pb-0">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <label className="font-semibold text-[11.5px] sm:text-[12.5px] text-[#12142B]">
            Label
          </label>

          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="border-[1.5px] border-[#E7E8F2] rounded-[9px] px-2.5 sm:px-3 py-1.5 sm:py-2 text-[12px] sm:text-[13px] outline-none focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#EEF0FE] transition flex-1 sm:flex-none"
          >
            <option>Person</option>
            <option>Car</option>
            <option>Building</option>
            <option>Tree</option>
            <option>Animal</option>
            <option>Object</option>
          </select>
        </div>

        <div className="text-[10px] sm:text-[11px] text-[#5B5FEF] bg-[#EEF0FE] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-['JetBrains_Mono'] text-center sm:text-left">
          Click to add points · Double-click to close polygon
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto rounded-[12px] sm:rounded-[14px]"
        style={{ background: "#0B0E1F" }}
      >
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleClick}
          onDblClick={handleDoubleClick}
        >
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                width={stageSize.width}
                height={stageSize.height}
              />
            )}

            {/* Saved polygons */}
            {annotations.map((annotation) => (
              <Line
                key={annotation.id}
                points={annotation.polygon.map((value, index) =>
                  index % 2 === 0
                    ? value * (stageSize.width / 1000)
                    : value * (stageSize.height / 650),
                )}
                closed
                stroke={
                  selectedAnnotation === annotation.id ? "#1FC8A9" : "#5B5FEF"
                }
                strokeWidth={3}
                fill={
                  selectedAnnotation === annotation.id
                    ? "rgba(31,200,169,.25)"
                    : "rgba(91,95,239,.20)"
                }
                onClick={(e) => {
                  e.cancelBubble = true;
                  setSelectedAnnotation(annotation.id);
                }}
              />
            ))}

            {/* Current polygon */}
            {points.length >= 2 && (
              <Line
                points={points.map((value, index) =>
                  index % 2 === 0
                    ? value * (stageSize.width / 1000)
                    : value * (stageSize.height / 650),
                )}
                closed={finished}
                stroke="#FF6B6B"
                strokeWidth={3}
                fill={finished ? "rgba(255,107,107,.20)" : undefined}
              />
            )}

            {/* Current points */}
            {points.map((_, index) => {
              if (index % 2 !== 0) return null;

              return (
                <Circle
                  key={index}
                  x={points[index] * (stageSize.width / 1000)}
                  y={points[index + 1] * (stageSize.height / 650)}
                  radius={5}
                  fill="#FF6B6B"
                />
              );
            })}
          </Layer>
        </Stage>
      </div>

      {/* Bottom buttons */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 mt-4 sm:mt-5">
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          <button
            onClick={resetPolygon}
            className="bg-[#FFEDED] hover:bg-[#FFDCDC] text-[#E14545] px-3 sm:px-4 py-2 sm:py-2.5 rounded-[10px] sm:rounded-[11px] text-[12px] sm:text-[13px] font-['Space_Grotesk'] font-semibold flex items-center gap-1.5 sm:gap-2 transition flex-1 sm:flex-none justify-center"
          >
            <Eraser size={13}/>
            Clear Polygon
          </button>

          <button
            onClick={savePolygon}
            className="text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-[10px] sm:rounded-[11px] text-[12px] sm:text-[13px] font-['Space_Grotesk'] font-semibold flex items-center gap-1.5 sm:gap-2 transition flex-1 sm:flex-none justify-center"
            style={{
              background: "linear-gradient(135deg, #1FC8A9, #0E9A80)",
              boxShadow: "0 8px 16px -6px rgba(31,200,169,0.5)",
            }}
          >
            <Save size={13}/>
            Save Annotation
          </button>

          <button
            onClick={removeAnnotation}
            className="bg-[#12142B] hover:bg-black text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-[10px] sm:rounded-[11px] text-[12px] sm:text-[13px] font-['Space_Grotesk'] font-semibold flex items-center gap-1.5 sm:gap-2 transition flex-1 sm:flex-none justify-center"
          >
            <Trash2 size={13}/>
            Delete Selected
          </button>
        </div>

        <p className="text-[10.5px] sm:text-[11.5px] text-[#6B7089] font-['JetBrains_Mono'] text-center sm:text-left">
          Select a polygon to delete it · New points use the selected label
        </p>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Annotation"
        message="This annotation will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}

export default AnnotationCanvas;