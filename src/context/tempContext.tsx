"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type TempContextType = {
  //   selectedCity: any;
  //   setselectedCity: Dispatch<SetStateAction<any>>;
  //   tempcity: any;
  //   settempcity: Dispatch<SetStateAction<any>>;
  isSignupSuccess: boolean;
  setisSignupSuccess: Dispatch<SetStateAction<boolean>>;
  showSignupModel: boolean;
  setShowSignupModel: Dispatch<SetStateAction<boolean>>;
  isLoginSucces: boolean;
  setIsLoginSuccess: Dispatch<SetStateAction<boolean>>;
  showLoginModel: boolean;
  setIsShowLoginModel: Dispatch<SetStateAction<boolean>>;
  loginSucsess: boolean;
  setloginSuccess: Dispatch<SetStateAction<boolean>>;
  signUpSuccess: boolean;
  setSignUpSuccess: Dispatch<SetStateAction<boolean>>;
  merchantEmail : string;
  setMerchantEmail : Dispatch<SetStateAction<string>>
};

const TempContext = createContext<TempContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export function TempProvider({ children }: UserProviderProps) {
  //   const [selectedCity, setselectedCity] = useState<string>(""); // Initialize with an empty string or an initial value
  //   const [tempcity, settempcity] = useState<string>(""); // Initialize with an empty string or an initial value
  const [isSignupSuccess, setisSignupSuccess] = useState<boolean>(false);
  const [showSignupModel, setShowSignupModel] = useState<boolean>(false);
  const [isLoginSucces, setIsLoginSuccess] = useState<boolean>(false);
  const [showLoginModel, setIsShowLoginModel] = useState<boolean>(false);
  const [loginSucsess, setloginSuccess] = useState<boolean>(false);
  const [ signUpSuccess,  setSignUpSuccess] = useState<boolean>(false);
  const [merchantEmail, setMerchantEmail] = useState<string>("")

  return (
    <TempContext.Provider
      value={{
        // selectedCity,
        // setselectedCity,
        // tempcity,
        // settempcity,
        isSignupSuccess,
        setisSignupSuccess,
        showSignupModel,
        setShowSignupModel,
        isLoginSucces,
        setIsLoginSuccess,
        showLoginModel,
        setIsShowLoginModel,
        loginSucsess,
        setloginSuccess,
        signUpSuccess,
        setSignUpSuccess,
        merchantEmail,
        setMerchantEmail
        
      }}
    >
      {children}
    </TempContext.Provider>
  );
}

export function useTemp() {
  const context = useContext(TempContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}