"use client";
import { createContext, useContext } from "react";

export const DataContext = createContext(null);

export const useToast = () => useContext(DataContext);
