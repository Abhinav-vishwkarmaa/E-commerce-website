"use client"
import { createContext, useContext, useState, ReactNode } from "react";

interface PincodeContextType {
  pincode: string;
  setPincode: (pin: string) => void;
}

// Create context
const PincodeContext = createContext<PincodeContextType | undefined>(undefined);

// Provider component
export const PincodeProvider = ({ children }: { children: ReactNode }) => {
  const [pincode, setPincode] = useState(
    typeof window !== "undefined" ? localStorage.getItem("pincode") || "" : ""
  );

  return (
    <PincodeContext.Provider value={{ pincode, setPincode }}>
      {children}
    </PincodeContext.Provider>
  );
};

// Custom hook to use the context
export const usePincode = () => {
  const context = useContext(PincodeContext);
  if (!context) throw new Error("usePincode must be used within PincodeProvider");
  return context;
};
