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
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useTemp } from '@/context/tempContext';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
// import { signup, verifyuser } from "./action";
import { motion } from 'framer-motion';

import heroImage from '../../../public/nice.webp';
import merchant from '../../../public/merchant.png';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function Signup() {
  const router = useRouter();

  // const { data: session, status } = useSession();

  // if (status === "authenticated") {
  //   router.replace("/dashboard");
  //

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const {
    isOpen: isOpenterms,
    onOpen: onOpenterms,
    onClose: onCloseterms,
    onOpenChange: OnOpenChangeterms,
  } = useDisclosure();

  interface SignupInput {
    email: string;
    name: string;
    password: string;
    phone: string;
    role: string;
  }

  // signed up user email take
  const [reg_email, setreg_email] = useState('');

  const [showSignup, setshowSignup] = useState(true);

  // fields and values of it
  const [businessName, setbusinessName] = useState('');
  const [RegNum, setRegNum] = useState('');
  const [verifyBTNload, setverifyBTNload] = useState(false);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [errorMessageSignUp, seterrorMessageSignUp] = useState('');
  // fields and values of it

  const [showpass, setshowpass] = useState(false);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { setMerchantEmail } = useTemp();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: session, status } = useSession();

  const [emailError, setemailError] = useState('');

  const [passwordError, setpasswordError] = useState('');

  // forgot password
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const [step, setStep] = useState(1);
  const [emailForReset, setEmailForReset] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingForReset, setLoadingForReset] = useState(false);

  const resetAll = () => {
    setEmailForReset('');
    setCode('');
    setNewPassword('');
    setStep(1);
    setModalOpen(false);
    setLoadingForReset(false);
    setForgotModalOpen(false);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);
  // const toggleVisibility = () => setIsVisible((prev) => !prev);
  // const toggleVisibility = () => setIsVisible((prev) => !prev);
  // const toggleVisibility = () => setIsVisible((prev) => !prev);
  const toggleVisibility2 = () => setIsVisible2((prev) => !prev);

  // const handleForgotPassword = () => console.log('');

  const [showPassResetSuccess, setShowPassResetSuccess] = useState(false);

  const handleForgotPassword = async () => {
    setShowPassResetSuccess(false);
    setLoadingForReset(true);
    try {
      if (step === 1) {
        const res = await fetch(
          `${backend_url}/api/auth/merchant-forgot-password`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailForReset }),
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to send reset code.');
        setStep(2);
      } else if (step === 2) {
        const res = await fetch(
          `${backend_url}/api/auth/merchant-verify-reset-code`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailForReset, code }),
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Invalid or expired code.');
        setStep(3);
      } else if (step === 3) {
        const res = await fetch(
          `${backend_url}/api/auth/merchant-reset-password`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailForReset, code, newPassword }),
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to reset password.');
        // alert('Password reset successful. You can now log in.');
        setShowPassResetSuccess(true);
        resetAll();
        setTimeout(() => {
          setShowPassResetSuccess(false);
        }, 3000);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingForReset(false); // ✅ important to ensure it's not stuck
    }
  };

  // forgot password  ends

  const handleSubmitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setemailError('');
    setpasswordError('');

    setLoading(true);
    setError('');
    setSuccess('');

    if (!email) {
      setemailError('Enter email');
      setLoading(false);
      return;
    }

    if (!password) {
      setpasswordError('Enter password');
      setLoading(false);
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      // setError("Invalid credentials");
      // console.log("invalid credentials");
      if (res.error === 'User does not exist!') {
        setError('User does not exist!');
      } else if (res.error === 'User is banned') {
        setError(
          'Your account has been temporarily suspended. Please contact our support team at support@spotmytable.com to resolve this issue.',
        );
      } else if (res.error === 'Incorrect email or password') {
        setError('Invalid credentials');
      } else {
        // General error handling if needed
        setError('An error occurred. Please try again.');
      }

      setLoading(false);
    } else {
      // setSuccess("Login successful!");
      //   setIsShowLoginModel(false)
      //  setloginSuccess(true)
      //   setTimeout(() => {
      //      setloginSuccess(false)
      //   }, 1500);
      // Redirect or handle successful login
      console.log('Login successful!');
      console.log(res);

      const session = await getSession();
      if (!session?.user.is_onb) {
        setMerchantEmail(email);
        console.log('onboarding not done');
        router.push('/onboarding');
        return;
      } else if (session.user.is_onb && !session.user.is_ver) {
        // console.log("onboarding done");
        onOpen();
        setLoading(false);
        // signOut()
        return;
      } else if (session.user.is_onb && session.user.is_ver) {
        sessionStorage.setItem('id', session.user.id);
        router.push('/dashboard');
      }
    }
  };

  return (
    <>
      <div className=" flex lg:bg-white  overflow-hidden   lg:h-screen bg-white  lg:justify-between">
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
            {/* <h1
              className={` font-poppinssemi   text-gray-200 2xl:text-8xl  text-5xl 2xl:mx-10  md:mx-6 `}
            >
              {" "}
              Welcome To Spot My Table Merchant{" "}
            </h1>{" "} */}
            {/* <h1
              className={`   font-poppinssemi    text-[#f37a6a] 2xl:text-7xl  text-4xl 2xl:mx-10   md:mx-6 `}
            >
              Supercharge your sales with us!
            </h1> */}

            <h1
              className={` font-poppinssemi   text-[#f37a6a] text-5xl  md:ml-6 `}
            >
              <span className=" text-gray-200   "> Welcome back! </span> Your
              customers are ready to be delighted
            </h1>
            {/* <p className=" text-sm  md:ml-6 mt-3 text-gray-200">
            {" "}
            Elevate your business with Raflakeskus: Manage orders, resolve
            issues, and track your success{" "}
          </p>{" "} */}
          </div>
        </div>
        <div className=" lg:w-6/12 2xl:w-4/12 w-full h-screen overflow-y-auto flex justify-center lg:justify-normal ">
          <main className="flex  lg:px-0 px-4  lg:w-full  w-full    bg-white  overflow-hidden   lg:m-5    flex-col gap-4  lg:items-start justify-center   ">
            <h1
              className={`  font-poppinsreg5    w-full   text-center     mt-1 text-3xl `}
            >
              Log In to SpotMyTable Merchant
            </h1>

            <div className=" flex mt-3 w-full  lg:items-start items-center flex-col gap-6">
              <form
                className="flex-col w-full items-center gap-6 flex"
                onSubmit={handleSubmitSignup}
                // noValidate
              >
                <div className="flex-col  w-full  items-center gap-6 flex">
                  <div className=" flex w-full lg:w-full md:max-w-lg        flex-col gap-2">
                    <h1 className={`    font-poppinsreg5 text-sm `}> Email</h1>
                    <input
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      placeholder="example@company.com"
                      className=" py-[10px] lg:py-[10px text-sm  rounded-lg outline-none focus:border-[#f79e92] focus:border-2  pl-3  border border-gray-300 "
                      type="email"
                    />
                    {emailError && (
                      <p className="text-red-500 font-rubik text-sm">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className=" flex flex-col w-full  lg:w-full md:max-w-lg       gap-2">
                    <h1 className={`   font-poppinsreg5 text-sm `}>
                      {' '}
                      Password{' '}
                    </h1>
                    <div className="relative ">
                      <div className="py-[10px] lg:py-[10px] rounded-lg border border-gray-300 w-full flex items-center focus-within:border-[#f79e92] focus-within:border-2">
                        <input
                          value={password}
                          onChange={(e) => setpassword(e.target.value)}
                          placeholder="Enter your password"
                          className="flex-1 text-sm pr-2 outline-none pl-3"
                          // type="password"
                          type={showpass ? 'text' : 'password'}
                        />
                        {/* <h1
                          onClick={() => setshowpass(!showpass)}
                          className="px-2 cursor-pointer text-sm  flex items-center"
                        >
                          Show
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
                      {passwordError && (
                        <p className="text-red-500 font-rubik  mt-[2px] text-sm">
                          {passwordError}
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

                  <h1
                    onClick={() => {
                      setForgotModalOpen(true);
                      console.log('hello');
                    }}
                    className="  lg:w-full md:max-w-lg text-left w-full  underline text-slate-600 cursor-pointer text-sm"
                  >
                    {' '}
                    Forgot Password?{' '}
                  </h1>

                  <h1 className="  mt-3  font-poppinsreg  text-slate-600  text-sm">
                    {' '}
                    {`By Logging in, you agree to SpotMyTable's Merchant`}
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
                        isDisabled={loading}
                        isLoading={loading}
                        // onPress={handleSubmitSignup}
                        type="submit"
                        className=" bg-[#FF385C] w-full font-poppinsreg text-white"
                      >
                        Log In
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {error && (
                <h1 className=" font-poppinsreg  w-full text-sm text-center text-red-400">
                  {' '}
                  {error}{' '}
                </h1>
              )}
            </div>

            {/* #E79F4D */}

            <div className=" flex  w-full justify-center">
              <div className="  lg:w-full md:max-w-lg   w-full border-b mt-5">
                {' '}
              </div>
            </div>

            <h1 className="text-sm  text-center font-poppinsreg  w-full pb-7">
              {' '}
              {`Don't have a merchant account?`}
              <Link href={'/sign-up'}>
                <span className="  cursor-pointer  font-poppinsreg hover:underline text-[#db614f] ">
                  {' '}
                  Sign Up
                </span>{' '}
              </Link>
            </h1>
          </main>
        </div>
      </div>

      <Modal
        isDismissable={false}
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
                    Hello, {session?.user.resName}{' '}
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

                {/* <Button onPress={ ()  => router.push('/sign-up') } className='bg-[#FF385C] mt-2 text-white font-poppinsreg5 '> GO TO LOGIN </Button> */}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* forgot password  */}
      {forgotModalOpen && (
        <div className="fixed top-0 left-0 p-2 w-full h-full bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-center">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Verify Reset Code'}
              {step === 3 && 'Set New Password'}
            </h2>

            <div className="flex flex-col gap-4">
              {step === 1 && (
                <>
                  <p className="text-sm text-gray-600">
                    Type your email address to receive a password reset code.
                  </p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={emailForReset}
                    onChange={(e) => setEmailForReset(e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:outline-none"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <p className="text-sm text-gray-600">
                    Enter the code sent to <strong>{emailForReset}</strong>.
                  </p>
                  <input
                    type="text"
                    placeholder="Enter reset code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:outline-none"
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <p className="text-sm text-gray-600">
                    Set your new password below.
                  </p>
                  {/* <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:outline-none"
                  /> */}
                  <Input
                    // type="password"
                    type={isVisible ? 'text' : 'password'}
                    placeholder="New password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    // className="border rounded px-3 py-2 w-full focus:outline-none"
                    value={newPassword}
                    endContent={
                      <button type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeOffIcon className="w-5 h-5 text-default-400" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-default-400" />
                        )}
                      </button>
                    }
                  />
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="light"
                onPress={resetAll}
                className="border text-gray-600"
              >
                Cancel
              </Button>

              <Button
                isLoading={loadingForReset}
                onPress={handleForgotPassword}
                className="bg-[#FF385C] text-white"
                isDisabled={
                  (step === 1 && !emailForReset.trim()) ||
                  (step === 2 && !code.trim()) ||
                  (step === 3 && !newPassword.trim())
                }
              >
                {step === 1 && 'Send Code'}
                {step === 2 && 'Verify Code'}
                {step === 3 && 'Reset Password'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* forgot password  ends */}

      {/* reset succesfull popup  */}
      {showPassResetSuccess && (
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
                  Password reset successful. You can now log in.
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
      {/* reset succesfull popup  ends */}

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
