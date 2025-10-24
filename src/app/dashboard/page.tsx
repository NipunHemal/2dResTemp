"use client";
import Sidebar from "@/comp/Sidebar";
import React, { useEffect, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Reservation, useReservationSocket } from "@/hook/useBookingSocket";
import { createBeep } from "@/components/sound/playBeep";
import { CalendarIcon, TableIcon } from "lucide-react";

const Page = () => {
  // const data = [
  //   { name: 'Jan', reservations: 30 },
  //   { name: 'Feb', reservations: 20 },
  //   { name: 'Mar', reservations: 27 },
  //   { name: 'Apr', reservations: 23 },
  //   { name: 'May', reservations: 34 },
  //   { name: 'Jun', reservations: 45 },
  //   { name: 'Jul', reservations: 40 },
  //   { name: 'Aug', reservations: 50 },
  //   { name: 'Sep', reservations: 33 },
  //   { name: 'Oct', reservations: 42 },
  //   { name: 'Nov', reservations: 38 },
  //   { name: 'Dec', reservations: 48 },
  // ];

  const { data: session, status } = useSession();

  // socket
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [newReservationsAlert, setNewReservationsAlert] =
    useState<boolean>(false);

  // useReservationSocket(session?.user?.id || "", (r) => {
  //   setReservations((prev) => [...prev, r]);
  // });

  const merchantId = session?.user?.id || "";
  console.log("merchantId", merchantId);

  useReservationSocket(merchantId, (r) => {
    setReservations((prev) => [...prev, r]);
    setNewReservationsAlert(true);
  });

  console.log("new reservation", reservations);

  //  DATAS

  const [todayCount, setTodayCount] = useState(0);
  const [yesterdayCount, setYesterdayCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const beepRef = useRef<ReturnType<typeof createBeep> | null>(null);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [pendingReservations, setpendingReservations] = useState<any>([]);
  const [pendingReservationAlert, setPendingReservationAlert] =
    useState<boolean>(false);

  const handleCloseReservationAlert = () => {
    setNewReservationsAlert(false);
    setPendingReservationAlert(false);
  };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Fetch all pending reservations for a given merchant.
   *
   * @param {string} merchantId
   * @returns {Promise<Reservation[]>}
   * @throws {Error} if failed to fetch the reservations
   */
  /*******  8acc10ed-760b-4d27-b2ef-04a52e2c7036  *******/
  const getAllPendingReservations = async (merchantId: string) => {
    try {
      const response = await fetch(
        `${backend_url}/reservations/reservations/pending/${merchantId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tables");
      }
      const pendingReservationsNew = await response.json();
      // return tables;
      console.log(pendingReservationsNew);
      setpendingReservations(pendingReservationsNew);
      setPendingReservationAlert(true);
      if (pendingReservationsNew.length > 0) {
        setPendingReservationAlert(true);
      } else {
        handleCloseReservationAlert();
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      return [];
    }
  };

  useEffect(() => {
    getAllPendingReservations(session?.user.id as string);
  }, [session?.user.id]);

  useEffect(() => {
    if (!beepRef.current) {
      beepRef.current = createBeep("/sounds/notifi_1.mp3");
    }
    if (pendingReservationAlert || newReservationsAlert) {
      beepRef.current.start();
    } else {
      beepRef.current.stop();
    }
  }, [pendingReservationAlert, newReservationsAlert]);

  useEffect(() => {
    const fetchReservationsCount = async () => {
      try {
        setLoading(true);

        // Fetch today's reservations count
        const todayResponse = await fetch(
          `${backend_url}/reservations/today/${session?.user.id}`
        );
        const todayData = await todayResponse.json();
        if (todayData.status === "success") {
          console.log("done");

          setTodayCount(todayData.count);
        } else {
          console.log("error");

          setError(todayData.message);
        }

        // Fetch yesterday's reservations count
        const yesterdayResponse = await fetch(
          `${backend_url}/reservations/yesterday/${session?.user.id}`
        );
        const yesterdayData = await yesterdayResponse.json();
        if (yesterdayData.status === "success") {
          console.log("done2");
          setYesterdayCount(yesterdayData.count);
        } else {
          console.log("error2");
          setError(yesterdayData.message);
        }

        // Fetch this month's reservations count
        const monthResponse = await fetch(
          `${backend_url}/reservations/month/${session?.user.id}`
        );
        const monthData = await monthResponse.json();
        if (monthData.status === "success") {
          console.log("done3");
          setMonthCount(monthData.count);
        } else {
          console.log("error3");
          setError(monthData.message);
        }
      } catch (error) {
        console.log("unexprected");
        setError("Error fetching reservations count");
      } finally {
        setLoading(false);
      }
    };

    fetchReservationsCount();
  }, [session]);

  //  DATAS

  // bar chart
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyReservations = async () => {
      try {
        const response = await fetch(
          `${backend_url}/reservations/monthly/${session?.user.id}`
        );
        const result = await response.json();

        console.log("this is result", result);

        if (result.status === "success") {
          setData(result.data);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError("Error fetching monthly reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyReservations();
  }, [session]);
  // bar chart ends

  const [lastTwoData, setLastTwoData] = useState<any>({
    lastTwoPending: [],
    lastTwoCompleted: [],
  });

  // dashboard lasta two
  useEffect(() => {
    const fetchLastTwoReservations = async () => {
      try {
        const response = await fetch(
          `${backend_url}/reservations/DashboardLastTwo/${session?.user.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result);

        setLastTwoData(result.data);
        // setLoading(false);
      } catch (err: any) {
        // setError(err);
        // setLoading(false);
      }
    };

    fetchLastTwoReservations();
  }, [session]);
  // dashboard lasta two ends

  const [showme, setshowme] = useState(false);

  // mobile ui functionality
  const absoluteElementRef = useRef<any>(null);

  const [openModal, setopenModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        absoluteElementRef.current &&
        !absoluteElementRef.current?.contains(event.target) &&
        openModal
      ) {
        setopenModal(false); // Call your function to close the modal or trigger any other action
      }
    };

    // const handleScroll = () => {
    //   if (openModal) {
    //     setopenModal(false); // Call your function to close the modal or trigger any other action
    //   }
    // };

    document.addEventListener("click", handleClickOutside);
    // window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      // window.removeEventListener("scroll", handleScroll);
    };
  }, [openModal]);

  const router = useRouter();

  // const { data: session, status } = useSession();
  // mobile ui functionality

  const [clickedTab, setclickedTab] = useState("dashboard");

  // check ban
  useEffect(() => {
    const checkBan = async () => {
      const status = await fetch(
        `${backend_url}/merchant/ban-status/${session?.user.email}`
      );
      const data = await status.json();

      if (data.isBan) {
        signOut({ callbackUrl: "/login" });
      }
    };

    checkBan();
  }, [session]);

  // check ban

  const [limitTagshow, setlimitTagshow] = useState(false);

  // free limit check
  useEffect(() => {
    console.log("email is", session?.user.email);

    const checklimit = async () => {
      const status = await fetch(
        `${backend_url}/merchant/check-block-status/${session?.user.email}`
      );
      const data = await status.json();

      console.log(data);

      if (data.block) {
        setlimitTagshow(true);
        console.log(data);
      } else {
        return null;
      }
    };

    checklimit();
  }, [session]);
  // free limit check

  useEffect(() => {
    if (session?.user.is_onb && session.user.is_ver) {
      setshowme(true);
    }
  }, [session]);

  if (session?.user.is_onb && !session.user.is_ver) {
    signOut();
  }

  if (session?.user.is_onb && !session?.user.is_ver) return null;

  return (
    showme && (
      <div className=" flex  min-h-screen   w-full overflow-hidden">
        <div className="   fixed">
          <Sidebar />
        </div>

        <div className="    lg:ml-60   md:ml-16 relative w-full overflow-x-auto  ">
          {/* mobile  */}
          <div className="  w-full  border-b md:hidden p-2 flex justify-between items-center">
            <Image
              src="/logo.png"
              alt=""
              width={500}
              height={500}
              className=" w-16 h-fit object-cover"
            />

            <svg
              onClick={() => setopenModal(true)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>

          {/* the hamburger sheet  */}

          <div
            ref={absoluteElementRef}
            className={` lg:hidden fixed transition-all  overflow-y-auto  z-50   ease-in-out   duration-500 top-0  bg-[#141823] ${
              openModal ? "right-0 w-[70%]" : " -right-full w-0"
            }  h-full `}
          >
            <div className=" px-3 py-5">
              <div className=" w-full flex border-b pb-3 border-white justify-end">
                {/* <h1 className=" text-2xl"> FILTER </h1> */}

                <svg
                  onClick={() => setopenModal(false)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.9"
                  stroke="currentColor"
                  className="w-6 h-6 text-red-400 bg-white rounded-full p-[2px]"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>

              {/* dropdowns  */}

              <div className=" w-full       overflow-y-auto     ">
                {/* showDivider={false} */}

                {status === "authenticated" && (
                  <div className=" mt-3 flex flex-col gap-3">
                    <h1
                      onClick={() => {
                        router.push("/dashboard");
                        setclickedTab("dashboard");
                      }}
                      className={` text-center ${
                        clickedTab === "dashboard"
                          ? "bg-[#FF385C]"
                          : "bg-[#2B2F39]"
                      } font-poppinsreg py-2 rounded-md border  text-white`}
                    >
                      {" "}
                      Dashboard{" "}
                    </h1>
                    <h1
                      onClick={() => {
                        router.push("/reservations");
                        setclickedTab("reservations");
                      }}
                      className={` text-center ${
                        clickedTab === "reservations"
                          ? "bg-[#FF385C]"
                          : "bg-[#2B2F39]"
                      } font-poppinsreg py-2 rounded-md border  text-white`}
                    >
                      {" "}
                      Reservations{" "}
                    </h1>
                    <h1
                      onClick={() => {
                        router.push("/tables-management");
                        setclickedTab("tables");
                      }}
                      className={` text-center ${
                        clickedTab === "tables"
                          ? "bg-[#FF385C]"
                          : "bg-[#2B2F39]"
                      } font-poppinsreg py-2 rounded-md border  text-white`}
                    >
                      Tables Management{" "}
                    </h1>
                    <h1
                      onClick={() => {
                        router.push("/billings");
                        setclickedTab("billings");
                      }}
                      className={` text-center ${
                        clickedTab === "billings"
                          ? "bg-[#FF385C]"
                          : "bg-[#2B2F39]"
                      } font-poppinsreg py-2 rounded-md border  text-white`}
                    >
                      Payments & Billings{" "}
                    </h1>
                    <h1
                      onClick={() => {
                        router.push("/settings");
                        setclickedTab("settings");
                      }}
                      className={` text-center ${
                        clickedTab === "settings"
                          ? "bg-[#FF385C]"
                          : "bg-[#2B2F39]"
                      } font-poppinsreg py-2 rounded-md border  text-white`}
                    >
                      Settings{" "}
                    </h1>

                    <h1
                      onClick={() => {
                        signOut();
                      }}
                      className=" text-center font-poppinsreg py-2 rounded-md border bg-[#2B2F39] text-white"
                    >
                      {" "}
                      Log Out{" "}
                    </h1>
                  </div>
                )}

                {/* rrrrrrrrrrrrrrrrrrrrr  */}

                {/* {
        status === "unauthenticated" &&

        <div className="mt-3 flex flex-col gap-3"> 


        <h1  onClick={() =>  {  setopenModal(false) } } className=" text-center font-poppinsreg py-2 rounded-md border bg-[#2B2F39] text-white"> Login </h1>

        <h1  onClick={() =>  {  setopenModal(false) } } className=" text-center font-poppinsreg py-2 rounded-md border bg-[#2B2F39] text-white"> Sign Up </h1>

        </div> 
      } */}
              </div>

              {/* dropdowns  */}
            </div>
          </div>
          {/* the hamburger sheet  */}

          {/* mobile  */}

          <div className=" w-full p-4 grid md:grid-cols-3  grid-cols-1 gap-4">
            <Card className="  flex flex-col gap-2 ">
              <CardHeader>
                <CardTitle className=" text-lg text-center  text-slate-700 font-poppinssemi">
                  TODAY RESERVATIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center   font-robotosemi text-[#FF385C] text-5xl">
                  {todayCount}
                </p>
              </CardContent>
            </Card>

            <Card className="  flex flex-col gap-2 ">
              <CardHeader>
                <CardTitle className=" text-lg text-center text-slate-700 font-poppinssemi">
                  YESTERDAY RESERVATIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center  font-robotosemi text-[#FF385C] text-5xl">
                  {yesterdayCount}
                </p>
              </CardContent>
            </Card>

            <Card className="  flex flex-col gap-2 ">
              <CardHeader>
                <CardTitle className=" text-lg  text-center text-slate-700 font-poppinssemi">
                  RESERVATIONS THIS MONTH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center  font-robotosemi text-[#FF385C] text-5xl">
                  {monthCount}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className=" border-b mt-4"> </div>

          <div className=" w-full p-4">
            <h1 className=" font-robotosemi text-xl text-slate-700">
              {" "}
              TOTAL RESERVATIONS{" "}
            </h1>
            <div className=" -ml-8">
              <ResponsiveContainer className="mt-5" width="100%" height={250}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar barSize={40} dataKey="reservations" fill="#FF385C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className=" border-b mt-4"> </div>

          <div className="  p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className=" w-full border-2">
              <CardHeader className=" flex flex-col gap-2">
                <CardTitle className="  font-poppinsreg5  text-lg">
                  Payments
                </CardTitle>
                <CardDescription className=" font-poppinsreg text-slate-400 text-sm">
                  A glance of all your payment info
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid mt-3 w-full items-center gap-4">
                    <div className="flex flex-col p-1 rounded-md border border-slate-300 ">
                      <h1 className="  font-poppinsreg text-slate-400">
                        {" "}
                        Pending Payout{" "}
                      </h1>
                      <p className=" font-robotosemi  text-green-700">
                        {" "}
                        LKR 32,000{" "}
                      </p>
                    </div>
                    <div className="flex flex-col  p-1 rounded-md border border-slate-300  ">
                      <h1 className="  font-poppinsreg text-slate-400">
                        {" "}
                        Last Payout{" "}
                      </h1>
                      <p className=" font-robotosemi text-green-700">
                        {" "}
                        LKR 32,000{" "}
                      </p>
                    </div>

                    <div className="flex flex-col  p-1 rounded-md border border-slate-300  ">
                      <h1 className="  font-poppinsreg text-slate-400">
                        {" "}
                        Next Payout{" "}
                      </h1>
                      <p className=" font-robotosemi text-green-700">
                        {" "}
                        15.07.2024{" "}
                      </p>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className=" w-full  border-2">
              <CardHeader className=" flex flex-col gap-2">
                <CardTitle className="font-poppinsreg5  text-lg">
                  Completed Reservations
                </CardTitle>
                <CardDescription className=" font-poppinsreg text-slate-400 text-sm">
                  Reservations completed lastly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid mt-5 w-full items-center gap-4">
                  {lastTwoData?.lastTwoCompleted.map((p: any, i: any) => (
                    <div
                      key={i}
                      className="flex flex-col p-1 gap-[3px] rounded-md  bg-[#0f402f]  "
                    >
                      <h1 className="  font-robotosemi  capitalize  text-gray-100">
                        {" "}
                        {p?.customer_name}{" "}
                      </h1>
                      <p className="  font-poppinsreg text-sm text-gray-100 ">
                        {" "}
                        Res-Date : {p?.date}{" "}
                      </p>
                      <p className=" font-poppinsreg text-sm  text-gray-100">
                        {" "}
                        {`Table : ${p?.table_number}  (Guest Count ${p?.guest_count} ) `}
                      </p>
                    </div>
                  ))}

                  {lastTwoData?.lastTwoCompleted.length === 0 && (
                    <h1 className=" text-slate-400 text-sm font-poppinsreg">
                      No data available{" "}
                    </h1>
                  )}

                  {/* <div className="flex flex-col p-1 gap-[3px] rounded-md     ">
              <h1 className='  font-robotosemi  text-gray-100'> M.M. SHANTHAN </h1>
              <p className='  font-poppinsreg text-sm text-gray-100 '>  Res-Date : 28.07.2024 </p>
              <p className=' font-poppinsreg text-sm  text-gray-100'> Table : 04  (Max-Seat-Cap 06) </p>
            </div> */}

                  {/* <div className="grid mt-5 w-full items-center gap-4">
            <div className="flex flex-col p-1 gap-[3px] rounded-md  bg-[#0f402f]   ">
              <h1 className='  font-robotosemi  text-gray-100'> M.M. SHANTHAN </h1>
              <p className='  font-poppinsreg text-sm text-gray-100 '>  Res-Date : 28.07.2024 </p>
              <p className=' font-poppinsreg text-sm  text-gray-100'> Table : 04  (Max-Seat-Cap 06) </p>
            </div>
            <div className="flex flex-col p-1 gap-[3px] rounded-md  bg-[#0f402f]  ">
              <h1 className='  font-robotosemi  text-gray-100'> M.M. SHANTHAN </h1>
              <p className='  font-poppinsreg text-sm text-gray-100 '>  Res-Date : 28.07.2024 </p>
              <p className=' font-poppinsreg text-sm  text-gray-100'> Table : 04  (Max-Seat-Cap 06) </p>
            </div>
           */}
                </div>
              </CardContent>
            </Card>

            <Card className=" w-full  border-2">
              <CardHeader className=" flex flex-col gap-2">
                <CardTitle className="font-poppinsreg5  text-lg">
                  Pending Reservations
                </CardTitle>
                <CardDescription className=" font-poppinsreg text-slate-400 text-sm">
                  Reservations pending approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid mt-5 w-full items-center gap-4">
                  {lastTwoData?.lastTwoPending.map((p: any, i: any) => (
                    <div
                      key={i}
                      className="flex flex-col p-1 gap-[3px] rounded-md  bg-[#1e3989]  "
                    >
                      <h1 className="  font-robotosemi  capitalize  text-gray-100">
                        {" "}
                        {p?.customer_name}{" "}
                      </h1>
                      <p className="  font-poppinsreg text-sm text-gray-100 ">
                        {" "}
                        Res-Date : {p?.date}{" "}
                      </p>
                      <p className=" font-poppinsreg text-sm  text-gray-100">
                        {" "}
                        {`Table : ${p?.table_number}  (Guest Count ${p?.guest_count} ) `}
                      </p>
                    </div>
                  ))}

                  {lastTwoData?.lastTwoPending.length === 0 && (
                    <h1 className=" text-slate-400 text-sm font-poppinsreg">
                      No data available{" "}
                    </h1>
                  )}

                  {/* <div className="flex flex-col p-1 gap-[3px] rounded-md  bg-[#1e3989]  ">
              <h1 className='  font-robotosemi  text-gray-100'> M.M. SHANTHAN </h1>
              <p className='  font-poppinsreg text-sm text-gray-100 '>  Res-Date : 28.07.2024 </p>
              <p className=' font-poppinsreg text-sm  text-gray-100'> Table : 04  (Max-Seat-Cap 06) </p>
            </div>
            <div className="flex flex-col p-1 gap-[3px] rounded-md  bg-[#1e3989]  ">
              <h1 className='  font-robotosemi  text-gray-100'> M.M. SHANTHAN </h1>
              <p className='  font-poppinsreg text-sm text-gray-100 '>  Res-Date : 28.07.2024 </p>
              <p className=' font-poppinsreg text-sm  text-gray-100'> Table : 04  (Max-Seat-Cap 06) </p>
            </div>
           */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {(newReservationsAlert || pendingReservationAlert) && (
          <div className="fixed inset-0 z-[400] flex justify-center items-center bg-black bg-opacity-70">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="w-[95%] max-w-[650px] bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center"
              >
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
                  Reservation Reauest
                </h2>

                {/* Reserved Table Count */}
                <div className="flex items-center justify-center mb-8">
                  <span className="text-6xl md:text-7xl font-extrabold text-green-500">
                    {pendingReservationAlert
                      ? pendingReservations.length ?? 0
                      : reservations.length ?? 0}
                  </span>
                  <span className="ml-2 text-xl md:text-2xl font-semibold text-gray-700">
                    reserved tables
                  </span>
                </div>

                {/* Info text */}
                <p className="text-gray-600 text-center text-lg mb-5">
                  Customers have recently reserved{" "}
                  <span className="font-semibold text-gray-800">
                    {pendingReservationAlert
                      ? pendingReservations.length ?? 0
                      : reservations.length ?? 0}{" "}
                    tables
                  </span>
                  . You can review the details in the reservations panel.
                </p>

                {(pendingReservationAlert
                  ? pendingReservations.length > 1
                    ? []
                    : pendingReservations
                  : reservations.length > 1
                  ? []
                  : reservations
                ).map((r: any, index: number) => (
                  <div
                    key={r.id ?? index}
                    className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 mb-5"
                  >
                    <h1 className="font-robotosemi text-lg font-bold text-gray-800">
                      {r.merchant_name}
                    </h1>

                    <div className="flex items-center gap-1">
                      <span className="bg-gray-200 rounded-full p-1">
                        <CalendarIcon className="w-4 h-4 text-gray-800" />
                      </span>
                      <p className="font-poppinsreg text-xs text-gray-700">
                        Res-Date: {r.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="bg-gray-200 rounded-full p-1">
                        <TableIcon className="w-4 h-4 text-gray-800" />
                      </span>
                      <p className="font-poppinsreg text-xs text-gray-700">
                        Table: {r.table_number} ({r.guest_count})
                      </p>
                    </div>
                  </div>
                ))}

                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCloseReservationAlert()}
                    className="flex-1 px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold text-lg shadow hover:bg-gray-300 transition"
                  >
                    Close
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleCloseReservationAlert();
                      router.push("/reservations");
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold text-lg shadow hover:bg-green-700 transition"
                  >
                    View reservation
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    )
  );
};

export default Page;
