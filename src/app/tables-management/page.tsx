"use client";
import Sidebar from "@/comp/Sidebar";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Create2DMap from "@/components/table-management/create-2d-map/Create2DMapDialog";
import AllTable from "@/components/table-management/body-content/AllTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllMapModels from "@/components/table-management/body-content/AllMapModels";

const Page = () => {
  const [showproductpopup, setshowproductpopup] = useState(false);
  const [create2dMapPopup, setcreate2dMapPopup] = useState(false);

  const [triggerTablesFetch, settriggerTablesFetch] = useState(false);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session?.user.id);
  }, [session]);

  const [tableError, settableError] = useState("");

  const uploadImage = async (file: File, folder: string, preset: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    formData.append("folder", folder);
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/deyk0uh6i/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      settableCreateLoad(false);
      throw new Error("Failed to upload image to Cloudinary");
    }
    //  const image = await response.json()
    //  console.log(image.secure_url);

    return response.json();
  };

  const createTable = async () => {
    if (
      !tableNumber ||
      // || !bannerImage
      !maxSeating ||
      !reservationFee
    ) {
      console.log("something missing");
      return;
    }

    try {
      settableError("");

      settableCreateLoad(true);

      let imageURL = "";

      if (bannerImage) {
        const cloudinaryResponse = await uploadImage(
          bannerImage,
          "tables",
          "lm5y6hur"
        );

        imageURL = cloudinaryResponse.secure_url;
      }

      // const imageURL = cloudinaryResponse.secure_url;

      const response = await fetch(`${backend_url}/tables`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table_number: tableNumber,
          table_image: imageURL,
          max_seating: maxSeating,
          reservation_fee: reservationFee,
          merchant_id: session?.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // console.log('Error from backend:', errorData.message || errorData.error);
        settableCreateLoad(false);
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);
      settriggerTablesFetch(!triggerTablesFetch);
      setshowproductpopup(false);
      settableCreateLoad(false);
    } catch (error: any) {
      console.log(error);
      settableError(error.message);
      settableCreateLoad(false);
    }
  };

  const [tableNumber, setTableNumber] = useState<any>();

  const [maxSeating, setMaxSeating] = useState<any>();
  const [reservationFee, setReservationFee] = useState<any>();
  const [tableCreateLoad, settableCreateLoad] = useState(false);

  const [imgupload, setimgupload] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // setSelectedFile(file);
      setBannerImage(file);
      setimgupload("");

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          setImageSrc(e.target.result as string); // Cast to string
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setBannerImage(null);
    setImageSrc("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // CREATE A NEW TABLE

  const resetTableFields = () => {
    setImageSrc("");
    setTableNumber("");
    setMaxSeating("");
    setReservationFee("");
    setBannerImage(null);
  };

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

  const [clickedTab, setclickedTab] = useState("tables");

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
      <>
        <div className=" flex  min-h-screen   w-full overflow-hidden">
          <div className="fixed">
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
                </div>

                {/* dropdowns  */}
              </div>
            </div>
            {/* the hamburger sheet  */}

            {/* mobile  */}

            <div className=" border-b p-4 flex gap-4 ">
              <Button
                onPress={() => {
                  resetTableFields();
                  setshowproductpopup(true);
                }}
                className="bg-[#FF385C]  text-white px-6  font-poppinsreg"
              >
                Add Table
              </Button>
              <Button
                onPress={() => {
                  setcreate2dMapPopup(true);
                }}
                className="bg-[#FF385C]  text-white px-6  font-poppinsreg"
              >
                Create Resturent Map
              </Button>
            </div>

            <Tabs defaultValue="tabTable" className="p-4">
              <TabsList>
                <TabsTrigger value="tabTable">Table</TabsTrigger>
                <TabsTrigger value="tab2DMap">2D Map</TabsTrigger>
              </TabsList>
              <TabsContent
                value="tabTable"
                className="grid gap-y-5 gap-x-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                <AllTable
                  triggerTablesFetch={triggerTablesFetch}
                  setTriggerTablesFetch={settriggerTablesFetch}
                />
              </TabsContent>
              <TabsContent
                value="tab2DMap"
                className="grid gap-y-5 gap-x-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                <AllMapModels
                  triggerTablesFetch={triggerTablesFetch}
                  setTriggerTablesFetch={settriggerTablesFetch}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* new table add  */}

        {showproductpopup && (
          <div className="fixed  left-0 z-[400] flex justify-center items-center top-0 w-full bg-opacity-80     md:p-2 lg:p-5   h-full bg-black ">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 150 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ delay: 0.15 }}
                className={`lg:w-[600px]    max-h-[95vh]  overflow-y-auto   flex  p-10 w-[500px] mx-5 px-10 flex-col items-center bg-gray-50 rounded-lg lg:rounded-2xl opacity-100 border`}
              >
                <div className="flex w-full lg:pr-0 pr-4 lg:pt-0 pt-4 justify-end">
                  <button
                    onClick={() => {
                      // setworkspacename("");
                      // resetAll()
                      setshowproductpopup(false);
                      settableCreateLoad(false);

                      // setworkspaceerror("");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 cursor-pointer"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <h1 className="text-[#FF385C]  font-poppinsreg5  text-2xl w-full">
                  Add New Table
                </h1>
                {/* bg-[#FF385C] */}
                <div className="w-full justify-center flex flex-col">
                  <div className="border-b w-full mt-2"></div>
                </div>

                <div className="w-full mt-4">
                  {/* onSubmit={handleProductSubmit} */}
                  <form className=" flex flex-col gap-4">
                    {/* jjjjjjjjjjjjjjjjjjjjjjjj */}
                    <div>
                      <label className="    font-poppinsreg5 text-slate-700">
                        Table Number
                      </label>
                      <Input
                        value={tableNumber}
                        // onChange={(e) => setTableNumber(e.target.value)}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (/^[a-zA-Z0-9]*$/.test(value)) {
                            setTableNumber(value.toUpperCase());
                          }
                        }}
                        type="text"
                        className="w-full  placeholder:font-rubik font-rubik mt-1 border-slate-300 border rounded-md focus:outline-none focus:border-[#FF2B85] transition-colors"
                        placeholder="Table Num"
                        // required
                      />
                    </div>

                    <div className=" ">
                      <label className="    font-poppinsreg5 text-slate-700">
                        Maximum Seating Capacity
                      </label>
                      <Input
                        // variant="flat"
                        min={0}
                        type="number"
                        value={maxSeating}
                        onChange={(e) => setMaxSeating(e.target.value)}
                        //  required
                        className="w-full   placeholder:font-rubik font-rubik mt-1  border-slate-300 border  rounded-md focus:outline-none focus:border-[#FF2B85] transition-colors"
                        placeholder="Enter Capacity"
                      />
                    </div>

                    <div className=" ">
                      <label className="    font-poppinsreg5 text-slate-700">
                        Reservation Fee For Table
                      </label>
                      <Input
                        min={0}
                        type="number"
                        value={reservationFee}
                        onChange={(e) => setReservationFee(e.target.value)}
                        //  required
                        className="w-full  placeholder:font-rubik font-rubik mt-1 border-slate-300 border  rounded-md focus:outline-none focus:border-[#FF2B85] transition-colors"
                        placeholder="Reservation Fee"
                      />
                    </div>

                    <div>
                      <label className="    font-poppinsreg5 text-slate-700">
                        Table Image
                      </label>

                      <div className="flex mt-2 items-center lg:w-full  w-full  relative bg-gray-200  ">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col lg:w-full  w-full    h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          {imageSrc ? (
                            <div className="relative   h-full ">
                              <Image
                                src={imageSrc}
                                alt="Uploaded"
                                className="w-full  h-full object-cover rounded-lg"
                                width={1000}
                                height={1000}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center  h-full justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="  font-poppinsreg6">
                                  Click to upload image
                                </span>
                              </p>
                              {/* <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p> */}
                            </div>
                          )}

                          <input
                            id="dropzone-file"
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/jpeg, image/png"
                          />
                        </label>
                        {bannerImage && (
                          <button
                            onClick={handleDelete}
                            className=" px-4 py-1 absolute top-2 right-2 bg-red-500 text-white rounded-md  "
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {imgupload && (
                        <p className="text-red-500 mt-3 text-sm">
                          {" "}
                          {imgupload}{" "}
                        </p>
                      )}
                    </div>

                    {
                      // !bannerImage ||
                      !tableNumber || !reservationFee || !maxSeating ? (
                        <h1 className=" text-sm font-poppinsreg text-slate-400">
                          {" "}
                          Fill out all the field to continue{" "}
                        </h1>
                      ) : (
                        ""
                      )
                    }

                    {tableError && (
                      <h1 className=" text-sm font-poppinsreg text-red-400">
                        {" "}
                        {tableError}{" "}
                      </h1>
                    )}

                    <Button
                      isDisabled={
                        // !bannerImage ||
                        !tableNumber || !reservationFee || !maxSeating
                      }
                      isLoading={tableCreateLoad}
                      onPress={createTable}
                      size="md"
                      className="bg-[#FF385C] mt-3 font-poppinsreg  w-fit  text-white "
                    >
                      {" "}
                      Add Table{" "}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* create 2d  map  */}
        {create2dMapPopup && (
          <Create2DMap
            open={create2dMapPopup}
            setOpen={setcreate2dMapPopup}
            triggerRefish={() => settriggerTablesFetch(true)}
          />
        )}
      </>
    )
  );
};

export default Page;
