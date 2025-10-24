"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import useRestaurantStore from "@/lib/stores/restaurant-store";
import {
  RestaurantComponent,
  Table,
  Chair as ChairType,
  Decoration,
} from "@/types/restaurant";
import TableRound from "@/components/draggable/TableRound/TableRound";
import TableSquare from "@/components/draggable/TableSquare/TableSquare";
import TableRectangle from "@/components/draggable/TableRectangle/TableRectangle";
import Chair from "@/components/draggable/Chair/Chair";
import Wall from "@/components/draggable/Wall/Wall";

// Ensure React is properly initialized for Konva
if (typeof window !== "undefined") {
  // This helps with React-Konva compatibility issues
  require("react-konva");
}

const RestaurantCanvas: React.FC = () => {
  const {
    currentLayout,
    selectedComponent,
    selectComponent,
    updateComponent,
    canvasSize,
    attachChairToTable,
    detachChair,
  } = useRestaurantStore();

  const stageRef = useRef(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleComponentSelect = (componentId: string) => {
    selectComponent(componentId === selectedComponent ? null : componentId);
  };

  const handleDragStart = (componentId: string) => {
    setDraggedId(componentId);
    selectComponent(componentId);
  };

  const updateComponentPosition = (
    componentId: string,
    e: any
  ): { x: number; y: number } => {
    const node = e.target;
    const newPos = { x: node.x(), y: node.y() };
    updateComponent(componentId, { position: newPos });
    return newPos;
  };

  const handleDragEnd = (componentId: string, e: any) => {
    setDraggedId(null);

    const newPos = updateComponentPosition(componentId, e);

    // Check if it's a chair and if it's being dropped near a table slot
    if (currentLayout) {
      const component = currentLayout.components.find(
        (c) => c.id === componentId
      );
      if (component && component.type === "chair") {
        const chair = component as ChairType;

        // Find nearby table slots
        for (const tableComp of currentLayout.components) {
          if (tableComp.type === "table") {
            const table = tableComp as Table;
            for (const slot of table.slots) {
              const distance = Math.sqrt(
                Math.pow(newPos.x - slot.position.x, 2) +
                  Math.pow(newPos.y - slot.position.y, 2)
              );

              if (distance < 30 && !slot.occupied) {
                // Detach from previous table if any
                if (chair.attachedToTable) {
                  detachChair(componentId);
                }
                // Attach to new table
                attachChairToTable(componentId, table.id, slot.id);
                return;
              }
            }
          }
        }
      }
    }
  };

  const handleDragMove = (componentId: string, e: any) => {
    const node = e.target;
    const newPos = { x: node.x(), y: node.y() };

    // Keep components within canvas bounds
    const component = currentLayout?.components.find(
      (c) => c.id === componentId
    );
    if (component) {
      let constrainedPos = { ...newPos };

      if (component.type === "table") {
        const table = component as Table;
        const halfWidth = table.size.width / 2;
        const halfHeight = table.size.height / 2;

        constrainedPos.x = Math.max(
          halfWidth,
          Math.min(canvasSize.width - halfWidth, newPos.x)
        );
        constrainedPos.y = Math.max(
          halfHeight,
          Math.min(canvasSize.height - halfHeight, newPos.y)
        );
      } else {
        constrainedPos.x = Math.max(
          20,
          Math.min(canvasSize.width - 20, newPos.x)
        );
        constrainedPos.y = Math.max(
          20,
          Math.min(canvasSize.height - 20, newPos.y)
        );
      }

      node.x(constrainedPos.x);
      node.y(constrainedPos.y);
    }
  };

  const handleComponentResize = (
    componentId: string,
    newSize: { width: number; height: number }
  ) => {
    updateComponent(componentId, { size: newSize });
  };

  const renderComponent = (component: RestaurantComponent) => {
    const isSelected = selectedComponent === component.id;
    const isDragging = draggedId === component.id;

    switch (component.type) {
      case "table":
        const table = component as Table;
        const commonTableProps = {
          table,
          isSelected,
          isDragging,
          onSelect: () => handleComponentSelect(component.id),
          onDragStart: () => handleDragStart(component.id),
          onDragEnd: (e: any) => handleDragEnd(component.id, e),
          onDragMove: (e: any) => handleDragMove(component.id, e),
          onResize: (e: any, newSize: { width: number; height: number }) => {
            handleComponentResize(component.id, newSize);
            updateComponentPosition(component.id, e);
          },
        };

        switch (table.tableType) {
          case "round":
            return <TableRound key={component.id} {...commonTableProps} />;
          case "square":
            return <TableSquare key={component.id} {...commonTableProps} />;
          case "rectangle":
            return <TableRectangle key={component.id} {...commonTableProps} />;
          default:
            return null;
        }

      case "chair":
        return (
          <Chair
            key={component.id}
            chair={component as ChairType}
            isSelected={isSelected}
            isDragging={isDragging}
            onSelect={() => handleComponentSelect(component.id)}
            onDragStart={() => handleDragStart(component.id)}
            onDragEnd={(e: any) => handleDragEnd(component.id, e)}
            onDragMove={(e: any) => handleDragMove(component.id, e)}
          />
        );

      case "decoration":
        const decoration = component as Decoration;
        if (decoration.decorationType === "wall") {
          return (
            <Wall
              key={component.id}
              decoration={decoration}
              isSelected={isSelected}
              isDragging={isDragging}
              onSelect={() => handleComponentSelect(component.id)}
              onDragStart={() => handleDragStart(component.id)}
              onDragEnd={(e: any) => handleDragEnd(component.id, e)}
              onDragMove={(e: any) => handleDragMove(component.id, e)}
              onResize={(
                e: any,
                newSize: { width: number; height: number }
              ) => {
                updateComponentPosition(component.id, e);
                handleComponentResize(component.id, newSize);
              }}
            />
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        ref={stageRef}
        onMouseDown={(e) => {
          // Deselect when clicking on empty canvas
          if (e.target === e.target.getStage()) {
            selectComponent(null);
          }
        }}
      >
        <Layer>
          {/* Canvas background */}
          <Rect
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
            fill="#ffffff"
            stroke="#e5e7eb"
            strokeWidth={1}
          />

          {/* Grid pattern */}
          {Array.from({ length: Math.ceil(canvasSize.width / 20) }).map(
            (_, i) => (
              <Rect
                key={`grid-v-${i}`}
                x={i * 20}
                y={0}
                width={1}
                height={canvasSize.height}
                fill="#f3f4f6"
              />
            )
          )}
          {Array.from({ length: Math.ceil(canvasSize.height / 20) }).map(
            (_, i) => (
              <Rect
                key={`grid-h-${i}`}
                x={0}
                y={i * 20}
                width={canvasSize.width}
                height={1}
                fill="#f3f4f6"
              />
            )
          )}

          {/* Render components */}
          {currentLayout?.components.map(renderComponent)}
        </Layer>
      </Stage>
    </div>
  );
};

export default RestaurantCanvas;
