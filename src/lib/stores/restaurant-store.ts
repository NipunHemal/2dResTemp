import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ObjectId } from "bson";
import {
  RestaurantComponent,
  RestaurantLayout,
  Position,
  Size,
  Table,
  Chair,
  Decoration,
  Reservation,
  BookingState,
} from "@/types/restaurant";

interface RestaurantStore {
  // Admin Panel State
  currentLayout: RestaurantLayout | null;
  selectedComponent: string | null;
  draggedComponent: RestaurantComponent | null;
  canvasSize: Size;

  // Customer App State
  bookingState: BookingState;

  // Admin Actions
  setCurrentLayout: (layout: RestaurantLayout | null) => void;
  addComponent: (
    component: Omit<Table, "id"> | Omit<Chair, "id"> | Omit<Decoration, "id">
  ) => void;
  updateComponent: (id: string, updates: Partial<RestaurantComponent>) => void;
  removeComponent: (id: string) => void;
  updateCurrentLayout: (target: string, value: any) => void;
  selectComponent: (id: string | null) => void;
  setDraggedComponent: (component: RestaurantComponent | null) => void;
  exportLayout: () => string;
  importLayout: (json: string) => void;
  attachChairToTable: (
    chairId: string,
    tableId: string,
    slotId: string
  ) => void;
  detachChair: (chairId: string) => void;

  // Customer Actions
  toggleComponentSelection: (componentId: string) => void;
  createReservation: (reservation: Omit<Reservation, "id">) => void;
  getReservationsForComponent: (componentId: string) => Reservation[];

  // Utility Actions
  createNewLayout: () => void;
  generateTableSlots: (table: Table) => Table;
}

const useRestaurantStore = create<RestaurantStore>()(
  devtools((set, get) => ({
    // Initial State
    currentLayout: null,
    selectedComponent: null,
    draggedComponent: null,
    canvasSize: { width: 1200, height: 800 },
    bookingState: {
      selectedComponents: [],
      reservations: [],
    },

    // Admin Actions
    setCurrentLayout: (layout) => set({ currentLayout: layout }),

    addComponent: (component) =>
      set((state) => {
        if (!state.currentLayout) return state;

        const newComponent: RestaurantComponent = {
          ...component,
          id: new ObjectId().toString(),
        } as RestaurantComponent;

        // Generate slots for tables
        if (newComponent.type === "table") {
          const tableWithSlots = get().generateTableSlots(
            newComponent as Table
          );
          (newComponent as Table).slots = tableWithSlots.slots;
        }

        return {
          currentLayout: {
            ...state.currentLayout,
            components: [...state.currentLayout.components, newComponent],
            updatedAt: new Date().toISOString(),
          },
        };
      }),

    updateComponent: (id, updates) =>
      set((state) => {
        console.log(updates);
        if (!state.currentLayout) return state;

        return {
          currentLayout: {
            ...state.currentLayout,
            components: state.currentLayout.components.map((comp) =>
              comp.id === id
                ? ({ ...comp, ...updates } as RestaurantComponent)
                : comp
            ),
            updatedAt: new Date().toISOString(),
          },
        };
      }),

    removeComponent: (id) =>
      set((state) => {
        if (!state.currentLayout) return state;

        // Also remove any chairs attached to this table
        const componentsToRemove = [id];
        const component = state.currentLayout.components.find(
          (c) => c.id === id
        );

        if (component && component.type === "table") {
          const attachedChairs = state.currentLayout.components.filter(
            (c) => c.type === "chair" && (c as Chair).attachedToTable === id
          );
          componentsToRemove.push(...attachedChairs.map((c) => c.id));
        }

        return {
          currentLayout: {
            ...state.currentLayout,
            components: state.currentLayout.components.filter(
              (comp) => !componentsToRemove.includes(comp.id)
            ),
            updatedAt: new Date().toISOString(),
          },
        };
      }),

    updateCurrentLayout: (target, value) =>
      set((state) => {
        if (!state.currentLayout) return state;

        return {
          currentLayout: {
            ...state.currentLayout,
            [target]: value,
            updatedAt: new Date().toISOString(),
          },
        };
      }),

    selectComponent: (id) => set({ selectedComponent: id }),

    setDraggedComponent: (component) => set({ draggedComponent: component }),

    exportLayout: () => {
      const state = get();
      if (!state.currentLayout) return "{}";
      return JSON.stringify(state.currentLayout, null, 2);
    },

    importLayout: (json) => {
      try {
        const layout = JSON.parse(json) as RestaurantLayout;
        set({ currentLayout: layout });
      } catch (error) {
        console.error("Failed to import layout:", error);
      }
    },

    attachChairToTable: (chairId, tableId, slotId) =>
      set((state) => {
        if (!state.currentLayout) return state;

        const table = state.currentLayout.components.find(
          (c) => c.id === tableId
        ) as Table;
        const chair = state.currentLayout.components.find(
          (c) => c.id === chairId
        ) as Chair;

        if (!table || !chair) return state;

        const slot = table.slots.find((s) => s.id === slotId);
        if (!slot || slot.occupied) return state;

        return {
          currentLayout: {
            ...state.currentLayout,
            components: state.currentLayout.components.map((comp) => {
              if (comp.id === tableId) {
                return {
                  ...comp,
                  slots: (comp as Table).slots.map((s) =>
                    s.id === slotId ? { ...s, occupied: true, chairId } : s
                  ),
                };
              }
              if (comp.id === chairId) {
                return {
                  ...comp,
                  attachedToTable: tableId,
                  slotId: slotId,
                  position: { x: slot.position.x, y: slot.position.y },
                };
              }
              return comp;
            }),
            updatedAt: new Date().toISOString(),
          },
        };
      }),

    detachChair: (chairId) =>
      set((state) => {
        if (!state.currentLayout) return state;

        const chair = state.currentLayout.components.find(
          (c) => c.id === chairId
        ) as Chair;
        if (!chair || !chair.attachedToTable) return state;

        return {
          currentLayout: {
            ...state.currentLayout,
            components: state.currentLayout.components.map((comp) => {
              if (comp.id === chair.attachedToTable) {
                return {
                  ...comp,
                  slots: (comp as Table).slots.map((s) =>
                    s.chairId === chairId
                      ? { ...s, occupied: false, chairId: undefined }
                      : s
                  ),
                };
              }
              if (comp.id === chairId) {
                return {
                  ...comp,
                  attachedToTable: undefined,
                  slotId: undefined,
                };
              }
              return comp;
            }),
            updatedAt: new Date().toISOString(),
          },
        };
      }),

    // Customer Actions
    toggleComponentSelection: (componentId) =>
      set((state) => ({
        bookingState: {
          ...state.bookingState,
          selectedComponents: state.bookingState.selectedComponents.includes(
            componentId
          )
            ? state.bookingState.selectedComponents.filter(
                (id) => id !== componentId
              )
            : [...state.bookingState.selectedComponents, componentId],
        },
      })),

    createReservation: (reservation) =>
      set((state) => ({
        bookingState: {
          ...state.bookingState,
          reservations: [
            ...state.bookingState.reservations,
            { ...reservation, id: new ObjectId().toString() },
          ],
        },
      })),

    getReservationsForComponent: (componentId) => {
      const state = get();
      return state.bookingState.reservations.filter(
        (r) => r.tableId === componentId || r.chairId === componentId
      );
    },

    // Utility Actions
    createNewLayout: () => {
      const newLayout: RestaurantLayout = {
        id: new ObjectId().toString(),
        name: "New Restaurant Layout",
        components: [],
        canvasSize: get().canvasSize,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set({ currentLayout: newLayout });
    },

    generateTableSlots: (table) => {
      const slots: Table["slots"] = [];
      const { x, y } = table.position;
      const { width, height } = table.size;
      const seatCount = table.seats;

      if (table.tableType === "round") {
        const radius = width / 2;
        for (let i = 0; i < seatCount; i++) {
          const angle = (2 * Math.PI * i) / seatCount;
          const slotX = x + Math.cos(angle) * (radius + 30);
          const slotY = y + Math.sin(angle) * (radius + 30);
          slots.push({
            id: new ObjectId().toString(),
            position: { x: slotX, y: slotY },
            occupied: false,
          });
        }
      } else {
        // Rectangle and square tables
        const perimeter = 2 * (width + height);
        const spacing = perimeter / seatCount;

        for (let i = 0; i < seatCount; i++) {
          const distance = spacing * i;
          let slotX, slotY;

          if (distance <= width) {
            // Top edge
            slotX = x - width / 2 + distance;
            slotY = y - height / 2 - 30;
          } else if (distance <= width + height) {
            // Right edge
            slotX = x + width / 2 + 30;
            slotY = y - height / 2 + (distance - width);
          } else if (distance <= 2 * width + height) {
            // Bottom edge
            slotX = x + width / 2 - (distance - width - height);
            slotY = y + height / 2 + 30;
          } else {
            // Left edge
            slotX = x - width / 2 - 30;
            slotY = y + height / 2 - (distance - 2 * width - height);
          }

          slots.push({
            id: new ObjectId().toString(),
            position: { x: slotX, y: slotY },
            occupied: false,
          });
        }
      }

      return { ...table, slots };
    },
  }))
);

export default useRestaurantStore;
