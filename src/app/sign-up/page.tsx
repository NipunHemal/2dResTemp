'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
// import { useSession } from "next-auth/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useTemp } from '@/context/tempContext';
// import { signup, verifyuser } from "./action";

import heroImage from '../../../public/nice.webp';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const pop400 = Poppins({
  subsets: ['latin'],
  weight: '400',
});

const pop700 = Poppins({
  subsets: ['latin'],
  weight: '700',
});

const pop500 = Poppins({
  subsets: ['latin'],
  weight: '500',
});

export default function Signup() {
  const router = useRouter();

  // const { data: session, status } = useSession();

  // if (status === "authenticated") {
  //   router.replace("/dashboard");
  // }

  interface SignupInput {
    email: string;
    name: string;
    password: string;
    phone: string;
    role: string;
  }

  // signed up user email take
  const [reg_email, setreg_email] = useState('');
  // signed up user email take  ends

  // signup func

  // const [otp, setOTP] = useState<string[]>(["", "", "", "", "", ""]);
  // const inputRefs = useRef<HTMLInputElement[]>([]);

  // const handleInputChange = (index: number, value: string) => {
  //   const newOTP = [...otp];
  //   newOTP[index] = value;

  //   setOTP(newOTP);
  //   console.log(otp);
  // };

  // const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key.length === 1) {
  //     e.preventDefault();
  //     const newValue = e.key;
  //     handleInputChange(index, newValue);

  //     if (index < inputRefs.current.length - 1) {
  //       inputRefs.current[index + 1]!.focus(); // Use non-null assertion (!)
  //     }
  //   } else if (e.key === "Backspace") {
  //     if (otp[index] && index >= 0) {
  //       // Delete the character and keep the cursor in the current input
  //       handleInputChange(index, "");
  //     } else if (index > 0) {
  //       // Move to the previous input if the current one is empty
  //       inputRefs.current[index - 1]!.focus(); // Use non-null assertion (!)
  //     }
  //   }
  // };

  const {
    isOpen: isOpenterms,
    onOpen: onOpenterms,
    onClose: onCloseterms,
    onOpenChange: OnOpenChangeterms,
  } = useDisclosure();

  const [loading, setloading] = useState<boolean>(false);
  const [validate, setvalidate] = useState<boolean>(false);
  const [showtotp, setshowtotp] = useState(false);

  // fields and error check
  const [busNameerr, setbusNameerr] = useState('');
  const [busNoerr, setbusNoerr] = useState('');
  const [emailerr, setemailerr] = useState('');
  const [passerr, setpasserr] = useState('');
  const [ownerNameErr, setOwnerNameErr] = useState('');
  const [ownerIdErr, setOwnerIdErr] = useState('');
  const [phoneNumErr, setPhoneNumErr] = useState('');
  // fields and error check

  const [otperror, setotperror] = useState('');
  const [showSignup, setshowSignup] = useState(true);

  // fields and values of it
  const [businessName, setbusinessName] = useState('');
  const [RegNum, setRegNum] = useState('');
  // new fields
  const [ownerName, setownerName] = useState('');
  const [ownerId, setownerId] = useState('');
  const [phoneNum, setphoneNum] = useState('+94');
  // new fields
  const [verifyBTNload, setverifyBTNload] = useState(false);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [errorMessageSignUp, seterrorMessageSignUp] = useState('');
  // fields and values of it

  const [isValid, setIsValid] = useState(true);

  // phone number adding functionality
  // const handlePhoneNumberChange = (e: any) => {
  //   const input = e.target.value;

  //   // Ensure the input starts with +94
  //   if (!input.startsWith('+94')) {
  //     return;
  //   }

  //   // Remove any non-numeric characters except + and limit to 9 digits after +94
  //   const cleanedInput = input.replace(/[^0-9+]/g, '').slice(0, 12);

  //   // Set the cleaned input value
  //   setphoneNum(cleanedInput);
  // };
  // const handlePhoneNumberChange = (e: any) => {
  //   let input = e.target.value;

  //   // Ensure the input starts with +94
  //   if (!input.startsWith('+94')) {
  //     setphoneNum(input); // still allow typing +94
  //     return;
  //   }

  //   // Remove any non-numeric characters except + and limit to 9 digits after +94
  //   const cleanedInput = input.replace(/[^0-9+]/g, '').slice(0, 12);

  //   // Set the cleaned input value
  //   setphoneNum(cleanedInput);

  //   // Clear error if input is valid
  //   const phoneRegex = /^\+94\d{0,9}$/; // allow typing up to 9 digits after +94
  //   if (phoneRegex.test(cleanedInput)) {
  //     setPhoneNumErr('');
  //   }
  // };

  const handlePhoneNumberChange = (e: any) => {
    let input = e.target.value;

    // Always ensure the string starts with '+94'
    if (!input.startsWith('+94')) {
      input = '+94' + input.replace(/^\+?94?/, ''); // remove any extra +94 typed
    }

    // Remove any non-numeric characters except + and limit to 9 digits after +94
    const cleanedInput =
      '+94' +
      input
        .slice(3)
        .replace(/[^0-9]/g, '')
        .slice(0, 9);

    setphoneNum(cleanedInput);

    // Clear error if input is valid so far
    const phoneRegex = /^\+94\d{0,9}$/; // allow typing up to 9 digits after +94
    if (phoneRegex.test(cleanedInput)) {
      setPhoneNumErr('');
    }
  };

  // phone number adding functionality - ends

  const handleEmailChange = (e: any) => {
    const emailValue = e.target.value;
    setemail(emailValue);

    // Basic email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(emailValue)) {
      setIsValid(true); // Email is valid
    } else {
      setIsValid(false); // Email is invalid
    }
  };

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { setMerchantEmail } = useTemp();

  const handleSignup = async () => {
    seterrorMessageSignUp('');
    try {
      const response = await fetch(`${backend_url}/api/auth/merchant-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          bus_id: RegNum,
          ownerName,
          ownerId,
          phoneNum,
        }),
      });
      const data = await response.json();
      console.log(data);

      if (data.status === 'success') {
        //  setsignupresult('Signup successful!');
        //   setshowonboarding(true)
        console.log('merchant created succefully with new business id');
        setMerchantEmail(email);
        router.push('/onboarding');
      } else {
        //  setsignupresult(data.message);
        console.log(data?.message);
        seterrorMessageSignUp(data?.message);
      }
    } catch (error) {
      //  setsignupresult('Error occurred during signup');
      console.log('error occured during signup');
      seterrorMessageSignUp('error occured during signup. Try again!');
    }
  };

  const checkBusinessRegValid = async () => {
    setbusNameerr('');
    setbusNoerr('');
    setemailerr('');
    setpasserr('');
    setOwnerNameErr('');
    setOwnerIdErr('');
    setPhoneNumErr('');

    setverifyBTNload(true);

    if (!businessName) {
      setbusNameerr('Enter Business Name');
      setverifyBTNload(false);
      return;
    }

    if (!RegNum) {
      setbusNoerr('Enter Registration Number');
      setverifyBTNload(false);
      return;
    }

    // new fields
    if (!ownerName) {
      setOwnerNameErr('Enter Owner Name');
      setverifyBTNload(false);
      return;
    }

    if (!ownerId) {
      setOwnerIdErr('Enter Owner Id');
      setverifyBTNload(false);
      return;
    }

    const val = ownerId.trim().toUpperCase();
    if (val.length === 10) {
      if (!/^[0-9]{9}V$/.test(val)) {
        setOwnerIdErr('Invalid NIC. Use 9 digits + V or 12 digits.');
        setverifyBTNload(false);
        return false;
      }
    } else if (val.length === 12) {
      if (!/^[0-9]{12}$/.test(val)) {
        setOwnerIdErr('Invalid NIC. Use 9 digits + V or 12 digits.');
        setverifyBTNload(false);
        return false;
      }
    } else {
      setOwnerIdErr('Invalid NIC. Use 9 digits + V or 12 digits.');
      setverifyBTNload(false);
      return false;
    }

    if (!phoneNum) {
      setPhoneNumErr('Enter Phone Number');
      setverifyBTNload(false);
      return;
    }

    const phoneRegex = /^\+94\d{9}$/; // +94 followed by exactly 9 digits
    if (!phoneRegex.test(phoneNum)) {
      setPhoneNumErr(
        'Invalid Phone Number. Must start with +94 and have 9 digits.',
      );
      setverifyBTNload(false);
      return false;
    }

    const repeatedDigits = phoneNum.slice(3); // remove +94
    if (/^(\d)\1{8}$/.test(repeatedDigits)) {
      setPhoneNumErr('Invalid Phone Number. Cannot have all digits the same.');
      setverifyBTNload(false);
      return false;
    }

    // new fields

    if (!email) {
      setemailerr('Enter email');
      setverifyBTNload(false);
      return;
    }

    if (!isValid) {
      setemailerr('Please enter a valid email address');
      setverifyBTNload(false);
      return;
    }

    if (!password) {
      setpasserr('Enter a password');

      setverifyBTNload(false);
      return;
    }

    if (password.length < 6) {
      setpasserr('Password should be minimum 6 characters long');
      setverifyBTNload(false);
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '7379f89424msh1724977b0fd90f2p1ca3c0jsn6753f6a28c50',
        'x-rapidapi-host': 'sri-lanka-company-data.p.rapidapi.com',
      },
      body: JSON.stringify({
        criteria: 2,
        searchtext: businessName,
        token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBiZjNjZWNjNjQ4MWY3ZWYwZWFlNGZmYzJhMjZjMDMwMWFhYTJjY2U2NWVlMmRiZjdkMjg1NjBjYjZlMTM1ODIyYTQ5MGZiMTdjNDhkYmZiIn0',
      }),
    };

    try {
      seterrorMessageSignUp('');
      // const response = await fetch('https://sri-lanka-company-data.p.rapidapi.com/api/v1/eroc/name/search', options);
      // const result = await response.json();

      // console.log(result);

      if (true) {
        // const found = result.availableData.data.some((company:any) => company.registration_no === RegNum);
        if (true) {
          // setResultMessage(`${businessName}: Your business is available`);
          // setBusinessVefied(true)
          console.log('your business is available');
          await handleSignup();
          setverifyBTNload(false);
        } else {
          // setResultMessage(`${businessName}: Your business is not available`);
          // setBusinessVefied(false)
          console.log('your business is NOT available');
          setverifyBTNload(false);
          seterrorMessageSignUp(
            'Business name or registration number not found',
          );
        }
      } else {
        // setResultMessage(`${businessName}: Your business is not available`);
        // setBusinessVefied(false)
        console.log('your business is NOT available');
        seterrorMessageSignUp('Business name or registration number not found');
        setverifyBTNload(false);
      }
    } catch (error) {
      console.error('Error:', error);
      // setResultMessage('Error occurred while verifying the business');
      setverifyBTNload(false);
    }
  };

  // show and hide password
  const [showpass, setshowpass] = useState(false);
  // show and hide password

  return (
    <>
      <div className=" flex lg:bg-white     lg:min-h-screen bg-white  lg:justify-between">
        <div className=" bg-[#212229] hidden lg:flex flex-col gap-6  lg:items-start 2xl:items-center  justify-center    w-8/12">
          <Image
            className="  mt-8 w-full"
            alt="hero"
            width={1000}
            height={1000}
            // src={"/nice.webp"}
            src={heroImage}
          />
          <div className=" flex flex-col  2xl:gap-5 gap-3">
            <h1
              className={` font-poppinssemi   text-gray-200 2xl:text-8xl  text-5xl 2xl:mx-10  md:mx-6 `}
            >
              {' '}
              Welcome To Spot My Table Merchant{' '}
            </h1>{' '}
            <h1
              className={`   font-poppinssemi    text-[#f37a6a] 2xl:text-7xl  text-4xl 2xl:mx-10   md:mx-6 `}
            >
              Supercharge your sales with us!
            </h1>
            {/* <p className=" text-sm  md:ml-6 mt-3 text-gray-200">
            {" "}
            Elevate your business with Raflakeskus: Manage orders, resolve
            issues, and track your success{" "}
          </p>{" "} */}
          </div>
        </div>
        <div className=" lg:w-6/12 2xl:w-4/12 w-full min-h-screen overflow-y-auto flex justify-center lg:justify-normal ">
          <main className="flex  lg:px-0 px-4  lg:w-full  w-full    bg-white  overflow-hidden   lg:m-5    flex-col gap-4  lg:items-start justify-center   ">
            {/* <Image
              src={"/Rafla_Logo.png"}
              alt="sda"
              width={500}
              height={500}
              className="  mt-4 md:mt-12 lg:mt-4  w-[200px]"
            /> */}
            {/* ${pop700.className} */}
            <h1
              className={`  font-poppinsreg5    w-full   text-center     mt-1 text-3xl `}
            >
              Sign up to SpotMyTable Merchant
            </h1>

            <form className=" flex mt-3 w-full  lg:items-start items-center flex-col gap-6">
              {!showSignup && (
                <div className=" flex-col w-full items-center   gap-6 flex">
                  <div className=" flex  w-full lg:w-full md:max-w-lg      flex-col gap-2">
                    <h1 className={`    font-poppinsreg5 text-sm `}>
                      {' '}
                      Business Name
                    </h1>
                    <input
                      value={businessName}
                      onChange={(e) => setbusinessName(e.target.value)}
                      placeholder="Eg : PPC Holdings"
                      className=" py-[10px] lg:py-[10px text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                      type="text  "
                    />
                    {/* {busNameerr && (
              <p className="text-red-500 font-rubik text-sm">
                {busNameerr}
              </p>
            )} */}
                  </div>

                  <div className=" flex  w-full lg:w-full md:max-w-lg       flex-col gap-2">
                    <h1 className={`    font-poppinsreg5 text-sm `}>
                      {' '}
                      Registration Number
                    </h1>
                    <input
                      value={RegNum}
                      onChange={(e) => setRegNum(e.target.value)}
                      placeholder="Sri Lankan Business Reg No"
                      className=" py-[10px] lg:py-[10px text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                      type="email"
                    />
                    {/* {busNoerr && (
              <p className="text-red-500 font-rubik text-sm">
                {busNoerr}
              </p>
            )} */}
                  </div>

                  <div className="   w-full lg:w-full md:max-w-lg     flex lg:justify-normal justify-center">
                    <div className=" w-full flex lg:justify-normal justify-center">
                      <Button
                        isDisabled={verifyBTNload}
                        isLoading={verifyBTNload}
                        onPress={checkBusinessRegValid}
                        className=" bg-[#FF385C] w-full font-poppinsreg text-white"
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-col  w-full  items-center gap-6 flex">
                <div className=" flex w-full lg:w-full md:max-w-lg        flex-col gap-2">
                  <h1 className={`    font-poppinsreg5 text-sm `}>
                    {' '}
                    Business Name
                  </h1>
                  <input
                    value={businessName}
                    onChange={(e) => setbusinessName(e.target.value)}
                    placeholder="Business Name"
                    className=" py-[10px] lg:py-[10px text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                    type="text  "
                  />
                  {busNameerr && (
                    <p className="text-red-500 font-rubik text-sm">
                      {busNameerr}
                    </p>
                  )}
                </div>

                <div className=" flex w-full lg:w-full md:max-w-lg        flex-col gap-2">
                  <h1 className={`    font-poppinsreg5 text-sm `}>
                    {' '}
                    Business Registration Number
                  </h1>
                  <input
                    value={RegNum}
                    onChange={(e) => setRegNum(e.target.value)}
                    placeholder="Reg:No"
                    className=" py-[10px] lg:py-[10px text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                    type="text"
                  />
                  {busNoerr && (
                    <p className="text-red-500 font-rubik text-sm">
                      {busNoerr}
                    </p>
                  )}
                </div>

                {/* extra fields added in the task list  -  3rd sep 2025 */}
                <div className=" flex w-full lg:w-full md:max-w-lg        flex-col gap-2">
                  <h1 className={`    font-poppinsreg5 text-sm `}>
                    {' '}
                    Owner Name
                  </h1>
                  <input
                    value={ownerName}
                    // onChange={(e) => setownerName(e.target.value)}
                    onChange={(e) => {
                      const regex = /^[A-Za-z\s]*$/;
                      if (regex.test(e.target.value)) {
                        setownerName(e.target.value);
                      }
                    }}
                    placeholder="Owner's Name"
                    className=" py-[10px] lg:py-[10px text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                    type="text"
                  />
                  {ownerNameErr && (
                    <p className="text-red-500 font-rubik text-sm">
                      {ownerNameErr}
                    </p>
                  )}
                </div>

                <div className=" flex w-full lg:w-full md:max-w-lg        flex-col gap-2">
                  <h1 className={`    font-poppinsreg5 text-sm `}>
                    {`Owner's ID`}
                  </h1>
                  <input
                    value={ownerId}
                    // onChange={(e) => setownerId(e.target.value)}
                    // onChange={(e) => {
                    //   let val = e.target.value.toUpperCase().trim(); // uppercase and trim spaces

                    //   // Restrict max length 12
                    //   if (val.length > 12) return;

                    //   // Allow only numbers and optionally 'V' for old NIC
                    //   if (/^[0-9]*[Vv]?$/.test(val)) {
                    //     setownerId(val);
                    //   }
                    // }}
                    onChange={(e) => {
                      let val = e.target.value.toUpperCase().trim(); // uppercase and trim spaces

                      // Restrict max length 12
                      if (val.length > 12) return;

                      // Allow only numbers and optionally 'V' for old NIC
                      if (/^[0-9]*[Vv]?$/.test(val)) {
                        setownerId(val);

                        // Clear error if current input could be valid
                        const partialRegex = /^([0-9]{0,9}V?)|([0-9]{0,12})$/;
                        if (partialRegex.test(val)) {
                          setOwnerIdErr('');
                        }
                      }
                    }}
                    placeholder={`Owner's ID`}
                    className=" py-[10px] lg:py-[10px text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                    type="text"
                  />
                  {ownerIdErr && (
                    <p className="text-red-500 font-rubik text-sm">
                      {ownerIdErr}
                    </p>
                  )}
                </div>

                <div className=" flex w-full lg:w-full md:max-w-lg        flex-col gap-2">
                  <h1 className={`    font-poppinsreg5 text-sm `}>
                    {' '}
                    Phone Number
                  </h1>
                  <input
                    value={phoneNum}
                    // onChange={(e) => setphoneNum(e.target.value)}
                    onChange={handlePhoneNumberChange}
                    placeholder="Phone Number"
                    className=" py-[10px] lg:py-[10px text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                    type="text"
                  />
                  {phoneNumErr && (
                    <p className="text-red-500 font-rubik text-sm">
                      {phoneNumErr}
                    </p>
                  )}
                </div>
                {/* extra fields added in the task list - 3rd sep 2025  */}

                <div className=" flex w-full lg:w-full md:max-w-lg        flex-col gap-2">
                  <h1 className={`    font-poppinsreg5 text-sm `}> Email</h1>
                  <input
                    value={email}
                    // onChange={(e) => setemail(e.target.value)}
                    onChange={handleEmailChange}
                    placeholder="example@company.com"
                    className=" py-[10px] lg:py-[10px text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                    type="email"
                  />
                  {emailerr && (
                    <p className="text-red-500 font-rubik text-sm">
                      {emailerr}
                    </p>
                  )}
                </div>

                <div className=" flex flex-col w-full  lg:w-full md:max-w-lg       gap-2">
                  <h1 className={`   font-poppinsreg5 text-sm `}> Password </h1>
                  <div className="relative ">
                    <div className="py-[10px] lg:py-[10px] rounded-lg border border-gray-300 w-full flex focus-within:border-[#f79e92] focus-within:border-2">
                      <input
                        type={showpass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        placeholder="Enter your password"
                        className="flex-1 text-sm pr-2 outline-none pl-3"
                        // type="password"
                        // type={showpass ? "text" : "password"}
                      />
                      {/* <h1
                        onClick={() => setshowpass(!showpass)}
                        className="px-2 cursor-pointer text-sm absolute inset-y-0 right-0 flex items-center"
                      >
                        {showpass ? 'Hide' : 'Show'}
                      </h1> */}

                      {showpass ? (
                        <div
                          className=" px-2 cursor-pointer select-none"
                          onClick={() => setshowpass(false)}
                        >
                          <EyeOffIcon className="w-5 h-5 text-default-400" />
                        </div>
                      ) : (
                        <div
                          className=" px-2 cursor-pointer select-none"
                          onClick={() => setshowpass(true)}
                        >
                          <EyeIcon className="w-5 h-5 text-default-400" />
                        </div>
                      )}
                    </div>
                    {passerr && (
                      <p className="text-red-500 font-rubik text-sm">
                        {passerr}
                      </p>
                    )}
                  </div>
                </div>

                {errorMessageSignUp && (
                  <h1 className=" font-poppinsreg  text-red-600">
                    {' '}
                    {errorMessageSignUp}{' '}
                  </h1>
                )}

                <h1 className="  mt-3  font-poppinsreg  text-slate-600  text-sm">
                  {' '}
                  {`By Signing up , you agree to SpotMyTable's Merchant`}
                  <span
                    onClick={() => onOpenterms()}
                    className=" hover:underline cursor-pointer text-[#db614f]"
                  >
                    {' '}
                    Security Terms.{' '}
                  </span>{' '}
                </h1>
                {/* ${    pop400.className  } */}
                <div className="   w-full lg:w-full md:max-w-lg     flex lg:justify-normal justify-center">
                  <div className=" w-full flex lg:justify-normal justify-center">
                    <Button
                      isDisabled={verifyBTNload}
                      isLoading={verifyBTNload}
                      onPress={checkBusinessRegValid}
                      className=" bg-[#FF385C] w-full font-poppinsreg text-white"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* #E79F4D */}

            <div className=" flex  w-full justify-center">
              <div className="  lg:w-full md:max-w-lg   w-full border-b mt-5">
                {' '}
              </div>
            </div>

            <h1 className="text-sm  text-center font-poppinsreg  w-full pb-7">
              {' '}
              Already on Spot My Table?{' '}
              <Link href={'/login'}>
                <span className="  cursor-pointer  font-poppinsreg hover:underline text-[#db614f] ">
                  {' '}
                  Login{' '}
                </span>{' '}
              </Link>
            </h1>
          </main>
        </div>
      </div>

      {/* security terms    */}
      <Modal
        size="2xl"
        closeButton={
          <div>
            <svg
              // onClick={() => setterms(false)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-8 transition-colors duration-100 ease-in p-1 bg-[#FF385C] hover:bg-[#E31C5D] rounded-full text-white h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        }
        isDismissable={false}
        isOpen={isOpenterms}
        onOpenChange={OnOpenChangeterms}
      >
        <ModalContent className="max-h-[80%]">
          {(onCloseterms) => (
            <>
              <ModalHeader className="flex flex-col font-poppinsreg5 text-xl gap-1">
                SpotMyTable — Merchant Security Terms
              </ModalHeader>
              <ModalBody className="pb-10 overflow-y-auto">
                {/* Introduction */}

                <p className="">
                  {`These Security Terms (“Terms”) govern your use of the merchant account provided by
      SpotMyTable. By logging in or using the platform, you acknowledge and agree to comply with
      these Terms to safeguard your account, your customers, and the SpotMyTable platform.
      `}
                </p>

                {/* account security starts  */}
                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    1. Account Security
                  </h1>
                  <ul className="list- flex flex-col gap-2 pl-5">
                    <li>
                      <span className="font-medium">{`Confidentiality:`}</span>{' '}
                      {`You are solely responsible for maintaining the confidentiality of your
      login credentials (including email, password, OTPs, and API keys).`}
                    </li>
                    <li>
                      <span className="font-medium">{`Authorized Use:`}</span>
                      Merchant accounts must only be accessed by authorized
                      restaurant personnel. Sharing login credentials is
                      strictly prohibited.
                    </li>

                    <li>
                      <span className="font-medium">{`Breach Notification:`}</span>{' '}
                      {`You must notify SpotMyTable immediately (and no later than 24
      hours) if you suspect unauthorized access or a security breach.`}
                    </li>

                    <li>
                      <span className="font-medium">{`Suspension/Termination:`}</span>{' '}
                      {`SpotMyTable may suspend or terminate accounts where a
      security breach or violation of these Terms is suspected.`}
                    </li>
                  </ul>
                </div>
                {/* account security ends  */}

                {/* password and authentication starts */}
                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    2. Passwords & Authentication
                  </h1>
                  <ul className="list- flex flex-col gap-2 pl-5">
                    <li>
                      <span className="font-medium">{`Password Standards:`}</span>{' '}
                      {`Passwords must be at least 08 characters long and include a mix of
      letters, numbers, and symbols.`}
                    </li>
                    <li>
                      <span className="font-medium">{`Two-Factor Authentication (2FA):`}</span>
                      {`Where available, merchants must enable and use 2FA for login.`}
                    </li>
                    <li>
                      <span className="font-medium">{`Password Changes:`}</span>{' '}
                      {`Passwords must be updated regularly and changed immediately if
      compromise is suspected.`}
                    </li>
                  </ul>
                </div>
                {/* password and authentication ends  */}

                {/* User Accounts */}
                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    3. Data Security
                  </h1>
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      <span className="font-medium">
                        Customer Data Protection:
                      </span>
                      {`All customer information (including personal details,
      reservation data, and payment information) must be treated as confidential.`}
                    </li>
                    <li>
                      <span className="font-medium">No Unauthorized Use:</span>
                      {`Customer data must not be shared, sold, or used for marketing
      outside SpotMyTable without explicit consent.`}
                    </li>
                    <li>
                      <span className="font-medium">Secure Handling:</span>{' '}
                      {`Devices and systems used to access SpotMyTable must be protected
      with updated antivirus software, firewalls, and secure networks.
      `}
                    </li>
                  </ul>
                </div>

                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    4. Platform Usage
                  </h1>
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      <span className="font-medium">Permitted Use:</span>{' '}
                      {`The platform must only be used for its intended purposes, including
      listing tables, managing reservations, and communicating with customers.`}
                    </li>
                    <li>
                      <span className="font-medium">Prohibited Actions:</span>{' '}
                      {`Merchants must not engage in activities such as hacking, reverse
      engineering, distributing malware, or automated scraping.`}
                    </li>
                    <li>
                      <span className="font-medium">Monitoring:</span>{' '}
                      {`SpotMyTable reserves the right to monitor merchant activity for compliance
      and security purposes.`}
                    </li>
                  </ul>
                </div>

                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    5. Payments & Financial Security
                  </h1>
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      <span className="font-medium">Authorized Gateways:</span>{' '}
                      {`All payments must be processed exclusively through
      SpotMyTable’s approved payment gateways.`}
                    </li>
                    <li>
                      <span className="font-medium">
                        Prohibition on Storage:
                      </span>{' '}
                      {`Merchants must not store, copy, or process customer payment
      information outside the platform.`}
                    </li>
                    <li>
                      <span className="font-medium">Fraud Reporting:</span>{' '}
                      {`Any suspicious or fraudulent activity must be reported to SpotMyTable without delay.`}
                    </li>
                  </ul>
                </div>

                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    6. Reporting & Incident Management
                  </h1>
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      <span className="font-medium">Incident Reporting:</span>{' '}
                      {`Merchants must report security incidents, breaches, or fraud attempts to 
      hello@spotmytable.com within 24 hours of discovery.`}
                    </li>
                    <li>
                      <span className="font-medium">Cooperation:</span>{' '}
                      {`Merchants must fully cooperate with SpotMyTable during any investigation 
      or resolution of security incidents.`}
                    </li>
                  </ul>
                </div>

                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    7. Compliance & Legal Obligations
                  </h1>
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      {`Merchants must comply with all applicable data protection and privacy laws, 
      including local regulations.`}
                    </li>
                    <li>
                      {`Any breach of these Security Terms may result in account suspension, legal action, 
      or termination of the partnership.`}
                    </li>
                  </ul>
                </div>

                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    8. Limitation of Liability
                  </h1>
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      {`SpotMyTable is not responsible for losses due to weak password practices, 
      unauthorized sharing of credentials, or breaches caused by merchant negligence.`}
                    </li>
                    <li>
                      {`Merchants remain responsible for all activities performed under their accounts.`}
                    </li>
                  </ul>
                </div>

                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    9. Updates to Terms
                  </h1>
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      {`SpotMyTable may update these Terms periodically. Notice of updates will be provided 
      via the merchant portal or email.`}
                    </li>
                    <li>
                      {`Continued use of the platform after updates constitutes acceptance of the revised Terms.`}
                    </li>
                  </ul>
                </div>

                <div>
                  <h1 className="font-semibold text-lg mt-4">
                    10. Contact Information
                  </h1>
                  <p className="mt-2">
                    {`For security concerns, incident reporting, or inquiries:`}
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      <span className="font-medium">Email:</span>{' '}
                      hello@spotmytable.com
                    </li>
                    <li>
                      <span className="font-medium">Phone:</span> +94 707 774
                      861
                    </li>
                    <li>
                      <span className="font-medium">Address:</span> 94/3
                      Cemetery Road, Negombo, Sri Lanka
                    </li>
                  </ul>
                </div>

                {/* More sections like No-show Policy, Dispute Resolution, etc. can be added similarly. */}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* security terms    ends */}
    </>
  );
}
