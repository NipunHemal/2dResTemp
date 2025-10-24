'use client';
import Sidebar from '@/comp/Sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const Page = () => {
  const { data: session, status } = useSession();

  const [showme, setshowme] = useState(false);

  const years = [
    // { key: '2024', label: '2024' },
    { key: '2025', label: '2025' },
  ];

  const [selectedItem, setSelectedItem] = useState(years[0].key);

  const handleSelectChange = (event: any) => {
    console.log(event.target.value);

    setSelectedItem(event.target.value);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (session?.user.is_onb && session.user.is_ver) {
      setshowme(true);
    }
  }, [session]);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [yearlyData, setyearlyData] = useState<any>([]);

  const [thisMonth, setthisMonth] = useState<any>({});

  // yearly data
  useEffect(() => {
    const fetchMonthlyReservations = async () => {
      try {
        const response = await fetch(
          `${backend_url}/reservations/getYearlyData/${session?.user.id}?year=${selectedItem}`,
        );
        const result = await response.json();

        console.log('this is result', result);

        if (result.status === 'success') {
          // setData(result.data);
          console.log(result.data);

          setyearlyData(result.data);

          const currentMonth = new Date().toLocaleString('default', {
            month: 'long',
          }); // Get current month in full form
          const thisMonthData = result.data.find(
            (d: any) => d.name === currentMonth,
          );
          setthisMonth(thisMonthData);
        } else {
          // setError(result.message);
          console.log(result.message);
        }
      } catch (error) {
        // setError('Error fetching monthly reservations');
        console.log('Error fetching monthly reservations');
      }
    };

    fetchMonthlyReservations();
  }, [session, selectedItem]);

  // yearly data

  interface monthyReservation {
    _id: string;
    reference: number;
    date: string;
    reservation_fee: number;
  }

  const [monthlyReservation, setmonthlyReservation] = useState<
    monthyReservation[]
  >([]);

  const [popUpTotal, setpopUpTotal] = useState(0);

  const [selectedMonth, setselectedMonth] = useState('');

  // get monthly reservation data for a specific year
  const fetchReservationsForMonth = async (year: any, month: string) => {
    try {
      const response = await fetch(
        `${backend_url}/reservations/monthly-details/${session?.user.id}?year=${year}&month=${month}`,
      );
      const result = await response.json();

      if (result.status === 'success') {
        // setReservations(result.data);
        console.log(result.data);
        setmonthlyReservation(result.data);
        setselectedMonth(month);

        const totalReservationFee = result.data.reduce(
          (total: number, reservation: any) => {
            return total + reservation.reservation_fee;
          },
          0,
        );

        setpopUpTotal(totalReservationFee);

        onOpen();
      } else {
        // setError(result.message);
        console.log(result.message);
      }
    } catch (error) {
      // setError('Error fetching reservations for the month');
      console.log('Error fetching reservations for the month');
    }
  };
  // get monthly reservation data for a specific year

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

  const [clickedTab, setclickedTab] = useState('billings');

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

  if (session?.user.is_onb && !session.user.is_ver) {
    signOut();
  }

  if (session?.user.is_onb && !session?.user.is_ver) return null;

  return (
    showme && (
      <>
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

            <div className=" w-full p-4 flex sm:flex-row flex-col sm:gap-0 gap-4 items-center justify-between">
              <Select
                disallowEmptySelection={true}
                radius="md"
                //   placeholder="Select an option"
                value={selectedItem}
                onChange={handleSelectChange}
                defaultSelectedKeys={[selectedItem]}
                className="max-w-40 font-poppinsreg"
              >
                {years.map((year) => (
                  <SelectItem key={year.key} value={year.key}>
                    {year.label}
                  </SelectItem>
                ))}
              </Select>

              <div className=" border p-5 rounded-md  flex gap-2 items-center  ">
                <h1 className=" text-slate-400 font-poppinsreg5">
                  {' '}
                  {`Total Payable (This Month) : `}{' '}
                </h1>
                <h1 className=" font-poppinsreg5 text-green-600">
                  {' '}
                  LKR {thisMonth.total_fee_count}{' '}
                </h1>
              </div>
            </div>

            {/* component  */}
            <div className=" p-4 w-full grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-3 gap-4">
              {yearlyData?.map((r: any) => (
                <div
                  key={r.name}
                  className={` flex flex-col gap-2  ${
                    r.total_fee_count > 0 && '   bg-emerald-50 '
                  }   border-slate-300 border-[2px] rounded-md    w-full`}
                >
                  <h1
                    className={` font-poppinsreg5 border-b p-3   bg-[#18181B] text-white   pb-3 text-xl text-center `}
                  >
                    {r.name}{' '}
                  </h1>

                  <div className=" flex flex-col  gap-3">
                    <div className=" flex flex-col  items-center">
                      <div className=" flex flex-col items-center">
                        <h1
                          className={` ${
                            r.total_fee_count
                              ? 'text-slate-700'
                              : 'text-slate-400'
                          }  font-poppinsreg`}
                        >
                          {' '}
                          Total Reservations{' '}
                        </h1>
                        <h1
                          className={`text-3xl ${
                            r.total_fee_count
                              ? 'font-robotosemi'
                              : ' font-poppinsreg5'
                          } `}
                        >
                          {' '}
                          {r.reservations}{' '}
                        </h1>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className=" flex flex-col  items-center">
                        <h1
                          className={` ${
                            r.total_fee_count
                              ? 'text-slate-700'
                              : 'text-slate-400'
                          }  font-poppinsreg`}
                        >
                          {' '}
                          Payouts{' '}
                        </h1>
                        <h1
                          className={`text-2xl ${
                            r.total_fee_count
                              ? 'text-green-800 font-poppinssemi'
                              : 'text-green-600'
                          } font-poppinsreg5   `}
                        >
                          {' '}
                          LKR {r.total_fee_count}{' '}
                        </h1>
                      </div>
                    </div>
                  </div>

                  <h1
                    onClick={() =>
                      fetchReservationsForMonth(selectedItem, r.name)
                    }
                    className=" cursor-pointer pb-3 text-center underline"
                  >
                    {' '}
                    See Details{' '}
                  </h1>
                </div>
              ))}
            </div>
            {/* component  */}
          </div>
        </div>
        {/* md:min-h-fit */}
        {/* modal content min-h-fit max-h-5/6 overflow-y-auto */}
        {/* the modal  */}
        <Modal
          className=" md:h-fit h-screen  md:max-h-[95vh]  py-3   overflow-y-auto"
          size="2xl"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent className=" ">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Reservations For {selectedMonth}
                </ModalHeader>
                <h1 className=" px-6 text-xl font-poppinsreg5 text-slate-400 ">
                  {' '}
                  Total :{' '}
                  <span className="text-green-600 font-poppinsreg5">
                    {' '}
                    LKR {popUpTotal}{' '}
                  </span>{' '}
                </h1>
                <ModalBody>
                  <Table className="  border-t">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center  text-slate-400 font-poppinsreg5">
                          Date
                        </TableHead>
                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Reference
                        </TableHead>

                        <TableHead className="text-center text-slate-400 font-poppinsreg5">
                          Fee
                        </TableHead>

                        {/* <TableHead className="text-center font-poppinsreg5">Seating Capacity</TableHead>
    <TableHead className="text-center font-poppinsreg5">Reserve</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyReservation?.map((r) => (
                        <TableRow key={r._id}>
                          <TableCell className="text-center text-slate-900  font-robotosemi">
                            {/* <h1> {reservation?.date} </h1> */}
                            <h1> {r.date} </h1>
                          </TableCell>
                          <TableCell className="text-center text-slate-900 font-poppinsreg5">
                            {/* <h1> {reservation?.reference} </h1> */}
                            <h1> {r.reference} </h1>
                          </TableCell>

                          <TableCell className="text-center font-poppinsreg5">
                            <h1 className="text-green-600">
                              {' '}
                              LKR {r.reservation_fee}{' '}
                            </h1>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {monthlyReservation.length === 0 && (
                    <h1 className=" font-poppinsreg my-3 text-center text-slate-400">
                      {' '}
                      No Data Available{' '}
                    </h1>
                  )}
                </ModalBody>
                {/* <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
              </>
            )}
          </ModalContent>
        </Modal>
        {/* the modal  */}
      </>
    )
  );
};

export default Page;
