"use client";

import React, { useRef, useEffect } from "react";
import { Rect, Text, Group, Circle, Transformer } from "react-konva";
import Konva from "konva";
import { Table } from "@/types/restaurant";

interface TableRectangleProps {
  table: Table;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: (e: any) => void;
  onDragMove: (e: any) => void;
  onResize?: (e: any, newSize: { width: number; height: number }) => void;
  isCustomerView?: boolean;
  isBooked?: boolean;
}

const TableRectangle: React.FC<TableRectangleProps> = ({
  table,
  isSelected,
  isDragging,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragMove,
  onResize,
  isCustomerView = false,
  isBooked = false,
}) => {
  const { width, height } = table.size;
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const chairRadius = 6;
  const chairSpacing = 10;

  const getTableColor = () => {
    if (isBooked) return "#ef4444"; // red-500
    if (isSelected) return "#3b82f6"; // blue-500
    if (isDragging) return "#94a3b8"; // slate-400
    return "#f1f5f9"; // slate-100
  };

  const getStrokeColor = () => {
    if (isBooked) return "#dc2626"; // red-600
    if (isSelected) return "#2563eb"; // blue-600
    return "#64748b"; // slate-500
  };

  useEffect(() => {
    if (!isCustomerView && isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, isCustomerView]);

  const handleTransformEnd = (e: any) => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = Math.max(60, width * scaleX);
    const newHeight = Math.max(40, height * scaleY);

    // Reset scales to avoid compounding
    node.scaleX(1);
    node.scaleY(1);

    if (onResize) {
      onResize(e, { width: newWidth, height: newHeight });
    }
  };

  const renderChairs = () => {
    const chairs: JSX.Element[] = [];
    const seatCount = table.seats;

    // 🔹 Special case for 6 seats
    if (seatCount === 6) {
      // top 2
      for (let i = 0; i < 2; i++) {
        const x = -width / 2 + (i + 1) * (width / 3);
        chairs.push(
          <Circle
            key={`top-${i}`}
            x={x}
            y={-height / 2 - chairSpacing}
            radius={chairRadius}
            fill="#94a3b8"
          />
        );
      }
      // bottom 2
      for (let i = 0; i < 2; i++) {
        const x = -width / 2 + (i + 1) * (width / 3);
        chairs.push(
          <Circle
            key={`bottom-${i}`}
            x={x}
            y={height / 2 + chairSpacing}
            radius={chairRadius}
            fill="#94a3b8"
          />
        );
      }
      // left 1
      chairs.push(
        <Circle
          key="left-0"
          x={-width / 2 - chairSpacing}
          y={0}
          radius={chairRadius}
          fill="#94a3b8"
        />
      );
      // right 1
      chairs.push(
        <Circle
          key="right-0"
          x={width / 2 + chairSpacing}
          y={0}
          radius={chairRadius}
          fill="#94a3b8"
        />
      );
      return chairs;
    }

    // 🔹 Default dynamic distribution
    let seatsPlaced = 0;

    // top side
    const topCount = Math.min(
      Math.ceil(seatCount / 4),
      seatCount - seatsPlaced
    );
    for (let i = 0; i < topCount; i++) {
      const x = -width / 2 + (i + 1) * (width / (topCount + 1));
      chairs.push(
        <Circle
          key={`top-${i}`}
          x={x}
          y={-height / 2 - chairSpacing}
          radius={chairRadius}
          fill="#94a3b8"
        />
      );
      seatsPlaced++;
    }

    // bottom side
    const bottomCount = Math.min(
      Math.ceil(seatCount / 4),
      seatCount - seatsPlaced
    );
    for (let i = 0; i < bottomCount; i++) {
      const x = -width / 2 + (i + 1) * (width / (bottomCount + 1));
      chairs.push(
        <Circle
          key={`bottom-${i}`}
          x={x}
          y={height / 2 + chairSpacing}
          radius={chairRadius}
          fill="#94a3b8"
        />
      );
      seatsPlaced++;
    }

    // left side
    const leftCount = Math.min(
      Math.ceil(seatCount / 4),
      seatCount - seatsPlaced
    );
    for (let i = 0; i < leftCount; i++) {
      const y = -height / 2 + (i + 1) * (height / (leftCount + 1));
      chairs.push(
        <Circle
          key={`left-${i}`}
          x={-width / 2 - chairSpacing}
          y={y}
          radius={chairRadius}
          fill="#94a3b8"
        />
      );
      seatsPlaced++;
    }

    // right side
    const rightCount = seatCount - seatsPlaced;
    for (let i = 0; i < rightCount; i++) {
      const y = -height / 2 + (i + 1) * (height / (rightCount + 1));
      chairs.push(
        <Circle
          key={`right-${i}`}
          x={width / 2 + chairSpacing}
          y={y}
          radius={chairRadius}
          fill="#94a3b8"
        />
      );
      seatsPlaced++;
    }

    return chairs;
  };

  return (
    <>
      <Group
        ref={shapeRef}
        x={table.position.x}
        y={table.position.y}
        rotation={table.rotation || 0}
        draggable={!isCustomerView}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
        onClick={onSelect}
        onTap={onSelect}
        onTransformEnd={handleTransformEnd}
      >
        {/* Table rectangle */}
        <Rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          fill={getTableColor()}
          stroke={getStrokeColor()}
          strokeWidth={2}
          cornerRadius={8}
          shadowColor="rgba(0, 0, 0, 0.2)"
          shadowBlur={isDragging ? 10 : 5}
          shadowOffset={{ x: 2, y: 2 }}
          shadowOpacity={0.3}
        />

        {/* Table name */}
        <Text
          text={table.name}
          fontSize={14}
          fontFamily="Arial"
          fill="#1f2937"
          width={width}
          align="center"
          x={-width / 2}
          y={-10}
        />

        {/* Seats count text */}
        <Text
          text={`${table.seats} seats`}
          fontSize={10}
          fontFamily="Arial"
          fill="#6b7280"
          width={width}
          align="center"
          x={-width / 2}
          y={5}
        />

        {/* Chairs */}
        {renderChairs()}
      </Group>

      {/* Resizer */}
      {!isCustomerView && isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
            "top-center",
            "bottom-center",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 60 || newBox.height < 40) {
              return oldBox; // prevent too small
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default TableRectangle;
