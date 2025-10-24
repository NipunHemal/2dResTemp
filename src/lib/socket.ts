import { Reservation } from "@/hook/useBookingSocket";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      transports: ["websocket"],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinMerchantRoom(merchantId: string) {
  getSocket().emit("join:restaurant", merchantId);
}

export function onNewReservation(callback: (r: Reservation) => void) {
  getSocket().on("reservation:new", callback);
}

export function offNewReservation(callback: (r: Reservation) => void) {
  getSocket().off("reservation:new", callback);
}