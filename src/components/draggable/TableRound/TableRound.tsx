"use client";

import React, { useRef, useEffect } from "react";
import { Circle, Text, Group, Transformer } from "react-konva";
import Konva from "konva";
import { Table } from "@/types/restaurant";

interface TableRoundProps {
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

const TableRound: React.FC<TableRoundProps> = ({
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
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const circleRef = useRef<Konva.Circle>(null);

  const radius = table.size.width / 2;
  const chairRadius = 10; // chair size
  const chairDistance = radius + 20; // how far chairs sit from table

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

  // Generate chair positions
  const chairs = Array.from({ length: table.seats }, (_, i) => {
    const angle = (i / table.seats) * Math.PI * 2; // evenly spaced
    const x = Math.cos(angle) * chairDistance;
    const y = Math.sin(angle) * chairDistance;
    return { x, y };
  });

  const handleTransformEnd = (e: any) => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // For round tables, use the average of scaleX and scaleY to maintain circular shape
    const avgScale = (scaleX + scaleY) / 2;
    const newSize = Math.max(30, radius * 2 * avgScale);

    // Reset scales to avoid compounding
    node.scaleX(1);
    node.scaleY(1);

    if (onResize) {
      onResize(e, { width: newSize, height: newSize });
    }
  };

  return (
    <>
      <Group
        ref={shapeRef}
        x={table.position.x}
        y={table.position.y}
        draggable={!isCustomerView}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
        onClick={onSelect}
        onTap={onSelect}
        onTransformEnd={handleTransformEnd}
      >
        {/* Table */}
        <Circle
          ref={circleRef}
          radius={radius}
          fill={getTableColor()}
          stroke={getStrokeColor()}
          strokeWidth={2}
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
          width={radius * 2}
          align="center"
          x={-radius}
          y={-10}
        />

        {/* Seats count text */}
        <Text
          text={`${table.seats} seats`}
          fontSize={10}
          fontFamily="Arial"
          fill="#6b7280"
          width={radius * 2}
          align="center"
          x={-radius}
          y={5}
        />

        {/* Chairs around table */}
        {chairs.map((chair, idx) => (
          <Circle
            key={idx}
            x={chair.x}
            y={chair.y}
            radius={chairRadius}
            fill="#e2e8f0" // slate-200
            stroke="#475569" // slate-600
            strokeWidth={1}
          />
        ))}
      </Group>

      {/* Resizer */}
      {!isCustomerView && isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          keepRatio={true}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox; // prevent too small
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default TableRound;