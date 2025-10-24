'use client';
import Sidebar from '@/comp/Sidebar';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionItem,
  Button,
  input,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTemp } from '@/context/tempContext';

const Page = () => {
  const [clickedTab, setclickedTab] = useState('Profile');

  const { data: session, status } = useSession();

  const [selectedPlanMonths, setselectedPlanMonths] = useState(6);

  // merchant mobile number
  const [phoneNumber, setPhoneNumber] = useState('+94');

  // console.log(session?.user);

  // phone number change handle
  const handlePhoneNumberChange = (e: any) => {
    const input = e.target.value;

    // Ensure the input starts with +94
    if (!input.startsWith('+94')) {
      return;
    }

    // Remove any non-numeric characters except + and limit to 9 digits after +94
    const cleanedInput = input.replace(/[^0-9+]/g, '').slice(0, 12);

    // Set the cleaned input value
    setPhoneNumber(cleanedInput);
  };
  // phone number change handle
  // merchant mobile number

  // enable disbale custom event reservation

  const [customEvent, setcustomEvent] = useState(false);

  // const [activateSave, setactivateSave] = useState<boolean | null>()

  const [NOTshowsavebtn, setNOTshowsavebtn] = useState<boolean>(true);

  const handleSwitchChange = (checked: boolean) => {
    setNOTshowsavebtn(false);
    setcustomEvent(checked);
  };
  // enable disbale custom event reservation

  // OPENING HOURS SETUP AND EDIT

  interface OpeningHour {
    day: string;
    open: Date | null;
    close: Date | null;
  }

  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([
    { day: 'Sunday', open: null, close: null },
    { day: 'Monday', open: null, close: null },
    { day: 'Tuesday', open: null, close: null },
    { day: 'Wednesday', open: null, close: null },
    { day: 'Thursday', open: null, close: null },
    { day: 'Friday', open: null, close: null },
    { day: 'Saturday', open: null, close: null },
  ]);

  const [errorMessage, setErrorMessage] = useState('');

  // const handleTimeChange = (day:any, type:any, time:any) => {
  //   const updatedHours = openingHours.map((hours, index) => {
  //     if (index === day) {
  //       return {
  //         ...hours,
  //         [type]: time,
  //       };
  //     }
  //     return hours;
  //   });
  //   setOpeningHours(updatedHours);
  // };

  const formatDateForAPI = (date: Date | null): string | null => {
    if (!date) return null;

    const isoString = date.toISOString(); // Convert date to ISO 8601 string
    return isoString; // Return the ISO string
  };

  // const handleTimeChange = (index: number, type: 'open' | 'close', time: Date | null) => {
  //   setOpeningHours(prevHours => {
  //     const updatedHours = [...prevHours];
  //     updatedHours[index] = {
  //       ...updatedHours[index],
  //       [type]: time,
  //     };
  //     return updatedHours;
  //   });
  // };

  const handleTimeChange = (
    index: number,
    type: 'open' | 'close',
    time: Date | null,
  ) => {
    setOpeningHours((prevHours) => {
      const updatedHours = [...prevHours];
      updatedHours[index] = {
        ...updatedHours[index],
        [type]: formatDateForAPI(time), // Format the time using the function
      };
      return updatedHours;
    });
  };

  // OPENING HOURS SETUP AND EDIT

  // IMAGES SETUP BANNER AND COVER EDITS UPLOADS SECTION 3
  const [imgupload, setimgupload] = useState('');
  const [imgupload2, setimgupload2] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageSrc2, setImageSrc2] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);

  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [coverImage, setcoverImage] = useState<File | null>(null);

  // image upload functionality
  const [UploadBannerImage, setUploadBannerImage] = useState('');
  const [UploadProfileImage, setUploadProfileImage] = useState('');
  // image upload functionality

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // setSelectedFile(file);
      setBannerImage(file);
      setimgupload('');

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          setImageSrc(e.target.result as string); // Cast to string
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange2 = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // setSelectedFile2(file);
      setcoverImage(file);
      setimgupload2('');

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          setImageSrc2(e.target.result as string); // Cast to string
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [imageuploadingloadingbtn, setimageuploadingloadingbtn] =
    useState(false);

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const [tempImage, settempImage] = useState('');
  const [tempImage2, settempImage2] = useState('');

  const handleDelete = () => {
    // setSelectedFile(null);
    setBannerImage(null);
    // setImageSrc(""); // Clear the image source
    setImageSrc(tempImage);
    // You can add more logic here to handle deleting the file from your server if necessary.

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete2 = () => {
    setSelectedFile2(null);
    setcoverImage(null);
    setImageSrc2(tempImage2);
    // setImageSrc2(""); // Clear the image source
    // You can add more logic here to handle deleting the file from your server if necessary.

    if (fileInputRef2.current) {
      fileInputRef2.current.value = '';
    }
  };

  // IMAGES SETUP BANNER AND COVER EDITS UPLOADS SECTION 3 ENDS

  // ADD NEW PHONE NUMBER

  // /add-merchant-contact
  // /merchant

  const [phoneNumberLoad, setphoneNumberLoad] = useState(false);
  const [triggerNumberFetch, settriggerNumberFetch] = useState(false);

  const addContactNumber = async () => {
    setphoneNumberLoad(true);
    if (phoneNumber.length === 11) {
      setphoneNumberLoad(false);
      return;
    }

    try {
      const response = await fetch(
        `${backend_url}/merchant/add-merchant-contact`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // customer_email : session?.user.email
            email: session?.user.email,
            contact_num: phoneNumber,
          }),
        },
      );

      const data = await response.json();
      console.log(data);

      setphoneNumberLoad(false);
      setPhoneNumber('+94');

      settriggerNumberFetch(!triggerNumberFetch);
    } catch (error) {
      console.log(error);

      setphoneNumberLoad(false);
    }
  };

  // ADD NEW PHONE NUMBER ENDS

  // getContactNumMerchant

  const [displayNumberText, setdisplayNumberText] = useState('');
  const [inputfalse, setinputfalse] = useState(false);
  const [buttonfalse, setbuttonfalse] = useState(false);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getContactNumber = async () => {
    //  getContactNumber

    try {
      const response = await fetch(
        `${backend_url}/merchant/fetch-merchant-contact/${session?.user.email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();
      console.log(data);

      setdisplayNumberText(data.contact_num);
      if (data.contact_num) {
        setinputfalse(false);
        setbuttonfalse(false);
      }

      if (!data.contact_num) {
        setinputfalse(true);
        setbuttonfalse(true);
      }
      // setPhoneNumber("+94")
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContactNumber();
  }, [triggerNumberFetch, session]);

  // const { data: session, status } = useSession();

  // UPDATE PASSWORD

  // updatePassword

  const [oldpassword, setoldpassword] = useState('');
  const [newpassword, setnewpassword] = useState('');

  const [changePassword, setchangePassword] = useState(false);

  const [updatePassLoading, setupdatePassLoading] = useState(false);

  const [successMessage, setsuccessMessage] = useState(false);
  const [errroMessagePassword, seterrroMessagePassword] = useState(false);

  const updatePassword = async () => {
    setupdatePassLoading(true);
    seterrroMessagePassword(false);
    seterrroMessagePassword(false);
    try {
      const response = await fetch(`${backend_url}/api/auth/updatePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // customer_email : session?.user.email
          email: session?.user.email,
          oldPassword: oldpassword,
          newPassword: newpassword,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.message === 'Incorrect old password or email') {
        setupdatePassLoading(false);
        setchangePassword(false);
        seterrroMessagePassword(true);
        setchangePassword(false);
        setoldpassword('');
        setnewpassword('');
        setTimeout(() => {
          seterrroMessagePassword(false);
        }, 1500);
        return;
      }

      setupdatePassLoading(false);

      setsuccessMessage(true);
      setchangePassword(false);
      setoldpassword('');
      setnewpassword('');
      setTimeout(() => {
        setsuccessMessage(false);
      }, 1500);
    } catch (error) {
      console.log(error);
      setchangePassword(false);
      setupdatePassLoading(false);
      setoldpassword('');
      setnewpassword('');
    }
  };

  // UPDATE PASSWORD

  // fffffffffffffffffffffff

  const [triggerCustomStausfetch, settriggerCustomStausfetch] = useState(false);

  useEffect(() => {
    // /getHaveCustom
    // setcustomEvent

    const getCustomReservationStatus = async () => {
      try {
        if (session) {
          const response = await fetch(
            `${backend_url}/merchant/getHaveCustom/${session?.user.email}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          const data = await response.json();
          console.log(data);
          setcustomEvent(data.have_custom);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCustomReservationStatus();
  }, [session, triggerCustomStausfetch]);

  // updateCustomReservationStatus

  // vvvvvvvvvvvvvvvvvvvvvvvvvvvv
  const [customBtnLoad, setcustomBtnLoad] = useState(false);

  const updateCustomResStatus = async () => {
    setcustomBtnLoad(true);

    try {
      if (session) {
        const response = await fetch(
          `${backend_url}/merchant/updateCustomReservationStatus`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // customer_email : session?.user.email
              email: session?.user.email,
              have_custom: customEvent,
            }),
          },
        );

        const data = await response.json();
        console.log(data);

        settriggerCustomStausfetch(!triggerCustomStausfetch);

        setcustomBtnLoad(false);
        setNOTshowsavebtn(true);
      }
    } catch (error) {
      console.log(error);
      setcustomBtnLoad(false);
      setNOTshowsavebtn(true);
    }
  };

  const [showme, setshowme] = useState(false);

  const [openingHoursExist, setOpeningHoursExist] = useState([]);

  // useEffect(() => {
  //   // Fetch opening hours from the backend
  //   const fetchOpeningHours = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/merchant/getOpeningHours/${session?.user.id}`);
  //       const data = await response.json();

  //       if (data.status === 'success') {
  //         setOpeningHoursExist(data.openingHours);
  //       } else {
  //         console.error('Failed to fetch opening hours');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching opening hours:', error);
  //     }
  //   };

  //   fetchOpeningHours();
  // }, []);

  const [triggerOpeningHoursFetch, settriggerOpeningHoursFetch] =
    useState(false);

  useEffect(() => {
    // Fetch opening hours from the backend
    const fetchOpeningHours = async () => {
      try {
        const response = await fetch(
          `${backend_url}/merchant/getOpeningHours/${session?.user.id}`,
        );
        const data = await response.json();

        if (data.status === 'success') {
          setOpeningHoursExist(data.openingHours);
          // Initialize openingHours with data from the API
          const updatedOpeningHours = openingHours.map((dayHours) => {
            const foundHours = data.openingHours.find(
              (hours: any) => hours.day === dayHours.day,
            );
            return foundHours ? { ...dayHours, ...foundHours } : dayHours;
          });
          setOpeningHours(updatedOpeningHours);
        } else {
          console.error('Failed to fetch opening hours');
        }
      } catch (error) {
        console.error('Error fetching opening hours:', error);
      }
    };

    fetchOpeningHours();
  }, [session?.user.id, triggerOpeningHoursFetch]);

  const findOpeningHours = (day: any) => {
    return openingHoursExist.find((hours: any) => hours.day === day);
  };

  // const formatTime = (time:any) => {
  //   return new Date(time).toLocaleTimeString([], {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: true
  //   });
  // };

  const formatTime = (time: any) => {
    if (!time) {
      return 'Closed';
    }
    return new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const [editHours, seteditHours] = useState(false);

  // get the images

  const [triggerImageFetch, settriggerImageFetch] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${backend_url}/merchant/images/${session?.user.id}`,
        );
        const data = await response.json();

        if (data.status === 'success') {
          setImageSrc(data.images.banner_img);
          settempImage(data.images.banner_img);
          setImageSrc2(data.images.cover_img);
          settempImage2(data.images.cover_img);
        } else {
          console.error('Failed to fetch images:', data.message);
        }
      } catch (error: any) {
        console.error('Error fetching images:', error.message);
      }
    };

    fetchImages();
  }, [session, triggerImageFetch]);
  // get the images

  // opening hours update
  const [saveHoursBtnLoad, setsaveHoursBtnLoad] = useState(false);

  const updateHours = async () => {
    setErrorMessage('');

    for (let i = 0; i < openingHours.length; i++) {
      const { open, close } = openingHours[i];
      if ((open && !close) || (!open && close)) {
        console.log(
          `Error: Incomplete business hours for ${
            [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ][i]
          }`,
        );

        setErrorMessage(
          `Error: Incomplete business hours for ${
            [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ][i]
          }`,
        );
        return; // Stop further execution
      }
    }

    console.log(openingHours);

    // /merchant/update-opening-hours/:id'
    try {
      setsaveHoursBtnLoad(true);
      const response = await fetch(
        `${backend_url}/merchant/update-opening-hours/${session?.user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ openingHours }),
        },
      );

      const data = await response.json();
      console.log(data);
      settriggerOpeningHoursFetch(!triggerOpeningHoursFetch);
      setsaveHoursBtnLoad(false);
      seteditHours(false);
    } catch (error) {
      console.error('Error updating opening hours:', error);
      setsaveHoursBtnLoad(false);
      seteditHours(false);
    }
  };
  // opening hours update

  // IMAGES UPDATE
  const [updateImgBtnLoad, setupdateImgBtnLoad] = useState(false);
  const [imageUpdated, setimageUpdated] = useState(false);

  const updateImages = async () => {
    try {
      setupdateImgBtnLoad(true);
      const formData = new FormData();
      if (bannerImage) {
        formData.append('bannerImage', bannerImage);
      }
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      formData.append('upload_preset', 'lm5y6hur'); // Replace with your Cloudinary upload preset

      // Assuming we upload one image at a time, we should loop through the form data
      const uploadImage = async (file: File, preset: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset);
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/deyk0uh6i/image/upload',
          {
            method: 'POST',
            body: formData,
          },
        );
        if (!response.ok) {
          setupdateImgBtnLoad(false);
          throw new Error('Failed to upload image to Cloudinary');
        }
        return response.json();
      };

      // Upload banner image if it exists
      let bannerImageUrl = '';
      let coverImageUrl = '';
      if (bannerImage) {
        const bannerImageData = await uploadImage(bannerImage, 'lm5y6hur');
        bannerImageUrl = bannerImageData.secure_url;
        console.log('Banner Image URL:', bannerImageData.secure_url);
      }

      // Upload cover image if it exists
      if (coverImage) {
        const coverImageData = await uploadImage(coverImage, 'lm5y6hur');
        coverImageUrl = coverImageData.secure_url;
        console.log('Cover Image URL:', coverImageData.secure_url);
      }

      // Upload city data to backend with the image URL
      // below part

      const response = await fetch(
        `${backend_url}/merchant/update-imagez/${session?.user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bannerImageUrl,
            coverImageUrl,
          }),
        },
      );

      if (!response.ok) {
        setupdateImgBtnLoad(false);
        throw new Error('Failed to upload images to the backend');
      }
      const imageData = await response.json();
      console.log('images uploaded:', imageData);

      setBannerImage(null);
      setcoverImage(null);
      settriggerImageFetch(!triggerImageFetch);

      setupdateImgBtnLoad(false);

      setimageUpdated(true);

      setTimeout(() => {
        setimageUpdated(false);
      }, 2000);

      // above part
    } catch (error) {
      console.error('Error uploading image data:', error);
      setupdateImgBtnLoad(false);
    }
  };

  // IMAGES UPDATE

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

  const [clickedroute, setclickedroute] = useState('settings');

  // payment related
  const plans = {
    Starter: {
      title: 'Starter',
      description: 'All the basics for starting a new business',
      features: [
        '⭐ Up to 40 reservations per month',
        '⭐ Access to basic analytics',
        '⭐ Basic Table Management',
        '⭐ Community support or email support with a longer response time',
      ],
    },
    Pro: {
      title: 'Pro',
      description: 'Advanced features to scale your business',
      features: [
        '⭐ Unlimited Reservations',
        '⭐ Advanced Analytics',
        '⭐ Enhanced Table Management',
        '⭐ Marketing Tools',
        '⭐ Priority email Support',
        '⭐ Ability to run limited promotions or discounts',
      ],
    },
    Premium: {
      title: 'Premium',
      description: 'Premium features that take your business to the next level',
      features: [
        '⭐ Unlimited Reservations',
        '⭐ Comprehensive Analytics',
        '⭐ Full Table Management',
        '⭐ Free POS Access',
        '⭐ Full Marketing Suite',
        '⭐ Dedicated account manager or 24/7 support',
        '⭐ Premium Listing',
        '⭐ Custom Branding',
      ],
    },
  };

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // const openModal2 = (plan:string) => setSelectedPlan(plan);
  // const closeModal = () => setSelectedPlan(null);
  const planOrder: any = {
    starter: 0,
    pro: 1,
    premium: 2,
  };
  const [plan, setPlan] = useState<string | null>(null);
  const [warning, setWarning] = useState('');
  const [merchantSubscribed, setMerchantSubscribed] = useState<string | null>(
    null,
  );

  const [merchantSubscribedPeriodDB, setMerchantSubscribedPeriodDB] = useState<
    string | null
  >(null);

  // get payment status
  useEffect(() => {
    const getSubscription = async (email: string) => {
      try {
        const res = await fetch(
          `${backend_url}/merchant/subscription-status?email=${email}`,
        );
        const data = await res.json();
        console.log('data with status', data);

        if (data.success) {
          setMerchantSubscribed(data.subscription); // Sets "free", "pro", or "premium"
          setMerchantSubscribedPeriodDB(data.subscribed_period);
        } else {
          console.error('Failed to fetch subscription:', data.message);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    getSubscription(session?.user.email as any);
  }, [session]);

  // get payment status

  const closeModal = () => {
    setPlan(null);
    setWarning('');
    setselectedPlanMonths(6);
  };

  const { merchantEmail, setMerchantEmail } = useTemp();

  const handleSubscribe = async () => {
    setWarning('');
    const currentRank = planOrder[merchantSubscribed as any];
    const selectedRank = planOrder[plan as any];

    if (selectedRank === currentRank) {
      setWarning(`You're already on the ${plan} plan.`);
      return;
    }

    if (selectedRank > currentRank) {
      // console.log('you can');
      // Proceed with subscription logic
      // closeModal();

      // go to payment

      // console.log('Restaurant Name:', restaurantName);
      // console.log('Restaurant Address:', restaurantAddress);
      // console.log('City:', District);
      // console.log('Latitude:', latitude);
      // console.log('Longitude:', longitude);
      // console.log('Opening Hours:', openingHours);
      // activate the below code
      // setshowImageSection(true)
      console.log('selectedsubscriptuion', plan);

      console.log('email email email', merchantEmail);

      if (plan !== 'starter') {
        try {
          const pricingTable: any = {
            pro: {
              3: 18000,
              6: 32400,
              12: 63000,
            },
            premium: {
              3: 27000,
              6: 48600,
              12: 94500,
            },
          };

          const getSubscriptionAmount = (
            plan: any,
            selectedPlanMonths: any,
          ) => {
            return pricingTable[plan]?.[selectedPlanMonths] ?? 0;
          };

          // const theAmount = plan === 'pro' ? 6000 : 9000;

          const theAmount = getSubscriptionAmount(plan, selectedPlanMonths);

          const res = await fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: theAmount,
              merchant: session?.user.email,

              process: 'merchant-subscription',

              AdditionalData: {
                subscribedFrom: 'settings',
                merchantEmail: session?.user?.email,
                subscription: plan,
                subscribed_period: selectedPlanMonths,
              },
            }),
          });

          const data = await res.json();

          if (data.redirect_url) {
            // Redirect to the Onepay payment gateway
            console.log('rdrt url', data.redirect_url);
            window.location.href = data.redirect_url;
          } else {
            console.error('Error generating payment link:', data.error);
            // Show failure popup
          }
        } catch (error) {
          console.log(error);
        }
      }

      // handleMerchantOnboarding()

      // go to payment  ends
    } else {
      setWarning('⚠️ Downgrading subscription is not allowed.');
    }
  };

  // payment related

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

  // subscription paid status

  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
    onOpenChange: onOpenChangeSuccess,
  } = useDisclosure();

  const {
    isOpen: isOpenFailed,
    onOpen: onOpenFailed,
    onClose: onCloseFailed,
    onOpenChange: onOpenChangeFailed,
  } = useDisclosure();

  //    const fetchPaymentStatus = async () => {
  //     if (!reference) {
  //       return;
  //     }

  //     try {
  //       const response = await fetch(
  //         `${backend_url}/api/payment/status?reference=${reference}`,
  //       );

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch payment status');
  //       }

  //       const data = await response.json();

  //       if (data.isFirst === 'no') {
  //         const newUrl = window.location.pathname;
  //         window.history.replaceState({}, document.title, newUrl);
  //         return;
  //       }

  //       if (data.status_message === 'SUCCESS') {
  //         // setStatusMessage(data.status_message);
  //         onOpenSuccess();
  //       } else {
  //         // setError(data.message);
  //         onOpenFailed();
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchPaymentStatus();
  // }, []);

  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const reference = new URLSearchParams(window.location.search).get(
      'reference',
    );

    const fetchPaymentStatus = async () => {
      if (!reference) {
        return;
      }

      try {
        const response = await fetch(
          `${backend_url}/api/payment/status?reference=${reference}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }

        console.log('PASSED ONE PASSED ONE ');

        const data = await response.json();

        console.log('data coming after paymnet', data);

        if (data.isFirst === 'no') {
          console.log('is first is first');

          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          return;
        }

        if (data.status_message === 'SUCCESS') {
          // setStatusMessage(data.status_message);
          console.log('yes yes success');

          onOpenSuccess();
        } else {
          // setError(data.message);
          console.log('note note failed ');
          onOpenFailed();
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPaymentStatus();
  }, []);
  // subscription paid status

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
                          setclickedroute('dashboard');
                        }}
                        className={` text-center ${
                          clickedroute === 'dashboard'
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
                          setclickedroute('reservations');
                        }}
                        className={` text-center ${
                          clickedroute === 'reservations'
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
                          setclickedroute('tables');
                        }}
                        className={` text-center ${
                          clickedroute === 'tables'
                            ? 'bg-[#FF385C]'
                            : 'bg-[#2B2F39]'
                        } font-poppinsreg py-2 rounded-md border  text-white`}
                      >
                        Tables Management{' '}
                      </h1>
                      <h1
                        onClick={() => {
                          router.push('/billings');
                          setclickedroute('billings');
                        }}
                        className={` text-center ${
                          clickedroute === 'billings'
                            ? 'bg-[#FF385C]'
                            : 'bg-[#2B2F39]'
                        } font-poppinsreg py-2 rounded-md border  text-white`}
                      >
                        Payments & Billings{' '}
                      </h1>
                      <h1
                        onClick={() => {
                          router.push('/settings');
                          setclickedroute('settings');
                        }}
                        className={` text-center ${
                          clickedroute === 'settings'
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

            <div className=" w-full   max-w-2xl mt-5   md:px-10 p-2  flex flex-col">
              <h1 className=" font-poppinssemi text-2xl"> Settings </h1>

              <div className=" border-b mt-2 w-full"> </div>

              <div className=" relative w-full h-full">
                <div className=" hidden md:flex  mt-2 w-full gap-6">
                  <div
                    onClick={() => setclickedTab('Profile')}
                    className="w-fit "
                  >
                    <h1 className="  font-poppinsreg  cursor-pointer     rounded-md">
                      {' '}
                      Profile{' '}
                    </h1>

                    <div
                      className={`  ${
                        clickedTab === 'Profile' ? 'flex' : 'hidden'
                      }  mt-1   h-[4px] rounded-full bg-[#FF385C]`}
                    >
                      {' '}
                    </div>
                  </div>

                  {/* <div  onClick={() => setclickedTab("Notification")} className=' w-fit '> 
 
   
     <h1 className='  font-poppinsreg  cursor-pointer   rounded-md'> Notification </h1>
 
 
 
     <div className={`  ${clickedTab === "Notification" ? "flex" : "hidden"}   mt-1  h-[4px] rounded-full bg-[#FF385C]`}> </div>
 
 
 
     </div> */}

                  <div
                    onClick={() => setclickedTab('open-close')}
                    className=" w-fit "
                  >
                    <h1 className="  font-poppinsreg  cursor-pointer   rounded-md">
                      {' '}
                      Opening Hours{' '}
                    </h1>

                    {/* <div className='   mt-1  h-[4px] rounded-full bg-[#44484e]'> </div> */}

                    <div
                      className={`  ${
                        clickedTab === 'open-close' ? 'flex' : 'hidden'
                      }   mt-1  h-[4px] rounded-full bg-[#FF385C]`}
                    >
                      {' '}
                    </div>
                  </div>

                  <div
                    onClick={() => setclickedTab('images')}
                    className=" w-fit "
                  >
                    <h1 className="  font-poppinsreg  cursor-pointer   rounded-md">
                      {' '}
                      Images{' '}
                    </h1>

                    {/* <div className='   mt-1  h-[4px] rounded-full bg-[#44484e]'> </div> */}

                    <div
                      className={`  ${
                        clickedTab === 'images' ? 'flex' : 'hidden'
                      }   mt-1  h-[4px] rounded-full bg-[#FF385C]`}
                    >
                      {' '}
                    </div>
                  </div>

                  <div
                    onClick={() => setclickedTab('subscription')}
                    className=" w-fit "
                  >
                    <h1 className="  font-poppinsreg  cursor-pointer   rounded-md">
                      {' '}
                      Subscription{' '}
                    </h1>

                    {/* <div className='   mt-1  h-[4px] rounded-full bg-[#44484e]'> </div> */}

                    <div
                      className={`  ${
                        clickedTab === 'subscription' ? 'flex' : 'hidden'
                      }   mt-1  h-[4px] rounded-full bg-[#FF385C]`}
                    >
                      {' '}
                    </div>
                  </div>
                </div>

                <div className=" absolute bottom-0 w-full border-t  "> </div>
              </div>

              {/* the content goes here  */}

              {/* all for ACCOUNT - NOT NOTIFICATION  */}

              {clickedTab === 'Profile' && (
                <div className=" mt-5 md:flex hidden flex-col w-full">
                  {/* <div className=' flex flex-col '> 
 
   
    <h1 className='   font-poppinsreg5 text-lg'> Your Profile </h1>
 

 
    </div>
  */}
                  {/* profile name bio image  */}

                  <div className=" flex  mt-2 flex-col">
                    <div className="  flex  md:flex-row flex-col gap-5 md:gap-20 w-full ">
                      <div className="  flex flex-col w-full  md:max-w-sm   gap-1">
                        <div className=" flex flex-col ">
                          <h1 className=" text-2xl font-poppinsreg5 text-slate-700">
                            {' '}
                            {session?.user.resName}{' '}
                          </h1>
                          {/* <input className='  w-full  outline-none border rounded-md  p-[1px]' />  */}
                        </div>

                        <div className=" flex flex-col ">
                          <h1 className=" text-sm text-slate-400 font-poppinsreg">
                            {' '}
                            {session?.user.email}{' '}
                          </h1>
                          {/* <input className='  w-full  outline-none border rounded-md  p-[1px]' />  */}
                        </div>

                        <div className=" flex flex-col ">
                          <h1 className=" text-sm text-slate-400 font-poppinsreg">
                            {' '}
                            {session?.user.address}
                          </h1>
                          {/* <input className='  w-full  outline-none border rounded-md  p-[1px]' />  */}
                        </div>
                      </div>
                    </div>

                    {/* <Button size="sm" className=' font-poppinsreg5 mt-6 w-fit bg-[#323537] text-white'> Save Changes</Button> */}

                    <div className=" border-b  mt-6"> </div>
                  </div>

                  <div className="gap-5 md:gap-4 flex flex-col">
                    <div className=" flex  mt-4 gap-3 flex-col  ">
                      <div>
                        <h1 className="   font-poppinsreg5  text-lg">
                          {' '}
                          Add Contact Number
                        </h1>

                        {/* <h1 className=' text-slate-400  font-poppinsreg  text-sm'>Create a new password to enhance your account security </h1> */}
                        <h1 className=" text-slate-400  font-poppinsreg  text-sm">
                          Add your contact number for important updates and
                          communication{' '}
                        </h1>
                      </div>

                      {!inputfalse ? (
                        <div className=" flex gap-2 items-center">
                          <h1 className=" font-poppinsreg ">
                            {' '}
                            {displayNumberText}{' '}
                          </h1>

                          <svg
                            onClick={() => {
                              setinputfalse(true);
                              setbuttonfalse(true);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-3 cursor-pointer"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            />
                          </svg>
                        </div>
                      ) : (
                        <Input
                          type="text"
                          size="sm"
                          className=" w-fit border-slate-400 border rounded-md  font-poppinsreg"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                        />
                      )}

                      {buttonfalse && (
                        <div className=" flex  items-center mt-2   gap-3 ">
                          {/* <h1 className=" font-rubikSemiBold text-xl"> #323537 Security</h1> */}
                          <Button
                            onPress={() => {
                              setbuttonfalse(!buttonfalse);
                              setinputfalse(!inputfalse);
                            }}
                            size="sm"
                            className=" font-poppinsreg5  w-fit bg-[#18181B] text-white"
                          >
                            {' '}
                            Cancel
                          </Button>
                          <Button
                            isDisabled={phoneNumber?.length <= 11}
                            onPress={addContactNumber}
                            isLoading={phoneNumberLoad}
                            size="sm"
                            className=" font-poppinsreg5   w-fit bg-[#FF385C] text-white"
                          >
                            {' '}
                            Save Number
                          </Button>
                        </div>
                      )}

                      {/* phoneNumberLoad, */}
                    </div>

                    <div
                      className={`border-b    ${
                        buttonfalse ? 'mt-3' : 'mt-0'
                      }  `}
                    >
                      {' '}
                    </div>

                    {/* other things  */}

                    <div>
                      <div>
                        <h1 className="   font-poppinsreg5  text-lg">
                          {' '}
                          Change Password
                        </h1>

                        {/* <h1 className=' text-slate-400  font-poppinsreg  text-sm'>Create a new password to enhance your account security </h1> */}
                        <h1 className=" text-slate-400  font-poppinsreg  text-sm">
                          Update your password to maintain account security.{' '}
                        </h1>
                      </div>

                      <div
                        className={` ${
                          changePassword ? 'mt-6' : 'mt-3'
                        }  flex flex-col  gap-5 `}
                      >
                        {changePassword && (
                          <div>
                            <h1 className=" font-poppinsreg5 text-sm text-gray-600">
                              {' '}
                              Email
                            </h1>
                            {/* <h1> jawidmuhammadh@gmail.com </h1> */}
                            {/* <input
                          value={oldpass}
                     
                          className=" w-full  md:w-64    py-[8px] text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                          type="text  "
                        /> */}

                            <h1 className=" font-poppinsreg text-sm text-slate-400">
                              {' '}
                              {session?.user.email}{' '}
                            </h1>

                            {/* {oldpass_err && (
                          <h1 className=" text-red-400"> {oldpass_err} </h1>
                        )} */}
                          </div>
                        )}

                        {changePassword && (
                          <div className=" flex flex-col gap-1">
                            <h1 className=" font-poppinsreg5 text-sm text-gray-600">
                              {' '}
                              Old Password
                            </h1>
                            {/* <h1> jawidmuhammadh@gmail.com </h1> */}
                            <input
                              value={oldpassword}
                              onChange={(e) => setoldpassword(e.target.value)}
                              className=" w-full  md:w-64    py-[8px] text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                              type="text  "
                            />

                            {/* {newpass_err && (
                          <h1 className=" text-red-400"> {newpass_err} </h1>
                        )} */}
                          </div>
                        )}

                        {changePassword && (
                          <div className=" flex flex-col gap-1">
                            <h1 className="font-poppinsreg5 text-sm text-gray-600">
                              {' '}
                              New Password
                            </h1>
                            {/* <h1> jawidmuhammadh@gmail.com </h1> */}
                            <input
                              value={newpassword}
                              onChange={(e) => setnewpassword(e.target.value)}
                              className=" w-full  md:w-64    py-[8px] text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                              type="text  "
                            />
                            {/* {confirmPass_err && (
                          <h1 className=" text-red-400"> {confirmPass_err} </h1>
                        )} */}
                          </div>
                        )}

                        {/* ttttttttttttttttttttttttttttttttt */}
                        {!changePassword && (
                          <Button
                            isLoading={updatePassLoading}
                            onPress={() => setchangePassword(true)}
                            size="sm"
                            className=" font-poppinsreg5 mt-2 w-fit bg-[#FF385C] text-white"
                          >
                            {' '}
                            Change Password
                          </Button>
                        )}
                        {changePassword && (
                          <div className=" flex gap-3">
                            <Button
                              onPress={() => {
                                setchangePassword(false);
                                setoldpassword('');
                                setnewpassword('');
                              }}
                              size="sm"
                              className=" font-poppinsreg5 mt-2 w-fit bg-[#18181B] text-white"
                            >
                              {' '}
                              Cancel
                            </Button>
                            <Button
                              isLoading={updatePassLoading}
                              onPress={updatePassword}
                              isDisabled={!oldpassword || !newpassword}
                              size="sm"
                              className=" font-poppinsreg5 mt-2 w-fit bg-[#FF385C] text-white"
                            >
                              {' '}
                              Update Password
                            </Button>
                          </div>
                        )}

                        {successMessage && (
                          <h1 className=" text-green-700 font-poppinsreg5 text-sm">
                            {' '}
                            Password Updated Successfully{' '}
                          </h1>
                        )}

                        {errroMessagePassword && (
                          <h1 className=" text-red-700 font-poppinsreg5 text-sm">
                            {' '}
                            Incorrect Old Password{' '}
                          </h1>
                        )}
                      </div>
                    </div>

                    {/* other things  */}

                    {/* new things  */}

                    {/* new things  */}

                    <div className=" border-b  mt-4"> </div>

                    {/* commented on 15th june flexx hidden  */}

                    <div className=" flex  mt-1 gap-3 flex-col  ">
                      <div>
                        <h1 className="   font-poppinsreg5  text-lg">
                          {' '}
                          Enable Custom Reservation
                        </h1>

                        <h1 className=" text-slate-400  font-poppinsreg  text-sm">
                          Enable custom event reservations for unique booking
                          options beyond standard table reservations{' '}
                        </h1>
                      </div>

                      <Switch
                        checked={customEvent}
                        onCheckedChange={(checked: boolean) =>
                          handleSwitchChange(checked)
                        }
                        className=" h-fit mt-1"
                      />

                      <div className=" flex  items-baseline mt-2 pb-6   gap-6 justify-start">
                        {/* <h1 className=" font-rubikSemiBold text-xl"> #323537 Security</h1> */}
                        <Button
                          onPress={updateCustomResStatus}
                          isLoading={customBtnLoad}
                          isDisabled={NOTshowsavebtn}
                          size="sm"
                          className=" font-poppinsreg5   w-fit bg-[#FF385C] text-white"
                        >
                          {' '}
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                </div>
              )}

              {/* secondsection  */}

              {clickedTab === 'open-close' && (
                <>
                  {editHours && (
                    <div className=" w-full md:flex flex-col  hidden      ">
                      <div className="  mt-3  pb-3  w-full">
                        {openingHours.map((dayHours, index) => {
                          //  const hours:any = findOpeningHours(day);
                          return (
                            <div
                              className=" mt-4 flex flex-col gap-1"
                              key={index}
                            >
                              <h4 className=" font-poppinsreg5   text-slate-700">
                                {' '}
                                {dayHours.day}
                              </h4>
                              <div className=" flex gap-3">
                                <DatePicker
                                  // selected={openingHours[index].open}
                                  // onChange={(time) => handleTimeChange(index, 'open', time)}
                                  selected={
                                    dayHours.open
                                      ? new Date(dayHours.open)
                                      : null
                                  }
                                  onChange={(time) =>
                                    handleTimeChange(index, 'open', time)
                                  }
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={30}
                                  timeCaption="Open"
                                  dateFormat="h:mm aa"
                                  placeholderText="Open Time"
                                  className=" border p-1 outline-none rounded-md placeholder:text-sm font-poppinsreg"
                                />
                                <DatePicker
                                  // selected={openingHours[index].close}
                                  // onChange={(time) => handleTimeChange(index, 'close', time)}
                                  selected={
                                    dayHours.close
                                      ? new Date(dayHours.close)
                                      : null
                                  }
                                  onChange={(time) =>
                                    handleTimeChange(index, 'close', time)
                                  }
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={30}
                                  timeCaption="Close"
                                  dateFormat="h:mm aa"
                                  placeholderText="Close Time"
                                  className=" border p-1 outline-none rounded-md placeholder:text-sm font-poppinsreg"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className=" flex gap-4 items-center">
                        <Button
                          onPress={() => {
                            setOpeningHours(openingHoursExist);
                            seteditHours(false);
                          }}
                          className="  bg-[#18181B] text-white font-poppinsreg mt-5 w-fit"
                        >
                          {' '}
                          Cancel{' '}
                        </Button>

                        {/* lllllllllllllllllllllllllllll */}
                        <Button
                          isLoading={saveHoursBtnLoad}
                          onPress={() => updateHours()}
                          className="  bg-[#FF385C] text-white font-poppinsreg mt-5 w-fit"
                        >
                          {' '}
                          Save Business Hours{' '}
                        </Button>
                      </div>

                      {errorMessage && (
                        <h1 className=" mt-7 text-red-400 font-poppinsreg">
                          {' '}
                          {errorMessage}{' '}
                        </h1>
                      )}

                      {/* console.log(openingHours) */}
                    </div>
                  )}

                  {/* EXISTING OPEN CLOSE TIME  */}

                  {!editHours && (
                    <div className=" mt-3">
                      <div className=" flex justify-end w-full">
                        <h1
                          onClick={() => seteditHours(true)}
                          className=" cursor-pointer font-poppinsreg underline text-sm"
                        >
                          {' '}
                          Edit{' '}
                        </h1>
                      </div>

                      {[
                        'Sunday',
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                      ].map((day, index) => {
                        const hours: any = findOpeningHours(day);
                        return (
                          <div
                            className=" flex pb-5 border-b flex-col gap-1"
                            key={index}
                          >
                            <h4 className="font-poppinsreg5 pt-2 pb-1 text-slate-700">
                              {day}
                            </h4>
                            <div className="flex flex-col gap-2">
                              {hours ? (
                                <>
                                  <div>
                                    <h1 className="font-poppinsreg text-sm">
                                      Open: {formatTime(hours.open)}
                                    </h1>
                                  </div>
                                  <div>
                                    <h1 className="font-poppinsreg text-sm">
                                      Close: {formatTime(hours.close)}
                                    </h1>
                                  </div>
                                </>
                              ) : (
                                <div>
                                  {' '}
                                  <h1 className=" text-sm font-poppinsreg text-slate-700">
                                    {' '}
                                    Closed{' '}
                                  </h1>{' '}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* EXISTING OPEN CLOSE TIME   ENDS*/}
                </>
              )}

              {/* Images section 3rd one  */}

              {clickedTab === 'images' && (
                <div className="  flex flex-col gap-2   max-w-2xl mt-5  items-start">
                  {/* Image cards code  */}

                  <div className=" grid grid-cols-1  gap-7 w-full  md:gap-10    ">
                    <div>
                      <h1 className=" md:text-lg   font-poppinssemi">
                        {' '}
                        Banner Image
                      </h1>
                      <p className=" text-xs font-rubik   text-slate-700 font-poppinsreg">
                        {' '}
                        {/* This provide a quick glimpse of your restaurant while
                        customers browse the application.{' '} */}
                        {`Provides a quick glimpse of your restaurant while customers browse the application`}
                      </p>

                      <div className="flex mt-3 items-center lg:w-full  w-full  relative bg-gray-200  ">
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
                          {' '}
                          {imgupload}{' '}
                        </p>
                      )}
                    </div>

                    <div>
                      <h1 className=" md:text-lg    font-poppinssemi">
                        {' '}
                        Cover Image
                      </h1>

                      <p className=" text-xs  font-poppinsreg   w-full text-slate-700">
                        {' '}
                        Your cover image sets the tone for user when they enter
                        your restaurant profile.
                      </p>

                      <div className="flex mt-3 items-center   w-full relative bg-gray-200  ">
                        <label
                          htmlFor="dropzone-file2"
                          className="flex flex-col l    w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          {imageSrc2 ? (
                            <div className="relative  h-full ">
                              <Image
                                src={imageSrc2}
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
                                <span className="font-poppinsreg6">
                                  Click to upload image
                                </span>
                              </p>
                              {/* <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p> */}
                            </div>
                          )}

                          <input
                            id="dropzone-file2"
                            type="file"
                            ref={fileInputRef2}
                            className="hidden"
                            onChange={handleFileChange2}
                            accept="image/jpeg, image/png"
                          />
                        </label>
                        {coverImage && (
                          <button
                            onClick={handleDelete2}
                            className=" px-4 py-1 absolute top-2 right-2 bg-red-500 text-white rounded-md  "
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {imgupload2 && (
                        <p className="text-red-500 mt-3 text-sm">
                          {' '}
                          {imgupload2}{' '}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Image cards code  */}

                  <div className=" flex w-full justify-center">
                    <Button
                      // isLoading={finalBTNload}
                      // isDisabled={finalBTNload}
                      // isDisabled={!selectedFile && !selectedFile2 || imageuploadingloadingbtn}
                      isDisabled={!bannerImage && !coverImage}
                      isLoading={updateImgBtnLoad}
                      onPress={updateImages}
                      className=" max-w-56 w-full  py-6 bg-[#FF385C] text-white mt-6   font-poppinsreg6"
                    >
                      {' '}
                      Update Images{' '}
                    </Button>
                  </div>

                  {/* <Button  className=' max-w-md w-full  py-6 bg-transparent text-black mt-2 border border-black   font-poppinsreg6'> Skip For Now </Button> */}
                </div>
              )}

              {/* Images section 3rd one ENDS  */}

              {/* SUBSCRIPTION  */}
              {clickedTab === 'subscription' && (
                <>
                  <div>
                    <h1 className=" font-poppinsreg5  mt-5 ">
                      {' '}
                      Choose Upgrade Plan{' '}
                    </h1>
                    <h1 className=" font-poppinsreg text-sm text-blue-600">
                      {' '}
                      Your current plan is{' '}
                      <span className=" uppercase"> {merchantSubscribed} </span>
                      {/* FREE */}
                    </h1>

                    {merchantSubscribed !== 'starter' && (
                      <h1 className=" font-poppinsreg text-sm text-blue-600">
                        {' '}
                        Subscribed Period:
                        {/* Subscribed Period:
                        Subscribed Period: */}
                        <span className=" uppercase text-green-700  font-poppinsreg5">
                          {' '}
                          {`${merchantSubscribedPeriodDB} Months`}{' '}
                        </span>
                        {/* FREE */}
                      </h1>
                    )}

                    <div className=" flex flex-col gap-4 mt-3">
                      <div className=" w-full p-4 rounded-lg items-center border flex justify-between">
                        <div className="flex items-center gap-5">
                          <Image
                            src={'/smile.png'}
                            alt=""
                            width={250}
                            height={250}
                            className=" w-10 h-10 object-cover"
                          />

                          <div className=" flex flex-col gap-1">
                            <h1 className=" font-poppinsreg5"> Starter </h1>
                            <h1 className=" font-poppinsreg text-slate-400">
                              {' '}
                              All the basics for starting a new business{' '}
                            </h1>

                            <h1
                              // onClick={() =>
                              //   alert(
                              //     'Plan details and the ability to modify your plan are underway. Stay tuned for updates.',
                              //   )

                              // }
                              onClick={() => setPlan('starter')}
                              className=" font-poppinsreg cursor-pointer text-blue-800 underline"
                            >
                              Details{' '}
                            </h1>
                          </div>
                        </div>

                        <h1 className=" text-green-600 font-poppinsreg5">
                          FREE{' '}
                        </h1>
                      </div>

                      <div className=" w-full p-4 rounded-lg md:items-center border flex md:flex-row flex-col justify-between">
                        <div className="flex items-center gap-5">
                          <Image
                            src={'/star.png'}
                            alt=""
                            width={250}
                            height={250}
                            className=" w-10 h-10 object-cover"
                          />

                          <div className=" flex flex-col gap-1">
                            <h1 className=" font-poppinsreg5"> Pro </h1>
                            <h1 className=" font-poppinsreg text-slate-400">
                              Advanced features to scale your business{' '}
                            </h1>
                            <h1
                              // onClick={() =>
                              //   alert(
                              //     'Plan details and the ability to modify your plan are underway. Stay tuned for updates.',
                              //   )
                              // }
                              onClick={() => setPlan('pro')}
                              className=" font-poppinsreg cursor-pointer text-blue-800 underline"
                            >
                              Details{' '}
                            </h1>
                          </div>
                        </div>

                        <h1 className="  font-poppinsreg5   md:text-start text-end  md:w-fit w-full text-xl">
                          LKR 6000
                          <span className=" font-poppinsreg text-slate-400">
                            /Mo{' '}
                          </span>{' '}
                        </h1>
                      </div>

                      {/* <div className=' w-full p-4 rounded-lg items-center border flex justify-between'>
      
      <div className='flex items-center gap-5'>
        <Image src={'/rocket.png'} alt='' width={250} height={250} className=' w-10 h-10 object-cover' />
         
         <div className=' flex flex-col gap-1'> 
          <h1 className=' font-poppinsreg5'> Premium </h1>
          <h1 className=' font-poppinsreg max-w-xs  text-slate-400'>Premium features that takes your business to the next level </h1>
          <h1 className=' font-poppinsreg text-blue-800 underline'>Details </h1>
         </div>
      </div>

      <h1 className='  font-poppinsreg5 text-xl'>LKR 9000<span className=' font-poppinsreg text-slate-400'>/Mo </span> </h1>

      </div> */}

                      <div className=" w-full p-4 rounded-lg md:items-center border flex md:flex-row flex-col justify-between">
                        <div className="flex items-center gap-5">
                          <Image
                            src={'/rocket.png'}
                            alt=""
                            width={250}
                            height={250}
                            className=" w-10 h-10 object-cover"
                          />

                          <div className=" flex flex-col gap-1">
                            <h1 className=" font-poppinsreg5"> Premium</h1>
                            <h1 className=" font-poppinsreg max-w-xs text-slate-400">
                              Premium features that takes your business to the
                              next level
                            </h1>
                            <h1
                              // onClick={() =>
                              //   alert(
                              //     'Plan details and the ability to modify your plan are underway. Stay tuned for updates.',
                              //   )
                              // }
                              onClick={() => setPlan('premium')}
                              className=" font-poppinsreg cursor-pointer text-blue-800 underline"
                            >
                              Details{' '}
                            </h1>
                          </div>
                        </div>

                        <h1 className="  font-poppinsreg5   md:text-start text-end  md:w-fit w-full text-xl">
                          LKR 9000
                          <span className=" font-poppinsreg text-slate-400">
                            /Mo{' '}
                          </span>{' '}
                        </h1>
                      </div>
                    </div>
                  </div>

                  {/* EXISTING OPEN CLOSE TIME   ENDS*/}
                </>
              )}
              {/* SUBSCRIPTION  */}

              {/* My reservation only  */}

              {/* small devices  */}
              <div className=" w-full mt-2  md:hidden flex">
                {/* nnnnnnnnnnnnnnnnnnnnnnnnnn  */}

                <Accordion
                  itemClasses={{
                    title: 'font-poppinssemi',
                  }}
                  variant="shadow"
                >
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    title="Profile"
                  >
                    <div className=" mt-2 flex flex-col w-full">
                      {/* <div className=' flex flex-col '> 


<h1 className='   font-poppinsreg5 text-lg'> Your Profile </h1>



</div>
*/}
                      {/* profile name bio image  */}

                      <div className=" flex   flex-col">
                        <div className="  flex  md:flex-row flex-col gap-5 md:gap-20 w-full ">
                          <div className="  flex flex-col w-full  md:max-w-sm   gap-1">
                            <div className=" flex flex-col ">
                              <h1 className=" text-2xl font-poppinsreg5 text-slate-700">
                                {' '}
                                {session?.user.resName}{' '}
                              </h1>
                              {/* <input className='  w-full  outline-none border rounded-md  p-[1px]' />  */}
                            </div>

                            <div className=" flex flex-col ">
                              <h1 className=" text-sm text-slate-400 font-poppinsreg">
                                {' '}
                                {session?.user.email}{' '}
                              </h1>
                              {/* <input className='  w-full  outline-none border rounded-md  p-[1px]' />  */}
                            </div>

                            <div className=" flex flex-col ">
                              <h1 className=" text-sm text-slate-400 font-poppinsreg">
                                {' '}
                                {session?.user.address}
                              </h1>
                              {/* <input className='  w-full  outline-none border rounded-md  p-[1px]' />  */}
                            </div>
                          </div>
                        </div>

                        {/* <Button size="sm" className=' font-poppinsreg5 mt-6 w-fit bg-[#323537] text-white'> Save Changes</Button> */}

                        <div className=" border-b  mt-6"> </div>
                      </div>

                      <div className="gap-5 md:gap-4 flex flex-col">
                        <div className=" flex  mt-4 gap-3 flex-col  ">
                          <div>
                            <h1 className="   font-poppinsreg5  text-lg">
                              {' '}
                              Add Contact Number
                            </h1>

                            {/* <h1 className=' text-slate-400  font-poppinsreg  text-sm'>Create a new password to enhance your account security </h1> */}
                            <h1 className=" text-slate-400  font-poppinsreg  text-sm">
                              Add your contact number for important updates and
                              communication{' '}
                            </h1>
                          </div>

                          {!inputfalse ? (
                            <div className=" flex gap-2 items-center">
                              <h1 className=" font-poppinsreg ">
                                {' '}
                                {displayNumberText}{' '}
                              </h1>

                              <svg
                                onClick={() => {
                                  setinputfalse(true);
                                  setbuttonfalse(true);
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-3 cursor-pointer"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                />
                              </svg>
                            </div>
                          ) : (
                            <Input
                              type="text"
                              size="sm"
                              className=" w-fit border-slate-400 border rounded-md  font-poppinsreg"
                              value={phoneNumber}
                              onChange={handlePhoneNumberChange}
                            />
                          )}

                          {buttonfalse && (
                            <div className=" flex  items-center mt-2   gap-3 ">
                              {/* <h1 className=" font-rubikSemiBold text-xl"> #323537 Security</h1> */}
                              <Button
                                onPress={() => {
                                  setbuttonfalse(!buttonfalse);
                                  setinputfalse(!inputfalse);
                                }}
                                size="sm"
                                className=" font-poppinsreg5  w-fit bg-[#18181B] text-white"
                              >
                                {' '}
                                Cancel
                              </Button>
                              <Button
                                isDisabled={phoneNumber?.length <= 11}
                                onPress={addContactNumber}
                                isLoading={phoneNumberLoad}
                                size="sm"
                                className=" font-poppinsreg5   w-fit bg-[#FF385C] text-white"
                              >
                                {' '}
                                Save Number
                              </Button>
                            </div>
                          )}

                          {/* phoneNumberLoad, */}
                        </div>

                        <div
                          className={`border-b    ${
                            buttonfalse ? 'mt-3' : 'mt-0'
                          }  `}
                        >
                          {' '}
                        </div>

                        {/* other things  */}

                        <div>
                          <div>
                            <h1 className="   font-poppinsreg5  text-lg">
                              {' '}
                              Change Password
                            </h1>

                            {/* <h1 className=' text-slate-400  font-poppinsreg  text-sm'>Create a new password to enhance your account security </h1> */}
                            <h1 className=" text-slate-400  font-poppinsreg  text-sm">
                              Update your password to maintain account security.{' '}
                            </h1>
                          </div>

                          <div
                            className={` ${
                              changePassword ? 'mt-6' : 'mt-3'
                            }  flex flex-col  gap-5 `}
                          >
                            {changePassword && (
                              <div>
                                <h1 className=" font-poppinsreg5 text-sm text-gray-600">
                                  {' '}
                                  Email
                                </h1>
                                {/* <h1> jawidmuhammadh@gmail.com </h1> */}
                                {/* <input
                      value={oldpass}
                 
                      className=" w-full  md:w-64    py-[8px] text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                      type="text  "
                    /> */}

                                <h1 className=" font-poppinsreg text-sm text-slate-400">
                                  {' '}
                                  {session?.user.email}{' '}
                                </h1>

                                {/* {oldpass_err && (
                      <h1 className=" text-red-400"> {oldpass_err} </h1>
                    )} */}
                              </div>
                            )}

                            {changePassword && (
                              <div className=" flex flex-col gap-1">
                                <h1 className=" font-poppinsreg5 text-sm text-gray-600">
                                  {' '}
                                  Old Password
                                </h1>
                                {/* <h1> jawidmuhammadh@gmail.com </h1> */}
                                <input
                                  value={oldpassword}
                                  onChange={(e) =>
                                    setoldpassword(e.target.value)
                                  }
                                  className=" w-full  md:w-64    py-[8px] text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                                  type="text  "
                                />

                                {/* {newpass_err && (
                      <h1 className=" text-red-400"> {newpass_err} </h1>
                    )} */}
                              </div>
                            )}

                            {changePassword && (
                              <div className=" flex flex-col gap-1">
                                <h1 className="font-poppinsreg5 text-sm text-gray-600">
                                  {' '}
                                  New Password
                                </h1>
                                {/* <h1> jawidmuhammadh@gmail.com </h1> */}
                                <input
                                  value={newpassword}
                                  onChange={(e) =>
                                    setnewpassword(e.target.value)
                                  }
                                  className=" w-full  md:w-64    py-[8px] text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                                  type="text  "
                                />
                                {/* {confirmPass_err && (
                      <h1 className=" text-red-400"> {confirmPass_err} </h1>
                    )} */}
                              </div>
                            )}

                            {/* ttttttttttttttttttttttttttttttttt */}
                            {!changePassword && (
                              <Button
                                isLoading={updatePassLoading}
                                onPress={() => setchangePassword(true)}
                                size="sm"
                                className=" font-poppinsreg5 mt-2 w-fit bg-[#FF385C] text-white"
                              >
                                {' '}
                                Change Password
                              </Button>
                            )}
                            {changePassword && (
                              <div className=" flex gap-3">
                                <Button
                                  onPress={() => {
                                    setchangePassword(false);
                                    setoldpassword('');
                                    setnewpassword('');
                                  }}
                                  size="sm"
                                  className=" font-poppinsreg5 mt-2 w-fit bg-[#18181B] text-white"
                                >
                                  {' '}
                                  Cancel
                                </Button>
                                <Button
                                  isLoading={updatePassLoading}
                                  onPress={updatePassword}
                                  isDisabled={!oldpassword || !newpassword}
                                  size="sm"
                                  className=" font-poppinsreg5 mt-2 w-fit bg-[#FF385C] text-white"
                                >
                                  {' '}
                                  Update Password
                                </Button>
                              </div>
                            )}

                            {successMessage && (
                              <h1 className=" text-green-700 font-poppinsreg5 text-sm">
                                {' '}
                                Password Updated Successfully{' '}
                              </h1>
                            )}

                            {errroMessagePassword && (
                              <h1 className=" text-red-700 font-poppinsreg5 text-sm">
                                {' '}
                                Incorrect Old Password{' '}
                              </h1>
                            )}
                          </div>
                        </div>

                        {/* other things  */}

                        {/* new things  */}

                        {/* new things  */}

                        <div className=" border-b  mt-4"> </div>

                        {/* commented on 15th june flexx hidden   */}
                        <div className=" flex  mt-1 gap-3 flex-col  ">
                          <div>
                            <h1 className="   font-poppinsreg5  text-lg">
                              {' '}
                              Enable Custom Reservation
                            </h1>

                            {/* <h1 className=' text-slate-400  font-poppinsreg  text-sm'>Create a new password to enhance your account security </h1> */}
                            <h1 className=" text-slate-400  font-poppinsreg  text-sm">
                              Enable custom event reservations for unique
                              booking options beyond standard table reservations{' '}
                            </h1>
                          </div>

                          <Switch
                            checked={customEvent}
                            onCheckedChange={(checked: boolean) =>
                              handleSwitchChange(checked)
                            }
                            className=" h-fit mt-1"
                          />

                          <div className=" flex  items-baseline mt-2 pb-6   gap-6 justify-start">
                            {/* <h1 className=" font-rubikSemiBold text-xl"> #323537 Security</h1> */}
                            <Button
                              onPress={updateCustomResStatus}
                              isLoading={customBtnLoad}
                              isDisabled={NOTshowsavebtn}
                              size="sm"
                              className=" font-poppinsreg5   w-fit bg-[#FF385C] text-white"
                            >
                              {' '}
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Professional Details */}
                    </div>

                    {/* secondsection  */}
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label="Accordion 2"
                    title="Opening Hours"
                  >
                    <div className=" w-full overflow-hidden">
                      {editHours && (
                        <div className=" w-full flex flex-col       ">
                          <div className="    pb-3  w-full">
                            {openingHours.map((dayHours, index) => {
                              //  const hours:any = findOpeningHours(day);
                              return (
                                <div
                                  className=" mt-2 w-full flex flex-col gap-1"
                                  key={index}
                                >
                                  <h4 className=" font-poppinsreg5   text-slate-700">
                                    {' '}
                                    {dayHours.day}
                                  </h4>
                                  <div className=" w-full pb-4 flex flex-col gap-3">
                                    <div className=" w-fit">
                                      <DatePicker
                                        // selected={openingHours[index].open}
                                        // onChange={(time) => handleTimeChange(index, 'open', time)}
                                        selected={
                                          dayHours.open
                                            ? new Date(dayHours.open)
                                            : null
                                        }
                                        onChange={(time) =>
                                          handleTimeChange(index, 'open', time)
                                        }
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        timeCaption="Open"
                                        dateFormat="h:mm aa"
                                        placeholderText="Open Time"
                                        className=" border p-1 outline-none rounded-md placeholder:text-sm font-poppinsreg"
                                      />
                                    </div>
                                    <div className=" w-fit">
                                      <DatePicker
                                        // selected={openingHours[index].close}
                                        // onChange={(time) => handleTimeChange(index, 'close', time)}
                                        selected={
                                          dayHours.close
                                            ? new Date(dayHours.close)
                                            : null
                                        }
                                        onChange={(time) =>
                                          handleTimeChange(index, 'close', time)
                                        }
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        timeCaption="Close"
                                        dateFormat="h:mm aa"
                                        placeholderText="Close Time"
                                        className=" border p-1 outline-none rounded-md placeholder:text-sm font-poppinsreg"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className=" flex gap-4 items-center">
                            <Button
                              onPress={() => {
                                setOpeningHours(openingHoursExist);
                                seteditHours(false);
                              }}
                              className="  bg-[#18181B] text-white text-xs font-poppinsreg mt-5 w-fit"
                            >
                              {' '}
                              Cancel{' '}
                            </Button>

                            {/* lllllllllllllllllllllllllllll */}
                            <Button
                              isLoading={saveHoursBtnLoad}
                              onPress={() => updateHours()}
                              className="  bg-[#FF385C] text-white text-xs font-poppinsreg mt-5 w-fit"
                            >
                              {' '}
                              Save Business Hours{' '}
                            </Button>
                          </div>

                          {errorMessage && (
                            <h1 className=" mt-7 text-red-400 font-poppinsreg">
                              {' '}
                              {errorMessage}{' '}
                            </h1>
                          )}

                          {/* console.log(openingHours) */}
                        </div>
                      )}

                      {/* EXISTING OPEN CLOSE TIME  */}

                      {!editHours && (
                        <div className=" ">
                          <div className=" flex justify-end w-full">
                            <h1
                              onClick={() => seteditHours(true)}
                              className=" cursor-pointer font-poppinsreg underline text-sm"
                            >
                              {' '}
                              Edit{' '}
                            </h1>
                          </div>

                          {[
                            'Sunday',
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                          ].map((day, index) => {
                            const hours: any = findOpeningHours(day);
                            return (
                              <div
                                className=" flex pb-5 border-b flex-col gap-1"
                                key={index}
                              >
                                <h4 className="font-poppinsreg5 pt-2 pb-1 text-slate-700">
                                  {day}
                                </h4>
                                <div className="flex flex-col gap-2">
                                  {hours ? (
                                    <>
                                      <div>
                                        <h1 className="font-poppinsreg text-sm">
                                          Open: {formatTime(hours.open)}
                                        </h1>
                                      </div>
                                      <div>
                                        <h1 className="font-poppinsreg text-sm">
                                          Close: {formatTime(hours.close)}
                                        </h1>
                                      </div>
                                    </>
                                  ) : (
                                    <div>
                                      {' '}
                                      <h1 className=" text-sm font-poppinsreg text-slate-700">
                                        {' '}
                                        Closed{' '}
                                      </h1>{' '}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* EXISTING OPEN CLOSE TIME   ENDS*/}
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    aria-label="Accordion 3"
                    title="Images"
                  >
                    <div className="  flex flex-col gap-2   max-w-2xl   items-start">
                      {/* Image cards code  */}

                      <div className=" grid grid-cols-1  gap-7 w-full  md:gap-10    ">
                        <div>
                          <h1 className=" md:text-lg   font-poppinssemi">
                            {' '}
                            Banner Image
                          </h1>
                          <p className=" text-xs font-rubik   text-slate-700 font-poppinsreg">
                            {' '}
                            {/* This provide a quick glimpse of your restaurant
                            while customers browse the application.{' '} */}
                            {`Provides a quick glimpse of your restaurant while customers browse the application`}
                          </p>

                          <div className="flex mt-3 items-center lg:w-full  w-full  relative bg-gray-200  ">
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
                              {' '}
                              {imgupload}{' '}
                            </p>
                          )}
                        </div>

                        <div>
                          <h1 className=" md:text-lg    font-poppinssemi">
                            {' '}
                            Cover Image
                          </h1>

                          <p className=" text-xs  font-poppinsreg   w-full text-slate-700">
                            {' '}
                            Your cover image sets the tone for user when they
                            enter your restaurant profile.
                          </p>

                          <div className="flex mt-3 items-center   w-full relative bg-gray-200  ">
                            <label
                              htmlFor="dropzone-file2"
                              className="flex flex-col l    w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                            >
                              {imageSrc2 ? (
                                <div className="relative  h-full ">
                                  <Image
                                    src={imageSrc2}
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
                                    <span className="font-poppinsreg6">
                                      Click to upload image
                                    </span>
                                  </p>
                                  {/* <p className="text-xs text-gray-500 dark:text-gray-400">
          SVG, PNG, JPG or GIF (MAX. 800x400px)
        </p> */}
                                </div>
                              )}

                              <input
                                id="dropzone-file2"
                                type="file"
                                ref={fileInputRef2}
                                className="hidden"
                                onChange={handleFileChange2}
                                accept="image/jpeg, image/png"
                              />
                            </label>
                            {coverImage && (
                              <button
                                onClick={handleDelete2}
                                className=" px-4 py-1 absolute top-2 right-2 bg-red-500 text-white rounded-md  "
                              >
                                Delete
                              </button>
                            )}
                          </div>

                          {imgupload2 && (
                            <p className="text-red-500 mt-3 text-sm">
                              {' '}
                              {imgupload2}{' '}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Image cards code  */}

                      <div className=" flex w-full justify-center">
                        <Button
                          // isLoading={finalBTNload}
                          // isDisabled={finalBTNload}
                          // isDisabled={!selectedFile && !selectedFile2 || imageuploadingloadingbtn}
                          isDisabled={!bannerImage && !coverImage}
                          isLoading={updateImgBtnLoad}
                          onPress={updateImages}
                          className=" max-w-56 w-full  py-6 bg-[#FF385C] text-white mt-6   font-poppinsreg6"
                        >
                          {' '}
                          Update Images{' '}
                        </Button>
                      </div>

                      {/* <Button  className=' max-w-md w-full  py-6 bg-transparent text-black mt-2 border border-black   font-poppinsreg6'> Skip For Now </Button> */}
                    </div>
                  </AccordionItem>
                </Accordion>
              </div>
              {/* small devices  */}
            </div>
          </div>
        </div>

        {/* popup  */}

        {imageUpdated && (
          <div
            className="min-w-screen h-screen animated fadeIn faster   fixed  left-0 top-0 flex justify-center items-center inset-0 z-[200] outline-none focus:outline-none bg-no-repeat "
            // style={{
            //   backgroundImage:
            //     "url(https://images.unsplash.com/photo-1623600989906-6aae5aa131d4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1582&q=80)",
            // }}
            id="modal-id"
          >
            <div className="absolute bg-black   opacity-60 inset-0 z-0" />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ delay: 0.15 }}
              className="lg:w-full  lg:max-w-md p-5 relative lg:mx-auto mx-6 my-auto rounded-xl shadow-lg  bg-white "
            >
              <div>
                <div className="text-center p-5 flex-auto justify-center">
                  {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 -m-1 flex items-center text-green-500 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg> */}
                  {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 flex items-center text-red-500 mx-auto"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg> */}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-24 h-24 flex items-center text-green-500 mx-auto"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <h2 className="text-xl  font-poppinsreg5 py-4 ">
                    Images Updated Successfully!
                  </h2>
                  {/* <p className="text-sm text-gray-500 px-8">
                  Do you really want to delete this product ? This process
                  cannot be undone
                </p> */}
                </div>
                {/*footer*/}
              </div>
            </motion.div>
          </div>
        )}
        {/* popup  */}

        {/* susbcription feature and subscribe now  */}
        <Modal
          isOpen={!!plan}
          onClose={closeModal}
          size="lg"
          placement="center"
        >
          <ModalContent className="rounded-2xl max-h-[95vh] overflow-y-auto shadow-xl">
            {() => (
              <>
                <ModalHeader className="text-center capitalize text-2xl font-semibold text-[#333]">
                  <div className=" flex flex-col gap-2">
                    <h1> {plan} Plan Details </h1>
                    {plan === 'pro' && (
                      <h1 className="  font-poppinsreg5   md:text-start text-end  md:w-fit w-full text-xl">
                        LKR 6000
                        <span className=" font-poppinsreg text-slate-400">
                          /Mo{' '}
                        </span>{' '}
                      </h1>
                    )}

                    {plan === 'premium' && (
                      <h1 className="  font-poppinsreg5   md:text-start text-end  md:w-fit w-full text-xl">
                        LKR 9000
                        <span className=" font-poppinsreg text-slate-400">
                          /Mo{' '}
                        </span>{' '}
                      </h1>
                    )}
                  </div>
                </ModalHeader>

                <ModalBody className="pb-1 -mt-2">
                  <p className=" text-gray-500 text-sm mb-4">
                    {plan === 'starter' &&
                      'Perfect for new businesses just getting started.'}
                    {plan === 'pro' &&
                      'Ideal for growing businesses ready to scale up.'}
                    {plan === 'premium' &&
                      'Complete solution for established brands to dominate the market.'}
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4 shadow-inner space-y-3 transition-all duration-300">
                    {plan === 'starter' && (
                      <>
                        <h1>⭐ Up to 40 reservations per month</h1>
                        <h1>⭐ Access to basic analytics</h1>
                        <h1>⭐ Basic Table Management</h1>
                        <h1>
                          ⭐ Community support or email support with a longer
                          response time
                        </h1>
                      </>
                    )}

                    {plan === 'pro' && (
                      <>
                        <h1>⭐ Unlimited Reservations</h1>
                        <h1>⭐ Advanced Analytics</h1>
                        <h1>⭐ Enhanced Table Management</h1>
                        <h1>⭐ Marketing Tools</h1>
                        <h1>⭐ Priority email Support</h1>
                        <h1>
                          ⭐ Ability to run limited promotions or discounts
                        </h1>
                      </>
                    )}

                    {plan === 'premium' && (
                      <>
                        <h1>⭐ Unlimited Reservations</h1>
                        <h1>⭐ Comprehensive Analytics</h1>
                        <h1>⭐ Full Table Management</h1>
                        <h1>⭐ Free POS Access</h1>
                        <h1>⭐ Full Marketing Suite</h1>
                        <h1>⭐ Dedicated account manager or 24/7 support</h1>
                        <h1>⭐ Premium Listing</h1>
                        <h1>⭐ Custom Branding</h1>
                      </>
                    )}
                  </div>

                  {/* the three cards pricing  */}
                  <div
                    className={`  ${
                      plan === 'starter' ? 'hidden' : 'grid'
                    }   gap-3 grid-cols-2`}
                  >
                    <div
                      onClick={() => setselectedPlanMonths(3)}
                      className={` ${
                        selectedPlanMonths === 3 ? 'bg-[#FF385C]' : ''
                      }  w-full cursor-pointer p-2 flex flex-col border rounded-lg justify-center`}
                    >
                      <h1
                        className={` ${
                          selectedPlanMonths === 3
                            ? 'text-white'
                            : 'text-slate-700'
                        } text-center font-poppinssemi  text-2xl `}
                      >
                        {' '}
                        {plan === 'pro' && 'LKR 18,000'}
                        {plan === 'premium' && 'LKR 27,000'}
                      </h1>

                      <h1
                        className={` 
                         ${selectedPlanMonths === 3 ? 'text-white' : ''}
                        
                        text-center font-poppinsreg5 `}
                      >
                        {' '}
                        3 Months{' '}
                      </h1>
                    </div>

                    <div
                      onClick={() => setselectedPlanMonths(6)}
                      className={` ${
                        selectedPlanMonths === 6 ? 'bg-[#FF385C]' : ''
                      }  w-full p-2 cursor-pointer flex flex-col border rounded-lg justify-center`}
                    >
                      <h1
                        className={`${
                          selectedPlanMonths === 6
                            ? 'text-white bg-black'
                            : ' text-[#FF385C] bg-[#FF385C] bg-opacity-10'
                        }  w-fit text-xs mx-auto py-1 px-4 rounded-full font-poppinsreg5 `}
                      >
                        {' '}
                        SAVE 10%{' '}
                      </h1>

                      <div className=" mt-2 flex flex-col ">
                        <h1
                          className={`  ${
                            selectedPlanMonths === 6
                              ? 'text-white'
                              : 'text-slate-400'
                          }  text-center font-poppinssemi  text-lg line-through `}
                        >
                          {' '}
                          {/* LKR 36,000{' '} */}
                          {plan === 'pro' && ' LKR 36,000'}
                          {plan === 'premium' && ' LKR 54,600'}
                        </h1>

                        <h1
                          className={`  ${
                            selectedPlanMonths === 6
                              ? 'text-white'
                              : 'text-slate-700'
                          }  text-center font-poppinssemi  text-2xl   `}
                        >
                          {' '}
                          {plan === 'pro' && ' LKR 32,400'}
                          {plan === 'premium' && ' LKR 48,600'}
                        </h1>
                      </div>

                      <h1
                        className={`  ${
                          selectedPlanMonths === 6 ? 'text-white' : 'text-black'
                        }  text-center font-poppinsreg5 `}
                      >
                        {' '}
                        6 Months{' '}
                      </h1>
                    </div>

                    <div
                      // className=" w-full p-2 flex flex-col border rounded-lg justify-center"
                      onClick={() => setselectedPlanMonths(12)}
                      className={` ${
                        selectedPlanMonths === 12 ? 'bg-[#FF385C]' : ''
                      }  w-full p-2 cursor-pointer flex flex-col border rounded-lg justify-center`}
                    >
                      <h1
                        // className=" text-[#FF385C] w-fit text-xs mx-auto py-1 px-4 rounded-full font-poppinsreg5 bg-[#FF385C] bg-opacity-10"
                        className={`${
                          selectedPlanMonths === 12
                            ? 'text-white bg-black'
                            : ' text-[#FF385C] bg-[#FF385C] bg-opacity-10'
                        }  w-fit text-xs mx-auto py-1 px-4 rounded-full font-poppinsreg5 `}
                      >
                        {' '}
                        SAVE 12.5%{' '}
                      </h1>

                      <div className=" mt-2 flex flex-col ">
                        <h1
                          // className=" text-center font-poppinssemi text-slate-400 text-lg line-through"
                          className={`  ${
                            selectedPlanMonths === 12
                              ? 'text-white'
                              : 'text-slate-400'
                          }  text-center font-poppinssemi  text-lg line-through `}
                        >
                          {' '}
                          {/* LKR 72,000{' '} */}
                          {plan === 'pro' && ' LKR 72,000'}
                          {plan === 'premium' && ' LKR 1,08,000'}
                        </h1>

                        <h1
                          // className=" text-center font-poppinssemi text-slate-700 text-2xl "
                          className={`  ${
                            selectedPlanMonths === 12
                              ? 'text-white'
                              : 'text-slate-700'
                          }  text-center font-poppinssemi  text-2xl   `}
                        >
                          {' '}
                          {/* LKR 63,000{' '} */}
                          {plan === 'pro' && ' LKR 63,000'}
                          {plan === 'premium' && ' LKR 94,500'}
                        </h1>
                      </div>

                      <h1
                        // className=" text-center font-poppinsreg5"
                        className={`  ${
                          selectedPlanMonths === 12
                            ? 'text-white'
                            : 'text-black'
                        }  text-center font-poppinsreg5 `}
                      >
                        {' '}
                        12 Months{' '}
                      </h1>
                    </div>
                  </div>
                  {/* the three cards pricing  ends */}
                </ModalBody>

                <ModalFooter className="flex flex-col gap-2 justify-center">
                  {warning && (
                    <p className="text-red-600 pb-3 text-sm text-center">
                      {warning}
                    </p>
                  )}

                  {plan !== 'starter' && (
                    <Button
                      onClick={handleSubscribe}
                      className="bg-[#FF385C] text-white text-base font-medium px-6 py-2 rounded-xl shadow-lg "
                    >
                      Subscribe Now
                    </Button>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        {/* susbcription feature and subscribe now  ends */}

        {/* subcribe done or failed  */}
        <Modal
          // isOpen:customisOpen, onOpen:customonOpen, onClose:customonClose, onOpenChange:customonOpenChange

          classNames={{
            backdrop: ' bg-black bg-opacity-80',
          }}
          className=" md:h-auto h-screen py-3   overflow-y-auto"
          size="md"
          isOpen={isOpenFailed}
          onOpenChange={onOpenChangeFailed}
        >
          <ModalContent>
            {(onCloseFailed) => (
              <>
                <ModalBody className=" flex justify-center items-center">
                  <Image
                    alt="reservation"
                    width={2000}
                    height={2000}
                    className=" mt-5"
                    src={'/payment.PNG'}
                  />

                  <div className=" flex flex-col gap-2">
                    <h1 className=" font-poppinsreg5 text-xl text-center">
                      {' '}
                      Oops, {session?.user.name}!{' '}
                    </h1>

                    <h1 className=" text-red-700 text-lg text-center  font-poppinsreg5">
                      {' '}
                      Your Subscription upgrade has failed{' '}
                    </h1>

                    <h1 className=" font-poppinsreg5 text-xs text-center text-slate-700">
                      {' '}
                      {`Unfortunately, we were unable to process your payment. Please check your payment details and try again. If the problem persists, contact support for assistance.`}{' '}
                    </h1>
                  </div>

                  {/* <Button
                  onPress={() =>
                    router.push('/settings?section=My-Reservations')
                  }
                  className="bg-[#FF385C] mt-2 text-white font-poppinsreg5 "
                >
                  {' '}
                  GO TO MY RESERVATIONS{' '}
                </Button> */}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* subcribe done or failed  */}

        {/* success modal for payment  */}
        <Modal
          // isOpen:customisOpen, onOpen:customonOpen, onClose:customonClose, onOpenChange:customonOpenChange

          classNames={{
            backdrop: ' bg-black bg-opacity-80',
          }}
          className=" md:h-auto h-screen py-3   overflow-y-auto"
          size="md"
          isOpen={isOpenSuccess}
          onOpenChange={onOpenChangeSuccess}
        >
          <ModalContent>
            {(onCloseFailed) => (
              <>
                <ModalBody className=" flex justify-center items-center">
                  <Image
                    alt="reservation"
                    width={2000}
                    height={2000}
                    className=" mt-5"
                    src={'/payment.PNG'}
                  />

                  <div className=" flex flex-col gap-2">
                    <h1 className=" font-poppinsreg5 text-xl text-center">
                      {' '}
                      Awesome!
                    </h1>

                    <h1 className=" text-green-700 text-lg text-center  font-poppinsreg5">
                      {' '}
                      You have successfully upgraded your Subscription
                    </h1>

                    {/* <h1 className=" font-poppinsreg5 text-xs text-center text-slate-700">
                      {' '}
                      {`Unfortunately, we were unable to process your payment. Please check your payment details and try again. If the problem persists, contact support for assistance.`}{' '}
                    </h1> */}
                  </div>

                  {/* <Button
                  onPress={() =>
                    router.push('/settings?section=My-Reservations')
                  }
                  className="bg-[#FF385C] mt-2 text-white font-poppinsreg5 "
                >
                  {' '}
                  GO TO MY RESERVATIONS{' '}
                </Button> */}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
        {/* success modal for payment  ends */}
      </>
    )
  );
};

export default Page;
