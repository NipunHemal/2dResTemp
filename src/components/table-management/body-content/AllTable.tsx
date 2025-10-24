import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button, Input } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

const AllTable = ({
  triggerTablesFetch,
  setTriggerTablesFetch,
}: {
  triggerTablesFetch: boolean;
  setTriggerTablesFetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editProductPopup, seteditProductPopup] = useState(false);

  const [allTables, setallTables] = useState<any[]>([]);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getTablesByMerchant = async (merchantId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${backend_url}/tables/merchant/${merchantId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tables");
      }
      const data = await response.json();
      setallTables(data);
      console.log("Tables:", data);
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: session } = useSession();

  useEffect(() => {
    console.log(session?.user.id);
  }, [session]);

  useEffect(() => {
    getTablesByMerchant(session?.user.id as string);
  }, [triggerTablesFetch, session]);

  // fetch all tables for the merchant ENDS

  const formatNumber = (number: number) => number.toString().padStart(2, "0");

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
    // setSelectedFile(null);
    setBannerImage(null);
    setImageSrc(""); // Clear the image source
    // You can add more logic here to handle deleting the file from your server if necessary.

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [tempTableId, settempTableId] = useState("");

  const EditTablePopup = async (id: string) => {
    const singleTable = allTables.find((t: any) => t._id === id);

    console.log("this is the table number", singleTable);

    setImageSrc(singleTable.table_image);
    // setTableNumber(String(singleTable.table_number).padStart(2, '0'));

    setTableNumber(singleTable.table_number || "");

    setMaxSeating(String(singleTable.max_seating).padStart(2, "0"));
    setReservationFee(singleTable.reservation_fee);
    setBannerImage(null);
    settempTableId(singleTable._id);

    seteditProductPopup(true);
  };

  // EDIT PRODUCT SEND TO DATABASE

  const updateTable = async (id: string) => {
    setIsLoading(true);

    console.log("hit");

    if (!tableNumber || !maxSeating || reservationFee.length < 1) {
      console.log("something missing");
      return;
    }

    try {
      settableCreateLoad(true);

      let img = imageSrc;
      if (bannerImage) {
        console.log("banner image is there");

        const cloudinaryResponse = await uploadImage(
          bannerImage,
          "tables",
          "lm5y6hur"
        );
        img = cloudinaryResponse.secure_url;
      }

      const response = await fetch(`${backend_url}/tables/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table_number: tableNumber,
          table_image: img,
          max_seating: maxSeating,
          reservation_fee: reservationFee,
          merchant_id: session?.user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        settableCreateLoad(false);
        alert(data?.message || "Failed to update table");
        return;
      }

      console.log(data);
      setTriggerTablesFetch(!triggerTablesFetch);
      seteditProductPopup(false);
      settableCreateLoad(false);
    } catch (error) {
      console.log(error);
      settableCreateLoad(false);
    } finally {
      setIsLoading(false);
    }
  };

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

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openModal]);

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

  if (session?.user.is_onb && !session.user.is_ver) {
    signOut();
  }

  if (session?.user.is_onb && !session?.user.is_ver) return null;

  if (isLoading)
    return (
      <div className="absolute w-full">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      {allTables.map((t: any, index: number) => (
        <div
          key={t._id}
          className=" relative  hover:scale-[1.01] cursor-pointer transition-transform delay-100 duration-300 bg-[#e8e8eb] w-full gap-1  flex flex-col mx-auto rounded-lg p-[4px]"
        >
          <Image
            src={t.table_image ? t.table_image : "/noimage.png"}
            alt="food"
            width={500}
            height={500}
            className=" rounded-lg     2xl:h-[300px] h-[150px] w-full  object-cover"
          />

          <div className="px-1">
            <h1 className=" text-slate-700 text-lg   font-poppinsreg5">
              {" "}
              Table {formatNumber(t.table_number)}{" "}
            </h1>

            <h1 className="  font-poppinsreg text-slate-500">
              {" "}
              Max-Seat-Cap {formatNumber(t.max_seating)}{" "}
            </h1>
            <h1 className="  font-poppinsreg text-slate-500">
              {" "}
              Res-Fee : LKR {t?.reservation_fee}{" "}
            </h1>
          </div>

          <div className=" bg-white rounded-full w-7  z-20    p-1  h-7 absolute top-2 right-2">
            <svg
              onClick={() => {
                console.log(t), EditTablePopup(t._id);
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              className="  text-slate-700"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </div>
        </div>
      ))}

      {/* {isLoading && (
        <div className="w-full h-full absolute">
          <LoadingSpinner />
        </div>
      )} */}

      {/* edit product  */}

      {editProductPopup && (
        <div className="fixed  left-0 z-[400] flex justify-center md:p-2 lg:p-5 items-center top-0 w-full bg-opacity-80 h-full bg-black ">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ delay: 0.15 }}
              className={`lg:w-[600px] flex   max-h-[95vh] overflow-y-auto  p-10 w-[500px] mx-5 px-10 flex-col items-center bg-gray-50 rounded-lg lg:rounded-2xl opacity-100 border`}
            >
              <div className="flex w-full lg:pr-0 pr-4 lg:pt-0 pt-4 justify-end">
                <button
                  onClick={() => {
                    // setworkspacename("");
                    // resetAll()
                    seteditProductPopup(false);
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
                Edit Table
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
                      className="w-full   placeholder:font-rubik font-rubik mt-1 border-slate-300 border rounded-md focus:outline-none focus:border-[#FF2B85] transition-colors"
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
                      {(bannerImage || imageSrc) && (
                        <button
                          onClick={handleDelete}
                          className=" px-4 py-1 absolute top-2 right-2 bg-red-500 text-white rounded-md  "
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {imgupload && (
                      <p className="text-red-500 mt-3 text-sm"> {imgupload} </p>
                    )}
                  </div>

                  {
                    // !bannerImage ||
                    !tableNumber || reservationFee.length < 1 || !maxSeating ? (
                      <h1 className=" text-sm font-poppinsreg text-slate-400">
                        {" "}
                        Fill out all the field to continue{" "}
                      </h1>
                    ) : (
                      ""
                    )
                  }

                  <Button
                    isDisabled={
                      // !bannerImage ||
                      !tableNumber || reservationFee.length < 1 || !maxSeating
                    }
                    isLoading={tableCreateLoad}
                    onPress={() => updateTable(tempTableId)}
                    type="submit"
                    size="md"
                    className="bg-[#FF385C] mt-3 font-poppinsreg  w-fit  text-white "
                  >
                    {" "}
                    Edit Table{" "}
                  </Button>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default AllTable;
