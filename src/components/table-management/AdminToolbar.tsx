"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SaveIcon,
  DownloadIcon,
  TrashIcon,
  RotateCwIcon,
  Loader2Icon,
  Copy,
} from "lucide-react";
import useRestaurantStore from "@/lib/stores/restaurant-store";
import { RestaurantLayout, Table } from "@/types/restaurant";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const AdminToolbar = ({
  triggerRefish,
  handelClose,
  isEdit = false,
  mapObj = null,
}: {
  triggerRefish: any;
  handelClose: any;
  isEdit?: boolean;
  mapObj?: RestaurantLayout | null;
}) => {
  const {
    currentLayout,
    selectedComponent,
    updateComponent,
    removeComponent,
    updateCurrentLayout,
    exportLayout,
    importLayout,
    createNewLayout,
  } = useRestaurantStore();

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [importText, setImportText] = useState("");

  const selectedComp = currentLayout?.components.find(
    (c) => c.id === selectedComponent
  );

  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  const handleExport = () => {
    const json = exportLayout();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentLayout?.name || "restaurant-layout"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const json = exportLayout();
    const layoutData = JSON.parse(json);
    navigator.clipboard.writeText(JSON.stringify(layoutData));
  };

  const handleImport = (importObj?: RestaurantLayout | null) => {
    if (importObj) {
      importLayout(JSON.stringify(importObj));
    } else {
      if (importText.trim()) {
        try {
          importLayout(importText);
          setImportText("");
          toast.success("Layout imported successfully!");
        } catch (error) {
          alert("Invalid JSON format");
        }
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const json = exportLayout();
    const layoutData = JSON.parse(json);
    const merchantId = session?.user.id;

    try {
      const mappedLayout = {
        merchant_id: merchantId,
        section: layoutData?.name,
        components: layoutData?.components || [],
        canvasSize: layoutData?.canvasSize || { width: 800, height: 600 },
      };

      if (!merchantId) {
        toast.error("User not authenticated. Please log in.");
        return;
      }

      if (mappedLayout.components.length === 0) {
        toast.error("Layout is empty. Please add components before saving.");
        return;
      }

      if (!mappedLayout.section) {
        toast.error("Layout name is empty. Please add a name before saving.");
        return;
      }

      if (
        mappedLayout.components.filter((c: any) => c.type === "table")
          .length === 0
      ) {
        toast.error("Layout must contain at least one table.");
        return;
      }

      if (
        mappedLayout.components
          .filter((c: any) => c.type === "table")
          .some((t: any) => !t.name || t.name.trim() === "")
      ) {
        toast.error(
          "All tables must have a name. Please name all tables before saving."
        );
        return;
      }

      const response = await fetch(`${backend_url}/selection-model`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedLayout),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save layout.");
        return;
      }

      const data = await response.json();
      console.log(data);
      toast.success("Layout saved successfully!");
      triggerRefish();
      createNewLayout();
    } catch (error) {
      toast.error("Failed to save layout.");
      console.error("Error saving layout:", error);
    } finally {
      setIsLoading(false);
      handelClose();
    }
  };

  const handelUpdate = async () => {
    setIsLoading(true);
    const json = exportLayout();
    const layoutData = JSON.parse(json);
    const merchantId = session?.user.id;

    try {
      const mappedLayout = {
        merchant_id: merchantId,
        section: layoutData?.name,
        components: layoutData?.components || [],
        canvasSize: layoutData?.canvasSize || { width: 800, height: 600 },
      };

      if (!merchantId) {
        toast.error("User not authenticated. Please log in.");
        return;
      }

      if (mappedLayout.components.length === 0) {
        toast.error("Layout is empty. Please add components before updating.");
        return;
      }

      if (!mappedLayout.section) {
        toast.error("Layout name is empty. Please add a name before updating.");
        return;
      }

      if (
        mappedLayout.components.filter((c: any) => c.type === "table")
          .length === 0
      ) {
        toast.error("Layout must contain at least one table.");
        return;
      }

      if (
        mappedLayout.components
          .filter((c: any) => c.type === "table")
          .some((t: any) => !t.name || t.name.trim() === "")
      ) {
        toast.error(
          "All tables must have a name. Please name all tables before updating."
        );
        return;
      }

      const response = await fetch(
        `${backend_url}/selection-model/${layoutData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mappedLayout),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update layout.");
        return;
      }

      const data = await response.json();
      console.log(data);
      toast.success("Layout update successfully!");
      triggerRefish();
      createNewLayout();
    } catch (error) {
      toast.error("Failed to update layout.");
      console.error("Error updating layout:", error);
    } finally {
      setIsLoading(false);
      handelClose();
    }
  };

  const handleRotate = () => {
    if (selectedComponent) {
      const currentRotation = selectedComp?.rotation || 0;
      updateComponent(selectedComponent, {
        rotation: (currentRotation + 45) % 360,
      });
    }
  };

  const handleTablePropertyChange = (property: string, value: any) => {
    if (selectedComponent && selectedComp?.type === "table") {
      if (
        property === "name" ||
        property === "seats" ||
        property === "pricePerSeat"
      ) {
        updateComponent(selectedComponent, { [property]: value });
      } else if (property === "width" || property === "height") {
        const table = selectedComp as Table;
        const newSize = { ...table.size, [property]: Number(value) };
        updateComponent(selectedComponent, { size: newSize });
      }
    }
  };

  useEffect(() => {
    if (mapObj != null) {
      handleImport(mapObj);
    }
  }, []);

  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Selected Component Properties */}
        {selectedComp && (
          <Card>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 items-center justify-between">
                <h3 className="font-medium">Selected: {selectedComp.type}</h3>
                <div className="flex gap-1">
                  {selectedComp.type !== "chair" && (
                    <Button size="sm" variant="outline" onClick={handleRotate}>
                      <RotateCwIcon className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeComponent(selectedComponent!)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedComp.type === "table" && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="tableName">Table Name</Label>
                    <Input
                      id="tableName"
                      value={(selectedComp as Table).name}
                      onChange={(e) =>
                        handleTablePropertyChange("name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerSeat">Price Per Seat</Label>
                    <Input
                      id="pricePerSeat"
                      defaultValue={""}
                      value={(selectedComp as Table).pricePerSeat}
                      onChange={(e) =>
                        handleTablePropertyChange(
                          "pricePerSeat",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="seats">Number of Seats</Label>
                    <Input
                      id="seats"
                      type="number"
                      min="1"
                      max="12"
                      value={(selectedComp as Table).seats}
                      onChange={(e) =>
                        handleTablePropertyChange(
                          "seats",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        min="40"
                        max="200"
                        value={(selectedComp as Table).size.width}
                        onChange={(e) =>
                          handleTablePropertyChange("width", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        min="40"
                        max="200"
                        value={(selectedComp as Table).size.height}
                        onChange={(e) =>
                          handleTablePropertyChange("height", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Position: ({Math.round(selectedComp.position.x)},{" "}
                {Math.round(selectedComp.position.y)})
                {selectedComp.rotation && (
                  <> • Rotation: {selectedComp.rotation}°</>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Layout Info */}
        {currentLayout && (
          <Card className="bg-green-50 border-green-200">
            <CardContent>
              <h4 className="font-medium text-green-900 mb-2">
                Current Layout
              </h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>Name: {currentLayout.name}</p>
                <p>Components: {currentLayout.components.length}</p>
                <p>
                  Tables:{" "}
                  {
                    currentLayout.components.filter((c) => c.type === "table")
                      .length
                  }
                </p>
                <p>
                  Chairs:{" "}
                  {
                    currentLayout.components.filter((c) => c.type === "chair")
                      .length
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Operations */}
        <Card>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Map Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter map name here..."
                value={currentLayout?.name}
                onChange={(e) => updateCurrentLayout("name", e.target.value)}
                className="text-xs"
              />
            </div>

            <Button
              onClick={isEdit ? handelUpdate : handleSave}
              size="sm"
              className="w-full"
              // disabled={!importText.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
                  {isEdit ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-1" />
                  {isEdit ? "Update Map" : "Save Map"}
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={createNewLayout}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button
                onClick={handleExport}
                size="sm"
                variant="outline"
                className="flex-1"
                disabled={!currentLayout}
              >
                <DownloadIcon className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline"
                className="flex-1"
                disabled={!currentLayout}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="import" className="text-sm font-medium">
                Import Layout JSON
              </Label>
              <Textarea
                id="import"
                placeholder="Paste JSON here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={4}
                className="text-xs"
              />
              <Button
                onClick={handleImport}
                size="sm"
                className="w-full"
                disabled={!importText.trim()}
              >
                <UploadIcon className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminToolbar;
