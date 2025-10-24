export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TableSlot {
  id: string;
  position: Position;
  occupied: boolean;
  chairId?: string;
}

export interface BaseComponent {
  id: string;
  type: string;
  position: Position;
  rotation?: number;
}

export interface Table extends BaseComponent {
  type: "table";
  tableType: "round" | "square" | "rectangle";
  size: Size;
  seats: number;
  slots: TableSlot[];
  name: string;
  pricePerSeat: number;
}

export interface Chair extends BaseComponent {
  type: "chair";
  attachedToTable?: string;
  slotId?: string;
}

export interface Decoration extends BaseComponent {
  type: "decoration";
  decorationType: "wall" | "door" | "plant";
  size: Size;
}

export type RestaurantComponent = Table | Chair | Decoration;

export interface RestaurantLayout {
  id: string | null;
  name: string;
  components: RestaurantComponent[];
  canvasSize: Size;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  tableId: string;
  chairId?: string;
  customerName: string;
  customerEmail: string;
  reservationTime: string;
  partySize: number;
  status: "pending" | "confirmed" | "cancelled";
}

export interface BookingState {
  selectedComponents: string[];
  reservations: Reservation[];
}
