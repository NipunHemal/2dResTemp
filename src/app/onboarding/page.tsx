'use client';
import {
  Button,
  CalendarDate,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
// DatePicker,
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import merchant from '../../../public/merchant.png';

import { DateValue } from '@internationalized/date';

import GooglePlacesAutocomplete from 'react-google-autocomplete';
import { useTemp } from '@/context/tempContext';
import { useSession } from 'next-auth/react';

const Page = () => {
  const searchParams = useSearchParams();

  const [data, setdata] = useState('jmg');

  const search = searchParams.get('stat');
  const step = searchParams.get('tepo');
  const router = useRouter();

  // image functionalities

  const [imgupload, setimgupload] = useState('');
  const [imgupload2, setimgupload2] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageSrc2, setImageSrc2] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);

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

      // const storageRef = ref(storage, `banner-images/${file.name}`);
      // try {
      //   const snapshot = await uploadBytes(storageRef, file);
      //   const downloadURL = await getDownloadURL(snapshot.ref);
      //   setUploadBannerImage(downloadURL)

      //   console.log('File available at', downloadURL);
      // } catch (error) {
      //   console.error('Upload failed', error);
      // }
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

      // const storageRef = ref(storage, `profile-images/${file.name}`);
      // try {
      //   const snapshot = await uploadBytes(storageRef, file);
      //   const downloadURL = await getDownloadURL(snapshot.ref);
      //   setUploadProfileImage(downloadURL)
      //   console.log('File available at', downloadURL);
      // } catch (error) {
      //   console.error('Upload failed', error);
      // }
    }
  };

  const [imageuploadingloadingbtn, setimageuploadingloadingbtn] =
    useState(false);

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // const handleUpload = async () => {
  //   if (selectedFile) {
  //     try {
  //       const uploadedImageUrl = await ImageUpload(selectedFile);
  //       setUploadedImageUrl(uploadedImageUrl);
  //       console.log(uploadedImageUrl);
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //     }
  //   }
  // };

  const handleDelete = () => {
    // setSelectedFile(null);
    setBannerImage(null);
    setImageSrc(''); // Clear the image source
    // You can add more logic here to handle deleting the file from your server if necessary.

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete2 = () => {
    setSelectedFile2(null);
    setcoverImage(null);
    setImageSrc2(''); // Clear the image source
    // You can add more logic here to handle deleting the file from your server if necessary.

    if (fileInputRef2.current) {
      fileInputRef2.current.value = '';
    }
  };

  // image functionalities

  // role selection
  const [roleSelection, setroleSelection] = useState('');
  // role selection

  const [Address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [District, setDistrict] = useState('');

  // const handleAddressSelect = (place: any) => {
  //   const address = place.formatted_address || '';
  //   // const city = place.address_components.find( (comp:any) => comp.types.includes('locality'))?.long_name || '';
  //   // setRestaurantAddress(address);
  //   // setCity(city);

  //   console.log('paapome address', place);

  //   const districtComponent = place.address_components?.find((comp: any) =>
  //     comp.types.includes('administrative_area_level_2'),
  //   );
  //   const district = districtComponent?.long_name || '';

  //   // If district not found, fallback to the city (locality) component
  //   const cityComponent =
  //     districtComponent ||
  //     place.address_components?.find((comp: any) =>
  //       comp.types.includes('locality'),
  //     );
  //   const city = cityComponent?.long_name || '';

  //   const lat = place.geometry.location.lat();
  //   const lng = place.geometry.location.lng();
  //   setLatitude(lat);
  //   setLongitude(lng);

  //   setAddress(address);
  //   setCity(city);
  //   setDistrict(district);
  // };

  const handleAddressSelect = (place: any) => {
    const address = place.formatted_address || '';

    // Extract district (administrative_area_level_2)
    const districtComponent = place.address_components?.find((comp: any) =>
      comp.types.includes('administrative_area_level_2'),
    );
    const district = districtComponent?.long_name || '';

    // console.log('district name', district);

    // Extract city (locality)
    const cityComponent = place.address_components?.find((comp: any) =>
      comp.types.includes('locality'),
    );
    const city = cityComponent?.long_name || '';

    // console.log('city name', city);

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setLatitude(lat);
    setLongitude(lng);
    setAddress(address);
    setCity(city);
    setDistrict(district);
  };

  // company details
  const [companyName, setcompanyName] = useState('');
  const [slogan, setslogan] = useState('');
  const [industry, setindustry] = useState('');
  const [foundedIn, setfoundedIn] = useState('');
  const [Companydescription, setCompanydescription] = useState('');

  // const updateCompanyData = async ( ) => {
  //   console.log(companydata);

  //   // const db = getFirestore();

  //     const docRef = doc(db, "Employers", "jawidh@gmail.com");
  //     // console.log(docRef);

  //     try {
  //       const data =  await updateDoc(docRef, companydata);
  //       console.log(data);

  //       console.log("Company data updated successfully!");
  //     } catch (error) {
  //       console.error("Error updating company data:", error);
  //       // Handle errors appropriately, e.g., display an error message to the user
  //     }

  // };

  async function updateEmployerData() {}

  // company details

  //  employee resume and profile upload
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  const [individualContinueloading, setindividualContinueloading] =
    useState(false);

  let profileurl = '';
  let resumeurl = '';

  //  employee resume and profile upload

  // xxxxxxxxxxxxxxxxxxxx

  const [industryvalue, setindustryvalue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [expertise, setexpertise] = useState('');
  const [yearsOfExperience, setyearsOfExperience] = useState('');
  const [aboutYourself, setaboutYourself] = useState('');

  //

  const handleDateChange = (value: DateValue) => {
    console.log(`${value.day}.${value.month}.${value.year}`);

    setSelectedDate(`${value.day}.${value.month}.${value.year}`);
  };

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [openingHours, setOpeningHours] = useState([
    { day: 'Sunday', open: null, close: null },
    { day: 'Monday', open: null, close: null },
    { day: 'Tuesday', open: null, close: null },
    { day: 'Wednesday', open: null, close: null },
    { day: 'Thursday', open: null, close: null },
    { day: 'Friday', open: null, close: null },
    { day: 'Saturday', open: null, close: null },
  ]);

  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleTimeChange = (day: any, type: any, time: any) => {
    const updatedHours = openingHours.map((hours, index) => {
      if (index === day) {
        return {
          ...hours,
          [type]: time,
        };
      }
      return hours;
    });
    setOpeningHours(updatedHours);
  };

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { merchantEmail, setMerchantEmail } = useTemp();

  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [coverImage, setcoverImage] = useState<File | null>(null);

  const [finalBTNload, setfinalBTNload] = useState(false);

  const handleMerchantOnboarding = async () => {
    setfinalBTNload(true);
    try {
      const response = await fetch(
        `${backend_url}/merchant/merchant-onboarding`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: merchantEmail, // This should be the email of the already signed-up user

            restaurantName: companyName,
            restaurantAddress: Address,
            city,
            district: District,
            latitude,
            longitude,
            openingHours,
            subscription: selectedSubscription,
          }),
        },
      );
      const data = await response.json();
      console.log(data);

      if (data.status === 'success') {
        // setonboardingResult('Onboarding successful!');
        // console.log("Onboarding success !!!!!");

        // upload the images

        try {
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
            `${backend_url}/merchant/merchant-uploadImages`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: merchantEmail,
                banner_img: bannerImageUrl,
                cover_img: coverImageUrl,
              }),
            },
          );

          if (!response.ok) {
            throw new Error('Failed to upload images to the backend');
          }
          const imageData = await response.json();
          console.log('images uploaded:', imageData);
          setfinalBTNload(false);
          setBannerImage(null);
          setcoverImage(null);

          onOpen();

          // above part
        } catch (error) {
          console.error('Error uploading image data:', error);
          setfinalBTNload(false);
        }

        // upload the images
      } else {
        // setonboardingResult(data.message);
        console.log(data.message);
      }
    } catch (error) {
      // setonboardingResult('Error occurred during onboarding');
      console.log('error occured during onboarding');
    }
  };

  const handleSubmit = () => {
    setErrorMessage('');
    for (let i = 0; i < openingHours.length; i++) {
      const { open, close } = openingHours[i];
      if ((open && !close) || (!open && close)) {
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

    setErrorMessage(''); // Clear any previous error messages

    console.log('Restaurant Name:', restaurantName);
    console.log('Restaurant Address:', restaurantAddress);
    console.log('City:', District);
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    console.log('Opening Hours:', openingHours);
    // activate the below code
    setshowImageSection(true);
    // setsubscription(true);
    // handleMerchantOnboarding()
  };

  const handleSubscriptionSubmit = async () => {
    setErrorMessage('');

    setErrorMessage(''); // Clear any previous error messages

    // console.log('Restaurant Name:', restaurantName);
    // console.log('Restaurant Address:', restaurantAddress);
    // console.log('City:', District);
    // console.log('Latitude:', latitude);
    // console.log('Longitude:', longitude);
    // console.log('Opening Hours:', openingHours);
    // activate the below code
    // setshowImageSection(true)
    console.log('selectedsubscriptuion', selectedSubscription);

    // if (selectedSubscription !== 'free') {
    //   try {
    //     const theAmount = selectedSubscription === 'pro' ? 6000 : 9000;

    //     const res = await fetch('/api/payment', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         amount: theAmount,
    //         merchant: merchantEmail,

    //         AdditionalData: {
    //           subscribedFrom: 'onboarding',
    //         },
    //       }),
    //     });

    //     const data = await res.json();

    //     if (data.redirect_url) {
    //       // Redirect to the Onepay payment gateway
    //       console.log('rdrt url', data.redirect_url);
    //       window.location.href = data.redirect_url;
    //     } else {
    //       console.error('Error generating payment link:', data.error);
    //       // Show failure popup
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    setshowImageSection(true);
    setsubscription(false);
    // handleMerchantOnboarding()
  };

  //  have some changes , but wanted to resolve some errors , after fixing i will push the code

  const [showImageSection, setshowImageSection] = useState(false);
  const [subscription, setsubscription] = useState(false);

  const [selectedSubscription, setselectedSubscription] = useState('starter');

  const { data: session, status } = useSession();

  // useEffect(() => {

  //   console.log(session?.user.is_onb);
  //   console.log(session?.user.is_ver);
  //   console.log(status);

  // }, [session])

  // below is the key
  if (!merchantEmail) {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    } else if (status === 'unauthenticated') {
      router.replace('/login');
    }
    return;
  }

  if (status === 'authenticated' && session.user.is_onb) {
    router.replace('/dashboard');
    return;
  }

  if (status === 'authenticated' && session.user.is_onb) {
    return null;
  }

  // below is the key

  return (
    <>
      <div className=" w-full  overflow-hidden    flex justify-center">
        <div className=" w-full  max-w-7xl min-h-screen flex flex-col items-center md:justify-center gap-3 p-2">
          {/* if confirmed as company  */}

          {!showImageSection && !subscription && (
            <div className="  flex flex-col gap-2 pb-9 md:w-fit w-full max-w-2xl items-center">
              <h1 className=" text-2xl mt-16 md:text-3xl font-poppinssemi text-center">
                {' '}
                Tell us about your Restaurant{' '}
              </h1>

              <p className=" text-slate-700 font-poppinsreg5 text-center  md:text-lg text-sm  max-w-sm">
                {' '}
                We just need to know a few more things{' '}
              </p>

              {/* cards  */}

              {/* bg-[#0F141E] */}

              <div className="  w-full mt-4 flex flex-col gap-4">
                <div className=" flex flex-col gap-1">
                  <h1 className=" font-poppinsreg5 text-sm">
                    {' '}
                    Your Restaurant Name{' '}
                  </h1>
                  <input
                    value={companyName}
                    onChange={(e) => setcompanyName(e.target.value)}
                    className=" w-full p-2 placeholder:text-sm bg-transparent border border-black/15 outline-none  font-poppinsreg rounded-md"
                    placeholder="Eg: Delight Cafe"
                  />
                </div>

                {/* location  */}
                <div className=" flex flex-col gap-1">
                  <h1 className=" font-poppinsreg5 text-sm"> Location </h1>
                  <GooglePlacesAutocomplete
                    apiKey="AIzaSyCB_jT6LWXfo47cjjJoZqjHJjZSONMHhW4"
                    onPlaceSelected={handleAddressSelect}
                    className=" w-full outline-none p-1 border"
                    options={{
                      types: ['establishment'], // Adjust this to control what types of places are returned
                      componentRestrictions: { country: 'lk' }, // Restrict to a specific country (LK for Sri Lanka)
                    }}
                  />

                  {/* <input className=' w-full p-2 placeholder:text-sm bg-transparent border border-black/15 outline-none  font-poppinsreg rounded-md' placeholder='NITC Kathmandu Kathmandu, Nepal' /> */}
                </div>
                {/* location  */}
                {/* location  */}

                {/* company size  */}
                {/* location  */}
                {/* <div className=' flex flex-col gap-1'> 

<h1 className=' font-poppinsreg5 text-sm'> Slogan </h1>
<input value={slogan} onChange={(e) => setslogan(e.target.value)} className=' w-full p-2 placeholder:text-sm bg-transparent border border-black/15 outline-none  font-poppinsreg rounded-md' placeholder='Where Modern Meets Comfort' />

</div> */}
                {/* location  */}
                {/* company size  */}

                {/* Industry  */}

                {/* Industry  */}

                {/* Founded in  */}

                {/* Founded in  */}

                {/*Description  */}

                {/* <div className=' hidden'> </div> */}

                {/*Description  */}
              </div>

              {/* cards  */}

              {/* open close  */}

              <h1 className="  w-full mt-5 font-poppinsreg5">
                {' '}
                Opening Hours{' '}
              </h1>
              <div className=" h-[300px] border p-1 pb-3 overflow-y-auto w-full">
                {[
                  'Sunday',
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ].map((day, index) => (
                  <div className=" mt-3" key={index}>
                    <h4 className=" font-poppinsreg"> {day}</h4>
                    <div className=" flex gap-3">
                      <DatePicker
                        selected={openingHours[index].open}
                        onChange={(time) =>
                          handleTimeChange(index, 'open', time)
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Open"
                        dateFormat="h:mm aa"
                        placeholderText="Open Time"
                        className=" border placeholder:text-sm font-poppinsreg"
                      />
                      <DatePicker
                        selected={openingHours[index].close}
                        onChange={(time) =>
                          handleTimeChange(index, 'close', time)
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Close"
                        dateFormat="h:mm aa"
                        placeholderText="Close Time"
                        className=" border placeholder:text-sm font-poppinsreg"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* open close  */}

              {errorMessage && (
                <h1 className=" text-red-400 font-poppinsreg">
                  {' '}
                  {errorMessage}{' '}
                </h1>
              )}

              <h1 className=" text-slate-400  md:text-base text-sm font-poppinsreg mt-5">
                {' '}
                If your restaurant is closed on some days you can leave that day
                empty{' '}
              </h1>

              <Button
                onPress={() => {
                  // setdata("jmg has changed the data")

                  // router.push(`/merchant/onboarding?stat=on&tepo=tue`);
                  handleSubmit();
                  // console.log(companyName,companySize,industry,foundedIn,Companydescription,latitude,longitude);
                  // console.log(restaurantAddress);
                  // console.log(District);
                  // console.log(city);
                }}
                className=" w-full  py-6 bg-[#FF385C] text-white mt-4   font-poppinsreg6"
              >
                {' '}
                Continue{' '}
              </Button>
            </div>
          )}

          {/* THE BELOW IS SUBSCRIPTION CODE  */}
          {subscription && (
            //  max-w-2xl
            <div className="  flex  flex-col gap-2 pb-9 md:w-fit w-full max-w-4xl items-center">
              <h1 className=" text-3xl mt-16 md:text-5xl font-poppinssemi text-center">
                {' '}
                Pricing Plans{' '}
              </h1>

              <p className=" text-slate-700 font-poppinsreg5 text-center mt-2  md:text-lg text-sm max-w-xl  ">
                {' '}
                Continue for free,then add a site plan when you grow,Account
                plans unlock additional features{' '}
              </p>
              {/* max-w-sm above  */}

              {/* cards  */}

              {/* bg-[#0F141E] */}

              <div className="  w-full mt-4 flex flex-col gap-4">
                {/* Advanced features to scale your business
      Premium features that takes your business to the next level */}

                <div className=" grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div
                    onClick={() => setselectedSubscription('starter')}
                    className={`  ${
                      selectedSubscription === 'starter'
                        ? 'bg-[#18171C]'
                        : 'bg-white  border border-[#18171C]'
                    } h-fit   cursor-pointer p-3 rounded-lg flex flex-col gap-3`}
                  >
                    <h1
                      className={` ${
                        selectedSubscription === 'starter'
                          ? 'text-white'
                          : 'text-black'
                      }  text-3xl   font-poppinsreg5`}
                    >
                      Starter{' '}
                    </h1>

                    <h1
                      className={`  ${
                        selectedSubscription === 'starter'
                          ? 'text-slate-300'
                          : 'text-slate-900'
                      }      font-poppinsreg`}
                    >
                      All the basics for starting a new business{' '}
                    </h1>

                    <div
                      className={` flex  flex-col gap-3 ${
                        selectedSubscription === 'starter'
                          ? 'text-white'
                          : 'text-black'
                      }   font-poppinsreg5 `}
                    >
                      <h1>⭐ Up to 40 reservations per month </h1>
                      <h1>⭐ Access to basic analytics </h1>
                      <h1>⭐ Basic Table Management </h1>
                      <h1>
                        ⭐ Community support or email support with a longer
                        response time{' '}
                      </h1>
                    </div>

                    <h1
                      className={` ${
                        selectedSubscription === 'starter'
                          ? 'text-green-400'
                          : ' text-green-700'
                      }  font-poppinsreg5 text-4xl`}
                    >
                      {' '}
                      {/* FREE{' '} */}
                      STARTER
                    </h1>

                    {/* <Button className='  font-poppinsreg5 mt-2 bg-white w-full'>
        Subscribe
      </Button> */}
                  </div>

                  <div
                    onClick={() => setselectedSubscription('pro')}
                    className={`  ${
                      selectedSubscription === 'pro'
                        ? 'bg-[#18171C]'
                        : 'bg-white border-[#18171C] border'
                    } h-fit   cursor-pointer p-3 rounded-lg flex flex-col gap-3`}
                  >
                    <h1
                      className={` ${
                        selectedSubscription === 'pro'
                          ? 'text-white'
                          : 'text-black'
                      }  text-3xl   font-poppinsreg5`}
                    >
                      Pro{' '}
                    </h1>

                    <h1
                      className={`  ${
                        selectedSubscription === 'pro'
                          ? 'text-slate-300'
                          : 'text-slate-900'
                      }      font-poppinsreg`}
                    >
                      Advanced features to scale your business{' '}
                    </h1>

                    <div
                      className={` flex  flex-col gap-3 ${
                        selectedSubscription === 'pro'
                          ? 'text-white'
                          : 'text-black'
                      }   font-poppinsreg5 `}
                    >
                      <h1>⭐ Unlimited Reservations </h1>
                      <h1>⭐ Advanced Analytics </h1>
                      <h1>⭐ Enhanced Table Management </h1>
                      <h1>⭐ Marketing Tools</h1>
                      <h1>⭐ Priority email Support</h1>
                      <h1>
                        ⭐ Ability to run limited promotions or discounts{' '}
                      </h1>
                    </div>

                    <h1
                      className={`  ${
                        selectedSubscription === 'pro'
                          ? 'text-white'
                          : 'text-black'
                      } font-poppinsreg5 text-4xl`}
                    >
                      {' '}
                      LKR 6000
                      <span
                        className={` ${
                          selectedSubscription === 'pro'
                            ? 'text-white'
                            : 'text-black'
                        }  text-sm`}
                      >
                        /month
                      </span>
                    </h1>

                    {/* <Button className='  font-poppinsreg5 mt-2 bg-white w-full'>
Subscribe
</Button> */}
                  </div>

                  <div
                    onClick={() => setselectedSubscription('premium')}
                    className={`  ${
                      selectedSubscription === 'premium'
                        ? 'bg-[#18171C]'
                        : 'bg-white border-[#18171C] border'
                    } h-fit   cursor-pointer p-3 rounded-lg flex flex-col gap-3`}
                  >
                    <h1
                      className={` ${
                        selectedSubscription === 'premium'
                          ? 'text-white'
                          : 'text-black'
                      }  text-3xl   font-poppinsreg5`}
                    >
                      Premium{' '}
                    </h1>

                    <h1
                      className={`  ${
                        selectedSubscription === 'premium'
                          ? 'text-slate-300'
                          : 'text-slate-900'
                      }       font-poppinsreg`}
                    >
                      Premium features that takes your business to the next
                      level{' '}
                    </h1>

                    <div
                      className={` flex  flex-col gap-3 ${
                        selectedSubscription === 'premium'
                          ? 'text-white'
                          : 'text-black'
                      }   font-poppinsreg5 `}
                    >
                      <h1>⭐ Unlimited Reservations </h1>
                      <h1>⭐ Comprehensive Analytics </h1>
                      <h1>⭐ Full Table Management </h1>
                      <h1>⭐ Free POS Access </h1>
                      <h1>⭐ Full Marketing Suite</h1>
                      <h1>⭐ Dedicated account manager or 24/7 support </h1>
                      <h1>⭐ Premium Listing </h1>
                      <h1>⭐ Custom Branding </h1>
                    </div>

                    <h1
                      className={`  ${
                        selectedSubscription === 'premium'
                          ? 'text-white'
                          : 'text-black'
                      } font-poppinsreg5 text-4xl`}
                    >
                      {' '}
                      LKR 9000
                      <span
                        className={` ${
                          selectedSubscription === 'premium'
                            ? 'text-white'
                            : 'text-black'
                        }  text-sm`}
                      >
                        /month
                      </span>
                    </h1>

                    {/* <Button className='  font-poppinsreg5 mt-2 bg-white w-full'>
Subscribe
</Button> */}
                  </div>
                </div>
              </div>

              {/* cards  */}

              {/* open close  */}

              {errorMessage && (
                <h1 className=" text-red-400 font-poppinsreg">
                  {' '}
                  {errorMessage}{' '}
                </h1>
              )}

              <Button
                onPress={() => {
                  // setdata("jmg has changed the data")

                  // router.push(`/merchant/onboarding?stat=on&tepo=tue`);
                  // handleSubmit()
                  handleSubscriptionSubmit();
                  // console.log(companyName,companySize,industry,foundedIn,Companydescription,latitude,longitude);
                  // console.log(restaurantAddress);
                  // console.log(District);
                  // console.log(city);
                }}
                className="  max-w-sm w-full  py-6 bg-[#FF385C] text-white mt-6   font-poppinsreg6"
              >
                {' '}
                Continue{' '}
              </Button>
            </div>
          )}
          {/* THE BELOW IS SUBSCRIPTION CODE  */}

          {/* vaaa ingag  */}

          {/* images upload  */}

          {showImageSection && !subscription && (
            <div className="  flex flex-col gap-2  md:mt-0 mt-5 max-w-2xl items-center">
              <h1 className=" text-xl md:text-3xl font-poppinssemi text-center">
                {' '}
                {`Enhance Your Restaurant's Presence`}{' '}
              </h1>

              {/* <p className=' text-slate-700 font-poppinsreg5 text-center  md:text-lg text-sm  max-w-sm'>  Make a lasting impression with captivating visuals </p> */}

              {/* Image cards code  */}

              <div className=" grid grid-cols-1 md:grid-cols-2 gap-7  md:gap-10  mt-7  md:mt-10   ">
                <div>
                  <h1 className=" md:text-lg   font-poppinssemi">
                    {' '}
                    Banner Image
                  </h1>
                  <p className=" text-xs font-rubik   text-slate-700 font-poppinsreg">
                    {' '}
                    {/* This provide a quick glimpse of your restaurant while
                    customers browse the application.{' '} */}
                    {`Provides a quick glimpse of your restaurant while customers browse the application.`}
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
                    <p className="text-red-500 mt-3 text-sm"> {imgupload} </p>
                  )}
                </div>

                <div>
                  <h1 className=" md:text-lg    font-poppinssemi">
                    {' '}
                    Cover Image
                  </h1>

                  <p className=" text-xs  font-poppinsreg   w-full text-slate-700">
                    {' '}
                    {/* Your cover image sets the tone for user when they enter your
                    restaurant profile. */}
                    {`Sets the tone for users when they enter your restaurant profile.`}
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
                    <p className="text-red-500 mt-3 text-sm"> {imgupload2} </p>
                  )}
                </div>
              </div>
              {/* Image cards code  */}

              <Button
                isLoading={finalBTNload}
                // isDisabled={finalBTNload}
                isDisabled={!bannerImage || !coverImage}
                // isDisabled={!selectedFile && !selectedFile2 || imageuploadingloadingbtn}

                onPress={async () => {
                  handleMerchantOnboarding();
                }}
                className=" max-w-md w-full  py-6 bg-[#FF385C] text-white mt-6   font-poppinsreg6"
              >
                {' '}
                Continue{' '}
              </Button>

              {/* <Button  className=' max-w-md w-full  py-6 bg-transparent text-black mt-2 border border-black   font-poppinsreg6'> Skip For Now </Button> */}

              <h1 className=" text-slate-400 w-full text-xs md:pb-0 pb-5 md:text-sm text-center mt-3">
                {' '}
                {/* {`Your restaurant's images are crucial. Set it up promptly. It's the initial impression users encounter and also helps in the restuarnt review process by the admin, so ensure it reflects your brand effectively`}{' '} */}
                {`Your restaurant's images are crucial. Please set them up promptly, as they create the first impression for users and are also reviewed by the admin during the restaurant approval process. Make sure the images effectively reflect your brand.`}
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* success for review  */}

      <Modal
        classNames={{
          backdrop: ' bg-black bg-opacity-80',
        }}
        className=" md:h-auto h-screen py-3   overflow-y-auto"
        size="md"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <Image
                  alt="reservation"
                  width={2000}
                  height={2000}
                  src={merchant}
                />

                <div className=" flex flex-col gap-2">
                  <h1 className=" font-poppinsreg5 text-xl text-center">
                    {' '}
                    Good Job, {companyName}!{' '}
                  </h1>

                  <h1 className=" text-green-700 text-lg text-center  font-poppinsreg5">
                    {' '}
                    Congratulations on Registering Your Restaurant with
                    SpotMyTable!{' '}
                  </h1>

                  <h1 className=" font-poppinsreg5 text-xs text-center text-slate-700">
                    {' '}
                    {`Your profile is under review by us. You will receive an email notification once the review is complete. Meanwhile, you can log in periodically to check your approval status`}{' '}
                  </h1>
                </div>

                <Button
                  onPress={() => router.push('/login')}
                  className="bg-[#FF385C] mt-2 text-white font-poppinsreg5 "
                >
                  {' '}
                  GO TO LOGIN{' '}
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* success for review  */}
    </>
  );
};

export default Page;
