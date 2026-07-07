import {
  Stage,
  Layer,
  Line,
  Circle,
  Image as KonvaImage,
} from "react-konva";
import { useEffect, useState } from "react";

import {
  createAnnotation,
  getAnnotations,
  deleteAnnotation,
  type Annotation,
} from "../api/annotationApi";

interface Props {
  imageUrl: string;
  imageId: number;
}

function AnnotationCanvas({ imageUrl, imageId }: Props) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const [points, setPoints] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<number | null>(
    null
  );

  const loadAnnotations = async () => {
    try {
      const data = await getAnnotations(imageId);
      setAnnotations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;

    img.onload = () => {
      setImage(img);
    };

    loadAnnotations();

    // Reset current drawing
    setPoints([]);
    setFinished(false);
    setSelectedAnnotation(null);
  }, [imageUrl, imageId]);

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
      alert("Finish the polygon first.");
      return;
    }

    try {
      await createAnnotation({
        image: imageId,
        label: "Object",
        polygon: points,
      });

      alert("Annotation saved successfully!");

      setPoints([]);
      setFinished(false);

      await loadAnnotations();
    } catch (error) {
      console.error(error);
      alert("Failed to save annotation.");
    }
  };

  const removeAnnotation = async () => {
    if (selectedAnnotation === null) {
      alert("Select a polygon first.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this annotation?"
    );

    if (!confirmed) return;

    try {
      await deleteAnnotation(selectedAnnotation);

      setSelectedAnnotation(null);

      await loadAnnotations();
    } catch (error) {
      console.error(error);
      alert("Failed to delete annotation.");
    }
  };

  return (
    <div>
      <Stage
        width={900}
        height={600}
        onClick={handleClick}
        onDblClick={handleDoubleClick}
        className="border rounded-lg"
      >
        <Layer>
          {/* Background Image */}
          {image && (
            <KonvaImage
              image={image}
              width={900}
              height={600}
            />
          )}

          {/* Saved Polygons */}
          {annotations.map((annotation) => (
            <Line
              key={annotation.id}
              points={annotation.polygon}
              stroke={
                selectedAnnotation === annotation.id
                  ? "green"
                  : "blue"
              }
              strokeWidth={3}
              closed
              fill={
                selectedAnnotation === annotation.id
                  ? "rgba(0,255,0,0.25)"
                  : "rgba(0,0,255,0.2)"
              }
              onClick={(e) => {
                e.cancelBubble = true;
                setSelectedAnnotation(annotation.id);
              }}
            />
          ))}

          {/* Current Polygon */}
          {points.length >= 2 && (
            <Line
              points={points}
              stroke="red"
              strokeWidth={2}
              closed={finished}
              fill={
                finished
                  ? "rgba(255,0,0,0.2)"
                  : undefined
              }
            />
          )}

          {/* Current Points */}
          {points.map((_, index) => {
            if (index % 2 !== 0) return null;

            return (
              <Circle
                key={index}
                x={points[index]}
                y={points[index + 1]}
                radius={4}
                fill="red"
              />
            );
          })}
        </Layer>
      </Stage>

      <div className="mt-4 flex gap-3 flex-wrap">
        <button
          onClick={resetPolygon}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear Polygon
        </button>

        <button
          onClick={savePolygon}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Polygon
        </button>

        <button
          onClick={removeAnnotation}
          className="bg-red-800 text-white px-4 py-2 rounded"
        >
          Delete Selected
        </button>

        <span className="self-center text-gray-600">
          Click to draw • Double-click to finish • Click a blue polygon to
          select it
        </span>
      </div>
    </div>
  );
}

export default AnnotationCanvas;