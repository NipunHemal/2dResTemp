"use client";

import React from "react";
import { Rect, Group, Transformer } from "react-konva";
import Konva from "konva";
import { Decoration } from "@/types/restaurant";

interface WallProps {
  decoration: Decoration;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: (e: any) => void;
  onDragMove: (e: any) => void;
  isCustomerView?: boolean;
  onResize?: (e: any, newSize: { width: number; height: number }) => void;
}

const Wall: React.FC<WallProps> = ({
  decoration,
  isSelected,
  isDragging,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragMove,
  isCustomerView = false,
  onResize,
}) => {
  const { width, height } = decoration.size;
  const wallRef = React.useRef<Konva.Group>(null);
  const rectRef = React.useRef<Konva.Rect>(null);
  const trRef = React.useRef<Konva.Transformer>(null);

  const getWallColor = () => {
    if (isSelected) return "#3b82f6"; // blue-500
    if (isDragging) return "#94a3b8"; // slate-400
    return "#6b7280"; // gray-500
  };

  // Attach transformer to the rectangle when selected
  React.useEffect(() => {
    if (!isCustomerView && isSelected && trRef.current && wallRef.current) {
      trRef.current.nodes([wallRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, isCustomerView]);

  const handleTransformEnd = (e: any) => {
    const node = wallRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = Math.max(10, width * scaleX);
    const newHeight = Math.max(5, height * scaleY);

    // reset scales to avoid compounding
    node.scaleX(1);
    node.scaleY(1);

    if (onResize) {
      onResize(e, { width: newWidth, height: newHeight });
    }
  };

  return (
    <>
      <Group
        ref={wallRef}
        x={decoration.position.x}
        y={decoration.position.y}
        rotation={decoration.rotation || 0}
        draggable={!isCustomerView}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
        onClick={onSelect}
        onTap={onSelect}
        onTransformEnd={handleTransformEnd}
      >
        <Rect
          ref={rectRef}
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          fill={getWallColor()}
          stroke="#374151"
          strokeWidth={1}
          shadowColor="rgba(0, 0, 0, 0.3)"
          shadowBlur={isDragging ? 8 : 4}
          shadowOffset={{ x: 2, y: 2 }}
          shadowOpacity={0.4}
        />
      </Group>

      {!isCustomerView && isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          enabledAnchors={[
            "top-left",
            "top-center",
            "top-right",
            "middle-right",
            "bottom-right",
            "bottom-center",
            "bottom-left",
            "middle-left",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            const minW = 10;
            const minH = 5;
            if (newBox.width < minW || newBox.height < minH) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default Wall;
