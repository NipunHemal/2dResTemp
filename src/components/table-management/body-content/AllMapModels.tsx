import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { BaseComponent, RestaurantLayout } from "@/types/restaurant";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Create2DMap from "../create-2d-map/Create2DMapDialog";

const AllMapModels = ({
  triggerTablesFetch,
  setTriggerTablesFetch,
}: {
  triggerTablesFetch: boolean;
  setTriggerTablesFetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editProductPopup, seteditProductPopup] = useState(false);
  const [activeMapModel, setActiveMapModel] = useState<RestaurantLayout | null>(
    null
  );

  // useEffect(() => {
  //   if (editProductPopup == false) {
  //     setActiveMapModel(null);
  //   }
  // }, [editProductPopup]);

  const [allMapModels, setAllMapModels] = useState<RestaurantLayout[]>([]);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  // const getTablesByMerchant = async (merchantId: string) => {
  //   try {
  //     const response = await fetch(
  //       `${backend_url}/tables/merchant/${merchantId}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch tables");
  //     }
  //     const data = await response.json();
  //     setallTables(data);
  //     console.log("Tables:", data);
  //   } catch (error: any) {
  //     console.error("Error:", error.message);
  //   }
  // };

  const getMapModelsByMerchant = async (merchantId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${backend_url}/selection-model/merchant/${merchantId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch map models");
      }
      const data = await response.json();
      setAllMapModels(data);
      console.log("MapModels:", data);
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
    // getTablesByMerchant(session?.user.id as string);
    getMapModelsByMerchant(session?.user.id as string);
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

  const EditTablePopup = async (mapModel: RestaurantLayout) => {
    setActiveMapModel(mapModel);
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
      <div className="w-full absolute">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      {allMapModels?.map((t: RestaurantLayout, index: number) => (
        <div
          key={t.id}
          className="relative  hover:scale-[1.01] cursor-pointer transition-transform delay-100 duration-300 bg-[#e8e8eb] w-full gap-1  flex flex-col mx-auto rounded-lg p-[4px]"
        >
          <Image
            src={
              "https://res.cloudinary.com/deyk0uh6i/image/upload/v1761053081/tables/rhlore1zkrrp1tivjipq.jpg"
            }
            alt="food"
            width={500}
            height={500}
            className=" rounded-lg     2xl:h-[300px] h-[150px] w-full  object-cover"
          />

          <div className="px-1">
            <h1 className=" text-slate-700 text-lg   font-poppinsreg5">
              {t.name}
            </h1>

            <h1 className="  font-poppinsreg text-slate-500">
              Table Count :{" "}
              {formatNumber(
                t.components.filter((i: BaseComponent) => i.type == "table")
                  .length || 0
              )}
            </h1>
            {/* <h1 className="  font-poppinsreg text-slate-500">
              {" "}
              Res-Fee : LKR {t?.reservation_fee}{" "}
            </h1> */}
          </div>

          <div className=" bg-white rounded-full w-7  z-20    p-1  h-7 absolute top-2 right-2">
            <svg
              onClick={() => {
                EditTablePopup(t);
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

      {/* edit product  */}

      {editProductPopup && !!activeMapModel && (
        <Create2DMap
          open={editProductPopup}
          setOpen={seteditProductPopup}
          triggerRefish={() => setTriggerTablesFetch(true)}
          isEdit={true}
          mapObject={activeMapModel}
        />
      )}
    </>
  );
};

export default AllMapModels;
