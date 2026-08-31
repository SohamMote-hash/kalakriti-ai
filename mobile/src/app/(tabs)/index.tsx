import React from "react";
import { useAppStore } from "@/store/useAppStore";
import ArtisanHomeScreen from "@/screens/ArtisanHomeScreen";
import BuyerHomeScreen from "@/screens/BuyerHomeScreen";

export default function HomeTab() {
  const role = useAppStore((s) => s.role);
  return role === "buyer" ? <BuyerHomeScreen /> : <ArtisanHomeScreen />;
}
