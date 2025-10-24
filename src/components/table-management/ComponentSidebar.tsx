"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CircleIcon,
  SquareIcon,
  RectangleHorizontalIcon,
  ArmchairIcon as ChairIcon,
  WalletIcon as WallIcon,
  DoorOpenIcon,
  TreesIcon as TreeIcon,
} from "lucide-react";

import useRestaurantStore from "@/lib/stores/restaurant-store";

const ComponentSidebar: React.FC = () => {
  const { addComponent } = useRestaurantStore();

  const addTable = (type: "round" | "square" | "rectangle") => {
    const sizeMap = {
      round: { width: 80, height: 80 },
      square: { width: 80, height: 80 },
      rectangle: { width: 120, height: 60 },
    };

    addComponent({
      type: "table" as const,
      tableType: type,
      position: { x: 400, y: 300 },
      size: sizeMap[type],
      seats: type === "rectangle" ? 6 : 4,
      slots: [],
      name: `Table ${type}`,
      rotation: 0,
      pricePerSeat: 0,
    });
  };

  const addChair = () => {
    addComponent({
      type: "chair" as const,
      position: { x: 300, y: 300 },
    });
  };

  const addDecoration = (decorationType: "wall" | "door" | "plant") => {
    const sizeMap = {
      wall: { width: 100, height: 20 },
      door: { width: 80, height: 20 },
      plant: { width: 40, height: 40 },
    };

    addComponent({
      type: "decoration" as const,
      decorationType,
      position: { x: 350, y: 250 },
      size: sizeMap[decorationType],
      rotation: 0,
    });
  };

  return (
    <div className="w-52 h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Tables Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tables</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={() => addTable("round")}
            >
              <CircleIcon className="h-4" />
              Round
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={() => addTable("square")}
            >
              <SquareIcon className="h-4" />
              Square
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={() => addTable("rectangle")}
            >
              <RectangleHorizontalIcon className="h-4" />
              Rectangle
            </Button>
          </CardContent>
        </Card>

        {/* Seating Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Seating</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={addChair}
            >
              <ChairIcon className="h-4" />
              Chair
            </Button>
          </CardContent>
        </Card>

        {/* Decorations Section */}
        <Card >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Decorations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={() => addDecoration("wall")}
            >
              <WallIcon className="h-4" />
              Wall
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={() => addDecoration("door")}
            >
              <DoorOpenIcon className="h-4" />
              Door
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={() => addDecoration("plant")}
            >
              <TreeIcon className="h-4" />
              Plant
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentSidebar;
