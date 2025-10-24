'use client';
import Sidebar from '@/comp/Sidebar';
// import { TableHead } from '@/components/ui/table'
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  Tab,
  Tabs,
  useDisclosure,
} from '@nextui-org/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// Table, TableBody, TableCell, TableHeader, TableRow,
import React, { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input as Inp } from '@/components/ui/input';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Page = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAllRes,
    onOpen: onOpenAllRes,
    onClose: onCloseAllRes,
    onOpenChange: onOpenChangeAllRes,
  } = useDisclosure();
  const {
    isOpen: isOpenCustomRes,
    onOpen: onOpenCustomRes,
    onClose: onCloseCustomRes,
    onOpenChange: onOpenChangeCustomRes,
  } = useDisclosure();

  const [selectedKey, setSelectedKey] = useState('incoming');

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Handle the selection change
  const handleSelectionChange = (key: any) => {
    setSelectedKey(key);
    if (key === 'incoming') {
      settriggerPendingFetch(!triggerPendingFetch);
      setSelectedItem('All');
    }

    if (key === 'reservations') {
      setallReservationsTrigger(!allReservationsTrigger);
    }

    if (key === 'custom') {
      setcustomReservationsTrigger(!customReservationsTrigger);
    }
    //   console.log('Selected tab:', key);
  };

  const [selectedItem, setSelectedItem] = useState('All');

  const handleSelectChange = (event: any) => {
    setSelectedItem(event.target.value);
    const v = event.target.value;
    console.log(v);

    const tempArray: any[] = allReservations;
    // "All", "Pending", "Reserved", "Cancelled", "Completed"

    if (v === 'All') {
      setfilteredAllReservations(allReservations);
      setSearchQuery('');
      return;
    }

    if (v === 'Pending') {
      const search = tempArray.filter(
        (t: any) => t.reservation_status === 'pending',
      );
      if (search) {
        setfilteredAllReservations(search);
        setSearchQuery('');
        return;
      }
    }

    if (v === 'Reserved') {
      const search = tempArray.filter(
        (t: any) => t.reservation_status === 'reserved',
      );
      if (search) {
        setfilteredAllReservations(search);
        setSearchQuery('');
        return;
      }
    }

    if (v === 'Cancelled') {
      const search = tempArray.filter(
        (t: any) => t.reservation_status === 'cancelled',
      );
      if (search) {
        setfilteredAllReservations(search);
        setSearchQuery('');
        return;
      }
    }
    if (v === 'Completed') {
      const search = tempArray.filter(
        (t: any) => t.reservation_status === 'completed',
      );
      if (search) {
        setfilteredAllReservations(search);
        setSearchQuery('');
        return;
      }
    }

    console.log(event.target.value);
  };

  // CUSTOM RESERVATION FUNCTIONALITIES CHANGES AND CLICKS
  //  ccccccccccccccccc
  const [selectedItemcustom, setSelectedItemcustom] = useState('All');

  const handleSelectChangeCustom = (event: any) => {
    setSelectedItemcustom(event.target.value);
    const v = event.target.value;
    console.log(v);
    console.log(customReservations);
    console.log(filteredcustomReservations);

    const tempArray: any[] = customReservations;
    // "All", "Pending", "Reserved", "Cancelled", "Completed"
    setsearchQueryCus('');

    if (v === 'All') {
      setfilteredcustomReservations(customReservations);
      // setsearchQueryCus("")
      return;
    }

    if (v === 'Accepted') {
      const search = tempArray.filter(
        (t: any) => t.reservation_status === 'accepted',
      );
      if (search) {
        setfilteredcustomReservations(search);
        // setsearchQueryCus("")
        return;
      }
    }

    if (v === 'Reserved') {
      const search = tempArray.filter(
        (t: any) => t.reservation_status === 'reserved',
      );
      if (search) {
        setfilteredcustomReservations(search);
        // setsearchQueryCus("")
        return;
      }
    }

    if (v === 'Completed') {
      const search = tempArray.filter(
        (t: any) => t.reservation_status === 'completed',
      );
      if (search) {
        setfilteredcustomReservations(search);
        // setsearchQueryCus("")
        return;
      }
    }

    console.log(event.target.value);
  };

  // CUSTOM RESERVATION FUNCTIONALITIES CHANGES AND CLICKS ENDS

  //  GET ALL PENDING RESERVATIONS OF THE RESTAURANT

  const [triggerPendingFetch, settriggerPendingFetch] = useState(false);
  const [pendingReservations, setpendingReservations] = useState<any>([]);

  const { data: session, status } = useSession();

  const getAllPendingReservations = async (merchantId: string) => {
    try {
      const response = await fetch(
        `${backend_url}/reservations/reservations/pending/${merchantId}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      const pendingReservations = await response.json();
      // return tables;
      console.log(pendingReservations);
      setpendingReservations(pendingReservations);
    } catch (error) {
      console.error('Error fetching tables:', error);
      return [];
    }
  };

  useEffect(() => {
    getAllPendingReservations(session?.user.id as string);
  }, [triggerPendingFetch, session?.user.id]);

  //  GET ALL PENDING RESERVATIONS OF THE RESTAURANT ENDS

  // OPEN SINGLE RESERVATION POPUP
  const [singlePendingReservation, setsinglePendingReservation] = useState<any>(
    {},
  );

  const [isCustomReservation, setisCustomReservation] = useState(false);

  const openSingleReservation = async (id: string) => {
    const singlePendingReservation = pendingReservations?.find(
      (r: any) => r._id === id,
    );
    if (singlePendingReservation) {
      console.log(singlePendingReservation);

      setsinglePendingReservation(singlePendingReservation);
      if (singlePendingReservation.details) {
        setisCustomReservation(true);
      } else {
        setisCustomReservation(false);
      }
      onOpen();
    }
  };

  // OPEN SINGLE RESERVATION POPUP ENDS

  // PENDING RESERVATIONS STATUS CHANGE

  const [changePending, setchangePending] = useState('');
  const [updateStatusBtndisable, setupdateStatusBtndisable] = useState(true);
  const [showCancelledReasonBox, setshowCancelledReasonBox] = useState(false);
  const [showReservationFeeBox, setshowReservationFeeBox] = useState(false);

  const handleChangePending = (event: any) => {
    setchangePending(event.target.value);
    if (event.target.value === 'Cancelled') {
      setshowCancelledReasonBox(true);
      setshowReservationFeeBox(false);
    } else if (event.target.value === 'Accepted') {
      setshowReservationFeeBox(true);
      setshowCancelledReasonBox(false);
    } else {
      setshowCancelledReasonBox(false);
      setshowReservationFeeBox(false);
    }
    console.log(event.target.value);
    setTimeout(() => {
      setupdateStatusBtndisable(false);
    }, 400);
  };

  const [changePendingALL, setchangePendingALL] = useState('');
  const [updateStatusBtndisableALL, setupdateStatusBtndisableALL] =
    useState(true);
  const [showCancelledReasonBoxALL, setshowCancelledReasonBoxALL] =
    useState(false);

  const handleChangePendingAllRes = (event: any) => {
    setchangePendingALL(event.target.value);
    if (event.target.value === 'Cancelled') {
      setshowCancelledReasonBoxALL(true);
    } else {
      setshowCancelledReasonBoxALL(false);
    }
    console.log(event.target.value);
    setTimeout(() => {
      setupdateStatusBtndisableALL(false);
    }, 400);
  };

  const closeTheModal = () => {
    onClose();
    setupdateStatusBtndisable(true);
    setchangePending('');
    setshowCancelledReasonBox(false);
    setshowReservationFeeBox(false);
    setcancelled_reason('');
    setcancelled_reasonAll('');
  };

  const closeTheModalAllRes = () => {
    onCloseAllRes();
    onCloseCustomRes();
    setchangePendingALL('');
    setshowCancelledReasonBoxALL(false);
    setupdateStatusBtndisableALL(true);
    setcancelled_reason('');
    setcancelled_reasonAll('');
  };

  const closeTheModalCustomRes = () => {
    onCloseCustomRes();
    // setchangePendingALL("")
    // setshowCancelledReasonBoxALL(false)
    // setupdateStatusBtndisableALL(true)
  };
  // PENDING RESERVATIONS STATUS CHANGE ENDS

  // UPDATE THE STATUS FUNCTON
  const [updatingPendingReservationBTN, setupdatingPendingReservationBTN] =
    useState(false);
  const updateTheStatus = async (id: string) => {
    setupdatingPendingReservationBTN(true);
    try {
      const requestBody: any = {
        id,
        newStatus: changePending.toLowerCase(),
        isCustom: isCustomReservation,
        fee: res_fee,
      };

      if (changePending.toLowerCase() === 'cancelled') {
        requestBody.reason = cancelled_reason;
      }

      const response = await fetch(
        `${backend_url}/reservations/reservations/status/${
          session?.user.id as string
        }`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.ok) {
        const updatedReservation = await response.json();
        console.log(updatedReservation);

        // setMessage(`Reservation updated successfully: ${JSON.stringify(updatedReservation)}`);
      } else {
        const errorData = await response.json();
        console.log(errorData);

        // setMessage(`Error: ${errorData.message}`);
      }

      setupdatingPendingReservationBTN(false);
      settriggerPendingFetch(!triggerPendingFetch);
      closeTheModal();
    } catch (error) {
      console.error('Error updating reservation status:', error);
      // setMessage('Error updating reservation status');
      setupdatingPendingReservationBTN(false);
    }
  };

  const [cancelled_reason, setcancelled_reason] = useState('');
  const [cancelled_reasonAll, setcancelled_reasonAll] = useState('');

  // value={res_fee} onChange={(e) => setres_fee(e.target.value) }
  // const [res_fee, setres_fee] = useState(0)
  const [res_fee, setRes_fee] = useState('');

  const handleChange = (e: any) => {
    const value = e.target.value;

    // Only set the state if the value is a positive number
    if (value === '' || (Number(value) > 0 && /^\d*\.?\d*$/.test(value))) {
      setRes_fee(value);
    }
  };

  // UPDATE THE STATUS FUNCTON

  // GET ALL THE RESERVATIONS
  const [singleReservation, setsingleReservation] = useState<any>({});
  const [isCustomForAllRes, setisCustomForAllRes] = useState(false);

  const [singleCustomReservation, setsingleCustomReservation] = useState<any>(
    {},
  );

  const openSingleReservationAllRes = async (id: string) => {
    const singleReservation = filteredAllReservations?.find(
      (r: any) => r._id === id,
    );
    if (singleReservation) {
      setsingleReservation(singleReservation);
      if (singleReservation.details) {
        setisCustomForAllRes(true);
      } else {
        setisCustomForAllRes(false);
      }
      onOpenAllRes();
    }
  };

  const openSingleReservationCustomRes = async (id: string) => {
    const singleReservation = filteredcustomReservations?.find(
      (r: any) => r._id === id,
    );
    if (singleReservation) {
      setsingleCustomReservation(singleReservation);
      if (singleReservation.details) {
        setisCustomForAllRes(true);
      } else {
        setisCustomForAllRes(false);
      }
      onOpenCustomRes();
    }
  };

  const [allReservations, setallReservations] = useState<any>([]);
  const [filteredAllReservations, setfilteredAllReservations] = useState<any>(
    [],
  );
  const [allReservationsTrigger, setallReservationsTrigger] = useState(false);

  const [customReservations, setcustomReservations] = useState<any>([]);
  const [filteredcustomReservations, setfilteredcustomReservations] =
    useState<any>([]);
  const [customReservationsTrigger, setcustomReservationsTrigger] =
    useState(false);

  const getAllReservations = async (merchant_id: string) => {
    // '/reservations/all/:merchant_id

    try {
      const response = await fetch(
        `${backend_url}/reservations/reservations/all/${merchant_id}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }

      const reservations = await response.json();
      setallReservations(reservations);
      setfilteredAllReservations(reservations);

      // select items checks
      const tempArray: any[] = reservations;
      // "All", "Pending", "Reserved", "Cancelled", "Completed"

      if (selectedItem === 'All') {
        setfilteredAllReservations(reservations);
        return;
      }

      if (selectedItem === 'Pending') {
        const search = tempArray.filter(
          (t: any) => t.reservation_status === 'pending',
        );
        if (search) {
          setfilteredAllReservations(search);
          return;
        }
      }

      if (selectedItem === 'Reserved') {
        const search = tempArray.filter(
          (t: any) => t.reservation_status === 'reserved',
        );
        if (search) {
          setfilteredAllReservations(search);
          return;
        }
      }

      if (selectedItem === 'Cancelled') {
        const search = tempArray.filter(
          (t: any) => t.reservation_status === 'cancelled',
        );
        if (search) {
          setfilteredAllReservations(search);
          return;
        }
      }
      if (selectedItem === 'Completed') {
        const search = tempArray.filter(
          (t: any) => t.reservation_status === 'completed',
        );
        if (search) {
          setfilteredAllReservations(search);
          return;
        }
      }
      // select items checks

      console.log(reservations);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getAllReservations("6668179c90649f18826f162d")
    getAllReservations(session?.user.id as string);
  }, [allReservationsTrigger, session?.user.id]);

  // GET ALL THE RESERVATIONS

  // get all the custom reservations

  const getCustomReservations = async (merchant_id: string) => {
    // '/reservations/all/:merchant_id

    try {
      const response = await fetch(
        `${backend_url}/reservations/reservations/custom/${merchant_id}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }

      const reservations = await response.json();
      setcustomReservations(reservations);
      setfilteredcustomReservations(reservations);
      console.log(reservations);

      // select items checks
      const tempArray: any[] = reservations;
      // "All", "Pending", "Reserved", "Cancelled", "Completed"

      if (selectedItemcustom === 'All') {
        setfilteredcustomReservations(reservations);
        return;
      }

      if (selectedItemcustom === 'Accepted') {
        const search = tempArray.filter(
          (t: any) => t.reservation_status === 'accepted',
        );
        if (search) {
          setfilteredcustomReservations(search);
          return;
        }
      }

      if (selectedItemcustom === 'Reserved') {
        const search = tempArray.filter(
          (t: any) => t.reservation_status === 'reserved',
        );
        if (search) {
          setfilteredcustomReservations(search);
          return;
        }
      }

      if (selectedItemcustom === 'Completed') {
        const search = tempArray.filter(
          (t: any) => t.reservation_status === 'completed',
        );
        if (search) {
          setfilteredcustomReservations(search);
          return;
        }
      }
      // select items checks
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getAllReservations("6668179c90649f18826f162d")
    getCustomReservations(session?.user.id as string);
  }, [customReservationsTrigger, session?.user.id]);

  // get all the custom reservations

  // UPDATE THE RESERVATION FOR ALL RESERVATION SINGLE POPUP

  const [updatingReservationBTNALL, setupdatingReservationBTNALL] =
    useState(false);
  const updateTheStatusAllRes = async (id: string) => {
    setupdatingReservationBTNALL(true);
    try {
      const requestBody: any = {
        id,
        newStatus: changePendingALL.toLowerCase(),
        isCustom: isCustomForAllRes,
      };

      if (changePendingALL.toLowerCase() === 'cancelled') {
        requestBody.reason = cancelled_reasonAll;
      }

      const response = await fetch(
        `${backend_url}/reservations/reservations/status/${
          session?.user.id as string
        }`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.ok) {
        const updatedReservation = await response.json();
        console.log(updatedReservation);

        // setMessage(`Reservation updated successfully: ${JSON.stringify(updatedReservation)}`);
      } else {
        const errorData = await response.json();
        console.log(errorData);

        // setMessage(`Error: ${errorData.message}`);
      }

      setupdatingReservationBTNALL(false);
      if (!isCustomForAllRes) {
        setallReservationsTrigger(!allReservationsTrigger);
      } else {
        setcustomReservationsTrigger(!customReservationsTrigger);
      }

      closeTheModalAllRes();
    } catch (error) {
      console.error('Error updating reservation status:', error);
      // setMessage('Error updating reservation status');
      setupdatingReservationBTNALL(false);
    }
  };

  // UPDATE THE RESERVATION FOR ALL RESERVATION SINGLE POPUP

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

    document.addEventListener('click', handleClickOutside);
    // window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      // window.removeEventListener("scroll", handleScroll);
    };
  }, [openModal]);

  const router = useRouter();

  // const { data: session, status } = useSession();
  // mobile ui functionality

  const [clickedTab, setclickedTab] = useState('reservations');

  // search filters
  const [searchQuery, setSearchQuery] = useState('');

  const [searchQueryCus, setsearchQueryCus] = useState('');

  useEffect(() => {
    if (searchQuery === '') {
      //  setfilteredAllReservations(allReservations);
    } else {
      const filtered = allReservations.filter((reservation: any) =>
        String(reservation.reference).includes(searchQuery),
      );
      setfilteredAllReservations(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQueryCus === '') {
      //  setfilteredcustomReservations(customReservations);
    } else {
      const filtered = customReservations.filter((reservation: any) =>
        String(reservation.reference).includes(searchQueryCus),
      );
      setfilteredcustomReservations(filtered);
    }
  }, [searchQueryCus]);

  // search filters

  // check ban
  useEffect(() => {
    const checkBan = async () => {
      const status = await fetch(
        `${backend_url}/merchant/ban-status/${session?.user.email}`,
      );
      const data = await status.json();

      if (data.isBan) {
        signOut({ callbackUrl: '/login' });
      }
    };

    checkBan();
  }, [session]);

  // check ban

  useEffect(() => {
    if (session?.user.is_onb && session.user.is_ver) {
      setshowme(true);
    }
  }, [session?.user.is_onb, session?.user.is_ver]);

  if (session?.user.is_onb && !session.user.is_ver) {
    signOut();
  }

  if (session?.user.is_onb && !session?.user.is_ver) return null;

  return (
    showme && (
      <>
        <div className=" flex  h-screen   w-full overflow-hidden">
          <div className="   fixed">
            <Sidebar />
          </div>
          {/* overflow-x-auto  */}
          <div className="    lg:ml-60   md:ml-16 relative w-full h-full  ">
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
                openModal ? 'right-0 w-[70%]' : ' -right-full w-0'
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

                  {status === 'authenticated' && (
                    <div className=" mt-3 flex flex-col gap-3">
                      <h1
                        onClick={() => {
                          router.push('/dashboard');
                          setclickedTab('dashboard');
                        }}
                        className={` text-center ${
                          clickedTab === 'dashboard'
                            ? 'bg-[#FF385C]'
                            : 'bg-[#2B2F39]'
                        } font-poppinsreg py-2 rounded-md border  text-white`}
                      >
                        {' '}
                        Dashboard{' '}
                      </h1>
                      <h1
                        onClick={() => {
                          router.push('/reservations');
                          setclickedTab('reservations');
                        }}
                        className={` text-center ${
                          clickedTab === 'reservations'
                            ? 'bg-[#FF385C]'
                            : 'bg-[#2B2F39]'
                        } font-poppinsreg py-2 rounded-md border  text-white`}
                      >
                        {' '}
                        Reservations{' '}
                      </h1>
                      <h1
                        onClick={() => {
                          router.push('/tables-management');
                          setclickedTab('tables');
                        }}
                        className={` text-center ${
                          clickedTab === 'tables'
                            ? 'bg-[#FF385C]'
                            : 'bg-[#2B2F39]'
                        } font-poppinsreg py-2 rounded-md border  text-white`}
                      >
                        Tables Management{' '}
                      </h1>
                      <h1
                        onClick={() => {
                          router.push('/billings');
                          setclickedTab('billings');
                        }}
                        className={` text-center ${
                          clickedTab === 'billings'
                            ? 'bg-[#FF385C]'
                            : 'bg-[#2B2F39]'
                        } font-poppinsreg py-2 rounded-md border  text-white`}
                      >
                        Payments & Billings{' '}
                      </h1>
                      <h1
                        onClick={() => {
                          router.push('/settings');
                          setclickedTab('settings');
                        }}
                        className={` text-center ${
                          clickedTab === 'settings'
                            ? 'bg-[#FF385C]'
                            : 'bg-[#2B2F39]'
                        } font-poppinsreg py-2 rounded-md border  text-white`}
                      >
                        Settings{' '}
                      </h1>

                      <h1
                        onClick={() => {
                          signOut();
                        }}
                        className=" text-center font-poppinsreg py-2 rounded-md border bg-[#2B2F39] text-white"
                      >
                        {' '}
                        Log Out{' '}
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

            <div className=" w-full h-fit bg-[#18181B]  p-4">
              <div className="flex w-full flex-col">
                <Tabs
                  aria-label="Options"
                  color="primary"
                  variant="light"
                  defaultSelectedKey={selectedKey}
                  onSelectionChange={handleSelectionChange}
                  classNames={{
                    tabList:
                      'gap-3 w-full relative rounded-none p-0  border-divider',
                    cursor: 'w-full bg-[#FF385C]',
                    tab: 'max-w-fit px-0 h-12',
                    tabContent: 'group-data-[selected=true]:text-white',
                  }}
                >
                  <Tab
                    key="incoming"
                    title={
                      <div className="flex px-4 items-center space-x-2">
                        {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="   md:w-8 md:h-8   lg:w-6     text-white  lg:h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
        />
      </svg> */}

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="md:w-8 md:h-8   lg:w-6     text-white  lg:h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                          />
                        </svg>

                        <span className=" font-poppinsreg">INCOMING</span>
                        <Chip size="sm" variant="faded">
                          {pendingReservations?.length}
                        </Chip>
                      </div>
                    }
                  />
                  <Tab
                    key="reservations"
                    title={
                      <div className="flex px-4   items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="  md:w-8 md:h-8   lg:w-6     text-white  lg:h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                          />
                        </svg>
                        <span className=" font-poppinsreg">RESERVATIONS</span>
                        {/* <Chip size="sm" variant="faded">3</Chip> */}
                      </div>
                    }
                  />

                  <Tab
                    key="custom"
                    title={
                      <div className="flex px-4   items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="md:w-8 md:h-8   lg:w-6     text-white  lg:h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                          />
                        </svg>

                        <span className=" font-poppinsreg">CUSTOM</span>
                        {/* <Chip size="sm" variant="faded">3</Chip> */}
                      </div>
                    }
                  />
                </Tabs>
              </div>
            </div>

            {/* tables here  */}

            {selectedKey === 'incoming' && (
              <div className=" p-4  flex flex-col h-full">
                {/* flex-1  */}
                <div className=" w-full  flex flex-col   border mb-20  h-fit overflow-auto       ">
                  <Table className=" md:mt-0   pt-4  ">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center  text-slate-400 font-poppinsreg5">
                          Reservation Date
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Reference
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Customer
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Table
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Type
                        </TableHead>

                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          View
                        </TableHead>
                        {/* <TableHead className="text-center font-poppinsreg5">Seating Capacity</TableHead>
            <TableHead className="text-center font-poppinsreg5">Reserve</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingReservations?.map((r: any, i: any) => (
                        <TableRow key={i}>
                          <TableCell className="text-center text-slate-900   font-robotosemi">
                            {/* <h1> {reservation?.date} </h1> */}
                            {/* <h1> 26.06.2024 </h1> */}
                            <h1> {r?.date} </h1>
                          </TableCell>
                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.reference} </h1> */}
                            <h1> {r?.reference} </h1>
                          </TableCell>
                          {/*  */}
                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.reference} </h1> */}
                            <h1 className=""> {r?.customer_name} </h1>
                          </TableCell>
                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.reference} </h1> */}
                            <h1>
                              {r?.table_number
                                ? String(r.table_number).padStart(2, '0')
                                : '-'}
                            </h1>
                          </TableCell>
                          <TableCell className="text-center  text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.merchant_name}</h1> */}
                            <h1> {r?.details ? 'Custom' : 'Normal'}</h1>
                          </TableCell>

                          <TableCell className="text-center font-poppinsreg5">
                            <svg
                              onClick={() => openSingleReservation(r?._id)}
                              // onClick={() => onOpen()}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 mx-auto  transition-colors ease-in-out duration-300   cursor-pointer hover:text-[#FF385C] h-6"
                            >
                              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              <path
                                fill-rule="evenodd"
                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* tables here  */}

            {selectedKey === 'reservations' && (
              ////////////////
              /////////////////

              <div className=" p-4  flex flex-col h-full">
                <div className=" flex gap-5 ">
                  <Select
                    disallowEmptySelection={true}
                    radius="md"
                    //   placeholder="Select an option"
                    value={selectedItem}
                    onChange={handleSelectChange}
                    defaultSelectedKeys={[selectedItem]}
                    className="max-w-40 font-poppinsreg"
                  >
                    {[
                      'All',
                      'Pending',
                      'Reserved',
                      'Cancelled',
                      'Completed',
                    ].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className=" max-w-md  font-poppinsreg"
                    type="email"
                    variant="bordered"
                    placeholder="Search a reservation"
                  />
                </div>

                {/* flex-1 */}
                <div className=" w-full flex flex-col   overflow-auto  mb-20  mt-6 h-fit    border     ">
                  <Table className=" ">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center  text-slate-400 font-poppinsreg5">
                          Reservation Date
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Reference
                        </TableHead>

                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Table
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Type
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Status
                        </TableHead>

                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          View
                        </TableHead>
                        {/* <TableHead className="text-center font-poppinsreg5">Seating Capacity</TableHead>
    <TableHead className="text-center font-poppinsreg5">Reserve</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAllReservations?.map((r: any, i: any) => (
                        <TableRow key={i}>
                          <TableCell className="text-center text-slate-900  font-robotosemi">
                            {/* <h1> {reservation?.date} </h1> */}
                            <h1> {r.date} </h1>
                          </TableCell>
                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.reference} </h1> */}
                            <h1> {r.reference} </h1>
                          </TableCell>

                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.reference} </h1> */}
                            <h1>
                              {' '}
                              {r.table_number
                                ? String(r?.table_number).padStart(2, '0')
                                : '-'}{' '}
                            </h1>
                          </TableCell>
                          <TableCell className="text-center  text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.merchant_name}</h1> */}
                            <h1> {r.details ? 'Custom' : 'Normal'}</h1>
                          </TableCell>

                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.reference} </h1> */}
                            {/* <div className=' flex justify-center'>  */}

                            <h1
                              className={`  capitalize ${
                                r?.reservation_status === 'pending' &&
                                'bg-purple-200    text-purple-800'
                              } ${
                                r?.reservation_status === 'reserved' &&
                                'text-green-800 bg-green-200'
                              } ${
                                r?.reservation_status === 'cancelled' &&
                                'bg-red-200 text-red-800'
                              }  ${
                                r?.reservation_status === 'completed' &&
                                'text-green-800 bg-green-200'
                              }  p-2 rounded-md  `}
                            >
                              {' '}
                              {r.reservation_status}{' '}
                            </h1>
                            {/* </div> */}
                          </TableCell>

                          <TableCell className="text-center font-poppinsreg5">
                            <svg
                              //    onClick={() => openSingleReservation(reservation?._id)}
                              onClick={() =>
                                openSingleReservationAllRes(r?._id)
                              }
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 mx-auto  transition-colors ease-in-out duration-300   cursor-pointer hover:text-[#FF385C] h-6"
                            >
                              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              <path
                                fill-rule="evenodd"
                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* CUSTOM  */}
            {selectedKey === 'custom' && (
              ////////////////
              /////////////////

              <div className=" p-4  flex flex-col h-full">
                <div className=" flex gap-5 ">
                  {/* customReservations */}

                  <Select
                    disallowEmptySelection={true}
                    radius="md"
                    //   placeholder="Select an option"
                    value={selectedItemcustom}
                    onChange={handleSelectChangeCustom}
                    defaultSelectedKeys={[selectedItemcustom]}
                    className="max-w-40 font-poppinsreg"
                  >
                    {['All', 'Accepted', 'Reserved', 'Completed'].map(
                      (type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ),
                    )}
                  </Select>

                  <Input
                    value={searchQueryCus}
                    onChange={(e) => setsearchQueryCus(e.target.value)}
                    className=" max-w-md  font-poppinsreg"
                    type="email"
                    variant="bordered"
                    placeholder="Search a reservation"
                  />
                </div>

                {/* flex-1 */}
                <div className=" w-full flex flex-col   overflow-auto  mb-20  mt-6 h-fit    border     ">
                  <Table className=" ">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center  text-slate-400 font-poppinsreg5">
                          Reservation Date
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Reference
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Customer
                        </TableHead>

                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Status
                        </TableHead>

                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          View
                        </TableHead>
                        {/* <TableHead className="text-center font-poppinsreg5">Seating Capacity</TableHead>
    <TableHead className="text-center font-poppinsreg5">Reserve</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredcustomReservations?.map((r: any, i: any) => (
                        <TableRow key={i}>
                          <TableCell className="text-center text-slate-900  font-robotosemi">
                            {/* <h1> {reservation?.date} </h1> */}
                            <h1> {r.date} </h1>
                          </TableCell>
                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.reference} </h1> */}
                            <h1> {r.reference} </h1>
                          </TableCell>

                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            <h1> {r.customer_name} </h1>
                          </TableCell>

                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.reference} </h1> */}
                            {/* <div className=' flex justify-center'>  */}

                            <h1
                              className={`  capitalize ${
                                r?.reservation_status === 'pending' &&
                                'bg-purple-200    text-purple-800'
                              } ${
                                r?.reservation_status === 'reserved' &&
                                'text-green-800 bg-green-200'
                              } ${
                                r?.reservation_status === 'cancelled' &&
                                'bg-red-200 text-red-800'
                              }  ${
                                r?.reservation_status === 'completed' &&
                                'text-green-800 bg-green-200'
                              } ${
                                r?.reservation_status === 'accepted' &&
                                '      bg-lime-200    text-lime-800'
                              }  p-2 rounded-md  `}
                            >
                              {' '}
                              {r.reservation_status}{' '}
                            </h1>
                            {/* </div> */}
                          </TableCell>

                          <TableCell className="text-center font-poppinsreg5">
                            <svg
                              //    onClick={() => openSingleReservation(reservation?._id)}
                              onClick={() =>
                                openSingleReservationCustomRes(r?._id)
                              }
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 mx-auto  transition-colors ease-in-out duration-300   cursor-pointer hover:text-[#FF385C] h-6"
                            >
                              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              <path
                                fill-rule="evenodd"
                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* CUSTOM  */}
          </div>
        </div>

        {/* pop up  */}

        <Modal
          onClose={closeTheModal}
          isDismissable={false}
          // isOpen:customisOpen, onOpen:customonOpen, onClose:customonClose, onOpenChange:customonOpenChange

          // isOpen, onOpen, onClose, onOpenChange

          classNames={{
            backdrop: ' bg-black bg-opacity-80',
          }}
          className="  md:min-h-fit md:h-fit h-screen  md:max-h-[95vh]  py-3   overflow-y-auto"
          size="xl"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="">
                  <div className=" flex flex-col gap-1">
                    <h1 className="flex flex-col  md:mt-0 mt-5 text-[#FF385C]   font-poppinssemi text-2xl gap-1">
                      Reservation Summary{' '}
                    </h1>

                    <div>
                      <p className=" text-green-900 font-poppinsreg5">
                        {' '}
                        {`REFERENCE NUMBER: ${singlePendingReservation?.reference}`}{' '}
                      </p>
                      {/* <p className=' text-green-900 font-poppinsreg5'>  {`REFERENCE NUMBER: ${singleReservation?.reference}`} </p> */}

                      <p className=" text-slate-400 text-sm font-poppinsreg5">
                        {' '}
                        TYPE :{' '}
                        {singlePendingReservation?.details
                          ? 'CUSTOM'
                          : 'NORMAL'}{' '}
                      </p>
                    </div>
                  </div>

                  <div className=" mt-2 flex flex-col gap-2">
                    <h1 className="  font-poppinssemi text-lg">
                      {' '}
                      Reservation Details{' '}
                    </h1>

                    <div className=" grid  grid-cols-2">
                      <div className="border-t border-b p-1 border-l">
                        <h1 className=" font-poppinsreg5 ">
                          {' '}
                          Reservation Date{' '}
                        </h1>
                        <h1 className=" font-poppinsreg text-slate-500 text-sm">
                          {' '}
                          {singlePendingReservation?.date}{' '}
                        </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> 26.06.2024 </h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {reservationDate}</h1> */}
                      </div>

                      {/* /////////////////// */}
                      {/* /////////////////// */}
                      {/* singleReservation?.table_id */}
                      {singlePendingReservation?.table_number && (
                        <div className="  p-1 border-r border-t border-l">
                          <h1 className=" font-poppinsreg5"> Table </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> 04 (Max-Seat-Capacity : 02)   </h1> */}
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.table_id}  </h1> */}
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            Table {singlePendingReservation?.table_number}{' '}
                          </h1>
                        </div>
                      )}

                      {/* singleReservation?.start_time */}

                      {singlePendingReservation?.start_time && (
                        <div className="   border-b border-r border-l p-1">
                          <h1 className=" font-poppinsreg5"> Start Time </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.start_time}   </h1> */}
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            {singlePendingReservation?.start_time}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {ReservationstartTime}   </h1> */}
                        </div>
                      )}

                      {/* singleReservation?.end_time */}
                      {singlePendingReservation?.end_time && (
                        <div className="border p-1">
                          <h1 className=" font-poppinsreg5"> End Time </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.end_time}   </h1> */}
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            {singlePendingReservation?.end_time}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>  {ReservationendTime}  </h1> */}
                        </div>
                      )}

                      {/* singleReservation?.guest_count */}

                      {singlePendingReservation?.guest_count && (
                        <div className=" border-b border-r border-l p-1">
                          <h1 className=" font-poppinsreg5"> Guest </h1>
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            {String(
                              singlePendingReservation?.guest_count,
                            ).padStart(2, '0')}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>  { String(2).padStart(2,"0")}   </h1> */}
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> { type === "preferred" ? `Up to ${ReservationguestCount} people`  :  ReservationguestCount}  </h1> */}
                        </div>
                      )}

                      {singlePendingReservation?.reservation_fee && (
                        <div className=" border-b border-l  border-r p-1">
                          <h1 className=" font-poppinsreg5">
                            {' '}
                            Reservation Fee{' '}
                          </h1>
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            LKR {singlePendingReservation?.reservation_fee}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> { type === "preferred" ? `Up to ${ReservationguestCount} people`  :  ReservationguestCount}  </h1> */}
                        </div>
                      )}

                      {/* singleReservation?.details */}
                      {singlePendingReservation?.details && (
                        <div className="  border p-1">
                          <h1 className=" font-poppinsreg5">
                            {' '}
                            Meal From Restaurant{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>  {singleReservation?.meal_from_restaurant ? "Yes" : "No"}   </h1> */}
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            {singlePendingReservation?.meal_from_restaurant
                              ? 'Yes'
                              : 'No'}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> { type === "preferred" ? `Up to ${ReservationguestCount} people`  :  ReservationguestCount}  </h1> */}
                        </div>
                      )}

                      {/* Reservation Fee */}

                      {/* /////////////////// */}
                      {/* /////////////////// */}
                    </div>
                  </div>

                  {/* Reservation details customer description */}

                  {/* <div className=' mt-4 flex flex-col gap-2'>

              <h1 className='  font-poppinssemi text-lg'> Event Details </h1>

               
               <div className=' h-[150px] overflow-y-auto border p-1 text-wrap'> 
                <p className=' text-slate-500 text-sm'>  {`hello iam jawidh muhammadh from galaha , hello iam jawidh muhammadh from galahahello iam jawidh muhammadh from galahahello iam jawidh muhammadh from galahahello iam jawidh muhammadh from galaha`} </p>
               </div>

             </div> */}
                  {/* rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr */}

                  {/* Reservation details customer description */}

                  {/* singleReservation?.details */}
                  {singlePendingReservation?.details && (
                    <div className=" mt-4 flex flex-col gap-2">
                      <h1 className="  font-poppinssemi text-lg">
                        {' '}
                        Event Details{' '}
                      </h1>

                      <div className=" min-h-fit max-h-[150px] overflow-y-auto border p-1 text-wrap">
                        {/* <p className=' text-slate-500 text-sm'>  {singleReservation?.details} </p> */}
                        <p className=" text-slate-500 text-sm">
                          {' '}
                          {singlePendingReservation?.details}{' '}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className=" mt-4 flex flex-col gap-2">
                    <h1 className="  font-poppinssemi text-lg">
                      {' '}
                      Customer Details{' '}
                    </h1>

                    <div className=" grid  grid-cols-2">
                      <div className="border-t p-1 border-l">
                        <h1 className=" font-poppinsreg5"> Name </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> Jason Roy</h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>{singleReservation?.customer_name}</h1> */}
                        <h1 className=" font-poppinsreg text-slate-500 text-sm">
                          {singlePendingReservation?.customer_name}
                        </h1>
                      </div>

                      <div className="  p-1  border">
                        <h1 className=" font-poppinsreg5"> Email </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> The Gallery Cafe </h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.customer_email} </h1> */}
                        <h1 className=" font-poppinsreg break-words text-slate-500 text-sm">
                          {' '}
                          {singlePendingReservation?.customer_email}{' '}
                        </h1>
                      </div>

                      <div className="  p-1 border">
                        <h1 className=" font-poppinsreg5"> Phone Number </h1>
                        {/* <h1 className=' font-poppinsreg text-red-500 text-sm'> {` ${false ? "04 (Max-Seat-Capacity : 02)" : "NOT ADDED"} `}    </h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.customer_number}    </h1> */}
                        <h1 className=" font-poppinsreg text-slate-500 text-sm">
                          {' '}
                          {singlePendingReservation?.customer_number}{' '}
                        </h1>
                      </div>
                    </div>
                  </div>

                  {/* //  bg-green-200 text-green-800 bg-red-200 text-red-800 */}

                  <div className="   mt-4 flex flex-col gap-1">
                    <h1 className="  font-poppinssemi text-lg">
                      {' '}
                      Change Reservation Status
                    </h1>
                    {/* <h1 className={`  ${singlePendingReservation?.reservation_status === "pending" && "bg-purple-200 
     text-purple-800"}  ${singlePendingReservation?.reservation_status === "reserved" && "text-green-800 bg-green-200"} ${singlePendingReservation?.reservation_status === "cancelled" && "bg-red-200 text-red-800"} ${singlePendingReservation?.reservation_status === "completed" && "text-green-800 bg-green-200"}      font-poppinsreg5 w-fit p-2 rounded-md    text-sm    `}> {singlePendingReservation?.reservation_status === "pending" && "PENDING"} {singlePendingReservation?.reservation_status === "reserved" && "RESERVED"} {singlePendingReservation?.reservation_status === "completed" && "COMPLETED"} {singlePendingReservation?.reservation_status === "cancelled" && "CANCELLED"} </h1> */}

                    {!singlePendingReservation?.details && (
                      <Select
                        disallowEmptySelection={true}
                        radius="md"
                        placeholder="Select an option"
                        value={changePending}
                        onChange={handleChangePending}
                        // defaultSelectedKeys={[selectedItem]}
                        className="max-w-56 font-poppinsreg"
                      >
                        {['Reserved', 'Cancelled'].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </Select>
                    )}

                    {singlePendingReservation?.details && (
                      <Select
                        disallowEmptySelection={true}
                        radius="md"
                        placeholder="Select an option"
                        value={changePending}
                        onChange={handleChangePending}
                        // defaultSelectedKeys={[selectedItem]}
                        className="max-w-56 font-poppinsreg"
                      >
                        {['Accepted', 'Cancelled'].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </div>

                  {/* AMOUNT FOR CUSTOM RESERVATION  */}
                  {/* fffffffffffffffffffffff */}

                  {showReservationFeeBox && (
                    <div className=" mt-2">
                      <h1 className="  font-poppinssemi text-lg">
                        {' '}
                        Reservation Fee
                      </h1>

                      {/* <Input type='number' className=' w-fit' placeholder='Enter Reservation Fee' /> */}

                      {/* <Inp value={res_fee}    onChange={(e) => setres_fee(Number(e.target.value))}  className=' w-fit  border-[1px] ' placeholder='Enter Reservation Fee' /> */}
                      <Inp
                        value={res_fee}
                        onChange={handleChange}
                        className=" w-fit  border-[1px] "
                        placeholder="Enter Reservation Fee"
                      />
                    </div>
                  )}

                  {/* AMOUNT FOR CUSTOM RESERVATION  */}

                  {showCancelledReasonBox && (
                    <div className="   mt-4 flex flex-col gap-1">
                      <h1 className="  font-poppinssemi text-lg">
                        {' '}
                        Cancellation Reason
                      </h1>

                      <Textarea
                        value={cancelled_reason}
                        onChange={(e) => setcancelled_reason(e.target.value)}
                        placeholder="Enter reason for cancellation (Min 30 characters required)"
                      />
                    </div>
                  )}

                  <Button
                    isLoading={updatingPendingReservationBTN}
                    isDisabled={
                      updateStatusBtndisable ||
                      (showReservationFeeBox && res_fee.length === 0) ||
                      (showCancelledReasonBox && cancelled_reason.length < 30)
                    }
                    onPress={() =>
                      updateTheStatus(singlePendingReservation?._id)
                    }
                    className=" bg-[#FF385C] text-white mt-3 font-poppinsreg"
                  >
                    {' '}
                    Update Status{' '}
                  </Button>

                  {/* {
  singleReservation?.cancelled_reason &&

  <div className='   mt-4 p-1 border flex flex-col gap-1'> 
  <h1 className='  font-poppinssemi text-lg'> Cancelled Reason</h1>
  <p className=' text-red-700 font-poppinsreg text-sm'>  {singleReservation?.cancelled_reason} </p>

 

 
</div>


 } */}

                  {/* <Butto className=' bg-[#FF385C] text-white font-poppinsreg5 text-xs mt-4  w-full'>Confirm & Proceed</Button> */}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* pop up  */}

        {/* ALL RESERVATIONS SINGLE VIEW POP UP  */}

        {/* isOpen:isOpenAllRes, onOpen:onOpenAllRes, onClose:onCloseAllRes, onOpenChange:onOpenChangeAllRes */}
        <Modal
          onClose={closeTheModalAllRes}
          isDismissable={false}
          // isOpen:customisOpen, onOpen:customonOpen, onClose:customonClose, onOpenChange:customonOpenChange

          // isOpen, onOpen, onClose, onOpenChange

          classNames={{
            backdrop: ' bg-black bg-opacity-80',
          }}
          className="   md:min-h-fit md:h-fit h-screen  md:max-h-[95vh]  py-3   overflow-y-auto"
          size="xl"
          isOpen={isOpenAllRes}
          onOpenChange={onOpenChangeAllRes}
        >
          <ModalContent>
            {(onCloseAllRes) => (
              <>
                <ModalBody className="">
                  <div className=" flex flex-col gap-1">
                    <h1 className="flex flex-col  md:mt-0 mt-5 text-[#FF385C]   font-poppinssemi text-2xl gap-1">
                      Reservation Summary{' '}
                    </h1>

                    <div>
                      <p className=" text-green-900 font-poppinsreg5">
                        {' '}
                        {`REFERENCE NUMBER: ${singleReservation?.reference}`}{' '}
                      </p>
                      {/* <p className=' text-green-900 font-poppinsreg5'>  {`REFERENCE NUMBER: ${singleReservation?.reference}`} </p> */}

                      <p className=" text-slate-400 text-sm font-poppinsreg5">
                        {' '}
                        TYPE :{' '}
                        {singleReservation?.details ? 'CUSTOM' : 'NORMAL'}{' '}
                      </p>
                    </div>
                  </div>

                  <div className=" mt-2 flex flex-col gap-2">
                    <h1 className="  font-poppinssemi text-lg">
                      {' '}
                      Reservation Details{' '}
                    </h1>

                    <div className=" grid  grid-cols-2">
                      <div className="border-t border-b p-1 border-l">
                        <h1 className=" font-poppinsreg5 ">
                          {' '}
                          Reservation Date{' '}
                        </h1>
                        <h1 className=" font-poppinsreg text-slate-500 text-sm">
                          {' '}
                          {singleReservation?.date}{' '}
                        </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> 26.06.2024 </h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {reservationDate}</h1> */}
                      </div>

                      {/* /////////////////// */}
                      {/* /////////////////// */}
                      {/* singleReservation?.table_id */}
                      {singleReservation?.table_number && (
                        <div className="  p-1 border-r border-t border-l">
                          <h1 className=" font-poppinsreg5"> Table </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> 04 (Max-Seat-Capacity : 02)   </h1> */}
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.table_id}  </h1> */}
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            Table {singleReservation?.table_number}{' '}
                          </h1>
                        </div>
                      )}

                      {/* singleReservation?.start_time */}

                      {singleReservation?.start_time && (
                        <div className="   border-b border-r border-l p-1">
                          <h1 className=" font-poppinsreg5"> Start Time </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.start_time}   </h1> */}
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            {singleReservation?.start_time}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {ReservationstartTime}   </h1> */}
                        </div>
                      )}

                      {/* singleReservation?.end_time */}
                      {singleReservation?.end_time && (
                        <div className="border p-1">
                          <h1 className=" font-poppinsreg5"> End Time </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.end_time}   </h1> */}
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            {singleReservation?.end_time}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>  {ReservationendTime}  </h1> */}
                        </div>
                      )}

                      {/* singleReservation?.guest_count */}

                      {singleReservation?.guest_count && (
                        <div className=" border-b border-r border-l p-1">
                          <h1 className=" font-poppinsreg5"> Guest </h1>
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            {String(singleReservation?.guest_count).padStart(
                              2,
                              '0',
                            )}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>  { String(2).padStart(2,"0")}   </h1> */}
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> { type === "preferred" ? `Up to ${ReservationguestCount} people`  :  ReservationguestCount}  </h1> */}
                        </div>
                      )}

                      <div className=" border-b border-l   border-r p-1">
                        <h1 className=" font-poppinsreg5"> Reservation Fee </h1>
                        <h1 className=" font-poppinsreg text-slate-500 text-sm">
                          {' '}
                          LKR {singleReservation?.reservation_fee}{' '}
                        </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> { type === "preferred" ? `Up to ${ReservationguestCount} people`  :  ReservationguestCount}  </h1> */}
                      </div>

                      {/* singleReservation?.details */}
                      {singleReservation?.details && (
                        <div className=" border-b border-l border-r p-1">
                          <h1 className=" font-poppinsreg5">
                            {' '}
                            Meal From Restaurant{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>  {singleReservation?.meal_from_restaurant ? "Yes" : "No"}   </h1> */}
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            {singleReservation?.meal_from_restaurant
                              ? 'Yes'
                              : 'No'}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> { type === "preferred" ? `Up to ${ReservationguestCount} people`  :  ReservationguestCount}  </h1> */}
                        </div>
                      )}

                      {/* Reservation Fee */}

                      {/* /////////////////// */}
                      {/* /////////////////// */}
                    </div>
                  </div>

                  {/* Reservation details customer description */}

                  {/* <div className=' mt-4 flex flex-col gap-2'>

              <h1 className='  font-poppinssemi text-lg'> Event Details </h1>

               
               <div className=' h-[150px] overflow-y-auto border p-1 text-wrap'> 
                <p className=' text-slate-500 text-sm'>  {`hello iam jawidh muhammadh from galaha , hello iam jawidh muhammadh from galahahello iam jawidh muhammadh from galahahello iam jawidh muhammadh from galahahello iam jawidh muhammadh from galaha`} </p>
               </div>

             </div> */}
                  {/* rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr */}

                  {/* Reservation details customer description */}

                  {/* singleReservation?.details */}
                  {singleReservation?.details && (
                    <div className=" mt-4 flex flex-col gap-2">
                      <h1 className="  font-poppinssemi text-lg">
                        {' '}
                        Event Details{' '}
                      </h1>

                      <div className=" min-h-fit max-h-[150px] overflow-y-auto border p-1 text-wrap">
                        {/* <p className=' text-slate-500 text-sm'>  {singleReservation?.details} </p> */}
                        <p className=" text-slate-500 text-sm">
                          {' '}
                          {singleReservation?.details}{' '}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className=" mt-4 flex flex-col gap-2">
                    <h1 className="  font-poppinssemi text-lg">
                      {' '}
                      Customer Details{' '}
                    </h1>

                    <div className=" grid  grid-cols-2">
                      <div className="border-t p-1 border-l">
                        <h1 className=" font-poppinsreg5"> Name </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> Jason Roy</h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>{singleReservation?.customer_name}</h1> */}
                        <h1 className=" font-poppinsreg text-slate-500 text-sm">
                          {singleReservation?.customer_name}
                        </h1>
                      </div>

                      <div className="  p-1  border">
                        <h1 className=" font-poppinsreg5"> Email </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> The Gallery Cafe </h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.customer_email} </h1> */}
                        <h1 className=" font-poppinsreg break-words text-slate-500 text-sm">
                          {' '}
                          {singleReservation?.customer_email}{' '}
                        </h1>
                      </div>

                      <div className="  p-1 border">
                        <h1 className=" font-poppinsreg5"> Phone Number </h1>
                        {/* <h1 className=' font-poppinsreg text-red-500 text-sm'> {` ${false ? "04 (Max-Seat-Capacity : 02)" : "NOT ADDED"} `}    </h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.customer_number}    </h1> */}
                        <h1 className=" font-poppinsreg text-slate-500 text-sm">
                          {' '}
                          {singleReservation?.customer_number}{' '}
                        </h1>
                      </div>
                    </div>
                  </div>

                  {/* //  bg-green-200 text-green-800 bg-red-200 text-red-800 */}

                  <div className="   mt-4 flex flex-col gap-1">
                    <h1 className="  font-poppinssemi text-lg">
                      {' '}
                      Reservation Status
                    </h1>
                    {/* <h1 className={`  ${singlePendingReservation?.reservation_status === "pending" && "bg-purple-200 
     text-purple-800"}  ${singlePendingReservation?.reservation_status === "reserved" && "text-green-800 bg-green-200"} ${singlePendingReservation?.reservation_status === "cancelled" && "bg-red-200 text-red-800"} ${singlePendingReservation?.reservation_status === "completed" && "text-green-800 bg-green-200"}      font-poppinsreg5 w-fit p-2 rounded-md    text-sm    `}> {singlePendingReservation?.reservation_status === "pending" && "PENDING"} {singlePendingReservation?.reservation_status === "reserved" && "RESERVED"} {singlePendingReservation?.reservation_status === "completed" && "COMPLETED"} {singlePendingReservation?.reservation_status === "cancelled" && "CANCELLED"} </h1> */}
                    {singleReservation.reservation_status === 'cancelled' && (
                      <h1 className=" text-red-600 text-lg font-poppinsreg5">
                        {' '}
                        Cancelled{' '}
                      </h1>
                    )}

                    {singleReservation.reservation_status === 'completed' && (
                      <h1 className=" text-green-600 text-lg font-poppinsreg5">
                        {' '}
                        Completed{' '}
                      </h1>
                    )}

                    {singleReservation.reservation_status === 'pending' && (
                      <h1 className="  text-purple-800 text-lg font-poppinsreg5">
                        {' '}
                        Pending{' '}
                      </h1>
                    )}

                    {singleReservation.reservation_status !== 'cancelled' &&
                      singleReservation.reservation_status !== 'completed' &&
                      singleReservation.reservation_status !== 'pending' && (
                        <Select
                          disallowEmptySelection={true}
                          radius="md"
                          placeholder="Select an option"
                          value={changePendingALL}
                          onChange={handleChangePendingAllRes}
                          // defaultSelectedKeys={[selectedItem]}
                          className="max-w-56 font-poppinsreg"
                        >
                          {['Completed', 'Cancelled'].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </Select>
                      )}

                    {/* go to incoming to update status  */}
                    {singleReservation.reservation_status === 'pending' && (
                      <h1 className=" text-slate-400">
                        {' '}
                        Update status for pending reservations on INCOMING tab{' '}
                      </h1>
                    )}
                    {/* go to incoming to update status  */}
                  </div>

                  {showCancelledReasonBoxALL && (
                    <div className="   mt-4 flex flex-col gap-1">
                      <h1 className="  font-poppinssemi text-lg">
                        {' '}
                        Cancellation Reason
                      </h1>

                      <Textarea
                        value={cancelled_reasonAll}
                        onChange={(e) => setcancelled_reasonAll(e.target.value)}
                        placeholder="Enter reason for cancellation (Min 30 characters required)"
                      />
                    </div>
                  )}

                  {singleReservation.reservation_status !== 'cancelled' &&
                    singleReservation.reservation_status !== 'completed' &&
                    singleReservation.reservation_status !== 'pending' && (
                      <Button
                        isLoading={updatingReservationBTNALL}
                        isDisabled={
                          updateStatusBtndisableALL ||
                          (showCancelledReasonBoxALL &&
                            cancelled_reasonAll.length < 30)
                        }
                        onPress={() =>
                          updateTheStatusAllRes(singleReservation?._id)
                        }
                        className=" bg-[#FF385C] text-white mt-3 font-poppinsreg"
                      >
                        {' '}
                        Update Status{' '}
                      </Button>
                    )}

                  {singleReservation?.cancelled_reason && (
                    <div className="   mt-4 p-1 border flex flex-col gap-1">
                      <h1 className="  font-poppinssemi text-lg">
                        {' '}
                        Cancelled Reason
                      </h1>
                      <p className=" text-red-700 font-poppinsreg text-sm">
                        {' '}
                        {singleReservation?.cancelled_reason}{' '}
                      </p>
                    </div>
                  )}

                  {/* <Butto className=' bg-[#FF385C] text-white font-poppinsreg5 text-xs mt-4  w-full'>Confirm & Proceed</Button> */}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* ALL RESERVATIONS SINGLE VIEW POP UP  */}

        {/* CUSTOM RESERVATION SINGLE POPUP  */}

        {/* const {isOpen:isOpenCustomRes, onOpen:onOpenCustomRes, onClose:onCloseCustomRes, onOpenChange:onOpenChangeCustomRes} = useDisclosure(); */}

        <Modal
          onClose={closeTheModalCustomRes}
          isDismissable={false}
          // isOpen:customisOpen, onOpen:customonOpen, onClose:customonClose, onOpenChange:customonOpenChange

          // isOpen, onOpen, onClose, onOpenChange

          classNames={{
            backdrop: ' bg-black bg-opacity-80',
          }}
          className="   md:min-h-fit md:h-fit h-screen  md:max-h-[95vh]  py-3   overflow-y-auto"
          size="xl"
          isOpen={isOpenCustomRes}
          onOpenChange={onOpenChangeCustomRes}
        >
          <ModalContent>
            {(onCloseCustomRes) => (
              <>
                <ModalBody className="">
                  <div className=" flex flex-col gap-1">
                    <h1 className="flex flex-col  md:mt-0 mt-5 text-[#FF385C]   font-poppinssemi text-2xl gap-1">
                      Reservation Summary{' '}
                    </h1>

                    <div>
                      <p className=" text-green-900 font-poppinsreg5">
                        {' '}
                        {`REFERENCE NUMBER: ${singleCustomReservation?.reference}`}{' '}
                      </p>
                      {/* <p className=' text-green-900 font-poppinsreg5'>  {`REFERENCE NUMBER: ${singleReservation?.reference}`} </p> */}

                      {/* <p className=' text-slate-400 text-sm font-poppinsreg5'> TYPE : {singleReservation?.details ? "CUSTOM" : "NORMAL"} </p> */}
                    </div>
                  </div>

                  <div className=" mt-2 flex flex-col gap-2">
                    <h1 className="  font-poppinssemi text-lg">
                      {' '}
                      Reservation Details{' '}
                    </h1>

                    <div className=" grid  grid-cols-2">
                      <div className="border-t border-b p-1 border-l">
                        <h1 className=" font-poppinsreg5 ">
                          {' '}
                          Reservation Date{' '}
                        </h1>
                        <h1 className=" font-poppinsreg text-slate-500 text-sm">
                          {' '}
                          {singleCustomReservation?.date}{' '}
                        </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> 26.06.2024 </h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {reservationDate}</h1> */}
                      </div>

                      {singleCustomReservation.reservation_fee !== 0 && (
                        <div className=" border-b border-l  border-t border-r p-1">
                          <h1 className=" font-poppinsreg5">
                            {' '}
                            Reservation Fee{' '}
                          </h1>
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            LKR {singleCustomReservation.reservation_fee}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> { type === "preferred" ? `Up to ${ReservationguestCount} people`  :  ReservationguestCount}  </h1> */}
                        </div>
                      )}

                      {/* singleReservation?.details */}
                      {singleCustomReservation?.details && (
                        <div
                          className={` ${
                            singleCustomReservation?.reservation_fee
                              ? 'border-b border-l border-r'
                              : 'border'
                          } p-1  `}
                        >
                          <h1 className=" font-poppinsreg5">
                            {' '}
                            Meal From Restaurant{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>  {singleReservation?.meal_from_restaurant ? "Yes" : "No"}   </h1> */}
                          <h1 className=" font-poppinsreg text-slate-500 text-sm">
                            {' '}
                            {singleCustomReservation?.meal_from_restaurant
                              ? 'Yes'
                              : 'No'}{' '}
                          </h1>
                          {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> { type === "preferred" ? `Up to ${ReservationguestCount} people`  :  ReservationguestCount}  </h1> */}
                        </div>
                      )}

                      {/* Reservation Fee */}

                      {/* /////////////////// */}
                      {/* /////////////////// */}
                    </div>
                  </div>

                  {/* Reservation details customer description */}

                  {/* <div className=' mt-4 flex flex-col gap-2'>

              <h1 className='  font-poppinssemi text-lg'> Event Details </h1>

               
               <div className=' h-[150px] overflow-y-auto border p-1 text-wrap'> 
                <p className=' text-slate-500 text-sm'>  {`hello iam jawidh muhammadh from galaha , hello iam jawidh muhammadh from galahahello iam jawidh muhammadh from galahahello iam jawidh muhammadh from galahahello iam jawidh muhammadh from galaha`} </p>
               </div>

             </div> */}
                  {/* rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr */}

                  {/* Reservation details customer description */}

                  {/* singleReservation?.details */}
                  {singleCustomReservation?.details && (
                    <div className=" mt-4 flex flex-col gap-2">
                      <h1 className="  font-poppinssemi text-lg">
                        {' '}
                        Event Details{' '}
                      </h1>

                      <div className=" min-h-fit max-h-[150px] overflow-y-auto border p-1 text-wrap">
                        {/* <p className=' text-slate-500 text-sm'>  {singleReservation?.details} </p> */}
                        <p className=" text-slate-500 text-sm">
                          {' '}
                          {singleCustomReservation?.details}{' '}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className=" mt-4 flex flex-col gap-2">
                    <h1 className="  font-poppinssemi text-lg">
                      {' '}
                      Customer Details{' '}
                    </h1>

                    <div className=" grid  grid-cols-2">
                      <div className="border-t p-1 border-l">
                        <h1 className=" font-poppinsreg5"> Name </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> Jason Roy</h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'>{singleReservation?.customer_name}</h1> */}
                        <h1 className=" font-poppinsreg capitalize text-slate-500 text-sm">
                          {singleCustomReservation?.customer_name}
                        </h1>
                      </div>

                      <div className="  p-1  border">
                        <h1 className=" font-poppinsreg5"> Email </h1>
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> The Gallery Cafe </h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.customer_email} </h1> */}
                        <h1 className=" font-poppinsreg break-words text-slate-500 text-sm">
                          {' '}
                          {singleCustomReservation?.customer_email}{' '}
                        </h1>
                      </div>

                      <div className="  p-1 border">
                        <h1 className=" font-poppinsreg5"> Phone Number </h1>
                        {/* <h1 className=' font-poppinsreg text-red-500 text-sm'> {` ${false ? "04 (Max-Seat-Capacity : 02)" : "NOT ADDED"} `}    </h1> */}
                        {/* <h1 className=' font-poppinsreg text-slate-500 text-sm'> {singleReservation?.customer_number}    </h1> */}
                        <h1 className=" font-poppinsreg text-slate-500 text-sm">
                          {' '}
                          {singleCustomReservation?.customer_number}{' '}
                        </h1>
                      </div>
                    </div>
                  </div>

                  {/* //  bg-green-200 text-green-800 bg-red-200 text-red-800 */}

                  <div className="   mt-4 flex flex-col gap-1">
                    <h1 className="  font-poppinssemi text-lg">
                      {' '}
                      Reservation Status
                    </h1>
                    {/* <h1 className={`  ${singlePendingReservation?.reservation_status === "pending" && "bg-purple-200 
     text-purple-800"}  ${singlePendingReservation?.reservation_status === "reserved" && "text-green-800 bg-green-200"} ${singlePendingReservation?.reservation_status === "cancelled" && "bg-red-200 text-red-800"} ${singlePendingReservation?.reservation_status === "completed" && "text-green-800 bg-green-200"}      font-poppinsreg5 w-fit p-2 rounded-md    text-sm    `}> {singlePendingReservation?.reservation_status === "pending" && "PENDING"} {singlePendingReservation?.reservation_status === "reserved" && "RESERVED"} {singlePendingReservation?.reservation_status === "completed" && "COMPLETED"} {singlePendingReservation?.reservation_status === "cancelled" && "CANCELLED"} </h1> */}
                    {singleCustomReservation.reservation_status ===
                      'accepted' && (
                      <div className="flex flex-col gap-1">
                        <h1 className=" text-indigo-800 text-lg font-poppinsreg5">
                          {' '}
                          {`Accepted `}{' '}
                          <span className=" text-red-800 text-sm">
                            {`(Payment Not Made)`}{' '}
                          </span>{' '}
                        </h1>
                        <h1 className=" text-slate-400 text-sm">
                          {' '}
                          {`Once the payment is made,this reservation will become RESERVED`}
                        </h1>
                      </div>
                    )}

                    {singleCustomReservation.reservation_status ===
                      'pending' && (
                      <h1 className="  text-purple-800 text-lg font-poppinsreg5">
                        {' '}
                        Pending{' '}
                      </h1>
                    )}

                    {singleCustomReservation.reservation_status ===
                      'pending' && (
                      <h1 className=" text-slate-400">
                        {' '}
                        Update status for pending reservations on INCOMING tab{' '}
                      </h1>
                    )}

                    {/* come here  */}

                    {singleCustomReservation.reservation_status ===
                      'completed' && (
                      <h1 className=" text-green-800 text-lg font-poppinsreg5">
                        {' '}
                        {`Completed `}{' '}
                      </h1>
                    )}
                    {/* vvvvvvvvvvvvvvvvvv */}
                    {singleCustomReservation.reservation_status ===
                      'cancelled' && (
                      <h1 className=" text-red-600 text-lg font-poppinsreg5">
                        {' '}
                        Cancelled{' '}
                      </h1>
                    )}
                    {/* ggggggggggggggggggggg */}

                    {/* ${r?.reservation_status === "accepted" && "      bg-indigo-200    text-indigo-800"}  */}

                    {singleCustomReservation.reservation_status !==
                      'accepted' &&
                      singleCustomReservation.reservation_status ===
                        'reserved' && (
                        <Select
                          disallowEmptySelection={true}
                          radius="md"
                          placeholder="Select an option"
                          value={changePendingALL}
                          onChange={handleChangePendingAllRes}
                          // defaultSelectedKeys={[selectedItem]}
                          className="max-w-56 font-poppinsreg"
                        >
                          {['Completed'].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                  </div>

                  {showCancelledReasonBoxALL && (
                    <div className="   mt-4 flex flex-col gap-1">
                      <h1 className="  font-poppinssemi text-lg">
                        {' '}
                        Cancellation Reason
                      </h1>

                      <Textarea
                        value={cancelled_reasonAll}
                        onChange={(e) => setcancelled_reasonAll(e.target.value)}
                        placeholder="Enter reason for cancellation (Min 30 characters required)"
                      />
                    </div>
                  )}

                  {/* 
{
  (singleCustomReservation.reservation_status !== "accepted" && singleCustomReservation.reservation_status !== "completed" && singleCustomReservation.reservation_status !== "pending" ) &&

  <Button   isLoading={updatingReservationBTNALL} isDisabled={updateStatusBtndisableALL || (showCancelledReasonBoxALL  && cancelled_reasonAll.length < 30)} onPress={() => updateTheStatusAllRes(singleCustomReservation?._id)} className=' bg-[#FF385C] text-white mt-3 font-poppinsreg'> Update Status </Button>


} */}

                  {/* {
  singleReservation?.cancelled_reason &&

  <div className='   mt-4 p-1 border flex flex-col gap-1'> 
  <h1 className='  font-poppinssemi text-lg'> Cancelled Reason</h1>
  <p className=' text-red-700 font-poppinsreg text-sm'>  {singleReservation?.cancelled_reason} </p>

 

 
</div>


 } */}

                  {singleCustomReservation?.cancelled_reason && (
                    <div className="   mt-4 p-1 border flex flex-col gap-1">
                      <h1 className="  font-poppinssemi text-lg">
                        {' '}
                        Cancelled Reason
                      </h1>
                      <p className=" text-red-700 font-poppinsreg text-sm">
                        {' '}
                        {singleCustomReservation?.cancelled_reason}{' '}
                      </p>
                    </div>
                  )}

                  {/* <Butto className=' bg-[#FF385C] text-white font-poppinsreg5 text-xs mt-4  w-full'>Confirm & Proceed</Button> */}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* CUSTOM RESERVATION SINGLE POPUP  */}
      </>
    )
  );
};

export default Page;
