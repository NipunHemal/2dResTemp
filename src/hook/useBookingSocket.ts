import { useEffect } from "react";
import { joinMerchantRoom, onNewReservation, offNewReservation, disconnectSocket } from "@/lib/socket";

export type Reservation = {
  date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  table_id: string;
  table_number: string;
  merchant_id: string; // 🟢 mongo ObjectId (string)
  merchant_name: string;
  customer_email: string;
  customer_number: string;
  customer_name: string;
  reference: string;
  reservation_fee: number;
};

export function useReservationSocket(
  merchantId: string,
  onNew: (r: Reservation) => void
) {
  useEffect(() => {
    console.log("Joining room for merchant:", merchantId);
    joinMerchantRoom(merchantId);
    onNewReservation(onNew);

    return () => {
      offNewReservation(onNew);
      disconnectSocket();
    };
  }, [merchantId, onNew]);
}
