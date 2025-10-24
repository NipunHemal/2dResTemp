'use client';

import React from 'react';
import { Circle, Group } from 'react-konva';
import { Chair as ChairType } from '@/types/restaurant';

interface ChairProps {
  chair: ChairType;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: (e: any) => void;
  onDragMove: (e: any) => void;
  isCustomerView?: boolean;
  isBooked?: boolean;
}

const Chair: React.FC<ChairProps> = ({
  chair,
  isSelected,
  isDragging,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragMove,
  isCustomerView = false,
  isBooked = false
}) => {
  const radius = 15;

  const getChairColor = () => {
    if (isBooked) return '#ef4444'; // red-500
    if (isSelected) return '#3b82f6'; // blue-500
    if (isDragging) return '#94a3b8'; // slate-400
    if (chair.attachedToTable) return '#10b981'; // emerald-500
    return '#e2e8f0'; // slate-200
  };

  const getStrokeColor = () => {
    if (isBooked) return '#dc2626'; // red-600
    if (isSelected) return '#2563eb'; // blue-600
    if (chair.attachedToTable) return '#059669'; // emerald-600
    return '#94a3b8'; // slate-400
  };

  return (
    <Group
      x={chair.position.x}
      y={chair.position.y}
      draggable={!isCustomerView && !chair.attachedToTable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragMove={onDragMove}
      onClick={onSelect}
      onTap={onSelect}
    >
      <Circle
        radius={radius}
        fill={getChairColor()}
        stroke={getStrokeColor()}
        strokeWidth={2}
        shadowColor="rgba(0, 0, 0, 0.2)"
        shadowBlur={isDragging ? 8 : 3}
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={0.3}
      />
      {/* Chair back indicator */}
      <Circle
        radius={radius * 0.6}
        fill="rgba(255, 255, 255, 0.3)"
        x={0}
        y={-2}
      />
    </Group>
  );
};

export default Chair;