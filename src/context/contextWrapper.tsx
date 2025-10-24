import React, { ReactNode } from "react";
import { TempProvider } from "./tempContext";

// import { TempProvider } from "./tempContext";


export const ContextWrapper = ({ children }: { children: ReactNode }) => {
  return (

      <TempProvider>
      
        {children}
      
      </TempProvider>
   
  );
};
